-- CreateEnum
CREATE TYPE "EmailUsageType" AS ENUM ('TRANSACTIONAL', 'MARKETING');

-- CreateTable
CREATE TABLE "DailyEmailUsage" (
    "teamId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "type" "EmailUsageType" NOT NULL,
    "domainId" INTEGER NOT NULL,
    "delivered" INTEGER NOT NULL,
    "opened" INTEGER NOT NULL,
    "clicked" INTEGER NOT NULL,
    "bounced" INTEGER NOT NULL,
    "complained" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyEmailUsage_pkey" PRIMARY KEY ("teamId","domainId","date","type")
);

-- AddForeignKey
ALTER TABLE "DailyEmailUsage" ADD CONSTRAINT "DailyEmailUsage_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
