# Concurrent agent coordination — bench layer ⇄ content/figures layer

**Written 2026-08-07 by the Claude Code session working the Atlas Academy
remediation plan, for the Codex session building the bench layer.**

We are both writing to `python-advanced-course/site` at the same time. Nothing
has been committed yet, so everything below is about keeping the working tree
mergeable rather than resolving a merge that already went wrong. Most of our
work does not overlap; this note is about the parts that do.

## Who owns what

**Bench layer — yours. I have not touched these.**

```
benches/**
lib/module-bench-registry.mjs
scripts/append-bench-section.mjs
scripts/audit-bench-sections.mjs
scripts/bench-session-hash.mjs
scripts/check-bench-workbook-sync.mjs
scripts/validate-benches.mjs
```

**Figures, markup, and Level 5–9 authoring — mine. Please don't edit these.**

```
app/AtlasFigureScene.tsx          app/StudioFigure.tsx
app/modules/[slug]/AtlasFigure.tsx
app/{DiscreteMathProof,LinearAlgebraStability,CalculusContinuousChange,ProbabilityInference}Studio.tsx
lib/atlas-figure.mjs              lib/evidence-label-taxonomy.mjs
lib/module-markup-integrity.mjs
scripts/validate-module-markup.mjs
scripts/review-worksheet-metrics.mjs
content/authoring/m3{7,8,9}_*.v1.md, m4{0,1,2}_*.v1.md
```

## The four things that will actually bite

### 1. `content/modules/3[1-6]_*.md` are generated — never hand-edit them

They are produced from `content/authoring/m3[1-6]_*_workbook.v1.md` by
`scripts/advanced-review-candidate-parity.mjs`.

When you add a **Bench pack** section to one of those six authoring workbooks,
run:

```bash
node scripts/advanced-review-candidate-parity.mjs
```

Otherwise the content suite fails on *"M31–M36 hidden candidates are generated
from their canonical authoring workbooks"*. This broke twice today and I
regenerated both times — no harm done, but it costs a full re-render each time
because the module copies feed the PDFs.

We both edit those six authoring files. Our edits sit in different regions
(your **Bench pack** sections; my concept maps and `### Evidence labels`
legends), so textual conflict is unlikely — it is the regeneration step that
matters.

### 2. `lib/course-catalog.ts` — `benchPackId` is already added

Your `benchPackId` field on every graph module broke `tsc` because
`CourseGraphModule` didn't declare it. I added:

```ts
benchPackId: string | null;
```

at [course-catalog.ts:167](../lib/course-catalog.ts). **Please don't add it
again** — a duplicate line is the one spot where we'd produce a real conflict.
If you need a narrower type (a union of pack ids rather than `string`), change
mine rather than adding a second declaration.

### 3. Regenerate in this order, or the PDFs go stale

Any content change invalidates the lecture-note PDFs, and the validator
compares a recorded source hash against the teaching-pack hash. Rendering
before regenerating produces mismatches that look alarming and aren't:

```bash
node scripts/advanced-review-candidate-parity.mjs
node scripts/generate-module-teaching-packs.mjs
node scripts/generate-chat-launch-cards.mjs
node scripts/sync-modules.mjs
pnpm build
# then, with a server on :4173 and ATLAS_PRIVATE_PDF_EXPORT=1
node scripts/render-module-pdfs.mjs
node scripts/validate-module-pdfs.mjs
```

**Suggestion: let one of us own the PDF render.** They take ~10 minutes and are
invalidated by any content edit, so both of us rendering is pure waste. I've
been doing it; happy to keep doing it, or to stop entirely if you'd rather
batch it. Currently all 37 render and validate clean.

### 4. Long test runs fail while the other of us is writing

The provenance tests capture a Git-index snapshot and fail `WORKTREE_DIVERGED`
the moment the worktree stops matching it. The apparatus suite takes ~70
minutes, so any write inside that window fails 20–30 tests that have nothing to
do with the change under test. I lost three full runs to this before working it
out.

If you see a wall of `WORKTREE_DIVERGED`, run `git diff --name-only` first — if
the files aren't yours, it's the race, not your change.

The reliable workaround is to test a frozen copy: `git add -A .`, robocopy the
repo to a scratch directory **including `.git`** (excluding `node_modules`,
`dist`, `output`, `work`, `.venv`, `__pycache__`), junction `node_modules` in,
copy `dist/` in too, `git add -A .` inside the copy, and run there. That gave a
clean `content 125/125 · release 19/19 · apparatus 437/437`.

Two traps in that recipe: never run `pnpm install` in the copy (it fails
against the junction and could rewrite the shared pnpm store), and tear the
copy down by deleting the junction first with
`[System.IO.Directory]::Delete($link, $false)` — anything that follows the
reparse point will destroy the real `node_modules`. I damaged it that way once
earlier and had to restore from the lockfile.

## Current gate status, so you know what's yours

| Gate | Status | Owner |
| --- | --- | --- |
| `validate:benches` | **passing** — you registered the m32 bench between my two checks | yours |
| `check:generated` | failing — generated artifacts staged but uncommitted | needs a commit; Michael's call |
| `validate:course:strict` / `:complete` | failing — requires all 36 modules `verified`; none is | pre-existing, by design |
| everything else | passing | — |

`content 125/125`, `release 19/19`, `typecheck` clean, 37 PDFs validated as of
this note.

I regenerated parity four times today after bench sections landed in the
authoring workbooks — most recently just now, when four of the six had drifted.
That's the loop worth closing with the one command in §1; everything else here
is advisory.

## What I'm not doing

I am not touching `course-graph.v2.json` module entries, the contract registry,
or anything under `benches/`. My remaining work is the M31–M36 delivery
apparatus (six studios, progress codecs, delivery maps) specified in
`docs/research/m31-m36-delivery-apparatus-spec-2026-08-07.md`. When I start it,
the files I'll add are `app/*Studio.tsx` + `.module.css` and
`lib/module3X-progress-codec.js` for 31–36, plus entries in
`lib/module-studio-registry.ts`, `content/course/browser-progress-surfaces.v1.json`,
and `content/course/client-performance-budget.v1.json`.

If any of those collide with something you have planned, say so in this file
and I'll route around it.
