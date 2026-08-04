# M31/M36 official wording calibration — 2026-08-03

**Scope.** Narrow factual calibration for two proposed authoring corrections.
It changes no learner route, availability, contract, release status, or mastery
claim. M31 and M36 remain authoring-only.

## Official sources and claim map

| Atlas claim to calibrate | Official source, accessed **2026-08-03** | What the source establishes |
| --- | --- | --- |
| M31 must define conditional entropy before using \(H(Y\mid X)\), and distinguish mutual information from a bare numerical formula. | Stanford [EE 376A *Information Theory* course notes](https://web.stanford.edu/class/ee376a/files/scribes/lecture_notes.pdf), Definition 9 (conditional entropy) and Definition 11 (mutual information). | For discrete variables, conditional entropy is an average over the declared joint distribution, and \(I(X;Y)=H(Y)-H(Y\mid X)\). |
| M31's binary-symmetric-channel (BSC) card needs the uniform-input step made visible. | Stanford EE 376A notes, Example 35 (BSC). Independent MIT corroboration: [MIT 6.441 Chapter 1](https://www.ocw.mit.edu/courses/6-441-information-theory-spring-2016/2243edffb30f57181ed97dcb77691580_MIT6_441S16_chapter_1.pdf) and [Chapter 2](https://www.ocw.mit.edu/courses/6-441-information-theory-spring-2016/184197ca5d5418da2415d37e929860b9_MIT6_441S16_chapter_2.pdf). | With a BSC \(Y=X\oplus N\), \(N\sim\operatorname{Bernoulli}(q)\), the notes derive \(I(X;Y)=H(Y)-h_2(q)\leq1-h_2(q)\); uniform binary input makes the output uniform and achieves equality. MIT supplies the same conditional-entropy and mutual-information foundations. |
| M36's companion must rehearse the finite-class/PAC/margin material actually taught, rather than regret or lower-bound material. | Stanford [CS229T/STATS231 *Statistical Learning Theory* notes](https://web.stanford.edu/class/cs229t/2016/notes.pdf), pp. 49–63, 84–86, and 100. CMU [10-701 Fall 2016 learning-theory schedule](https://www.cs.cmu.edu/~mgormley/courses/10701-f16/schedule.html) independently lists realizable-versus-agnostic learning, finite-class PAC, and sample complexity. | The Stanford notes separate realizable finite classes, finite-class concentration/union-bound reasoning, PAC conditions, and margin-sensitive bounds. Those are the right anchors for M36's scoped theory discussion; they do not make a deployment, regret, or lower-bound claim. |

## Recommended M31 teaching wording

**Insert immediately before the current BSC calculation:**

> For discrete variables with a declared joint distribution, conditional entropy
> is the average uncertainty left in \(Y\) after seeing \(X\):
> \(H(Y\mid X)=\sum_x P(X=x)H(Y\mid X=x)\). Mutual information is the
> resulting reduction: \(I(X;Y)=H(Y)-H(Y\mid X)\). Use base-2 logarithms
> when the unit is bits.
>
> Now take one BSC use: \(X\sim\operatorname{Bernoulli}(1/2)\),
> \(N\sim\operatorname{Bernoulli}(q)\), \(X\perp N\),
> \(Y=X\oplus N\), and \(0\le q\le1/2\). Then
> \(\Pr(Y=1)=\tfrac12(1-q)+\tfrac12q=\tfrac12\), so \(H(Y)=1\). Given
> \(X=x\), XOR by the known bit is a relabeling of \(N\), so
> \(H(Y\mid X=x)=H(N)=h_2(q)\); averaging gives
> \(H(Y\mid X)=h_2(q)\). Therefore
> \(I(X;Y)=1-h_2(q)\) bits per use.
>
> The last equality is **not** the generic mutual information for a biased
> input: then \(H(Y)\) need not be one. For the symmetric BSC, the uniform
> input achieves the maximum, so this value is also its capacity under the
> stated channel model.

This introduces the objects before their use, exposes why the output is
uniform, and keeps the later IID/memoryless rate-distortion discussion
separate from the one-use mutual-information calculation.

## Recommended M36 companion wording

Replace the M36 companion's two drifting fields with exactly:

```json
"centralModel": "a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits",
"traceOrDerivation": "reconstruct a finite-class Hoeffding-plus-union-bound proof idea, PAC quantifier order, or margin-bound scope and its non-deployment consequence"
```

This matches the candidate's finite-class, bounded-loss, IID proof skeleton;
its realizable-PAC quantifier card; and its deliberately limited margin-bound
reading. It intentionally asks for neither regret nor lower-bound reasoning.

## Reuse boundary

Use the linked institutional materials to calibrate and link, not to copy.
Atlas should keep its own prose, derivations, diagrams, code, prompts, and
examples. MIT OCW displays its own license terms; Stanford and CMU material
should be treated as link-only unless an individual asset grants reuse. This
note paraphrases the cited sources and supplies original recommended wording.
