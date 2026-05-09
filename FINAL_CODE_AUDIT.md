KampusKarne Sistem ve Mimari Dokümantasyonu

  Bu döküman, KampusKarne projesinin mevcut mimarisini, bileşen yapısını, renk sistemini ve çalışma mantığını detaylandırmaktadır.

     1. Merkezi Renk ve Stil Sistemi (Tailwind CSS)

  Projede hardcoded HEX renkler yerine, app/globals.css dosyasında tanımlanmış merkezi Tailwind CSS değişkenleri kullanılmaktadır. Bu
  sayede sitenin tüm renk teması tek bir noktadan yönetilmektedir.

  Ana Renk Değişkenleri (globals.css):
   * --color-kk-blue (#06283a): Birincil (Primary) lacivert renk. Başlıklar, ikonlar ve "Giriş Yap" butonu gibi önemli eylemlerde
     kullanılır.
   * --color-kk-blue-light (#006392): İkincil (Secondary) açık lacivert. Hover efektlerinde ve vurgularda kullanılır.
   * --color-kk-blue-footer (#0e4a6b): Footer'ın özel koyu mavi arka plan rengi.
   * --color-kk-beige (#F6F1E7): Ana sayfa ve genel arka planlar için premium bej rengi.
   * --color-kk-beige-dark (#edeae2): Auth (Login/Register) sayfalarında kontrast yaratmak için kullanılan koyu bej arka plan.
   * --color-kk-gold (#C8941A): Yıldız derecelendirmelerinde ve özel vurgularda kullanılan altın sarısı.
   * --color-kk-text (#2a2520): Standart gövde metni (body text) rengi.
   * --color-kk-text-muted (#6b6356): Alt başlıklar ve pasif metinler için soluk gri/kahve rengi.

  Karanlık Mod (Dark Mode):
   * Sistemde next-themes tabanlı bir karanlık mod altyapısı mevcuttur.
   * Ancak kullanıcı arayüzlerinde (Home, Settings, Auth) karanlık mod kapatılmıştır.
   * Karanlık mod (.dark sınıfları) yalnızca /admin (Yönetici Paneli) rotaları altında aktiftir.

  ---

     2. Merkezi Bileşenler (Components)

  Navbar.tsx (components/layout/Navbar.tsx)
   * Kullanım Yeri: Ana sayfa, Login, Register ve Settings sayfalarında en üstte kullanılır.
   * Çalışma Mantığı:
       * Mobil duyarlıdır; ekran küçüldüğünde hamburger menüye dönüşür ve soldan kayarak açılan bir menü paneli sunar.
       * usePathname (Next.js router) kullanarak kullanıcının hangi sayfada olduğunu algılar.
       * Eğer kullanıcı /login sayfasındaysa üstteki "Giriş Yap" butonunu gizler. /register sayfasındaysa "Kaydol" butonunu gizler.
       * Auth sayfalarında, o sayfada gösterilen tek butonun (örn: Login'deyken Kaydol butonu) rengini belirginleştirmek için dinamik
         olarak kk-login (lacivert) varyantına geçer.

  Footer.tsx (components/layout/Footer.tsx)
   * Kullanım Yeri: Ana sayfa, Auth ve Settings sayfalarının en altında yer alır.
   * Çalışma Mantığı:
       * Sayfa alt kısımlarındaki arka plan dokularının (BackgroundTexture) üstünde durmasını garanti etmek için relative z-[10]
         katmanında çalışır.
       * usePathname ile adresi kontrol eder; eğer rota /admin ile başlıyorsa kendi kendini imha eder (return null), böylece admin
         panelinin özel yapısını bozmaz.

  BackgroundTexture.tsx (components/layout/BackgroundTexture.tsx)
   * Kullanım Yeri: Tüm kullanıcı arayüzü sayfalarının arka planı.
   * Çalışma Mantığı:
       * fixed inset-0 z-0 özellikleriyle sayfanın en arka katmanına yerleşir.
       * İçerisinde Tailwind arbitrary değerleriyle yazılmış karmaşık repeating-linear-gradient ve radial-gradient kodları bulunur.
       * Sayfaya çapraz çizgiler ve maskeli parlaklık efektleri vererek "premium" dokuyu sağlar.

  button.tsx (components/ui/button.tsx)
   * İşlev: Projenin tek tuş (button) fabrikasıdır. class-variance-authority (cva) kullanılarak oluşturulmuştur.
   * Varyantlar: Hardcoded renkler yerine merkezi renk sistemini kullanır. Örneğin kk-login varyantı doğrudan bg-kk-blue text-kk-beige
     sınıflarını çağırır.

  ---

     3. Sayfa Hiyerarşisi ve Çalışma Mantığı

     Kullanıcı Arayüzü (Ana Sayfa)
   * app/page.tsx: Projenin vitrinidir. Sayfa yapısı modülerdir:
       * En altta BackgroundTexture yatar.
       * Hemen üstünde şeffaf geçişli hero görseli (unnamed.jpg) bulunur.
       * Statik listeler (Trend hocalar, son incelemeler) kod kalabalığı yaratmaması için data/mock-data.ts dosyasından çekilerek
         haritalandırılır (.map()).
       * Logolar, performans için next/image bileşeni ve loading="eager" (tembel yükleme iptali) ile sayfa açılır açılmaz anında
         ekrana basılır.

     Kimlik Doğrulama (login ve register)
   * Yerleşim (Layout): Bu sayfalar flex flex-col min-h-screen yapısındadır. Bu esnek yapı sayesinde sayfa içeriği ortalanır ancak
     Footer her zaman ekranın en altında sabit kalır.
   * Validasyon: Özellikle register/page.tsx içinde şifre zorluğu kontrol eden mini bir bar algoritması (PasswordStrength) çalışır.
     Her iki formda da şifre inputlarına maksimum sınır (maxLength={32}) konulmuştur.

     Ayarlar (settings)
   * app/settings/layout.tsx: Ayarlar bölümünün kendi özel bir alt-layout'u vardır.
       * En üstte ana Navbar, en altta ana Footer bulunur.
       * Orta kısım, sol tarafta bir dolaşım menüsü (Sidebar) ve sağ tarafta değişen içerik (children) olmak üzere iki sütuna ayrılır.
   * Renkler: Sadece Tailwind'in merkezi kk-blue ve kk-beige renk varyasyonlarını kullanarak ana sayfa hissini korur.

     Yönetici Paneli (admin)
   * app/admin/layout.tsx: Kullanıcı arayüzünden tamamen bağımsızdır. Navbar ve Footer kullanmaz.
       * Sol tarafta sabit, koyu temalı bir Sidebar menüsü bulunur.
       * Tasarımda kampus-navy, kampus-gold gibi admin paneline özel tanımlanmış (globals.css içinde) renk paletleri ile sistemin
         merkezi renkleri (kk-blue) harmanlanmıştır.
   * Karanlık Mod Entegrasyonu: ThemeToggle butonu sadece admin panelinin sidebar'ında bulunur ve aktif edildiğinde sadece bu panelin
     tasarımını (dark:bg-zinc-900 vb. class'larla) siyah temaya çevirir.
   * TypeScript Kalitesi: Veri tablolarında (örneğin kullanıcı listesindeki rol bazlı renkli etiketler - RoleBadge) any tipleri
     kullanılmaz, kesin tipler (strict typing) ile çalışır.