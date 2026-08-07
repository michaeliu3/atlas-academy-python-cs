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
# # Bench m27-s3 — counting and recurrence derivation
#
# **Session 27.3 — Counting, recurrences, generating functions, and asymptotics.**
# Rungs: **review and verify** (primary), trace.
#
# The session names its own failure mode: a closed form that matches the first
# several terms and then does not. That is a claim about term six, and no amount
# of reading term five settles it.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module27_reference import (  # noqa: E402
    ModelContractError, binomial_coefficient, linear_recurrence_terms,
)

assert sys.version_info >= (3, 12)

bench(module=27, session=3, emits="counting and recurrence derivation",
      rungs=["review-and-verify", "trace"])

# %% [markdown]
# ## 1. Trace — verify a counting identity rather than recalling it
#
# The binomial theorem gives $\sum_k \binom{n}{k} = 2^n$. Check it against the
# reference rather than against memory.

# %%
print(f"{'n':>3}  {'sum C(n,k)':>12}  {'2**n':>8}")
identity_holds = True
for n in range(0, 9):
    total = sum(binomial_coefficient(n, k) for k in range(n + 1))
    identity_holds &= total == 2 ** n
    print(f"{n:>3}  {total:>12,}  {2 ** n:>8,}")

checkpoint("the identity holds for n = 0..8", identity_holds)

# %% [markdown]
# ### A contract divergence worth recording
#
# Mathematically $\binom{n}{k} = 0$ when $k > n$. The reference does not return
# zero — it raises. That is a deliberate contract choice, and a bench that
# assumed the convention would crash rather than compute.

# %%
try:
    binomial_coefficient(2, 5)
    out_of_range = "returned a value"
except ModelContractError as error:
    out_of_range = f"raised {type(error).__name__}: {error}"
print(f"binomial_coefficient(2, 5) -> {out_of_range}")

checkpoint(
    "the reference rejects k > n instead of returning 0",
    out_of_range.startswith("raised"),
    "the model refuses to answer outside its stated domain",
)


def choose(n: int, k: int) -> int:
    """The mathematical convention, built on the reference's stricter contract."""
    return binomial_coefficient(n, k) if 0 <= k <= n else 0


# %% [markdown]
# ## 2. Prediction — a sequence that looks like doubling
#
# Count the regions a circle is cut into by chords joining $n$ points on its
# boundary, no three chords concurrent. The counts begin 1, 2, 4, 8, 16.

# %%
predict(
    "The region counts start 1, 2, 4, 8, 16. What is the sixth term?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 3. Verify — two closed forms against each other

# %%
def doubling(n: int) -> int:
    """The pattern-matched guess."""
    return 2 ** (n - 1)


def moser(n: int) -> int:
    """The derived count: C(n,4) + C(n,2) + 1."""
    return choose(n, 4) + choose(n, 2) + 1


print(f"{'n':>3}  {'derived':>9}  {'2**(n-1)':>10}  {'agree?':>7}")
first_divergence = None
derived, guessed = [], []
for n in range(1, 9):
    a, b = moser(n), doubling(n)
    derived.append(a)
    guessed.append(b)
    if a != b and first_divergence is None:
        first_divergence = n
    print(f"{n:>3}  {a:>9,}  {b:>10,}  {'yes' if a == b else 'NO':>7}")

print(f"\nfirst divergence at n = {first_divergence}")

checkpoint("the two forms agree for the first five terms", derived[:5] == guessed[:5])
checkpoint("and diverge at the sixth", first_divergence == 6,
           f"{derived[5]} against {guessed[5]}")

# %%
resolve(
    "The region counts start 1, 2, 4, 8, 16. What is the sixth term?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "The region counts start 1, 2, 4, 8, 16. What is the sixth term?",
    """
    31, not 32.

    Five terms of agreement is not weak evidence for doubling — it is the
    strongest evidence a finite prefix can offer, and it is still worth nothing.
    Any finite prefix is consistent with infinitely many continuations, and here
    two natural-looking closed forms agree on the first five and part on the
    sixth.

    The derived form counts what is actually there: 1 region to start, plus one
    new region per chord (that is C(n,2)), plus one more per interior
    intersection point (each determined by a choice of four boundary points,
    C(n,4)). At n = 5 there are exactly 5 interior crossings and 10 chords, giving
    16 — which is where the coincidence with 2^4 ends. At n = 6, C(6,4) = 15 and
    C(6,2) = 15, giving 31.

    The methodological point is the session's: a closed form is justified by the
    derivation, not by the prefix. Fitting the prefix is what a wrong answer also
    does. "It matched every term I checked" describes the checking, not the
    sequence.
    """,
)

# %% [markdown]
# ## 4. Review and verify — audit four claims

# %%
CLAIMS = {
    "a": "The sequence 1, 2, 4, 8, 16 is doubling.",
    "b": "C(n,4) + C(n,2) + 1 agrees with 2**(n-1) for n <= 5.",
    "c": "Checking more terms would eventually confirm the doubling closed form.",
    "d": "The reference's binomial_coefficient implements the mathematical "
         "convention C(n,k) = 0 for k > n.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this bench's evidence supports the claim as written."""
    raise NotImplementedError("Audit the four claims")


# %%
check("supported", supported,
      [(("a",), False), (("b",), True), (("c",), False), (("d",), False)])

# %% [markdown]
# ## 5. Trace — a recurrence the reference can carry

# %%
fib = linear_recurrence_terms([1, 1], [1, 1], 10)
print(f"a(n) = a(n-1) + a(n-2), a(0)=a(1)=1 -> {fib}")
checkpoint("the reference reproduces the expected terms",
           list(fib[:8]) == [1, 1, 2, 3, 5, 8, 13, 21])

# %% [markdown]
# ## 6. The record

# %%
DERIVATION = """
The quantity being counted:
The recurrence or closed form, with the reason each term is there:
The prefix length at which a wrong form would still have matched:
"""
print(DERIVATION)

# %%
claim("DERIVATION", DERIVATION)

claim(
    "COUNTEREXAMPLE",
    f"C(n,4) + C(n,2) + 1 and 2**(n-1) agree for n = 1..5 and diverge at n = "
    f"{first_divergence} ({derived[5]} against {guessed[5]}), so five matching "
    f"terms do not justify a closed form.",
    support={"derived": derived, "guessed": guessed,
             "firstDivergence": first_divergence},
)

claim(
    "FINITE EXPERIMENT",
    "The identity sum over k of C(n,k) equals 2**n verified for n = 0..8 against "
    "the reference model.",
    support={"range": [0, 8], "holds": identity_holds},
)

non_claim(
    "Verifying an identity at nine values does not prove it, and finding one "
    "divergence at n=6 does not establish that the derived form is correct "
    "either — only that the doubling form is not. Correctness of the derived "
    "form comes from the counting argument, which this bench does not carry out."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. Five matching terms were not evidence. State the general rule about what a
#    finite prefix can establish about an infinite sequence.
# 2. The reference refused `C(2,5)` rather than returning 0. Argue for that
#    choice, then argue against it.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module27_reference.py` — `binomial_coefficient`,
# `linear_recurrence_terms`, and its `ModelContractError` domain check. Not
# reimplemented. The circle-region comparison and the claim audit are this
# bench's own.
