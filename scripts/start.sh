#!/usr/bin/env bash
set -euo pipefail

cd /srv/conduit

COMPOSE_FILE="docker-compose.deploy.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
  COMPOSE_FILE="docker-compose.yml"
fi

docker compose -f "$COMPOSE_FILE" up -d


