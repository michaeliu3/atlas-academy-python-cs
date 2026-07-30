import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  extractTableOfContents,
  getArcById,
  getModuleBySlug,
  getModuleMarkdown,
  moduleManifest,
  stripDocumentTitle,
} from "@/lib/module-catalog";
import { CourseReaderHeader } from "../CourseReaderHeader";
import { ModuleMarkdown } from "./ModuleMarkdown";
import { ModuleNavigation } from "./ModuleNavigation";
import { ModuleTableOfContents } from "./ModuleTableOfContents";
import { ReadingTools } from "./ReadingTools";
import { NetworkProtocolStudio } from "../../NetworkProtocolStudio";

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

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const courseModule = getModuleBySlug(slug);
  const markdown = getModuleMarkdown(slug);
  if (!courseModule || !markdown) {
    notFound();
  }

  const arc = getArcById(courseModule.arcId);
  const lessonMarkdown = stripDocumentTitle(markdown);
  const headings = extractTableOfContents(lessonMarkdown);

  return (
    <main className={`module-shell ${courseModule.arcId}`}>
      <CourseReaderHeader current="module" />
      <ReadingTools articleId="module-reading-article" />

      <div id="main-content" className="module-page" tabIndex={-1}>
        <header className="module-page-hero">
          <div className="module-page-breadcrumb">
            <Link href="/modules">Course library</Link>
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
            <div>
              <dt>{courseModule.wordCount.toLocaleString("en-US")}</dt>
              <dd>authored words</dd>
            </div>
            <div>
              <dt>{headings.filter(({ depth }) => depth === 2).length}</dt>
              <dd>major sections</dd>
            </div>
          </dl>
        </header>

        {slug === "20-networks-application-protocols" && (
          <NetworkProtocolStudio />
        )}

        <ModuleNavigation courseModule={courseModule} position="top" />

        <div className="module-reading-grid">
          <aside className="module-toc-column">
            <ModuleTableOfContents headings={headings} />
          </aside>
          <article
            className="module-prose"
            id="module-reading-article"
            aria-label={`Complete Module ${courseModule.number} workbook`}
          >
            <ModuleMarkdown markdown={lessonMarkdown} />
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
