import { EmailContent } from "~/types";
import { db } from "../db";
import { UnsendApiError } from "~/server/public-api/api-error";
import { EmailQueueService } from "./email-queue-service";
import { validateDomainFromEmail } from "./domain-service";
import { EmailRenderer } from "@unsend/email-editor/src/renderer";

async function checkIfValidEmail(emailId: string) {
  const email = await db.email.findUnique({
    where: { id: emailId },
  });

  if (!email || !email.domainId) {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: "Email not found",
    });
  }

  const domain = await db.domain.findUnique({
    where: { id: email.domainId },
  });

  if (!domain) {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: "Email not found",
    });
  }

  return { email, domain };
}

export const replaceVariables = (text: string, variables: Record<string, string>) => {
  return Object.keys(variables).reduce((accum, key) => {
    const re = new RegExp(`{{${key}}}`, 'g');
    const returnTxt = accum.replace(re, variables[key] as string);
    return returnTxt;
  }, text);
};

/**
 Send transactional email
 */
export async function sendEmail(
  emailContent: EmailContent & { teamId: number }
) {
  const {
    to,
    from,
    subject: subjectFromApiCall,
    templateId,
    variables,
    text,
    html: htmlFromApiCall,
    teamId,
    attachments,
    replyTo,
    cc,
    bcc,
    scheduledAt,
  } = emailContent;
  let subject = subjectFromApiCall;
  let html = htmlFromApiCall;

  const domain = await validateDomainFromEmail(from, teamId);

  if (templateId) {
    const template = await db.template.findUnique({
      where: { id: templateId },
    });
    
    if (template) {
      const jsonContent = JSON.parse(template.content || "{}");
      const renderer = new EmailRenderer(jsonContent);

      subject = replaceVariables(template.subject || '', variables || {});
      html = await renderer.render({
        shouldReplaceVariableValues: true,
        variableValues: variables,
      });
    }
  }

  const scheduledAtDate = scheduledAt ? new Date(scheduledAt) : undefined;
  const delay = scheduledAtDate
    ? Math.max(0, scheduledAtDate.getTime() - Date.now())
    : undefined;

  const email = await db.email.create({
    data: {
      to: Array.isArray(to) ? to : [to],
      from,
      subject,
      replyTo: replyTo
        ? Array.isArray(replyTo)
          ? replyTo
          : [replyTo]
        : undefined,
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      text,
      html,
      teamId,
      domainId: domain.id,
      attachments: attachments ? JSON.stringify(attachments) : undefined,
      scheduledAt: scheduledAtDate,
      latestStatus: scheduledAtDate ? "SCHEDULED" : "QUEUED",
    },
  });

  try {
    await EmailQueueService.queueEmail(
      email.id,
      domain.region,
      true,
      undefined,
      delay
    );
  } catch (error: any) {
    await db.emailEvent.create({
      data: {
        emailId: email.id,
        status: "FAILED",
        data: {
          error: error.toString(),
        },
      },
    });
    await db.email.update({
      where: { id: email.id },
      data: { latestStatus: "FAILED" },
    });
    throw error;
  }

  return email;
}

export async function updateEmail(
  emailId: string,
  {
    scheduledAt,
  }: {
    scheduledAt?: string;
  }
) {
  const { email, domain } = await checkIfValidEmail(emailId);

  if (email.latestStatus !== "SCHEDULED") {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: "Email already processed",
    });
  }

  const scheduledAtDate = scheduledAt ? new Date(scheduledAt) : undefined;
  const delay = scheduledAtDate
    ? Math.max(0, scheduledAtDate.getTime() - Date.now())
    : undefined;

  await db.email.update({
    where: { id: emailId },
    data: {
      scheduledAt: scheduledAtDate,
    },
  });

  await EmailQueueService.changeDelay(emailId, domain.region, true, delay ?? 0);
}

export async function cancelEmail(emailId: string) {
  const { email, domain } = await checkIfValidEmail(emailId);

  if (email.latestStatus !== "SCHEDULED") {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: "Email already processed",
    });
  }

  await EmailQueueService.chancelEmail(emailId, domain.region, true);

  await db.email.update({
    where: { id: emailId },
    data: {
      latestStatus: "CANCELLED",
    },
  });

  await db.emailEvent.create({
    data: {
      emailId,
      status: "CANCELLED",
    },
  });
}
