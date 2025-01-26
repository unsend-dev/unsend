import { EmailStatus } from "@prisma/client";

// ADD RATE_LIMITED STATUS LATER
export const EmailStatusBadge: React.FC<{ status: EmailStatus }> = ({
  status,
}) => {
  let badgeColor = "bg-gray-700/10 text-gray-400 border border-gray-400/10"; // Default color
  switch (status) {
    case "DELIVERED":
      badgeColor =
        "bg-green-500/15 dark:bg-green-600/10 text-green-700 dark:text-green-600/90 border  border-green-500/25 dark:border-green-700/25";
      break;
    case "BOUNCED":
    case "FAILED":
      badgeColor =
        "bg-red-500/10 text-red-600 dark:text-red-700/90 border border-red-600/10";
      break;
    case "CLICKED":
      badgeColor =
        "bg-sky-500/15 text-sky-700 dark:text-sky-600 border border-sky-600/20";
      break;
    case "OPENED":
      badgeColor =
        "bg-indigo-500/15 text-indigo-600 dark:text-indigo-500 border border-indigo-600/20";
      break;
    case "DELIVERY_DELAYED":
      badgeColor = "bg-yellow-500/10 text-yellow-600 border-yellow-600/20";
      break;
    case "COMPLAINED":
      badgeColor =
        "bg-yellow-500/20 dark:bg-yellow-500/10 text-yellow-600 border border-yellow-600/10";
      break;

    default:
      badgeColor =
        "bg-gray-200/70 dark:bg-gray-400/10 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-400/20";
  }

  return (
    <div
      className={` text-center w-[130px] rounded capitalize py-1 text-xs ${badgeColor}`}
    >
      {status.toLowerCase().split("_").join(" ")}
    </div>
  );
};

export const EmailStatusIcon: React.FC<{ status: EmailStatus }> = ({
  status,
}) => {
  let outsideColor = "bg-gray-500";
  let insideColor = "bg-gray-500/50";

  switch (status) {
    case "DELIVERED":
      outsideColor = "bg-green-500/30";
      insideColor = "bg-green-500";
      break;
    case "BOUNCED":
    case "FAILED":
      outsideColor = "bg-red-500/30";
      insideColor = "bg-red-500";
      break;
    case "CLICKED":
      outsideColor = "bg-sky-500/30";
      insideColor = "bg-sky-500";
      break;
    case "OPENED":
      outsideColor = "bg-indigo-500/30";
      insideColor = "bg-indigo-500";
      break;
    case "DELIVERY_DELAYED":
      outsideColor = "bg-yellow-500/30";
      insideColor = "bg-yellow-500";
      break;
    case "COMPLAINED":
      outsideColor = "bg-yellow-500/30";
      insideColor = "bg-yellow-500";
      break;
    default:
      outsideColor = "bg-gray-500/20";
      insideColor = "bg-gray-500";
  }

  return (
    <div
      className={`flex justify-center items-center p-1.5 ${outsideColor} rounded-full`}
    >
      <div className={`h-2 w-2 rounded-full ${insideColor}`}></div>
    </div>
  );
};
