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
            Atlas uses AI to make your reasoning visible—not to replace it.
            Start a separate chat for each role, paste its brief, and fill in
            only the smallest context needed for the next learning move.
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
              <p><strong>Oral defense:</strong> explain, revise, transfer, and keep only a concise record you approve.</p>
            </li>
          </ol>
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
            a changed condition. Neither role awards a grade or writes to
            Notion automatically.
          </p>
          <Link href="/route">Return to the 60-day route <span aria-hidden="true">→</span></Link>
        </section>
      </div>
    </main>
  );
}
