"use client";

import { motion } from "framer-motion";
import {
  RocketLaunchIcon,
  EnvelopeIcon,
  MegaphoneIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BellAlertIcon,
  DevicePhoneMobileIcon,
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
import { Code } from "@unsend/ui/src/code";
import Link from "next/link";
import Image from "next/image";

const jsCode = `const requestOptions = {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer us_1a2b3c4d5e6f7f8g"
  },
  body: JSON.stringify({
    "to": "test@company.com",
    "from": "hello@unsend.dev",
    "subject": "Unsend email",
    "html": "<p>Unsend is the best open source product to send emails</p>"
  }),
};

fetch("http://unsend.dev/api/v1/emails", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.error(error));
`;

const pythonCode = `import requests
import json

url = "http://unsend.dev/api/v1/emails"

payload = json.dumps({
  "to": "test@company.com",
  "from": "hello@unsend.dev",
  "subject": "Unsend email",
  "html": "<p>Unsend is the best open source product to send emails</p>"
})
headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer us_1a2b3c4d5e6f7f8g'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)`;

const rubyCode = `require 'uri'
require 'net/http'
require 'json'

url = URI("http://unsend.dev/api/v1/emails")

http = Net::HTTP.new(url.host, url.port)
request = Net::HTTP::Post.new(url)
request["Accept"] = 'application/json'
request["Content-Type"] = 'application/json'
request["Authorization"] = 'Bearer us_1a2b3c4d5e6f7f8g'
request.body = JSON.dump({
  "to" => "test@company.com",
  "from" => "hello@unsend.dev",
  "subject" => "Unsend email",
  "html" => "<p>Unsend is the best open source product to send emails</p>"
})

response = http.request(request)
puts response.read_body`;

const phpCode = `$url = "http://unsend.dev/api/v1/emails";

$payload = json_encode(array(
  "to" => "test@company.com",
  "from" => "hello@unsend.dev",
  "subject" => "Unsend email",
  "html" => "<p>Unsend is the best open source product to send emails</p>"
));

$headers = array(
  "Accept: application/json",
  "Content-Type: application/json",
  "Authorization: Bearer us_1a2b3c4d5e6f7f8g"
);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    echo $response;
}`;

const cUrl = `curl --location 'https://unsend.dev/v1/emails' \\
--header 'Accept: application/json' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer us_44c1071bd30058322f89a09805522d7341a47b5e' \\
--data-raw '{
    "to": "test@company.com",
    "from": "hello@unsend.dev",
    "subject": "Unsend email",
    "html": "<p>Unsend is the best open source product to send emails</p>",
}'`;

export default function Home() {
  return (
    <div className="bg-neutral-950 pb-20">
      <div className=" mx-auto  w-full lg:max-w-6xl relative flex flex-col ">
        <nav className="py-4 flex justify-between">
          <div className="text-2xl font-semibold">
            <Link href="/">Unsend</Link>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="https://twitter.com/unsend_dev">
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
          <div className="flex justify-center mt-16">
            <motion.a
              className="bg-white text-black py-2 px-6 rounded-full cursor-pointer flex gap-2"
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              href="https://app.youform.io/forms/caja89vr"
              target="_blank"
            >
              <RocketLaunchIcon className="h-6 w-6" />
              Join the waitlist
            </motion.a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            damping: 15,
            stiffness: 100,
            type: "spring",
          }}
          viewport={{ once: true }}
          className="p-3 bg-neutral-900 mt-24 rounded-xl"
        >
          <Image
            src="/app.webp"
            alt="App"
            width={1200}
            height={800}
            className="rounded-lg relative border "
          ></Image>
        </motion.div>

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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  damping: 15,
                  stiffness: 100,
                  type: "spring",
                  delay: 0.3,
                }}
                viewport={{ once: true }}
                className="flex flex-col gap-4"
              >
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  damping: 15,
                  stiffness: 100,
                  type: "spring",
                  delay: 0.6,
                }}
                viewport={{ once: true }}
              >
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
              </motion.div>
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
            <motion.div
              initial="hidden"
              whileInView="visible"
              transition={{
                duration: 0.3,
                type: "spring",
                damping: 13,
                stiffness: 100,
                delayChildren: 0.5,
                staggerChildren: 0.05,
                delay: 0.3,
              }}
              viewport={{ once: true }}
              className="w-full  rounded-lg border"
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="flex gap-4 justify-between border-b p-4">
                <motion.div
                  className=""
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <Heading1 />
                </motion.div>
                <motion.div
                  className=""
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <Heading2 />
                </motion.div>
                <motion.div
                  className=""
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <Heading3 />
                </motion.div>
                <motion.div
                  className=""
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <AlignLeft />
                </motion.div>
                <motion.div
                  className=""
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <AlignCenter />
                </motion.div>
                <motion.div
                  className=""
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <AlignRight />
                </motion.div>
                <motion.div
                  className=""
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <Bold />
                </motion.div>
                <motion.div
                  className=""
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <Italic />
                </motion.div>
                <motion.div
                  className=""
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  <ListOrdered />
                </motion.div>
              </div>
              <motion.div
                className="h-[200px]  p-4"
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 },
                }}
              >
                <div className="">
                  <div className="text-xl text-center">Welcome to unsend!</div>
                  <p className="text-center mt-8">
                    Finally an open source alternative for Resend, Mailgun,
                    Sendgrid and postmark.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="flex gap-10 flex-col lg:flex-row px-8 lg:px-0">
          <div className="lg:w-1/2">
            <div className="flex flex-col gap-3">
              <DevicePhoneMobileIcon className="h-10 w-10 text-emerald-500" />
              <p className="text-3xl font-semibold">SMS & Push notification</p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              transition={{
                duration: 0.4,
                type: "spring",
                damping: 13,
                stiffness: 100,
                delayChildren: 0.4,
                staggerChildren: 0.05,
                delay: 0.3,
              }}
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, scale: 0.7 },
                visible: { opacity: 1, scale: 1 },
              }}
              className="w-full h-[15rem]  rounded-lg border flex justify-center items-center"
            >
              <div className="text-3xl">
                {"Coming soon!".split("").map((l, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                  >
                    {l}
                  </motion.span>
                ))}
              </div>
            </motion.div>
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
            <Code
              codeBlocks={[
                { language: "js", code: jsCode },
                { language: "ruby", code: rubyCode },
                { language: "php", code: phpCode },
                { language: "python", code: pythonCode },
                { language: "curl", code: cUrl },
              ]}
              codeClassName="h-[55vh]  "
            />
          </div>
          {/* </motion.div> */}
        </div>
      </div>
      <div className="">
        <div className="flex justify-center mt-40">
          <motion.a
            className="bg-white text-black py-2 px-6 rounded-full cursor-pointer flex gap-2"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            href="https://app.youform.io/forms/caja89vr"
            target="_blank"
          >
            <RocketLaunchIcon className="h-6 w-6" />
            Join the waitlist
          </motion.a>
        </div>
      </div>
      <div className="flex justify-between mt-20 max-w-5xl mx-auto">
        <div>
          Email: <a href="mailto:hello@unsend.dev">hello@unsend.dev</a>
        </div>
        <div className="flex gap-8 items-center">
          <Link href="https://twitter.com/unsend_dev">
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
