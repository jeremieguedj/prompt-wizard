"use client";

import { PROMPT_FIELDS, type PromptData } from "@/types/prompt";
import { usePromptForm } from "@/hooks/usePromptForm";
import { FieldCard } from "./FieldCard";
import { GeneratedPrompt } from "./GeneratedPrompt";
import { XPBar } from "@/components/xp/XPBar";
import { LevelBadge } from "@/components/xp/LevelBadge";
import { LevelUpNotification } from "@/components/xp/LevelUpNotification";
import { AnonBanner } from "@/components/prompt/AnonBanner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";
import { createClient } from "@/lib/supabase/client";
import { getXPProgress, getLevelForXP } from "@/lib/xp";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PromptFormProps {
  initialData?: PromptData;
  promptId?: string;
}

export function PromptForm({ initialData, promptId }: PromptFormProps) {
  const { user, refreshProfile } = useAuth();
  const { refreshPrompts } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    data,
    totalXP,
    currentLevel,
    leveledUp,
    updateField,
    updateName,
    resetForm,
    dismissLevelUp,
  } = usePromptForm(initialData);

  const level = getLevelForXP(totalXP);
  const progress = getXPProgress(totalXP);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const supabase = createClient();

    try {
      if (promptId) {
        // Update existing
        const { error } = await supabase
          .from("prompts")
          .update({
            name: data.name,
            title: data.title,
            short_description: data.short_description,
            design_language: data.design_language,
            ui_elements: data.ui_elements,
            user_flows: data.user_flows,
            user_input_logic: data.user_input_logic,
            xp_earned: totalXP,
          })
          .eq("id", promptId);
        if (error) throw error;
        toast("Prompt saved!");
      } else {
        // Create new
        const { data: newRow, error } = await supabase
          .from("prompts")
          .insert({
            user_id: user.id,
            name: data.name,
            title: data.title,
            short_description: data.short_description,
            design_language: data.design_language,
            ui_elements: data.ui_elements,
            user_flows: data.user_flows,
            user_input_logic: data.user_input_logic,
            xp_earned: totalXP,
          })
          .select("id")
          .single();
        if (error) throw error;
        toast("Prompt created!");
        if (newRow) {
          router.replace(`/?prompt=${newRow.id}`, { scroll: false });
        }
      }

      // Update profile XP
      await supabase
        .from("profiles")
        .update({
          total_xp: totalXP,
          current_level: currentLevel,
        })
        .eq("id", user.id);

      await refreshProfile();
      await refreshPrompts();
    } catch {
      toast("Failed to save prompt", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Level up notification */}
      {leveledUp && (
        <LevelUpNotification level={leveledUp} onComplete={dismissLevelUp} />
      )}

      {/* Anon banner */}
      {!user && <AnonBanner />}

      {/* XP Overview */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <LevelBadge level={level.level} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-code text-base text-neon-yellow">
                {totalXP} XP
              </span>
              <span className="font-code text-sm text-text-secondary">
                / {level.maxXP === 999999 ? "MAX" : level.maxXP} XP
              </span>
            </div>
            <XPBar percentage={progress.percentage} size="md" />
          </div>
        </div>
      </div>

      {/* Prompt name */}
      <div className="mb-6">
        <label className="block mb-2 font-heading text-sm text-text-secondary">
          PROMPT NAME
        </label>
        <Input
          value={data.name}
          onChange={(e) => updateName(e.target.value)}
          placeholder="Give your prompt a name..."
        />
      </div>

      {/* Fields */}
      <div className="grid gap-5">
        {PROMPT_FIELDS.map((field) => (
          <FieldCard
            key={field.key}
            field={field}
            value={data[field.key]}
            onChange={updateField}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        {user && (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : promptId ? "Save Changes" : "Save Prompt"}
          </Button>
        )}
        <Button variant="ghost" onClick={resetForm}>
          Reset
        </Button>
      </div>

      {/* Generated Prompt */}
      <div className="mt-8">
        <GeneratedPrompt data={data} />
      </div>
    </div>
  );
}
