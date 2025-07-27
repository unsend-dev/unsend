"use client";

import { api } from "~/trpc/react";

export default function SuppressionStats() {
  const { data: stats, isLoading } =
    api.suppression.getSuppressionStats.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-lg border p-4 shadow"
          >
            <div className="h-4 bg-muted animate-pulse rounded mb-1" />
            <div className="h-8 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  const totalSuppressions = stats
    ? Object.values(stats).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      <div className="flex flex-col gap-2 rounded-lg border p-4 shadow">
        <p className="font-semibold mb-1">Total Suppressions</p>
        <div className="text-2xl font-mono">{totalSuppressions}</div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border p-4 shadow">
        <p className="font-semibold mb-1">Hard Bounces</p>
        <div className="text-2xl font-mono text-red">
          {stats?.HARD_BOUNCE ?? 0}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border p-4 shadow">
        <p className="font-semibold mb-1">Complaints</p>
        <div className="text-2xl font-mono text-yellow">
          {stats?.COMPLAINT ?? 0}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border p-4 shadow">
        <p className="font-semibold mb-1">Manual</p>
        <div className="text-2xl font-mono text-blue">{stats?.MANUAL ?? 0}</div>
      </div>
    </div>
  );
}
