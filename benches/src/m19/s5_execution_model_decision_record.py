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
# # Bench m19-s5 — execution-model decision record
#
# **Session 19.5 — Choose the Python execution model from first principles.**
# Rungs: **review and verify** (primary), recognize.
#
# "CPU-bound, so use processes, so four workers means about four times faster" is
# a chain of three inferences. The first two are defensible from a workload
# profile. The third is not, and this bench puts a number on how far off it is.
#
# It also asks a question that is easy to miss: across every profile the reference
# model accepts, how many of its recommendations come without a requirement to
# measure?
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module19_reference import (  # noqa: E402
    WorkloadProfile, choose_execution_model, parallelism_budget,
)

assert sys.version_info >= (3, 12)

bench(module=19, session=5, emits="execution-model decision record",
      rungs=["review-and-verify", "recognize"])

# %% [markdown]
# ## 1. Profiles, and what the model recommends

# %%
BASE = dict(dominant_work="python-cpu", gil_enabled=True,
            native_code_releases_gil=False, payload_picklable=True,
            isolation_acceptable=True, free_threaded_extensions_audited=False,
            interpreter_pool_available=False)

PROFILES = {
    "python-cpu, GIL on": {},
    "native-cpu that releases the GIL": {"dominant_work": "native-cpu",
                                         "native_code_releases_gil": True},
    "blocking I/O": {"dominant_work": "blocking-io"},
    "python-cpu, GIL off, extensions audited": {"gil_enabled": False,
                                                "free_threaded_extensions_audited": True},
    "python-cpu, payload not picklable": {"payload_picklable": False},
    "python-cpu, isolation unacceptable": {"isolation_acceptable": False},
}

choices = {label: choose_execution_model(WorkloadProfile(**{**BASE, **overrides}))
           for label, overrides in PROFILES.items()}

print(f"{'profile':>42}  {'primary':>10}  {'ranked':>22}  {'measure':>7}")
for label, choice in choices.items():
    print(f"{label:>42}  {choice.primary_model:>10}  "
          f"{str(choice.ranked_candidates):>22}  "
          f"{str(choice.measurement_required):>7}")

always_measure = all(choice.measurement_required for choice in choices.values())
checkpoint("the recommendation changes with the profile",
           len({c.primary_model for c in choices.values()}) > 2)
checkpoint("every recommendation still requires measurement", always_measure,
           "including the ones where the reasoning looks airtight")

# %%
predict(
    "Atlas indexing is python-cpu work, so the model says processes. The job is "
    "100 work units, 20% of it unavoidably serial, run on 4 workers. What speedup "
    "ceiling does that give?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — the ceiling, against the intuition

# %%
WORK, SPAN, SERIAL = 100.0, 10.0, 0.2
budget = parallelism_budget(work_units=WORK, span_units=SPAN, workers=4,
                            serial_fraction=SERIAL)

print(f"work {WORK}, span {SPAN}, serial fraction {SERIAL:.0%}, workers 4\n")
print(f"  max parallelism (work/span)   : {budget.max_parallelism}")
print(f"  work-span ceiling             : {budget.work_span_speedup_ceiling}")
print(f"  Amdahl ceiling                : {budget.amdahl_speedup_ceiling}")
print(f"  combined ceiling              : {budget.combined_speedup_ceiling}")
print(f"  lower-bound time units        : {budget.lower_bound_time_units}")
print(f"  measurement still required    : {budget.measurement_required}")

naive = 4.0
print(f"\n  'four workers, so four times faster' : {naive}x")
print(f"  ceiling this model actually permits  : {budget.combined_speedup_ceiling}x")
print(f"  overstatement                        : "
      f"{naive / budget.combined_speedup_ceiling:.2f}x")

checkpoint("the ceiling is below the worker count",
           budget.combined_speedup_ceiling < 4.0)
checkpoint("the binding constraint is the serial fraction, not the worker count",
           budget.amdahl_speedup_ceiling < budget.work_span_speedup_ceiling,
           f"{budget.amdahl_speedup_ceiling} against "
           f"{budget.work_span_speedup_ceiling}")
checkpoint("the model demands measurement even so", budget.measurement_required)

# %% [markdown]
# ### Add workers until it stops helping

# %%
print(f"{'workers':>8}  {'work-span':>10}  {'Amdahl':>7}  {'combined':>9}")
sweep = {}
for workers in (1, 2, 4, 8, 16, 64, 256):
    row = parallelism_budget(work_units=WORK, span_units=SPAN, workers=workers,
                             serial_fraction=SERIAL)
    sweep[workers] = row.combined_speedup_ceiling
    print(f"{workers:>8}  {row.work_span_speedup_ceiling:>10.2f}  "
          f"{row.amdahl_speedup_ceiling:>7.2f}  {row.combined_speedup_ceiling:>9.2f}")

asymptote = 1.0 / SERIAL
print(f"\n  1 / serial fraction = {asymptote:.1f}x — the ceiling on the ceiling")
print(f"  256 workers reaches {sweep[256]:.2f}x")

checkpoint("more workers stop helping well before the worker count",
           sweep[256] < 16)
checkpoint("the sequence approaches 1 / serial fraction",
           abs(sweep[256] - asymptote) < 0.2,
           f"{sweep[256]:.2f} against {asymptote:.1f}")
checkpoint("quadrupling the workers from 64 to 256 buys almost nothing",
           sweep[256] - sweep[64] < 0.25,
           f"{sweep[64]:.2f} -> {sweep[256]:.2f}: "
           f"{sweep[256] - sweep[64]:.2f}x for 192 more workers")

# %%
resolve(
    "Atlas indexing is python-cpu work, so the model says processes. The job is "
    "100 work units, 20% of it unavoidably serial, run on 4 workers. What speedup "
    "ceiling does that give?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Atlas indexing is python-cpu work, so the model says processes. The job is "
    "100 work units, 20% of it unavoidably serial, run on 4 workers. What speedup "
    "ceiling does that give?",
    """
    2.5×. Not 4×, and no amount of hardware moves it past 5×.

    The arithmetic is Amdahl's, and it is worth doing by hand once because the
    result is so much worse than it feels. With 20% serial, four workers gives
    `1 / (0.2 + 0.8/4) = 1 / 0.4 = 2.5`. The serial fifth of the job did not get
    faster, and it now accounts for half the remaining runtime. Add workers and it
    accounts for more of it: the sweep above reaches 4.71× at 64 workers and 4.92×
    at 256, converging on `1/0.2 = 5×` and never arriving.

    So sixty-four workers buys you less than five times, and the 192 after that
    buy 0.21×. That is the shape of the curve, and it is why "we'll parallelise it"
    is a plan that needs a number attached before anyone starts.

    Two ceilings are in play and it matters which one binds. The **work-span**
    ceiling is structural — this job has 100 units of work and a critical path of
    10, so no scheduler can beat 10× even with unlimited workers. The **Amdahl**
    ceiling is 5×. The binding constraint here is Amdahl's, which means buying more
    parallelism is the wrong move; shrinking the serial fraction is the only thing
    that raises the ceiling at all.

    Now the part that is easy to skip. Every profile in section 1 came back with
    `measurement_required=True` — including the ones whose reasoning is airtight,
    like blocking I/O to threads. The model is not hedging. It is drawing a line:
    a workload profile can tell you which execution model is *not disqualified*,
    and that is a genuinely useful thing to know before you write code. It cannot
    tell you how fast the result will be, because that depends on payload sizes,
    pickling costs, process startup, cache behaviour, and the actual serial
    fraction — none of which appear in the profile.

    Notice that the profile with an unpicklable payload returns `redesign` and an
    **empty** candidate list. That is the healthiest output in the table. The model
    was asked to choose between execution strategies and answered that none of them
    apply until something upstream changes. A recommender that always names a
    winner cannot say that, and would have picked the least-bad option and let you
    discover the pickling failure at runtime.

    The decision record therefore has three parts, and only the first comes from
    the profile: which models are admissible, what ceiling the structure permits,
    and what you measured. Any sentence combining them into a predicted speedup
    without the third part is bench `m12-s6`'s failure in a different costume — a
    narrow instrument's result, widened in the summary.
    """,
)

# %% [markdown]
# ## 3. Recognize — what the profile decides, and what it does not

# %%
QUESTIONS = {
    "a": "Are threads disqualified for this workload?",
    "b": "Will processes be faster than threads here?",
    "c": "What is the best speedup the structure permits?",
    "d": "Is four workers the right number?",
}
for key, text in QUESTIONS.items():
    print(f"{key}. {text}")


def answerable_without_measuring(key: str) -> bool:
    """True when the profile and the budget alone settle this."""
    raise NotImplementedError("Sort the questions by what the evidence reaches")


# %%
check("answerable_without_measuring", answerable_without_measuring,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), False)])
print()
print("(a) and (c) are structural: one comes from the profile, one from the work,")
print("span, and serial fraction. (b) and (d) are empirical, and the model says so")
print("in a field named measurement_required rather than in a footnote.")

# %% [markdown]
# ## 4. The decision record

# %%
DECISION_RECORD = """
The workload profile, field by field, with how each was determined:
The admissible execution models, and what disqualified the others:
The structural ceiling, with the constraint that binds:
The speedup I would have claimed before computing it:
What I must measure before claiming any speedup at all:
The sentence I am willing to defend, containing no unmeasured number:
"""
print(DECISION_RECORD)

# %%
claim("REVIEW VERDICT", DECISION_RECORD)

claim(
    "LOCAL REFERENCE RESULT",
    f"Across {len(PROFILES)} workload profiles the reference model recommends "
    f"{len({c.primary_model for c in choices.values()})} distinct primary models "
    f"and marks measurement_required on every one of them, returning an empty "
    f"candidate list rather than a best guess when the payload is not picklable. "
    f"For {WORK} work units with span {SPAN} and a {SERIAL:.0%} serial fraction, 4 "
    f"workers give a combined ceiling of {budget.combined_speedup_ceiling}x — "
    f"{naive / budget.combined_speedup_ceiling:.2f}x below the worker count — and "
    f"256 workers reach only {sweep[256]:.2f}x against an asymptote of "
    f"{asymptote:.1f}x.",
    support={"choices": {label: {"primary": c.primary_model,
                                 "ranked": list(c.ranked_candidates),
                                 "measurementRequired": c.measurement_required}
                         for label, c in choices.items()},
             "budget": {"work": WORK, "span": SPAN, "serialFraction": SERIAL,
                        "workers": 4,
                        "maxParallelism": budget.max_parallelism,
                        "workSpanCeiling": budget.work_span_speedup_ceiling,
                        "amdahlCeiling": budget.amdahl_speedup_ceiling,
                        "combinedCeiling": budget.combined_speedup_ceiling},
             "workerSweep": {str(k): v for k, v in sweep.items()}},
)

non_claim(
    "These are algebraic ceilings over declared work, span, and serial-fraction "
    "figures, and recommendations from a declared profile. Nothing here was timed. "
    "The ceilings are upper bounds that no implementation can exceed and that most "
    "will fall well short of; they do not account for process startup, pickling "
    "cost, memory bandwidth, or scheduler overhead, and the serial fraction itself "
    "was declared rather than measured — which is the input a real decision record "
    "would have to justify first."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. Every recommendation carried `measurement_required`. Write what that field
#    would have to contain to be worth more than a disclaimer.
# 2. One profile returned an empty candidate list. Name what that costs a
#    recommender and what it buys a reviewer.
# 3. Bench `m12-s6` audited a clean report widened into an unsupported summary.
#    State the sentence that would do the same damage to this bench's numbers.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module19_reference.py` — `choose_execution_model`,
# `WorkloadProfile`, `parallelism_budget`. Not reimplemented. The profile set, the
# worker sweep, and the question sort are this bench's own.
