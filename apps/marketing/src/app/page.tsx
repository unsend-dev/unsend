"use client"

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
import { Code } from "@unsend/ui/src/code"
import { hi } from "date-fns/locale";


const jsCode = `const requestOptions = {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer us_ad9a79256e366399c747cbf0b38eca3c472e8a2e"
  },
  body: JSON.stringify({
    "to": "koushikmohan1996@gmail.com",
    "from": "hello@test.splitpro.app",
    "subject": "Test mail",
    "html": "<p>Hello this is a test mail</p>"
  }),
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/emails", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.error(error));
`;

const pythonCode = `import requests
import json

url = "http://localhost:3000/api/v1/emails"

payload = json.dumps({
  "to": "koushikmohan1996@gmail.com",
  "from": "hello@test.splitpro.app",
  "subject": "Test mail",
  "html": "<p>Hello this is a test mail</p>"
})
headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer us_ad9a79256e366399c747cbf0b38eca3c472e8a2e'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)`;

const rubyCode = `require 'uri'
require 'net/http'
require 'json'

url = URI("http://localhost:3000/api/v1/emails")

http = Net::HTTP.new(url.host, url.port)
request = Net::HTTP::Post.new(url)
request["Accept"] = 'application/json'
request["Content-Type"] = 'application/json'
request["Authorization"] = 'Bearer us_ad9a79256e366399c747cbf0b38eca3c472e8a2e'
request.body = JSON.dump({
  "to" => "koushikmohan1996@gmail.com",
  "from" => "hello@test.splitpro.app",
  "subject" => "Test mail",
  "html" => "<p>Hello this is a test mail</p>"
})

response = http.request(request)
puts response.read_body`;

const phpCode = `$url = "http://localhost:3000/api/v1/emails";

$payload = json_encode(array(
  "to" => "koushikmohan1996@gmail.com",
  "from" => "hello@test.splitpro.app",
  "subject" => "Test mail",
  "html" => "<p>Hello this is a test mail</p>"
));

$headers = array(
  "Accept: application/json",
  "Content-Type: application/json",
  "Authorization: Bearer us_ad9a79256e366399c747cbf0b38eca3c472e8a2e"
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


export default function Home() {
  return (
    <div className="bg-neutral-950 pb-20">
      <div className="h-screen w-full relative flex flex-col items-center   justify-center ">
        <div className=" w-full lg:max-w-4xl mx-auto p-4 -mt-40 lg:mt-0">
          <h1 className="relative z-10 text-neutral-100 text-2xl md:text-6xl md:leading-[4.5rem]    text-center font-sans font-bold">
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

        {/* <BackgroundBeams /> */}
      </div>
      <div className=" w-full lg:max-w-5xl mx-auto flex flex-col gap-40">
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
                  delay: 0.3,
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
              }}
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, scale: 0.7 },
                visible: { opacity: 1, scale: 1 },
              }}
              className="w-full h-[15rem]  rounded-lg border flex justify-center items-center"
            >
              <div className="text-3xl">{'Coming soon!'.split('').map((l, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, },
                    visible: { opacity: 1 },
                  }}
                >{l}</motion.span>
              ))}</div>
            </motion.div>
          </div>
        </div>
        <div className=" px-8 lg:px-0 mt-20">
          <p className="text-center text-3xl lg:text-6xl  ">Integrate in minutes</p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4, type: "spring",
              damping: 13,
              stiffness: 100,
              delay: 0.2

            }}>
            <Code
              codeBlocks={[
                { language: "js", code: jsCode },
                { language: "ruby", code: rubyCode },
                { language: "php", code: phpCode },
                { language: "python", code: pythonCode },
              ]}
              codeClassName="h-[55vh]"
            />
          </motion.div>
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
    </div>
  );
}
