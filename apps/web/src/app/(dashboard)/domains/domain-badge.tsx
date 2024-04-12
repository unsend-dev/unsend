import { DomainStatus } from "@prisma/client";

export const DomainStatusBadge: React.FC<{ status: DomainStatus }> = ({
  status,
}) => {
  let badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10"; // Default color
  switch (status) {
    case DomainStatus.NOT_STARTED:
      badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10";
      break;
    case DomainStatus.SUCCESS:
      badgeColor = "bg-emerald-500/10 text-emerald-500 border-emerald-600/10";
      break;
    case DomainStatus.FAILED:
      badgeColor = "bg-red-500/10 text-red-600 border-red-500/20";
      break;
    case DomainStatus.TEMPORARY_FAILURE:
    case DomainStatus.PENDING:
      badgeColor = "bg-yellow-500/10 text-yellow-600 border-yellow-600/10";
      break;
    default:
      badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10";
  }

  return (
    <div
      className={` text-center w-[120px] capitalize rounded-md py-1 justify-center flex items-center ${badgeColor}`}
    >
      <span className="text-xs">
        {status === "SUCCESS" ? "Verified" : status.toLowerCase()}
      </span>
    </div>
  );
};
