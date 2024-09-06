import { SMTPServer, SMTPServerOptions, SMTPServerSession } from "smtp-server";
import { Readable } from "stream";
import dotenv from "dotenv";
import { simpleParser } from "mailparser";
import { readFileSync } from "fs";

dotenv.config();

const AUTH_USERNAME = process.env.SMTP_AUTH_USERNAME ?? "unsend";
const UNSEND_BASE_URL = process.env.UNSEND_BASE_URL ?? "https://app.unsend.dev";
const SSL_KEY_PATH = process.env.UNSEND_API_KEY_PATH;
const SSL_CERT_PATH = process.env.UNSEND_API_CERT_PATH;

async function sendEmailToUnsend(emailData: any, apiKey: string) {
  try {
    const apiEndpoint = "/api/v1/emails";
    const url = new URL(apiEndpoint, UNSEND_BASE_URL); // Combine base URL with endpoint
    console.log("Sending email to Unsend API at:", url.href); // Debug statement

    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Unsend API error response:", errorData);
      throw new Error(
        `Failed to send email: ${errorData.error.message || "Unknown error from server"}`
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
  key: SSL_KEY_PATH ? readFileSync(SSL_KEY_PATH) : undefined,
  cert: SSL_CERT_PATH ? readFileSync(SSL_CERT_PATH) : undefined,
  onData(
    stream: Readable,
    session: SMTPServerSession,
    callback: (error?: Error) => void
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

      console.log("Parsed email data:", emailObject); // Debug statement

      sendEmailToUnsend(emailObject, session.user)
        .then(() => callback())
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
  // Implicit SSL/TLS for ports 465 and 2465
  [465, 2465].forEach((port) => {
    const server = new SMTPServer({ ...serverOptions, secure: true });

    server.listen(port, () => {
      console.log(`Implicit SSL/TLS SMTP server is listening on port ${port}`);
    });

    server.on("error", (err) => {
      console.error(`Error occurred on port ${port}:`, err);
    });
  });

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
