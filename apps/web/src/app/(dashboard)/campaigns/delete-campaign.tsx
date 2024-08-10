"use client";

import { Button } from "@unsend/ui/src/button";
import { Input } from "@unsend/ui/src/input";
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
import { Trash2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@unsend/ui/src/form";
import { Campaign } from "@prisma/client";

const campaignSchema = z.object({
  name: z.string(),
});

export const DeleteCampaign: React.FC<{
  campaign: Partial<Campaign> & { id: string };
}> = ({ campaign }) => {
  const [open, setOpen] = useState(false);
  const deleteCampaignMutation = api.campaign.deleteCampaign.useMutation();

  const utils = api.useUtils();

  const campaignForm = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
  });

  async function onCampaignDelete(values: z.infer<typeof campaignSchema>) {
    if (values.name !== campaign.name) {
      campaignForm.setError("name", {
        message: "Name does not match",
      });
      return;
    }

    deleteCampaignMutation.mutate(
      {
        campaignId: campaign.id,
      },
      {
        onSuccess: () => {
          utils.campaign.getCampaigns.invalidate();
          setOpen(false);
          toast.success(`Campaign deleted`);
        },
      }
    );
  }

  const name = campaignForm.watch("name");

  return (
    <Dialog
      open={open}
      onOpenChange={(_open) => (_open !== open ? setOpen(_open) : null)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 text-red-600/80" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Campaign</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-primary">{campaign.name}</span>?
            You can't reverse this.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Form {...campaignForm}>
            <form
              onSubmit={campaignForm.handleSubmit(onCampaignDelete)}
              className="space-y-4"
            >
              <FormField
                control={campaignForm.control}
                name="name"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {formState.errors.name ? (
                      <FormMessage />
                    ) : (
                      <FormDescription className=" text-transparent">
                        .
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={
                    deleteCampaignMutation.isPending || campaign.name !== name
                  }
                >
                  {deleteCampaignMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCampaign;
