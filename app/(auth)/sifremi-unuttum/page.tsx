"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Bir hata oluştu.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-kk-beige-dark font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] relative overflow-x-hidden">
        <BackgroundTexture />
        <div className="relative z-10 flex flex-col flex-1 items-center justify-center p-4">
          <div className="w-full max-w-[440px] bg-white/90 backdrop-blur-[20px] rounded-[28px] p-12 border border-white/60 shadow-[0_20px_50px_rgba(29,58,82,0.12)] text-center">
            <div className="w-16 h-16 rounded-full bg-kk-blue flex items-center justify-center mx-auto mb-5">
              <Mail size={28} className="text-kk-gold" />
            </div>
            <h2 className="text-kk-blue text-[1.6rem] font-extrabold mb-2 tracking-tight">
              Mail Gönderildi
            </h2>
            <p className="text-kk-text-muted text-[0.95rem] leading-relaxed mb-8">
              <span className="text-kk-blue font-semibold">{email}</span> adresine şifre sıfırlama linki gönderdik. Gelen kutunu kontrol et.
            </p>
            <Button
              onClick={() => router.push("/login")}
              variant="kk-login"
              size="unsized"
              className="w-full py-3.5 rounded-xl text-[0.9rem] font-bold"
            >
              Giriş Sayfasına Dön
            </Button>
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
                Şifremi Unuttum
              </h1>
              <p className="text-kk-text-muted text-[0.95rem] leading-relaxed">
                Kayıtlı e-posta adresini gir, sana şifre sıfırlama linki gönderelim.
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
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9287]" />
                  <input
                    type="email"
                    placeholder="ogrenciNo@ogr.ktu.edu.tr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-3.5 py-3.5 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] text-kk-blue text-[0.875rem] rounded-xl outline-none transition-all focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10"
                  />
                </div>
              </div>

              <Button
                variant="kk-login"
                size="unsized"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-[0.95rem] font-bold shadow-[0_10px_25px_rgba(29,58,82,0.2)] mt-2 disabled:opacity-60"
              >
                {loading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-1.5 text-[0.88rem] text-kk-text-muted hover:text-kk-blue transition-colors mx-auto"
              >
                <ArrowLeft size={15} />
                Giriş sayfasına dön
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
