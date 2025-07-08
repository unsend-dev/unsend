import { EmailStatus } from "@prisma/client";

export const EMAIL_COLORS: Record<EmailStatus | "total", string> = {
  total: "bg-gray-400 dark:bg-gray-400",
  DELIVERED: "bg-[#40a02b] dark:bg-[#a6e3a1]",
  BOUNCED: "bg-[#d20f39] dark:bg-[#f38ba8]",
  FAILED: "bg-[#d20f39] dark:bg-[#f38ba8]",
  CLICKED: "bg-[#04a5e5] dark:bg-[#93c5fd]",
  OPENED: "bg-[#8839ef] dark:bg-[#cba6f7]",
  COMPLAINED: "bg-[#df8e1d] dark:bg-[#F9E2AF]",
  DELIVERY_DELAYED: "bg-[#df8e1d] dark:bg-[#F9E2AF]",
  SENT: "bg-gray-200 dark:bg-gray-400",
  SCHEDULED: "bg-gray-200 dark:bg-gray-400",
  QUEUED: "bg-gray-200 dark:bg-gray-400",
  REJECTED: "bg-[#d20f39] dark:bg-[#f38ba8]",
  RENDERING_FAILURE: "bg-[#d20f39] dark:bg-[#f38ba8]",
  CANCELLED: "bg-gray-200 dark:bg-gray-400",
};
