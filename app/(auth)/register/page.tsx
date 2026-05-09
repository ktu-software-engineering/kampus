"use client";

import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Building2, ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const siteLogo = "/images/site_logo-1.png";
const newSiteLogo = "/images/new_site_logo_1.png";

const universities = [
  "Karadeniz Teknik Üniversitesi",
];

function BackgroundTexture() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `
            repeating-linear-gradient(-38deg, transparent 0px, transparent 18px, rgba(255,255,255,0.72) 18px, rgba(255,255,255,0.72) 19px, transparent 19px, transparent 42px),
            repeating-linear-gradient(-38deg, transparent 0px, transparent 74px, rgba(255,255,255,0.45) 74px, rgba(255,255,255,0.45) 76px, transparent 76px, transparent 160px)
          `,
          maskImage: "radial-gradient(ellipse 95% 70% at 20% 10%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 70% at 20% 10%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `
            repeating-linear-gradient(-38deg, transparent 0px, transparent 18px, rgba(255,255,255,0.72) 18px, rgba(255,255,255,0.72) 19px, transparent 19px, transparent 42px),
            repeating-linear-gradient(-38deg, transparent 0px, transparent 74px, rgba(255,255,255,0.45) 74px, rgba(255,255,255,0.45) 76px, transparent 76px, transparent 160px)
          `,
          maskImage: "radial-gradient(ellipse 95% 70% at 80% 90%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 70% at 80% 90%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 0% 0%, rgba(14,74,107,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 70% 55% at 100% 100%, rgba(14,74,107,0.10) 0%, transparent 65%)
          `,
        }}
      />
    </>
  );
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
    <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ height: "3px", flex: 1, borderRadius: "99px", transition: "all 0.3s", backgroundColor: i < score ? colors[score] : "#e2ddd6" }} />
        ))}
      </div>
      <span style={{ fontSize: "0.72rem", color: colors[score], fontWeight: 600, letterSpacing: "0.02em" }}>{labels[score]}</span>
    </div>
  );
}

const inputStyle = {
  backgroundColor: "#f5f1ea",
  border: "1.5px solid #e8e2d9",
  color: "#1d3a52",
  fontSize: "0.875rem",
  borderRadius: "12px",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", university: "", password: "", confirm: "" });

  const passwordsMatch = form.confirm === "" || form.password === form.confirm;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "email") {
      setEmailError(value && !value.endsWith(".edu.tr") ? "Lütfen geçerli bir .edu.tr e-posta adresi girin." : "");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !agreed || emailError) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1600);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#edeae2", padding: "0 16px", position: "relative", overflowX: "hidden" }}>
        <BackgroundTexture />
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "440px", borderRadius: "24px", padding: "48px 40px", textAlign: "center", backgroundColor: "#ffffff", boxShadow: "0 4px 40px rgba(29,58,82,0.08)", border: "1px solid #e8e2d9" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", backgroundColor: "#1d3a52" }}>
            <Check size={28} color="#ffffff" strokeWidth={2.5} />
          </div>
          <h2 style={{ color: "#1d3a52", fontSize: "1.6rem", fontWeight: 800, marginBottom: "8px", letterSpacing: "-0.02em" }}>Kaydın Tamamlandı!</h2>
          <p style={{ color: "#7a7267", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "32px" }}>
            Hoş geldin, <span style={{ color: "#1d3a52", fontWeight: 700 }}>{form.firstName}</span>! Artık hocaları değerlendirebilirsin.
          </p>
          <button
            onClick={() => router.push("/")}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: "#1d3a52", color: "#ffffff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer" }}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#edeae2", position: "relative", overflowX: "hidden" }}>
      <BackgroundTexture />

      <nav style={{ position: "relative", zIndex: 10, width: "100%", padding: "0 32px", height: "80px", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
        <div style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          <img src={siteLogo} alt="KampusKarne Logo" style={{ height: "68px", width: "auto", objectFit: "contain" }} />
        </div>
        <div className="kk-nav-links" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {["Hocalar", "Hakkımızda"].map((item) => (
            <button
              key={item}
              style={{ padding: "8px 14px", color: "#1d3a52", fontSize: "0.875rem", fontWeight: 500, background: "none", border: "none", cursor: "pointer", borderRadius: "8px", transition: "background 0.18s, color 0.18s" }}
              onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "rgba(0,99,146,0.08)"; b.style.color = "#006392"; }}
              onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "transparent"; b.style.color = "#1d3a52"; }}
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => router.push("/register")}
            style={{ padding: "8px 14px", color: "#1d3a52", fontSize: "0.875rem", fontWeight: 500, background: "none", border: "none", cursor: "pointer", borderRadius: "8px", transition: "background 0.18s, color 0.18s" }}
            onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "rgba(0,99,146,0.08)"; b.style.color = "#006392"; }}
            onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "transparent"; b.style.color = "#1d3a52"; }}
          >
            Kaydol
          </button>
          <button
            onClick={() => router.push("/login")}
            style={{ padding: "10px 20px", backgroundColor: "#1d3a52", color: "#ffffff", fontSize: "0.875rem", fontWeight: 600, border: "none", cursor: "pointer", borderRadius: "10px", marginLeft: "8px", transition: "background 0.18s, transform 0.18s" }}
            onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "#006392"; b.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "#1d3a52"; b.style.transform = "translateY(0)"; }}
          >
            Giriş Yap
          </button>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px 60px" }}>
        <div style={{ width: "100%", maxWidth: "500px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ color: "#1d3a52", fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "10px" }}>Hesap Oluştur</h1>
            <p style={{ color: "#8c8278", fontSize: "0.95rem", lineHeight: 1.5 }}>
              Hocaları değerlendirmek için <span style={{ color: "#1d3a52", fontWeight: 700 }}>ücretsiz</span> kaydol.
            </p>
          </div>

          <div style={{ borderRadius: "24px", padding: "36px 40px", backgroundColor: "#ffffff", boxShadow: "0 2px 32px rgba(29,58,82,0.07)", border: "1px solid #e8e2d9" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[{ id: "firstName", label: "AD", placeholder: "Adınız" }, { id: "lastName", label: "SOYAD", placeholder: "Soyadınız" }].map(({ id, label, placeholder }) => (
                  <div key={id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label htmlFor={id} style={{ color: "#1d3a52", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em" }}>{label}</label>
                    <div style={{ position: "relative" }}>
                      <User size={13} color="#b0a99f" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                      <input id={id} name={id} type="text" placeholder={placeholder} value={(form as any)[id]} onChange={handleChange} required
                        style={{ ...inputStyle, width: "100%", paddingLeft: "36px", paddingRight: "12px", paddingTop: "11px", paddingBottom: "11px", outline: "none", boxSizing: "border-box" }}
                        onFocus={(e) => { e.target.style.borderColor = "#1d3a52"; e.target.style.boxShadow = "0 0 0 3px rgba(29,58,82,0.08)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e8e2d9"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="email" style={{ color: "#1d3a52", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em" }}>
                  E-POSTA ADRESİ <span style={{ color: "#8c8278", fontWeight: 500, marginLeft: "6px", fontSize: "0.68rem" }}>(.edu.tr uzantılı)</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={13} color="#b0a99f" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input id="email" name="email" type="email" placeholder="ornek@universite.edu.tr" value={form.email} onChange={handleChange} required
                    style={{ ...inputStyle, width: "100%", paddingLeft: "36px", paddingRight: "16px", paddingTop: "11px", paddingBottom: "11px", outline: "none", boxSizing: "border-box", borderColor: emailError ? "#ef4444" : "#e8e2d9" }}
                    onFocus={(e) => { e.target.style.borderColor = emailError ? "#ef4444" : "#1d3a52"; e.target.style.boxShadow = "0 0 0 3px rgba(29,58,82,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = emailError ? "#ef4444" : "#e8e2d9"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                {emailError && <span style={{ color: "#ef4444", fontSize: "0.72rem", fontWeight: 600 }}>{emailError}</span>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="university" style={{ color: "#1d3a52", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em" }}>ÜNİVERSİTE</label>
                <div style={{ position: "relative" }}>
                  <Building2 size={13} color="#b0a99f" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <ChevronDown size={13} color="#b0a99f" style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <select id="university" name="university" value={form.university} onChange={handleChange} required
                    style={{ ...inputStyle, width: "100%", paddingLeft: "36px", paddingRight: "36px", paddingTop: "11px", paddingBottom: "11px", outline: "none", appearance: "none", cursor: "pointer", boxSizing: "border-box", color: form.university ? "#1d3a52" : "#b0a99f" }}
                    onFocus={(e) => { e.target.style.borderColor = "#1d3a52"; e.target.style.boxShadow = "0 0 0 3px rgba(29,58,82,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e8e2d9"; e.target.style.boxShadow = "none"; }}
                  >
                    <option value="" disabled>Üniversitenizi seçin</option>
                    {universities.map((u) => <option key={u} value={u} style={{ color: "#1d3a52" }}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="password" style={{ color: "#1d3a52", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em" }}>ŞİFRE</label>
                <div style={{ position: "relative" }}>
                  <Lock size={13} color="#b0a99f" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="En az 8 karakter" value={form.password} onChange={handleChange} required minLength={8}
                    style={{ ...inputStyle, width: "100%", paddingLeft: "36px", paddingRight: "40px", paddingTop: "11px", paddingBottom: "11px", outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => { e.target.style.borderColor = "#1d3a52"; e.target.style.boxShadow = "0 0 0 3px rgba(29,58,82,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e8e2d9"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", opacity: 0.6 }}>
                    {showPassword ? <EyeOff size={15} color="#1d3a52" /> : <Eye size={15} color="#1d3a52" />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="confirm" style={{ color: "#1d3a52", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em" }}>ŞİFRE TEKRAR</label>
                <div style={{ position: "relative" }}>
                  <Lock size={13} color="#b0a99f" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input id="confirm" name="confirm" type={showConfirm ? "text" : "password"} placeholder="Şifreyi tekrar girin" value={form.confirm} onChange={handleChange} required
                    style={{ ...inputStyle, width: "100%", paddingLeft: "36px", paddingRight: "40px", paddingTop: "11px", paddingBottom: "11px", outline: "none", boxSizing: "border-box", borderColor: !passwordsMatch && form.confirm ? "#ef4444" : "#e8e2d9" }}
                    onFocus={(e) => { e.target.style.borderColor = !passwordsMatch ? "#ef4444" : "#1d3a52"; e.target.style.boxShadow = "0 0 0 3px rgba(29,58,82,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = !passwordsMatch && form.confirm ? "#ef4444" : "#e8e2d9"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", opacity: 0.6 }}>
                    {showConfirm ? <EyeOff size={15} color="#1d3a52" /> : <Eye size={15} color="#1d3a52" />}
                  </button>
                </div>
                {!passwordsMatch && form.confirm && <span style={{ color: "#ef4444", fontSize: "0.72rem", fontWeight: 600 }}>Şifreler eşleşmiyor.</span>}
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", userSelect: "none" }}>
                <div style={{ position: "relative", marginTop: "2px", flexShrink: 0 }}>
                  <input type="checkbox" style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  <div onClick={() => setAgreed(v => !v)} style={{ width: "17px", height: "17px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", backgroundColor: agreed ? "#1d3a52" : "#f5f1ea", border: agreed ? "1.5px solid #1d3a52" : "1.5px solid #d6cfc5" }}>
                    {agreed && <Check size={10} color="#ffffff" strokeWidth={3} />}
                  </div>
                </div>
                <span style={{ color: "#7a7267", fontSize: "0.82rem", lineHeight: 1.55 }}>
                  <span style={{ color: "#1d3a52", fontWeight: 700, cursor: "pointer" }}>Kullanım Koşulları</span>{" "}ve{" "}
                  <span style={{ color: "#1d3a52", fontWeight: 700, cursor: "pointer" }}>Gizlilik Politikası</span>&apos;nı okudum ve kabul ediyorum.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !agreed || !passwordsMatch || !!emailError}
                style={{ width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: "#1d3a52", color: "#ffffff", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: loading || !agreed || !passwordsMatch || !!emailError ? "not-allowed" : "pointer", letterSpacing: "0.02em", opacity: loading || !agreed || !!emailError ? 0.5 : 1, transition: "opacity 0.2s, transform 0.18s, background 0.18s", marginTop: "4px" }}
                onMouseEnter={(e) => { if (!loading && agreed && !emailError) { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "#006392"; b.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "#1d3a52"; b.style.transform = "translateY(0)"; }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <svg style={{ animation: "spin 1s linear infinite", width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style={{ opacity: 0.75 }} />
                    </svg>
                    Kaydediliyor…
                  </span>
                ) : "Ücretsiz Kaydol"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", marginTop: "20px", color: "#8c8278", fontSize: "0.875rem" }}>
            Zaten hesabın var mı?{" "}
            <button
              onClick={() => router.push("/login")}
              style={{ color: "#1d3a52", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
            >
              Giriş Yap
            </button>
          </p>
        </div>
      </div>

      <footer style={{ position: "relative", zIndex: 1, background: "#0e4a6b", padding: "28px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <img src={newSiteLogo} alt="KampusKarne Logo" style={{ height: "44px", width: "auto", objectFit: "contain" }} />
          <p style={{ fontSize: "12px", color: "rgba(246,241,231,0.5)", margin: 0, letterSpacing: "0.02em" }}>
            © 2026 KampusKarne · Üniversite Değerlendirme Platformu · Tüm hakları saklıdır.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .kk-nav-links button:not(:last-child) { display: none; } }
      `}</style>
    </div>
  );
}
