"use client";

import { useState } from "react";
import type { CourseModule } from "@/lib/module-catalog";
import type { ModuleCompanionPackage } from "@/lib/module-companion-package";
import { ModuleTextOralDefense } from "./ModuleTextOralDefense";
import styles from "./ModuleOralDefense.module.css";

type ModuleOralDefenseProps = {
  courseModule: CourseModule;
  companion: ModuleCompanionPackage;
};

type CopyState = "idle" | "ta-brief-copied" | "partner-brief-copied" | "fallback";

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

export function ModuleOralDefense({
  courseModule,
  companion,
}: ModuleOralDefenseProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const guide = companion.guide;
  const prompt = companion.teachingAssistant.contextPrompt;
  const studyPartnerPrompt = companion.studyPartner.contextPrompt;

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
          <p className={styles.cardEyebrow}>Teaching Assistant · oral-defense context</p>
          <h3>Use your designated voice-enabled Teaching Assistant chat when it is available.</h3>
          <p>
            The designated Teaching Assistant should ask one question at a
            time, offer hints before answers, keep the visible chat usable as a
            whiteboard, and leave you with evidence—not a performance score.
          </p>
          <button
            onClick={() => copyText(prompt, "ta-brief-copied")}
            type="button"
          >
            {copyState === "ta-brief-copied"
              ? "TA context copied"
              : "Copy Teaching Assistant context"}
          </button>
          <p aria-live="polite" className={styles.copyStatus}>
            {copyState === "ta-brief-copied" &&
              "The Teaching Assistant context is ready to paste into your designated live conversation."}
            {copyState === "fallback" &&
              "Copy is unavailable here. Select the detailed text below and paste it into your chat."}
          </p>
          <details className={styles.liveBriefDetails}>
            <summary>Show the full Teaching Assistant context for manual copying</summary>
            <pre aria-label="Scrollable full Teaching Assistant context" tabIndex={0}>
              <code>{prompt}</code>
            </pre>
          </details>
        </div>

        <div className={styles.liveCard}>
          <p className={styles.cardEyebrow}>Study Partner · rehearsal context</p>
          <h3>Use the separate live-capable Study Partner chat to make the model explainable first.</h3>
          <p>
            This is a low-pressure rehearsal: retrieve, trace, change one
            premise, and prepare a focused handoff for the Teaching Assistant.
            It does not administer the formal oral defense.
          </p>
          <button
            onClick={() => copyText(studyPartnerPrompt, "partner-brief-copied")}
            type="button"
          >
            {copyState === "partner-brief-copied"
              ? "Study Partner context copied"
              : "Copy Study Partner context"}
          </button>
          <p aria-live="polite" className={styles.copyStatus}>
            {copyState === "partner-brief-copied" &&
              "The Study Partner context is ready to paste into your separate live discussion chat."}
            {copyState === "fallback" &&
              "Copy is unavailable here. Select the detailed text below and paste it into your chat."}
          </p>
          <details className={styles.liveBriefDetails}>
            <summary>Show the full Study Partner context for manual copying</summary>
            <pre aria-label="Scrollable full Study Partner context" tabIndex={0}>
              <code>{studyPartnerPrompt}</code>
            </pre>
          </details>
        </div>

        <div className={styles.textCard}>
          <ModuleTextOralDefense courseModule={courseModule} guide={guide} />
        </div>
      </div>

      <section className={styles.forwardHandoff} aria-labelledby={`forward-handoff-${courseModule.number}`}>
        <div>
          <p className={styles.cardEyebrow}>Canonical forward handoff</p>
          <h3 id={`forward-handoff-${courseModule.number}`}>
            {companion.module.declaredForwardHandoff
              ? `Carry a small evidence card into Module ${companion.module.declaredForwardHandoff.number}.`
              : "Choose an honest next specialization rather than inventing completion."}
          </h3>
        </div>
        <p>
          {companion.module.declaredForwardHandoff
            ? `The academic continuation is Module ${companion.module.declaredForwardHandoff.number}: ${companion.module.declaredForwardHandoff.title}. Bring your model, one uncertainty, and the smallest useful artifact; this is not an automatic route advance or mastery claim.`
            : "This module has no declared forward module. Keep the model, uncertainty, and artifact available for a learner-chosen specialization or maintenance question."}
        </p>
      </section>

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
          may automatically create at most one concise Notion session note after
          a substantive learning conversation in its configured private record.
          Atlas does not initiate it, and no successful write is claimed without
          direct evidence. Do not keep raw voice recordings, sensitive personal
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
