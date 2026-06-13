"""
Production launcher — starts the Telegram bot and the TMA backend together.
Auto-restarts each service if it crashes, with exponential backoff.
Used as the VM deployment entry point.
"""
import subprocess
import sys
import os
import time
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [launcher] %(levelname)s %(message)s",
)
logger = logging.getLogger("launcher")

MAX_RESTARTS = 10
BASE_DELAY   = 2    # seconds before first restart
MAX_DELAY    = 60   # cap backoff at 60 s


def _start_bot() -> subprocess.Popen:
    logger.info("Starting Telegram Bot…")
    return subprocess.Popen([sys.executable, "bot.py"])


def _start_backend() -> subprocess.Popen:
    logger.info("Starting TMA Backend…")
    return subprocess.Popen([sys.executable, "-m", "tma_backend.main"])


def main():
    # ── Build frontend once at startup ──────────────────────────────
    logger.info("Building frontend…")
    build = subprocess.run(
        ["pnpm", "--filter", "@workspace/tma-frontend", "run", "build"],
        cwd=os.path.dirname(os.path.abspath(__file__)),
    )
    if build.returncode != 0:
        logger.error("Frontend build failed — aborting.")
        sys.exit(1)
    logger.info("Frontend build OK.")

    bot     = _start_bot()
    backend = _start_backend()

    bot_restarts     = 0
    backend_restarts = 0
    bot_delay        = BASE_DELAY
    backend_delay    = BASE_DELAY

    try:
        while True:
            time.sleep(2)

            # ── Check bot ───────────────────────────────────────────
            if bot.poll() is not None:
                code = bot.returncode
                bot_restarts += 1
                if bot_restarts > MAX_RESTARTS:
                    logger.error(f"Bot crashed {bot_restarts} times — giving up.")
                    break
                logger.warning(
                    f"Bot exited (code {code}). "
                    f"Restart #{bot_restarts} in {bot_delay}s…"
                )
                time.sleep(bot_delay)
                bot_delay = min(bot_delay * 2, MAX_DELAY)
                bot = _start_bot()

            # ── Check backend ───────────────────────────────────────
            if backend.poll() is not None:
                code = backend.returncode
                backend_restarts += 1
                if backend_restarts > MAX_RESTARTS:
                    logger.error(f"Backend crashed {backend_restarts} times — giving up.")
                    break
                logger.warning(
                    f"Backend exited (code {code}). "
                    f"Restart #{backend_restarts} in {backend_delay}s…"
                )
                time.sleep(backend_delay)
                backend_delay = min(backend_delay * 2, MAX_DELAY)
                backend = _start_backend()
            else:
                # Reset delays after a stable run (> 60 s without crash)
                bot_delay     = BASE_DELAY
                backend_delay = BASE_DELAY

    except KeyboardInterrupt:
        logger.info("Shutdown signal received.")
    finally:
        logger.info("Terminating child processes…")
        for proc in (bot, backend):
            try:
                proc.terminate()
            except Exception:
                pass


if __name__ == "__main__":
    main()
