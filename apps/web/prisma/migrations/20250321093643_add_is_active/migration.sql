-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "billingEmail" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
