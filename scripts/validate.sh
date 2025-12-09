#!/usr/bin/env bash
set -euo pipefail

# Simple health checks for backend and frontend
BACKEND_URL="${BACKEND_URL:-http://localhost:3002/api/health}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5174/}"

curl -f "$BACKEND_URL"
curl -f "$FRONTEND_URL" >/dev/null


