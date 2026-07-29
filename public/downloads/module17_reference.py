"""Module 17: bounded architecture-evidence reference.

The program keeps one semantic task fixed while changing address order.  It
provides deterministic teaching models and a reproducible evidence packet; it
does not pretend that a Python program can infer hardware cache events from
elapsed time alone.

Run:
    python module17_reference_candidate.py --json
    python module17_reference_candidate.py --self-test

The reference deliberately stops before Module 18 (OS mechanisms), Module 19
(concurrency), and Module 24 (CPython object layout, allocation, garbage
collection, specialization, and deep profiling).
"""

from __future__ import annotations

import argparse
import dis
import json
import math
import os
import platform
import statistics
import struct
import sys
import time
import unittest
from array import array
from collections.abc import Callable, Mapping, Sequence
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import TypeAlias


JsonScalar: TypeAlias = str | int | float | bool | None
JsonValue: TypeAlias = JsonScalar | list["JsonValue"] | dict[str, "JsonValue"]

DEFAULT_SIZE = 20_000
DEFAULT_THRESHOLD = 4_999
DEFAULT_BLOCKS = 2
DEFAULT_NUMBER = 20
MAX_SIZE = 2_000_000
UINT32_MAX = (1 << 32) - 1


@dataclass(frozen=True, slots=True)
class Signed16Observation:
    value: int
    unsigned_bit_pattern_value: int
    bit_pattern: str
    little_endian_hex: str
    big_endian_hex: str
    matching_decoders_round_trip: bool
    scope: str


@dataclass(frozen=True, slots=True)
class SourceBridgeObservation:
    function: str
    implementation: str
    python_version: str
    logical_opnames: tuple[str, ...]
    scope: str


@dataclass(frozen=True, slots=True)
class ToyInstruction:
    operation: str
    destination: int | None = None
    left: int | None = None
    right_or_immediate: int | None = None


@dataclass(frozen=True, slots=True)
class ToyMachineState:
    step: int
    pc: int
    word_bits: int
    registers: tuple[int, ...]
    memory: tuple[int, ...]
    halted: bool
    executed: str


@dataclass(frozen=True, slots=True)
class CacheEvent:
    visit_position: int
    item_index: int
    byte_address: int
    memory_line: int
    cache_slot: int
    hit: bool


@dataclass(frozen=True, slots=True)
class ToyCacheObservation:
    label: str
    item_bytes: int
    line_bytes: int
    cache_slots: int
    accesses: int
    hits: int
    misses: int
    preview: tuple[CacheEvent, ...]
    scope: str


@dataclass(frozen=True, slots=True)
class TimingTrial:
    position: int
    block: int
    block_schedule: str
    condition: str
    condition_occurrence: int
    exposure: str
    calls: int
    total_seconds: float
    seconds_per_call: float


def _strict_int(name: str, value: object) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an integer")
    return value


def _positive_int(name: str, value: object) -> int:
    result = _strict_int(name, value)
    if result <= 0:
        raise ValueError(f"{name} must be positive")
    return result


def signed16_probe(value: int = -4) -> Signed16Observation:
    """Show that bytes need width, signedness, and byte order to mean a value."""

    value = _strict_int("value", value)
    if not -(1 << 15) <= value < (1 << 15):
        raise ValueError("value must fit a signed 16-bit field")

    little = struct.pack("<h", value)
    big = struct.pack(">h", value)
    unsigned = value & 0xFFFF
    return Signed16Observation(
        value=value,
        unsigned_bit_pattern_value=unsigned,
        bit_pattern=f"{unsigned:016b}",
        little_endian_hex=little.hex(" "),
        big_endian_hex=big.hex(" "),
        matching_decoders_round_trip=(
            struct.unpack("<h", little)[0] == value
            and struct.unpack(">h", big)[0] == value
        ),
        scope=(
            "one explicit signed 16-bit field encoded with Python struct; "
            "not the layout of an arbitrary Python int object"
        ),
    )


def priority_codes(size: int) -> array:
    """Build deterministic Atlas priority codes in one 32-bit representation."""

    size = _strict_int("size", size)
    if not 0 <= size <= MAX_SIZE:
        raise ValueError(f"size must be between 0 and {MAX_SIZE}")

    codes = array("I", ((index * 37 + 11) % 10_007 for index in range(size)))
    if codes.itemsize != 4:
        raise RuntimeError(
            "this reference requires array('I') to be four bytes on this runtime"
        )
    return codes


def sequential_order(size: int) -> tuple[int, ...]:
    size = _strict_int("size", size)
    if size < 0:
        raise ValueError("size must be nonnegative")
    return tuple(range(size))


def deterministic_permutation(size: int) -> tuple[int, ...]:
    """Return a reproducible full permutation with a large modular stride."""

    size = _strict_int("size", size)
    if size < 0:
        raise ValueError("size must be nonnegative")
    if size < 2:
        return tuple(range(size))

    step = size // 2 + 1
    while math.gcd(step, size) != 1:
        step += 1
    offset = size // 3
    return tuple((offset + position * step) % size for position in range(size))


def validate_visit_order(
    visit_order: Sequence[int],
    *,
    size: int,
) -> None:
    """Validate once, outside the measured kernel."""

    size = _strict_int("size", size)
    if size < 0:
        raise ValueError("size must be nonnegative")
    if len(visit_order) != size:
        raise ValueError("visit order must contain exactly one entry per code")

    seen: set[int] = set()
    for index in visit_order:
        index = _strict_int("visit index", index)
        if not 0 <= index < size:
            raise ValueError(f"visit index {index} is outside [0, {size})")
        if index in seen:
            raise ValueError(f"visit index {index} occurs more than once")
        seen.add(index)


def count_due(
    codes: Sequence[int],
    visit_order: Sequence[int],
    threshold: int,
) -> int:
    """The single kernel used for both address orders.

    Validation and construction are intentionally outside this function so the
    measured work is the same lookup-and-compare loop for both conditions.
    """

    due = 0
    for index in visit_order:
        if codes[index] <= threshold:
            due += 1
    return due


def semantic_witness(
    codes: array,
    sequential: Sequence[int],
    permuted: Sequence[int],
    threshold: int,
) -> dict[str, JsonValue]:
    """Prove the fixture's result contract before investigating mechanisms."""

    threshold = _strict_int("threshold", threshold)
    if not isinstance(codes, array):
        raise TypeError("codes must be an array")
    if codes.typecode != "I" or codes.itemsize != 4:
        raise ValueError("codes must use the declared four-byte array('I') format")
    validate_visit_order(sequential, size=len(codes))
    validate_visit_order(permuted, size=len(codes))
    sequential_result = count_due(codes, sequential, threshold)
    permuted_result = count_due(codes, permuted, threshold)
    oracle = sum(code <= threshold for code in codes)
    return {
        "code_count": len(codes),
        "threshold": threshold,
        "sequential_result": sequential_result,
        "permuted_result": permuted_result,
        "order_independent_oracle": oracle,
        "all_results_equal": sequential_result == permuted_result == oracle,
        "same_kernel": "count_due",
        "same_representation": "array('I'), four bytes per code",
        "only_planned_difference": "the order in which legal indices are visited",
    }


def source_bridge_observation() -> SourceBridgeObservation:
    """Expose only enough bytecode to reject source-line/ISA equivalence."""

    instructions = tuple(dis.get_instructions(count_due))
    return SourceBridgeObservation(
        function=count_due.__name__,
        implementation=platform.python_implementation(),
        python_version=platform.python_version(),
        logical_opnames=tuple(instruction.opname for instruction in instructions),
        scope=(
            "logical bytecode names reported by dis for this runtime/version; "
            "not native ISA instructions, CPU cycles, or cache accesses"
        ),
    )


def toy_program() -> tuple[ToyInstruction, ...]:
    """A tiny load/store program used to trace architectural state."""

    return (
        ToyInstruction("LOADI", destination=0, right_or_immediate=0),
        ToyInstruction("LOADI", destination=1, right_or_immediate=7),
        ToyInstruction("STORE", destination=1, left=0),
        ToyInstruction("LOAD", destination=2, left=0),
        ToyInstruction("ADD", destination=3, left=1, right_or_immediate=2),
        ToyInstruction("HALT"),
    )


def _register_index(value: int | None, register_count: int) -> int:
    if value is None or not 0 <= value < register_count:
        raise ValueError(f"invalid register index: {value}")
    return value


def _memory_address(
    registers: list[int],
    register_index: int | None,
    memory_size: int,
) -> int:
    index = _register_index(register_index, len(registers))
    address = registers[index]
    if not 0 <= address < memory_size:
        raise ValueError(f"invalid memory address: {address}")
    return address


def trace_toy_machine(
    program: Sequence[ToyInstruction] | None = None,
    *,
    register_count: int = 4,
    memory_size: int = 4,
    word_bits: int = 8,
    max_steps: int = 100,
) -> tuple[ToyMachineState, ...]:
    """Execute a transparent teaching ISA.

    This is a deliberately tiny state-transition model, not RISC-V and not a
    model of CPython.  Each non-HALT instruction advances ``pc`` by one.
    """

    register_count = _positive_int("register_count", register_count)
    memory_size = _positive_int("memory_size", memory_size)
    word_bits = _positive_int("word_bits", word_bits)
    if word_bits > 64:
        raise ValueError("word_bits must not exceed 64 in this teaching model")
    max_steps = _positive_int("max_steps", max_steps)
    selected = tuple(toy_program() if program is None else program)
    word_mask = (1 << word_bits) - 1

    registers = [0] * register_count
    memory = [0] * memory_size
    pc = 0
    halted = False
    history: list[ToyMachineState] = [
        ToyMachineState(
            step=0,
            pc=pc,
            word_bits=word_bits,
            registers=tuple(registers),
            memory=tuple(memory),
            halted=False,
            executed="INITIAL",
        )
    ]

    for step in range(1, max_steps + 1):
        if not 0 <= pc < len(selected):
            raise RuntimeError("program counter left the program before HALT")

        instruction = selected[pc]
        operation = instruction.operation
        if operation == "LOADI":
            destination = _register_index(
                instruction.destination,
                register_count,
            )
            if instruction.right_or_immediate is None:
                raise ValueError("LOADI requires an immediate")
            registers[destination] = instruction.right_or_immediate & word_mask
            pc += 1
        elif operation == "LOAD":
            destination = _register_index(
                instruction.destination,
                register_count,
            )
            address = _memory_address(
                registers,
                instruction.left,
                memory_size,
            )
            registers[destination] = memory[address] & word_mask
            pc += 1
        elif operation == "STORE":
            source = _register_index(instruction.destination, register_count)
            address = _memory_address(
                registers,
                instruction.left,
                memory_size,
            )
            memory[address] = registers[source]
            pc += 1
        elif operation == "ADD":
            destination = _register_index(
                instruction.destination,
                register_count,
            )
            left = _register_index(instruction.left, register_count)
            right = _register_index(
                instruction.right_or_immediate,
                register_count,
            )
            registers[destination] = (
                registers[left] + registers[right]
            ) & word_mask
            pc += 1
        elif operation == "HALT":
            halted = True
        else:
            raise ValueError(f"unsupported toy operation: {operation}")

        history.append(
            ToyMachineState(
                step=step,
                pc=pc,
                word_bits=word_bits,
                registers=tuple(registers),
                memory=tuple(memory),
                halted=halted,
                executed=operation,
            )
        )
        if halted:
            return tuple(history)

    raise RuntimeError("max_steps reached before HALT")


def toy_cache_observation(
    label: str,
    visit_order: Sequence[int],
    *,
    item_bytes: int = 4,
    line_bytes: int = 64,
    cache_slots: int = 8,
    preview_limit: int = 24,
) -> ToyCacheObservation:
    """Replay addresses through a tiny direct-mapped cache teaching model."""

    if not label.strip():
        raise ValueError("label must be nonblank")
    item_bytes = _positive_int("item_bytes", item_bytes)
    line_bytes = _positive_int("line_bytes", line_bytes)
    cache_slots = _positive_int("cache_slots", cache_slots)
    preview_limit = _positive_int("preview_limit", preview_limit)
    if line_bytes % item_bytes:
        raise ValueError("line_bytes must be a multiple of item_bytes")

    tags: list[int | None] = [None] * cache_slots
    hits = 0
    misses = 0
    preview: list[CacheEvent] = []
    for position, item_index in enumerate(visit_order):
        item_index = _strict_int("item index", item_index)
        if item_index < 0:
            raise ValueError("item indices must be nonnegative")
        address = item_index * item_bytes
        memory_line = address // line_bytes
        slot = memory_line % cache_slots
        hit = tags[slot] == memory_line
        if hit:
            hits += 1
        else:
            misses += 1
            tags[slot] = memory_line
        if position < preview_limit:
            preview.append(
                CacheEvent(
                    visit_position=position,
                    item_index=item_index,
                    byte_address=address,
                    memory_line=memory_line,
                    cache_slot=slot,
                    hit=hit,
                )
            )

    return ToyCacheObservation(
        label=label,
        item_bytes=item_bytes,
        line_bytes=line_bytes,
        cache_slots=cache_slots,
        accesses=len(visit_order),
        hits=hits,
        misses=misses,
        preview=tuple(preview),
        scope=(
            "deterministic direct-mapped teaching model with the declared "
            "geometry; not the host CPU cache, not a hardware counter, and "
            "not evidence that cache events caused elapsed-time differences"
        ),
    )


def counterbalanced_schedule(blocks: int) -> tuple[tuple[str, str], ...]:
    """Return ABBA/BAAB blocks as ``(schedule_name, condition)`` entries."""

    blocks = _positive_int("blocks", blocks)
    flattened: list[tuple[str, str]] = []
    for block in range(blocks):
        schedule = (
            ("sequential", "permuted", "permuted", "sequential")
            if block % 2 == 0
            else ("permuted", "sequential", "sequential", "permuted")
        )
        name = "ABBA" if block % 2 == 0 else "BAAB"
        flattened.extend((name, condition) for condition in schedule)
    return tuple(flattened)


def counterbalanced_timings(
    codes: Sequence[int],
    orders: Mapping[str, Sequence[int]],
    threshold: int,
    *,
    blocks: int,
    number: int,
    clock: Callable[[], float] = time.perf_counter,
) -> tuple[TimingTrial, ...]:
    """Record every timing trial in a crossed deterministic schedule."""

    blocks = _positive_int("blocks", blocks)
    number = _positive_int("number", number)
    threshold = _strict_int("threshold", threshold)
    required = {"sequential", "permuted"}
    if set(orders) != required:
        raise ValueError(f"orders must contain exactly {sorted(required)}")
    for order in orders.values():
        validate_visit_order(order, size=len(codes))

    occurrences = {"sequential": 0, "permuted": 0}
    trials: list[TimingTrial] = []
    for position, (schedule_name, condition) in enumerate(
        counterbalanced_schedule(blocks),
        start=1,
    ):
        occurrences[condition] += 1
        visit_order = orders[condition]
        started = clock()
        for _ in range(number):
            count_due(codes, visit_order, threshold)
        total = clock() - started
        trials.append(
            TimingTrial(
                position=position,
                block=(position - 1) // 4 + 1,
                block_schedule=schedule_name,
                condition=condition,
                condition_occurrence=occurrences[condition],
                exposure=(
                    "first-timed-block-for-condition"
                    if occurrences[condition] == 1
                    else "later-timed-block-for-condition"
                ),
                calls=number,
                total_seconds=total,
                seconds_per_call=total / number,
            )
        )
    return tuple(trials)


def timing_cells(trials: Sequence[TimingTrial]) -> dict[str, JsonValue]:
    """Group raw vectors without manufacturing a causal comparison scalar."""

    grouped: dict[str, list[float]] = {
        "sequential.first-timed-block-for-condition": [],
        "sequential.later-timed-block-for-condition": [],
        "permuted.first-timed-block-for-condition": [],
        "permuted.later-timed-block-for-condition": [],
    }
    for trial in trials:
        grouped[f"{trial.condition}.{trial.exposure}"].append(
            trial.seconds_per_call
        )
    cells: dict[str, JsonValue] = {}
    for name, values in grouped.items():
        cells[name] = {
            "seconds_per_call": values,
            "count": len(values),
            "median_seconds_per_call": (
                statistics.median(values) if values else None
            ),
        }
    return cells


def runtime_record() -> dict[str, JsonValue]:
    """Capture useful provenance without host or user identity."""

    return {
        "implementation": platform.python_implementation(),
        "python_version": platform.python_version(),
        "python_compiler": platform.python_compiler(),
        "executable_name": Path(sys.executable).name,
        "os": platform.system(),
        "os_release": platform.release(),
        "machine": platform.machine(),
        "pointer_bits": struct.calcsize("P") * 8,
        "host_byteorder": sys.byteorder,
        "array_I_item_bytes": array("I").itemsize,
        "timer": "time.perf_counter around an explicit Python call loop",
        "python_hash_seed": (
            "unset/randomized"
            if os.environ.get("PYTHONHASHSEED") is None
            else "explicitly set"
        ),
        "provenance_boundary": (
            "does not record cache geometry, CPU frequency, power mode, "
            "background load, OS scheduling, page faults, or hardware counters"
        ),
    }


def _as_json_value(value: object) -> JsonValue:
    if hasattr(value, "__dataclass_fields__"):
        return _as_json_value(asdict(value))
    if isinstance(value, Mapping):
        return {str(key): _as_json_value(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_as_json_value(item) for item in value]
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    raise TypeError(f"cannot serialize {type(value).__name__}")


def build_report(
    *,
    size: int = DEFAULT_SIZE,
    threshold: int = DEFAULT_THRESHOLD,
    blocks: int = DEFAULT_BLOCKS,
    number: int = DEFAULT_NUMBER,
    include_timing: bool = True,
) -> dict[str, JsonValue]:
    """Build one deterministic-schema Module 17 evidence packet."""

    size = _positive_int("size", size)
    if size > MAX_SIZE:
        raise ValueError(f"size must be at most {MAX_SIZE}")
    threshold = _strict_int("threshold", threshold)
    if not 0 <= threshold <= UINT32_MAX:
        raise ValueError(f"threshold must be between 0 and {UINT32_MAX}")
    blocks = _positive_int("blocks", blocks)
    number = _positive_int("number", number)

    codes = priority_codes(size)
    sequential = sequential_order(size)
    permuted = deterministic_permutation(size)
    orders = {"sequential": sequential, "permuted": permuted}
    witness = semantic_witness(codes, sequential, permuted, threshold)

    timings: tuple[TimingTrial, ...] = ()
    if include_timing:
        timings = counterbalanced_timings(
            codes,
            orders,
            threshold,
            blocks=blocks,
            number=number,
        )

    direct_observations = [
        "explicit signed-16-bit struct encodings and matching round trips",
        "the toy machine's declared register and memory state transitions",
        "hits and misses produced by the declared toy cache model",
        "logical dis opcode names from the recorded Python runtime",
    ]
    if timings:
        direct_observations.append(
            "complete elapsed-time trials in the recorded ABBA/BAAB order"
        )

    report: dict[str, JsonValue] = {
        "schema": "atlas.module17.architecture-evidence.v2",
        "runtime": runtime_record(),
        "protocol": {
            "size": size,
            "threshold": threshold,
            "representation": "array('I')",
            "item_bytes": codes.itemsize,
            "kernel": "count_due",
            "order_construction_timed": False,
            "validation_timed": False,
            "timing_included": include_timing,
            "blocks": blocks,
            "calls_per_trial": number,
            "schedule": [
                "ABBA" if block % 2 == 0 else "BAAB"
                for block in range(blocks)
            ],
            "semantic_preflight_calls_per_condition": 1,
            "warmup_policy": (
                "no hidden warm-up; semantic preflight is recorded and timed "
                "block order is labeled"
            ),
            "timing_loop_boundary": (
                "the explicit Python loop and timer calls are included equally "
                "for both conditions"
            ),
        },
        "semantic_witness": witness,
        "signed_16_bit_encoding": _as_json_value(signed16_probe()),
        "toy_isa_trace": _as_json_value(trace_toy_machine()),
        "python_execution_bridge": _as_json_value(source_bridge_observation()),
        "toy_cache_models": [
            _as_json_value(
                toy_cache_observation("sequential", sequential)
            ),
            _as_json_value(
                toy_cache_observation("permuted", permuted)
            ),
        ],
        "timing_trials": _as_json_value(timings),
        "timing_cells": timing_cells(timings) if timings else {},
        "claim_boundaries": {
            "direct_observations": direct_observations,
            "supported_inferences": [
                "both visit orders satisfy the tested semantic result contract",
                "the same addresses can produce different locality in a named model",
                "elapsed time alone permits multiple competing explanations",
            ],
            "unmeasured_hypotheses": [
                "host hardware cache hits, misses, evictions, or cache-line size",
                "native instruction mix, branch prediction, and pipeline stalls",
                "OS scheduling, virtual memory, page faults, and I/O behavior",
                "CPython object layout, allocation, GC, or specialization effects",
                "which mechanism caused any elapsed-time difference",
            ],
            "never_promote_to_claim": [
                "the toy cache is the host cache",
                "permuted access is universally slower",
                "cache misses caused the observed timing vector",
                "Python bytecode is native machine code",
                "one Python operation is one ISA instruction or one cycle",
            ],
        },
        "next_falsification_steps": [
            "repeat the crossed schedule in fresh processes",
            "vary one declared factor such as size or order while preserving semantics",
            "retain every raw trial and record environmental changes",
            "use platform-appropriate hardware counters before claiming cache events",
            "seek an alternative explanation that predicts the same timing pattern",
        ],
    }
    return report


def render_human(report: Mapping[str, JsonValue]) -> str:
    witness = report["semantic_witness"]
    cache_models = report["toy_cache_models"]
    trials = report["timing_trials"]
    cache_lines = []
    if isinstance(cache_models, list):
        for model in cache_models:
            if isinstance(model, Mapping):
                cache_lines.append(
                    (
                        f"toy cache · {model['label']}: "
                        f"{model['accesses']} accesses, {model['hits']} hits, "
                        f"{model['misses']} misses "
                        f"({model['cache_slots']} slots × {model['line_bytes']} B)"
                    )
                )
    lines = [
        "ATLAS · MODULE 17 · ARCHITECTURE EVIDENCE",
        f"schema: {report['schema']}",
        f"semantic witness: {witness}",
        *cache_lines,
        f"recorded timing trials: {len(trials) if isinstance(trials, list) else 0}",
        "",
        "Boundary:",
        (
            "The cache results come from a transparent teaching model. The "
            "timings come from this Python process. Neither establishes host "
            "hardware cache events or a causal hardware explanation."
        ),
        "",
        "Use --json to retain the complete machine-readable packet.",
    ]
    return "\n".join(lines)


class Module17ReferenceTests(unittest.TestCase):
    def test_signed16_probe_distinguishes_pattern_and_interpretation(self) -> None:
        observation = signed16_probe(-4)
        self.assertEqual(observation.little_endian_hex, "fc ff")
        self.assertEqual(observation.big_endian_hex, "ff fc")
        self.assertEqual(observation.unsigned_bit_pattern_value, 65_532)
        self.assertTrue(observation.matching_decoders_round_trip)

    def test_signed16_probe_rejects_invalid_values(self) -> None:
        for invalid in (-32_769, 32_768, True, 3.14):
            with self.subTest(invalid=invalid):
                with self.assertRaises((TypeError, ValueError)):
                    signed16_probe(invalid)  # type: ignore[arg-type]

    def test_priority_codes_use_declared_fixed_width(self) -> None:
        codes = priority_codes(100)
        self.assertEqual(codes.typecode, "I")
        self.assertEqual(codes.itemsize, 4)
        self.assertTrue(all(0 <= code <= UINT32_MAX for code in codes))

    def test_permutation_validation_rejects_bad_orders(self) -> None:
        validate_visit_order(deterministic_permutation(50), size=50)
        with self.assertRaises(ValueError):
            validate_visit_order((0, 1, 1), size=3)
        with self.assertRaises(ValueError):
            validate_visit_order((0, 1, 3), size=3)
        with self.assertRaises(ValueError):
            validate_visit_order((0, 1), size=3)

    def test_same_kernel_is_semantically_order_independent(self) -> None:
        for size in (0, 1, 17, 1_000):
            with self.subTest(size=size):
                codes = priority_codes(size)
                witness = semantic_witness(
                    codes,
                    sequential_order(size),
                    deterministic_permutation(size),
                    DEFAULT_THRESHOLD,
                )
                self.assertTrue(witness["all_results_equal"])
                self.assertEqual(witness["same_kernel"], "count_due")

    def test_toy_machine_load_store_and_add_trace(self) -> None:
        trace = trace_toy_machine()
        self.assertEqual(trace[0].executed, "INITIAL")
        self.assertEqual(trace[-1].executed, "HALT")
        self.assertTrue(trace[-1].halted)
        self.assertEqual(trace[-1].memory[0], 7)
        self.assertEqual(trace[-1].registers[2], 7)
        self.assertEqual(trace[-1].registers[3], 14)

    def test_toy_machine_addition_wraps_to_declared_word_width(self) -> None:
        trace = trace_toy_machine(
            (
                ToyInstruction("LOADI", destination=0, right_or_immediate=250),
                ToyInstruction("LOADI", destination=1, right_or_immediate=10),
                ToyInstruction("ADD", destination=2, left=0, right_or_immediate=1),
                ToyInstruction("HALT"),
            ),
            word_bits=8,
        )
        self.assertEqual(trace[-1].word_bits, 8)
        self.assertEqual(trace[-1].registers[2], 4)

    def test_toy_machine_requires_halt(self) -> None:
        with self.assertRaises(RuntimeError):
            trace_toy_machine(
                (ToyInstruction("LOADI", 0, None, 1),),
            )

    def test_known_toy_cache_trace(self) -> None:
        observation = toy_cache_observation(
            "known",
            tuple(range(16)),
            item_bytes=4,
            line_bytes=16,
            cache_slots=2,
        )
        self.assertEqual(observation.accesses, 16)
        self.assertEqual(observation.misses, 4)
        self.assertEqual(observation.hits, 12)
        self.assertIn("not the host CPU cache", observation.scope)

    def test_permuted_model_changes_declared_locality_for_fixture(self) -> None:
        size = 256
        sequential = toy_cache_observation(
            "sequential",
            sequential_order(size),
        )
        permuted = toy_cache_observation(
            "permuted",
            deterministic_permutation(size),
        )
        self.assertGreater(permuted.misses, sequential.misses)

    def test_counterbalanced_schedule_and_raw_trials(self) -> None:
        self.assertEqual(
            tuple(condition for _, condition in counterbalanced_schedule(2)),
            (
                "sequential",
                "permuted",
                "permuted",
                "sequential",
                "permuted",
                "sequential",
                "sequential",
                "permuted",
            ),
        )
        codes = priority_codes(30)
        orders = {
            "sequential": sequential_order(30),
            "permuted": deterministic_permutation(30),
        }
        trials = counterbalanced_timings(
            codes,
            orders,
            DEFAULT_THRESHOLD,
            blocks=1,
            number=1,
        )
        self.assertEqual(len(trials), 4)
        self.assertEqual(
            trials[0].exposure,
            "first-timed-block-for-condition",
        )
        self.assertEqual(
            trials[-1].exposure,
            "later-timed-block-for-condition",
        )
        self.assertTrue(all(trial.seconds_per_call >= 0 for trial in trials))

    def test_three_block_schedule_metadata_matches_execution(self) -> None:
        report = build_report(
            size=30,
            blocks=3,
            number=1,
            include_timing=False,
        )
        protocol = report["protocol"]
        self.assertIsInstance(protocol, dict)
        assert isinstance(protocol, dict)
        self.assertEqual(protocol["schedule"], ["ABBA", "BAAB", "ABBA"])

    def test_timing_protocol_rejects_invalid_counts(self) -> None:
        with self.assertRaises(ValueError):
            counterbalanced_schedule(0)
        with self.assertRaises(ValueError):
            build_report(size=10, blocks=1, number=0)

    def test_thin_bytecode_bridge_is_version_scoped(self) -> None:
        observation = source_bridge_observation()
        self.assertEqual(observation.function, "count_due")
        self.assertGreater(len(observation.logical_opnames), 0)
        self.assertIn("not native ISA instructions", observation.scope)

    def test_report_is_serializable_without_timing_or_ratio(self) -> None:
        report = build_report(
            size=64,
            blocks=1,
            number=1,
            include_timing=False,
        )
        self.assertEqual(report["timing_trials"], [])
        self.assertEqual(report["timing_cells"], {})
        direct = report["claim_boundaries"]
        self.assertIsInstance(direct, dict)
        assert isinstance(direct, dict)
        self.assertNotIn(
            "complete elapsed-time trials in the recorded ABBA/BAAB order",
            direct["direct_observations"],
        )
        self.assertNotIn("observed_minimum_ratio", report)
        self.assertNotIn("timing_comparison_ratio", report)
        json.dumps(report, sort_keys=True, allow_nan=False)

    def test_claim_boundary_never_upgrades_cache_hypothesis(self) -> None:
        report = build_report(
            size=64,
            blocks=1,
            number=1,
            include_timing=False,
        )
        rendered = json.dumps(report).lower()
        self.assertIn("unmeasured_hypotheses", rendered)
        self.assertIn("hardware cache", rendered)
        self.assertIn("cache misses caused", rendered)
        self.assertNotIn("measured cache misses", rendered)


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Build a bounded Module 17 architecture evidence packet."
    )
    parser.add_argument("--size", type=int, default=DEFAULT_SIZE)
    parser.add_argument("--threshold", type=int, default=DEFAULT_THRESHOLD)
    parser.add_argument("--blocks", type=int, default=DEFAULT_BLOCKS)
    parser.add_argument("--number", type=int, default=DEFAULT_NUMBER)
    parser.add_argument(
        "--no-timing",
        action="store_true",
        help="omit elapsed timing while retaining deterministic models",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="print the complete JSON evidence packet",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="run the adversarial unittest suite",
    )
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    arguments = _parser().parse_args(argv)
    if arguments.self_test:
        suite = unittest.defaultTestLoader.loadTestsFromTestCase(
            Module17ReferenceTests
        )
        result = unittest.TextTestRunner(verbosity=2).run(suite)
        return 0 if result.wasSuccessful() else 1

    report = build_report(
        size=arguments.size,
        threshold=arguments.threshold,
        blocks=arguments.blocks,
        number=arguments.number,
        include_timing=not arguments.no_timing,
    )
    if arguments.json:
        print(json.dumps(report, indent=2, sort_keys=True, allow_nan=False))
    else:
        print(render_human(report))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
