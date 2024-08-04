"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@unsend/ui/src/table";
import { api } from "~/trpc/react";
import { useUrlState } from "~/hooks/useUrlState";
import { Button } from "@unsend/ui/src/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@unsend/ui/src/select";
import Spinner from "@unsend/ui/src/spinner";
import { formatDistanceToNow } from "date-fns";
import DeleteContact from "./delete-contact";
import EditContact from "./edit-contact";

export default function ContactList({
  contactBookId,
}: {
  contactBookId: string;
}) {
  const [page, setPage] = useUrlState("page", "1");
  const [status, setStatus] = useUrlState("status");

  const pageNumber = Number(page);

  const contactsQuery = api.contacts.contacts.useQuery({
    contactBookId,
    page: pageNumber,
    subscribed:
      status === "Subscribed"
        ? true
        : status === "Unsubscribed"
          ? false
          : undefined,
  });

  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex justify-end">
        <Select
          value={status ?? "All"}
          onValueChange={(val) => setStatus(val === "All" ? null : val)}
        >
          <SelectTrigger className="w-[180px] capitalize">
            {status || "All statuses"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className=" capitalize">
              All statuses
            </SelectItem>
            <SelectItem value="Subscribed" className=" capitalize">
              Subscribed
            </SelectItem>
            <SelectItem value="Unsubscribed" className=" capitalize">
              Unsubscribed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col rounded-xl border border-broder shadow">
        <Table className="">
          <TableHeader className="">
            <TableRow className=" bg-muted/30">
              <TableHead className="rounded-tl-xl">Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="">Created At</TableHead>
              <TableHead className="rounded-tr-xl">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactsQuery.isLoading ? (
              <TableRow className="h-32">
                <TableCell colSpan={4} className="text-center py-4">
                  <Spinner
                    className="w-6 h-6 mx-auto"
                    innerSvgClass="stroke-primary"
                  />
                </TableCell>
              </TableRow>
            ) : contactsQuery.data?.contacts.length ? (
              contactsQuery.data?.contacts.map((contact) => (
                <TableRow key={contact.id} className="">
                  <TableCell className="font-medium">{contact.email}</TableCell>
                  <TableCell>
                    <div
                      className={`text-center w-[130px] rounded capitalize py-1 text-xs ${
                        contact.subscribed
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-600/10"
                          : "bg-red-500/10 text-red-600 border-red-600/10"
                      }`}
                    >
                      {contact.subscribed ? "Subscribed" : "Unsubscribed"}
                    </div>
                  </TableCell>
                  <TableCell className="">
                    {formatDistanceToNow(new Date(contact.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditContact contact={contact} />
                      <DeleteContact contact={contact} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="h-32">
                <TableCell colSpan={4} className="text-center py-4">
                  No contacts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
          disabled={pageNumber >= (contactsQuery.data?.totalPage ?? 0)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
