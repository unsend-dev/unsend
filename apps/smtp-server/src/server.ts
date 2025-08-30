import { SMTPServer, SMTPServerOptions, SMTPServerSession } from "smtp-server";
import { Readable } from "stream";
import dotenv from "dotenv";
import { simpleParser } from "mailparser";
import { readFileSync } from "fs";
import tls from "tls";

dotenv.config();

const AUTH_USERNAME = process.env.SMTP_AUTH_USERNAME ?? "unsend";
const UNSEND_BASE_URL = process.env.UNSEND_BASE_URL ?? "https://app.unsend.dev";
const SSL_KEY_PATH = process.env.UNSEND_API_KEY_PATH;
const SSL_CERT_PATH = process.env.UNSEND_API_CERT_PATH;
const SNI_CERTS = process.env.UNSEND_SNI_CERTS;

const defaultKey = SSL_KEY_PATH ? readFileSync(SSL_KEY_PATH) : undefined;
const defaultCert = SSL_CERT_PATH ? readFileSync(SSL_CERT_PATH) : undefined;

const defaultContext =
  defaultKey && defaultCert
    ? tls.createSecureContext({
        key: defaultKey,
        cert: defaultCert,
      })
    : undefined;

let secureContexts: Record<string, tls.SecureContext> = {};

if (SNI_CERTS) {
  try {
    const parsed: Record<string, { key: string; cert: string }> =
      JSON.parse(SNI_CERTS);
    secureContexts = Object.fromEntries(
      Object.entries(parsed).map(([host, creds]) => [
        host,
        tls.createSecureContext({
          key: readFileSync(creds.key),
          cert: readFileSync(creds.cert),
        }),
      ]),
    );
  } catch (err) {
    console.error("Failed to parse UNSEND_SNI_CERTS:", err);
  }
}

async function sendEmailToUnsend(emailData: any, apiKey: string) {
  try {
    const apiEndpoint = "/api/v1/emails";
    const url = new URL(apiEndpoint, UNSEND_BASE_URL); // Combine base URL with endpoint
    console.log("Sending email to Unsend API at:", url.href); // Debug statement

    const emailDataText = JSON.stringify(emailData);

    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: emailDataText,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        "Unsend API error response: error:",
        JSON.stringify(errorData, null, 4),
        `\nemail data: ${emailDataText}`,
      );
      throw new Error(
        `Failed to send email: ${errorData || "Unknown error from server"}`,
      );
    }

    const responseData = await response.json();
    console.log("Unsend API response:", responseData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Failed to send email: Unexpected error occurred");
    }
  }
}

const serverOptions: SMTPServerOptions = {
  secure: false,
  key: defaultKey,
  cert: defaultCert,
  tls: {
    SNICallback: (servername, cb) =>
      cb(null, secureContexts[servername] || defaultContext),
  },
  onData(
    stream: Readable,
    session: SMTPServerSession,
    callback: (error?: Error) => void,
  ) {
    console.log("Receiving email data..."); // Debug statement
    simpleParser(stream, (err, parsed) => {
      if (err) {
        console.error("Failed to parse email data:", err.message);
        return callback(err);
      }

      if (!session.user) {
        console.error("No API key found in session");
        return callback(new Error("No API key found in session"));
      }

      const emailObject = {
        to: Array.isArray(parsed.to)
          ? parsed.to.map((addr) => addr.text).join(", ")
          : parsed.to?.text,
        from: Array.isArray(parsed.from)
          ? parsed.from.map((addr) => addr.text).join(", ")
          : parsed.from?.text,
        subject: parsed.subject,
        text: parsed.text,
        html: parsed.html,
        replyTo: parsed.replyTo?.text,
      };

      sendEmailToUnsend(emailObject, session.user)
        .then(() => callback())
        .then(() => console.log("Email sent successfully to: ", emailObject.to))
        .catch((error) => {
          console.error("Failed to send email:", error.message);
          callback(error);
        });
    });
  },
  onAuth(auth, session: any, callback: (error?: Error, user?: any) => void) {
    if (auth.username === AUTH_USERNAME && auth.password) {
      console.log("Authenticated successfully"); // Debug statement
      callback(undefined, { user: auth.password });
    } else {
      console.error("Invalid username or password");
      callback(new Error("Invalid username or password"));
    }
  },
  size: 10485760,
};

function startServers() {
  if (defaultContext || Object.keys(secureContexts).length > 0) {
    // Implicit SSL/TLS for ports 465 and 2465
    [465, 2465].forEach((port) => {
      const server = new SMTPServer({ ...serverOptions, secure: true });

      server.listen(port, () => {
        console.log(
          `Implicit SSL/TLS SMTP server is listening on port ${port}`,
        );
      });

      server.on("error", (err) => {
        console.error(`Error occurred on port ${port}:`, err);
      });
    });
  }

  // STARTTLS for ports 25, 587, and 2587
  [25, 587, 2587].forEach((port) => {
    const server = new SMTPServer(serverOptions);

    server.listen(port, () => {
      console.log(`STARTTLS SMTP server is listening on port ${port}`);
    });

    server.on("error", (err) => {
      console.error(`Error occurred on port ${port}:`, err);
    });
  });
}

startServers();
