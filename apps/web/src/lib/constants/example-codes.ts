import { CodeBlock } from "@unsend/ui/src/code";

export const getSendTestEmailCode = ({
  from,
  to,
  subject,
  body,
  bodyHtml,
}: {
  from: string;
  to: string;
  subject: string;
  body: string;
  bodyHtml: string;
}): Array<CodeBlock> => {
  return [
    {
      language: "js",
      title: "Node.js",
      code: `import { Unsend } from "unsend";

const unsend = new Unsend({ apiKey: "us_12345" });

unsend.emails.send({
  to: "${to}",
  from: "${from}",
  subject: "${subject}",
  html: "${bodyHtml}",
  text: "${body}",
});
`,
    },
    {
      language: "python",
      title: "Python",
      code: `import requests

url = "https://app.unsend.dev/api/v1/emails"
      
payload = {
    "to": "${to}",
    "from": "${from}",
    "subject": "${subject}",
    "text": "${body}",
    "html": "${bodyHtml}",
}

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer us_12345"
}
      
response = requests.request("POST", url, json=payload, headers=headers)
`,
    },
    {
      language: "php",
      title: "PHP",
      code: `<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://app.unsend.dev/api/v1/emails",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\\n  \\"to\\": \\"${to}\\",\\n  \\"from\\": \\"${from}\\",\\n  \\"subject\\": \\"${subject}\\",\\n  \\"replyTo\\": \\"${from}\\",\\n  \\"text\\": \\"${body}\\",\\n  \\"html\\": \\"${bodyHtml}\\"\\n}",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer us_12345",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}

`,
    },
    {
      language: "ruby",
      title: "Ruby",
      code: `require 'net/http'
require 'uri'
require 'json'

url = URI("https://app.unsend.dev/api/v1/emails")

payload = {
  "to" => "${to}",
  "from" => "${from}",
  "subject" => "${subject}",
  "text" => "${body}",
  "html" => "${bodyHtml}"
}.to_json

headers = {
  "Content-Type" => "application/json",
  "Authorization" => "Bearer us_12345"
}

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url, headers)
request.body = payload

response = http.request(request)

puts response.body
`,
    },
    {
      language: "curl",
      title: "cURL",
      code: `curl -X POST https://app.unsend.dev/api/v1/emails \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer us_12345" \\
-d '{"to": "${to}", "from": "${from}", "subject": "${subject}", "text": "${body}", "html": "${bodyHtml}"}'`,
    },
  ];
};
