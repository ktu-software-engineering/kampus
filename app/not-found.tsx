import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-kk-beige relative overflow-x-hidden font-sans">
      <BackgroundTexture />
      <Navbar />

      <main className="flex-grow relative z-10 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Büyük 404 */}
          <div
            className="display-serif text-[120px] md:text-[160px] font-bold leading-none mb-4 select-none"
            style={{
              background: "linear-gradient(135deg, #06283a 0%, #006392 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </div>

          <h1 className="text-2xl font-extrabold text-kk-blue mb-3 tracking-tight">
            Sayfa Bulunamadı
          </h1>
          <p className="text-kk-text-muted leading-relaxed mb-8 text-[0.95rem]">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#06283a" }}
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/hocalar"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-kk-blue text-sm border-[1.5px] border-kk-blue/20 hover:border-kk-blue/40 transition-all bg-white/60"
            >
              Hocaları Keşfet
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
