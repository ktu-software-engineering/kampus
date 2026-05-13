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
    default: "KampusKarne",
    template: "%s | KampusKarne",
  },
  description: "Üniversite öğrencilerinin hocaları ve dersleri anonim olarak değerlendirebildiği platform. Gerçek yorumlarla hocaları keşfet, bilinçli tercih yap.",
  keywords: ["hoca değerlendirme", "üniversite", "kampus", "akademisyen", "ders", "yorum", "KTÜ"],
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
    title: "KampusKarne — Hocaları Değerlendir, Fark Yarat",
    description: "Üniversite öğrencilerinin hocaları ve dersleri anonim olarak değerlendirebildiği platform.",
    images: [
      {
        url: "/images/site_logo-1.png",
        width: 1200,
        height: 630,
        alt: "KampusKarne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KampusKarne — Hocaları Değerlendir, Fark Yarat",
    description: "Üniversite öğrencilerinin hocaları ve dersleri anonim olarak değerlendirebildiği platform.",
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
