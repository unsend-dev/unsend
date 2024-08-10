"use client";

import { Button } from "@unsend/ui/src/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@unsend/ui/src/dialog";
import { api } from "~/trpc/react";
import React, { useState } from "react";
import { toast } from "@unsend/ui/src/toaster";
import { Copy } from "lucide-react";
import { Campaign } from "@prisma/client";

export const DuplicateCampaign: React.FC<{
  campaign: Partial<Campaign> & { id: string };
}> = ({ campaign }) => {
  const [open, setOpen] = useState(false);
  const duplicateCampaignMutation =
    api.campaign.duplicateCampaign.useMutation();

  const utils = api.useUtils();

  async function onCampaignDuplicate() {
    duplicateCampaignMutation.mutate(
      {
        campaignId: campaign.id,
      },
      {
        onSuccess: () => {
          utils.campaign.getCampaigns.invalidate();
          setOpen(false);
          toast.success(`Campaign duplicated`);
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(_open) => (_open !== open ? setOpen(_open) : null)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Copy className="h-4 w-4 text-blue-600/80" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate Campaign</DialogTitle>
          <DialogDescription>
            Are you sure you want to duplicate{" "}
            <span className="font-semibold text-primary">{campaign.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <div className="flex justify-end">
            <Button
              onClick={onCampaignDuplicate}
              variant="default"
              disabled={duplicateCampaignMutation.isPending}
            >
              {duplicateCampaignMutation.isPending
                ? "Duplicating..."
                : "Duplicate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateCampaign;
