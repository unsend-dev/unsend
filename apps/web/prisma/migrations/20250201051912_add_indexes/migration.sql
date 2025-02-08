-- CreateIndex
CREATE INDEX "Campaign_createdAt_idx" ON "Campaign"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Email_createdAt_idx" ON "Email"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "EmailEvent_emailId_idx" ON "EmailEvent"("emailId");
