#!/usr/bin/env node
// Print the session-slice SHA-256 digests for one module's workbook, so a new
// bench can be registered without hand-copying a hash out of a validator error.
//
//   node scripts/bench-session-hash.mjs 16
//   node scripts/bench-session-hash.mjs 16 2 5 3
//
// The slicing here must stay identical to `check-bench-workbook-sync.mjs` and to
// `atlas_bench._session_sha256`: bounded by the next `^## ` of any kind, and
// CRLF-normalised before hashing so Python and Node agree.

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const SESSION_HEADING = /^##\s+(?:\d+\.\s+)?Session\s+([1-6])\b/gm;
const OUTPUT_HEADING = /^###\s+Session\s+([1-6])\s+output\s+—\s+(.+?)\s*$/gm;
const ANY_H2 = /^##\s/gm;

const [moduleArg, ...sessionArgs] = process.argv.slice(2);
if (!moduleArg) {
  console.error("usage: node scripts/bench-session-hash.mjs <moduleNumber> [session...]");
  process.exit(2);
}

const moduleNumber = Number(moduleArg);

// The authoritative workbook is whichever path the teaching-pack manifest
// declares, and it is NOT always content/modules/. Authoring-only modules
// (M31 and up) live under content/authoring/, and content/modules/ holds a
// mirror. Hashing the mirror happens to agree today and is not guaranteed to,
// so resolve the declared path — it is what the sync validator reads.
const packs = JSON.parse(
  fs.readFileSync("content/course/module-teaching-packs.v1.json", "utf8"),
);
const packList = packs.packs ?? packs.modules ?? packs;
const entries = Array.isArray(packList) ? packList : Object.values(packList);
const pack = entries.find(
  (entry) =>
    Number(entry.moduleNumber) === moduleNumber ||
    entry.moduleId === `m${moduleNumber}` ||
    entry.id === `m${moduleNumber}`,
);

const declared = pack?.workbook?.path ?? pack?.workbook;
let workbookPath = typeof declared === "string" ? declared : null;

if (!workbookPath) {
  const directory = "content/modules";
  const prefix = String(moduleNumber).padStart(2, "0") + "_";
  const file = fs.readdirSync(directory).find((name) => name.startsWith(prefix));
  if (!file) {
    console.error(`no workbook declared or found for module ${moduleNumber}`);
    process.exit(1);
  }
  workbookPath = path.join(directory, file);
  console.error(`(no declared path for m${moduleNumber}; falling back to ${workbookPath})`);
}
const raw = fs.readFileSync(workbookPath, "utf8").replace(/\r\n/g, "\n");

const outputs = new Map();
for (const match of raw.matchAll(OUTPUT_HEADING)) {
  outputs.set(Number(match[1]), match[2]);
}

const starts = [...raw.matchAll(SESSION_HEADING)].map((m) => ({
  session: Number(m[1]),
  index: m.index,
}));
const boundaries = [...raw.matchAll(ANY_H2)].map((m) => m.index);

const wanted = sessionArgs.length ? sessionArgs.map(Number) : null;

console.log(`${workbookPath}\n`);
for (const { session, index } of starts) {
  if (wanted && !wanted.includes(session)) continue;
  const end = boundaries.find((b) => b > index) ?? raw.length;
  const slice = raw.slice(index, end);
  const digest = createHash("sha256").update(slice, "utf8").digest("hex");
  const title = slice.split("\n", 1)[0].replace(/^##\s+/, "");
  console.log(`session ${session}  ${digest}`);
  console.log(`  heading: ${title}`);
  console.log(`  emits  : ${outputs.get(session) ?? "(no declared output)"}`);
  console.log(`  bytes  : ${slice.length}\n`);
}
