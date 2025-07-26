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
import nodemailer from "nodemailer";
import { Readable } from "stream";
import { env } from "~/env";
import { EmailContent } from "~/types";
import { nanoid } from "../nanoid";
import { logger } from "../logger/log";

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
    logger.error(
      { response, emailIdentityResponse },
      "Failed to create domain identity"
    );
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

export async function sendRawEmail({
  to,
  from,
  subject,
  replyTo,
  cc,
  bcc,
  text,
  html,
  attachments,
  region,
  configurationSetName,
  unsubUrl,
  isBulk,
  inReplyToMessageId,
}: Partial<EmailContent> & {
  region: string;
  configurationSetName: string;
  attachments?: { filename: string; content: string }[]; // Made attachments optional
  cc?: string[];
  bcc?: string[];
  replyTo?: string[];
  to?: string[];
  unsubUrl?: string;
  isBulk?: boolean;
  inReplyToMessageId?: string;
}) {
  const sesClient = getSesClient(region);

  const { message: messageStream } = await nodemailer
    .createTransport({ streamTransport: true })
    .sendMail({
      from,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        encoding: "base64",
      })),
      text,
      replyTo,
      cc,
      bcc,
      headers: {
        "X-Entity-Ref-ID": nanoid(),
        ...(unsubUrl
          ? {
              "List-Unsubscribe": `<${unsubUrl}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            }
          : {}),
        ...(isBulk ? { Precedence: "bulk" } : {}),
        ...(inReplyToMessageId
          ? {
              "In-Reply-To": `<${inReplyToMessageId}@email.amazonses.com>`,
              References: `<${inReplyToMessageId}@email.amazonses.com>`,
            }
          : {}),
      },
    });

  const chunks = [];
  for await (const chunk of messageStream) {
    chunks.push(chunk);
  }
  const finalMessageData = Buffer.concat(chunks);

  const command = new SendEmailCommand({
    Content: {
      Raw: {
        Data: finalMessageData,
      },
    },
    ConfigurationSetName: configurationSetName,
  });

  try {
    const response = await sesClient.send(command);
    logger.info({ messageId: response.MessageId }, "Email sent!");
    return response.MessageId;
  } catch (error) {
    logger.error({ err: error }, "Failed to send email");
    // It's better to throw the original error or a new error with more context
    // throw new Error("Failed to send email");
    throw error;
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
