"use client";

import { useState } from "react";
import type { CourseModule } from "@/lib/module-catalog";
import {
  getOralDefenseGuide,
  lensInstruction,
  type OralDefenseGuide,
} from "@/lib/oral-defense-guide";
import { ModuleTextOralDefense } from "./ModuleTextOralDefense";
import styles from "./ModuleOralDefense.module.css";

type ModuleOralDefenseProps = {
  courseModule: CourseModule;
};

type CopyState = "idle" | "brief-copied" | "fallback";

const conversationMoves = [
  {
    number: "01",
    title: "Explain the model",
    detail: "Start in plain language. Name the representation, invariant, or central distinction before using jargon.",
  },
  {
    number: "02",
    title: "Trace or derive",
    detail: "Walk through one code path, diagram, proof step, or calculation. Say which assumption each step needs.",
  },
  {
    number: "03",
    title: "Stress the boundary",
    detail: "Find a counterexample, failure mode, ambiguity, or observation that would not establish the claim.",
  },
  {
    number: "04",
    title: "Transfer the idea",
    detail: "Use the same model in a new Atlas situation. Explain what changes and what must remain true.",
  },
  {
    number: "05",
    title: "Choose the next bridge",
    detail: "Calibrate confidence, name one fragile idea, and choose the smallest useful retrieval or review action.",
  },
] as const;

function liveChatBrief(courseModule: CourseModule, guide: OralDefenseGuide) {
  return `Act as my encouraging Atlas Academy oral-defense facilitator for Module ${courseModule.number}: ${courseModule.title}.

This is a formative conversation, not a pass/fail exam. The module-specific central model is: ${guide.centralModel}. Ask me to ${guide.traceOrDerivation}. Watch gently for this likely misconception: ${guide.misconception}. Ask me to state the boundary: ${guide.boundary}. End the intellectual work with this transfer: ${guide.transfer}.

Use my designated voice-enabled Teaching Assistant chat if the platform makes it available. Prefer the highest available live quality/reasoning setting that I select, but do not claim control over platform settings. Keep the visible chat as an accessible whiteboard: use supported display math for important equations, define symbols, provide a prose or ASCII fallback if rendering is uncertain, put code in language-labelled fenced blocks, and never rely on speech-only or visual-only explanation.

Begin with a plain-language invitation and the five-move agenda: explain the model; trace or derive; stress a boundary; transfer; choose a next bridge. Adapt one question at a time and wait for my answer before continuing. Include a prediction-before-reveal question and ask, “What would change your mind?” When I expose a misconception, name it constructively, give the smallest useful hint, and let me repair the answer rather than revealing it immediately. ${lensInstruction(guide)}

Evaluate reasoning, assumptions, evidence, counterexample/debugging skill, transfer, and reflection—not speed, accent, polish, or memorized phrasing. Do not ask for personal or private data. At the end, give me a concise evidence summary with: demonstrated models, fragile ideas, one misconception repaired, calibrated confidence, one retrieval prompt, and the smallest next bridge. Keep it local unless I set Record mode to the exact value “configured-notion-session-note”, this is my designated Teaching Assistant chat, its configured private destination is reachable, and I explicitly end this substantive session or ask for the summary. Then create at most one concise structured record, never one per exchange. If I say “pause records” or “off-record”, write nothing until I explicitly re-enable recording. If I request correction or deletion, make that scoped change when access allows and say plainly if it did not occur. Never save raw voice, a full transcript, sensitive personal data, or material I mark off-record. Do not produce a bare pass/fail verdict.`;
}

export function ModuleOralDefense({
  courseModule,
}: ModuleOralDefenseProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const guide = getOralDefenseGuide(courseModule.number);
  const prompt = liveChatBrief(courseModule, guide);

  const copyText = async (text: string, successState: CopyState) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(successState);
    } catch {
      setCopyState("fallback");
    }
  };

  return (
    <section
      aria-labelledby={`oral-defense-${courseModule.number}-title`}
      className={styles.panel}
    >
      <div className={styles.heading}>
        <div>
          <p className="kicker">Post-module learning conversation</p>
          <h2 id={`oral-defense-${courseModule.number}-title`}>
            Oral defense: a conversation, not a verdict.
          </h2>
        </div>
        <p className={styles.duration}>15–20 thoughtful minutes</p>
      </div>

      <p className={styles.lede}>
        Use this after the workbook and project. A strong answer can be revised;
        uncertainty is useful evidence. The goal is to make your model visible,
        repair it with care, and choose one honest next action.
      </p>

      <ol className={styles.moves}>
        {conversationMoves.map((move) => (
          <li key={move.number}>
            <span aria-hidden="true">{move.number}</span>
            <div>
              <h3>{move.title}</h3>
              <p>{move.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className={styles.moduleFocus} aria-labelledby={`oral-focus-${courseModule.number}`}>
        <div>
          <p className={styles.cardEyebrow}>This module&apos;s evidence</p>
          <h3 id={`oral-focus-${courseModule.number}`}>{guide.centralModel}</h3>
        </div>
        <dl>
          <div>
            <dt>Show</dt>
            <dd>{guide.traceOrDerivation}</dd>
          </div>
          <div>
            <dt>Repair</dt>
            <dd>{guide.misconception}</dd>
          </div>
          <div>
            <dt>Transfer</dt>
            <dd>{guide.transfer}</dd>
          </div>
        </dl>
      </section>

      <div className={styles.actionGrid}>
        <div className={styles.liveCard}>
          <p className={styles.cardEyebrow}>Live or voice-facilitated route</p>
          <h3>When a voice-enabled Teaching Assistant chat is available, paste this brief.</h3>
          <p>
            The designated Teaching Assistant should ask one question at a
            time, offer hints before answers, keep the visible chat usable as a
            whiteboard, and leave you with evidence—not a performance score.
          </p>
          <button
            onClick={() => copyText(prompt, "brief-copied")}
            type="button"
          >
            {copyState === "brief-copied"
              ? "Brief copied"
              : "Copy facilitator brief"}
          </button>
          <p aria-live="polite" className={styles.copyStatus}>
            {copyState === "brief-copied" &&
              "The Teaching Assistant brief is ready to paste into your designated live conversation."}
            {copyState === "fallback" &&
              "Copy is unavailable here. Select the detailed text below and paste it into your chat."}
          </p>
          <details className={styles.liveBriefDetails}>
            <summary>Show the full facilitator brief for manual copying</summary>
            <pre aria-label="Scrollable full facilitator brief" tabIndex={0}>
              <code>{prompt}</code>
            </pre>
          </details>
        </div>

        <div className={styles.textCard}>
          <ModuleTextOralDefense courseModule={courseModule} guide={guide} />
        </div>
      </div>

      <div className={styles.evidence}>
        <div>
          <p className={styles.cardEyebrow}>What to keep</p>
          <h3>A small, learner-controlled record</h3>
        </div>
        <ul>
          <li>One model you could explain and defend.</li>
          <li>One assumption, counterexample, or failure boundary you found.</li>
          <li>One repaired misconception or unanswered question.</li>
          <li>One retrieval prompt and smallest next bridge.</li>
        </ul>
        <p className={styles.evidencePrivacy}>
          The guided text route creates an optional local draft only after you
          reflect; it is not sent or saved by Atlas. A designated Codex chat
          may create at most one concise Notion session note after you set the
          exact configured mode, verify its destination, and end a substantive
          session. Do not keep raw voice recordings, sensitive personal
          content, off-record material, or an unnecessary transcript.
        </p>
      </div>

      <p className={styles.rubric}>
        <strong>Facilitator rubric:</strong> model · reasoning · assumptions and
        evidence · counterexample/debugging · transfer/design · reflection.
        Combine this conversation with retrieval, code/model reading, and
        project evidence before making any mastery claim.
      </p>
    </section>
  );
}
