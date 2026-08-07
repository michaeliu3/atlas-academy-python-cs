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
# # Bench m09-s5 — ordering-contract comparison memo
#
# **Session 9.5 — Sorting and prefix paths organize different evidence.** Rungs:
# **review and verify** (primary), map.
#
# The prefix-search half of the module's project evidence. You review four
# claims an assistant made about the index, and check each against a measurement
# rather than against plausibility.
#
# *Prefix-query test cases adapted from
# [donnemartin/interactive-coding-challenges](https://github.com/donnemartin/interactive-coding-challenges)
# `graphs_trees/trie` (Apache-2.0), pinned at `358f2cc`.*
#
# **Requires:** Python 3.12+. Standard library only.

# %%
import random
import sys
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, classify_growth, emit, measure, non_claim,
    predict, resolve, reveal,
)
from _fixture import CONCEPTS  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=9, session=5, emits="ordering-contract comparison memo",
      rungs=["review-and-verify", "map"])

# %% [markdown]
# ## 1. Map — the prefix index
#
# **Constraints:** case-insensitive; a stored word is its own prefix; results
# ascending, so they are stable across runs ([ATLAS POLICY]).


# %%
class ConceptTrie:
    """Prefix index over Atlas concept ids."""

    END = "\x00"

    def __init__(self) -> None:
        self._root: dict = {}

    def insert(self, word: str) -> None:
        raise NotImplementedError("Implement insert")

    def starts_with(self, prefix: str) -> list[str]:
        """All stored words having `prefix`, ascending. Empty prefix -> all."""
        raise NotImplementedError("Implement starts_with")


# %%
trie = ConceptTrie()
try:
    for concept in CONCEPTS:
        trie.insert(concept)
    check(
        "ConceptTrie.starts_with",
        trie.starts_with,
        [
            (("merge",), ["merge-intervals", "merge-sort"]),
            (("b",), ["bfs", "binary-heap", "binary-search-tree", "bst-validate"]),
            (("hash",), ["hash-table", "hashing"]),
            (("zzz",), []),
            (("bfs",), ["bfs"]),
        ],
    )
except NotImplementedError:
    print("ConceptTrie not implemented yet — skipping.")

# %% [markdown]
# ## 2. Measure the alternative
#
# `[c for c in concepts if c.startswith(p)]` is one readable line, and readable
# lines win unless evidence says otherwise.

# %%
random.seed(9)
alphabet = "abcdefghijklmnopqrstuvwxyz"
CORPUS = {n: ["".join(random.choices(alphabet, k=12)) for _ in range(n)]
          for n in [1000, 2000, 4000, 8000, 16000]}
sizes = sorted(CORPUS)
linear = measure(lambda n: [w for w in CORPUS[n] if w.startswith("ab")], sizes, repeats=3)
linear_class = classify_growth(sizes, linear)
print(f"linear filter -> {linear_class}")

# %% [markdown]
# ## 3. Review — four claims about the index

# %%
CLAIMS = {
    "a": "The linear filter's query cost grows with corpus size.",
    "b": "The trie makes prefix queries constant time.",
    "c": "The trie's query cost depends on prefix length, not corpus size.",
    "d": "The trie is strictly better, so Atlas should always use it.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported(key: str) -> bool:
    """True when this bench's evidence supports the claim as written."""
    raise NotImplementedError("Audit the four claims")


# %%
check("supported", supported,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), False)])

# %%
predict(
    "Claim (b) says 'constant time' and claim (c) says 'depends on prefix "
    "length'. Both sound like the trie's selling point. Which is wrong, and why?",
    answer="",
    confidence="",
)

# %%
checkpoint("the linear filter is not constant in corpus size",
           not linear_class.startswith("constant"), linear_class)

# %%
resolve(
    "Claim (b) says 'constant time' and claim (c) says 'depends on prefix "
    "length'. Both sound like the trie's selling point. Which is wrong, and why?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Claim (b) says 'constant time' and claim (c) says 'depends on prefix "
    "length'. Both sound like the trie's selling point. Which is wrong, and why?",
    """
    (b) is wrong. Descending the trie costs one step per prefix character, so a
    query is O(len(prefix)) — plus O(size of result) to collect the matches.
    "Constant time" quietly drops both terms.

    The second term is the one that bites. A query for prefix "b" over this
    corpus returns four concepts; over a corpus of a million it might return
    thousands, and collecting them is linear in *what you return* no matter how
    fast you found the subtree. A trie makes the *search* independent of corpus
    size; it cannot make the *answer* smaller.

    (d) fails differently, and it is the more important error. It is a design
    conclusion drawn from a single cost dimension. The trie buys query
    independence with build time and memory, and this bench measured neither. If
    Atlas rebuilds the index on every write and queries it rarely, the one-line
    filter wins on every axis that matters. Which structure is right depends on
    the query-to-update ratio — a fact about the workload, not about tries.
    """,
)

# %% [markdown]
# ## 4. The memo

# %%
COMPARISON_MEMO = """
Operation each structure makes cheap:
Operation each structure makes expensive:
The workload measurement that would decide between them:
The claim I reject, and what evidence it would need:
"""
print(COMPARISON_MEMO)

# %% [markdown]
# ## 5. The record

# %%
claim("REVIEW VERDICT", COMPARISON_MEMO)

claim(
    "FINITE EXPERIMENT",
    f"A linear prefix filter measured {linear_class} across corpus sizes "
    f"{sizes[0]}..{sizes[-1]}.",
    support={"sizes": sizes, "seconds": linear, "classification": linear_class},
)

non_claim(
    "This bench measured the linear filter only. It did not measure the trie's "
    "query time, build time, or memory, so it cannot support any comparative "
    "performance claim — including the one the session is named after. What it "
    "establishes is the shape of the alternative, not the winner."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Name the query-to-update ratio below which the one-line filter is the better
#    engineering choice, and say what you would measure to find it.
# 2. Claim (d) drew a design conclusion from one cost dimension. State the general
#    form of that error in one sentence.
#
# ---
#
# ## Attributions
#
# Prefix-query test cases adapted from
# [donnemartin/interactive-coding-challenges](https://github.com/donnemartin/interactive-coding-challenges)
# `graphs_trees/trie`, Apache-2.0, © 2015 Donne Martin, pinned at
# `358f2cc60426d5c4c3d7d580910eec9a7b393fa9`. The claim audit, the measurement,
# and all Atlas framing are this course's own.
