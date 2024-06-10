-- CreateTable
CREATE TABLE "SesSetting" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "idPrefix" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "topicArn" TEXT,
    "callbackUrl" TEXT NOT NULL,
    "callbackSuccess" BOOLEAN NOT NULL DEFAULT false,
    "configGeneral" TEXT,
    "configGeneralSuccess" BOOLEAN NOT NULL DEFAULT false,
    "configClick" TEXT,
    "configClickSuccess" BOOLEAN NOT NULL DEFAULT false,
    "configOpen" TEXT,
    "configOpenSuccess" BOOLEAN NOT NULL DEFAULT false,
    "configFull" TEXT,
    "configFullSuccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SesSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SesSetting_region_key" ON "SesSetting"("region");
