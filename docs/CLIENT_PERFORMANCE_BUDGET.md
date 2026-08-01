# Client performance-budget gate

Atlas has a versioned build-artifact budget at
`content/course/client-performance-budget.v1.json`. The gate is deliberately
narrow: it gives reviewable evidence about the files a local production build
emits. It is not a substitute for real-user performance testing.

Run it after a production build:

~~~text
pnpm build
# or, when dist/client already came from the reviewed build:
pnpm validate:performance-budget
~~~

`pnpm build` runs the gate automatically. The portal CI job runs `pnpm test`,
which includes that build gate, so the same policy is checked in CI without a
duplicated task. A policy change belongs in the same review as the
architectural change that needs it.

## What the gate verifies

The validator reads the actual `dist/client/.vite/manifest.json` and regular
files under `dist/client/assets`. All sizes are raw emitted bytes—not a
compressed transfer estimate.

| Metric | Current v1 limit | Why it exists |
| --- | ---: | --- |
| All `dist/client/assets` files | 7,000,000 B | Detects broad emitted-browser-asset growth. |
| Asset-file count | 260 | Detects accidental chunk proliferation. |
| One emitted asset | 750,000 B | Detects a new oversized single browser asset. |
| Browser-entry static import closure | 400,000 B | Protects the manifest's initial browser-entry boundary. |
| Each named studio's own entry plus direct CSS | 80,000 B | Keeps an individual studio's primary code-split entry bounded. |
| Each named studio's static import closure | 400,000 B | Bounds its entry plus manifest-static dependencies. |

The policy also enumerates all 12 registered visual studios by stable manifest
`name`. Each must resolve to exactly one emitted entry, be dynamically
reachable from the browser entry, and remain outside its static-import
closure. This catches a studio that silently becomes part of the initial
browser bundle even if total byte size remains below the global cap.

The static-closure calculation deduplicates files within a closure and counts
the entry's emitted JavaScript plus manifest-associated CSS, recursively across
`imports`. It intentionally does not follow `dynamicImports`: those are the
code-split boundary being guarded.

Module 19's `concurrency` entry is intentionally the small
`ConcurrencyStudioReader` launch shell. Both the direct module reader and the
supplemental Arc IV portal keep the full `ConcurrencyStudio` behind a stable,
keyboard-operable disclosure control; its larger six-view laboratory is
requested only after the learner chooses to open it. The all-assets and
single-asset limits still bound that deferred emitted file, but the named
studio static-closure metric measures the launch boundary rather than claiming
that the post-click laboratory has no cost.

## What this is not evidence for

The gate does **not** measure or guarantee:

- HTTP compression, cache state, CDN behavior, or network latency;
- device CPU, memory, rendering time, interaction latency, or Core Web Vitals;
- route-specific preload behavior, data fetching, actual learner navigation,
  accessibility, correctness, or comprehension;
- the deferred Module 19 laboratory payload after its explicit learner action;
- intentionally separate teaching downloads under `dist/client/downloads`.

Browser accessibility acceptance and any future field/lab performance work are
separate evidence streams. A passing byte gate means only that this checked-in
policy matched this local production build's artifact and manifest structure.

## Reading failures

The command reports the observed raw-byte values, its policy version, every
named studio, and the policy's measured/unmeasured boundary. On failure it
lists every exceeded limit or broken code-split condition. Do not raise a
limit merely to make CI green: first identify whether the growth is intended,
whether it can stay dynamically loaded, and what learner-facing benefit
justifies a reviewed policy update.
