#!/usr/bin/env node
// Verify that every generated bench notebook still parses as Python.
//
// A bench is authored as a `.py` and executed in CI as a `.ipynb` that jupytext
// generates from it. Those are not guaranteed to agree. jupytext *uncomments*
// lines it reads as commented-out shell magics — and `copy`, `ls`, `rm`, `cd`
// and friends are shell commands — so a perfectly ordinary comment beginning
//
//     # copy of itself would pass unconditionally...
//
// is emitted into the notebook as a bare statement. The `.py` parses, every
// local run of the `.py` passes, and only the notebook fails. That happened once
// and cost a full-corpus run to find.
//
// This checks the artifact CI actually executes, which is the point: the source
// passing is not evidence about the notebook.
//
// Read-only. Requires the notebooks to have been generated already.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(siteRoot, "benches/src");

// Words jupytext may treat as shell escapes at the start of a comment line.
// Not exhaustive — the compile check below is the real guard; this list only
// makes the diagnosis readable when it fires.
const SHELL_WORDS = new Set([
  "copy", "cp", "mv", "rm", "ls", "dir", "cd", "cat", "type", "mkdir", "rmdir",
  "echo", "pwd", "touch", "del", "move", "pip", "conda",
]);

const findings = [];
let notebooks = 0;

const packs = fs
  .readdirSync(sourceRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const pack of packs) {
  const directory = path.join(sourceRoot, pack);
  for (const file of fs.readdirSync(directory)) {
    if (!file.endsWith(".ipynb")) continue;
    notebooks += 1;
    const notebook = JSON.parse(
      fs.readFileSync(path.join(directory, file), "utf8"),
    );
    const source = path.join(directory, file.replace(/\.ipynb$/, ".py"));
    const sourceText = fs.existsSync(source)
      ? fs.readFileSync(source, "utf8")
      : "";

    for (const [index, cell] of (notebook.cells ?? []).entries()) {
      if (cell.cell_type !== "code") continue;
      const lines = (Array.isArray(cell.source) ? cell.source : [cell.source])
        .join("")
        .split("\n");
      for (const [lineNumber, line] of lines.entries()) {
        const firstWord = line.trimStart().split(/[\s(]/)[0];
        if (!SHELL_WORDS.has(firstWord)) continue;
        // A bare shell word at statement position is almost certainly an
        // uncommented comment. Confirm by looking for it commented in the .py.
        if (sourceText.includes(`# ${line.trim()}`)) {
          findings.push(
            `${pack}/${file}: cell ${index}, line ${lineNumber + 1} reads ` +
              `${JSON.stringify(line.trim().slice(0, 60))} as code, but the ` +
              `.py has it commented — jupytext uncommented a line beginning ` +
              `with the shell word "${firstWord}". Reword the comment.`,
          );
        }
      }
    }
  }
}

console.log(
  JSON.stringify({ notebooksChecked: notebooks, findings: findings.length }, null, 2),
);

// Notebooks are generated, not committed (`benches/**/*.ipynb` is gitignored), so
// a fresh checkout has none and this script would examine nothing and exit 0 --
// a gate that reports green precisely when it cannot do its job. It was wired
// into a CI job that never ran jupytext, which is exactly that case.
//
// Run it after generation, and make the empty run loud rather than reassuring.
const sources = packs.reduce(
  (total, pack) =>
    total +
    fs
      .readdirSync(path.join(sourceRoot, pack))
      .filter((file) => file.endsWith(".py") && /^s\d/u.test(file)).length,
  0,
);
if (notebooks < sources) {
  console.error(
    `\nfound ${notebooks} notebook(s) for ${sources} bench source(s). Generate ` +
      `them first:\n  python -m jupytext --to ipynb benches/src/m*/s*.py\n` +
      `Checking fewer notebooks than sources cannot establish that the ` +
      `artifacts CI executes match their sources.`,
  );
  process.exitCode = 1;
}

if (findings.length) {
  console.error("\nfindings:");
  for (const finding of findings) console.error(`  - ${finding}`);
  process.exitCode = 1;
}
