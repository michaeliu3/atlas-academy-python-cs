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
# # Bench m17-s3 — ISA state and call-convention trace
#
# **Session 17.3 — Read instructions as state transitions.** Rungs: **debug and
# defend** (primary), trace.
#
# The workbook's code-reading studio shows a machine history with one incorrect
# row and asks you to find it. This bench generates a correct history and a
# corrupted one, so the row is found by diffing rather than by being told.
#
# The corruption is chosen so the first *wrong* row and the first *visibly
# broken* row are not the same row.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402
from dataclasses import replace  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module17_reference import toy_program, trace_toy_machine  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=17, session=3, emits="ISA state and call-convention trace",
      rungs=["debug-and-defend", "trace"])

# %% [markdown]
# ## 1. The correct history

# %%
program = toy_program()
print("program:")
for index, instruction in enumerate(program):
    print(f"  {index}: {instruction.operation:<6} dest={instruction.destination} "
          f"left={instruction.left} imm={instruction.right_or_immediate}")

correct = trace_toy_machine(program)

print(f"\n{'step':>5}  {'pc':>3}  {'executed':>8}  {'registers':>16}  {'memory':>16}")
for state in correct:
    print(f"{state.step:>5}  {state.pc:>3}  {state.executed:>8}  "
          f"{str(state.registers):>16}  {str(state.memory):>16}")

checkpoint("the program halts", correct[-1].halted)
checkpoint("the final register file is the documented result",
           correct[-1].registers[3] == correct[-1].registers[1] + correct[-1].registers[2],
           "r3 = r1 + r2, as the ADD specifies")

# %%
predict(
    "Neutralize the STORE — replace it with an instruction that changes nothing. "
    "Which step's row is the FIRST to differ from the correct history, and which "
    "is the first to look obviously wrong?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — neutralize the STORE and diff the histories
#
# The STORE is *replaced* rather than deleted, by a redundant `LOADI r0, 0` that
# re-writes r0 with the value it already holds. Both programs therefore have the
# same length and the same instruction at every position: step `k` of one history
# is directly comparable to step `k` of the other, and any difference is caused by
# the swap rather than by drift in alignment.

# %%
neutralized = tuple(
    replace(program[0], destination=0, right_or_immediate=0)
    if instruction.operation == "STORE" else instruction
    for instruction in program
)
corrupted = trace_toy_machine(neutralized)

checkpoint("both programs have the same shape",
           len(neutralized) == len(program) and len(corrupted) == len(correct),
           "one instruction swapped, nothing added or removed")


def first_divergence(a, b) -> dict:
    for index, (left, right) in enumerate(zip(a, b)):
        if (left.registers, left.memory) != (right.registers, right.memory):
            return {"step": index,
                    "correct": {"registers": left.registers, "memory": left.memory},
                    "corrupted": {"registers": right.registers, "memory": right.memory}}
    return {}


divergence = first_divergence(correct, corrupted)

print(f"{'step':>5}  {'correct registers':>18}  {'corrupted registers':>20}  "
      f"{'correct memory':>16}  {'corrupted memory':>18}")
for index, (a, b) in enumerate(zip(correct, corrupted)):
    mark = " <-- first differs" if divergence and index == divergence["step"] else ""
    print(f"{index:>5}  {str(a.registers):>18}  {str(b.registers):>20}  "
          f"{str(a.memory):>16}  {str(b.memory):>18}{mark}")

print(f"\nfirst divergence: step {divergence['step']}")
print(f"  correct  : {divergence['correct']}")
print(f"  corrupted: {divergence['corrupted']}")

first_register_divergence = next(
    index for index, (a, b) in enumerate(zip(correct, corrupted))
    if a.registers != b.registers
)

print(f"\nfirst divergence in MEMORY   : step {divergence['step']}")
print(f"first divergence in REGISTERS: step {first_register_divergence}")
print(f"gap                          : "
      f"{first_register_divergence - divergence['step']} step(s)")

checkpoint("the histories diverge before the end", divergence["step"] < len(correct) - 1)
checkpoint("the divergence begins in MEMORY, not in a register",
           divergence["correct"]["memory"] != divergence["corrupted"]["memory"]
           and divergence["correct"]["registers"] == divergence["corrupted"]["registers"],
           "the absent STORE changes memory first; every register still agrees")
checkpoint("the visible symptom arrives strictly later, in a register",
           first_register_divergence > divergence["step"],
           "the wrong value reaches a register only once a LOAD reads that memory")
checkpoint("the instruction executing at the visible step is itself correct",
           correct[first_register_divergence].executed
           == corrupted[first_register_divergence].executed == "LOAD",
           "LOAD did exactly what LOAD does, with the memory it was given")

# %%
resolve(
    "Neutralize the STORE — replace it with an instruction that changes nothing. "
    "Which step's row is the FIRST to differ from the correct history, and which "
    "is the first to look obviously wrong?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Neutralize the STORE — replace it with an instruction that changes nothing. "
    "Which step's row is the FIRST to differ from the correct history, and which "
    "is the first to look obviously wrong?",
    """
    They are different rows, and the gap between them is the point.

    The first divergence is in **memory**: with no STORE, the memory word that
    should have been written stays zero. At that step every register still matches
    the correct history exactly. Nothing looks wrong. A reader scanning the
    register file — the thing you naturally watch — sees nothing.

    The symptom appears one step later, when the LOAD reads that memory word into
    a register and the ADD propagates it to the result. The instruction executing
    at the step where the registers first differ is *innocent*: LOAD did exactly
    what LOAD does, with the memory it was given. The bench checks that
    explicitly.

    One step is a small gap because this is a six-instruction program. The gap is
    bounded only by how long the corrupted word sits in memory before something
    reads it — in a real program that can be millions of instructions, a different
    function, or a different thread. The mechanism is the same at every scale, and
    it is what makes machine-level debugging different from reading source: the
    state has several independent components — registers, memory, program counter,
    flags — and a defect can sit in one of them before crossing into another.
    Watching only the component where the failure *appears* points you at the
    wrong instruction.

    The technique that finds it is the one this bench used: a full state history
    and a diff against a known-good run. The first differing row names the cause;
    everything after it is propagation. That is the same rule as bench `m06-s4`,
    where the first violated invariant clause named the defect and the later ones
    were fallout — here it holds across state *components* rather than across
    invariant clauses.

    A trace that recorded only the final register file would show the failure and
    hide the cause completely.
    """,
)

# %% [markdown]
# ## 3. Debug — a corruption that never becomes visible

# %%
extended = program[:-1] + (
    replace(program[0], destination=3, right_or_immediate=99),
    program[-1],
)
extended_trace = trace_toy_machine(extended)

print("an extra LOADI r3, 99 before HALT overwrites the ADD result:")
print(f"  correct final registers : {correct[-1].registers}")
print(f"  extended final registers: {extended_trace[-1].registers}")

overwritten = correct[-1].registers[3] != extended_trace[-1].registers[3]
checkpoint("the ADD result is silently overwritten", overwritten,
           "a correct instruction sequence whose earlier work is discarded")

# %% [markdown]
# ## 4. Recognize — which state component carries each defect?

# %%
DEFECTS = {
    "a": "A missing STORE.",
    "b": "A LOAD from the wrong address.",
    "c": "An instruction that overwrites a register still needed later.",
    "d": "A program counter that skips an instruction.",
}
for key, text in DEFECTS.items():
    print(f"{key}. {text}")


def first_component(key: str) -> str:
    """Where the defect FIRST shows: one of memory, registers, pc."""
    raise NotImplementedError("Name the first component affected by each defect")


# %%
check("first_component", first_component,
      [(("a",), "memory"), (("b",), "registers"),
       (("c",), "registers"), (("d",), "pc")])

# %% [markdown]
# ## 5. The trace

# %%
TRACE_NOTE = """
The state components this machine has:
The step where the histories first differ, and in which component:
The step where the failure becomes visible, and in which component:
Why watching the register file alone points at the wrong instruction:
The rule I would follow next time, stated as a procedure:
"""
print(TRACE_NOTE)

# %%
claim("DEFENDED REPAIR", TRACE_NOTE)

claim(
    "LOCAL REFERENCE RESULT",
    f"Neutralizing the STORE in this {len(program)}-instruction program makes the "
    f"two machine histories diverge at step {divergence['step']}, in memory "
    f"({divergence['correct']['memory']} against "
    f"{divergence['corrupted']['memory']}), while the register files at that step "
    f"still agree exactly. The register file first differs at step "
    f"{first_register_divergence}, {first_register_divergence - divergence['step']} "
    f"step(s) later.",
    support={"program": [i.operation for i in program],
             "firstDivergence": divergence,
             "firstRegisterDivergence": first_register_divergence,
             "correctFinalRegisters": list(correct[-1].registers),
             "corruptedFinalRegisters": list(corrupted[-1].registers)},
)

non_claim(
    "This is a declared toy ISA with four registers, four memory words, and "
    "8-bit words. It demonstrates that a defect can sit in one state component "
    "before surfacing in another; it models no real instruction set, no pipeline, "
    "no flags register, and no calling convention beyond what the six "
    "instructions above express."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. Cause and symptom landed in different state components, one step apart here
#    and unboundedly far apart in general. Write the debugging rule this implies,
#    as a procedure rather than an observation.
# 2. The extra LOADI produced a wrong result with no incorrect instruction. Name
#    the class of defect that has no single guilty line.
# 3. Bench `m06-s4` found the first violated invariant clause naming the cause.
#    State the general principle both benches are instances of.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module17_reference.py` — `toy_program` and
# `trace_toy_machine`. Not reimplemented. The corruption, the history diff, and
# the component classification are this bench's own.
