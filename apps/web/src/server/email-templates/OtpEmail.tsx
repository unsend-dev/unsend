import React from "react";
import { Container, Text, Hr } from "jsx-email";
import { render } from "jsx-email";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeader } from "./components/EmailHeader";
import { EmailFooter } from "./components/EmailFooter";
import { EmailButton } from "./components/EmailButton";

interface OtpEmailProps {
  otpCode: string;
  loginUrl: string;
  hostName?: string;
  logoUrl?: string;
}

export function OtpEmail({ 
  otpCode, 
  loginUrl, 
  hostName = "Unsend",
  logoUrl 
}: OtpEmailProps) {
  return (
    <EmailLayout preview={`Your verification code: ${otpCode}`}>
      <EmailHeader 
        logoUrl={logoUrl}
        title="Sign in to your account" 
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
          Use the verification code below to sign in to your {hostName} account:
        </Text>

        <Container
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
            padding: "24px",
            textAlign: "center" as const,
            margin: "0 0 32px 0",
            border: "1px solid #e5e7eb",
          }}
        >
          <Text
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#000000",
              letterSpacing: "8px",
              margin: "0",
              fontFamily: "monospace",
            }}
          >
            {otpCode}
          </Text>
        </Container>

        <Container style={{ margin: "0 0 32px 0" }}>
          <EmailButton href={loginUrl}>
            Sign in with one click
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
          If you didn't request this email, you can safely ignore it. The verification code will expire automatically.
        </Text>
      </Container>

      <EmailFooter />
    </EmailLayout>
  );
}

export async function renderOtpEmail(props: OtpEmailProps): Promise<string> {
  return render(<OtpEmail {...props} />);
}