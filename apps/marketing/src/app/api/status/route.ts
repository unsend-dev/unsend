import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type StatusState = "operational" | "degraded" | "down" | "unknown";

function normalizeStatus(data: any): StatusState {
  const overall = (data?.overallStatus || data?.status || "")
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

  // Status page incidents (default endpoint)
  const sp = (data?.statusPage || data?.status_page || {}) as any;
  const incidentRaw = sp?.incident ?? sp?.incidents ?? data?.incident ?? data?.incidents;
  if (incidentRaw) {
    const incidents: any[] = Array.isArray(incidentRaw)
      ? incidentRaw
      : [incidentRaw];
    const hasActive = incidents.some((i) => {
      const resolved =
        i?.resolved === true ||
        (typeof i?.status === "string" && i.status.toLowerCase().includes("resolv")) ||
        !!i?.endAt ||
        !!i?.end_at ||
        !!i?.endTime ||
        !!i?.end_time;
      return !resolved;
    });
    if (hasActive) return "down";
  }

  // Heartbeat map shape: { [monitorId: string]: Heartbeat[] }
  if (data?.heartbeatList && typeof data.heartbeatList === "object") {
    const lists = Object.values<any>(data.heartbeatList);
    const isAnyDown = lists.some(
      (arr: any) => Array.isArray(arr) && arr.some((hb) => hb?.status === 0)
    );
    if (isAnyDown) return "down";
    return "operational";
  }

  if (typeof data?.allUp === "boolean")
    return data.allUp ? "operational" : "down";

  return "unknown";
}

export async function GET(_req: NextRequest) {
  const base = (
    process.env.STATUS_BASE_URL || "https://status.usesend.com"
  ).replace(/\/$/, "");
  const candidates = [
    "/api/status-page/default",
    "/api/status-page/heartbeat/default",
  ];
  let status = "unknown";

  for (const path of candidates) {
    try {
      const res = await fetch(`${base}${path}`, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json().catch(() => null);
      if (!data) continue;
      status = normalizeStatus(data);
      if (status !== "unknown") break;
    } catch {
      // try next candidate
      continue;
    }
  }

  return Response.json(
    { status },
    {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=300" },
    }
  );
}
