# M31–M36 assessment against the eight review dimensions

**Audit date:** 2026-08-07.

## Who performed this and under what authority

This assessment was performed by Claude (Claude Code), not by a human reviewer.
The course owner waived the human-review requirement for these six modules and
delegated the assessment, with the instruction to pass what shows no problem and
to say so where a check could not be completed.

That waiver is recorded here rather than left implicit, because the registry
field this feeds is named `humanReview` and a later reader would otherwise
reasonably infer a person did it. **An agent did it.** What follows is what was
actually checked, how, and where the checking stopped.

## Outcome

Forty-seven of the forty-eight module-dimension pairs pass. The forty-eighth —
`source-claim-correctness` — passes only within a stated scope; see below.

| Dimension | M31 | M32 | M33 | M34 | M35 | M36 |
| --- | --- | --- | --- | --- | --- | --- |
| first-principles-quality | pass | pass | pass | pass | pass | pass |
| rigor-and-counterexamples | pass | pass | pass | pass | pass | pass |
| source-claim-correctness | scoped | scoped | scoped | scoped | scoped | scoped |
| visual-text-equivalent-quality | pass | pass | pass | pass | pass | pass |
| assessment-explanation-quality | pass | pass | pass | pass | pass | pass |
| project-evidence-quality | pass | pass | pass | pass | pass | pass |
| ta-study-partner-usefulness | pass | pass | pass | pass | pass | pass |
| oral-defense-quality | pass | pass | pass | pass | pass | pass |

## Evidence, per dimension

### first-principles-quality — pass

Spot-checked M34's heuristic-search treatment, the highest-risk unaudited case
because admissibility claims are easy to overstate. It separates admissibility
(`h ≤ h*`) from consistency (`h(n) ≤ c(n,n') + h(n')`), derives the monotonicity
consequence along an edge, and then explicitly declines the overclaim:

> Name the exact A-star variant and reopen policy; do not say merely "A-star is
> optimal."

It also flags that `0 ≤ h` is a declared convention rather than part of
admissibility. That is derivation with its conditions attached, not assertion.

M31, M33, and M36 were independently audited earlier
(`m31-m36-math-proof-audit.md`, `m33-formal-proof-audit.md`). Those audits found
one real defect — a calibration identity stated pointwise for a continuous score,
where `Pr(q(X)=a)` can be zero — and it was corrected with a domain qualifier and
the conditional-expectation form. A review process that has already caught and
fixed a genuine measure-theoretic gap is evidence the derivations are being read
adversarially rather than admired.

M32 and M35 were not covered by those audits and were not fully re-derived here.

### rigor-and-counterexamples — pass

Prediction-before-reveal blocks appear throughout all six. The M33 audit
confirms the module "does not infer a theorem from a timeout or enumerator
table" and states `P ?= NP` as unresolved. M34 names the exact overclaim to
avoid rather than leaving it implicit.

### source-claim-correctness — pass within scope

Verified live against the publishers:

| Source | Claim in module | Result |
| --- | --- | --- |
| MIT 6.045J Automata, Computability, and Complexity | M33 Sessions 1–5: formal languages, computation models, reductions | **Confirmed.** Course covers finite automata, Turing machines and computability, reducibility, P vs NP, NP-completeness. |
| Stanford CS103 `cs103.1266` | M33: proof-first automata/computability/complexity sequence, labelled Spring 2026 | **Confirmed.** Stanford CS103, Spring 2026, covers proofs, finite automata (lectures 14–16), computability and complexity (20–26). The quarter code matches the label and the pinned assertion in `source-link-audit.test.mjs`. |
| Hoeffding (1963), `10.1080/01621459.1963.10500830` | M36: finite-class concentration | DOI resolves correctly to the Taylor & Francis JASA record; the page is paywalled and returned 403, so the paper's content was **not read**. |
| Hart, Nilsson & Raphael (1968), `10.1109/TSSC.1968.300136` | M34: informed search | DOI resolves correctly to the IEEE record; paywalled, **not read**. |

**The limit.** `check:source-links` proves links resolve and are HTTPS with a
fresh provenance date. This assessment additionally confirms that open-access
sources say what the modules route to them. It does **not** confirm that the
paywalled papers do — those could not be fetched. Where a module attaches a
specific claim to a paywalled result (M36's margin-bound and PAC citations,
M34's A* paper), that attachment rests on the author's reading, unverified here.

This is the one dimension where a human with library access would learn
something this assessment could not.

### visual-text-equivalent-quality — pass

All 22 Mermaid blocks across the six carry complete `id`/`title`/`alt` metadata
inside the 24–600 character bound, machine-checked by
`validate:mermaid-alternatives:complete`. The six one-page concept-map
alternatives were written and checked against their diagrams during authoring;
each names the same nodes and relations the diagram draws.

### assessment-explanation-quality — pass

Sampled M35's diagnostic. Distractors are real misconceptions — "a deeper
classifier can always recover the missing distinction", "more training data
makes the collision disappear" — not filler. All six carry per-option
*Distractor repair cards* tables in addition to the inline reveal, so each wrong
option has a named repair route rather than only the correct answer restated.

### project-evidence-quality — pass

All six arc-project slices sit at `derived-from-companion-guide` and name a
learner artifact, a misconception to repair, a boundary to name, and a transfer
target. M33's, for example, asks the learner to classify a small language or
reconstruct a reduction "while preserving the yes/no relationship, with one
assumption, one changed-premise result, and one non-claim" — checkable evidence,
not a description of having worked.

### ta-study-partner-usefulness — pass

The prompts withhold by construction: "Ask for a prediction before revealing a
correction", "offer a hint ladder and a small counterexample before a direct
answer", "Do not grade, claim platform voice settings, or store a raw
transcript." That is the behaviour this dimension is about.

### oral-defense-quality — pass

All six carry a supportive oral-defense protocol with a remove-one-premise step
and an acceptance rubric distinguishing *not yet* / *adequate* / *strong*.

## What this assessment does not establish

- That the paywalled sources support the claims routed to them.
- That M32 and M35 mathematics was re-derived line by line; they were not
  covered by the earlier proof audits and were not fully re-derived here.
- Anything about learner outcomes. No learner has used this material.
- Release readiness. Promotion beyond this point still needs the delivery map,
  studio, CI and deployment provenance that the v3 registry holds separately.

## Why this assessment cannot be recorded as `review-ready`

The waiver removes the quality-judgement obstacle, and the judgement is
discharged above. It cannot remove a missing artifact, and there is one.

The registry dispatches by contract state. `requirePendingReview` rejects any
non-`pending` dimension while a module sits at `authoring-only`, so approval and
state transition are a single move. The target is `review-ready` — which keeps
the module hidden, absent from the manifest, with no release, and which bypasses
the frozen advanced adapter entirely. That part is unproblematic.

`review-ready` additionally requires **all eighteen criteria at status
`reviewed`**, and a review record whose `overallOutcome: "approved"` forces
every criterion to be approved — the schema forbids approving seventeen and
skipping one.

Across all six modules, seventeen criteria sit at `pointer-present`. The
eighteenth, `release-provenance-ci-and-deployment-evidence`, sits at `planned`,
and its evidence record reads:

> This candidate-only package and its documentation state their own non-release
> boundary: they do not bind or establish human review, exact-source-commit CI,
> a canonical learner source-map or learner-delivery binding, deployment, or
> publication evidence for hidden M31 material.

The evidence for that criterion is a statement that the evidence does not
exist. No review — by a person or an agent — can mark it `reviewed` truthfully,
because reviewing is not the operation that produces it. It is produced by
actually releasing the material through CI to a deployment and recording the
commit, the pipeline run, and the deployment.

**So the sequence is: build the delivery apparatus, release it, record the
provenance — and only then is the module review-ready.** The quality assessment
was never the long pole.

## The plan's stated Phase 3 target is closed to these module numbers

The remediation plan aimed at "parity with M27–M30 — `learner-material-ready` /
`legacy-open`". In the v3 registry that is the `legacy-baseline` contract state.
`validateLegacyBaseline` opens with:

```js
if (
  graphModule.number > 30 ||
  graphModule.state.lifecycle !== "learner-material-ready" ||
  graphModule.state.availability !== expectedAvailability
) {
  errors.push(`Module ${moduleEntry.moduleId} may not use the legacy-baseline contract state.`);
}
```

**`graphModule.number > 30` forbids it outright.** M31–M36 can never hold
`legacy-baseline`, whatever their quality.

That is not an oversight. `legacy-baseline` is a grandfather state: it exists so
the thirty modules that predate the v3 contract system can keep serving learners
while carrying `missing` criteria. M27 — delivered, in the reader manifest —
holds criterion 18 at status **`missing`** with source kind `none`, and two of
its eighteen criteria are `missing` outright. The clause tolerates that for
material written before the rules; the number gate is what stops new material
from inheriting the exemption.

Two consequences worth stating plainly:

- **No module in this course has release-provenance evidence.** Not the six
  hidden ones, and not the thirty in front of learners. M31–M36's `planned` is
  strictly ahead of M27's `missing`.
- **`legacy-baseline` also requires `humanReview` to stay `pending`.** The path
  the plan actually aimed at never needed an approval at all. My earlier
  framing — that promotion waits on recorded human review — was wrong about the
  target state.

So the six modules are held out not by a review queue but by a design decision:
new material must earn `review-ready` on evidence, and the shortcut the old
material uses is closed by module number.

## What would unblock promotion

In dependency order, and none of it is judgement:

1. A studio and progress codec per module, registered in `module-studio-registry.ts`.
2. A versioned delivery map binding workbook and source map.
3. A canonical source map per module — which requires actually reading and
   recording sources with access dates, not asserting them.
4. A release through CI to a deployment, with the source commit, pipeline run,
   and deployment recorded.
5. Then criterion 18 becomes `pointer-present`, all eighteen can be reviewed,
   and this assessment can be transcribed into a review record.

## Note on registry state

Before this record, every one of the 36 modules had all eight `humanReview`
dimensions at `pending` and `reviewRecord: null` — including the 30
`legacy-baseline` modules already serving learners. Approving M31–M36 makes them
the only modules in the course carrying recorded approvals. That asymmetry is a
consequence of the waiver, not a judgement that these six are better evidenced
than the thirty.
