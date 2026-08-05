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

const errors = [];
const graphById = new Map(graph.modules.map((module) => [module.id, module]));
const seen = new Set();
const requiredTaSteps = 6;
const requiredPartnerSteps = 8;

function exists(relativePath) {
  return relativePath && fs.existsSync(path.join(siteRoot, relativePath));
}

for (const pack of packs.modules ?? []) {
  if (seen.has(pack.moduleId)) errors.push(`${pack.moduleId}: duplicate module id`);
  seen.add(pack.moduleId);
  const module = graphById.get(pack.moduleId);
  if (!module) {
    errors.push(`${pack.moduleId}: not present in canonical course graph`);
    continue;
  }
  for (const field of ["number", "slug", "title", "purpose", "knowledgeArcId", "availability"]) {
    if (pack[field] !== module[field] && !(field === "availability" && pack[field] === module.state?.availability)) {
      errors.push(`${pack.moduleId}: ${field} disagrees with canonical graph`);
    }
  }
  if (!exists(pack.workbook?.path)) errors.push(`${pack.moduleId}: workbook missing: ${pack.workbook?.path}`);
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
    if (!session.taLecture?.whiteboard?.length) errors.push(`${pack.moduleId}: session ${session.number} lacks whiteboard material`);
    if (!session.evidence?.artifact || !session.evidence?.retrievalPrompt) errors.push(`${pack.moduleId}: session ${session.number} lacks evidence/retrieval fields`);
  }
  if (!pack.project?.arcProjectId || !pack.project?.scenario || pack.project?.definitionOfDone?.length !== 4) {
    errors.push(`${pack.moduleId}: project packet scaffold is incomplete`);
  }
  if (!pack.code?.executionBoundary || !pack.code?.codeSlice) errors.push(`${pack.moduleId}: code execution boundary is missing`);
  if (pack.availability === "preview" && pack.rendering?.pdfStatus === "published") errors.push(`${pack.moduleId}: preview PDF cannot be published`);
  if (pack.availability === "authoring-only" && pack.rendering?.pdfStatus === "published") errors.push(`${pack.moduleId}: authoring-only PDF cannot be published`);
}

for (const module of graph.modules) {
  if (!seen.has(module.id)) errors.push(`${module.id}: missing from teaching-pack registry`);
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

