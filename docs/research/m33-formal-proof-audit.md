# M33 Formal-Proof Audit

**Scope:** authoring-only M33 workbook and its primary-source research map.
**Checked:** 2026-08-01. This is a correctness audit, not a release review or a
learner-readiness claim.

## Sources used as calibration

- [MIT 6.045J lecture-note route](https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/lecture-notes/) — official course sequence for automata, computability, reductions, and complexity.
- [Stanford CS103 theorem and definition reference](https://web.stanford.edu/class/archive/cs/cs103/cs103.1134/reference/) and its [mapping-reductions lecture](https://web.stanford.edu/class/archive/cs/cs103/cs103.1142/lectures/24/Small24.pdf) — official definitions of a mapping reduction, `HALT`, recognizers/deciders, and direction-of-solver consequences.
- The existing M33 ledger's original-paper links to Rabin–Scott, Turing, Rice,
  Cook, and Karp were checked as appropriate historical anchors. Atlas correctly
  labels its explanations as original paraphrase; it does not depend on copied
  proof text.

## Findings

| Area checked | Result | Evidence / minimal action |
| --- | --- | --- |
| Formal-language definitions, DFA/NFA scope, CFG boundary, and the `0^n1^n` distinguishing-family argument | **Correct as stated.** The suffix `1^i` distinguishes `0^i` from every distinct `0^j`; the NFA table does recognize strings ending in `01`; and the workbook keeps finite traces separate from universal claims. | Workbook lines 106–147 and 306–392. No correction needed. |
| Halting-style diagonal argument | **Correct under its named totality, encoding, and self-application assumptions.** | Workbook lines 443–458. For maximal notation precision only, write `H(encoding(D), encoding(D))` (or define a fixed encoding convention) instead of the shorthand `H(D,D)` / `D(D)`. This is an ambiguity of presentation, not a false theorem. |
| `HALT_TM <=_m A_TM` construction | **Correct.** The constructed target accepts iff the source machine halts (including halting by rejection); the malformed-input branch maps to a fixed valid no-instance, making the intended mapping total. | Workbook lines 528–559. No correction needed. |
| General many-one reduction direction and NP-completeness conditions | **Correct.** A solver for `B` plus a map from `A` to `B` solves `A`; hardness transfer therefore starts from the known-hard source. The NP statement includes membership plus a directed polynomial reduction from a known NP-hard language. | Workbook lines 493–503, 602–606, and 626–702; matches Stanford's official mapping-reduction definition. No correction needed. |
| Vertex Cover to Independent Set teaching example | **Needs one small scope correction.** The displayed equivalence for well-formed `(G,k)` is correct, but it is not yet a fully specified total polynomial-time language reduction over *all encodings*, despite following a definition that requires a total map. It omits malformed encodings, the graph/threshold encoding, and its polynomial-time accounting. | Workbook lines 506–524. Change the heading/lead-in to “a well-formed-instance transformation,” then add: “To claim `VC <=_m^p IS`, specify encodings, map malformed strings to a fixed no-instance, and show this total map is polynomial time.” The lesson already asks learners to supply these obligations, so this is a minimal clarity repair rather than a change of concept. |
| Complexity-family versus one-run counterexamples | **Correct and appropriately bounded.** The verifier equation uses the usual polynomial certificate convention; the workbook does not infer a theorem from a timeout or enumerator table, and it states `P ?= NP` as unresolved. | Workbook lines 626–711. No correction needed. |

## Follow-through

On 2026-08-01, the M33 authoring workbook was revised to label the VC-to-IS
card as a well-formed-instance transformation and to name encoding, malformed
input, totality, and polynomial-time obligations before a full
\(\mathrm{VC}\le_m^p\mathrm{IS}\) claim. This correction does not change the
module's authoring-only / hidden release status.

## Limits of this audit

This pass checked the displayed proof ideas, construction directions, quantified
claims, and nearby counterexamples. It did not prove every theorem in the cited
courses, review every historical source asset/licence, validate a future M33
interactive studio, or change M33's authoring-only / hidden release status.
