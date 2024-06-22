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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@unsend/ui/src/select";

const domainSchema = z.object({
  region: z.string({ required_error: "Region is required" }),
  domain: z.string({ required_error: "Domain is required" }),
});

export default function AddDomain() {
  const [open, setOpen] = useState(false);

  const regionQuery = api.domain.getAvailableRegions.useQuery();

  const addDomainMutation = api.domain.createDomain.useMutation();

  const domainForm = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      region: "",
      domain: "",
    },
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
        region: values.region,
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
              <FormField
                control={domainForm.control}
                name="region"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={regionQuery.isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regionQuery.data?.map((region) => (
                          <SelectItem value={region} key={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formState.errors.region ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        Select the region from where the email is sent{" "}
                      </FormDescription>
                    )}
                    <FormMessage />
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
