"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAnonExpiry } from "@/hooks/usePromptForm";

export function AnonBanner() {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const expiry = getAnonExpiry();
      if (!expiry) {
        setTimeLeft("");
        return;
      }
      const diff = expiry - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-6 flex flex-col gap-2 rounded-lg border border-neon-yellow/30 bg-neon-yellow/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-neon-yellow text-sm">&#9888;</span>
        <span className="font-body text-xs text-neon-yellow/90">
          Your work is saved locally
          {timeLeft && ` — expires in ${timeLeft}`}.
        </span>
      </div>
      <Link
        href="/signup"
        className="font-body text-xs text-neon-cyan hover:text-neon-pink transition-colors underline underline-offset-2"
      >
        Create an account to save permanently
      </Link>
    </div>
  );
}
