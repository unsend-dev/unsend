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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@unsend/ui/src/form";

import { api } from "~/trpc/react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import * as tldts from "tldts";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const domainSchema = z.object({
  domain: z.string({ required_error: "Domain is required" }),
});

export default function AddDomain() {
  const [open, setOpen] = useState(false);
  const addDomainMutation = api.domain.createDomain.useMutation();

  const domainForm = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
  });

  const utils = api.useUtils();
  const router = useRouter();

  async function onDomainAdd(values: z.infer<typeof domainSchema>) {
    const domain = tldts.getDomain(values.domain);
    if (!domain) {
      domainForm.setError("domain", {
        message: "Invalid domain",
      });

      return;
    }

    addDomainMutation.mutate(
      {
        name: values.domain,
      },
      {
        onSuccess: async (data) => {
          utils.domain.domains.invalidate();
          await router.push(`/domains/${data.id}`);
          setOpen(false);
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
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Add domain
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new domain</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Form {...domainForm}>
            <form
              onSubmit={domainForm.handleSubmit(onDomainAdd)}
              className="space-y-8"
            >
              <FormField
                control={domainForm.control}
                name="domain"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="subdomain.example.com" {...field} />
                    </FormControl>
                    {formState.errors.domain ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        Use subdomains to separate transactional and marketing
                        emails.{" "}
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  className=" w-[100px] bg-white hover:bg-gray-100 focus:bg-gray-100"
                  type="submit"
                  disabled={addDomainMutation.isPending}
                >
                  {addDomainMutation.isPending ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
