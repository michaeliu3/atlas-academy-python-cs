# Module 35 — Machine Learning & Representation

**Arc VII — Formal limits, classical AI, and learning systems**

> **Hidden review candidate — not learner-delivered.** This is the fixed
> learner-material scope for a future qualified review. M35 remains
> authoring-only, hidden from the reader manifest, and unrecorded for release.
> It does not change the course graph, availability, prerequisite policy,
> source-map binding, release state, publication claim, or Core credit;
> nothing in this workbook satisfies its prerequisites or opens M36, M25, or
> M26.

---

## How to study this module

### The working invariant

> **A model result is only a bounded claim about a declared representation,
> data relation, objective, execution path, evaluation procedure, and use
> boundary. A lower loss, higher score, gradient, embedding, or model card is
> not by itself a generalization, usefulness, fairness, safety, or authority
> claim.**

Keep this chain visible while reading every system:

~~~text
target process → observed data → representation → baseline / model
→ objective + training system → evaluation under named conditions
→ failure probes + uncertainty → human-controlled use boundary
~~~

### Evidence labels

| Label | What it can establish | What it does not establish |
| --- | --- | --- |
| **[DEFINITION / MODEL]** | A representation, hypothesis class, loss, metric, calibration relation, or probability statement under named conventions. | That the chosen map captures meaning, value, cause, or a real deployment population. |
| **[DERIVATION / THEOREM]** | A mathematical consequence of named sampling, hypothesis, loss, optimization, or distribution assumptions. | That code, data, hardware, or a future setting meets those assumptions. |
| **[LIBRARY / SYSTEM CONTRACT]** | A versioned API behavior, tensor/autodiff path, deterministic setting, input/output format, or failure mode. | That the objective is appropriate, a result is portable, or a model is reliable. |
| **[FINITE EXPERIMENT]** | A named synthetic generator, split, seed, configuration, trace, metric, and observed comparison. | A universal learning claim, a real-population result, or a future guarantee. |
| **[AI PROPOSAL]** | A candidate architecture, derivation, code patch, test plan, or explanation. | Correctness, source authority, data permission, or authorization to deploy. |

### Claim/source trail

The compact labels below point to the instructor-facing research ledger and
the learner-facing links at the end. They make a source route inspectable; they
do not convert a source into a result about this synthetic exercise.

| Session | Claims to trace | Research route |
| --- | --- | --- |
| 1 — representation | `M35-C01` | `S35-01–S35-02` |
| 2 — formulation and baselines | `M35-C02` | `S35-03–S35-04`, `S35-16–S35-19` |
| 3 — evaluation, calibration, and shift | `M35-C03–C05` | `S35-05–S35-08`, `S35-20–S35-24` |
| 4 — objectives and execution | `M35-C06–C07` | `S35-03`, `S35-09–S35-10`, `S35-17–S35-19` |
| 5 — observability | `M35-C08` | `S35-03`, `S35-11–S35-12`, `S35-15` |
| 6 — dossier and authority | `M35-C09` | `S35-13–S35-14` |

### One evidence card, six sessions

Use one evolving card instead of six disconnected sets of notes:

~~~text
Target task and non-consequential boundary:
Observed data / generator / labels / excluded variables:
Representation phi: retained structure, discarded structure, numerical risks:
Baseline(s): shared information, split, tuning budget, and predicted failure:
Objective / optimizer / regularizer / training trace:
Evaluation relation: population, split, metrics, uncertainty, shift:
Execution record: code revision, versions, seed policy, dtype, device:
Failure probes / observables / response owner:
Human authority, prohibited uses, unanswered impact questions:
Strongest supported claim / explicit non-claim / M36 handoff:
~~~

If a session feels dense, preserve the card and postpone optional depth. A
fluent model name never substitutes for a visible assumption.

---

## 1. Position in the knowledge system

~~~mermaid
%% atlas-diagram-id: m35-knowledge-map
%% atlas-diagram-title: M35 turns earlier mathematical, systems, and AI ideas into bounded ML evidence
%% atlas-diagram-alt: M13 contributes specifications and observability; M22 contributes authority and privacy boundaries; M28 contributes representation geometry; M30 contributes evaluation and uncertainty; M31 contributes objectives; M32 contributes execution evidence; M34 contributes classical baselines. These feed M35, which hands an ML evidence packet to M36 and later synthesis modules M25 and M26.
flowchart LR
  M13["M13: claims + failure probes"] --> M35["M35: ML & representation evidence"]
  M22["M22: authority + privacy"] --> M35
  M28["M28: geometry + numerical limits"] --> M35
  M30["M30: sampling + uncertainty"] --> M35
  M31["M31: objective != decision"] --> M35
  M32["M32: execution + reproducibility"] --> M35
  M34["M34: formulation + baseline"] --> M35
  M35 --> M36["M36: learning-theory + reliable systems"]
  M36 --> M25["M25: evidence-grounded synthesis"]
  M25 --> M26["M26: capstone defense"]
~~~

**Text equivalent:** M35 does not replace any prerequisite. It uses their
distinctions at different moments: representation before fitting, baseline
before model selection, evaluation before a performance claim, training-system
evidence before a reproducibility claim, and authority before a use claim.
M36 consumes the resulting evidence packet; M25/M26 remain later gated
synthesis work.

### Entry retrieval

Answer in short notes before reading on.

1. Give a pair of inputs that a representation can collapse even though a
   downstream task needs to distinguish them.
2. Why does a good dummy or rule baseline need the same information boundary
   and split as a learned model?
3. What is the difference between a lower training objective and a lower
   target-population risk?
4. Name two variables besides source code that can alter a training result.
5. Why can a model card clarify a claim without authorizing a decision?

If 1 is fragile, retrieve M28. If 2 is fragile, retrieve M34. If 3 or the
evaluation boundary is fragile, retrieve M30/M31. If 4 is fragile, retrieve
M32. If 5 is fragile, retrieve M22.

---

## 2. One synthetic story: the signal-routing laboratory

For the core representation and baseline cards, a team studies a **synthetic
signal-routing toy**. A fictional simulator emits two binary fields:

~~~text
signal  : a deliberately visible pattern bit
context : a second condition bit
label   : 1 exactly when signal and context agree
~~~

It is not a person, a diagnosis, a credit/risk score, a safety system, or a
production recommender. It exists only to make claims inspectable. The label
rule is deliberately simple:

\[
y = \mathbf 1\{\text{signal} = \text{context}\}.
\]

The team is tempted to discard `context` because it is inconvenient. That
choice creates a precise question: if two inputs have the same representation
but need different labels, can *any* deterministic downstream classifier
recover the difference?

The later fit → select → fresh-evaluation card deliberately uses a **separate
constructed selection-evidence relation**. It names that relation at the card;
it is not silently presented as more rows drawn from this equality-label story.

~~~mermaid
%% atlas-diagram-id: m35-evidence-chain
%% atlas-diagram-title: A bounded ML claim requires more than training code
%% atlas-diagram-alt: A target process produces a synthetic generator and observed split. A chosen representation feeds both a baseline and a learned model. Their objectives and system traces feed evaluation, failure probes, and a limited human-controlled recommendation. No direct path runs from a model score to a decision.
flowchart TD
  T["target question + boundary"] --> D["generator / data relation + split"]
  D --> R["representation phi"]
  R --> B["rule / dummy / simple baseline"]
  R --> L["learned model + objective"]
  L --> S["training-system trace"]
  B --> E["aligned evaluation"]
  S --> E
  E --> F["failure probes + uncertainty + shift"]
  F --> H["limited recommendation + human authority"]
~~~

**Text equivalent:** The representation feeds both alternatives so their
comparison is fair. Training-system traces and evaluation are separate: the
former says how a result was produced; the latter says what was observed under
the split. A human still decides whether the limited evidence supports a
reversible next action.

---

## Session 1 — Representation, inductive bias, and what a model can discard

**Launch:** With the Study Partner, name the target relation, representation, discarded distinction, and one decision that the representation therefore cannot support.

### Core question

**What becomes impossible after a representation forgets a task-relevant
distinction?**

A representation is a chosen map

\[
\phi: \mathcal X \rightarrow \mathcal Z,
\qquad f = g \circ \phi,
\]

where `phi` turns raw input into the form available to a downstream predictor
`g`. Features, tokenization, normalization, embeddings, projection, window
length, architecture, dtype, and missing-value handling all contribute to
this map. They are inductive choices—not discovered semantic truth.

### A one-line limitation proof

Suppose

\[
x_a=(0,0),\quad x_b=(0,1),\quad \phi(s,c)=s.
\]

Then `phi(x_a) = phi(x_b) = 0`. Yet the toy labels are `y_a=1` and `y_b=0`.
Every deterministic `g(phi(x))` must give both inputs the same output. The
representation cannot solve this declared task, regardless of how sophisticated
the downstream classifier looks.

This is a proof about this map, pair, and task. It does **not** prove that
high-dimensional embeddings are bad, that more features are always better, or
that a different representation cannot work.

### Prediction before reveal

Predict whether adding a nonlinear classifier after `phi(s,c)=s` can separate
`(0,0)` from `(0,1)`. Write one sentence using the word *collision* before
revealing the answer.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** no deterministic downstream classifier sees different inputs after
the collision. A nonlinear `g` can divide `Z` differently; it cannot recover
a bit that `phi` erased.

</details>

### Bounded reference fixture — collision before model talk

Read [`lib/m35-m36-signal-routing-fixture.js`](../../lib/m35-m36-signal-routing-fixture.js) as a tiny code-reading artifact.
Before calling `m35RepresentationCollisionWitness()`, write the two inputs
that share `phi(signal, context) = signal`, their labels, and whether a
deterministic downstream function can separate them. Then inspect the returned
`witnesses`, `conclusion`, and `truthBoundary` fields.

The fixture gives four declared synthetic rows a concrete, inspectable form.
It is not an embedding experiment, a trained model, a claim about a real
population, or a generalization theorem.

### Code-reading task: preprocessing is part of the representation

```python
def project_first_coordinate(rows):
    # Each row is (signal, context).
    return [row[0] for row in rows]

def center(rows):
    mean_signal = sum(row[0] for row in rows) / len(rows)
    mean_context = sum(row[1] for row in rows) / len(rows)
    return [(s - mean_signal, c - mean_context) for s, c in rows]
```

Before running anything, answer:

1. What information does `project_first_coordinate` discard?
2. Why must `center` be fit on training rows rather than all rows before a
   held-out evaluation?
3. Which statement is implementation-specific: the collision proof, or the
   floating-point values produced by a particular PCA library and version?

The first is a mathematical statement about a declared `phi`; the second is an
evaluation-boundary question; the third distinguishes a theorem from a library
result.

### Output: Representation-Assumption Sheet

Make a **Representation-Assumption Sheet** with:

- input fields, units, availability time, missing-value rule, and prohibited
  features;
- the map `phi`, output shape, dtype/range, and one numerical conditioning
  concern;
- one retained relation and one possible lost relation;
- one collision pair or a reason it cannot be constructed;
- a task assumption that makes the retained structure useful; and
- the sentence: **“This representation does not establish …”**

**Transfer.** Inspect an AI proposal that says “use embeddings so the model
learns the important factors.” Ask it to name `phi`, the task, one collision,
the data relation, and what evidence would show the discarded direction does
not matter.

---

## Session 2 — Formulation and classical baselines before learned models

**Launch:** State the prediction target, decision owner, information available at inference, and a classical baseline before proposing a learned model.

### Core question

**What comparison would teach you whether learning adds value?**

A learned model is one possible solution to a formulation. First name:

~~~text
prediction target / decision owner / available-at-inference information
hard constraints / error costs / latency or resource limits
baseline alternatives / metric / abstention or escalation rule
~~~

For the toy lab, compare three deliberately modest alternatives:

| Alternative | Inputs allowed | What it demonstrates | Predictable limitation |
| --- | --- | --- | --- |
| Constant/dummy predictor | no input | class prevalence and metric floor | cannot react to either bit |
| Rule `signal == context` | both fields | a transparent oracle for the declared synthetic label | only works because the generator disclosed the label rule |
| Linear/simple learned model | same fields and split | whether fitting improves a shared baseline under an explicit objective | may be sensitive to representation, split, or optimization choices |

The rule is not a production recommendation. It exposes the toy problem’s
structure. A fair comparison aligns feature availability, preprocessing, split,
tuning budget, metric, decision threshold, and resource boundary.

### Prediction before reveal

An AI suggests a neural network trained with both fields, while the baseline is
a constant predictor denied `context`. Predict what is wrong with declaring a
score win “model superiority.”

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** the alternatives have different information budgets. The result
confounds architecture with access to a task-relevant field.

</details>

### Code-reading/debugging task

```python
def rule_baseline(row):
    signal, context = row
    return int(signal == context)

def mismatched_baseline(row):
    signal, _context = row
    return int(signal == 1)
```

`mismatched_baseline` is not necessarily a bad baseline, but it answers a
different question because it receives less information. List the difference
in its input contract, its predictable failure, and one reason it could still
be useful as a deliberately weak lower bound.

### Bounded reference fixture — information budgets before score claims

Before calling `m35BaselineComparison()`, predict the fixed-card accuracy of
`constant-one`, `signal-only`, and `disclosed-rule`. For each alternative,
name the input fields it is allowed to see. After inspecting the returned
`alternatives`, explain why the best number is not evidence of architecture
superiority.

`disclosed-rule` can match the label only because this synthetic generator is
shown in the fixture. It is an inspectable oracle for the toy relation, not a
production baseline recommendation.

### Shared-information model-family comparison

Hold the **same two raw inputs**—`signal` and `context`—fixed for every
candidate. On the four declared rows, compare a single affine threshold, an
explicit engineered interaction, and a hand-constructed two-hidden-unit ReLU
network. This is an expressivity comparison on a finite card, not a training
or benchmark comparison.

Before calling `m35SharedInformationModelFamilyCard()`, predict which family
can represent the equality labels on all four rows. Do not use the words
“better model” until you have named the raw-input contract, hypothesis family,
and selection budget.

<details>
<summary>Reveal the equal-information comparison after writing a prediction.</summary>

For a single affine threshold

\[
f(s,c)=\mathbf 1[w_0+w_s s+w_c c\geq 0],
\]

the equality labels require

\[
w_0\geq0,\quad w_0+w_s<0,\quad w_0+w_c<0,\quad
w_0+w_s+w_c\geq0.
\]

Adding the two negative inequalities says
\(2w_0+w_s+w_c<0\), while adding the two positive inequalities says
\(2w_0+w_s+w_c\geq0\). That contradiction proves that this **single affine
threshold** cannot represent this four-row equality task.

An engineered interaction \(\mathbf 1[s=c]\) uses no extra raw field, but it
puts target-shaped structure into the representation. A fixed two-hidden-unit
ReLU construction also uses only the same raw fields:

\[
a_1=\operatorname{ReLU}(s+c-1),\qquad
a_2=\operatorname{ReLU}(1-s-c),\qquad
q=a_1+a_2.
\]

For `(signal, context)` ordered as `(0,0)`, `(0,1)`, `(1,0)`, `(1,1)`, its
scores are `1, 0, 0, 1`. The parameters were constructed from the disclosed
toy rule. No fitting, validation, selection, data-efficiency, or architecture
superiority claim follows.

</details>

Record one **equal-information family card** in your Baseline Comparison:
raw fields, derived features, family, constructed/fitted status, tuning budget,
four-row result, and one non-claim. The useful question is *which assumption
or computational form changed?*, not *which model name won?*

### Breadth map — a family changes a contract, not just a model name

This module studies representation, evaluation, training evidence, and
reliability in depth; it is not a compressed survey of every learning family.
Use this map when reading an unfamiliar proposal. It tells you which contract
the proposal changes and where Atlas intentionally stops.

| Family | What changes first | Evidence question before comparison | Atlas boundary |
| --- | --- | --- | --- |
| Linear or additive model | The relation is constrained to a weighted combination of declared features. | Which distinctions cannot this representation and hypothesis class express? | The affine threshold above is the hand-checkable reference case. |
| Tree or rule partition | The input space is divided by named tests. | What split/tuning budget and missing-value or subgroup policy were allowed? | Read and compare the partition; full tree training is optional depth. |
| Kernel or similarity method | A similarity function acts like a chosen feature geometry. | What does the kernel say is similar, and how were scale and regularization selected? | Treat kernel choice as a representation claim; no kernel implementation is required here. |
| Neural network | Learned compositions can change the hypothesis class and numerical execution path. | Which architecture, objective, precision, seed, and gradient claim are actually evidenced? | The fixed two-ReLU and autodiff traces are the in-scope execution cases. |
| Unsupervised method | The objective no longer uses the same labeled decision target. | What structure is optimized, and how would its usefulness for a later task be tested without leakage? | Representation and clustering/reconstruction are optional depth, not a proxy for task success. |
| Sequential decision | Actions affect later observations and returns. | Who owns the reward, intervention, and safety boundary when the policy changes data? | M34 supplies state/action/decision framing; policy learning is optional depth. |

For any family, write the same six fields before trusting a result: **available
information, representation, objective, hypothesis/decision class, selection
procedure, and observable evidence**. A new family never removes the need for
an authority boundary.

### Bias–variance, kernels, SVMs, and boosting — compare contracts, not brands

For a fixed input \(x\), suppose \(Y=f(x)+\epsilon\), with
\(\mathbb E[\epsilon\mid x]=0\) and
\(\operatorname{Var}(\epsilon\mid x)=\sigma^2_\epsilon\). Let
\(\widehat f_D(x)\) be the predictor trained on dataset \(D\), and let
\(\overline f(x)=\mathbb E_D[\widehat f_D(x)]\). Expanding the square and
letting the centered cross-terms vanish gives

\[
\mathbb E_{D,\epsilon}\!\left[(Y-\widehat f_D(x))^2\mid x\right]
=\underbrace{\sigma^2_\epsilon}_{\text{irreducible noise}}
+\underbrace{(\overline f(x)-f(x))^2}_{\text{bias}^2}
+\underbrace{\mathbb E_D[(\widehat f_D(x)-\overline f(x))^2]}_{\text{variance}}.
\]

**Prediction:** a highly constrained model that is wrong in the same way across
resampled training sets tends to show larger bias; a flexible model whose
predictions move substantially across those sets tends to show larger variance.
The decomposition is a pointwise squared-loss identity under the stated
assumptions. It is not a universal classification law, a reason to label one
architecture “best,” or a license to treat noise as removable.

<details>
<summary>Reveal the cross-term check after making a prediction.</summary>

Write \(Y-\widehat f_D=(f-\overline f)+(\overline f-\widehat f_D)+\epsilon\).
The dataset-centered and noise-centered terms have zero conditional mean, so
their cross-products disappear after the declared expectation. If the
training procedure, loss, or sampling relation changes, re-check the
decomposition instead of carrying the labels over by slogan.

</details>

**Kernel/SVM reading card.** A kernel declares a geometry through
\(K(x,x')=\langle\phi(x),\phi(x')\rangle\) without requiring \(\phi(x)\) to be
materialized. For \(y_i\in\{-1,+1\}\), a soft-margin linear SVM can be read
through the objective

\[
\frac12\lVert w\rVert^2+
C\sum_i\max(0,1-y_i(w^\top\phi(x_i)+b)).
\]

Before reading an API call, identify scaling, kernel, \(C\), class weights,
the validation boundary, and whether “probability” output is a post-hoc
calibration rather than the margin itself. Support vectors are the examples
with active margin constraints (equivalently, non-zero dual influence in the
declared formulation). This is a code-reading contract, not an SVM
implementation requirement or a population-separation guarantee.

**Boosting reading card.** A stagewise additive model has the shape
\(F_t=F_{t-1}+\eta h_t\), where the next weak learner \(h_t\) is chosen using a
declared residual or negative-gradient rule. Read n_estimators, learning_rate,
base-learner depth, subsampling, early stopping, and the selection split
together. More stages can reduce a training objective while worsening a
fresh evaluation or changing calibration; the update equation alone proves
neither generalization nor safe use.

### Ranking and ablation are evidence designs

Ranking asks whether candidate scores order pairs or lists as intended; it is
not the same question as threshold accuracy, probability calibration, or
decision utility. State the unit, tie rule, comparator, and slice before
choosing a ranking metric. An ablation is a controlled intervention: remove or
replace exactly one component, hold the data relation, split, selection budget,
and execution record fixed, and report repeat variation. It can support a
narrow component comparison in that protocol; it does not establish a causal
story for every population or architecture.

**Problem ladder:**

1. **Recognize:** label the noise, bias, and variance terms in a fixed
   squared-loss card and distinguish ranking from calibration.
2. **Read:** inspect an SVM or boosting configuration and point to the kernel,
   margin/regularization, stagewise budget, split, and post-hoc calibration
   boundary.
3. **Design:** propose one-component ablations with a prediction, paired
   repetitions, a falsifier, and one retained claim/non-claim.

**Claim/source trace:** M35-C02, M35-C04, and M35-C08 →
S35-03–S35-04, S35-07, S35-16–S35-24. The cards synthesize the existing
calibration routes with original derivations and fixtures; they are not copied
course notes, a model leaderboard, or an approval decision.

### Output: Classical–Learning Baseline Comparison

Create a **Baseline Comparison** that records:

1. task, target, decision owner, and non-consequential scope;
2. exact information available to every alternative and when it becomes
   available;
3. rule/dummy/classical/simple learned alternatives;
4. shared split, preprocessing boundary, tuning budget, metric, and cost;
5. a predicted failure case for each alternative; and
6. the limited question the comparison can answer.

**Non-claim:** the highest value on one synthetic metric does not establish
deployment value, causal explanation, or a legitimate decision policy.

### Retrieval and transfer

Without reopening the score table, retrieve the six fields that make a
baseline comparison interpretable: available information, representation,
objective, hypothesis/decision class, selection procedure, and observable
evidence. Then inspect an AI proposal that calls a neural alternative “better”
than a rule. Ask it to hold the information and selection budgets fixed, name
the decision owner, and predict one failure case before comparing a metric.
This transfers the baseline discipline; it does not choose a model family.

---

## Session 3 — Data relations, splits, metrics, calibration, and shift

**Launch:** Name the train, test, and deployment relations, split rule, metric, and one future shift that the held-out score cannot settle.

### Core question

**Which population and future relation does this score describe?**

Let `P_train`, `P_test`, and `P_deploy` name relations rather than silently
assuming they are identical. A finite held-out metric estimates behavior under
the data path, split rule, preprocessing, selection process, metric, and
uncertainty method that produced it. It does not automatically estimate a
future deployment relation.

### Leakage is a dependency path

Read these two near-identical sketches:

```python
# A: leaks held-out distribution information into the fitted transform.
mean = sum(all_rows) / len(all_rows)
train_rows, test_rows = split([(x - mean) for x in all_rows])

# B: fits the transform only on training rows.
train_rows, test_rows = split(all_rows)
mean = sum(train_rows) / len(train_rows)
train_rows = [x - mean for x in train_rows]
test_rows = [x - mean for x in test_rows]
```

### Prediction before reveal

Before reading the answer, draw the arrow that carries held-out information
into A. Then predict which reported estimate can become optimistic.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** in A, the transform’s `mean` depends on every row, including
held-out rows. The model has not read held-out labels, but the evaluation
boundary is still contaminated. B has a cleaner boundary for this transform.
Neither snippet proves that a random row split represents a future relation:
time, entities, geography, retries, or correlated records can still cross the
boundary.

</details>

### Tiny group/time split counterexample

Keep the synthetic records small enough to inspect:

| record | entity | time | row-random split | group split | time split |
| --- | --- | --- | --- | --- | --- |
| A | `site-7` | week 1 | train | train | train |
| B | `site-7` | week 4 | test | train | test |
| C | `site-9` | week 5 | test | test | test |

The row-random split lets the evaluation set contain a second record from an
entity already seen in training. If the target relation is **new entities**,
the entity field defines the unit of independence and A/B must stay together.
If the target relation is **future operation**, time defines the boundary and B
belongs after A. Neither split is automatically correct: name the target
relation, then state which field stops information from crossing the boundary.

### Split contract — name the relation before naming a tool

For either choice, record four short fields before selecting a splitter:

1. **Target relation:** `new entity` or `future operation` (or a more precise
   declared relation).
2. **Unit of independence:** the entity, operation, site, time block, or other
   object that must be treated together.
3. **Field that must not cross:** for example `entity` for new-entity evidence,
   or `time` for future-operation evidence.
4. **Non-claim:** what the split still does not represent—such as a new region,
   an intervention, a changed measurement process, or every future condition.

`GroupKFold` and `TimeSeriesSplit` in the
[scikit-learn cross-validation guide](https://scikit-learn.org/stable/modules/cross_validation.html#group-k-fold)
are implementation examples for two of these relations. They do not select the
relation for you or guarantee a deployment estimate.

### Metrics answer different questions

Two predictors can have identical accuracy yet very different probability
behavior. For a predicted probability `q`, an ideal calibration statement is

\[
\Pr(Y=1 \mid \widehat p(X)=q) = q
\]

for a named population and applicable values of `q`. A binned reliability
table is a finite estimate of that conditional relation; it is not a warrant to
trust a number as a belief or make a decision from it.

| Metric / display | Question it helps ask | Missing boundary |
| --- | --- | --- |
| Accuracy | How often were labels matched under this evaluation relation? | cost, confidence, slices, and shift |
| Proper score/loss | What finite probabilistic-forecast loss did these declared outcomes receive? | decision utility, calibration decomposition, and population stability |
| Reliability table | Do named probability bins roughly align with observed frequencies? | sample size, binning, selection, and deployment shift |
| Slice metric | Which declared subgroup/time/condition differs in this data? | causal reason, legitimacy, and unseen slices |

### Bounded reference fixture — declared input-mixture shift

Before calling `m35DeclaredRelationShiftProbe()`, predict the expected accuracy
of the fixed `signal-only` predictor under two declared relations. The fixture
keeps \(y=\mathbf 1\{\text{signal}=\text{context}\}\) fixed, but changes the
input mixture from `source-balanced` to `context-heavy`. Its expected accuracy
changes from `0.50` to `0.75` because that predictor is correct exactly when
`context=1`.

Inspect the two joint tables before accepting the number. This is a declared
input-mixture/covariate-shift calculation, not a sampled evaluation. It does
not identify real-world robustness, a causal mechanism, an undeclared future
relation, or all possible shifts.

### Bounded reference fixture — equal accuracy can hide probability behavior

Before calling `m35CalibrationContrast()`, predict whether its two fixed
probability cards can have the same threshold accuracy while receiving
different proper scores. Inspect the returned `predictors` and binned observed
frequencies. Both cards have threshold accuracy `0.75`; their Brier scores are
`0.1875` and `0.2451`. This is a constructed finite probability-behavior
comparison: the lower Brier value here is **not** by itself a
population-calibration ranking or decision-policy recommendation. Write one
sentence separating the card, a reliability estimate, and a decision claim.

### Uncertainty inherits its sampling unit

Before an error bar or resampling result can mean anything, name the object
that was independently sampled. Start with eight *declared independent* binary
loss units:

\[
(1,0,0,1,0,0,1,0),\qquad \widehat R=\frac{3}{8}.
\]

Under the deliberately narrow IID Bernoulli-loss model, a rough standard-error
scale is

\[
\widehat{\operatorname{SE}}(\widehat R)
=\sqrt{\frac{\widehat R(1-\widehat R)}{8}}
\approx 0.171.
\]

**Predict before revealing.** Change exactly one premise: the eight rows are
two observations from each of four customer journeys, and observations within a
journey may move together. May a row-level resample still be interpreted as
eight independent loss units? What is the smallest repair to the plan?

<details>
<summary>Reveal the sampling-unit boundary after naming the assumption.</summary>

No. A row-level resample treats rows as independently sampled. With repeated
entities or serial dependence, that assumption is no longer the declared data
relation. The plan must instead resample the independently sampled objects
(for example, whole entity vectors or a justified time block), use another
dependence-aware method, or withdraw the earlier uncertainty interpretation.
Neither four groups nor eight rows automatically supplies a valid real-world
interval; the sampling model and available independent units remain part of the
claim.

</details>

Add the declared independent unit and any dependence treatment to the
Evaluation-and-Shift Plan. This card distinguishes a rough IID calculation from
a dependence-aware design; it does not select a universal bootstrap, establish
coverage, or certify a deployment estimate.

### Selection boundary — inspection changes the evidence

Suppose an AI proposes thresholds `0.35`, `0.50`, and `0.65`, reads the labels
of the only declared test split, and selects whichever threshold reports the
largest test F1. Before revealing the answer, classify that split after the
choice: is it still an untouched test, or has it become selection evidence?

<details>
<summary>Reveal after naming the boundary.</summary>

Once the split's labels influence which threshold, family, seed, feature set,
or stopping time is chosen, its result is **selection-conditioned** evidence.
It may still be useful for tuning, but it no longer supports an untouched-test
claim about the selected configuration. Preserve the candidate set, every
look/selection rule, metric, seed budget, and stop rule; use a fresh,
predeclared evaluation relation for the next performance observation.

</details>

This does not make selection invalid. It makes the boundary visible. Add the
selection record and the fresh-evaluation plan to the Evaluation-and-Shift Plan
instead of silently relabeling a tuned split as “test.”

### Fit → select → fresh evaluation

Read the next fixture as a separate constructed selection-evidence ledger, not
as a framework run or an unlabelled sample from the earlier equality-label
story. It fixes three disjoint partitions and exactly two candidate families.
The declared train/validation relation is `label = context`; the declared fresh
relation is `label = signal`. That deliberate conditional/label-relation shift
makes both the evidence boundary and its model change inspectable:

| Phase | Permitted labels | What becomes fixed afterward |
| --- | --- | --- |
| fit | training rows only | each one-feature threshold's orientation |
| select | validation rows only | the selected candidate and selection log |
| fresh evaluation | fresh rows only, after selection | one finite observation of the already selected candidate |

Before calling `m35FitSelectFreshEvaluationTrace()`, predict which feature
(`signal` or `context`) the validation rows will select. Then write down what
the fixture must *not* read while making that choice: the labels of
`fresh-1` through `fresh-4`.

<details>
<summary>Reveal the fit/selection/fresh trace after committing your prediction.</summary>

The trace fits each candidate's orientation on its four training rows, then
selects `context-threshold` with the two validation rows under the declared
`label = context` relation. Its fresh partition deliberately changes to
`label = signal`: the already selected candidate gets `1/4` correct. That is a
finite observation about these declared fresh rows—not a population estimate,
a reason to retune after the fact, or a claim that another candidate is
generally better.

</details>

Inspect the `partition`, `fitting`, `selection`, and `freshEvaluation` fields
in that order. For each field, state the rows used, the decision it permits,
and one stronger statement it cannot support.

### One-change debugging probe — fresh labels are not tuning feedback

Change exactly one premise: allow the fresh labels into model selection. The
fixture's `oneChangeLeakageDebug` shows that this improper rule would choose
`signal-threshold` instead. Diagnose the bug before proposing a repair:

1. Which rows changed role from evaluation evidence to selection evidence?
2. Which claim about the fresh score is now unavailable?
3. What must remain fixed before a new independent evaluation is designed?

**Repair:** retain the validation-selected candidate, its candidate order,
metric, and row identifiers; record the fresh observation without using it to
choose again. If a new choice is justified, predeclare a new untouched
evaluation boundary. This is an evidence-discipline exercise, not a command to
deploy or retrain anything.

### Output: Evaluation-and-Shift Plan

Record a **Plan** with target relation, unit of independence, split rule,
preprocessing-fit boundary, metric suite, uncertainty method, slices, model
selection/stopping rule, one predeclared synthetic shift, and one explicit
inference boundary. Include the fitted candidate family, validation-selection
record, fresh-evaluation row identifiers, and one candidate choice the fresh
rows were not permitted to change. Include the sentence:

> “This evaluation estimates behavior under ___; it does not establish ___.”

### Retrieval and transfer

Start the M36 handoff with four fields from this plan: the named relation
`P` (or explicitly synthetic generator), loss, split/independence relation,
and selection protocol. If any field is unknown, mark it as an assumption
rather than silently treating a score as theorem-ready evidence. For transfer,
give an AI-proposed evaluation one changed premise—new entities, future time,
or a changed measurement path—and ask which split field and non-claim must be
rewritten before an additional score is useful.

---

## Session 4 — Objectives, autodiff, optimization, and training systems

**Launch:** Trace objective → gradient → update → system condition, then say which optimization, evaluation, or generalization question the trace leaves open.

### Core question

**What does a training trace show, and what does it leave unresolved?**

For a probabilistic classifier `p_w(x)`, a familiar binary cross-entropy
objective is

\[
L(w) = -\frac{1}{n}\sum_{i=1}^{n}
\left[y_i\log p_w(x_i) + (1-y_i)\log(1-p_w(x_i))\right]
+ \lambda\Omega(w).
\]

This defines an implemented optimization target only after the data, labels,
representation, reduction, numerical guards, regularizer, and framework
conventions are named. An update such as

\[
w_{t+1}=w_t-\eta_t\nabla_w L(w_t)
\]

is a computational event. It does not establish that `L` measures the desired
outcome, that the trace converges, that a low loss generalizes, or that the
result is safe to use.

### Bernoulli likelihood — why this loss has this shape

The data term above is not a ritual to memorize. Make one explicit conditional
model: after the available representation of \(\phi(x)\), let a binary label satisfy

\[
\Pr(Y=y\mid \phi(x))=p_w(\phi(x))^y\bigl(1-p_w(\phi(x))\bigr)^{1-y},
\qquad y\in\{0,1\}.
\]

Taking the negative log of the observed-label likelihood gives

\[
-\log \Pr(Y=y\mid \phi(x))
=-\left[y\log p_w(\phi(x))+(1-y)\log\bigl(1-p_w(\phi(x))\bigr)\right].
\]

That is the binary cross-entropy term. It follows from the named Bernoulli
conditional model and log-likelihood objective; it does not prove that the
model, labels, target, or probability interpretation is appropriate.

**Predict before revealing the numbers.** Let a fixed logit be
\(z=\log 3\), so \(p=\sigma(z)=3/4\). Which observed label gets the smaller
negative log likelihood: \(y=1\) or \(y=0\)? State why in terms of the
probability assigned to the observed label.

<details>
<summary>Reveal the one-point likelihood comparison after predicting.</summary>

For \(y=1\), the likelihood is \(3/4\), so the loss is
\(\log(4/3)\). For \(y=0\), the likelihood is \(1/4\), so the loss is
\(\log 4\). On this one declared model, assigning more probability to the
observed label lowers negative log likelihood. This is neither a calibration
guarantee nor a decision rule.

</details>

Before calling `m35BernoulliLogLikelihoodCard()`, derive both likelihoods and
losses yourself. Then use its `conditionalModel`, `derivation`, `examples`,
and `truthBoundary` fields to check arithmetic and scope—not to infer that a
trained system has meaningful probabilities.

### Code-reading card — a mathematically right loss can be numerically wrong

With a logit \(z\), write \(p=\sigma(z)\). In exact arithmetic the binary
loss can be evaluated through probabilities, but the intermediate calculation
can fail in finite precision:

```python
def naive_bce_from_logit(z, y):
    p = 1 / (1 + exp(-z))
    return -(y * log(p) + (1 - y) * log(1 - p))
```

**Predict before revealing.** For `z = 1000, y = 0`, which intermediate is
likely to round to an endpoint? For `z = -1000, y = 1`, which exponential is
likely to overflow? Explain why the symbolic expression and the executable
path are different questions.

<details>
<summary>Reveal the stable logit-space rewrite after predicting.</summary>

For \(y\in\{0,1\}\), the same scalar loss can be written as

\[
\ell(z,y)=\max(z,0)-zy+\log\bigl(1+\exp(-|z|)\bigr).
\]

```python
def stable_bce_from_logit(z, y):
    return max(z, 0) - z * y + log1p(exp(-abs(z)))
```

The naïve path can encounter an overflowing exponential, a probability rounded
to `0` or `1`, or a logarithm of zero. In the stable form the exponential's
argument is non-positive; at extreme magnitude its correction may underflow
toward zero while the appropriate linear term remains. For the two declared
cases above, the stable scalar loss is approximately `1000`.

</details>

Reading this rewrite establishes only a bounded numerical property of the
displayed scalar loss. It does not validate the labels, split, objective,
calibration, generalization, or any decision that could use the score.

### Regularization changes the target; selection changes the evidence

The term \(\lambda\Omega(w)\) changes the optimization question; it is not a
magic “anti-overfitting switch.” On one deliberately tiny scalar card, let

\[
J_\lambda(w)=(w-2)^2+\lambda w^2,
\qquad \lambda\in\{0,1,3\}.
\]

The stationary condition is

\[
\frac{dJ_\lambda}{dw}=2(w-2)+2\lambda w=0,
\qquad
w^*_\lambda=\frac{2}{1+\lambda}.
\]

**Predict before revealing.** As \(\lambda\) goes from `0` to `1` to `3`,
does the constructed optimum move toward `2`, toward `0`, or remain fixed?
Can you compare the three objective values as though they measured one shared
test metric?

<details>
<summary>Reveal the shrinkage and selection boundary after predicting.</summary>

The optima are \(2\), \(1\), and \(0.5\). The penalty changes the objective,
so its values are not directly a model-ranking score across different
\(\lambda\) values. If labels or a metric choose \(\lambda\), that evaluation
has become selection evidence. Preserve the candidate set and selection rule,
then use a fresh, predeclared evaluation relation for a later performance
observation.

</details>

Before calling `m35RidgeShrinkageCard()`, derive each optimum and split its
objective into data and penalty terms. Its `selectionBoundary` is part of the
lesson: a regularizer changes a hypothesis preference; it does not make a
reused validation result untouched or prove a selected model generalizes.

### Code-reading task: a tiny trace

```python
def squared_loss(weight, feature, label):
    prediction = weight * feature
    return (prediction - label) ** 2

def central_difference(weight, feature, label, h=1e-5):
    return (squared_loss(weight + h, feature, label)
            - squared_loss(weight - h, feature, label)) / (2 * h)

analytic_gradient = 2 * feature * (weight * feature - label)
```

Before revealing the interpretation, name four different claims:

1. the analytic expression differentiates the displayed scalar loss;
2. the central difference approximates that derivative at one point and `h`;
3. a framework/autodiff computation follows its recorded graph and dtype rules;
4. none of these validates labels, representation, target population, or use.

### Prediction before reveal

If the central-difference and analytic values agree to a tolerance at one
point, which is supported: “the gradient code for this fixture is less
suspicious,” or “the model is correct and generalizes”? Explain before reading
on.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** only the narrow implementation statement is supported. Very small
`h` can also suffer cancellation; agreement is a probe, not a theorem.

</details>

### Bounded reference fixture — one scalar gradient comparison

Before calling
`m35SquaredLossGradientCheck({ weight: 0, feature: 2, label: 1 })`, predict
the loss and analytic derivative. Compare its analytic and central-difference
values, then list two important things the agreement does **not** validate.
The returned scope statement is part of the result, not a disclaimer to skip.

### Fixed two-layer trace — values first, then backward paths

Read this hand-checkable network as two parameterized layers, not as a claim
about a trained neural system:

```python
# One fixed example and one fixed parameter setting.
x1, x2, target = 1.0, 0.0, 1.0
w1, w2, b1 = 2.0, -1.0, -0.5
v, b2 = 3.0, 0.2

z = w1 * x1 + w2 * x2 + b1
a = max(0.0, z)              # ReLU; here z is strictly positive
q = v * a + b2
loss = (q - target) ** 2
```

Before calling `m35M36FixedReluTrace()`, calculate `z`, `a`, `q`, and `loss`.
Then predict whether `w2` gets a zero gradient because `x2=0`, because the
ReLU is inactive, or for neither reason.

<details>
<summary>Reveal the forward and backward trace after calculating it.</summary>

The forward values are \(z=1.5\), \(a=1.5\), \(q=4.7\), and
\(L=13.69\). Because \(z>0\), the ReLU derivative on this path is `1`:

\[
\frac{\partial L}{\partial q}=7.4,\quad
\frac{\partial L}{\partial v}=11.1,\quad
\frac{\partial L}{\partial b_2}=7.4,\quad
\frac{\partial L}{\partial z}=22.2,
\]
\[
\frac{\partial L}{\partial w_1}=22.2,\quad
\frac{\partial L}{\partial w_2}=0,\quad
\frac{\partial L}{\partial b_1}=22.2.
\]

`w2` receives zero gradient here because `x2=0`, not because the ReLU is
inactive. If \(z=0\), a derivative convention would need to be stated; this
trace deliberately avoids that boundary.

</details>

The trace makes one chain rule calculation inspectable. It does **not** test
autodiff, validate a framework graph, show useful training behavior, compare
architectures, establish generalization, or authorize a use decision.

### Reproducibility is a bounded comparison

Keep a training-systems card:

| Field | Example question |
| --- | --- |
| data identity and split | Which generator revision and rows were used? |
| source/environment | Which commit, interpreter, library, driver, and device? |
| execution | CPU/GPU, dtype, tensor layout, workers, deterministic settings? |
| randomness | Which generators, seed policy, order/shuffle behavior? |
| comparison | Exact equality, tolerance, distributional comparison, or qualitative trace? |
| non-claim | What platform/version/hardware variation was not tested? |

Setting a seed is useful, but it is not a universal portability guarantee.

### Output: Objective–Optimization–Generalization Trace

Create an **objective trace**: inputs, representation, loss, regularizer, optimizer,
  step rule, gradient/finite-difference probe, observed training and validation
  quantities, and unresolved objective-to-target gap.

### Output: Training-Systems Reproducibility Card

Create a **training-systems reproducibility card** using the table above. Keep
the exact comparison conditions and its nonportable boundary visible.

### Retrieval and transfer

Retrieve the chain `conditional model → loss → gradient/training trace →
evaluation relation → use boundary`. A finite-difference agreement can check
one displayed derivative, not the target, split, or use decision. For transfer,
ask an AI agent to justify an optimizer change; require the objective,
regularizer, numerical environment, selection record, and the claim that the
proposed trace could actually support.

---

## Session 5 — ML debugging, observability, and evidence that can fail usefully

**Launch:** When an aggregate score moves, list the data, representation, metric, model, system, and serving hypotheses before changing the model.

### Core question

**When an aggregate score changes, what should you inspect before changing the
model?**

Treat debugging as belief revision. A score regression could arise from data,
feature/representation, label, model, metric, threshold, split, selection,
runtime, or serving behavior. One dashboard line does not identify a cause.

Start with a claim matrix:

| Claim | Observable / probe | Counterexample or failure injection | Response boundary |
| --- | --- | --- | --- |
| training rows follow declared schema | versioned schema + missingness counts | remove a required field or alter a unit | stop experiment; inspect generator |
| representation is fit only on training data | fit-transform trace | intentionally fit on all rows | reject metric as contaminated |
| score means what its name says | hand-checked tiny fixture | swap threshold or labels | repair metric before model work |
| slice behavior is visible | declared slice table with counts | change context frequency | investigate; do not infer cause |
| a result is reproducible within tolerance | rerun comparison card | change seed/dtype/version | label difference; narrow claim |

### Prediction before reveal

Suppose aggregate accuracy is unchanged but the rate of `context=1` doubles
and a slice metric worsens. Predict three hypotheses that remain possible
before touching model weights.

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** examples include generator/data shift, slicing/metric error,
representation interaction, threshold selection, or a genuine model weakness.
The observation narrows the next probe; it does not name the cause.

</details>

### Debugging sequence

1. Restate the failing claim and expected range.
2. Confirm data, code, model, and metric identities.
3. Reproduce the smallest fixture or hand calculation.
4. Separate data, representation, model, metric, and operation hypotheses.
5. Change one premise; record the observation and competing explanations.
6. Choose a human owner and a safe response, including abstention or pause.

### Output: ML Claim–Test–Observability Matrix

Add at least five rows like the table above. Each row must name an owner,
expected evidence, one failure probe, response action, and what the observable
cannot prove. A dashboard without an action rule is not observability.

**Transfer.** Ask an AI agent to diagnose “the model got worse.” Reject a
single architecture change until it proposes a hypothesis tree and one cheap
discriminating probe for each major branch.

---

## Session 6 — Responsible ML representation dossier and oral defense

**Launch:** Separate model output, decision owner, authority, evidence, and missing permission before drafting the responsible-ML dossier.

### Core question

**Who is allowed to turn a model output into a decision, and what evidence is
still missing?**

An evaluation, calibration chart, model card, or risk framework can make a
claim more inspectable. None creates consent, privacy permission, fairness,
legal authority, safety, or legitimacy. Those require context-specific human
governance that the toy lab does not simulate.

For this module, keep the project intentionally bounded:

> Build an evidence dossier for a synthetic signal-routing model. Do not use
> personal, proprietary, medical, educational, employment, financial,
> biometric, or consequential decision data. Do not call external services,
> ship weights, or recommend an external action.

### Dossier preflight — predict, inspect, repair

**Synthetic AI-generated claim (not evidence):** “Our synthetic signal-routing
model is ready to rank incoming signals automatically: it achieved 94% validation
accuracy, its probability scores are calibrated, and its risk card proves that
human review is unnecessary.”

Before revealing a repair, do a claim-and-design inspection. Mark which fields
are absent or merely asserted: the source/target data relation, split and
selection history, fresh-evaluation boundary, metric/slice/cost, probability
evidence, decision owner, abstention rule, and appeal or escalation path. Then
write the narrowest sentence you could defend from a *declared synthetic*
fixture without turning a score, chart, or document into authority.

<details>
<summary>Reveal after writing your prediction.</summary>

**Repair:** the claim cannot establish readiness, calibration, safety, or
automatic authority. A validation score needs its named data relation, split,
preprocessing and selection history, metric, slice, and cost; calibration needs
separate probability evidence under a named population; and no finite result or
risk card appoints a decision owner. A narrower claim might say only that a
specified model produced a finite result in one declared synthetic evaluation.

**Counterexample:** the same score can coexist with a leaked split, an omitted
failure slice, or a policy that forbids automated action. None of those facts is
repaired by adding more confident prose.
</details>

**Transfer.** Change exactly one premise. If the fresh-evaluation rows were used to choose the threshold, which evaluation claim must be withdrawn? If an accountable owner proposes an external decision, which authority and impact evidence is still missing even if every synthetic metric is unchanged? State one retained narrow fact and one withdrawn claim.

### Required dossier artifacts

1. **Data/provenance card:** generator revision, seed policy, variables,
   labels, excluded variables, synthetic-shift rule, and use boundary.
2. **Representation-assumption sheet:** `phi`, shape/dtype, retained/lost
   distinctions, collision, numerical concern, and task assumption.
3. **Baseline comparison:** aligned alternatives, feature availability,
   metric/cost, predicted failures, and limited result.
4. **Evaluation-and-shift plan:** target relation, split, metrics, uncertainty,
   slices, selection rule, and one shift probe.
5. **Objective/training trace:** exact objective, gradient evidence, trace,
   validation observation, versions, and non-claim.
6. **Claim–test–observability matrix:** probes, owners, response boundaries.
7. **Data-authority-impact map:** prohibited uses, privacy/provenance question,
   human decision owner, escalation/appeal question, and unanswered impact.

### Output: Data-Authority-Impact Map

Make artifact 7 independently readable: name the synthetic data boundary,
prohibited uses, authority owner, escalation/appeal path, and one unanswered
impact question. This is a governance boundary, not a deployment decision.

### Output: Machine Learning & Representation Dossier

Submit one connected dossier that integrates the seven required artifacts and
keeps every supported claim next to its uncertainty and non-claim.

### Acceptance rubric

| Evidence | Strong evidence looks like | Repair question |
| --- | --- | --- |
| representation | a concrete retained/lost distinction and collision | “Which two inputs became indistinguishable?” |
| comparison | aligned information/split/metric boundaries | “What did one alternative get to see that another did not?” |
| evaluation | target relation and a shift/uncertainty boundary | “Which population does this number describe?” |
| training | objective and system trace separated from a use claim | “What did a lower loss actually change?” |
| debugging | observables, failure probes, owners, and safe response | “What result would change your next step?” |
| responsibility | explicit human/prohibited-use boundary | “Who may decide, intervene, or decline to use this output?” |

### Supportive oral-defense protocol

The Teaching Assistant conducts a constructive conversation after the dossier.
It is not a pass/fail exam. You may ask for a hint, pause, write instead of
speak, change the toy premise, or correct the summary.

1. Explain one representation choice and one collision or non-collision
   argument.
2. Compare a baseline and learned alternative without relying on a model name.
3. Change one premise—split, shift, target, metric, dtype, or authority—and
   predict what claim changes.
4. Defend one narrow observation and name its strongest non-claim.
5. Decide what evidence M36 needs next.

**Hint ladder:**

1. Point to the relevant field on the evidence card.
2. Name the kind of claim: definition, finite experiment, system contract, or
   use/authority claim.
3. Construct the smallest counterexample: a representation collision, leakage
   path, score/metric mismatch, or shifted context frequency.
4. Restate the narrowest defensible claim together.

### Teaching Assistant prompt — M35

```text
You are Atlas Academy's M35 Teaching Assistant. Guide a supportive oral
defense of the learner's synthetic ML evidence dossier. Begin from their own
representation sheet, baseline comparison, evaluation plan, and trace—not a
quiz score. Ask for a prediction before giving a correction. Use the visible
chat as a readable whiteboard: define notation, use supported display equations
with prose/ASCII fallbacks, and label every Python code fence. Ask the learner
to distinguish a mathematical/objective claim, a finite experiment, a system
observation, and an authority claim. When reasoning is fragile, offer the hint
ladder and a tiny collision, leakage, or shift counterexample. End with a
learner-controlled summary: defended claim, repaired assumption, inspected
evidence, remaining uncertainty, and next M36 retrieval. Never grade, imply
that a score authorizes a decision, claim platform voice settings, or save a
raw transcript.
```

### Study Partner prompt — M35

```text
You are Atlas Academy's M35 Study Partner. Lead a non-grading discussion of
representation, baselines, evaluation, training evidence, and responsible ML
boundaries. Treat the visible chat as an accessible whiteboard: render equations
when supported, define symbols, give a short prose/ASCII fallback when unsure,
and put code in labelled Python fences. Invite the learner to change one
premise (representation, feature availability, split, metric, shift, seed,
precision, or authority) and predict the consequence. Help inspect
AI-generated model claims but never treat them as authority. End with a concise
TA handoff: strongest insight, unresolved misconception, evidence artifact,
and next question. Do not administer the formal oral defense or claim a live
session/Notion write occurred without direct evidence.
```

### Record boundary for designated chats

A learner-controlled summary stays local unless, in the exact configured
designated Teaching Assistant or Study Partner chat, the learner says `records
on` for this substantive session. Only then may the shared policy create at
most one concise note if the configured private destination is reachable.
`pause records` or `off-record` means create nothing; authorization ends with
the session. A prior `records on` never carries into a new or ambiguously
resumed substantive session; records are off until a fresh visible `records on`
in that session. Never save a raw transcript or claim a successful write without
direct evidence. Otherwise, keep the summary in chat or local notes.

### Forward handoff

M36 receives the **ML evidence packet**: representation assumptions, baseline
comparison, evaluation/shift plan, objective/training trace, reproducibility
record, claim/observability matrix, and data-authority boundary. It may ask
which parts a learning-theory result or reliability practice can strengthen;
it may not treat the packet as a generalization proof or deployment approval.

---

## Graduated problem ladder

The ladder connects representation, evaluation, optimization, and authority.
Each step produces an artifact that the next step can inspect rather than
turning a model score into an unexplained conclusion.

### Ladder step 1 — Recognize the information boundary

Identify the representation, target, available-at-inference features,
sampling unit, decision owner, and the distinction between a collision and a
global claim.

### Ladder step 2 — Read a baseline and split trace

Annotate preprocessing, train/validation/fresh partitions, leakage paths,
metric, calibration, and the exact information each comparator received.

### Ladder step 3 — Derive the local condition

Derive one representation collision, bias–variance term, logit loss, margin,
kernel, or calibration relation with the stated assumptions.

### Ladder step 4 — Debug a misleading result

Given a baseline mismatch, leakage, gradient check, calibration plot, or model
card, predict the smallest probe that could falsify the proposed explanation.

### Ladder step 5 — Design an evidence comparison

Design an ablation or model comparison with fixed information, split, tuning
budget, metric, uncertainty, subgroup/shift probe, and accountable use
boundary.

### Ladder step 6 — Transfer and defend

Change one premise—feature availability, entity/time split, dtype, threshold,
shift, or authority—and defend the narrowest retained claim in the ML dossier
and Teaching Assistant chat.

## Confidence-aware diagnostic and spaced review

For each question, choose an answer and record confidence *before* revealing
the explanation. Low confidence creates a review cue, not a failure label.

1. A representation maps two inputs to the same value, but their target labels
   differ. What follows for a deterministic downstream predictor?
   - A. A deeper classifier can always recover the missing distinction.
   - B. No deterministic downstream predictor can distinguish that pair from
     the representation alone.
   - C. The representation is universally useless.
   - D. More training data makes the collision disappear.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: a collision proves a bounded limitation of the declared
map/task pair, not a universal statement about representation.
</details>

2. A learned model outperforms a dummy predictor, but the dummy was denied a
   feature available to the learned model. What is the strongest conclusion?
   - A. The learned architecture is superior.
   - B. The comparison is confounded by an information-boundary mismatch.
   - C. Baselines are not useful in ML.
   - D. The learned model is deployment-ready.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: align information, split, preprocessing, tuning,
metric, and cost before attributing a difference to an architecture.
</details>

3. A transform is fit before the train/test split. Why can this be a problem?
   - A. It necessarily changes every label.
   - B. Held-out feature statistics can influence the fitted representation.
   - C. It proves the model cannot generalize.
   - D. It makes a random seed invalid.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: leakage is an information path; its impact is empirical,
but the evaluation boundary is already compromised.
</details>

4. Analytic and finite-difference gradients agree at one point. What is
   supported?
   - A. The model and data are valid.
   - B. The loss will generalize under shift.
   - C. A local implementation probe for the displayed objective is less
     suspicious.
   - D. The optimizer has converged.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** Repair: gradient agreement is narrow execution evidence.
</details>

5. Two models have equal accuracy but different confidence behavior. Which
   statement is most defensible?
   - A. Accuracy makes calibration irrelevant.
   - B. Calibration asks a different conditional population question and needs
     its own finite evidence.
   - C. The more confident model must be better.
   - D. A reliability diagram authorizes a decision.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: accuracy, probability quality, and decision utility are
different claims.
</details>

6. A carefully written model card has been produced. What remains true?
   - A. Documentation itself grants data permission and decision authority.
   - B. The card can make limits inspectable but does not settle governance,
     consent, or legitimacy.
   - C. Monitoring is no longer needed.
   - D. The model is automatically fair.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Repair: documentation is evidence infrastructure, not a
substitute for accountable human governance.
</details>

### Distractor repair cards (per option)

| Question | Distractor routes (A/B/C/D) | Repair route | Smallest counterexample | Transfer prompt |
| --- | --- | --- | --- | --- |
| Q1 | A: deeper model recovers a lost distinction; B: deterministic downstream predictor cannot separate a collision; C: representation is universally useless; D: more data removes the collision | Inspect the representation/task pair and the information lost | Two opposite labels map to the same representation | Add an invertible feature and predict which claim changes |
| Q2 | A: architecture wins; B: information-boundary mismatch; C: baselines are useless; D: score means deployable | Equalize features, split, preprocessing, tuning, metric, and cost | A weaker model receives an extra predictive feature | Give both models the same feature set and revise attribution |
| Q3 | A: transform changes every label; B: held-out statistics leak into fitting; C: no generalization is proved; D: seed is invalid | Trace the information path across the split | A global scaling parameter uses the test rows | Fit only on train rows and state the retained finite fact |
| Q4 | A: model/data valid; B: shift robustness; C: local implementation probe; D: optimizer converged | Bound the objective, point, dtype, step, and tolerance | A gradient check passes while the target or optimizer is wrong | Change dtype and name the new probe |
| Q5 | A: accuracy makes calibration irrelevant; B: calibration is a separate finite population question; C: confidence is always better; D: plot authorizes action | Separate accuracy, probability quality, utility, and authority | Equal accuracy hides different reliability on a subgroup | Change the subgroup relation and identify the missing evidence |
| Q6 | A: documentation grants permission; B: documentation exposes limits but not governance; C: monitoring is unnecessary; D: model card proves fairness | Keep consent, legitimacy, monitoring, and fairness as separate claims | A complete card lacks a lawful data owner or escalation path | Change the decision owner and restate the retained documentation fact |

Use each row as a conversation card: predict, inspect the counterexample, and
transfer one changed premise before accepting an AI-generated explanation.

**Review schedule:** retrieve one collision, one leakage path, one
objective-to-target gap, and one authority boundary after 1, 3, 7, 14, and 30
days. On days 7 and 30, change a premise and update—do not erase—the evidence
card: hide a feature, cross an entity/time boundary, alter a cost, use a new
dtype/device, or introduce a synthetic shift.

---

## Source and reuse boundary

This workbook uses original Atlas explanations, synthetic examples, diagrams,
and code. The reading routes below were checked on **2026-08-01**; the Session
3 data-relation, fit/validation/fresh-evaluation, and shift routes were
rechecked on **2026-08-02**; and the sampling-unit and stable-logit routes were
rechecked on **2026-08-03**. They guide scope and prerequisite review; they do
not turn this draft into an institutional course or grant permission to copy
third-party prose, figures, datasets, benchmarks, code, weights, or model-card
assets.

### Learner-facing source links

| Source | Session/claim linkage | Reuse boundary |
| --- | --- | --- |
| [Stanford CS229 Machine Learning course materials](https://cs229.stanford.edu/materials.html-full) | Sessions 1–6: learning-problem formulation, representation, learning theory, regularization/model selection, and evaluation. Some course material may require affiliate access. | Link-only/original Atlas examples; do not copy assignments, notes, figures, or solutions. |
| [MIT 6.036 Introduction to Machine Learning](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/) | Sessions 1–5: supervised learning, model selection, neural networks, and evidence-aware ML reasoning. | MIT OCW assets have their own notices; link-only/original Atlas fixtures and explanations. |
| [MIT 18.642 Lecture 23: Introduction to Machine Learning](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/resources/mit18_642_f24_lec23/) and [CMU 10-315 Chapter 1](https://www.cs.cmu.edu/~10315-s24/notes/ciml-v0_99-ch01.pdf) | Session 3: distinguish a named data-generating relation and loss from sampled fitting, validation comparison, and a final held-out observation in the original fixed-partition trace. | Link-only/original Atlas rows and derivations; do not copy lecture slides, prose, examples, or exercises. |
| [MIT 6.7960 Lecture 17: Out-of-Distribution Generalization](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/mit6_7960_f24_lec17.pdf) | Session 3: distinguish same-relation evidence from one named input, label-relation, or measurement shift before claiming robustness. | Link-only/original Atlas shift cards and calculations; the lecture is not evidence that every shift lowers accuracy or that a monitor chooses an intervention. |
| [CMU 10-301/601 Introduction to Machine Learning](https://www.cs.cmu.edu/~mgormley/courses/10601/) | Sessions 2–4: problem formulation, regularization/model selection, and formal guarantees with their limits. | Link-only/original Atlas derivations and cards; do not copy lectures, assignments, figures, datasets, or solutions. |
| [Georgia Tech CS 7641 Machine Learning](https://omscs.gatech.edu/cs-7641-machine-learning) | Sessions 1–6: linked supervised, unsupervised, and sequential-decision practice plus defensible analysis expectations. | Link-only/original Atlas work; it is not a substitute for the course’s reports, feedback, or term-long sequence. |
| [scikit-learn cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html), [common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html), [probability calibration](https://scikit-learn.org/stable/modules/calibration.html), and [Brier score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.brier_score_loss.html) | Session 3: split relations, leakage, finite reliability estimates, and a bounded probabilistic-loss reading. | Link-only/original Atlas examples. Library mechanisms do not choose a target relation, prove population calibration, or guarantee a decision. |
| [UC Davis Bootstrap methods](https://cameron.econ.ucdavis.edu/slides/bootstrap_2022.pdf) and [CMU The Bootstrap](https://www.stat.cmu.edu/~cshalizi/uADA/12/lectures/ch05.pdf) | Session 3: an ordinary resample needs a declared independent unit; clustered or serial dependence requires a separately justified treatment. | Link/cite only; use original Atlas rows and prose. Do not copy slides, figures, examples, or exercises. This route does not choose a valid interval or dependence method for a learner dataset. |
| [PyTorch reproducibility note](https://docs.pytorch.org/docs/stable/notes/randomness.html) | Session 4: bounded execution and reproducibility. | Link-only/original examples. Pin library versions before making a concrete API or runtime claim. |
| [TensorFlow sigmoid cross-entropy with logits](https://www.tensorflow.org/api_docs/python/tf/nn/sigmoid_cross_entropy_with_logits) and [PyTorch BCEWithLogitsLoss](https://docs.pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html) | Session 4: derive a logit-space binary loss, then inspect why fused/stable computation avoids the naïve sigmoid-plus-log path at extreme finite-precision inputs. | Link/cite only; use original Atlas derivation and code. A stable API call does not validate data, objective, calibration, or use. |

For the fuller claim-linked university, standards, framework, and primary
research ledger, consult the instructor-facing [M35 primary-source research
ledger](../source-maps/module35_machine_learning_representation.md).

Before any publication review, reconcile every learner-facing claim, equation,
visual, code sample, and numerical fixture with a canonical source map and
structured module contract. Until then this is an authoring workbook and not a
published learning route, complete accessibility record, live-chat event,
Notion record, or learner-mastery claim.

## Candidate release boundary

Before this candidate can move into the released portal learner route, it still
needs the versioned review-ready delivery map, complete source/claim and
accessibility review, a bounded interaction or equivalent activity,
diagnostic/review evidence, exact CI and deployment provenance, and human
approval. Until then it remains hidden and authoring-only; it is not a
published module, live-chat event, Notion record, or learner-mastery claim.
