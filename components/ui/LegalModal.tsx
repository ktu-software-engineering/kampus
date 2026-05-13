"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface LegalModalProps {
  type: "terms" | "privacy" | null;
  onClose: () => void;
}

const TERMS_CONTENT = {
  title: "Kullanım Koşulları",
  lastUpdated: "13 Mayıs 2026",
  sections: [
    {
      heading: "1. Platformun Amacı",
      text: `KampusKarne, üniversite öğrencilerinin akademisyenler ve dersler hakkında anonim değerlendirme yapabildiği, şeffaf ve güvenilir bir akademik geri bildirim platformudur. Platform; öğrenci deneyimlerini paylaşmak, geçmiş yıllardaki deneyimleri yeni nesillere aktarmak, ders seçim sürecini kolaylaştırmak ve akademik kaliteyi artırmak amacıyla tasarlanmıştır.`,
    },
    {
      heading: "2. Kullanıcı Yükümlülükleri",
      text: `Platformu kullanabilmek için üniversiteye kayıtlı bir öğrenci olmanız ve kurumsal üniversite e-posta adresinizle kayıt yaptırmanız zorunludur. Hesabınızın güvenliğinden yalnızca siz sorumlusunuz; şifrenizi kimseyle paylaşmayınız.

Platformda gerçek dışı, yanıltıcı veya iftira niteliğinde içerik paylaşmak kesinlikle yasaktır. Akademisyenler veya diğer kullanıcılar hakkında hakaret, tehdit veya kişisel saldırı içeren yorumlar yapılamaz. Ticari amaçlı içerik, spam veya reklam paylaşılamaz.`,
    },
    {
      heading: "3. İçerik Kuralları",
      text: `Yorumlar platforma anonim olarak yayınlanır; ancak kural ihlali durumunda yetkili makamlarla zorunlu bilgi paylaşımı yapılabilir. Tüm değerlendirmeler akademik deneyimlere dayanmalı, kişisel önyargı veya kin güdüsüyle yapılmamalıdır.

Kuralları ihlal ettiği düşünülen yorumlar diğer kullanıcılar tarafından şikayet edilebilir. Üç veya daha fazla şikayet alan yorumlar otomatik olarak gizlenir ve yönetim incelemesine alınır. Şikayet edilen içerikler yönetim tarafından kaldırılabilir.`,
    },
    {
      heading: "4. Akademisyen Hakları",
      text: `Akademisyenler, KampusKarne üzerindeki kendi profillerini ve sayfalarını kapatma talebinde bulunabilirler. Bu talep platform yönetimine iletilmeli ve kimlik doğrulaması yapılmalıdır. Kapatma talebi onaylanan akademisyen profilleri ve bu profillere ait değerlendirmeler yayından kaldırılır.`,
    },
    {
      heading: "5. Hesap Askıya Alma ve Kapatma",
      text: `Kullanım koşullarını ihlal eden, hakaret veya iftira içeren içerik paylaşan, platformu kötüye kullanan hesaplar önceden bildirim yapılmaksızın askıya alınabilir veya kalıcı olarak kapatılabilir.

Hesabınızı kapatmak istemeniz hâlinde platform üzerinden veya iletişim kanallarımız aracılığıyla talepte bulunabilirsiniz.`,
    },
    {
      heading: "6. Sorumluluk Sınırı",
      text: `KampusKarne, kullanıcılar tarafından paylaşılan içeriklerin doğruluğundan sorumlu değildir. Platform, hizmet kesintileri veya teknik aksaklıklardan doğabilecek zararlar için sorumluluk kabul etmez.`,
    },
    {
      heading: "7. Uygulanacak Hukuk",
      text: `Bu kullanım koşulları Türkiye Cumhuriyeti hukukuna tabi olup uyuşmazlıklarda Trabzon Mahkemeleri ve İcra Daireleri yetkilidir.`,
    },
  ],
};

const PRIVACY_CONTENT = {
  title: "Gizlilik Politikası",
  lastUpdated: "13 Mayıs 2026",
  sections: [
    {
      heading: "1. Veri Sorumlusu",
      text: `KampusKarne platformu, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla hareket etmektedir. Kişisel verilerinize ilişkin taleplerinizi platform içindeki Öneri/Şikayet bölümü aracılığıyla iletebilirsiniz.`,
    },
    {
      heading: "2. Toplanan Kişisel Veriler",
      text: `Kayıt ve kullanım sürecinde aşağıdaki veriler işlenmektedir:

• E-posta adresi (KTÜ öğrenci e-postası)
• Ad ve soyad
• Üniversite bilgisi
• Paylaşılan yorum ve değerlendirmeler
• Giriş tarihi ve IP adresi (güvenlik amacıyla)`,
    },
    {
      heading: "3. Verilerin İşlenme Amacı",
      text: `Toplanan kişisel veriler yalnızca şu amaçlarla işlenir:

• Kullanıcı hesabının oluşturulması ve yönetilmesi
• Yorum doğrulaması ve platform güvenliğinin sağlanması
• Kural ihlallerinin tespiti ve gerekli yaptırımların uygulanması
• Platform geliştirme ve iyileştirme çalışmaları`,
    },
    {
      heading: "4. Verilerin Üçüncü Taraflarla Paylaşımı",
      text: `Kişisel verileriniz kural dışı davranış veya yasal zorunluluk olmadıkça üçüncü taraflarla paylaşılmaz. Ancak aşağıdaki durumlarda yetkili mercilerle paylaşım yapılabilir:

• Hakaret, tehdit veya iftira içeren yorumların tespiti hâlinde üniversite yönetiminin resmi talebi üzerine ilgili kullanıcının kimlik bilgileri paylaşılabilir.
• Mahkeme kararı veya yasal zorunluluk durumunda yetkili makamlarla paylaşım yapılır.

Bu durumlar dışında verileriniz hiçbir ticari amaçla üçüncü taraflarla paylaşılmaz.`,
    },
    {
      heading: "5. Anonimlik Garantisi",
      text: `Platforma yapılan değerlendirmeler ve yorumlar diğer kullanıcılara anonim olarak görünür. Yorumun kime ait olduğu hiçbir koşulda diğer öğrencilere, akademisyenlere veya kamuya açıklanmaz. Anonimliğin kaldırılması yalnızca yukarıda belirtilen yasal zorunluluk veya üniversite yönetimi talebi durumlarında söz konusu olabilir.`,
    },
    {
      heading: "6. Akademisyen Sayfaları",
      text: `Akademisyenler, KampusKarne'deki kendi profillerinin ve değerlendirmelerinin kaldırılmasını talep edebilir. Bu hak, KVKK kapsamındaki "unutulma hakkı" çerçevesinde değerlendirilir. Talep için platform içindeki Öneri/Şikayet bölümü üzerinden kimlik doğrulaması yapılarak başvurulması gerekmektedir.`,
    },
    {
      heading: "7. Veri Saklama Süresi",
      text: `Kişisel verileriniz hesabınız aktif olduğu sürece saklanır. Hesabınızı kapattığınızda verileriniz 30 gün içinde silinir; ancak yasal zorunluluk nedeniyle saklanması gereken veriler ilgili mevzuatta öngörülen süre boyunca tutulur.`,
    },
    {
      heading: "8. KVKK Kapsamında Haklarınız",
      text: `6698 sayılı KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:

• Kişisel verilerinizin işlenip işlenmediğini öğrenme
• İşlenmişse buna ilişkin bilgi talep etme
• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
• Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme
• KVKK'nın 7. maddesi çerçevesinde silinmesini veya yok edilmesini isteme
• İşlemeye itiraz etme
• Otomatik sistemler aracılığıyla aleyhinize oluşan sonuçlara itiraz etme
• Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde tazminat talep etme

Bu haklarınızı kullanmak için platform içindeki Öneri/Şikayet bölümü üzerinden başvuruda bulunabilirsiniz.`,
    },
  ],
};

export function LegalModal({ type, onClose }: LegalModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const content = type === "terms" ? TERMS_CONTENT : type === "privacy" ? PRIVACY_CONTENT : null;

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 220);
  }

  useEffect(() => {
    if (!type) return;
    setIsClosing(false);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  if (!type || !content) return null;

  return (
    <>
      <style>{`
        @keyframes kk-modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes kk-modal-out {
          from { opacity: 1; transform: scale(1)    translateY(0); }
          to   { opacity: 0; transform: scale(0.95) translateY(8px); }
        }
        @keyframes kk-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes kk-overlay-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
      <div
        ref={overlayRef}
        onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{
          backgroundColor: "rgba(6, 40, 58, 0.55)",
          backdropFilter: "blur(4px)",
          animation: isClosing
            ? "kk-overlay-out 220ms ease forwards"
            : "kk-overlay-in 200ms ease forwards",
        }}
      >
        <div
          className="relative w-full max-w-[640px] max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: "#ffffff",
            boxShadow: "0 24px 64px rgba(6,40,58,0.22), 0 4px 16px rgba(6,40,58,0.1)",
            animation: isClosing
              ? "kk-modal-out 220ms cubic-bezier(0.4,0,1,1) forwards"
              : "kk-modal-in 240ms cubic-bezier(0,0,0.2,1) forwards",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-7 py-5 flex-shrink-0"
            style={{ background: "#06283a", borderBottom: "1px solid rgba(200,148,26,0.3)" }}
          >
            <div>
              <h2 className="text-white font-bold text-[1.15rem] tracking-tight">{content.title}</h2>
              <p className="text-[#C8941A] text-[0.75rem] mt-0.5 font-medium">Son güncelleme: {content.lastUpdated}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 text-white/60 hover:text-white"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 px-7 py-6" style={{ scrollbarWidth: "thin", scrollbarColor: "#e8e2d9 transparent" }}>
            {content.sections.map((section, i) => (
              <div key={i} className={i < content.sections.length - 1 ? "mb-6" : ""}>
                <h3
                  className="font-bold text-[0.88rem] mb-2 uppercase tracking-wider"
                  style={{ color: "#06283a" }}
                >
                  {section.heading}
                </h3>
                <p
                  className="text-[0.875rem] leading-relaxed whitespace-pre-line"
                  style={{ color: "#3a3530" }}
                >
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
