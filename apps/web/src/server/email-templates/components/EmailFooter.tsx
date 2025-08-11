import React from "react";
import { Container, Text } from "jsx-email";

interface EmailFooterProps {
  companyName?: string;
  supportUrl?: string;
}

export function EmailFooter({ 
  companyName = "Unsend", 
  supportUrl = "https://unsend.dev" 
}: EmailFooterProps) {
  return (
    <Container
      style={{
        padding: "20px 40px 40px 40px",
        borderTop: "1px solid #f3f4f6",
        backgroundColor: "#f9fafb",
      }}
    >
      <Text
        style={{
          fontSize: "14px",
          color: "#6b7280",
          textAlign: "center" as const,
          margin: "0",
          lineHeight: "1.5",
        }}
      >
        This email was sent by {companyName}. If you have any questions, please{" "}
        <a
          href={supportUrl}
          style={{
            color: "#3b82f6",
            textDecoration: "none",
          }}
        >
          contact our support team
        </a>
        .
      </Text>
    </Container>
  );
}