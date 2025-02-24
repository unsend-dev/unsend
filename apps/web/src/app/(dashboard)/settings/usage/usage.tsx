"use client";

import { api } from "~/trpc/react";
import { Card } from "@unsend/ui/src/card";

export default function UsagePage() {
  const { data: usage, isLoading } = api.billing.getThisMonthUsage.useQuery();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Usage</h1>
      <Card className="p-6">
        <div className="space-y-2">
          {usage?.map((item) => (
            <div key={item.type} className="flex justify-between">
              <span className="text-muted-foreground">{item.type}</span>
              <span className="font-medium">{item.sent.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
