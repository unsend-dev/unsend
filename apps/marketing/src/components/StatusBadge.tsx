"use client";

import { useEffect, useMemo, useState } from "react";

type StatusState = "operational" | "degraded" | "down" | "unknown";

// Fetch normalized status from the app's server API to bypass CORS.
async function fetchUptimeStatus(): Promise<StatusState> {
  try {
    const res = await fetch("/api/status", { cache: "no-store" });
    if (!res.ok) return "unknown";
    const data: any = await res.json().catch(() => null);
    const s = (data?.status || "").toString().toLowerCase();
    console.log(data);
    if (s === "operational" || s === "degraded" || s === "down")
      return s as StatusState;
    return "unknown";
  } catch {
    return "unknown";
  }
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
      const s = await fetchUptimeStatus();

      if (mounted) setStatus(s);
    };
    load();
    const id = setInterval(load, 60_000); // refresh every 60s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

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
