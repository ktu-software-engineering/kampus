"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function FeedbackButton() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTooltip(true), 1200);
    const closeTimer = setTimeout(() => setClosing(true), 5200);
    const hideTimer  = setTimeout(() => { setShowTooltip(false); setClosing(false); }, 5500);
    return () => { clearTimeout(showTimer); clearTimeout(closeTimer); clearTimeout(hideTimer); };
  }, []);

  if (loading) return null;

  const handleClick = () => {
    if (user) {
      router.push("/suggest?type=report");
    } else {
      router.push("/login?redirect=/suggest?type=report");
    }
  };

  return (
    <div className="fixed bottom-7 right-7 z-30">
      <style>{`
        @keyframes fb-tip-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fb-tip-out { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(6px); } }
      `}</style>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full right-0 mb-2.5 pointer-events-none"
          style={{ animation: `${closing ? "fb-tip-out 0.3s ease forwards" : "fb-tip-in 0.3s ease forwards"}` }}
        >
          <div className="bg-kk-blue text-kk-beige text-[12px] font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg">
            Sayfayı geliştirmemizde yardımcı ol 🙏
          </div>
          <div className="absolute right-4 top-full border-4 border-transparent border-t-kk-blue" />
        </div>
      )}

      <Button
        variant="kk-feedback-trigger"
        size="unsized"
        className="flex items-center gap-2"
        onClick={handleClick}
      >
        <Flag size={15} />
        Geri Bildirim
      </Button>
    </div>
  );
}
