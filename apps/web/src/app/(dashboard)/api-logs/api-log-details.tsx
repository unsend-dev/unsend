"use client";

import { Separator } from "@unsend/ui/src/separator";
import { SheetHeader, SheetTitle } from "@unsend/ui/src/sheet";
import Spinner from "@unsend/ui/src/spinner";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { api } from "~/trpc/react";
import { ApiLogStatus, ApiLogStatusBadge } from "./api-log-status-badge";

interface ApiLogDetailsProps {
  logId: string;
}

export default function ApiLogDetails({ logId }: ApiLogDetailsProps) {
  const logQuery = api.apiLogs.getLog.useQuery({ id: logId });

  if (logQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner className="w-6 h-6" innerSvgClass="stroke-primary" />
      </div>
    );
  }

  if (!logQuery.data) {
    return <div>Log not found</div>;
  }

  const log = logQuery.data;

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>API Log Details</SheetTitle>
      </SheetHeader>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Path
          </label>
          <div className="mt-1 font-mono text-sm">{log.path}</div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Method
            </label>
            <div className="mt-1">{log.method}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <div className="mt-1">
              <ApiLogStatusBadge status={log.status as ApiLogStatus} />
            </div>
          </div>
          {log.apiKey && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                API Key
              </label>
              <div className="mt-1">{log.apiKey.name}</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Time
            </label>
            <div className="mt-1">
              <span>
                {`${formatDate(log.createdAt, "MMM dd, yyyy hh:mm:ss a")}`}
              </span>
              <br />
              <span>
                {`(${formatDistanceToNowStrict(new Date(log.createdAt), {
                  addSuffix: true,
                })})`}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Duration
            </label>
            <div className="mt-1">{log.duration}ms</div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Request Body
          </label>
          <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto max-h-60 text-sm">
            {log.request
              ? JSON.stringify(JSON.parse(log.request), null, 2)
              : "No request body"}
          </pre>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Response
          </label>
          <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto max-h-60 text-sm">
            {log.response
              ? JSON.stringify(JSON.parse(log.response), null, 2)
              : "No response body"}
          </pre>
        </div>

        {log.error && (
          <div>
            <label className="text-sm font-medium text-muted-foreground text-red-500">
              Error
            </label>
            <div className="mt-2 p-4 bg-red-50 text-red-900 rounded-lg text-sm">
              {log.error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
