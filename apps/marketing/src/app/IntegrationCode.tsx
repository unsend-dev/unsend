"use client";

import { Code } from "@unsend/ui/src/code";

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

export default function IntegrationCode() {
  return (
    <Code
      codeBlocks={[
        { language: "js", code: jsCode },
        { language: "ruby", code: rubyCode },
        { language: "php", code: phpCode },
        { language: "python", code: pythonCode },
        { language: "curl", code: cUrl },
      ]}
      codeClassName="h-[500px]  "
    />
  );
}
