"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration hatasını önlemek için bileşenin yüklendiğinden emin oluyoruz
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = async (e: React.MouseEvent) => {
    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    // Tarayıcı View Transitions API desteklemiyorsa normal değiştir (Örn: Eski Firefox'lar)
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Tıklanan noktanın (butonun) X ve Y koordinatlarını al
    const x = e.clientX;
    const y = e.clientY;
    
    // Tıklanan noktadan ekranın en uzak köşesine olan yarıçapı hesapla
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Temayı değiştiren View Transition'ı başlat
    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    // Tema değiştikten hemen sonra CSS clip-path (daire kırpma) animasyonunu tetikle
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500, // Yayılma hızı (milisaniye)
          easing: "ease-in-out",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-8 z-50 p-3 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all group"
      aria-label="Temayı Değiştir"
    >
      {resolvedTheme === "dark" ? (
        <Sun size={22} className="text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
      ) : (
        <Moon size={22} className="text-[#112a46] group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
}