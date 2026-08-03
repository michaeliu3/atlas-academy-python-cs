import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const m31Path = "content/authoring/m31_optimization_information_workbook.v1.md";
const m32Path = "content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md";
const m31CandidatePath = "content/modules/31_optimization_information.md";
const m32CandidatePath = "content/modules/32_systems_languages_scientific_python_accelerators.md";

test("M31 exposes compact claim-to-source routes and labels non-runnable sketches", async () => {
  const [m31, m31Candidate, bridge] = await Promise.all([
    readFile(m31Path, "utf8"),
    readFile(m31CandidatePath, "utf8"),
    readFile("content/course/m31-m36-prerequisite-session-bridge.v1.json", "utf8"),
  ]);

  assert.match(m31, /C04 -> S02–S04/u);
  assert.match(m31, /C05 -> S02–S04, S09–S10/u);
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

  const m31Sessions = JSON.parse(bridge).modules.find(({ moduleId }) => moduleId === "m31").sessionSpine;
  const sessionFour = m31Sessions.find(({ id }) => id === "m31-s04");
  const sessionFive = m31Sessions.find(({ id }) => id === "m31-s05");
  assert.match(sessionFour.progression, /projected-gradient update/u);
  assert.doesNotMatch(sessionFour.progression, /coordinate|proximal/u);
  assert.match(sessionFive.progression, /Information quantities begin in Session 6/u);
});

test("M32 connects claim tags to one pinned CPU-only NumPy observation", async () => {
  const [m32, m32Candidate, observation, pythonTest] = await Promise.all([
    readFile(m32Path, "utf8"),
    readFile(m32CandidatePath, "utf8"),
    readFile("scripts/m32_numpy_layout_observation.py", "utf8"),
    readFile("scripts/test_m32_numpy_layout_observation.py", "utf8"),
  ]);

  assert.match(m32, /M32-C03–M32-C04 -> S32-03–S32-04/u);
  assert.match(m32, /M32-C08–M32-C09 -> S32-10–S32-12/u);
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

  assert.match(observation, /PINNED_NUMPY_VERSION = "2\.3\.5"/u);
  assert.match(observation, /np\.shares_memory/u);
  assert.match(observation, /np\.may_share_memory/u);
  assert.match(observation, /one CPU-only in-process NumPy ndarray observation/u);
  assert.match(pythonTest, /view_copy_and_broadcasting_observation/u);
});
