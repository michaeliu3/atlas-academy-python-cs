/**
 * Does each bench still match the session it is bound to?
 *
 * Hashes the **session slice** — from `## Session N — …` to the next `##` — not
 * the whole workbook. A typo fix elsewhere in a 3,000-line file must not fail
 * the build; a changed session contract must.
 *
 * Newlines are normalised to "\n" before hashing. The workbooks are CRLF, and
 * `atlas_bench` (Python) hashes the same slice to embed in every bench record.
 * Python's text mode converts CRLF silently and Node's `readFileSync` does not,
 * so without this line the two languages disagree on every digest.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  benchIdFor,
  benchPackIds,
  benchPackRegistry,
  ladderRungs,
} from "../lib/module-bench-registry.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");

const packs = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/module-teaching-packs.v1.json"), "utf8"),
);
const packByModuleId = new Map((packs.modules ?? []).map((pack) => [pack.moduleId, pack]));

const errors = [];
let checkedSessions = 0;
let checkedBenchSections = 0;

function readWorkbook(relativePath) {
  const absolute = path.join(siteRoot, relativePath);
  if (!fs.existsSync(absolute)) return null;
  return fs.readFileSync(absolute, "utf8").replace(/\r\n/g, "\n");
}

/**
 * Slice a workbook into `{ sessionNumber -> text }` on `## Session N` headings.
 *
 * A slice ends at the next level-2 heading of ANY kind, not at the next
 * *session* heading. Ending at the next session would make the last session's
 * slice run to end of file, so an edit to the problem ladder, the MCQ block, or
 * anything else downstream would invalidate that bench — the precise false
 * positive this hash exists to avoid. `atlas_bench._session_sha256` slices
 * identically; if the two ever diverge, every record fails for a reason no
 * error message would explain.
 */
function sessionSlices(text) {
  const allH2 = [...text.matchAll(/^##\s/gmu)].map((match) => match.index);
  const slices = new Map();
  // Two heading forms exist and both must match: "## Session 1 — …" (M05, M09,
  // M18, M31–M36) and "## 2. Session 1 — …" (M19–M30). Requiring the bare form
  // finds ZERO sessions in two thirds of the corpus.
  for (const match of text.matchAll(/^##\s+(?:\d+\.\s+)?Session\s+([1-6])\b/gmu)) {
    const end = allH2.find((index) => index > match.index) ?? text.length;
    slices.set(Number(match[1]), text.slice(match.index, end));
  }
  return slices;
}

/**
 * The ladder rung at ordinal `k`, keyed on POSITION not title. Heading style
 * varies across the corpus — `### A. Recognize`, `### Level 1 — Recognize`,
 * bespoke titles, or absent entirely — so matching on text would fail on
 * two-thirds of the modules.
 */
function ladderHeadingCount(text) {
  const letterForm = [...text.matchAll(/^###\s+([A-H])\.\s+/gmu)];
  if (letterForm.length) return letterForm.length;
  const levelForm = [...text.matchAll(/^###\s+Level\s+([1-8])\s*[—-]/gmu)];
  return levelForm.length;
}

for (const benchPackId of benchPackIds) {
  const registration = benchPackRegistry[benchPackId];
  const moduleId = `m${String(registration.moduleNumber).padStart(2, "0")}`;
  const pack = packByModuleId.get(moduleId);
  if (!pack) {
    errors.push(`${benchPackId}: no teaching pack for ${moduleId}`);
    continue;
  }

  const workbookPath = pack.workbook?.path ?? pack.workbook;
  const text = typeof workbookPath === "string" ? readWorkbook(workbookPath) : null;
  if (text === null) {
    errors.push(`${benchPackId}: cannot read workbook ${JSON.stringify(workbookPath)}`);
    continue;
  }

  const slices = sessionSlices(text);
  const rungCount = ladderHeadingCount(text);

  // 1. The session slice still hashes to what the registry recorded.
  for (const session of registration.sessions ?? []) {
    const benchId = benchIdFor(benchPackId, session.sessionNumber);
    const slice = slices.get(session.sessionNumber);
    if (slice === undefined) {
      errors.push(`${benchId}: workbook has no "## Session ${session.sessionNumber}" heading`);
      continue;
    }
    checkedSessions += 1;
    const actual = crypto.createHash("sha256").update(slice).digest("hex");
    if (actual !== session.sessionSha256) {
      errors.push(
        `${benchId}: session contract changed. The workbook slice now hashes to ` +
          `${actual} but the registry records ${session.sessionSha256}. Re-read the ` +
          `session, confirm the bench still emits "${session.emitsArtifact}", then ` +
          `update sessionSha256.`,
      );
    }

    // 3. Declared rungs exist in this workbook's ladder, keyed on ordinal.
    for (const rung of session.rungs ?? []) {
      const ordinal = ladderRungs.indexOf(rung) + 1;
      if (ordinal > 0 && rungCount > 0 && ordinal > rungCount) {
        errors.push(
          `${benchId}: declares rung "${rung}" (ordinal ${ordinal}) but the workbook ` +
            `ladder has only ${rungCount} rungs`,
        );
      }
    }
  }

  // 2. The workbook's bench section names the same artifacts the pack declares.
  const benchHeadings = [...text.matchAll(/^###\s+Bench\s+(\d)\s*[—-]\s*(.+)$/gmu)];
  if (!benchHeadings.length) {
    errors.push(
      `${benchPackId}: workbook has no "### Bench K — …" section. A registered pack ` +
        `must be specified in the workbook, following the studio precedent: the ` +
        `workbook specifies, the graph binds, this validator checks they agree.`,
    );
  } else {
    for (const match of benchHeadings) {
      const sessionNumber = Number(match[1]);
      const title = match[2].trim();
      const session = (registration.sessions ?? []).find(
        (candidate) => candidate.sessionNumber === sessionNumber,
      );
      checkedBenchSections += 1;
      if (!session) {
        errors.push(
          `${benchPackId}: workbook declares "### Bench ${sessionNumber}" but no such bench is registered`,
        );
        continue;
      }
      if (title !== session.emitsArtifact) {
        errors.push(
          `${benchIdFor(benchPackId, sessionNumber)}: workbook heading says ` +
            `${JSON.stringify(title)} but the pack emits ${JSON.stringify(session.emitsArtifact)}`,
        );
      }
    }
  }

  // 4. A sparse pack must tell the reader which sessions have no bench and why.
  // An unexplained absence reads as an oversight; a stated one teaches the limits
  // of the tool.
  for (const excluded of registration.unbenchedSessions ?? []) {
    const mentioned = new RegExp(
      `\\*\\*Session ${excluded.sessionNumber}\\*\\*`,
      "u",
    ).test(text);
    if (!mentioned) {
      errors.push(
        `${benchPackId}: session ${excluded.sessionNumber} has no bench (${excluded.reason}) ` +
          `but the workbook's "Sessions without a bench" block does not mention it.`,
      );
    }
  }
}

// The two counters must agree: every registered session needs exactly one
// `### Bench K` section. They drifted apart once — a workbook edit deleted a
// section that had just been written — and the report printed 79 against 78
// with zero errors, because nothing compared them. A number that is only
// displayed is not a check.
if (checkedSessions !== checkedBenchSections) {
  errors.push(
    `${checkedSessions} registered session(s) but ${checkedBenchSections} ` +
      `"### Bench K" section(s) across all workbooks. Every registered session ` +
      `must have exactly one bench section.`,
  );
}

const summary = {
  benchPacks: benchPackIds.length,
  sessionsChecked: checkedSessions,
  benchSectionsChecked: checkedBenchSections,
  errors: errors.length,
};

if (errors.length) {
  console.error(JSON.stringify({ summary, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(summary, null, 2));
}
