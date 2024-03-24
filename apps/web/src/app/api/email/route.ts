import { headers } from "next/headers";
import { hashToken } from "~/server/auth";
import { db } from "~/server/db";
import { sendEmail } from "~/server/service/email-service";

export async function GET() {
  return Response.json({ data: "Hello" });
}

export async function POST(req: Request) {
  const token = headers().get("authorization")?.split(" ")[1];
  console.log(token);
  if (!token) {
    return new Response("authorization token is required", {
      status: 401,
    });
  }
  const hashedToken = hashToken(token);
  const team = await db.team.findFirst({
    where: {
      apiKeys: {
        some: {
          tokenHash: hashedToken,
        },
      },
    },
  });

  const data = await req.json();
  try {
    const email = await sendEmail({ ...data, teamId: team?.id });
    return Response.json({ data: email });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
