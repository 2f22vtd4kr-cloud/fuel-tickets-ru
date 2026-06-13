#!/bin/bash
set -e

echo "Building frontend..."
pnpm --filter @workspace/tma-frontend run build

echo "Starting Telegram Bot..."
python bot.py &

echo "Starting TMA Backend..."
exec python -m tma_backend.main
