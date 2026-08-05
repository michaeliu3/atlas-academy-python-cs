# Content authoring workflow

## Module contract

Every module must have all of the following before it can be represented as
fully contract-verified or release-ready:

1. prerequisite connection and forward handoff;
2. primary/university source map with claim boundaries and licensing note;
3. six connected sessions;
4. original diagrams, traces, code-reading labs, and text equivalents;
5. accessible interactive HTML experience;
6. confidence-aware conceptual diagnostic;
7. problem ladder, Atlas project, review rubric, and retrieval schedule;
8. TA prompts and Study Partner routine;
9. deterministic local model/tests when they reveal a mechanism;
10. learner-controlled record or cross-role handoff option, if the learner chooses it.

No learner record, Notion write, or progress-tracking event is required for
module readiness, review, or release. Records stay off by default and remain a
separate, session-scoped learner choice in a designated learning chat.

## Versioned evidence contract

`content/course/course-graph.v2.json` is the single source of truth for
module identity, academic prerequisites, forward handoff, route position,
source map, studio, and gate. Its separate state fields record lifecycle,
reader access, route availability, contract maturity, and release maturity.
No contract registry, route page, or workbook heading may override those
fields. Reader access is not learner completion; preview access is reference
reading only, never Core credit.
`content/course/contracts/module-contract-registry.v3.json` is the active,
unified evidence registry. It has one fail-closed entry for each of the 36
canonical modules and the same ordered 18-criterion contract taxonomy for
every entry. It exists so that an author cannot make a module look complete by
adding familiar headings alone.

The v3 registry preserves rather than replaces the earlier evidence: the
immutable legacy audit and structural packets remain migration evidence for
M1–M30, while the advanced v1 contract and prerequisite/session bridge remain
authoring evidence for M31–M36. `module-contracts.v1.json` is no longer an
active registry authority. A pointer, packet, plan, or historical audit cannot
promote a module, create reader access, award Core credit, or establish a
release claim.

The current graph has 36 defined modules: 30 reader-visible modules (28
`legacy-open` workbooks plus M25/M26 reference previews) are deliberately recorded as
**legacy structural baselines**; zero are `verified`; M31–M36 are
authoring-only. The validator can prove the legacy modules' checked-in
workbook, six session headings, source-map path, and graph handoff. It cannot
infer that an explanation is rigorous, a diagram has a good prose equivalent,
or an oral defense is supportive. Those require reviewed, module-specific
evidence before a contract becomes `verified`.

### Promotion evidence chain

V3 promotion is deliberately more than changing a status string. A
`review-ready` module stays hidden and must bind all 18 criteria to its own
versioned module-evidence record. Each input must resolve to a Git-tracked
local file, heading, or JSON Pointer with an explicit role; a digest-bound,
module-specific review record must approve every criterion and quality
dimension. Legacy audits, generic README links, unresolvable pointers, and
unbound review labels cannot satisfy this path.

A `verified` module must preserve that review-ready evidence bundle from an
earlier review-ready commit. Its later additive release record must bind a
strictly earlier candidate commit, unchanged candidate inputs, source-commit
CI policy and CI evidence, a matching canonical graph `deployed-recorded`
record ID, module-scoped provenance/source-review/known-limitations records,
and a real private deployment version. These checks establish a bounded
release record; they do not convert review evidence into a learner-mastery or
security-clean claim. No module has entered either promotion state yet.

For a future hidden learner candidate, use the fixed module-scoped selector
`content/course/contracts/review-candidates/mNN.v1.json`. It binds the final
future `content/modules/NN_*.md` workbook, module-scoped source-ledger paths,
and the Markdown visual scope to the exact v3 evidence record. The selector is
read with the evidence, review, companion, visual, and test inputs from one
clean Git-index snapshot. It cannot use an instructor `content/authoring/`
workbook, an authoring-delivery map, a manifest, a studio, or release fields.
The evidence record must contain exactly one `review-candidate-delivery`
JSON-pointer input at the selector document root, so its digest-bound review
cannot approve a different candidate scope.
At `review-ready` the selector deliberately supplies the material scope while
the graph remains hidden and has no manifest/source-map binding; at `verified`
the manifest workbook and graph source map must agree with that frozen scope.
It is neither approval nor deployment evidence. M31–M36 currently have
non-promoting hidden selectors; their authoring-only evidence records
deliberately do not bind a `review-candidate-delivery` input, so none of
these selectors is a review-ready decision.

When a verified transition changes reader visibility, stage the future graph,
v3 registry, evidence, review, selector, and learner material first, then run
the module synchronizer to generate the next manifest. Its only pre-write
allowance is that deterministic in-memory manifest; all other promotion facts
must already match one clean Git-index snapshot. Stage the generated manifest
and rerun ordinary course validation, which again requires exact index
agreement. This convenience is never available to strict, complete, or release
validation.

Use the right gate for the claim being made:

~~~text
pnpm validate:course          # structural migration gate; reports human-review gaps
pnpm validate:course:content  # authored course-content gate; excludes human/release observations
pnpm validate:course:inputs   # structural gate plus Git-tracked regular release inputs
pnpm validate:course:strict   # full learner-route verification gate; currently fails by design
pnpm sync:modules
pnpm check:generated
~~~

`validate:course:inputs` is the CI publication boundary: the graph refuses a
`published` module without a verified contract and deployed release record, and
the v3 registry then validates its full promotion evidence. `validate:course:strict`
goes further by requiring every non-preview learner route module to be verified;
it is therefore expected to fail while the current `legacy-open` baseline is
being retrofitted. `validate:course:complete` is stricter still: it requires all
36 entries to be verified and M25/M26 to become published. Neither gate may be
weakened merely to make CI green.

`validate:course:inputs` is intentionally a clean Git-index provenance gate:
stage the intended tracked changes first, and ensure every tracked worktree file
matches that index before running it. Use ordinary `validate:course` while
authoring a dirty worktree; it remains the structural, authoring-friendly check.

`validate:course:content` is the focused private-course authoring gate. It
requires every canonical module, including hidden M31–M36 authoring packs, to
have the first 16 instructional criteria resolved: route connections, six
sessions, first-principles and rigorous explanations, code-reading practice,
prediction/transfer, source and visual alternatives, diagnostics, retrieval,
project rubric, oral-defense material, and the three companion handoffs. The
intentional prerequisite-map ambiguity for preview-only M25/M26 is allowed and
reported. The optional interaction/reference-model studio and release,
deployment, human-review, learner, and Notion observations remain separate
promotion concerns; a passing content gate must not be described as a
published or human-verified course.

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
human approval. Do not use it to call a module verified, published, or
released. Extend the evidence model only after its review fields and release
semantics can be validated without weakening the active v3 strict gate.

### Retained advanced-authoring adapter

`content/course/contracts/advanced-module-contracts.v1.json` and
`scripts/advanced-module-contract.mjs` are a retained advanced-authoring
adapter for M31–M36. They preserve frozen authoring inputs, bridge topology,
and negative publication boundaries. The unified v3 registry is the sole
authority for review-ready and verified promotion; this adapter never
supersedes it, extends an active v1 lifecycle, or reuses the narrow M21/M27
pointer pilot.

The retained JSON preserves historical `review-ready` and `published`
vocabulary for audit readability, but a valid adapter entry may be only
`authoring-only`: pending human-review fields, `publicationEffect: none`, no
delivery map, and no release record. Its authoring snapshot is intentionally
frozen. Later v3 review or release changes must not mutate that snapshot or
make the adapter compare itself to live learner material.

The initial M31 record is **authoring-only**. It resolves a bounded set of
checked-in planning and research inputs, including the canonical prerequisite
bridge, source/claim plans, the historical M31–M36 readiness audit, and a
small source-code/test fixture for authoring inspection. It checks the
six-session plan and declared S01–S10/C01–C08 coverage while requiring all of
the following learner/release surfaces to remain absent or pending: learner
manifest, learner route, learner workbook, graph-bound source map, learner
studio, human review, and release record. A bounded source-code/test pointer
does not make the fixture learner-facing, reviewed, deployed, or published.

The adapter has one accepted state: `authoring-only`, meaning plan/pointer
evidence only and no learner/release-shaped claim. A future M31–M36 v3
`review-ready` entry must resolve its own module evidence record and
digest-bound human review; a future v3 `verified` entry must also preserve the
review-ready bundle and bind release provenance. Neither transition may reuse
the adapter's criteria as promotion evidence.

Each contract input has a versioned role. `course-content` and `provenance`
inputs are included in the generated course-input hash ledger; `source-code`
and `test` inputs are Git-tracked structural references but are not silently
reclassified as deployed course content. The current
`docs/archive/publication-readiness/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json` ledger entry is an explicit
provenance-only exception: its hash preserves the *do not publish* boundary;
it does not deploy or expose M31.

Teaching-test inputs must be either a top-level `tests/<name>.test.mjs` file
or a canonical `public/downloads/test_moduleNN_reference.py` teaching-model
suite. `pnpm test` discovers the first set deterministically; the dedicated
Python CI job discovers the second set with
`python -m unittest discover -s public/downloads -p "test_module*_reference.py"`.
The generic contract check establishes only that a declared test is discovered
by a configured course surface and structurally names the module plus a bound
artifact. It is not, by itself, proof of behavioral coverage. When an
`interaction-reference-model-and-teaching-tests` criterion binds a canonical
`public/downloads/moduleNN_reference.py` model, the stricter rule applies: it
must bind `public/downloads/test_moduleNN_reference.py` and the Python CI
workflow must declare `scripts/verify_teaching_model_exercises.py` in a
standard-shell target step without a direct execution override. That verifier
runs each discovered suite and
requires an observed real parent-process Python frame defined by its paired
reference model; skipped tests, lazy assertion messages, locally shadowed
stand-ins, and direct synthetic profile callbacks therefore cannot satisfy the
runtime check. It deliberately fails closed if model work happens only in a
child process. This is a trusted checked-in-test regression check, not a
security sandbox for adversarial Python test code: source review and later
source-commit CI evidence remain separate. The local contract validates that
this CI route is configured—it does not claim the verifier ran for a particular
candidate. A matching path or structural check still does not prove browser
behavior, review, or release.

M29's candidate-only preflight is covered by its focused Node regression test,
not by a release record. Its loader accepts only Git-tracked canonical
`content/course/contracts/evidence/preflight/mNN.v1.json` paths whose working
content matches the Git index; evidence paths reject traversal, symlinks, Git
pathspec interpretation, and unstaged input drift. For its v1 candidate record,
the explicit stable release nonclaim, release-boundary claim and limitation,
and visible candidate-boundary documentation are deliberately locked; changing
that wording requires a reviewed schema/code change rather than silently
preserving a passing candidate state. The canonical graph also requires every
non-verified module to keep an `unrecorded` release with a null record ID; M29
pins that tuple directly as an extra candidate-boundary check.

M31 has a separate, equally non-promoting authoring-only candidate profile.
It can resolve all eighteen criteria against the hidden M31 workbook,
instructor-facing source map/audit, frozen companion, and bounded Node fixture
without manufacturing the deliberately absent learner workbook, manifest,
graph source-map binding, studio, delivery map, review record, or release
record. Its visual candidate test checks complete Mermaid metadata for the
hidden draft, but that structural check is not a browser/accessibility review.
The profile keeps every human-review dimension pending and leaves the exact
source-commit CI, deployment, and learner-delivery evidence open. It is not an
M31 promotion path and cannot override the v3 registry or the canonical graph.

For a future v3 verified release, do not insert a final candidate SHA or
Actions URL into the same commit that needs that evidence. First create and
validate the candidate commit; then make a later additive provenance commit
that records the exact candidate SHA, CI run, review/source paths,
limitations, and—only after it occurs—private deployment version. The v3 gate
requires that candidate SHA to be a **strict ancestor** of the provenance
record, that every non-provenance input is byte-identical at that candidate,
and that release evidence paths visibly name that SHA and run URL. Do not
amend, squash, or rewrite history to manufacture self-referential evidence.

Those checks bind local Git evidence; they do not query GitHub Actions,
GitHub's review state, or private hosting. Record and independently verify
those remote facts in `docs/RELEASE_PROVENANCE.md` before making a release or
deployment claim.

The historical bridge validator remains active for every M31–M36 authoring
plan. It enforces the canonical prerequisite topology, first use, session
order, and forward handoffs, but it is never a substitute for v3 evidence,
review, release, or learner access validation.

For future v3 `review-ready` and `verified` advanced modules, create the
separate fixed hidden-review-candidate selector described above. A later
learner-delivery map may additionally bind the exact workbook/source-map paths
to the six-session sequence, prerequisite use, first-consuming bridge
artifacts, and forward handoff, but it cannot replace the selector or reuse an
authoring delivery map as promotion authority. These declarations remain small
structural checks—not prose-quality or learner-experience approval. An
`authoring-only` entry keeps the adapter's delivery-map field `null`.

Advanced release inputs under `docs/` are deliberately narrow: the historical
`archive/publication-readiness/M31_M36_PUBLICATION_READINESS_AUDIT.v1.json` remains part of the hashed
ledger, while a future v3 verified module must use only
`docs/module-evidence/mXX/provenance.md`, `source-review.md`,
`known-limitations.md`, and `course-ci-evidence.v1.json` for that same module.
The ledger is derived from the validated v3 contract; arbitrary documentation
cannot become a release input. Each release-record field must use its
corresponding exact filename rather than reusing the historical audit or
another field's evidence.

## Legacy structural packets

`legacy-module-contract-packets.v1.json` is a retained migration adapter for
M1–M30. A packet can resolve exact Git-tracked workbook, source-map, and
source-audit anchors; bind six ordered sessions to the canonical academic
prerequisites and forward module; and list bounded studio/model/test artifacts.
It must preserve the matching immutable legacy-audit status for the first 16
criteria in the unified v3 taxonomy. Its only current state is
`structural-candidate`, with `humanReviewState: not-reviewed` and
`publicationEffect: none`.

Do not use a packet to mark a module reviewed, verified, released, deployable,
or mastered. In particular, a resolved anchor does not establish the quality
of prose, accessibility alternatives, source-license correctness, a human
review, or learner understanding. Those require later, separate evidence.

## Legacy candidate preflight profiles

`legacy-candidate-preflight-profiles.v1.json` is the separate, versioned
allowlist for a small cohort that has a candidate-only evidence record and
preflight. It currently names M27–M30. Each profile freezes only
module-specific structural inputs: the typed packet, candidate-boundary
document hash, scoped source-ledger paths, studio source, and visual test.
The validator derives and hashes that module's evidence and preflight records
as well. Code-owned policy keeps the state `candidate-not-promoting`, the
release criterion open, and all human-review, source-commit CI, and private
deployment blockers explicit.

Do not add a module to this registry merely because it has content. A passing
preflight proves a coherent Git-index snapshot of structural inputs, not a
review, publication, accessibility approval, license decision, deployment,
or learner-mastery result. The registry deliberately does not use the future
`review-candidates/` selector, which remains reserved for reviewed promotion.

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
  reader-visible material. A public teaching artifact becomes a release input only
  when it is explicitly listed in
  `content/course/release-input-policy.v1.json`; CI rejects any tracked
  `public/downloads/` artifact that is absent from that policy. Ignored runtime
  caches (for example `__pycache__/*.pyc`) can never enter the ledger or the
  built client downloads. Builds, CI, and private deployment must never read
  an adjacent authoring workspace.
- A learner-facing source map or source-audit addendum must use a downloads
  link. Declare its canonical content/source-maps input and identically named
  public destination in the policy sourceArtifactCopies list; synchronization
  writes the public copy, and the source-artifact regression gate rejects
  retired local research links or a stale delivered copy. This delivery check
  proves artifact identity only—not source quality, license correctness, or
  pedagogical review.
- `content/course/release-inputs.v1.json` is generated from allowlisted
  repository inputs—including profile-derived candidate evidence/preflight
  inputs—and records their SHA-256 hashes. An arbitrary note cannot enter this
  ledger: candidate verification records enter only through the versioned
  profile validator. It is a content-provenance record, not a substitute for a
  reviewed Git commit or release ledger. Text input hashes use canonical LF
  newlines so Windows and Linux checkouts agree.
- Prefer official language/standard documentation and primary sources.
- Use university courses for sequence and pedagogy, not copied assignments or
  solutions.
- Link and paraphrase; write original diagrams, prose, fixtures, and prompts.
- Label implementation-specific observations with version/runtime scope.
- State what a source, model, or test does not prove.

## Accessibility

- Provide meaningful text for every diagram and color distinction.
- For every Mermaid visual, place all three metadata lines immediately inside
  its fenced block, before the Mermaid syntax:

  ~~~mermaid
  %% atlas-diagram-id: m01-example-route
  %% atlas-diagram-title: Short reader-facing title
  %% atlas-diagram-alt: A concise prose explanation of the relationship the visual teaches.
  flowchart LR
    A["Input"] --> B["Checked result"]
  ~~~

  The ID is a unique lower-case kebab-case visual identifier. The title names
  the instructional relationship, while the alternative explains it in prose;
  raw Mermaid source is a technical supplement, not an equivalent. Run
  `pnpm validate:mermaid-alternatives` during migration and
  `pnpm validate:mermaid-alternatives:complete` only when every reader visual
  has been retrofitted. A module cannot use incomplete visual metadata as
  promotion evidence.
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
