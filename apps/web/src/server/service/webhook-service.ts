
import { db } from '~/server/db';
import { Webhook, WebhookEvent } from '@prisma/client';
import { getRedis } from '../redis';

const WEBHOOK_CACHE_SECONDS = 10 * 60; // 10 minutes

export class WebhookService {
  static async triggerWebhook(
    teamId: number,
    event: WebhookEvent,
    payload: any,
  ) {
    const webhooks = await this.getWebhooks(teamId, event);

    for (const webhook of webhooks) {
      try {
        await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event,
            payload,
          }),
        });
      } catch (error) {
        console.error(`Error sending webhook to ${webhook.url}`, error);
      }
    }
  }

  private static async getWebhooks(
    teamId: number,
    event: WebhookEvent,
  ): Promise<Webhook[]> {
    const redis = getRedis();
    const cacheKey = `webhooks:team:${teamId}`;

    try {
      const cachedWebhooks = await redis.get(cacheKey);
      if (cachedWebhooks) {
        const webhooks: Webhook[] = JSON.parse(cachedWebhooks);
        return webhooks.filter((webhook) => webhook.events.includes(event));
      }
    } catch (error) {
      console.error('Error getting webhooks from cache', error);
    }

    const webhooksFromDb = await db.webhook.findMany({
      where: {
        teamId,
      },
    });

    try {
      await redis.set(
        cacheKey,
        JSON.stringify(webhooksFromDb),
        'EX',
        WEBHOOK_CACHE_SECONDS,
      );
    } catch (error) {
      console.error('Error setting webhooks in cache', error);
    }

    return webhooksFromDb.filter((webhook) => webhook.events.includes(event));
  }
}
