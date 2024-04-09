"use client";

import { Domain, DomainStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Switch } from "@unsend/ui/src/switch";
import { api } from "~/trpc/react";
import React from "react";

export default function DomainsList() {
  const domainsQuery = api.domain.domains.useQuery();

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-6">
        {!domainsQuery.isLoading && domainsQuery.data?.length ? (
          domainsQuery.data?.map((domain) => (
            <DomainItem key={domain.id} domain={domain} />
          ))
        ) : (
          <div>No domains</div>
        )}
      </div>
    </div>
  );
}

const DomainItem: React.FC<{ domain: Domain }> = ({ domain }) => {
  const updateDomain = api.domain.updateDomain.useMutation();
  const utils = api.useUtils();

  const [clickTracking, setClickTracking] = React.useState(
    domain.clickTracking
  );
  const [openTracking, setOpenTracking] = React.useState(domain.openTracking);

  function handleClickTrackingChange() {
    setClickTracking(!clickTracking);
    updateDomain.mutate(
      { id: domain.id, clickTracking: !clickTracking },
      {
        onSuccess: () => {
          utils.domain.domains.invalidate();
        },
      }
    );
  }

  function handleOpenTrackingChange() {
    setOpenTracking(!openTracking);
    updateDomain.mutate(
      { id: domain.id, openTracking: !openTracking },
      {
        onSuccess: () => {
          utils.domain.domains.invalidate();
        },
      }
    );
  }

  return (
    <div key={domain.id}>
      <div className=" pr-8 border rounded-lg flex items-stretch">
        <StatusIndicator status={domain.status} />
        <div className="flex justify-between w-full pl-8 py-4">
          <div className="flex flex-col gap-4 w-1/5">
            <Link
              href={`/domains/${domain.id}`}
              className="text-lg font-medium underline underline-offset-4 decoration-dashed"
            >
              {domain.name}
            </Link>
            <DomainStatusBadge status={domain.status} />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Created at</p>
              <p className="text-sm">
                {formatDistanceToNow(new Date(domain.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Region</p>

              <p className="text-sm flex items-center gap-2">
                <span className="text-2xl">🇺🇸</span> {domain.region}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex gap-2 items-center">
              <p className="text-sm">Click tracking</p>
              <Switch
                checked={clickTracking}
                onCheckedChange={handleClickTrackingChange}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
            <div className="flex gap-2 items-center">
              <p className="text-sm">Open tracking</p>
              <Switch
                checked={openTracking}
                onCheckedChange={handleOpenTrackingChange}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DomainStatusBadge: React.FC<{ status: DomainStatus }> = ({ status }) => {
  let badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10"; // Default color
  switch (status) {
    case DomainStatus.NOT_STARTED:
      badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10";
      break;
    case DomainStatus.SUCCESS:
      badgeColor = "bg-emerald-500/10 text-emerald-500 border-emerald-600/10";
      break;
    case DomainStatus.FAILED:
      badgeColor = "bg-red-500/10 text-red-800 border-red-600/10";
      break;
    case DomainStatus.TEMPORARY_FAILURE:
    case DomainStatus.PENDING:
      badgeColor = "bg-yellow-500/10 text-yellow-600 border-yellow-600/10";
      break;
    default:
      badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10";
  }

  return (
    <div
      className={`border text-center w-[120px] text-sm capitalize rounded-full py-0.5 ${badgeColor}`}
    >
      {status === "SUCCESS" ? "Verified" : status.toLowerCase()}
    </div>
  );
};

const StatusIndicator: React.FC<{ status: DomainStatus }> = ({ status }) => {
  let badgeColor = "bg-gray-400"; // Default color
  switch (status) {
    case DomainStatus.NOT_STARTED:
      badgeColor = "bg-gray-400";
      break;
    case DomainStatus.SUCCESS:
      badgeColor = "bg-emerald-500";
      break;
    case DomainStatus.FAILED:
      badgeColor = "bg-red-500";
      break;
    case DomainStatus.TEMPORARY_FAILURE:
    case DomainStatus.PENDING:
      badgeColor = "bg-yellow-500";
      break;
    default:
      badgeColor = "bg-gray-400";
  }

  return <div className={` w-[1px] ${badgeColor} my-1.5 rounded-full`}></div>;
};
