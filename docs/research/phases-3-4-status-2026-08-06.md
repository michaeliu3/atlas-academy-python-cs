# Phases 3 and 4 — what is done, what is blocked, and by what

**Audit date:** 2026-08-06.

This note exists because two items in the remediation
plan cannot be completed by an authoring agent, and the reason is a deliberate
property of this repository rather than a defect. Both are stated here with
the exact code that enforces them, so the next person can act rather than
re-derive.

## Phase 3 — promoting M31–M36 to learner delivery

### The last step is a human act, and the repository says so

`scripts/advanced-module-contract.mjs` governs the `advanced-v1` track that
M31–M36 sit on. Three separate rules make self-promotion impossible:

| Rule | Location | Effect |
| --- | --- | --- |
| `advanced authoring adapter supports only authoring-only` | `advanced-module-contract.mjs:1309` | Any `contractState` other than `authoring-only` is an error, unconditionally. |
| `graphSnapshot.state must preserve the frozen hidden authoring-only snapshot` | `validateAuthoringAdapterSnapshot`, `:504–516` | The snapshot pins `lifecycle`, `readerAccess`, `availability`, and requires `sourceMap` and `studioId` to be `null`. |
| `published state requires approval for every human-review dimension` | `:1387–1390` | Eight `humanReview` dimensions must read `approved`. |

Every one of the six contract records currently carries

~~~json
"promotionBlock": {
  "learnerManifest": "absent",
  "learnerRoute": "absent",
  "humanReview": "not-reviewed",
  "releaseEvidence": "not-evidenced"
}
~~~

with all eight `humanReview` dimensions `pending`. Setting them to `approved`
would be recording a review that did not happen. That is the one thing the
whole contract apparatus exists to prevent, so it was not done.

**What the human needs to do.** Review the six workbooks against the eight
dimensions — first-principles quality, rigor and counterexamples, source-claim
correctness, visual/text-equivalent quality, assessment-explanation quality,
project-evidence quality, TA/study-partner usefulness, oral-defense quality —
and record the outcome. Everything downstream of that is mechanical.

### What was completed underneath the block

- Content parity with M27–M30 on the readability and markup dimensions: math
  delimiter convention, table code spans, evidence labels, concept maps, and
  figure coverage.
- The authoring→module generation path (`scripts/advanced-review-candidate-parity.mjs`)
  is the single source of truth; edits are made to `content/authoring/` and the
  reader copies are generated.
- Diagram accessibility: every Mermaid block in all six carries complete
  `id`/`title`/`alt` metadata within the 24–600 character bound.

### What remains, in dependency order

1. Human review, recorded (blocking; see above).
2. `sourceMap` and `studioId` wiring — currently pinned to `null` *by* the
   frozen snapshot, so these cannot precede step 1.
3. Six studios and six progress codecs.
4. Delivery maps, then the graph-state flip and manifest/route updates.

## Phase 4 — authoring M37–M42

### All six workbooks are authored

| File | Module | Words | Diagrams |
| --- | --- | --- | --- |
| `content/authoring/m37_neural_networks_automatic_differentiation_workbook.v1.md` | Neural networks & automatic differentiation | 9,649 | 4 |
| `content/authoring/m38_architecture_families_workbook.v1.md` | Architecture families as structural assumptions | 7,903 | 4 |
| `content/authoring/m39_modern_training_deep_learning_systems_workbook.v1.md` | Modern training & deep-learning systems | 7,517 | 3 |
| `content/authoring/m40_probabilistic_modeling_inference_workbook.v1.md` | Probabilistic modeling & inference | 6,496 | 3 |
| `content/authoring/m41_sequential_decision_making_reinforcement_learning_workbook.v1.md` | Sequential decision-making & reinforcement learning | 7,211 | 3 |
| `content/authoring/m42_foundation_models_llms_nlp_workbook.v1.md` | Foundation models, LLMs & NLP | 7,189 | 3 |

45,965 words and 20 diagrams in total. Each is authored at the structural
standard of M31–M36: working invariant, evidence-label taxonomy, claim/source
trail, six sessions with prediction gates and outputs, one-page concept map,
six-step ladder, twelve confidence-gated diagnostics with distractor repair
cards, visual and code-reading lab, source and reuse boundary, and a candidate
release boundary. Every diagram carries complete `id`/`title`/`alt` metadata
inside the 24–600 character bound, and all six pass
`scripts/validate-module-markup.mjs`.

They derive rather than assert. Backpropagation comes out of the adjoint path
sum; convolution is forced by translation equivariance; the ELBO gap is a KL
divergence; EM monotonicity is one line from that decomposition; the Bellman
contraction, the policy-gradient baseline identity, the behaviour-cloning
\(O(\varepsilon T^{2})\) bound, the Metropolis–Hastings acceptance ratio, and
the bits-per-byte comparability argument are each derived in place.

### Level coverage these six close

| Module | Levels addressed |
| --- | --- |
| M37 | L5.17 automatic differentiation and network mechanics |
| M38 | L5.18 architecture families |
| M39 | L5.19 modern training and DL systems |
| M40 | L6 probabilistic modelling and inference |
| M41 | L7 sequential decision-making and reinforcement learning |
| M42 | L8 foundation models and L9 NLP specialization |

Coverage here means *authored teaching material exists*. It does not mean the
topics are delivered: none of these modules is in the graph, the manifest, or
any route, so the `scopeMatrix` still records the corresponding topics as
`post-core-specialization`. Moving them requires the registration decision
below.

They are deliberately **not** registered in the course graph. That is not an
oversight; see the next section.

### What registration actually requires — probed, not assumed

Registering M37–M42 was attempted end to end in a throwaway copy of the repo:
six graph entries added on the M31–M36 pattern (`authoring-only`, `hidden`), a
new `arc-viii`, and a new `learning-machines` route phase carrying them between
`intelligence` and `evidence`. The validator was then run repeatedly and each
stop recorded. The live tree was never touched; the copy has been deleted.

The stops, in the order they appear:

| # | Stop | Nature |
| --- | --- | --- |
| 1 | `course-graph.mjs:780` — *must define exactly 36 modules*, numbered 1–36 | hardcoded course scope |
| 2 | *Only M31–M36 may declare a private guided-study pack* | reserved slot; drop it from the new entries |
| 3 | *the Atlas Core route day count must equal the course day count* | `course.days` 60 → 70 |
| 4 | *Module 31–36 bridge direct academic consumers do not match the graph* | `m31-m36-prerequisite-session-bridge.v1.json` needs new consumers and six new entries, each with an inherited concept, a retrieval prompt, and acceptable-evidence wording |
| 5 | The v3 registry needs an entry per module | 18 criteria, each pointing at real evidence |

Stops 1–4 are mechanical. Stop 5 is not, and it is where this ends.

### The v3 registry has no path for a seventh authoring-only module

A registry entry at `authoring-only` — the *lowest* state — needs a `migration`
block, and the only kind that exists for that state is
`advanced-authoring-adapter`, pointing into
`content/course/contracts/advanced-module-contracts.v1.json`.

That file is scoped by `scopeModuleIds: ["m31" … "m36"]`, matched by a
hardcoded `advancedModuleIds` Set at `advanced-module-contract.mjs:38`, and its
own purpose field reads:

> Retain checked-in authoring evidence for Modules 31–36 without turning plans,
> pointers, or research into learner publication, approval, CI, deployment, or
> mastery claims. **The unified v3 registry is the sole review and promotion
> authority.**

It is a *retained* historical record for six named modules, not a template. Its
`truthBoundary` adds that the adapter "may not enter review-ready" and "may not
publish a module."

So a seventh module cannot enter through it, and cannot enter v3 without the
18 criteria and the digest-bound human review record that v3 exists to hold.
**Phase 4 registration converges on the same gate as Phase 3.** The route
length is a real decision, but it is not the blocker — the blocker is that
admitting a new module to the contract system is a review act.

### The original framing of this section

`scripts/course-graph.mjs:925` enforces:

> the Atlas Core route must contain every module exactly once

and `:936` requires each module's `sequencePosition` to match its position in
that route. There is exactly one route plan, `atlas-core-60`, whose phases
must cover every non-intake day without a gap (`:916–924`).

So adding M37–M42 to the graph forces one of two choices, and both are the
user's to make:

| Option | Consequence |
| --- | --- |
| Extend the route's day count | The "60-day Atlas route" becomes something else. `COURSE_PLAN.md`, the portal copy, and the test named *renders the truthful prerequisite-first 60-day Atlas route* all change. |
| Keep 60 days and add modules to existing phases | The pacing becomes dishonest in exactly the way `COURSE_PLAN.md:82–92` was already criticised for — nine days for five modules. |

A third option — a second route plan for post-core modules — is not currently
expressible: the validator assumes a single canonical route.

### Why the drafts still have value unregistered

`scripts/sync-modules.mjs:528` selects authoring workbooks with the regex
`^m3[1-6]_`, so an `m37_`/`m38_` file is inert: it is not imported, not
exported to any route, and does not perturb `check:generated`. The content —
which is the expensive part — exists and is validated, while the structural
decision stays open.

### What remains for Phase 4 beyond the workbooks

Authoring is done; the surrounding apparatus is not. Each of the six would
still need, in dependency order:

1. A primary-source research ledger. These record *accessed* sources with
   access dates, so they cannot be written without actually fetching and
   reading the sources. The workbooks say so explicitly rather than implying a
   ledger exists.
2. A course-graph entry — blocked on the registration decision above.
3. A structured module contract with evidence records, a bounded reference
   model with tests, a companion package, and a project slice.
4. Human review, on the same eight dimensions that gate M31–M36.

## Two remediation items closed alongside these phases

### 2.8 — studio figures now share the reader's renderer

`app/AtlasFigureScene.tsx` holds the drawing surface; `app/modules/[slug]/AtlasFigure.tsx`
and the new `app/StudioFigure.tsx` both use it. Four `aria-hidden` CSS
decorations were replaced with figures built from the numbers the studio
already declares:

| Studio | View | Figure |
| --- | --- | --- |
| `DiscreteMathProofStudio` | graph | the bipartite matching, with the chosen edge solid and the two it blocks dashed |
| `LinearAlgebraStabilityStudio` | space | the line `x + y = 1` with the origin marked off it |
| `CalculusContinuousChangeStudio` | limit | `(x²−1)/(x−1)` broken at `x = 1`, with the approach height and the declared value both marked |
| `ProbabilityInferenceStudio` | repetition | the six declared running means, plotted |

Per-studio byte cost is about 8.7 KB of shared figure code in the static
closure and under 600 B in each own entry — well inside the 80 KB / 400 KB
limits in `content/course/client-performance-budget.v1.json`, which the build
re-checks.

### 1.3 — the remaining wide tables, measured rather than assumed

The audit asked for every table with five or more columns to be split and
every cell over ~120 characters to leave the grid. Measuring first changed the
answer:

- The five-column tables in M31–M36 are the distractor-repair matrices, and
  M34's seven-column table is an empty worksheet the learner fills in. Both are
  genuinely tabular; splitting them would destroy the comparison they exist to
  support. They stay.
- The genuinely unreadable cells were all in end-of-module source-link tables,
  where several links had been bundled into one cell. M34's was pathological —
  six cells over 300 characters, one of them 1,018 — and is now a per-session
  list. M34 is down to a single 494-character cell; M32, M33, M35, and M36
  retain one or two cells in the 300–436 range, which is long but scannable.

## Gate status, and how to test against a moving worktree

A second agent writes to this worktree continuously. The git-index provenance
checks — `scripts/module-evidence-preflight.mjs`, `advanced-module-contract.mjs`,
`legacy-candidate-preflight-profiles.mjs` — capture a snapshot and fail
`WORKTREE_DIVERGED` the moment the worktree stops matching it. The apparatus
suite takes about 70 minutes, so a concurrent write anywhere in that window
fails 20–30 tests that have nothing to do with the change under test.

Run against a frozen copy and the suites come back clean: **content 125/125,
release 19/19, apparatus 437/437** — 581 tests, zero failures, with zero
worktree drift inside the copy for the whole run. Every failure previously seen
on the live tree was either that drift or an artifact of how the copy was made.

**The working method** is to test a frozen copy rather than the live worktree:

1. `git add -A .` in the original so worktree and index agree.
2. `robocopy` the repo to a scratch directory, excluding `node_modules`,
   `dist`, `output`, `work`, `.venv`, `__pycache__` — but **including `.git`**,
   which carries the staged index with it.
3. Junction `node_modules` into the copy. Do not run `pnpm install` there; it
   fails against a junction and must not be allowed to rewrite the shared store.
4. Copy `dist/` in as well, or `tests/rendered-html.test.mjs` fails 33 times on
   a missing server bundle.
5. To dismantle: delete the junction with
   `[System.IO.Directory]::Delete($link, $false)` — which does not follow the
   reparse point — verify the original store is intact, and only then remove the
   copy.

Refresh the copy from the original before trusting a result: a copy taken
before `sync-modules.mjs` regenerates `release-inputs.v1.json` will fail three
`checked-in provenance` tests on ledger hashes that no longer match.

### Gates that stay red, and why

| Gate | Status | Reason |
| --- | --- | --- |
| `check:generated` | red | Generated artifacts are staged but uncommitted. It requires a commit, which is the owner's call while another agent's work is in the same index. |
| `validate:course:strict` | red | Requires all 36 modules `verified`. None is; the registry tops out at `legacy-baseline`. Same human-review gate as Phase 3. |
| `validate:course:complete` | red | Additionally requires M25 and M26 published rather than preview-only. |
| `validate:benches` | red | `benches/src/m32/s3_layout_numerics_note.py` exists but is unregistered — the other agent's feature, mid-edit. |

Everything else passes: `validate:course`, `validate:course:content`,
`validate:module-markup`, `validate:mermaid-alternatives:complete`,
`check:teaching-packs`, `validate:teaching-packs`, `check:arc-projects`,
`validate:arc-projects`, `check:coverage`, `check:chat-cards`,
`validate:browser-progress`, `check:goal-compliance`, `check:source-links`,
`check:bench-sync`, `validate:pdf`, `typecheck`, `lint`, and the build with its
per-studio byte budgets.

## Honest summary

Phase 3 is content-complete and governance-blocked at a step that is supposed
to require a person. Phase 4's teaching material — the expensive, irreducible
part — is written and validated for all six modules; its integration is
deferred behind a route-architecture decision that only the course owner
should make, and its source ledgers require real source access that this
authoring pass did not perform.
