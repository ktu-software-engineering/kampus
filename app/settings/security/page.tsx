"use client";

import React, { useState } from "react";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function SecuritySettingsPage() {
  const [current, setCurrent]   = useState("");
  const [newPwd, setNewPwd]     = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]   = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const passwordsMatch = confirm === "" || newPwd === confirm;
  const canSubmit = current.length > 0 && newPwd.length >= 8 && newPwd === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true); setError(""); setSuccess(false);

    const res = await fetch("/api/settings/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: current, new_password: newPwd }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Şifre değiştirilemedi."); return; }
    setSuccess(true);
    setCurrent(""); setNewPwd(""); setConfirm("");
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-kk-beige-dark border border-kk-blue/10 rounded-xl text-kk-blue">
          <Shield size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-kk-blue tracking-tight">Güvenlik ve Şifre</h2>
          <p className="text-sm text-kk-text-muted mt-0.5">Hesap şifrenizi güncelleyin.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        {error   && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">Şifreniz başarıyla güncellendi.</div>}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-kk-text-muted uppercase tracking-widest">Mevcut Şifre</label>
          <div className="relative">
            <input type={showCurrent ? "text" : "password"} value={current} onChange={e => setCurrent(e.target.value)}
              className="w-full px-4 py-3 pr-11 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] rounded-xl text-sm text-kk-blue outline-none focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10 transition-all" />
            <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-kk-text-muted hover:text-kk-blue">
              {showCurrent ? <EyeOff size={17}/> : <Eye size={17}/>}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-kk-text-muted uppercase tracking-widest">Yeni Şifre</label>
          <div className="relative">
            <input type={showNew ? "text" : "password"} value={newPwd} onChange={e => setNewPwd(e.target.value)}
              className="w-full px-4 py-3 pr-11 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] rounded-xl text-sm text-kk-blue outline-none focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10 transition-all" />
            <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-kk-text-muted hover:text-kk-blue">
              {showNew ? <EyeOff size={17}/> : <Eye size={17}/>}
            </button>
          </div>
          {newPwd.length > 0 && newPwd.length < 8 && <p className="text-xs text-red-500 ml-1">En az 8 karakter olmalıdır.</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-kk-text-muted uppercase tracking-widest">Yeni Şifre (Tekrar)</label>
          <div className="relative">
            <input type={showConf ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)}
              className={`w-full px-4 py-3 pr-11 bg-[#f5f1ea] border-[1.5px] rounded-xl text-sm text-kk-blue outline-none focus:ring-4 transition-all ${
                passwordsMatch ? "border-[#e8e2d9] focus:border-kk-blue-light focus:ring-kk-blue-light/10" : "border-red-400 focus:border-red-400 focus:ring-red-100"
              }`} />
            <button type="button" onClick={() => setShowConf(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-kk-text-muted hover:text-kk-blue">
              {showConf ? <EyeOff size={17}/> : <Eye size={17}/>}
            </button>
          </div>
          {!passwordsMatch && <p className="text-xs text-red-500 ml-1">Şifreler eşleşmiyor.</p>}
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={!canSubmit || saving}
            className="px-8 py-3 bg-kk-blue text-kk-beige rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
            {saving ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
