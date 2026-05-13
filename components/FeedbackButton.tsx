"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

export function FeedbackButton() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

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
