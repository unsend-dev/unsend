"use client";

import { Button } from "@unsend/ui/src/button";
import { api } from "~/trpc/react";
import { toast } from "@unsend/ui/src/toaster";
import { RotateCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@unsend/ui/src/tooltip";

export const ResendTeamInvite: React.FC<{
  invite: { id: string; email: string };
}> = ({ invite }) => {
  const resendInviteMutation = api.team.resendTeamInvite.useMutation();

  async function onResendInvite() {
    resendInviteMutation.mutate(
      {
        inviteId: invite.id,
      },
      {
        onSuccess: async () => {
          toast.success(`Invite resent to ${invite.email}`);
        },
        onError: async (error) => {
          toast.error(error.message);
        },
      }
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={onResendInvite}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Resend invite</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ResendTeamInvite;
