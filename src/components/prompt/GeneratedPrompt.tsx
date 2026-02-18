"use client";

import { useState } from "react";
import type { PromptData } from "@/types/prompt";
import { PROMPT_FIELDS } from "@/types/prompt";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface GeneratedPromptProps {
  data: PromptData;
}

export function GeneratedPrompt({ data }: GeneratedPromptProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    const sections = PROMPT_FIELDS.filter((f) => data[f.key].trim()).map(
      (f) => `## ${f.label}\n${data[f.key].trim()}`
    );

    if (sections.length === 0) {
      return "Start filling in the fields above to generate your prompt...";
    }

    return `# ${data.name || "Untitled Prompt"}\n\n${sections.join("\n\n")}`;
  };

  const promptText = generateText();
  const hasContent = PROMPT_FIELDS.some((f) => data[f.key].trim());

  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    toast("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-sw-border bg-sw-surface/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-sw-border px-5 py-3">
        <h3 className="font-heading text-xs text-neon-pink">
          GENERATED PROMPT
        </h3>
        {hasContent && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-5 font-code text-sm leading-relaxed text-text-primary">
        {promptText}
      </pre>
    </div>
  );
}
