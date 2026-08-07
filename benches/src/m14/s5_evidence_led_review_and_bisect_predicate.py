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
# # Bench m14-s5 — evidence-led review and bisect predicate
#
# **Session 14.5 — Review an agent patch and localize a regression.** Rungs:
# **review and verify** (primary), debug and defend.
#
# Bisection is the strongest localization tool there is, and it has a
# precondition nobody states out loud: the predicate must be **monotone** — once
# bad, bad forever. Bisect does not check this. It cannot.
#
# So it always returns a commit. This bench runs it over three histories, only one
# of which satisfies the precondition, and finds that the two invalid runs are
# indistinguishable from the valid one by their output alone.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=14, session=5, emits="evidence-led review and bisect predicate",
      rungs=["review-and-verify", "debug-and-defend"])

# %% [markdown]
# ## 1. Three predicates over sixteen commits
#
# `.` is good, `X` is bad. Only the first satisfies bisection's precondition —
# and the other two fail it in two different ways.

# %%
COMMITS = 16

# Two failures of the precondition, and they are not the same failure.
#   - non-monotone: the predicate is deterministic and goes bad, good, bad.
#   - flaky: the predicate is not a function of the commit at all.
HISTORIES = {
    "monotone (bug introduced at 9)":
        tuple(index >= 9 for index in range(COMMITS)),
    "fixed then reintroduced":
        tuple(index in range(2, 4) or index >= 12 for index in range(COMMITS)),
}

for label, states in HISTORIES.items():
    rendering = "".join("X" if bad else "." for bad in states)
    first_bad = next((i for i, bad in enumerate(states) if bad), None)
    print(f"{label:>32}  {rendering}")
    print(f"{'':>32}  first genuinely bad commit: {first_bad}")

print(f"{'flaky (bad from 9, 40% of runs)':>32}  "
      f"a predicate, not a recording — it does not have a fixed rendering")
print(f"{'':>32}  first genuinely bad commit: 9")


def is_monotone(states) -> bool:
    """Once bad, always bad."""
    seen_bad = False
    for bad in states:
        if bad:
            seen_bad = True
        elif seen_bad:
            return False
    return True


# %%
predict(
    "git bisect over sixteen commits, on all three histories. Which ones return a "
    "commit, and can you tell from bisect's output alone which answers are "
    "meaningless?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — bisect all three

# %%
def bisect(predicate, commits: int = COMMITS) -> dict:
    """Standard bisection: find the first index the predicate calls bad."""
    low, high, probed = 0, commits - 1, []
    while low < high:
        middle = (low + high) // 2
        probed.append(middle)
        if predicate(middle):
            high = middle
        else:
            low = middle + 1
    return {"result": low, "probes": probed}


def recorded(states):
    return lambda index: states[index]


def flaky_predicate(seed: int = 20260806, failure_rate: float = 0.4):
    """Genuinely bad from commit 9, but the test only catches it 40% of the time.

    This is a *predicate*, not a recording: asking twice can give two answers,
    which is exactly the property a spot check across indices cannot detect.
    """
    import random
    generator = random.Random(seed)

    def predicate(index: int) -> bool:
        return index >= 9 and generator.random() < failure_rate

    return predicate


PREDICATES = {
    label: (recorded(states), next((i for i, b in enumerate(states) if b), None))
    for label, states in HISTORIES.items()
}
PREDICATES["flaky (bad from 9, 40% of runs)"] = (flaky_predicate(), 9)

print(f"{'history':>32}  {'bisect says':>11}  {'truly first bad':>15}  "
      f"{'probes':>6}")
results = {}
for label, (predicate, truly_first) in PREDICATES.items():
    outcome = bisect(predicate)
    results[label] = {"bisect": outcome["result"],
                      "trulyFirstBad": truly_first,
                      "probes": outcome["probes"],
                      "correct": outcome["result"] == truly_first}
    print(f"{label:>32}  {outcome['result']:>11}  {str(truly_first):>15}  "
          f"{len(outcome['probes']):>6}")

wrong = [label for label, row in results.items() if not row["correct"]]

print(f"\nevery history returned a commit: "
      f"{all(isinstance(r['bisect'], int) for r in results.values())}")
print(f"histories where that commit is wrong: {len(wrong)}")
for label in wrong:
    print(f"  {label}: said {results[label]['bisect']}, "
          f"truly {results[label]['trulyFirstBad']}")

checkpoint("bisect returns a commit for every history",
           all(isinstance(r["bisect"], int) for r in results.values()))
checkpoint("it is correct on the monotone history",
           results["monotone (bug introduced at 9)"]["correct"])
checkpoint("and wrong on both histories that break the precondition",
           len(wrong) == 2, f"{wrong}")
checkpoint("the output gives no sign of which is which",
           len({type(r["bisect"]).__name__ for r in results.values()}) == 1,
           "same type, same shape, same confident single integer")
checkpoint("all three take the same number of probes",
           len({len(r["probes"]) for r in results.values()}) == 1,
           "even the runtime is indistinguishable")

# %%
resolve(
    "git bisect over sixteen commits, on all three histories. Which ones return a "
    "commit, and can you tell from bisect's output alone which answers are "
    "meaningless?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "git bisect over sixteen commits, on all three histories. Which ones return a "
    "commit, and can you tell from bisect's output alone which answers are "
    "meaningless?",
    """
    All three return a commit. Two of those commits are wrong. And no, you cannot
    tell from the output — same type, same shape, same number of probes, same
    confident single integer.

    Bisection is a binary search, and binary search has a precondition: the array
    must be sorted. For bisect the equivalent is **monotonicity** — the predicate
    goes false, false, false, true, true, true, and never comes back. Give a binary
    search an unsorted array and it does not complain; it returns an index, quickly
    and deterministically. Bisect behaves exactly the same way, and for exactly the
    same reason.

    Look at what each failure does.

    The **fixed-then-reintroduced** history is bad at 2–3, good from 4 to 11, and
    bad again from 12. There genuinely are two regressions, and the "first bad
    commit" the question presupposes is not well defined. Bisect answers **12** —
    a real boundary, where good meets bad, ten commits away from the first one. The
    answer is not noise. It is a correct answer to a question nobody asked.

    The **flaky** predicate is worse, because it looks like the case people think
    they understand. It is genuinely bad from commit 9 and the test only catches it
    40% of the time. Every probe is honest about what it observed. Bisect follows
    that evidence and lands on **10** — consistent with everything it saw, and
    wrong, because the thing it was searching for is not a function of the commit
    at all.

    And these two failures need **two different guards**, which is the practical
    result of section 3. Sampling commits across the range catches the
    reintroduction and is blind to the flake — sampling *different* commits cannot
    detect a predicate that answers differently at the *same* commit. Repeating one
    probe catches the flake and is blind to the reintroduction, because that
    predicate is perfectly deterministic and repeating it just confirms it. Run
    only one of the two checks and you have covered half the ways the precondition
    can fail.

    So the discipline this session asks for is: **the predicate is the artifact, and
    it has to be defended before the search runs.** Three things have to be true,
    and none is checked by the tool.

    First, *deterministic*: run it several times on the same commit and get the same
    answer. If it flakes, bisect is searching a random function.

    Second, *specific*: it must test the regression, not a symptom that other things
    also cause. A predicate that greps for "error" in a log will happily bisect to
    the commit that added a different, unrelated error message.

    Third, *monotone over the range*: verified by actually checking the endpoints
    and, ideally, a midpoint or two by hand. This is the one that is almost never
    done, and it is the one that would have caught both failures here.

    The consolation is that the precondition is cheap to test relative to what it
    saves. Running the predicate three times on the known-bad commit costs three
    runs. Chasing a wrong commit through a code review costs an afternoon, and it
    ends with a plausible-looking diff that has nothing to do with the bug — which
    is exactly the review this session's artifact is supposed to prevent.
    """,
)

# %% [markdown]
# ## 3. Verify — the checks that would have caught it

# %%
# Guard 1: sample several commits and check the order. Catches a predicate that
# goes bad, then good, then bad.
def sweep_monotone(predicate, samples=range(0, COMMITS, 2)) -> bool:
    seen_bad = False
    for index in samples:
        if predicate(index):
            seen_bad = True
        elif seen_bad:
            return False
    return True


# Guard 2: ask the SAME commit repeatedly. Catches a predicate that is not a
# function of the commit.
def repeatable(predicate, index: int = COMMITS - 1, trials: int = 8) -> bool:
    answers = {predicate(index) for _ in range(trials)}
    return len(answers) == 1


print(f"{'history':>32}  {'endpoints':>9}  {'sweep':>6}  {'repeat':>7}  "
      f"{'bisect ok':>9}")
guards = {}
for label, (predicate, _) in PREDICATES.items():
    row = {"endpoints": (not predicate(0)) and predicate(COMMITS - 1),
           "sweep": sweep_monotone(predicate),
           "repeatable": repeatable(predicate),
           "bisectCorrect": results[label]["correct"]}
    guards[label] = row
    print(f"{label:>32}  {str(row['endpoints']):>9}  {str(row['sweep']):>6}  "
          f"{str(row['repeatable']):>7}  {str(row['bisectCorrect']):>9}")

caught_by_sweep = [label for label, row in guards.items()
                   if not row["bisectCorrect"] and not row["sweep"]]
caught_by_repeat = [label for label, row in guards.items()
                    if not row["bisectCorrect"] and not row["repeatable"]]

print(f"\ncaught by the sweep  : {caught_by_sweep}")
print(f"caught by repetition : {caught_by_repeat}")
print(f"caught by neither    : "
      f"{[l for l in wrong if l not in caught_by_sweep + caught_by_repeat]}")

checkpoint("the sweep catches the reintroduced regression",
           "fixed then reintroduced" in caught_by_sweep)
checkpoint("and does NOT catch the flaky predicate",
           "flaky (bad from 9, 40% of runs)" not in caught_by_sweep,
           "sampling different commits cannot detect a predicate that answers "
           "differently at the same commit")
checkpoint("repetition catches the flaky predicate",
           "flaky (bad from 9, 40% of runs)" in caught_by_repeat)
checkpoint("and does NOT catch the reintroduced regression",
           "fixed then reintroduced" not in caught_by_repeat,
           "it is perfectly deterministic — repeating a probe confirms it")
checkpoint("every wrong answer is caught by exactly one of the two guards",
           sorted(caught_by_sweep + caught_by_repeat) == sorted(wrong),
           "two different precondition failures needing two different checks")

# %% [markdown]
# ## 4. Review and verify — audit four predicates

# %%
CANDIDATE_PREDICATES = {
    "a": "Run the failing unit test; bad if it fails.",
    "b": "Grep the build log for 'ERROR'; bad if found.",
    "c": "Run the failing test 5 times; bad if it fails any time.",
    "d": "Run the failing test 5 times; bad if it fails all 5 times.",
}
for key, text in CANDIDATE_PREDICATES.items():
    print(f"{key}. {text}")


def safe_for_bisect(key: str) -> bool:
    """True when this predicate satisfies bisection's preconditions."""
    raise NotImplementedError("Judge determinism and specificity")


# %%
check("safe_for_bisect", safe_for_bisect,
      [(("a",), False), (("b",), False), (("c",), False), (("d",), True)])
print()
print("(c) and (d) differ only in the quantifier and that decides everything.")
print("'fails any time' turns a 10%-flaky test into a predicate that is bad")
print("almost everywhere; 'fails all 5' is stable on a genuinely broken commit")
print("and stable on a good one. (a) is (c) with one sample — the default, and")
print("the least defensible.")

# %% [markdown]
# ## 5. The bisect predicate record

# %%
PREDICATE_RECORD = """
The regression, stated so a predicate could be wrong about it:
The predicate, written out as a command with its pass/fail rule:
Determinism evidence — the same commit run N times, with the results:
Specificity — what else could make this predicate say 'bad':
Monotonicity evidence — the endpoints and the intermediate points I checked:
The commit bisect named, and what I did to confirm it before reading its diff:
What I would conclude if the spot check had failed:
"""
print(PREDICATE_RECORD)

# %%
claim("REVIEW VERDICT", PREDICATE_RECORD)

claim(
    "LOCAL REFERENCE RESULT",
    f"Bisection over {COMMITS} commits returns a single integer for all "
    f"{len(PREDICATES)} predicates, using the same number of probes each time. It "
    f"is correct on the monotone one and wrong on {len(wrong)}: the "
    f"fixed-then-reintroduced history, where it answers "
    f"{results['fixed then reintroduced']['bisect']} against a first bad commit of "
    f"{results['fixed then reintroduced']['trulyFirstBad']}, and the flaky "
    f"predicate, where it answers "
    f"{results['flaky (bad from 9, 40% of runs)']['bisect']} against 9. Both "
    f"answers are consistent with every probe made. A commit sweep refutes "
    f"monotonicity on the reintroduced history and not on the flaky one; repeating "
    f"a single probe refutes determinism on the flaky one and not on the "
    f"reintroduced one — each wrong answer caught by exactly one guard, neither "
    f"by both.",
    support={"histories": {label: {"states": [bool(b) for b in states],
                                   "rendering": "".join("X" if b else "."
                                                        for b in states)}
                           for label, states in HISTORIES.items()},
             "results": results,
             "guards": guards,
             "caughtBySweep": caught_by_sweep,
             "caughtByRepetition": caught_by_repeat},
)

non_claim(
    "These are three declared boolean histories bisected by a hand-written binary "
    "search; no repository is cloned, no commit is checked out, and no test is run. "
    "It establishes that bisection returns a confident answer on histories that "
    "violate its precondition, and that endpoint checking alone does not detect "
    "that. It does not measure how often real histories are non-monotone, does not "
    "model git's actual bisect over a DAG with merges — where 'the range' is a "
    "genuinely harder notion than an index interval — and the spot check it "
    "proposes can refute monotonicity but never establish it."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Three runs were indistinguishable by output and two were meaningless. Write
#    the rule this implies about tools that always return an answer.
# 2. The spot check can refute monotonicity and not establish it. Name what that
#    makes it — and why it is still worth running.
# 3. Bench `m13-s4` ranked hypotheses and chose a discriminating observation. State
#    what a bisect predicate and a discriminating observation have in common.
#
# ---
#
# ## Attributions
#
# Module 14 has no checked-in reference model. The three histories, the bisection,
# and the precondition guards are this bench's own.
