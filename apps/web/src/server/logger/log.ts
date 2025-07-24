// lib/logging.ts
import pino from "pino";
import { AsyncLocalStorage } from "node:async_hooks";

type Store = { logger: pino.Logger }; // what we stash per request
const loggerStore = new AsyncLocalStorage<Store>();

export const rootLogger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "next-app" }, // appears on every line
});

// Helper function to get the current logger
function getCurrentLogger(): pino.Logger {
  return loggerStore.getStore()?.logger ?? rootLogger;
}

// Create a proxy that delegates all property access to the current logger
export const logger = new Proxy({} as pino.Logger, {
  get(target, prop, receiver) {
    const currentLogger = getCurrentLogger();
    const value = currentLogger[prop as keyof pino.Logger];

    // If it's a function, bind it to the current logger instance
    if (typeof value === "function") {
      return value.bind(currentLogger);
    }

    return value;
  },
});

// Tiny helper to run a fn inside a context that knows the child logger
export function withLogger<T>(child: pino.Logger, fn: () => Promise<T> | T) {
  return loggerStore.run({ logger: child }, fn);
}

export function getChildLogger({
  teamId,
  requestId,
  ...rest
}: {
  teamId?: number;
  requestId?: string;
} & Record<string, any>) {
  return logger.child({ teamId, requestId, ...rest });
}
