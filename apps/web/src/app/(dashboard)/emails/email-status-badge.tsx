import { EmailStatus } from "@prisma/client";

export const EmailStatusBadge: React.FC<{ status: EmailStatus }> = ({
  status,
}) => {
  let badgeColor = "bg-gray-700/10 text-gray-400 border border-gray-400/10"; // Default color
  switch (status) {
    case "DELIVERED":
      badgeColor = "bg-green/15 text-green border border-green/20";
      break;
    case "BOUNCED":
    case "FAILED":
      badgeColor = "bg-red/15 text-red border border-red/20";
      break;
    case "CLICKED":
      badgeColor = "bg-blue/15 text-blue border border-blue/20";
      break;
    case "OPENED":
      badgeColor = "bg-purple/15 text-purple border border-purple/20";
      break;
    case "COMPLAINED":
      badgeColor = "bg-yellow/15 text-yellow border border-yellow/20";
      break;
    case "DELIVERY_DELAYED":
      badgeColor = "bg-yellow/15 text-yellow border border-yellow/20";
      break;

    default:
      badgeColor = "bg-gray-700/10 text-gray-400 border border-gray-400/10"; // Default color
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
  let outsideColor = "bg-gray/30"; // Default
  let insideColor = "bg-gray"; // Default

  switch (status) {
    case "DELIVERED":
      outsideColor = "bg-green/30";
      insideColor = "bg-green";
      break;
    case "BOUNCED":
    case "FAILED":
      outsideColor = "bg-red/30";
      insideColor = "bg-red";
      break;
    case "CLICKED":
      outsideColor = "bg-blue/30";
      insideColor = "bg-blue";
      break;
    case "OPENED":
      outsideColor = "bg-purple/30";
      insideColor = "bg-purple";
      break;
    case "DELIVERY_DELAYED":
      outsideColor = "bg-yellow/30";
      insideColor = "bg-yellow";
      break;
    case "COMPLAINED":
      outsideColor = "bg-yellow/30";
      insideColor = "bg-yellow";
      break;
    default:
      // Using the default values defined above
      outsideColor = "bg-gray/30";
      insideColor = "bg-gray";
  }

  return (
    <div
      className={`flex justify-center items-center p-1.5 ${outsideColor} rounded-full`}
    >
      <div className={`h-2 w-2 rounded-full ${insideColor}`}></div>
    </div>
  );
};
