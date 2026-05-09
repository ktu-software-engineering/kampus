"use client";

import React, { useState } from "react";
import { Shield, Key } from "lucide-react";

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
          <div className="p-4 bg-kk-beige-dark border border-kk-blue/10 rounded text-kk-blue shadow-sm">
            <Shield size={40} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-kk-blue uppercase tracking-tight">Güvenlik ve Erişim</h2>
            <p className="text-sm text-kk-text-muted mt-1 max-w-md">Hesap güvenliğinizi artırın ve şifrenizi güncelleyin.</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Şifre Değiştirme */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            <div>
              <h3 className="text-xs font-black text-kk-blue uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Key size={14} /> Şifre Güncelleme
              </h3>
              <p className="text-[12px] text-kk-text-muted leading-relaxed">
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
          className="px-10 py-3 bg-kk-blue text-kk-beige rounded font-bold text-xs uppercase tracking-[0.15em] hover:bg-kk-blue-light active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
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
      <label className="text-[10px] font-black text-kk-text-muted uppercase tracking-widest ml-0.5">{label}</label>
      <input 
        type={type} 
        className="w-full px-4 py-3 bg-kk-beige-dark/20 border border-kk-blue/10 rounded text-sm font-medium text-kk-blue focus:outline-none focus:ring-1 focus:ring-kk-blue-light transition-all shadow-sm"
      />
    </div>
  );
}
