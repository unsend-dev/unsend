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
} from "@aws-sdk/client-sesv2";
import { generateKeyPairSync } from "crypto";
import mime from "mime-types";
import { env } from "~/env";
import { EmailContent } from "~/types";
import { APP_SETTINGS } from "~/utils/constants";

function getSesClient(region = "us-east-1") {
  return new SESv2Client({
    region: region,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY,
    },
  });
}

function generateKeyPair() {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048, // Length of your key in bits
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

export async function addDomain(domain: string, region = "us-east-1") {
  const sesClient = getSesClient(region);

  const { privateKey, publicKey } = generateKeyPair();
  const command = new CreateEmailIdentityCommand({
    EmailIdentity: domain,
    DkimSigningAttributes: {
      DomainSigningSelector: "unsend",
      DomainSigningPrivateKey: privateKey,
    },
    ConfigurationSetName: APP_SETTINGS.SES_CONFIGURATION_GENERAL,
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

export async function deleteDomain(domain: string, region = "us-east-1") {
  const sesClient = getSesClient(region);
  const command = new DeleteEmailIdentityCommand({
    EmailIdentity: domain,
  });
  const response = await sesClient.send(command);
  return response.$metadata.httpStatusCode === 200;
}

export async function getDomainIdentity(domain: string, region = "us-east-1") {
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
  text,
  html,
  region = "us-east-1",
  configurationSetName,
}: EmailContent & {
  region?: string;
  configurationSetName: string;
}) {
  const sesClient = getSesClient(region);
  const command = new SendEmailCommand({
    FromEmailAddress: from,
    Destination: {
      ToAddresses: [to],
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
          Text: {
            Data: text, // required
            Charset: "UTF-8",
          },
          Html: {
            Data: html, // required
            Charset: "UTF-8",
          },
        },
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
    throw new Error("Failed to send email");
  }
}

export async function sendEmailWithAttachments({
  to,
  from,
  subject,
  // eslint-disable-next-line no-unused-vars
  text,
  html,
  attachments,
  region = "us-east-1",
  configurationSetName,
}: EmailContent & {
  region?: string;
  configurationSetName: string;
  attachments: { filename: string; content: string }[];
}) {
  const sesClient = getSesClient(region);
  const boundary = "NextPart";
  let rawEmail = `From: ${from}\n`;
  rawEmail += `To: ${to}\n`;
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

export async function addWebhookConfiguration(
  configName: string,
  topicArn: string,
  eventTypes: EventType[],
  region = "us-east-1"
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
