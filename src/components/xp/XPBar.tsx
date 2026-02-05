"use client";

interface XPBarProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
}

export function XPBar({ percentage, size = "md" }: XPBarProps) {
  const heights = { sm: "h-1.5", md: "h-3", lg: "h-4" };

  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-sw-surface-light ${heights[size]}`}
    >
      <div
        className={`${heights[size]} xp-bar-shimmer rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(100, percentage)}%` }}
      />
    </div>
  );
}
