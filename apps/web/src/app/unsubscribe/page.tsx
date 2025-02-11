import {
  unsubscribeContact,
} from "~/server/service/campaign-service";
import ReSubscribe from "./re-subscribe";
export const dynamic = "force-dynamic";

async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const id = searchParams.id as string;
  const hash = searchParams.hash as string;

  if (!id || !hash) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-10 shadow rounded-xl">
          <h2 className="mt-6 text-center text-3xl font-extrabold ">
            Unsubscribe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Invalid unsubscribe link. Please check your URL and try again.
          </p>
        </div>
      </div>
    );
  }

  const contact = await unsubscribeContact(id, hash);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <ReSubscribe id={id} hash={hash} contact={contact} />

      <div className=" fixed bottom-10  p-4">
        <p>
          Powered by{" "}
          <a href="https://unsend.dev" className="font-bold" target="_blank">
            Unsend
          </a>
        </p>
      </div>
    </div>
  );
}

export default UnsubscribePage;
