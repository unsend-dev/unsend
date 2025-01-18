import { EmailContent } from "~/types";
import { db } from "../db";
import { UnsendApiError } from "~/server/public-api/api-error";
import { EmailQueueService } from "./email-queue-service";
import { validateDomainFromEmail } from "./domain-service";
import { RedisRateLimiter } from "./rate-limitter";

const rateLimiter = new RedisRateLimiter(process.env.REDIS_URL, 1, 10);

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

/**
 Send transactional email
 */
export async function sendEmail(
  emailContent: EmailContent & { teamId: number }
) {
  const {
    to,
    from,
    subject,
    text,
    html,
    teamId,
    attachments,
    replyTo,
    cc,
    bcc,
    scheduledAt,
  } = emailContent;

  const [domain, rateLimitInfo] = await Promise.all([
    await validateDomainFromEmail(from, teamId),
    await emailRateLimiter(to, "DOMAIN")
  ])

  const scheduledAtDate = scheduledAt ? new Date(scheduledAt) : undefined;
  const delay = scheduledAtDate
    ? Math.max(0, scheduledAtDate.getTime() - Date.now())
    : undefined;

  const withinLimitEmail = await db.email.create({
    data: {
      to: rateLimitInfo.withinLimits,
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

  
  let rateLimittedEmail = {id: ''}
  if (rateLimitInfo.rateLimited.length > 0) {
    rateLimittedEmail = await db.email.create({
      data: {
        to: rateLimitInfo.rateLimited,
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
  } 

  try {
    await EmailQueueService.queueEmail(
      withinLimitEmail.id,
      domain.region,
      true,
      undefined,
      delay
    );
  } catch (error: any) {
    await db.emailEvent.create({
      data: {
        emailId: withinLimitEmail.id,
        status: "FAILED",
        data: {
          error: error.toString(),
        },
      },
    });
    await db.email.update({
      where: { id: withinLimitEmail.id },
      data: { latestStatus: "FAILED" },
    });
    throw error;
  }

  if (Object.hasOwn(rateLimittedEmail, 'id') && rateLimittedEmail.id !== '') {
    try {
      const retryDelay = 1 * 1000;
      await EmailQueueService.queueEmail(
        rateLimittedEmail?.id,
        domain.region,
        true,
        undefined,
        delay ? delay + retryDelay : retryDelay
      );
    } catch (error: any) {
      await db.emailEvent.create({
        data: {
          emailId: rateLimittedEmail.id,
          status: "FAILED",
          data: {
            error: error.toString(),
          },
        },
      });
      await db.email.update({
        where: { id: rateLimittedEmail.id },
        data: { latestStatus: "FAILED" },
      });
      throw error;
    }
  }

  return {withinLimitEmail, rateLimittedEmail};
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

async function emailRateLimiter(to: string | string[], rateLimitBy: 'DOMAIN' | 'RECIEVER'): Promise<{rateLimited: string[], withinLimits: string[]}>  {
  let identifiers: string | string[];

  switch (rateLimitBy) {
    case 'DOMAIN':
      if (typeof to === 'string') {
        const domain = to.split('@')[1];
        if (!domain) {
          throw new UnsendApiError({
            code: "BAD_REQUEST",
            message: "Invalid email address format for rate limiting by domain.",
          });
        }
        identifiers = [domain];
      } else {
        identifiers = to.map(email => {
          const domain = email.split('@')[1];
          if (!domain) {
            throw new UnsendApiError({
              code: "BAD_REQUEST",
              message: "Invalid email address format for rate limiting by domain.",
            });
          }

          return domain;
        });
      }
      break;

    case 'RECIEVER':
      identifiers = Array.isArray(to) ? to : [to];
      break;

    default:
      throw new UnsendApiError({
        code: "BAD_REQUEST",
        message: "Invalid rate limiting strategy",
      });
  }

  return await processRateLimits(rateLimitBy, identifiers);
}

async function processRateLimits(
  rateLimitBy: 'DOMAIN' | 'RECIEVER',
  identifiers: string[]
) {
  const rateLimited: string[] = [];
  const withinLimits: string[] = [];

  await Promise.all(
      identifiers.map(async (identifier) => {
          try {
              const key = rateLimiter.getRateLimitKey(`${rateLimitBy}:${identifier}`);
              await rateLimiter.checkRateLimit(key);
              withinLimits.push(identifier);
          } catch (error) {
              console.error(`Rate limiting failed for ${identifier}`);
              rateLimited.push(identifier);
          }
      })
  );

  console.log(`Rate-limited: ${rateLimited.join(", ")}`);
  console.log(`Within limit: ${withinLimits.join(", ")}`);

  return { rateLimited, withinLimits }
}