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
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddDomain() {
  const [open, setOpen] = useState(false);
  const [domainName, setDomainName] = useState("");
  const addDomainMutation = api.domain.createDomain.useMutation();

  const utils = api.useUtils();
  const router = useRouter();

  function handleSave() {
    addDomainMutation.mutate(
      {
        name: domainName,
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
          <DialogDescription>This creates a new domain</DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Label htmlFor="name" className="text-right">
            Domain Name
          </Label>
          <Input
            id="name"
            placeholder="subdomain.example.com"
            defaultValue=""
            className="col-span-3"
            onChange={(e) => setDomainName(e.target.value)}
            value={domainName}
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={addDomainMutation.isPending}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
