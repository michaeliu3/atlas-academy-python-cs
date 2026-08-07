import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const graph = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/course-graph.v2.json"), "utf8"),
);
const packs = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/module-teaching-packs.v1.json"), "utf8"),
);
const arcProjects = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/arc-projects.v1.json"), "utf8"),
);
const arcAssignmentByModuleId = new Map(
  arcProjects.projects.flatMap((project) =>
    project.moduleSlices.map((slice) => [slice.moduleId, { project, slice }]),
  ),
);

const errors = [];
const graphById = new Map(graph.modules.map((module) => [module.id, module]));
const seen = new Set();
const requiredTaSteps = 6;
const requiredPartnerSteps = 8;

function exists(relativePath) {
  return relativePath && fs.existsSync(path.join(siteRoot, relativePath));
}

function sha256File(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(siteRoot, relativePath))).digest("hex");
}

for (const pack of packs.modules ?? []) {
  if (seen.has(pack.moduleId)) errors.push(`${pack.moduleId}: duplicate module id`);
  seen.add(pack.moduleId);
  const graphModule = graphById.get(pack.moduleId);
  if (!graphModule) {
    errors.push(`${pack.moduleId}: not present in canonical course graph`);
    continue;
  }
  const arcAssignment = arcAssignmentByModuleId.get(pack.moduleId);
  if (!arcAssignment || pack.project?.arcProjectId !== arcAssignment.project.id) {
    errors.push(`${pack.moduleId}: project is not bound to the canonical arc-project spine`);
  }
  if (pack.project?.moduleSlice?.moduleId !== pack.moduleId) {
    errors.push(`${pack.moduleId}: project module slice is missing or mismatched`);
  }
  for (const field of ["number", "slug", "title", "purpose", "knowledgeArcId", "availability"]) {
    if (pack[field] !== graphModule[field] && !(field === "availability" && pack[field] === graphModule.state?.availability)) {
      errors.push(`${pack.moduleId}: ${field} disagrees with canonical graph`);
    }
  }
  if (!exists(pack.workbook?.path)) errors.push(`${pack.moduleId}: workbook missing: ${pack.workbook?.path}`);
  if (!pack.sourceMap?.path || !pack.sourceMap?.sourceHash || !exists(pack.sourceMap.path)) {
    errors.push(`${pack.moduleId}: source map binding is missing or unresolved`);
  } else if (pack.sourceMap.sourceHash !== sha256File(pack.sourceMap.path)) {
    errors.push(`${pack.moduleId}: source map hash does not match the checked-in source map`);
  }
  const schedule = pack.deliverySchedule;
  if (
    !schedule ||
    schedule.recommendedRoute !== "90-day" ||
    schedule.intensiveRoute !== "60-day" ||
    schedule.durableRoute !== "180-day" ||
    schedule.taLectureMinutes?.length !== 2 ||
    schedule.studyPartnerBlocks?.length !== 2 ||
    schedule.studyPartnerBlockMinutes?.length !== 2 ||
    schedule.repairOralDefenseMinutes?.length !== 2 ||
    schedule.delayedRetrievalMinutes?.length !== 2
  ) {
    errors.push(`${pack.moduleId}: chat-led delivery schedule is incomplete`);
  }
  if (pack.coverage?.sourceMap !== "bound-and-hashed") {
    errors.push(`${pack.moduleId}: coverage source-map status is not bound-and-hashed`);
  }
  if (pack.availability === "authoring-only" && pack.workbook?.visibility !== "private-guided-study") {
    errors.push(`${pack.moduleId}: authoring-only workbook must be private-guided-study`);
  }
  if ((pack.availability === "preview" || pack.availability === "legacy-open") && pack.workbook?.visibility !== "reader") {
    errors.push(`${pack.moduleId}: reader-visible/preview workbook must be reader visibility`);
  }
  if (pack.sessions?.length !== 6) errors.push(`${pack.moduleId}: expected six sessions, found ${pack.sessions?.length ?? 0}`);
  const sessionNumbers = new Set();
  for (const session of pack.sessions ?? []) {
    if (sessionNumbers.has(session.number)) errors.push(`${pack.moduleId}: duplicate session ${session.number}`);
    sessionNumbers.add(session.number);
    if (!session.title || !session.workbookHeadingId) errors.push(`${pack.moduleId}: session ${session.number} lacks workbook anchor`);
    if (session.taLecture?.sequence?.length !== requiredTaSteps) errors.push(`${pack.moduleId}: session ${session.number} TA sequence is incomplete`);
    if (session.studyPartner?.sequence?.length !== requiredPartnerSteps) errors.push(`${pack.moduleId}: session ${session.number} Study Partner sequence is incomplete`);
    if (session.studyPartner?.partnerMayWriteCode !== true) errors.push(`${pack.moduleId}: session ${session.number} must explicitly permit visible partner code authorship`);
    if (session.studyPartner?.durationMinutes?.length !== 2 || session.studyPartner?.blocksPerModule?.length !== 2) {
      errors.push(`${pack.moduleId}: session ${session.number} Study Partner timing is incomplete`);
    }
    if (!session.taLecture?.whiteboard?.length) errors.push(`${pack.moduleId}: session ${session.number} lacks whiteboard material`);
    if (session.taLecture?.launchCard?.status !== "prepared-derived") errors.push(`${pack.moduleId}: session ${session.number} lacks a prepared TA launch card`);
    if (!session.taLecture?.launchCard?.boundedWalk?.sourcePath || !session.taLecture?.launchCard?.predictionPrompt) {
      errors.push(`${pack.moduleId}: session ${session.number} TA launch card lacks source-bound prediction/walk fields`);
    }
    if (!Array.isArray(session.taLecture?.launchCard?.boundedWalk?.lineByLineAnnotations)) {
      errors.push(`${pack.moduleId}: session ${session.number} TA launch card lacks line annotations`);
    }
    if (
      !session.taLecture?.launchCard?.boundedWalk?.expectedReveal ||
      session.taLecture.launchCard.boundedWalk.expectedReveal.expectedOutputKind !== "learner-prediction-before-observation" ||
      !session.taLecture?.launchCard?.stateTrace?.columns?.length
    ) {
      errors.push(`${pack.moduleId}: session ${session.number} TA launch card lacks reveal/state-trace material`);
    }
    if (session.studyPartner?.launchCard?.status !== "prepared-derived") errors.push(`${pack.moduleId}: session ${session.number} lacks a prepared Study Partner launch card`);
    if (session.studyPartner?.launchCard?.patchSequence?.length !== 7 || !session.studyPartner?.launchCard?.starterSlice) {
      errors.push(`${pack.moduleId}: session ${session.number} Study Partner launch card is incomplete`);
    }
    if (!session.evidence?.artifact || !session.evidence?.retrievalPrompt) errors.push(`${pack.moduleId}: session ${session.number} lacks evidence/retrieval fields`);
  }
  if (
    pack.project?.status !== "prepared-derived" ||
    !pack.project?.arcProjectId ||
    !pack.project?.scenario ||
    !pack.project?.architectureSketch ||
    pack.project?.implementationPlan?.length !== 3 ||
    pack.project?.expectedPatchSequence?.length !== 6 ||
    pack.project?.tests?.length !== 3 ||
    pack.project?.debuggingScenarios?.length !== 3 ||
    pack.project?.codeReviewChecklist?.length !== 4 ||
    pack.project?.definitionOfDone?.length !== 4
  ) {
    errors.push(`${pack.moduleId}: project packet scaffold is incomplete`);
  }
  if (!pack.code?.executionBoundary || !pack.code?.codeSlice) errors.push(`${pack.moduleId}: code execution boundary is missing`);
  if (pack.availability === "preview" && pack.rendering?.pdfStatus === "published") errors.push(`${pack.moduleId}: preview PDF cannot be published`);
  if (pack.availability === "authoring-only" && pack.rendering?.pdfStatus === "published") errors.push(`${pack.moduleId}: authoring-only PDF cannot be published`);
}

for (const graphModule of graph.modules) {
  if (!seen.has(graphModule.id)) errors.push(`${graphModule.id}: missing from teaching-pack registry`);
}

if (packs.modules?.length !== graph.modules.length) {
  errors.push(`module count mismatch: ${packs.modules?.length ?? 0} vs ${graph.modules.length}`);
}

const summary = {
  modules: packs.modules?.length ?? 0,
  sessions: (packs.modules ?? []).reduce((total, pack) => total + (pack.sessions?.length ?? 0), 0),
  referencePairs: (packs.modules ?? []).filter((pack) => pack.code?.referenceModel && pack.code?.referenceTest).length,
  explicitNonExecutionBoundaries: (packs.modules ?? []).filter((pack) => pack.code?.codeSlice?.status === "explicit-non-execution-boundary").length,
  errors: errors.length,
};

if (errors.length) {
  console.error(JSON.stringify({ summary, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(summary, null, 2));
}
