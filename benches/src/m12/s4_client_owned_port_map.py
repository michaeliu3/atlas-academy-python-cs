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
# # Bench m12-s4 — client-owned port map
#
# **Session 12.4 — Structural ports and dependency inversion.** Rungs: **debug and
# defend** (primary), review and verify.
#
# The session's fifth derived principle is the one this bench tests: *treat laws,
# failure behavior, and side-effect policy as prose-and-test contracts beyond the
# method surface.* "Beyond the method surface" is doing real work in that sentence,
# and `@runtime_checkable` is where you find out how much.
#
# Then the architecture half: the session asks you to reverse `Ports --> Pipe` and
# explain the new change propagation. That reversal is declared to the module's
# reference model, which names the violation.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402
from typing import Protocol, runtime_checkable  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module12_reference import (  # noqa: E402
    Component, ConcreteSelection, Dependency, inspect_architecture,
)

assert sys.version_info >= (3, 12)

bench(module=12, session=4, emits="client-owned port map",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. The port, owned by the client

# %%
@runtime_checkable
class Importer(Protocol):
    """The operation the application needs, named from the client's side."""

    def load(self, source: str, limit: int) -> list[str]:
        ...


class GoodImporter:
    def load(self, source: str, limit: int) -> list[str]:
        return [f"{source}-{index}" for index in range(limit)]


class WrongArity:
    """Same method name. One parameter short."""

    def load(self, source: str) -> list[str]:
        return [source]


class WrongReturn:
    def load(self, source: str, limit: int) -> str:
        return f"{source} x{limit}"


class NotEvenCallable:
    """`load` is an attribute, not a method."""

    load = "definitely not a method"


CANDIDATES = [GoodImporter(), WrongArity(), WrongReturn(), NotEvenCallable()]

# %%
predict(
    "Four candidate implementations. One matches the port exactly; the others get "
    "the arity wrong, the return type wrong, and one has `load` as a string. How "
    "many pass `isinstance(candidate, Importer)`?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — check them, then call them

# %%
def call(candidate) -> str:
    try:
        result = candidate.load("atlas", 2)
    except Exception as error:  # noqa: BLE001
        return f"{type(error).__name__}"
    return "list of 2" if result == ["atlas-0", "atlas-1"] else f"{result!r}"


print(f"{'candidate':>18}  {'isinstance':>10}  {'calling it':>28}")
observations = {}
for candidate in CANDIDATES:
    name = type(candidate).__name__
    observations[name] = {"isinstance": isinstance(candidate, Importer),
                          "call": call(candidate)}
    print(f"{name:>18}  {str(observations[name]['isinstance']):>10}  "
          f"{observations[name]['call']:>28}")

passing = [n for n, o in observations.items() if o["isinstance"]]
passing_but_broken = [n for n, o in observations.items()
                      if o["isinstance"] and o["call"] != "list of 2"]

print(f"\npassed isinstance : {passing}")
print(f"...and still wrong: {passing_but_broken}")

checkpoint("more than one candidate passes isinstance", len(passing) > 1)
checkpoint("the wrong-arity implementation passes the check",
           observations["WrongArity"]["isinstance"])
checkpoint("and fails when called", observations["WrongArity"]["call"] == "TypeError")
checkpoint("the non-callable attribute passes too",
           observations["NotEvenCallable"]["isinstance"],
           "`load` exists as a name; nothing checked that it is callable")

# %%
resolve(
    "Four candidate implementations. One matches the port exactly; the others get "
    "the arity wrong, the return type wrong, and one has `load` as a string. How "
    "many pass `isinstance(candidate, Importer)`?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Four candidate implementations. One matches the port exactly; the others get "
    "the arity wrong, the return type wrong, and one has `load` as a string. How "
    "many pass `isinstance(candidate, Importer)`?",
    """
    All four.

    `@runtime_checkable` buys you exactly one thing: `isinstance` will check that
    the named **attributes exist**. It does not check arity, does not check
    parameter names, does not check annotations, does not check the return type,
    and does not check that a method-shaped member is callable at all. `load = "a
    string"` satisfies it, because a member called `load` is present.

    The typing documentation says this outright, and it is not an oversight — a
    genuine structural check would have to inspect signatures at runtime for
    every candidate, and Python's type annotations are deliberately not present at
    runtime in a form that would make that reliable or cheap.

    So the check answers "does this object have the right *names*", and the port
    is a claim about "does this object have the right *behaviour*". Three of the
    four candidates demonstrate the gap, each in a different way: wrong arity
    fails at the call, wrong return type does not fail at all and produces a
    string where the caller expects a list, and the non-callable member fails with
    an error blaming the caller.

    The wrong-return-type case is the one to sit with. Nothing raised. The
    application received a `str`, and a `str` is iterable, so a downstream `for`
    loop will happily iterate over its characters. The defect surfaces somewhere
    else entirely, as a data problem — which is the same shape as bench `m13-s4`,
    where the traceback landed three owners away from the parser.

    None of this is an argument against Protocols. The port is still the right
    abstraction, and a static checker *does* verify all of the above — arity,
    types, and return — before the code ever runs. The mistake is treating
    `isinstance` against a runtime-checkable Protocol as if it were that check.

    Which is precisely why the session's fifth principle says laws, failure
    behaviour, and side-effect policy are prose-and-test contracts *beyond the
    method surface*. A contract test that calls the operation and checks the
    result — bench `m13-s3`'s provider-contract suite — catches every candidate
    here. `isinstance` catches none of them.
    """,
)

# %% [markdown]
# ## 3. Verify — the check that does discriminate

# %%
def satisfies_contract(candidate) -> bool:
    """Call the operation and check the port's actual promise."""
    try:
        result = candidate.load("atlas", 2)
    except Exception:  # noqa: BLE001
        return False
    return (isinstance(result, list) and len(result) == 2
            and all(isinstance(item, str) for item in result))


print(f"{'candidate':>18}  {'isinstance':>10}  {'contract test':>13}")
for candidate in CANDIDATES:
    name = type(candidate).__name__
    print(f"{name:>18}  {str(isinstance(candidate, Importer)):>10}  "
          f"{str(satisfies_contract(candidate)):>13}")

accepted = [type(c).__name__ for c in CANDIDATES if satisfies_contract(c)]

checkpoint("the contract test accepts exactly one candidate",
           accepted == ["GoodImporter"])
checkpoint("isinstance accepted four", len(passing) == 4,
           "the two checks answer different questions; only one is about behaviour")

# %% [markdown]
# ## 4. Review and verify — reverse one edge and declare it
#
# The session's diagram has `Ports --> Domain`, with `Pipe --> Ports`. Reverse
# `Ports --> Pipe` and hand both graphs to the reference model.

# %%
COMPONENTS = (
    Component(name="bootstrap", role="composition-root"),
    Component(name="catalog", role="application-policy"),
    Component(name="importer-port", role="port"),
    Component(name="pipe-importer", role="adapter"),
)
SELECTIONS = (ConcreteSelection(owner="bootstrap", implementation="pipe-importer"),)

CORRECT = (
    Dependency(source="catalog", target="importer-port"),
    Dependency(source="pipe-importer", target="importer-port"),
)
REVERSED = CORRECT + (Dependency(source="importer-port", target="pipe-importer"),)

reports = {
    "as designed": inspect_architecture(COMPONENTS, CORRECT, SELECTIONS),
    "Ports --> Pipe reversed": inspect_architecture(COMPONENTS, REVERSED, SELECTIONS),
}

print(f"{'graph':>24}  {'direction preserved':>19}  violations")
for label, report in reports.items():
    print(f"{label:>24}  {str(report.preserves_dependency_direction):>19}  "
          f"{[v.kind for v in report.violations]}")

for violation in reports["Ports --> Pipe reversed"].violations:
    print(f"\n  {violation.source} -> {violation.target}")
    print(f"  {violation.explanation}")

print(f"\nmodel scope: {reports['as designed'].scope}")

checkpoint("the designed graph preserves direction",
           reports["as designed"].preserves_dependency_direction)
checkpoint("reversing the edge is rejected",
           not reports["Ports --> Pipe reversed"].preserves_dependency_direction)
checkpoint("and the violation names the concrete choice, not just the direction",
           [v.kind for v in reports["Ports --> Pipe reversed"].violations]
           == ["forbidden-concrete-dependency"],
           "the port would have to know which adapter exists")

# %% [markdown]
# ## 5. Recognize — what crosses each edge

# %%
EDGES = {
    "a": "bootstrap -> pipe-importer",
    "b": "catalog -> importer-port",
    "c": "pipe-importer -> importer-port",
    "d": "importer-port -> pipe-importer",
}
for key, text in EDGES.items():
    print(f"{key}. {text}")


def permitted(key: str) -> bool:
    """True when the declared policy allows this knowledge to cross."""
    raise NotImplementedError("Judge each edge against the policy")


# %%
check("permitted", permitted,
      [(("a",), True), (("b",), True), (("c",), True), (("d",), False)])
print()
print("(a) and (d) both connect the same two ideas — an abstraction and a concrete")
print("mechanism. The direction is the whole difference: the composition root is")
print("ALLOWED to know the mechanism, because knowing it is its only job.")

# %% [markdown]
# ## 6. The port map

# %%
PORT_MAP = """
The client operation the port is named from (not the implementation class):
Each edge, with what knowledge crosses it:
The check I would run before accepting a new implementation, and why isinstance
is not it:
What reversing Ports --> Pipe costs, in change propagation and testing:
The part of the contract no structural check can express, stated as prose:
"""
print(PORT_MAP)

# %%
claim("DEFENDED REPAIR", PORT_MAP)

claim(
    "LOCAL REFERENCE RESULT",
    f"On CPython {sys.version_info.major}.{sys.version_info.minor}, all "
    f"{len(CANDIDATES)} candidates pass `isinstance` against a `@runtime_checkable` "
    f"Protocol — including one with the wrong arity, one returning a str instead of "
    f"a list, and one whose `load` is a string rather than a method. A contract "
    f"test that calls the operation accepts exactly {len(accepted)}. Separately, "
    f"inspect_architecture accepts the designed graph and reports the reversed "
    f"Ports-to-Pipe edge as a forbidden-concrete-dependency.",
    support={"pythonVersion": f"{sys.version_info.major}.{sys.version_info.minor}",
             "candidates": observations,
             "contractTestAccepts": accepted,
             "architecture": {
                 label: {"preservesDirection": r.preserves_dependency_direction,
                         "violations": [{"kind": v.kind, "source": v.source,
                                         "target": v.target} for v in r.violations]}
                 for label, r in reports.items()}},
)

non_claim(
    "The isinstance behaviour is a documented property of runtime-checkable "
    "Protocols and holds generally on this Python version; the four candidates are "
    "hand-written and prove the gap exists, not how often it bites. The "
    "architecture result is about a declared four-component graph under this "
    "model's one explicit policy — the reference model's own scope says it "
    "establishes no runtime import behaviour, no trust, and no substitutability. "
    "Nothing here runs a static type checker, which would reject three of the four "
    "candidates before execution, and that omission is the point rather than a gap."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. `isinstance` returned True for an implementation that cannot be called. Write
#    the rule about what a passing structural check licenses you to assume.
# 2. One candidate failed and one succeeded-with-the-wrong-type. Name which is more
#    dangerous in a system, and defend it in one sentence.
# 3. Bench `m13-s3` separated two providers with one added clause. State what that
#    clause and a port's prose contract have in common.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module12_reference.py` — `inspect_architecture`,
# `Component`, `Dependency`, `ConcreteSelection`. Not reimplemented. The Protocol,
# the four candidates, and the contract test are this bench's own.
