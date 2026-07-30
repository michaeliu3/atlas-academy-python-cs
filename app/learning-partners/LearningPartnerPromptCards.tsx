"use client";

import { useState } from "react";
import type { LearningPartnerPrompt } from "@/lib/learning-partner-prompts";
import styles from "./learning-partners.module.css";

type LearningPartnerPromptCardsProps = {
  prompts: readonly LearningPartnerPrompt[];
};

export function LearningPartnerPromptCards({
  prompts,
}: LearningPartnerPromptCardsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyUnavailable, setCopyUnavailable] = useState(false);

  const copyPrompt = async (prompt: LearningPartnerPrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.startupPrompt);
      setCopiedId(prompt.id);
      setCopyUnavailable(false);
    } catch {
      setCopyUnavailable(true);
    }
  };

  return (
    <div className={styles.promptGrid}>
      {prompts.map((prompt) => (
        <article
          aria-labelledby={`${prompt.id}-title`}
          className={styles.promptCard}
          key={prompt.id}
        >
          <p className="kicker">{prompt.role}</p>
          <h2 id={`${prompt.id}-title`}>{prompt.title}</h2>
          <p className={styles.summary}>{prompt.summary}</p>

          <section aria-labelledby={`${prompt.id}-best-for`}>
            <h3 id={`${prompt.id}-best-for`}>Best for</h3>
            <ul>
              {prompt.bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby={`${prompt.id}-boundaries`}>
            <h3 id={`${prompt.id}-boundaries`}>How this role stays useful</h3>
            <ul>
              {prompt.boundaries.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className={styles.copyArea}>
            <button onClick={() => copyPrompt(prompt)} type="button">
              {copiedId === prompt.id
                ? "Startup prompt copied"
                : `Copy ${prompt.title} startup prompt`}
            </button>
            <p aria-live="polite" className={styles.copyStatus}>
              {copiedId === prompt.id
                ? "Paste this into a separate chat, complete the context block, then begin with one small question."
                : null}
              {copyUnavailable
                ? "Copy is unavailable in this browser. Open the full prompt below and select it manually."
                : null}
            </p>
          </div>

          <details>
            <summary>Show the full copyable startup prompt</summary>
            <pre>
              <code>{prompt.startupPrompt}</code>
            </pre>
          </details>
        </article>
      ))}
    </div>
  );
}
