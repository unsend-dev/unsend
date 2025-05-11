BEGIN;

-- 1) Populate or update cumulated totals
INSERT INTO "CumulatedMetrics" (
    "teamId",
    "domainId",
    "delivered",
    "hardBounced",
    "complained"
)
SELECT
    du."teamId",
    du."domainId",
    SUM(du.delivered)::BIGINT      AS delivered,
    SUM(du."hardBounced")::BIGINT  AS hardBounced,
    SUM(du.complained)::BIGINT     AS complained
FROM public."DailyEmailUsage" du
GROUP BY
    du."teamId",
    du."domainId"
ON CONFLICT ("teamId","domainId") DO UPDATE
  SET
    "delivered"    = EXCLUDED."delivered",
    "hardBounced"  = EXCLUDED."hardBounced",
    "complained"   = EXCLUDED."complained";

COMMIT;