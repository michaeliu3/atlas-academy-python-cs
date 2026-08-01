# M35–M36 narrow source recheck — 2026-08-01

**Scope.** This is a small authoring calibration check, not a release review.
It rechecks only the evaluation and theorem-reading boundaries named below.
M35 and M36 remain authoring-only; nothing here changes the graph, route,
contract, learner availability, or M25/M26 gate. Atlas should link and
independently paraphrase these sources—do not copy prose, figures, proofs,
examples, assignments, data, or code without an asset-level review. This is not
a claim of university-equivalent instruction, assessment, credit, or outcomes.

## M35 — evaluation, calibration, and split design

| Narrow issue | Official/primary sources accessed 2026-08-01 | Recheck conclusion and authoring action |
| --- | --- | --- |
| Target relation before splitter | [scikit-learn cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html), including its [group](https://scikit-learn.org/stable/modules/cross_validation.html#group-k-fold) and [time-series](https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split) examples | Splitter names express a chosen relation; they do not select the unit of independence or prove a deployment match. **Action:** make the learner name target relation, unit, non-crossing field, and non-claim before seeing an implementation example. |
| Calibration versus a finite loss score | [scikit-learn probability calibration](https://scikit-learn.org/stable/modules/calibration.html) and [`brier_score_loss`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.brier_score_loss.html) | A calibration relation is population- and score-conditioned; a finite Brier comparison is a declared probabilistic-forecast loss observation. Lower Brier alone is not a population-calibration ranking. **Action:** expose the fixture's equal-accuracy (`0.75`) and distinct Brier (`0.1875`, `0.2451`) values with that boundary. |

## M36 — finite-class concentration, PAC quantifiers, and deep-bound reading

| Narrow issue | Primary source accessed 2026-08-01 | Recheck conclusion and authoring action |
| --- | --- | --- |
| Fixed-hypothesis concentration | W. Hoeffding, [“Probability Inequalities for Sums of Bounded Random Variables”](https://doi.org/10.1080/01621459.1963.10500830) (1963) | The displayed `2 exp(-2 n epsilon^2)` card is a bounded-IID fixed-hypothesis Hoeffding step, followed by a finite-class union bound. **Action:** name that route and preserve its finite-class, bounded-loss, non-neural-network boundary. |
| PAC learnability | L. Valiant, [“A Theory of the Learnable”](https://dl.acm.org/doi/10.1145/1968.1972) (1984) | A realizable PAC statement needs more than a finite-class deviation card: a target-in-class assumption, learner, probability/confidence, sample relation, and quantified conclusion. **Action:** add a compact assumed/universal/random/claimed quantifier card. |
| A modern deep-learning bound | P. Bartlett, D. Foster, and M. Telgarsky, [“Spectrally-normalized Margin Bounds for Neural Networks”](https://proceedings.neurips.cc/paper/2017/hash/b22b257ad0519d4500539da3c8bcf4dd-Abstract.html) (2017) | A deep-network bound must be read with its exact architecture, parameterization, margin/complexity terms, sampling conditions, and conclusion. **Action:** contrast it with the finite-class card as a claim-reading exercise, not a theorem transplant, architecture ranking, or reliability certificate. |

## Boundary retained

The sources calibrate terminology, assumptions, proof scope, and pedagogical
sequence. They do not establish that a future model is calibrated, a split is
deployment-valid, a neural system is PAC learnable, a bound applies to an
Atlas fixture, or a learner has completed a university course. Recheck moving
documentation, exact theorem conditions, versions, and delivery/release
evidence before any learner-ready or publication decision.
