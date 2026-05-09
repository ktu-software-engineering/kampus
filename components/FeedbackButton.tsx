"use client";

import { useState } from "react";
import { Flag, X, Send, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState("öneri");

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback("");
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
      }}
    >
      {isOpen && (
        <div
          style={{
            width: "300px",
            background: "#FFFFFF",
            borderRadius: "20px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            overflow: "hidden",
            animation: "slideUp 0.25s ease",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <div
            style={{
              padding: "16px 20px 14px",
              background: "#006392",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ color: "#FFF3DB", fontSize: "13px", fontWeight: 700, margin: 0 }}>
                Geri Bildirim
              </p>
              <p style={{ color: "rgba(255,243,219,0.7)", fontSize: "11px", margin: 0 }}>
                Görüşleriniz bizim için değerli
              </p>
            </div>
            <Button
              variant="kk-feedback-close"
              size="unsized"
              onClick={() => setIsOpen(false)}
              aria-label="Kapat"
            >
              <X size={14} />
            </Button>
          </div>

          {!submitted ? (
            <div style={{ padding: "16px 20px 20px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", color: "#757575", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Geri bildirim türü
                </label>
                <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 32px 8px 12px",
                      border: "1.5px solid rgba(0,99,146,0.2)",
                      borderRadius: "10px",
                      background: "#FAFAFA",
                      color: "#333",
                      fontSize: "13px",
                      appearance: "none",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="öneri">💡 Öneri</option>
                    <option value="hata">🐛 Hata Bildirimi</option>
                    <option value="övgü">⭐ Övgü</option>
                    <option value="diğer">💬 Diğer</option>
                  </select>
                  <ChevronDown
                    size={14}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#757575", pointerEvents: "none" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "11px", color: "#757575", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Mesajınız
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Düşüncelerinizi paylaşın..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid rgba(0,99,146,0.2)",
                    borderRadius: "10px",
                    background: "#FAFAFA",
                    color: "#333",
                    fontSize: "13px",
                    resize: "none",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#006392"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(0,99,146,0.2)"; }}
                />
              </div>

              <Button
                variant="kk-feedback-submit"
                size="unsized"
                onClick={handleSubmit}
                disabled={!feedback.trim()}
              >
                <Send size={14} />
                Gönder
              </Button>
            </div>
          ) : (
            <div style={{ padding: "30px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>🎉</div>
              <p style={{ color: "#006392", fontWeight: 700, fontSize: "15px", margin: "0 0 4px" }}>
                Teşekkürler!
              </p>
              <p style={{ color: "#757575", fontSize: "12px", margin: 0 }}>
                Geri bildiriminiz iletildi.
              </p>
            </div>
          )}
        </div>
      )}

      <Button
        variant="kk-feedback-trigger"
        size="unsized"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Flag size={15} />
        Geri Bildirim
      </Button>
    </div>
  );
}
