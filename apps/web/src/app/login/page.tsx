import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import LoginPage from "./login-page";
import { getProviders } from "next-auth/react";

export default async function Login() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  const providers = await getProviders();

  return <LoginPage providers={Object.values(providers ?? {})} />;
}
