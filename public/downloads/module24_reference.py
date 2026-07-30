"""Deterministic, local-only runtime-evidence teaching model for Module 24.

This models how to reason about roots, cycles, evidence scope, and controlled
experiments. It deliberately does not inspect a Python process, emulate
CPython, execute supplied code, or benchmark the host.
"""

from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from typing import Mapping, Sequence


MODEL_VERSION = "atlas-module24-reference/1"
PINNED_RUNTIME = "CPython 3.14.6"
LIMITATION = (
    "Deterministic teaching model only; not a CPython emulator, heap profiler, "
    "benchmark harness, memory-leak detector, production release gate, or "
    "authorization system."
)

SEMANTIC_CONTRACT = "SEMANTIC_CONTRACT"
CPYTHON_OBSERVATION = "CPYTHON_OBSERVATION"
MEASUREMENT = "MEASUREMENT"
OS_NATIVE_OBSERVATION = "OS_NATIVE_OBSERVATION"
HYPOTHESIS = "HYPOTHESIS"
MEASUREMENT_SCOPE_ERROR = "MEASUREMENT_SCOPE_ERROR"
CONFOUNDED_EXPERIMENT = "CONFOUNDED_EXPERIMENT"
INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"
DECISION_ACCEPT = "DECISION_ACCEPT"
DECISION_REJECT = "DECISION_REJECT"
DECISION_DEFER = "DECISION_DEFER"


@dataclass(frozen=True)
class ObjectGraph:
    """A fixed graph model: node -> directly referenced nodes, plus roots."""

    edges: Mapping[str, tuple[str, ...]]
    roots: frozenset[str]


@dataclass(frozen=True)
class SweepResult:
    """Result from a simplified local reference-count sweep."""

    remaining: tuple[str, ...]
    collected: tuple[str, ...]
    reference_counts: tuple[tuple[str, int], ...]
    limitation: str


@dataclass(frozen=True)
class Observation:
    """A labelled observation with a deliberately narrow allowed conclusion."""

    metric: str
    label: str
    establishes: str
    excludes: tuple[str, ...]
    runtime: str | None


@dataclass(frozen=True)
class ExperimentManifest:
    """Minimum fields for comparing fixed baseline/candidate teaching fixtures."""

    semantic_fingerprint: str
    workload_id: str
    runtime: str
    build: str
    gc_policy: str
    warmup_policy: str
    metric: str
    sample_count: int
    host_class: str
    privacy_review: str


@dataclass(frozen=True)
class ExperimentReview:
    """A bounded comparison outcome; no timing value is interpreted here."""

    outcome: str
    reason: str
    missing_or_changed: tuple[str, ...]


@dataclass(frozen=True)
class Decision:
    """A decision makes both evidence and limitation visible."""

    outcome: str
    reason: str
    limitation: str
    next_falsifier: str


def _nodes(graph: ObjectGraph) -> tuple[str, ...]:
    """Return all declared nodes, including leaf references."""

    names = set(graph.edges)
    for targets in graph.edges.values():
        names.update(targets)
    return tuple(sorted(names))


def reachable_nodes(graph: ObjectGraph) -> tuple[str, ...]:
    """Follow only declared roots; this is a graph model, not a heap inspection."""

    seen: set[str] = set()
    pending = list(graph.roots)
    while pending:
        node = pending.pop()
        if node in seen:
            continue
        seen.add(node)
        pending.extend(graph.edges.get(node, ()))
    return tuple(sorted(seen))


def reference_count_sweep(graph: ObjectGraph) -> SweepResult:
    """Model acyclic reference-count release without claiming CPython exactness."""

    nodes = _nodes(graph)
    counts = {node: 0 for node in nodes}
    for root in graph.roots:
        if root in counts:
            counts[root] += 1
    for targets in graph.edges.values():
        for target in targets:
            counts[target] += 1

    collected: list[str] = []
    pending = sorted(node for node, count in counts.items() if count == 0)
    while pending:
        node = pending.pop(0)
        if node in collected:
            continue
        collected.append(node)
        for target in graph.edges.get(node, ()):
            counts[target] -= 1
            if counts[target] == 0:
                pending.append(target)
        pending.sort()

    remaining = tuple(sorted(node for node in nodes if node not in collected))
    return SweepResult(
        remaining=remaining,
        collected=tuple(collected),
        reference_counts=tuple(sorted(counts.items())),
        limitation=(
            "Simplified graph rule only; CPython collection timing, generations, "
            "finalizers, immortal objects, allocator behavior, and native "
            "resources are outside this model."
        ),
    )


def collect_unreachable_cycles(graph: ObjectGraph) -> tuple[str, ...]:
    """Return nodes outside roots after an explicit reachability phase."""

    reachable = set(reachable_nodes(graph))
    return tuple(node for node in _nodes(graph) if node not in reachable)


def classify_observation(metric: str, runtime: str | None = None) -> Observation:
    """Classify metric scope rather than pretending every number means memory."""

    if metric == "semantic_fixture":
        return Observation(
            metric=metric,
            label=SEMANTIC_CONTRACT,
            establishes="fixed baseline and candidate fixtures agree on declared behavior",
            excludes=("performance", "retained graph", "production correctness"),
            runtime=None,
        )
    if metric == "shallow_size":
        return Observation(
            metric=metric,
            label=CPYTHON_OBSERVATION,
            establishes="reported shallow size of one object on the named runtime",
            excludes=("retained graph", "RSS", "native allocation"),
            runtime=runtime,
        )
    if metric == "traced_peak":
        return Observation(
            metric=metric,
            label=MEASUREMENT,
            establishes="traced Python allocation peak under the declared manifest",
            excludes=("RSS", "all native allocation", "production SLO"),
            runtime=runtime,
        )
    if metric == "process_rss":
        return Observation(
            metric=metric,
            label=OS_NATIVE_OBSERVATION,
            establishes="host/process memory observation under the declared manifest",
            excludes=("Python object attribution", "portable value", "leak cause"),
            runtime=runtime,
        )
    if metric == "bytecode_card":
        return Observation(
            metric=metric,
            label=CPYTHON_OBSERVATION,
            establishes="version-pinned CPython bytecode/implementation observation",
            excludes=("Python language guarantee", "cross-VM behavior", "speedup"),
            runtime=runtime,
        )
    return Observation(
        metric=metric,
        label=HYPOTHESIS,
        establishes="a proposed question awaiting a named evidence method",
        excludes=("measurement result", "implementation guarantee"),
        runtime=runtime,
    )


def validate_experiment(
    baseline: ExperimentManifest,
    candidate: ExperimentManifest,
) -> ExperimentReview:
    """Reject comparisons whose changed fields answer different questions."""

    semantic_fields = ("semantic_fingerprint",)
    control_fields = (
        "workload_id",
        "runtime",
        "build",
        "gc_policy",
        "warmup_policy",
        "metric",
        "host_class",
        "privacy_review",
    )
    changed_semantics = tuple(
        field
        for field in semantic_fields
        if getattr(baseline, field) != getattr(candidate, field)
    )
    if changed_semantics:
        return ExperimentReview(
            outcome=CONFOUNDED_EXPERIMENT,
            reason="candidate changed declared semantic behavior",
            missing_or_changed=changed_semantics,
        )
    changed_controls = tuple(
        field
        for field in control_fields
        if getattr(baseline, field) != getattr(candidate, field)
    )
    if changed_controls:
        return ExperimentReview(
            outcome=CONFOUNDED_EXPERIMENT,
            reason="baseline and candidate do not share a controlled manifest",
            missing_or_changed=changed_controls,
        )
    if baseline.sample_count < 3 or candidate.sample_count < 3:
        return ExperimentReview(
            outcome=INSUFFICIENT_EVIDENCE,
            reason="sample count is too small for the fixed teaching threshold",
            missing_or_changed=("sample_count",),
        )
    if not baseline.runtime.startswith("CPython ") or not baseline.build:
        return ExperimentReview(
            outcome=INSUFFICIENT_EVIDENCE,
            reason="runtime or build metadata is missing",
            missing_or_changed=("runtime", "build"),
        )
    return ExperimentReview(
        outcome=MEASUREMENT,
        reason="manifests support a scoped comparison; inspect results separately",
        missing_or_changed=(),
    )


def validate_conclusion(
    observation: Observation,
    proposed_scope: str,
) -> Decision:
    """Refuse scope jumps before a learner turns an observation into a claim."""

    if proposed_scope in observation.excludes:
        return Decision(
            outcome=DECISION_REJECT,
            reason=f"{observation.metric} does not establish {proposed_scope}",
            limitation="the proposed conclusion crosses the metric's stated scope",
            next_falsifier="choose a metric whose scope directly covers the proposed claim",
        )
    if observation.label == CPYTHON_OBSERVATION and not observation.runtime:
        return Decision(
            outcome=DECISION_DEFER,
            reason="CPython observation lacks runtime/version metadata",
            limitation="implementation details require a named build and version",
            next_falsifier="record the producing runtime before interpreting the observation",
        )
    if observation.label == HYPOTHESIS:
        return Decision(
            outcome=DECISION_DEFER,
            reason="a hypothesis is not yet a measurement or implementation observation",
            limitation="no declared evidence method has been supplied",
            next_falsifier="write a controlled manifest or source-reading question",
        )
    return Decision(
        outcome=DECISION_ACCEPT,
        reason=f"{observation.metric} supports the proposed scoped conclusion",
        limitation="acceptance is limited to the label, runtime, and manifest on this packet",
        next_falsifier="change one declared control and repeat the scoped review",
    )


def _manifest(
    *,
    semantic_fingerprint: str = "atlas-weekly-summary/v1",
    workload_id: str = "redacted-week-40",
    runtime: str = PINNED_RUNTIME,
    build: str = "gil-enabled-release",
    gc_policy: str = "enabled",
    warmup_policy: str = "three-fixed-warmups",
    metric: str = "traced_peak",
    sample_count: int = 7,
    host_class: str = "course-fixture-host",
    privacy_review: str = "synthetic-redacted-fixture",
) -> ExperimentManifest:
    return ExperimentManifest(
        semantic_fingerprint=semantic_fingerprint,
        workload_id=workload_id,
        runtime=runtime,
        build=build,
        gc_policy=gc_policy,
        warmup_policy=warmup_policy,
        metric=metric,
        sample_count=sample_count,
        host_class=host_class,
        privacy_review=privacy_review,
    )


def run_scenario(name: str) -> dict[str, object]:
    """Run one fixed teaching scenario; no caller-provided program is accepted."""

    if name == "alias_rebind":
        graph = ObjectGraph(
            edges={"report": ("events",), "audit_view": ("events",), "events": ()},
            roots=frozenset({"audit_view"}),
        )
        return {
            "outcome": SEMANTIC_CONTRACT,
            "reachable": reachable_nodes(graph),
            "message": "removing one binding does not remove an object with another root",
        }
    if name == "cycle_collection":
        graph = ObjectGraph(
            edges={"A": ("B",), "B": ("A",)},
            roots=frozenset(),
        )
        sweep = reference_count_sweep(graph)
        return {
            "outcome": CPYTHON_OBSERVATION,
            "sweep_remaining": sweep.remaining,
            "cycle_candidates": collect_unreachable_cycles(graph),
            "message": "teaching graph distinguishes reference-count sweep from reachability",
        }
    if name == "shallow_scope":
        observation = classify_observation("shallow_size", PINNED_RUNTIME)
        return {
            "outcome": MEASUREMENT_SCOPE_ERROR,
            "observation": asdict(observation),
            "decision": asdict(validate_conclusion(observation, "RSS")),
        }
    if name == "traced_scope":
        observation = classify_observation("traced_peak", PINNED_RUNTIME)
        return {
            "outcome": MEASUREMENT,
            "observation": asdict(observation),
            "decision": asdict(validate_conclusion(observation, "traced allocation peak")),
        }
    if name == "reject_confound":
        review = validate_experiment(
            _manifest(),
            _manifest(workload_id="different-input-distribution", gc_policy="disabled"),
        )
        return {"outcome": review.outcome, "review": asdict(review)}
    if name == "accept_stream":
        review = validate_experiment(_manifest(), _manifest())
        return {
            "outcome": DECISION_ACCEPT if review.outcome == MEASUREMENT else DECISION_DEFER,
            "review": asdict(review),
            "limitation": "fixed manifests do not contain real timing or deployment evidence",
        }
    if name == "defer_missing_version":
        observation = classify_observation("bytecode_card", None)
        return {
            "outcome": DECISION_DEFER,
            "decision": asdict(validate_conclusion(observation, "implementation observation")),
        }
    raise ValueError(f"unknown fixed scenario: {name}")


SCENARIOS = (
    "alias_rebind",
    "cycle_collection",
    "shallow_scope",
    "traced_scope",
    "reject_confound",
    "accept_stream",
    "defer_missing_version",
)


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Run a fixed, local-only Module 24 runtime-evidence teaching scenario."
    )
    parser.add_argument("scenario", choices=SCENARIOS)
    args = parser.parse_args(argv)
    print(json.dumps(run_scenario(args.scenario), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
