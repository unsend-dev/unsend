import { Redis } from "ioredis";
import { env } from "~/env";
import { UnsendApiError } from "../public-api/api-error";

export class RedisRateLimiter {
    private redis: Redis;
    private windowSize: number;
    private maxRequests: number;
  
    constructor(
      redisUrl: string = env.REDIS_URL ?? 'localhost:6379', 
      windowSize: number = 1,
      maxRequests: number = env.API_RATE_LIMIT
    ) {
      this.redis = new Redis(redisUrl);
      this.windowSize = windowSize;
      this.maxRequests = maxRequests;
    }
  
    public getRateLimitKey(token: string): string {
      return `rate_limit:${token}`;
    }
  
    private async cleanupOldEntries(key: string): Promise<void> {
      const now = Math.floor(Date.now() / 1000);
      await this.redis.zremrangebyscore(key, 0, now - this.windowSize);
    }
  
    private async addCurrentRequest(key: string): Promise<void> {
      const now = Math.floor(Date.now() / 1000);
      await this.redis.zadd(key, now, `${now}-${Math.random()}`);
      await this.redis.expire(key, this.windowSize * 2);
    }
  
    public async checkRateLimit(token: string): Promise<void> {
      const key = this.getRateLimitKey(token);
      
      await this.cleanupOldEntries(key);
      await this.addCurrentRequest(key);
      
      const requestCount = await this.redis.zcard(key);
      
      if (requestCount > this.maxRequests) {
        throw new UnsendApiError({
          code: "RATE_LIMITED",
          message: `Rate limit exceeded, ${this.maxRequests} requests per second`,
        });
      }
    }
  
    async getRateLimitInfo(token: string) {
      const key = this.getRateLimitKey(token);
      const now = Math.floor(Date.now() / 1000);
      
      await this.cleanupOldEntries(key);
      const currentUsage = await this.redis.zcard(key);
      
      return {
        limit: this.maxRequests,
        remaining: Math.max(0, this.maxRequests - currentUsage),
        reset: now + this.windowSize,
      };
    }
  }