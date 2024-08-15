"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@unsend/ui/src/tabs";
import { useState } from "react";
import { SettingsNavButton } from "./settings-nav-button";

export const dynamic = "force-static";

export default function ApiKeysPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="font-bold text-lg">Developer settings</h1>
      <div className="flex gap-4 mt-4">
        <SettingsNavButton href="/dev-settings/api-keys">
          API Keys
        </SettingsNavButton>
        <SettingsNavButton href="/dev-settings/smtp">SMTP</SettingsNavButton>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
