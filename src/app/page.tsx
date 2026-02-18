"use client";

import { useEffect, useState } from "react";
import { PromptForm } from "@/components/prompt/PromptForm";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { PromptData } from "@/types/prompt";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [initialData, setInitialData] = useState<PromptData | undefined>();
  const [promptId, setPromptId] = useState<string | undefined>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setReady(true);
      return;
    }

    const supabase = createClient();
    supabase
      .from("prompts")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const prompt = data[0];
          setInitialData({
            name: prompt.name ?? "",
            title: prompt.title ?? "",
            short_description: prompt.short_description ?? "",
            design_language: prompt.design_language ?? "",
            ui_elements: prompt.ui_elements ?? "",
            user_flows: prompt.user_flows ?? "",
            user_input_logic: prompt.user_input_logic ?? "",
            xp_earned: prompt.xp_earned ?? 0,
            is_active: prompt.is_active ?? true,
          });
          setPromptId(prompt.id);
        }
        setReady(true);
      });
  }, [user, authLoading]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-xl text-neon-pink neon-text-pink sm:text-2xl">
            PROMPT WIZARD
          </h1>
          <p className="mt-4 font-body text-lg text-text-secondary">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-xl text-neon-pink neon-text-pink sm:text-2xl">
          PROMPT WIZARD
        </h1>
        <p className="mt-4 font-body text-lg text-text-secondary">
          Build structured prompts for AI coding tools. Fill the fields, earn XP,
          and craft the perfect prompt.
        </p>
      </div>
      <PromptForm
        key={promptId ?? "new"}
        initialData={initialData}
        promptId={promptId}
      />
    </div>
  );
}
