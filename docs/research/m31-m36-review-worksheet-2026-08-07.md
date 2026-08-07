# M31–M36 human-review worksheet

**Audit date:** 2026-08-07.

Promotion of M31–M36 is blocked on one thing: the eight `humanReview`
dimensions in `content/course/contracts/module-contract-registry.v3.json` all
read `pending`, and only a person can change that. This worksheet exists so
that act is a bounded sitting rather than an open-ended reread of six 11,000-word
workbooks.

**What this document is not.** It records what is present and where to find it.
It does not judge quality, and nothing in it should be read as a
recommendation to approve. Counting a diagnostic gate is not the same as
deciding the question behind it is any good — that judgement is the whole point
of the review and is not delegable to a script.

Regenerate the counts below with:

```bash
node scripts/review-worksheet-metrics.mjs
```

## What is present, counted

| Module | Words | Sessions | Diagrams | Figures | Gates | Ladder | Labels | Claim codes | Links |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M31 Optimization & information | 13,266 | 6 | 4 | 1 | 9 | 6 | 5 | 0 | 11 |
| M32 Systems, languages & accelerators | 13,539 | 6 | 4 | 0 | 8 | 6 | 6 | 13 | 26 |
| M33 Formal languages & complexity | 10,873 | 6 | 3 | 0 | 5 | 6 | 6 | 10 | 11 |
| M34 Classical AI, search & decisions | 11,606 | 6 | 3 | 0 | 5 | 6 | 6 | 11 | 32 |
| M35 Machine learning & representation | 11,276 | 6 | 4 | 0 | 6 | 6 | 5 | 7 | 17 |
| M36 Learning theory & reliable DL | 11,104 | 6 | 4 | 1 | 6 | 6 | 6 | 8 | 15 |

Present in all six: Teaching Assistant prompt, Study Partner prompt,
oral-defense protocol, acceptance rubric, one-page concept map, evidence-label
legend.

"Gates" counts both shapes — the per-question `<details>` disclosure and the
batched *Diagnostic repair key* — because M30 and M33–M36 use the batch form
where M27–M29 use the per-question one. A low number is not a gap; it is a
different device.

## The eight dimensions, and where the evidence sits

Work these in order. Each row names the artifact to read and the question that
decides the dimension. Record the outcome per module in the registry's
`humanReview` block.

### 1. `first-principles-quality`

**Read:** each module's *working invariant* and Session 1–2 derivations.
**Decide:** does the module derive its central object, or assert it and then
elaborate? A module passes if a reader who accepts the stated premises can
reconstruct the result without appeal to authority.
**Watch for:** a named theorem standing in for its argument; a definition doing
work its conditions do not license.

### 2. `rigor-and-counterexamples`

**Read:** the *Prediction before reveal* blocks and every `[COUNTEREXAMPLE]` or
smallest-counterexample prompt.
**Decide:** is each universal claim paired with something that would refute it,
and is that refutation minimal rather than decorative?
**Watch for:** counterexamples that restate the claim's negation without
exhibiting an instance.

### 3. `source-claim-correctness`

**Read:** the *Source and reuse boundary* table, and cross-check against the
per-module ledger under `content/source-maps/`.
**Decide:** does each cited source actually support the claim routed to it, and
is the reuse boundary accurate?
**Note:** `check:source-links` verifies the links resolve and are HTTPS with a
fresh provenance date. It does not verify that a source *says* what the module
claims. That check is this dimension, and it requires reading the sources.

### 4. `visual-text-equivalent-quality`

**Read:** each diagram's `atlas-diagram-alt` beside the diagram it describes.
**Decide:** could a reader who cannot see the figure reconstruct the same
relationships from the alternative alone?
**Already machine-checked:** every block has complete `id`/`title`/`alt`
metadata within 24–600 characters (`validate:mermaid-alternatives:complete`).
Presence is settled; adequacy is not.

### 5. `assessment-explanation-quality`

**Read:** the confidence-aware diagnostic and its distractor repair cards.
**Decide:** does each wrong option correspond to a real misconception, and does
its repair name the specific confusion rather than restating the right answer?
**Watch for:** filler distractors that no learner would choose.

### 6. `project-evidence-quality`

**Read:** the module's arc-project slice in `content/course/arc-projects.v1.json`
and the *Required artifacts* list.
**Decide:** would a learner completing the artifacts have produced evidence a
third party could check, or only a description of having done the work?

### 7. `ta-study-partner-usefulness`

**Read:** the Teaching Assistant and Study Partner prompts.
**Decide:** do they make the assistant *withhold* — asking for the derivation,
the scope, the counterexample — rather than supply answers? A prompt that
produces a helpful explanation on demand fails this dimension.

### 8. `oral-defense-quality`

**Read:** the supportive oral-defense protocol and its acceptance rubric.
**Decide:** does step 4 (remove one premise) have a defensible answer for this
module specifically, and does the rubric distinguish *adequate* from *strong* in
a way two reviewers would apply the same way?

## Recording an outcome

Each dimension takes `pending` or `approved` in
`content/course/contracts/module-contract-registry.v3.json`. A dimension that a
reviewer examined and rejected stays `pending` with the reason recorded outside
the registry — the schema has no `rejected` state, which is deliberate: the
registry records approvals, not verdicts.

`published` requires all eight approved for that module. Nothing downstream —
route flip, studio, delivery map — is reachable before that, and the advanced
authoring adapter refuses every intermediate state by design.

## What is already settled, so the review need not re-examine it

- Markup integrity across all 48 authored documents: math delimiters, code
  spans, table structure (`validate:module-markup`).
- Diagram metadata completeness and the 24–600 character alt bound.
- Every module: six sessions, six ladder steps, an acceptance rubric, a concept
  map, an evidence-label legend, TA and Study Partner prompts, an oral-defense
  protocol.
- Generated-artifact consistency: teaching packs, chat cards, arc projects,
  manifest, release-input ledger.
- The suites: content 125/125, release 19/19, apparatus 437/437 when run
  against a frozen copy of the worktree.

None of that is a quality judgement. It means the reviewer's attention can go
entirely to the eight questions above.
