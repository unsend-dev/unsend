"use client";

import { api } from "~/trpc/react";
import { Domain, DomainStatus } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@unsend/ui/src/breadcrumb";
import { DomainStatusBadge } from "../domain-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@unsend/ui/src/table";
import { TextWithCopyButton } from "@unsend/ui/src/text-with-copy";
import React from "react";
import { Switch } from "@unsend/ui/src/switch";
import DeleteDomain from "./delete-domain";
import SendTestMail from "./send-test-mail";
import { Button } from "@unsend/ui/src/button";
import Link from "next/link";
import { toast } from "@unsend/ui/src/toaster";

export default function DomainItemPage({
  params,
}: {
  params: { domainId: string };
}) {
  const domainQuery = api.domain.getDomain.useQuery(
    {
      id: Number(params.domainId),
    },
    {
      refetchInterval: (q) => (q?.state.data?.isVerifying ? 10000 : false),
      refetchIntervalInBackground: true,
    }
  );

  const verifyQuery = api.domain.startVerification.useMutation();

  const handleVerify = () => {
    verifyQuery.mutate(
      { id: Number(params.domainId) },
      {
        onSettled: () => {
          domainQuery.refetch();
        },
      }
    );
  };

  return (
    <div>
      {domainQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center  gap-4">
              {/* <div className="flex items-center gap-4">
              <h1 className="font-medium text-2xl">{domainQuery.data?.name}</h1>
            </div> */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/domains" className="text-lg">
                        Domains
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-lg" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-lg ">
                      {domainQuery.data?.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="">
                <DomainStatusBadge
                  status={domainQuery.data?.status || DomainStatus.NOT_STARTED}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <Button
                  variant="outline"
                  onClick={handleVerify}
                  disabled={domainQuery.data?.isVerifying}
                >
                  {domainQuery.data?.isVerifying
                    ? "Verifying..."
                    : domainQuery.data?.status === DomainStatus.SUCCESS
                      ? "Verify again"
                      : "Verify domain"}
                </Button>
              </div>
              {domainQuery.data ? (
                <SendTestMail domain={domainQuery.data} />
              ) : null}
            </div>
          </div>

          <div className=" border rounded-lg p-4">
            <p className="font-semibold text-xl">DNS records</p>
            <Table className="mt-2">
              <TableHeader className="">
                <TableRow className="">
                  <TableHead className="rounded-tl-xl">Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="">TTL</TableHead>
                  <TableHead className="">Priority</TableHead>
                  <TableHead className="rounded-tr-xl">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="">MX</TableCell>
                  <TableCell>
                    <TextWithCopyButton
                      value={`mail.${domainQuery.data?.subdomain || domainQuery.data?.name}`}
                    />
                  </TableCell>
                  <TableCell className="">
                    <TextWithCopyButton
                      value={`feedback-smtp.${domainQuery.data?.region}.amazonses.com`}
                      className="w-[200px] overflow-hidden text-ellipsis text-nowrap"
                    />
                    {/* <div className="w-[200px] overflow-hidden text-ellipsis text-nowrap">
                      {`feedback-smtp.${domainQuery.data?.region}.amazonses.com`}
                    </div> */}
                  </TableCell>
                  <TableCell className="">Auto</TableCell>
                  <TableCell className="">10</TableCell>
                  <TableCell className="">
                    <DnsVerificationStatus
                      status={domainQuery.data?.spfDetails ?? "NOT_STARTED"}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="">TXT</TableCell>
                  <TableCell>
                    <TextWithCopyButton
                      value={`unsend._domainkey.${domainQuery.data?.subdomain || domainQuery.data?.name}`}
                    />
                  </TableCell>
                  <TableCell className="">
                    <TextWithCopyButton
                      value={`p=${domainQuery.data?.publicKey}`}
                      className="w-[200px] overflow-hidden text-ellipsis"
                    />
                  </TableCell>
                  <TableCell className="">Auto</TableCell>
                  <TableCell className=""></TableCell>
                  <TableCell className="">
                    <DnsVerificationStatus
                      status={domainQuery.data?.dkimStatus ?? "NOT_STARTED"}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="">TXT</TableCell>
                  <TableCell>
                    <TextWithCopyButton
                      value={`mail.${domainQuery.data?.subdomain || domainQuery.data?.name}`}
                    />
                  </TableCell>
                  <TableCell className="">
                    <TextWithCopyButton
                      value={`v=spf1 include:amazonses.com ~all`}
                      className="w-[200px] overflow-hidden text-ellipsis text-nowrap"
                    />
                  </TableCell>
                  <TableCell className="">Auto</TableCell>
                  <TableCell className=""></TableCell>
                  <TableCell className="">
                    <DnsVerificationStatus
                      status={domainQuery.data?.spfDetails ?? "NOT_STARTED"}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="">TXT</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-muted-foreground">
                        (optional)
                      </span>
                      <TextWithCopyButton
                        value={`_dmarc.${domainQuery.data?.subdomain || domainQuery.data?.name}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="">
                    <TextWithCopyButton
                      value={`v=DMARC1; p=none;`}
                      className="w-[200px] overflow-hidden text-ellipsis text-nowrap"
                    />
                  </TableCell>
                  <TableCell className="">Auto</TableCell>
                  <TableCell className=""></TableCell>
                  <TableCell className="">
                    <DnsVerificationStatus
                      status={
                        domainQuery.data?.dmarcAdded ? "SUCCESS" : "NOT_STARTED"
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          {domainQuery.data ? (
            <DomainSettings domain={domainQuery.data} />
          ) : null}
        </div>
      )}
    </div>
  );
}

const DomainSettings: React.FC<{ domain: Domain }> = ({ domain }) => {
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
          utils.domain.invalidate();
          toast.success("Click tracking updated");
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
          utils.domain.invalidate();
          toast.success("Open tracking updated");
        },
      }
    );
  }
  return (
    <div className="rounded-lg p-4 border flex flex-col gap-6">
      <p className="font-semibold text-xl">Settings</p>
      <div className="flex flex-col gap-1">
        <div className="font-semibold">Click tracking</div>
        <p className=" text-muted-foreground text-sm">
          Track any links in your emails content.{" "}
        </p>
        <Switch
          checked={clickTracking}
          onCheckedChange={handleClickTrackingChange}
          className="data-[state=checked]:bg-emerald-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="font-semibold">Open tracking</div>
        <p className=" text-muted-foreground text-sm">
          Unsend adds a tracking pixel to every email you send. This allows you
          to see how many people open your emails. This will affect the delivery
          rate of your emails.
        </p>
        <Switch
          checked={openTracking}
          onCheckedChange={handleOpenTrackingChange}
          className="data-[state=checked]:bg-emerald-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-semibold text-lg text-destructive">Danger</p>

        <p className="text-destructive text-sm font-semibold">
          Deleting a domain will stop sending emails with this domain.
        </p>
        <DeleteDomain domain={domain} />
      </div>
    </div>
  );
};

const DnsVerificationStatus: React.FC<{ status: string }> = ({ status }) => {
  let badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10"; // Default color
  switch (status) {
    case DomainStatus.NOT_STARTED:
      badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10";
      break;
    case DomainStatus.SUCCESS:
      badgeColor = "bg-emerald-500/10 text-emerald-500 border-emerald-600/10";
      break;
    case DomainStatus.FAILED:
      badgeColor = "bg-red-500/10 text-red-600 border-red-500/20";
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
      className={` text-center min-w-[70px] capitalize rounded-md py-1 justify-center flex items-center ${badgeColor}`}
    >
      <span className="text-xs">
        {status.split("_").join(" ").toLowerCase()}
      </span>
    </div>
  );
};
