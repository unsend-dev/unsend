#!/bin/sh

set -x

echo "Deploying prisma migrations"

pnpx prisma migrate deploy --schema ./apps/web/prisma/schema.prisma

echo "Starting web server"

node apps/web/server.js

