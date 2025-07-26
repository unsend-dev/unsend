// lib/logging.ts
import pino from "pino";
import pinoPretty from "pino-pretty";
import { AsyncLocalStorage } from "node:async_hooks";

const isDev = process.env.NODE_ENV !== "production";

type Store = { logger: pino.Logger }; // what we stash per request
const loggerStore = new AsyncLocalStorage<Store>();

export const rootLogger = pino(
  {
    level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
    base: { service: "next-app" },
  },
  isDev
    ? pinoPretty({
        colorize: true,
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
        ignore: "pid,hostname",
      })
    : undefined
);

// Helper function to get the current logger
function getCurrentLogger(): pino.Logger {
  return loggerStore.getStore()?.logger ?? rootLogger;
}

// Create a proxy that delegates all property access to the current logger
export const logger = new Proxy(
  {} as pino.Logger & { setBindings: (bindings: Record<string, any>) => void },
  {
    get(target, prop, receiver) {
      // Handle the special setBindings method
      if (prop === "setBindings") {
        return (bindings: Record<string, any>) => {
          const store = loggerStore.getStore();
          if (!store) {
            // If not in a context, just update the root logger (though this won't persist)
            return;
          }

          // Create a new child logger with the merged bindings
          const currentLogger = store.logger;
          const newLogger = currentLogger.child(bindings);

          // Update the store with the new logger
          store.logger = newLogger;
        };
      }

      const currentLogger = getCurrentLogger();
      const value = currentLogger[prop as keyof pino.Logger];

      if (typeof value === "function") {
        return value.bind(currentLogger);
      }

      return value;
    },
  }
);

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
