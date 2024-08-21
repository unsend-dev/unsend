-- AlterEnum
ALTER TYPE "EmailStatus" ADD VALUE 'SCHEDULED';

-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "scheduledAt" TIMESTAMP(3);
