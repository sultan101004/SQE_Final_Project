#!/usr/bin/env bash
set -euo pipefail

cd /srv/conduit

IMAGE_TAG="${IMAGE_TAG:-latest}"

docker compose -f docker-compose.deploy.yml pull || true

