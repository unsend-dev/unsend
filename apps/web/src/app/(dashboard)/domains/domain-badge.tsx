import { DomainStatus } from "@prisma/client";

export const DomainStatusBadge: React.FC<{ status: DomainStatus }> = ({
  status,
}) => {
  let badgeColor = "bg-gray-400/10 text-gray-500 border-gray-400/10"; // Default color
  switch (status) {
    case DomainStatus.SUCCESS:
      badgeColor =
        "bg-green-500/15 dark:bg-green-600/10 text-green-700 dark:text-green-600/90 border  border-green-500/25 dark:border-green-700/25";
      break;
    case DomainStatus.FAILED:
      badgeColor =
        "bg-red-500/10 text-red-600 dark:text-red-700/90 border border-red-600/10";
      break;
    case DomainStatus.TEMPORARY_FAILURE:
    case DomainStatus.PENDING:
      badgeColor =
        "bg-yellow-500/20 dark:bg-yellow-500/10 text-yellow-600 border border-yellow-600/10";
      break;
    default:
      badgeColor =
        "bg-gray-200/70 dark:bg-gray-400/10 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-400/20";
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
