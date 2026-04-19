# Tasarım Dosyaları

Bu klasör UI/UX tasarımına ait tüm materyalleri içerir.

## Klasör Yapısı

```
design/
├── README.md          → Bu dosya — tasarım rehberi
└── wireframes/        → Figma'dan export edilen ekran görüntüleri ve taslaklar
```

## UI/UX Sorumlusunun Görevleri

Aşağıdaki sayfaların Figma wireframe ve mockup'larını hazırla:

### Yapılacaklar (Öncelik Sırasıyla)

1. **Ana Sayfa (`/`)** — Arama kutusu, öne çıkan hocalar/dersler
2. **Kayıt (`/register`)** — E-posta, şifre, üniversite, bölüm seçimi
3. **Giriş (`/login`)** — E-posta + şifre formu
4. **Arama & Filtreleme (`/search`)** — Sol filtre paneli, sağda sonuçlar
5. **Hoca Profili (`/instructors/[id]`)** — Hoca bilgisi, dersler, yorumlar
6. **Ders Sayfası (`/courses/[id]`)** — Ortalama puanlar, yorum listesi, yorum formu
7. **Profesör Paneli (`/professor/dashboard`)** — Dersleri ve gelen yorumlar
8. **Admin Paneli (`/admin`)** — Hoca/ders yönetimi, şikayetler, öneriler
9. **Öneri Formu (`/suggest`)** — Hoca/ders önerisi

### Tasarım Kuralları

- **Mobile-first:** Her sayfa önce mobil için tasarlanacak
- **Renk paleti:** Henüz belirlenmedi — sen belirleyeceksin
- **Bileşen kütüphanesi:** shadcn/ui kullanılıyor — tasarımını buna uyumlu yap
- **İkon:** Lucide React — ikonlar buradan seçilecek (lucide.dev)
- **Tipografi:** Henüz belirlenmedi — sen belirleyeceksin

### Önemli UI Notları

- Tüm yorumlar anonim görünür — "Anonim Öğrenci" etiketi kullanılacak
- Yıldız puanlama (1-5) interaktif olacak — örnek: Reddit/RateMyProfessors'dan ilham al
- Footer'da şu yazı **zorunlu**: _"Bu platform KTÜ ile resmi bağlantısı olmayan bağımsız bir öğrenci inisiyatifidir"_
- Hoca fotoğrafı hiçbir yerde olmayacak

### Wireframe Teslim Formatı

Figma dosyasının bağlantısını bu README'ye ekle.  
Ekrana göre export edilen görselleri `wireframes/` klasörüne koy.
