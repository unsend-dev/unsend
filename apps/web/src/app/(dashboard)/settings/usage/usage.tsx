"use client";

import { api } from "~/trpc/react";
import { Card } from "@unsend/ui/src/card";
import Spinner from "@unsend/ui/src/spinner";
import { format } from "date-fns";
import {
  getCost,
  PLAN_CREDIT_UNITS,
  UNIT_PRICE,
  USAGE_UNIT_PRICE,
} from "~/lib/usage";
import { useTeam } from "~/providers/team-context";

export default function UsagePage() {
  const { data: usage, isLoading } = api.billing.getThisMonthUsage.useQuery();
  const { currentTeam } = useTeam();

  const totalCost =
    usage?.reduce((acc, item) => acc + getCost(item.sent, item.type), 0) || 0;

  // Calculate the current billing period
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );
  const billingPeriod = `${format(firstDayOfMonth, "MMM dd")} - ${format(firstDayOfNextMonth, "MMM dd")}`;

  const planCreditCost = PLAN_CREDIT_UNITS[currentTeam?.plan!] * UNIT_PRICE;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Usage</h1>
          <div className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">{billingPeriod}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="w-8 h-8" innerSvgClass="stroke-primary" />
        </div>
      ) : usage?.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          No usage data available
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex w-full">
            <div className="space-y-4 w-full">
              {usage?.map((item) => {
                // Determine unit price based on type (example values)

                return (
                  <div
                    key={item.type}
                    className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium capitalize">
                        {item.type.toLocaleLowerCase()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="font-mono">
                          {item.sent.toLocaleString()}
                        </span>{" "}
                        emails at{" "}
                        <span className="font-mono">
                          ${USAGE_UNIT_PRICE[item.type]}
                        </span>{" "}
                        each
                      </div>
                    </div>
                    <div className="font-mono font-medium">
                      ${getCost(item.sent, item.type).toFixed(2)}
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium capitalize">Plan Credits</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {currentTeam?.plan}
                  </div>
                </div>
                <div className="font-mono font-medium">
                  -${planCreditCost.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center items-center">
              <div>
                <div className="font-medium">Current Usage</div>
                <div className="">
                  <div className="text-sm text-muted-foreground">Total Due</div>
                  <div className="text-2xl font-bold font-mono">
                    {planCreditCost < totalCost
                      ? `$${(totalCost - planCreditCost).toFixed(2)}`
                      : "$0"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
