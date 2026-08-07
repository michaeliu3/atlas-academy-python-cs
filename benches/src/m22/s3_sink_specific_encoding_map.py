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
# # Bench m22-s3 — sink-specific encoding map
#
# **Session 22.3 — Encoding is a property of the sink.** Rungs: **debug and
# defend** (primary), recognize.
#
# "We use parameterized queries, so we are safe from injection." That sentence is
# true, false, and irrelevant, depending on where the string is going — and this
# bench sends the *same* string to five sinks to show which is which.
#
# The most useful result is not that a hostile string is dangerous. It is that a
# string can be **completely safe in one sink and completely unsafe in the next
# one**, so "is this input sanitised?" is not a well-formed question until the
# sink is named.
#
# Nothing here opens a connection or extracts an archive — the reference model
# reports `connection_opened=False` and `adapter_called=False`, which is the point
# rather than a limitation.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import html  # noqa: E402
import shlex  # noqa: E402
import sys  # noqa: E402
from pathlib import PurePosixPath  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module22_reference import (  # noqa: E402
    ArchiveMember, build_parameterized_query_plan, inspect_archive_metadata,
)

assert sys.version_info >= (3, 12)

bench(module=22, session=3, emits="sink-specific encoding map",
      rungs=["debug-and-defend", "recognize"])

# %% [markdown]
# ## 1. One string, going five places

# %%
HOSTILE = "../etc/passwd'; DROP TABLE atlas_records--<script>"
ORDINARY = "concept-a"

print(f"the string: {HOSTILE!r}")
print("\nit is about to be used as:")
for sink in ("a bound SQL value", "an SQL identifier", "a path component",
             "an archive member path", "HTML text"):
    print(f"  - {sink}")

# %%
predict(
    "The same string is sent to five sinks. A parameterized query binds it as a "
    "value. In how many of the five is parameterization the right defence — and "
    "in how many does it not apply at all?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — sink 1, a bound value

# %%
reference_gate = "accepted"
try:
    build_parameterized_query_plan(HOSTILE)
except ValueError as error:
    reference_gate = str(error)

plan = build_parameterized_query_plan(ORDINARY)
other = build_parameterized_query_plan("locality-b")

print(f"the reference planner, given the hostile string: {reference_gate}")
print(f"  it applies a character allowlist FIRST — lowercase and hyphen only —")
print(f"  so parameterization is never reached.\n")

print(f"statement for {ORDINARY!r:>14}: {plan.statement}")
print(f"statement for {'locality-b'!r:>14}: {other.statement}")
print(f"parameters      : {plan.parameters} against {other.parameters}")
print(f"connection opened: {plan.connection_opened}")

checkpoint("the reference refuses the hostile label before planning",
           reference_gate != "accepted", reference_gate)
checkpoint("the statement is byte-identical for two different labels",
           plan.statement == other.statement,
           "the query shape does not depend on the data — that IS the defence")
checkpoint("only the parameters differ", plan.parameters != other.parameters)


# %% [markdown]
# ### Is the allowlist doing the work, or is the binding?
#
# The reference applies both. To find out which one carries the value sink, this
# bench builds a planner with the allowlist removed and binds the hostile string
# anyway. (This planner is the bench's own, and exists only to isolate the
# question — it is not how the reference behaves.)

# %%
def bind_without_validating(label: str) -> dict:
    """Parameterization alone, with no vocabulary check in front of it."""
    return {"statement": "SELECT record_id FROM atlas_records WHERE label = :label",
            "parameters": {"label": label}}


unvalidated = bind_without_validating(HOSTILE)
in_statement = HOSTILE in unvalidated["statement"]
in_parameters = HOSTILE in unvalidated["parameters"].values()

print(f"statement : {unvalidated['statement']}")
print(f"parameters: {unvalidated['parameters']}")
print(f"\nthe hostile string appears in the statement : {in_statement}")
print(f"the hostile string appears in the parameters: {in_parameters}")

checkpoint("even unvalidated, the value never enters the statement text",
           not in_statement,
           "nothing was escaped — the statement is parsed before the value exists")
checkpoint("it travels beside the statement instead", in_parameters)
checkpoint("so for THIS sink the allowlist is defence in depth, not the defence",
           not in_statement and reference_gate != "accepted",
           "binding alone already suffices; the vocabulary check is a second layer")

# %% [markdown]
# ## 3. Debug — sink 2, an SQL identifier
#
# Now the caller wants to sort by a column the user chose. A column name is not a
# value, and the placeholder syntax has nothing to bind it to.

# %%
def order_by_parameterized(column: str) -> str:
    """The instinct: bind it, like everything else."""
    return f"SELECT record_id FROM atlas_records ORDER BY :column", {"column": column}


def order_by_interpolated(column: str) -> str:
    """What people write when binding does not work."""
    return f"SELECT record_id FROM atlas_records ORDER BY {column}"


ALLOWED_COLUMNS = frozenset({"record_id", "label", "created_at"})


def order_by_allowlisted(column: str) -> str | None:
    """The only correct answer: structure comes from a closed set."""
    if column not in ALLOWED_COLUMNS:
        return None
    return f"SELECT record_id FROM atlas_records ORDER BY {column}"


bound_statement, bound_params = order_by_parameterized(HOSTILE)
interpolated = order_by_interpolated(HOSTILE)
allowlisted = order_by_allowlisted(HOSTILE)

print(f"bound      : {bound_statement}")
print(f"             params={bound_params}")
print(f"             -> the placeholder sorts by a CONSTANT, not by that column")
print(f"\ninterpolated: {interpolated}")
print(f"             -> the hostile string is now executable SQL")
print(f"\nallowlisted : {allowlisted}")

checkpoint("binding does not express an identifier",
           ":column" in bound_statement,
           "the engine would sort every row by the same literal string")
checkpoint("interpolation puts the string into the statement",
           HOSTILE in interpolated,
           "exactly what parameterization was protecting against")
checkpoint("only the allowlist refuses it", allowlisted is None)
checkpoint("and it admits a legitimate column",
           order_by_allowlisted("label") is not None)

# %%
resolve(
    "The same string is sent to five sinks. A parameterized query binds it as a "
    "value. In how many of the five is parameterization the right defence — and "
    "in how many does it not apply at all?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The same string is sent to five sinks. A parameterized query binds it as a "
    "value. In how many of the five is parameterization the right defence — and "
    "in how many does it not apply at all?",
    """
    One of five. In the other four it does not apply — and in one of those, reaching
    for it produces a query that is silently, quietly wrong rather than unsafe.

    The bound-value case is genuine and worth being precise about *why* it works.
    The defence is not that the string was escaped. Nothing was escaped. The string
    never entered the statement at all: the statement is a fixed shape with a
    placeholder, and the value travels beside it, out of band. The engine parses
    the statement before it has the value, so there is no parse for the value to
    influence. That is why the statement is byte-identical for `concept-a` and
    `locality-b` — the query shape does not depend on the data, which is the whole
    mechanism.

    Notice what the reference model does here, because it is doing *two* things and
    they are easy to conflate. It applies a character allowlist to the label —
    lowercase and hyphen only — and it binds the value separately. The hostile
    string never reaches the planner at all; it is refused at the vocabulary gate.

    So which one is carrying the defence? Section 2 answers it by removing the
    allowlist and binding the hostile string anyway: it still never enters the
    statement. **For the value sink, binding alone suffices and the allowlist is
    defence in depth.** Keep it — a second layer is cheap and the first one can be
    misused — but be clear that it is not the thing standing between you and
    injection here.

    Hold that thought for one paragraph, because the next sink inverts it exactly.

    A column name is **part of the statement's shape**. It has to be known at parse
    time. There is nowhere for it to travel out of band, because out-of-band is
    precisely where things that do not affect parsing go. So `ORDER BY :column`
    does not raise and does not inject; it sorts every row by the same constant
    string, which is neither an error nor the query anyone wanted. Interpolating
    instead puts the hostile string directly into executable SQL.

    The only thing that refuses it is the allowlist — **the same mechanism that was
    merely a second layer one sink ago is now the entire defence.** That is the
    sharpest form of this session's claim: a control's value is not a property of
    the control. Ranking defences as "strong" and "weak" in the abstract is what
    produces a codebase that parameterizes diligently and interpolates its column
    names.

    Now generalise, because this is the session's actual claim. Each sink has its
    own grammar, and "dangerous" is a property of the *pairing*:

    `'` matters to SQL and is inert in a path. `..` matters to a path and is inert
    in SQL. `<` matters to HTML and is inert in both. `;` matters to a shell and is
    inert in all three. There is no such thing as a sanitised string, because
    sanitising means "encoded for a grammar" and a string is not travelling to a
    grammar until you send it somewhere.

    This is why input-side sanitisation fails as a strategy, and it fails in two
    directions at once. It **under-protects**, because at input time you cannot know
    every sink the value will reach — the value that was only ever displayed last
    year is in a filename this year. And it **corrupts**, because a person legitimately
    named `O'Brien` has their name mangled by SQL-shaped escaping applied at the
    boundary, then double-mangled by the encoder at the sink that actually needed it.

    The rule that survives: **encode at the sink, once, for that sink's grammar,
    with that grammar's own encoder.** Keep the value pristine in between. And when
    a sink has no encoder — because what you are inserting is structure rather than
    data — an allowlist is not a fallback, it is the only correct answer.
    """,
)

# %% [markdown]
# ## 4. Debug — sinks 3, 4, and 5

# %%
sinks = {}

# Sink 3: a path component.
joined = PurePosixPath("/srv/atlas/records") / HOSTILE
escapes = ".." in PurePosixPath(HOSTILE).parts
sinks["path component"] = {"rendered": str(joined), "unsafe": escapes,
                           "reason": "'..' traverses; quotes and angle brackets "
                                     "are inert here"}

# Sink 4: an archive member path, judged by the reference policy.
archive = inspect_archive_metadata((ArchiveMember(HOSTILE, "file", 10),))
ordinary_archive = inspect_archive_metadata((ArchiveMember("notes/a.txt", "file", 10),))
sinks["archive member"] = {"rendered": archive.outcome,
                           "unsafe": archive.outcome.startswith("REJECTED"),
                           "reason": archive.reason}

# Sink 5: HTML text.
sinks["HTML text"] = {"rendered": html.escape(HOSTILE),
                      "unsafe": False,
                      "reason": "'<' and '>' are encoded; '..' and quotes are "
                                "harmless in this grammar"}

# And for contrast, a shell argument.
sinks["shell argument"] = {"rendered": shlex.quote(HOSTILE),
                           "unsafe": False,
                           "reason": "the whole string becomes one quoted token"}

for sink, row in sinks.items():
    print(f"{sink:>16}: {row['rendered'][:64]}")
    print(f"{'':>16}  unsafe={row['unsafe']}  {row['reason'][:60]}")

print(f"\narchive adapter called: {archive.adapter_called} "
      f"— the decision was made from metadata, before any extraction")

checkpoint("the archive policy rejects the traversal",
           sinks["archive member"]["unsafe"],
           archive.reason)
checkpoint("and admits an ordinary member",
           ordinary_archive.outcome.startswith("APPROVED"))
checkpoint("no extraction happened either way", not archive.adapter_called)
checkpoint("HTML escaping neutralises the angle brackets",
           "<script>" not in sinks["HTML text"]["rendered"]
           and "&lt;script&gt;" in sinks["HTML text"]["rendered"])
checkpoint("but HTML escaping leaves the traversal untouched",
           ".." in sinks["HTML text"]["rendered"],
           "an encoder for the wrong grammar is not a partial defence — it is "
           "no defence")

# %% [markdown]
# ## 5. Recognize — which encoder for which sink?

# %%
PAIRINGS = {
    "a": "A user-supplied label, used as a bound SQL value.",
    "b": "A user-supplied column name, used in ORDER BY.",
    "c": "A user-supplied filename, joined onto a directory.",
    "d": "A user-supplied label, rendered into an HTML page.",
    "e": "A label that was HTML-escaped at input, then used as a filename.",
}
for key, text in PAIRINGS.items():
    print(f"{key}. {text}")


def defended_by_parameterization(key: str) -> bool:
    """True when parameterized queries are the right defence for this pairing."""
    raise NotImplementedError("Match the defence to the sink, not to the input")


# %%
check("defended_by_parameterization", defended_by_parameterization,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False),
       (("e",), False)])
print()
print("(e) is the one to argue about: it was 'sanitised', and it is still a")
print("traversal. HTML escaping does not touch '..', so the value arrives at the")
print("filesystem exactly as dangerous as it started — and now also corrupted for")
print("any consumer expecting the original text.")

# %% [markdown]
# ## 6. The encoding map

# %%
ENCODING_MAP = """
Sink | Grammar | What is dangerous here | Correct encoder | Where it is applied
-----+---------+------------------------+-----------------+--------------------
     |         |                        |                 |
     |         |                        |                 |
     |         |                        |                 |

Why the bound value is safe, stated without using the word 'escaped':
The sink where parameterization does not apply, and what replaces it:
The character that is dangerous in one sink and inert in another:
Why encoding at input fails in two directions, with an example of each:
"""
print(ENCODING_MAP)

# %%
claim("DEFENDED REPAIR", ENCODING_MAP)

claim(
    "LOCAL REFERENCE RESULT",
    f"One string containing a traversal, an SQL quote, and a script tag was sent "
    f"to five sinks. The reference planner refuses it at a character allowlist "
    f"before parameterization is reached; with that allowlist removed, binding "
    f"alone still keeps it out of the statement text, so for the value sink the "
    f"allowlist is defence in depth. As an SQL identifier the relationship "
    f"inverts: binding produces a query that sorts by a constant rather than by "
    f"the column, interpolation places the string into executable SQL, and the "
    f"allowlist is the only control that refuses it. The reference archive policy "
    f"rejects it as a member path with adapter_called={archive.adapter_called}. "
    f"HTML escaping neutralises the angle brackets and leaves the traversal "
    f"intact.",
    support={"input": HOSTILE,
             "referenceGate": reference_gate,
             "boundValue": {"statement": plan.statement,
                            "parameters": plan.parameters,
                            "connectionOpened": plan.connection_opened,
                            "stringInStatementWithoutAllowlist": in_statement},
             "identifier": {"bound": bound_statement,
                            "interpolatedContainsInput": HOSTILE in interpolated,
                            "allowlistResult": allowlisted},
             "sinks": {sink: {"unsafe": row["unsafe"],
                              "rendered": row["rendered"][:120]}
                       for sink, row in sinks.items()},
             "archive": {"outcome": archive.outcome, "reason": archive.reason,
                         "adapterCalled": archive.adapter_called}},
)

non_claim(
    "No database connection was opened, no archive was extracted, no shell was "
    "run, and no page was rendered — the reference model reports "
    "connection_opened=False and adapter_called=False, and the other sinks are "
    "stdlib encoders called directly. This establishes which defence applies to "
    "which sink and that one string's danger is sink-relative. It does not "
    "demonstrate a successful exploit against any real system, does not enumerate "
    "the sinks a given application has, and says nothing about second-order "
    "injection, encoder bugs, or grammars whose parsers disagree with their "
    "specifications — which is where real incidents usually live."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. The same string was safe in one sink and unsafe in the next. Write the rule
#    that makes "is this input sanitised?" a malformed question.
# 2. Binding an identifier neither raised nor injected. Name the failure class that
#    describes it, and say why it is harder to catch than either.
# 3. Bench `m18-s4` found a guard applied to a name rather than to the resolved
#    resource. State what that and input-side sanitisation have in common.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module22_reference.py` — `build_parameterized_query_plan`,
# `inspect_archive_metadata`, `ArchiveMember`. Not reimplemented. The five-sink
# comparison, the identifier experiment, and the pairing sort are this bench's own.
