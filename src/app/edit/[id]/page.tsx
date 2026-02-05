"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { PromptForm } from "@/components/prompt/PromptForm";
import type { PromptData } from "@/types/prompt";

export default function EditPromptPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [prompt, setPrompt] = useState<PromptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchPrompt = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        router.push("/library");
        return;
      }

      setPrompt(data as PromptData);
      setLoading(false);
    };

    fetchPrompt();
  }, [id, user, authLoading, router]);

  if (authLoading || loading || !prompt) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-body text-sm text-text-muted animate-glow-pulse">
          Loading prompt...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.push("/library")}
          className="font-body text-xs text-text-muted hover:text-neon-cyan transition-colors"
        >
          &larr; Back to Library
        </button>
      </div>
      <PromptForm initialData={prompt} promptId={id} />
    </div>
  );
}
