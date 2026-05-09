"use client";

import React from "react";
import Image from "next/image";

const newSiteLogo = "/images/new_site_logo_1.png";

export function Footer() {
  return (
    <footer className="relative z-[10] bg-kk-blue-footer border-none pt-8 pb-7 pr-8 pl-2">
      <div className="kk-footer-inner max-w-full m-0 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-[10px]">
          <Image
            src={newSiteLogo}
            alt="Site Logo"
            width={180}
            height={48}
            loading="eager"
            className="h-12 w-auto object-contain block"
          />
        </div>
        <p className="text-[12px] text-kk-beige/55 m-0 tracking-[0.02em] font-sans">
          © 2026 KampusKarne · Üniversite Değerlendirme Platformu · Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
