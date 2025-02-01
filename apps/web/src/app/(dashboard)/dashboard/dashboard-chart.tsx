import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { EmailStatusIcon } from "../emails/email-status-badge";
import { EmailStatus } from "@prisma/client";
import { api } from "~/trpc/react";
import Spinner from "@unsend/ui/src/spinner";
import { Tabs, TabsList, TabsTrigger } from "@unsend/ui/src/tabs";
import { useUrlState } from "~/hooks/useUrlState";

export default function DashboardChart() {
  const [days, setDays] = useUrlState("days", "7");
  const statusQuery = api.email.dashboard.useQuery({ days: Number(days) });

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">Dashboard</h1>
        <Tabs
          value={days || "7"}
          onValueChange={(value) => setDays(value)}
          className=""
        >
          <TabsList>
            <TabsTrigger value="7">7 Days</TabsTrigger>
            <TabsTrigger value="30">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-16 mt-10">
        <div className="flex flex-wrap gap-2">
          {!statusQuery.isLoading && statusQuery.data ? (
            <>
              <DashboardItemCard
                status={"total"}
                count={statusQuery.data.totalCounts.sent}
                percentage={100}
              />
              <DashboardItemCard
                status={EmailStatus.DELIVERED}
                count={statusQuery.data.totalCounts.delivered}
                percentage={
                  statusQuery.data.totalCounts.delivered /
                  statusQuery.data.totalCounts.sent
                }
              />
              <DashboardItemCard
                status={EmailStatus.BOUNCED}
                count={statusQuery.data.totalCounts.bounced}
                percentage={
                  statusQuery.data.totalCounts.bounced /
                  statusQuery.data.totalCounts.sent
                }
              />
              <DashboardItemCard
                status={EmailStatus.COMPLAINED}
                count={statusQuery.data.totalCounts.complained}
                percentage={
                  statusQuery.data.totalCounts.complained /
                  statusQuery.data.totalCounts.sent
                }
              />
              <DashboardItemCard
                status={EmailStatus.CLICKED}
                count={statusQuery.data.totalCounts.clicked}
                percentage={
                  statusQuery.data.totalCounts.clicked /
                  statusQuery.data.totalCounts.sent
                }
              />
              <DashboardItemCard
                status={EmailStatus.OPENED}
                count={statusQuery.data.totalCounts.opened}
                percentage={
                  statusQuery.data.totalCounts.opened /
                  statusQuery.data.totalCounts.sent
                }
              />
            </>
          ) : (
            <>
              <div className="h-[100px] w-[1/5] min-w-[200px] bg-secondary/10 border rounded-lg p-4 flex justify-center items-center gap-3 ">
                <Spinner className="w-4 h-4" innerSvgClass="stroke-primary" />
              </div>
              <div className="h-[100px] w-[1/5] min-w-[200px] bg-secondary/10 border rounded-lg p-4 flex justify-center items-center gap-3 ">
                <Spinner className="w-4 h-4" innerSvgClass="stroke-primary" />
              </div>
              <div className="h-[100px] w-[1/5] min-w-[200px] bg-secondary/10 border rounded-lg p-4 flex justify-center items-center gap-3 ">
                <Spinner className="w-4 h-4" innerSvgClass="stroke-primary" />
              </div>
              <div className="h-[100px] w-[1/5] min-w-[200px] bg-secondary/10 border rounded-lg p-4 flex justify-center items-center gap-3 ">
                <Spinner className="w-4 h-4" innerSvgClass="stroke-primary" />
              </div>
              <div className="h-[100px] w-[1/5] min-w-[200px] bg-secondary/10 border rounded-lg p-4 flex justify-center items-center gap-3 ">
                <Spinner className="w-4 h-4" innerSvgClass="stroke-primary" />
              </div>
            </>
          )}
        </div>
        {!statusQuery.isLoading && statusQuery.data ? (
          <div className="w-full h-[400px] border shadow rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={900}
                height={300}
                data={statusQuery.data.result}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  content={({ payload }) => {
                    const data = payload?.[0]?.payload as Record<
                      | "sent"
                      | "delivered"
                      | "opened"
                      | "clicked"
                      | "bounced"
                      | "complained",
                      number
                    > & { date: string };

                    if (!data || data.sent === 0) return null;

                    return (
                      <div className=" bg-background border shadow-lg p-2 rounded flex flex-col gap-2 px-4">
                        <p className="text-sm text-muted-foreground">
                          {data.date}
                        </p>
                        {data.delivered ? (
                          <div className="flex gap-2 items-center">
                            <div className="w-2.5 h-2.5 bg-[#10b981] rounded-[2px]"></div>
                            <p className="text-xs text-muted-foreground w-[60px]">
                              Delivered
                            </p>
                            <p className="text-xs font-mono">
                              {data.delivered}
                            </p>
                          </div>
                        ) : null}
                        {data.bounced ? (
                          <div className="flex gap-2 items-center">
                            <div className="w-2.5 h-2.5 bg-[#ef4444] rounded-[2px]"></div>
                            <p className="text-xs text-muted-foreground w-[60px]">
                              Bounced
                            </p>
                            <p className="text-xs font-mono">{data.bounced}</p>
                          </div>
                        ) : null}
                        {data.complained ? (
                          <div className="flex gap-2 items-center">
                            <div className="w-2.5 h-2.5 bg-[#eab308] rounded-[2px]"></div>
                            <p className="text-xs text-muted-foreground w-[60px]">
                              Complained
                            </p>
                            <p className="text-xs font-mono">
                              {data.complained}
                            </p>
                          </div>
                        ) : null}
                        {data.opened ? (
                          <div className="flex gap-2 items-center">
                            <div className="w-2.5 h-2.5 bg-[#6366f1] rounded-[2px]"></div>
                            <p className="text-xs text-muted-foreground w-[60px]">
                              Opened
                            </p>
                            <p className="text-xs font-mono">{data.opened}</p>
                          </div>
                        ) : null}
                        {data.clicked ? (
                          <div className="flex gap-2 items-center">
                            <div className="w-2.5 h-2.5 bg-[#06b6d4] rounded-[2px]"></div>
                            <p className="text-xs text-muted-foreground w-[60px]">
                              Clicked
                            </p>
                            <p className="text-xs font-mono">{data.clicked}</p>
                          </div>
                        ) : null}
                      </div>
                    );
                  }}
                  cursor={false}
                />
                {/* <Legend /> */}
                <Bar
                  barSize={8}
                  dataKey="delivered"
                  stackId="a"
                  fill="#10b981"
                />
                <Bar dataKey="bounced" stackId="a" fill="#ef4444" />
                <Bar dataKey="complained" stackId="a" fill="#eab308" />
                <Bar dataKey="opened" stackId="a" fill="#6366f1" />
                <Bar dataKey="clicked" stackId="a" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type DashboardItemCardProps = {
  status: EmailStatus | "total";
  count: number;
  percentage: number;
};

const DashboardItemCard: React.FC<DashboardItemCardProps> = ({
  status,
  count,
  percentage,
}) => {
  return (
    <div className="h-[100px] w-[16%] min-w-[170px]  bg-secondary/10 border shadow rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {status !== "total" ? <EmailStatusIcon status={status} /> : null}
        <div className=" capitalize">{status.toLowerCase()}</div>
      </div>
      <div className="flex justify-between items-end">
        <div className="text-primary font-light text-2xl  font-mono">
          {count}
        </div>
        {status !== "total" ? (
          <div className="text-sm pb-1">{(percentage * 100).toFixed(0)}%</div>
        ) : null}
      </div>
    </div>
  );
};
