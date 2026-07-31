# Atlas Academy Course Evidence

This context names the course-evidence concepts used to distinguish structural
inventory from pedagogical review and release truth.

## Language

**Canonical course graph**:
The single course-level record of a module's identity, route, prerequisites,
availability, source map, and release boundary.
_Avoid_: navigation graph, secondary manifest

**Canonical module workbook**:
The one module document selected by the canonical manifest for a module.
_Avoid_: related notes, nearby Markdown file

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

**Release input**:
A versioned local course input included in the deterministic provenance ledger.
It records what was reviewed or built, not whether it was pedagogically approved.
_Avoid_: release approval, deployment proof
