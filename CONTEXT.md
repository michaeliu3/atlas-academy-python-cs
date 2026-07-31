# Atlas Academy Course Evidence

This context names the course-evidence concepts used to distinguish structural
inventory from pedagogical review and release truth.

## Language

**Canonical course graph**:
The single course-level record of a module's identity, route, prerequisites,
reader access, availability, source map, contract state, and release state.
_Avoid_: navigation graph, secondary manifest

**Reader access**:
Whether Atlas can render a module's checked-in workbook to a learner. It is a
delivery fact, not a mastery, prerequisite, contract-review, or release claim.
_Avoid_: unlocked, passed, published-quality

**Route availability**:
The learner-facing role of a module in a named route: `legacy-open` is
available legacy learning material whose full contract and release review are
still pending; `published` is a learner-released module with a verified
contract and recorded deployment evidence; `preview` is reference-only;
`locked` is named but not route-open; `optional` is outside the required Core;
and `authoring-only` is not learner-deliverable.
_Avoid_: lifecycle, reader access, completion state

**Contract state**:
The maturity of a module's structured teaching evidence: `not-started`,
`authoring-only`, `legacy-baseline`, `review-ready`, or `verified`. It is
separate from reader access, but canonical publication invariants require a
`verified` module to use `published` availability and recorded deployment
evidence.
_Avoid_: published, learner mastery, deployment state

**Release state**:
The maturity of recorded release evidence: `unrecorded`, `candidate-recorded`,
or `deployed-recorded`. A `published` module must carry a verified contract and
`deployed-recorded` evidence; a deployment claim must still link to its exact
recorded evidence.
_Avoid_: contract state, reader access, security clean

**Core progression**:
A learner-controlled local record that prerequisite evidence supports taking a
route step as the next Core study. It never blocks reference reading and never
claims mastery merely because a page was opened.
_Avoid_: reader access, grade, automatic completion

**Canonical module workbook**:
The one module document selected by the canonical manifest for a module.
_Avoid_: related notes, nearby Markdown file

**Diagram text alternative**:
An authored, concise prose explanation of the instructional relationship in a
specific visual. It is rendered visibly and associated with that visual for
assistive technology; raw Mermaid syntax is only a technical supplement.
_Avoid_: source fallback, decorative caption, graph label dump

**Evidence pointer**:
A bounded reference to a visible local workbook or source-map heading for one
contract criterion. It is structural evidence, not an approval.
_Avoid_: proof of quality, completion evidence

**Session output pointer**:
A typed evidence pointer that binds one declared forward artifact in an ordered
session to a visible local workbook heading inside that session. It proves only
the structural location and sequence of the artifact—not that a learner made
it or that its pedagogy has been reviewed.
_Avoid_: learner evidence, mastery proof

**Pointer-present**:
An audit status meaning that a criterion-specific structural evidence pointer
resolves in the canonical local material.
_Avoid_: approved, complete, verified

**Ambiguous evidence**:
An audit status meaning that material is nearby or partial but does not expose
a sufficiently specific structural pointer for the criterion.
_Avoid_: failed learning, absent concept

**Human quality review**:
A separate qualitative judgment of the underlying teaching material. It cannot
be inferred from an evidence pointer or from a release-input hash.
_Avoid_: audit pass, structural validation

**Module evidence record**:
A versioned, module-scoped record that resolves the concrete local inputs for
every v3 contract criterion, including their role and locator. It makes the
review surface inspectable; it is not, by itself, a quality approval, learner
mastery claim, or release proof.
_Avoid_: checklist label, automatic verification

**Module review record**:
A versioned, module-scoped human-review decision bound to the exact SHA-256
digest of its module evidence record. A later verified release must preserve
that reviewed evidence bundle and add independently checkable CI, deployment,
and limitation evidence.
_Avoid_: unbound approval, deployment assertion

**Release input**:
A versioned local course input included in the deterministic provenance ledger.
It records what was reviewed or built, not whether it was pedagogically approved.
_Avoid_: release approval, deployment proof

**Designated live learning chat**:
A learner-created, platform-hosted Codex chat assigned either the Teaching
Assistant or Study Partner role. It is outside the Atlas portal runtime.
_Avoid_: Atlas voice feature, portal agent

**Designated-chat concise session note**:
At most one minimal Notion record for a substantive learning conversation in a
configured private destination, automatically created only by the learner's
designated Teaching Assistant or Study Partner chat when records are not paused
or off-record. A portable copied prompt remains local. It is not a transcript,
grade, or proof of mastery; a saved-note claim requires direct evidence.
_Avoid_: portal automation, chat archive, automatic mastery tracking, saved-note claim without evidence
