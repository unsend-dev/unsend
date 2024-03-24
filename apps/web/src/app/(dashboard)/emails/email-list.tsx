"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export default function DomainsList() {
  const emailsQuery = api.email.emails.useQuery();

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-2 w-full">
        {!emailsQuery.isLoading && emailsQuery.data?.length ? (
          emailsQuery.data?.map((email) => (
            <Link key={email.id} href={`/email/${email.id}`} className="w-full">
              <div className="p-2 px-4 border rounded-lg flex justify-between w-full">
                <p>{email.to}</p>
                <p className=" capitalize">
                  {email.latestStatus?.toLowerCase()}
                </p>
                <p>{email.subject}</p>
                <p>{email.createdAt.toLocaleDateString()}</p>
              </div>
            </Link>
          ))
        ) : (
          <div>No domains</div>
        )}
      </div>
    </div>
  );
}
