"""
Database connection, table creation, and seeding.
Uses PostgreSQL (DATABASE_URL env var) in production, SQLite in development.
"""

import os
import logging
from datetime import datetime, timezone
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, Session

from tma_backend.models import Base, GasStation, FuelStatus, AnalyticsSnapshot

logger = logging.getLogger(__name__)

DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    # Production: Replit-managed PostgreSQL
    # SQLAlchemy requires postgresql:// not postgres://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )
    logger.info("Using PostgreSQL database.")
else:
    # Development: local SQLite
    DB_PATH = "tma.db"
    _sqlite_url = f"sqlite:///{DB_PATH}"
    engine = create_engine(
        _sqlite_url,
        connect_args={"check_same_thread": False},
        pool_pre_ping=True,
    )

    @event.listens_for(engine, "connect")
    def set_wal_mode(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA cache_size=-64000")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    logger.info("Using SQLite database (development).")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all tables."""
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified.")


def is_seeded(db: Session) -> bool:
    return db.query(GasStation).count() > 0


def seed_db(db: Session) -> None:
    """Seed 220+ gas stations with realistic fuel availability data."""
    from tma_backend.seed_stations import generate_stations

    if is_seeded(db):
        logger.info("Database already seeded — skipping.")
        return

    stations_data = generate_stations()
    logger.info(f"Seeding {len(stations_data)} stations…")

    now = datetime.now(timezone.utc)

    for s in stations_data:
        station = GasStation(
            region=s["region"],
            zone_type=s["zone_type"],
            name=s["name"],
            address=s["address"],
            lat=s["lat"],
            lng=s["lng"],
            network=s["network"],
            queue_cars=s["queue_cars"],
        )
        db.add(station)
        db.flush()

        for fs_data in s["fuel_statuses"]:
            fs = FuelStatus(
                station_id=station.id,
                fuel_type=fs_data["fuel_type"],
                status=fs_data["status"],
                availability_pct=fs_data["availability_pct"],
                last_updated=now,
            )
            db.add(fs)

    db.commit()
    logger.info("Seeding complete.")

    _generate_snapshot(db)


def _generate_snapshot(db: Session) -> None:
    """Write one analytics snapshot row per region."""
    from tma_backend.seed_regions import REGIONS

    now = datetime.now(timezone.utc)

    for region in REGIONS:
        rname = region["name"]
        statuses = (
            db.query(FuelStatus)
            .join(GasStation, GasStation.id == FuelStatus.station_id)
            .filter(GasStation.region == rname)
            .all()
        )
        if not statuses:
            continue

        avg = sum(s.availability_pct for s in statuses) / len(statuses)
        green = sum(1 for s in statuses if s.status == "green")
        yellow = sum(1 for s in statuses if s.status == "yellow")
        red = sum(1 for s in statuses if s.status == "red")

        snap = AnalyticsSnapshot(
            region=rname,
            avg_availability=round(avg, 1),
            green_count=green,
            yellow_count=yellow,
            red_count=red,
            price_index=round(90 + (avg / 100) * 20, 1),
            created_at=now,
        )
        db.add(snap)

    db.commit()
