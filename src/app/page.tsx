"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PromptForm } from "@/components/prompt/PromptForm";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { PromptData } from "@/types/prompt";

function HomeContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const promptParam = searchParams.get("prompt");

  const [initialData, setInitialData] = useState<PromptData | undefined>();
  const [promptId, setPromptId] = useState<string | undefined>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setInitialData(undefined);
      setPromptId(undefined);
      setReady(true);
      return;
    }

    // "new" → blank form
    if (promptParam === "new") {
      setInitialData(undefined);
      setPromptId(undefined);
      setReady(true);
      return;
    }

    const supabase = createClient();

    if (promptParam) {
      // Load a specific prompt by ID
      supabase
        .from("prompts")
        .select("*")
        .eq("id", promptParam)
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setInitialData({
              name: data.name ?? "",
              title: data.title ?? "",
              short_description: data.short_description ?? "",
              design_language: data.design_language ?? "",
              ui_elements: data.ui_elements ?? "",
              user_flows: data.user_flows ?? "",
              user_input_logic: data.user_input_logic ?? "",
              xp_earned: data.xp_earned ?? 0,
              is_active: data.is_active ?? true,
            });
            setPromptId(data.id);
          } else {
            // Invalid ID — fall back to blank
            setInitialData(undefined);
            setPromptId(undefined);
          }
          setReady(true);
        });
    } else {
      // No param → load most recent (current behavior)
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
    }
  }, [user, authLoading, promptParam]);

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

export default function Home() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <HomeContent />
    </Suspense>
  );
}
