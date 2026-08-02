# Module 36 — Statistical Learning Theory & Reliable Deep-Learning Systems

**Arc VII — Formal limits, classical AI, and learning systems**

> **Authoring-only private study pack.** This draft may be used only for
> instructor-led study in the designated Codex chats; it is not yet a portal
> learner route. M36 remains hidden until its canonical source map, structured
> module contract, accessibility review, teaching-model evidence, release
> record, and prerequisite evidence are complete. Private study does not unlock
> M25 or M26, grant Core credit, certify a learning system, prove learner
> mastery, or record a live/Notion session.

**Bridge.** M35 made a trained model claim traceable through representation,
data, objective, execution, evaluation, shift, and authority. M36 adds the
formal and systems discipline needed to read the next layer of claims:

> **Which mathematical implication, finite experiment, systems observation,
> and human-control boundary are actually present—and which are merely being
> smuggled in by the phrase “the model generalizes”?**

**Primary outcome.** You can reconstruct a learning claim from first
principles: identify the population relation, loss, representation, hypothesis
class, sample and regularity assumptions; separate empirical-risk,
approximation, estimation, and optimization evidence; read a capacity or
learnability statement with its quantifiers; inspect an experiment’s numerical
and environment boundary; and design a bounded shift/monitoring response with
a human owner.

This is a rigorous foundation for reading theory and reliable-learning claims,
not a claim of mastery of measure-theoretic probability, full PAC/VC proofs,
all modern deep-learning theory, verified training systems, robustness
certification, or permission to deploy a model. The module stays deliberately
synthetic and evidence-bounded.

---

## How to study this module

### The working invariant

> **A theorem is a quantified implication under assumptions; an experiment is
> a finite observation under a protocol; a reliable-system claim additionally
> needs evidence about future input relations, failure detection, response,
> and accountable human authority. None substitutes for the others.**

Use this theory-to-system trace:

~~~text
target + decision boundary
→ population / loss / representation / hypothesis-class assumptions
→ empirical objective + optimization trace
→ theorem or limit with quantifiers and non-conclusion
→ finite experiment with data/numerical/environment identity
→ shift, monitoring, intervention, and human authority boundary
~~~

### Evidence labels

| Label | What it can establish | What it does not establish |
| --- | --- | --- |
| **[DEFINITION]** | Population risk, empirical risk, a hypothesis class, loss, margin, calibration relation, or a reproduction protocol under stated notation. | That a chosen population/loss/representation captures the real question. |
| **[THEOREM / PROOF IDEA]** | A conditional implication with explicit variables, quantifiers, regularity and sampling assumptions. | That a finite system meets the assumptions, is efficient, accurate enough, or safe to use. |
| **[FINITE EXPERIMENT]** | An observation under a named data generator, code revision, environment, precision, split, seed, and metric. | A population law, causal explanation, robustness guarantee, or deployment approval. |
| **[SYSTEM CONTRACT]** | A pinned framework/backend/device behavior or a bounded deterministic/reproduction setting. | Numerical correctness, scientific validity, or cross-platform identity unless directly tested. |
| **[GOVERNANCE / AUTHORITY]** | Who may inspect, pause, escalate, revise, or decline a use. | A mathematical or statistical conclusion. |

### Claim/source trail

The compact labels below point to the instructor-facing research ledger and
the learner-facing links at the end. They make the route behind a claim
inspectable; they do not make a cited theorem or paper evidence about the
synthetic learning system here.

| Session | Claims to trace | Research route |
| --- | --- | --- |
| 1 — learning claims | `M36-C01` | `S36-01–S36-03`, `S36-07–S36-09` |
| 2 — optimization and gaps | `M36-C02`, `M36-C05` | `S36-04–S36-06` |
| 3 — theorem scope | `M36-C04–C05` | `S36-01–S36-05`, `S36-14–S36-17` |
| 4 — numerical evidence | `M36-C03`, `M36-C07` | `S36-10–S36-11` |
| 5 — shift and control | `M36-C06`, `M36-C08–C09` | `S36-07–S36-12` |
| 6 — synthesis dossier | `M36-C01–C09` | `S36-01–S36-17` |

### One reliable-learning evidence map

Keep this map across every session:

~~~text
Target relation and prohibited/consequential-use boundary:
Representation, model class, loss, and comparator:
Sample/split, independence or dependence, and selection assumptions:
Empirical objective / algorithm / stopping and observed trace:
Approximation, estimation, optimization, and operational questions:
Theorem/limit statement: quantifiers, assumptions, conclusion, non-claim:
Data/source/environment/precision/RNG/repeat protocol:
Shift hypothesis, observable, threshold, false alarm/miss trade-off:
Human owner, intervention, escalation, appeal, and stop boundary:
Strongest supported claim / remaining uncertainty / M25 handoff:
~~~

---

## 1. Position in the knowledge system

~~~mermaid
%% atlas-diagram-id: m36-theory-system-map
%% atlas-diagram-title: M36 connects mathematical claims to learning-system evidence
%% atlas-diagram-alt: M29 contributes regularity and limiting statements; M31 contributes optimization evidence; M32 contributes execution and reproducibility; M33 contributes formal quantifiers and limits; M35 contributes representation, evaluation, shift, and authority. All feed M36. M36 creates a bounded reliable-learning evidence packet that is handed to preview-only M25, then eventually M26.
flowchart LR
  M29["M29: domains, limits, regularity"] --> M36["M36: theory-to-system evidence"]
  M31["M31: objective + optimization"] --> M36
  M32["M32: systems + numerical evidence"] --> M36
  M33["M33: quantifiers + limits"] --> M36
  M35["M35: ML evaluation + authority"] --> M36
  M36 --> M25["M25: gated synthesis"]
  M25 --> M26["M26: gated capstone defense"]
~~~

**Text equivalent:** M36 does not turn a theorem into a release decision. It
uses M29 to keep limits scoped, M31 to separate algorithmic from statistical
evidence, M32 to keep execution visible, M33 to read quantified claims, and
M35 to retain representation/evaluation/authority boundaries. Its forward
packet is for later synthesis only after the graph’s separate gates are met.

### Entry retrieval

Before continuing, answer briefly.

1. Why is a finite average loss different from a population expectation?
2. Why does a converged optimizer not automatically establish generalization?
3. What makes a statement like “with high probability” incomplete?
4. Name one way two runs of unchanged source code can differ.
5. Why does a shift monitor need both a response owner and a stop condition?

Retrieve M29 if regularity/limit language is fragile; M31 for objective versus
generalization; M33 for quantifiers; M32 for execution variables; and M35 for
evaluation, shift, and authority.

---

## 2. One synthetic story: the bounded relay learner

Reuse M35’s fictional signal-routing setting. It has two binary fields
`signal` and `context` and an original synthetic label rule. No people, real
decisions, external data, models, or services are involved. The goal is not to
make a good classifier; it is to practice reading the evidence chain.

Let `Z=(X,Y)` denote one example under a named synthetic relation `P`, let `h`
be a hypothesis, and let `ell(h,Z)` be a stated loss. Define:

\[
R_P(h)=\mathbb E_{Z\sim P}[\ell(h,Z)],
\qquad
\widehat R_S(h)=\frac{1}{n}\sum_{i=1}^n\ell(h,z_i).
\]

The first is a population-risk definition for a declared `P`; the second is a
finite calculation on the named sample `S`. Writing the symbols does not make
the rows IID, select a valid loss, make the synthetic relation realistic, or
identify deployment behavior.

### Name \(P\) fully before calculating \(R_P(h)\)

The relay card names two **fully specified** synthetic joint relations. In
both, `signal` and `context` are independent binary fields and
`label = Number(signal == context)`; only the declared context marginal
changes:

| `signal` | `context` | \(P_{\mathrm{source}}\) | \(P_{\mathrm{context-heavy}}\) |
| --- | --- | --- | --- |
| 0 | 0 | \(0.25\) | \(0.125\) |
| 0 | 1 | \(0.25\) | \(0.375\) |
| 1 | 0 | \(0.25\) | \(0.125\) |
| 1 | 1 | \(0.25\) | \(0.375\) |

For the fixed `signal-only` predictor \(h(s,c)=s\), its prediction matches
the declared label exactly when \(c=1\). Therefore its expected accuracy is
\(P(C=1)\): \(0.50\) in the source relation and \(0.75\) in the
context-heavy relation. That derivation is specific to this predictor and
label rule; a marginal alone would not specify the risk of an arbitrary
predictor or a general learning theorem.

Before calling `m36LearningClaimProbe()`, verify that each joint table sums to
one, recover both marginals, and derive the fixed predictor's correctness
event. A declared relation is still not evidence that a finite sample was IID
from it.

~~~mermaid
%% atlas-diagram-id: m36-learning-claim-chain
%% atlas-diagram-title: A learning claim moves through distinct evidence layers
%% atlas-diagram-alt: A declared target relation and assumptions lead to sample data, an empirical objective and algorithm, a scoped theorem or limit, and a finite experiment. These inform shift and monitoring evidence, then a human-controlled bounded action. Each arrow represents an additional evidence layer; none can be skipped.
flowchart TD
  P["target relation + assumptions"] --> S["finite sample S"]
  S --> ER["empirical risk / objective"]
  ER --> O["algorithm + numerical trace"]
  P --> T["theorem / capacity / limit scope"]
  O --> E["finite experiment"]
  T --> E
  E --> M["shift + monitor + response plan"]
  M --> H["human-controlled bounded action"]
~~~

**Text equivalent:** Data and the empirical objective produce a finite
training trace. A theorem links objects only under its own assumptions. A
finite experiment joins those layers under an environment protocol. A reliable
claim still needs future-shift and response evidence before a human considers a
bounded action.

---

## Session 1 — Risk, representation, data, and assumption scope

### Core question

**What must be true before an empirical result can speak about a larger
relation?**

Before reading a bound, complete an assumption-scope sheet:

| Field | Question that must be answerable |
| --- | --- |
| Target relation | Which synthetic population/time/process does `P` name? |
| Unit and loss | What is one example, and what error does `ell` count or weight? |
| Representation | Which information reaches `h`; which collision remains possible? |
| Hypothesis class | Which predictors are being compared, and which are excluded? |
| Sample relation | IID, dependent, time-ordered, selected, or unknown? |
| Procedure | How were split, preprocessing, tuning, and stopping chosen? |
| Regularity / limit | Which variable tends where, under which domain and conditions? |
| Non-claim | Which real population, decision, or system property remains unknown? |

### Same empirical risk, different story

Imagine two synthetic histories in which a model attains zero training error.
In one, the held-out rows follow the same named rule and representation retains
the relevant bit. In the other, evaluation rows shift the context relation or
the representation discarded it. The identical training statement
`hat R_S(h)=0` does not identify which world you have.

### Prediction before reveal

Suppose somebody says: “The loss is smooth, so the entire learning pipeline is
well behaved.” Before revealing the repair, list two missing layers.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** differentiability may be a property of a declared loss on a
specified domain. It does not establish smooth data collection, correct labels,
stable numerical execution, a good objective, a valid population relation, or
the behavior of a discontinuous decision threshold.

</details>

### Code-reading task

```python
def empirical_zero_one_risk(h, sample):
    mistakes = sum(h(x) != y for x, y in sample)
    return mistakes / len(sample)

def target_risk_symbolically():
    return "E_{Z ~ P}[loss(h, Z)]"
```

The first function computes a finite statistic for `sample`. The second only
names an expectation. Explain why neither function establishes an IID
assumption, a correct sampling frame, or a valid decision threshold.

### Bounded reference fixture — finite record versus named relation

Read `lib/m35-m36-signal-routing-fixture.js` before making a learning claim.
Before calling `m36LearningClaimProbe()`, predict the empirical zero-one risk
of `always-one` on its four-row sample and the `signal-only` accuracy under
each named synthetic relation. After inspection, identify which numbers
describe the finite sample and which describe only the two declared relations.

This is a scope-reading card, not IID evidence, a PAC/VC calculation, an
efficient learning algorithm, or a deployment claim.

### Output: Assumption-Scope Sheet

For the relay learner, fill the table above and attach one tiny counterexample:
a representation collision, a selected/time-ordered sample, a mismatched loss,
or a shift. Finish with:

> “The implication I would need is ___ under ___; this finite record alone
> does not establish ___.”

### Output: Initial Reliable-Learning Evidence Map

Create the first version of the evidence map now: name the target relation,
representation, loss, hypothesis-class boundary, sample relation, one needed
assumption, one finite observation, and one non-claim. Session 5 will extend
this same map with monitoring and human-control fields rather than replacing
its initial scope.

---

## Session 2 — Optimization, estimation, and generalization are different gaps

### Core question

**Which question did a loss trace answer, and which questions remain open?**

Instead of treating “the gap” as one mysterious number, keep a ledger of
distinct evidence questions:

| Question | Comparator / object | Evidence that can help | What it cannot settle alone |
| --- | --- | --- | --- |
| Representation / approximation | best member of declared class versus the target task | class design, collision analysis, conditional theory | whether the target/loss/class is appropriate |
| Estimation / generalization | empirical behavior versus named population relation | split, assumptions, uncertainty, scoped bound | future shift, authority, unmeasured selection |
| Optimization | algorithm output versus a finite objective/comparator | trace, residual, gradient check, termination rule | population risk or usefulness |
| Operational reliability | observed system versus future conditions | shift probes, monitoring, response policy | all future failures or legitimacy |

This is an explanation ledger, not a universal exact identity. The comparator,
loss, class, data relation, and algorithm must stay visible.

### A loss-only counterexample

An optimizer can find a parameter with low `hat R_S` while:

- the representation hides a relevant future condition;
- the training sample is unrepresentative or leaked;
- the loss gives no cost to a critical error;
- a finite validation result was selected after many trials; or
- the execution trace differs on a new dtype/device/data order.

None of these deny optimization evidence. They show why it is one layer.

### Prediction before reveal

Read: “Gradient norm is near zero after 100 steps.” Predict which ledger row
this informs most directly, and name two rows it leaves unresolved.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** it is primarily an algorithm/finite-objective observation, subject
to the trace’s numerical and stopping details. It does not by itself answer
estimation/generalization or operational reliability.

</details>

### Code-reading task: a trace is not an argument by itself

```text
objective: binary loss + 0.01 * weight penalty
seed: 17
dtype: float32
steps: 100
training loss: 0.31 -> 0.08
held-out loss: 0.29 -> 0.21
```

Annotate each line as definition/configuration/finite observation/assumption.
Then write two alternative explanations for the held-out change and one
evidence request that would distinguish them.

### Output: Optimization–Generalization Gap Ledger

Create a ledger with the four rows above. For each, name the object, observed
evidence, assumptions, an unresolved alternative explanation, and a next
probe. Include an explicit sentence beginning:

> “A decreasing objective does not establish …”

---

## Session 3 — Capacity, learnability, computational limits, and theorem scope

### Core question

**How do you read a learning theorem without turning it into a slogan?**

A generic uniform-deviation style statement has the shape

\[
\Pr\!\left(
\sup_{h\in\mathcal H}\left|R_P(h)-\widehat R_S(h)\right|
\leq \varepsilon
\right)\geq 1-\delta,
\]

but the useful work is not memorizing the display. Ask:

1. What is the example distribution `P`, loss, and hypothesis class `H`?
2. What sampling and complexity conditions make the implication available?
3. Which variables are quantified: sample size, accuracy `epsilon`, confidence
   `delta`, probability, class complexity, resources?
4. Is this a statement about existence, an algorithm, a finite experiment, or
   a deployment choice?
5. What explicit non-conclusion must remain beside it?

The display is an intentionally generic shape, not a claim that its condition
holds for the relay learner or an arbitrary neural network.

### Notation strip

Keep the theorem objects separate before reading the proof:

\[
Z=(X,Y),\qquad
R_P(h)=\mathbb E_{Z\sim P}[\ell(h,Z)],\qquad
\widehat R_S(h)=\frac{1}{n}\sum_{i=1}^{n}\ell(h,Z_i).
\]

Here \(P\) is the named population relation, \(S=(Z_1,\ldots,Z_n)\) is the
sample, and \(\ell\) is the declared loss. Changing any of those objects
changes the claim that follows.

### Finite-class proof skeleton — the union-bound step has a home

Here is one deliberately narrow route to the displayed shape. Let
\(\mathcal H=\{h_1,\ldots,h_K\}\) be **finite**, let
\(\ell(h,Z)\in[0,1]\), and let \(Z_1,\ldots,Z_n\) be IID draws from a named
distribution \(P\). For one fixed \(h\), set
\(L_i=\ell(h,Z_i)\). The \(L_i\) are IID and lie in \([0,1]\), so
Hoeffding's inequality gives

\[
\Pr\!\left(\left|R_P(h)-\widehat R_S(h)\right|>\varepsilon\right)
\leq 2e^{-2n\varepsilon^2}.
\]

This is specifically a **finite-class, bounded-loss, Hoeffding-plus-union-bound
route**. It is not a generic justification for the earlier display, a VC proof,
or a bound for an arbitrary neural network.

Before revealing the rest, decide which independence is doing the work:
independence between the candidate hypotheses, or the IID relation among the
sampled examples. Also predict whether the next bound grows linearly or
logarithmically in \(K\) after solving for \(n\).

<details>
<summary>Reveal the finite-class proof skeleton after making both predictions.</summary>

1. Apply the fixed-\(h\) concentration statement to every member of the
   finite class.
2. The event “some \(h\) deviates by more than \(\varepsilon\)” is a union of
   those bad events. The union bound needs **no independence between
   hypotheses**:

   \[
   \Pr\!\left(\exists h\in\mathcal H:
   |R_P(h)-\widehat R_S(h)|>\varepsilon\right)
   \leq 2K e^{-2n\varepsilon^2}.
   \]

3. Require \(2K e^{-2n\varepsilon^2}\leq\delta\). One sufficient condition is

   \[
   n\geq\frac{\log(2K/\delta)}{2\varepsilon^2}.
   \]

4. Taking complements gives a simultaneous deviation statement with
   probability at least \(1-\delta\). The \(K\) contribution is logarithmic
   **in this finite-class route**; the \(1/\varepsilon^2\) term is still
   consequential.

</details>

### Quantifier card — uniform deviation is not yet PAC learnability

The finite-class card controls a deviation event for a named class. A
**distribution-free realizable PAC** claim adds a target-in-class assumption,
a learner algorithm \(A\), and a sample regime selected before a particular
distribution or target is named. With \(R_{P,c}(h)=\Pr_{X\sim P}[h(X)\ne
c(X)]\), the relevant order is

\[
\exists A\;\forall\varepsilon,\delta\in(0,1)\;\exists m_{\mathcal H}(\varepsilon,\delta)\;
\forall P\;\forall c\in\mathcal H:\quad
\Pr_{S\sim P^{m_{\mathcal H}(\varepsilon,\delta)},\,A}
\!\left[R_{P,c}(A(S))\le\varepsilon\right]\ge1-\delta.
\]

Here the IID inputs in \(S\) are labelled by the realizable target \(c\).
The sufficient \(m_{\mathcal H}(\varepsilon,\delta)\) may depend on the
fixed class and \(\varepsilon,\delta\), but not on the later universally
quantified \(P\) or \(c\). Computational efficiency is an additional claim:
it needs a separately stated polynomial sample/runtime bound under named
encoding and size conventions.

Before reading that as a slogan, mark the roles:

| Role | Objects to name |
| --- | --- |
| **Assumed** | target concept in \(\mathcal H\), loss/error convention, eligible distributions, and IID sample relation |
| **Existential** | learner \(A\) and sufficient \(m_{\mathcal H}(\varepsilon,\delta)\), selected before \(P\) and \(c\) |
| **Universal** | \(\varepsilon\), \(\delta\), each eligible \(P\), and each target \(c\in\mathcal H\) |
| **Random** | sampled examples and any declared randomness in \(A\) |
| **Claimed** | the stated error/confidence conclusion for \(A\), not an efficiency claim unless one is separately proved |

**Prediction.** Which row is missing if someone says only, “the class is
finite”? Then state the boundary: this finite-card derivation does not by
itself prove PAC learnability of a neural system, its training algorithm, or
its future data relation.

### Claim-reading comparison — two routes, different evidence

| Reading card | Assumptions/evidence to keep visible | What the result can support | Explicit non-claim |
| --- | --- | --- | --- |
| Finite-class Hoeffding route | fixed finite \(\mathcal H\), bounded loss, named IID relation, and declared \(K,\varepsilon,\delta,n\) | A simultaneous finite-class deviation statement under those assumptions | A deep-network, VC, deployment, or data-quality guarantee |
| [Bartlett–Foster–Telgarsky spectral-normalized margin-bound example](https://proceedings.neurips.cc/paper/2017/hash/b22b257ad0519d4500539da3c8bcf4dd-Abstract.html) | Exact network/parameterization, margin and spectral-complexity terms, sample relation, theorem conditions, and any separate empirical study | A scoped research-bound reading exercise after checking the exact theorem | An architecture ranking, a universal explanation of generalization, or a reliability certificate |

The point is not to choose the more impressive theorem name. It is to ask which
objects, quantifiers, and conclusion are actually present before transferring a
claim to a system.

### One numerical theorem card — calculation is not a deployment claim

Keep every assumption fixed just long enough to calculate one consequence.
For a finite class with \(K=8\), bounded IID loss, \(\varepsilon=0.25\), and
\(\delta=0.05\), the displayed sufficient condition becomes

\[
n\geq\frac{\log(2K/\delta)}{2\varepsilon^2}
=\frac{\log(320)}{0.125}\approx 46.15.
\]

Thus \(n=47\) is a sufficient **integer** sample size for this particular
union-bound route. It is not an exact minimum, a statement that a real data
set is IID, or a statement about a deep network.

**Predict before calculating.** Does \(n=46\) still make the displayed upper
bound at most \(0.05\)? What would doubling \(K\) change: the assumptions, the
numerical sufficient bound, or the truth of every deployment claim?

<details>
<summary>Reveal the numeric scope check after making both predictions.</summary>

At \(n=46\), \(2K e^{-2n\varepsilon^2}\approx0.0509>0.05\); at \(n=47\), it
is approximately \(0.0449\leq0.05\). Doubling \(K\) changes the sufficient
bound through the same formula, but it does not establish the formula's
sampling assumptions or make an external system reliable.

</details>

Before calling `m36FiniteClassSampleBoundCard()`, compute the ceiling and both
failure-bound values. Inspect its `assumptions`, `derivation`, and
`truthBoundary`, then name one assumption the arithmetic cannot check.

### Fix the candidate protocol before reading a theorem as evaluation evidence

The finite-class route controls a named finite candidate class under its stated
sampling assumptions. It does not give a free pass to repeatedly ask an AI to
generate a new feature, architecture, seed, stopping rule, or threshold after
reading the labels of the same evaluation split.

**Predict before revealing.** A learner tries ten generated pipelines, keeps
the one with the best score on the only held-out split, then cites the
finite-class display. Which object has changed: only a selected hypothesis, or
the evidence-producing selection procedure too?

<details>
<summary>Reveal the fixed-versus-adaptive repair after predicting.</summary>

The selection procedure has changed too. A fixed finite candidate set may be
part of a stated analysis, but adaptive reuse of validation/test labels needs
selection-aware accounting or a fresh, predeclared evaluation relation. Keep
the candidate-generation rule, every look, selection metric, and stop rule;
do not silently rename a reused selection split as an untouched test.

</details>

This does not forbid model selection. It makes the evidence boundary visible:
choose with training/validation evidence, preserve the protocol, and reserve a
fresh evaluation relation for the later claim you want to make.

The IID condition is not decorative. If every “sample” is a cloned copy of
one latent Bernoulli draw \(Z\), and a fixed loss equals \(Z\) with
\(\mathbb E[Z]=1/2\), then \(\widehat R_S=Z\) is still either `0` or `1` no
matter how large \(n\) becomes. Its deviation from \(R_P=1/2\) does not
concentrate in the IID way. This does not say no dependent-data theorem can
exist; it says this proof skeleton cannot be used without replacement
conditions.

`m36LearningClaimProbe()` deliberately supplies a tiny finite class but **not
IID evidence**. Treat it as notation and scope practice, not as numbers to
substitute into a PAC/VC formula. A finite-class union bound is not yet a
deep-network bound, a learner implementation, a data-quality guarantee, or a
deployment decision.

### A small hypothesis-class probe

Let `H` contain only two predictors for a binary toy input: `always_zero` and
`always_one`. A finite sample can make one look better. That does not by itself
give a theorem; but it makes visible what a capacity statement must name: the
class, sample relation, loss, population, confidence, and deviation target.

Now expand `H` to include a lookup table that can memorize a finite set of
identifiers. Predict what becomes dangerous about using training loss as a
general explanation.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** fitting a finite sample may become easy while the relationship to a
population risk remains an additional question. This does not make empirical
work meaningless; it makes scope indispensable.

</details>

### Theorem-card repair

An AI writes: “VC theory proves that enough data makes the neural system
reliable.” Find the missing pieces:

- distribution/sampling relation;
- class and complexity measure;
- loss and target error/confidence quantities;
- sample-size regime and, if relevant, construction/runtime assumptions;
- theory-to-implementation mapping; and
- reliability, shift, monitoring, and authority non-claims.

### Output: Limit-and-Nonclaim Card

Choose one learning-theoretic claim to study. Write it in your own words with:

- definitions and all visible quantifiers;
- assumptions and proof idea at the appropriate level;
- practical interpretation for a bounded synthetic setting;
- one smallest counterexample or edge case when an assumption is removed; and
- a statement beginning **“This does not decide …”**

**Transfer.** Ask an AI agent for a theorem behind a model suggestion. Require
it to produce a claim card rather than a theorem name: it must state its
distribution, class, loss, sample/resource condition, conclusion, and
non-conclusion before you accept the citation as useful.

---

## Session 4 — Numerical, systems, and reproducibility evidence

### Core question

**What did two runs actually hold fixed?**

Mathematical notation commonly treats addition as associative. Finite
floating-point execution may not. For example, with sufficiently disparate
magnitudes, `(a + b) + c` and `a + (b + c)` can round differently. Parallel
reductions, backend kernels, device choice, dtype, compiler/library versions,
data order, random state, worker scheduling, and unsupported deterministic
operations can all change a finite trace without changing source text.

### Prediction before reveal

Two runs use the same Python file and one seed but different device/back-end
versions. Predict one quantity that might differ and one claim that remains
safe even if the difference is within a recorded tolerance.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** loss, gradient, timing, final parameters, or ordering can differ.
The safe claim is narrow: these pinned environments produced observations
within a stated protocol/tolerance. It is not cross-platform identity,
numerical correctness, or scientific validity.

</details>

### Code-reading task

```python
left = (1e16 + -1e16) + 1.0
right = 1e16 + (-1e16 + 1.0)
```

Explain why a particular runtime’s values are a finite representation fact,
not a failure of algebra. Then identify why an ML reduction over many values
may require an environment/reduction-order record.

### Bounded reference fixture — numerical order is an observation

Before calling `m36ReductionOrderProbe()`, predict the values of
`(1e16 + -1e16) + 1.0` and `1e16 + (-1e16 + 1.0)` in the current JavaScript
number runtime. Inspect `executionScope` and the returned truth boundary. The
exercise is evidence about one finite calculation; it is neither a
cross-platform reproducibility claim nor a framework test.

### Fixed-network trace — execution evidence has a narrow scope

Use the same original, fixed two-layer ReLU card from M35, now as a compact
deep-learning execution trace:

\[
(x_1,x_2)=(1,0)
\longrightarrow z=1.5
\longrightarrow \operatorname{ReLU}(z)=1.5
\longrightarrow q=4.7
\longrightarrow (q-1)^2=13.69.
\]

The backward path on this strictly-positive ReLU branch is

\[
\frac{\partial L}{\partial q}=7.4
\longrightarrow \frac{\partial L}{\partial z}=22.2
\longrightarrow
\left(\frac{\partial L}{\partial w_1},
\frac{\partial L}{\partial w_2}\right)=(22.2,0).
\]

Before calling `m35M36FixedReluTrace()`, identify one input/parameter value,
one activation convention, and one numeric/reduction choice you would need to
record if a framework, dtype, or device were used. Then state the strongest
claim the displayed hand trace can support.

The strongest claim is only that the declared scalar equations yield these
values under the displayed arithmetic. It is not a training trace, autodiff
test, framework comparison, generalization result, calibration result,
architecture ranking, or reliability claim. In particular, the zero gradient
for \(w_2\) comes from \(x_2=0\), not from evidence that a feature is useless.

### Theory-to-system reproduction record

| Field | Required evidence |
| --- | --- |
| question and semantic oracle | What tiny behavior is being checked, and how can it be independently inspected? |
| source/data identity | Commit/revision, generator, split, preprocessing, labels |
| environment | Interpreter, packages, framework, driver/backend, device |
| numerical execution | dtype, precision mode, reduction behavior, tolerances |
| randomness/order | every RNG, seed policy, workers, shuffle/data order |
| repeat protocol | number of repeats, values retained, equality/tolerance rule |
| nonportable boundary | which platforms/versions/operations remain untested |

### Output: Theory–System Reproducibility Record

Fill a record for one tiny synthetic calculation. Hold as much fixed as
possible, vary exactly one factor—seed, data order, dtype, or backend—and
record raw observations plus alternate explanations. Do not call the result a
benchmark, a model-reliability proof, or a platform guarantee.

### Debugging probe — repair one reproducibility claim

An AI-generated experiment note says: “The source and seed are the same, so
the result reproduces.” Treat that sentence as a bug report, not a conclusion.
The copied record names the source revision and seed, but leaves one execution
field unresolved: dtype/precision, reduction order, backend/device, package
version, or data-worker/order policy.

1. **Predict before checking.** Name the missing field most likely to change
   the claimed observation, and say whether it threatens numerical equality,
   semantic behavior, or only a comparison claim.
2. **Inspect one bounded trace.** Run or read `m36ReductionOrderProbe()` and
   identify what its two arithmetic orders establish in its declared runtime.
   Do not substitute the trace for a framework, hardware, or cross-platform
   observation.
3. **Repair the claim.** Add a debugging row to the Theory-to-system
   reproduction record with the missing field, the exact observation, an
   alternate explanation, and a two-sentence conclusion: (a) the narrow
   observation under the declared protocol; (b) the broader reproducibility
   statement that must remain withdrawn.
4. **Transfer.** Change exactly one different field in a hypothetical follow-up
   record and predict which part of the repaired conclusion must be reopened.

The point is not to make two runs identical. It is to debug an overbroad
reproducibility claim until its evidence, environment, and non-claim agree.
“Same seed” alone is not a sufficient explanation of equal or unequal finite
runs.

---

## Session 5 — Shift, robustness, monitoring, and bounded human control

### Core question

**What happens after the static test split is no longer the whole story?**

If a future input relation differs from the relation used for training or
evaluation,

\[
P_{\mathrm{source}}(X,Y) \ne P_{\mathrm{future}}(X,Y),
\]

then an IID result alone does not identify future loss, calibration,
uncertainty, or utility. The notation names a difference; it does not diagnose
why it happened or select a remedy.

### Monitoring is an action-bearing hypothesis

For a synthetic shift, write an operationally bounded plan:

| Element | Required question |
| --- | --- |
| shift hypothesis | What changes: input mixture, label relation, latency, missingness, representation, or feedback? |
| observable | Which metric, calibration/slice statistic, data check, or system trace could move? |
| label availability / detection lag | Is this observable input-time evidence or delayed-label evidence? When can the required label or outcome actually arrive? |
| threshold | Which range triggers inspection, and what false-alarm/miss trade-off is accepted? |
| evidence limitation | Which shifts/errors can this observable miss? |
| owner and action | Who pauses, investigates, escalates, or declines to use an output? |
| stop boundary | When does the toy system stop rather than “self-correct”? |

Mark every proposed observable as **input-time** or **delayed-label** evidence.
An input-time monitor can reveal a changed input mixture or missingness quickly,
but it cannot immediately establish that the label relation or error rate has
changed before the needed labels arrive.

### Prediction before reveal

The toy’s `context=1` frequency changes. Predict an observable that may move
and an observable that could stay unchanged despite a meaningful change. Then
state why neither outcome proves universal robustness.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** aggregate accuracy, slice error, confidence distribution, or input
frequency may move differently. A single synthetic perturbation is evidence
about that declared variant only; it cannot represent all future shifts or
authorize autonomous remediation.

</details>

### Contrast mechanisms before choosing a monitor

The word *shift* hides different mechanisms. Keep these two synthetic changes
separate before proposing one universal monitor:

| Declared mechanism | What changes in the relay card | A probe that may reveal it | A probe that can stay silent |
| --- | --- | --- | --- |
| input-mixture / covariate shift | `context=1` mass changes from `0.50` to `0.75`, while `label = Number(signal == context)` stays fixed | input-frequency and slice-count checks; the fixed `signal-only` card's expected accuracy changes from `0.50` to `0.75` without any model improvement | an input-independent aggregate or a monitor that never records the context slice |
| conditional / label-relation shift | input frequencies stay fixed, but the declared label relation changes from `signal == context` to `label = signal` | delayed-label performance/slice checks against the named new relation | an input-frequency monitor, because the observed input mixture can be unchanged |
| measurement / representation shift | `context` becomes missing and is encoded as `0`, although the underlying task relation was not declared to change | schema, missingness, transform, and availability-time checks | a label-only aggregate that does not record the representation path |

Before reading the table's implications, predict which mechanism an
input-frequency monitor can detect while completely missing another. Then name
the owner, response, and stop condition if the probe fires.

These cards are not an exhaustive taxonomy, causal diagnosis, robustness
test, or automatic remedy. They show why one named shift mechanism needs its
own observable and why two different mechanisms can require different
evidence.

### Calibration and action remain distinct

For a named population and score values for which the conditional relation is
defined (for example, discrete values with positive probability), calibration
concerns a relation such as

\[
\Pr(Y=1\mid q(X)=a)=a.
\]

More generally, the conditional-expectation form is
\(\mathbb{E}[Y\mid q(X)]=q(X)\) almost surely. This is still a population
relation, not a guarantee about every individual score value or a finite plot.

A finite reliability table estimates it subject to bins, samples, labels,
selection, and relation. Even good observed calibration does not choose an
error cost, give consent, settle fairness, or decide who may act.

### Shared fixture return — probability evidence still needs an owner

Revisit `m35CalibrationContrast()` from the shared fixture. Its two cards keep
threshold accuracy fixed while changing the probability evidence. Before
looking at the result, name one monitoring observable that could distinguish
them and one action that must remain with a human owner. A finite card does not
choose a threshold, authorize intervention, or guarantee robustness under a
new relation.

### Output: Monitoring Extension to Reliable-Learning Evidence Map

Extend your evidence map with a shift hypothesis, monitoring observable marked
as input-time or delayed-label evidence, label availability/detection lag,
threshold, false-alarm/miss discussion, data/model/system limitations, human
owner, intervention, appeal/revision question, and stop boundary. Include:

> “This monitor can reveal ___ under ___; it cannot guarantee ___.”

Include two distinct declared shift mechanisms from the table above and state
which one your chosen observable could miss.

---

## Session 6 — Reliable learning systems dossier and bridge to synthesis

### Core question

**Can you defend one bounded learning-system claim without using a theorem,
score, or framework name as a shortcut?**

Build a **Reliable Deep-Learning Systems Dossier** for the synthetic relay
learner. No personal/proprietary data, external service, learned weights,
consequential recommendation, or deployment is allowed.

### Output: Statistical Learning Theory & Reliable Deep-Learning Systems Dossier

Submit the connected dossier below with its assumptions, numerical/system
evidence, monitoring boundary, and M25 handoff kept together.

### Required artifacts

1. **Assumption-scope sheet:** target relation, loss, class, representation,
   sample/split, regularity/limit conditions, and unknowns.
2. **Gap ledger:** approximation, estimation, optimization, and operational
   questions with their evidence and non-claims.
3. **Limit-and-nonclaim card:** one scoped theorem/limit statement, proof
   idea, quantifiers, edge case, and non-conclusion.
4. **Theory-system reproduction record:** source/data/environment/precision/
   randomness identity, repeats, tolerance, and semantic oracle.
5. **Shift/monitoring map:** two declared synthetic shift mechanisms; a chosen
   observable marked as input-time or delayed-label evidence; label
   availability/detection lag; one mechanism it can miss; threshold and
   false-alarm/miss trade-off; owner, intervention, and stop boundary.
6. **Synthesis handoff:** the strongest supported claim, uncertainty, and the
   exact question M25 should carry into later evidence-grounded design work.

### Acceptance rubric

| Evidence | Strong evidence looks like | Repair question |
| --- | --- | --- |
| assumptions | symbols, target, class, loss, sample relation, and domain are named | “Which assumption turns this from notation into an implication?” |
| gaps | algorithm, finite sample, population, and operation are distinct | “Which gap did your loss trace actually touch?” |
| theorem/limit | quantified scope and a non-conclusion appear adjacent | “What would be false if IID or the class condition vanished?” |
| systems | raw repeat protocol and a nonportable boundary are visible | “What changed without a source-code change?” |
| lifecycle | monitoring claim states its evidence timing, one blind spot, and the accountable response—not merely a metric and threshold | “Who acts when the evidence weakens?” |
| judgment | recommendation is narrow, reversible, and human-controlled | “What is still unknown before anyone relies on this?” |

### Supportive oral-defense protocol

The Teaching Assistant’s oral defense is a constructive conversation, not a
rigid exam. You may ask for hints, pause, use text instead of voice, alter a
toy premise, or correct the final summary.

1. Translate one displayed theorem/limit into assumptions, quantifiers,
   conclusion, and non-conclusion.
2. Explain which evidence a training trace gives and which gaps remain open.
3. Change one premise—sampling relation, representation, sample size, dtype,
   reduction order, shift, or authority—and predict what changes.
4. Defend one bounded monitoring response and one reason it must not be
   autonomous.
5. State the exact evidence packet handed to M25 without claiming that M25 is
   unlocked.

**Hint ladder:**

1. Find the relevant field on the reliable-learning evidence map.
2. Label the statement: definition, theorem, finite observation, system
   contract, or authority decision.
3. Remove one assumption and construct the smallest counterexample.
4. Restate the narrowest defensible claim and its non-claim together.

### Teaching Assistant prompt — M36

```text
You are Atlas Academy's M36 Teaching Assistant. Lead a supportive oral defense
of the learner's synthetic reliable-learning dossier. Start from their
assumption sheet, gap ledger, theorem-limit card, reproduction record, and
monitoring map—not a score. Ask for a prediction before revealing a repair.
Use the visible chat as an accessible whiteboard: define notation; use supported
display equations with a prose/ASCII fallback when uncertain; and use valid,
language-labelled code fences. Help the learner separate a mathematical
implication, a finite experiment, a systems observation, and a human authority
decision. If they get stuck, give the hint ladder and change only one premise.
Include one debugging probe: have the learner find a missing reproducibility
field in an overbroad claim, inspect a bounded trace, and repair the conclusion
without turning it into a framework or deployment assertion.
End with a learner-controlled summary of defended claim, repaired assumption,
counterexample, remaining uncertainty, and M25 handoff. Do not grade, claim
voice/platform settings, claim a Notion write, or save raw transcript content.
```

### Study Partner prompt — M36

```text
You are Atlas Academy's M36 Study Partner. Run a non-grading theory-to-system
discussion. Treat the visible chat as a readable whiteboard: define every
symbol, render equations when supported, provide a concise prose/ASCII fallback
when rendering is uncertain, and label code fences. Ask the learner to read a
claim card, alter one premise (loss, distribution, class, precision, seed,
shift, or authority), and predict the narrower conclusion. Help them critique
AI-generated theorem or deep-learning claims without treating them as proof.
When a record relies on “same seed,” ask the learner to debug the missing
execution field, predict the consequence, and state the narrowest repaired
reproducibility claim.
End with a concise TA handoff: strongest insight, unresolved misconception,
artifact, and next question. Do not administer the formal defense or claim a
live chat/Notion action happened without direct evidence.
```

### Forward handoff

The forward packet is: **assumptions, optimization/generalization gaps,
theorem limits, reproduction record, shift/monitoring/authority boundary, and
oral-defense reflection.** In the private guided route, it may inform a
non-credit discussion of M25's reader-visible reference preview. It does not
change M25's preview state, unlock M26, grant Core credit, or support a
publication/release claim; M25's separate promotion requirements still apply.

---

## 9. Confidence-aware diagnostic and spaced review

Choose an answer and record confidence before reading its explanation. Low
confidence adds a review item; it is never a pass/fail label.

1. `hat R_S(h)` is zero on a finite sample. What follows immediately?
   - A. Population risk is zero.
   - B. The model generalizes to every future relation.
   - C. The displayed finite empirical-loss calculation is zero under its
     sample/loss/procedure.
   - D. The objective is the correct decision objective.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Repair: finite empirical risk, population risk, and use value
are different objects.
</details>

2. A training trace reaches a small gradient norm. Which claim is best
supported?
   - A. A bounded algorithm/objective observation, subject to trace and
     numerical details.
   - B. A population-risk guarantee.
   - C. Cross-platform reproducibility.
   - D. A safe use authorization.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: A.** Repair: optimization evidence does not collapse the other gap
ledger rows.
</details>

3. Which item is indispensable to a PAC/VC-style theorem card?
   - A. The model’s brand name.
   - B. Distribution/sampling, class/loss, quantifiers, conditions, conclusion,
     and non-conclusion.
   - C. A single held-out score only.
   - D. A claim that all neural networks are covered.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: a theorem is a scoped implication, not a slogan.
</details>

4. Why can a fixed seed fail to reproduce an identical result elsewhere?
   - A. Seeds never control randomness.
   - B. Device/backend/version/dtype/data-order/reduction differences can also
     affect a finite run.
   - C. Theory forbids reproducing experiments.
   - D. A seed proves numerical correctness.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: state a bounded comparison protocol rather than a
blanket reproducibility claim.
</details>

5. A calibration plot looks good on one held-out relation. What remains true?
   - A. It proves shifted calibration and decision utility.
   - B. It is a finite estimate with population/binning/selection limits and
     does not decide use authority.
   - C. It makes monitoring unnecessary.
   - D. It proves fairness.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: calibration, shift, utility, and authority are separate
evidence layers.
</details>

6. A monitor detects an input-frequency change. Which response is strongest?
   - A. Retrain autonomously without review.
   - B. Treat the alert as proof of the root cause.
   - C. Follow the predeclared owner, probe, intervention, and stop/escalation
     boundary while retaining uncertainty.
   - D. Ignore it because the source code has not changed.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Repair: monitoring is evidence plus accountable action, not
automatic authority.
</details>

**Review schedule:** after 1, 3, 7, 14, and 30 days, retrieve one definition,
one theorem condition, one finite-experiment boundary, and one monitoring
owner. On days 7 and 30, remove one premise—IID, representation information,
fixed dtype/device, calibration relation, or human approval—and rewrite the
strongest remaining claim rather than erasing the old one.

---

## Source and reuse boundary

All explanations, diagrams, examples, and code in this workbook are original
Atlas authoring material. The reading routes below were checked on
**2026-08-01**. They guide scope and proof/evidence review; they do not grant
permission to copy third-party prose, proofs, figures, code, datasets,
benchmarks, weights, or course exercises.

### Learner-facing source links

| Source | Session/claim linkage | Reuse boundary |
| --- | --- | --- |
| [MIT 9.520 Statistical Learning Theory & Applications](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/) and its [VC-dimension notes](https://ocw.mit.edu/courses/9-520-statistical-learning-theory-and-applications-spring-2006/resources/class17/) | Sessions 1–3: empirical versus population risk, function classes, quantifiers, and theorem conditions. | MIT OCW assets have individual notices; link-only/original Atlas theorem cards, examples, and proof prompts. |
| [MIT 6.7960 Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) and [generalization-theory lecture](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec06_mp4/) | Sessions 2–5: deep-learning foundations, overparameterization/generalization questions, and experimental scope. | Link-only/original Atlas examples and experiments; no copied videos, slides, homework, or project assets. |
| [CMU 10-301/601 Introduction to Machine Learning](https://www.cs.cmu.edu/~mgormley/courses/10601/) and [Stanford CS229 course materials](https://cs229.stanford.edu/materials.html-full) | Session 3: learning-theory, regularization/model-selection, and fixed-versus-adaptive evaluation boundaries. | Link-only/original Atlas proof cards and examples; do not copy lectures, assignments, figures, data, notes, or solutions. |
| [Hoeffding (1963)](https://doi.org/10.1080/01621459.1963.10500830), [Valiant's PAC paper](https://dl.acm.org/doi/10.1145/1968.1972), and the [Bartlett–Foster–Telgarsky margin-bound example](https://proceedings.neurips.cc/paper/2017/hash/b22b257ad0519d4500539da3c8bcf4dd-Abstract.html) | Session 3: finite-class concentration, PAC quantifiers, and reading a modern deep-learning bound with its conditions. | Link/cite only/original Atlas theorem cards. Read the exact theorem before applying it; no copied proofs, figures, constants, or benchmark conclusions. |
| [PyTorch reproducibility](https://docs.pytorch.org/docs/stable/notes/randomness.html) and [numerical-accuracy documentation](https://docs.pytorch.org/docs/stable/notes/numerical_accuracy.html) | Session 4: bounded environment, dtype, backend, and comparison claims. | Link-only/original reproduction record; pin framework, device, and versions before an implementation claim. |
| [NIST AI RMF 1.0](https://doi.org/10.6028/NIST.AI.100-1) | Sessions 5–6: monitoring, management, governance, and human-control boundaries. | Link-only/original Atlas reliability maps; voluntary guidance is not legal advice, certification, or authorization. |

For the fuller original-research, university, standards, and framework source
ledger, consult the instructor-facing [M36 primary-source research
ledger](../source-maps/module36_statistical_learning_theory_reliable_deep_learning_source_research.md).

Before publication, reconcile each learner-facing claim, theorem statement,
formula, source, visual, code fixture, and numerical experiment with a
canonical structured source map, module contract, accessibility evidence,
teaching-model evidence, and release provenance. Until then this remains an
authoring workbook, not a published route, formal course guarantee, live-chat
record, Notion record, or learner-mastery claim.
