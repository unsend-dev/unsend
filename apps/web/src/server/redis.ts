import IORedis from "ioredis";
import { env } from "~/env";

export let connection: IORedis | null = null;

export const getRedis = () => {
  if (!connection) {
    connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
  }
  return connection;
};
