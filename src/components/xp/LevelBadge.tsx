"use client";

import { getLevelForXP } from "@/lib/xp";
import { LEVELS } from "@/types/xp";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const levelInfo = LEVELS.find((l) => l.level === level) ?? LEVELS[0];
  const glowIntensity = Math.min(level / 10, 1);

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizes[size]} flex items-center justify-center rounded-full border-2 border-neon-purple bg-sw-surface font-heading text-neon-purple`}
        style={{
          boxShadow: `0 0 ${8 * glowIntensity}px rgba(200, 88, 255, ${
            0.3 + glowIntensity * 0.4
          }), 0 0 ${20 * glowIntensity}px rgba(200, 88, 255, ${
            0.1 + glowIntensity * 0.2
          })`,
        }}
      >
        {level}
      </div>
      {size !== "sm" && (
        <span className="font-body text-xs text-text-secondary">
          {levelInfo.title}
        </span>
      )}
    </div>
  );
}
