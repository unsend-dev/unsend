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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@unsend/ui/src/form";

import { api } from "~/trpc/react";
import { useState } from "react";
import { Edit } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@unsend/ui/src/toaster";

const contactBookSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const EditContactBook: React.FC<{
  contactBook: { id: string; name: string };
}> = ({ contactBook }) => {
  const [open, setOpen] = useState(false);
  const updateContactBookMutation =
    api.contacts.updateContactBook.useMutation();

  const utils = api.useUtils();

  const contactBookForm = useForm<z.infer<typeof contactBookSchema>>({
    resolver: zodResolver(contactBookSchema),
    defaultValues: {
      name: contactBook.name || "",
    },
  });

  async function onContactBookUpdate(
    values: z.infer<typeof contactBookSchema>
  ) {
    updateContactBookMutation.mutate(
      {
        contactBookId: contactBook.id,
        ...values,
      },
      {
        onSuccess: async () => {
          utils.contacts.getContactBooks.invalidate();
          setOpen(false);
          toast.success("Contact book updated successfully");
        },
        onError: async (error) => {
          toast.error(error.message);
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
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact Book</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Form {...contactBookForm}>
            <form
              onSubmit={contactBookForm.handleSubmit(onContactBookUpdate)}
              className="space-y-8"
            >
              <FormField
                control={contactBookForm.control}
                name="name"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact Book Name" {...field} />
                    </FormControl>
                    {formState.errors.name ? <FormMessage /> : null}
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  className=" w-[100px] bg-white hover:bg-gray-100 focus:bg-gray-100"
                  type="submit"
                  disabled={updateContactBookMutation.isPending}
                >
                  {updateContactBookMutation.isPending
                    ? "Updating..."
                    : "Update"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactBook;
