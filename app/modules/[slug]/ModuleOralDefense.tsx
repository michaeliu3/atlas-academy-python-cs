"use client";

import { useState } from "react";
import type { CourseModule } from "@/lib/module-catalog";
import {
  getOralDefenseGuide,
  lensInstruction,
  type OralDefenseGuide,
} from "@/lib/oral-defense-guide";
import styles from "./ModuleOralDefense.module.css";

type ModuleOralDefenseProps = {
  courseModule: CourseModule;
};

type CopyState = "idle" | "brief-copied" | "record-copied" | "fallback";

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

Begin with a plain-language invitation and the five-move agenda: explain the model; trace or derive; stress a boundary; transfer; choose a next bridge. Adapt one question at a time and wait for my answer before continuing. Include a prediction-before-reveal question and ask, “What would change your mind?” When I expose a misconception, name it constructively, give the smallest useful hint, and let me repair the answer rather than revealing it immediately. ${lensInstruction(guide)}

Evaluate reasoning, assumptions, evidence, counterexample/debugging skill, transfer, and reflection—not speed, accent, polish, or memorized phrasing. Do not ask for personal or private data. At the end, give me a concise evidence summary with: demonstrated models, fragile ideas, one misconception repaired, calibrated confidence, one retrieval prompt, and the smallest next bridge. Ask whether I approve saving only that concise summary to my private learning record before I copy it. Do not produce a bare pass/fail verdict.`;
}

function notionRecordTemplate(courseModule: CourseModule, guide: OralDefenseGuide) {
  return `Atlas Academy — Module ${courseModule.number}: ${courseModule.title}
Oral defense evidence record

I approve saving this concise record: yes / not yet
Central model: ${guide.centralModel}
Demonstrated model or reasoning:
Trace / derivation / artifact discussed:
Assumption, counterexample, or failure boundary:
Misconception repaired or unresolved question:
Confidence calibration:
Retrieval prompt:
Smallest next bridge:

Privacy check: no raw voice recording, sensitive personal content, or unnecessary transcript included.`;
}

export function ModuleOralDefense({
  courseModule,
}: ModuleOralDefenseProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [recordApproved, setRecordApproved] = useState(false);
  const guide = getOralDefenseGuide(courseModule.number);
  const prompt = liveChatBrief(courseModule, guide);
  const recordTemplate = notionRecordTemplate(courseModule, guide);

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
          <h3>When GPT Live Chat is available, bring this brief.</h3>
          <p>
            The facilitator should ask one question at a time, offer hints
            before answers, and leave you with evidence—not a performance
            score.
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
              "The facilitator brief is ready to paste into a live conversation."}
            {copyState === "fallback" &&
              "Copy is unavailable here. Select the detailed text below and paste it into your chat."}
          </p>
        </div>

        <div className={styles.textCard}>
          <p className={styles.cardEyebrow}>Equivalent text route</p>
          <h3>Use a fully equivalent text conversation without voice.</h3>
          <p>
            Read the agenda aloud, type your answer, draw a diagram, or paste a
            small code trace. Voice is never required to demonstrate reasoning.
          </p>
          <ol className={styles.textAgenda}>
            <li>Explain: {guide.centralModel}</li>
            <li>Show: {guide.traceOrDerivation}</li>
            <li>Stress: {guide.boundary}</li>
            <li>Transfer: {guide.transfer}</li>
          </ol>
          <details>
            <summary>Show the full copyable facilitator brief</summary>
            <pre>
              <code>{prompt}</code>
            </pre>
          </details>
        </div>
      </div>

      <div className={styles.evidence}>
        <div>
          <p className={styles.cardEyebrow}>What to keep</p>
          <h3>A small, privacy-respecting record</h3>
        </div>
        <ul>
          <li>One model you could explain and defend.</li>
          <li>One assumption, counterexample, or failure boundary you found.</li>
          <li>One repaired misconception or unanswered question.</li>
          <li>One retrieval prompt and smallest next bridge.</li>
        </ul>
        <div className={styles.recordAction}>
          <label>
            <input
              checked={recordApproved}
              onChange={(event) => setRecordApproved(event.target.checked)}
              type="checkbox"
            />
            I approve copying only this concise evidence record to my Notion notebook.
          </label>
          <button
            disabled={!recordApproved}
            onClick={() => copyText(recordTemplate, "record-copied")}
            type="button"
          >
            Copy approved record template
          </button>
          <p aria-live="polite">
            {copyState === "record-copied" &&
              "The concise template is ready to complete and paste into Notion."}
            {copyState === "fallback" &&
              "The portal cannot copy here. Use the visible agenda and save only your approved summary."}
            {!copyState.includes("copied") &&
              "Atlas does not connect to Notion or store audio from this page."}
          </p>
          <p>
            Do not store raw voice recordings, sensitive personal content, or an
            unnecessary transcript.
          </p>
        </div>
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
