# M35/M36 focused candidate review

**Scope and boundary — 2026-08-01.** This bounded academic-calibration review
read the two private authoring workbooks and their existing source-research
ledgers. The three bounded revisions below were then applied in the follow-up
authoring batch. It is not a release, contract, accessibility, route, or
learner-readiness decision. M35/M36 remain authoring-only; this review does not
alter their graph/portal status or the M25/M26 gate. Sources are calibration
anchors only: link and paraphrase, never copy course assets or imply enrollment,
credit, or university equivalence.

## Official calibration anchors checked

| Official material (accessed 2026-08-01) | Review use |
| --- | --- |
| [MIT 6.036](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/) and [MIT 6.7960](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) | Validate the representation → generalization/theory progression and the deliberate boundary from a full deep-learning survey. |
| [CMU 10-301/601](https://www.cs.cmu.edu/~mgormley/courses/10601/) and [Stanford CS229 materials](https://cs229.stanford.edu/materials.html-full) | Validate formulation, regularization/model selection, formal-properties, and experiment-design habits. |
| [Georgia Tech CS 7641](https://omscs.gatech.edu/cs-7641-machine-learning) and [UC Berkeley CS 189 catalog](https://undergraduate.catalog.berkeley.edu/courses/1042881/overview-aoYks) | Calibrate defensible analysis/portfolio expectations and preserve the stated boundary from broad model-family and real-data project coverage. |

## Strengths retained

- **M35** has an unusually clear evidence chain: representation and information
  budget → comparable baseline → split/selection boundary → objective/system
  trace → observability → human authority. Its synthetic-only dossier prevents
  a score from becoming a deployment claim.
- **M36** makes theorem conditions, finite observations, execution evidence,
  shift, and governance visibly different layers. The finite-class proof and
  IID-removal counterexample correctly teach scope rather than theorem names.
- The M35 → M36 handoff preserves the official-course standard of explaining
  assumptions and experimental limits while adapting assessment to code reading,
  design review, and a constructive oral defense.

## Three small corrections — applied

1. **M35, Session 3, “Leakage is a dependency path” (after the reveal):** added
   one three-row *group/time split* counterexample—two records from one entity
   or an earlier/later record—and ask which field defines the unit of
   independence. The prose already names entities and time; a tiny concrete
   trace would make the evaluation boundary inspectable without adding another
   topic or framework.
2. **M36, Session 3, immediately before “Finite-class proof skeleton”:** added a
   one-line notation strip, e.g. `Z=(X,Y)`,
   `R_P(h)=E_{Z~P}[ell(h,Z)]`, and
   `Rhat_S(h)=1/n sum_i ell(h,Z_i)`. This reduces symbol-loading before the
   concentration/union-bound argument and makes the theorem card easier to
   audit against its declared loss and relation.
3. **M36, Session 5, “Monitoring is an action-bearing hypothesis”:** added a
   required `label availability / detection lag` field and have the learner
   label each proposed observable as input-time or delayed-label evidence.
   The subsequent table already mentions delayed-label checks; surfacing this
   distinction in the plan prevents an input monitor from being misread as an
   immediate detector of a changed label relation.

These are candidate authoring refinements, not defects that justify a release
claim. No broader coverage expansion is recommended in this pass.
