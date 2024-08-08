"use client";

import Spinner from "@unsend/ui/src/spinner";
import { formatDistanceToNow } from "date-fns";
import { api } from "~/trpc/react";
import { EmailStatusIcon } from "../../emails/email-status-badge";
import { EmailStatus } from "@prisma/client";

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
    { status: "total", count: campaign.total, percentage: 100 },
    {
      status: EmailStatus.DELIVERED,
      count: campaign.delivered,
      percentage: (campaign.delivered / campaign.total) * 100,
    },
    {
      status: EmailStatus.BOUNCED,
      count: campaign.bounced,
      percentage: (campaign.bounced / campaign.total) * 100,
    },
    {
      status: EmailStatus.CLICKED,
      count: campaign.clicked,
      percentage: (campaign.clicked / campaign.total) * 100,
    },
    {
      status: EmailStatus.OPENED,
      count: campaign.opened,
      percentage: (campaign.opened / campaign.total) * 100,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{campaign?.name}</h1>
      <div className=" rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Campaign Statistics</h2>
        <div className="flex  gap-4">
          {statusCards.map((card) => (
            <div
              key={card.status}
              className="h-[100px] w-1/5  bg-secondary/10 border rounded-lg p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                {card.status !== "total" ? (
                  <EmailStatusIcon status={card.status as EmailStatus} />
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
        <div className=" rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Email</h2>

          <div className="bg-slate-50 border p-4 rounded-md">
            <div dangerouslySetInnerHTML={{ __html: campaign.html }} />
          </div>
        </div>
      )}
    </div>
  );
}
