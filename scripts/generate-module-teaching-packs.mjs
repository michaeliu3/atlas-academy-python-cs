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
const arcProjects = readJson("content/course/arc-projects.v1.json");
const guideByModule = new Map(guides.guides.map((guide) => [guide.moduleId, guide]));
const arcProjectByModuleId = new Map(
  arcProjects.projects.flatMap((project) =>
    project.moduleIds.map((moduleId, index) => [
      moduleId,
      { project, slice: project.moduleSlices[index] },
    ]),
  ),
);

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
          adaptationRequired: true,
        }
      : {
          status: "explicit-non-execution-boundary",
          sourcePath: workbookPath,
          language: null,
          startLine: null,
          endLine: null,
          lineCount: 0,
          selectionRule: "no executable fence found; use derivation, trace, or numerical whiteboard",
          adaptationRequired: true,
        },
    projectSection: projectSection
      ? { ...projectSection, sourcePath: workbookPath }
      : {
          sourcePath: workbookPath,
          startLine: null,
          heading: null,
          adaptationRequired: true,
        },
    sourceMap: sourceMapFor(module),
  };
}

function sourceMapRecord(relativePath) {
  if (!relativePath) return null;
  const absolutePath = path.join(siteRoot, relativePath);
  if (!fs.existsSync(absolutePath)) return { path: relativePath, sourceHash: null };
  return {
    path: relativePath,
    sourceHash: sha256(fs.readFileSync(absolutePath, "utf8")),
  };
}

function lineAnnotationsFor(evidence, centralModel) {
  const slice = evidence.codeSlice;
  if (
    !slice?.sourcePath ||
    !Number.isInteger(slice.startLine) ||
    !Number.isInteger(slice.endLine) ||
    slice.endLine < slice.startLine
  ) {
    return [];
  }
  const source = fs.readFileSync(path.join(siteRoot, slice.sourcePath), "utf8");
  const lines = source.split(/\r?\n/u);
  return lines.slice(slice.startLine - 1, slice.endLine).map((code, index) => ({
    line: slice.startLine + index,
    code,
    annotation: `Explain what this line changes in ${centralModel}: state, control flow, representation, cost, proof obligation, or boundary.`,
  }));
}

function arcProjectId(module) {
  const assignment = arcProjectByModuleId.get(module.id);
  if (!assignment) throw new Error(`No cumulative arc project is assigned to ${module.id}`);
  return assignment.project.id;
}

function buildTaLaunchCard(module, guide, session, evidence) {
  const centralModel = guide?.centralModel ?? module.purpose;
  const lineByLineAnnotations = lineAnnotationsFor(evidence, centralModel);
  const hasExecutableSlice = lineByLineAnnotations.length > 0;
  return {
    status: "prepared-derived",
    copyHeading: `Atlas TA · M${String(module.number).padStart(2, "0")} · Session ${session.number} · ${session.title}`,
    openingProblem: session.launch ?? `Start with a small ${centralModel} mystery and make the current model explicit.`,
    predictionPrompt: `Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.`,
    boundedWalk: {
      sourcePath: evidence.codeSlice.sourcePath,
      language: evidence.codeSlice.language,
      startLine: evidence.codeSlice.startLine,
      endLine: evidence.codeSlice.endLine,
      instruction: "Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.",
      lineByLineAnnotations,
      expectedReveal: {
        status: hasExecutableSlice ? "run-or-trace-boundary" : "explicit-non-execution-boundary",
        expectedOutput: null,
        expectedOutputKind: "learner-prediction-before-observation",
        captureRule: "Ask for the learner prediction first. Reveal only an observed output/state or a clearly labelled hand-worked trace; otherwise record unverified.",
      },
    },
    stateTrace: {
      format: "before → line → after",
      columns: ["line", "bindings/objects or symbols", "control flow", "representation/cost", "claim and boundary"],
      prompt: `After each line, update the smallest visible state model for ${centralModel}.`,
    },
    whiteboard: [
      centralModel,
      guide?.traceOrDerivation ?? "one visible trace or derivation",
      guide?.boundary ?? "the narrowest valid claim and its non-claim",
      "display math, labelled fenced code, diagram, and prose/ASCII fallback",
    ],
    changedPremise: `Change one input, invariant, premise, or assumption related to ${guide?.misconception ?? module.purpose}; ask what changes and why.`,
    changedPremiseQuestions: [
      "Which predicted state or result changes first?",
      "Which invariant, assumption, or proof obligation survives?",
      "What new test, trace, or counterexample would separate the competing explanations?",
    ],
    questionPause: "Pause for learner questions after the first trace and before the changed-premise reveal.",
    learnerArtifact: session.output ?? `A compact ${centralModel} evidence card`,
    studyPartnerHandoff: `Carry the ${session.output ?? "session artifact"} into the Study Partner design brief and visible implementation loop.`,
    adaptationRequired: true,
  };
}

function buildStudyPartnerLaunchCard(module, guide, session, evidence, arcAssignment) {
  const centralModel = guide?.centralModel ?? module.purpose;
  return {
    status: "prepared-derived",
    copyHeading: `Atlas Study Partner · M${String(module.number).padStart(2, "0")} · Session ${session.number} · ${session.title}`,
    designBrief: `Implement or inspect one bounded ${centralModel} slice for ${arcAssignment.project.title}.`,
    learnerBeforePatch: [
      "State intent, system boundary, non-goals, constraints, and one safety/privacy concern.",
      "Predict behavior and give confidence before the first patch.",
      "Name the invariant, proof condition, or observable acceptance criterion.",
    ],
    architectureSketch: "Draw the smallest data-flow, state, call-graph, or proof map before writing code.",
    starterSlice: evidence.codeSlice,
    patchSequence: [
      "write one visible incremental patch",
      "explain each meaningful line and state transition",
      "run a bounded test/trace or label it honestly as simulated/unverified",
      "inject one failure, changed requirement, or counterexample",
      "debug the smallest repair",
      "review the diff against contract, tests, privacy/accessibility, and cost",
      "ask the learner to explain the mechanism and record one non-claim",
    ],
    failureInjection: guide?.misconception ?? `change one assumption in ${centralModel}`,
    acceptanceCriteria: [
      "Generated code remains visible and reviewable; no opaque solution dump.",
      "Observed execution is separated from prediction, simulation, assumption, and unverified claim.",
      "One failure, counterexample, changed premise, or boundary is investigated.",
      `The learner can explain the ${centralModel} mechanism and the smallest remaining uncertainty.`,
    ],
    projectHandoff: `Attach the reviewed patch or trace to the ${arcAssignment.project.id} slice and carry the unresolved boundary forward.`,
    adaptationRequired: true,
  };
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
      status: "prepared-derived",
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
      adaptationRequired: true,
      launchCard: buildTaLaunchCard(module, guide, session, evidence),
    },
    studyPartner: {
      status: "prepared-derived",
      mode: "ai-pair-programming",
      partnerMayWriteCode: true,
      durationMinutes: [60, 90],
      blocksPerModule: [2, 3],
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
      adaptationRequired: true,
      launchCard: buildStudyPartnerLaunchCard(
        module,
        guide,
        session,
        evidence,
        arcProjectByModuleId.get(module.id),
      ),
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
  const arcAssignment = arcProjectByModuleId.get(module.id);
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
    sourceMap: sourceMapRecord(evidence.sourceMap),
    prerequisites: module.academicPrerequisiteNumbers,
    forwardModuleNumber: module.forwardModuleNumber,
    deliverySchedule: {
      recommendedRoute: "90-day",
      intensiveRoute: "60-day",
      durableRoute: "180-day",
      taLectureMinutes: [40, 55],
      studyPartnerBlocks: [2, 3],
      studyPartnerBlockMinutes: [60, 90],
      repairOralDefenseMinutes: [20, 30],
      delayedRetrievalMinutes: [20, 30],
      compressionRule: "Extend the calendar rather than skip a proof, trace, debugging step, or transfer task.",
    },
    guide: guide ?? null,
    sessions: sessions.map((session) => buildSession(module, guide, session, evidence)),
    project: {
      status: "prepared-derived",
      arcProjectId: arcAssignment.project.id,
      arcProjectTitle: arcAssignment.project.title,
      level: module.number >= 31 ? "graduate-depth-scoped" : "upper-undergraduate-to-graduate-slice",
      scenario: arcAssignment.slice.scope,
      moduleSlice: arcAssignment.slice,
      architectureSketch: arcAssignment.project.architecture,
      implementationPlan: arcAssignment.project.milestones,
      starterState: evidence.codeSlice,
      expectedPatchSequence: [
        "state the contract, invariant, theorem condition, or numerical question",
        "make a small visible patch, derivation, or experiment",
        "trace the changed state, representation, cost, or proof obligation",
        "run a bounded test/trace or label the result as simulated/unverified",
        "inject a failure, counterexample, changed premise, or boundary",
        "repair and review the smallest consequential change",
      ],
      tests: [
        "Check the named contract or invariant against one small fixture.",
        "Trace one expected behavior and record what the observation does and does not establish.",
        "Re-run after the changed premise or failure injection; keep prediction separate from execution.",
      ],
      debuggingScenarios: [
        guide?.misconception ?? `a false claim about ${guide?.centralModel ?? module.purpose}`,
        `change one input, invariant, premise, or assumption in ${guide?.centralModel ?? module.purpose}`,
        "find the first boundary where the observed behavior diverges from the stated contract",
      ],
      codeReviewChecklist: [
        "Can the learner name the boundary, non-goals, and invariant before accepting the patch?",
        "Does each generated line have an explained mechanism, cost, and relevant assumption?",
        "Are observed output, prediction, simulation, theorem, and unverified claim labelled separately?",
        "Does the diff preserve privacy, access boundaries, and the smallest useful design?",
      ],
      sourceSection: evidence.projectSection,
      definitionOfDone: [
        "A named contract, invariant, or proof condition is written before implementation.",
        "A small architecture/data-flow or state diagram is available in the chat and PDF.",
        "A test, trace, counterexample, or numerical observation is attached.",
        "The learner reviews the final patch and states one non-claim.",
      ],
      adaptationRequired: true,
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
      pdfStatus: "local-release-pipeline",
      math: "KaTeX plus readable source/prose fallback",
      diagrams: "Mermaid SVG plus authored text alternative",
      interactiveStudio: module.studioId ? "static-print-companion-required" : "none-declared",
    },
    coverage: {
      workbook: "present",
      sourceMap: evidence.sourceMap ? "bound-and-hashed" : "missing",
      sixSessionSpine: sessions.length === 6 ? "present" : "repair-required",
      taLecture: "prepared-derived-launch-cards",
      studyPartnerProject: "prepared-derived-project-loop",
      codeFixture: hasReferenceModel && hasReferenceTest ? "reference-pair" : evidence.codeSlice.status,
      pdf: "local-release-pipeline",
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
