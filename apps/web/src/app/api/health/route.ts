import { setupAws } from "~/server/aws/setup";

export async function GET() {
  await setupAws();
  return Response.json({ data: "Healthy" });
}
