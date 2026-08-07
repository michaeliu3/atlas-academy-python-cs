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
# # Bench m13-s3 — M13 provider-contract suite and double rationale
#
# **Session 13.3 — Provider substitution, fixtures, and controlled doubles.**
# Rungs: **debug and defend** (primary), review and verify.
#
# The session's encounter: *one provider-specific suite passes while another
# silently skips malformed rows.* Its fourth learner action: *predict which patch
# target changes runtime behavior.*
#
# Both are run here. The first shows a suite that cannot distinguish two providers
# it was written to validate. The second shows a patch that applies cleanly,
# reports success, and changes nothing.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402
from types import ModuleType  # noqa: E402
from unittest.mock import patch  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=13, session=3, emits="M13 provider-contract suite and double rationale",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. One port, two providers
#
# The port: **given raw rows, return parsed rows.** Both providers implement it,
# and both are defensible readings of a specification that never said what to do
# with a malformed row.

# %%
RAW = ["1:0.9", "2:0.7", "not-a-row", "4:0.4"]


class StrictProvider:
    """Rejects the batch when any row is malformed."""

    name = "strict"

    def parse(self, raw_rows):
        parsed = []
        for raw in raw_rows:
            line, _, score = raw.partition(":")
            if not line.isdigit():
                raise ValueError(f"malformed row: {raw!r}")
            parsed.append((int(line), float(score)))
        return parsed


class LenientProvider:
    """Skips rows it cannot parse."""

    name = "lenient"

    def parse(self, raw_rows):
        parsed = []
        for raw in raw_rows:
            line, _, score = raw.partition(":")
            if not line.isdigit():
                continue
            parsed.append((int(line), float(score)))
        return parsed


PROVIDERS = [StrictProvider(), LenientProvider()]

# %% [markdown]
# ## 2. The suite that was written first

# %%
def original_suite(provider) -> dict:
    """The suite as written: every good row arrives, correctly parsed."""
    results = {}
    try:
        parsed = provider.parse(["1:0.9", "2:0.7"])
        results["parses good rows"] = parsed == [(1, 0.9), (2, 0.7)]
        results["preserves order"] = [line for line, _ in parsed] == [1, 2]
        results["parses scores as floats"] = all(
            isinstance(score, float) for _, score in parsed)
    except Exception as error:  # noqa: BLE001
        results["parses good rows"] = False
        results["error"] = type(error).__name__
    return results


print(f"{'provider':>10}  {'suite':>8}  detail")
for provider in PROVIDERS:
    outcome = original_suite(provider)
    passed = all(value is True for value in outcome.values())
    print(f"{provider.name:>10}  {'PASS' if passed else 'FAIL':>8}  {outcome}")

both_pass = all(all(v is True for v in original_suite(p).values()) for p in PROVIDERS)
checkpoint("the suite passes against both providers", both_pass,
           "it was written against one and reused for the other")

# %%
predict(
    "The two providers do different things with a malformed row. Feed the same "
    "four raw rows — three good, one malformed — to each. What does the caller "
    "get back?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 3. Debug — feed both providers the malformed batch

# %%
behaviour = {}
for provider in PROVIDERS:
    try:
        behaviour[provider.name] = {"outcome": "returned",
                                    "rows": provider.parse(RAW)}
    except Exception as error:  # noqa: BLE001
        behaviour[provider.name] = {"outcome": type(error).__name__,
                                    "rows": None}

print(f"input: {len(RAW)} raw rows, one of them malformed\n")
for name, row in behaviour.items():
    count = "-" if row["rows"] is None else len(row["rows"])
    print(f"  {name:>8}: {row['outcome']:>10}   rows returned: {count}")

lenient_rows = behaviour["lenient"]["rows"]

checkpoint("the strict provider refuses the batch",
           behaviour["strict"]["outcome"] == "ValueError")
checkpoint("the lenient provider returns fewer rows than it was given",
           len(lenient_rows) < len(RAW))
checkpoint("and reports nothing about the difference",
           behaviour["lenient"]["outcome"] == "returned",
           f"{len(RAW)} rows in, {len(lenient_rows)} out, no exception and no count")

# %%
resolve(
    "The two providers do different things with a malformed row. Feed the same "
    "four raw rows — three good, one malformed — to each. What does the caller "
    "get back?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The two providers do different things with a malformed row. Feed the same "
    "four raw rows — three good, one malformed — to each. What does the caller "
    "get back?",
    """
    The strict provider raises. The lenient one returns three rows out of four and
    says nothing.

    Both passed the original suite, and it is worth being precise about why: the
    suite fed only well-formed rows. It asserted that good rows are parsed
    correctly, in order, with float scores — three genuine clauses, all true of
    both providers. Nothing in it addressed the case the providers disagree about,
    so nothing in it could distinguish them.

    That is the substitution hazard in its exact form. The suite was written
    against one provider and reused as evidence for the other, and reuse felt safe
    *because it passed*. A green suite is evidence about the clauses it contains,
    and about nothing else.

    The silent skip is the worse of the two behaviours, and not because raising is
    inherently better. Both are legitimate policies. The problem is that the
    lenient provider's policy is **invisible at the call site**: the caller
    receives a list, has no count to reconcile it against, and cannot distinguish
    "four rows, one bad" from "three rows, all good". The strict provider's policy
    is at least announced.

    So the repair is not "make the lenient one strict". It is to add a contract
    clause about the disagreement — cardinality reconciliation — and then either
    provider may be chosen deliberately. Section 4 adds that clause, and the suite
    stops passing for both, which is what a contract suite is for.

    This is the same shape as bench `m16-s3`, where a query returned only correct
    rows and the wrong number of them. Row-level assertions cannot see a missing
    row. Only a claim about the count can.
    """,
)

# %% [markdown]
# ## 4. Verify — add the clause the providers disagree about

# %%
def contract_suite(provider) -> dict:
    """The port's contract, including what happens to a row it cannot parse."""
    results = dict(original_suite(provider))
    try:
        parsed = provider.parse(RAW)
        # The clause: every input row is accounted for, or the batch is refused.
        results["accounts for every input row"] = len(parsed) == len(RAW)
        results["refuses the batch"] = False
    except ValueError:
        results["accounts for every input row"] = True
        results["refuses the batch"] = True
    return results


print(f"{'provider':>10}  {'verdict':>8}  failing clauses")
verdicts = {}
for provider in PROVIDERS:
    outcome = contract_suite(provider)
    failing = [k for k, v in outcome.items()
               if v is False and k != "refuses the batch"]
    verdicts[provider.name] = failing
    print(f"{provider.name:>10}  {'PASS' if not failing else 'FAIL':>8}  {failing}")

checkpoint("the strict provider satisfies the contract", verdicts["strict"] == [])
checkpoint("the lenient provider now fails, on the clause that names the difference",
           verdicts["lenient"] == ["accounts for every input row"])

# %% [markdown]
# ## 5. Debug — the patch that applies and does nothing
#
# The consumer imports the provider's `load` with `from providers import load`.
# Two patch targets are available. Only one of them is the name the consumer
# actually looks up at call time.

# %%
providers_module = ModuleType("providers")
exec("def load(raw):\n    return ('real', raw)\n",  # noqa: S102
     providers_module.__dict__)
sys.modules["providers"] = providers_module

consumer_module = ModuleType("consumer")
exec("from providers import load\n"  # noqa: S102
     "def ingest(raw):\n"
     "    return load(raw)\n",
     consumer_module.__dict__)
sys.modules["consumer"] = consumer_module


def fake_load(raw):
    return ("fake", raw)


patch_results = {}
for target in ("providers.load", "consumer.load"):
    with patch(target, fake_load):
        patch_results[target] = consumer_module.ingest("row")[0]

print(f"{'patch target':>18}  {'consumer.ingest returns':>24}  effect")
for target, observed in patch_results.items():
    effect = "no effect" if observed == "real" else "double is in play"
    print(f"{target:>18}  {observed:>24}  {effect}")

checkpoint("patching the definition site has no effect",
           patch_results["providers.load"] == "real",
           "the patch applied and was reverted cleanly; the consumer never saw it")
checkpoint("patching the lookup site works",
           patch_results["consumer.load"] == "fake")
checkpoint("neither patch raised", len(patch_results) == 2,
           "a patch that does nothing is indistinguishable from one that works, "
           "unless the test would fail without the double")

# %% [markdown]
# ## 6. Review and verify — choose the double

# %%
CHOICES = {
    "a": "Verify that a malformed row is skipped rather than raised.",
    "b": "Verify that the importer retries exactly twice on a timeout.",
    "c": "Run the same contract suite against an in-memory provider.",
    "d": "Verify that the parser is not called at all when the batch is empty.",
}
for key, text in CHOICES.items():
    print(f"{key}. {text}")


def double(key: str) -> str:
    """One of: fake, spy, mock, none."""
    raise NotImplementedError("Choose the lightest double that can answer each")


# %%
check("double", double,
      [(("a",), "none"), (("b",), "spy"), (("c",), "fake"), (("d",), "spy")])
print()
print("(a) needs no double at all: the behaviour under test IS the provider's.")
print("Replacing it with a mock would assert that the double does what the double")
print("was configured to do — the failure the session's TA repair path names.")

# %% [markdown]
# ## 7. The double rationale

# %%
RATIONALE = """
The clause the two providers disagreed about, stated so a suite can check it:
The behaviour that stays real at each seam, and why:
Each double I used, with the lighter option I rejected and the reason:
The patch target I would have chosen, and how I would prove it took effect:
What a passing contract suite still leaves unknown about a new provider:
"""
print(RATIONALE)

# %%
claim("DEFENDED REPAIR", RATIONALE)

claim(
    "LOCAL REFERENCE RESULT",
    f"A three-clause suite written against one provider passes against both, "
    f"while the same {len(RAW)} raw rows make one raise ValueError and the other "
    f"return {len(lenient_rows)} rows with no signal. Adding one cardinality clause "
    f"separates them: the lenient provider fails on "
    f"{verdicts['lenient']} and the strict provider passes. Separately, patching "
    f"`providers.load` leaves `consumer.ingest` returning the real implementation, "
    f"while patching `consumer.load` substitutes the double — both patches apply "
    f"and revert without error.",
    support={"rawRows": RAW,
             "providerBehaviour": {k: {"outcome": v["outcome"],
                                       "rowCount": None if v["rows"] is None
                                       else len(v["rows"])}
                                   for k, v in behaviour.items()},
             "originalSuitePassesBoth": both_pass,
             "contractSuiteVerdicts": verdicts,
             "patchTargets": patch_results},
)

non_claim(
    "These are two hand-written providers over a four-row batch in one process. "
    "They demonstrate that a suite can fail to distinguish implementations it was "
    "reused across, and that the import form decides which patch target works. "
    "They establish nothing about any real provider, measure no I/O, no network "
    "failure modes, and no fixture teardown behaviour, and the patch result is "
    "specific to `from X import Y` — a consumer written `import X` then `X.load()` "
    "would answer the opposite way, which is the point rather than an exception."
)

emit()

# %% [markdown]
# ## 8. Transfer
#
# 1. A patch applied, reverted cleanly, and changed nothing. Write the rule this
#    implies about what a green test proves when a double is involved.
# 2. Both providers were defensible. Name what was actually missing, and say why
#    "make the lenient one strict" is the wrong repair.
# 3. Bench `m13-s2` found survivors a coverage number could not see. State what
#    the surviving mutants and the reused provider suite have in common.
#
# ---
#
# ## Attributions
#
# The two providers, the contract clause, and the patch-target demonstration are
# this bench's own. Module 13's reference model is probed by bench 4.
