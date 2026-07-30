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
import { ModuleOralDefense } from "./ModuleOralDefense";
import { ModuleTableOfContents } from "./ModuleTableOfContents";
import { ReadingTools } from "./ReadingTools";
import { AsyncDistributedStudio } from "../../AsyncDistributedStudio";
import { NetworkProtocolStudio } from "../../NetworkProtocolStudio";
import { SecurityTrustStudio } from "../../SecurityTrustStudio";
import { LanguageInterpreterStudio } from "../../LanguageInterpreterStudio";
import { RuntimeEvidenceObservatory } from "../../RuntimeEvidenceObservatory";
import { EvidenceGroundedStudio } from "../../EvidenceGroundedStudio";
import { CapstoneDefenseStudio } from "../../CapstoneDefenseStudio";
import { DiscreteMathProofStudio } from "../../DiscreteMathProofStudio";
import { LinearAlgebraStabilityStudio } from "../../LinearAlgebraStabilityStudio";
import { CalculusContinuousChangeStudio } from "../../CalculusContinuousChangeStudio";
import { ProbabilityInferenceStudio } from "../../ProbabilityInferenceStudio";

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

        {courseModule.availability === "preview" ? (
          <aside className="module-availability-notice" aria-label="Synthesis preview status">
            <p className="kicker">Released preview · not an unlocked Core step</p>
            <h2>This synthesis module is here for orientation, not acceleration.</h2>
            <p>
              Its full prerequisite chain includes later authoring modules. Read it
              as a map of where the course is going; return to the active route
              rather than treating this workbook as evidence that those foundations
              have been completed.
            </p>
            <Link href="/route">View the prerequisite-first route →</Link>
          </aside>
        ) : null}

        {slug === "20-networks-application-protocols" && (
          <NetworkProtocolStudio />
        )}
        {slug === "21-async-distributed-systems" && (
          <AsyncDistributedStudio />
        )}
        {slug === "22-security-privacy-trust-boundaries" && (
          <SecurityTrustStudio />
        )}
        {slug === "23-programming-languages-interpreters" && (
          <LanguageInterpreterStudio />
        )}
        {slug === "24-cpython-performance-memory" && (
          <RuntimeEvidenceObservatory />
        )}
        {slug === "25-evidence-grounded-intelligent-systems" && (
          <EvidenceGroundedStudio />
        )}
        {slug === "26-systems-capstone-open-source-stewardship" && (
          <CapstoneDefenseStudio />
        )}
        {slug === "27-discrete-mathematics-proof-counting-structures" && (
          <DiscreteMathProofStudio />
        )}
        {slug === "28-linear-algebra-numerical-stability-representation" && (
          <LinearAlgebraStabilityStudio />
        )}
        {slug === "29-calculus-real-analysis-continuous-change" && (
          <CalculusContinuousChangeStudio />
        )}
        {slug === "30-probability-statistics-scientific-inference" && (
          <ProbabilityInferenceStudio />
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
            <ModuleOralDefense courseModule={courseModule} />
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
