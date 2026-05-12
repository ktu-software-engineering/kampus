"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  CheckCircle2,
  Info
} from "lucide-react";

type SuggestType = "instructor" | "course" | "report";

function SuggestFormContent() {
  const searchParams = useSearchParams();
  const [type, setType] = useState<SuggestType>("instructor");
  const [submitted, setSubmitted] = useState(false);

  // URL'den gelen ?type=report gibi parametreleri dinle
  useEffect(() => {
    const typeParam = searchParams.get("type") as SuggestType;
    if (typeParam && ["instructor", "course", "report"].includes(typeParam)) {
      setType(typeParam); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white border border-kk-blue/10 rounded-2xl p-12 max-w-md w-full text-center shadow-xl">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-2xl font-bold text-kk-blue mb-4">Mesajın Alındı!</h1>
        <p className="text-kk-text-muted mb-8 leading-relaxed">
          Önerin veya geri bildirimin moderatörlerimize iletildi. Katkın için teşekkürler!
        </p>
        <Button 
          variant="kk-login" 
          className="w-full py-6"
          onClick={() => { setSubmitted(false); setType("instructor"); }}
        >
          Yeni Bir Öneri Gönder
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(6,40,58,0.08)] overflow-hidden">
      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-kk-blue ml-1">İşlem Türü</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as SuggestType)}
              className="w-full bg-kk-beige/30 border border-kk-blue/10 rounded-xl px-4 py-3 text-kk-text focus:outline-none focus:border-kk-blue-light focus:ring-1 focus:ring-kk-blue-light transition-all appearance-none cursor-pointer"
            >
              <option value="instructor">Yeni Akademisyen Öner</option>
              <option value="course">Yeni Ders Öner</option>
              <option value="report">Şikayet veya Hata Bildir</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-kk-blue ml-1">Konu / Başlık</label>
            <input 
              required
              className="w-full bg-kk-beige/30 border border-kk-blue/10 rounded-xl px-4 py-3 text-kk-text placeholder:text-kk-text-muted/50 focus:outline-none focus:border-kk-blue-light focus:ring-1 focus:ring-kk-blue-light transition-all"
              placeholder={type === "instructor" ? "Hocanın adı ve bölümü..." : type === "course" ? "Dersin adı ve kodu..." : "Kısaca konu nedir?"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-kk-blue ml-1">Detaylar</label>
            <textarea 
              required
              rows={5}
              className="w-full bg-kk-beige/30 border border-kk-blue/10 rounded-xl px-4 py-3 text-kk-text placeholder:text-kk-text-muted/50 focus:outline-none focus:border-kk-blue-light focus:ring-1 focus:ring-kk-blue-light transition-all resize-none"
              placeholder="Lütfen eklemek istediğiniz tüm detayları buraya yazın..."
            />
          </div>
        </div>

        <div className="bg-kk-blue/5 rounded-xl p-4 flex gap-3 items-start">
          <Info className="text-kk-blue-light shrink-0" size={20} />
          <p className="text-xs text-kk-text-muted leading-relaxed font-medium">
            Girdiğiniz bilgiler moderatör ekibimiz tarafından incelendikten sonra sisteme dahil edilecektir.
          </p>
        </div>

        <Button variant="kk-login" className="w-full py-7 text-base flex gap-2">
          <Send size={18} />
          Gönderiyi İlet
        </Button>
      </form>
    </div>
  );
}

export default function SuggestPage() {
  return (
    <div className="flex flex-col min-h-screen relative bg-kk-beige font-sans">
      <BackgroundTexture />
      <Navbar />

      <main className="flex-grow relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto w-full flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-kk-blue mb-4 tracking-tight">
            Platformu Birlikte Geliştirelim
          </h1>
          <p className="text-kk-text-muted font-medium max-w-lg mx-auto leading-relaxed">
            Eksik bir hoca mı var? Yeni bir ders mi eklendi? Ya da bir şikayetin mi var? Bize bildir.
          </p>
        </div>

        <Suspense fallback={<div className="p-20 text-kk-blue font-bold">Yükleniyor...</div>}>
          <SuggestFormContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
