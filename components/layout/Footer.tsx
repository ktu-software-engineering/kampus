"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const newSiteLogo = "/images/new_site_logo_1.png";

export function Footer() {
  const pathname = usePathname();
  
  // Admin sayfalarında Footer'ı gösterme
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative z-[10] bg-kk-blue-footer border-none pt-8 pb-7 px-8">
      <div className="max-w-full flex flex-col items-center gap-3">
        <Image
          src={newSiteLogo}
          alt="Site Logo"
          width={180}
          height={48}
          loading="eager"
          className="h-12 w-auto object-contain block"
        />
        <p className="text-[12px] text-kk-beige/55 m-0 tracking-[0.02em] font-sans text-center">
          © 2026 KampusKarne · Üniversite Değerlendirme Platformu · Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
