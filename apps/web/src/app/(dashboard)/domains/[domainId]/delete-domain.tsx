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
import { Domain } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "@unsend/ui/src/toaster";

export const DeleteDomain: React.FC<{ domain: Domain }> = ({ domain }) => {
  const [open, setOpen] = useState(false);
  const [domainName, setDomainName] = useState("");
  const deleteDomainMutation = api.domain.deleteDomain.useMutation();

  const utils = api.useUtils();

  const router = useRouter();

  function handleSave() {
    deleteDomainMutation.mutate(
      {
        id: domain.id,
      },
      {
        onSuccess: () => {
          utils.domain.domains.invalidate();
          setOpen(false);
          toast.success(`Domain ${domain.name} deleted`);
          router.replace("/domains");
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
        <Button variant="destructive" className="w-[150px]" size="sm">
          Delete domain
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete domain</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-primary">{domain.name}</span>?
            You can't reverse this.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Label htmlFor="name" className="text-right">
            Type <span className="text-primary">{domain.name}</span> to confirm
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
              deleteDomainMutation.isPending || domainName !== domain.name
            }
          >
            {deleteDomainMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDomain;
