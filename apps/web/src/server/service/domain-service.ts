import dns from "dns";
import util from "util";
import * as tldts from "tldts";
import * as ses from "~/server/aws/ses";
import { db } from "~/server/db";

const dnsResolveTxt = util.promisify(dns.resolveTxt);

export async function createDomain(teamId: number, name: string) {
  const subdomain = tldts.getSubdomain(name);
  const publicKey = await ses.addDomain(name);

  const domain = await db.domain.create({
    data: {
      name,
      publicKey,
      teamId,
      subdomain,
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

async function getDmarcRecord(domain: string) {
  try {
    const dmarcRecord = await dnsResolveTxt(`_dmarc.${domain}`);
    return dmarcRecord;
  } catch (error) {
    console.error("Error fetching DMARC record:", error);
    return null; // or handle error as appropriate
  }
}
