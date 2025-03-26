"use client";

import { Button } from "@unsend/ui/src/button";
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
import { PencilIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@unsend/ui/src/toaster";
import { Role } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@unsend/ui/src/select";

const teamUserSchema = z.object({
  role: z.enum(["MEMBER", "ADMIN"]),
});

export const EditTeamMember: React.FC<{
  teamUser: { userId: string; role: Role };
}> = ({ teamUser }) => {
  const [open, setOpen] = useState(false);
  const updateTeamUserMutation = api.team.updateTeamUserRole.useMutation();

  const utils = api.useUtils();

  const teamUserForm = useForm<z.infer<typeof teamUserSchema>>({
    resolver: zodResolver(teamUserSchema),
    defaultValues: {
      role: teamUser.role,
    },
  });

  async function onTeamUserUpdate(values: z.infer<typeof teamUserSchema>) {
    updateTeamUserMutation.mutate(
      {
        userId: teamUser.userId,
        role: values.role,
      },
      {
        onSuccess: async () => {
          utils.team.getTeamUsers.invalidate();
          setOpen(false);
          toast.success("Team member role updated successfully");
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
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team Member Role</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Form {...teamUserForm}>
            <form
              onSubmit={teamUserForm.handleSubmit(onTeamUserUpdate)}
              className="space-y-8"
            >
              <FormField
                control={teamUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={updateTeamUserMutation.isPending}
                  className="w-[150px]"
                >
                  Update Role
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamMember;
