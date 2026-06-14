#!/bin/bash
# Do NOT use 'set -e' — bot failure must not kill FastAPI in production

echo "=== Starting TMA Application on Replit Autoscale ==="

# Run bot in background (polling mode to avoid unreachable webhook port)
echo "Starting Telegram Bot (polling)..."
unset REPLIT_DEPLOYMENT  # Force polling + clean stale webhook if any
python bot.py &
BOT_PID=$!

echo "Starting FastAPI Backend (serves React frontend) on port ${TMA_PORT:-8080}..."
exec python -m tma_backend.main
