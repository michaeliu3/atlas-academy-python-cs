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
# # Bench m12-s1 — import execution and dependency trace
#
# **Session 12.1 — From one script to an import graph.** Rungs: **trace**
# (primary), debug and defend.
#
# The session derives four principles and then asks you to compare three fixes,
# *classifying each as symptom relief or graph repair*. That classification is the
# graded judgement, and it is exactly the one you cannot make by watching whether
# the error goes away — because under every fix, it does.
#
# So this bench measures two things per arrangement: does it import, and does a
# cycle remain in the module-level graph. The pair is what separates the two
# classes.
#
# Real files, written to a temporary directory and imported through the real
# machinery. A simulated `sys.modules` would beg the question.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import (  # noqa: E402  (sets up sys.path)
    ARRANGEMENTS, MODULE_LEVEL_EDGES, Arrangement, has_cycle,
)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=12, session=1, emits="import execution and dependency trace",
      rungs=["trace", "debug-and-defend"])

# %% [markdown]
# ## 1. Two modules that need each other

# %%
for filename, source in ARRANGEMENTS["cycle"].items():
    print(f"--- {filename}")
    print(source)

print(f"module-level import edges: {MODULE_LEVEL_EDGES['cycle']}")

# %%
predict(
    "atlas_registry imports a name from atlas_importer, which imports a name back "
    "from atlas_registry. Import atlas_registry. Then change ONLY how "
    "atlas_importer names its dependency — `import atlas_registry` instead of "
    "`from atlas_registry import REGISTRY`. Which of the two imports?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — import each arrangement for real

# %%
ENTRY = {"composition root": "atlas_bootstrap"}

results = {}
for name in ARRANGEMENTS:
    entry = ENTRY.get(name, "atlas_registry")
    with Arrangement(name) as arrangement:
        status, payload = arrangement.import_module(entry)
        behaviour = None
        if status == "ok":
            behaviour = payload.register("concept-a")
        results[name] = {
            "entry": entry,
            "status": status,
            "message": payload if status != "ok" else None,
            "behaviour": behaviour,
            "cycle": has_cycle(MODULE_LEVEL_EDGES[name]),
        }

print(f"{'arrangement':>18}  {'imports':>9}  {'cycle in graph':>14}  behaviour")
for name, row in results.items():
    print(f"{name:>18}  {'yes' if row['status'] == 'ok' else 'NO':>9}  "
          f"{str(row['cycle']):>14}  {row['behaviour'] or row['status']}")

print(f"\ncycle arrangement raised:\n  {results['cycle']['message']}")

checkpoint("the cycle arrangement fails to import",
           results["cycle"]["status"] == "ImportError")
checkpoint("the error names a partially initialized module",
           "partially initialized" in results["cycle"]["message"])
checkpoint("changing only the import FORM makes the same cycle import",
           results["module form"]["status"] == "ok",
           "identical dependency, identical cycle in the graph, different syntax")
checkpoint("every arrangement that imports produces identical behaviour",
           len({row["behaviour"] for row in results.values()
                if row["behaviour"] is not None}) == 1,
           "so behaviour cannot be used to tell the fixes apart")

# %%
resolve(
    "atlas_registry imports a name from atlas_importer, which imports a name back "
    "from atlas_registry. Import atlas_registry. Then change ONLY how "
    "atlas_importer names its dependency — `import atlas_registry` instead of "
    "`from atlas_registry import REGISTRY`. Which of the two imports?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "atlas_registry imports a name from atlas_importer, which imports a name back "
    "from atlas_registry. Import atlas_registry. Then change ONLY how "
    "atlas_importer names its dependency — `import atlas_registry` instead of "
    "`from atlas_registry import REGISTRY`. Which of the two imports?",
    """
    The second one. The cycle is identical; only the syntax changed.

    Follow what the machinery does. `import atlas_registry` inserts the module
    object into `sys.modules` **before** executing a single line of it — which has
    to happen, or a recursive import would never terminate. Execution then reaches
    `from atlas_importer import load`, which imports `atlas_importer`, which asks
    for `atlas_registry`.

    It is already in `sys.modules`. Python does not re-execute it; it hands back
    the object that is sitting there, **partially initialized** — a real module
    whose top-level statements have run only up to the import that triggered this
    detour.

    Now the two forms diverge, and it is a difference in *when* the name is
    resolved. `from atlas_registry import REGISTRY` demands the attribute **now**,
    at import time, and at that instant `REGISTRY = []` has not executed yet.
    Hence `ImportError: cannot import name 'REGISTRY' from partially initialized
    module`. `import atlas_registry` binds only the module object, and the
    attribute lookup happens later inside `load()` — long after the module
    finished initializing.

    So the error is not caused by the cycle. It is caused by the cycle *plus* a
    name demanded during the window when the module is half-built. That is why the
    error is famously intermittent-looking: which module you import first decides
    where the window falls.

    Which brings the real question into focus. Four arrangements import
    successfully and all four produce byte-identical behaviour. Watching the error
    disappear cannot tell you which fix repaired anything — and three of them
    didn't:

    **Reordering** moves `REGISTRY = []` above the import so the name exists when
    it is demanded. Symptom relief: the cycle is still in the graph, and it now
    depends on statement order inside a file, which no reviewer will protect.

    **The module form** is the same trick by other means — defer the lookup past
    the window. Symptom relief; the cycle is untouched.

    **A local import** takes the edge out of the module-level graph, which is a
    genuine improvement, but the two modules still know each other. The mutual
    dependency moved from import time to call time.

    **The composition root** is the graph repair. Neither module imports the other
    at all; `register` takes `load` as a parameter, and a third module wires them
    together. The cycle is not deferred or reordered — there is no longer an edge
    to cycle through, and `atlas_registry` can now be imported and tested with no
    importer in existence.

    The distinction generalizes past imports: a fix that makes the failure
    unreachable is not the same as a fix that makes the structure incapable of it.
    """,
)

# %% [markdown]
# ## 3. Debug — classify each fix by what it changed
#
# Two observations per arrangement: whether it imports, and whether a cycle
# remains in the module-level graph. Only the second one separates the classes.

# %%
print(f"{'arrangement':>18}  {'imports':>8}  {'cycle':>6}  classification")
classification = {}
for name, row in results.items():
    if row["status"] != "ok":
        verdict = "the defect"
    elif row["cycle"]:
        verdict = "symptom relief"
    elif name == "composition root":
        verdict = "graph repair"
    else:
        verdict = "partial repair — mutual knowledge remains"
    classification[name] = verdict
    print(f"{name:>18}  {'yes' if row['status'] == 'ok' else 'no':>8}  "
          f"{str(row['cycle']):>6}  {verdict}")

relief = [n for n, v in classification.items() if v == "symptom relief"]

checkpoint("two arrangements import while keeping the cycle", len(relief) == 2,
           f"{relief} — green, and structurally unchanged")
checkpoint("only one arrangement removes the mutual dependency",
           [n for n, v in classification.items() if v == "graph repair"]
           == ["composition root"])
checkpoint("the local import removes the module-level edge but not the knowledge",
           not results["local import"]["cycle"]
           and classification["local import"].startswith("partial"),
           "atlas_importer still names atlas_registry, just later")

# %% [markdown]
# ## 4. Debug — which observation would have caught it in review?

# %%
OBSERVATIONS = {
    "a": "The test suite passes.",
    "b": "The module imports without error.",
    "c": "The module-level import graph is acyclic.",
    "d": "Each module can be imported alone, with the other absent.",
}
for key, text in OBSERVATIONS.items():
    print(f"{key}. {text}")


def separates_relief_from_repair(key: str) -> bool:
    """True when this observation distinguishes the four arrangements."""
    raise NotImplementedError("Judge each observation against the table above")


# %%
check("separates_relief_from_repair", separates_relief_from_repair,
      [(("a",), False), (("b",), False), (("c",), True), (("d",), True)])
print()
print("(d) is the strongest, and it is the one a reviewer can run: the composition")
print("root is the only arrangement where atlas_registry imports with no importer")
print("on the path at all. That is what 'the abstraction does not know its")
print("mechanism' means, stated as something you can check.")

# %% [markdown]
# ## 5. The import trace

# %%
IMPORT_TRACE = """
For the failing import, one row per import statement:
  requested name | already in sys.modules | next statement to execute |
  attributes existing at that instant | binds a module or an attribute

Why cache insertion happens before execution:
The exact window in which the name was demanded:
Each fix, classified, with the observation that classifies it:
The fix I would defend in review, and what it makes impossible rather than unreached:
"""
print(IMPORT_TRACE)

# %%
claim("DEFENDED REPAIR", IMPORT_TRACE)

claim(
    "LOCAL REFERENCE RESULT",
    f"On CPython {sys.version_info.major}.{sys.version_info.minor}, two modules "
    f"with a mutual module-level import raise ImportError naming a partially "
    f"initialized module when the dependency is written "
    f"`from atlas_registry import REGISTRY`, and import successfully when the only "
    f"change is `import atlas_registry` with the attribute read at call time. Of "
    f"{len(ARRANGEMENTS)} arrangements, {sum(1 for r in results.values() if r['status'] == 'ok')} "
    f"import and all of those produce identical behaviour, while "
    f"{sum(1 for r in results.values() if r['cycle'])} still contain a cycle in "
    f"the module-level graph.",
    support={"pythonVersion": f"{sys.version_info.major}.{sys.version_info.minor}",
             "arrangements": {name: {"imports": row["status"] == "ok",
                                     "error": row["message"],
                                     "behaviour": row["behaviour"],
                                     "cycleInGraph": row["cycle"],
                                     "classification": classification[name]}
                              for name, row in results.items()},
             "moduleLevelEdges": {k: [list(e) for e in v]
                                  for k, v in MODULE_LEVEL_EDGES.items()}},
)

non_claim(
    "These are four hand-written two-module arrangements imported in one process "
    "with a clean sys.modules each time. They establish what CPython's import "
    "machinery does with a mutual module-level import and that success is a poor "
    "discriminator between the fixes. They do not model packages, `__init__.py` "
    "execution order, namespace packages, lazy or deferred import hooks, C "
    "extensions, or reimport under a reloader; nor do they establish that the "
    "composition root is the right design for any particular application, which is "
    "an argument about change pressure rather than about import mechanics."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Four arrangements, identical behaviour, two structures. Write the rule this
#    implies about accepting a fix because the error stopped.
# 2. The local import helped and did not repair. Name what it moved, and what it
#    did not.
# 3. Bench `m13-s2` found mutants a coverage number could not see. State what a
#    surviving mutant and a reordered import cycle have in common.
#
# ---
#
# ## Attributions
#
# The four arrangements and the cycle detector are this bench's own. Module 12's
# reference model at `public/downloads/module12_reference.py` is probed by benches
# 4 and 6; it declares architecture, which is a different question from what the
# import machinery does with real files.
