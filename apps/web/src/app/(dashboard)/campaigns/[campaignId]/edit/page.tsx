"use client";

import { api } from "~/trpc/react";
import { Spinner } from "@unsend/ui/src/spinner";
import { Button } from "@unsend/ui/src/button";
import { Input } from "@unsend/ui/src/input";
import { Editor } from "@unsend/email-editor";
import { useState } from "react";
import { Campaign } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@unsend/ui/src/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@unsend/ui/src/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@unsend/ui/src/form";
import { toast } from "@unsend/ui/src/toaster";
import { useDebouncedCallback } from "use-debounce";
import { formatDistanceToNow } from "date-fns";

const sendSchema = z.object({
  confirmation: z.string(),
});

export default function EditCampaignPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const {
    data: campaign,
    isLoading,
    error,
  } = api.campaign.getCampaign.useQuery(
    { campaignId: params.campaignId },
    {
      enabled: !!params.campaignId,
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Failed to load campaign</p>
      </div>
    );
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return <CampaignEditor campaign={campaign} />;
}

function CampaignEditor({ campaign }: { campaign: Campaign }) {
  const contactBooksQuery = api.contacts.getContactBooks.useQuery();
  const utils = api.useUtils();

  const [json, setJson] = useState<Record<string, any> | undefined>(
    campaign.content ? JSON.parse(campaign.content) : undefined
  );
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(campaign.name);
  const [subject, setSubject] = useState(campaign.subject);
  const [from, setFrom] = useState(campaign.from);
  const [contactBookId, setContactBookId] = useState(campaign.contactBookId);
  const [openSendDialog, setOpenSendDialog] = useState(false);

  const updateCampaignMutation = api.campaign.updateCampaign.useMutation({
    onSuccess: () => {
      utils.campaign.getCampaign.invalidate();
      setIsSaving(false);
    },
  });
  const sendCampaignMutation = api.campaign.sendCampaign.useMutation();

  const sendForm = useForm<z.infer<typeof sendSchema>>({
    resolver: zodResolver(sendSchema),
  });

  function updateEditorContent() {
    updateCampaignMutation.mutate({
      campaignId: campaign.id,
      content: JSON.stringify(json),
    });
  }

  const deboucedUpdateCampaign = useDebouncedCallback(
    updateEditorContent,
    1000
  );

  async function onSendCampaign(values: z.infer<typeof sendSchema>) {
    if (
      values.confirmation?.toLocaleLowerCase() !== "Send".toLocaleLowerCase()
    ) {
      sendForm.setError("confirmation", {
        message: "Please type 'Send' to confirm",
      });
      return;
    }

    sendCampaignMutation.mutate(
      {
        campaignId: campaign.id,
      },
      {
        onSuccess: () => {
          setOpenSendDialog(false);
          toast.success(`Campaign sent successfully`);
        },
        onError: (error) => {
          toast.error(`Failed to send campaign: ${error.message}`);
        },
      }
    );
  }

  const confirmation = sendForm.watch("confirmation");

  return (
    <div className="p-4 container mx-auto">
      <div className="w-[664px] mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className=" border-0 focus:ring-0 focus:outline-none px-0.5 w-[300px]"
            onBlur={() => {
              if (name === campaign.name || !name) {
                return;
              }
              updateCampaignMutation.mutate(
                {
                  campaignId: campaign.id,
                  name,
                },
                {
                  onError: (e) => {
                    toast.error(`${e.message}. Reverting changes.`);
                    setName(campaign.name);
                  },
                }
              );
            }}
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {isSaving ? (
                <div className="h-2 w-2 bg-yellow-500 rounded-full" />
              ) : (
                <div className="h-2 w-2 bg-emerald-500 rounded-full" />
              )}
              {formatDistanceToNow(campaign.updatedAt) === "less than a minute"
                ? "just now"
                : `${formatDistanceToNow(campaign.updatedAt)} ago`}
            </div>
            <Dialog open={openSendDialog} onOpenChange={setOpenSendDialog}>
              <DialogTrigger asChild>
                <Button variant="default">Send Campaign</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Campaign</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to send this campaign? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                  <Form {...sendForm}>
                    <form
                      onSubmit={sendForm.handleSubmit(onSendCampaign)}
                      className="space-y-4"
                    >
                      <FormField
                        control={sendForm.control}
                        name="confirmation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type 'Send' to confirm</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={
                            sendCampaignMutation.isPending ||
                            confirmation?.toLocaleLowerCase() !==
                              "Send".toLocaleLowerCase()
                          }
                        >
                          {sendCampaignMutation.isPending
                            ? "Sending..."
                            : "Send"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mb-4 mt-8">
          <label className="block text-sm font-medium ">Subject</label>
          <Input
            type="text"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
            }}
            onBlur={() => {
              if (subject === campaign.subject || !subject) {
                return;
              }
              updateCampaignMutation.mutate(
                {
                  campaignId: campaign.id,
                  subject,
                },
                {
                  onError: (e) => {
                    toast.error(`${e.message}. Reverting changes.`);
                    setSubject(campaign.subject);
                  },
                }
              );
            }}
            className="mt-1 block w-full rounded-md  shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium ">From</label>
          <Input
            type="text"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
            }}
            className="mt-1 block w-full rounded-md  shadow-sm"
            placeholder="Friendly name<hello@example.com>"
            onBlur={() => {
              if (from === campaign.from) {
                return;
              }
              updateCampaignMutation.mutate(
                {
                  campaignId: campaign.id,
                  from,
                },
                {
                  onError: (e) => {
                    toast.error(`${e.message}. Reverting changes.`);
                    setFrom(campaign.from);
                  },
                }
              );
            }}
          />
        </div>
        <div className="mb-12">
          <label className="block text-sm font-medium mb-1">To</label>
          {contactBooksQuery.isLoading ? (
            <Spinner className="w-6 h-6" />
          ) : (
            <Select
              value={contactBookId ?? ""}
              onValueChange={(val) => {
                // Update the campaign's contactBookId
                updateCampaignMutation.mutate(
                  {
                    campaignId: campaign.id,
                    contactBookId: val,
                  },
                  {
                    onError: () => {
                      setContactBookId(campaign.contactBookId);
                    },
                  }
                );
                setContactBookId(val);
              }}
            >
              <SelectTrigger className="w-[300px]">
                {contactBooksQuery.data?.find(
                  (book) => book.id === contactBookId
                )?.name || "Select a contact book"}
              </SelectTrigger>
              <SelectContent>
                {contactBooksQuery.data?.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Editor
          initialContent={json}
          onUpdate={(content) => {
            setJson(content.getJSON());
            setIsSaving(true);
            deboucedUpdateCampaign();
          }}
          variables={["email", "firstName", "lastName"]}
        />
      </div>
    </div>
  );
}
