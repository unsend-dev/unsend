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

export const replaceVariables = (
  text: string,
  variables: Record<string, string>
) => {
  return Object.keys(variables).reduce((accum, key) => {
    const re = new RegExp(`{{${key}}}`, "g");
    const returnTxt = accum.replace(re, variables[key] as string);
    return returnTxt;
  }, text);
};

/**
 Send transactional email
 */
export async function sendEmail(
  emailContent: EmailContent & { teamId: number; apiKeyId?: number }
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
    apiKeyId,
    inReplyTo,
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

      subject = replaceVariables(template.subject || "", variables || {});

      // {{}} for link replacements
      const modifiedVariables = {
        ...variables,
        ...Object.keys(variables || {}).reduce(
          (acc, key) => {
            acc[`{{${key}}}`] = variables?.[key] || "";
            return acc;
          },
          {} as Record<string, string>
        ),
      };

      html = await renderer.render({
        shouldReplaceVariableValues: true,
        variableValues: modifiedVariables,
      });
    }
  }

  if (inReplyTo) {
    const email = await db.email.findUnique({
      where: {
        id: inReplyTo,
        teamId,
      },
    });

    if (!email) {
      throw new UnsendApiError({
        code: "BAD_REQUEST",
        message: '"inReplyTo" is invalid',
      });
    }
  }

  if (!text && !html) {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: "Either text or html is required",
    });
  }

  const scheduledAtDate = scheduledAt ? new Date(scheduledAt) : undefined;
  const delay = scheduledAtDate
    ? Math.max(0, scheduledAtDate.getTime() - Date.now())
    : undefined;

  const email = await db.email.create({
    data: {
      to: Array.isArray(to) ? to : [to],
      from,
      subject: subject as string,
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
      apiId: apiKeyId,
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

/**
 * Send multiple emails in bulk (up to 100 at a time)
 * Handles template rendering, variable replacement, and efficient bulk queuing
 */
export async function sendBulkEmails(
  emailContents: Array<
    EmailContent & {
      teamId: number;
      apiKeyId?: number;
    }
  >
) {
  if (emailContents.length === 0) {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: "No emails provided for bulk send",
    });
  }

  if (emailContents.length > 100) {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: "Cannot send more than 100 emails in a single bulk request",
    });
  }

  // Group emails by domain to minimize domain validations
  const emailsByDomain = new Map<
    string,
    {
      domain: Awaited<ReturnType<typeof validateDomainFromEmail>>;
      emails: typeof emailContents;
    }
  >();

  // First pass: validate domains and group emails
  for (const content of emailContents) {
    const { from } = content;
    if (!emailsByDomain.has(from)) {
      const domain = await validateDomainFromEmail(from, content.teamId);
      emailsByDomain.set(from, { domain, emails: [] });
    }
    emailsByDomain.get(from)?.emails.push(content);
  }

  // Cache templates to avoid repeated database queries
  const templateCache = new Map<
    number,
    { subject: string; content: any; renderer: EmailRenderer }
  >();

  const createdEmails = [];
  const queueJobs = [];

  // Process each domain group
  for (const { domain, emails } of emailsByDomain.values()) {
    // Process emails in each domain group
    for (const content of emails) {
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
        apiKeyId,
      } = content;

      let subject = subjectFromApiCall;
      let html = htmlFromApiCall;

      // Process template if specified
      if (templateId) {
        let templateData = templateCache.get(Number(templateId));
        if (!templateData) {
          const template = await db.template.findUnique({
            where: { id: templateId },
          });
          if (template) {
            const jsonContent = JSON.parse(template.content || "{}");
            templateData = {
              subject: template.subject || "",
              content: jsonContent,
              renderer: new EmailRenderer(jsonContent),
            };
            templateCache.set(Number(templateId), templateData);
          }
        }

        if (templateData) {
          subject = replaceVariables(templateData.subject, variables || {});

          // {{}} for link replacements
          const modifiedVariables = {
            ...variables,
            ...Object.keys(variables || {}).reduce(
              (acc, key) => {
                acc[`{{${key}}}`] = variables?.[key] || "";
                return acc;
              },
              {} as Record<string, string>
            ),
          };

          html = await templateData.renderer.render({
            shouldReplaceVariableValues: true,
            variableValues: modifiedVariables,
          });
        }
      }

      if (!text && !html) {
        throw new UnsendApiError({
          code: "BAD_REQUEST",
          message: `Either text or html is required for email to ${to}`,
        });
      }

      const scheduledAtDate = scheduledAt ? new Date(scheduledAt) : undefined;
      const delay = scheduledAtDate
        ? Math.max(0, scheduledAtDate.getTime() - Date.now())
        : undefined;

      try {
        // Create email record
        const email = await db.email.create({
          data: {
            to: Array.isArray(to) ? to : [to],
            from,
            subject: subject as string,
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
            apiId: apiKeyId,
          },
        });

        createdEmails.push(email);

        // Prepare queue job
        queueJobs.push({
          emailId: email.id,
          region: domain.region,
          transactional: true, // Bulk emails are still transactional
          delay,
          timestamp: Date.now(),
        });
      } catch (error: any) {
        console.error(
          `Failed to create email record for recipient ${to}:`,
          error
        );
        // Continue processing other emails
      }
    }
  }

  if (queueJobs.length === 0) {
    throw new UnsendApiError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create any email records",
    });
  }

  // Bulk queue all jobs
  try {
    await EmailQueueService.queueBulk(queueJobs);
  } catch (error: any) {
    // Mark all created emails as failed
    await Promise.all(
      createdEmails.map(async (email) => {
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
      })
    );
    throw error;
  }

  return createdEmails;
}
