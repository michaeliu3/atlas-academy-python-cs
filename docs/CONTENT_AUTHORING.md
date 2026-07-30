# Content authoring workflow

## Module contract

Every module must have all of the following before release:

1. prerequisite connection and forward handoff;
2. primary/university source map with claim boundaries and licensing note;
3. six connected sessions;
4. original diagrams, traces, code-reading labs, and text equivalents;
5. accessible interactive HTML experience;
6. confidence-aware conceptual diagnostic;
7. problem ladder, Atlas project, review rubric, and retrieval schedule;
8. TA prompts and Study Partner routine;
9. deterministic local model/tests when they reveal a mechanism;
10. Notion record and progress update.

## Versioned evidence contract

`content/course/course-graph.v1.json` is the single source of truth for
module identity, academic prerequisites, forward handoff, route position,
availability, source map, studio, gate, and release status.
`content/course/contracts/module-contracts.v1.json` is the separate evidence
registry. It exists so that an author cannot make a module look complete by
adding familiar headings alone.

The current registry deliberately records M1–M30 as **legacy structural
baselines**. The validator can prove their checked-in workbook, six session
headings, source-map path, and graph handoff. It cannot infer that an
explanation is rigorous, a diagram has a good prose equivalent, or an oral
defense is supportive. Those require reviewed, module-specific evidence before
the module becomes `verified`.

Use the right gate for the claim being made:

~~~text
pnpm validate:course          # structural migration gate; reports human-review gaps
pnpm validate:course:inputs   # structural gate plus Git-tracked regular release inputs
pnpm validate:course:strict   # future publication/release gate; currently fails by design
pnpm sync:modules
pnpm check:generated
~~~

`validate:course:strict` must pass before a newly published module, a
re-verified legacy module, or a private deployment can be presented as fully
contract-verified. It must never be weakened merely to make CI green.

### Draft evidence-pointer pilot

`content/course/contracts/module-contract-evidence.v2.json` and
`scripts/module-contract-evidence.mjs` are a deliberately narrow migration
pilot for M21 (systems) and M27 (mathematics). They resolve versioned,
Git-tracked local Markdown paths and visible section anchors for the pieces a
reviewer must inspect. The pilot's states are deliberately `draft-pointer-map`,
`not-reviewed`, and `publicationEffect: none`.

A successful pointer resolution proves only that the referenced local artifact
and heading exist in this revision. It does not prove pedagogical quality,
source/license correctness, visual accessibility, oral-defense quality, or
human approval. Do not use it to call a module verified or published. Extend
the evidence model only after its review fields and release semantics can be
validated without weakening the v1 strict gate.

### Advanced-module lifecycle contract

`content/course/contracts/advanced-module-contracts.v1.json` and
`scripts/advanced-module-contract.mjs` are the separate lifecycle contract for
M31–M36. They do not extend the deliberately legacy-only v1 registry or reuse
the narrow M21/M27 pointer pilot.

The initial M31 record is **authoring-only**. It resolves a bounded set of
checked-in planning and research inputs, including the canonical prerequisite
bridge, source/claim plans, and the historical M31–M36 readiness audit. It
checks the six-session plan and declared S01–S10/C01–C08 coverage while
requiring all of the following to remain absent or pending: learner manifest,
learner route, learner workbook, source map, studio/model/tests, human review,
and release record. It is not a learner-facing M31 module.

The contract uses three states:

1. `authoring-only`: plan/pointer evidence only; no learner material or
   release-shaped claim.
2. `review-ready`: a real but still hidden workbook, source map, interaction
   implementation, reference model, and teaching tests exist as checked-in
   inputs. All non-release evidence is structured, but human approval and
   release evidence remain pending.
3. `published`: graph, manifest, route, workbook, source map, interaction,
   tests, every review dimension, every release-ready evidence record, and a
   locally resolvable release record agree.

Each contract input has a versioned role. `course-content` and `provenance`
inputs are included in the generated course-input hash ledger; `source-code`
and `test` inputs are Git-tracked structural references but are not silently
reclassified as deployed course content. The current
`docs/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json` ledger entry is an explicit
provenance-only exception: its hash preserves the *do not publish* boundary;
it does not deploy or expose M31.

Do not insert a final candidate SHA or Actions URL into the same commit that
needs that evidence. First create and validate the candidate commit; then make
a later additive provenance commit that records the exact candidate SHA, CI
run, review/source paths, limitations, and—only after it occurs—private
deployment version. The validator requires that candidate SHA to be an
ancestor of the provenance record. Do not amend, squash, or rewrite history to
manufacture self-referential release evidence.

While every M31–M36 graph entry is authoring-only, the historical bridge
validator remains active. After any advanced lifecycle transition, all six
modules must have lifecycle-aware contracts that preserve their bridge/session
relationship before that historical validator can step back from live gating.

## Authoring order

1. Start from an Atlas incident or design pressure inherited from the prior
   module.
2. Establish the first-principles model before library/API names.
3. Name representations, invariants, cost assumptions, authority boundaries,
   and evidence limits.
4. Use source maps to determine what the material may claim.
5. Create a visual path with prediction before reveal and a prose equivalent.
6. Add small code-reading or trace exercises before asking for production code.
7. Add behavioral tests through public seams, not implementation-coupled
   snapshots.
8. Run full portal and local-model validation, then record known limitations.
9. Add reviewed contract evidence and verify the generated release-input hash
   ledger before changing the module's release state.

## Source discipline

- `content/modules/` and `content/source-maps/` are release inputs for
  published material. A public teaching artifact becomes a release input only
  when it is explicitly listed in
  `content/course/release-input-policy.v1.json`; CI rejects any tracked
  `public/downloads/` artifact that is absent from that policy. Ignored runtime
  caches (for example `__pycache__/*.pyc`) can never enter the ledger or the
  built client downloads. Builds, CI, and private deployment must never read
  an adjacent authoring workspace.
- `content/course/release-inputs.v1.json` is generated from the allowlisted
  repository inputs and records their SHA-256 hashes. It is a content-provenance
  record, not a substitute for a reviewed Git commit or release ledger. Text
  input hashes use canonical LF newlines so Windows and Linux checkouts agree.
- Prefer official language/standard documentation and primary sources.
- Use university courses for sequence and pedagogy, not copied assignments or
  solutions.
- Link and paraphrase; write original diagrams, prose, fixtures, and prompts.
- Label implementation-specific observations with version/runtime scope.
- State what a source, model, or test does not prove.

## Accessibility

- Provide meaningful text for every diagram and color distinction.
- Use native controls, visible focus, semantic headings, keyboard paths, and
  readable narrow-screen layouts.
- Keep prediction/reveal interaction optional; the workbook must contain the
  equivalent facts.
- Store only whitelisted local progress state, never learner queries, records,
  identities, policies, or capability-like data.
- Use the shared versioned prediction-progress codec when a studio persists
  prediction/reveal evidence; reject stale, unknown, or incomplete records
  instead of recovering them optimistically.

## AI-era review loop

An AI agent can be asked to implement a bounded slice only after the human
author states the goal, non-goals, inputs, invariants, test seams, accessibility
needs, and acceptance evidence. Review the result as unfamiliar code: trace it,
challenge unsupported claims, run tests, and write the remaining uncertainty.

## Git and release history

Keep the course's history reviewable on GitHub. Use small additive commits that
name the evidence changed; push the intended branch to the `github` remote and
open a reviewable PR for release-bound work. Do not force-push a shared branch,
rewrite published history, delete release commits, or squash away provenance.
The release ledger records the exact deployed commit and CI run; a hosting push
does not replace that record.
