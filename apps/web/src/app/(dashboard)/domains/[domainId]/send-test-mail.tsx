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
import { Send, SendHorizonal } from "lucide-react";

export const SendTestMail: React.FC<{ domain: Domain }> = ({ domain }) => {
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
        <Button>
          <SendHorizonal className="h-4 w-4 mr-2" />
          Send test email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send test email</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SendTestMail;
