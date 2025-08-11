import React from "react";
import { Container, Heading, Img } from "jsx-email";

interface EmailHeaderProps {
  logoUrl?: string;
  title?: string;
}

export function EmailHeader({ logoUrl, title }: EmailHeaderProps) {
  return (
    <Container
      style={{
        padding: "40px 40px 20px 40px",
        borderBottom: "1px solid #f3f4f6",
        textAlign: "center" as const,
      }}
    >
      {logoUrl && (
        <Img
          src={logoUrl}
          alt="Unsend"
          style={{
            width: "48px",
            height: "48px",
            margin: "0 auto 16px auto",
            display: "block",
          }}
        />
      )}
      {title && (
        <Heading
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#111827",
            margin: "0",
            lineHeight: "1.3",
          }}
        >
          {title}
        </Heading>
      )}
    </Container>
  );
}