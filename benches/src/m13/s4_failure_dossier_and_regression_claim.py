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
# # Bench m13-s4 — M13 failure dossier and regression claim
#
# **Session 13.4 — From traceback to causal mechanism.** Rungs: **trace**
# (primary), debug and defend.
#
# The session's encounter: *ranking fails far downstream from accepted `NaN`.*
# Its learner actions include ranking at least three hypotheses and choosing **one
# discriminating observation**.
#
# This bench probes `locate_causal_repair_boundary` from the module's reference
# model to measure the distance between where the contract was first contradicted
# and where anything noticed. Then it does the part the session actually grades:
# it computes, for each candidate observation, which hypotheses that observation
# could rule out — and finds that no single one rules out enough.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module13_reference import (  # noqa: E402
    CausalStep, RunSignal, inspect_terminal_contract, locate_causal_repair_boundary,
)

assert sys.version_info >= (3, 12)

bench(module=13, session=4, emits="M13 failure dossier and regression claim",
      rungs=["trace", "debug-and-defend"])

# %% [markdown]
# ## 1. The symptom, and the trace behind it
#
# **Symptom:** the ranked report lists rows in an order that changes between runs,
# and the last run ended in a `TypeError` inside the renderer.
#
# The traceback names the renderer. Below is the trace an analyst assembled after
# the fact — each step labelled with who owns it and whether it contradicts the
# stated contract. `contradicts_contract` is *supplied evidence*, not automatic
# discovery; the reference model is explicit about that.

# %%
TRACE = (
    CausalStep(owner="csv-source", kind="claim",
               observation="the file declares a numeric score column",
               contradicts_contract=False),
    CausalStep(owner="row-parser", kind="mutation",
               observation="float('nan') is produced for an empty score cell; "
                           "the contract requires a finite score",
               contradicts_contract=True),
    CausalStep(owner="validator", kind="claim",
               observation="required keys are present, so the row is passed on; "
                           "finiteness is not among the checks",
               contradicts_contract=False),
    CausalStep(owner="ranker", kind="mutation",
               observation="comparisons against NaN are all False, so the sort "
                           "produces an order that depends on input order",
               contradicts_contract=False),
    CausalStep(owner="report-renderer", kind="detection",
               observation="TypeError raised while formatting a score; "
                           "this is where the traceback points",
               contradicts_contract=False),
)

print(f"{'#':>2}  {'owner':>16}  {'kind':>10}  {'contradicts':>11}")
for index, step in enumerate(TRACE):
    print(f"{index:>2}  {step.owner:>16}  {step.kind:>10}  "
          f"{str(step.contradicts_contract):>11}")

# %%
predict(
    "The traceback points at the renderer. How many steps separate it from the "
    "earliest step that contradicts the contract — and would fixing the renderer "
    "make the symptom go away?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — where the contract broke against where anything noticed

# %%
boundary = locate_causal_repair_boundary(TRACE)

print(f"earliest contradiction : index {boundary.repair_index} "
      f"({boundary.repair_owner})")
print(f"first detection        : index {boundary.first_detection_index} "
      f"({boundary.first_detection_owner})")
print(f"steps in between       : "
      f"{boundary.first_detection_index - boundary.repair_index}")
print(f"\nowners crossed: "
      f"{[s.owner for s in TRACE[boundary.repair_index:boundary.first_detection_index + 1]]}")
print(f"\nmodel scope: {boundary.scope}")

distance = boundary.first_detection_index - boundary.repair_index

checkpoint("the earliest contradiction is not where the traceback points",
           boundary.repair_owner != boundary.first_detection_owner)
checkpoint("the two are separated by more than one step", distance > 1,
           f"{distance} steps and {distance} owner boundaries")
checkpoint("the intervening steps contradict nothing",
           not any(step.contradicts_contract
                   for step in TRACE[boundary.repair_index + 1:]),
           "every component after the parser did what it said it would do")

# %%
resolve(
    "The traceback points at the renderer. How many steps separate it from the "
    "earliest step that contradicts the contract — and would fixing the renderer "
    "make the symptom go away?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The traceback points at the renderer. How many steps separate it from the "
    "earliest step that contradicts the contract — and would fixing the renderer "
    "make the symptom go away?",
    """
    Three steps, across three owner boundaries. And yes — fixing the renderer
    would make the *traceback* go away, which is exactly the trap.

    A `try/except TypeError` in the renderer, or a guard that formats non-finite
    scores as `"—"`, is a small, clean, reviewable change. The exception stops. The
    report renders. The rows are still in an order that depends on input order,
    because the NaN is still in the data and comparisons against it are still all
    false. The symptom the user actually reported — *the order changes between
    runs* — survives untouched, and now has no exception attached to it.

    That is the difference between a symptom and a cause, and the reason the
    session's exit demands the *earliest violated invariant* rather than the
    deepest frame. A traceback names where execution could not continue. Nothing
    about the mechanics of exception propagation makes that the place where the
    contract was first broken; here it is three components downstream.

    Notice what the intervening steps have in common: none of them contradicts the
    contract. The validator checked what it promised to check. The ranker sorted
    what it was given. Each behaved correctly on input that had already left the
    legal domain, which is why reading their code finds nothing wrong — because
    nothing in them *is* wrong.

    The reference model is careful about what it is doing here, and so should you
    be. It reports the earliest step *an analyst marked* as contradicting the
    contract. It did not discover that. Change one boolean in the trace above and
    the boundary moves. The instrument organizes evidence; it does not supply it,
    and its own `scope` string says so.

    Which sets up the harder question in section 3: before you can mark that
    boolean, you have to know the parser is producing NaN. From the traceback
    alone, at least three explanations fit — and the session asks for one
    observation that discriminates between them.
    """,
)

# %% [markdown]
# ## 3. Debug — rank the hypotheses, then find an observation that splits them

# %%
HYPOTHESES = ("renderer formatting", "ranker comparator", "non-finite upstream")

# For each candidate observation, what each hypothesis predicts you would see.
OBSERVATIONS = {
    "render a hand-built ranked list": {
        "renderer formatting": "fails",
        "ranker comparator": "renders fine",
        "non-finite upstream": "renders fine",
    },
    "rank synthetic rows with known finite scores": {
        "renderer formatting": "correct order",
        "ranker comparator": "wrong order",
        "non-finite upstream": "correct order",
    },
    "assert every parsed score is finite, before ranking": {
        "renderer formatting": "assertion holds",
        "ranker comparator": "assertion holds",
        "non-finite upstream": "assertion fails",
    },
    "re-run the whole pipeline and see if it fails again": {
        "renderer formatting": "fails",
        "ranker comparator": "fails",
        "non-finite upstream": "fails",
    },
}


def partitions(observation: str) -> list[list[str]]:
    """Group the hypotheses by what they predict for this observation."""
    predictions = OBSERVATIONS[observation]
    groups: dict[str, list[str]] = {}
    for hypothesis in HYPOTHESES:
        groups.setdefault(predictions[hypothesis], []).append(hypothesis)
    return sorted(groups.values(), key=len, reverse=True)


print(f"{'observation':>44}  {'groups':>6}  partition")
discrimination = {}
for observation in OBSERVATIONS:
    groups = partitions(observation)
    discrimination[observation] = len(groups)
    print(f"{observation:>44}  {len(groups):>6}  "
          f"{[len(group) for group in groups]}")

fully_discriminating = [o for o, n in discrimination.items() if n == len(HYPOTHESES)]
useless = [o for o, n in discrimination.items() if n == 1]

print(f"\nobservations that separate all three: {fully_discriminating or 'none'}")
print(f"observations that separate none      : {useless}")

checkpoint("no single observation separates all three hypotheses",
           fully_discriminating == [],
           "each of the useful ones splits 1 from 2")
checkpoint("one candidate observation discriminates nothing",
           useless == ["re-run the whole pipeline and see if it fails again"],
           "every hypothesis predicts the same result, so the outcome is not evidence")
checkpoint("the remaining three each rule something out",
           sum(1 for n in discrimination.values() if n == 2) == 3)

# %% [markdown]
# ### How many observations the plan needs
#
# Each of the three useful observations splits 1 from 2. So the number you *need*
# depends on the result you get — and a plan has to cover both branches.

# %%
def survivors_after(observation: str, seen: str) -> tuple[str, ...]:
    """Which hypotheses remain consistent with an observed result."""
    return tuple(h for h in HYPOTHESES if OBSERVATIONS[observation][h] == seen)


first = "assert every parsed score is finite, before ranking"
second = "rank synthetic rows with known finite scores"

branches = {}
for seen in ("assertion fails", "assertion holds"):
    remaining = survivors_after(first, seen)
    branches[seen] = {"afterFirst": remaining}
    if len(remaining) > 1:
        branches[seen]["afterSecond"] = {
            result: tuple(h for h in survivors_after(second, result) if h in remaining)
            for result in ("wrong order", "correct order")
        }

print(f"observe: {first}\n")
for seen, outcome in branches.items():
    print(f"  '{seen}' leaves {outcome['afterFirst']}")
    if "afterSecond" in outcome:
        print(f"     then observe: {second}")
        for result, left in outcome["afterSecond"].items():
            print(f"       '{result}' leaves {left}")

decisive = branches["assertion fails"]["afterFirst"]
follow_up = branches["assertion holds"]["afterSecond"]

checkpoint("one result of the first observation settles it outright",
           len(decisive) == 1)
checkpoint("and names the owner the trace marked",
           decisive == ("non-finite upstream",),
           f"which is owned by {boundary.repair_owner}, at index "
           f"{boundary.repair_index}")
checkpoint("the other result does not, and needs the second observation",
           len(branches["assertion holds"]["afterFirst"]) == 2
           and all(len(left) == 1 for left in follow_up.values()),
           "so the plan carries two observations even when one run needs only one")

# %% [markdown]
# ## 4. Debug — the regression claim, checked against the terminal contract

# %%
CANDIDATE_TRACES = {
    "renderer guard only": (
        RunSignal("import-run-a", "started", "pending", "import began"),
        RunSignal("import-run-a", "progress", "accepted", "rows ranked"),
        RunSignal("import-run-a", "terminal", "accepted", "report rendered"),
    ),
    "parser rejects non-finite": (
        RunSignal("import-run-b", "started", "pending", "import began"),
        RunSignal("import-run-b", "progress", "pending", "rows parsed"),
        RunSignal("import-run-b", "terminal", "rejected",
                  "row 3 carries a non-finite score"),
    ),
}

print(f"{'candidate repair':>26}  {'satisfies':>9}  violations")
reports = {}
for label, signals in CANDIDATE_TRACES.items():
    report = inspect_terminal_contract(signals)
    reports[label] = report
    print(f"{label:>26}  {str(report.satisfies_terminal_contract):>9}  "
          f"{[v.kind for v in report.violations]}")

checkpoint("the renderer-guard trace violates the terminal contract",
           not reports["renderer guard only"].satisfies_terminal_contract)
checkpoint("its violation is a premature success",
           [v.kind for v in reports["renderer guard only"].violations]
           == ["premature-success"],
           "a progress signal claimed 'accepted' — the run reports success at a "
           "point where the outcome was not yet known")
checkpoint("the upstream repair produces a truthful trace",
           reports["parser rejects non-finite"].satisfies_terminal_contract)
checkpoint("and its terminal outcome names the row",
           reports["parser rejects non-finite"].terminal_outcome == "rejected")

# %% [markdown]
# ## 5. Recognize — what the traceback established

# %%
STATEMENTS = {
    "a": "The renderer is where execution could not continue.",
    "b": "The renderer contains the defect.",
    "c": "A non-finite score reached the ranker.",
    "d": "Every component between the parser and the renderer behaved correctly.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def established_by_traceback(key: str) -> bool:
    """True when the TRACEBACK ALONE establishes this."""
    raise NotImplementedError("Separate what the traceback shows from what the trace adds")


# %%
check("established_by_traceback", established_by_traceback,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(c) and (d) are true, and the traceback established neither. They came from")
print("the analyst's trace and the observations in section 3 — evidence that had")
print("to be gathered, and that a stack of frames could not have supplied.")

# %% [markdown]
# ## 6. The failure dossier

# %%
DOSSIER = """
Symptom, phrased so it could be false:
Smallest reliable reproduction:
Hypotheses, ranked, with the prior for each:
The discriminating observation, and what each hypothesis predicted for it:
Earliest violated invariant, with its owner:
Repair boundary, and the defence for choosing it over the traceback's location:
Regression assertion, stated so it fails today:
The observation I did not make, and what remains unknown because of it:
"""
print(DOSSIER)

# %%
claim("DEFENDED REPAIR", DOSSIER)

claim(
    "LOCAL REFERENCE RESULT",
    f"On the declared trace, locate_causal_repair_boundary puts the earliest "
    f"contract contradiction at index {boundary.repair_index} "
    f"({boundary.repair_owner}) and the first detection at index "
    f"{boundary.first_detection_index} ({boundary.first_detection_owner}) — "
    f"{distance} steps apart, with no contradicting step in between. Of "
    f"{len(OBSERVATIONS)} candidate observations, none separates all three "
    f"hypotheses and one separates none; the finiteness assertion settles it "
    f"outright when it fails and leaves two hypotheses when it holds, so the plan "
    f"carries a second observation. inspect_terminal_contract rejects the "
    f"renderer-guard repair's trace as a premature success and accepts the "
    f"upstream repair's.",
    support={"repairIndex": boundary.repair_index,
             "repairOwner": boundary.repair_owner,
             "detectionIndex": boundary.first_detection_index,
             "detectionOwner": boundary.first_detection_owner,
             "distance": distance,
             "discrimination": discrimination,
             "observationPlan": {
                 seen: {"afterFirst": list(outcome["afterFirst"]),
                        "afterSecond": {result: list(left) for result, left
                                        in outcome.get("afterSecond", {}).items()}}
                 for seen, outcome in branches.items()},
             "terminalContract": {
                 label: {"satisfies": r.satisfies_terminal_contract,
                         "violations": [v.kind for v in r.violations],
                         "terminalOutcome": r.terminal_outcome}
                 for label, r in reports.items()}},
)

non_claim(
    "The causal trace is analyst-supplied: `contradicts_contract` was marked by "
    "hand, and the reference model's own scope string says locating the earliest "
    "mark proves neither a complete cause nor a universal repair. The hypothesis "
    "table is likewise declared — the predictions are what each hypothesis WOULD "
    "imply, not measurements. This bench establishes that a traceback can point "
    "several owners away from the earliest violated invariant, and that these four "
    "candidate observations discriminate as shown; it debugs no real program, "
    "measures nothing, and cannot tell you that the hypothesis set is complete."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. One candidate observation split nothing. Write the test a proposed
#    observation must pass before it is worth making.
# 2. Fixing the renderer would have removed the traceback and left the symptom.
#    Name the class of repair this describes, and the check that catches it.
# 3. Bench `m13-s2` found survivors that a coverage number could not see. State
#    what a surviving mutant and a non-discriminating observation have in common.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module13_reference.py` — `locate_causal_repair_boundary`,
# `inspect_terminal_contract`, `CausalStep`, and `RunSignal`. Not reimplemented.
# The trace, the hypothesis table, and the discrimination analysis are this bench's
# own.
