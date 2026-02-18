"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <Card className="w-full p-6 sm:p-8">
        <h1 className="mb-6 text-center font-heading text-base text-neon-cyan neon-text-cyan sm:text-lg">
          LOG IN
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="login-email" className="mb-1 block font-body text-sm text-text-secondary">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1 block font-body text-sm text-text-secondary">
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>

          {error && (
            <p className="font-body text-sm text-neon-pink" role="alert">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Log In"}
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
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>

        <p className="mt-5 text-center font-body text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-neon-cyan hover:text-neon-pink transition-colors"
          >
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
