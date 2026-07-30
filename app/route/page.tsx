import type { Metadata } from "next";
import Link from "next/link";
import {
  atlasCoreRoute,
  atlasCoreRouteReleaseStatus,
  atlasCoreRouteTotals,
  getAtlasRouteEntry,
} from "@/lib/atlas-core-route";
import { moduleHref, moduleManifest } from "@/lib/module-catalog";
import { CourseReaderHeader } from "../modules/CourseReaderHeader";
import styles from "./route.module.css";

export const metadata: Metadata = {
  title: "60-Day Atlas Core · Atlas Academy",
  description:
    "A prerequisite-first 60-day route through Python, mathematics, computer science, AI, and evidence-grounded engineering.",
};

function publishedModule(number: number) {
  return moduleManifest.modules.find((courseModule) => courseModule.number === number);
}

export default function AtlasCoreRoutePage() {
  const releaseSummary = `${atlasCoreRouteReleaseStatus.published} / ${atlasCoreRouteReleaseStatus.preview} / ${atlasCoreRouteReleaseStatus["in-authoring"]}`;

  return (
    <main className={styles.shell}>
      <CourseReaderHeader current="route" />
      <div id="main-content" tabIndex={-1}>
        <header className={styles.hero}>
          <p className="kicker">Prerequisite-first learner route</p>
          <h1>
            60 days.
            <em>One connected argument.</em>
          </h1>
          <p>
            This is an accelerated first pass through Python, mathematical
            reasoning, systems, AI, and machine learning. It is not a promise
            that 60 calendar days create permanent mastery. It is a way to make
            every later claim rest on the models it needs.
          </p>
          <dl className={styles.measures} aria-label="Atlas Core route scale">
            <div>
              <dt>{atlasCoreRouteTotals.days}</dt>
              <dd>calendar days</dd>
            </div>
            <div>
              <dt>{atlasCoreRouteTotals.modules}</dt>
              <dd>defined route modules</dd>
            </div>
            <div>
              <dt>{releaseSummary}</dt>
              <dd>Core-open / preview / authoring</dd>
            </div>
            <div>
              <dt>{atlasCoreRouteTotals.focusedHoursPerWeek}</dt>
              <dd>focused hours / week</dd>
            </div>
            <div>
              <dt>{atlasCoreRouteTotals.consolidation}</dt>
              <dd>consolidation window</dd>
            </div>
          </dl>
          <p className={styles.availability}>
            Day 1 is the placement diagnostic and learning contract. Today, {atlasCoreRouteReleaseStatus.published} modules are open on the active Core; {atlasCoreRouteReleaseStatus.preview} released synthesis modules are clearly marked as previews; the {atlasCoreRouteReleaseStatus["in-authoring"]} named depth modules stay visibly planned until their source maps, studios, and workbooks pass release checks.
          </p>
        </header>

        <section className={styles.truth} aria-labelledby="route-boundary">
          <div>
            <p className="kicker">A truthful contract</p>
            <h2 id="route-boundary">Coverage is not a trophy for speed.</h2>
          </div>
          <p>
            Every topic on this route needs a definition, derivation or trace,
            misconception check, transfer task, and later retrieval. The oral
            defense after each module creates a small learning record; it never
            substitutes fluent speech, a green test, or a completed checklist
            for mastery.
          </p>
          <Link className={styles.primaryLink} href="/diagnostic">
            Begin with the placement diagnostic <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className={styles.rhythm} aria-labelledby="route-rhythm">
          <div>
            <p className="kicker">Daily rhythm</p>
            <h2 id="route-rhythm">Read. Predict. Explain. Repair. Connect.</h2>
          </div>
          <ol>
            <li>
              <strong>Before</strong>
              <span>Retrieve a prerequisite and make a prediction.</span>
            </li>
            <li>
              <strong>During</strong>
              <span>Read the model, trace a worked example, then test its boundary.</span>
            </li>
            <li>
              <strong>After</strong>
              <span>Use the oral defense to explain, revise, and choose a next bridge.</span>
            </li>
          </ol>
        </section>

        <section className={styles.legend} aria-label="Route status legend">
          <span className={styles.publishedDot} aria-hidden="true" />
          <span>Published and open on the active Core</span>
          <span className={styles.authoringDot} aria-hidden="true" />
          <span>Released preview—not an unlocked Core step</span>
          <span className={styles.authoringDot} aria-hidden="true" />
          <span>Depth module in authoring—shown so its prerequisites are never hidden</span>
        </section>

        <div className={styles.phaseList}>
          {atlasCoreRoute.map((phase) => (
            <section
              className={styles.phase}
              id={phase.id}
              key={phase.id}
              aria-labelledby={`${phase.id}-title`}
            >
              <header className={styles.phaseHeader}>
                <span aria-hidden="true">{phase.number}</span>
                <div>
                  <p>{phase.days} · Atlas Core phase</p>
                  <h2 id={`${phase.id}-title`}>{phase.title}</h2>
                  <p>{phase.premise}</p>
                </div>
              </header>

              <ol className={styles.moduleGrid}>
                {phase.entries.map((entry) => {
                  const releasedModule = publishedModule(entry.number);
                  const canOpen =
                    entry.status === "published" && releasedModule !== undefined;
                  const isPreview = entry.availability === "preview";
                  const statusLabel =
                    entry.status === "authoring-only"
                      ? "In authoring"
                      : isPreview
                        ? "Preview"
                        : "Published";
                  const prerequisiteTitles = entry.prerequisiteNumbers.map(
                    (number) => {
                      const prerequisite = getAtlasRouteEntry(number);
                      return prerequisite
                        ? `M${number} ${prerequisite.title}`
                        : `M${number}`;
                    },
                  );

                  const card = (
                    <>
                      <div className={styles.cardTopline}>
                        <span>Module {entry.number}</span>
                        <span
                          className={
                            entry.status === "published" && !isPreview
                              ? styles.publishedStatus
                              : styles.authoringStatus
                          }
                        >
                          {statusLabel}
                        </span>
                      </div>
                      <h3>{entry.title}</h3>
                      <p>{entry.purpose}</p>
                      <dl>
                        <div>
                          <dt>Needs</dt>
                          <dd>
                            {prerequisiteTitles.length
                              ? prerequisiteTitles.join(" · ")
                              : "Placement diagnostic"}
                          </dd>
                        </div>
                        <div>
                          <dt>Role</dt>
                          <dd>{entry.shortTitle}</dd>
                        </div>
                      </dl>
                      {canOpen ? (
                        <span className={styles.cardLink}>
                          {isPreview
                            ? "Read the preview—not an unlocked Core step"
                            : "Open the workbook"} <i aria-hidden="true">→</i>
                        </span>
                      ) : (
                        <span className={styles.authoringNote}>
                          Source map and studio are being built before release.
                        </span>
                      )}
                    </>
                  );

                  return (
                    <li key={entry.number}>
                      {canOpen && releasedModule ? (
                        <Link
                          className={styles.moduleCard}
                          href={moduleHref(releasedModule.slug)}
                        >
                          {card}
                        </Link>
                      ) : (
                        <article className={`${styles.moduleCard} ${styles.plannedCard}`}>
                          {card}
                        </article>
                      )}
                    </li>
                  );
                })}
              </ol>

              <aside className={styles.gate}>
                <span>Arc gate</span>
                <p>{phase.gate}</p>
              </aside>
            </section>
          ))}
        </div>

        <section className={styles.continuation} aria-labelledby="continuation-title">
          <p className="kicker">After day 60</p>
          <h2 id="continuation-title">Return with evidence, not vague revision.</h2>
          <p>
            Keep a spaced-review queue, revise one project with new evidence,
            redo a few oral defenses after delay, and choose one specialization:
            mathematical foundations, systems, formal theory, classical AI, or
            machine learning. The purpose of the Core is to make that choice
            informed.
          </p>
          <Link className={styles.primaryLink} href="/modules">
            Browse the published course library <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
