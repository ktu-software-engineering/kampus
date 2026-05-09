"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  variant?: "fixed" | "inline";
}

export default function ThemeToggle({ variant = "fixed" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration hatasını önlemek için bileşenin yüklendiğinden emin oluyoruz
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = async (e: React.MouseEvent) => {
    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

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
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  };

  if (variant === "inline") {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 dark:text-zinc-400 hover:text-kk-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 rounded font-medium transition-colors group"
        aria-label="Temayı Değiştir"
      >
        {resolvedTheme === "dark" ? (
          <>
            <Sun size={20} className="text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
            <span>Açık Mod</span>
          </>
        ) : (
          <>
            <Moon size={20} className="text-kk-blue dark:text-slate-400 group-hover:-rotate-12 transition-transform duration-500" />
            <span>Koyu Mod</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-8 z-50 p-3 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all group"
      aria-label="Temayı Değiştir"
    >
      {resolvedTheme === "dark" ? (
        <Sun size={22} className="text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
      ) : (
        <Moon size={22} className="text-kk-blue group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
}
