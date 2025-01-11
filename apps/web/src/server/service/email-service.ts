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

  const [domain] = await Promise.all([
    await validateDomainFromEmail(from, teamId),
    await emailRateLimiter(to, "DOMAIN")
  ])

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

async function emailRateLimiter(to: string | string[], rateLimitBy: 'DOMAIN' | 'RECIEVER'): Promise<void>  {
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

  await Promise.all(
    identifiers.map(identifier => checkAndApplyRateLimit(rateLimitBy, identifier))
  );

  console.log(`Email to ${identifiers.join(", ")} is within the rate limit.`);
}

async function checkAndApplyRateLimit(rateLimitBy: 'DOMAIN' | 'RECIEVER', identifier: string) {
  const key = rateLimiter.getRateLimitKey(`${rateLimitBy}:${identifier}`)
  await rateLimiter.checkRateLimit(key);
}
