"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { PromptData } from "@/types/prompt";
import { getLevelForXP } from "@/lib/xp";

interface PromptCardProps {
  prompt: PromptData & { id: string };
  onDelete: () => void;
}

export function PromptCard({ prompt, onDelete }: PromptCardProps) {
  const preview = prompt.short_description || prompt.title || "No description";
  const date = prompt.updated_at
    ? new Date(prompt.updated_at).toLocaleDateString()
    : "";

  return (
    <Card glow className="flex flex-col justify-between p-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-heading text-xs text-neon-cyan leading-relaxed truncate max-w-[70%]">
            {prompt.name}
          </h3>
          <span className="font-code text-xs text-neon-purple shrink-0">
            {prompt.xp_earned} XP
          </span>
        </div>
        <p className="mb-3 font-body text-sm text-text-secondary line-clamp-2 leading-relaxed">
          {preview}
        </p>
        <p className="font-code text-xs text-text-muted">{date}</p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link href={`/edit/${prompt.id}`}>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
