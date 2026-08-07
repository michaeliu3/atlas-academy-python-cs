import type { Metadata } from "next";
import Link from "next/link";
import { moduleHref, moduleManifest } from "@/lib/module-catalog";
import { CourseReaderHeader } from "./CourseReaderHeader";

export const metadata: Metadata = {
  title: "Lecture Notes · Atlas Academy",
  description:
    `Read the connected Atlas lecture notes: ${moduleManifest.readerVisibleModuleCount} learner-visible workbooks.`,
};

export default function ModuleLibraryPage() {
  return (
    <main className="module-library-shell">
      <CourseReaderHeader current="library" />
      <div id="main-content" tabIndex={-1}>
        <header className="library-hero">
          <p className="kicker">
            Atlas lecture notes · {moduleManifest.legacyOpenModuleCount} open legacy workbooks + {moduleManifest.previewReaderModuleCount} synthesis previews
          </p>
          <h1>
            Lecture notes.
            <em>Every connection visible.</em>
          </h1>
          <p>
            These are the full authored workbooks—not summaries. The notes
            group the course by knowledge arc for reference browsing. For the
            prerequisite-first sequence, use the <Link href="/route">60-day route</Link>.
            Then follow every diagram and code trace, and use the quizzes as
            instruments for finding the exact model that needs repair.
          </p>
          <aside className="library-boundary" aria-label="Advanced lecture-note boundary">
            <strong>Where the advanced notes live</strong>
            <span>
              M31–M36 have ready private guided-study packs. Their portal
              reader remains hidden; use the <Link href="/learning-partners">Teaching Assistant and Study Partner guide</Link> to prepare one named private session at a time.
            </span>
          </aside>
          <dl className="library-measures" aria-label="Lecture notes scale">
            <div>
              <dt>{moduleManifest.legacyOpenModuleCount}</dt>
              <dd>open workbooks</dd>
            </div>
            <div>
              <dt>{moduleManifest.previewReaderModuleCount}</dt>
              <dd>gated synthesis previews</dd>
            </div>
            <div>
              <dt>{moduleManifest.arcs.length}</dt>
              <dd>connected knowledge arcs</dd>
            </div>
            <div>
              <dt>1</dt>
              <dd>living Atlas system</dd>
            </div>
          </dl>
        </header>

        <section className="library-orientation" aria-labelledby="library-method">
          <div>
            <p className="kicker">How to use the library</p>
            <h2 id="library-method">Read for structure, not page count.</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              Recover the problem and the prerequisite model.
            </li>
            <li>
              <span>02</span>
              Predict code and diagrams before revealing the explanation.
            </li>
            <li>
              <span>03</span>
              Name the invariant, trade-off, or failure boundary in your words.
            </li>
            <li>
              <span>04</span>
              Use quiz confidence to choose a repair—not to rank yourself.
            </li>
          </ol>
        </section>

        <div className="library-arcs">
          {moduleManifest.arcs.map((arc) => {
            const modules = moduleManifest.modules.filter(
              (courseModule) => courseModule.arcId === arc.id,
            );
            return (
              <section
                className={`library-arc ${arc.id}`}
                id={arc.id}
                key={arc.id}
                aria-labelledby={`${arc.id}-title`}
              >
                <header className="library-arc-heading">
                  <span aria-hidden="true">{arc.numeral}</span>
                  <div>
                    <p>
                      {arc.range} · Knowledge arc
                    </p>
                    <h2 id={`${arc.id}-title`}>{arc.title}</h2>
                    <p>{arc.description}</p>
                  </div>
                </header>

                <ol className="module-card-grid">
                  {modules.map((courseModule) => (
                    <li key={courseModule.slug}>
                      <Link
                        className="module-library-card"
                        href={moduleHref(courseModule.slug)}
                      >
                        <span className="module-card-number">
                          {String(courseModule.number).padStart(2, "0")}
                        </span>
                        <h3>{courseModule.title}</h3>
                        <p>{courseModule.summary}</p>
                        <span className="module-card-meta">
                          {courseModule.estimatedMinutes} min reference read
                          {courseModule.state.availability === "preview"
                            ? " · Preview—not an unlocked Core step"
                            : courseModule.state.availability === "legacy-open"
                              ? " · Open legacy material—formal review pending"
                            : ""}
                          <i aria-hidden="true">↗</i>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>

        <section className="library-continuity">
          <p className="kicker">The governing idea</p>
          <blockquote>
            A module is not a destination. It is a sharper instrument for
            understanding the same system.
          </blockquote>
          <Link className="primary-link" href={moduleHref(moduleManifest.modules[0].slug)}>
            Begin with state and execution <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
