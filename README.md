# KampusKarne

Türkiye'nin ilk üniversite ders ve eğitmen değerlendirme platformu.

Öğrencilerin hocaları ve dersleri **anonim olarak** değerlendirebildiği, ders seçiminde ve üniversite tercihinde veri odaklı karar almayı sağlayan web platformu. RateMyProfessor'dan ilham alınarak Türkiye'ye özgü bir yapıda tasarlanmıştır.

> Bu platform KTÜ ile resmi bağlantısı olmayan bağımsız bir öğrenci inisiyatifidir.

---

## Proje Amacı

Üniversite öğrencileri hocalar ve dersler hakkındaki tecrübelerini genellikle WhatsApp gruplarında paylaşır — bu bilgi kısa sürede kaybolur, aranabilir değildir, bir sonraki öğrenciye ulaşmaz.

KampusKarne bu bilgi birikimini kalıcı, organize ve aranabilir hale getirir:

- Öğrenciler ders seçimini kulaktan dolma bilgiler yerine gerçek verilere dayandırabilir
- Üniversite tercihi yapanlar bölüm ve üniversite karşılaştırması yapabilir
- Profesörler kendi derslerine gelen anonim geri bildirimleri görebilir

---

## Teknoloji Yığını

| Katman | Teknoloji | Neden Seçildi |
|---|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript | App Router ile SSR/SSG desteği, Vercel ile native entegrasyon |
| Stil | Tailwind CSS 4 + shadcn/ui | Hızlı geliştirme, hazır erişilebilir bileşenler |
| Backend & Veritabanı | Supabase (PostgreSQL + Auth + RLS) | Auth, veritabanı ve güvenlik tek pakette, ücretsiz plan MVP için yeterli |
| Hosting | Vercel | Otomatik ölçekleme, CI/CD, Next.js native desteği |
| E-posta | Resend | Supabase ile entegre, ücretsiz planda ayda 3.000 mail |
| Test | Vitest + Playwright | Birim ve E2E test kapsamı |
| Yardımcılar | Zod, nuqs, Recharts, next-themes | Form validasyonu, URL state yönetimi, grafikler |

---

## Klasör Yapısı

```
kampuskarne/
│
├── app/                        # Next.js App Router — sayfalar ve API
│   ├── (auth)/                 # Kayıt ve giriş sayfaları (route group)
│   │   ├── login/              # /login
│   │   └── register/           # /register
│   ├── search/                 # /search — arama + filtreleme
│   ├── instructors/[id]/       # /instructors/:id — hoca profili
│   ├── courses/[id]/           # /courses/:id — ders sayfası
│   ├── suggest/                # /suggest — hoca/ders öneri formu
│   ├── professor/dashboard/    # /professor/dashboard — profesör paneli (korumalı)
│   ├── admin/                  # /admin — admin paneli (korumalı)
│   │   ├── instructors/        # Hoca ekle/düzenle
│   │   ├── courses/            # Ders ekle/düzenle
│   │   ├── suggestions/        # Öneri kuyruğu
│   │   └── reports/            # Şikayet kuyruğu
│   └── api/                    # API route handler'ları
│       ├── auth/               # Kayıt, giriş
│       ├── instructors/        # Hoca listesi ve detay
│       ├── courses/            # Ders listesi ve detay
│       ├── reviews/            # Yorum oluşturma, upvote, şikayet
│       ├── suggest/            # Öneri gönderme
│       └── admin/              # Moderasyon endpoint'leri
│
├── components/                 # Yeniden kullanılabilir React bileşenleri
│   ├── ui/                     # shadcn/ui temel bileşenleri (Button, Card vb.)
│   ├── auth/                   # LoginForm, RegisterForm
│   ├── review/                 # ReviewCard, StarRating, ReviewForm
│   ├── search/                 # SearchBar, FilterPanel, ResultsList
│   ├── instructor/             # InstructorCard, InstructorProfile
│   ├── course/                 # CourseCard, CourseProfile
│   └── layout/                 # Header, Footer
│
├── lib/                        # Yardımcı fonksiyonlar ve istemciler
│   ├── supabase/
│   │   ├── client.ts           # İstemci taraflı Supabase bağlantısı
│   │   └── server.ts           # Sunucu taraflı Supabase bağlantısı
│   ├── auth.ts                 # Auth yardımcı fonksiyonları (.edu.tr kontrolü vb.)
│   └── utils.ts                # Genel yardımcı fonksiyonlar
│
├── types/                      # TypeScript tip tanımları
│   └── index.ts                # Tüm proje tipleri (User, Review, Course vb.)
│
├── hooks/                      # Custom React hook'ları
│   └── useCurrentUser.ts       # Mevcut kullanıcıyı dönen hook
│
├── middleware.ts               # Route koruması (/admin, /professor)
│
├── supabase/                   # Veritabanı ile ilgili dosyalar
│   ├── migrations/             # SQL migration dosyaları
│   └── seed.sql                # Başlangıç verisi (hocalar, dersler)
│
├── design/                     # UI/UX tasarım dosyaları
│   ├── README.md               # UI/UX sorumlusu için görev ve kurallar
│   └── wireframes/             # Figma'dan export edilen ekran tasarımları
│
├── data/                       # Statik veri dosyaları
│   └── ktu-instructors.md      # KTÜ hoca ve ders listesi (araştırmacı dolduracak)
│
├── e2e/                        # Playwright E2E testleri
│
├── .env.local.example          # Gerekli ortam değişkenleri şablonu
└── README.md                   # Bu dosya
```

---

## Kurulum

### Gereksinimler

- Node.js 20+
- pnpm

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/iibrahimddogan/uni-platform.git
cd uni-platform

# 2. Bağımlılıkları yükle
pnpm install

# 3. Ortam değişkenlerini ayarla
cp .env.local.example .env.local
# .env.local dosyasını aç ve Supabase değerlerini gir

# 4. Geliştirme sunucusunu başlat
pnpm dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

### Ortam Değişkenleri

`.env.local.example` dosyasını kopyalayıp `.env.local` olarak kaydet.
Supabase dashboard'undan `SUPABASE_URL` ve anahtarları al.

> **Önemli:** `.env.local` dosyasını asla Git'e ekleme. `.gitignore`'da zaten kayıtlı.

---

## Git Stratejisi

```
main          → production (canlı)
dev           → entegrasyon branch'i
feature/*     → yeni özellikler
fix/*         → hata düzeltmeleri
```

- Her özellik `feature/özellik-adı` branch'inden geliştirilir
- PR açılır, lider review yapar
- `main`'e direkt push **yasaktır**
- Commit formatı: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`

---

## Test

```bash
# Birim testleri
pnpm test

# E2E testleri (önce dev sunucusunu başlat)
pnpm test:e2e
```

---

## Ekip

| Kişi | Görev |
|---|---|
| Bora Bayık | Proje Yöneticisi + Veritabanı |
| UI/UX sorumlusu | Tasarım (Figma) |
| Araştırmacı | KTÜ hoca/ders/bölüm listesi |
| Kodlayıcı | Frontend geliştirme |
| PR Reviewer | Kod inceleme ve güvenlik |

---

## Katkı Rehberi

1. `dev` branch'inden yeni bir `feature/` branch'i aç
2. Değişikliklerini yap ve commit et (`feat: kısa açıklama`)
3. PR aç → `dev` branch'ine hedefle
4. Review bekle, onaylandıktan sonra merge et
