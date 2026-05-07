"use client";

import React, { useState } from "react";
import { Camera, Mail, User as UserIcon, GraduationCap, MapPin, EyeOff, Check } from "lucide-react";

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
            <div className="w-24 h-24 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-[#06283a] dark:text-white text-2xl font-bold shadow-sm">
              İD
            </div>
            <button className="absolute -bottom-1 -right-1 p-2 bg-[#06283a] text-white rounded shadow-md hover:bg-opacity-90 transition-all">
              <Camera size={14} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Profil Yönetimi</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-md">Sistem genelinde görüntülenecek kimlik ve akademik bilgilerinizi bu alandan güncelleyebilirsiniz.</p>
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
      <section className="pt-10 border-t border-slate-100 dark:border-zinc-800">
        <div className="bg-slate-50 dark:bg-zinc-900/50 p-6 rounded border border-slate-100 dark:border-zinc-800 flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <EyeOff size={18} className="text-slate-700 dark:text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Gizlilik Tercihi</h3>
            </div>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
              <strong className="text-slate-700 dark:text-slate-300">Anonim Mod:</strong> Bu seçenek aktif olduğunda, paylaştığınız değerlendirmelerde isminiz gizlenir. Sadece akademik departman bilginiz referans olarak gösterilir.
            </p>
          </div>
          <button 
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isAnonymous ? 'bg-[#06283a]' : 'bg-slate-300 dark:bg-zinc-700'}`}
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
          className="px-10 py-3 bg-[#06283a] dark:bg-zinc-100 text-white dark:text-[#06283a] rounded font-bold text-xs uppercase tracking-[0.15em] hover:bg-opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
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
      <label className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-0.5">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 transition-colors">
          {icon}
        </div>
        <input 
          type="text" 
          defaultValue={value}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#06283a] focus:border-[#06283a] transition-all"
        />
      </div>
    </div>
  );
}