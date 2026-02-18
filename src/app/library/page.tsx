"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { PromptCard } from "@/components/library/PromptCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { PromptData } from "@/types/prompt";

interface PromptRow extends PromptData {
  id: string;
  user_id: string;
}

export default function LibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchPrompts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("prompts")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      setPrompts((data as PromptRow[]) ?? []);
      setLoading(false);
    };

    fetchPrompts();
  }, [user, authLoading, router]);

  const filtered = prompts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("prompts").delete().eq("id", id);
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-body text-sm text-text-muted animate-glow-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-base text-neon-cyan neon-text-cyan sm:text-lg">
          YOUR PROMPTS
        </h1>
        <div className="flex items-center gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="w-48 sm:w-64"
          />
          <Button onClick={() => router.push("/")}>New Prompt</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <p className="font-body text-sm text-text-muted">
            {prompts.length === 0
              ? "No prompts yet. Start creating!"
              : "No prompts match your search."}
          </p>
          {prompts.length === 0 && (
            <Button onClick={() => router.push("/")}>
              Create Your First Prompt
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onDelete={() => handleDelete(prompt.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
