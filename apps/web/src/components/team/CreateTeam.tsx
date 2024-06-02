"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@unsend/ui/src/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@unsend/ui/src/form";
import { Input } from "@unsend/ui/src/input";
import { Spinner } from "@unsend/ui/src/spinner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
});

export default function CreateTeam() {
  const createTeam = api.team.createTeam.useMutation();
  const utils = api.useUtils();

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createTeam.mutate(data, {
      onSuccess: () => {
        utils.team.invalidate();
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
              name="name"
              render={({ field, formState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Team name"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  {formState.errors.name ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Request admin to join existing team
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createTeam.isPending}>
              {createTeam.isPending ? (
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
