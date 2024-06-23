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
import { api } from "~/trpc/react";
import Spinner from "@unsend/ui/src/spinner";

export default function SesConfigurations() {
  const sesSettingsQuery = api.admin.getSesSettings.useQuery();

  return (
    <div className="">
      <div className="border rounded-xl">
        <Table className="">
          <TableHeader className="">
            <TableRow className=" bg-muted/30">
              <TableHead className="rounded-tl-xl">Region</TableHead>
              <TableHead>Callback URL</TableHead>
              <TableHead>Callback status</TableHead>
              <TableHead>Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sesSettingsQuery.isLoading ? (
              <TableRow className="h-32">
                <TableCell colSpan={6} className="text-center py-4">
                  <Spinner
                    className="w-6 h-6 mx-auto"
                    innerSvgClass="stroke-primary"
                  />
                </TableCell>
              </TableRow>
            ) : sesSettingsQuery.data?.length === 0 ? (
              <TableRow className="h-32">
                <TableCell colSpan={6} className="text-center py-4">
                  <p>No SES configurations added</p>
                </TableCell>
              </TableRow>
            ) : (
              sesSettingsQuery.data?.map((sesSetting) => (
                <TableRow key={sesSetting.id}>
                  <TableCell>{sesSetting.region}</TableCell>
                  <TableCell>{sesSetting.callbackUrl}</TableCell>
                  <TableCell>
                    {sesSetting.callbackSuccess ? "Success" : "Failed"}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(sesSetting.createdAt)} ago
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
