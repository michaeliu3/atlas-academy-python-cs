# M35–M36 official calibration — 2026-08-03

## Scope and release boundary

This is a fresh, read-only calibration of the current private M35/M36
authoring workbooks and source maps against official/public teaching and
documentation routes checked on **2026-08-03**. It is not a learner-route,
accessibility, pilot, contract, security, or release decision. Both modules
remain authoring-only and hidden from the learner route; this note neither
changes a status nor unlocks M25/M26. Atlas retains original prose, fixtures,
derivations, and prompts; the linked material is used only for calibration and
must remain link/cite-only.

## Alignment confirmed

- **M35 evaluation evidence is appropriately bounded.** Its declared
  group/time split choices, fit-on-train-only leakage probe, calibration
  definition, equal-accuracy/different-probability contrast, and
  fit–select–fresh-evaluation trace agree with the distinctions in
  [scikit-learn's cross-validation guide](https://scikit-learn.org/stable/modules/cross_validation.html),
  [calibration guide](https://scikit-learn.org/stable/modules/calibration.html),
  and [MIT 18.642 Lecture 23](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/mit18_642_f24_lec23.pdf).
  The workbook correctly avoids treating a finite Brier comparison as proof of
  population calibration or decision quality.

- **M36's finite-class theorem route is correctly scoped.** The current
  bounded-loss, IID, fixed-finite-class Hoeffding-plus-union-bound derivation
  and its explicit non-claims are consistent with the introductory PAC
  presentations in [MIT 6.080 Lecture 20](https://ocw.mit.edu/courses/6-080-great-ideas-in-theoretical-computer-science-spring-2008/838468541460ee9c1d08eb36c1921d30_lec20.pdf)
  and [CMU 10-806 notes](https://www.cs.cmu.edu/~avrim/ML07/lect1207.pdf).
  Its deep-network discussion is also correctly limited to reading the
  conditions of a margin/spectral-complexity result rather than claiming a
  universal neural-network guarantee; compare
  [Bartlett, Foster, and Telgarsky (NeurIPS 2017)](https://proceedings.neurips.cc/paper/2017/hash/b22b257ad0519d4500539da3c8bcf4dd-Abstract.html).

- **M36's shift and adversarial card remains a synthetic boundary exercise.**
  Its explicitly declared threat set and label-preservation assumption support
  the stated finite counterexample, while its source-shift discussion does not
  claim an operational robustness certificate. This is proportionate to the
  distribution-shift framing in [MIT 6.7960 Lecture 17](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/mit6_7960_f24_lec17.pdf).

## One concrete repair: PAC sample-count quantifier

At review time, the M36 PAC card wrote its probability over exactly
\(S\sim P^{m_{\mathcal H}(\varepsilon,\delta)}\). That can describe one
chosen count, but it does not express the ordinary *sample-complexity
threshold* guarantee, and it conflicts with the companion source map's
already-correct “any \(m\ge m_{\mathcal H}(\varepsilon,\delta)\)” wording.

Applied repair: the display's sample-count portion now reads:

\[
\exists A\;\forall\varepsilon,\delta\in(0,1)\;
\exists m_{\mathcal H}(\varepsilon,\delta)\;
\forall m\ge m_{\mathcal H}(\varepsilon,\delta)\;\forall P\;\forall c\in\mathcal H:
\quad
\Pr_{S\sim P^m,\,A}\!\left[R_{P,c}(A(S))\le\varepsilon\right]\ge1-\delta.
\]

Keep the existing realizable \(c\in\mathcal H\) qualifier and the separate
computational-efficiency boundary. This is a one-card precision repair, not a
request to add VC theory, Rademacher complexity, framework training, grading,
or a release gate.

## Deliberately bounded result

No new M35 factual correction was found in this pass, and no other M36
high-value factual correction was identified. The finding does not establish
institutional equivalence, learner mastery, source-map completion, or
publication readiness; those require their own evidence paths.
