import dns from "dns";
import util from "util";
import * as tldts from "tldts";
import * as ses from "~/server/aws/ses";
import { db } from "~/server/db";
import { SesSettingsService } from "./ses-settings-service";
import { UnsendApiError } from "../public-api/api-error";

const dnsResolveTxt = util.promisify(dns.resolveTxt);

export async function validateDomainFromEmail(email: string, teamId: number) {
  // Extract email from format like 'Name <email@domain>' this will allow entries such as "Someone @ something <some@domain.com>" to parse correctly as well.
  const match = email.match(/<([^>]+)>/);
  let fromDomain: string | undefined;

  if (match && match[1]) {
    const parts = match[1].split("@");
    fromDomain = parts.length > 1 ? parts[1] : undefined;
  } else {
    const parts = email.split("@");
    fromDomain = parts.length > 1 ? parts[1] : undefined;
  }

  if (fromDomain?.endsWith(">")) {
    fromDomain = fromDomain.slice(0, -1);
  }

  if (!fromDomain) {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: "From email is invalid",
    });
  }

  const domain = await db.domain.findUnique({
    where: { name: fromDomain, teamId },
  });

  if (!domain) {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: `Domain: ${fromDomain} of from email is wrong. Use the domain verified by unsend`,
    });
  }

  if (domain.status !== "SUCCESS") {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: `Domain: ${fromDomain} is not verified`,
    });
  }

  return domain;
}

export async function createDomain(
  teamId: number,
  name: string,
  region: string
) {
  const domainStr = tldts.getDomain(name);

  console.log("Creating domain", { domainStr, name, region });

  if (!domainStr) {
    throw new Error("Invalid domain");
  }

  const setting = await SesSettingsService.getSetting(region);

  if (!setting) {
    throw new Error("Ses setting not found");
  }

  const subdomain = tldts.getSubdomain(name);
  const publicKey = await ses.addDomain(name, region);

  const domain = await db.domain.create({
    data: {
      name,
      publicKey,
      teamId,
      subdomain,
      region,
    },
  });

  return domain;
}

export async function getDomain(id: number) {
  let domain = await db.domain.findUnique({
    where: {
      id,
    },
  });

  if (!domain) {
    throw new Error("Domain not found");
  }

  if (domain.isVerifying) {
    const domainIdentity = await ses.getDomainIdentity(
      domain.name,
      domain.region
    );

    const dkimStatus = domainIdentity.DkimAttributes?.Status;
    const spfDetails = domainIdentity.MailFromAttributes?.MailFromDomainStatus;
    const verificationError = domainIdentity.VerificationInfo?.ErrorType;
    const verificationStatus = domainIdentity.VerificationStatus;
    const lastCheckedTime =
      domainIdentity.VerificationInfo?.LastCheckedTimestamp;
    const _dmarcRecord = await getDmarcRecord(domain.name);
    const dmarcRecord = _dmarcRecord?.[0]?.[0];

    domain = await db.domain.update({
      where: {
        id,
      },
      data: {
        dkimStatus,
        spfDetails,
        status: verificationStatus ?? "NOT_STARTED",
        dmarcAdded: dmarcRecord ? true : false,
        isVerifying:
          verificationStatus === "SUCCESS" &&
          dkimStatus === "SUCCESS" &&
          spfDetails === "SUCCESS"
            ? false
            : true,
      },
    });

    return {
      ...domain,
      dkimStatus: dkimStatus?.toString() ?? null,
      spfDetails: spfDetails?.toString() ?? null,
      verificationError: verificationError?.toString() ?? null,
      lastCheckedTime,
      dmarcAdded: dmarcRecord ? true : false,
    };
  }

  return domain;
}

export async function updateDomain(
  id: number,
  data: { clickTracking?: boolean; openTracking?: boolean }
) {
  return db.domain.update({
    where: { id },
    data,
  });
}

export async function deleteDomain(id: number) {
  const domain = await db.domain.findUnique({
    where: { id },
  });

  if (!domain) {
    throw new Error("Domain not found");
  }

  const deleted = await ses.deleteDomain(domain.name, domain.region);

  if (!deleted) {
    throw new Error("Error in deleting domain");
  }

  return db.domain.delete({
    where: { id },
  });
}

export async function getDomains(teamId: number) {
  return db.domain.findMany({
    where: {
      teamId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getDmarcRecord(domain: string) {
  try {
    const dmarcRecord = await dnsResolveTxt(`_dmarc.${domain}`);
    return dmarcRecord;
  } catch (error) {
    console.error("Error fetching DMARC record:", error);
    return null; // or handle error as appropriate
  }
}
