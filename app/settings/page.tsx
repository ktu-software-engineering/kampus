"use client";

import React, { useState } from "react";
import { Camera, Mail, User as UserIcon, GraduationCap, MapPin, EyeOff } from "lucide-react";

export default function ProfileSettingsPage() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="space-y-12">
      {/* Profil Fotoğrafı ve Genel Bilgi */}
      <section>
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="relative">
            <div className="w-24 h-24 rounded bg-kk-beige-dark border border-kk-blue/10 flex items-center justify-center text-kk-blue text-2xl font-bold shadow-sm">
              İD
            </div>
            <button className="absolute -bottom-1 -right-1 p-2 bg-kk-blue text-kk-beige rounded shadow-md hover:bg-kk-blue-light transition-all">
              <Camera size={14} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-kk-blue uppercase tracking-tight">Profil Yönetimi</h2>
            <p className="text-sm text-kk-text-muted mt-1 max-w-md">Sistem genelinde görüntülenecek kimlik ve akademik bilgilerinizi bu alandan güncelleyebilirsiniz.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <InputGroup label="Ad Soyad" icon={<UserIcon size={16} />} value="İbrahim Doğan" />
          <InputGroup label="E-posta" icon={<Mail size={16} />} value="ibrahim@kampuskarne.com" />
          <InputGroup label="Üniversite" icon={<MapPin size={16} />} value="Karadeniz Teknik Üniversitesi" />
          <InputGroup label="Fakülte / Bölüm" icon={<GraduationCap size={16} />} value="Elektrik-Elektronik Mühendisliği" />
        </div>
      </section>

      {/* Gizlilik Ayarları */}
      <section className="pt-10 border-t border-kk-blue/10">
        <div className="bg-kk-beige-dark/30 p-6 rounded border border-kk-blue/5 flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <EyeOff size={18} className="text-kk-blue-light" />
              <h3 className="text-sm font-bold text-kk-blue uppercase tracking-wider">Gizlilik Tercihi</h3>
            </div>
            <p className="text-[13px] text-kk-text-muted leading-relaxed max-w-2xl">
              <strong className="text-kk-blue">Anonim Mod:</strong> Bu seçenek aktif olduğunda, paylaştığınız değerlendirmelerde isminiz gizlenir. Sadece akademik departman bilginiz referans olarak gösterilir.
            </p>
          </div>
          <button 
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isAnonymous ? 'bg-kk-blue' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </section>

      {/* İşlem Butonu */}
      <div className="pt-4 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-3 bg-kk-blue text-kk-beige rounded font-bold text-xs uppercase tracking-[0.15em] hover:bg-kk-blue-light active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
        >
          {isSaving ? "İşleniyor..." : "Bilgileri Güncelle"}
        </button>
      </div>
    </div>
  );
}

function InputGroup({ label, icon, value }: { label: string, icon: React.ReactNode, value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-kk-text-muted uppercase tracking-widest ml-0.5">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-kk-text-muted/60 group-focus-within:text-kk-blue-light transition-colors">
          {icon}
        </div>
        <input 
          type="text" 
          defaultValue={value}
          className="w-full pl-11 pr-4 py-3 bg-kk-beige-dark/20 border border-kk-blue/10 rounded text-sm font-medium text-kk-blue focus:outline-none focus:ring-1 focus:ring-kk-blue-light focus:border-kk-blue-light transition-all"
        />
      </div>
    </div>
  );
}
