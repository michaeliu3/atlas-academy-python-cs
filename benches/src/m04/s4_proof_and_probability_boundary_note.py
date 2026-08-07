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
# # Bench m04-s4 — proof-and-probability boundary note
#
# **Session 4.4 — Proof and probability as different models.** Rungs: **review
# and verify** (primary), trace.
#
# Two optimisations of the same specification. Ten thousand random trials return
# the same verdict for both: no disagreement. One of them is correct and the
# other has fifteen counterexamples.
#
# Only exhaustion tells you which is which — and it also tells you the first one
# is *right*, which no amount of sampling can.
#
# **Requires:** Python 3.12+. Standard library only. Exhaustion takes a few seconds.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import random  # noqa: E402
import sys  # noqa: E402
from itertools import product  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=4, session=4, emits="proof-and-probability boundary note",
      rungs=["review-and-verify", "trace"])

# %% [markdown]
# ## 1. The specification and two optimisations

# %%
MAX_SESSION = 90
MAX_TOTAL = 180
LENGTHS = range(0, 121)


def route_is_valid(route: tuple[int, ...]) -> bool:
    """The specification: no session over 90, total at most 180."""
    return all(length <= MAX_SESSION for length in route) and sum(route) <= MAX_TOTAL


def optimised_a(route: tuple[int, ...]) -> bool:
    """Skip the per-session scan when the total is already within one session."""
    total = sum(route)
    if total <= MAX_SESSION:
        return True
    return all(length <= MAX_SESSION for length in route) and total <= MAX_TOTAL


def optimised_b(route: tuple[int, ...]) -> bool:
    """Fast-path a 'canonical balanced route' that exactly fills the budget."""
    total = sum(route)
    if total == MAX_TOTAL and route[0] == route[1]:
        return True
    return all(length <= MAX_SESSION for length in route) and total <= MAX_TOTAL


# %%
predict(
    "Ten thousand uniform random routes will be checked against both "
    "optimisations. Will the two produce different numbers of disagreements?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — ten thousand random cases

# %%
random.seed(4)
TRIALS = 10_000
sampled = {"optimised_a": 0, "optimised_b": 0}
for _ in range(TRIALS):
    route = tuple(random.choice(LENGTHS) for _ in range(3))
    truth = route_is_valid(route)
    if truth != optimised_a(route):
        sampled["optimised_a"] += 1
    if truth != optimised_b(route):
        sampled["optimised_b"] += 1

print(f"random trials: {TRIALS:,}")
for name, count in sampled.items():
    print(f"  {name}: {count} disagreements")

checkpoint("sampling reports both as clean",
           sampled["optimised_a"] == 0 and sampled["optimised_b"] == 0,
           "identical verdicts for two functions that are not identical")

# %% [markdown]
# ## 3. Verify — exhaust the declared domain

# %%
domain = list(product(LENGTHS, repeat=3))
exhaustive = {"optimised_a": [], "optimised_b": []}
for route in domain:
    truth = route_is_valid(route)
    if truth != optimised_a(route):
        exhaustive["optimised_a"].append(route)
    if truth != optimised_b(route):
        exhaustive["optimised_b"].append(route)

print(f"domain size: {len(domain):,} routes")
for name, witnesses in exhaustive.items():
    print(f"  {name}: {len(witnesses)} disagreements")

witnesses = exhaustive["optimised_b"]
if witnesses:
    smallest = min(witnesses, key=lambda r: (sum(r), r))
    print(f"\nsmallest witness for optimised_b: {smallest}")
    print(f"  specification says: {route_is_valid(smallest)}")
    print(f"  optimised_b says  : {optimised_b(smallest)}")

rate = len(witnesses) / len(domain)
print(f"\ndisagreement rate: {rate:.8f}")
print(f"expected hits in {TRIALS:,} uniform trials: {TRIALS * rate:.3f}")

checkpoint("exhaustion proves optimised_a correct on this domain",
           len(exhaustive["optimised_a"]) == 0,
           "a complete case analysis, not a clean sample")
checkpoint("and finds what sampling missed in optimised_b",
           len(witnesses) > 0,
           f"{len(witnesses)} of {len(domain):,}")

# %%
resolve(
    "Ten thousand uniform random routes will be checked against both "
    "optimisations. Will the two produce different numbers of disagreements?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Ten thousand uniform random routes will be checked against both "
    "optimisations. Will the two produce different numbers of disagreements?",
    """
    No — both report zero. One of them deserves it and the other does not.

    `optimised_a` is genuinely correct. If the total is at most 90 then no
    non-negative session can exceed 90, so the short-circuit is sound. Exhaustion
    confirms this over every one of the 1,771,561 routes, and that confirmation is
    a **proof over the declared domain** — a complete case analysis, not a sample
    that happened to come back clean.

    `optimised_b` has fifteen counterexamples. Its fast path fires when the total
    is exactly 180 and the first two sessions are equal, which is true of routes
    like (30, 30, 120) — total 180, first two equal, and a third session well over
    the 90-minute limit. The specification rejects those; the optimisation
    accepts them.

    Fifteen out of 1.77 million is a rate of 8.5e-06. Ten thousand uniform draws
    expect **0.085 hits**. Missing it is not bad luck; it is the overwhelmingly
    likely outcome, and running the suite again with a different seed will
    reliably keep missing it.

    So the two functions are indistinguishable to the test suite and different in
    fact. That is the boundary this session is named for:

    - **A clean test run is evidence about a distribution.** It says no
      counterexample appeared where you looked. Its strength depends on defects
      living where you sampled, and defects live at boundaries and coincidences
      that uniform sampling under-visits by construction.
    - **Exhaustion over a bounded domain is proof.** It is available here only
      because the domain is finite and small enough — 1.77 million cases in a
      couple of seconds. That condition is the whole reason to reach for it.
    - **Neither dominates.** Exhaustion does not scale; for an unbounded domain
      sampling is all there is. The error is not sampling. It is reporting "the
      tests pass" in language that sounds like "the code is correct."

    Note the constructed rarity. `optimised_b`'s defect was designed to be rare,
    because rarity is exactly the condition under which the distinction between
    the two kinds of evidence has teeth. A defect that sampling finds immediately
    proves nothing about the difference.
    """,
)

# %% [markdown]
# ## 4. Review and verify — classify four reports

# %%
STATEMENTS = {
    "a": "Ten thousand random trials found no disagreement for optimised_b.",
    "b": "optimised_b agrees with the specification.",
    "c": "optimised_a agrees with the specification for every route in the "
         "declared domain.",
    "d": "Running a hundred thousand random trials would be equivalent to "
         "exhausting the domain.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def is_supported(key: str) -> bool:
    """True when this bench's evidence supports the statement."""
    raise NotImplementedError("Classify each statement")


# %%
check("is_supported", is_supported,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), False)])
print()
print("(a) and (b) come from the same run and only one is supported.")
print("(d) is the subtle one: sampling with replacement never guarantees")
print("coverage, however many draws you take.")

# %% [markdown]
# ## 5. How much sampling would it have taken?

# %%
def trials_to_first_witness(seed: int, cap: int = 3_000_000) -> int | None:
    rng = random.Random(seed)
    lengths = list(LENGTHS)
    for attempt in range(1, cap + 1):
        route = tuple(rng.choice(lengths) for _ in range(3))
        if route_is_valid(route) != optimised_b(route):
            return attempt
    return None


attempts = [trials_to_first_witness(seed) for seed in range(3)]
print(f"trials needed to find one, by seed: {attempts}")
print(f"1 / rate = {1 / rate:,.0f} trials expected")

# %% [markdown]
# ## 6. The boundary note

# %%
BOUNDARY_NOTE = """
What the ten thousand passing trials establish about optimised_b:
What they do not:
What exhaustion establishes about optimised_a, and the condition that allowed it:
How I would phrase each result in a report so the two are not confused:
"""
print(BOUNDARY_NOTE)

# %%
claim("REVIEW VERDICT", BOUNDARY_NOTE)

claim(
    "FINITE EXPERIMENT",
    f"{TRIALS:,} uniform trials found 0 disagreements for both optimisations. "
    f"Exhausting the {len(domain):,}-route domain found 0 for optimised_a and "
    f"{len(witnesses)} for optimised_b — a rate of {rate:.2e}, or "
    f"{TRIALS * rate:.3f} expected hits in the sample.",
    support={"trials": TRIALS, "sampled": sampled,
             "domainSize": len(domain),
             "exhaustiveCounts": {k: len(v) for k, v in exhaustive.items()},
             "smallestWitness": list(smallest) if witnesses else None,
             "rate": rate, "trialsToFirst": attempts},
)

claim(
    "THEOREM / PROOF",
    "Over the declared domain of three sessions from 0..120, the exhaustive "
    "sweep is a complete case analysis, so optimised_a's agreement with the "
    "specification there is proved rather than sampled.",
    support={"domain": "product(range(0,121), repeat=3)"},
)

non_claim(
    "Exhaustion proves the property only over the declared finite domain. It says "
    "nothing about four-session routes, non-integer lengths, or negative inputs, "
    "and the technique does not transfer to an unbounded domain — where sampling "
    "is the only option and this bench's preferred method is unavailable."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. Both optimisations passed the same suite. Write the sentence you would put in
#    a report that conveys what a clean run does and does not establish.
# 2. The defect sat at a coincidence uniform sampling under-visits. Name a
#    sampling strategy that would have found it, and state what that strategy
#    assumes about where defects live.
# 3. Bench `m27-s4` exhausts small graphs to establish minimality. State what both
#    benches rely on about their domains, and what happens to each when the domain
#    grows.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 4 has no checked-in reference model.
