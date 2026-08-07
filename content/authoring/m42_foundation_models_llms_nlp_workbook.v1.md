# Module 42 — Foundation Models, LLMs & Natural Language Processing

**Proposed Arc VIII — Learning machines, inference, and foundation models.**
This arc is proposed authoring scope. It is not registered in the course
graph, the Atlas Core route, the manifest, or any mastery gate.

> **Authoring-only private study pack.** This draft may be used only for
> instructor-led study in the designated Codex chats; it is not yet a portal
> learner route. M42 has no course-graph entry, no route position, no contract
> record, no source-map binding, and no release state. Private study does not
> unlock M25 or M26, grant Core credit, satisfy any prerequisite, certify a
> model or evaluation, prove learner mastery, or record a live/Notion session.

**Bridge.** M38 supplied the architecture, M39 the training configuration, M40
the inference vocabulary, and M41 the language of objectives and their
misspecification. M42 asks the question those four make answerable:

> **When a language model is said to "know" or "be able to do" something, what
> observation was made — over which observation space, on which data, under
> which evaluation identity — and what does the claim survive?**

**Primary outcome.** You can read a foundation-model claim end to end: derive
why perplexity is not comparable across tokenizations, state what a
pretraining objective estimates, read a scaling curve as a fitted description
rather than a law, name what contamination invalidates and how, distinguish
in-context conditioning from parameter learning, locate the instruction/data
boundary that prompt injection crosses, and build an evaluation dossier whose
numbers mean something specific.

This is a rigorous foundation for reading model and evaluation claims. It is
not a claim of mastery of LLM training, alignment research, mechanistic
interpretability, model security, or NLP research specialization. Nothing here
requires or reports access to a frontier model, and no experiment here
establishes anything about one.

---

## How to study this module

### The working invariant

> **A language model is a distribution over token sequences under a fixed
> tokenization; a benchmark score is one observation on one sample under one
> prompt format; an "ability" is a claim about a distribution of tasks that no
> finite evaluation establishes. Tokenization, objective, data provenance, and
> evaluation identity must all be named before any two numbers are compared.**

Use this model-claim trace:

~~~text
claim, stated as a sentence someone could be wrong about
→ observation space: tokenizer, vocabulary, and what counts as one item
→ objective the parameters were fitted to, written out
→ data provenance: source, deduplication, cutoff, and overlap with the test set
→ adaptation applied: instruction tuning, preference learning, or conditioning
→ evaluation identity: prompt format, decoding, metric, sample, and n
→ contamination and leakage check, with its result
→ what the claim survives, and the human override for acting on it
~~~

### Evidence labels

| Label | What it can establish | What it does not establish |
| --- | --- | --- |
| **[DEFINITION]** | A tokenization, an objective, a metric, an adaptation procedure, or a retrieval boundary under stated notation. | That the definition matches what a reader assumes the word means. |
| **[DERIVATION]** | A conditional identity: a change-of-space argument, an objective's minimizer, a cost bound, a reparameterization. | That any model realizes it, or that the quantity is worth maximizing. |
| **[FINITE EXPERIMENT]** | An observed score, loss, or output under a named model version, prompt, decoding setting, sample, and seed. | An ability, a capability trend, or behaviour on any other input distribution. |
| **[SYSTEM CONTRACT]** | A pinned model version, tokenizer, context limit, decoding parameter, or retrieval index snapshot. | Semantic correctness or safety. |
| **[GOVERNANCE / AUTHORITY]** | Who may inspect, approve, override, or decline a model-mediated action. | Any empirical or mathematical conclusion. |

### Claim/source trail

| Session | Claims to trace | Research route |
| --- | --- | --- |
| 1 — tokenization and the observation space | `M42-C01` | `S42-01–S42-03` |
| 2 — objectives and what they estimate | `M42-C02` | `S42-04–S42-06` |
| 3 — scale, data, and contamination | `M42-C03`, `M42-C04` | `S42-07–S42-11` |
| 4 — adaptation and preference learning | `M42-C05` | `S42-12–S42-15` |
| 5 — retrieval, tools, context, injection | `M42-C06`, `M42-C07` | `S42-16–S42-19` |
| 6 — NLP tasks, evaluation, authority | `M42-C08`, `M42-C09` | `S42-20–S42-24` |

### One model-claim evidence map

~~~text
Claim, written as a falsifiable sentence:
Tokenizer and vocabulary; what one "item" is in the metric:
Objective the parameters were fitted to, written out:
Data provenance: source, dedup, cutoff, and known overlaps:
Adaptation: what changed — parameters, conditioning, or the decoding rule:
Evaluation identity: prompt format, decoding, metric, sample size:
Contamination check performed, and its result:
Failure modes probed: hallucination, injection, distribution shift:
Strongest supported claim / remaining uncertainty / human override:
~~~

---

## 1. Position in the knowledge system

~~~mermaid
%% atlas-diagram-id: m42-position-map
%% atlas-diagram-title: M42 assembles the whole arc into one model claim
%% atlas-diagram-alt: M31 contributes entropy and KL divergence; M33 contributes formal languages and limits; M35 contributes representation and evaluation discipline; M38 contributes the transformer and generative objectives; M39 contributes training configuration and scale; M40 contributes inference under structure; M41 contributes objectives and reward misspecification. All feed M42, which produces a bounded model-claim and evaluation packet handed to preview-only M25 and eventually M26.
flowchart LR
  M31["M31: entropy, KL"] --> M42["M42: model and evaluation claims"]
  M33["M33: formal languages, limits"] --> M42
  M35["M35: representation, evaluation"] --> M42
  M38["M38: transformers, objectives"] --> M42
  M39["M39: training configuration, scale"] --> M42
  M40["M40: inference under structure"] --> M42
  M41["M41: objectives, misspecification"] --> M42
  M42 --> M25["M25: gated synthesis"]
  M25 --> M26["M26: gated capstone defense"]
~~~

**Text equivalent:** M42 introduces almost no new mathematics. Its difficulty
is that every claim in this area combines an information-theoretic quantity, a
systems constraint, an evaluation protocol, and a governance question at once,
and the four are usually reported as a single number.

### Entry retrieval

1. What does cross-entropy measure, and in what units?
2. Why is an ELBO not a likelihood?
3. What quantity in a transformer grows quadratically in sequence length?
4. What did M41 say about optimizing a proxy for a goal?
5. Why is a benchmark score not evidence about a different distribution?

---

## 2. One synthetic story: the relay corpus

Extend the relay setting a final time. A synthetic corpus is generated from a
declared, fully specified process over a four-symbol alphabet
\(\{a, b, c, d\}\): symbols are emitted by a small declared Markov chain whose
transition table is printed in the module. No people, real text, external
data, models, or services are involved.

Because the generating process is *declared*, its entropy rate is computable
in closed form. That single property makes this corpus the right laboratory:
every claim about "how well a model models the data" can be checked against a
number that is known exactly, which is never true of natural text. Every
result about the relay corpus is a **[FINITE EXPERIMENT]** about a synthetic
process and is not evidence about language.

---

## Session 1 — Tokenization defines the observation space, and therefore the metric

**Launch:** With the Study Partner, take one sentence, tokenize it two ways,
and compute what changes about a per-token metric.

### Core question

**What is the model a distribution over?**

**[DEFINITION]** A tokenizer maps a string to a sequence of symbols from a
finite vocabulary. Byte-pair encoding builds that vocabulary by repeatedly
merging the most frequent adjacent pair in a training corpus, so the
vocabulary is *fitted data*, not a fixed convention.

**[DERIVATION] — perplexity is not comparable across tokenizers.** A model
assigns probability to a token sequence. Per-token cross-entropy is

\[
H_{\text{tok}} = -\frac{1}{T}\sum_{t=1}^{T}\log_2 p(x_t \mid x_{<t}),
\qquad
\text{perplexity} = 2^{H_{\text{tok}}}.
\]

If a tokenizer with a larger vocabulary represents the same text in fewer
tokens, the *same* total log-probability is divided by a smaller \(T\), so
\(H_{\text{tok}}\) rises even though the model assigns the text identical
probability. The total \(-\sum_t \log_2 p\) — bits per *character* or per
*byte* — is tokenization-independent; bits per *token* is not.

So: comparing two models' perplexities is valid only when the tokenization is
identical, and reporting bits-per-byte is what makes cross-tokenizer
comparison meaningful. This is a change-of-units argument, derivable in three
lines, and it invalidates a large fraction of informal comparisons.

**[DERIVATION] — the vocabulary is a compute decision too.** With vocabulary
size \(V\) and width \(d\), the embedding and output projection each hold
\(Vd\) parameters, and the final softmax costs \(O(Vd)\) per position. A larger
vocabulary shortens sequences — which by M38 Session 4 reduces the \(T^2\)
attention term quadratically — while growing the softmax term linearly. The
trade is derivable before any experiment.

**[NON-CLAIM]** Tokens are not words, morphemes, or units of meaning. A
tokenizer fitted on one corpus segments other text — other languages
especially — into more, less meaningful pieces, which is a *measured* property
of the fit rather than a property of the languages.

### Prediction before reveal

1. Two models, same architecture, different tokenizers, report perplexities 12
   and 15. Which models the text better?
2. Does adding tokens to a vocabulary always reduce sequence length?
3. If a metric counts "tokens generated," is it comparable across models?

<details>
<summary>Reveal after recording your answers.</summary>

1. Unknown. Convert both to bits per byte using the tokenizations' compression
   ratios before comparing anything.
2. On the corpus the merges were fitted to, yes on average. On different text
   it can be neutral or worse, because the merges encode that corpus's
   statistics.
3. No, for the same reason as (1). A per-token cost, latency, or limit is a
   statement about that tokenizer's units.

</details>

### Output: Observation-Space Card

~~~text
Tokenizer, vocabulary size, and the corpus its merges were fitted on:
Compression ratio (bytes per token) on the evaluation text:
The metric's unit, and whether it is tokenization-independent:
Vocabulary's parameter and compute cost, derived:
One text type this tokenizer segments poorly, and how you checked:
~~~

---

## Session 2 — What a pretraining objective actually estimates

**Launch:** With the Study Partner, write the objective as an expectation and
say what its minimizer is.

### Core question

**Maximum likelihood over a corpus converges to what?**

**[DERIVATION]** Minimizing cross-entropy against samples from a distribution
\(q\) means minimizing

\[
-\mathbb E_{x\sim q}\left[\log p_\theta(x)\right]
= H(q) + D_{\mathrm{KL}}(q \Vert p_\theta),
\]

where \(H(q)\) does not depend on \(\theta\). So the objective's minimizer is
\(p_\theta = q\): the model is fitted to **the corpus distribution**, not to
truth, usefulness, or any external standard. Every property of the corpus —
its topic mix, its errors, its era, its omissions — is a property the
objective is actively trying to reproduce.

**[DERIVATION] — the coding reading.** \(H(q)\) is the expected number of bits
per symbol under an optimal code (M31). Cross-entropy is therefore the
expected code length using the model's code, and its excess over \(H(q)\) is
exactly the KL divergence. On the relay corpus, whose entropy rate is
computable, the *irreducible* loss is known — so a model reporting a loss
below it has a bug, and one plateauing at it has finished. Natural corpora
provide no such reference point, which is why an absolute loss value there is
uninterpretable.

**[DEFINITION]** Autoregressive modelling factorizes the joint exactly
(M38 Session 5) and maximizes the likelihood of each next token given its
predecessors. Masked modelling instead predicts held-out positions from
bidirectional context, which does not give a valid joint likelihood but yields
representations conditioned on both sides.

| | Autoregressive | Masked |
| --- | --- | --- |
| Valid joint likelihood | yes | no |
| Generation | native, sequential | not native |
| Context available per prediction | left only | both sides |
| Comparable perplexity | yes, at fixed tokenization | not a likelihood |

**[NON-CLAIM]** "Predicting the next token requires understanding" is not a
statement this derivation supports, and neither is its denial. What the
derivation supports is narrower and more useful: the objective's optimum is
the corpus distribution, so any claim beyond that needs its own evidence.

### Output: Objective Card

~~~text
Objective written as an expectation:
Its minimizer, stated as a distribution:
The reference entropy, if known; otherwise "no reference point":
Whether the reported number is a likelihood:
One corpus property the objective is reproducing on purpose:
~~~

---

## Session 3 — Scale, data provenance, and what contamination invalidates

**Launch:** With the Study Partner, take one scaling claim and name the range
it was fitted over, then name what it says outside that range.

### Core question

**A loss curve is straight on a log-log plot. What has been established?**

**[DEFINITION]** An empirical scaling relation fits observed loss as a power
law in parameters, data, or compute, over a *measured range*.

**[DERIVATION]** A power law \(L \approx A\,N^{-\alpha}\) is linear in
log-log coordinates. Fitting a straight line establishes that the observed
points are well described by two constants over the observed interval. It
does not establish a mechanism, and extrapolation beyond the fitted range is
an assumption that the same two constants continue to hold — the ordinary
status of any empirical fit (M30). Reporting a fitted exponent without its
range is reporting half the result.

**[DERIVATION] — the compute allocation trade.** If loss decreases with both
parameters \(N\) and tokens \(D\), and compute is roughly proportional to
\(ND\), then for a fixed compute budget there is an interior optimum
allocation. That an optimum exists follows from the trade-off; *where* it sits
is an empirical constant, and it has been revised as measurements improved.
The structure is derivable; the number is not.

**[NON-CLAIM]** Scaling relations are descriptions of a measured regime. They
predict a loss, not an ability, and loss-to-ability is exactly the step no
scaling fit contains.

### Data provenance and deduplication

**[DERIVATION] — why duplicates matter.** Maximum likelihood fits the *corpus*
distribution (Session 2). A passage repeated \(k\) times is a passage the
objective weights \(k\) times, so duplication is a silent reweighting of the
target distribution. Deduplication is therefore not hygiene; it is a change to
the quantity being estimated.

### Contamination invalidates a score in a specific way

**[DERIVATION]** A held-out evaluation estimates performance on unseen data.
If test items appear in training, the model's response to them is drawn from
the *fitted* distribution rather than an unseen one, so the estimator is
measuring training performance while being reported as generalization. The
resulting bias is upward and its magnitude is unknown without measuring the
overlap.

Note what this does *not* say. Contamination does not make the model worse; it
makes the *number* uninformative about the thing it is presented as measuring.
That is why the fix is a documented overlap check, not a better model.

| Check | What it detects | What it misses |
| --- | --- | --- |
| Exact string match against training data | verbatim inclusion | paraphrase, translation, reformatting |
| \(n\)-gram overlap at a stated \(n\) | near-verbatim inclusion | semantic duplication |
| Held-out set created after the training cutoff | prior-inclusion of that set | leakage through later data collection |
| No check | nothing | everything |

**[NON-CLAIM]** A clean contamination check does not establish that a score
generalizes. It removes one specific reason to disbelieve it, which is a
different and much smaller claim.

### Output: Scale-and-Provenance Card

~~~text
Fitted relation, its exponent, and the measured range:
The claim being made inside the range, and the assumption made outside it:
Corpus sources, cutoff date, and deduplication procedure:
Contamination check performed, at what granularity, with its result:
What the score is now informative about, stated precisely:
~~~

---

## Session 4 — Adaptation: what changes, parameters or conditioning?

**Launch:** With the Study Partner, sort four adaptation techniques by what
they modify, and find the one that modifies nothing.

### Core question

**Instruction tuning, preference learning, and prompting are described in the
same breath. Which of them changes the model?**

**[DEFINITION]** *Instruction tuning* continues supervised training on
(instruction, response) pairs — it changes parameters, with the same
maximum-likelihood objective and a different corpus.

**[DERIVATION] — preference learning.** Given pairwise comparisons, a standard
model assigns probability to a preference through the difference of two latent
scores. Fitting that model yields a reward function \(r_\phi\); a policy is
then optimized to maximize \(r_\phi\) subject to a KL penalty against the
starting model.

Two things follow directly. First, this is M41's structure exactly:
\(r_\phi\) is a *learned proxy*, and optimizing it hard finds where the proxy
and the preference disagree — which is what the KL penalty exists to limit.
Second, the KL term means the objective is not "maximize reward"; it is
"maximize reward while staying near the reference," and the trade-off weight
is part of the objective, not a tuning detail.

**[DERIVATION] — the direct-optimization reparameterization.** Under that
KL-regularized objective, the optimal policy has a closed form proportional to
the reference policy times \(\exp(r/\beta)\). Inverting it expresses the reward
in terms of the optimal and reference policies. Substituting that expression
into the preference model's likelihood yields an objective over the *policy*
alone, with no separate reward model and no sampling loop. That is the whole
derivation: it is an exact reparameterization of the same objective, not a
different goal, and it inherits every property of the preference model it was
derived from.

**[DEFINITION]** *In-context learning* supplies examples in the prompt. No
parameters change. The model's output distribution changes because the
conditioning changed — it is the difference between \(p(y \mid x)\) and
\(p(y \mid x, \text{examples})\), which is conditioning, not learning.

| Technique | What it modifies | Persists across calls? | Objective |
| --- | --- | --- | --- |
| Instruction tuning | parameters | yes | likelihood on a new corpus |
| Reward-model + policy optimization | parameters | yes | proxy reward, KL-constrained |
| Direct preference optimization | parameters | yes | the same objective, reparameterized |
| In-context examples | the conditioning only | **no** | none — inference-time conditioning |

**[NON-CLAIM]** "The model learned from the examples in my prompt" is a
category error under this table. Nothing was learned; a different conditional
was evaluated. The distinction matters because conditioning does not
accumulate, cannot be audited later, and vanishes when the context does.

### Output: Adaptation Card

~~~text
Technique, and exactly what it modifies:
Objective, written out, including any KL or constraint term:
Whether the change persists beyond the current call:
If a proxy reward is involved: what it might score that you do not want:
What an audit of this change would inspect:
~~~

---

## Session 5 — Retrieval, tools, long context, and the instruction/data boundary

**Launch:** With the Study Partner, draw where untrusted text enters a system
and mark every place it could be read as an instruction.

### Core question

**When a model is given documents or tools, what has changed about the claim?**

**[DEFINITION]** Retrieval-augmented generation selects documents by a query
and places them in the context.

**[DERIVATION]** No parameters change: retrieval alters the conditioning set,
exactly as in-context examples do. So its failure modes are the conditioning
kind — a wrong document changes the output, an absent document cannot be used,
and the model has no mechanism for reporting that the retrieval was
inadequate. Attributing an answer to a retrieved document requires evidence
that the document was *used*, which the architecture does not supply.

**[DERIVATION] — the long-context cost.** From M38, attention memory scales as
\(BHT^2\). Quadrupling the context length multiplies the attention memory by
sixteen. Every long-context method targets that term, and the arithmetic —
not the method's name — is what determines whether a length is feasible.

**[DEFINITION]** Tool use has the model emit a call that an external system
executes, returning a result into the context.

**[GOVERNANCE / AUTHORITY]** Two properties follow and neither is optional.
The returned result is *untrusted input* the model did not verify, and the
call itself may have effects the model cannot undo. So a tool boundary needs a
declared effect class — read-only, reversible, irreversible — and irreversible
calls need a human in the path.

### Prompt injection is a boundary failure, not a model defect

**[DERIVATION]** The context is a single sequence. Instructions from the
operator, the user's request, retrieved documents, and tool output all arrive
as tokens in that one sequence, with no channel that distinguishes them. Any
text placed into the context can therefore be read as an instruction, because
the architecture provides no type to mark it otherwise.

This is a *structural* statement about the interface, which is why it cannot
be closed by training alone: training can bias a model against following
injected instructions, but it cannot create a channel the representation does
not have. The mitigations that do address the structure are the ones that act
outside the model — restricting what tools can do, validating tool output
against a schema, and requiring approval for irreversible effects.

| Mitigation | Where it acts | What it can achieve |
| --- | --- | --- |
| Training against injected instructions | inside the model | lowers the rate; no boundary |
| Marking untrusted spans in the prompt | inside the context | a convention the model may ignore |
| Restricting tool capability | outside the model | a real bound on effects |
| Schema-validating tool output | outside the model | a real bound on injected content |
| Human approval for irreversible actions | outside the system | an accountable stop |

**[NON-CLAIM]** No row above is a solution. The first two reduce a rate; the
last three bound a consequence. Reporting an injection defence without saying
which of the two it does is the error this table exists to prevent.

### Output: Boundary Card

~~~text
Every source of text entering the context, listed:
Which sources are untrusted, and how they are distinguished (or are not):
Tool inventory with effect class: read-only / reversible / irreversible:
The mitigation for each, classified as rate-reducing or consequence-bounding:
The human approval point for irreversible effects:
~~~

---

## Session 6 — NLP tasks, evaluation identity, and the claim someone owns

**Launch:** With the Study Partner, take one benchmark number and list every
choice that would change it without changing the model.

### Core question

**What does a task score identify?**

**[DEFINITION]** The classical task families remain the sharpest way to say
what is being measured, because each names its own output space:

| Task | Output space | The evaluation question it forces |
| --- | --- | --- |
| Sequence labeling | one label per token | Which tokenization? Are spans scored exactly or partially? |
| Parsing | a structure over the sentence | Which formalism, and is the score on labelled or unlabelled structure? |
| Machine translation | a string in another language | Which references, and does the metric compare surface forms or meaning? |
| Information extraction | typed records | Are the types the same as the annotator's? |
| Question answering | a span or a string | Extractive or generative, and what counts as correct? |
| Retrieval | a ranking | Cut-off at what \(k\), over which index snapshot? |
| Dialogue | a sequence of turns | Judged by whom, and against what instruction? |

**[DERIVATION] — evaluation identity.** A reported score is a function of the
model *and* of: the prompt format, the decoding rule and its temperature, the
maximum length, the sample and its size, the metric's implementation, and the
normalization applied before scoring. Change any one and the number changes
while the model does not. So a score without those fields does not identify a
measurement, and two such scores cannot be compared.

**[DERIVATION] — sample size.** A score on \(n\) items is a sample proportion,
whose standard error is at most \(1/(2\sqrt n)\). At \(n = 100\) that is 5
percentage points; at \(n = 1000\), 1.6. A two-point difference on a
hundred-item set is inside the noise — an M30 fact that requires no knowledge
of the model at all.

### Hallucination, factuality, and interpretability

**[DEFINITION]** A *hallucination* is fluent output that is unsupported by any
source the system had.

**[DERIVATION]** The objective (Session 2) fits the corpus distribution. It
contains no term for truth, no external referent, and no representation of
"I do not know." Fluent-and-unsupported is therefore an expected output class,
not an anomaly, and reducing it requires adding something the objective lacks:
a source to check against, an abstention option that is scored, or a
verification step outside the model.

**[NON-CLAIM]** Interpretability results — attention patterns, probes,
feature attributions — are observations about a model's internals under a
method. A probe that decodes a property from activations shows the property is
*linearly recoverable* there, not that the model *uses* it. The claim scope is
the method's, and stating it is the whole discipline.

### Output: Model-Claim Dossier

~~~text
Claim as a falsifiable sentence:
Observation space: tokenizer, and the metric's unit:
Objective the parameters were fitted to, and its minimizer:
Provenance: sources, cutoff, dedup, contamination check and result:
Adaptation: what changed — parameters, conditioning, or decoding:
Evaluation identity: prompt, decoding, metric, n, and the standard error:
Untrusted-input inventory and the effect class of every tool:
Failure probes: hallucination, injection, shift — with results:
Strongest supported claim, remaining uncertainty, and the human override:
~~~

### Required artifacts

1. One Observation-Space Card with a bits-per-byte conversion.
2. One Objective Card naming the minimizer.
3. One Scale-and-Provenance Card with the fitted range stated.
4. One Adaptation Card distinguishing parameters from conditioning.
5. One Boundary Card classifying every mitigation.
6. One completed Model-Claim Dossier with a standard error computed.

### Acceptance rubric

| Dimension | Not yet | Adequate | Strong |
| --- | --- | --- | --- |
| Measurement literacy | Compares perplexities | Notes the tokenizer | Converts to bits per byte and explains why per-token fails |
| Objective discipline | Says "trained on text" | Writes the objective | States the minimizer and one corpus property it reproduces |
| Evidence scoping | Reports a benchmark | Names the evaluation identity | Computes the standard error and says which differences are inside it |
| Adaptation clarity | Groups all techniques | Says what each modifies | Explains why in-context conditioning is not learning |
| Boundary discipline | Mentions prompt injection | Names mitigations | Separates rate-reducing from consequence-bounding and names the approval point |

### Supportive oral-defense protocol

Twenty minutes, conversational, no slides. Bring the dossier.

1. Derive why per-token perplexity is not comparable across tokenizers.
2. State the pretraining objective's minimizer and one consequence.
3. Explain precisely what contamination invalidates, and what it does not.
4. Remove one premise — a fixed tokenizer, a clean test set, a bounded tool,
   or a trusted context — and state the strongest remaining claim.
5. Name one thing in your dossier you now believe is under-evidenced.

### Teaching Assistant prompt — M42

> You are my Teaching Assistant for Atlas Module 42 (foundation models, LLMs
> and NLP). Never accept a comparison of two numbers without the tokenizer,
> prompt format, decoding rule, metric, and sample size. When I say a model
> "can" do something, ask what observation was made and over which
> distribution. When I describe an adaptation, ask whether parameters or
> conditioning changed. When I mention a tool, ask its effect class and who
> approves irreversible calls.

### Study Partner prompt — M42

> You are my Study Partner for Atlas Module 42. Take the opposite role on one
> claim per session: argue that perplexity is comparable, that a scaling curve
> predicts an ability, that in-context examples teach the model, that a
> trained-in defence closes the injection boundary. Make me produce the
> derivation or the counterexample.

### Record boundary for designated chats

These chats are study aids. Nothing in them creates course credit, a
prerequisite satisfaction, a contract record, a release record, or a mastery
claim.

### Forward handoff

M42's bounded packet is a *claim* packet: one falsifiable sentence with its
observation space, objective, provenance, evaluation identity, standard error,
untrusted-input inventory, and human override. It is the packet M25 would
consume, through the graph's separate gates.

---

## One-page concept map

M42 keeps four things apart that a benchmark number merges: an observation
space, an objective, an evaluation identity, and an authority to act.

~~~mermaid
%% atlas-diagram-id: m42-concept-map
%% atlas-diagram-title: How M42's ideas depend on one another
%% atlas-diagram-alt: A tokenizer fixes the observation space, so per-token metrics are not comparable across tokenizers; use bits per byte. The objective's minimizer is the corpus distribution, making provenance, deduplication, and contamination load-bearing; scaling relations describe only a measured range. Adaptation changes parameters (instruction tuning, KL-constrained preference learning) or only conditioning (in-context examples, retrieval, tools). The context is one untyped sequence, so injected text can read as instruction. Every route ends at an evaluation identity with a standard error, then an owner.
flowchart TB
  TOK["tokenizer"] --> SPACE["observation space"]
  SPACE --> METRIC["per-token metrics not comparable"]
  METRIC --> BPB["report bits per byte"]
  OBJ["pretraining objective"] --> MIN["minimizer = corpus distribution"]
  MIN --> PROV["provenance, dedup, contamination"]
  SCALE["scaling relation"] -->|"describes a measured range"| PROV
  ADAPT["adaptation"] --> PARAM["changes parameters"]
  ADAPT --> COND["changes conditioning only"]
  PARAM --> PROXY["proxy reward, KL-constrained"]
  COND --> ICL["in-context, retrieval, tools"]
  ICL --> CTX["one untyped sequence"]
  CTX --> INJ["injected text reads as instruction"]
  INJ --> OUT["bound consequences outside the model"]
  PROV --> EVAL["evaluation identity + standard error"]
  PROXY --> EVAL
  BPB --> EVAL
  EVAL --> OWN["a claim someone owns, with an override"]
  OUT --> OWN
~~~

Notice that no arrow runs from a score to an ability. Every result here
constrains a measurement; what the model can be relied upon to do is a claim a
person makes and owns.

## Graduated problem ladder

### Ladder step 1 — Recognize the layer
Label tokenizer, objective, corpus, adaptation, conditioning, evaluation
identity, metric unit, and authority.

### Ladder step 2 — Read a reported result
Extract every field that would change the number without changing the model.

### Ladder step 3 — Derive a comparability argument
Convert two perplexities to a common unit, or show why a comparison is invalid.

### Ladder step 4 — Debug a suspicious claim
Given an implausibly high score, a confident wrong answer, or an agent taking
an unintended action, predict which of contamination, objective mismatch, or
boundary failure caused it.

### Ladder step 5 — Design the evaluation
Specify sample, prompt, decoding, metric, contamination check, failure probes,
and the standard error you will accept.

### Ladder step 6 — Transfer and defend
Remove one premise — a fixed tokenizer, a clean test set, a bounded tool, or a
trusted context — and defend the strongest remaining claim.

## Confidence-aware diagnostic and spaced review

Choose an answer and record confidence before reading its explanation.

1. Two models with different tokenizers report perplexity 12 and 15. The
   correct conclusion is:
   - A. The first models the text better.
   - B. Nothing, until both are converted to a tokenization-independent unit
     such as bits per byte.
   - C. The second has a larger vocabulary.
   - D. They are equally good.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A compares numbers in different units; C
infers a cause from an effect; D asserts equality with no basis. Repair: the
same total log-probability divided by a different token count gives a
different per-token figure.
</details>

2. The minimizer of the pretraining cross-entropy is:
   - A. The true distribution of language.
   - B. The corpus distribution the samples came from.
   - C. A uniform distribution.
   - D. Undefined.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A substitutes an aspiration for the
derivation; C and D misread the objective. Repair: cross-entropy decomposes as
\(H(q) + D_{\mathrm{KL}}(q\Vert p_\theta)\), minimized at \(p_\theta = q\).
</details>

3. A straight line on a log-log loss plot establishes:
   - A. A law of nature.
   - B. That two constants describe the observed points over the measured
     range.
   - C. Future performance.
   - D. A mechanism.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A, C, D each extend a fit beyond what a fit
supports. Repair: report the range with the exponent, or the result is half
stated.
</details>

4. Duplicated training passages matter because:
   - A. They waste compute.
   - B. Maximum likelihood fits the corpus distribution, so duplication
     reweights the target.
   - C. They cause overfitting only.
   - D. They do not matter.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A is true but minor; C names a symptom; D is
false. Repair: deduplication changes the estimand, not just the efficiency.
</details>

5. Test-set contamination:
   - A. Makes the model worse.
   - B. Makes the score uninformative about generalization, with an upward
     bias of unknown size.
   - C. Has no effect if the model is large.
   - D. Is detected by any exact-match check.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A confuses the model with the measurement; C
is unfounded; D ignores paraphrase and reformatting. Repair: the fix is a
documented overlap check at a stated granularity, not a better model.
</details>

6. In-context examples:
   - A. Update the parameters.
   - B. Change the conditioning only, and do not persist beyond the call.
   - C. Are equivalent to fine-tuning.
   - D. Are stored in the model.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A, C, D all assume a persistent change.
Repair: it is the difference between \(p(y\mid x)\) and
\(p(y\mid x,\text{examples})\) — conditioning, not learning.
</details>

7. The KL term in a KL-regularized preference objective:
   - A. Is a regularization detail.
   - B. Is part of the objective: the goal is reward *while staying near the
     reference*, which limits proxy exploitation.
   - C. Speeds up training.
   - D. Makes the reward exact.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A and C treat it as an implementation knob;
D confuses a constraint with correctness. Repair: this is M41's
proxy-optimization structure, with the penalty as the bound on how far the
proxy may be pushed.
</details>

8. Direct preference optimization relative to reward-model-plus-policy
   optimization is:
   - A. A different objective.
   - B. An exact reparameterization of the same KL-regularized objective,
     inheriting the preference model's properties.
   - C. Model-free reinforcement learning.
   - D. Unrelated.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A and D miss the derivation; C imports the
wrong vocabulary. Repair: invert the closed-form optimal policy to express the
reward, then substitute into the preference likelihood.
</details>

9. Retrieval-augmented generation changes:
   - A. The parameters.
   - B. The conditioning set, so its failure modes are conditioning failures
     and attribution needs separate evidence.
   - C. The tokenizer.
   - D. The objective.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A, C, D each name something retrieval does
not touch. Repair: a cited document is not thereby a used document.
</details>

10. Prompt injection is possible because:
    - A. Models are insufficiently trained.
    - B. The context is one untyped sequence, so the architecture provides no
      channel distinguishing instruction from data.
    - C. Of a tokenizer bug.
    - D. Of temperature settings.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A treats a structural gap as a training
shortfall; C and D name unrelated mechanisms. Repair: training can lower the
rate; only measures outside the model bound the consequence.
</details>

11. A 2-point score difference on a 100-item benchmark:
    - A. Is a real improvement.
    - B. Is inside the sampling noise, since the standard error is at most
      about 5 points.
    - C. Requires a larger model to interpret.
    - D. Depends on the tokenizer only.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A ignores the estimator; C and D look for
model-side explanations of a statistics-side fact. Repair:
\(1/(2\sqrt n) = 0.05\) at \(n = 100\), and it needs no knowledge of the model.
</details>

12. A probe that decodes a property from a model's activations shows:
    - A. The model uses that property.
    - B. The property is linearly recoverable from those activations under
      that method.
    - C. The model represents it causally.
    - D. Nothing at all.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Misconception map: A and C promote recoverability into use; D
discards a real observation. Repair: the claim's scope is the method's, and
stating that scope is the discipline.
</details>

### Distractor repair cards (per option)

| Question | Distractor routes (A/B/C/D) | Repair route | Smallest counterexample | Transfer probe |
| --- | --- | --- | --- | --- |
| 1 | Units ignored | Convert to bits per byte | Two tokenizers, same text | Is a per-token cost comparable? |
| 2 | Aspiration for derivation | \(H(q) + D_{\mathrm{KL}}\) | Corpus with a known error | What else is reproduced on purpose? |
| 3 | Fit read as law | Range plus exponent | Extrapolate 10× | What would falsify it? |
| 4 | Efficiency reasoning | Duplication reweights | One passage ×1000 | What is the estimand now? |
| 5 | Model vs measurement | Estimator is biased upward | Paraphrased test item | What granularity did you check? |
| 6 | Persistence assumed | Conditioning, not learning | New session | Can it be audited later? |
| 7 | Constraint as a knob | Part of the objective | Push reward hard | What does the proxy score? |
| 8 | Derivation missed | Exact reparameterization | Same preference data | What does it inherit? |
| 9 | Wrong component | Conditioning set only | Wrong document retrieved | How would you show use? |
| 10 | Training-side reading | One untyped sequence | Document says "ignore prior" | Rate or consequence? |
| 11 | Estimator ignored | \(1/(2\sqrt n)\) | \(n{=}100\) | What \(n\) resolves 2 points? |
| 12 | Recoverability as use | Method-scoped claim | Probe on a frozen layer | What would show use? |

### Spaced review

On days 3, 7, and 30, reconstruct the bits-per-byte argument, the objective's
minimizer, and the injection-boundary argument from memory. On days 7 and 30,
remove one premise and rewrite the strongest remaining claim rather than
erasing the old one.

---

## Visual and code-reading lab — from a number to a claim someone owns

```mermaid
%% atlas-diagram-id: m42-number-to-claim
%% atlas-diagram-title: Score-to-claim route
%% atlas-diagram-alt: The route moves from a reported score through the observation space and metric unit, the objective and its minimizer, data provenance and the contamination check, the evaluation identity with its standard error, the untrusted-input and tool boundary, and finally a claim with a named owner and human override.
flowchart LR
  S["Reported score"] --> O["Observation space + metric unit"]
  O --> J["Objective + its minimizer"]
  J --> P["Provenance + contamination check"]
  P --> E["Evaluation identity + standard error"]
  E --> B["Untrusted-input and tool boundary"]
  B --> C["A claim with an owner and a human override"]
```

### Prose alternative

Refuse to move past the score until the tokenizer and the metric's unit are
named. State the objective and its minimizer, then the corpus provenance and
the contamination check at its stated granularity. Record the full evaluation
identity and compute the standard error. Inventory the untrusted inputs and
the effect class of every tool. Only then is there a claim, and it has an owner
and an override.

### Small claim reading card

```python
def model_claim_note(*, claim, tokenizer, metric_unit, objective_minimizer,
                     provenance, contamination_check, evaluation_identity,
                     standard_error, untrusted_inputs, tool_effect_classes,
                     owner, override):
    return {
        "claim": claim,
        "tokenizer": tokenizer,
        "metric_unit": metric_unit,
        "objective_minimizer": objective_minimizer,
        "provenance": provenance,
        "contamination_check": contamination_check,
        "evaluation_identity": evaluation_identity,
        "standard_error": standard_error,
        "untrusted_inputs": untrusted_inputs,
        "tool_effect_classes": tool_effect_classes,
        "owner": owner,
        "override": override,
    }
```

`contamination_check` and `standard_error` are the two fields that turn a
number into a measurement. A claim missing either has not been evaluated.

## Source and reuse boundary

All explanations, diagrams, examples, derivations, and code in this workbook
are original Atlas authoring material. The reading routes below are recorded
canonical publisher locations as of **2026-08-06**; each must be re-checked
against a live fetch before any review sign-off, and none has been fetched as
part of authoring this draft. They guide scope and derivation review; they do
not grant permission to copy third-party prose, proofs, figures, code,
datasets, benchmarks, weights, or course exercises.

### Learner-facing source links

| Source | Session/claim linkage | Reuse boundary |
| --- | --- | --- |
| [Stanford CS224n Natural Language Processing with Deep Learning](https://web.stanford.edu/class/cs224n/) | Sessions 1–2, 6: tokenization, language modelling, and task families. | Link-only; no copied slides, assignments, or figures. |
| [Jurafsky & Martin, *Speech and Language Processing*](https://web.stanford.edu/~jurafsky/slp3/) | Sessions 1, 6: tokenization, tagging, parsing, translation, and evaluation practice. | Draft chapters are readable online and still not reusable prose; cite only. |
| [MIT 6.S087 Foundation Models & Generative AI](https://ocw.mit.edu/courses/6-s087-foundation-models-and-generative-ai-january-iap-2024/) | Sessions 3–5: pretraining, adaptation, and system framing. | MIT OCW assets carry individual notices; link-only. |
| [Stanford CRFM / HELM evaluation framework](https://crfm.stanford.edu/helm/) | Session 6: evaluation identity, metric inventories, and reporting scope. | Link-only; original Atlas dossier. |
| [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) | Session 5: injection, tool boundaries, and untrusted input. | Link-only; a catalogue is not a control set for any specific system. |
| [NIST AI RMF 1.0](https://doi.org/10.6028/NIST.AI.100-1) | Sessions 5–6: governance, monitoring, and human-control boundaries. | Link-only; voluntary guidance is not legal advice, certification, or authorization. |
| [Hugging Face tokenizers documentation](https://huggingface.co/docs/tokenizers/index) | Session 1: byte-pair merges, vocabulary construction, and compression ratios. | Link-only; pin the tokenizer version before any measurement claim. |

For the fuller original-research, university, and standards source ledger,
consult the instructor-facing M42 primary-source research ledger once it is
written; no such ledger exists yet, and this workbook must not be treated as
source-mapped until it does.

Before publication, reconcile each learner-facing claim, derivation, formula,
source, visual, code fixture, and numerical experiment with a canonical
structured source map, module contract, accessibility evidence, teaching-model
evidence, and release provenance.

## Candidate release boundary

M42 is earlier in the pipeline than M31–M36. Before it could even become a
hidden review candidate it still needs: a course-graph entry with a route
position and prerequisite edges, an arc assignment, a primary-source research
ledger, a structured module contract with evidence records, a bounded
reference model with tests, accessibility evidence for its diagrams, a
companion package, and a project slice.

Until all of that exists it is an authoring draft only. It is not a hidden
review candidate, a published module, a live-chat event, a Notion record, or a
learner-mastery claim.
