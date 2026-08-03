# M35–M36 official calibration — 2026-08-03

## Scope and release boundary

This is a fresh, read-only check of the current private M35/M36 authoring
candidates against official course material and first-party source
documentation, accessed **2026-08-03**. It is not a route, accessibility,
contract, pilot, security, or release review. The canonical graph keeps M35
and M36 as authoring-only, hidden, and unrecorded
(content/course/course-graph.v2.json:2179–2251); nothing here unlocks M25,
M26, M35, or M36. All external material remains link/cite-only; Atlas
continues to use original prose, cards, fixtures, and derivations.

## Result: no material factual or teaching gap found

| Calibration point | Current file/line anchor | Official calibration | Proposed repair |
| --- | --- | --- | --- |
| **M35 evaluation evidence** | content/authoring/m35_machine_learning_representation_workbook.v1.md:542–675 | The split contract, train-only leakage boundary, finite calibration/Brier distinction, and fit → select → fresh-evaluation trace accurately retain the limitations in [scikit-learn cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html), [probability calibration](https://scikit-learn.org/stable/modules/calibration.html), and [MIT 18.642 Lecture 23](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/resources/mit18_642_f24_lec23/). In particular, the workbook does not turn a finite Brier comparison into population calibration or a decision recommendation. | None. |
| **M36 finite-class and PAC scope** | content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md:445–528; source rationale content/source-maps/module36_statistical_learning_theory_reliable_deep_learning_source_research.md:124–146 | The fixed-finite-class, bounded-loss, IID Hoeffding/union-bound card is correctly limited. The PAC card now correctly quantifies every \(m\ge m_{\mathcal H}(\varepsilon,\delta)\), preserves the realizable target-in-class condition, and separates sample sufficiency from efficient learning—consistent with [MIT 6.080 Lecture 20](https://ocw.mit.edu/courses/6-080-great-ideas-in-theoretical-computer-science-spring-2008/838468541460ee9c1d08eb36c1921d30_lec20.pdf) and [CMU 10-806 notes](https://www.cs.cmu.edu/~avrim/ML07/lect1207.pdf). | None. |
| **M36 shift/adversarial boundary** | content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md:872–909; source rationale content/source-maps/module36_statistical_learning_theory_reliable_deep_learning_source_research.md:127 | The synthetic threat card explicitly states its set, one-bit budget, label-preservation assumption, loss, and non-claims. It correctly distinguishes a finite counterexample from operational robustness, as required by the broader shift framing in [MIT 6.7960 Lecture 17](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/mit6_7960_f24_lec17.pdf). | None. |

## Closed precision check

The formerly plausible PAC sample-count concern is already resolved in the
current candidate: its display and explanation at
content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md:504–518
use a sufficient threshold and quantify all declared \(m\) at or above it.
Do not reapply that repair.

No curriculum, contract, test, source-map, status, or release change is
proposed by this audit. This result is not evidence of institutional
equivalence, learner mastery, accessibility completion, or publication
readiness; those require their own review paths.
