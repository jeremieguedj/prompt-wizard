import { PROMPT_FIELDS, type PromptData, type PromptFieldKey } from "@/types/prompt";
import { LEVELS, type LevelInfo } from "@/types/xp";

function calculateFieldXP(content: string, maxXP: number): number {
  const length = content.trim().length;
  if (length === 0) return 0;
  if (length < 10) return Math.round(maxXP * 0.1); // Minimal
  if (length < 40) return Math.round(maxXP * 0.3); // Basic
  if (length < 100) return Math.round(maxXP * 0.6); // Good
  if (length < 200) return Math.round(maxXP * 0.85); // Great
  return maxXP; // Exceptional
}

export function calculateTotalXP(data: PromptData): number {
  return PROMPT_FIELDS.reduce((total, field) => {
    return total + calculateFieldXP(data[field.key], field.maxXP);
  }, 0);
}

export function calculateFieldXPValue(
  key: PromptFieldKey,
  content: string
): number {
  const field = PROMPT_FIELDS.find((f) => f.key === key);
  if (!field) return 0;
  return calculateFieldXP(content, field.maxXP);
}

export function getLevelForXP(totalXP: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXPProgress(totalXP: number): {
  current: number;
  needed: number;
  percentage: number;
} {
  const level = getLevelForXP(totalXP);
  const nextLevel = LEVELS.find((l) => l.level === level.level + 1);

  if (!nextLevel) {
    return { current: totalXP, needed: totalXP, percentage: 100 };
  }

  const xpInLevel = totalXP - level.minXP;
  const xpForLevel = nextLevel.minXP - level.minXP;
  const percentage = Math.min(100, Math.round((xpInLevel / xpForLevel) * 100));

  return { current: xpInLevel, needed: xpForLevel, percentage };
}

export function getFieldXPPercentage(
  key: PromptFieldKey,
  content: string
): number {
  const field = PROMPT_FIELDS.find((f) => f.key === key);
  if (!field) return 0;
  const xp = calculateFieldXP(content, field.maxXP);
  return Math.round((xp / field.maxXP) * 100);
}
