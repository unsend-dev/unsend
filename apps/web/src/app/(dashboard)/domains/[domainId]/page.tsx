"use client";

import type { Metadata } from "next";
import { api } from "~/trpc/react";

export default function DomainItemPage({
  params,
}: {
  params: { domainId: string };
}) {
  const domainQuery = api.domain.getDomain.useQuery({
    id: Number(params.domainId),
  });

  return (
    <div>
      {domainQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-lg">{domainQuery.data?.name}</h1>
            </div>
            <span className="text-xs capitalize bg-gray-200 rounded px-2 py-1 w-[80px] text-center">
              {domainQuery.data?.status.toLowerCase()}
            </span>
          </div>
          <div className="mt-8 border rounded p-4">
            <p className="font-semibold">DNS records</p>
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex justify-between">
                <p>TXT</p>
                <p>{`unsend._domainkey.${domainQuery.data?.name}`}</p>
                <p className=" w-[200px] overflow-hidden text-ellipsis">{`p=${domainQuery.data?.publicKey}`}</p>
                <p className=" capitalize">
                  {domainQuery.data?.dkimStatus?.toLowerCase()}
                </p>
              </div>
              <div className="flex justify-between">
                <p>TXT</p>
                <p>{`send.${domainQuery.data?.name}`}</p>
                <p className=" w-[200px] overflow-hidden text-ellipsis text-nowrap">{`"v=spf1 include:amazonses.com ~all"`}</p>
                <p className=" capitalize">
                  {domainQuery.data?.spfDetails?.toLowerCase()}
                </p>
              </div>
              <div className="flex justify-between">
                <p>MX</p>
                <p>{`send.${domainQuery.data?.name}`}</p>
                <p className=" w-[200px] overflow-hidden text-ellipsis text-nowrap">{`feedback-smtp.${domainQuery.data?.region}.amazonses.com`}</p>
                <p className=" capitalize">
                  {domainQuery.data?.spfDetails?.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
