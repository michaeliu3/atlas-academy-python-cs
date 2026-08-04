import type { Metadata } from "next";
import Link from "next/link";
import { learningPartnerPrompts } from "@/lib/learning-partner-prompts";
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
            in the authenticated source repository, one named session at a
            time. That guide remains authoring-only: it does not unlock a
            portal reader, create Core credit, or create a record. Share only
            the smallest context needed for the next learning move.
          </p>
        </header>

        <section className={styles.workflow} aria-labelledby="partner-workflow">
          <div>
            <p className="kicker">A simple operating rhythm</p>
            <h2 id="partner-workflow">Choose the job before asking the question.</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <p><strong>Study Partner:</strong> retrieve, explain, and test one changed premise.</p>
            </li>
            <li>
              <span>02</span>
              <p><strong>Teaching Assistant:</strong> repair a model, diagnose a trace, or review an evidence boundary.</p>
            </li>
            <li>
              <span>03</span>
              <p><strong>Oral defense:</strong> the Teaching Assistant leads a supportive live or text conversation: explain, revise, transfer, and choose the next bridge.</p>
            </li>
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
            request remains separately learner-authorized. A successful write is recorded
            only from direct evidence; voice, rendering, and platform-setting
            behavior remain separately unproven until observed.
          </p>
          <Link href="/route">Return to the 60-day route <span aria-hidden="true">→</span></Link>
        </section>
      </div>
    </main>
  );
}
