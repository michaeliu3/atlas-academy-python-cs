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
# # Bench m12-s6 — architecture review dossier
#
# **Session 12.6 — Atlas checkpoint: read, review, defend.** Rungs: **review and
# verify** (primary), recognize.
#
# An assistant runs the module's architecture inspector, gets a clean report, and
# writes: *"No violations. The architecture is sound and the modules are correctly
# decoupled."*
#
# The report is genuine. Every word of the conclusion beyond "no violations" is
# unsupported, and this bench measures the gap rather than asserting it — by
# constructing graphs that pass the inspector while failing on the exact
# properties the conclusion claims.
#
# The reference model states its own limits in a `scope` string. This bench takes
# that string literally and tests each clause.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402  (sets up sys.path)
    MODULE_LEVEL_EDGES, has_cycle,
)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module12_reference import (  # noqa: E402
    Component, ConcreteSelection, Dependency, inspect_architecture,
)

assert sys.version_info >= (3, 12)

bench(module=12, session=6, emits="architecture review dossier",
      rungs=["review-and-verify", "recognize"])

# %% [markdown]
# ## 1. The clean report

# %%
COMPONENTS = (
    Component(name="bootstrap", role="composition-root"),
    Component(name="catalog", role="application-policy"),
    Component(name="importer-port", role="port"),
    Component(name="pipe-importer", role="adapter"),
    Component(name="concept", role="domain-policy"),
    Component(name="event", role="domain-policy"),
)
DEPENDENCIES = (
    Dependency(source="catalog", target="importer-port"),
    Dependency(source="pipe-importer", target="importer-port"),
    Dependency(source="catalog", target="concept"),
    Dependency(source="importer-port", target="concept"),
    # Two domain values that reference each other.
    Dependency(source="concept", target="event"),
    Dependency(source="event", target="concept"),
)
SELECTIONS = (ConcreteSelection(owner="bootstrap", implementation="pipe-importer"),)

report = inspect_architecture(COMPONENTS, DEPENDENCIES, SELECTIONS)

print(f"violations                     : {len(report.violations)}")
print(f"preserves_dependency_direction : {report.preserves_dependency_direction}")
print(f"allowed edges                  : {len(report.allowed_dependencies)}")
print(f"\nscope: {report.scope}")

checkpoint("the report is clean", report.preserves_dependency_direction
           and not report.violations)

# %%
predict(
    "The inspector reports no violations. The assistant concludes the modules are "
    "correctly decoupled. Name one property that conclusion asserts and this "
    "report does not check.",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — test the conclusion's claims one at a time
#
# ### Claim: the dependency graph is acyclic

# %%
declared_edges = tuple(report.allowed_dependencies)
cyclic = has_cycle(declared_edges)

print(f"edges the report ALLOWED: {len(declared_edges)}")
for source, target in declared_edges:
    print(f"  {source} -> {target}")
print(f"\ncycle present among the allowed edges: {cyclic}")

checkpoint("the clean report contains a cycle", cyclic,
           "concept -> event -> concept, permitted because domain-policy may "
           "depend on domain-policy")
checkpoint("the inspector never claimed otherwise",
           "runtime imports" in report.scope,
           "its scope names what it does not establish; the assistant's "
           "conclusion did not")

# %% [markdown]
# ### Claim: the modules import correctly

# %%
print(f"{'arrangement':>18}  {'module-level cycle':>19}")
for name, edges in MODULE_LEVEL_EDGES.items():
    print(f"{name:>18}  {str(has_cycle(edges)):>19}")

cyclic_arrangements = [n for n, e in MODULE_LEVEL_EDGES.items() if has_cycle(e)]
print(f"\nBench m12-s1 imported these for real. {len(cyclic_arrangements)} of them "
      f"carry a cycle in the")
print("module-level graph, and they do not agree: one raises ImportError and the")
print("others import cleanly — decided by the import FORM and by statement order,")
print("neither of which an architecture declaration records.")

checkpoint("the declaration format cannot express the distinction",
           not any(hasattr(d, "import_form") for d in DEPENDENCIES),
           "a Dependency has a source and a target, and nothing about how the "
           "name is written")

# %%
resolve(
    "The inspector reports no violations. The assistant concludes the modules are "
    "correctly decoupled. Name one property that conclusion asserts and this "
    "report does not check.",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The inspector reports no violations. The assistant concludes the modules are "
    "correctly decoupled. Name one property that conclusion asserts and this "
    "report does not check.",
    """
    There are at least four, and the report's own `scope` string lists three of
    them: runtime imports, plugin trust, and behavioural substitutability. The
    fourth — acyclicity — is not even in the scope string, and this bench found a
    cycle sitting inside a clean report.

    Take them in order.

    **Acyclicity.** `concept -> event -> concept` is permitted, because the policy
    says domain-policy may depend on domain-policy, and cycle detection is not
    among the things the inspector does. The report is correct. It answered the
    question it was asked, which was about *role direction*, and a reader who
    heard "no violations" as "no problems" supplied the rest.

    **Runtime imports.** Bench `m12-s1` established that a declared edge does not
    determine what the import machinery does: the same cycle raises `ImportError`
    or does not, depending on whether the dependency is written
    `from x import name` or `import x`. A `Dependency` has a source and a target.
    There is nowhere in the declaration to record which form was used, so no
    inspection of these declarations could recover the difference.

    **Substitutability.** Bench `m12-s4` established that a class satisfying
    `isinstance` against a runtime-checkable Protocol may have the wrong arity or
    return the wrong type. The graph says `pipe-importer -> importer-port`. It
    does not say that `pipe-importer` honours the port's contract, and nothing
    about a correct arrow makes a wrong implementation right.

    **Trust.** Nothing here concerns where `pipe-importer` came from or whether
    loading it is safe. That is Session 5's subject.

    Now the review point, which is not "the tool is weak". The tool is good, and
    its scope string is a model of how a result should be reported — it states its
    own boundary in the return value, where a reader cannot miss it. The failure is
    entirely in the summary written on top of it, and it has a recognizable shape:
    **a narrow instrument produced a narrow result, and the summary widened it.**

    That shape is worth being able to name, because it is what an assistant's
    architecture summary usually is. The defensible sentence here is: *under this
    role policy, every declared edge is permitted and the composition root is the
    only component selecting a concrete adapter.* That is a real finding. It is
    also nearly the whole of what was established, and the distance between it and
    "the architecture is sound" is the distance this session grades.
    """,
)

# %% [markdown]
# ## 3. Verify — what a passing report does establish

# %%
BROKEN = DEPENDENCIES + (Dependency(source="catalog", target="pipe-importer"),)
broken_report = inspect_architecture(COMPONENTS, BROKEN, SELECTIONS)

EXTRA_SELECTION = SELECTIONS + (
    ConcreteSelection(owner="catalog", implementation="pipe-importer"),)
selection_report = inspect_architecture(COMPONENTS, DEPENDENCIES, EXTRA_SELECTION)

print(f"{'graph':>34}  {'clean':>6}  violations")
for label, candidate in (("as declared", report),
                         ("catalog depends on the adapter", broken_report),
                         ("catalog also selects the adapter", selection_report)):
    print(f"{label:>34}  {str(candidate.preserves_dependency_direction):>6}  "
          f"{[v.kind for v in candidate.violations]}")

checkpoint("the inspector does catch an application-to-adapter edge",
           [v.kind for v in broken_report.violations]
           == ["forbidden-concrete-dependency"])
checkpoint("and a selection made outside the composition root",
           len(selection_report.violations) == 1
           and selection_report.violations[0].kind != "forbidden-concrete-dependency")
checkpoint("so the clean report is real evidence, about those two things",
           report.preserves_dependency_direction
           and not broken_report.preserves_dependency_direction,
           "it discriminates — which is exactly why it is worth not overclaiming")

# %% [markdown]
# ## 4. Recognize — audit the assistant's sentence

# %%
SENTENCES = {
    "a": "Every declared edge is permitted under this role policy.",
    "b": "Only the composition root selects a concrete adapter.",
    "c": "The dependency graph has no cycles.",
    "d": "The modules import without error.",
    "e": "Any component satisfying the port can be substituted safely.",
}
for key, text in SENTENCES.items():
    print(f"{key}. {text}")


def supported_by_the_report(key: str) -> bool:
    """True when THIS report is evidence for the sentence."""
    raise NotImplementedError("Audit each sentence against what was measured")


# %%
check("supported_by_the_report", supported_by_the_report,
      [(("a",), True), (("b",), True), (("c",), False), (("d",), False),
       (("e",), False)])
print()
print("(c) is the one this bench had to demonstrate rather than argue: the cycle")
print("is in the clean report's own allowed-edge list. The other three refusals")
print("come from the model's scope string, which said so before anyone asked.")

# %% [markdown]
# ## 5. The review dossier

# %%
DOSSIER = """
The claim as written:
The instrument that produced it, and the question that instrument answers:
What the result establishes, phrased so it could not be widened:
Each unsupported clause, with the property it asserts and why this evidence
cannot reach it:
The additional evidence I would require for each, naming the instrument:
The verdict: accept, accept-with-narrowing, or reject — and why:
"""
print(DOSSIER)

# %%
claim("REVIEW VERDICT", DOSSIER)

claim(
    "LOCAL REFERENCE RESULT",
    f"inspect_architecture reports {len(report.violations)} violations and "
    f"preserves_dependency_direction=True for a {len(COMPONENTS)}-component graph "
    f"whose allowed-edge list contains a cycle (concept -> event -> concept), "
    f"permitted because domain-policy may depend on domain-policy. The same "
    f"inspector does reject an application-policy-to-adapter edge and a concrete "
    f"selection made outside the composition root, so the clean report "
    f"discriminates on the two properties it checks and on no others. Its own "
    f"scope string names runtime imports, trust, and substitutability as outside "
    f"its reach.",
    support={"violations": len(report.violations),
             "preservesDirection": report.preserves_dependency_direction,
             "allowedEdges": [list(edge) for edge in declared_edges],
             "cycleAmongAllowedEdges": cyclic,
             "scope": report.scope,
             "controls": {
                 "applicationDependsOnAdapter":
                     [v.kind for v in broken_report.violations],
                 "selectionOutsideCompositionRoot":
                     [v.kind for v in selection_report.violations]}},
)

non_claim(
    "This audits one declared six-component graph against one reference model's "
    "one explicit role policy. It establishes that a clean report from this "
    "inspector permits a cycle and does not reach runtime import behaviour, trust, "
    "or substitutability — the last three on the model's own authority rather than "
    "by measurement here. It does not evaluate any real codebase, does not show "
    "that cycles among domain values are harmful, and is not evidence about any "
    "other architecture tool, several of which do check acyclicity and would have "
    "reported this graph differently."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The report was correct and the summary was not. Write the reviewing question
#    that separates the two, in a form you could apply to any tool output.
# 2. The model published its own limits in its return value. Name what that buys a
#    reviewer, and what it does not prevent.
# 3. Benches `m12-s1` and `m12-s4` supplied two of the four refusals here. State
#    what it means that a review needed evidence from other benches to complete.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module12_reference.py` — `inspect_architecture`,
# `Component`, `Dependency`, `ConcreteSelection`. Not reimplemented. The cycle
# construction, the audit sentences, and the control graphs are this bench's own;
# the cycle detector is shared with bench 1.
