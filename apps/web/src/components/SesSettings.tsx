"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@unsend/ui/src/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Input } from "@unsend/ui/src/input";
import { Button } from "@unsend/ui/src/button";
import Spinner from "@unsend/ui/src/spinner";

const FormSchema = z.object({
  region: z.string(),
  unsendUrl: z.string().url(),
});

export default function SesSettings() {
  const addSesSettings = api.admin.addSesSettings.useMutation();
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      region: "us-east-1",
      unsendUrl: "",
    },
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addSesSettings.mutate(data, {
      onSuccess: () => {
        utils.admin.invalidate();
        router.replace("/dashboard");
      },
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className=" w-[300px] flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-center">Create Team</h1>
        </div>
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
                  <FormControl>
                    <Input placeholder="Region" className="w-full" {...field} />
                  </FormControl>
                  {formState.errors.region ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      The region of the SES account
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unsendUrl"
              render={({ field, formState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Callback url"
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
            <Button type="submit" disabled={addSesSettings.isPending}>
              {addSesSettings.isPending ? (
                <Spinner className="w-5 h-5" />
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
