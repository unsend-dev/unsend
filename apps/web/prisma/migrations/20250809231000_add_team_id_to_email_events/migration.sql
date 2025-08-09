-- AlterTable
ALTER TABLE "EmailEvent" ADD COLUMN     "teamId" INTEGER;

-- CreateIndex
CREATE INDEX "EmailEvent_teamId_idx" ON "EmailEvent"("teamId");
