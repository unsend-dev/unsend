"use client";

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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Input } from "@unsend/ui/src/input";
import { Button } from "@unsend/ui/src/button";
import Spinner from "@unsend/ui/src/spinner";
import { toast } from "@unsend/ui/src/toaster";

const FormSchema = z.object({
  region: z.string(),
  unsendUrl: z.string().url(),
  sendRate: z.number(),
});

type SesSettingsProps = {
  onSuccess?: () => void;
};

export const AddSesSettings: React.FC<SesSettingsProps> = ({ onSuccess }) => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className=" w-[400px] flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-center">
            Add SES Settings
          </h1>
        </div>
        <AddSesSettingsForm onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export const AddSesSettingsForm: React.FC<SesSettingsProps> = ({
  onSuccess,
}) => {
  const addSesSettings = api.admin.addSesSettings.useMutation();

  const utils = api.useUtils();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      region: "",
      unsendUrl: "",
      sendRate: 1,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!data.unsendUrl.startsWith("https://")) {
      form.setError("unsendUrl", {
        message: "URL must start with https://",
      });
      return;
    }

    if (data.unsendUrl.includes("localhost")) {
      form.setError("unsendUrl", {
        message: "URL must be a valid url",
      });
      return;
    }

    addSesSettings.mutate(data, {
      onSuccess: () => {
        utils.admin.invalidate();
        onSuccess?.();
      },
      onError: (e) => {
        toast.error("Failed to create", {
          description: e.message,
        });
      },
    });
  }

  const onRegionInputOutOfFocus = async () => {
    const region = form.getValues("region");
    const quota = await utils.admin.getQuotaForRegion.fetch({ region });
    form.setValue("sendRate", quota ?? 1);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col gap-8 w-full"
      >
        <FormField
          control={form.control}
          name="region"
          render={({ field, formState }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Input
                  placeholder="us-east-1"
                  className="w-full"
                  {...field}
                  onBlur={() => {
                    onRegionInputOutOfFocus();
                    field.onBlur();
                  }}
                />
              </FormControl>
              {formState.errors.region ? (
                <FormMessage />
              ) : (
                <FormDescription>The region of the SES account</FormDescription>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unsendUrl"
          render={({ field, formState }) => (
            <FormItem>
              <FormLabel>Callback URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              {formState.errors.unsendUrl ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  This url should be accessible from the internet. Will be
                  called from SES
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sendRate"
          render={({ field, formState }) => (
            <FormItem>
              <FormLabel>Send Rate</FormLabel>
              <FormControl>
                <Input placeholder="1" className="w-full" {...field} />
              </FormControl>
              {formState.errors.sendRate ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  The number of emails to send per second.
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={addSesSettings.isPending}
          className="w-[200px] mx-auto"
        >
          {addSesSettings.isPending ? (
            <Spinner className="w-5 h-5" />
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </Form>
  );
};
