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

const contactBookSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1, {
    message: "Name is required",
  }),
});

export default function AddContactBook() {
  const [open, setOpen] = useState(false);
  const createContactBookMutation =
    api.contacts.createContactBook.useMutation();

  const utils = api.useUtils();

  const contactBookForm = useForm<z.infer<typeof contactBookSchema>>({
    resolver: zodResolver(contactBookSchema),
    defaultValues: {
      name: "",
    },
  });

  function handleSave(values: z.infer<typeof contactBookSchema>) {
    createContactBookMutation.mutate(
      {
        name: values.name,
      },
      {
        onSuccess: () => {
          utils.contacts.getContactBooks.invalidate();
          contactBookForm.reset();
          setOpen(false);
          toast.success("Contact book created successfully");
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
          Add Contact Book
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new contact book</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Form {...contactBookForm}>
            <form
              onSubmit={contactBookForm.handleSubmit(handleSave)}
              className="space-y-8"
            >
              <FormField
                control={contactBookForm.control}
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
                  disabled={createContactBookMutation.isPending}
                >
                  {createContactBookMutation.isPending
                    ? "Creating..."
                    : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
