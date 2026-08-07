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
# # Bench m33-s2 — Formal-Claim Countermodel Ledger
#
# **Session 33.2 — Finite state needs finite evidence.** Rungs: **trace**
# (primary), debug and defend.
#
# "This cannot be done with finite state" is the kind of claim that gets asserted
# and believed rather than shown. It does not have to be. The Myhill–Nerode
# argument produces a **witness** — a concrete pair of strings that any finite
# machine must treat differently and cannot — and a witness is an object a program
# can build and check.
#
# This bench generates the witnesses rather than asserting them, and then shows
# the same procedure *failing* to find one for a language that genuinely is
# regular. A method that always confirms your hypothesis is not evidence.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402
from itertools import product  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=33, session=2, emits="Formal-Claim Countermodel Ledger",
      rungs=["trace", "debug-and-defend"])

# %% [markdown]
# ## 1. Two languages over `{a, b}`
#
# - **balanced** — equal numbers of `a` and `b`. Widely believed non-regular.
# - **even-a** — an even number of `a`, any number of `b`. Regular, and a
#   two-state machine recognises it.

# %%
def balanced(word: str) -> bool:
    return word.count("a") == word.count("b")


def even_a(word: str) -> bool:
    return word.count("a") % 2 == 0


LANGUAGES = {"balanced (equal a and b)": balanced,
             "even-a (even count of a)": even_a}


def words(max_length: int, alphabet: str = "ab"):
    for length in range(max_length + 1):
        for letters in product(alphabet, repeat=length):
            yield "".join(letters)


PREFIXES = list(words(6))
SUFFIXES = list(words(6))
print(f"{len(PREFIXES)} candidate prefixes and {len(SUFFIXES)} candidate "
      f"suffixes, all words over {{a, b}} of length <= 6")

# %% [markdown]
# ## 2. The distinguishing relation
#
# Two prefixes `x` and `y` are **distinguishable** when some suffix `z` sends
# exactly one of `xz`, `yz` into the language. A DFA must be in different states
# after reading `x` and `y`, because from that point on it has only `z` to go on.
#
# So: **N pairwise-distinguishable prefixes force at least N states.**

# %%
def distinguishing_suffix(language, x: str, y: str, suffixes) -> str | None:
    for suffix in suffixes:
        if language(x + suffix) != language(y + suffix):
            return suffix
    return None


# %%
predict(
    "For each language, search for a set of prefixes that are pairwise "
    "distinguishable. How large a set does the search find in each — and does the "
    "search itself tell you which language is regular?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 3. Trace — build a pairwise-distinguishable set

# %%
def distinguishable_set(language, candidates, suffixes=None) -> dict:
    """Greedily grow a set whose members are pairwise distinguishable.

    The suffix pool is a parameter rather than a global: section 4 varies the
    search bound, and it must vary the suffixes it examines along with the
    prefixes, or the reported bound would not describe what was searched.
    """
    pool = SUFFIXES if suffixes is None else suffixes
    chosen: list[str] = []
    witnesses: dict[tuple[str, str], str] = {}
    for candidate in candidates:
        found = {}
        for member in chosen:
            suffix = distinguishing_suffix(language, candidate, member, pool)
            if suffix is None:
                break
            found[(member, candidate)] = suffix
        else:
            chosen.append(candidate)
            witnesses.update(found)
    return {"set": chosen, "witnesses": witnesses}


print(f"{'language':>26}  {'distinguishable prefixes found':>30}")
results = {}
for label, language in LANGUAGES.items():
    outcome = distinguishable_set(language, PREFIXES)
    results[label] = outcome
    print(f"{label:>26}  {len(outcome['set']):>30}")

balanced_set = results["balanced (equal a and b)"]["set"]
even_set = results["even-a (even count of a)"]["set"]

print(f"\nbalanced — the prefixes chosen: {balanced_set[:8]}"
      f"{' ...' if len(balanced_set) > 8 else ''}")
print(f"even-a   — the prefixes chosen: {even_set}")

checkpoint("the balanced language forces many states",
           len(balanced_set) > 5,
           f"{len(balanced_set)} pairwise-distinguishable prefixes at length <= 6")
checkpoint("the even-a language forces exactly two",
           len(even_set) == 2,
           f"{even_set} — and a two-state DFA is exactly what recognises it")
checkpoint("the search does not always confirm the hypothesis",
           len(even_set) < len(balanced_set),
           "run on a regular language, the same procedure stops early")

# %% [markdown]
# ### One witness, in full

# %%
witnesses = results["balanced (equal a and b)"]["witnesses"]
(first_pair, first_suffix) = next(iter(witnesses.items()))
x, y = first_pair

print(f"prefixes  : x = {x!r}, y = {y!r}")
print(f"suffix    : z = {first_suffix!r}")
print(f"  x + z = {x + first_suffix!r}  in language: {balanced(x + first_suffix)}")
print(f"  y + z = {y + first_suffix!r}  in language: {balanced(y + first_suffix)}")
print(f"\nso any DFA must be in different states after {x!r} and after {y!r}.")

checkpoint("the witness is a concrete triple",
           isinstance(x, str) and isinstance(y, str)
           and isinstance(first_suffix, str))
checkpoint("and it is checkable by evaluation, not by argument",
           balanced(x + first_suffix) != balanced(y + first_suffix))

# %%
resolve(
    "For each language, search for a set of prefixes that are pairwise "
    "distinguishable. How large a set does the search find in each — and does the "
    "search itself tell you which language is regular?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "For each language, search for a set of prefixes that are pairwise "
    "distinguishable. How large a set does the search find in each — and does the "
    "search itself tell you which language is regular?",
    """
    The balanced language yields a large set — one that keeps growing as the
    prefix length bound rises. The even-a language yields exactly **two**, and no
    amount of searching makes it three.

    That second number is the important one, and it is why this procedure is
    evidence rather than confirmation. The same greedy search, on the same
    alphabet, with the same suffix pool, *stops* on a regular language. A method
    that returned "lots of states needed" for everything would establish nothing;
    this one distinguishes the two cases by its own behaviour.

    And two is not an arbitrary stopping point. It is exactly the number of states
    in the minimal DFA for "even number of a" — one state for even-so-far, one for
    odd. Myhill–Nerode is an *equality*: the number of equivalence classes under
    the distinguishing relation **is** the minimal state count. The search did not
    approximate that; it recovered it.

    Now the witness. For the balanced language the bench prints a specific triple:
    two prefixes `x`, `y` and a suffix `z` such that `xz` is in the language and
    `yz` is not. That is not a paraphrase of a proof — it is an object, and the
    line checking it is a comparison of two boolean evaluations. Anyone can verify
    it without following an argument, and a machine can verify it without
    understanding one.

    That is the move worth taking from this session. "Non-regular" as an assertion
    is a thing you either accept or do not. "Here are prefixes `x` and `y` and
    suffix `z`, evaluate them yourself" transfers the claim into something
    checkable. The same shift runs through this whole course: bench `m11-s4`
    replaced "the prune is unsound" with an instance number, and bench `m19-s1`
    replaced "a race is possible" with 18 of 20.

    One boundary has to be stated carefully, and it is section 4's subject. This
    search examines prefixes and suffixes up to length 6. Finding many
    distinguishable prefixes **proves** a lower bound — those states are genuinely
    forced. Failing to find more does **not** prove regularity: it proves that no
    witness exists within the bound searched. The asymmetry is total, and it runs
    the opposite way from how people usually read a search that came back empty.
    """,
)

# %% [markdown]
# ## 4. Debug — what a growing bound does to each answer

# %%
print(f"{'max length':>10}  {'balanced':>9}  {'even-a':>7}")
growth = {}
for bound in (2, 3, 4, 5, 6):
    prefixes = list(words(bound))
    row = {}
    for label, language in LANGUAGES.items():
        # The suffix pool moves with the bound, so the number reported describes
        # exactly what was searched.
        row[label] = len(
            distinguishable_set(language, prefixes, suffixes=prefixes)["set"])
    growth[bound] = row
    print(f"{bound:>10}  {row['balanced (equal a and b)']:>9}  "
          f"{row['even-a (even count of a)']:>7}")

balanced_growth = [growth[b]["balanced (equal a and b)"] for b in sorted(growth)]
even_growth = [growth[b]["even-a (even count of a)"] for b in sorted(growth)]

checkpoint("the balanced count keeps growing with the bound",
           balanced_growth[-1] > balanced_growth[0],
           f"{balanced_growth}")
checkpoint("the even-a count plateaus at 2",
           set(even_growth[1:]) == {2},
           f"{even_growth} — more searching finds nothing more")
checkpoint("growth is a lower bound, not a proof of non-regularity",
           True,
           "each additional prefix forces one more state; unbounded growth is "
           "what 'no finite machine suffices' means")

# %% [markdown]
# ## 5. Recognize — what does this search establish?

# %%
CLAIMS = {
    "a": "Any DFA for 'balanced' needs at least as many states as prefixes found.",
    "b": "'balanced' is not regular.",
    "c": "'even-a' is regular.",
    "d": "'even-a' has a minimal DFA with exactly two states.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def established_by_this_search(key: str) -> bool:
    """True when the bounded search above establishes the claim."""
    raise NotImplementedError("Separate a lower bound from a proof")


# %%
check("established_by_this_search", established_by_this_search,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(a) is the only one. Every witness found is a real forced state, so the")
print("lower bound is sound. (b) needs the growth to be UNBOUNDED, which a search")
print("to length 6 cannot show. (c) and (d) are the asymmetry: finding no further")
print("witness proves only that none exists within the bound searched — the")
print("absence of a countermodel is not a proof.")

# %% [markdown]
# ## 6. The countermodel ledger

# %%
COUNTERMODEL_LEDGER = """
The claim, stated so a countermodel could refute it:
The witness, as a concrete triple (x, y, z) with both memberships evaluated:
What the witness establishes, phrased as a bound:
The bound I searched to, and what lay outside it:
Why finding no further witness is not the converse result:
The claim I would defend, and the one I would have to prove instead of search:
"""
print(COUNTERMODEL_LEDGER)

# %%
claim("COURSE MODEL", COUNTERMODEL_LEDGER)

claim(
    "LOCAL REFERENCE RESULT",
    f"Searching prefixes and suffixes over {{a, b}} up to length 6, a greedy "
    f"pairwise-distinguishability search finds {len(balanced_set)} mutually "
    f"distinguishable prefixes for the balanced language and exactly "
    f"{len(even_set)} for the even-a language. Raising the bound from 2 to 6 takes "
    f"the balanced count through {balanced_growth} while the even-a count "
    f"plateaus at {even_growth[-1]}. A concrete witness for the balanced language "
    f"is x={x!r}, y={y!r}, z={first_suffix!r}, with "
    f"{(x + first_suffix)!r} in the language and {(y + first_suffix)!r} not.",
    support={"balancedSetSize": len(balanced_set),
             "evenSetSize": len(even_set),
             "evenSet": even_set,
             "growth": {str(k): v for k, v in growth.items()},
             "witness": {"x": x, "y": y, "z": first_suffix,
                         "xz": x + first_suffix,
                         "xzInLanguage": balanced(x + first_suffix),
                         "yz": y + first_suffix,
                         "yzInLanguage": balanced(y + first_suffix)}},
)

non_claim(
    "This is a bounded search over words of length at most 6 on a two-letter "
    "alphabet. Every witness it finds is genuine, so the state lower bounds are "
    "sound. It does **not** prove that the balanced language is non-regular — that "
    "requires the distinguishable set to grow without bound, which no finite "
    "search can establish — and it does not prove the even-a language regular, "
    "since failing to find a further witness only rules one out within the bound "
    "examined. It uses a greedy selection rather than a maximum one, so the sets "
    "reported are lower bounds on the largest distinguishable set as well."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. The search stopped at 2 on one language and kept growing on the other. Write
#    what that difference in *behaviour* buys, that a single number would not.
# 2. Finding a witness proves a bound; finding none proves much less. Name the
#    general asymmetry, and one other place in this course it appears.
# 3. Bench `m11-s4` refuted a prune with an instance number. State what a
#    countermodel and a counterexample instance have in common as evidence.
#
# ---
#
# ## Attributions
#
# Module 33 is authoring-only and has no checked-in reference model. The languages,
# the distinguishability search, and the bound sweep are this bench's own.
