"use client";

import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-lg border border-sw-border bg-sw-surface px-4 py-3 font-body text-base text-text-primary placeholder:text-text-muted input-glow transition-all duration-200 resize-none ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
