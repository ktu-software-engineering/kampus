#!/usr/bin/env python3
"""
KTÜ Lisans Katalog Scraper
Bağımlılıklar: pip install requests beautifulsoup4
Kullanım:      python scripts/scrape_ktu.py
Çıktı:         data/ktu-scraped.json
               data/ktu-instructors-clean.md (✓ / boş kaldı işaretleri)
"""

import requests
import json
import time
import os
import sys
from datetime import datetime
from bs4 import BeautifulSoup
from urllib.parse import parse_qs, urlparse

# ---------------------------------------------------------------------------
# Ayarlar
# ---------------------------------------------------------------------------
BASE_URL   = "https://katalog.ktu.edu.tr/DersBilgiPaketi"
OUTPUT_JSON = os.path.join("data", "ktu-scraped.json")
MD_FILE     = os.path.join("data", "ktu-instructors-clean.md")
DELAY       = 0.5   # saniye — rate limit koruması
SIDS        = [10, 20, 30, 40, 50, 60]  # 1–6. yıl

# ---------------------------------------------------------------------------
# Lisans programları (isim, pid)
# ---------------------------------------------------------------------------
LISANS_PROGRAMS = [
    ("Diş Hekimliği", 121),
    ("Eczacılık", 125),
    ("İngiliz Dili Ve Edebiyatı", 22),
    ("Sosyoloji", 1149),
    ("Tarih", 20),
    ("Türk Dili Ve Edebiyatı", 21),
    ("Bilgisayar Ve Öğretim Teknolojileri Öğretmenliği", 27),
    ("Rehberlik Ve Psikolojik Danışmanlık", 34),
    ("Resim-İş Öğretmenliği", 45),
    ("Müzik Öğretmenliği", 44),
    ("Matematik Öğretmenliği", 32),
    ("Kimya Öğretmenliği", 33),
    ("Biyoloji Öğretmenliği", 30),
    ("Fizik Öğretmenliği", 31),
    ("Coğrafya Öğretmenliği", 1162),
    ("Türkçe Öğretmenliği", 49),
    ("İşitme Engelliler Öğretmenliği", 48),
    ("Zihin Engelliler Öğretmenliği", 47),
    ("Okulöncesi Öğretmenliği", 36),
    ("Sosyal Bilgiler Öğretmenliği", 38),
    ("Sınıf Öğretmenliği", 35),
    ("Fen Bilgisi Öğretmenliği", 37),
    ("İlköğretim Matematik Öğretmenliği", 39),
    ("Biyoloji", 18),
    ("Fizik", 14),
    ("Kimya", 15),
    ("Matematik", 17),
    ("İstatistik Ve Bilgisayar Bilimleri", 19),
    ("Resim", 883),
    ("Hukuk", 1163),
    ("Bilgisayar Mühendisliği", 9),
    ("Elektrik - Elektronik Mühendisliği", 4),
    ("Harita Mühendisliği", 12),
    ("Jeofizik Mühendisliği", 7),
    ("Jeoloji Mühendisliği", 5),
    ("Maden Mühendisliği", 8),
    ("Makina Mühendisliği", 3),
    ("Metalurji Ve Malzeme Mühendisliği", 10),
    ("İnşaat Mühendisliği", 1),
    ("Mimarlık", 586),
    ("İç Mimarlık", 588),
    ("Şehir Ve Bölge Planlama", 590),
    ("Ağaç İşleri Endüstri Mühendisliği", 2158),
    ("Enerji Sistemleri Mühendisliği", 2475),
    ("Yazılım Mühendisliği", 2615),
    ("İnşaat Mühendisliği (OF Teknoloji)", 2161),
    ("Orman Endüstrisi Mühendisliği", 24),
    ("Orman Mühendisliği", 23),
    ("Peyzaj Mimarlığı", 25),
    ("Yaban Hayatı Ekolojisi Ve Yönetimi", 2355),
    ("Hemşirelik", 2340),
    ("Balıkçılık Teknolojisi Mühendisliği", 85),
    ("Deniz Ulaştırma İşletme Mühendisliği", 86),
    ("Gemi İnşaatı Ve Gemi Makineleri Mühendisliği", 986),
    ("Genel Tıp", 83),
    ("Ekonometri", 82),
    ("Kamu Yönetimi", 79),
    ("Maliye", 77),
    ("Uluslararası İlişkiler", 80),
    ("Çalışma Ekonomisi Ve Endüstri İlişkileri", 81),
    ("İktisat", 73),
    ("İşletme", 75),
    ("İlahiyat", 1194),
    ("Gazetecilik", 124),
    ("Halkla İlişkiler Ve Reklamcılık", 122),
    ("Müzikoloji", 1576),
    ("Beden Eğitimi Ve Spor Öğretmenliği", 1151),
    ("Antrenörlük Eğitimi", 1167),
    ("Rekreasyon", 1168),
    ("Spor Yöneticiliği", 1166),
    ("Ebelik", 127),
    ("Hemşirelik (Trabzon Sağlık YO)", 128),
]

# ---------------------------------------------------------------------------
# HTTP session
# ---------------------------------------------------------------------------
session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0 (KTU-Scraper/1.0)"})

def fetch(url):
    """Sayfayı çek, BeautifulSoup döndür. Hata varsa None."""
    try:
        resp = session.get(url, timeout=15)
        if resp.status_code != 200:
            return None
        # Encoding tespiti: önce HTTP header, yoksa içerikten anla
        if resp.encoding and resp.encoding.lower() not in ("utf-8", "utf8"):
            resp.encoding = resp.apparent_encoding
        return BeautifulSoup(resp.text, "html.parser")
    except Exception as e:
        print(f"    ! İstek hatası: {e}")
        return None

# ---------------------------------------------------------------------------
# Yardımcı fonksiyonlar
# ---------------------------------------------------------------------------
TITLES = [
    "Prof. Dr.", "Doç. Dr.", "Dr. Öğr. Üyesi",
    "Öğr. Gör. Dr.", "Öğr. Gör.",
    "Arş. Gör. Dr.", "Arş. Gör.",
]

def split_title(text):
    """'Dr. Öğr. Üyesi Murat AYKUT' → ('Dr. Öğr. Üyesi', 'Murat AYKUT')"""
    text = text.strip()
    for t in TITLES:
        if text.startswith(t):
            return t, text[len(t):].strip()
    return "", text


def get_dbids_for_semester(pid, sid):
    """Dönem sayfasındaki tüm ders dbid'lerini döndür."""
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
                continue
    return dbids


def get_course_detail(pid, dbid):
    """
    Ders sayfasından kod, ad ve hoca bilgilerini çek.
    Dönen dict: {dbid, code, name, instructor_title, instructor_name}
    """
    url = f"{BASE_URL}/course.aspx?pid={pid}&lang=1&dbid={dbid}"
    soup = fetch(url)
    time.sleep(DELAY)
    if not soup:
        return None

    info = {
        "dbid": dbid,
        "code": "",
        "name": "",
        "instructor_title": "",
        "instructor_name": "",
    }

    for row in soup.find_all("tr"):
        cells = row.find_all(["td", "th"])
        if len(cells) < 2:
            continue
        label = cells[0].get_text(" ", strip=True).lower()
        value = cells[1].get_text(" ", strip=True)
        if not value:
            continue

        if "ders kodu" in label or "code" in label:
            info["code"] = value
        elif "ders adı" in label or "course name" in label or "ders adi" in label:
            if not info["name"]:   # ilk eşleşmeyi al
                info["name"] = value
        elif any(k in label for k in ("öğretim üyesi", "öğretim elemanı", "yürütücü", "instructor", "lecturer")):
            title, name = split_title(value)
            info["instructor_title"] = title
            info["instructor_name"] = name

    return info

# ---------------------------------------------------------------------------
# JSON kaydet / yükle
# ---------------------------------------------------------------------------
def load_json():
    if os.path.exists(OUTPUT_JSON):
        with open(OUTPUT_JSON, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"scraped_at": None, "programs": []}


def save_json(data):
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# ---------------------------------------------------------------------------
# MD dosyasını güncelle
# ---------------------------------------------------------------------------
def mark_md(program_name, status):
    """
    MD dosyasındaki ilgili satıra ✓ veya (boş kaldı) ekle.
    İkinci kez çalışırsa çift işaret koymaz.
    """
    if not os.path.exists(MD_FILE):
        return
    with open(MD_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Zaten işaretlenmişse dokunma
    marker_ok    = f"| {program_name} ✓ |"
    marker_empty = f"| {program_name} (boş kaldı) |"
    original     = f"| {program_name} |"

    if marker_ok in content or marker_empty in content:
        return

    if original in content:
        replacement = marker_ok if status == "ok" else marker_empty
        content = content.replace(original, replacement, 1)
        with open(MD_FILE, "w", encoding="utf-8") as f:
            f.write(content)

# ---------------------------------------------------------------------------
# Ana döngü
# ---------------------------------------------------------------------------
def main():
    print("KTÜ Lisans Scraper başladı")
    print(f"Çıktı: {OUTPUT_JSON}\n")

    data     = load_json()
    done_pids = {p["pid"] for p in data.get("programs", [])}
    total     = len(LISANS_PROGRAMS)

    for idx, (program_name, pid) in enumerate(LISANS_PROGRAMS, 1):
        prefix = f"[{idx}/{total}] {program_name} (pid={pid})"

        if pid in done_pids:
            print(f"{prefix} — atlandı (zaten var)")
            continue

        print(f"\n{prefix}")

        # Tüm yıllar için dbid topla
        all_dbids = []
        for sid in SIDS:
            dbids = get_dbids_for_semester(pid, sid)
            if dbids:
                print(f"  sid={sid}: {len(dbids)} ders")
                all_dbids.extend(dbids)
            # Boş gelirse devam et (ara yıl boş olabilir), hepsini dene

        # Tekrar edenleri çıkar
        all_dbids = list(dict.fromkeys(all_dbids))

        if not all_dbids:
            print(f"  → Hiç ders bulunamadı, boş kaldı")
            data["programs"].append({
                "pid": pid,
                "name": program_name,
                "status": "empty",
                "courses": [],
            })
            save_json(data)
            mark_md(program_name, "empty")
            continue

        print(f"  Toplam {len(all_dbids)} ders çekilecek...")

        courses = []
        for i, dbid in enumerate(all_dbids, 1):
            detail = get_course_detail(pid, dbid)
            if detail:
                courses.append(detail)
            if i % 20 == 0 or i == len(all_dbids):
                print(f"  {i}/{len(all_dbids)} ders tamamlandı")

        data["programs"].append({
            "pid": pid,
            "name": program_name,
            "status": "ok",
            "courses": courses,
        })
        save_json(data)
        mark_md(program_name, "ok")
        print(f"  ✓ {len(courses)} ders kaydedildi")

    data["scraped_at"] = datetime.now().isoformat()
    save_json(data)
    print("\n\nTamamlandı!")
    print(f"Sonuç: {OUTPUT_JSON}")


if __name__ == "__main__":
    # Scriptin proje kök dizininden çalıştırıldığından emin ol
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    os.chdir(project_root)
    main()
