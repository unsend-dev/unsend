"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export default function DomainsList() {
  const domainsQuery = api.domain.domains.useQuery();

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-2">
        {!domainsQuery.isLoading && domainsQuery.data?.length ? (
          domainsQuery.data?.map((domain) => (
            <Link key={domain.id} href={`/domains/${domain.id}`}>
              <div className="p-2 px-4 border rounded-lg flex justify-between">
                <p>{domain.name}</p>
                <p className=" capitalize">{domain.status.toLowerCase()}</p>
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
