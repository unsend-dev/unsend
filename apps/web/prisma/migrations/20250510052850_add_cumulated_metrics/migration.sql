-- CreateTable
CREATE TABLE "CumulatedMetrics" (
    "teamId" INTEGER NOT NULL,
    "domainId" INTEGER NOT NULL,
    "delivered" BIGINT NOT NULL DEFAULT 0,
    "hardBounced" BIGINT NOT NULL DEFAULT 0,
    "complained" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "CumulatedMetrics_pkey" PRIMARY KEY ("teamId","domainId")
);
