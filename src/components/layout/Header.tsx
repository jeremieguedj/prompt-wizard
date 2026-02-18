"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getLevelForXP, getXPProgress } from "@/lib/xp";
import { LevelBadge } from "@/components/xp/LevelBadge";
import { XPBar } from "@/components/xp/XPBar";

export function Header() {
  const { user, profile, signOut } = useAuth();
  const totalXP = profile?.total_xp ?? 0;
  const level = getLevelForXP(totalXP);
  const progress = getXPProgress(totalXP);

  return (
    <header className="sticky top-0 z-50 border-b border-sw-border bg-sw-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-xl" role="img" aria-label="wizard">
            🧙
          </span>
          <span className="font-heading text-xs text-neon-pink neon-text-pink group-hover:text-neon-cyan transition-colors sm:text-sm">
            PROMPT WIZARD
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* XP compact display */}
              <div className="hidden items-center gap-3 sm:flex">
                <LevelBadge level={level.level} size="sm" />
                <div className="w-32">
                  <XPBar percentage={progress.percentage} size="sm" />
                </div>
                <span className="font-code text-xs text-text-secondary">
                  {totalXP} XP
                </span>
              </div>

              <Link
                href="/library"
                className="font-body text-sm text-text-secondary hover:text-neon-cyan transition-colors"
              >
                Library
              </Link>

              <button
                onClick={signOut}
                className="font-body text-sm text-text-secondary hover:text-neon-pink transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-body text-sm text-text-secondary hover:text-neon-cyan transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md border border-neon-pink/50 px-3 py-1.5 font-body text-sm text-neon-pink hover:bg-neon-pink/10 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
