/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'BASIC');

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3),
    "currentPeriodStart" TIMESTAMP(3),
    "cancelAtPeriodEnd" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_stripeCustomerId_key" ON "Team"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
