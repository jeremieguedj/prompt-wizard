"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
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

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>

        <p className="mt-5 text-center font-body text-xs text-text-muted">
          Email &amp; password login coming soon.
        </p>

        <p className="mt-4 text-center font-body text-sm text-text-muted">
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
