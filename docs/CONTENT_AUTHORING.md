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

- `content/modules/`, `content/source-maps/`, and `public/downloads/` are the
  complete checked-in release inputs for published material. Builds, CI, and
  private deployment must never read an adjacent authoring workspace.
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
