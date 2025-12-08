#!/usr/bin/env bash
set -euo pipefail

cd /srv/conduit

if [ -f docker-compose.deploy.yml ]; then
  docker compose -f docker-compose.deploy.yml down || true
else
  docker compose down || true
fi

