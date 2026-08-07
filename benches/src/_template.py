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
# # Bench mNN-sK — <the artifact this session declares>
#
# **Session NN.K.** Emits: *<artifact>*. Rungs: *<rung>, <rung>*.
#
# One bench, one session, one declared artifact. The artifact name is not yours
# to choose — it is the `### Output:` heading of that session in the canonical
# workbook, and `validate:benches` string-compares the two. If you find yourself
# wanting a different name, the session contract changed and the workbook is
# where that gets decided.
#
# Do not cite a workbook path here. Paths go stale — `modules/` already did —
# and M31–M36 resolve to `content/authoring/`, not `content/modules/`. The pack
# key below is resolved to a path by the validator, so it cannot rot.
#
# State in one sentence what this bench does that the workbook cannot. If you
# cannot write that sentence, the bench should not exist.
#
# **Requires:** Python 3.12+. <dependencies from the allowlist, or "Standard library only.">

# %%
import sys
from pathlib import Path

# A notebook's cwd depends on where it was opened from, so locate the helper
# package by searching upward rather than assuming a fixed relative path.
_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

from atlas_bench import (  # noqa: E402
    bench,
    check,
    checkpoint,
    claim,
    classify_growth,
    emit,
    growth_ratios,
    measure,
    non_claim,
    predict,
    resolve,
    reveal,
)

assert sys.version_info >= (3, 12), "Bench floor is CPython 3.12 (matches CI)."

bench(
    module=0,
    session=1,
    emits="<the session's declared Output: artifact, verbatim>",
    rungs=["recognize", "trace"],
)

# %% [markdown]
# ## 1. Prediction
#
# Open with a question the learner must commit to, never with an explanation.
# A bench that opens by telling you the answer has thrown away its only
# advantage over the workbook.

# %%
predict(
    "<a question the next cell settles>",
    answer="",  # <- learner fills in
    confidence="",  # sure / fairly sure / guessing
)

# %%
# The cell that settles it. Keep it small enough to read in one go.

# %%
# Judge against the evidence, before reading the explanation.
resolve("<the same question text, verbatim>", "matched")  # matched / diverged / partial

# %%
reveal(
    "<the same question text, verbatim>",
    """
    Explain what happened and why the intuitive answer fails.

    Reference the workbook section this confirms or complicates — do not
    re-teach it. Three paragraphs of concept here means the material belongs in
    the workbook and this bench has become a second source of truth.
    """,
)

# %% [markdown]
# ## 2. The rung work
#
# Whatever rungs this bench declared. The canonical eight, from
# `COURSE_PRODUCTION_STANDARD.md`:
#
# | Rung | Pattern here |
# |---|---|
# | recognize | classify supplied artifacts against the module's vocabulary |
# | trace | instrumented run; state table filled *before* the run |
# | map | read a supplied reference model, recover its dependency direction |
# | modify | one `TODO` under one new constraint |
# | debug and defend | broken cell + failing check; write the *defence*, not just the fix |
# | design and delegate | design brief → paste agent patch → `check()` it **unmodified** |
# | review and verify | someone else's code + defect list scored against a hidden set |
# | transfer | same structure, new domain, no scaffolding |
#
# At most one bench per pack may be `modify`-primary, and never `modify` alone —
# targeted implementation is 5% of the course's evidence weight. Every pack needs
# at least one `debug-and-defend` and one `review-and-verify`. `validate:benches`
# enforces both.

# %%
def exercise(argument):
    """One-line contract. State the invariant or postcondition."""
    raise NotImplementedError("Implement exercise")


# %%
check(
    "exercise",
    exercise,
    [
        # ((args, ...), expected) — cover empty, single, duplicate, and boundary
        ((["b", "a"],), ["a", "b"]),
        (([],), []),
    ],
)

# %% [markdown]
# ## 3. The record
#
# Every claim carries a workbook-style evidence label, classified by the same
# rules the portal renderer uses. The non-claim is mandatory: `emit()` refuses
# without it, because evidence accumulates but does not upgrade itself.

# %%
claim(
    "FINITE EXPERIMENT",
    "<what this bench observed, with its conditions named>",
    support={"sizes": [], "measured": []},
)

non_claim("<what this evidence does not establish, and why>")

emit()

# %% [markdown]
# ## 4. Transfer
#
# Two or three prose questions that use what was measured. Without them the
# bench is a demo.
#
# ---
#
# ## Attributions
#
# Authored for this course. No external material vendored.
#
# — or, if vendoring —
#
# Adapted from [repo](url), <LICENSE>, © <year> <holder>, pinned at `<sha>`.
# Record it in `BENCH_ATTRIBUTION.md` too. Check the actual LICENSE file: several
# well-known resources in this space ship without one, which makes them
# link-only.
