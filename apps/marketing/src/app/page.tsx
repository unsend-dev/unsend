"use client";

import { motion } from "framer-motion";
import { Mail, Rocket } from "lucide-react";
import {
  RocketLaunchIcon,
  EnvelopeIcon,
  MegaphoneIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BellAlertIcon,
} from "@heroicons/react/24/solid";
import { Code } from "@unsend/ui/src/code";

export default function Home() {
  return (
    <div className="bg-neutral-950 pb-20">
      <div className="h-screen w-full relative flex flex-col items-center justify-center ">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="relative z-10 text-neutral-100 text-lg md:text-6xl md:leading-[4.5rem]    text-center font-sans font-bold">
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
          <div className="flex justify-center mt-16">
            <motion.a
              className="bg-white text-black py-2 px-6 rounded-full cursor-pointer flex gap-2"
              whileHover={{ scale: 1.2 }}
              onHoverStart={(e) => {}}
              onHoverEnd={(e) => {}}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              href="https://app.youform.io/forms/caja89vr"
              target="_blank"
            >
              <RocketLaunchIcon className="h-6 w-6" />
              Join the waitlist
            </motion.a>
          </div>
        </div>

        {/* <BackgroundBeams /> */}
      </div>
      <div className=" max-w-5xl mx-auto flex flex-col gap-40">
        <div>
          <p className="text-center text-6xl ">Reach your users</p>
        </div>
        <div className="flex">
          <div className="w-1/2">
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
          <div className="w-1/2">
            {/* <Code
              codeBlocks={[
                {
                  language: "js",
                  code: `const unsend = require("unsend");

const email = unsend.email();

email.send({
  to: "user@example.com",
  subject: "Hello, World!",
  text: "Hello, World!",
});`,
                },
              ]}
            /> */}
          </div>
        </div>
        <div className="flex">
          <div className="w-1/2">
            <div className="flex flex-col gap-2">
              <MegaphoneIcon className="h-10 w-10 text-indigo-500" />
              <p className="text-3xl font-semibold">Marketing Mail</p>
            </div>
            <ul className="flex flex-col gap-4 mt-8">
              <li>Manage newsletters, changelogs, and broadcasts easily.</li>
              <li>Use our no-code email builder and templates.</li>
              <li>Measure engagement using click and open tracking.</li>
              <li>We will manage subscriptions for you.</li>
            </ul>
          </div>
          <div className="w-1/2"></div>
        </div>
        <div className="flex">
          <div className="w-1/2">
            <div className="flex flex-col gap-2">
              <ChatBubbleOvalLeftEllipsisIcon className="h-10 w-10 text-emerald-500" />
              <div className="flex gap-4 items-center">
                <p className="text-3xl font-semibold">SMS</p>
                <div className="rounded-md border px-2 py-1 text-xs bg-neutral-900">
                  Coming soon
                </div>
              </div>
            </div>
            <ul className="flex flex-col gap-4 mt-8">
              <li>Manage newsletters, changelogs, and broadcasts easily.</li>
              <li>Use our no-code email builder and templates.</li>
              <li>Measure engagement using click and open tracking.</li>
              <li>We will manage subscriptions for you.</li>
            </ul>
          </div>
          <div className="w-1/2"></div>
        </div>
        <div className="flex">
          <div className="w-1/2">
            <div className="flex flex-col gap-2">
              <BellAlertIcon className="h-10 w-10 text-cyan-500" />
              <div className="flex gap-4 items-center">
                <p className="text-3xl font-semibold">Push notification</p>
                <div className="rounded-md border px-2 py-1 text-xs bg-neutral-900">
                  Coming soon
                </div>
              </div>
            </div>
            <ul className="flex flex-col gap-4 mt-8">
              <li>Manage newsletters, changelogs, and broadcasts easily.</li>
              <li>Use our no-code email builder and templates.</li>
              <li>Measure engagement using click and open tracking.</li>
              <li>We will manage subscriptions for you.</li>
            </ul>
          </div>
          <div className="w-1/2"></div>
        </div>
      </div>
      <div className="">
        <div className="flex justify-center mt-40">
          <motion.a
            className="bg-white text-black py-2 px-6 rounded-full cursor-pointer flex gap-2"
            whileHover={{ scale: 1.2 }}
            onHoverStart={(e) => {}}
            onHoverEnd={(e) => {}}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            href="https://app.youform.io/forms/caja89vr"
            target="_blank"
          >
            <RocketLaunchIcon className="h-6 w-6" />
            Join the waitlist
          </motion.a>
        </div>
      </div>
    </div>
  );
}
