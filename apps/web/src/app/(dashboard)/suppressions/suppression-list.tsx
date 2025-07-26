"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useUrlState } from "~/hooks/useUrlState";
import { useDebouncedCallback } from "use-debounce";
import { SuppressionReason } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@unsend/ui/src/badge";
import { Button } from "@unsend/ui/src/button";
import { Input } from "@unsend/ui/src/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@unsend/ui/src/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@unsend/ui/src/table";
import { Card, CardContent, CardHeader, CardTitle } from "@unsend/ui/src/card";
import { Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import RemoveSuppressionDialog from "./remove-suppression";

const reasonColors = {
  HARD_BOUNCE: "destructive",
  COMPLAINT: "secondary",
  MANUAL: "default",
} as const;

const reasonLabels = {
  HARD_BOUNCE: "Hard Bounce",
  COMPLAINT: "Complaint",
  MANUAL: "Manual",
} as const;

export default function SuppressionList() {
  const [search, setSearch] = useUrlState("search");
  const [reason, setReason] = useUrlState("reason");
  const [page, setPage] = useUrlState("page", "1");
  const [emailToRemove, setEmailToRemove] = useState<string | null>(null);

  const suppressionsQuery = api.suppression.getSuppressions.useQuery({
    page: parseInt(page || "1"),
    limit: 20,
    search: search || undefined,
    reason: reason as SuppressionReason | undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const exportQuery = api.suppression.exportSuppressions.useQuery(
    {
      search: search || undefined,
      reason: reason as SuppressionReason | undefined,
    },
    { enabled: false }
  );

  const utils = api.useUtils();

  const removeMutation = api.suppression.removeSuppression.useMutation({
    onSuccess: () => {
      utils.suppression.getSuppressions.invalidate();
      utils.suppression.getSuppressionStats.invalidate();
      setEmailToRemove(null);
    },
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value || null);
    setPage("1");
  }, 1000);

  const handleReasonFilter = (value: string) => {
    setReason(value === "all" ? null : value);
    setPage("1");
  };

  const handleExport = async () => {
    await exportQuery.refetch();
    if (exportQuery.data) {
      const csv = [
        "Email,Reason,Source,Created At",
        ...exportQuery.data.map(
          (suppression) =>
            `${suppression.email},${suppression.reason},${suppression.source || ""},${suppression.createdAt}`
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `suppressions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleRemove = (email: string) => {
    setEmailToRemove(email);
  };

  const confirmRemove = () => {
    if (emailToRemove) {
      removeMutation.mutate({ email: emailToRemove });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Suppressed Emails</CardTitle>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportQuery.isFetching}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search by email address..."
            className="max-w-sm"
            defaultValue={search || ""}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <Select value={reason || "all"} onValueChange={handleReasonFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="HARD_BOUNCE">Hard Bounce</SelectItem>
              <SelectItem value="COMPLAINT">Complaint</SelectItem>
              <SelectItem value="MANUAL">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppressionsQuery.isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 bg-muted animate-pulse rounded w-48" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted animate-pulse rounded w-20" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted animate-pulse rounded w-16" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted animate-pulse rounded w-24" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted animate-pulse rounded w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : suppressionsQuery.data?.suppressions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No suppressed emails found
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                suppressionsQuery.data?.suppressions.map((suppression) => (
                  <TableRow key={suppression.id}>
                    <TableCell className="font-medium">
                      {suppression.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={reasonColors[suppression.reason]}>
                        {reasonLabels[suppression.reason]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {suppression.source ? (
                        <span className="text-xs font-mono">
                          {suppression.source.slice(0, 8)}...
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(suppression.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(suppression.email)}
                        disabled={removeMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {suppressionsQuery.data?.pagination && (
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Page {suppressionsQuery.data.pagination.page} of{" "}
              {suppressionsQuery.data.pagination.totalPages} (
              {suppressionsQuery.data.pagination.totalCount} total)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(String(parseInt(page || "1") - 1))}
                disabled={!suppressionsQuery.data.pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(String(parseInt(page || "1") + 1))}
                disabled={!suppressionsQuery.data.pagination.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <RemoveSuppressionDialog
        email={emailToRemove}
        open={!!emailToRemove}
        onOpenChange={(open) => !open && setEmailToRemove(null)}
        onConfirm={confirmRemove}
        isLoading={removeMutation.isPending}
      />
    </Card>
  );
}
