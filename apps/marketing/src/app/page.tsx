import { EnvelopeIcon, MegaphoneIcon } from "@heroicons/react/24/solid";
import {
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignRight,
  AlignCenter,
  Bold,
  Italic,
  ListOrdered,
} from "lucide-react";
import { formatDate } from "date-fns";

import IntegrationCode from "./IntegrationCode";
import {
    DocsButton,
  GithubStarButton,
  HeroImage,
  JoinWaitlist,
} from "~/components/landind-page";

export default function Home() {
  return (
    <div className="pb-20">
      <div className=" mx-auto  w-full lg:max-w-6xl relative flex flex-col ">
        <div className="p-4 mt-20">
          <h1 className="relative z-10 text-neutral-100 text-2xl lg:max-w-4xl mx-auto md:text-6xl md:leading-[4.5rem] text-center font-sans font-bold">
            Open source sending infrastructure for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r  from-[#06b6d4] to-[#10b981]">
              developers
            </span>
          </h1>
          <p></p>
          <p className="text-neutral-100 text-lg max-w-lg mx-auto my-4 text-center relative z-10">
            Send transactional, marketing emails, SMSes and push notifications
            effortlessly.
          </p>
          <div className="flex  flex-col items-center lg:flex-row justify-center mt-16 gap-8">
            <JoinWaitlist />
            <GithubStarButton />
          </div>

          <HeroImage />
        </div>

        {/* <BackgroundBeams /> */}
      </div>
      <div className="w-full lg:max-w-6xl mx-auto flex flex-col gap-40 mt-40 md:px-6 px-0">
        <div className="space-y-12">
        <div>
        <p className="text-center font-semibold text-3xl lg:text-6xl">
         Reach your users</p>
        </div>
        <div className="flex gap-10 flex-col lg:flex-row md:p-8 p-3 bg-[#0c0e12] rounded-lg">
          <div className="lg:w-1/2">
            <div className="flex flex-col gap-2">
              <EnvelopeIcon className="h-10 w-10 text-fuchsia-500" />
              <p className="text-3xl font-semibold">Transactional Mail</p>
            </div>
            <ul className="flex flex-col gap-4 mt-8">
              <li>Simple to use! No wasted time on configuration.</li>
              <li>Send emails that reach the inbox, not spam.</li>
              <li>Get notified of email bounces and complaints.</li>
            </ul>
          </div>
          <div className="lg:w-1/2 flex flex-col bg-[#0e1217] border rounded-lg p-8">
            <div className=" border-l border-dashed flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex gap-5 items-start">
                  <div className=" -ml-2.5">
                    <div
                      className={`flex justify-center items-center p-1.5 bg-gray-600/50 rounded-full`}
                    >
                      <div className={`h-2 w-2 rounded-full bg-gray-600`}></div>
                    </div>
                  </div>
                  <div className="-mt-1 ">
                    <div className=" capitalize font-medium">
                      <div
                        className={` text-center w-[130px] rounded capitalize py-1 text-xs bg-gray-400/10 text-gray-400 border-gray-400/10`}
                      >
                        Sent
                      </div>
                    </div>
                    <div
                      className="text-xs text-muted-foreground mt-2"
                      suppressHydrationWarning
                    >
                      {formatDate(Date.now() - 100000, "MMM dd, hh:mm a")}
                    </div>
                    <div className="mt-1 text-primary/80">
                      We received your request and sent the email to recipient's
                      server.
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex gap-5 items-start">
                  <div className=" -ml-2.5">
                    <div
                      className={`flex justify-center items-center p-1.5 bg-emerald-500/50 rounded-full`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full bg-emerald-500`}
                      ></div>
                    </div>
                  </div>
                  <div className="-mt-1">
                    <div className=" capitalize font-medium">
                      <div
                        className={` text-center w-[130px] rounded capitalize py-1 text-xs bg-emerald-500/10 text-emerald-500 border-emerald-600/10`}
                      >
                        Delivered
                      </div>
                    </div>
                    <div
                      className="text-xs text-muted-foreground mt-2"
                      suppressHydrationWarning
                    >
                      {formatDate(new Date(), "MMM dd, hh:mm a")}
                    </div>
                    <div className="mt-1 text-primary/80">
                      Mail is successfully delivered to the recipient.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-10 flex-col lg:flex-row md:p-8 p-3 bg-[#0c0e12] rounded-lg">
          <div className="lg:w-1/2">
            <div className="flex flex-col gap-2">
              <MegaphoneIcon className="h-10 w-10 text-indigo-500" />
              <p className="text-3xl font-semibold">Marketing Mail</p>
            </div>
            <ul className="flex flex-col gap-4 mt-8">
              <li>Manage newsletters, changelogs, and broadcasts easily.</li>
              <li>
                Use our no-code email builder and templates that works on all
                email clients.
              </li>
              <li>Measure engagement using click and open tracking.</li>
              <li>
                Focus on the content and we will handle the subscription for
                you.
              </li>
            </ul>
          </div>
          <div className="lg:w-1/2">
            <div className="w-full rounded-lg border bg-[#0e1217]">
              <div className="flex gap-4 justify-between border-b p-4 overflow-auto">
                <Heading1 />
                <Heading2 />
                <Heading3 />
                <AlignLeft />
                <AlignCenter />
                <AlignRight />
                <Bold />
                <Italic />
                <ListOrdered />
              </div>
              <div className="h-[200px]  p-4">
                <div className="">
                  <div className="text-xl text-center">Welcome to unsend!</div>
                  <p className="text-center mt-8">
                    Finally an open source alternative for Resend, Mailgun,
                    Sendgrid and postmark.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="mt-20 rounded-lg md:p-8 p-3">
          <p className="text-center font-semibold text-3xl lg:text-6xl  ">
            Integrate in minutes
          </p>
          {/* <motion.div
            className="mt-10"
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              type: "spring",
              damping: 13,
              stiffness: 100,
              delay: 0.2,
            }}
          > */}
          <div className="mt-10">
            <IntegrationCode />
          </div>
          {/* </motion.div> */}
        </div>
      </div>
    </div>
  );
}
