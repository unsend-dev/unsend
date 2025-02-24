export default function PaymentsPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string; session_id?: string };
}) {
  let status = "Not subscribed";
  let message = "You currently don't have an active subscription";

  if (searchParams.success === "true") {
    status = "Active";
    message = "Your subscription is active and working properly";
  } else if (searchParams.canceled === "true") {
    status = "Canceled";
    message = "Your subscription was canceled";
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Subscription Status</h1>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Status</h2>
            <p className="text-gray-600">{status}</p>
          </div>

          <div>
            <h2 className="text-lg font-medium">Details</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
