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
import DeleteContactBook from "./delete-contact-book";

export default function ContactBooksList() {
  const apiKeysQuery = api.contacts.getContactBooks.useQuery();

  return (
    <div className="mt-10">
      <div className="border rounded-xl">
        <Table className="">
          <TableHeader className="">
            <TableRow className=" bg-muted/30">
              <TableHead className="rounded-tl-xl">Name</TableHead>
              <TableHead>Contacts</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeysQuery.isLoading ? (
              <TableRow className="h-32">
                <TableCell colSpan={6} className="text-center py-4">
                  <Spinner
                    className="w-6 h-6 mx-auto"
                    innerSvgClass="stroke-primary"
                  />
                </TableCell>
              </TableRow>
            ) : apiKeysQuery.data?.length === 0 ? (
              <TableRow className="h-32">
                <TableCell colSpan={6} className="text-center py-4">
                  <p>No contact books added</p>
                </TableCell>
              </TableRow>
            ) : (
              apiKeysQuery.data?.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>{apiKey.name}</TableCell>
                  <TableCell>{apiKey.audiences}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(apiKey.createdAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <DeleteContactBook apiKey={apiKey} />
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
