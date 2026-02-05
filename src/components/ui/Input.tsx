"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border border-sw-border bg-sw-surface px-4 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted input-glow transition-all duration-200 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
