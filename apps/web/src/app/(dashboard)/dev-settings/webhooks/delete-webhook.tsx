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
import { Webhook } from "@prisma/client";

const deleteWebhookSchema = z.object({
  url: z.string(),
});

export const DeleteWebhook: React.FC<{
  webhook: Partial<Webhook> & { id: string }
}> = ({ webhook }) => {
  const [open, setOpen] = useState(false);
  const deleteWebhookMutation = api.webhook.delete.useMutation();

  const utils = api.useUtils();

  const webhookForm = useForm<z.infer<typeof deleteWebhookSchema>>({
    resolver: zodResolver(deleteWebhookSchema),
  });

  async function onWebhookDelete(values: z.infer<typeof deleteWebhookSchema>) {
    if (values.url !== webhook.url) {
      webhookForm.setError("url", {
        message: "URL does not match",
      });
      return;
    }

    deleteWebhookMutation.mutate(
      webhook.id,
      {
        onSuccess: () => {
          utils.webhook.list.invalidate();
          setOpen(false);
          toast.success(`Webhook deleted`);
        },
      }
    );
  }

  const url = webhookForm.watch("url");

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
          <DialogTitle>Delete Webhook</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{webhook.url}</span>
            ? You can't reverse this.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Form {...webhookForm}>
            <form
              onSubmit={webhookForm.handleSubmit(onWebhookDelete)}
              className="space-y-4"
            >
              <FormField
                control={webhookForm.control}
                name="url"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {formState.errors.url ? (
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
                    deleteWebhookMutation.isPending || webhook.url !== url
                  }
                >
                  {deleteWebhookMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteWebhook;
