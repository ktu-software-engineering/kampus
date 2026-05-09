"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const blueLogo = "/images/site_logo-1.png";
const goldLogo = "/images/new_site_logo_1.png";

function BackgroundTexture() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            repeating-linear-gradient(
              -38deg,
              transparent 0px,
              transparent 18px,
              rgba(255,255,255,0.72) 18px,
              rgba(255,255,255,0.72) 19px,
              transparent 19px,
              transparent 42px
            ),
            repeating-linear-gradient(
              -38deg,
              transparent 0px,
              transparent 74px,
              rgba(255,255,255,0.45) 74px,
              rgba(255,255,255,0.45) 76px,
              transparent 76px,
              transparent 160px
            )
          `,
          maskImage: "radial-gradient(ellipse 95% 70% at 20% 10%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 70% at 20% 10%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            repeating-linear-gradient(
              -38deg,
              transparent 0px,
              transparent 18px,
              rgba(255,255,255,0.72) 18px,
              rgba(255,255,255,0.72) 19px,
              transparent 19px,
              transparent 42px
            ),
            repeating-linear-gradient(
              -38deg,
              transparent 0px,
              transparent 74px,
              rgba(255,255,255,0.45) 74px,
              rgba(255,255,255,0.45) 76px,
              transparent 76px,
              transparent 160px
            )
          `,
          maskImage: "radial-gradient(ellipse 95% 70% at 80% 90%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 70% at 80% 90%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 0% 0%, rgba(14,74,107,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 70% 55% at 100% 100%, rgba(14,74,107,0.10) 0%, transparent 65%)
          `,
        }}
      />
    </>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        backgroundColor: "#edeae2",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <BackgroundTexture />

      {/* NAVBAR */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          padding: "0 32px",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <div style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          <img
            src={blueLogo}
            alt="KampusKarne Logo"
            style={{ height: "68px", width: "auto", objectFit: "contain" }}
          />
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

      {/* MAIN */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 24px 60px",
        }}
      >
        <h1
          style={{
            color: "#1d3a52",
            fontSize: "2.2rem",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          Giriş Yap
        </h1>
        <p
          style={{
            color: "#8c8278",
            fontSize: "0.95rem",
            marginBottom: "32px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          KampusKarne hesabına giriş yap ve hoca değerlendirmelerini keşfet.
        </p>

        {/* Kart */}
        <div
          style={{
            borderRadius: "24px",
            padding: "36px 40px 32px",
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 32px rgba(29,58,82,0.07)",
            border: "1px solid #e8e2d9",
          }}
        >
          {/* E-POSTA */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                color: "#1d3a52",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              E-Posta Adresi
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={13}
                color="#b0a99f"
                style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
              <input
                type="email"
                placeholder="ornek@universite.edu.tr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: "#f5f1ea",
                  border: "1.5px solid #e8e2d9",
                  color: "#1d3a52",
                  fontSize: "0.875rem",
                  borderRadius: "12px",
                  width: "100%",
                  paddingLeft: "36px",
                  paddingRight: "16px",
                  paddingTop: "11px",
                  paddingBottom: "11px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#1d3a52"; e.target.style.boxShadow = "0 0 0 3px rgba(29,58,82,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e8e2d9"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* ŞİFRE */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label
                style={{
                  color: "#1d3a52",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Şifre
              </label>
              <button
                onClick={() => {}}
                style={{ color: "#4a8fbb", fontSize: "0.78rem", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.textDecoration = "underline"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.textDecoration = "none"; }}
              >
                Şifremi unuttum?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <Lock
                size={13}
                color="#b0a99f"
                style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="En az 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  backgroundColor: "#f5f1ea",
                  border: "1.5px solid #e8e2d9",
                  color: "#1d3a52",
                  fontSize: "0.875rem",
                  borderRadius: "12px",
                  width: "100%",
                  paddingLeft: "36px",
                  paddingRight: "40px",
                  paddingTop: "11px",
                  paddingBottom: "11px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#1d3a52"; e.target.style.boxShadow = "0 0 0 3px rgba(29,58,82,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e8e2d9"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", opacity: 0.6 }}
              >
                {showPassword ? <EyeOff size={15} color="#1d3a52" /> : <Eye size={15} color="#1d3a52" />}
              </button>
            </div>
          </div>

          {/* BENİ HATIRLA */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "26px" }}>
            <div
              role="checkbox"
              aria-checked={remember}
              tabIndex={0}
              onClick={() => setRemember(!remember)}
              onKeyDown={(e) => { if (e.key === " ") setRemember(!remember); }}
              style={{
                width: 17,
                height: 17,
                borderRadius: "5px",
                border: remember ? "1.5px solid #1d3a52" : "1.5px solid #d6cfc5",
                backgroundColor: remember ? "#1d3a52" : "#f5f1ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                marginTop: "2px",
                transition: "all 0.2s",
              }}
            >
              {remember && (
                <svg width="10" height="8" viewBox="0 0 11 8" fill="none">
                  <path d="M1 4L3.8 7L10 1" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              style={{ fontSize: "0.82rem", color: "#7a7267", cursor: "pointer", lineHeight: 1.55 }}
              onClick={() => setRemember(!remember)}
            >
              Beni hatırla
            </span>
          </div>

          {/* GİRİŞ YAP BUTONU */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              backgroundColor: "#1d3a52",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.95rem",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "background 0.18s, transform 0.18s",
            }}
            onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "#006392"; b.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "#1d3a52"; b.style.transform = "translateY(0)"; }}
          >
            Giriş Yap
          </button>
        </div>

        {/* KAYDOL LİNK */}
        <p style={{ marginTop: "20px", color: "#8c8278", fontSize: "0.875rem", textAlign: "center" }}>
          Hesabın yok mu?{" "}
          <button
            onClick={() => router.push("/register")}
            style={{ color: "#1d3a52", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Kaydol
          </button>
        </p>
      </main>

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 1, background: "#0e4a6b", padding: "28px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <img src={goldLogo} alt="KampusKarne Logo" style={{ height: "44px", width: "auto", objectFit: "contain" }} />
          <p style={{ fontSize: "12px", color: "rgba(246,241,231,0.5)", margin: 0, letterSpacing: "0.02em" }}>
            © 2026 KampusKarne · Üniversite Değerlendirme Platformu · Tüm hakları saklıdır.
          </p>
        </div>
      </footer>

      {/* FLOATING ? BUTTON */}
      <button
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "#2d4a62",
          color: "#ffffff",
          border: "none",
          fontSize: "1.1rem",
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          transition: "background 0.15s",
          zIndex: 99,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1d3a52"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2d4a62"; }}
        title="Yardım"
      >
        ?
      </button>

      <style>{`
        @media (max-width: 600px) {
          .kk-nav-links button:not(:last-child) { display: none; }
        }
      `}</style>
    </div>
  );
}
