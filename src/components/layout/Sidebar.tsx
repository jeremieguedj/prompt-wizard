"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function SidebarContent() {
  const { user, profile, signOut } = useAuth();
  const { prompts, loading, closeSidebar } = useSidebar();
  const searchParams = useSearchParams();
  const activePromptId = searchParams.get("prompt");

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-3xl">🧙</div>
        <p className="font-heading text-[10px] leading-relaxed text-neon-purple">
          SAVE YOUR PROMPTS
        </p>
        <p className="font-body text-sm text-text-secondary">
          Create an account to save prompts to the cloud and access them
          anywhere.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <Link
            href="/signup"
            onClick={closeSidebar}
            className="block w-full rounded-md border border-neon-pink/50 px-3 py-2 text-center font-body text-sm text-neon-pink hover:bg-neon-pink/10 transition-colors"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            onClick={closeSidebar}
            className="block w-full rounded-md px-3 py-2 text-center font-body text-sm text-text-secondary hover:text-neon-cyan transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* New Prompt button */}
      <div className="p-3">
        <Link
          href="/?prompt=new"
          onClick={closeSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-neon-cyan/40 px-3 py-2 font-body text-sm text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
        >
          <span>+</span>
          <span>New Prompt</span>
        </Link>
      </div>

      {/* Prompt list */}
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        {loading ? (
          <p className="px-2 py-4 text-center font-body text-xs text-text-muted animate-glow-pulse">
            Loading...
          </p>
        ) : prompts.length === 0 ? (
          <p className="px-2 py-4 text-center font-body text-xs text-text-muted">
            No prompts yet
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {prompts.map((p) => {
              const isActive =
                activePromptId === p.id ||
                (!activePromptId && prompts[0]?.id === p.id);
              return (
                <li key={p.id}>
                  <Link
                    href={`/?prompt=${p.id}`}
                    onClick={closeSidebar}
                    className={`block rounded-md px-3 py-2.5 transition-colors ${
                      isActive
                        ? "border-l-2 border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                        : "border-l-2 border-transparent text-text-secondary hover:bg-sw-surface-light hover:text-text-primary"
                    }`}
                  >
                    <span className="block truncate font-body text-sm">
                      {p.name || "Untitled"}
                    </span>
                    <span className="block font-code text-[10px] text-text-muted mt-0.5">
                      {p.updated_at ? timeAgo(p.updated_at) : ""}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      {/* User info at bottom */}
      <div className="border-t border-sw-border p-3">
        <div className="flex items-center justify-between">
          <span className="truncate font-body text-xs text-text-secondary">
            {profile?.display_name || user.email}
          </span>
          <button
            onClick={signOut}
            className="font-body text-xs text-text-muted hover:text-neon-pink transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

function SidebarShell({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}

export function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:sticky md:top-[59px] md:flex md:w-64 md:flex-shrink-0 md:flex-col md:h-[calc(100vh-59px)] md:overflow-y-auto border-r border-sw-border bg-sw-surface/50">
        <SidebarShell>
          <SidebarContent />
        </SidebarShell>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={closeSidebar}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sw-border bg-sw-surface animate-slide-in-left md:hidden">
            <SidebarShell>
              <SidebarContent />
            </SidebarShell>
          </aside>
        </>
      )}
    </>
  );
}
