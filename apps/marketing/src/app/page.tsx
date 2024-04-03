import { ArrowRight, MoveRight, SendHorizonal } from "lucide-react";
import Image from "next/image";
import { BackgroundBeams } from "~/components/ui/background-beams";
import { StyledInput } from "~/components/ui/styled-input";

export default function Home() {
  return (
    <div className="bg-neutral-950">
      <div className="h-[100vh] w-full rounded-md  relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-6xl md:leading-[4.5rem]    text-center font-sans font-bold">
            Open source sending infrastructure for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r  from-[#06b6d4] to-[#10b981]">
              developers
            </span>
          </h1>
          <p></p>
          <p className="text-neutral-300 max-w-lg mx-auto my-4 text-center relative z-10">
            Send transactional, marketing emails, SMSes and push notifications
            effortlessly.
          </p>
          <p className="text-neutral-300 max-w-lg mx-auto text-xl my-4 text-center relative z-10 mt-10">
            Join the waitlist!
          </p>
          <div className="flex z-10 justify-center items-stretch bg-neutral-800 relative border border-gray-500 focus-within:border-[#06b6d45a] rounded-lg w-[400px] mx-auto mt-2">
            <input
              type="text"
              className="flex-1 bg-transparent  placeholder:text-neutral-600 outline-none relative z-10 px-4 p-2"
              placeholder="ada@lovelace.com"
            />
            <button className="  text-white rounded-lg w-10  bg-slate-100 flex items-center justify-center bg-gradient-to-r  from-[#06b6d4ba] to-[#10b981ba]">
              <ArrowRight className="text-neutral-700" />
            </button>
          </div>
        </div>
        <BackgroundBeams />
      </div>
      <div className="h-[100vh] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
            Join the waitlist
          </h1>
        </div>
      </div>
    </div>
  );
}
