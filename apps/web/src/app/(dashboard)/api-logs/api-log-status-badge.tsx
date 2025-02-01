export type ApiLogStatus = 200 | 400 | 401 | 403 | 404 | 429 | 500 | 503;

export const ApiLogStatusBadge: React.FC<{ status: ApiLogStatus }> = ({
  status,
}) => {
  let badgeColor = "bg-gray-700/10 text-gray-400 border border-gray-400/10";
  if (status >= 200 && status < 300) {
    badgeColor = "bg-green-500/15 text-green-500 border border-green-500/25";
  } else if (status >= 400 && status < 500) {
    badgeColor = "bg-yellow-500/15 text-yellow-500 border border-yellow-500/25";
  } else if (status >= 500 && status < 600) {
    badgeColor = "bg-red-500/15 text-red-500 border border-red-500/25";
  }

  return (
    <div
      className={` text-center w-[50px] rounded capitalize py-1 text-xs ${badgeColor}`}
    >
      {status}
    </div>
  );
};
