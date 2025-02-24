"use client";

import { Button } from "@unsend/ui/src/button";
import { api } from "~/trpc/react";
import UsagePage from "./usage/usage";

export default function SettingsPage() {
  return (
    <div>
      <UsagePage />
    </div>
  );
}
