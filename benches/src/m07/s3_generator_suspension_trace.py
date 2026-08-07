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
# # Bench m07-s3 — generator-suspension trace
#
# **Session 7.3 — A generator is a resumable computation.** Rungs: **trace**
# (primary), recognize.
#
# "The function pauses and resumes" is a metaphor until you can see the frame
# survive between calls. This bench reads the suspension point and the live locals
# after each `next()`, then watches the frame disappear at exhaustion.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import running_total  # noqa: E402

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)

assert sys.version_info >= (3, 12)

bench(module=7, session=3, emits="generator-suspension trace",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. Prediction

# %%
predict(
    "A generator's local variables live in a frame. Between two next() calls — "
    "while nothing is executing — does that frame still exist, and are the "
    "locals still there?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — read the frame between calls

# %%
gen = running_total([10, 20, 30])

def snapshot(label: str) -> dict:
    frame = gen.gi_frame
    return {
        "step": label,
        "frame": frame is not None,
        "lasti": frame.f_lasti if frame else None,
        "locals": dict(frame.f_locals) if frame else None,
        "running": gen.gi_running,
    }


trace = [snapshot("created, before any next()")]
values = []
for index in range(3):
    values.append(next(gen))
    trace.append(snapshot(f"after next() #{index + 1} -> {values[-1]}"))

try:
    next(gen)
except StopIteration:
    trace.append(snapshot("after StopIteration"))

print(f"{'step':>32}  {'frame?':>7}  {'f_lasti':>8}  locals")
for row in trace:
    shown = ({k: v for k, v in row["locals"].items() if k in ("total", "seen", "value")}
             if row["locals"] else None)
    print(f"{row['step']:>32}  {str(row['frame']):>7}  {str(row['lasti']):>8}  {shown}")

# %%
mid = [row for row in trace if row["frame"] and row["locals"]]
lasti_moved = len({row["lasti"] for row in mid}) > 1
totals = [row["locals"].get("total") for row in mid if "total" in row["locals"]]

suspended = [row for row in mid if row["locals"]]
resume_points = {row["lasti"] for row in suspended}

checkpoint("the frame exists while suspended", all(row["frame"] for row in mid))
checkpoint("the resume point is IDENTICAL at every suspension",
           len(resume_points) == 1,
           f"f_lasti = {resume_points.pop()} each time — the same yield in a loop")
checkpoint("the locals persist and accumulate", totals == sorted(totals) and len(set(totals)) > 1,
           f"total {totals}")
checkpoint("the frame is gone after exhaustion", not trace[-1]["frame"])
checkpoint("gi_running is False throughout — nothing is executing",
           not any(row["running"] for row in trace))

# %%
resolve(
    "A generator's local variables live in a frame. Between two next() calls — "
    "while nothing is executing — does that frame still exist, and are the "
    "locals still there?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "A generator's local variables live in a frame. Between two next() calls — "
    "while nothing is executing — does that frame still exist, and are the "
    "locals still there?",
    """
    Yes to both. The frame outlives the call that created it, and its locals are
    readable while nothing is running.

    An ordinary function's frame is destroyed when it returns. A generator's is
    not: `yield` **suspends** rather than returns, so the frame is retained with
    its locals intact, its instruction pointer parked at the yield, and no thread
    executing it. `gi_running` is False the whole time you are looking, which is
    what makes the observation possible at all.

    Three things the trace makes concrete:

    - **`f_lasti` is the same at all three suspensions.** It is the offset of the
      last instruction executed, and every suspension parks at the *same* `yield`
      inside the loop. So the resume *position* carries almost no information —
      three visibly different states share one instruction pointer.
    - **`total` accumulates across calls.** Nothing re-entered the function and
      re-initialised it. The variable was never destroyed, so there was nothing to
      re-create. This is where the difference between the three states actually
      lives: not in where the generator is, but in what it is holding.
    - **The frame becomes None at exhaustion.** Once the generator function
      returns, `StopIteration` is raised and `gi_frame` drops to None. The
      resumable computation is over, and the state it was holding is releasable.

    That last point is the cost side. A suspended generator is a live frame
    holding references to everything its locals name. "Lazy means it uses no
    memory" is false — it uses *bounded* memory, which is a different and much
    more useful claim, and the boundary is exactly the frame you just read.
    """,
)

# %% [markdown]
# ## 3. Recognize — what is retained while suspended?

# %%
STATEMENTS = {
    "a": "Between next() calls, the generator's frame object exists.",
    "b": "Between next() calls, the generator function is executing.",
    "c": "A suspended generator holds references to the objects its locals name.",
    "d": "After StopIteration, the generator can be resumed by calling next() "
         "again.",
}
for key, text in STATEMENTS.items():
    print(f"{key}. {text}")


def is_true(key: str) -> bool:
    """True when this bench's evidence supports the statement."""
    raise NotImplementedError("Classify each statement")


# %%
check("is_true", is_true,
      [(("a",), True), (("b",), False), (("c",), True), (("d",), False)])

# %% [markdown]
# ## 4. Exhaustion is permanent

# %%
again = []
for _ in range(3):
    try:
        again.append(next(gen))
    except StopIteration:
        again.append("StopIteration")

print(f"three further next() calls: {again}")
checkpoint("an exhausted generator stays exhausted",
           all(v == "StopIteration" for v in again),
           "it does not restart, and there is no frame left to resume")

# %% [markdown]
# ## 5. The trace

# %%
SUSPENSION_TRACE = """
Where the generator resumes from, named as a concrete value:
What the locals held at each suspension:
What exists between calls, and what does not:
What a suspended generator keeps alive, and why 'uses no memory' is wrong:
"""
print(SUSPENSION_TRACE)

# %%
claim("DEFINITION / MODEL", SUSPENSION_TRACE)

claim(
    "CPYTHON OBSERVATION",
    f"A suspended generator retains its frame with gi_running False. All three "
    f"suspensions park at the same instruction offset, while the local `total` "
    f"accumulates {totals} — so the state difference is in the locals, not the "
    f"resume position. The frame becomes None after StopIteration, and further "
    f"next() calls do not restart it.",
    support={"trace": [{k: v for k, v in row.items() if k != "locals"} for row in trace],
             "totals": totals, "lastiValues": [row["lasti"] for row in mid]},
)

non_claim(
    "`gi_frame`, `f_lasti`, and `f_locals` are CPython introspection surfaces. "
    "The suspend-and-resume semantics are a language guarantee; the ability to "
    "read an instruction offset is not, and `f_lasti`'s specific values depend on "
    "the bytecode this build emits."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. The frame survived between calls. State what that implies about the lifetime
#    of objects a suspended generator's locals refer to.
# 2. "Lazy uses no memory" was refuted. Write the accurate claim in one sentence.
# 3. Session 4 measures eager against lazy ingestion. Predict which of the two
#    retains more, and name the quantity that decides it.
#
# ---
#
# ## Attributions
#
# Authored for this course. Module 7 has no checked-in reference model.
