import os
import logging
from dotenv import load_dotenv
from telegram import Update, BotCommand
from telegram.ext import Application, CommandHandler, ContextTypes

load_dotenv()

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        "Менюшечку слева внизу 🎟️ тыц! И выбираешь бензинчик, дизельку там… ⬇️ что хочешь"
    )


async def post_init(app: Application) -> None:
    await app.bot.delete_my_commands()
    logger.info("Bot command list cleared.")


def main() -> None:
    app = (
        Application.builder()
        .token(BOT_TOKEN)
        .post_init(post_init)
        .build()
    )
    app.add_handler(CommandHandler("start", start))
    logger.info("Бот запущен.")
    app.run_polling()


if __name__ == "__main__":
    main()
