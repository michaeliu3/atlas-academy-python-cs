import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  classifyEvidenceLabel,
  evidenceCategories,
  isClaimSourcePointer,
  parseEvidenceLabel,
} from "../lib/evidence-label-taxonomy.mjs";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("a bracket label is recognised and ordinary bold is left alone", () => {
  assert.deepEqual(parseEvidenceLabel("[FINITE EXPERIMENT]"), {
    label: "FINITE EXPERIMENT",
    category: "observation",
  });
  assert.equal(parseEvidenceLabel("Reveal:"), null);
  assert.equal(parseEvidenceLabel("not"), null);
  // Sentence-case bold is emphasis, not a label.
  assert.equal(parseEvidenceLabel("[Definition]"), null);
});

test("each epistemic category is reachable and narrow rules win over broad ones", () => {
  assert.equal(classifyEvidenceLabel("THEOREM / PROOF"), "proof");
  assert.equal(classifyEvidenceLabel("DEFINITION / MODEL"), "model");
  assert.equal(classifyEvidenceLabel("COUNTEREXAMPLE"), "counterexample");
  assert.equal(classifyEvidenceLabel("FINITE EXPERIMENT"), "observation");
  assert.equal(classifyEvidenceLabel("LIBRARY CONTRACT"), "contract");
  assert.equal(classifyEvidenceLabel("ATLAS POLICY"), "policy");
  assert.equal(classifyEvidenceLabel("AI PROPOSAL"), "proposal");
  assert.equal(classifyEvidenceLabel("UNKNOWN"), "unknown");

  // "UNAVAILABLE — DEFER OR NARROW CLAIM" ends in CLAIM but is a declared gap,
  // so the gap rule must be consulted before the contract rule.
  assert.equal(classifyEvidenceLabel("UNAVAILABLE — DEFER OR NARROW CLAIM"), "unknown");
  // A newly coined label falls back to a declared construct rather than to
  // established fact.
  assert.equal(classifyEvidenceLabel("SOME BRAND NEW LABEL"), "model");
});

test("a claim/source pointer is distinguished from an identifier", () => {
  assert.ok(isClaimSourcePointer("M32-C03 -> S32-03–S32-04"));
  assert.ok(isClaimSourcePointer("M32-C01–M32-C02 -> S32-01–S32-02"));
  assert.ok(!isClaimSourcePointer("prior_helpful"));
  assert.ok(!isClaimSourcePointer("P(H)"));
  assert.ok(!isClaimSourcePointer("M32-C03"));
});

test("every label authored in the corpus classifies into a known category", async () => {
  const modulesDirectory = resolve(siteRoot, "content/modules");
  const files = (await readdir(modulesDirectory)).filter((name) => name.endsWith(".md"));
  const known = new Set(evidenceCategories);
  const seen = new Map();

  for (const name of files) {
    const markdown = await readFile(resolve(modulesDirectory, name), "utf8");
    for (const match of markdown.matchAll(/\*\*(\[[^\]\n]+\])\*\*/gu)) {
      const parsed = parseEvidenceLabel(match[1]);
      if (!parsed) continue;
      assert.ok(
        known.has(parsed.category),
        `${name}: ${parsed.label} produced unknown category ${parsed.category}`,
      );
      seen.set(parsed.category, (seen.get(parsed.category) ?? 0) + 1);
    }
  }

  assert.ok(seen.size >= 6, `expected most categories in use, saw ${[...seen.keys()].join(", ")}`);
  assert.ok(
    [...seen.values()].reduce((total, count) => total + count, 0) > 250,
    "the corpus should still carry its evidence labels",
  );
});
