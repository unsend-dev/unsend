import { env } from "~/env";

export async function sendToDiscord(message: string) {
  if (!env.DISCORD_WEBHOOK_URL) {
    console.error(
      "Discord webhook URL is not defined in the environment variables. So printing the message to the console."
    );
    console.log("Message: ", message);
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
    console.log("Message sent to Discord successfully.");
  } else {
    console.error("Failed to send message to Discord:", response.statusText);
  }

  return;
}
