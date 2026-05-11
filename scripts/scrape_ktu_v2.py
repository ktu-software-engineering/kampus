#!/usr/bin/env python3
"""
KTÜ Ders Bilgi Paketi Scraper v2
- data/ktu-instructors-clean.md'den program/PID listesini okur
- PID'i boş olan programları atlar (kullanıcı sonradan doldurur)
- Her programın tüm dönemlerini tarar
- Ders kodu, adı ve hocaları doğru şekilde çeker
- Çoklu hoca / gömülü unvan / uzun-form unvan hepsini düzeltir
- Boş gelen programların PID'ini clean.md'den siler
- Çıktı: data/ktu-courses.json  (kaldığı yerden devam edebilir)

Kullanım:
    python scripts/scrape_ktu_v2.py
"""

import json
import os
import re
import time
from datetime import datetime
from urllib.parse import parse_qs, urlparse

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Dosya yolları
# ---------------------------------------------------------------------------
ROOT        = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD_FILE     = os.path.join(ROOT, "data", "ktu-instructors-clean.md")
OUTPUT_JSON = os.path.join(ROOT, "data", "ktu-courses.json")

BASE_URL = "https://katalog.ktu.edu.tr/DersBilgiPaketi"
DELAY    = 0.4   # saniye — sunucuyu bunaltmamak için

# Dönem ID'leri: yıllık 2 yarıyıl × 6 yıl = 12 dönem
SIDS = list(range(10, 130, 10))   # 10, 20, 30, ..., 120

# ---------------------------------------------------------------------------
# Unvan normalleştirme
# Uzun-form / noktasız / İngilizce → kanonike dönüşüm tablosu
# (uzundan kısaya — ilk eşleşen kazanır)
# ---------------------------------------------------------------------------
TITLE_PATTERNS = [
    # Uzun Türkçe form
    (r"Profesör\s+Doktor",              "Prof. Dr."),
    (r"Doçent\s+Doktor",                "Doç. Dr."),
    (r"Doktor\s+Öğretim\s+[Üu]yesi",   "Dr. Öğr. Üyesi"),
    (r"Öğretim\s+Görevlisi\s+Doktor",  "Öğr. Gör. Dr."),
    (r"Araştırma\s+Görevlisi\s+Doktor","Arş. Gör. Dr."),
    (r"Öğretim\s+Görevlisi",           "Öğr. Gör."),
    (r"Araştırma\s+Görevlisi",         "Arş. Gör."),
    # Kısa Türkçe — noktasız/bitişik/boşluksuz varyantlar
    (r"Prof\.?\s*Dr\.",                 "Prof. Dr."),
    (r"Doç\.?Dr\b",                     "Doç. Dr."),
    (r"Doç\.\s*Dr\.",                   "Doç. Dr."),
    (r"Dr\.?\s*Öğr\.?\s*[Üu]yesi",     "Dr. Öğr. Üyesi"),
    (r"Dr\.?\s*Öğret\w*\s*[Üu]yesi",   "Dr. Öğr. Üyesi"),
    (r"Öğr\.?\s*Gör\.?\s*Dr\.",        "Öğr. Gör. Dr."),
    (r"Arş\.?\s*Gör\.?\s*Dr\.",        "Arş. Gör. Dr."),
    (r"Prof\.",                         "Prof."),
    (r"Doç\.",                          "Doç. Dr."),
    (r"Dr\.",                           "Dr."),
    (r"Öğr\.?\s*Gör\.",                "Öğr. Gör."),
    (r"Arş\.?\s*Gör\.",                "Arş. Gör."),
    (r"Uzm\.",                          "Uzm."),
    # İngilizce eşdeğerleri
    (r"Associate\s+Prof\.?\s*Dr\.",    "Prof. Dr."),
    (r"Assist\.?\s*Prof\.?\s*Dr\.?",   "Dr. Öğr. Üyesi"),
    (r"Assist\.?\s*Dr\.?",             "Dr."),
]

# Unvan başlangıç tespiti için birleşik regex (split noktasını bulmak için)
_TITLE_START_RE = re.compile(
    r"(?:"
    + "|".join(pat for pat, _ in TITLE_PATTERNS)
    + r")",
    re.IGNORECASE,
)

# Geçersiz instructor adları
_INVALID_RE = re.compile(
    r"^[-.\s–—]+$"                          # sadece tire/nokta
    r"|^(na|yok\.?|yök|bulunmamaktadır\.?)$"  # placeholder
    r"|öğretim\s+üyele"                     # grup etiketi
    r"|anabilim\s+dal"
    r"|bilim\s+dal"
    r"|öğretim\s+elemanlar"
    r"|bölüm\s+eleman"
    r"|^bölüm\s"
    r"|^değişiyor$"
    r"|\%\d",                               # ders programı verisi
    re.IGNORECASE,
)

# ---------------------------------------------------------------------------
# Unvan ayıklama
# ---------------------------------------------------------------------------
def extract_title_and_name(text: str) -> tuple[str, str]:
    """
    'Prof. Dr. Ahmet YILMAZ'  →  ('Prof. Dr.', 'Ahmet YILMAZ')
    'Öğretim Görevlisi Aziz AŞAN'  →  ('Öğr. Gör.', 'Aziz AŞAN')
    'Ahmet YILMAZ'  →  ('', 'Ahmet YILMAZ')
    """
    text = text.strip().lstrip("-–—. ")
    for pattern, canonical in TITLE_PATTERNS:
        m = re.match(rf"^({pattern})[.\s]*(.+)$", text, re.IGNORECASE)
        if m:
            name = m.group(2).strip().lstrip(". ")
            if name:
                return canonical, name
    return "", text


def split_instructors(raw: str) -> list[dict]:
    """
    'Prof. Dr. A YILMAZ, Öğr. Gör. B KOÇ\\nArş. Gör. C DEMİR'
    → [{'title': 'Prof. Dr.', 'name': 'A YILMAZ'}, ...]
    """
    # Satır sonlarını virgüle çevir
    raw = re.sub(r"[\r\n]+", ",", raw).strip()
    # Başındaki tire / nokta temizle
    raw = raw.lstrip("-–—. ")

    if not raw:
        return []

    # Unvan başladığı noktaları bul ve böl
    parts = re.split(
        r",\s*(?=" + "|".join(pat for pat, _ in TITLE_PATTERNS) + r")",
        raw,
        flags=re.IGNORECASE,
    )

    results = []
    for part in parts:
        part = part.strip().strip(",").strip()
        if not part:
            continue
        title, name = extract_title_and_name(part)
        name = name.strip()
        if not name or _INVALID_RE.search(name) or len(name) < 3:
            continue
        # Tamamen harf içermeyen → atla
        if not any(c.isalpha() for c in name):
            continue
        results.append({"title": title, "name": name})

    return results


# ---------------------------------------------------------------------------
# HTTP yardımcıları
# ---------------------------------------------------------------------------
_session = requests.Session()
_session.headers.update({"User-Agent": "Mozilla/5.0 (KTU-Scraper/2.0)"})


def fetch(url: str, retries: int = 3) -> BeautifulSoup | None:
    for attempt in range(retries):
        try:
            r = _session.get(url, timeout=15)
            if r.status_code == 200:
                if r.encoding and r.encoding.lower() not in ("utf-8", "utf8"):
                    r.encoding = r.apparent_encoding
                return BeautifulSoup(r.text, "html.parser")
            if r.status_code == 404:
                return None
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1)
                continue
            print(f"    ! Hata ({url}): {e}")
    return None


# ---------------------------------------------------------------------------
# Dönem sayfası → dbid listesi
# ---------------------------------------------------------------------------
def get_dbids(pid: int, sid: int) -> list[int]:
    url = f"{BASE_URL}/semester.aspx?pid={pid}&lang=1&sid={sid}"
    soup = fetch(url)
    time.sleep(DELAY)
    if not soup:
        return []
    dbids = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "course.aspx" in href and "dbid=" in href:
            try:
                qs = parse_qs(urlparse(href).query)
                dbids.append(int(qs["dbid"][0]))
            except (KeyError, ValueError):
                pass
    return dbids


# ---------------------------------------------------------------------------
# Ders sayfası → {code, name, credits, ects, instructors}
# ---------------------------------------------------------------------------
# "AITB1003" veya "DIS 147" gibi araya boşluk girebilen kodlar
_CODE_RE = re.compile(r"^[A-ZÇŞĞÜÖİa-z]{2,8}\s?\d{2,4}[A-Z0-9]*$")
_ECTS_RE = re.compile(r"(?:AKTS|ECTS)[:\s]*(\d+)", re.IGNORECASE)

INSTRUCTOR_LABELS = (
    "öğretim üyesi", "öğretim elemanı", "yürütücü",
    "instructor", "lecturer",
)


def get_course_detail(pid: int, dbid: int) -> dict | None:
    url = f"{BASE_URL}/course.aspx?pid={pid}&lang=1&dbid={dbid}"
    soup = fetch(url)
    time.sleep(DELAY)
    if not soup:
        return None

    info = {
        "dbid": dbid,
        "code": "",
        "name": "",
        "credits": "",
        "ects": "",
        "instructors": [],
    }
    seen_names: set[str] = set()

    def add_instructors(raw: str):
        for inst in split_instructors(raw):
            key = inst["name"].upper()
            if key not in seen_names:
                seen_names.add(key)
                info["instructors"].append(inst)

    for table in soup.find_all("table"):
        for row in table.find_all("tr"):
            cells = [c.get_text(" ", strip=True) for c in row.find_all(["td", "th"])]
            cells = [c for c in cells if c]
            if not cells:
                continue

            # ── Ders başlık satırı: CODE | Ad | Kredi | AKTS:N ──────────
            # Kod cells[0]'da olabilir (BM gibi) ya da ortada (Diş Hek. gibi navigasyon
            # sütunu öne girdiğinde). İlk eşleşen kısa hücreyi ara.
            if not info["code"]:
                for j, cell in enumerate(cells):
                    if _CODE_RE.match(cell) and j + 1 < len(cells):
                        candidate_name = cells[j + 1]
                        # Sonraki hücre bir etiket değil, gerçek bir ad mı?
                        if len(candidate_name) > 3 and ":" not in candidate_name[:6]:
                            info["code"] = cell
                            info["name"] = candidate_name
                            if j + 2 < len(cells):
                                info["credits"] = cells[j + 2]
                            if j + 3 < len(cells):
                                m = _ECTS_RE.search(cells[j + 3])
                                if m:
                                    info["ects"] = m.group(1)
                            break
            # ── Etiket | Değer satırları ─────────────────────────────────
            if len(cells) >= 2:
                label = cells[0].lower()
                value = cells[1].strip()
                if not value or value in ("--", "-", "Yok", "None"):
                    continue

                if any(k in label for k in INSTRUCTOR_LABELS):
                    add_instructors(value)

    # code veya name yoksa ders sayfası parse edilememiş — None döndür
    if not info["code"] and not info["name"]:
        return None

    return info


# ---------------------------------------------------------------------------
# ktu-instructors-clean.md okuyucu
# ---------------------------------------------------------------------------
def parse_programs_from_md(md_path: str) -> list[dict]:
    """
    Markdown tablosundaki Lisans bölümündeki satırlardan {'name': str, 'pid': int} döndürür.
    PID sütunu boşsa o satırı atlar.
    """
    programs = []
    seen_pids: set[int] = set()
    in_lisans = False

    with open(md_path, encoding="utf-8") as f:
        content = f.read()

    for line in content.splitlines():
        # Bölüm başlığını takip et
        if line.startswith("###"):
            in_lisans = "lisans" in line.lower() and "ön lisans" not in line.lower() \
                        and "yüksek" not in line.lower() and "doktora" not in line.lower()
            continue

        if not in_lisans:
            continue
        # Ayırıcı satırları atla: |---|---|
        if re.match(r"\|\s*[-:]+\s*\|", line):
            continue
        # | ad | pid |
        m = re.match(r"\|\s*(.+?)\s*\|\s*(\d*)\s*\|", line)
        if not m:
            continue

        raw_name = m.group(1).strip()
        pid_str  = m.group(2).strip()

        # Başlık satırları
        if raw_name.lower() in ("program", "---"):
            continue

        # PID yoksa atla
        if not pid_str:
            continue

        try:
            pid = int(pid_str)
        except ValueError:
            continue

        if pid in seen_pids:
            continue
        seen_pids.add(pid)

        # İşaret temizle
        clean_name = re.sub(r"\s*✓\s*$", "", raw_name)
        clean_name = re.sub(r"\s*\(boş kaldı\)\s*$", "", clean_name, flags=re.IGNORECASE)
        clean_name = clean_name.strip()

        programs.append({"name": clean_name, "pid": pid})

    return programs


# ---------------------------------------------------------------------------
# Boş gelen programın PID'ini clean.md'den sil
# ---------------------------------------------------------------------------
def blank_pid_in_md(md_path: str, pid: int):
    with open(md_path, encoding="utf-8") as f:
        content = f.read()

    # | ... | 123 |  →  | ... |  |
    updated = re.sub(
        rf"(\|\s*[^|]+?\s*\|\s*){re.escape(str(pid))}(\s*\|)",
        r"\1\2",
        content,
    )
    if updated != content:
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(updated)
        print(f"    → PID {pid} clean.md'den silindi (veri yok)")


# ---------------------------------------------------------------------------
# JSON kaydet / yükle
# ---------------------------------------------------------------------------
def load_json() -> dict:
    if os.path.exists(OUTPUT_JSON):
        with open(OUTPUT_JSON, encoding="utf-8") as f:
            return json.load(f)
    return {"scraped_at": None, "programs": []}


def save_json(data: dict):
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# Ana döngü
# ---------------------------------------------------------------------------
def main():
    print("KTÜ Scraper v2 başladı")
    print(f"Program listesi : {MD_FILE}")
    print(f"Çıktı           : {OUTPUT_JSON}\n")

    programs = parse_programs_from_md(MD_FILE)
    print(f"Toplam {len(programs)} program bulundu (PID'i olanlar)\n")

    data = load_json()
    # Sadece başarılı olanlar "tamamlandı" sayılır.
    # "empty" olanlar tekrar denenir (kullanıcı PID'i düzeltmiş olabilir).
    done_pids = {p["pid"] for p in data.get("programs", []) if p.get("status") == "ok"}
    total = len(programs)

    # Önceki çalıştırmadan kalan "empty" kayıtları listeden çıkar
    # (yeniden denenecekler için temiz sayfa açılsın)
    data["programs"] = [p for p in data.get("programs", []) if p.get("status") == "ok"]

    for idx, prog in enumerate(programs, 1):
        pid  = prog["pid"]
        name = prog["name"]
        prefix = f"[{idx}/{total}] {name} (pid={pid})"

        if pid in done_pids:
            print(f"{prefix} — zaten var, atlandı")
            continue

        print(f"\n{prefix}")

        # Tüm dönemleri tara
        all_dbids: list[int] = []
        empty_streak = 0
        for sid in SIDS:
            dbids = get_dbids(pid, sid)
            if dbids:
                all_dbids.extend(dbids)
                empty_streak = 0
                print(f"  sid={sid}: {len(dbids)} ders")
            else:
                empty_streak += 1
                # 4 art arda boş dönem → bu program için yeterli
                if empty_streak >= 4:
                    break

        # Tekrarları kaldır
        all_dbids = list(dict.fromkeys(all_dbids))

        if not all_dbids:
            print(f"  → Hiç ders bulunamadı")
            data["programs"].append({"pid": pid, "name": name, "status": "empty", "courses": []})
            save_json(data)
            blank_pid_in_md(MD_FILE, pid)
            done_pids.add(pid)
            continue

        print(f"  {len(all_dbids)} ders çekilecek...")

        courses: list[dict] = []
        failed = 0
        for i, dbid in enumerate(all_dbids, 1):
            detail = get_course_detail(pid, dbid)
            if detail:
                courses.append(detail)
            else:
                failed += 1
            if i % 25 == 0 or i == len(all_dbids):
                print(f"  {i}/{len(all_dbids)} tamamlandı (başarısız: {failed})")

        data["programs"].append({
            "pid": pid,
            "name": name,
            "status": "ok" if courses else "empty",
            "courses": courses,
        })
        save_json(data)

        if not courses:
            blank_pid_in_md(MD_FILE, pid)
        else:
            print(f"  ✓ {len(courses)} ders kaydedildi")

        done_pids.add(pid)

    data["scraped_at"] = datetime.now().isoformat()
    save_json(data)
    print("\n\nTamamlandı!")
    print(f"Çıktı: {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
