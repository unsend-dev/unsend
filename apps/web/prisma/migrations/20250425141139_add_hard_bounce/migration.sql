-- AlterTable
ALTER TABLE "DailyEmailUsage" ADD COLUMN     "hardBounced" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "EmailEvent" ALTER COLUMN "status" DROP DEFAULT;
