"""
Deterministic station seed generator — 500+ stations across 32 regions.
Named stations from NAMED_STATIONS are injected first, then procedural fill.
Uses a seeded RNG so results are reproducible across restarts.
"""

import random
from tma_backend.seed_regions import (
    REGIONS, STREET_TYPES, STREET_NAMES, FUEL_TYPES, NAMED_STATIONS
)


def _status_from_pct(pct: int) -> str:
    if pct >= 60:
        return "green"
    elif pct >= 25:
        return "yellow"
    return "red"


def _availability_pct(rng: random.Random, zone_type: str) -> int:
    """
    Critical zones are harder — more red/yellow.
    Standard zones: green 55%, yellow 30%, red 15%.
    Critical zones: green 35%, yellow 35%, red 30%.
    """
    roll = rng.random()
    if zone_type == "critical":
        if roll < 0.35:
            return rng.randint(60, 100)
        elif roll < 0.70:
            return rng.randint(25, 59)
        else:
            return rng.randint(0, 24)
    else:
        if roll < 0.55:
            return rng.randint(60, 100)
        elif roll < 0.85:
            return rng.randint(25, 59)
        else:
            return rng.randint(0, 24)


def _address(rng: random.Random) -> str:
    street_type = rng.choice(STREET_TYPES)
    street = rng.choice(STREET_NAMES)
    house = rng.randint(1, 250)
    return f"{street_type} {street}, {house}"


def _queue(rng: random.Random, availability_pct: int) -> int:
    base = max(0, int((100 - availability_pct) / 10))
    return rng.randint(base, base + rng.randint(0, 8))


def _make_fuel_statuses(rng: random.Random, zone: str) -> list[dict]:
    fuel_count = rng.randint(3, min(5, len(FUEL_TYPES)))
    fuels = rng.sample(FUEL_TYPES, fuel_count)
    result = []
    for ft in fuels:
        pct = _availability_pct(rng, zone)
        result.append({
            "fuel_type": ft,
            "status": _status_from_pct(pct),
            "availability_pct": pct,
        })
    return result


def generate_stations() -> list[dict]:
    """Return list of station dicts ready for DB insert. ~500+ stations total."""
    rng = random.Random(42)
    stations = []

    # ── Step 1: inject named real stations ──────────────────────────────
    region_map = {r["name"]: r for r in REGIONS}
    named_by_region: dict[str, int] = {}

    for ns in NAMED_STATIONS:
        region_name = ns["region"]
        region = region_map.get(region_name)
        zone = region["zone_type"] if region else "standard"

        fuel_statuses = _make_fuel_statuses(rng, zone)
        avg_pct = int(sum(f["availability_pct"] for f in fuel_statuses) / len(fuel_statuses))

        stations.append({
            "region": region_name,
            "zone_type": zone,
            "name": ns["name"],
            "address": ns["address"],
            "lat": ns["lat"],
            "lng": ns["lng"],
            "network": ns["network"],
            "queue_cars": _queue(rng, avg_pct),
            "fuel_statuses": fuel_statuses,
        })
        named_by_region[region_name] = named_by_region.get(region_name, 0) + 1

    # ── Step 2: procedural fill to hit station_count per region ─────────
    for region in REGIONS:
        lat_lo, lat_hi = region["lat_range"]
        lng_lo, lng_hi = region["lng_range"]
        zone = region["zone_type"]
        chains = region["chains"]
        rname = region["name"]

        already = named_by_region.get(rname, 0)
        remaining = max(0, region["station_count"] - already)

        for i in range(remaining):
            network = chains[i % len(chains)]
            lat = round(rng.uniform(lat_lo, lat_hi), 6)
            lng = round(rng.uniform(lng_lo, lng_hi), 6)
            address = _address(rng)

            fuel_statuses = _make_fuel_statuses(rng, zone)
            avg_pct = int(sum(f["availability_pct"] for f in fuel_statuses) / len(fuel_statuses))

            stations.append({
                "region": rname,
                "zone_type": zone,
                "name": network,
                "address": address,
                "lat": lat,
                "lng": lng,
                "network": network,
                "queue_cars": _queue(rng, avg_pct),
                "fuel_statuses": fuel_statuses,
            })

    return stations
