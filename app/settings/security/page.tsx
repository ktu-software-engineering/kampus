"use client";

import React, { useState } from "react";
import { Shield, Key, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SecuritySettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="p-4 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-[#06283a] dark:text-white shadow-sm">
            <Shield size={40} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Güvenlik ve Erişim</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-md">Hesap güvenliğinizi artırın ve şifrenizi güncelleyin.</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Şifre Değiştirme */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Key size={14} /> Şifre Güncelleme
              </h3>
              <p className="text-[12px] text-slate-500 dark:text-zinc-500 leading-relaxed">
                Hesabınızı güvende tutmak için en az 8 karakterli, karmaşık bir şifre kullanmanızı öneririz.
              </p>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <SecurityInput label="Mevcut Şifre" type="password" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SecurityInput label="Yeni Şifre" type="password" />
                <SecurityInput label="Yeni Şifre (Tekrar)" type="password" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İşlem Butonu */}
      <div className="pt-4 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-3 bg-[#06283a] dark:bg-zinc-100 text-white dark:text-[#06283a] rounded font-bold text-xs uppercase tracking-[0.15em] hover:bg-opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
        >
          {isSaving ? "İşleniyor..." : "Şifreyi Güncelle"}
        </button>
      </div>
    </div>
  );
}

function SecurityInput({ label, type = "text" }: { label: string, type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-0.5">{label}</label>
      <input 
        type={type} 
        className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#06283a] transition-all shadow-sm"
      />
    </div>
  );
}