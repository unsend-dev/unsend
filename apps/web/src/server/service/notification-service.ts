import { env } from "~/env";
import { logger } from "../logger/log";

export async function sendToDiscord(message: string) {
  if (!env.DISCORD_WEBHOOK_URL) {
    logger.error(
      "Discord webhook URL is not defined in the environment variables. So printing the message to the console."
    );
    logger.info({ message }, "Message");
    return;
  }

  const webhookUrl = env.DISCORD_WEBHOOK_URL;
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: message }),
  });

  if (response.ok) {
    logger.info("Message sent to Discord successfully.");
  } else {
    logger.error(
      { statusText: response.statusText },
      "Failed to send message to Discord:"
    );
  }

  return;
}
