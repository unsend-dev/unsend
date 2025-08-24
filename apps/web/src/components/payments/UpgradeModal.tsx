"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@unsend/ui/src/dialog";
import { CheckCircle2 } from "lucide-react";
import { useUpgradeModalStore } from "~/store/upgradeModalStore";
import { PLAN_PERKS } from "~/lib/constants/payments";
import { UpgradeButton } from "./UpgradeButton";

export const UpgradeModal = () => {
  const {
    isOpen,
    reason,
    action: { closeModal },
  } = useUpgradeModalStore();

  const basicPlanPerks = PLAN_PERKS.BASIC || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Basic Plan</DialogTitle>
          <DialogDescription>
            {reason
              ? `${reason} Upgrade to unlock this feature and more.`
              : "Unlock more features with our Basic plan."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">What you'll get:</h4>
            <ul className="space-y-2">
              {basicPlanPerks.map((perk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <UpgradeButton />
        </div>
      </DialogContent>
    </Dialog>
  );
};
