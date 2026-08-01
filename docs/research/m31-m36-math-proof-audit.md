# M31/M36 focused math-and-proof audit

**Audit date:** 2026-08-01  
**Scope:** displayed derivations, proof ideas, counterexamples, and numerical
cards in the authoring-only M31 and M36 workbooks. This is a focused correctness
pass, not a release review, learner-route review, or university-equivalence
claim. Both modules remain authoring-only.

## Sources and method

I recomputed the displayed finite algebra and compared its conditions and
directions with the modules' source research and its official calibration
anchors: [Stanford/Boyd Convex Optimization](https://web.stanford.edu/~boyd/cvxbook/),
[MIT 6.441 Information Theory](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/),
[Blei, Kucukelbir, and McAuliffe (2017)](https://www.cs.columbia.edu/~blei/papers/BleiKucukelbirMcAuliffe2017.pdf),
and [MIT 9.520 Statistical Learning Theory](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/resources/class17/).
The official materials calibrate scope and standard; the derivations below were
checked from the stated assumptions rather than copied from them.

## Confirmed checks

### M31 — Optimization & Information

- The quadratic gradient/Hessian, the `mu = L = 2` statement in the Euclidean
  norm, and the strong-convexity uniqueness proof idea are correct with the
  workbook's declared full domain and existence qualifier.
- The `g(x,y) <= 0` Lagrangian convention, KKT witness `(1, 0, 2)`, dual
  function `q(lambda) = 2 lambda - lambda^2 / 2`, and matching primal/dual
  value `2` are correct. The Slater/convex/affine conditions are stated next to
  the certificate.
- The projected-gradient first step `(0,0) -> (1,0.5) -> (0.75,0.25)` and its
  half-space projection arithmetic are correct.
- The stochastic-gradient cached-sample counterexample, double-well derivatives
  and one-step values, binary-symmetric-channel value `1-h_2(0.1) ≈ 0.531`,
  and uniform-binary Hamming rate-distortion scope are correct as stated.
- The ELBO identity has the correct reverse-KL direction and explicitly names
  the positive-evidence, support, and integrability boundaries.

### M36 — Statistical Learning Theory & Reliable Deep-Learning Systems

- The two synthetic joint tables are normalized and independent as claimed; the
  `signal-only` predictor is correct exactly when `context = 1`, yielding
  accuracies `0.50` and `0.75` for the two named relations.
- The finite-class proof skeleton correctly applies Hoeffding to each fixed
  hypothesis and then a union bound without assuming hypotheses are
  independent. For `K=8`, `epsilon=0.25`, and `delta=0.05`, it correctly gives
  `n >= log(320)/0.125 ≈ 46.15`, so `47` is sufficient; the displayed
  failure-bound checks for `46` and `47` are also correct.
- The cloned-sample counterexample correctly shows why an IID concentration
  argument cannot be reused when all rows are copies of one Bernoulli draw.
- The floating-point order example and the fixed positive-ReLU forward/backward
  trace agree with `lib/m35-m36-signal-routing-fixture.js` and their stated
  finite-runtime boundary.
- The shift examples preserve the declared label rule and correctly distinguish
  input-mixture, conditional/label-relation, and representation shifts.

## Concrete finding: calibration needs a domain qualifier

**Location:** `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md`, Session 5, “Calibration and action remain distinct” (around lines 718–728).

The display

`Pr(Y=1 | q(X)=a) = a`

is presented for an unrestricted score value `a`. For a continuous score,
`Pr(q(X)=a)` can be zero, so this pointwise conditional expression needs a
qualification. The associated source research already contains the needed
boundary (“for applicable `a`”).

**Minimal proposed correction (do not apply as part of this audit):** change the
lead-in to “For a named population and score values for which the conditional
relation is defined (for example, discrete values with positive probability),
calibration can be expressed as …”; optionally add the more general form
`E[Y | q(X)] = q(X)` almost surely. This preserves the workbook's
non-measure-theoretic level while removing the hidden condition.

**Follow-through (2026-08-01):** the M36 authoring workbook now applies that
minimal qualifier and adds the conditional-expectation form with an explicit
population/finite-plot boundary. This correction does not change its
authoring-only status.

## Limits

- I did not audit every external theorem, library version, or unpublished
  learner artifact, nor independently peer-review a full future module.
- This note does not turn source links, algebra checks, or fixtures into release
  evidence. M31 and M36 remain authoring-only, and the finding should be
  addressed only in a deliberate later content revision.
