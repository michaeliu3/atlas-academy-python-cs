import type { Metadata } from "next";
import Link from "next/link";
import { learningPartnerPrompts, liveModuleLoop, liveStartNow } from "@/lib/learning-partner-prompts";
import { CourseReaderHeader } from "../modules/CourseReaderHeader";
import { LearningPartnerPromptCards } from "./LearningPartnerPromptCards";
import styles from "./learning-partners.module.css";

export const metadata: Metadata = {
  title: "Learning Partners · Atlas Academy",
  description:
    "Separate, reusable Teaching Assistant and Study Partner startup prompts for Atlas Academy.",
};

const legacySessionOneLaunch = `Start Module [NN], Session 1 — [session title].
I have the Atlas workbook open and want to understand the model before I produce anything. Ask me for one prediction before revealing an explanation. Then help me trace one small example and end with the named Session 1 output. Keep equations and code visible with a prose fallback. Do not grade me.`;

const m01SessionOneLaunch = `Start M01, Session 1 — The mystery of the changing record.
I want to diagnose aliasing without running code yet. Give me a small mutable-tags trace; ask what changes after each line. Then help me draw the name → object graph, distinguish rebinding from mutation, and end with an invariant for historical events plus my binding-and-alias map. Do not reveal the trace before my prediction.`;

export default function LearningPartnersPage() {
  return (
    <main className={styles.shell}>
      <CourseReaderHeader current="partners" />
      <div id="main-content" tabIndex={-1}>
        <header className={styles.hero}>
          <p className="kicker">Two separate chats. Two different jobs.</p>
          <h1>
            Learning partners that
            <em> protect your thinking.</em>
          </h1>
          <p>
            Atlas is the course portal; your designated Codex chats are the
            live learning surface. Paste each role brief into its separate chat
            once, then use the module-specific follow-on context in each open
            module&apos;s oral-defense panel. For M31–M36, use the
            {" "}
            <a href="https://github.com/michaeliu3/atlas-academy-python-cs/blob/agent/60-day-route/docs/PRIVATE_GUIDED_LEARNING_ROUTE.md">
              private advanced-study launch guide
            </a>{" "}
            on the active private review branch, one named session at a
            time. Those packs are ready for designated private guided learning;
            their portal reader remains hidden, and they do not create Core
            credit, a publication claim, or a record. Share only the smallest
            context needed for the next learning move.
          </p>
        </header>

        <section className={styles.workflow} aria-labelledby="start-now">
          <div>
            <p className="kicker">Start now · no human gate</p>
            <h2 id="start-now">Begin with evidence, then improve the course.</h2>
            <p>
              Build-phase human-only requirements are waived, so you do not
              need to wait for a reviewer or a pilot session. Choose the next
              graph-approved conversation, produce a small reasoning artifact,
              and let the learner-owned record show what needs a bridge later.
              This starts learning; it does not create a grade, mastery claim,
              route unlock, or release evidence.
            </p>
          </div>
          <ol>
            {liveStartNow.entrySteps.map((step, index) => (
              <li key={step.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>
                  <strong>{step.label}:</strong> {step.action} <em>Output: {step.output}</em>
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.workflow} aria-labelledby="partner-workflow">
          <div>
            <p className="kicker">A six-phase operating rhythm</p>
            <h2 id="partner-workflow">Choose the job before asking the question.</h2>
          </div>
          <ol>
            {liveModuleLoop.phases.map((phase, index) => (
              <li key={phase.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p><strong>{phase.label}:</strong> {phase.objective}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.launches} aria-labelledby="session-one-launches">
          <div>
            <p className="kicker">Start an open legacy module</p>
            <h2 id="session-one-launches">Begin with a model, not a blank chat.</h2>
            <p>
              After you paste the Study Partner&apos;s startup package once, use
              the first card for any open workbook. The M1 card gives you a
              concrete first move today.
            </p>
          </div>
          <div className={styles.launchGrid}>
            <article className={styles.launchCard}>
              <h3>Reusable Session 1 launcher</h3>
              <pre aria-label="Reusable open-module Session 1 starter" tabIndex={0}>
                <code>{legacySessionOneLaunch}</code>
              </pre>
            </article>
            <article className={styles.launchCard}>
              <h3>M1 · Values, State, and Execution</h3>
              <pre aria-label="Module 1 Session 1 starter" tabIndex={0}>
                <code>{m01SessionOneLaunch}</code>
              </pre>
              <Link href="/modules/01-values-state-execution">
                Open the M1 workbook <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </section>

        <section aria-label="Learning partner startup packages" className={styles.packages}>
          <LearningPartnerPromptCards prompts={learningPartnerPrompts} />
        </section>

        <section className={styles.closing} aria-labelledby="partner-next-step">
          <p className="kicker">Stay prerequisite-first</p>
          <h2 id="partner-next-step">A useful chat ends with a sharper next action.</h2>
          <p>
            Use the diagnostic to choose a bridge, the workbook to build the
            model, and a learning partner to make the model explainable under
            a changed condition. Atlas itself does not access voice, a
            microphone, or Notion. Within their configured private learning
            record, after you say “records on” in that exact designated chat,
            the designated Codex chats—not the portal—are authorized to
            automatically create one concise Notion session note for the current
            substantive learning conversation. Say “end session” to close
            automatic session-summary authorization; a correction or deletion
            request remains separately learner-authorized. A prior “records on”
            never carries into a new or ambiguously resumed substantive session:
            records stay off until you make a fresh visible request. A successful write is recorded
            only from direct evidence; voice, rendering, and platform-setting
            behavior remain separately unproven until observed.
          </p>
          <Link href="/route">Return to the 60-day route <span aria-hidden="true">→</span></Link>
        </section>
      </div>
    </main>
  );
}
