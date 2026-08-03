"use client";

import Link from "next/link";
import { useState } from "react";
import type { CourseModule } from "@/lib/module-catalog";
import type { SynthesisPreviewConversation } from "@/lib/synthesis-preview-conversations";
import styles from "./ModuleOralDefense.module.css";

type ModulePreviewConversationProps = {
  courseModule: CourseModule;
  previewPackage: SynthesisPreviewConversation;
};

type CopyState = "idle" | "ta" | "partner" | "packet" | "fallback";

function packetText(previewPackage: SynthesisPreviewConversation) {
  return [
    previewPackage.notionEvidencePacket.title,
    "",
    "Only record this when its conditions are met:",
    previewPackage.notionEvidencePacket.conditions,
    "",
    "Fields:",
    ...previewPackage.notionEvidencePacket.fields.map((field) => `- ${field}`),
    "",
    "Boundary:",
    previewPackage.notionEvidencePacket.boundary,
  ].join("\n");
}

export function ModulePreviewConversation({
  courseModule,
  previewPackage,
}: ModulePreviewConversationProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copyText = async (text: string, state: CopyState) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(state);
    } catch {
      setCopyState("fallback");
    }
  };

  const previewPacket = packetText(previewPackage);

  return (
    <section
      aria-labelledby={`preview-conversation-${courseModule.number}-title`}
      className={styles.panel}
    >
      <div className={styles.heading}>
        <div>
          <p className="kicker">Codex preview conversation · bounded preparation</p>
          <h2 id={`preview-conversation-${courseModule.number}-title`}>
            Preview conversation—not an oral defense.
          </h2>
        </div>
        <p className={styles.duration}>{previewPackage.fullSessionEstimate}</p>
      </div>

      <p className={styles.lede}>{previewPackage.summary}</p>

      <section
        className={styles.moduleFocus}
        aria-labelledby={`preview-artifact-${courseModule.number}`}
      >
        <div>
          <p className={styles.cardEyebrow}>Allowed now</p>
          <h3 id={`preview-artifact-${courseModule.number}`}>
            {previewPackage.allowedArtifact.tag} · {previewPackage.allowedArtifact.label}
          </h3>
        </div>
        <dl>
          <div>
            <dt>Make</dt>
            <dd>{previewPackage.allowedArtifact.instruction}</dd>
          </div>
          <div>
            <dt>Stop</dt>
            <dd>{previewPackage.allowedArtifact.boundary}</dd>
          </div>
        </dl>
      </section>

      <div className={styles.actionGrid}>
        <div className={styles.liveCard}>
          <p className={styles.cardEyebrow}>Teaching Assistant · clarification context</p>
          <h3>Ask for one boundary, not a performance verdict.</h3>
          <p>
            Use the already-configured designated live-capable Teaching Assistant
            chat to clarify a claim, its evidence, and the next honest question.
          </p>
          <p className={styles.setupNote}>
            <strong>First time with this role?</strong>{" "}
            <Link className={styles.setupLink} href="/learning-partners">
              Set up the Teaching Assistant chat first
            </Link>
            . This preview card supplements that role; it does not configure a
            chat or activate records.
          </p>
          <button
            onClick={() => copyText(previewPackage.teachingAssistantClarificationPrompt, "ta")}
            type="button"
          >
            {copyState === "ta"
              ? "Teaching Assistant preparation copied"
              : "Copy Teaching Assistant preparation"}
          </button>
          <details className={styles.liveBriefDetails}>
            <summary>Show the Teaching Assistant preparation for manual copying</summary>
            <pre aria-label="Scrollable Teaching Assistant preview preparation" tabIndex={0}>
              <code>{previewPackage.teachingAssistantClarificationPrompt}</code>
            </pre>
          </details>
        </div>

        <div className={styles.liveCard}>
          <p className={styles.cardEyebrow}>Study Partner · orientation context</p>
          <h3>Rehearse the evidence chain before asking for a decision.</h3>
          <p>
            Use the already-configured separate Study Partner chat to retrieve
            one prerequisite, change one premise, and expose the smallest
            missing receipt.
          </p>
          <p className={styles.setupNote}>
            <strong>First time with this role?</strong>{" "}
            <Link className={styles.setupLink} href="/learning-partners">
              Set up the Study Partner chat first
            </Link>
            . This preview card supplements that role; it does not configure a
            chat or activate records.
          </p>
          <button
            onClick={() => copyText(previewPackage.studyPartnerPrompt, "partner")}
            type="button"
          >
            {copyState === "partner"
              ? "Study Partner preparation copied"
              : "Copy Study Partner preparation"}
          </button>
          <details className={styles.liveBriefDetails}>
            <summary>Show the Study Partner preparation for manual copying</summary>
            <pre aria-label="Scrollable Study Partner preview preparation" tabIndex={0}>
              <code>{previewPackage.studyPartnerPrompt}</code>
            </pre>
          </details>
        </div>

        <div className={styles.liveCard}>
          <p className={styles.cardEyebrow}>Learner-controlled evidence packet</p>
          <h3>Keep a small record only when your chat policy permits it.</h3>
          <p>
            This is a copyable template for your designated chat or manual note;
            the portal does not write to Notion.
          </p>
          <p className={styles.setupNote}>
            This preview card never grants record authority. In an unconfigured
            or unavailable chat, no write occurs—copy this packet as a local
            learner-approved note instead.
          </p>
          <button onClick={() => copyText(previewPacket, "packet")} type="button">
            {copyState === "packet"
              ? "Concise evidence packet copied"
              : "Copy the concise evidence packet"}
          </button>
          <details className={styles.liveBriefDetails}>
            <summary>Show the concise evidence packet for manual copying</summary>
            <pre aria-label="Scrollable synthesis preview evidence packet" tabIndex={0}>
              <code>{previewPacket}</code>
            </pre>
          </details>
        </div>
      </div>

      <section
        className={styles.forwardHandoff}
        aria-labelledby={`preview-next-${courseModule.number}`}
      >
        <div>
          <p className={styles.cardEyebrow}>Next map, not route progress</p>
          <h3 id={`preview-next-${courseModule.number}`}>
            {previewPackage.futureForwardContext.label}
          </h3>
        </div>
        <p>{previewPackage.futureForwardContext.boundary}</p>
      </section>

      <p aria-live="polite" className={styles.copyStatus}>
        {copyState === "fallback" &&
          "Copy is unavailable here. Open a preparation card and copy its text manually."}
        {copyState === "ta" &&
          "Teaching Assistant preparation is ready to paste into your already configured designated live chat."}
        {copyState === "partner" &&
          "Study Partner preparation is ready to paste into your already configured separate live chat."}
        {copyState === "packet" &&
          "The concise evidence packet is ready for a designated chat or manual note."}
      </p>
    </section>
  );
}
