"use client";

import { Textarea } from "@/components/ui/Textarea";
import { getFieldXPPercentage, calculateFieldXPValue } from "@/lib/xp";
import type { PromptField, PromptFieldKey } from "@/types/prompt";

interface FieldCardProps {
  field: PromptField;
  value: string;
  onChange: (key: PromptFieldKey, value: string) => void;
}

export function FieldCard({ field, value, onChange }: FieldCardProps) {
  const xpPercent = getFieldXPPercentage(field.key, value);
  const xpValue = calculateFieldXPValue(field.key, value);
  const glowOpacity = xpPercent / 100;

  return (
    <div
      className="group rounded-xl border border-sw-border bg-sw-surface/80 p-5 backdrop-blur-sm transition-all duration-300"
      style={{
        borderColor:
          xpPercent > 0
            ? `rgba(200, 88, 255, ${0.2 + glowOpacity * 0.5})`
            : undefined,
        boxShadow:
          xpPercent > 50
            ? `0 0 ${10 * glowOpacity}px rgba(200, 88, 255, ${
                glowOpacity * 0.15
              })`
            : undefined,
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-xs text-neon-cyan leading-relaxed">
            {field.label}
          </h3>
          <p className="mt-1 font-body text-sm text-text-muted leading-relaxed">
            {field.description}
          </p>
        </div>

        {/* XP indicator */}
        <div className="flex flex-col items-end shrink-0">
          <span className="font-code text-xs text-neon-purple">
            {xpValue}/{field.maxXP} XP
          </span>
          <div className="mt-1.5 h-1.5 w-20 overflow-hidden rounded-full bg-sw-surface-light">
            <div
              className="h-full rounded-full bg-neon-purple transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Input */}
      <Textarea
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        rows={4}
      />
    </div>
  );
}
