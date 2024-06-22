let initialized = false;

/**
 * Add things here to be executed during server startup.
 *
 * more details here: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NEXT_RUNTIME === "nodejs" && !initialized) {
    console.log("Registering instrumentation");
    const { EmailQueueService } = await import(
      "~/server/service/email-queue-service"
    );

    await EmailQueueService.init();
    initialized = true;
  }
}
