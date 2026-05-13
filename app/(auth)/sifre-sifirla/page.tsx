"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const passwordsMatch = confirm === "" || password === confirm;

  useEffect(() => {
    // Supabase linkteki token'ı otomatik işler, session kurar
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordsMatch || password.length < 8) return;
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Bir hata oluştu.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 3000);
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col bg-kk-beige-dark font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] relative overflow-x-hidden">
        <BackgroundTexture />
        <div className="relative z-10 flex flex-col flex-1 items-center justify-center p-4">
          <div className="w-full max-w-[440px] bg-white/90 backdrop-blur-[20px] rounded-[28px] p-12 border border-white/60 shadow-[0_20px_50px_rgba(29,58,82,0.12)] text-center">
            <div className="w-16 h-16 rounded-full bg-kk-blue flex items-center justify-center mx-auto mb-5">
              <Lock size={28} className="text-kk-gold" />
            </div>
            <h2 className="text-kk-blue text-[1.6rem] font-extrabold mb-2 tracking-tight">
              Şifre Güncellendi
            </h2>
            <p className="text-kk-text-muted text-[0.95rem] leading-relaxed">
              Şifren başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsun...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col bg-kk-beige-dark font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] relative overflow-x-hidden">
        <BackgroundTexture />
        <div className="relative z-10 flex flex-col flex-1 items-center justify-center p-4">
          <div className="w-full max-w-[440px] bg-white/90 backdrop-blur-[20px] rounded-[28px] p-12 border border-white/60 shadow-[0_20px_50px_rgba(29,58,82,0.12)] text-center">
            <p className="text-kk-text-muted text-[0.95rem]">Link doğrulanıyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-kk-beige-dark font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] relative overflow-x-hidden">
      <BackgroundTexture />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 flex items-center justify-center py-10 px-5">
          <div className="w-full max-w-[440px] bg-white/90 backdrop-blur-[20px] rounded-[28px] p-12 border border-white/60 shadow-[0_20px_50px_rgba(29,58,82,0.12)]">
            <div className="text-center mb-9">
              <h1 className="text-kk-blue text-[1.85rem] font-extrabold mb-2.5 tracking-tight">
                Yeni Şifre Belirle
              </h1>
              <p className="text-kk-text-muted text-[0.95rem] leading-relaxed">
                Hesabın için yeni bir şifre oluştur.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[0.85rem] rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-[0.85rem] font-semibold text-[#5c544d] ml-1">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9287]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="En az 8 karakter"
                    value={password}
                    maxLength={32}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-11 py-3.5 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] text-kk-blue text-[0.875rem] rounded-xl outline-none transition-all focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9a9287] hover:text-kk-blue transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password.length > 0 && password.length < 8 && (
                  <span className="text-[0.75rem] text-red-500 ml-1">En az 8 karakter olmalı.</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.85rem] font-semibold text-[#5c544d] ml-1">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9287]" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirm}
                    maxLength={32}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className={`w-full pl-11 pr-11 py-3.5 bg-[#f5f1ea] border-[1.5px] text-kk-blue text-[0.875rem] rounded-xl outline-none transition-all focus:ring-4 focus:ring-kk-blue-light/10 ${
                      passwordsMatch ? "border-[#e8e2d9] focus:border-kk-blue-light" : "border-red-500 focus:border-red-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9a9287] hover:text-kk-blue transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {!passwordsMatch && (
                  <span className="text-[0.75rem] text-red-500 ml-1">Şifreler eşleşmiyor.</span>
                )}
              </div>

              <Button
                variant="kk-login"
                size="unsized"
                type="submit"
                disabled={loading || !passwordsMatch || password.length < 8}
                className="w-full py-3.5 rounded-xl text-[0.95rem] font-bold shadow-[0_10px_25px_rgba(29,58,82,0.2)] mt-2 disabled:opacity-60"
              >
                {loading ? "Kaydediliyor..." : "Şifremi Güncelle"}
              </Button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
