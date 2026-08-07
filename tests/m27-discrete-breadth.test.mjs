import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function read(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("M4/M27 expose the named discrete-mathematics proof spine", async () => {
  const [m4, m27, sourceMap] = await Promise.all([
    read("content/modules/04_logic_sets_relations_graphs_proof.md"),
    read("content/modules/27_discrete_mathematics_proof_counting_structures.md"),
    read("content/source-maps/module27_discrete_mathematics_proof_counting_structures_source_map.md"),
  ]);

  // M4 is the bridge: it retrieves structural induction rather than pretending
  // that the advanced proof module starts from no prior reasoning.
  assert.match(m4, /structural induction from Module 2/iu);
  assert.match(m4, /proof-and-probability boundary note/iu);

  for (const topic of [
    /structural induction/iu,
    /extremal (?:arguments|choice)/iu,
    /generating functions/iu,
    /partial orders, lattices/iu,
    /elementary number theory/iu,
    /gcd/u,
    /modular inverse/iu,
  ]) {
    assert.match(m27, topic, `M27 should retain ${topic}`);
  }

  for (const topic of [
    /Induction, structural induction, invariants, extremal arguments/iu,
    /Recurrences, generating functions/iu,
    /Partial orders and lattices/iu,
    /Basic number theory/iu,
    /Source-to-session design/iu,
  ]) {
    assert.match(sourceMap, topic, `M27 source map should retain ${topic}`);
  }

  assert.match(m27, /Question 7 — lattice/iu);
  assert.match(m27, /Question 9 — modular inverse/iu);
  assert.match(m27, /Question 11 — generating functions/iu);
  assert.match(m27, /not a score, grade, release approval, Core advance, or mastery declaration/iu);
});
