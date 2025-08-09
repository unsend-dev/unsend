/*
  Warnings:

  - Added the required column `teamId` to the `EmailEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailEvent" ADD COLUMN     "teamId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "EmailEvent_teamId_idx" ON "EmailEvent"("teamId");

-- AddForeignKey
ALTER TABLE "EmailEvent" ADD CONSTRAINT "EmailEvent_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
