import { notFound } from "next/navigation";
import { authoringModuleMarkdownBySlug } from "../../../../content/authoring/module-authoring-content";
import teachingPacks from "@/content/course/module-teaching-packs.v1.json";
import { extractSessionLaunches } from "@/lib/heading-ids.js";
import { getModuleMarkdown, stripDocumentTitle } from "@/lib/module-catalog";
import { ModuleMarkdown } from "@/app/modules/[slug]/ModuleMarkdown";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type TeachingPack = (typeof teachingPacks.modules)[number];

function findPack(slug: string): TeachingPack | undefined {
  return teachingPacks.modules.find((module) => module.slug === slug);
}

function availabilityLabel(availability: TeachingPack["availability"]): string {
  if (availability === "authoring-only") return "Private guided study only";
  if (availability === "preview") return "Preview · evidence-gated (not an unlocked Core step)";
  return availability;
}

export default function PrintModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return renderPrintModule(params);
}

async function renderPrintModule(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const pack = findPack(slug);
  if (!pack) notFound();

  if (
    pack.availability === "authoring-only" &&
    process.env.NODE_ENV === "production" &&
    process.env.ATLAS_PRIVATE_PDF_EXPORT !== "1"
  ) {
    notFound();
  }

  const markdown = getModuleMarkdown(slug) ?? authoringModuleMarkdownBySlug[slug];
  if (!markdown) notFound();
  const sessions = extractSessionLaunches(markdown).filter(
    ({ number }) => number >= 1 && number <= 6,
  );

  return (
    <main className="print-module-shell" data-atlas-pdf-ready="true">
      <header className="print-module-header">
        <p className="kicker">Atlas Academy · {pack.availability}</p>
        <h1>Module {String(pack.number).padStart(2, "0")} · {pack.title}</h1>
        <p>{pack.purpose}</p>
        <dl className="print-module-meta">
          <div>
            <dt>Workbook</dt>
            <dd>{pack.workbook.path}</dd>
          </div>
          <div>
            <dt>Central model</dt>
            <dd>{pack.guide?.centralModel ?? pack.purpose}</dd>
          </div>
          <div>
            <dt>Availability</dt>
            <dd>{availabilityLabel(pack.availability)}</dd>
          </div>
        </dl>
      </header>

      <section className="print-session-index" aria-labelledby="print-session-index-title">
        <h2 id="print-session-index-title">Six-session learning path</h2>
        <ol>
          {sessions.map((session) => (
            <li key={session.id}>
              <a href={`#${session.id}`}>Session {session.number}: {session.title}</a>
              {session.output ? <span> · Output: {session.output}</span> : null}
            </li>
          ))}
        </ol>
        <p>
          Use the Teaching Assistant for the live lecture and post-module oral
          defense. Use the Study Partner for visible design, implementation,
          debugging, and code review. The PDF is a readable reference; live
          interaction remains in the designated chats.
        </p>
      </section>

      {pack.rendering.interactiveStudio === "static-print-companion-required" ? (
        <aside className="print-studio-companion" aria-labelledby="print-studio-companion-title">
          <p className="kicker">Printable studio companion</p>
          <h2 id="print-studio-companion-title">The interactive studio is not embedded in this PDF</h2>
          <p>
            Use the HTML reader for the live control. This static companion preserves the
            question, boundary, and evidence path so the same reasoning remains usable on paper.
          </p>
          <p><strong>Studio problem:</strong> {pack.project.scenario}</p>
          <p><strong>Execution boundary:</strong> {pack.code.executionBoundary}</p>
          <ul>
            {pack.project.definitionOfDone.map((criterion) => <li key={criterion}>{criterion}</li>)}
          </ul>
        </aside>
      ) : null}

      <article className="print-module-prose" aria-label={`Printable Module ${pack.number} workbook`}>
        <ModuleMarkdown markdown={stripDocumentTitle(markdown)} printMode />
      </article>

      <footer className="print-module-footer">
        <p>Canonical workbook source: {pack.workbook.path}</p>
        <p>Source hash: {pack.workbook.sourceHash}</p>
      </footer>
    </main>
  );
}
