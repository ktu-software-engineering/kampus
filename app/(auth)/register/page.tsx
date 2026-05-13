"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Mail, Lock, Building2, ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { createClient } from "@/lib/supabase/client";
import { LegalModal } from "@/components/ui/LegalModal";
import confetti from "canvas-confetti";

interface University {
  id: string;
  name: string;
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["Çok Zayıf", "Zayıf", "Orta", "İyi", "Güçlü"];
  const colors = ["#ef4444", "#f97316", "#eab308", "#3b82f6", "#1d3a52"];
  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? "" : "bg-[#e2ddd6]"}`} style={{ backgroundColor: i < score ? colors[score] : undefined }} />
        ))}
      </div>
      <span className="text-[0.72rem] font-semibold tracking-wider" style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", university_id: "", password: "", confirm: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("universities").select("id, name").order("name").then(({ data }) => {
      if (data) setUniversities(data);
    });
  }, []);

  const passwordsMatch = form.confirm === "" || form.password === form.confirm;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "email") {
      setEmailError("");
    }
  };

  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !agreed || emailError) return;
    setLoading(true);
    setServerError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        university_id: form.university_id,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setServerError(data.error ?? "Kayıt sırasında hata oluştu.");
      return;
    }

    setSubmitted(true);

    // Konfeti — sitenin renkleriyle
    const colors = ["#06283a", "#C8941A", "#006392", "#f0c875", "#0e4a6b"];
    const burst = () => {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.55 }, colors, scalar: 1.1 });
      confetti({ particleCount: 40, spread: 120, origin: { y: 0.55 }, angle: 60, colors, scalar: 0.9 });
      confetti({ particleCount: 40, spread: 120, origin: { y: 0.55 }, angle: 120, colors, scalar: 0.9 });
    };
    burst();
    setTimeout(burst, 400);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-kk-beige-dark relative overflow-x-hidden font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
        <BackgroundTexture />
        <div className="relative z-10 flex flex-col min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-[440px] bg-white rounded-3xl p-12 text-center shadow-[0_4px_40px_rgba(29,58,82,0.08)] border border-[#e8e2d9]">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-kk-blue">
              <Check size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-kk-blue text-[1.6rem] font-extrabold mb-2 tracking-tight">Kaydın Tamamlandı!</h2>
            <p className="text-kk-text-muted text-[0.95rem] leading-relaxed mb-8">
              Hoş geldin, <span className="text-kk-blue font-bold">{form.firstName}</span>! E-posta adresine bir doğrulama linki gönderdik. Linke tıkladıktan sonra giriş yapabilirsin.
            </p>
            <Button
              onClick={() => router.push("/")}
              variant="kk-login"
              size="unsized"
              className="w-full py-3.5 rounded-xl text-[0.9rem] font-bold"
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen flex flex-col bg-kk-beige-dark font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] relative overflow-x-hidden">
      <BackgroundTexture />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 flex items-center justify-center py-10 px-4">
          <div className="w-full max-w-[560px] bg-white/90 backdrop-blur-[20px] rounded-[28px] p-10 shadow-[0_20px_50px_rgba(29,58,82,0.12)] border border-white/60">
            <div className="text-center mb-8">
              <h1 className="text-kk-blue text-[1.75rem] font-extrabold mb-2 tracking-tight">Hesap Oluştur</h1>
              <p className="text-kk-text-muted text-[0.92rem] leading-relaxed">KampusKarne topluluğuna katıl ve akademiye katkıda bulun.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[0.85rem] rounded-xl px-4 py-3">
                  {serverError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.82rem] font-semibold text-[#5c544d] ml-1">Ad</label>
                  <div className="relative">
                    <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9287]" />
                    <input
                      name="firstName"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-3 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] text-kk-blue text-[0.875rem] rounded-xl outline-none focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10 transition-all"
                      placeholder="Ahmet"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.82rem] font-semibold text-[#5c544d] ml-1">Soyad</label>
                  <input
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-3 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] text-kk-blue text-[0.875rem] rounded-xl outline-none focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10 transition-all"
                    placeholder="Yılmaz"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.82rem] font-semibold text-[#5c544d] ml-1">Üniversite</label>
                <div className="relative">
                  <Building2 size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9287] pointer-events-none" />
                  <select
                    name="university_id"
                    required
                    value={form.university_id}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] text-kk-blue text-[0.875rem] rounded-xl outline-none appearance-none cursor-pointer focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10 transition-all"
                  >
                    <option value="" disabled>Üniversiteni Seç</option>
                    {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                  <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a9287] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.82rem] font-semibold text-[#5c544d] ml-1">E-posta</label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9287]" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3.5 py-3 bg-[#f5f1ea] border-[1.5px] text-kk-blue text-[0.875rem] rounded-xl outline-none transition-all focus:ring-4 focus:ring-kk-blue-light/10 ${
                      emailError ? "border-red-500 focus:border-red-500" : "border-[#e8e2d9] focus:border-kk-blue-light"
                    }`}
                    placeholder="ornek@universite.edu.tr"
                  />
                </div>
                {emailError && <span className="text-[0.75rem] text-red-500 ml-1">{emailError}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.82rem] font-semibold text-[#5c544d] ml-1">Şifre</label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9287]" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      maxLength={32}
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] text-kk-blue text-[0.875rem] rounded-xl outline-none focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10 transition-all"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#9a9287] hover:text-kk-blue transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.82rem] font-semibold text-[#5c544d] ml-1">Şifre Tekrar</label>
                  <div className="relative">
                    <input
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      required
                      maxLength={32}
                      value={form.confirm}
                      onChange={handleChange}
                      className={`w-full pl-3.5 pr-10 py-3 bg-[#f5f1ea] border-[1.5px] text-kk-blue text-[0.875rem] rounded-xl outline-none transition-all focus:ring-4 focus:ring-kk-blue-light/10 ${
                        passwordsMatch ? "border-[#e8e2d9] focus:border-kk-blue-light" : "border-red-500 focus:border-red-500"
                      }`}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#9a9287] hover:text-kk-blue transition-colors">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {!passwordsMatch && <span className="text-[0.72rem] text-red-500 mt-1">Şifreler eşleşmiyor.</span>}
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-[17px] h-[17px] mt-0.5 accent-kk-blue-light cursor-pointer"
                />
                <span className="text-[0.82rem] text-kk-text-muted leading-relaxed">
                  <button type="button" onClick={() => setLegalModal("terms")} className="text-kk-blue-light font-semibold hover:underline">Kullanım Koşulları</button>
                  {" "}ve{" "}
                  <button type="button" onClick={() => setLegalModal("privacy")} className="text-kk-blue-light font-semibold hover:underline">Gizlilik Politikası</button>
                  &apos;nı okudum, kabul ediyorum.
                </span>
              </label>

              <Button
                type="submit"
                variant="kk-login"
                size="unsized"
                disabled={loading || !agreed || !passwordsMatch || !!emailError || !form.university_id || form.password.length < 8}
                className="w-full py-3.5 rounded-xl text-[0.95rem] font-bold shadow-[0_10px_25px_rgba(29,58,82,0.15)] mt-2 transition-all disabled:bg-gray-300"
              >
                {loading ? "Hesabın Oluşturuluyor..." : "Kayıt Ol"}
              </Button>
            </form>

            <div className="mt-7 text-center text-[0.9rem] text-kk-text-muted">
              Zaten hesabın var mı?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-kk-blue-light font-bold cursor-pointer border-b-[1.5px] border-kk-blue-light/20 pb-0.5 hover:border-kk-blue-light transition-colors"
              >
                Giriş Yap
              </span>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        @media (max-width: 600px) {
          main { padding: 24px 16px !important; }
          .w-full.max-w-\[560px\] { padding: 32px 24px !important; }
        }
      `}</style>
    </div>
    <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
    </>
  );
}
