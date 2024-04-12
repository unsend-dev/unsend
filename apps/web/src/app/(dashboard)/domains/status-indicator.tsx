import { DomainStatus } from "@prisma/client";

export const StatusIndicator: React.FC<{ status: DomainStatus }> = ({
  status,
}) => {
  let badgeColor = "bg-gray-400"; // Default color
  switch (status) {
    case DomainStatus.NOT_STARTED:
      badgeColor = "bg-gray-400";
      break;
    case DomainStatus.SUCCESS:
      badgeColor = "bg-emerald-500";
      break;
    case DomainStatus.FAILED:
      badgeColor = "bg-red-500";
      break;
    case DomainStatus.TEMPORARY_FAILURE:
    case DomainStatus.PENDING:
      badgeColor = "bg-yellow-500";
      break;
    default:
      badgeColor = "bg-gray-400";
  }

  return <div className={` w-[1px] ${badgeColor} my-1.5 rounded-full`}></div>;
};
