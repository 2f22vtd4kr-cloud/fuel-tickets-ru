"""
Payment abstraction layer.

MockPaymentProvider   — always active, no external calls.
CryptoBotProvider     — real CryptoBot API (requires CRYPTO_BOT_TOKEN).
StarsPaymentProvider  — Telegram Stars via bot (requires BOT_TOKEN).
"""

import hashlib
import hmac
import os
import secrets
import time
import logging
import asyncio
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

SIGNING_SECRET   = os.getenv("PAYMENT_SIGNING_SECRET", "tma_node_signing_key_dev_2026")
CRYPTO_BOT_TOKEN = os.getenv("CRYPTO_BOT_TOKEN", "")
CRYPTO_PAY_API   = os.getenv("CRYPTO_PAY_API", "https://pay.crypt.bot/api")
# PAYMENT_METHOD controls which provider is used:
#   "auto"      → CryptoBotProvider when CRYPTO_BOT_TOKEN is set, else Mock
#   "cryptobot" → CryptoBotProvider (requires CRYPTO_BOT_TOKEN)
#   "stars"     → StarsPaymentProvider (Telegram Stars)
#   "mock"      → MockPaymentProvider (testing)
PAYMENT_METHOD = os.getenv("PAYMENT_METHOD", "auto")

FUEL_PRICES_RUB: dict[str, int] = {
    "АИ-92": 47, "АИ-95": 52, "АИ-95+": 56,
    "АИ-100": 68, "ДТ": 60, "ДТ+": 65, "Газ": 28,
}
USDT_RUB_RATE = 92.0


@dataclass
class PaymentResult:
    ok: bool
    transaction_id: str
    qr_hash: str
    checkout_url: Optional[str] = None
    invoice_id: Optional[int] = None
    stars_amount: Optional[int] = None
    error: Optional[str] = None


def generate_qr_hash(user_id: int, fuel_type: str, volume: int) -> str:
    raw = f"{user_id}:{fuel_type}:{volume}:{time.time_ns()}:{secrets.token_hex(8)}"
    sig = hmac.new(SIGNING_SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
    return f"TMA-{sig[:32].upper()}"


class PaymentProvider(ABC):
    @abstractmethod
    def create_invoice(
        self,
        user_id: int,
        fuel_type: str,
        volume: int,
        price_rub: int,
        station_id: int = 0,
    ) -> PaymentResult: ...


class MockPaymentProvider(PaymentProvider):
    """Fully functional mock — no external calls."""

    def create_invoice(
        self,
        user_id: int,
        fuel_type: str,
        volume: int,
        price_rub: int,
        station_id: int = 0,
    ) -> PaymentResult:
        tx_id = f"MOCK-{secrets.token_hex(10).upper()}"
        qr = generate_qr_hash(user_id, fuel_type, volume)
        return PaymentResult(ok=True, transaction_id=tx_id, qr_hash=qr)


class CryptoBotProvider(PaymentProvider):
    """
    Real CryptoBot invoice via https://pay.crypt.bot/api/createInvoice.
    Requires CRYPTO_BOT_TOKEN secret.
    """

    def __init__(self) -> None:
        self.token = CRYPTO_BOT_TOKEN
        self.headers = {"Crypto-Pay-API-Token": self.token}

    def create_invoice(
        self,
        user_id: int,
        fuel_type: str,
        volume: int,
        price_rub: int,
        station_id: int = 0,
    ) -> PaymentResult:
        amount_usdt = round(price_rub / USDT_RUB_RATE, 2)
        qr = generate_qr_hash(user_id, fuel_type, volume)
        description = f"⛽️ Ваучер {volume}л {fuel_type} — Топливо"

        try:
            resp = httpx.post(
                f"{CRYPTO_PAY_API}/createInvoice",
                headers=self.headers,
                json={
                    "asset": "USDT",
                    "amount": str(amount_usdt),
                    "description": description,
                    "payload": qr,
                    "allow_comments": False,
                    "allow_anonymous": False,
                    "expires_in": 3600,
                },
                timeout=10,
            )
            data = resp.json()
            if not data.get("ok"):
                error_msg = data.get("error", {}).get("name", "CryptoBot error")
                logger.error("CryptoBot createInvoice failed: %s", data)
                tx_id = f"CB-ERR-{secrets.token_hex(6).upper()}"
                return PaymentResult(
                    ok=False, transaction_id=tx_id, qr_hash=qr,
                    error=error_msg,
                )
            invoice = data["result"]
            invoice_id = invoice.get("invoice_id", 0)
            pay_url = invoice.get("pay_url", f"https://t.me/CryptoBot?start=invoice_{invoice_id}")
            tx_id = f"CB-{invoice_id}"
            return PaymentResult(
                ok=True, transaction_id=tx_id, qr_hash=qr,
                checkout_url=pay_url, invoice_id=invoice_id,
            )
        except Exception as exc:
            logger.exception("CryptoBotProvider network error: %s", exc)
            tx_id = f"CB-NET-{secrets.token_hex(6).upper()}"
            return PaymentResult(
                ok=False, transaction_id=tx_id, qr_hash=qr,
                error=str(exc),
            )


class StarsPaymentProvider(PaymentProvider):
    """
    Creates a real Telegram Stars invoice link via the createInvoiceLink Bot API.
    The frontend calls Telegram.WebApp.openInvoice(link, callback) with the returned link.
    After the user pays, Telegram sends successful_payment to the bot, which then
    records the purchase in the TMA database.
    Stars price: 1 Star ≈ $0.02 USD ≈ 1.84 RUB (at ~92 RUB/USD).
    Falls back to metadata-only if TELEGRAM_BOT_TOKEN is not set.
    """

    STAR_RUB_RATE = 1.84  # 1 Star ≈ 1.84 RUB

    def create_invoice(
        self,
        user_id: int,
        fuel_type: str,
        volume: int,
        price_rub: int,
        station_id: int = 0,
    ) -> PaymentResult:
        import math
        stars = max(1, math.ceil(price_rub / self.STAR_RUB_RATE))
        qr = generate_qr_hash(user_id, fuel_type, volume)
        tx_id = f"STARS-{secrets.token_hex(8).upper()}"

        bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
        if not bot_token:
            logger.warning(
                "TELEGRAM_BOT_TOKEN not set — Stars invoice link cannot be created; "
                "returning metadata only (no real payment will occur)"
            )
            return PaymentResult(ok=True, transaction_id=tx_id, qr_hash=qr, stars_amount=stars)

        # Payload parsed by successful_payment_handler in bot.py:
        # tma_{user_id}_{fuel_type}_{volume}_{station_id}
        payload = f"tma_{user_id}_{fuel_type}_{volume}_{station_id}"

        try:
            resp = httpx.post(
                f"https://api.telegram.org/bot{bot_token}/createInvoiceLink",
                json={
                    "title": f"Ваучер {fuel_type} {volume}л",
                    "description": (
                        f"Предоплаченный топливный ваучер: {volume} л {fuel_type}. "
                        f"Действителен на всех АЗС Матрицы Снабжения. "
                        f"Стоимость: ~{price_rub} ₽"
                    ),
                    "payload": payload,
                    "currency": "XTR",
                    "prices": [{"label": f"{fuel_type} {volume}л", "amount": stars}],
                },
                timeout=10,
            )
            data = resp.json()
            if data.get("ok"):
                link: str = data["result"]
                logger.info("Stars invoice link created: stars=%d, station=%d, user=%d", stars, station_id, user_id)
                return PaymentResult(
                    ok=True, transaction_id=tx_id, qr_hash=qr,
                    stars_amount=stars, checkout_url=link,
                )
            else:
                desc = data.get("description", "Telegram API error")
                logger.error("createInvoiceLink failed: %s", data)
                return PaymentResult(
                    ok=False, transaction_id=tx_id, qr_hash=qr,
                    stars_amount=stars, error=desc,
                )
        except Exception as exc:
            logger.exception("StarsPaymentProvider network error: %s", exc)
            return PaymentResult(
                ok=False, transaction_id=tx_id, qr_hash=qr,
                stars_amount=stars, error=str(exc),
            )

    def create_network_invoice(
        self,
        user_id: int,
        fuel_type: str,
        volume: int,
        price_rub: int,
        network: str,
    ) -> PaymentResult:
        """Create a Stars invoice for a network-wide voucher (valid at any station of the network)."""
        import math
        stars = max(1, math.ceil(price_rub / self.STAR_RUB_RATE))
        qr = generate_qr_hash(user_id, fuel_type, volume)
        tx_id = f"STARS-NET-{secrets.token_hex(8).upper()}"

        bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
        if not bot_token:
            logger.warning("TELEGRAM_BOT_TOKEN not set — Stars network invoice cannot be created")
            return PaymentResult(ok=True, transaction_id=tx_id, qr_hash=qr, stars_amount=stars)

        # Payload: tmanet_{user_id}_{fuel_type}_{volume}_{network~encoded}
        # Spaces encoded as ~ so underscores remain unambiguous delimiters
        safe_network = network.replace(" ", "~")
        payload = f"tmanet_{user_id}_{fuel_type}_{volume}_{safe_network}"

        try:
            resp = httpx.post(
                f"https://api.telegram.org/bot{bot_token}/createInvoiceLink",
                json={
                    "title": f"Сетевой ваучер {network} {fuel_type} {volume}л",
                    "description": (
                        f"Сетевой топливный ваучер: {volume} л {fuel_type}. "
                        f"Действителен на всех АЗС сети {network}. "
                        f"Стоимость: ~{price_rub} ₽"
                    ),
                    "payload": payload,
                    "currency": "XTR",
                    "prices": [{"label": f"{network} {fuel_type} {volume}л", "amount": stars}],
                },
                timeout=10,
            )
            data = resp.json()
            if data.get("ok"):
                link: str = data["result"]
                logger.info("Stars network invoice created: stars=%d, network=%s, user=%d", stars, network, user_id)
                return PaymentResult(
                    ok=True, transaction_id=tx_id, qr_hash=qr,
                    stars_amount=stars, checkout_url=link,
                )
            else:
                desc = data.get("description", "Telegram API error")
                logger.error("createInvoiceLink (network) failed: %s", data)
                return PaymentResult(
                    ok=False, transaction_id=tx_id, qr_hash=qr,
                    stars_amount=stars, error=desc,
                )
        except Exception as exc:
            logger.exception("StarsPaymentProvider network invoice error: %s", exc)
            return PaymentResult(
                ok=False, transaction_id=tx_id, qr_hash=qr,
                stars_amount=stars, error=str(exc),
            )


def get_provider(method: str = PAYMENT_METHOD) -> PaymentProvider:
    """
    Return the appropriate provider by method name.
    Defaults to PAYMENT_METHOD env var ("auto" → CryptoBot if token set, else Mock).
    """
    resolved = method if method != "auto" else ("cryptobot" if CRYPTO_BOT_TOKEN else "mock")
    if resolved == "cryptobot":
        if not CRYPTO_BOT_TOKEN:
            logger.warning("PAYMENT_METHOD=cryptobot but CRYPTO_BOT_TOKEN is not set — falling back to mock")
            return MockPaymentProvider()
        return CryptoBotProvider()
    if resolved == "stars":
        return StarsPaymentProvider()
    return MockPaymentProvider()


# Module-level default provider (uses PAYMENT_METHOD env var)
provider: PaymentProvider = get_provider()
