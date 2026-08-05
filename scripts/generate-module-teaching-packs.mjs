import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { extractSessionLaunches } from "../lib/heading-ids.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const outputPath = path.join(
  siteRoot,
  "content",
  "course",
  "module-teaching-packs.v1.json",
);

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(siteRoot, relativePath), "utf8"));

const graph = readJson("content/course/course-graph.v2.json");
const guides = readJson("content/course/module-companion-guides.v1.json");
const guideByModule = new Map(guides.guides.map((guide) => [guide.moduleId, guide]));

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function findFile(relativeDirectory, predicate) {
  const directory = path.join(siteRoot, relativeDirectory);
  const match = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .find(predicate);
  return match ? path.join(relativeDirectory, match).replaceAll(path.sep, "/") : null;
}

function workbookFor(module) {
  const number = String(module.number).padStart(2, "0");
  if (module.number <= 30) {
    const filename = findFile("content/modules", (name) =>
      name.startsWith(`${number}_`) && name.endsWith(".md"),
    );
    if (!filename) throw new Error(`No workbook found for ${module.id}`);
    return { path: filename, visibility: "reader" };
  }

  const filename = findFile("content/authoring", (name) =>
    name.startsWith(`m${number}_`) && name.endsWith("_workbook.v1.md"),
  );
  if (!filename) throw new Error(`No private workbook found for ${module.id}`);
  return { path: filename, visibility: "private-guided-study" };
}

function sourceMapFor(module) {
  if (module.sourceMap) return module.sourceMap;
  const number = String(module.number).padStart(2, "0");
  return findFile("content/source-maps", (name) =>
    name.toLowerCase().startsWith(`module${Number(number)}_`) && name.endsWith(".md"),
  );
}

function firstCodeFence(markdown) {
  const lines = markdown.split(/\r?\n/u);
  const candidates = [];
  for (let index = 0; index < lines.length; index += 1) {
    const opening = lines[index].match(/^\s*(```|~~~)\s*([\w.+-]*)\s*$/u);
    if (!opening) continue;
    const fence = opening[1];
    const language = (opening[2] || "text").toLowerCase();
    let end = index + 1;
    while (end < lines.length && !new RegExp(`^\\s*${fence}\\s*$`, "u").test(lines[end])) {
      end += 1;
    }
    if (end >= lines.length) continue;
    if (language !== "mermaid" && language !== "math" && language !== "latex") {
      candidates.push({
        language,
        startLine: index + 2,
        endLine: end,
        lineCount: Math.max(0, end - index - 1),
        preferred: ["python", "py", "pycon", "python3"].includes(language),
      });
    }
    index = end;
  }
  return candidates.find(({ preferred }) => preferred) ?? candidates[0] ?? null;
}

function locatorFor(markdown, pattern) {
  const lines = markdown.split(/\r?\n/u);
  const line = lines.findIndex((value) => pattern.test(value));
  return line < 0 ? null : { startLine: line + 1, heading: lines[line].trim() };
}

function sourceEvidenceFor({ markdown, workbookPath, module }) {
  const code = firstCodeFence(markdown);
  const projectSection = locatorFor(
    markdown,
    /^(?:#{2,4})\s+.*(?:project|dossier|acceptance criteria|output)/iu,
  );
  return {
    codeSlice: code
      ? {
          status: "derived-locator",
          sourcePath: workbookPath,
          language: code.language,
          startLine: code.startLine,
          endLine: code.endLine,
          lineCount: code.lineCount,
          selectionRule: "first non-diagram code fence, preferring Python",
          curationRequired: true,
        }
      : {
          status: "explicit-non-execution-boundary",
          sourcePath: workbookPath,
          language: null,
          startLine: null,
          endLine: null,
          lineCount: 0,
          selectionRule: "no executable fence found; use derivation, trace, or numerical whiteboard",
          curationRequired: true,
        },
    projectSection: projectSection
      ? { ...projectSection, sourcePath: workbookPath }
      : {
          sourcePath: workbookPath,
          startLine: null,
          heading: null,
          curationRequired: true,
        },
    sourceMap: sourceMapFor(module),
  };
}

function arcProjectId(module) {
  return `${module.knowledgeArcId}-project`;
}

function buildSession(module, guide, session, evidence) {
  const centralModel = guide?.centralModel ?? module.purpose;
  const output = session.output ?? `A compact ${centralModel} evidence card`;
  return {
    number: session.number,
    title: session.title,
    workbookHeadingId: session.id,
    workbookLaunch: session.launch,
    workbookOutput: session.output,
    taLecture: {
      status: "scaffold",
      mode: "first-principles-live-code",
      durationMinutes: [40, 55],
      sequence: [
        "activate prior model",
        "ask for prediction and confidence",
        "walk a bounded code, trace, proof, or numerical fixture",
        "explain the mechanism and each meaningful line",
        "change one premise or assumption",
        "collect learner questions and hand off one artifact",
      ],
      centralModel,
      codeSlice: evidence.codeSlice,
      whiteboard: [
        centralModel,
        guide?.traceOrDerivation ?? "one visible trace or derivation",
        guide?.boundary ?? "the narrowest valid claim and its non-claim",
      ],
      rendering: "display-math, labelled fenced code, diagram, and prose-or-ASCII fallback",
      curationRequired: true,
    },
    studyPartner: {
      status: "scaffold",
      mode: "ai-pair-programming",
      partnerMayWriteCode: true,
      sequence: [
        "state the design brief and learner constraint",
        "predict behavior before the patch",
        "draw the smallest architecture or data-flow map",
        "write one visible incremental patch",
        "explain each meaningful line and state change",
        "run or label the test/trace honestly",
        "inject one failure or changed requirement",
        "review the patch and record the learner explanation",
      ],
      projectBrief: `Implement or inspect one bounded ${centralModel} slice that feeds the cumulative ${arcProjectId(module)}.`,
      starter: evidence.codeSlice,
      acceptanceCriteria: [
        "The learner states the contract, invariant, or theorem condition before implementation.",
        "Every generated patch is visible, explained, and reviewed before the next patch.",
        "Observed execution is separated from prediction, simulation, and unverified claims.",
        "One changed premise, failure case, or counterexample is investigated.",
        "The learner can explain the mechanism and the smallest remaining uncertainty.",
      ],
      debugScenario: guide?.misconception ?? "Change one input or assumption and locate the first broken claim.",
      curationRequired: true,
    },
    evidence: {
      artifact: output,
      retrievalPrompt: `Retrieve the model for ${centralModel}; state one assumption and one changed-premise consequence.`,
      forwardHandoff: guide?.transfer ?? module.purpose,
      sourceBoundary: "Do not treat generated code, a single run, or a fluent explanation as independent evidence.",
    },
  };
}

function buildPack(module) {
  const workbook = workbookFor(module);
  const markdown = fs.readFileSync(path.join(siteRoot, workbook.path), "utf8");
  const guide = guideByModule.get(module.id);
  const sessions = extractSessionLaunches(markdown).filter(({ number }) => number >= 1 && number <= 6);
  const evidence = sourceEvidenceFor({ markdown, workbookPath: workbook.path, module });
  const referenceNumber = String(module.number).padStart(2, "0");
  const referenceModelPath = `public/downloads/module${Number(referenceNumber)}_reference.py`;
  const referenceTestPath = `public/downloads/test_module${Number(referenceNumber)}_reference.py`;
  const hasReferenceModel = fs.existsSync(path.join(siteRoot, referenceModelPath));
  const hasReferenceTest = fs.existsSync(path.join(siteRoot, referenceTestPath));

  return {
    moduleId: module.id,
    number: module.number,
    slug: module.slug,
    title: module.title,
    purpose: module.purpose,
    knowledgeArcId: module.knowledgeArcId,
    availability: module.state.availability,
    workbook: {
      path: workbook.path,
      visibility: workbook.visibility,
      sourceHash: sha256(markdown),
    },
    prerequisites: module.academicPrerequisiteNumbers,
    forwardModuleNumber: module.forwardModuleNumber,
    guide: guide ?? null,
    sessions: sessions.map((session) => buildSession(module, guide, session, evidence)),
    project: {
      status: "scaffold",
      arcProjectId: arcProjectId(module),
      level: module.number >= 31 ? "graduate-depth-scoped" : "upper-undergraduate-to-graduate-slice",
      scenario: `A bounded Atlas learning-system change that makes ${guide?.centralModel ?? module.purpose} inspectable.`,
      sourceSection: evidence.projectSection,
      definitionOfDone: [
        "A named contract, invariant, or proof condition is written before implementation.",
        "A small architecture/data-flow or state diagram is available in the chat and PDF.",
        "A test, trace, counterexample, or numerical observation is attached.",
        "The learner reviews the final patch and states one non-claim.",
      ],
      curationRequired: true,
    },
    code: {
      referenceModel: hasReferenceModel ? referenceModelPath : null,
      referenceTest: hasReferenceTest ? referenceTestPath : null,
      codeSlice: evidence.codeSlice,
      executionBoundary: hasReferenceModel
        ? "Run only the named local reference model and its bounded tests; record the actual command and output."
        : "No checked-in reference model is currently bound; use the workbook fixture or explicitly label the session as non-executing until a local fixture is authored.",
    },
    rendering: {
      printPath: `/print/modules/${module.slug}`,
      pdfStatus: "not-generated",
      math: "KaTeX plus readable source/prose fallback",
      diagrams: "Mermaid SVG plus authored text alternative",
      interactiveStudio: module.studioId ? "static-print-companion-required" : "none-declared",
    },
    coverage: {
      workbook: "present",
      sixSessionSpine: sessions.length === 6 ? "present" : "repair-required",
      taLecture: "scaffold",
      studyPartnerProject: "scaffold",
      codeFixture: hasReferenceModel && hasReferenceTest ? "reference-pair" : evidence.codeSlice.status,
      pdf: "not-generated",
      visualFallback: "workbook-and-renderer-bound",
      oralDefense: "existing-companion-guide",
      evidenceCard: "derived",
    },
  };
}

const packs = graph.modules.map(buildPack);
const output = {
  schemaVersion: 1,
  kind: "atlas-module-teaching-packs",
  generatedBy: "scripts/generate-module-teaching-packs.mjs",
  canonicalCourseGraph: "content/course/course-graph.v2.json",
  canonicalCompanionGuides: "content/course/module-companion-guides.v1.json",
  canonicalWorkbookRule: "Markdown/structured source is canonical; HTML, PDF, and chat cards are derived outputs.",
  deliveryRoles: {
    teachingAssistant: "live first-principles lecture, bounded code walk-through, repair, and supportive oral defense",
    studyPartner: "visible AI pair-programming patches, project implementation, debugging, and code review",
  },
  route: "M1–M5 → M27 → M6–M11 → M12–M16 → M17 → M28–M30 → M31 → M18–M24 → M32–M36 → M25 → M26",
  modules: packs,
};

const serialized = `${JSON.stringify(output, null, 2)}\n`;
const checkOnly = process.argv.includes("--check");
if (checkOnly) {
  const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : null;
  if (existing !== serialized) {
    console.error(`Teaching-pack output is stale: ${path.relative(siteRoot, outputPath)}`);
    process.exitCode = 1;
  } else {
    console.log(`Teaching-pack output is current: ${packs.length} modules.`);
  }
} else {
  fs.writeFileSync(outputPath, serialized, "utf8");
  console.log(`Generated ${packs.length} module teaching packs at ${path.relative(siteRoot, outputPath)}.`);
}

