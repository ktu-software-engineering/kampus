"use client";

import React, { useState, useEffect } from "react";
import { Mail, User as UserIcon, Building2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ProfileSettingsPage() {
  const { user, loading } = useCurrentUser();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setFullName(user.full_name ?? "");
  }, [user]);

  const hasChange = !!user && fullName.trim() !== (user.full_name ?? "").trim() && fullName.trim().length >= 2;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!hasChange) return;
    setSaving(true); setError(""); setSuccess(false);

    const res = await fetch("/api/settings/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName.trim() }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Güncelleme başarısız."); return; }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  if (loading) return <div className="text-kk-text-muted text-sm py-10 text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-kk-blue tracking-tight mb-1">Profil Bilgileri</h2>
        <p className="text-sm text-kk-text-muted">Ad soyadınızı güncelleyebilirsiniz. Diğer bilgiler değiştirilemez.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 max-w-lg">
        {error   && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">Profil güncellendi.</div>}

        {/* Ad Soyad */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-kk-text-muted uppercase tracking-widest flex items-center gap-1.5">
            <UserIcon size={13} /> Ad Soyad
          </label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] rounded-xl text-sm text-kk-blue outline-none focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10 transition-all"
          />
        </div>

        {/* E-posta — salt okunur */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-kk-text-muted uppercase tracking-widest flex items-center gap-1.5">
            <Mail size={13} /> E-posta
          </label>
          <input value={user?.email ?? ""} disabled
            className="w-full px-4 py-3 bg-[#f5f1ea]/50 border-[1.5px] border-[#e8e2d9] rounded-xl text-sm text-kk-text-muted outline-none cursor-not-allowed opacity-70" />
          <p className="text-xs text-kk-text-muted ml-1">E-posta adresi değiştirilemez.</p>
        </div>

        {/* Üniversite — salt okunur */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-kk-text-muted uppercase tracking-widest flex items-center gap-1.5">
            <Building2 size={13} /> Üniversite
          </label>
          <input value="Karadeniz Teknik Üniversitesi" disabled
            className="w-full px-4 py-3 bg-[#f5f1ea]/50 border-[1.5px] border-[#e8e2d9] rounded-xl text-sm text-kk-text-muted outline-none cursor-not-allowed opacity-70" />
          <p className="text-xs text-kk-text-muted ml-1">Üniversite bilgisi değiştirilemez.</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={!hasChange || saving}
            className="px-8 py-3 bg-kk-blue text-kk-beige rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
            {saving ? "Kaydediliyor..." : "Bilgileri Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
