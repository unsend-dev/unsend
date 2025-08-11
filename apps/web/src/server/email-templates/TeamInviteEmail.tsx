import React from "react";
import { Container, Text, Hr } from "jsx-email";
import { render } from "jsx-email";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeader } from "./components/EmailHeader";
import { EmailFooter } from "./components/EmailFooter";
import { EmailButton } from "./components/EmailButton";

interface TeamInviteEmailProps {
  teamName: string;
  inviteUrl: string;
  inviterName?: string;
  logoUrl?: string;
  role?: string;
}

export function TeamInviteEmail({ 
  teamName, 
  inviteUrl, 
  inviterName,
  logoUrl,
  role = "member"
}: TeamInviteEmailProps) {
  return (
    <EmailLayout preview={`You've been invited to join ${teamName} on Unsend`}>
      <EmailHeader 
        logoUrl={logoUrl}
        title="You're invited!" 
      />
      
      <Container style={{ padding: "40px" }}>
        <Text
          style={{
            fontSize: "16px",
            color: "#374151",
            margin: "0 0 24px 0",
            lineHeight: "1.6",
          }}
        >
          Hi there,
        </Text>
        
        <Text
          style={{
            fontSize: "16px",
            color: "#374151",
            margin: "0 0 32px 0",
            lineHeight: "1.6",
          }}
        >
          {inviterName ? `${inviterName} has` : "You have been"} invited you to join{" "}
          <strong style={{ color: "#000000" }}>{teamName}</strong> on Unsend
          {role && role !== "member" && (
            <span> as a <strong style={{ color: "#000000" }}>{role}</strong></span>
          )}.
        </Text>

        <Container style={{ margin: "0 0 32px 0" }}>
          <EmailButton href={inviteUrl}>
            Accept invitation
          </EmailButton>
        </Container>

        <Hr style={{ 
          border: "none", 
          borderTop: "1px solid #e5e7eb", 
          margin: "32px 0" 
        }} />

        <Text
          style={{
            fontSize: "14px",
            color: "#6b7280",
            margin: "0",
            lineHeight: "1.5",
          }}
        >
          If you weren't expecting this invitation or don't want to join this team, you can safely ignore this email.
        </Text>
      </Container>

      <EmailFooter />
    </EmailLayout>
  );
}

export async function renderTeamInviteEmail(props: TeamInviteEmailProps): Promise<string> {
  return render(<TeamInviteEmail {...props} />);
}