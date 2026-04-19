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
| Yardımcılar | Zod, nuqs, Recharts, next-themes | Form validasyonu, URL state yönetimi, grafikler, tema |

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

## Proje Dosya Yapısı — Her Dosya Ne İşe Yarar?

Bu bölümde projedeki her klasör ve dosya, daha önce web projesi yapmamış biri için de anlayacağı şekilde açıklanmıştır.

```
kampuskarne/
│
├── app/                          ← Sitenin tüm sayfaları ve API'leri burada
├── components/                   ← Tekrar kullanılabilir arayüz parçaları
├── lib/                          ← Yardımcı kod: veritabanı bağlantısı, auth
├── hooks/                        ← Özel React hook'ları
├── types/                        ← TypeScript tip tanımları
├── public/                       ← Web'de doğrudan erişilen statik dosyalar
├── supabase/                     ← Veritabanı şema ve başlangıç verileri
├── e2e/                          ← Uçtan uca (E2E) testler
├── data/                         ← Statik veri dosyaları (araştırmacı dolduracak)
├── design/                       ← Tasarım dosyaları ve wireframe'ler
├── raporlar/                     ← Proje raporları (ders ödevi)
└── [kök dizindeki config dosyaları]
```

---

### `app/` — Sayfalar ve API

Next.js'in "App Router" sistemi. Her klasör bir URL adresidir. `page.tsx` o adresin sayfasıdır, `route.ts` ise API endpoint'idir.

```
app/
│
├── (auth)/                       ← Parantezli klasörler URL'e dahil olmaz
│   │                                (auth) sadece giriş/kayıt sayfalarını gruplar
│   ├── login/
│   │   └── page.tsx              ← /login sayfası — kullanıcı giriş formu
│   └── register/
│       └── page.tsx              ← /register sayfası — üyelik formu (.edu.tr kontrolü)
│
├── search/
│   └── page.tsx                  ← /search sayfası — hoca/ders arama + filtreler
│
├── instructors/
│   └── [id]/
│       └── page.tsx              ← /instructors/123 — hoca profili sayfası
│                                    [id] dinamik parametredir, her hoca için ayrı çalışır
│
├── courses/
│   └── [id]/
│       └── page.tsx              ← /courses/456 — ders sayfası, ortalama puanlar + yorumlar
│
├── suggest/
│   └── page.tsx                  ← /suggest — yeni hoca veya ders öneri formu
│
├── professor/
│   └── dashboard/
│       └── page.tsx              ← /professor/dashboard — profesör paneli (sadece profesörler)
│
├── admin/                        ← /admin — yönetici paneli (sadece adminler)
│   ├── page.tsx                  ← Admin ana sayfası
│   ├── instructors/              ← Hoca ekle/düzenle/sil
│   ├── courses/                  ← Ders ekle/düzenle/sil
│   ├── suggestions/              ← Öğrencilerin öneri kuyruğu
│   └── reports/                  ← Şikayet edilen yorum kuyruğu
│
├── api/                          ← Backend API — tarayıcı bu adreslere istek atar
│   ├── auth/                     ← POST /api/auth/register, POST /api/auth/login
│   ├── instructors/              ← GET /api/instructors — hoca listesi
│   ├── courses/                  ← GET /api/courses — ders listesi
│   ├── reviews/                  ← POST /api/reviews — yorum yaz, upvote, şikayet
│   ├── suggest/                  ← POST /api/suggest — öneri gönder
│   └── admin/                    ← Moderasyon işlemleri (yetkili kullanıcıya özel)
│
├── favicon.ico                   ← Tarayıcı sekmesinde görünen küçük ikon
├── globals.css                   ← Tüm sayfaya uygulanan CSS (Tailwind buradan başlar)
├── layout.tsx                    ← Tüm sayfaları saran kapsayıcı (Header + Footer burada)
└── page.tsx                      ← / (ana sayfa) — arama kutusu ve öne çıkanlar
```

---

### `components/` — Arayüz Bileşenleri

Bileşen (component): sayfanın tekrar tekrar kullanılan parçası. Örneğin `ReviewCard` her yorumun kartıdır — 50 yorum varsa 50 kez aynı bileşen kullanılır.

```
components/
│
├── ui/                           ← shadcn/ui'den gelen hazır temel bileşenler
│   └── button.tsx                ← Butona özel stil ve davranış (shadcn otomatik ekler)
│
├── auth/
│   ├── LoginForm.tsx             ← Giriş formu bileşeni (e-posta + şifre alanı)
│   └── RegisterForm.tsx          ← Kayıt formu bileşeni (.edu.tr kontrolü içerir)
│
├── review/
│   ├── ReviewCard.tsx            ← Tek bir yorumun kartı (puan, tarih, upvote butonu)
│   ├── ReviewForm.tsx            ← Yorum yazma formu (slider, evet/hayır, metin)
│   └── StarRating.tsx            ← Yıldız puanlama bileşeni (1-5)
│
├── search/
│   ├── SearchBar.tsx             ← Arama kutusu
│   ├── FilterPanel.tsx           ← Filtre paneli (üniversite, bölüm, puan aralığı)
│   └── ResultsList.tsx           ← Arama sonuçları listesi
│
├── instructor/
│   ├── InstructorCard.tsx        ← Hoca özet kartı (isim, bölüm, puan)
│   └── InstructorProfile.tsx     ← Hocanın tam profili (dersler + yorumlar)
│
├── course/
│   ├── CourseCard.tsx            ← Ders özet kartı (kod, ad, zorluk puanı)
│   └── CourseProfile.tsx         ← Dersin tam sayfası (ortalama istatistikler)
│
└── layout/
    ├── Header.tsx                ← Sayfanın üst kısmı: logo, navigasyon menüsü
    └── Footer.tsx                ← Sayfanın alt kısmı: yasal uyarı, linkler
```

---

### `lib/` — Yardımcı Fonksiyonlar

Tekrar kullanılan kod parçaları. Veritabanı bağlantısı, kimlik doğrulama vb.

```
lib/
│
├── supabase/
│   ├── client.ts                 ← Tarayıcı tarafında Supabase'e bağlanma kodu
│   │                                (kullanıcı giriş yaparken çalışır)
│   └── server.ts                 ← Sunucu tarafında Supabase'e bağlanma kodu
│                                    (API route'ları ve Server Component'lar burada kullanır)
│
├── auth.ts                       ← Kimlik doğrulama yardımcıları
│                                    isEduEmail() → "@ktü.edu.tr" kontrolü gibi
│
└── utils.ts                      ← Genel yardımcı fonksiyonlar
                                     (tarih formatla, metni kısalt vb.)
```

---

### `hooks/` — Özel React Hook'ları

Hook: React bileşenlerinde tekrar kullanılan mantık parçası. "use" ile başlar.

```
hooks/
│
└── useCurrentUser.ts             ← Giriş yapmış kullanıcıyı döner
                                     Kullanım: const user = useCurrentUser()
```

---

### `types/` — TypeScript Tip Tanımları

TypeScript, her değişkenin ne tür bir veri tuttuğunu bilmek ister. Bu dosyada tüm proje verileri tanımlıdır.

```
types/
│
└── index.ts                      ← Tüm tip tanımları
                                     User, Review, Course, Instructor, Department...
                                     Örnek: bir Review'da hangi alanlar var, hangileri zorunlu
```

---

### `public/` — Web'e Açık Statik Dosyalar

Bu klasördeki her şey doğrudan URL ile erişilebilir.
Örnek: `public/logos/low_res.png` → `https://kampuskarne.com/logos/low_res.png`

```
public/
│
└── logos/
    └── low_res.png               ← KampusKarne logosu (düşük çözünürlük)
                                     Sitenin başlığında ve favicon yerine kullanılacak
```

---

### `supabase/` — Veritabanı Dosyaları

Supabase = projenin veritabanı ve auth sistemi. Bu klasördeki dosyalar veritabanı yapısını tanımlar.

```
supabase/
│
├── migrations/                   ← Veritabanı değişikliklerinin kaydı
│   └── .gitkeep                  ← Klasörü Git'te tutmak için boş dosya
│                                    İlk migration: tablo oluşturma SQL'i buraya gelecek
│
└── seed.sql                      ← Başlangıç verisi
                                     Geliştirme ortamına örnek hoca/ders/yorum ekler
```

---

### `e2e/` — Uçtan Uca Testler

E2E (End-to-End) test: Playwright ile gerçek bir tarayıcı açılıp site elle kullanılıyormuş gibi test edilir.

```
e2e/
│
└── example.spec.ts               ← Örnek test: ana sayfa açılıyor mu?
                                     Buraya 5 kritik senaryo yazılacak:
                                     kayıt, yorum yazma, arama, şikayet, admin paneli
```

---

### `data/` — Statik Veri Dosyaları

```
data/
│
└── ktu-instructors.md            ← KTÜ hoca ve ders listesi şablonu
                                     Araştırmacı bu dosyayı dolduracak
                                     Bora bunu Supabase'e aktaracak (seed.sql)
```

---

### `design/` — Tasarım Dosyaları

```
design/
│
├── README.md                     ← UI/UX sorumlusunun görev listesi ve kurallar
└── wireframes/                   ← Figma'dan export edilen ekran tasarımları
    └── .gitkeep                  ← Klasörü Git'te tutmak için boş dosya
```

---

### `raporlar/` — Proje Raporları

Ders için hazırlanan akademik raporlar. Web sitesinin parçası değil, sadece Git'te saklanır.

```
raporlar/
│
├── Mimari_Tasarim_Raporu.pdf
└── Software Engineering Gereksinim Analizi Raporu realone.pdf
```

---

### Kök Dizindeki Konfigürasyon Dosyaları

Projenin davranışını belirleyen ayar dosyaları. Bunların büyük çoğunluğuna dokunmak gerekmez.

| Dosya | Ne İşe Yarar | Dokunulur mu? |
|---|---|---|
| `.env.local.example` | Ortam değişkenleri şablonu. Supabase URL, API anahtarları vb. `.env.local` olarak kopyalanıp doldurulur. | Yeni değişken eklenince |
| `.gitignore` | Git'e eklenmeyecek dosyaların listesi. `.env.local`, `node_modules`, `.next` burada kayıtlı. | Gerekirse ekle |
| `.prettierrc` | Prettier kod formatlama ayarları. Tüm ekip aynı kod stilini kullanır (girinti, noktalı virgül vb.). | Nadiren |
| `CLAUDE.md` | Claude yapay zeka asistanına proje bağlamını anlatan dosya. Ekiple ilgisi yok. | Proje değişince |
| `components.json` | shadcn/ui kütüphanesinin ayar dosyası. `pnpm dlx shadcn add button` gibi komutlar bunu okur. | Dokunma |
| `eslint.config.mjs` | ESLint kod kalite kuralları. Hatalı kod yazıldığında editörde kırmızı uyarı gösterir. | Nadiren |
| `middleware.ts` | Sayfa erişim kontrolü. `/admin` sadece admin rolündeki kullanıcıya açılır. | Yeni korumalı sayfa eklenince |
| `next.config.ts` | Next.js framework ayarları. Şu an boş, ilerleyen aşamalarda görsel optimizasyon vb. eklenebilir. | Gerekince |
| `package.json` | Projenin bağımlılıkları ve komutları. `pnpm dev`, `pnpm test` gibi komutlar burada tanımlı. | Paket eklenince otomatik değişir |
| `playwright.config.ts` | Playwright E2E test ayarları. Testlerin hangi tarayıcıda, hangi URL'de çalışacağını tanımlar. | Nadiren |
| `pnpm-lock.yaml` | Her paketin tam sürümü. `pnpm install` tarafından otomatik oluşturulur. | Dokunma |
| `pnpm-workspace.yaml` | pnpm'e özgü derleme ayarları. `sharp` ve `unrs-resolver` uyarılarını susturur. | Dokunma |
| `postcss.config.mjs` | PostCSS ayarları. Tailwind CSS'in çalışması için zorunludur. | Dokunma |
| `tsconfig.json` | TypeScript ayarları. Hangi dosyalar derleneceği, hangi kurallar uygulanacağı. | Dokunma |
| `vitest.config.ts` | Vitest birim test ayarları. Test dosyalarının nerede olduğu, hangi ortamda çalışacağı. | Nadiren |
| `vitest.setup.ts` | Vitest başlangıç ayarları. `@testing-library/jest-dom` burada yüklenir. | Nadiren |

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
