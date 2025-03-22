"use client";

import { SettingsNavButton } from "../dev-settings/settings-nav-button";

export const dynamic = "force-static";

export default function ApiKeysPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="font-bold text-lg">Settings</h1>
      <div className="flex gap-4 mt-4">
        <SettingsNavButton href="/settings">Usage</SettingsNavButton>
        <SettingsNavButton href="/settings/billing">Billing</SettingsNavButton>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
