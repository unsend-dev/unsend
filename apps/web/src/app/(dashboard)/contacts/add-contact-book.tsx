"use client";

import { Button } from "@unsend/ui/src/button";
import { Input } from "@unsend/ui/src/input";
import { Label } from "@unsend/ui/src/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@unsend/ui/src/dialog";

import { api } from "~/trpc/react";
import { useState } from "react";
import { CheckIcon, ClipboardCopy, Eye, EyeOff, Plus } from "lucide-react";
import { toast } from "@unsend/ui/src/toaster";
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

const apiKeySchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1, {
    message: "Name is required",
  }),
});

export default function AddContactBook() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const createApiKeyMutation = api.apiKey.createToken.useMutation();
  const [isCopied, setIsCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const utils = api.useUtils();

  const apiKeyForm = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: "",
    },
  });

  function handleSave(values: z.infer<typeof apiKeySchema>) {
    createApiKeyMutation.mutate(
      {
        name: values.name,
        permission: "FULL",
      },
      {
        onSuccess: (data) => {
          utils.apiKey.invalidate();
          setApiKey(data);
          apiKeyForm.reset();
        },
      }
    );
  }

  function handleCopy() {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  function copyAndClose() {
    handleCopy();
    setApiKey("");
    setOpen(false);
    setShowApiKey(false);
    toast.success("API key copied to clipboard");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(_open) => (_open !== open ? setOpen(_open) : null)}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Add Contact Book
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new contact book</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Form {...apiKeyForm}>
            <form
              onSubmit={apiKeyForm.handleSubmit(handleSave)}
              className="space-y-8"
            >
              <FormField
                control={apiKeyForm.control}
                name="name"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>Contact book name</FormLabel>
                    <FormControl>
                      <Input placeholder="My contacts" {...field} />
                    </FormControl>
                    {formState.errors.name ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        eg: product / website / newsletter name
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  className=" w-[100px] bg-white hover:bg-gray-100 focus:bg-gray-100"
                  type="submit"
                  disabled={createApiKeyMutation.isPending}
                >
                  {createApiKeyMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
