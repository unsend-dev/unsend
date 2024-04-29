import { Rocket } from "lucide-react";

export default async function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="p-8 shadow-lg rounded-lg flex flex-col gap-4">
        <Rocket />
        <h1 className="text-2xl font-bold">You're on the Waitlist!</h1>
        <p className=" text-secondary-muted">
          Hang tight, we'll get to you as soon as possible.
        </p>
      </div>
    </div>
  );
}
