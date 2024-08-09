"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@unsend/ui/src/breadcrumb";
import Link from "next/link";

import Spinner from "@unsend/ui/src/spinner";
import { formatDistanceToNow } from "date-fns";
import { api } from "~/trpc/react";
import { EmailStatusIcon } from "../../emails/email-status-badge";
import { EmailStatus } from "@prisma/client";
import { Separator } from "@unsend/ui/src/separator";
import { ExternalLinkIcon } from "lucide-react";

export default function CampaignDetailsPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const { data: campaign, isLoading } = api.campaign.getCampaign.useQuery({
    campaignId: params.campaignId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-5 h-5 text-primary" />
      </div>
    );
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  const statusCards = [
    {
      status: "delivered",
      count: campaign.delivered,
      percentage: 100,
    },
    {
      status: "unsubscribed",
      count: campaign.unsubscribed,
      percentage: (campaign.unsubscribed / campaign.delivered) * 100,
    },
    {
      status: "clicked",
      count: campaign.clicked,
      percentage: (campaign.clicked / campaign.delivered) * 100,
    },
    {
      status: "opened",
      count: campaign.opened,
      percentage: (campaign.opened / campaign.delivered) * 100,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/campaigns" className="text-lg">
                Campaigns
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-lg" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-lg ">
              {campaign.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className=" rounded-lg shadow mt-10">
        <h2 className="text-xl font-semibold mb-4"> Statistics</h2>
        <div className="flex  gap-4">
          {statusCards.map((card) => (
            <div
              key={card.status}
              className="h-[100px] w-1/4  bg-secondary/10 border rounded-lg p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                {card.status !== "total" ? (
                  <CampaignStatusBadge status={card.status} />
                ) : null}
                <div className="capitalize">{card.status.toLowerCase()}</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-primary font-light text-2xl font-mono">
                  {card.count}
                </div>
                {card.status !== "total" ? (
                  <div className="text-sm pb-1">
                    {card.percentage.toFixed(1)}%
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {campaign.html && (
        <div className=" rounded-lg shadow mt-16">
          <h2 className="text-xl font-semibold mb-4">Email</h2>

          <div className="p-2 rounded-lg border  flex flex-col gap-4 w-full">
            <div className="flex gap-2 mt-2">
              <span className="w-[65px] text-muted-foreground ">From</span>
              <span>{campaign.from}</span>
            </div>
            <Separator />
            <div className="flex gap-2">
              <span className="w-[65px] text-muted-foreground ">To</span>
              {campaign.contactBookId ? (
                <Link
                  href={`/contacts/${campaign.contactBookId}`}
                  className="text-primary px-4 p-1 bg-muted text-sm rounded-md flex gap-1 items-center"
                  target="_blank"
                >
                  {campaign.contactBook?.name}
                  <ExternalLinkIcon className="w-4 h-4 " />
                </Link>
              ) : (
                <div>No one</div>
              )}
            </div>
            <Separator />
            <div className="flex gap-2">
              <span className="w-[65px] text-muted-foreground ">Subject</span>
              <span>{campaign.subject}</span>
            </div>
            <div className=" dark:bg-slate-50 overflow-auto text-black rounded py-8">
              <div dangerouslySetInnerHTML={{ __html: campaign.html ?? "" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const CampaignStatusBadge: React.FC<{ status: string }> = ({
  status,
}) => {
  let outsideColor = "bg-gray-600";
  let insideColor = "bg-gray-600/50";

  switch (status) {
    case "delivered":
      outsideColor = "bg-emerald-500/30";
      insideColor = "bg-emerald-500";
      break;
    case "bounced":
    case "unsubscribed":
      outsideColor = "bg-red-500/30";
      insideColor = "bg-red-500";
      break;
    case "clicked":
      outsideColor = "bg-cyan-500/30";
      insideColor = "bg-cyan-500";
      break;
    case "opened":
      outsideColor = "bg-indigo-500/30";
      insideColor = "bg-indigo-500";
      break;

    case "complained":
      outsideColor = "bg-yellow-500/30";
      insideColor = "bg-yellow-500";
      break;
    default:
      outsideColor = "bg-gray-600/40";
      insideColor = "bg-gray-600";
  }

  return (
    <div
      className={`flex justify-center items-center p-1.5 ${outsideColor} rounded-full`}
    >
      <div className={`h-2 w-2 rounded-full ${insideColor}`}></div>
    </div>
  );
};
