import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Font,
  Preview,
} from "jsx-email";

interface EmailLayoutProps {
  preview?: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <Font
          fallbackFontFamily="sans-serif"
          fontFamily="Inter"
          fontStyle="normal"
          fontWeight={400}
          webFont={{
            url: "https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19",
            format: "woff2",
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #374151;
                background-color: #f9fafb;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
            `,
          }}
        />
        <meta content="width=device-width" name="viewport" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta
          content="telephone=no,address=no,email=no,date=no,url=no"
          name="format-detection"
        />
        <meta content="light" name="color-scheme" />
        <meta content="light" name="supported-color-schemes" />
      </Head>
      {preview && <Preview>{preview}</Preview>}
      <Body style={{ backgroundColor: "#ffffff", padding: "20px" }}>
        <Container
          className="email-container"
          style={{
            maxWidth: "600px",
            backgroundColor: "#ffffff",
            textAlign: "left" as const,
          }}
        >
          {children}
        </Container>
      </Body>
    </Html>
  );
}