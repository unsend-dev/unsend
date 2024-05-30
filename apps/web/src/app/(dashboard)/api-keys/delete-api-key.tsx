"use client";

import { Button } from "@unsend/ui/src/button";
import { Input } from "@unsend/ui/src/input";
import { Label } from "@unsend/ui/src/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@unsend/ui/src/dialog";
import { api } from "~/trpc/react";
import React, { useState } from "react";
import { ApiKey, Domain } from "@prisma/client";
import { toast } from "@unsend/ui/src/toaster";
import { Trash2 } from "lucide-react";

export const DeleteApiKey: React.FC<{
  apiKey: Partial<ApiKey> & { id: number };
}> = ({ apiKey }) => {
  const [open, setOpen] = useState(false);
  const [domainName, setDomainName] = useState("");
  const deleteApiKeyMutation = api.apiKey.deleteApiKey.useMutation();

  const utils = api.useUtils();

  function handleSave() {
    deleteApiKeyMutation.mutate(
      {
        id: apiKey.id,
      },
      {
        onSuccess: () => {
          utils.apiKey.invalidate();
          setOpen(false);
          toast.success(`API key deleted`);
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
          <Trash2 className="h-4 w-4 text-red-600/80" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete API key</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-primary">{apiKey.name}</span>?
            You can't reverse this.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Label htmlFor="name" className="text-right">
            Type <span className="text-primary">{apiKey.name}</span> to confirm
          </Label>
          <Input
            id="name"
            defaultValue=""
            className="mt-2"
            onChange={(e) => setDomainName(e.target.value)}
            value={domainName}
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            variant="destructive"
            onClick={handleSave}
            disabled={
              deleteApiKeyMutation.isPending || apiKey.name !== domainName
            }
          >
            {deleteApiKeyMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteApiKey;
