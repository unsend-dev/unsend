/*
  Warnings:

  - You are about to drop the column `rateLimitStrategy` on the `Team` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RateLimitType" AS ENUM ('EMAIL', 'DOMAIN');

-- CreateEnum
CREATE TYPE "RateLimitAction" AS ENUM ('DELAY', 'CANCEL');

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "rateLimitStrategy",
ADD COLUMN     "rateLimitAction" "RateLimitAction" NOT NULL DEFAULT 'DELAY',
ADD COLUMN     "rateLimitType" "RateLimitType" NOT NULL DEFAULT 'EMAIL';

-- DropEnum
DROP TYPE "RateLimitPolicy";
