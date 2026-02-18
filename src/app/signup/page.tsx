"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { clearAnonStorage } from "@/hooks/usePromptForm";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const migrateAnonData = async (userId: string) => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("prompt-wizard-anon");
    if (!stored) return;

    try {
      const data = JSON.parse(stored);
      const supabase = createClient();
      await supabase.from("prompts").insert({
        user_id: userId,
        name: data.name || "Migrated Prompt",
        title: data.title || "",
        short_description: data.short_description || "",
        design_language: data.design_language || "",
        ui_elements: data.ui_elements || "",
        user_flows: data.user_flows || "",
        user_input_logic: data.user_input_logic || "",
        xp_earned: data.xp_earned || 0,
      });
      clearAnonStorage();
    } catch {
      // Migration failed silently — not critical
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split("@")[0] },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If user was auto-confirmed (no email confirmation required)
    if (data.user && data.session) {
      await migrateAnonData(data.user.id);
      router.push("/");
      router.refresh();
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  };

  if (success) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
        <Card className="w-full p-6 text-center sm:p-8">
          <h1 className="mb-4 font-heading text-base text-neon-green sm:text-lg">
            CHECK YOUR EMAIL
          </h1>
          <p className="font-body text-sm text-text-secondary leading-relaxed">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <Card className="w-full p-6 sm:p-8">
        <h1 className="mb-6 text-center font-heading text-base text-neon-cyan neon-text-cyan sm:text-lg">
          SIGN UP
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label htmlFor="signup-name" className="mb-1 block font-body text-sm text-text-secondary">
              Display Name
            </label>
            <Input
              id="signup-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="mb-1 block font-body text-sm text-text-secondary">
              Email
            </label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="mb-1 block font-body text-sm text-text-secondary">
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="font-body text-sm text-neon-pink" role="alert">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-sw-border" />
          <span className="font-body text-xs text-text-muted">OR</span>
          <div className="h-px flex-1 bg-sw-border" />
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleSignup}
        >
          Continue with Google
        </Button>

        <p className="mt-5 text-center font-body text-sm text-text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-neon-cyan hover:text-neon-pink transition-colors"
          >
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
