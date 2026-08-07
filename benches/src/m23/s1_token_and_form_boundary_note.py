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
# # Bench m23-s1 — token and form boundary note
#
# **Session 23.1 — Tokens, forms, and where the boundaries are.** Rungs: **trace**
# (primary), recognize.
#
# Characters are not tokens and tokens are not structure. Those are two separate
# boundaries, and code that treats "split on whitespace" as tokenization has
# collapsed the first one — usually without noticing, because it works on every
# example anyone tries.
#
# This bench lexes eight inputs and compares the token boundaries against the
# whitespace boundaries. They disagree in both directions.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module23_reference import lex_query  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=23, session=1, emits="token and form boundary note",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. Eight inputs

# %%
INPUTS = [
    'count where label = "a"',
    'count where label = "a b"',
    'count   where   label   =   "a"',
    'count where score > 5',
    '',
    '   ',
    'count',
    'count where label = "a b c d"',
]

for text in INPUTS:
    print(f"  {text!r}")

# %%
predict(
    "One of these inputs contains a space that does NOT separate two tokens, and "
    "one contains a character the lexer refuses. Which is which — and does the "
    "refusal return no tokens, or some?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — lex each input, count both kinds of boundary

# %%
print(f"{'input':>32}  {'outcome':>10}  {'tokens':>6}  {'whitespace pieces':>17}")
lexed = {}
for text in INPUTS:
    result = lex_query(text)
    pieces = len(text.split())
    lexed[text] = {"outcome": result.outcome, "tokens": len(result.tokens),
                   "pieces": pieces, "reason": result.reason,
                   "span": (result.span.start, result.span.end) if result.span
                           else None,
                   "kinds": [t.kind for t in result.tokens]}
    print(f"{text!r:>32}  {result.outcome:>10}  {len(result.tokens):>6}  "
          f"{pieces:>17}")

disagree = [text for text, row in lexed.items()
            if row["outcome"] == "TOKENS" and row["tokens"] != row["pieces"]]

print(f"\ninputs where the token count differs from the whitespace-piece count:")
for text in disagree:
    print(f"  {text!r}: {lexed[text]['tokens']} tokens, "
          f"{lexed[text]['pieces']} whitespace pieces")

checkpoint("token boundaries and whitespace boundaries disagree",
           len(disagree) > 0)
checkpoint("extra whitespace does not create extra tokens",
           lexed['count   where   label   =   "a"']["tokens"]
           == lexed['count where label = "a"']["tokens"],
           "the lexer discards separators; they are not part of the structure")
checkpoint("a quoted space does not split a token",
           lexed['count where label = "a b"']["tokens"]
           == lexed['count where label = "a"']["tokens"],
           '"a b" is ONE token containing a space')
checkpoint("and a longer quoted string is still one token",
           lexed['count where label = "a b c d"']["tokens"]
           == lexed['count where label = "a"']["tokens"])

# %%
resolve(
    "One of these inputs contains a space that does NOT separate two tokens, and "
    "one contains a character the lexer refuses. Which is which — and does the "
    "refusal return no tokens, or some?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "One of these inputs contains a space that does NOT separate two tokens, and "
    "one contains a character the lexer refuses. Which is which — and does the "
    "refusal return no tokens, or some?",
    """
    `"a b"` is one token containing a space. `>` is refused. And the refusal comes
    back with **three tokens already built**, plus the exact character position
    where it stopped.

    Take the quoted space first, because it is the boundary this session names.
    Whitespace usually separates tokens, and inside a string literal it does not —
    it is *content*. So `label = "a b"` is four tokens, not five, and
    `text.split()` gets it wrong. The same input with three extra spaces between
    every word is still four tokens, because separators are discarded rather than
    counted.

    Those two facts together are the definition of a lexer: it is the thing that
    decides which characters group into which token, and that decision is neither
    "split on spaces" nor "one character at a time". Both directions of error are
    live here — `split()` over-splits the quoted string and, on other grammars,
    under-splits things like `score>5` where no space exists between distinct
    tokens at all.

    Now the refusal, which is the more interesting engineering result. `>` is not in
    this grammar's alphabet — only `=` is a comparison — so lexing fails at
    character 18. It does not throw away what it had. It returns `LEX_ERROR`, the
    three tokens it successfully built, a reason, and a `Span` naming the exact
    character.

    That shape is worth stealing wherever you parse anything. A boolean `False`
    tells the caller a string is bad. A partial token list plus a span tells the
    caller *where*, which is the difference between "syntax error" and an editor
    underlining one character. The information existed at the moment of failure in
    both designs; only one of them kept it.

    Finally, the empty string. It lexes **successfully**, to zero tokens. That is
    correct and it is the clearest demonstration that lexing and parsing are
    different stages answering different questions. "Is every character part of some
    legal token?" — yes, vacuously. "Do those tokens form a legal query?" — no, and
    that is not the lexer's question. A pipeline that conflates the two ends up
    reporting a lexical error for a structural problem, and pointing the user at the
    wrong thing.

    This is the same structure as bench `m20-s2`'s framing: bytes group into
    messages, characters group into tokens, and in both cases the grouping is a
    *prior agreement* rather than something recoverable from the raw stream by
    looking harder.
    """,
)

# %% [markdown]
# ## 3. Trace — what a failure carries

# %%
FAILING = 'count where score > 5'
failure = lex_query(FAILING)

print(f"input   : {FAILING!r}")
print(f"outcome : {failure.outcome}")
print(f"stage   : {failure.stage}")
print(f"reason  : {failure.reason}")
print(f"span    : {failure.span}")
print(f"tokens built before failing: "
      f"{[(t.kind, t.text) for t in failure.tokens]}")

start, end = failure.span.start, failure.span.end
print(f"\n  {FAILING}")
print(f"  {' ' * start}{'^' * (end - start)} character {start}: "
      f"{FAILING[start:end]!r}")

checkpoint("the failure names the stage", failure.stage == "LEXICAL_STRUCTURE")
checkpoint("it points at one character",
           end - start == 1 and FAILING[start:end] == ">")
checkpoint("and it keeps the tokens it did build", len(failure.tokens) > 0,
           f"{len(failure.tokens)} tokens survived — the caller is not sent back "
           f"to the raw string")

# %% [markdown]
# ## 4. Trace — lexing succeeds where parsing must fail

# %%
print(f"{'input':>14}  {'lex outcome':>11}  {'tokens':>6}  is it a legal query?")
for text in ("", "   ", "count"):
    row = lexed[text]
    print(f"{text!r:>14}  {row['outcome']:>11}  {row['tokens']:>6}  "
          f"no — but that is not the lexer's question")

empty_ok = lexed[""]["outcome"] == "TOKENS" and lexed[""]["tokens"] == 0

checkpoint("the empty string lexes successfully to zero tokens", empty_ok)
checkpoint("whitespace-only does too",
           lexed["   "]["outcome"] == "TOKENS" and lexed["   "]["tokens"] == 0)
checkpoint("so a lexical success is not a structural one", empty_ok,
           "'every character is part of a legal token' is vacuously true here")

# %% [markdown]
# ## 5. Recognize — which stage owns each complaint?

# %%
COMPLAINTS = {
    "a": "There is a '>' and this grammar has no such operator.",
    "b": "The query has no comparison at all.",
    "c": "A string literal is never closed.",
    "d": "'where' appears twice in a row.",
}
for key, text in COMPLAINTS.items():
    print(f"{key}. {text}")


def lexical(key: str) -> bool:
    """True when this is the lexer's complaint rather than the parser's."""
    raise NotImplementedError("Assign each complaint to a stage")


# %%
check("lexical", lexical,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), False)])
print()
print("(c) is the one that looks structural and is not. An unterminated string is")
print("a token that cannot be completed — the lexer knows it ran out of input")
print("mid-token. (d) is two perfectly good tokens in an order the grammar")
print("forbids, which the lexer has no opinion about whatsoever.")

# %% [markdown]
# ## 6. The boundary note

# %%
BOUNDARY_NOTE = """
The two boundaries, stated separately:
The input where a space was content rather than a separator:
The input where token count and whitespace-piece count agreed by luck:
What the failure carried besides 'invalid', and what each part buys a caller:
Why the empty string is a lexical success and a structural failure:
The complaint I would have assigned to the wrong stage, and how I would tell now:
"""
print(BOUNDARY_NOTE)

# %%
claim("COURSE MODEL", BOUNDARY_NOTE)

claim(
    "LOCAL REFERENCE RESULT",
    f"Across {len(INPUTS)} inputs, the reference lexer's token count differs from "
    f"a whitespace split on {len(disagree)} of them: a quoted space is content "
    f"rather than a separator, so 'label = \"a b c d\"' lexes to the same token "
    f"count as 'label = \"a\"'. Refusing '>' returns LEX_ERROR at stage "
    f"{failure.stage} with span ({start}, {end}) naming that exact character, "
    f"while retaining the {len(failure.tokens)} tokens already built. The empty "
    f"string and a whitespace-only string both lex successfully to zero tokens.",
    support={"inputs": {text: row for text, row in lexed.items()},
             "disagreeing": disagree,
             "failure": {"input": FAILING, "outcome": failure.outcome,
                         "stage": failure.stage, "reason": failure.reason,
                         "span": [start, end],
                         "tokensRetained": len(failure.tokens)}},
)

non_claim(
    "This is one declared query grammar with a small fixed alphabet, lexed over "
    "eight hand-written inputs. It establishes that token boundaries and "
    "whitespace boundaries are different things in this grammar, and what this "
    "lexer's failure value carries. It is not a model of Python's tokenizer, says "
    "nothing about Unicode identifier rules, normalization, or bidirectional text, "
    "and does not establish that returning partial tokens is safe in a grammar "
    "where a later character can change an earlier token's meaning."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. `split()` was wrong in one direction here and is wrong in the other on
#    `score>5`. Write the rule this implies about hand-rolled tokenizers.
# 2. The failure kept its partial tokens and a span. Name what a bare `False` would
#    have destroyed, and when that information existed.
# 3. Bench `m20-s2` found byte boundaries that did not match message boundaries.
#    State the general principle both benches are instances of.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module23_reference.py` — `lex_query`. Not
# reimplemented. The input set, the token-versus-whitespace comparison, and the
# stage-assignment sort are this bench's own.
