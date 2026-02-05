import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({
  className = "",
  glow = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-sw-border bg-sw-surface/80 backdrop-blur-sm ${
        glow ? "card-hover" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
