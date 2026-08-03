# M35 source recheck — sampling-unit uncertainty and stable logit BCE

**Status:** authoring research only. This note supports two small M35 teaching
cards; it does not by itself publish M35 or make a release-quality claim. All
links below were accessed 2026-08-03.

## Scope and card targets

1. **Uncertainty inherits its sampling unit.** A learner declares whether the
   atomic unit is a row, entity, or time block before interpreting an error
   estimate or resampling result.
2. **Binary cross-entropy (BCE) should be computed from logits stably.** A
   learner reads the algebra and predicts why a naive sigmoid-then-log
   implementation can fail at extreme finite-precision inputs.

## Evidence and bounded teaching conclusions

| Proposed card | Source and role | Supported conclusion | Boundary |
| --- | --- | --- | --- |
| Sampling-unit uncertainty | [Stanford STATS 202 bootstrap note](https://web.stanford.edu/class/stats202/notes/Resampling/Bootstrap.html) — official course note on estimating a standard error from variation across resamples of observed units. | A small synthetic example may estimate variation by resampling the explicitly declared independent units. | This is not a universal coverage guarantee or a deployment interval. Its interpretation depends on the stated sampling model and the available independent units. |
| Sampling-unit uncertainty | [scikit-learn cross-validation guide](https://scikit-learn.org/stable/modules/cross_validation.html) — official documentation on group- and time-aware validation. | Rows from the same entity or an autocorrelated time process cannot silently be treated as independent held-out observations; the split must respect the dependency relation. | The documentation motivates the split boundary; it does not choose a valid uncertainty method for every data-generating process. |
| Sampling-unit uncertainty | [UC Davis *Bootstrap methods* lecture slides](https://cameron.econ.ucdavis.edu/slides/bootstrap_2022.pdf) — university course material that distinguishes independent, clustered, and serially correlated resampling. | A teaching card may contrast ordinary independent-unit resampling with resampling whole clusters or consecutive blocks when those relationships define the data. | Clusters and blocks are examples, not a universal recipe; the dependence structure still has to be stated and justified. |
| Sampling-unit uncertainty | [Künsch, *The Jackknife and the Bootstrap for General Stationary Observations*](https://doi.org/10.1214/aos/1176347265) — primary statistical research on resampling under stationary dependence. | Dependence requires a separately specified treatment rather than ordinary row-level resampling by default. | Do not infer a theorem, block length, or valid interval for a particular learner dataset without its assumptions. |
| Stable BCE from logits | [Stanford CS229 backpropagation notes](https://cs229.stanford.edu/notes-spring2019/backprop.pdf) — official course note giving binary negative log likelihood. | Start from the binary likelihood/loss definition before discussing an implementation rewrite. | The loss identity alone does not establish calibration, generalization, or a suitable model. |
| Stable BCE from logits | [TensorFlow `sigmoid_cross_entropy_with_logits` documentation](https://www.tensorflow.org/api_docs/python/tf/nn/sigmoid_cross_entropy_with_logits) — official implementation documentation that derives an overflow-resistant logit form. | For logit `z` and label `y`, a code-reading card may use the equivalent stable form `max(z, 0) - z*y + log1p(exp(-abs(z)))`, then ask what happens near very large positive or negative logits. | This is a finite-precision/numerical-stability lesson, not evidence that a classifier is well calibrated or accurately evaluated. |
| Stable BCE from logits | [PyTorch `BCEWithLogitsLoss` documentation](https://docs.pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html) — official API documentation describing the fused, more stable computation. | Learners can compare a fused logit-space loss with a separate sigmoid-plus-log calculation. | Keep the card library-agnostic; do not imply that calling one API removes data, objective, or evaluation risks. |

## Minimal card designs supported by the evidence

### 1. Uncertainty inherits its sampling unit — supported

Use one short worked setting:

1. Name the reported loss and the atomic unit before displaying an average.
2. Under an explicit independent-unit assumption, resample those units to show
   how an estimated quantity varies.
3. Change exactly one condition: several rows belong to one customer, machine,
   patient, or time block. Ask the learner to name the invalid assumption.
4. Require a group/time-respecting evaluation plan and a separately justified
   dependence-aware uncertainty plan, or require the learner to withdraw the
   earlier uncertainty interpretation.

The card should **not** promise valid real-world intervals, choose a universal
block scheme, or conflate many rows with many independent observations.

### 2. Stable BCE from logits — supported

Use one code-reading/prediction card:

1. Connect binary negative log likelihood to a logit `z` and label `y`.
2. Ask the learner to predict the finite-precision behavior of first computing
   a sigmoid and then applying logarithms for `z = 1000` and `z = -1000`.
3. Compare that pathway with the stable logit-space expression above, including
   the purpose of `max`, `abs(z)`, and a `log1p`-style operation.
4. Ask for the numerical boundary in one sentence: a stable loss calculation
   is implementation evidence, not evidence of sound data splitting,
   calibration, or generalization.

## Reuse and provenance boundary

These sources are linked for learner-facing attribution and independently
paraphrased here. Do not copy their prose, code, figures, or exercises into
Atlas. Verify any future reuse against the source owner's current terms; this
note authorizes links and original explanations only. The source links above
are stable official-course, official-documentation, or DOI routes, and should
be retained in the M35 source ledger if either card is authored.

## Decision

Both cards are **supported**, provided they remain narrow, assumption-explicit,
and labelled as numerical/statistical reasoning rather than proof of
deployment performance.
