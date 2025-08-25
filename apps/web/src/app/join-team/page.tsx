import JoinTeam from "~/components/team/JoinTeam";
import { Suspense } from "react";
import Spinner from "@unsend/ui/src/spinner";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function CreateTeam({
  searchParams,
}: {
  searchParams: { inviteId?: string };
}) {
  const session = await getServerAuthSession();

  if (!session) {
    const inviteId = searchParams?.inviteId;
    redirect(`/login${inviteId ? `?inviteId=${inviteId}` : ""}`);
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className=" w-[300px] flex flex-col gap-8">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Spinner className="h-5 w-5" innerSvgClass="stroke-primary" />
            </div>
          }
        >
          <JoinTeam />
        </Suspense>
      </div>
    </div>
  );
}
