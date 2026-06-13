"""
Production launcher — starts the Telegram bot and the TMA backend together.
Used as the VM deployment entry point.
"""
import subprocess
import sys
import os


def main():
    # Build the frontend first
    print("Building frontend...", flush=True)
    build = subprocess.run(
        ["pnpm", "--filter", "@workspace/tma-frontend", "run", "build"],
        cwd=os.path.dirname(__file__),
    )
    if build.returncode != 0:
        print("Frontend build failed", flush=True)
        sys.exit(1)

    print("Starting Telegram Bot...", flush=True)
    bot = subprocess.Popen([sys.executable, "bot.py"])

    print("Starting TMA Backend...", flush=True)
    backend = subprocess.Popen([sys.executable, "-m", "tma_backend.main"])

    # Wait for either process to exit; if one dies, kill the other
    try:
        while True:
            if bot.poll() is not None:
                print(f"Bot exited with code {bot.returncode}", flush=True)
                backend.terminate()
                break
            if backend.poll() is not None:
                print(f"Backend exited with code {backend.returncode}", flush=True)
                bot.terminate()
                break
            import time
            time.sleep(2)
    except KeyboardInterrupt:
        bot.terminate()
        backend.terminate()


if __name__ == "__main__":
    main()
