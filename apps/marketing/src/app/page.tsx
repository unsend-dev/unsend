import {
  RocketLaunchIcon,
  EnvelopeIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/solid";
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
import { TextWithCopyButton } from "@unsend/ui/src/text-with-copy";
import Link from "next/link";
import Image from "next/image";
import IntegrationCode from "./IntegrationCode";
import {
  GithubStarButton,
  HeroImage,
  JoinWaitlist,
} from "~/components/landind-page";

export default function Home() {
  return (
    <div className="bg-neutral-950 pb-20">
      <div className=" mx-auto  w-full lg:max-w-6xl relative flex flex-col ">
        <nav className="p-4 flex justify-between">
          <div className="text-2xl font-semibold">
            <Link href="/">Unsend</Link>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="https://github.com/unsend-dev/unsend" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                className="h-6 w-6 stroke-white fill-white"
              >
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
              </svg>
            </Link>
            <Link href="https://twitter.com/unsend_dev" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-6 w-6 stroke-white fill-white"
                target="_blank"
              >
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
            </Link>
            <Link
              href="https://discord.gg/BU8n8pJv8S"
              target="_blank"
              className="flex gap-2 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                className="h-6 w-6 stroke-white fill-white"
              >
                <path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
              </svg>
            </Link>
            {/* <Link href="https://github.com/unsendhq">Github</Link> */}
          </div>
        </nav>
        <div className="p-4 mt-20">
          <h1 className="relative z-10 text-neutral-100 text-2xl lg:max-w-4xl mx-auto md:text-6xl md:leading-[4.5rem]    text-center font-sans font-bold">
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
      <div className=" w-full lg:max-w-5xl mx-auto flex flex-col gap-40 mt-40">
        <div>
          <p className="text-center text-3xl lg:text-6xl ">Reach your users</p>
        </div>
        <div className="flex gap-10 flex-col lg:flex-row px-8 lg:px-0">
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
          <div className="lg:w-1/2 flex flex-col  border rounded-lg p-8">
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
                  <div className="-mt-1">
                    <div className=" capitalize font-medium">
                      <div
                        className={` text-center w-[130px] rounded capitalize py-1 text-xs bg-gray-400/10 text-gray-400 border-gray-400/10`}
                      >
                        Sent
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
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
                    <div className="text-xs text-muted-foreground mt-2">
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
        <div className="flex gap-10 flex-col lg:flex-row px-8 lg:px-0">
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
            <div className="w-full rounded-lg border">
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

        <div className=" px-8 lg:px-0 mt-20">
          <p className="text-center text-3xl lg:text-6xl  ">
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

      <div className="flex justify-between mt-20 max-w-5xl mx-auto px-4">
        <div>
          <TextWithCopyButton value="hello@unsend.dev" />
        </div>
        <div className="flex gap-8 items-center">
          <Link href="https://github.com/unsend-dev/unsend" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              className="h-6 w-6 stroke-white fill-white"
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
          </Link>
          <Link href="https://twitter.com/unsend_dev" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-6 w-6 stroke-white fill-white"
              target="_blank"
            >
              <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
            </svg>
          </Link>
          <Link
            href="https://discord.gg/BU8n8pJv8S"
            target="_blank"
            className="flex gap-2 items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              className="h-6 w-6 stroke-white fill-white"
            >
              <path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
            </svg>
          </Link>
          {/* <Link href="https://github.com/unsendhq">Github</Link> */}
        </div>
      </div>
    </div>
  );
}
