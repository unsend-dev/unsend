import { addDomain, getDomainIdentity } from "~/server/ses";
import { db } from "~/server/db";

export async function createDomain(teamId: number, name: string) {
  console.log("Creating domain:", name);
  const publicKey = await addDomain(name);

  const domain = await db.domain.create({
    data: {
      name,
      publicKey,
      teamId,
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

  if (domain.status !== "SUCCESS") {
    const domainIdentity = await getDomainIdentity(domain.name, domain.region);

    const dkimStatus = domainIdentity.DkimAttributes?.Status;
    const spfDetails = domainIdentity.MailFromAttributes?.MailFromDomainStatus;
    const verificationError = domainIdentity.VerificationInfo?.ErrorType;
    const verificationStatus = domainIdentity.VerificationStatus;
    const lastCheckedTime =
      domainIdentity.VerificationInfo?.LastCheckedTimestamp;

    console.log(domainIdentity);

    if (
      domain.dkimStatus !== dkimStatus ||
      domain.spfDetails !== spfDetails ||
      domain.status !== verificationStatus
    ) {
      domain = await db.domain.update({
        where: {
          id,
        },
        data: {
          dkimStatus,
          spfDetails,
          status: verificationStatus ?? "NOT_STARTED",
        },
      });
    }

    return {
      ...domain,
      dkimStatus,
      spfDetails,
      verificationError,
      lastCheckedTime,
    };
  }

  return domain;
}
