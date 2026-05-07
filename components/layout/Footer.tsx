"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Admin sayfalarında Footer'ı gösterme
  if (pathname?.startsWith("/admin")) return null;

  return (
    // mt-auto class'ı footer'ın her zaman sayfanın en altında kalmasını sağlar
    <footer className="w-full bg-kampus-navy mt-auto py-8 px-8 md:px-16 text-white/80">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Sol Kısım: Logo veya İsim */}
        <div className="flex items-center gap-3">
           <span className="font-semibold text-lg text-white">KampüsKarne</span>
        </div>

        {/* Sağ Kısım: Telif hakkı ve Buton */}
        <div className="flex items-center gap-6 text-sm">
          <span>© 2026 KampüsKarne - Üniversite Değerlendirme Platformu</span>
          <button className="flex items-center gap-2 border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors">
            {/* Buraya Lucide-React'ten Flag veya MessageSquare ikonu koyabilirsin */}
            Geri Bildirim
          </button>
        </div>
      </div>
    </footer>
  );
}