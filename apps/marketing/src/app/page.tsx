import Image from "next/image";
import { GitHubStarsButton } from "~/components/GitHubStarsButton";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-4">
        <div className="flex justify-center">
          <Image
            src="/logo-squircle.png"
            alt="useSend logo"
            width={64}
            height={64}
            priority
          />
        </div>
        <h1 className="text-xl font-mono font-medium text-blue">useSend</h1>
        <p className="text-muted-foreground">
          Open source email platform for everyone
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <GitHubStarsButton />
        </div>
      </div>
    </main>
  );
}
