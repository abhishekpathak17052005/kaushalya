from __future__ import annotations

import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config.settings import get_settings

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def connect_db() -> None:
    global _client, _db
    settings = get_settings()
    try:
        _client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
        )
        await _client.admin.command("ping")
        _db = _client[settings.MONGODB_DB_NAME]
        logger.info("MongoDB connected — database: %s", settings.MONGODB_DB_NAME)
    except Exception as exc:
        logger.error("MongoDB connection failed: %s", exc)
        raise


async def close_db() -> None:
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
        logger.info("MongoDB connection closed")


def get_db() -> AsyncIOMotorDatabase:
    """Return DB instance; auto-reconnect if the global is missing."""
    global _client, _db
    if _db is not None:
        return _db
    # Lazy init — useful when connect_db() failed at startup
    settings = get_settings()
    _client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        serverSelectionTimeoutMS=3000,
        connectTimeoutMS=3000,
    )
    _db = _client[settings.MONGODB_DB_NAME]
    return _db


async def check_db_health() -> bool:
    """Returns True if MongoDB is reachable."""
    try:
        if _client is None:
            return False
        await _client.admin.command("ping")
        return True
    except Exception:
        return False
