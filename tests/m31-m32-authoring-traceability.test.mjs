import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const m31Path = "content/authoring/m31_optimization_information_workbook.v1.md";
const m32Path = "content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md";
const m31CandidatePath = "content/modules/31_optimization_information.md";
const m32CandidatePath = "content/modules/32_systems_languages_scientific_python_accelerators.md";

async function readMarkdown(relativePath) {
  return (await readFile(relativePath, "utf8")).replace(/\r\n?/gu, "\n");
}

test("M31 exposes compact claim-to-source routes and labels non-runnable sketches", async () => {
  const [m31, m31Candidate, bridge] = await Promise.all([
    readMarkdown(m31Path),
    readMarkdown(m31CandidatePath),
    readFile("content/course/m31-m36-prerequisite-session-bridge.v1.json", "utf8"),
  ]);

  assert.match(m31, /C04 -> S02–S04/u);
  assert.match(m31, /C05 -> S02–S04, S09–S10/u);
  assert.match(m31, /Newton, quasi-Newton, subgradient,\s*proximal, coordinate, momentum, and adaptive updates/u);
  assert.match(m31, /Method-family bridge — the update rule carries the assumptions/u);
  assert.match(m31, /C07 -> S05/iu);
  assert.match(m31, /C08 -> S06/iu);
  assert.match(m31, /Blei, Kucukelbir, and McAuliffe/u);
  assert.match(m31, /Robbins and Monro/u);
  assert.match(m31, /domain containing the segment from/u);
  assert.match(m31, /language-neutral pseudocode, not directly runnable Python/u);
  assert.match(m31, /```text\nraw = point - step_size \* gradient\(point\)/u);
  assert.match(m31, /language-neutral estimator pseudocode, not a standalone Python/u);
  assert.match(m31, /```text\nlog_weight = log_joint\(x, z\) - log_q\(z, x\)/u);
  assert.match(
    m31,
    /\[`m31GradientDescentRateCard\(10\)`\]\(\.\.\/\.\.\/lib\/m31-optimization-authoring-model\.js\)/u,
  );
  assert.match(
    m31Candidate,
    /\[`m31GradientDescentRateCard\(10\)`\]\(\.\.\/\.\.\/lib\/m31-optimization-authoring-model\.js\)/u,
  );
  for (const m31Pack of [m31, m31Candidate]) {
    assert.match(m31Pack, /Two routes, two evidentiary burdens/u);
    assert.match(m31Pack, /Changed-premise oral check/u);
    assert.match(m31Pack, /do not exchange a channel question for a coding question/u);
    assert.match(m31Pack, /asymptotic coding theorem, not a finite-code score/u);
  }

  const m31Sessions = JSON.parse(bridge).modules.find(({ moduleId }) => moduleId === "m31").sessionSpine;
  const sessionFour = m31Sessions.find(({ id }) => id === "m31-s04");
  const sessionFive = m31Sessions.find(({ id }) => id === "m31-s05");
  assert.match(sessionFour.progression, /projected-gradient/u);
  assert.match(sessionFour.progression, /Newton\/quasi-Newton/u);
  assert.match(sessionFour.progression, /subgradient\/proximal/u);
  assert.match(sessionFour.progression, /coordinate/u);
  assert.match(sessionFour.progression, /momentum/u);
  assert.match(sessionFour.progression, /adaptive/u);
  assert.match(sessionFive.progression, /Information quantities begin in Session 6/u);
});

test("M32 connects claim tags to one pinned CPU-only NumPy observation", async () => {
  const [m32, m32Candidate, observation, pythonTest] = await Promise.all([
    readMarkdown(m32Path),
    readMarkdown(m32CandidatePath),
    readFile("scripts/m32_numpy_layout_observation.py", "utf8"),
    readFile("scripts/test_m32_numpy_layout_observation.py", "utf8"),
  ]);

  assert.match(m32, /M32-C03–M32-C04 -> S32-03–S32-04/u);
  assert.match(m32, /M32-C08–M32-C09 -> S32-10–S32-12/u);
  assert.match(m32, /Distributed data parallelism — communication is part of the algorithm/u);
  assert.match(m32, /Mixed precision — a policy across arithmetic, state, and evidence/u);
  assert.match(m32, /M32-C13–M32-C14 ->\s*S32-15–S32-16/u);
  assert.match(m32, /A `text` fence is \*\*language-neutral pseudocode\*\*/u);
  assert.match(m32, /CPU-only NumPy observation/u);
  assert.match(m32, /NumPy 2\.3\.5/u);
  assert.match(m32, /exact overlap check/u);
  assert.match(m32, /conservative possibility check/u);
  assert.match(m32, /atlas-diagram-id: m32-systems-evidence-route/u);
  assert.match(m32, /atlas-diagram-alt: A scientific question first becomes a public interface and data contract\./u);
  assert.match(m32, /atlas-diagram-id: m32-request-to-observation-trace/u);
  assert.match(m32, /atlas-diagram-alt: The host prepares an input and records its residency\./u);
  assert.match(m32, /~~~text\ndef prepare_for_kernel\(batch\):/u);
  assert.match(m32, /~~~text\ndef loss\(theta, x, y\):/u);
  assert.doesNotMatch(m32, /~~~python\ndef prepare_for_kernel\(batch\):/u);
  assert.match(
    m32,
    /\[`lib\/m32-systems-evidence-fixture\.js`\]\(\.\.\/\.\.\/lib\/m32-systems-evidence-fixture\.js\)/u,
  );
  assert.match(
    m32Candidate,
    /\[`lib\/m32-systems-evidence-fixture\.js`\]\(\.\.\/\.\.\/lib\/m32-systems-evidence-fixture\.js\)/u,
  );
  for (const m32Pack of [m32, m32Candidate]) {
    assert.match(m32Pack, /CPU-only stride-to-locality hypothesis card/u);
    assert.match(m32Pack, /Adversarial reproduction-delta row/u);
    assert.match(m32Pack, /all_reduce\(local_gradient_r, op="mean"\)/u);
    assert.match(m32Pack, /mixed-precision row to the Reproduction Capsule/u);
    assert.match(m32Pack, /Keep “cache” and “faster” out of the conclusion/u);
    assert.match(m32Pack, /Keep the semantic oracle fixed/u);
  }

  assert.match(observation, /PINNED_NUMPY_VERSION = "2\.3\.5"/u);
  assert.match(observation, /np\.shares_memory/u);
  assert.match(observation, /np\.may_share_memory/u);
  assert.match(observation, /one CPU-only in-process NumPy ndarray observation/u);
  assert.match(pythonTest, /view_copy_and_broadcasting_observation/u);
});
