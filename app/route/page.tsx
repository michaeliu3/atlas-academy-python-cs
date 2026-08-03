import type { Metadata } from "next";
import Link from "next/link";
import {
  atlasCoreRoute,
  atlasCoreRouteAvailabilityStatus,
  atlasCoreRouteTotals,
  getAtlasRouteEntry,
} from "@/lib/atlas-core-route";
import { formatFocusedStudyHours, type CourseModuleState } from "@/lib/course-catalog";
import { moduleHref, moduleManifest } from "@/lib/module-catalog";
import { CourseReaderHeader } from "../modules/CourseReaderHeader";
import { ScopeMatrix } from "./ScopeMatrix";
import styles from "./route.module.css";

export const metadata: Metadata = {
  title: "60-Day Atlas Core · Atlas Academy",
  description:
    "A prerequisite-first 60-day route through Python, mathematics, computer science, AI, and evidence-grounded engineering.",
};

function readerModule(number: number) {
  return moduleManifest.modules.find((courseModule) => courseModule.number === number);
}

function availabilityPresentation(state: CourseModuleState) {
  if (state.readerAccess === "preview") {
    return {
      label: "Reference preview",
      className: styles.previewStatus,
      unavailableNote: null,
    };
  }

  switch (state.availability) {
    case "legacy-open":
      return {
        label: "Open material · review pending",
        className: styles.legacyOpenStatus,
        unavailableNote: null,
      };
    case "published":
      return {
        label: "Verified published",
        className: styles.publishedStatus,
        unavailableNote: null,
      };
    case "optional":
      return {
        label: "Optional reference",
        className: styles.optionalStatus,
        unavailableNote: null,
      };
    case "locked":
      return {
        label: "Locked",
        className: styles.lockedStatus,
        unavailableNote:
          "Locked until its academic prerequisites and release boundary are satisfied.",
      };
    case "authoring-only":
      return {
        label: "In authoring",
        className: styles.authoringStatus,
        unavailableNote:
          "Source map, studio, and release evidence are being completed before learner release.",
      };
    case "preview":
      return {
        label: "Reference preview",
        className: styles.previewStatus,
        unavailableNote: null,
      };
  }
}

export default function AtlasCoreRoutePage() {
  const availabilitySummary = `${atlasCoreRouteAvailabilityStatus["legacy-open"]} / ${atlasCoreRouteAvailabilityStatus["preview-reader"]} / ${atlasCoreRouteAvailabilityStatus["authoring-only"]}`;

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
            reasoning, systems, AI, and machine learning. It is credible only
            as a full-time 35–45 focused-hours-per-week intensive; choose the
            90- or 180-day route at a lower weekly capacity. It is not a
            promise that 60 calendar days create permanent mastery. It is a way
            to make every later claim rest on the models it needs.
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
              <dt>{availabilitySummary}</dt>
              <dd>open / preview / authoring</dd>
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
            <strong>This page maps the intended 36-module dependency sequence
            and current portal access.</strong> It is not a promise that every
            phase can be completed in the reader today: M31–M36 require
            designated private chat-led draft study, while M25/M26 remain
            orientation-only previews.
          </p>
          <p className={styles.availability}>
            Day 1 is the placement diagnostic and learning contract. Today, {atlasCoreRouteAvailabilityStatus["legacy-open"]} legacy workbooks are open for guided study; {atlasCoreRouteAvailabilityStatus["preview-reader"]} synthesis workbooks are clearly marked as reference previews; the {atlasCoreRouteAvailabilityStatus["authoring-only"]} named depth modules remain unavailable as portal reader pages while their release material is reviewed.
          </p>
          <p className={styles.availability}>
            <strong>Open material is available for study, not a published,
            verified module—and it does not mean a learner has completed its
            prerequisites.</strong> Atlas does not infer progress from a click,
            a scroll, or a studio interaction. Use the academic prerequisite
            map and a Codex learning conversation to choose and record evidence
            deliberately.
          </p>
          <p className={styles.availability}>
            <strong>Primary guided learning happens in Codex.</strong> The
            course owner may use the authoring-only M31–M36 draft packs only
            with the designated Teaching Assistant and Study Partner chats.
            That private instructor-led study does not make a portal page
            available, record Core credit, or create a publication claim. Use
            the{" "}
            <Link href="/learning-partners">Teaching Assistant and Study Partner guide</Link>{" "}
            to prepare the conversation and keep the private draft boundary
            explicit.
          </p>
        </header>

        <section className={styles.truth} aria-labelledby="route-boundary">
          <div>
            <p className="kicker">A truthful contract</p>
            <h2 id="route-boundary">Coverage is not a trophy for speed.</h2>
          </div>
          <p>
            Every topic on this route needs a definition, derivation or trace,
            misconception check, transfer task, and later retrieval. For
            eligible learner-ready work, a Teaching Assistant oral defense
            supports a learner-controlled summary after evidence; M25/M26
            reference previews use only their bounded preparation and rehearsal
            cards. A portal click, preview, or oral conversation never
            automatically creates a record or Core credit.
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
              <span>Bring the evidence to the Teaching Assistant for a supportive oral defense; use the portal text flow to prepare or rehearse.</span>
            </li>
          </ol>
          <Link className={styles.partnerLink} href="/learning-partners">
            Prepare the Teaching Assistant and Study Partner guide <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className={styles.legend} aria-label="Route status legend">
          <span className={styles.legacyOpenDot} aria-hidden="true" />
          <span>Open legacy workbook—available for study; full contract and release review remain pending</span>
          <span className={styles.previewDot} aria-hidden="true" />
          <span>Reference preview—available for orientation, not Core progress</span>
          <span className={styles.authoringDot} aria-hidden="true" />
          <span>Authoring-only or locked—shown so its prerequisites are never hidden</span>
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
                  const visibleModule = readerModule(entry.number);
                  const canOpen =
                    entry.state.readerAccess !== "hidden" && visibleModule !== undefined;
                  const isPreview = entry.state.readerAccess === "preview";
                  const status = availabilityPresentation(entry.state);
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
                          className={status.className}
                        >
                          {status.label}
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
                        {entry.focusedStudyMinutes ? (
                          <div>
                            <dt>
                              {entry.state.availability === "authoring-only"
                                ? "Private study draft"
                                : "Evidence"}
                            </dt>
                            <dd>
                              {formatFocusedStudyHours(entry.focusedStudyMinutes.minimumEvidence)} minimum · {" "}
                              {formatFocusedStudyHours(entry.focusedStudyMinutes.deepDossier)} deep dossier
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                      {canOpen ? (
                        <span className={styles.cardLink}>
                          {isPreview
                            ? "Read as reference—not an unlocked Core step"
                            : "Open the workbook—formal review remains pending"} <i aria-hidden="true">→</i>
                        </span>
                      ) : (
                        <span className={styles.authoringNote}>
                          {status.unavailableNote}
                        </span>
                      )}
                    </>
                  );

                  return (
                    <li key={entry.number}>
                      {canOpen && visibleModule ? (
                        <Link
                          className={styles.moduleCard}
                          href={moduleHref(visibleModule.slug)}
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

        <ScopeMatrix />

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
            Browse the course library <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
