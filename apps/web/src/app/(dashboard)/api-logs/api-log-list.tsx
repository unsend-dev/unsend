"use client";

import { Button } from "@unsend/ui/src/button";
import { Input } from "@unsend/ui/src/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@unsend/ui/src/select";
import Spinner from "@unsend/ui/src/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@unsend/ui/src/table";
import { formatDate } from "date-fns";
import dynamic from "next/dynamic";
import { useDebouncedCallback } from "use-debounce";
import { useUrlState } from "~/hooks/useUrlState";
import { DEFAULT_QUERY_LIMIT } from "~/lib/constants";
import { api } from "~/trpc/react";
import ApiLogDetails from "./api-log-details";
import { ApiLogStatus, ApiLogStatusBadge } from "./api-log-status-badge";

const DynamicSheetWithNoSSR = dynamic(
  () => import("@unsend/ui/src/sheet").then((mod) => mod.Sheet),
  { ssr: false }
);

const DynamicSheetContentWithNoSSR = dynamic(
  () => import("@unsend/ui/src/sheet").then((mod) => mod.SheetContent),
  { ssr: false }
);

export default function ApiLogsList() {
  const [selectedLog, setSelectedLog] = useUrlState("logId");
  const [page, setPage] = useUrlState("page", "1");
  const [status, setStatus] = useUrlState("status");
  const [method, setMethod] = useUrlState("method");
  const [search, setSearch] = useUrlState("search");
  const [apiKeyId, setApiKeyId] = useUrlState("apiKeyId");

  const pageNumber = Number(page);

  const apiKeysQuery = api.apiKey.getApiKeys.useQuery();

  const logsQuery = api.apiLogs.getLogs.useQuery({
    page: pageNumber,
    status: status ? parseInt(status) : undefined,
    method: method ?? undefined,
    apiKeyId: apiKeyId ?? undefined,
    search: search ?? undefined,
  });

  const handleSelectLog = (logId: string) => {
    setSelectedLog(logId);
  };

  const handleSheetChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedLog(null);
    }
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 1000);

  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search by path"
          className="w-[350px] mr-4"
          defaultValue={search ?? ""}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <Select
            value={apiKeyId ?? "All keys"}
            onValueChange={(val) =>
              setApiKeyId(val === "All keys" ? null : val)
            }
          >
            <SelectTrigger className="w-[200px]">
              {apiKeyId
                ? apiKeysQuery.data?.find((k) => k.id === parseInt(apiKeyId))
                    ?.name ?? "All keys"
                : "All keys"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All keys">All keys</SelectItem>
              {apiKeysQuery.data?.map((key) => (
                <SelectItem key={key.id} value={key.id.toString()}>
                  {key.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={method ?? "All methods"}
            onValueChange={(val) =>
              setMethod(val === "All methods" ? null : val)
            }
          >
            <SelectTrigger className="w-[150px]">
              {method ?? "All methods"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All methods">All methods</SelectItem>
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status ?? "All statuses"}
            onValueChange={(val) =>
              setStatus(val === "All statuses" ? null : val)
            }
          >
            <SelectTrigger className="w-[180px]">
              {status ? `${status}` : "All statuses"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All statuses">All statuses</SelectItem>
              {[200, 201, 400, 401, 403, 404, 500, 503].map((code) => (
                <SelectItem key={code} value={code.toString()}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted dark:bg-muted/70">
              <TableHead className="rounded-tl-xl">Method</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right rounded-tr-xl">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logsQuery.isLoading ? (
              <TableRow className="h-32">
                <TableCell colSpan={5} className="text-center py-4">
                  <Spinner
                    className="w-6 h-6 mx-auto"
                    innerSvgClass="stroke-primary"
                  />
                </TableCell>
              </TableRow>
            ) : logsQuery.data?.logs.length ? (
              logsQuery.data?.logs.map((log) => (
                <TableRow
                  key={log.id}
                  onClick={() => handleSelectLog(log.id)}
                  className="cursor-pointer"
                >
                  <TableCell>{log.method}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {log.path}
                  </TableCell>
                  <TableCell>
                    <ApiLogStatusBadge status={log.status as ApiLogStatus} />
                  </TableCell>
                  <TableCell>{log.duration}ms</TableCell>
                  <TableCell className="text-right">
                    {formatDate(log.createdAt, "MMM do, hh:mm a")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="h-32">
                <TableCell colSpan={5} className="text-center py-4">
                  No logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DynamicSheetWithNoSSR
          open={!!selectedLog}
          onOpenChange={handleSheetChange}
        >
          <DynamicSheetContentWithNoSSR className="sm:max-w-3xl">
            {selectedLog ? <ApiLogDetails logId={selectedLog} /> : null}
          </DynamicSheetContentWithNoSSR>
        </DynamicSheetWithNoSSR>
      </div>
      <div className="flex gap-4 justify-end">
        <Button
          size="sm"
          onClick={() => setPage((pageNumber - 1).toString())}
          disabled={pageNumber === 1}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => setPage((pageNumber + 1).toString())}
          disabled={logsQuery.data?.logs.length !== DEFAULT_QUERY_LIMIT}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
