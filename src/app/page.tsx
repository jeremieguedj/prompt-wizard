import { PromptForm } from "@/components/prompt/PromptForm";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-xl text-neon-pink neon-text-pink sm:text-2xl">
          PROMPT WIZARD
        </h1>
        <p className="mt-3 font-body text-base text-text-secondary">
          Build structured prompts for AI coding tools. Fill the fields, earn XP,
          and craft the perfect prompt.
        </p>
      </div>
      <PromptForm />
    </div>
  );
}
