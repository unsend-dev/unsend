import { EmailStatus } from "@prisma/client";

export const EmailStatusBadge: React.FC<{ status: EmailStatus }> = ({
  status,
}) => {
  let badgeColor = "bg-gray-700/10 text-gray-400 border border-gray-400/10"; // Default color
  switch (status) {
    case "DELIVERED":
      badgeColor =
        "bg-[#40a02b]/15 dark:bg-[#a6e3a1]/15 text-[#40a02b] dark:text-[#a6e3a1] border  border-[#40a02b]/25 dark:border-[#a6e3a1]/25";
      break;
    case "BOUNCED":
    case "FAILED":
      badgeColor =
        "bg-[#d20f39]/15 dark:bg-[#f38ba8]/15 text-[#d20f39] dark:text-[#f38ba8] border border-[#d20f39]/20 dark:border-[#f38ba8]/20";
      break;
    case "CLICKED":
      badgeColor =
        "bg-[#04a5e5]/15 dark:bg-[#93c5fd]/15 text-[#04a5e5] dark:text-[#93c5fd] border border-[#04a5e5]/20 dark:border-[#93c5fd]/20";
      break;
    case "OPENED":
      badgeColor =
        "bg-[#8839ef]/15 dark:bg-[#cba6f7]/15 text-[#8839ef] dark:text-[#cba6f7] border border-[#8839ef]/20 dark:border-[#cba6f7]/20";
      break;
    case "COMPLAINED":
      badgeColor =
        "bg-[#df8e1d]/10 dark:bg-[#F9E2AF]/15 dark:text-[#F9E2AF] text-[#df8e1d] border dark:border-[#F9E2AF]/20 border-[#df8e1d]/20";
      break;
    case "DELIVERY_DELAYED":
      badgeColor =
        "bg-[#df8e1d]/10 dark:bg-[#F9E2AF]/15 dark:text-[#F9E2AF] text-[#df8e1d] border dark:border-[#F9E2AF]/20 border-[#df8e1d]/20";

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
  let outsideColor = "bg-gray-600/30 dark:bg-gray-400/30"; // Default
  let insideColor = "bg-gray-600 dark:bg-gray-400"; // Default

  switch (status) {
    case "DELIVERED":
      outsideColor = "bg-[#40a02b]/30 dark:bg-[#a6e3a1]/30";
      insideColor = "bg-[#40a02b] dark:bg-[#a6e3a1]";
      break;
    case "BOUNCED":
    case "FAILED":
      outsideColor = "bg-[#d20f39]/30 dark:bg-[#f38ba8]/30";
      insideColor = "bg-[#d20f39] dark:bg-[#f38ba8]";
      break;
    case "CLICKED":
      outsideColor = "bg-[#04a5e5]/30 dark:bg-[#93c5fd]/30";
      insideColor = "bg-[#04a5e5] dark:bg-[#93c5fd]";
      break;
    case "OPENED":
      outsideColor = "bg-[#8839ef]/30 dark:bg-[#cba6f7]/30";
      insideColor = "bg-[#8839ef] dark:bg-[#cba6f7]";
      break;
    case "DELIVERY_DELAYED":
      outsideColor = "bg-[#df8e1d]/30 dark:bg-[#F9E2AF]/30";
      insideColor = "bg-[#df8e1d] dark:bg-[#F9E2AF]";
      break;
    case "COMPLAINED":
      outsideColor = "bg-[#df8e1d]/30 dark:bg-[#F9E2AF]/30";
      insideColor = "bg-[#df8e1d] dark:bg-[#F9E2AF]";
      break;
    default:
      // Using the default values defined above
      outsideColor = "bg-gray-600/30 dark:bg-gray-400/30";
      insideColor = "bg-gray-600 dark:bg-gray-400";
  }

  return (
    <div
      className={`flex justify-center items-center p-1.5 ${outsideColor} rounded-full`}
    >
      <div className={`h-2 w-2 rounded-full ${insideColor}`}></div>
    </div>
  );
};
