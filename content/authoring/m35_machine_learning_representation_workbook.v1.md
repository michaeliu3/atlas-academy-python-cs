# Module 35 — Machine Learning & Representation

**Arc VII — Formal limits, classical AI, and learning systems**

> **Authoring-only private study pack.** This is a connected draft for
> instructor-led study in the designated Codex chats. M35 remains hidden from
> the Atlas reader until its canonical source map, contract, accessibility
> review, release evidence, and prerequisite evidence are complete. Private
> study is not a portal unlock, Core credit, published/reviewed release, or
> mastery claim; nothing in this workbook unlocks M35, M36, M25, or M26.

**Bridge.** M28 made representation a geometrical choice with numerical
consequences. M30 made an evaluation result conditional on a data-generating
process. M31 separated an objective from a decision. M32 made execution,
precision, randomness, and environment part of the evidence. M34 required a
problem formulation and a classical baseline before reaching for a learned
model. M35 connects those ideas into one disciplined question:

> **What does a trained model actually earn the right to claim?**

**Primary outcome.** You can read a machine-learning proposal from first
principles: name the data relation, representation, baseline, objective,
training system, evaluation population, uncertainty and shift boundary, and
human authority boundary. You can inspect an AI-generated model claim, trace
the code or architecture that produces it, design a counterexample or failure
probe, and make a limited recommendation without treating a score as a
decision.

This is an advanced connected first pass, not a claim of production-ML,
causal-inference, fairness, privacy, or deep-learning mastery. It deliberately
uses small synthetic fixtures. The intended skill is **reader, reviewer, and
design readiness**: reconstruct the argument, locate its assumptions, and ask
for the next evidence rather than blindly typing a training loop.

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

Throughout the module, a team studies a **synthetic signal-routing toy**. A
fictional simulator emits two binary fields:

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

## 3. Session 1 — Representation, inductive bias, and what a model can discard

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

**Reveal:** no deterministic downstream classifier sees different inputs after
the collision. A nonlinear `g` can divide `Z` differently; it cannot recover
a bit that `phi` erased.

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

## 4. Session 2 — Formulation and classical baselines before learned models

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

**Reveal:** the alternatives have different information budgets. The result
confounds architecture with access to a task-relevant field.

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

---

## 5. Session 3 — Data relations, splits, metrics, calibration, and shift

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

**Reveal:** in A, the transform’s `mean` depends on every row, including
held-out rows. The model has not read held-out labels, but the evaluation
boundary is still contaminated. B has a cleaner boundary for this transform.
Neither snippet proves that a random row split represents a future relation:
time, entities, geography, retries, or correlated records can still cross the
boundary.

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
| Proper score/loss | How did assigned probabilities align with labels under its convention? | decision utility and population stability |
| Reliability table | Do named probability bins roughly align with observed frequencies? | sample size, binning, selection, and deployment shift |
| Slice metric | Which declared subgroup/time/condition differs in this data? | causal reason, legitimacy, and unseen slices |

### Shift probe

Keep the toy label rule fixed, but change the frequency of `context=1` in a
synthetic future split. Predict whether an accuracy, calibration, or threshold
metric could change. Then state what this single perturbation does **not**
identify: real-world robustness, causal mechanism, or all possible shifts.

### Output: Evaluation-and-Shift Plan

Record a **Plan** with target relation, unit of independence, split rule,
preprocessing-fit boundary, metric suite, uncertainty method, slices, model
selection/stopping rule, one predeclared synthetic shift, and one explicit
inference boundary. Include the sentence:

> “This evaluation estimates behavior under ___; it does not establish ___.”

---

## 6. Session 4 — Objectives, autodiff, optimization, and training systems

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

**Reveal:** only the narrow implementation statement is supported. Very small
`h` can also suffer cancellation; agreement is a probe, not a theorem.

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

Create two linked artifacts:

- an **objective trace**: inputs, representation, loss, regularizer, optimizer,
  step rule, gradient/finite-difference probe, observed training and validation
  quantities, and unresolved objective-to-target gap;
- a **training-systems reproducibility card** using the table above.

---

## 7. Session 5 — ML debugging, observability, and evidence that can fail usefully

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

**Reveal:** examples include generator/data shift, slicing/metric error,
representation interaction, threshold selection, or a genuine model weakness.
The observation narrows the next probe; it does not name the cause.

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

## 8. Session 6 — Responsible ML representation dossier and oral defense

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

### Forward handoff

M36 receives the **ML evidence packet**: representation assumptions, baseline
comparison, evaluation/shift plan, objective/training trace, reproducibility
record, claim/observability matrix, and data-authority boundary. It may ask
which parts a learning-theory result or reliability practice can strengthen;
it may not treat the packet as a generalization proof or deployment approval.

---

## 9. Confidence-aware diagnostic and spaced review

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

**Review schedule:** retrieve one collision, one leakage path, one
objective-to-target gap, and one authority boundary after 1, 3, 7, 14, and 30
days. On days 7 and 30, change a premise and update—do not erase—the evidence
card: hide a feature, cross an entity/time boundary, alter a cost, use a new
dtype/device, or introduce a synthetic shift.

---

## Source and reuse boundary

This workbook uses original Atlas explanations, synthetic examples, diagrams,
and code. The reading routes below were checked on **2026-08-01**. They guide
scope and prerequisite review; they do not turn this draft into an institutional
course or grant permission to copy third-party prose, figures, datasets,
benchmarks, code, weights, or model-card assets.

### Learner-facing source links

| Source | Session/claim linkage | Reuse boundary |
| --- | --- | --- |
| [Stanford CS229 Machine Learning](https://cs229.stanford.edu/) | Sessions 1–6: learning-problem formulation, representation, generalization, evaluation, and ML prerequisites. Some course material may require affiliate access. | Link-only/original Atlas examples; do not copy assignments, notes, figures, or solutions. |
| [MIT 6.036 Introduction to Machine Learning](https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/) | Sessions 1–5: supervised learning, model selection, neural networks, and evidence-aware ML reasoning. | MIT OCW assets have their own notices; link-only/original Atlas fixtures and explanations. |
| [Georgia Tech CS 7641 Machine Learning](https://omscs.gatech.edu/cs-7641-machine-learning) | Sessions 1–6: linked supervised, unsupervised, and sequential-decision practice plus defensible analysis expectations. | Link-only/original Atlas work; it is not a substitute for the course’s reports, feedback, or term-long sequence. |
| [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) and [PyTorch reproducibility note](https://docs.pytorch.org/docs/stable/notes/randomness.html) | Sessions 2–5: leakage, preprocessing, training/evaluation boundaries, and bounded reproducibility. | Link-only/original examples. Pin library versions before making a concrete API or runtime claim. |

For the fuller claim-linked university, standards, framework, and primary
research ledger, consult the instructor-facing [M35 primary-source research
ledger](../source-maps/module35_machine_learning_statistical_learning_ai_eval_source_research.md).

Before any publication review, reconcile every learner-facing claim, equation,
visual, code sample, and numerical fixture with a canonical source map and
structured module contract. Until then this is an authoring workbook and not a
published learning route, complete accessibility record, live-chat event,
Notion record, or learner-mastery claim.
