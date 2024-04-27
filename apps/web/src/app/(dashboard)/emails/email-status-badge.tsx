import { EmailStatus } from "@prisma/client";

export const EmailStatusBadge: React.FC<{ status: EmailStatus }> = ({
  status,
}) => {
  let badgeColor = "bg-gray-400/10 text-gray-400 border-gray-400/10"; // Default color
  switch (status) {
    case "SENT":
      badgeColor = "bg-gray-400/10 text-gray-400 border-gray-400/10";
      break;
    case "DELIVERED":
      badgeColor = "bg-emerald-500/10 text-emerald-500 border-emerald-600/10";
      break;
    case "BOUNCED":
      badgeColor = "bg-red-500/10 text-red-600 border-red-600/10";
      break;
    case "CLICKED":
      badgeColor = "bg-cyan-500/10 text-cyan-500 border-cyan-600/10";
      break;
    case "OPENED":
      badgeColor = "bg-indigo-500/10 text-indigo-500 border-indigo-600/10";
      break;
    case "DELIVERY_DELAYED":
      badgeColor = "bg-yellow-500/10 text-yellow-600 border-yellow-600/10";
      break;
    case "COMPLAINED":
      badgeColor = "bg-yellow-500/10 text-yellow-600 border-yellow-600/10";
      break;
    default:
      badgeColor = "bg-gray-400/10 text-gray-400 border-gray-400/10";
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
  let outsideColor = "bg-gray-600";
  let insideColor = "bg-gray-600/50";

  switch (status) {
    case "DELIVERED":
      outsideColor = "bg-emerald-500/30";
      insideColor = "bg-emerald-500";
      break;
    case "BOUNCED":
      outsideColor = "bg-red-500/30";
      insideColor = "bg-red-500";
      break;
    case "CLICKED":
      outsideColor = "bg-cyan-500/30";
      insideColor = "bg-cyan-500";
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
      outsideColor = "bg-gray-600/40";
      insideColor = "bg-gray-600";
  }

  return (
    <div
      className={`flex justify-center items-center p-1.5 ${outsideColor} rounded-full`}
    >
      <div className={`h-2 w-2 rounded-full ${insideColor}`}></div>
    </div>
  );
};
