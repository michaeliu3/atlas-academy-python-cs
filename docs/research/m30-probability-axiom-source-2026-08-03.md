# M30 probability-axiom source check — 2026-08-03

**Scope.** Narrow factual calibration supporting one M30 wording correction.
It does not change M30's source map, availability, contract, or release status.

## Official source and claim

[MIT 6.436J / 15.085J *Fundamentals of Probability*, Lecture 1: Probabilistic
Models and Probability Measures](https://ocw.mit.edu/courses/6-436j-fundamentals-of-probability-fall-2018/c37dc8b61cdf6bde689a627bfa5b4942_MIT6_436JF18_lec01.pdf)
(Polyanskiy, Fall 2018), Definition 3, was accessed **2026-08-03**.  It defines
a measure on a measurable space \((\Omega, \mathcal F)\) as nonnegative and
countably additive: for a sequence of disjoint sets in \(\mathcal F\), the
measure of their union equals the infinite sum of their measures.  It then
defines a probability measure as such a measure with \(P(\Omega)=1\).  The
same notes define a disjoint collection by empty intersections for distinct
members, so this is precisely **countable additivity over pairwise disjoint
measurable events**.

## Boundary and recommended repair

This axiom applies to the declared measurable events, not automatically to
every subset of an arbitrary sample space, and is stronger than finite
additivity.  It does not require M30 to teach full measure theory.

**Recommended one-line M30 wording:** “A probability model assigns
probabilities to its declared (measurable) events, preserving nonnegativity,
total mass one, and **countable additivity**: for pairwise disjoint events
\(A_1,A_2,\ldots\), \(P(\bigcup_{i=1}^{\infty} A_i)=\sum_{i=1}^{\infty}P(A_i)\).”

MIT OCW lists its materials under [CC BY-NC-SA
4.0](https://ocw.mit.edu/pages/privacy-and-terms-of-use/).  Atlas should link
and paraphrase this source, using its own prose, diagrams, prompts, and code;
do not copy lecture text, slides, exercises, figures, or third-party assets
without an asset-specific license check.
