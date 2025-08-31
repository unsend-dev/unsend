"use client";

import { Button } from "@usesend/ui/src/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@usesend/ui/src/dialog";
import { api } from "~/trpc/react";
import React, { useState } from "react";
import { Domain } from "@prisma/client";
import { toast } from "@usesend/ui/src/toaster";
import { SendHorizonal } from "lucide-react";
import { Code } from "@usesend/ui/src/code";
import { useSession } from "next-auth/react";
import { getSendTestEmailCode } from "~/lib/constants/example-codes";

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

export const SendTestMail: React.FC<{ domain: Domain }> = ({ domain }) => {
  const [open, setOpen] = useState(false);
  const sendTestEmailFromDomainMutation =
    api.domain.sendTestEmailFromDomain.useMutation();

  const { data: session } = useSession();

  const utils = api.useUtils();

  function handleSendTestEmail() {
    sendTestEmailFromDomainMutation.mutate(
      {
        id: domain.id,
      },
      {
        onSuccess: () => {
          utils.domain.domains.invalidate();
          toast.success(`Test email sent`);
          setOpen(false);
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(_open) => (_open !== open ? setOpen(_open) : null)}
    >
      <DialogTrigger asChild>
        <Button>
          <SendHorizonal className="h-4 w-4 mr-2" />
          Send test email
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send test email</DialogTitle>
        </DialogHeader>
        <Code
          codeBlocks={getSendTestEmailCode({
            from: `hello@${domain.name}`,
            to: session?.user?.email || "",
            subject: "Unsend test email",
            body: "hello,\\n\\nUnsend is the best open source sending platform",
            bodyHtml:
              "<p>hello,</p><p>Unsend is the best open source sending platform<p><p>check out <a href='https://unsend.dev'>unsend.dev</a>",
          })}
          codeClassName="max-w-[38rem] h-[20rem]"
        />
        <div className="flex justify-end w-full">
          <Button
            onClick={handleSendTestEmail}
            disabled={sendTestEmailFromDomainMutation.isPending}
          >
            {sendTestEmailFromDomainMutation.isPending
              ? "Sending email..."
              : "Send test email"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendTestMail;
