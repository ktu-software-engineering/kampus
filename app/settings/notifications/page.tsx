"use client";

import React, { useState } from "react";
import { Bell, Mail, MessageSquare, Star, Info, ShieldCheck } from "lucide-react";

export default function NotificationsSettingsPage() {
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
            <Bell size={40} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Bildirim Tercihleri</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-md">Platform üzerindeki etkileşimler ve önemli güncellemeler hakkında nasıl bilgilendirilmek istediğinizi seçin.</p>
          </div>
        </div>

        <div className="space-y-6">
          <NotificationToggle 
            title="E-posta Bildirimleri" 
            description="Yeni değerlendirmeler, yanıtlar ve haftalık özetler e-posta adresinize gönderilir."
            icon={<Mail size={18} />}
            defaultChecked={true}
          />
          <NotificationToggle 
            title="Değerlendirme Yanıtları" 
            description="Yaptığınız yorumlara hocalardan veya diğer öğrencilerden yanıt geldiğinde haber ver."
            icon={<MessageSquare size={18} />}
            defaultChecked={true}
          />
          <NotificationToggle 
            title="Sistem Duyuruları" 
            description="Yeni özellikler, kampanya ve platform güncellemeleri hakkında bilgilendirme."
            icon={<Info size={18} />}
            defaultChecked={false}
          />
          <NotificationToggle 
            title="Akademik Uyarılar" 
            description="Takip ettiğiniz hocalara veya derslere yeni bir veri girişi yapıldığında bildirim al."
            icon={<Star size={18} />}
            defaultChecked={true}
          />
        </div>
      </section>

      {/* İşlem Butonu */}
      <div className="pt-4 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-3 bg-[#06283a] dark:bg-zinc-100 text-white dark:text-[#06283a] rounded font-bold text-xs uppercase tracking-[0.15em] hover:bg-opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
        >
          {isSaving ? "İşleniyor..." : "Tercihleri Kaydet"}
        </button>
      </div>
    </div>
  );
}

function NotificationToggle({ title, description, icon, defaultChecked }: { title: string, description: string, icon: React.ReactNode, defaultChecked: boolean }) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-slate-100 dark:border-zinc-800 flex items-start justify-between gap-6 hover:border-slate-200 dark:hover:border-zinc-700 transition-colors shadow-sm">
      <div className="flex gap-4">
        <div className="p-2 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded text-slate-600 dark:text-zinc-400">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">{title}</h3>
          <p className="text-[12px] text-slate-500 dark:text-zinc-500 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </div>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={`relative mt-1 w-10 h-5 rounded-full transition-colors duration-200 ${enabled ? 'bg-[#06283a]' : 'bg-slate-300 dark:bg-zinc-700'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}