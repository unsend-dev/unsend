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
import Link from "next/link";
import EditContactBook from "./edit-contact-book";

export default function ContactBooksList() {
  const contactBooksQuery = api.contacts.getContactBooks.useQuery();

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
            {contactBooksQuery.isLoading ? (
              <TableRow className="h-32">
                <TableCell colSpan={6} className="text-center py-4">
                  <Spinner
                    className="w-6 h-6 mx-auto"
                    innerSvgClass="stroke-primary"
                  />
                </TableCell>
              </TableRow>
            ) : contactBooksQuery.data?.length === 0 ? (
              <TableRow className="h-32">
                <TableCell colSpan={6} className="text-center py-4">
                  <p>No contact books added</p>
                </TableCell>
              </TableRow>
            ) : (
              contactBooksQuery.data?.map((contactBook) => (
                <TableRow>
                  <TableHead scope="row">
                    <Link
                      href={`/contacts/${contactBook.id}`}
                      className="underline underline-offset-4 decoration-dashed text-foreground hover:text-primary"
                    >
                      {contactBook.name}
                    </Link>
                  </TableHead>
                  {/* <TableCell>{contactBook.name}</TableCell> */}
                  <TableCell>{contactBook._count.contacts}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(contactBook.createdAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <EditContactBook contactBook={contactBook} />
                    <DeleteContactBook contactBook={contactBook} />
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
