import { NextRequest, NextResponse } from "next/server";
import { renderOtpEmail, renderTeamInviteEmail } from "~/server/email-templates";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "otp";

  try {
    let html: string;

    if (type === "otp") {
      html = await renderOtpEmail({
        otpCode: "ABC123",
        loginUrl: "https://app.unsend.dev/login?token=abc123",
        hostName: "Unsend",
      });
    } else if (type === "invite") {
      html = await renderTeamInviteEmail({
        teamName: "My Awesome Team",
        inviteUrl: "https://app.unsend.dev/join-team?inviteId=123",
        inviterName: "John Doe",
        role: "admin",
      });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error rendering email template:", error);
    return NextResponse.json(
      { error: "Failed to render email template" },
      { status: 500 }
    );
  }
}