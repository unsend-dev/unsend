import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Button } from "@unsend/ui/src/button";
import { SendHorizonal } from "lucide-react";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="h-screen">
      <h1 className="text-center text-4xl mt-20 flex gap-4 justify-center items-center">
        <SendHorizonal />
        Send emails in minutes. Completely open source
      </h1>
      <div className="flex justify-center mt-10">
        {session?.user ? (
          <Button className="mx-auto">
            <Link href="/dashboard" className="mx-auto">
              Send email
            </Link>
          </Button>
        ) : (
          <Button className="mx-auto">
            <Link href="api/auth/signin" className="mx-auto">
              Signin
            </Link>
          </Button>
        )}
      </div>
    </main>
  );
}
