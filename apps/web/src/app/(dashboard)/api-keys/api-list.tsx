"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export default function ApiList() {
  const apiKeysQuery = api.apiKey.getApiKeys.useQuery();

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-2">
        {!apiKeysQuery.isLoading && apiKeysQuery.data?.length ? (
          apiKeysQuery.data?.map((apiKey) => (
            <div className="p-2 px-4 border rounded-lg flex justify-between">
              <p>{apiKey.name}</p>
              <p>{apiKey.permission}</p>
              <p>{apiKey.partialToken}</p>
            </div>
          ))
        ) : (
          <div>No API keys added</div>
        )}
      </div>
    </div>
  );
}
