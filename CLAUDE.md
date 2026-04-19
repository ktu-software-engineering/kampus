# KampusKarne — Proje Rehberi

## Proje Nedir

KampusKarne, Türkiye'deki üniversite öğrencilerinin hocaları ve dersleri anonim olarak değerlendirebildiği bir web platformudur. RateMyProfessor'dan ilham alınmış, Türkiye'ye özgü ihtiyaçlar (KVKK, Türkçe arayüz, .edu.tr doğrulaması) gözetilerek tasarlanmıştır.

MVP olarak KTÜ (Karadeniz Teknik Üniversitesi) ile başlanmakta, ilerleyen sürümlerde tüm Türkiye'ye açılması hedeflenmektedir.

**Platform bağımsızdır — hiçbir üniversiteyle resmi bağlantısı yoktur.**

---

## Commit ve GitHub Kuralları

- Commit atmadan önce **her zaman kullanıcıya commit mesajını sor**. Mesajı kullanıcı belirler.
- Kullanıcının verdiği mesajı **olduğu gibi kullan** — değiştirme, yeniden yaz veya "iyileştir" deme.
- Mesajı Conventional Commits biçimine (feat:, fix:, docs: vb.) yakın tut ama bunu kullanıcı söylemedikçe zorla uygulatma.
- `git commit` komutunda `Co-Authored-By`, `co-authored-by`, `Claude`, `Anthropic`, `AI`, `claude-code` veya benzeri herhangi bir AI referansı **kesinlikle yer almamalıdır**.
- Git config'de yazar adı ve e-postası kullanıcının kendi bilgileridir — değiştirme.
- GitHub'a push edilecek her şeyde AI kullanıldığını belli edecek hiçbir iz bırakma.

---

## Projenin Amacı

- Öğrenciler ders seçimini veri odaklı yapabilsin (kulaktan dolma yerine)
- WhatsApp gruplarında kaybolan sınav ve ders tecrübeleri kalıcı hale gelsin
- Üniversite tercihi yapanlar bölüm/üniversite karşılaştırması yapabilsin
- Profesörler kendi derslerine gelen anonim geri bildirimleri görebilsin
- Tüm bunlar KVKK'ya uyumlu ve güvenli bir altyapıda çalışsın

---

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|---|---|---|
| Frontend | Next.js | 16 (App Router) |
| Dil | TypeScript | 5.x |
| UI | React | 19 |
| Stil | Tailwind CSS | 4 |
| Bileşenler | shadcn/ui | latest |
| Backend | Supabase | 2.x (PostgreSQL + Auth + RLS) |
| Hosting | Vercel | latest |
| E-posta | Resend | (Supabase custom SMTP, ücretsiz: 3.000 mail/ay) |
| Test (birim) | Vitest | 4.x |
| Test (E2E) | Playwright | 1.x |
| Form validasyon | Zod | 4.x |
| URL state | nuqs | 2.x |
| Grafikler | Recharts | 3.x |
| İkonlar | Lucide React | latest |
| Tema | next-themes | latest |
| Paket yöneticisi | pnpm | 10.x |

---

## Mimari

3 katmanlı web mimarisi:

```
Browser
  → Next.js 16 (App Router + TypeScript)   [Sunum katmanı]
  → Next.js API Routes + Middleware         [Uygulama katmanı]
  → Supabase (PostgreSQL + Auth + RLS)      [Veri katmanı]
  → Vercel (hosting + CDN + otomatik ölçekleme)
```

### Ölçeklenebilirlik

- **Vercel** otomatik yatay ölçekleme yapar — trafik artışında manuel müdahale gerekmez
- **Supabase** bağlantı havuzu (connection pooling) ile yüksek eşzamanlı kullanıcı yükünü kaldırır
- **Next.js Server Components** ile gereksiz istemci yükü azaltılır
- Sık okunan veriler (hoca/ders profilleri) ISR ile önbelleğe alınabilir
- Yeni üniversite eklemek için şema değişmez — `universities` tablosuna satır eklenir

---

## Kimlik Doğrulama

- Sadece `.edu.tr` uzantılı e-posta kabul edilir
- Supabase Auth — JWT tabanlı (access token: 1 saat, refresh token: kalıcı)
- Token'lar httpOnly cookie'de saklanır
- 5 başarısız girişte 15 dakika hesap kilidi (brute-force koruması)
- Kayıt sonrası e-posta doğrulaması zorunlu (Resend üzerinden)

### Roller

| Rol | Yetki |
|---|---|
| `student` | Yorum yaz, upvote yap, şikayet et, öneri gönder |
| `professor` | Kendi derslerini ve anonim yorumları gör (yorum yazamaz) |
| `moderator` | Şikayetleri incele, içerik kaldır |
| `admin` | Moderatör yetkileri + KVKK silme, kullanıcı yönetimi |

---

## Anonimlik Kuralı

Tüm yorumlar platformda anonim görünür — kullanıcının seçeneği yoktur.
`user_id` veritabanında saklanır; yalnızca adminler görebilir (yasal gereklilik: TCK 125).
`professor` rolündeki kullanıcılar kendi derslerinin yorumlarını okuyabilir ama kim yazdığını asla göremez.

---

## Güvenlik

### API Anahtarları ve Ortam Değişkenleri

- Tüm gizli anahtarlar `.env.local` dosyasında tutulur — bu dosya `.gitignore`'da kayıtlıdır, asla repoya eklenmez
- Production'da Vercel Environment Variables kullanılır
- `NEXT_PUBLIC_` prefix'i olmayan anahtarlar sunucu tarafında kalır — istemciye asla gönderilmez
- `SUPABASE_SERVICE_ROLE_KEY` yalnızca `lib/supabase/server.ts` üzerinden kullanılır
- Kod tabanında veya commit geçmişinde hiçbir zaman açık anahtar, token veya şifre bırakılmamalıdır
- `.env.local.example` dosyası şablon olarak repodadır — gerçek değerleri içermez

### Veritabanı Güvenliği

- Row Level Security (RLS): Her kullanıcı yalnızca kendi verisine yazabilir
- RBAC: `/admin` → moderator+, `/professor/dashboard` → professor+
- SQL injection: Supabase SDK parametrik sorgular kullanır, ham SQL yazmaktan kaçın
- 3+ şikayet alan yorum otomatik gizlenir (`is_hidden = true`)

### Diğer

- Şifreler Supabase Auth tarafından bcrypt ile hashlenir — plain-text asla saklanmaz
- Hoca fotoğrafı barındırılmaz (KVKK ihlali riski)
- Anonim yorum sahipliği API yanıtlarında asla dönmez

---

## Veritabanı Şeması (Özet)

```
universities    → id, name
departments     → id, university_id, name
instructors     → id, full_name, title, department_id (nullable), is_active
courses         → id, code, name, instructor_id, department_id, term
                  (hoca ve dersin department_id'si farklı olabilir — çapraz bölüm desteği)
users           → id, email (.edu.tr), full_name, university_id, department_id,
                  role, is_verified, failed_login_count, locked_until
reviews         → id, user_id, course_id, instructor_id,
                  teaching_quality (1-5), course_difficulty (1-5),
                  exam_difficulty (1-5), attendance_required (bool),
                  comment (max 500), is_hidden
                  UNIQUE(user_id, course_id) — aynı derse 1 yorum
review_upvotes  → review_id, user_id  UNIQUE(review_id, user_id)
reports         → review_id, reported_by, reason, status (pending|reviewed|removed)
suggestions     → type (instructor|course), data (jsonb), suggested_by,
                  vote_count, status (pending|approved|rejected)
```

---

## Sayfa Yapısı

```
/                        Ana sayfa — arama + öne çıkanlar
/login                   Giriş
/register                Kayıt (.edu.tr kontrolü)
/search                  Arama + filtreleme (nuqs ile URL state)
/instructors/[id]        Hoca profili — dersler ve yorumlar
/courses/[id]            Ders sayfası — ortalama puanlar + yorum listesi + form
/suggest                 Öneri formu
/professor/dashboard     Profesör paneli (korumalı)
/admin                   Admin paneli (korumalı)
/admin/instructors       Hoca yönetimi
/admin/courses           Ders yönetimi
/admin/suggestions       Öneri kuyruğu
/admin/reports           Şikayet kuyruğu
```

---

## Değerlendirme Kriterleri

Her yorum şunları içerir:
- Anlatım kalitesi: 1-5
- Ders zorluğu: 1-5
- Sınav zorluğu: 1-5
- Katılım zorunlu mu: evet/hayır
- Yorum metni: maksimum 500 karakter

---

## Kodlama Standartları

- **Dosya adları:** Sayfalar kebab-case, bileşenler PascalCase, yardımcılar camelCase
- **Bileşenler:** Server Component (veri çekme) ve Client Component (etkileşim) olarak ayrıştır
- **API routes:** `/app/api/*` altında — her route kendi dosyasında
- **Tip güvenliği:** `types/index.ts` kullan — `any` kullanmaktan kaçın
- **Supabase:** İstemci tarafı için `lib/supabase/client.ts`, sunucu tarafı için `lib/supabase/server.ts`
- **Validasyon:** Zod ile — kullanıcı girdisi her zaman doğrulanmalı

---

## Git Stratejisi

```
main     → production
dev      → entegrasyon
feature/ → yeni özellikler
fix/     → hata düzeltmeleri
```

- `main`'e direkt push yasaktır
- PR → `dev` branch'ine hedeflenir
- En az 1 reviewer zorunlu

---

## KVKK ve Yasal

- Footer'da zorunlu: *"Bu platform KTÜ ile resmi bağlantısı olmayan bağımsız bir öğrenci inisiyatifidir"*
- Veri silme talebi: 30 gün içinde işleme alınır
- Şikayet SLA: 48 saat
- Hoca profili `is_active = false` ile gizlenebilir

---

## MVP Dışı (2. Aşama)

- Forum / chat odası (her derse özel tartışma)
- Çoklu üniversite desteği
- Gelişmiş istatistik ve karşılaştırma sayfaları
- Mobil uygulama (Capacitor veya React Native)
- Bildirim sistemi
