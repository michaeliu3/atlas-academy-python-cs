# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# %% [markdown]
# # Bench m24-s6 — performance evidence dossier
#
# **Session 24.6 — Experiment and AI-patch review.** Rungs: **review and verify**
# (primary), debug and defend.
#
# An assistant proposes an optimisation, benchmarks it, and reports a speedup. The
# review question is not "is the number real?" — it usually is. It is **what did
# the experiment vary**, because a benchmark that changed two things at once has
# measured their sum and can attribute it to neither.
#
# This bench varies one manifest field at a time against a matched baseline, and
# finds that the model distinguishes two failures most reviews collapse into
# "needs more data".
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module24_reference import (  # noqa: E402
    ExperimentManifest, classify_observation, validate_conclusion,
    validate_experiment,
)

assert sys.version_info >= (3, 12)

bench(module=24, session=6, emits="performance evidence dossier",
      rungs=["review-and-verify", "debug-and-defend"])

# %% [markdown]
# ## 1. A matched pair

# %%
BASELINE_FIELDS = dict(
    semantic_fingerprint="atlas-rank-v1",
    workload_id="rank-10k-rows",
    runtime=f"CPython {sys.version_info.major}.{sys.version_info.minor}."
            f"{sys.version_info.micro}",
    build="release",
    gc_policy="enabled",
    warmup_policy="discard-first-3",
    metric="wall_clock",
    sample_count=30,
    host_class="laptop-a",
    privacy_review="approved",
)

BASELINE = ExperimentManifest(**BASELINE_FIELDS)
MATCHED = ExperimentManifest(**BASELINE_FIELDS)
matched_review = validate_experiment(BASELINE, MATCHED)

print("every declared dimension of the experiment:")
for field, value in BASELINE_FIELDS.items():
    print(f"  {field:>22}: {value}")

print(f"\nbaseline against an identical candidate: {matched_review.outcome}")

checkpoint("a matched pair is ready to compare",
           matched_review.outcome == "MANIFEST_READY")
checkpoint("with nothing flagged as missing or changed",
           matched_review.missing_or_changed == ())

# %%
predict(
    "Six manifest fields are varied one at a time against that baseline. The model "
    "has two refusal outcomes. Which variations get which — and is 'we only took "
    "two samples' the same kind of problem as 'we changed the GC policy'?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — vary one field at a time

# %%
VARIATIONS = {
    "the patch changed behaviour": ("semantic_fingerprint", "atlas-rank-v2"),
    "measured on a newer runtime": ("runtime", "CPython 3.99.0"),
    "GC disabled for the candidate": ("gc_policy", "disabled"),
    "no warmup on the candidate": ("warmup_policy", "none"),
    "run on a different machine": ("host_class", "server-b"),
    "only two samples": ("sample_count", 2),
}

print(f"{'variation':>32}  {'outcome':>22}  flagged")
reviews = {}
for label, (field, value) in VARIATIONS.items():
    candidate = ExperimentManifest(**{**BASELINE_FIELDS, field: value})
    review = validate_experiment(BASELINE, candidate)
    reviews[label] = {"field": field, "outcome": review.outcome,
                      "flagged": list(review.missing_or_changed),
                      "reason": review.reason}
    print(f"{label:>32}  {review.outcome:>22}  {review.missing_or_changed}")

confounded = [k for k, v in reviews.items() if v["outcome"] == "CONFOUNDED_EXPERIMENT"]
insufficient = [k for k, v in reviews.items()
                if v["outcome"] == "INSUFFICIENT_EVIDENCE"]

print(f"\nconfounded  : {len(confounded)}")
print(f"insufficient: {len(insufficient)}")
print(f"\nevery variation flags exactly the field that was changed: "
      f"{all(v['flagged'] == [v['field']] for v in reviews.values())}")

checkpoint("every variation is refused",
           all(v["outcome"] != "MANIFEST_READY" for v in reviews.values()))
checkpoint("the model uses two different refusals",
           len(confounded) > 0 and len(insufficient) > 0)
checkpoint("a small sample count is INSUFFICIENT, not confounded",
           reviews["only two samples"]["outcome"] == "INSUFFICIENT_EVIDENCE")
checkpoint("a changed control is CONFOUNDED, not insufficient",
           reviews["GC disabled for the candidate"]["outcome"]
           == "CONFOUNDED_EXPERIMENT")
checkpoint("each refusal names the field that caused it",
           all(v["flagged"] == [v["field"]] for v in reviews.values()),
           "the reviewer is told what to fix, not just that something is wrong")

# %%
resolve(
    "Six manifest fields are varied one at a time against that baseline. The model "
    "has two refusal outcomes. Which variations get which — and is 'we only took "
    "two samples' the same kind of problem as 'we changed the GC policy'?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Six manifest fields are varied one at a time against that baseline. The model "
    "has two refusal outcomes. Which variations get which — and is 'we only took "
    "two samples' the same kind of problem as 'we changed the GC policy'?",
    """
    They are not the same kind of problem, and the difference decides what you do
    next.

    **`INSUFFICIENT_EVIDENCE`** — two samples — means the experiment was *sound*
    and underpowered. The design is fine. Run it more times and you get an answer.
    More data fixes it.

    **`CONFOUNDED_EXPERIMENT`** — a changed runtime, GC policy, warmup, or host —
    means the experiment measured two things and cannot separate them. More data
    does **not** fix it; it gives you a tighter estimate of the sum of two effects,
    with the confounded contribution just as unattributable as before, and now
    wearing a narrower confidence interval. That is bench `m17-s6`'s finding in a
    different domain: repetition improves precision and does nothing for validity.

    So "we need more data" is the wrong response to four of these six, and it is
    the response reviews usually give — which is why collapsing both into a single
    "not enough evidence" verdict is expensive. The two demand different work: one
    needs a longer run, the other needs the experiment thrown away and rebuilt.

    The `semantic_fingerprint` case is the one to hold onto, because it is the most
    common failure in an AI-proposed optimisation and it does not look like a
    measurement problem at all. The fingerprint changed, meaning the candidate does
    not compute the same thing as the baseline. It may well be faster. It is not a
    faster version of *this*, and no benchmark comparing them is measuring an
    optimisation — it is measuring two different programs. An assistant that
    reorders operations, skips a validation, or relaxes a numeric tolerance
    produces exactly this, reports a genuine speedup, and is not lying.

    Notice that every refusal names the single field responsible. A review that
    says "confounded" sends someone to re-read the whole manifest. A review that
    says `('gc_policy',)` sends them to one line. Same verdict, and the second one
    is actionable — the same distinction bench `m23-s1` found between a syntax
    error and a span.

    Section 3 adds the other half, and it turns on something easy to miss: the
    model classifies by **metric name**. `traced_peak`, `shallow_size`,
    `process_rss`, and `bytecode_card` each demand a *different* evidence label,
    because they are answers to different questions — which is bench `m24-s4`'s
    finding, encoded as a type rather than left to the reader.

    And `wall_clock` — the most natural-sounding metric in the list — is not one
    the model recognises, so it comes back as `HYPOTHESIS` with no required
    evidence label at all. That is not a gap in the model. "How long did it take?"
    names no measurement method: not the timer, not the warmup, not what is
    included. Until a method is named it is a question, and the model declines to
    let a question wear the label of a result.

    Then, even with a properly labelled measurement, every proposed conclusion
    scope comes back `DECISION_DEFER` — including the narrowest one. The model will
    not convert a measurement into a decision at all, and it returns a *next
    falsifier* with each refusal: the experiment that would settle it. A refusal
    that names its own remedy is worth more than a verdict.
    """,
)

# %% [markdown]
# ## 3. Verify — a clean experiment still bounds its conclusion

# %%
METRICS = ("semantic_fixture", "shallow_size", "traced_peak", "process_rss",
           "bytecode_card", "wall_clock")

print(f"{'metric':>18}  {'label':>14}  {'evidence it would require':>24}")
observations = {}
for metric in METRICS:
    observation = classify_observation(metric)
    observations[metric] = observation
    print(f"{metric:>18}  {observation.label:>14}  "
          f"{str(observation.required_evidence_label):>24}")

measured = observations["traced_peak"]
hypothesis = observations["wall_clock"]
required_labels = {o.required_evidence_label for o in observations.values()
                   if o.required_evidence_label}

print(f"\nrecognised metrics demand {len(required_labels)} DIFFERENT evidence "
      f"labels: {sorted(required_labels)}")
print(f"'wall_clock' is not a metric this model names, so it is "
      f"{hypothesis.label} — a question, not a result.")
print(f"\ntraced_peak establishes: {measured.establishes}")
print(f"traced_peak excludes   : {measured.excludes}")

SCOPES = {
    "this workload, this host, this runtime": measured,
    "Python is faster than it was": measured,
    "this patch improves production latency": measured,
}

print(f"\n{'proposed scope':>42}  {'decision':>16}")
decisions = {}
for scope, observation in SCOPES.items():
    decision = validate_conclusion(observation, scope)
    decisions[scope] = {"outcome": decision.outcome,
                        "reason": decision.reason,
                        "nextFalsifier": decision.next_falsifier}
    print(f"{scope:>42}  {decision.outcome:>16}")

print(f"\nlimitation carried on every decision: "
      f"{validate_conclusion(measured, 'x').limitation[:100]}")

checkpoint("an unnamed metric is a hypothesis, not a result",
           hypothesis.label == "HYPOTHESIS"
           and hypothesis.required_evidence_label is None,
           "'wall_clock' sounds like a measurement and names no method")
checkpoint("each recognised metric demands its own evidence label",
           len(required_labels) > 1, f"{sorted(required_labels)}")
checkpoint("a shallow size and a traced peak are not interchangeable",
           observations["shallow_size"].required_evidence_label
           != observations["traced_peak"].required_evidence_label,
           "bench m24-s4 measured why: they answer different questions")
checkpoint("a hypothesis excludes being read as a measurement result",
           "measurement result" in hypothesis.excludes
           and "implementation guarantee" in hypothesis.excludes,
           f"{hypothesis.excludes} — the model says what the label may NOT be "
           f"mistaken for")
checkpoint("and a real measurement excludes a different set",
           set(measured.excludes) != set(hypothesis.excludes),
           f"traced_peak excludes {measured.excludes} — RSS and native "
           f"allocation, exactly the blind spot bench m24-s4 measured")
checkpoint("every proposed scope is deferred rather than granted",
           all(d["outcome"] == "DECISION_DEFER" for d in decisions.values()),
           "including the narrow one — the model will not convert a measurement "
           "into a decision on its own")
checkpoint("and each decision carries a next falsifier",
           all(d["nextFalsifier"] for d in decisions.values()),
           "a refusal that names the experiment that would settle it")

# %% [markdown]
# ## 4. Review and verify — triage six review verdicts

# %%
FINDINGS = {
    "a": "The candidate ran on a newer Python than the baseline.",
    "b": "Both manifests match; only 3 samples were taken.",
    "c": "The candidate skips a bounds check the baseline performs.",
    "d": "Both manifests match; 200 samples; the candidate is 12% faster.",
}
for key, text in FINDINGS.items():
    print(f"{key}. {text}")


def fixed_by_more_samples(key: str) -> bool:
    """True when re-running the same experiment more times resolves it."""
    raise NotImplementedError("Separate underpowered from confounded")


# %%
check("fixed_by_more_samples", fixed_by_more_samples,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), False)])
print()
print("(c) is the one that gets waved through, because the number is real and the")
print("patch is genuinely faster. It is faster at doing something else. (d) is")
print("'False' for a different reason — nothing needs fixing, and more samples")
print("still would not extend the claim past this host and this workload.")

# %% [markdown]
# ## 5. The evidence dossier

# %%
EVIDENCE_DOSSIER = """
The proposed change, and the semantic fingerprint of each side:
Every dimension held fixed, and every one that moved:
The verdict, with which of the two refusals it is and why that matters:
What more samples would fix here, and what they would not:
The observation label, and what it excludes:
The claim I will defend, with its scope stated in full:
The next falsifier — the experiment that would change my mind:
"""
print(EVIDENCE_DOSSIER)

# %%
claim("REVIEW VERDICT", EVIDENCE_DOSSIER)

claim(
    "LOCAL REFERENCE RESULT",
    f"Against a matched baseline that validates as MANIFEST_READY, varying each of "
    f"{len(VARIATIONS)} manifest fields one at a time is refused every time, and "
    f"the model splits the refusals: {len(confounded)} as CONFOUNDED_EXPERIMENT "
    f"(semantic fingerprint, runtime, GC policy, warmup, host) and "
    f"{len(insufficient)} as INSUFFICIENT_EVIDENCE (sample count). Each refusal "
    f"names exactly the field that changed. Separately, {len(METRICS) - 1} recognised "
    f"metrics demand {len(required_labels)} distinct evidence labels while "
    f"'wall_clock' classifies as {hypothesis.label} with no required label, and all "
    f"{len(SCOPES)} proposed conclusion scopes — including the narrowest — return "
    f"DECISION_DEFER with a next falsifier.",
    support={"baseline": BASELINE_FIELDS,
             "matchedOutcome": matched_review.outcome,
             "variations": reviews,
             "confounded": confounded,
             "insufficient": insufficient,
             "observations": {k: {"label": v.label, "requiredEvidenceLabel": v.required_evidence_label} for k, v in observations.items()},
             "conclusions": decisions},
)

non_claim(
    "Nothing was benchmarked here. These are declared manifests handed to a "
    "declared review procedure, so the result establishes what that procedure "
    "distinguishes — underpowered from confounded, hypothesis from measurement, "
    "measurement from decision — and not that any real optimisation is or is not "
    "sound. The manifest's dimensions are the ones this model happens to name; a "
    "real experiment can be confounded by CPU frequency scaling, thermal state, "
    "background load, ASLR, or allocator state, none of which appear as fields "
    "here. A MANIFEST_READY verdict means the declared dimensions match, not that "
    "the experiment is valid."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Two refusals demanded different work. Write the triage question that
#    distinguishes them, in a form usable on any benchmark result.
# 2. The semantic fingerprint case reported a real speedup. Name what was actually
#    compared, and why the reviewer cannot rely on the number being honest.
# 3. Bench `m17-s6` found that repetition does not fix a confounded design. State
#    what this bench adds to that, and what both leave to the reviewer.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module24_reference.py` — `validate_experiment`,
# `classify_observation`, `validate_conclusion`, `ExperimentManifest`. Not
# reimplemented. The one-field-at-a-time variations and the triage sort are this
# bench's own.
