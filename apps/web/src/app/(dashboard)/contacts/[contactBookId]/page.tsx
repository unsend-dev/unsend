"use client";

import { api } from "~/trpc/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@unsend/ui/src/breadcrumb";
import Link from "next/link";
import { Button } from "@unsend/ui/src/button";
import { Plus } from "lucide-react";
import AddContact from "./add-contact";
import ContactList from "./contact-list";
import { TextWithCopyButton } from "@unsend/ui/src/text-with-copy";
import { formatDistanceToNow } from "date-fns";

export default function ContactsPage({
  params,
}: {
  params: { contactBookId: string };
}) {
  const contactBookDetailQuery = api.contacts.getContactBookDetails.useQuery({
    contactBookId: params.contactBookId,
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center  gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/contacts" className="text-lg">
                    Contact books
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-lg" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-lg ">
                  {contactBookDetailQuery.data?.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex gap-4">
          <AddContact contactBookId={params.contactBookId} />
        </div>
      </div>
      <div className="mt-16">
        <div className="flex  justify-between">
          <div>
            <div className=" text-muted-foreground">Total Contacts</div>
            <div className="text-xl mt-3">
              {contactBookDetailQuery.data?.totalContacts !== undefined
                ? contactBookDetailQuery.data?.totalContacts
                : "--"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Unsubscribed</div>
            <div className="text-xl mt-3">
              {contactBookDetailQuery.data?.unsubscribedContacts !== undefined
                ? contactBookDetailQuery.data?.unsubscribedContacts
                : "--"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Created at</div>
            <div className="text-xl mt-3">
              {contactBookDetailQuery.data?.createdAt
                ? formatDistanceToNow(contactBookDetailQuery.data.createdAt, {
                    addSuffix: true,
                  })
                : "--"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Contact book id</div>
            <div className="border mt-3 px-3 rounded bg-muted/30 ">
              <TextWithCopyButton value={params.contactBookId} alwaysShowCopy />
            </div>
          </div>
        </div>
        <div className="mt-16">
          <ContactList contactBookId={params.contactBookId} />
        </div>
      </div>
    </div>
  );
}
