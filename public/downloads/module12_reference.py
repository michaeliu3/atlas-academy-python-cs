"""Module 12: a finite model for reading dependency direction.

This model makes a declared architecture graph inspectable.  It does not parse
Python imports, execute plugins, validate a type checker result, or prove that
the declared graph is the whole running system.  Its narrow teaching purpose is
to distinguish a stable port dependency from a concrete-adapter dependency and
to show that the composition root owns concrete selection.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
import re
from typing import TypeVar


NAME_PATTERN = re.compile(r"[a-z][a-z0-9-]*\Z")
COMPONENT_ROLES = frozenset(
    {
        "domain-policy",
        "application-policy",
        "port",
        "adapter",
        "composition-root",
    }
)
ALLOWED_TARGET_ROLES: dict[str, frozenset[str]] = {
    "domain-policy": frozenset({"domain-policy"}),
    "application-policy": frozenset({"domain-policy", "port"}),
    "port": frozenset({"domain-policy"}),
    "adapter": frozenset({"domain-policy", "port"}),
    "composition-root": COMPONENT_ROLES,
}
MAX_COMPONENTS = 128
MAX_DEPENDENCIES = 512
MAX_CONCRETE_SELECTIONS = 128

_T = TypeVar("_T")


class ModelContractError(ValueError):
    """Raised when a finite teaching-model input is ambiguous or malformed."""


def _collect_bounded(
    items: Iterable[_T],
    *,
    label: str,
    limit: int,
) -> tuple[_T, ...]:
    """Materialize no more than one small, explicit teaching-model collection."""

    collected: list[_T] = []
    for item in items:
        if len(collected) >= limit:
            raise ModelContractError(f"{label} must contain at most {limit} items")
        collected.append(item)
    return tuple(collected)


def _require_name(label: str, value: object) -> str:
    if not isinstance(value, str) or NAME_PATTERN.fullmatch(value) is None:
        raise ModelContractError(
            f"{label} must be lowercase kebab-case text beginning with a letter"
        )
    return value


@dataclass(frozen=True, slots=True)
class Component:
    """A declared architectural role, not a discovered Python module."""

    name: str
    role: str

    def __post_init__(self) -> None:
        _require_name("component name", self.name)
        if self.role not in COMPONENT_ROLES:
            allowed = ", ".join(sorted(COMPONENT_ROLES))
            raise ModelContractError(f"component role must be one of: {allowed}")


@dataclass(frozen=True, slots=True)
class Dependency:
    """One directed knowledge edge: consumer ``source`` depends on ``target``."""

    source: str
    target: str

    def __post_init__(self) -> None:
        _require_name("dependency source", self.source)
        _require_name("dependency target", self.target)
        if self.source == self.target:
            raise ModelContractError("a dependency cannot point from a component to itself")


@dataclass(frozen=True, slots=True)
class ConcreteSelection:
    """A declared choice of one adapter implementation by an owning component."""

    owner: str
    implementation: str

    def __post_init__(self) -> None:
        _require_name("selection owner", self.owner)
        _require_name("selection implementation", self.implementation)


@dataclass(frozen=True, slots=True)
class ArchitectureViolation:
    """A graph or selection fact that violates this model's stated policy."""

    kind: str
    source: str
    target: str
    explanation: str


@dataclass(frozen=True, slots=True)
class ArchitectureReport:
    """A deterministic observation of declared architecture facts.

    ``preserves_dependency_direction`` is only a result for the supplied finite
    declarations.  It does not establish runtime import behavior, trust,
    substitutability, or production correctness.
    """

    allowed_dependencies: tuple[tuple[str, str], ...]
    concrete_selections: tuple[tuple[str, str], ...]
    violations: tuple[ArchitectureViolation, ...]
    preserves_dependency_direction: bool
    scope: str


def _components_by_name(components: Iterable[Component]) -> dict[str, Component]:
    result: dict[str, Component] = {}
    for component in _collect_bounded(
        components,
        label="components",
        limit=MAX_COMPONENTS,
    ):
        if not isinstance(component, Component):
            raise TypeError("components must contain Component instances")
        if component.name in result:
            raise ModelContractError("component names must be unique")
        result[component.name] = component
    if not result:
        raise ModelContractError("at least one declared component is required")
    return result


def _checked_dependencies(
    dependencies: Iterable[Dependency],
    components: dict[str, Component],
) -> tuple[Dependency, ...]:
    checked = _collect_bounded(
        dependencies,
        label="dependencies",
        limit=MAX_DEPENDENCIES,
    )
    seen: set[tuple[str, str]] = set()
    for dependency in checked:
        if not isinstance(dependency, Dependency):
            raise TypeError("dependencies must contain Dependency instances")
        edge = (dependency.source, dependency.target)
        if edge in seen:
            raise ModelContractError("dependency edges must be unique")
        seen.add(edge)
        if dependency.source not in components or dependency.target not in components:
            raise ModelContractError("each dependency must use a declared component")
    return checked


def _checked_selections(
    selections: Iterable[ConcreteSelection],
    components: dict[str, Component],
) -> tuple[ConcreteSelection, ...]:
    checked = _collect_bounded(
        selections,
        label="selections",
        limit=MAX_CONCRETE_SELECTIONS,
    )
    seen: set[tuple[str, str]] = set()
    for selection in checked:
        if not isinstance(selection, ConcreteSelection):
            raise TypeError("selections must contain ConcreteSelection instances")
        pair = (selection.owner, selection.implementation)
        if pair in seen:
            raise ModelContractError("concrete selections must be unique")
        seen.add(pair)
        if selection.owner not in components or selection.implementation not in components:
            raise ModelContractError("each selection must use a declared component")
        if components[selection.implementation].role != "adapter":
            raise ModelContractError("a concrete selection implementation must be an adapter")
    return checked


def inspect_architecture(
    components: Iterable[Component],
    dependencies: Iterable[Dependency],
    selections: Iterable[ConcreteSelection],
) -> ArchitectureReport:
    """Inspect a finite dependency graph under one explicit boundary policy.

    The policy permits application policy to depend on a port, permits an
    adapter to implement that port, and lets only a composition root select the
    concrete adapter.  The input is intentionally a declaration rather than a
    filesystem scan so each permitted or rejected edge remains visible.
    """

    by_name = _components_by_name(components)
    checked_dependencies = _checked_dependencies(dependencies, by_name)
    checked_selections = _checked_selections(selections, by_name)

    allowed_dependencies: list[tuple[str, str]] = []
    violations: list[ArchitectureViolation] = []
    for dependency in checked_dependencies:
        source = by_name[dependency.source]
        target = by_name[dependency.target]
        if target.role in ALLOWED_TARGET_ROLES[source.role]:
            allowed_dependencies.append((source.name, target.name))
            continue
        if target.role in {"adapter", "composition-root"}:
            kind = "forbidden-concrete-dependency"
            explanation = (
                f"{source.role} {source.name!r} learned the concrete outer "
                f"choice {target.name!r}; depend on a behavioral port instead."
            )
        else:
            kind = "forbidden-dependency-direction"
            explanation = (
                f"{source.role} {source.name!r} may not depend on "
                f"{target.role} {target.name!r} under the declared policy."
            )
        violations.append(
            ArchitectureViolation(kind, source.name, target.name, explanation)
        )

    for selection in checked_selections:
        owner = by_name[selection.owner]
        if owner.role == "composition-root":
            continue
        violations.append(
            ArchitectureViolation(
                "concrete-selection-outside-composition-root",
                selection.owner,
                selection.implementation,
                f"{owner.role} {selection.owner!r} chose a concrete adapter; "
                "the composition root must own that deployment choice.",
            )
        )

    ordered_violations = tuple(
        sorted(
            violations,
            key=lambda item: (item.source, item.target, item.kind),
        )
    )
    return ArchitectureReport(
        allowed_dependencies=tuple(sorted(allowed_dependencies)),
        concrete_selections=tuple(
            sorted((item.owner, item.implementation) for item in checked_selections)
        ),
        violations=ordered_violations,
        preserves_dependency_direction=not ordered_violations,
        scope=(
            "This report checks only the declared finite graph and selections; "
            "it does not prove runtime imports, plugin trust, behavioral "
            "substitutability, or production correctness."
        ),
    )
