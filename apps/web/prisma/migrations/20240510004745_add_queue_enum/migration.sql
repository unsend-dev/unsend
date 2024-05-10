-- AlterEnum
ALTER TYPE "EmailStatus" ADD VALUE 'QUEUED';

-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "attachments" TEXT;
