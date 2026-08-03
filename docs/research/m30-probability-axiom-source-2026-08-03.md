# M30 probability-axiom source check — 2026-08-03

**Scope.** Narrow factual calibration supporting one M30 wording correction.
It does not change M30's source map, availability, contract, or release status.

## Official source and claim

[MIT 6.436J / 15.085J *Fundamentals of Probability*, Lecture 1: Probabilistic
Models and Probability Measures](https://ocw.mit.edu/courses/6-436j-fundamentals-of-probability-fall-2018/c37dc8b61cdf6bde689a627bfa5b4942_MIT6_436JF18_lec01.pdf)
(Polyanskiy, Fall 2018), Definition 3, was rechecked **2026-08-03**. The exact
official PDF remains accessible, and the [official lecture-note index](https://ocw.mit.edu/courses/6-436j-fundamentals-of-probability-fall-2018/pages/lecture-notes/)
still lists it as Lecture 1. It defines
a measure on a measurable space \((\Omega, \mathcal F)\) as nonnegative and
countably additive: for a sequence of disjoint sets in \(\mathcal F\), the
measure of their union equals the infinite sum of their measures.  It then
defines a probability measure as such a measure with \(P(\Omega)=1\).  The
same notes define a disjoint collection by empty intersections for distinct
members, so this is precisely **countable additivity over pairwise disjoint
measurable events**.

## Existing wording and implemented clarification

M30's earlier introduction already gave a simplified, semantically sound
summary: a probability model preserves nonnegativity, total mass one, and
countable additivity over pairwise disjoint events. It did not display the
axiom's quantifier, infinite union, or summation. The implemented Atlas
clarification now names \((\Omega,\mathcal F,P)\) and displays the axiom in
original prose. It is a **notation/precision clarification**, not a correction
of a false claim, a measure-theory expansion, or a release-status change.

## Boundary and recommended repair

This axiom applies to the declared measurable events, not automatically to
every subset of an arbitrary sample space, and is stronger than finite
additivity.  It does not require M30 to teach full measure theory.

**Implemented boundary:** M30 now makes clear that the axiom applies to its
declared measurable events. It intentionally does not teach construction of a
sigma-algebra, proofs about measures, or application of the axiom outside its
stated conditions.

MIT OCW lists its materials under [CC BY-NC-SA
4.0](https://ocw.mit.edu/pages/privacy-and-terms-of-use/).  Atlas should link
and paraphrase this source, using its own prose, diagrams, prompts, and code;
do not copy lecture text, slides, exercises, figures, or third-party assets
without an asset-specific license check.
