import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KampusKarne",
  description: "Türkiye'nin ilk üniversite ders ve eğitmen değerlendirme platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}