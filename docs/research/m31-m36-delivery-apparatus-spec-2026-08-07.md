# M31–M36 delivery apparatus — build specification

**Audit date:** 2026-08-07.

Every requirement below was read out of the validators, not inferred. This is
the work that stands between the six hidden modules and a state a learner can
reach. It is engineering, not judgement — nothing here waits on a review.

## Why this is the path

`legacy-baseline`, the state M27–M30 hold, is closed to these modules:
`validateLegacyBaseline` rejects `graphModule.number > 30`. The only open route
is `review-ready` → `verified`, which is earned on evidence rather than
grandfathered. See `m31-m36-agent-assessment-2026-08-07.md` for the full
derivation.

## Order of work

Each step's output is the next step's input. Steps 1–4 can proceed in parallel
per module; step 5 is once for all six; step 6 is the only one that cannot be
done from a developer machine alone.

### 1. Studio component and CSS module (six)

**Pattern:** `app/LinearAlgebraStabilityStudio.tsx` (~900 lines) plus
`app/LinearAlgebraStabilityStudio.module.css` (~17–21 KB).

**Required shape**, from the four existing math studios:

- `"use client"`, six tabbed views with `role="tab"` and roving `tabIndex`.
- One `PredictionGate` per view: options, a recorded choice, a confidence
  capture, and a reveal that is inert until a choice exists.
- A fixture region per view drawing on the module's declared numbers. Use
  `app/StudioFigure.tsx` with a `lib/atlas-figure.mjs` spec rather than
  `aria-hidden` CSS shapes — see the *Figures in interactive studios* section
  of `COURSE_PRODUCTION_STANDARD.md`.
- A text equivalent beside every figure, referenced by `aria-describedby`.

**View ids** should match the module's six sessions so the codec, the studio,
and the workbook share one vocabulary.

**Budget:** `content/course/client-performance-budget.v1.json` allows 80,000 B
per studio entry and 400,000 B static closure. The four existing math studios
land at 41–49 KB entry. `pnpm build` re-checks this; a new studio must also be
added to the `entries` list there with its `manifestName`.

### 2. Progress codec (six)

**Pattern:** `lib/module30-progress-codec.js` (~2 KB).

```js
export const MODULE31_PROGRESS_STORAGE_KEY =
  "atlas.module31.optimization-information-studio.v1";

export const module31ProgressCodec = createPredictionProgressCodec({
  version: 1,
  viewIds: [ /* the six session ids */ ],
  choiceIdsByView: { /* one array of misconception ids per view */ },
});
```

Then `restoreModule31Progress` / `persistModule31Progress` /
`clearModule31Progress` over `createPredictionProgressLifecycle`.

Choice ids should name the misconception, not the position — `finite-not-theorem`
rather than `option-a`. M30's codec is the reference for that convention.

### 3. Browser-progress surface declaration (six)

Every new storage key must be declared in
`content/course/browser-progress-surfaces.v1.json` with its owner, codec, and
data classes, and all access must route through
`lib/browser-progress-storage.js`. `validate:browser-progress` fails the build
otherwise — this policy already rejected one undeclared key earlier in this
work, so it is enforced rather than aspirational.

### 4. Registry and graph wiring (six)

- `lib/module-studio-registry.ts`: add to `moduleStudioIds` and
  `moduleStudioRegistry`.
- `content/course/course-graph.v2.json`: set `studioId` and `sourceMap`.

The source maps already exist —
`content/source-maps/module3X_*_source_map.md` and `*_source_research.md` — but
`validateAuthoringAdapterSnapshot` currently pins `sourceMap: null` and
`studioId: null` for these six. Binding them means the module leaves the
retained advanced adapter, which is the intended direction: the adapter is a
record of the authoring phase, not a permanent home.

### 5. Delivery map (six, one schema)

A versioned delivery map per module binding workbook and source map, validated
by `validateAdvancedModuleDeliveryMap`. `deliveryMapInputId` on the contract
entry must name a `course-content` JSON file input.

### 6. Release provenance — the only step that needs infrastructure

Criterion 18, `release-provenance-ci-and-deployment-evidence`, is `planned`
across all six. Its evidence record currently states that the package does *not*
establish exact-source-commit CI, learner-delivery binding, deployment, or
publication evidence.

Producing it requires: a commit, a CI run against that exact commit, a
deployment, and a record binding all three. That is the one item no amount of
local work creates.

Once it lands, all eighteen criteria can move to `reviewed`, the review record
(schema in `scripts/module-review-evidence.mjs`, digest-bound to the evidence
record) can be written, and the assessment in
`m31-m36-agent-assessment-2026-08-07.md` becomes transcribable.

## Sizing

| Step | Unit | × 6 |
| --- | --- | --- |
| Studio + CSS | ~900 lines + ~19 KB | the bulk of the work |
| Progress codec | ~2 KB | small, mechanical |
| Surface declaration | ~15 lines | small |
| Registry/graph wiring | ~10 lines | small |
| Delivery map | one JSON | small |
| Release provenance | — | one CI/deployment cycle for all six |

The studios dominate. Everything else is hours, not days.

## What this does not change

Building all of it does not make the material good — that is what the
assessment addressed separately, and what a human reviewer with library access
could still strengthen on `source-claim-correctness`. It makes the material
*deliverable*, which is a different property.
