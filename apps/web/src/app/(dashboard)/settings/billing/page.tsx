"use client";

import { Button } from "@unsend/ui/src/button";
import { Card } from "@unsend/ui/src/card";
import { Spinner } from "@unsend/ui/src/spinner";
import { useTeam } from "~/providers/team-context";
import { api } from "~/trpc/react";

export default function SettingsPage() {
  const { currentTeam } = useTeam();
  const checkoutMutation = api.billing.createCheckoutSession.useMutation();
  const manageSessionUrl = api.billing.getManageSessionUrl.useMutation();

  const onClick = async () => {
    const url = await checkoutMutation.mutateAsync();
    if (url) {
      window.location.href = url;
    }
  };

  const onManageClick = async () => {
    const url = await manageSessionUrl.mutateAsync();
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div>
      <Card className=" rounded-xl mt-10 border-green-300 dark:border-green-800 p-4 px-8">
        <div>
          <div className="text-sm text-muted-foreground">Current Plan</div>
          <div className="uppercase text-lg  font-mono">
            {currentTeam?.plan.toLowerCase()}
          </div>
          <div className=" space-y-1 mt-2">
            <div className="text-sm text-muted-foreground">
              You can send {currentTeam?.plan === "FREE" ? "3000" : "Unlimited"}{" "}
              emails per month.
            </div>
            <div className="text-sm text-muted-foreground">
              You can send upto{" "}
              {currentTeam?.plan === "FREE" ? "100" : "Unlimited"} emails per
              day.
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                You can have {currentTeam?.plan === "FREE" ? "1" : "Unlimited"}{" "}
                contact book
                {currentTeam?.plan !== "FREE" && "s"}.
              </div>
            </div>
          </div>
        </div>
        {currentTeam?.plan !== "FREE" ? (
          <Button
            onClick={onManageClick}
            className="mt-4 w-[120px]"
            disabled={manageSessionUrl.isPending}
          >
            {manageSessionUrl.isPending ? (
              <Spinner className="w-4 h-4" />
            ) : (
              "Manage"
            )}
          </Button>
        ) : (
          <Button
            onClick={onClick}
            className="mt-4 w-[120px]"
            disabled={checkoutMutation.isPending}
          >
            {checkoutMutation.isPending ? (
              <Spinner className="w-4 h-4" />
            ) : (
              "Upgrade"
            )}
          </Button>
        )}
      </Card>
    </div>
  );
}
