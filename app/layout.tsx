import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

// 1. Header ve Footer'ı içeri aktarıyoruz
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
    <html lang="tr" suppressHydrationWarning>
      <body className="bg-kampus-bg text-kampus-navy min-h-screen flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {/* 2. Sitenin üst kısmı */}
          <Header />
          
          {/* 3. Ana İçerik (Esnek yapıyoruz ki footer hep en altta kalsın) */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          
          {/* 4. Sitenin alt kısmı */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}