# M31 hidden-candidate source and rendering preflight — 2026-08-03

## Scope

This is a bounded AI-assisted preflight of the frozen M31 review candidate:

- `content/modules/31_optimization_information.md`; and
- `content/source-maps/module31_optimization_information.md`.

It checks the candidate rather than the separate authoring workbook. It is not
a qualified human review, release approval, learner walkthrough, accessibility
certification, portal route, Notion-record observation, or mastery claim. M31
remains hidden and `authoring-only`.

## Claim and source check

The ledger's source routes were re-opened on 2026-08-03 where the source
browser could retrieve them. They still fit their limited calibration role:

| Candidate area | Current source observation | Preflight outcome |
| --- | --- | --- |
| formulation, feasible sets, duality | MIT OCW [6.251J](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/) and [6.253](https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/) still expose the cited course and lecture-material routes; 6.253 describes convexity, duality, and convex-optimization algorithms. | The candidate's scope is substantially narrower and uses original examples. |
| convexity, KKT, projected/stochastic methods | Stanford [EE364a](https://web.stanford.edu/class/ee364a/), [Boyd--Vandenberghe](https://web.stanford.edu/~boyd/cvxbook/), and CMU [10-725](https://stat.cmu.edu/~siva/teaching/725/) still support the intended sequence: convex structure, conditions/duality, first-order/projected methods, and stated nonconvex limits. | Session 2--5 labels the required hypotheses and does not generalize a trace into a theorem. |
| entropy, mutual information, and rate distortion | MIT OCW [6.441](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/) and Stanford [EE376A notes](https://web.stanford.edu/class/ee376a/files/scribes/lecture_notes.pdf) still expose the cited information-theory material. | The uniform-input BSC and uniform-binary Hamming rate-distortion formulas retain their source/loss/regime conditions. |
| ELBO and KL direction | The linked [Blei--Kucukelbir--McAuliffe review](https://www.cs.columbia.edu/~blei/papers/BleiKucukelbirMcAuliffe2017.pdf) still states the ELBO/KL decomposition and its variational-family boundary. | Session 6 keeps the KL direction, support condition, and finite-identity non-claims visible. |
| solver/DCP contracts | Current [SciPy `minimize`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html), [`trust-constr`](https://docs.scipy.org/doc/scipy/reference/optimize.minimize-trustconstr.html), [CVXPY DCP](https://www.cvxpy.org/tutorial/dcp/), and [CVXPY Apache-2.0 notice](https://www.cvxpy.org/version/1.2/license/index.html) remain reachable. | The candidate correctly treats API/status/DCP results as implementation evidence, not mathematical or decision certificates. |
| stochastic approximation/nonconvex scope | The [Ghadimi--Lan record](https://doi.org/10.1137/120880811) remains reachable and describes approximate-stationarity/nonconvex stochastic-programming scope. The Robbins--Monro DOI did not render in the review browser, so it remains a link-only historical citation for a future human release reviewer to resolve independently. | No M31 claim depends on a blanket convergence or global-optimality promise. |

All third-party material remains link-only. No external prose, figures,
assignments, code, data, or solutions were imported by this preflight. The
ledger's reuse boundary remains appropriate; a qualified reviewer must still
recheck exact asset notices and source versions before any release decision.

## Mathematical spot checks

- **Session 3:** for the stated affine constraint, the candidate's
  \(q(\lambda)=2\lambda-\lambda^2/2\), feasible primal witness, and
  \(\lambda=2\) certificate agree. It distinguishes direct matching-witness
  evidence from the Slater/KKT theorem route.
- **Session 4:** the exact-gradient, smooth unconstrained descent statement
  is separated from the projected trace. The quadratic rate card's
  \(\mu=1, L=100\) assumptions and \(0.99^k\) upper bound are correctly
  labelled as a bound, not an observed guarantee.
- **Session 6:** the BSC calculation, uniform-binary Hamming
  rate-distortion scope, KL support condition, and ELBO identity retain their
  stated distribution, log-base, and approximation-family assumptions.

No content correction was identified in this narrow mathematical review.

## Representative rendered visual check

The Session 2 diagram `m31-constrained-stationarity-counterexample` and the
module-route diagram each carry a stable ID, concise title, and authored prose
alternative. The focused regression renders both through the production
Mermaid sanitizer and verifies an inert SVG with `role="img"`, its matching
`aria-describedby` reference, and no active SVG content.

Run:

```text
node --test tests/rich-rendering.test.mjs
node --test tests/m31-hidden-review-candidate.test.mjs
```

This proves only source/renderer preflight behavior from the checked-in
candidate. A real designated-chat pilot, human source/reuse and rendered
accessibility review, release provenance, and learner-delivery decision remain
separate gates.
