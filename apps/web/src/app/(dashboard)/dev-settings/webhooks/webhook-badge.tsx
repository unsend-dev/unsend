import { WebhookEvent } from "@prisma/client";
import React from "react";


export const WebhookEventBadge: React.FC<{ event: WebhookEvent }> = ({ event }) => {
  let badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10"; // Default color

  switch (event) {
    case WebhookEvent.DOMAIN_VERIFIED:
    case WebhookEvent.EMAIL_DELIVERED:
      badgeColor =
        "bg-green-500/15 dark:bg-green-600/10 text-green-700 dark:text-green-600/90 border border-green-500/25 dark:border-green-700/25";
      break;
    case WebhookEvent.EMAIL_SENT:
    case WebhookEvent.EMAIL_OPENED:
    case WebhookEvent.EMAIL_CLICKED:
      badgeColor =
        "bg-blue-500/10 text-blue-600 dark:text-blue-500 border border-blue-500/20";
      break;
    case WebhookEvent.EMAIL_BOUNCED:
    case WebhookEvent.EMAIL_COMPLAINED:
      badgeColor =
        "bg-red-500/10 text-red-600 dark:text-red-700/90 border border-red-600/10";
      break;
    default:
      badgeColor =
        "bg-gray-200/70 dark:bg-gray-400/10 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-400/20";
  }

  const formatLabel = (value: string) =>
    value
      .replace("EMAIL_", "")
      .replace("_", " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div
      className={`text-center w-[140px] capitalize rounded-md py-1 justify-center flex items-center mb-2 ${badgeColor}`}
    >
      <span className="text-xs">
        {formatLabel(event)}
      </span>
    </div>
  );
};
