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
# # Bench m23-s3 — environment and closure trace
#
# **Session 23.3 — Environments, closures, and scope.** Rungs: **trace**
# (primary), debug and defend.
#
# Scope is the clearest case in the whole course of something that **looks like a
# property of the code and is a property of the interpreter**. The same syntax,
# the same abstract syntax tree, the same inputs — and a different answer,
# decided by a rule that appears nowhere in the program text.
#
# The reference model is lexically scoped by declaration, so there is nothing in
# it to compare against. This bench supplies a dynamic-scope evaluator over the
# *identical* AST, purely as the contrast, and it is clearly the bench's own.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module23_reference import (  # noqa: E402
    PebbleApply, PebbleBinary, PebbleFunction, PebbleInt, PebbleLet, PebbleName,
    pebble_closure_example, pebble_evaluate,
)

assert sys.version_info >= (3, 12)

bench(module=23, session=3, emits="environment and closure trace",
      rungs=["trace", "debug-and-defend"])

# %% [markdown]
# ## 1. The program
#
# ```text
# let x = 7 in
#   let add_x = fun y -> x + y in
#     let x = 100 in
#       add_x 5
# ```
#
# `add_x` is *defined* where `x` is 7. It is *called* where `x` is 100. Which `x`
# does the body see?

# %%
PROGRAM = PebbleLet(
    "x", PebbleInt(7),
    PebbleLet(
        "add_x",
        PebbleFunction("y", PebbleBinary("+", PebbleName("x"), PebbleName("y"))),
        PebbleLet("x", PebbleInt(100),
                  PebbleApply(PebbleName("add_x"), PebbleInt(5))),
    ),
)

print("one AST, built once, evaluated twice below:")
print(f"  {PROGRAM}"[:100] + " ...")

# %%
predict(
    "add_x is defined where x is 7 and called where x is 100. Under lexical scope "
    "and under dynamic scope, what does `add_x 5` return?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — the reference interpreter, lexically scoped

# %%
lexical = pebble_evaluate(PROGRAM)
canonical = pebble_closure_example()

print(f"reference evaluation : {lexical.outcome}  value={lexical.value}  "
      f"fuel={lexical.consumed_fuel}")
print(f"the model's own example: {canonical.outcome}  value={canonical.value}")

checkpoint("the reference evaluates the program",
           lexical.outcome == "VALUE")
checkpoint("it agrees with the model's published example",
           lexical.value == canonical.value,
           "the AST built here is the same program the reference documents")
checkpoint("the answer uses the DEFINING x, not the calling one",
           lexical.value == 12,
           "7 + 5, not 100 + 5 — the rebinding of x is invisible to add_x")

# %% [markdown]
# ## 3. Trace — the same AST under dynamic scope
#
# The only change is what a function value carries. A lexical closure captures
# the environment it was *defined* in. A dynamic one captures nothing and is
# evaluated in whatever environment is current when it is *called*.

# %%
class DynamicFunction:
    """A function value that captures no environment at all."""

    def __init__(self, parameter: str, body: object) -> None:
        self.parameter = parameter
        self.body = body


def dynamic_evaluate(node: object, environment: dict | None = None):
    """Identical rules to the reference, except for the one that matters.

    THIS IS THIS BENCH'S OWN CODE, not the reference model's. It exists only so
    that one rule can be changed while everything else is held fixed.
    """

    environment = {} if environment is None else environment

    if isinstance(node, PebbleInt):
        return node.value
    if isinstance(node, PebbleName):
        if node.name not in environment:
            raise NameError(f"unbound name {node.name!r}")
        return environment[node.name]
    if isinstance(node, PebbleFunction):
        return DynamicFunction(node.parameter, node.body)      # captures nothing
    if isinstance(node, PebbleLet):
        value = dynamic_evaluate(node.value, environment)
        return dynamic_evaluate(node.body, {**environment, node.name: value})
    if isinstance(node, PebbleBinary):
        left = dynamic_evaluate(node.left, environment)
        right = dynamic_evaluate(node.right, environment)
        if node.operator == "+":
            return left + right
        raise ValueError(f"unsupported operator {node.operator!r}")
    if isinstance(node, PebbleApply):
        function = dynamic_evaluate(node.function, environment)
        argument = dynamic_evaluate(node.argument, environment)
        # The whole difference: the body runs in the CALLER's environment.
        return dynamic_evaluate(function.body,
                                {**environment, function.parameter: argument})
    raise TypeError(f"unsupported node {type(node).__name__}")


dynamic = dynamic_evaluate(PROGRAM)

print(f"{'scope rule':>10}  {'value':>6}  which x the body saw")
print(f"{'lexical':>10}  {lexical.value:>6}  the one in scope where add_x was DEFINED")
print(f"{'dynamic':>10}  {dynamic:>6}  the one in scope where add_x was CALLED")

checkpoint("the same AST produces two different values",
           lexical.value != dynamic)
checkpoint("lexical uses the defining binding", lexical.value == 7 + 5)
checkpoint("dynamic uses the calling binding", dynamic == 100 + 5)
checkpoint("nothing in the program text distinguishes them", True,
           "the AST object was constructed once and passed to both evaluators")

# %%
resolve(
    "add_x is defined where x is 7 and called where x is 100. Under lexical scope "
    "and under dynamic scope, what does `add_x 5` return?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "add_x is defined where x is 7 and called where x is 100. Under lexical scope "
    "and under dynamic scope, what does `add_x 5` return?",
    """
    Lexical gives **12**. Dynamic gives **105**. One AST, constructed once, handed
    to two evaluators.

    That is the entire point of the session, and it is worth stating in its
    strongest form: **you cannot determine what this program means by reading it.**
    Not because it is unclear, and not because it is badly written — because the
    text does not contain the information. The rule that decides the answer lives
    in the interpreter, and the same characters mean 12 in one language and 105 in
    another.

    The mechanism is one line different. Under lexical scope, evaluating `fun y ->
    x + y` builds a **closure**: the code *plus a pointer to the environment it was
    defined in*. When it is later applied, the body runs in that captured
    environment extended with the parameter. The later `let x = 100` creates a new
    binding in a different environment, which the closure has no reference to, so
    it is invisible.

    Under dynamic scope, the function value carries only the parameter and the
    body. There is no captured environment, so at application time the body runs in
    whatever environment is current — the caller's, where `x` is 100.

    The word "closure" is doing real work here. A closure is not "a function
    defined inside another function". It is a function that has *closed over* its
    free variables by keeping the environment that binds them. Notice which
    variables are involved: `y` is bound by the parameter and is not free. `x` is
    free in the body, and free variables are the only ones scope rules can
    disagree about. A function with no free variables produces the same answer
    under both rules — which is why the difference stays invisible until it
    suddenly matters.

    Dynamic scope is not a historical curiosity, and this is the part worth
    carrying out of the module. It is what a shell environment variable does, what
    a thread-local does, what `contextvars` does, and what almost every logging
    context, request context, and dependency-injection container does. Each is a
    binding resolved at call time by position in the call stack rather than by
    position in the source. They are deliberately dynamic — that is what makes them
    useful — and they carry exactly the cost this bench measures: you cannot tell
    what a function will see by reading the function.

    Which reframes the usual claim that lexical scope is simply better. It is
    better *at one specific thing*: making a function's meaning depend only on text
    you can point at. That is a large and mostly correct default. But when a
    program genuinely wants "whatever the current request is", lexical scope makes
    you thread it through every intermediate call, and every language that made
    lexical the default eventually grew a dynamic mechanism back.
    """,
)

# %% [markdown]
# ## 4. Debug — when do the two rules agree?

# %%
CASES = {
    "no free variables": PebbleLet(
        "f", PebbleFunction("y", PebbleBinary("+", PebbleName("y"), PebbleInt(1))),
        PebbleApply(PebbleName("f"), PebbleInt(5))),
    "free variable, not shadowed": PebbleLet(
        "x", PebbleInt(7),
        PebbleLet("f", PebbleFunction("y", PebbleBinary("+", PebbleName("x"),
                                                        PebbleName("y"))),
                  PebbleApply(PebbleName("f"), PebbleInt(5)))),
    "free variable, shadowed": PROGRAM,
}

print(f"{'program':>28}  {'lexical':>8}  {'dynamic':>8}  {'agree':>6}")
agreement = {}
for label, program in CASES.items():
    left = pebble_evaluate(program).value
    right = dynamic_evaluate(program)
    agreement[label] = {"lexical": left, "dynamic": right, "agree": left == right}
    print(f"{label:>28}  {left:>8}  {right:>8}  "
          f"{str(left == right):>6}")

disagreeing = [label for label, row in agreement.items() if not row["agree"]]

checkpoint("a function with no free variables agrees under both rules",
           agreement["no free variables"]["agree"])
checkpoint("an unshadowed free variable also agrees",
           agreement["free variable, not shadowed"]["agree"],
           "the same binding is reachable either way — the rules only differ "
           "when they would reach DIFFERENT bindings")
checkpoint("exactly one case disagrees", disagreeing == ["free variable, shadowed"],
           "a free variable AND a rebinding between definition and call")

# %% [markdown]
# ## 5. Debug — what the closure actually holds

# %%
UNBOUND = PebbleLet(
    "f", PebbleFunction("y", PebbleBinary("+", PebbleName("x"), PebbleName("y"))),
    PebbleLet("x", PebbleInt(100), PebbleApply(PebbleName("f"), PebbleInt(5))))

reference_unbound = pebble_evaluate(UNBOUND)
try:
    dynamic_unbound = dynamic_evaluate(UNBOUND)
    dynamic_status = f"VALUE {dynamic_unbound}"
except NameError as error:
    dynamic_status = f"NameError: {error}"

print("a program where x is bound ONLY after the function is defined:")
print(f"  lexical: {reference_unbound.outcome} "
      f"({reference_unbound.reason or reference_unbound.value})")
print(f"  dynamic: {dynamic_status}")

checkpoint("lexical scope cannot see a binding created after definition",
           reference_unbound.outcome != "VALUE",
           reference_unbound.reason or "")
checkpoint("dynamic scope can", dynamic_status.startswith("VALUE"),
           "the binding did not exist when the function was written, and the "
           "function uses it anyway")

# %% [markdown]
# ## 6. Recognize — which mechanisms are dynamically scoped?

# %%
MECHANISMS = {
    "a": "A Python closure over a loop variable.",
    "b": "A shell environment variable read by a subprocess.",
    "c": "A `contextvars.ContextVar` read inside an async task.",
    "d": "A module-level constant imported by name.",
}
for key, text in MECHANISMS.items():
    print(f"{key}. {text}")


def dynamically_scoped(key: str) -> bool:
    """True when the binding is resolved by call context, not by source position."""
    raise NotImplementedError("Classify each mechanism by how its binding is found")


# %%
check("dynamically_scoped", dynamically_scoped,
      [(("a",), False), (("b",), True), (("c",), True), (("d",), False)])
print()
print("(a) is the one people mislabel. A Python closure captures the VARIABLE,")
print("not its value, so a loop variable read later gives the final value — which")
print("feels dynamic and is not. It is lexical capture of a cell that was mutated.")

# %% [markdown]
# ## 7. The closure trace

# %%
CLOSURE_TRACE = """
The program, and the two answers:
What a lexical closure carries, stated precisely:
What a dynamic function value carries instead:
The free variable in the body, and why only free variables can disagree:
The two conditions both required for the rules to differ:
Three mechanisms I use that are dynamically scoped, and what that costs:
Why 'read the function' is not sufficient to know what it sees:
"""
print(CLOSURE_TRACE)

# %%
claim("COURSE MODEL", CLOSURE_TRACE)

claim(
    "LOCAL REFERENCE RESULT",
    f"One AST — a function defined where x is 7 and applied where x is 100 — "
    f"evaluates to {lexical.value} under the reference model's declared lexical "
    f"semantics and to {dynamic} under a dynamic-scope evaluator over the same "
    f"nodes. Across {len(CASES)} programs the two rules agree except where a free "
    f"variable is rebound between definition and call. A program that binds x only "
    f"after the function is defined is {reference_unbound.outcome} under lexical "
    f"scope and evaluates under dynamic scope.",
    support={"lexicalValue": lexical.value, "dynamicValue": dynamic,
             "referenceExampleValue": canonical.value,
             "fuelConsumed": lexical.consumed_fuel,
             "agreement": agreement,
             "disagreeing": disagreeing,
             "lateBinding": {"lexicalOutcome": reference_unbound.outcome,
                             "lexicalReason": reference_unbound.reason,
                             "dynamicResult": dynamic_status}},
)

non_claim(
    "The lexical results come from the reference model's declared Pebble "
    "semantics — left-to-right, call-by-value, lexically scoped — over a fuel-"
    "bounded evaluator. The dynamic results come from an evaluator written in this "
    "bench purely as a contrast; it is not part of the course's published model and "
    "is not a specification of any real dynamically scoped language. Together they "
    "establish that scope is an interpreter rule rather than a text property. They "
    "establish nothing about CPython's actual scoping implementation, cell objects, "
    "`nonlocal`, comprehension scopes, or the performance of either strategy."
)

emit()

# %% [markdown]
# ## 8. Transfer
#
# 1. The two rules agreed on two of three programs. State both conditions required
#    for them to differ, and why that makes the bug rare and confusing.
# 2. Under dynamic scope, a function used a binding that did not exist when it was
#    written. Name what that makes impossible for a reader, and what it makes
#    possible for a framework.
# 3. Bench `m12-s1` found the same import graph behaving differently under two
#    import forms. State what that and scope have in common as sources of meaning.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module23_reference.py` — `pebble_evaluate`,
# `pebble_closure_example`, and the Pebble AST nodes. The dynamic-scope evaluator
# in section 3 is **this bench's own**, written only to hold everything fixed
# except the one rule under examination.
