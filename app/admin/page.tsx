"use client";

import { useState, useEffect } from "react";
import { Users, Flag, MessageSquare, BookCheck } from "lucide-react";

interface Stats {
  userCount: number;
  reviewCount: number;
  pendingReports: number;
  newSuggestions: number;
  chart: { date: string; label: string; count: number }[];
}

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{title}</span>
        <span className={`p-2 rounded-lg ${color}`}>{icon}</span>
      </div>
      <div className="text-3xl font-black text-kk-blue dark:text-white tracking-tight">{value}</div>
    </div>
  );
}

function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-kk-blue dark:text-white">{d.count || ""}</span>
          <div className="w-full rounded-t-md bg-kk-blue-light/20 dark:bg-zinc-700 relative overflow-hidden" style={{ height: "120px" }}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-kk-blue-light dark:bg-kk-blue rounded-t-md transition-all duration-700"
              style={{ height: `${(d.count / max) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-400 text-sm py-20 text-center">Yükleniyor...</div>;
  if (!stats) return <div className="text-red-500 text-sm py-20 text-center">Veriler yüklenemedi.</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-8">
        <h1 className="text-2xl font-black text-kk-blue dark:text-white uppercase tracking-tighter">Sistem Analizi</h1>
        <p className="text-kk-text-muted dark:text-zinc-400 mt-1 text-sm font-medium">KampusKarne platformu gerçek zamanlı operasyonel verileri.</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Toplam Kullanıcı"    value={stats.userCount?.toLocaleString("tr-TR") ?? 0}    icon={<Users size={18} />}       color="bg-blue-50 dark:bg-blue-900/20 text-blue-600" />
        <StatCard title="Değerlendirmeler"    value={stats.reviewCount?.toLocaleString("tr-TR") ?? 0}   icon={<BookCheck size={18} />}   color="bg-green-50 dark:bg-green-900/20 text-green-600" />
        <StatCard title="Bekleyen Şikayetler" value={stats.pendingReports ?? 0}                          icon={<Flag size={18} />}        color="bg-red-50 dark:bg-red-900/20 text-red-600" />
        <StatCard title="Yeni Öneriler"       value={stats.newSuggestions ?? 0}                          icon={<MessageSquare size={18} />} color="bg-amber-50 dark:bg-amber-900/20 text-amber-600" />
      </div>

      {/* Grafik */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-sm font-black text-kk-blue dark:text-white uppercase tracking-widest">Son 7 Günlük Değerlendirmeler</h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Günlük yorum sayısı dağılımı</p>
        </div>
        {stats.chart && stats.chart.length > 0
          ? <BarChart data={stats.chart} />
          : <div className="text-slate-400 text-sm text-center py-10">Henüz veri yok.</div>
        }
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500">
          <span>Toplam 7 günlük yorum: <strong className="text-kk-blue dark:text-white">{stats.chart?.reduce((s, d) => s + d.count, 0) ?? 0}</strong></span>
          <span>Günlük ortalama: <strong className="text-kk-blue dark:text-white">{((stats.chart?.reduce((s, d) => s + d.count, 0) ?? 0) / 7).toFixed(1)}</strong></span>
        </div>
      </div>
    </div>
  );
}
