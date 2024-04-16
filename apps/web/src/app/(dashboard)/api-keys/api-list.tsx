"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@unsend/ui/src/table";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function ApiList() {
  const apiKeysQuery = api.apiKey.getApiKeys.useQuery();

  return (
    <div className="mt-10">
      <div className="border rounded-xl">
        <Table className="">
          <TableHeader className="">
            <TableRow className=" bg-muted/30">
              <TableHead className="rounded-tl-xl">Name</TableHead>
              <TableHead>Token</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead className="rounded-tr-xl">Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeysQuery.data?.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell>{apiKey.name}</TableCell>
                <TableCell>{apiKey.partialToken}</TableCell>
                <TableCell>{apiKey.permission}</TableCell>
                <TableCell>
                  {apiKey.lastUsed
                    ? formatDistanceToNow(apiKey.lastUsed)
                    : "Never"}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(apiKey.createdAt, { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
