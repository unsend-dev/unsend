"use client";

import AddWebhook from "./add-webhook";
import WebhookList from "./webhook-list";

export default function WebhooksPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-medium">Webhooks</h2>
        <AddWebhook />
      </div>
      <WebhookList />
    </div>
  );
}
