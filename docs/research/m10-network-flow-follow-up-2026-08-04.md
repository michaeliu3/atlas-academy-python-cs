# M10 network-flow calibration follow-up

**Review date:** 2026-08-04  
**Status:** bounded content follow-up; M10 remains `legacy-baseline` and
unrecorded for release.

## Question

The active Levels 1–9 inventory names network flow as an undergraduate
algorithm topic. The earlier M6–M10 review deliberately deferred it, so the
current M10 workbook needed a focused comparison before the gap could be
closed.

## Official calibration

- [MIT 6.046J Lecture 13: Incremental Improvement — Max Flow, Min Cut](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/resources/lecture-13-incremental-improvement-max-flow-min-cut/) — capacity/conservation model, residual augmentation, and the max-flow/min-cut proof route.
- [MIT 6.046J Recitation 7 route](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/recitation-notes/) — matching and capacity-constrained application transfer.

These links calibrate topic order, definitions, proof obligations, and the
kind of certificate an undergraduate algorithms learner should be able to
read. They do not establish institutional equivalence, learner attainment,
credit, or permission to copy lecture assets, exercises, solutions, or prose.

## Resulting Atlas change

M10 now adds one connected bridge inside Session 6:

- feasible flow: capacity bounds, intermediate conservation, and source/sink value;
- residual forward and reverse capacity, with a code-reading defect when reverse state is omitted;
- augmenting-path prediction and a small conservation check;
- max-flow/min-cut proof idea and a reachable-set cut certificate;
- transfer to matching/reviewer assignment/bounded routing with explicit nonclaims;
- source-linked visual, text alternative, MCQ misconception repair, oral-defense prompt, and dossier artifacts.

This closes the named **network-flow** topic at a first-principles,
code-reading, and proof-certificate level. It does not claim a complete
production max-flow library, all flow variants, network-routing protocols, or
institutional problem-set volume. Those remain explicitly deferred or
extension work.

## Evidence

- Canonical workbook: `content/modules/10_graph_algorithms_network_models.md`
- Arc/source ledger: `content/source-maps/arc_ii_source_map.md`
- Module source audit: `content/source-maps/module10_graph_algorithms_network_models_source_audit_addendum.md`
- Candidate evidence record: `content/course/contracts/evidence/m10.v1.json`
- Regression coverage: `tests/m6-m10-source-ledger.test.mjs`

All Atlas explanations, diagrams, pseudocode, prompts, and experiments remain
original; external material is linked and paraphrased only.
