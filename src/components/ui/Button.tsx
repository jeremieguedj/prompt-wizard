"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-body font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-neon-pink/20 text-neon-pink border border-neon-pink/50 hover:bg-neon-pink/30 hover:shadow-[0_0_15px_rgba(255,45,149,0.3)] active:scale-[0.98]",
      secondary:
        "bg-sw-surface text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/10 hover:border-neon-cyan/60 active:scale-[0.98]",
      ghost:
        "text-text-secondary hover:text-neon-cyan hover:bg-neon-cyan/5",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
      md: "px-4 py-2 text-sm rounded-lg gap-2",
      lg: "px-6 py-3 text-base rounded-lg gap-2",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
