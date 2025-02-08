import {
  SESv2Client,
  CreateEmailIdentityCommand,
  DeleteEmailIdentityCommand,
  GetEmailIdentityCommand,
  PutEmailIdentityMailFromAttributesCommand,
  SendEmailCommand,
  CreateConfigurationSetEventDestinationCommand,
  CreateConfigurationSetCommand,
  EventType,
  GetAccountCommand,
} from "@aws-sdk/client-sesv2";
import { generateKeyPairSync } from "crypto";
import mime from "mime-types";
import { env } from "~/env";
import { EmailContent } from "~/types";

function getSesClient(region: string) {
  return new SESv2Client({
    region: region,
    endpoint: env.AWS_SES_ENDPOINT,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY,
    },
  });
}

function generateKeyPair() {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 1024, // Length of your key in bits
    publicKeyEncoding: {
      type: "spki", // Recommended to be 'spki' by the Node.js docs
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8", // Recommended to be 'pkcs8' by the Node.js docs
      format: "pem",
    },
  });

  const base64PrivateKey = privateKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");

  const base64PublicKey = publicKey
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\n/g, "");

  return { privateKey: base64PrivateKey, publicKey: base64PublicKey };
}

export async function addDomain(domain: string, region: string) {
  const sesClient = getSesClient(region);

  const { privateKey, publicKey } = generateKeyPair();
  const command = new CreateEmailIdentityCommand({
    EmailIdentity: domain,
    DkimSigningAttributes: {
      DomainSigningSelector: "unsend",
      DomainSigningPrivateKey: privateKey,
    },
  });
  const response = await sesClient.send(command);

  const emailIdentityCommand = new PutEmailIdentityMailFromAttributesCommand({
    EmailIdentity: domain,
    MailFromDomain: `mail.${domain}`,
  });

  const emailIdentityResponse = await sesClient.send(emailIdentityCommand);

  if (
    response.$metadata.httpStatusCode !== 200 ||
    emailIdentityResponse.$metadata.httpStatusCode !== 200
  ) {
    console.log(response);
    console.log(emailIdentityResponse);
    throw new Error("Failed to create domain identity");
  }

  return publicKey;
}

export async function deleteDomain(domain: string, region: string) {
  const sesClient = getSesClient(region);
  const command = new DeleteEmailIdentityCommand({
    EmailIdentity: domain,
  });
  const response = await sesClient.send(command);
  return response.$metadata.httpStatusCode === 200;
}

export async function getDomainIdentity(domain: string, region: string) {
  const sesClient = getSesClient(region);
  const command = new GetEmailIdentityCommand({
    EmailIdentity: domain,
  });
  const response = await sesClient.send(command);
  return response;
}

export async function sendEmailThroughSes({
  to,
  from,
  subject,
  cc,
  bcc,
  text,
  html,
  replyTo,
  region,
  configurationSetName,
  unsubUrl,
  isBulk,
}: Partial<EmailContent> & {
  region: string;
  configurationSetName: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string[];
  to?: string[];
  isBulk?: boolean;
}) {
  const sesClient = getSesClient(region);
  const command = new SendEmailCommand({
    FromEmailAddress: from,
    ReplyToAddresses: replyTo ? replyTo : undefined,
    Destination: {
      ToAddresses: to,
      CcAddresses: cc,
      BccAddresses: bcc,
    },
    Content: {
      // EmailContent
      Simple: {
        // Message
        Subject: {
          // Content
          Data: subject, // required
          Charset: "UTF-8",
        },
        Body: {
          // Body
          Text: text
            ? {
                Data: text, // required
                Charset: "UTF-8",
              }
            : undefined,
          Html: html
            ? {
                Data: html, // required
                Charset: "UTF-8",
              }
            : undefined,
        },
        Headers: [
          // Spread in any unsubscribe headers if unsubUrl is defined
          ...(unsubUrl
            ? [
                { Name: "List-Unsubscribe", Value: `<${unsubUrl}>` },
                {
                  Name: "List-Unsubscribe-Post",
                  Value: "List-Unsubscribe=One-Click",
                },
              ]
            : []),
          // Spread in the precedence header if present
          ...(isBulk ? [{ Name: "Precedence", Value: "bulk" }] : []),
        ],
      },
    },
    ConfigurationSetName: configurationSetName,
  });

  try {
    const response = await sesClient.send(command);
    console.log("Email sent! Message ID:", response.MessageId);
    return response.MessageId;
  } catch (error) {
    console.error("Failed to send email", error);
    throw error;
  }
}

// Need to improve this. Use some kinda library to do this
export async function sendEmailWithAttachments({
  to,
  from,
  subject,
  replyTo,
  cc,
  bcc,
  // eslint-disable-next-line no-unused-vars
  text,
  html,
  attachments,
  region,
  configurationSetName,
}: Partial<EmailContent> & {
  region: string;
  configurationSetName: string;
  attachments: { filename: string; content: string }[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string[];
  to?: string[];
}) {
  const sesClient = getSesClient(region);
  const boundary = "NextPart";
  let rawEmail = `From: ${from}\n`;
  rawEmail += `To: ${Array.isArray(to) ? to.join(", ") : to}\n`;
  rawEmail += cc && cc.length ? `Cc: ${cc.join(", ")}\n` : "";
  rawEmail += bcc && bcc.length ? `Bcc: ${bcc.join(", ")}\n` : "";
  rawEmail +=
    replyTo && replyTo.length ? `Reply-To: ${replyTo.join(", ")}\n` : "";
  rawEmail += `Subject: ${subject}\n`;
  rawEmail += `MIME-Version: 1.0\n`;
  rawEmail += `Content-Type: multipart/mixed; boundary="${boundary}"\n\n`;
  rawEmail += `--${boundary}\n`;
  rawEmail += `Content-Type: text/html; charset="UTF-8"\n\n`;
  rawEmail += `${html}\n\n`;
  for (const attachment of attachments) {
    const content = attachment.content; // Convert buffer to base64
    const mimeType =
      mime.lookup(attachment.filename) || "application/octet-stream";
    rawEmail += `--${boundary}\n`;
    rawEmail += `Content-Type: ${mimeType}; name="${attachment.filename}"\n`;
    rawEmail += `Content-Disposition: attachment; filename="${attachment.filename}"\n`;
    rawEmail += `Content-Transfer-Encoding: base64\n\n`;
    rawEmail += `${content}\n\n`;
  }

  rawEmail += `--${boundary}--`;

  const command = new SendEmailCommand({
    Content: {
      Raw: {
        Data: Buffer.from(rawEmail),
      },
    },
    ConfigurationSetName: configurationSetName,
  });

  try {
    const response = await sesClient.send(command);
    console.log("Email with attachments sent! Message ID:", response.MessageId);
    return response.MessageId;
  } catch (error) {
    console.error("Failed to send email with attachments", error);
    throw new Error("Failed to send email with attachments");
  }
}

export async function getAccount(region: string) {
  const client = getSesClient(region);
  const input = new GetAccountCommand({});
  const response = await client.send(input);
  return response;
}

export async function addWebhookConfiguration(
  configName: string,
  topicArn: string,
  eventTypes: EventType[],
  region: string
) {
  const sesClient = getSesClient(region);

  const configSetCommand = new CreateConfigurationSetCommand({
    ConfigurationSetName: configName,
  });

  const configSetResponse = await sesClient.send(configSetCommand);

  if (configSetResponse.$metadata.httpStatusCode !== 200) {
    throw new Error("Failed to create configuration set");
  }

  const command = new CreateConfigurationSetEventDestinationCommand({
    ConfigurationSetName: configName, // required
    EventDestinationName: "unsend_destination", // required
    EventDestination: {
      Enabled: true,
      MatchingEventTypes: eventTypes,
      SnsDestination: {
        TopicArn: topicArn,
      },
    },
  });

  const response = await sesClient.send(command);
  return response.$metadata.httpStatusCode === 200;
}
