import csv
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://msk.spravker.ru"
START_URL = "https://msk.spravker.ru/azs/"

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0"
})

def get_soup(url):
    r = session.get(url, timeout=30)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")

OUTPUT_FILE = "azs_moscow.csv"

# Open file once and write progressively so nothing is lost on interruption
with open(OUTPUT_FILE, "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "url", "raw_text"])
    writer.writeheader()

    total = 0
    page = 1
    seen_urls = set()

    while True:
        url = START_URL if page == 1 else f"{START_URL}?page={page}"
        print(f"Page {page}", flush=True)

        try:
            soup = get_soup(url)
        except Exception as e:
            print("Stop:", e, flush=True)
            break

        cards = soup.select("a[href]")
        station_links = []
        for a in cards:
            href = a.get("href", "")
            if "/azs/" in href and href != "/azs/":
                full = urljoin(BASE_URL, href)
                if full not in seen_urls and full not in station_links:
                    station_links.append(full)

        if not station_links:
            print("No more stations found, done.", flush=True)
            break

        for station_url in station_links:
            if station_url in seen_urls:
                continue
            seen_urls.add(station_url)
            try:
                s = get_soup(station_url)
                name = ""
                h1 = s.find("h1")
                if h1:
                    name = h1.get_text(strip=True)
                text = s.get_text("\n", strip=True)
                row = {"name": name, "url": station_url, "raw_text": text}
                writer.writerow(row)
                f.flush()
                total += 1
                print(f"  [{total}] {name}", flush=True)
                time.sleep(0.3)
            except Exception as e:
                print(f"  Error {station_url}: {e}", flush=True)

        page += 1

print(f"Done. Saved: {total}", flush=True)
