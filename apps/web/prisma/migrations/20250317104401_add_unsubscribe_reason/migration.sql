-- CreateEnum
CREATE TYPE "UnsubscribeReason" AS ENUM ('BOUNCED', 'COMPLAINED', 'UNSUBSCRIBED');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "unsubscribeReason" "UnsubscribeReason";
