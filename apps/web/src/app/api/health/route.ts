import { setupAws } from "~/server/aws/setup";

export const dynamic = "force-dynamic";

export async function GET() {
  await setupAws();
  return Response.json({ data: "Healthy" });
}
