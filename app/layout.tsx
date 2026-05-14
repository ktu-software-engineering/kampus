import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const BASE_URL = "https://kampuskarne.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "KampusKarne — Hoca Değerlendirme Platformu",
    template: "%s | KampusKarne",
  },
  description: "KampusKarne (Kampus Karne) — Hocaları değerlendir, fark yarat. Üniversite öğrencileri için Türkiye'nin en kapsamlı hoca değerlendirme platformu. KTÜ başta olmak üzere tüm üniversitelerin hocalarını anonim değerlendir, yorum oku, bilinçli ders seç.",
  keywords: [
    // Marka aramaları
    "kampus karne", "kampuskarne", "kampus karne nedir",
    // Hoca aramaları
    "hoca değerlendir", "hoca değerlendirme", "hoca yorumları", "hoca puanla",
    "hoca yorum sitesi", "hoca değerlendirme sitesi",
    "hocam nasıl", "hoca nasıl", "iyi hoca",
    // KTÜ özelinde
    "ktu hoca değerlendir", "ktu hoca yorumları", "ktu hoca",
    "karadeniz teknik üniversitesi hoca", "ktu akademisyen",
    // Genel üniversite
    "üniversite hoca değerlendirme", "üniversite hoca yorumları",
    "akademisyen değerlendirme", "öğretim üyesi değerlendirme",
    "öğrenci yorumları hoca", "ders değerlendirme",
    // Eylem aramaları
    "hoca ara", "hoca bul", "hangi hoca iyi",
    "zor hoca", "kolay hoca", "ders seç",
  ],
  authors: [{ name: "KampusKarne" }],
  creator: "KampusKarne",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: BASE_URL,
    siteName: "KampusKarne",
    title: "KampusKarne — Hoca Değerlendirme Platformu | Kampus Karne",
    description: "Türkiye'nin hoca değerlendirme platformu. KTÜ ve tüm üniversitelerin hocalarını anonim değerlendir, gerçek öğrenci yorumlarını oku.",
    images: [{ url: "/images/site_logo-1.png", width: 1200, height: 630, alt: "KampusKarne — Hoca Değerlendirme" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KampusKarne — Hoca Değerlendirme Platformu",
    description: "Türkiye'nin hoca değerlendirme platformu. KTÜ ve tüm üniversitelerin hocalarını anonim değerlendir.",
    images: ["/images/site_logo-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data — Google sitelinks ve arama kutusu için */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", "@id": BASE_URL + "/#website", "url": BASE_URL, "name": "KampusKarne",
              "alternateName": ["Kampus Karne", "kampus karne"],
              "inLanguage": "tr-TR",
              "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": BASE_URL + "/hocalar?q={search_term_string}" }, "query-input": "required name=search_term_string" } },
            { "@type": "Organization", "@id": BASE_URL + "/#org", "name": "KampusKarne", "url": BASE_URL, "logo": { "@type": "ImageObject", "url": BASE_URL + "/images/site_logo-1.png" } }
          ]
        }) }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
