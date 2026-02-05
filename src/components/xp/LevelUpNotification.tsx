"use client";

import { useEffect, useState } from "react";
import { LEVELS } from "@/types/xp";

interface LevelUpNotificationProps {
  level: number;
  onComplete?: () => void;
}

export function LevelUpNotification({
  level,
  onComplete,
}: LevelUpNotificationProps) {
  const [visible, setVisible] = useState(true);
  const levelInfo = LEVELS.find((l) => l.level === level) ?? LEVELS[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="animate-level-up flex flex-col items-center gap-3 rounded-2xl border border-neon-purple bg-sw-bg/95 px-8 py-6 backdrop-blur-lg neon-glow-purple">
        <span className="font-heading text-xs text-neon-yellow">
          LEVEL UP!
        </span>
        <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-neon-purple bg-sw-surface text-2xl font-heading text-neon-purple neon-glow-purple">
          {level}
        </div>
        <span className="font-body text-sm text-neon-cyan">
          {levelInfo.title}
        </span>
      </div>
    </div>
  );
}
