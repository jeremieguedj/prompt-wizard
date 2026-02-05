export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
}

export interface XPBreakdown {
  field: string;
  xp: number;
  maxXP: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Prompt Newbie", minXP: 0, maxXP: 500 },
  { level: 2, title: "Code Whisperer", minXP: 500, maxXP: 1000 },
  { level: 3, title: "Syntax Sorcerer", minXP: 1000, maxXP: 1750 },
  { level: 4, title: "Debug Dancer", minXP: 1750, maxXP: 2500 },
  { level: 5, title: "Algorithm Artisan", minXP: 2500, maxXP: 3250 },
  { level: 6, title: "Stack Sage", minXP: 3250, maxXP: 4000 },
  { level: 7, title: "Prompt Architect", minXP: 4000, maxXP: 4500 },
  { level: 8, title: "Neural Navigator", minXP: 4500, maxXP: 5000 },
  { level: 9, title: "AI Maestro", minXP: 5000, maxXP: 6000 },
  { level: 10, title: "Prompt Wizard", minXP: 6000, maxXP: 999999 },
];
