"use client";

import { Button } from "@unsend/ui/src/button";
import { api } from "~/trpc/react";

export default function SettingsPage() {
  const checkoutMutation = api.billing.createCheckoutSession.useMutation();

  const onClick = async () => {
    const url = await checkoutMutation.mutateAsync();
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div>
      <div>Settings</div>
      <Button onClick={onClick}>Checkout</Button>
    </div>
  );
}
