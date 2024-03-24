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

export default function AddApiKey() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const addDomainMutation = api.apiKey.createToken.useMutation();

  const utils = api.useUtils();

  function handleSave() {
    addDomainMutation.mutate(
      {
        name,
        permission: "FULL",
      },
      {
        onSuccess: (data) => {
          utils.apiKey.invalidate();
          setApiKey(data);
        },
      }
    );
  }

  function handleCopy() {
    navigator.clipboard.writeText(apiKey);
    setApiKey("");
    setName("");
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(_open) => (_open !== open ? setOpen(_open) : null)}
    >
      <DialogTrigger asChild>
        <Button>Add API Key</Button>
      </DialogTrigger>
      {apiKey ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy API key</DialogTitle>
          </DialogHeader>
          <div className="py-2 bg-gray-200 rounded-lg">{apiKey}</div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleCopy}
              disabled={addDomainMutation.isPending}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new API key</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="name" className="text-right">
              API key name
            </Label>
            <Input
              id="name"
              placeholder="prod key"
              defaultValue=""
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              value={name}
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
      )}
    </Dialog>
  );
}
