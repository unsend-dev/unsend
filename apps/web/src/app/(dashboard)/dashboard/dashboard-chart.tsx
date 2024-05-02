import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
        <h1 className="font-bold text-lg">Dashboard</h1>
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

      <div className="flex flex-col gap-8 mt-8">
        <div className="flex flex-wrap gap-2">
          {!statusQuery.isLoading && statusQuery.data ? (
            <>
              <DashboardItemCard
                status={"total"}
                count={statusQuery.data.totalCount}
                percentage={100}
              />
              <DashboardItemCard
                status={EmailStatus.DELIVERED}
                count={statusQuery.data.emailStatusCounts.DELIVERED.count}
                percentage={
                  statusQuery.data.emailStatusCounts.DELIVERED.percentage
                }
              />
              <DashboardItemCard
                status={EmailStatus.BOUNCED}
                count={statusQuery.data.emailStatusCounts.BOUNCED.count}
                percentage={
                  statusQuery.data.emailStatusCounts.BOUNCED.percentage
                }
              />
              <DashboardItemCard
                status={EmailStatus.COMPLAINED}
                count={statusQuery.data.emailStatusCounts.COMPLAINED.count}
                percentage={
                  statusQuery.data.emailStatusCounts.COMPLAINED.percentage
                }
              />
              <DashboardItemCard
                status={EmailStatus.CLICKED}
                count={statusQuery.data.emailStatusCounts.CLICKED.count}
                percentage={
                  statusQuery.data.emailStatusCounts.CLICKED.percentage
                }
              />
              <DashboardItemCard
                status={EmailStatus.OPENED}
                count={statusQuery.data.emailStatusCounts.OPENED.count}
                percentage={
                  statusQuery.data.emailStatusCounts.OPENED.percentage
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
          <div className="w-full h-[400px] border rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={900}
                height={300}
                data={statusQuery.data.emailDailyStatusCounts}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  content={({ payload }) => {
                    const data = payload?.[0]?.payload as Record<
                      EmailStatus,
                      number
                    > & { name: string };

                    if (
                      !data ||
                      (!data.BOUNCED &&
                        !data.COMPLAINED &&
                        !data.DELIVERED &&
                        !data.OPENED &&
                        !data.CLICKED)
                    )
                      return null;

                    return (
                      <div className=" bg-black border shadow-lg p-2 rounded flex flex-col gap-4 px-4">
                        <p className="text-sm text-muted-foreground">
                          {data.name}
                        </p>
                        {data.DELIVERED ? (
                          <div>
                            <p className="text-sm text-[#10b981]">Delivered</p>
                            <p className="text-xs">{data.DELIVERED} emails</p>
                          </div>
                        ) : null}
                        {data.BOUNCED ? (
                          <div>
                            <p className="text-sm text-[#ef4444]">Bounced</p>
                            <p className="text-xs">{data.BOUNCED} emails</p>
                          </div>
                        ) : null}
                        {data.COMPLAINED ? (
                          <div>
                            <p className="text-sm text-[#eab308]">Complained</p>
                            <p className="text-xs">{data.COMPLAINED} emails</p>
                          </div>
                        ) : null}
                        {data.OPENED ? (
                          <div>
                            <p className="text-sm text-[#6366f1]">Opened</p>
                            <p className="text-xs">{data.OPENED} emails</p>
                          </div>
                        ) : null}
                        {data.CLICKED ? (
                          <div>
                            <p className="text-sm text-[#06b6d4]">Clicked</p>
                            <p className="text-xs">{data.CLICKED} emails</p>
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
                  dataKey="DELIVERED"
                  stackId="a"
                  fill="#10b981"
                />
                <Bar dataKey="BOUNCED" stackId="a" fill="#ef4444" />
                <Bar dataKey="COMPLAINED" stackId="a" fill="#eab308" />
                <Bar dataKey="OPENED" stackId="a" fill="#6366f1" />
                <Bar dataKey="CLICKED" stackId="a" fill="#06b6d4" />
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
    <div className="h-[100px] w-[16%] min-w-[170px]  bg-secondary/10 border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {status !== "total" ? <EmailStatusIcon status={status} /> : null}
        <div className=" capitalize">{status.toLowerCase()}</div>
      </div>
      <div className="flex justify-between items-end">
        <div className="text-primary font-light text-2xl  font-mono">
          {count}
        </div>
        {status !== "total" ? (
          <div className="text-sm pb-1">{percentage}%</div>
        ) : null}
      </div>
    </div>
  );
};
