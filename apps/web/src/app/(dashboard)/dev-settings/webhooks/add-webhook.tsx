"use client";

import { Button } from "@unsend/ui/src/button";
import { Input } from "@unsend/ui/src/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@unsend/ui/src/dialog";
import { api } from "~/trpc/react";
import { useState } from "react";
import { Plus } from "lucide-react";
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
import { webhookSchema, webhookSchemaForm } from "~/lib/zod/webhook-schema";
import { WebhookEvent } from "@prisma/client";
import { Checkbox } from "@unsend/ui/src/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@unsend/ui/src/select";


export default function AddWebhook() {
  const [open, setOpen] = useState(false);
  const createWebhookMutation = api.webhook.create.useMutation();
  const domainsQuery = api.domain.domains.useQuery();

  const utils = api.useUtils();

  const webhookForm = useForm<z.infer<typeof webhookSchemaForm>>({
    resolver: zodResolver(webhookSchemaForm),
    defaultValues: {
      url: "",
      events: [],
        domainId: undefined,
    },
  });

  function handleSave(values: z.infer<typeof webhookSchemaForm>) {
    const domainId = values.domainId && values.domainId !== 'all' ? Number(values.domainId) : undefined;

    createWebhookMutation.mutate(
      {
        url: values.url,
        events: values.events,
        domainId,
      },
      {
        onSuccess: () => {
          utils.webhook.list.invalidate();
          webhookForm.reset();
          setOpen(false);
        },
      }
    );
  }

  const eventKeys = Object.keys(WebhookEvent) as (keyof typeof WebhookEvent)[];

  return (
    <Dialog
      open={open}
      onOpenChange={(_open) => (_open !== open ? setOpen(_open) : null)}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          Add Webhook
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new webhook</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Form {...webhookForm}>
            <form
              onSubmit={webhookForm.handleSubmit(handleSave)}
              className="space-y-8"
            >
              <FormField
                control={webhookForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Webhook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/webhook" {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL to send webhook events to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={webhookForm.control}
                name="events"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Events</FormLabel>
                      <FormDescription>
                        Select the events you want to subscribe to.
                      </FormDescription>
                    </div>
                    <div className="space-y-2">
                      {eventKeys.map((eventKey) => (
                        <FormField
                          key={eventKey}
                          control={webhookForm.control}
                          name="events"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={eventKey}
                                className="flex flex-row items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(eventKey)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, eventKey])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== eventKey
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {eventKey}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={webhookForm.control}
                name="domainId"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>Domains</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ? field.value.toString() : 'all'}
                      disabled={domainsQuery.isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'all'}>
                          All Domains
                        </SelectItem>
                        {domainsQuery.data?.map((domain) => (
                          <SelectItem value={domain.id.toString()} key={domain.id}>
                            {domain.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formState.errors.domainId ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        Select a expecific domain or all domains to subscribe to.
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  className="w-[100px] hover:bg-gray-100 focus:bg-gray-100"
                  type="submit"
                  disabled={createWebhookMutation.isPending}
                >
                  {createWebhookMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}