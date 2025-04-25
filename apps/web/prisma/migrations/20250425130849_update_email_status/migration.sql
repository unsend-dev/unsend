-- CreateEnum
BEGIN;

CREATE TYPE "EmailStatusV2" AS ENUM ('SCHEDULED', 'CANCELLED', 'RENDERING_FAILURE', 'QUEUED', 'SENT', 'REJECTED', 'DELIVERY_DELAYED', 'DELIVERED', 'BOUNCED', 'OPENED', 'CLICKED', 'COMPLAINED', 'FAILED');

ALTER TABLE "EmailEvent" 
  ALTER COLUMN "status" drop default,
  ALTER COLUMN "status" type text using "status"::text;

ALTER TABLE "Email" 
  ALTER COLUMN "latestStatus" drop default,
  ALTER COLUMN "latestStatus" type text using "latestStatus"::text;

DROP TYPE "EmailStatus";

ALTER TYPE "EmailStatusV2" RENAME TO "EmailStatus";

ALTER TABLE "EmailEvent" 
  ALTER COLUMN "status" TYPE "EmailStatus" USING "status"::text::"EmailStatus",
  ALTER COLUMN "status" set default 'QUEUED';

ALTER TABLE "Email" 
  ALTER COLUMN "latestStatus" TYPE "EmailStatus" USING "latestStatus"::text::"EmailStatus",
  ALTER COLUMN "latestStatus" set default 'QUEUED';

COMMIT;
