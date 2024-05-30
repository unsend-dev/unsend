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

export default function AddApiKey() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const addDomainMutation = api.apiKey.createToken.useMutation();
  const [isCopied, setIsCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

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
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  function copyAndClose() {
    handleCopy();
    setApiKey("");
    setName("");
    setOpen(false);
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
          Add API Key
        </Button>
      </DialogTrigger>
      {apiKey ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy API key</DialogTitle>
          </DialogHeader>
          <div className="py-1 bg-secondary rounded-lg px-4 flex items-center justify-between mt-2">
            <div>
              {showApiKey ? (
                <p className="text-sm">{apiKey}</p>
              ) : (
                <div className="flex gap-1">
                  {Array.from({ length: 30 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-1 h-1 bg-muted-foreground rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="hover:bg-transparent p-0 cursor-pointer  group-hover:opacity-100"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                className="hover:bg-transparent p-0 cursor-pointer  group-hover:opacity-100"
                onClick={handleCopy}
              >
                {isCopied ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ClipboardCopy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div></div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={copyAndClose}
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
              className="col-span-3 mt-1"
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
