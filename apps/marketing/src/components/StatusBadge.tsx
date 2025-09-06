"use client";

import { useEffect, useMemo, useState } from "react";

type StatusState = "operational" | "degraded" | "down" | "unknown";

// Best-effort fetcher for Uptime Kuma public status page JSON.
// Falls back gracefully if the endpoint or CORS is not available.
async function fetchUptimeStatus(baseUrl: string): Promise<StatusState> {
  const candidates = [
    "/api/status-page/heartbeat/default", // specific uptime-kuma status page slug
  ];

  for (const path of candidates) {
    try {
      const res = await fetch(baseUrl.replace(/\/$/, "") + path, {
        // Always fetch from the browser; avoid caching too aggressively
        cache: "no-store",
      });
      if (!res.ok) continue;
      const data: any = await res.json().catch(() => null);
      if (!data) continue;

      // Heuristics across possible Kuma payloads
      // 1) overallStatus or status fields
      const overall = (data.overallStatus || data.status || "")
        .toString()
        .toLowerCase();
      if (
        overall.includes("up") ||
        overall.includes("ok") ||
        overall.includes("oper")
      )
        return "operational";
      if (overall.includes("degrad") || overall.includes("partial"))
        return "degraded";
      if (
        overall.includes("down") ||
        overall.includes("outage") ||
        overall.includes("incident")
      )
        return "down";

      // 2) heartbeat style: if any monitor is down
      if (Array.isArray(data.monitors) && Array.isArray(data.heartbeatList)) {
        // If any lastHeartbeatStatus === 0 (down) => down
        const isAnyDown = Object.values<any>(data.heartbeatList).some(
          (arr: any[]) =>
            Array.isArray(arr) && arr.some((hb) => hb?.status === 0)
        );
        if (isAnyDown) return "down";
        return "operational";
      }

      // 3) Generic boolean hints
      if (typeof data.allUp === "boolean")
        return data.allUp ? "operational" : "down";

      // Unknown but successful response
      return "unknown";
    } catch {
      // Try next candidate
      continue;
    }
  }
  return "unknown";
}

export function StatusBadge({
  baseUrl = "https://status.usesend.com",
}: {
  baseUrl?: string;
}) {
  const [status, setStatus] = useState<StatusState>("unknown");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const s = await fetchUptimeStatus(baseUrl);
      if (mounted) setStatus(s);
    };
    load();
    const id = setInterval(load, 60_000); // refresh every 60s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [baseUrl]);

  const dotClass = useMemo(() => {
    switch (status) {
      case "operational":
        return "bg-green";
      case "degraded":
        return "bg-yellow";
      case "down":
        return "bg-red";
      default:
        return "bg-muted-foreground";
    }
  }, [status]);

  const label = useMemo(() => {
    switch (status) {
      case "operational":
        return "operational";
      case "degraded":
        return "degraded";
      case "down":
        return "outage";
      default:
        return "unknown";
    }
  }, [status]);

  return (
    <a
      href={baseUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
      aria-label={`Service status: ${label}`}
      title={`Status: ${label}`}
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${dotClass} shadow-[0_0_0_2px] shadow-background`}
      />
      {label}
    </a>
  );
}
