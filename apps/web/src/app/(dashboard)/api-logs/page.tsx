import LogsList from "./api-log-list";

export default function ApiLogsPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">API Logs</h1>
      </div>
      <LogsList />
    </div>
  );
}
