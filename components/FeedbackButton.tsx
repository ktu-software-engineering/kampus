"use client";

import Link from "next/link";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Geri Bildirim Butonu
 * Kullanıcıyı tek bir merkezden yönetilen /suggest sayfasına yönlendirir.
 * Bu sayede geri bildirimler, hoca/ders önerileri ile aynı yerden toplanır.
 */
export function FeedbackButton() {
  return (
    <div
      className="fixed bottom-7 right-7 z-30"
    >
      <Link href="/suggest?type=report">
        <Button
          variant="kk-feedback-trigger"
          size="unsized"
          className="flex items-center gap-2"
        >
          <Flag size={15} />
          Geri Bildirim
        </Button>
      </Link>
    </div>
  );
}
