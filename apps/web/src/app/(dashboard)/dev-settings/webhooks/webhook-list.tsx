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
import Spinner from "@unsend/ui/src/spinner";
import { WebhookEventBadge } from "./webhook-badge";
import { api } from "~/trpc/react";
import DeleteWebhook from "./delete-webhook";

export default function WebhookList() {
  const webhooksQuery = api.webhook.list.useQuery();

  const webhooks = webhooksQuery.data;
  const isLoading = webhooksQuery.isLoading;

  return (
    <div className="mt-10">
      <div className="border rounded-xl shadow">
        <Table className="">
          <TableHeader className="">
            <TableRow className=" bg-muted/30">
              <TableHead className="rounded-tl-xl">URL</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="rounded-tr-xl">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="h-32">
                <TableCell colSpan={5} className="text-center py-4">
                  <Spinner
                    className="w-6 h-6 mx-auto"
                    innerSvgClass="stroke-primary"
                  />
                </TableCell>
              </TableRow>
            ) : !webhooks || webhooks?.length === 0 ? (
              <TableRow className="h-32">
                <TableCell colSpan={5} className="text-center py-4">
                  <p>No webhooks added</p>
                </TableCell>
              </TableRow>
            ) : (
              webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell>{webhook.url}</TableCell>
                  <TableCell>
                    {webhook.events.map((event) => (
                      <WebhookEventBadge key={event} event={event} />
                    ))}
                  </TableCell>
                  <TableCell>
                    {webhook.domain?.name ? webhook.domain?.name : "all domains"}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(webhook.createdAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <DeleteWebhook webhook={webhook} />
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
