-- CreateEnum
CREATE TYPE "RateLimitPolicy" AS ENUM ('CANCEL', 'DELAY');

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "rateLimitStrategy" "RateLimitPolicy" NOT NULL DEFAULT 'CANCEL';
