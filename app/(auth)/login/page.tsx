"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-kk-beige-dark font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] relative overflow-x-hidden">
      <BackgroundTexture />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 flex items-center justify-center py-10 px-5">
          <div className="w-full max-w-[440px] bg-white/90 backdrop-blur-[20px] rounded-[28px] p-12 border border-white/60 shadow-[0_20px_50px_rgba(29,58,82,0.12)]">
            <div className="text-center mb-9">
              <h1 className="text-kk-blue text-[1.85rem] font-extrabold mb-2.5 tracking-tight">
                Tekrar Hoş Geldin
              </h1>
              <p className="text-kk-text-muted text-[0.95rem] leading-relaxed">
                KampusKarne hesabına giriş yaparak değerlendirmelerine devam et.
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[0.85rem] font-semibold text-[#5c544d] ml-1">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9287]" />
                  <input
                    type="email"
                    placeholder="name@example.edu.tr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-3.5 py-3.5 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] text-kk-blue text-[0.875rem] rounded-xl outline-none transition-all focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.85rem] font-semibold text-[#5c544d] ml-1">
                  Şifre
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9287]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    maxLength={32}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-11 py-3.5 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] text-kk-blue text-[0.875rem] rounded-xl outline-none transition-all focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9a9287] hover:text-kk-blue transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[0.82rem]">
                <label className="flex items-center gap-2 cursor-pointer text-kk-text-muted">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 accent-kk-blue-light cursor-pointer"
                  />
                  Beni Hatırla
                </label>
                <span className="text-kk-blue-light font-semibold cursor-pointer hover:opacity-70 transition-opacity">
                  Şifremi Unuttum
                </span>
              </div>

              <Button
                variant="kk-login"
                size="unsized"
                type="submit"
                className="w-full py-3.5 rounded-xl text-[0.95rem] font-bold shadow-[0_10px_25px_rgba(29,58,82,0.2)] mt-2.5"
              >
                Giriş Yap
              </Button>
            </form>

            <div className="mt-8 text-center text-[0.9rem] text-kk-text-muted">
              Henüz hesabın yok mu?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-kk-blue-light font-bold cursor-pointer border-b-[1.5px] border-kk-blue-light/20 pb-0.5 hover:border-kk-blue-light transition-colors"
              >
                Hemen Kaydol
              </span>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        @media (max-width: 480px) {
          main { padding: 20px 16px !important; }
          .w-full.max-w-\[440px\] { padding: 36px 24px !important; }
        }
      `}</style>
    </div>
  );
}
