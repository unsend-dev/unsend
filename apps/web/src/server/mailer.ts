import { env } from "~/env";
import { Unsend } from "unsend";
import { isSelfHosted } from "~/utils/common";
import { db } from "./db";
import { getDomains } from "./service/domain-service";
import { sendEmail } from "./service/email-service";

let unsend: Unsend | undefined;

const getClient = () => {
  if (!unsend) {
    unsend = new Unsend(env.UNSEND_API_KEY);
  }
  return unsend;
};

export async function sendSignUpEmail(
  email: string,
  token: string,
  url: string
) {
  const { host } = new URL(url);

  if (env.NODE_ENV === "development") {
    console.log("Sending sign in email", { email, url, token });
    return;
  }

  const subject = "Sign in to Unsend";
  const text = `Hey,\n\nYou can sign in to Unsend by clicking the below URL:\n${url}\n\nYou can also use this OTP: ${token}\n\nThanks,\nUnsend Team`;
  const html = `<p>Hey,</p> <p>You can sign in to Unsend by clicking the below URL:</p><p><a href="${url}">Sign in to ${host}</a></p><p>You can also use this OTP: <b>${token}</b></p<br /><br /><p>Thanks,</p><p>Unsend Team</p>`;

  await sendMail(email, subject, text, html);
}

export async function sendTeamInviteEmail(
  email: string,
  url: string,
  teamName: string
) {
  const { host } = new URL(url);

  if (env.NODE_ENV === "development") {
    console.log("Sending team invite email", { email, url, teamName });
    return;
  }

  const subject = "You have been invited to join a team";
  const text = `Hey,\n\nYou have been invited to join the team ${teamName} on Unsend.\n\nYou can accept the invitation by clicking the below URL:\n${url}\n\nThanks,\nUnsend Team`;
  const html = `<p>Hey,</p> <p>You have been invited to join the team <b>${teamName}</b> on Unsend.</p><p>You can accept the invitation by clicking the below URL:</p><p><a href="${url}">Accept invitation</a></p><br /><br /><p>Thanks,</p><p>Unsend Team</p>`;

  await sendMail(email, subject, text, html);
}

async function sendMail(
  email: string,
  subject: string,
  text: string,
  html: string
) {
  if (isSelfHosted()) {
    console.log("Sending email using self hosted");
    /* 
      Self hosted so checking if we can send using one of the available domain
      Assuming self hosted will have only one team
      TODO: fix this
     */
    const team = await db.team.findFirst({});
    if (!team) {
      console.error("No team found");
      return;
    }

    const domains = await getDomains(team.id);

    if (domains.length === 0 || !domains[0]) {
      console.error("No domains found");
      return;
    }

    const domain = domains[0];

    await sendEmail({
      teamId: team.id,
      to: email,
      from: `hello@${domain.name}`,
      subject,
      text,
      html,
    });
  } else if (env.UNSEND_API_KEY && env.FROM_EMAIL) {
    const resp = await getClient().emails.send({
      to: email,
      from: env.FROM_EMAIL,
      subject,
      text,
      html,
    });

    if (resp.data) {
      console.log("Email sent using unsend");
      return;
    } else {
      console.log(
        "Error sending email using unsend, so fallback to resend",
        resp.error?.code,
        resp.error?.message
      );
    }
  } else {
    throw new Error("UNSEND_API_KEY not found");
  }
}
