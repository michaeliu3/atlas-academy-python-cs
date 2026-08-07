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
# # Bench m13-s2 — M13 claim-to-test matrix
#
# **Session 13.2 — Partition claims into finite evidence.** Rungs: **review and
# verify** (primary), recognize.
#
# The session's encounter is stated as a fact: *100% happy-path coverage misses
# `NaN`, duplicate order, and line context.* The learner action is to critique a
# coverage-only report and say what each passing test leaves unknown.
#
# A coverage number cannot show you that. This bench builds the report, then
# builds a second instrument that can — a bounded mutation run — and puts the two
# numbers side by side.
#
# The last section is the one that matters most: mutation testing finds one of
# those three blind spots and **cannot** find the other. Knowing which is the
# difference between a matrix and a scoreboard.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402  (sets up sys.path)
    SUBJECT, covered_lines, executable_lines, load_subject, mutants,
)

import math  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=13, session=2, emits="M13 claim-to-test matrix",
      rungs=["review-and-verify", "recognize"])

# %% [markdown]
# ## 1. The subject and its suite

# %%
print(SUBJECT.strip())

HAPPY_ROWS = [
    {"line": 1, "score": 0.9},
    {"line": 2, "score": 0.7},
    {"line": 3, "score": 0.2},
]
HAPPY_EXPECTED = [(1, 0.9), (2, 0.7)]


def happy_path_suite(rank_rows) -> bool:
    """One test: the documented example produces the documented answer."""
    return rank_rows(HAPPY_ROWS) == HAPPY_EXPECTED


baseline = load_subject()["rank_rows"]
print(f"\nsuite passes on the real implementation: {happy_path_suite(baseline)}")

# %% [markdown]
# ## 2. The coverage report

# %%
executable = executable_lines()
covered = covered_lines(lambda namespace: happy_path_suite(namespace["rank_rows"])) & executable
percentage = 100 * len(covered) / len(executable)

print(f"executable lines in rank_rows : {sorted(executable)}")
print(f"lines the suite executed      : {sorted(covered)}")
print(f"line coverage                 : {percentage:.0f}%")
print(f"tests                         : 1")
print(f"failures                      : 0")

checkpoint("the suite passes", happy_path_suite(baseline))
checkpoint("line coverage is total", covered == executable,
           "there is no line of this function a test has not run")

# %%
predict(
    "The suite is green at 100% line coverage. Seven single-operator mutations "
    "are applied to the same function, one at a time. How many does the suite "
    "notice?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 3. Verify — run the mutants past the same suite

# %%
def survives(source: str) -> bool:
    """True when the mutant is *not* caught: the suite still passes."""
    try:
        return happy_path_suite(load_subject(source)["rank_rows"])
    except Exception:
        return False


population = mutants()
verdicts = [(label, survives(source)) for label, source in population]
survivors = [label for label, alive in verdicts if alive]

print(f"{'verdict':>10}  mutation")
for label, alive in verdicts:
    print(f"{'SURVIVED' if alive else 'killed':>10}  {label}")

score = 100 * (len(verdicts) - len(survivors)) / len(verdicts)
print(f"\nmutants        : {len(verdicts)}")
print(f"survivors      : {len(survivors)}")
print(f"mutation score : {score:.0f}%   (line coverage said {percentage:.0f}%)")

checkpoint("some mutants survive", len(survivors) > 0)
checkpoint("the mutation score is below the coverage number", score < percentage,
           f"{score:.0f}% against {percentage:.0f}% for the same suite on the same code")

# %%
resolve(
    "The suite is green at 100% line coverage. Seven single-operator mutations "
    "are applied to the same function, one at a time. How many does the suite "
    "notice?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The suite is green at 100% line coverage. Seven single-operator mutations "
    "are applied to the same function, one at a time. How many does the suite "
    "notice?",
    """
    Four of seven. Three survive — three ways to break this function that leave
    every line executed and every assertion satisfied.

    Read what they are, because they are not arbitrary:

    `score > THRESHOLD` becoming `score >= THRESHOLD` survives, because no test
    row has a score *at* the threshold. That is the **boundary** blind spot.

    `row["line"] > 0` becoming `>= 0` survives, because no test row has line zero.
    That is the **line context** blind spot.

    The sort key's tie-break, `pair[0]`, becoming `pair[1]` survives, because no
    two test rows share a score. That is the **duplicate order** blind spot.

    The session states that a happy-path suite misses NaN, duplicate order, and
    line context. Two of those three are sitting in the survivor list, derived
    rather than asserted — and derived by an instrument that never saw the
    specification. The mutants were generated from the code's own syntax.

    So the coverage number was not merely optimistic. It was measuring a different
    thing, and the distinction is worth stating exactly: **line coverage measures
    what the tests executed; mutation testing measures what the tests would
    notice.** A test with no assertion at all reaches 100% coverage. It kills
    nothing.

    That is why the artifact for this session is a *matrix* and not a percentage.
    Each row has to name a claim, the partition that exercises it, and what still
    remains unknown afterwards. The survivor list is the "remains unknown" column,
    computed rather than guessed.

    And there is a limit, which section 5 makes concrete: NaN is the one blind
    spot in the session's list that mutation testing does **not** find.
    """,
)

# %% [markdown]
# ## 4. Verify — add the tests the survivors point at

# %%
BOUNDARY_ROWS = [{"line": 1, "score": 0.5}, {"line": 2, "score": 0.6}]
ZERO_LINE_ROWS = [{"line": 0, "score": 0.9}, {"line": 1, "score": 0.8}]
TIED_ROWS = [{"line": 2, "score": 0.9}, {"line": 1, "score": 0.9}]


def partitioned_suite(rank_rows) -> bool:
    """Four tests, one per input partition the contract distinguishes."""
    return (
        rank_rows(HAPPY_ROWS) == HAPPY_EXPECTED
        and rank_rows(BOUNDARY_ROWS) == [(2, 0.6)]          # at the threshold: excluded
        and rank_rows(ZERO_LINE_ROWS) == [(1, 0.8)]         # line 0: not a line
        and rank_rows(TIED_ROWS) == [(1, 0.9), (2, 0.9)]    # ties break by line
    )


print(f"the partitioned suite passes on the real implementation: "
      f"{partitioned_suite(baseline)}")

second_pass = []
for label, source in population:
    try:
        alive = partitioned_suite(load_subject(source)["rank_rows"])
    except Exception:
        alive = False
    second_pass.append((label, alive))

remaining = [label for label, alive in second_pass if alive]
second_score = 100 * (len(second_pass) - len(remaining)) / len(second_pass)

second_covered = covered_lines(
    lambda namespace: partitioned_suite(namespace["rank_rows"])) & executable

print(f"\n{'suite':>18}  {'tests':>5}  {'line coverage':>13}  {'mutation score':>14}")
print(f"{'happy path':>18}  {1:>5}  {percentage:>12.0f}%  {score:>13.0f}%")
print(f"{'partitioned':>18}  {4:>5}  "
      f"{100 * len(second_covered) / len(executable):>12.0f}%  {second_score:>13.0f}%")

checkpoint("the partitioned suite still passes on the real implementation",
           partitioned_suite(baseline))
checkpoint("line coverage did not move", second_covered == covered,
           "three more tests, the same 100% — the number could not see them")
checkpoint("the mutation score did move", second_score > score)
checkpoint("every survivor is now killed", remaining == [],
           "each new test was chosen by reading a survivor, not by guessing")

# %% [markdown]
# ## 5. Recognize — the blind spot neither instrument found

# %%
NAN_ROWS = [{"line": 1, "score": float("nan")}, {"line": 2, "score": 0.8}]
nan_result = baseline(NAN_ROWS)

print(f"rank_rows({NAN_ROWS}) = {nan_result}")
print(f"\nthe NaN row was silently dropped: "
      f"{not any(math.isnan(score) for _, score in nan_result)}")
print("nothing raised, nothing was logged, and the caller receives a shorter list")
print("than the one it submitted, with no way to tell which row is missing or why.")

checkpoint("the NaN row is discarded without a signal",
           len(nan_result) == 1 and nan_result[0][0] == 2)
checkpoint("no mutant in the population exposes this",
           remaining == [],
           "mutation score is 100% and this defect is untouched")
checkpoint("the partitioned suite does not catch it either",
           partitioned_suite(baseline),
           "because a suite can only test partitions someone thought of")


# %%
INSTRUMENTS = {
    "a": "A line the tests never execute.",
    "b": "An assertion too weak to notice a changed operator.",
    "c": "An input class nobody wrote a test for.",
    "d": "A test that asserts nothing at all.",
}
for key, text in INSTRUMENTS.items():
    print(f"{key}. {text}")


def found_by_mutation(key: str) -> bool:
    """True when a mutation run would reveal this, and coverage would not."""
    raise NotImplementedError("Decide what each instrument can actually see")


# %%
check("found_by_mutation", found_by_mutation,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), True)])
print()
print("(a) coverage finds; mutation would too, but coverage is cheaper and exact.")
print("(c) is the one neither finds. The NaN gap is (c), which is why the session")
print("builds the partition table BEFORE the test code — from the specification,")
print("not from the implementation. No instrument reading the code can supply it.")

# %% [markdown]
# ## 6. The claim-to-test matrix

# %%
CLAIM_MATRIX = """
Clause | Partition | Layer | Oracle | Observed | Still unknown
-------+-----------+-------+--------+----------+--------------
       |           |       |        |          |
       |           |       |        |          |
       |           |       |        |          |

The survivor that surprised me, and what it proves my suite never checked:
The blind spot no instrument here found, and where it must come from instead:
My one-sentence critique of a coverage-only report:
"""
print(CLAIM_MATRIX)

# %%
claim("REVIEW VERDICT", CLAIM_MATRIX)

claim(
    "LOCAL REFERENCE RESULT",
    f"A single happy-path test over this {len(executable)}-line function reaches "
    f"{percentage:.0f}% line coverage and a mutation score of {score:.0f}%: "
    f"{len(survivors)} of {len(verdicts)} single-operator mutants survive, at the "
    f"threshold boundary, the line-number guard, and the sort tie-break. Adding "
    f"three tests chosen by reading those survivors raises the mutation score to "
    f"{second_score:.0f}% while line coverage stays at {percentage:.0f}%. A NaN "
    f"score is silently dropped by every version, and no mutant in the population "
    f"detects it.",
    support={"executableLines": sorted(executable),
             "lineCoverage": percentage,
             "mutants": [{"mutation": label, "survived": alive}
                         for label, alive in verdicts],
             "survivors": survivors,
             "mutationScoreHappyPath": score,
             "mutationScorePartitioned": second_score,
             "nanResult": nan_result},
)

non_claim(
    "This is one nine-line function, one suite, and seven mutants from four "
    "mutation operators — comparison swaps, arithmetic swaps, boolean swaps, and "
    "integer increments. The specific numbers are properties of that population "
    "and would change with a different operator set; a mutation score is not a "
    "probability that the suite catches real defects, and 100% would not mean the "
    "code is correct. Nothing here measures test runtime, flakiness, or the cost "
    "of running mutation testing on a real codebase, where it is expensive enough "
    "that the choice of what to mutate is itself a judgement."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. Line coverage stayed at 100% while the suite got three tests stronger. Write
#    the rule this implies about reporting coverage as a quality figure.
# 2. The NaN gap was invisible to both instruments. Name the only place that
#    partition could have come from, and say what that implies about the order of
#    work in this session.
# 3. Bench `m16-s3` found a query returning correct rows and the wrong number of
#    them. State what that defect and the surviving tie-break mutant have in
#    common as things a passing test can hide.
#
# ---
#
# ## Attributions
#
# The ranking function, the mutation engine (stdlib `ast`), and the `sys.settrace`
# coverage measurement are this bench's own. Module 13's reference model at
# `public/downloads/module13_reference.py` is probed by bench 4; it is deliberately
# not mutated here, since mutating a published course artifact would be mutating
# the wrong thing.
