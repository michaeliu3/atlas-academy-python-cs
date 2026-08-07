# Current route truth audit

**Audited:** 2026-08-01 at `641fe69`  
**Scope:** active `course-graph.v2.json`, generated reader manifest, route and
reader code, M25/M26, and the learner-facing route documents. This is a
current-state audit, not release or learner-mastery evidence.

## One learner-facing sequence mismatch — corrected after this audit

The course library says to “Read in dependency order”
([`app/modules/page.tsx`](../../app/modules/page.tsx), lines 25–29), but it is
rendered by knowledge arc from a manifest whose visible modules are sorted by
module number ([`scripts/course-graph.mjs`](../../scripts/course-graph.mjs),
lines 407–439; [`app/modules/page.tsx`](../../app/modules/page.tsx), lines
76–126). That places M25/M26 in Arc V before M27–M30 in Arc VI even though the
canonical route is M1–M5 → M27 → … → M31–M36 → M25 → M26
([`course-graph.v2.json`](../../content/course/course-graph.v2.json), lines
94–239). The preview badges prevent false credit, but the library sentence can
still send a reader toward the wrong next item.

**Resolution:** the library now describes itself as knowledge-arc/reference
browsing and links directly to `/route` for the prerequisite-first sequence.
No graph, manifest, or navigation redesign was needed.

## Boundaries that currently agree

- M25 is `preview` with academic prerequisites M22, M24, M30, M31, M34, M35,
  and M36; M26 is `preview` after M25
  ([`course-graph.v2.json`](../../content/course/course-graph.v2.json), lines
  1011–1078). Their reader pages explicitly say reference access does not
  advance the Core, and the studio/oral-defense route is withheld for previews
  ([`app/modules/[slug]/page.tsx`](../../app/modules/[slug]/page.tsx), lines
  61–67 and 167–172; [`lib/module-studio-registry.ts`](../../lib/module-studio-registry.ts),
  lines 233–238).
- M31–M36 are `authoring-only` with hidden reader access
  ([`course-graph.v2.json`](../../content/course/course-graph.v2.json), lines
  1214–1245 and following). They are absent from the 30-entry reader manifest;
  the module page returns `notFound()` when either the manifest entry or
  Markdown is missing ([`content/modules/manifest.json`](../../content/modules/manifest.json);
  [`app/modules/[slug]/page.tsx`](../../app/modules/[slug]/page.tsx), lines
  92–98). The route shows them as non-link cards rather than bypassing them
  ([`app/route/page.tsx`](../../app/route/page.tsx), lines 206–275).
- M24 and M30 retain their hidden next-route nodes (M32 and M31 respectively)
  rather than skipping to a visible later module; `ModuleNavigation` redirects
  a hidden neighbor to `/route` rather than its reader slug
  ([`app/modules/[slug]/ModuleNavigation.tsx`](../../app/modules/[slug]/ModuleNavigation.tsx),
  lines 69–99). This preserves the difference between navigation and academic
  prerequisites.
- `README.md`, `docs/LEARNER_ROUTE_PLANS.md`,
  `docs/PRIVATE_GUIDED_LEARNING_ROUTE.md`, and `docs/COURSE_STATUS.md` state
  the same 28 open / 2 preview / 6 authoring-only boundary. The private guided
  route expressly says that its use does not create portal access, Core credit,
  or publication.

## Direct verification

- `node --test tests/course-graph.test.mjs tests/course-status-projection.test.mjs tests/guided-route-handoffs.test.mjs tests/private-learning-pack-diagnostics.test.mjs tests/m25-m26-synthesis-receipts.test.mjs tests/module-learning-companion.test.mjs tests/advanced-delivery-map.test.mjs` — **26 passed**.
- `node --test tests/rendered-html.test.mjs` — **56 passed**, including route
  rendering, preview withholding, and hidden M31–M36 reader checks.

No other route, reader, manifest, or current learner-document contradiction was
found in this audit.
