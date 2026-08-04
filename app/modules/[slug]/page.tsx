import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  extractTableOfContents,
  extractSessionLaunches,
  getArcById,
  getModuleBySlug,
  getModuleMarkdown,
  moduleManifest,
  stripDocumentTitle,
} from "@/lib/module-catalog";
import { getModuleCompanionPackage } from "@/lib/module-companion-package";
import { CourseReaderHeader } from "../CourseReaderHeader";
import { ModuleMarkdown } from "./ModuleMarkdown";
import { ModuleInteraction } from "./ModuleInteraction";
import { ModuleNavigation } from "./ModuleNavigation";
import { ModuleOralDefense } from "./ModuleOralDefense";
import { ModulePreviewConversation } from "./ModulePreviewConversation";
import { ModuleTableOfContents } from "./ModuleTableOfContents";
import { ReadingTools } from "./ReadingTools";
import { resolveModuleStudio } from "@/lib/module-studio-registry";
import type { CourseModule } from "@/lib/module-catalog";
import { getSynthesisPreviewConversation } from "@/lib/synthesis-preview-conversations";
import { formatFocusedStudyHours } from "@/lib/course-catalog";

type ModulePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return moduleManifest.modules.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { slug } = await params;
  const courseModule = getModuleBySlug(slug);
  if (!courseModule) {
    return { title: "Module not found · Atlas Academy" };
  }
  return {
    title: `Module ${courseModule.number}: ${courseModule.title} · Atlas Academy`,
    description: courseModule.summary,
  };
}

function readerAccessCopy(courseModule: CourseModule) {
  switch (courseModule.state.availability) {
    case "legacy-open":
      return {
        label: "Open legacy reader",
        title: "The workbook is available; formal contract and release review are still pending.",
        detail:
          "Opening, reading, or using a studio does not mark academic prerequisites complete or advance the Core. It also does not make this a published, verified module. Use the prerequisite map and your Teaching Assistant or Study Partner conversation to decide what evidence to build next.",
      };
    case "published":
      return {
        label: "Verified published reader",
        title: "The workbook is learner-released with recorded contract and release evidence.",
        detail:
          "Opening, reading, or using a studio does not mark academic prerequisites complete or advance the Core. Use the prerequisite map and your Teaching Assistant or Study Partner conversation to decide what evidence to build next.",
      };
    case "preview":
      return {
        label: "Reference preview",
        title: "Reference access does not advance the Core.",
        detail:
          "This synthesis workbook is open for orientation and comparison, not as an unlocked Core step. Its listed prerequisites remain the academic route into the work.",
      };
    case "optional":
      return {
        label: "Optional reference",
        title: "Useful depth, not a required Core step.",
        detail:
          "This material is available for exploration, but it neither replaces listed prerequisites nor records Core progress.",
      };
    case "locked":
      return {
        label: "Locked reader",
        title: "This workbook is not available on the active Core.",
        detail:
          "Return to the route to review the prerequisite and release boundary. A link, scroll position, or preview never counts as completion evidence.",
      };
    case "authoring-only":
      return {
        label: "Authoring-only reader",
        title: "This module is still being prepared for learners.",
        detail:
          "Its place on the route is visible, but source, interaction, and release evidence must be complete before it becomes learner material.",
      };
  }
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const courseModule = getModuleBySlug(slug);
  const markdown = getModuleMarkdown(slug);
  if (!courseModule || !markdown) {
    notFound();
  }

  const arc = getArcById(courseModule.arcId);
  const moduleInteraction = resolveModuleStudio(courseModule);
  const lessonMarkdown = stripDocumentTitle(markdown);
  const headings = extractTableOfContents(lessonMarkdown);
  const sessionLaunches = extractSessionLaunches(lessonMarkdown);
  const access = readerAccessCopy(courseModule);
  const previewConversation =
    moduleInteraction.kind === "preview"
      ? getSynthesisPreviewConversation(courseModule.id)
      : undefined;
  const workbookAriaLabel =
    courseModule.state.availability === "preview"
      ? `Module ${courseModule.number} reference preview workbook; not an unlocked Core step`
      : `Complete Module ${courseModule.number} workbook`;

  return (
    <main className={`module-shell ${courseModule.arcId}`}>
      <CourseReaderHeader current="module" />
      <ReadingTools articleId="module-reading-article" />

      <div id="main-content" className="module-page" tabIndex={-1}>
        <header className="module-page-hero">
          <div className="module-page-breadcrumb">
            <Link href="/modules">Lecture notes</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/modules#${courseModule.arcId}`}>
              Arc {arc?.numeral}: {arc?.title}
            </Link>
          </div>
          <p className="kicker">
            Module {courseModule.number} · {arc?.range}
          </p>
          <h1>{courseModule.title}</h1>
          <p>{courseModule.summary}</p>
          <dl className="module-page-measures">
            <div>
              <dt>{courseModule.estimatedMinutes} min</dt>
              <dd>reference read</dd>
            </div>
            {courseModule.focusedStudyMinutes ? (
              <>
                <div>
                  <dt>{formatFocusedStudyHours(courseModule.focusedStudyMinutes.minimumEvidence)}</dt>
                  <dd>minimum evidence</dd>
                </div>
                <div>
                  <dt>{formatFocusedStudyHours(courseModule.focusedStudyMinutes.deepDossier)}</dt>
                  <dd>deep dossier</dd>
                </div>
              </>
            ) : null}
            <div>
              <dt>{courseModule.wordCount.toLocaleString("en-US")}</dt>
              <dd>authored words</dd>
            </div>
            <div>
              <dt>{headings.filter(({ depth }) => depth === 2).length}</dt>
              <dd>major sections</dd>
            </div>
          </dl>
          {courseModule.focusedStudyMinutes ? (
            <p className="module-effort-boundary">
              These are focused-study planning bands for the six-session evidence route,
              not reading time, a promise of mastery, or a substitute for later spaced review.
            </p>
          ) : null}
          <aside
            aria-labelledby={`module-access-${courseModule.number}`}
            className="module-availability-notice module-reader-access"
          >
            <p className="kicker">{access.label}</p>
            <h2 id={`module-access-${courseModule.number}`}>{access.title}</h2>
            <p>{access.detail}</p>
            <Link href="/route">Review the prerequisite-first route →</Link>
          </aside>
        </header>

        <ModuleInteraction
          courseModule={courseModule}
          resolution={moduleInteraction}
          sessionLaunches={sessionLaunches}
        />

        {previewConversation ? (
          <ModulePreviewConversation
            courseModule={courseModule}
            previewPackage={previewConversation}
          />
        ) : null}

        <ModuleNavigation courseModule={courseModule} position="top" />

        <div className="module-reading-grid">
          <aside className="module-toc-column">
            <ModuleTableOfContents headings={headings} />
          </aside>
          <article
            className="module-prose"
            id="module-reading-article"
            aria-label={workbookAriaLabel}
          >
            <ModuleMarkdown
              enableMultipleChoicePredictionGates={
                courseModule.state.availability === "legacy-open" ||
                courseModule.state.availability === "preview"
              }
              markdown={lessonMarkdown}
            />
            {moduleInteraction.kind !== "preview" ? (
              <ModuleOralDefense
                companion={getModuleCompanionPackage(courseModule.number)}
                courseModule={courseModule}
              />
            ) : null}
            <footer className="canonical-source-note">
              <span>Canonical workbook snapshot</span>
              <p>
                This reader is generated directly from{" "}
                <code>{courseModule.filename}</code>. Source fingerprint{" "}
                <code>{courseModule.sourceHash.slice(0, 12)}</code>.
              </p>
            </footer>
          </article>
        </div>

        <ModuleNavigation courseModule={courseModule} position="bottom" />
      </div>

      <footer className="reader-page-footer">
        <Link href="/">Atlas Academy</Link>
        <p>Understand deeply. Design clearly. Verify relentlessly.</p>
      </footer>
    </main>
  );
}
