import { Plan } from "@prisma/client";
import { PLAN_PERKS } from "~/lib/constants/payments";
import { CheckCircle2 } from "lucide-react";

export const PlanDetails = ({ plan }: { plan: Plan }) => {
  const planKey = plan.toUpperCase() as keyof typeof PLAN_PERKS;
  const perks = PLAN_PERKS[planKey] || [];

  return (
    <div>
      <div className="capitalize text-lg">{plan.toLowerCase()}</div>
      <div className="text-muted-foreground text-sm">Current plan</div>
      <ul className="mt-4 space-y-3">
        {perks.map((perk, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">{perk}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
