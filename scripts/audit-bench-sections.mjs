#!/usr/bin/env node
// Proofreading pass over every workbook "## Bench pack" section.
//
// `check-bench-workbook-sync.mjs` already enforces the load-bearing seam: a
// registered session must have a `### Bench K — <artifact>` heading and an
// unbenched session must be named. This script checks the things around that
// seam which a reader would notice and a validator currently would not:
//
//   - the pack line's stated bench count matches the registry
//   - the stated visibility matches the registry
//   - every `plannedSessions` entry appears under a "### Planned" block
//   - no bench section is left over for a session that is no longer registered
//   - each section has its "Cannot establish:" line, which is the one piece of
//     the house style that carries an epistemic obligation
//   - the completion-record path names the right pack
//
// Read-only. Prints findings; exits 1 if any are found.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { benchPackRegistry } from "../lib/module-bench-registry.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const packs = JSON.parse(
  fs.readFileSync(
    path.join(siteRoot, "content/course/module-teaching-packs.v1.json"),
    "utf8",
  ),
);
const packList = packs.packs ?? packs.modules ?? packs;
const packEntries = Array.isArray(packList) ? packList : Object.values(packList);

const NUMBER_WORDS = {
  1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six",
};

const findings = [];
const report = [];

for (const [benchPackId, registration] of Object.entries(benchPackRegistry)) {
  const pack = packEntries.find(
    (entry) =>
      Number(entry.moduleNumber) === registration.moduleNumber ||
      entry.moduleId === benchPackId ||
      entry.id === benchPackId,
  );
  const declared = pack?.workbook?.path ?? pack?.workbook;
  if (typeof declared !== "string") {
    findings.push(`${benchPackId}: no declared workbook path in the teaching pack`);
    continue;
  }

  const text = fs
    .readFileSync(path.join(siteRoot, declared), "utf8")
    .replace(/\r\n/g, "\n");

  // The heading is `## Bench pack` in later modules and `## 21. Bench pack` in
  // earlier ones, and `### Bench pack completion record` appears inside every
  // section. A plain indexOf("## Bench pack") matches that completion heading as
  // a substring and silently slices from the wrong place, which is how this
  // audit first reported seven false "no pack line" findings. Anchor on a whole
  // line, and accept the numbered form.
  const headingMatch = /^##\s+(?:\d+\.\s+)?Bench pack\s*$/mu.exec(text);
  if (!headingMatch) {
    findings.push(`${benchPackId}: workbook has no "## Bench pack" section`);
    continue;
  }
  const section = text.slice(headingMatch.index);

  const built = registration.sessions.length;
  const planned = registration.plannedSessions ?? [];

  // 1. The pack line's stated count.
  const packLine = section.split("\n").find((line) =>
    line.startsWith("**Bench pack:**"),
  );
  if (!packLine) {
    findings.push(`${benchPackId}: no "**Bench pack:**" line`);
  } else {
    if (!packLine.includes(`\`${benchPackId}\``)) {
      findings.push(`${benchPackId}: pack line does not name the pack id`);
    }
    const word = NUMBER_WORDS[built];
    const statesBuilt =
      packLine.includes(`${word} bench`) ||
      packLine.includes(`${built} bench`);
    if (!statesBuilt) {
      findings.push(
        `${benchPackId}: pack line says "${packLine.trim()}" but the registry ` +
          `has ${built} built bench(es)`,
      );
    }
    if (planned.length > 0 && !/planned/i.test(packLine)) {
      findings.push(
        `${benchPackId}: ${planned.length} planned session(s) but the pack line ` +
          `does not mention them`,
      );
    }
    if (planned.length === 0 && /planned/i.test(packLine)) {
      findings.push(
        `${benchPackId}: pack line mentions "planned" but plannedSessions is empty`,
      );
    }
  }

  // 2. Visibility.
  const saysPrivate = /private guided study/i.test(section);
  if (registration.visibility === "private-guided-study" && !saysPrivate) {
    findings.push(
      `${benchPackId}: registry visibility is private-guided-study but the ` +
        `section does not say so`,
    );
  }
  if (registration.visibility === "reader" && saysPrivate) {
    findings.push(
      `${benchPackId}: section claims private guided study but the registry ` +
        `says visibility "reader"`,
    );
  }

  // 3. Planned sessions each appear under a Planned block.
  if (planned.length > 0) {
    if (!section.includes("### Planned")) {
      findings.push(`${benchPackId}: has plannedSessions but no "### Planned" block`);
    } else {
      for (const sessionNumber of planned) {
        if (!new RegExp(`\\*\\*Session ${sessionNumber}\\*\\*`, "u").test(section)) {
          findings.push(
            `${benchPackId}: planned session ${sessionNumber} is not named in ` +
              `the workbook`,
          );
        }
      }
    }
  } else if (section.includes("### Planned")) {
    findings.push(`${benchPackId}: has a "### Planned" block but nothing is planned`);
  }

  // 4. No orphan bench sections.
  const registered = new Set(registration.sessions.map((s) => s.sessionNumber));
  for (const match of section.matchAll(/^### Bench (\d+) — (.+)$/gmu)) {
    const sessionNumber = Number(match[1]);
    if (!registered.has(sessionNumber)) {
      findings.push(
        `${benchPackId}: workbook has "### Bench ${sessionNumber}" but session ` +
          `${sessionNumber} is not registered`,
      );
    }
  }

  // 5. Every bench section carries its non-claim line.
  const benchBlocks = section.split(/^### Bench \d+ — /gmu).slice(1);
  for (const [index, block] of benchBlocks.entries()) {
    if (!block.includes("**Cannot establish:**")) {
      const heading = block.split("\n", 1)[0];
      findings.push(
        `${benchPackId}: bench section ${index + 1} (${heading.trim()}) has no ` +
          `"**Cannot establish:**" line`,
      );
    }
  }

  // 6. The completion record names this pack.
  if (!section.includes(`benches/records/${benchPackId}-s*.json`)) {
    findings.push(
      `${benchPackId}: completion record does not reference ` +
        `benches/records/${benchPackId}-s*.json`,
    );
  }

  report.push({
    pack: benchPackId,
    workbook: declared,
    built,
    planned: planned.length,
    unbenched: (registration.unbenchedSessions ?? []).length,
  });
}

// Every module WITHOUT a pack must still say so in its workbook. The plan's rule
// is "named zeros — record these, don't silently omit", and a module that simply
// never mentions benches is indistinguishable from one that was forgotten.
const graph = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/course-graph.v2.json"), "utf8"),
);
const graphModules = graph.modules ?? graph.nodes ?? [];
let zerosAudited = 0;

for (const graphModule of graphModules) {
  if (graphModule.benchPackId) continue;
  zerosAudited += 1;

  const pack = packEntries.find(
    (entry) =>
      Number(entry.moduleNumber) === graphModule.number ||
      entry.moduleId === graphModule.id ||
      entry.id === graphModule.id,
  );
  const declared = pack?.workbook?.path ?? pack?.workbook;
  if (typeof declared !== "string") {
    findings.push(`${graphModule.id}: no bench pack and no declared workbook path`);
    continue;
  }

  const text = fs
    .readFileSync(path.join(siteRoot, declared), "utf8")
    .replace(/\r\n/g, "\n");
  const headingMatch = /^##\s+(?:\d+\.\s+)?Bench pack\s*$/mu.exec(text);
  if (!headingMatch) {
    findings.push(
      `${graphModule.id}: has no bench pack and its workbook never says so — ` +
        `a named zero must be recorded, not silently omitted`,
    );
    continue;
  }
  const section = text.slice(headingMatch.index);
  if (!/\*\*Bench pack:\*\*\s*none/i.test(section)) {
    findings.push(
      `${graphModule.id}: has no bench pack but its section does not open with ` +
        `"**Bench pack:** none"`,
    );
  }
  for (let sessionNumber = 1; sessionNumber <= 6; sessionNumber += 1) {
    if (!new RegExp(`\\*\\*Session ${sessionNumber}\\*\\*`, "u").test(section)) {
      findings.push(
        `${graphModule.id}: named-zero section does not account for session ` +
          `${sessionNumber}`,
      );
    }
  }
}

console.log(
  JSON.stringify(
    {
      packsAudited: report.length,
      namedZerosAudited: zerosAudited,
      findings: findings.length,
    },
    null,
    2,
  ),
);
if (findings.length) {
  console.error("\nfindings:");
  for (const finding of findings) console.error(`  - ${finding}`);
  process.exitCode = 1;
}
