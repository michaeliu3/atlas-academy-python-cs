"""Finite, deterministic reasoning aids for Atlas Module 27.

This is a code-reading model, not a theorem prover or a production graph
library.  Its purpose is to make a few discrete-mathematics claims executable
on intentionally small, declared fixtures:

* classify a finite binary relation over a declared domain;
* trace reachability and either a deterministic topological order or one cycle;
* distinguish a valid, maximal matching from a maximum matching; and
* check the base terms of a recurrence and the coprime precondition of a
  modular inverse.

The functions reject ambiguous domains and invalid model inputs rather than
silently guessing.  A returned result is evidence about the supplied finite
fixture only.  It does not substitute for a general proof, a theorem's full
assumptions, an efficient production algorithm, or a security claim.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import gcd
from typing import Iterable, TypeAlias


Node: TypeAlias = str
Pair: TypeAlias = tuple[Node, Node]

MODEL_VERSION = "atlas-module27-reference/1"
MAX_MATCHING_EDGES = 12
FINITE_MODEL_LIMITATION = (
    "Finite teaching model only. A trace on these declared values does not prove "
    "a universal claim, establish a theorem's unstated assumptions, measure "
    "runtime on real workloads, or establish production correctness or security."
)
MATCHING_LIMITATION = (
    "The maximum comparison is exhaustive only for this deliberately small graph "
    f"(at most {MAX_MATCHING_EDGES} edges). It demonstrates the distinction between "
    "maximal and maximum; it is not a scalable matching implementation or proof of "
    "a general algorithm."
)


class ModelContractError(ValueError):
    """Raised when a finite teaching fixture is underspecified or out of scope."""


@dataclass(frozen=True)
class RelationReport:
    """Classification evidence for one finite relation on one declared domain.

    A `transitivity_counterexample` `(x, y, z)` means `x R y` and `y R z` are
    present but `x R z` is absent.  A `symmetry_counterexample` `(x, y)` means
    `x R y` is present but `y R x` is absent.
    """

    nodes: tuple[Node, ...]
    pairs: tuple[Pair, ...]
    reflexive: bool
    irreflexive: bool
    symmetric: bool
    antisymmetric: bool
    transitive: bool
    is_equivalence_relation: bool
    is_partial_order: bool
    missing_reflexive_pairs: tuple[Pair, ...]
    symmetry_counterexample: Pair | None
    transitivity_counterexample: tuple[Node, Node, Node] | None
    missing_transitive_pairs: tuple[Pair, ...]
    limitation: str = FINITE_MODEL_LIMITATION


@dataclass(frozen=True)
class TopologyResult:
    """One finite graph's DAG evidence or one deterministic closed cycle witness.

    When `is_dag` is false, `order` is the valid Kahn prefix already removed and
    `cycle` repeats its starting node at the end.  The result does not claim that
    a partial order exists for the graph.
    """

    is_dag: bool
    order: tuple[Node, ...]
    cycle: tuple[Node, ...]
    limitation: str = FINITE_MODEL_LIMITATION


@dataclass(frozen=True)
class MatchingReport:
    """Validation and small-fixture optimality evidence for a bipartite matching.

    `is_maximal` answers whether one more available edge can be added without
    reusing an endpoint. `is_maximum` compares cardinality against an exhaustive
    search of the declared small edge set. They are deliberately different
    questions. The latter two fields are `None` if the proposed edges are not a
    matching at all.
    """

    is_matching: bool
    chosen_size: int | None
    is_maximal: bool | None
    is_maximum: bool | None
    maximum_size: int | None
    maximum_matching: tuple[Pair, ...]
    reason: str
    limitation: str = MATCHING_LIMITATION


def _as_tuple(values: Iterable[object], label: str) -> tuple[object, ...]:
    """Materialize one finite fixture while rejecting a single string by accident."""

    if isinstance(values, (str, bytes)):
        raise ModelContractError(f"{label} must be a finite iterable of labels, not one string")
    try:
        return tuple(values)
    except TypeError as error:
        raise ModelContractError(f"{label} must be a finite iterable") from error


def _normalise_nodes(nodes: Iterable[Node], label: str = "nodes") -> tuple[Node, ...]:
    """Validate ordered, distinct string labels; their order is the tie-break rule."""

    raw_nodes = _as_tuple(nodes, label)
    if any(not isinstance(node, str) or not node for node in raw_nodes):
        raise ModelContractError(f"{label} must contain non-empty string labels")
    result = tuple(raw_nodes)
    if len(set(result)) != len(result):
        raise ModelContractError(f"{label} must be unique")
    return result  # type: ignore[return-value]


def _coerce_pair(value: object, label: str) -> Pair:
    """Read one ordered pair without treating a label string as two endpoints."""

    if isinstance(value, (str, bytes)):
        raise ModelContractError(f"{label} must be a two-label pair")
    try:
        first, second = value  # type: ignore[misc]
    except (TypeError, ValueError) as error:
        raise ModelContractError(f"{label} must be a two-label pair") from error
    if not isinstance(first, str) or not isinstance(second, str) or not first or not second:
        raise ModelContractError(f"{label} must contain two non-empty string labels")
    return first, second


def _normalise_relation_pairs(
    nodes: tuple[Node, ...],
    pairs: Iterable[Pair],
    *,
    label: str,
) -> tuple[Pair, ...]:
    """Validate set-like relation edges and return them in declared-node order."""

    domain = set(nodes)
    rank = {node: index for index, node in enumerate(nodes)}
    raw_pairs = _as_tuple(pairs, label)
    normalized: list[Pair] = []
    seen: set[Pair] = set()
    for raw_pair in raw_pairs:
        pair = _coerce_pair(raw_pair, label)
        if pair[0] not in domain or pair[1] not in domain:
            raise ModelContractError(f"{label} must stay inside the declared domain")
        if pair in seen:
            raise ModelContractError(f"{label} must be unique because a relation is set-like")
        seen.add(pair)
        normalized.append(pair)
    return tuple(sorted(normalized, key=lambda pair: (rank[pair[0]], rank[pair[1]])))


def classify_relation(nodes: Iterable[Node], pairs: Iterable[Pair]) -> RelationReport:
    """Classify a finite binary relation with explicit missing-property witnesses.

    The declared order of `nodes` only makes returned witnesses deterministic; it
    does not change the mathematical relation.  The empty relation on an empty
    domain is classified using the usual vacuous definitions.
    """

    node_tuple = _normalise_nodes(nodes)
    pair_tuple = _normalise_relation_pairs(node_tuple, pairs, label="relation pairs")
    pair_set = frozenset(pair_tuple)

    missing_reflexive = tuple((node, node) for node in node_tuple if (node, node) not in pair_set)
    symmetry_counterexample = next(
        (pair for pair in pair_tuple if (pair[1], pair[0]) not in pair_set),
        None,
    )

    missing_transitive: list[Pair] = []
    missing_transitive_set: set[Pair] = set()
    transitivity_counterexample: tuple[Node, Node, Node] | None = None
    for start in node_tuple:
        for middle in node_tuple:
            if (start, middle) not in pair_set:
                continue
            for end in node_tuple:
                if (middle, end) in pair_set and (start, end) not in pair_set:
                    if transitivity_counterexample is None:
                        transitivity_counterexample = (start, middle, end)
                    missing_pair = (start, end)
                    if missing_pair not in missing_transitive_set:
                        missing_transitive_set.add(missing_pair)
                        missing_transitive.append(missing_pair)

    reflexive = not missing_reflexive
    irreflexive = not any((node, node) in pair_set for node in node_tuple)
    symmetric = symmetry_counterexample is None
    antisymmetric = all(
        start == end or (end, start) not in pair_set for start, end in pair_tuple
    )
    transitive = transitivity_counterexample is None
    return RelationReport(
        nodes=node_tuple,
        pairs=pair_tuple,
        reflexive=reflexive,
        irreflexive=irreflexive,
        symmetric=symmetric,
        antisymmetric=antisymmetric,
        transitive=transitive,
        is_equivalence_relation=reflexive and symmetric and transitive,
        is_partial_order=reflexive and antisymmetric and transitive,
        missing_reflexive_pairs=missing_reflexive,
        symmetry_counterexample=symmetry_counterexample,
        transitivity_counterexample=transitivity_counterexample,
        missing_transitive_pairs=tuple(missing_transitive),
    )


def transitive_closure(nodes: Iterable[Node], edges: Iterable[Pair]) -> tuple[Pair, ...]:
    """Return reachability by paths of length at least one in a finite digraph.

    This is a transitive closure, not a reflexive-transitive closure: `(x, x)` is
    included only if an edge or a non-empty cycle makes `x` reachable from itself.
    """

    node_tuple = _normalise_nodes(nodes)
    edge_tuple = _normalise_relation_pairs(node_tuple, edges, label="directed edges")
    rank = {node: index for index, node in enumerate(node_tuple)}
    reachable = set(edge_tuple)

    # Warshall's induction step: after each `middle`, paths through all earlier
    # declared middle nodes have been added. The loop is intentionally visible.
    for middle in node_tuple:
        for start in node_tuple:
            if (start, middle) not in reachable:
                continue
            for end in node_tuple:
                if (middle, end) in reachable:
                    reachable.add((start, end))

    return tuple(sorted(reachable, key=lambda pair: (rank[pair[0]], rank[pair[1]])))


def _cycle_witness(
    nodes: tuple[Node, ...],
    adjacency: dict[Node, tuple[Node, ...]],
    residual: set[Node],
) -> tuple[Node, ...]:
    """Find one cycle in deterministic declared-node and declared-edge order."""

    color: dict[Node, str] = {}
    stack: list[Node] = []

    def visit(node: Node) -> tuple[Node, ...] | None:
        color[node] = "active"
        stack.append(node)
        for neighbor in adjacency[node]:
            if neighbor not in residual:
                continue
            if color.get(neighbor) == "active":
                start_index = stack.index(neighbor)
                return tuple(stack[start_index:] + [neighbor])
            if color.get(neighbor) is None:
                found = visit(neighbor)
                if found is not None:
                    return found
        stack.pop()
        color[node] = "finished"
        return None

    for node in nodes:
        if node in residual and color.get(node) is None:
            found = visit(node)
            if found is not None:
                return found
    raise RuntimeError("Kahn residual should contain a directed cycle")


def topological_order_or_cycle(nodes: Iterable[Node], edges: Iterable[Pair]) -> TopologyResult:
    """Use Kahn's algorithm, returning an order or a concrete directed cycle.

    If multiple zero-indegree nodes are ready, the function chooses the earliest
    declared node. This makes a trace reproducible, not mathematically preferred.
    """

    node_tuple = _normalise_nodes(nodes)
    edge_tuple = _normalise_relation_pairs(node_tuple, edges, label="directed edges")
    rank = {node: index for index, node in enumerate(node_tuple)}
    adjacency_lists: dict[Node, list[Node]] = {node: [] for node in node_tuple}
    indegree: dict[Node, int] = {node: 0 for node in node_tuple}
    for start, end in edge_tuple:
        adjacency_lists[start].append(end)
        indegree[end] += 1
    adjacency = {node: tuple(neighbors) for node, neighbors in adjacency_lists.items()}

    ready = [node for node in node_tuple if indegree[node] == 0]
    order: list[Node] = []
    while ready:
        ready.sort(key=rank.__getitem__)
        current = ready.pop(0)
        order.append(current)
        for neighbor in adjacency[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                ready.append(neighbor)

    if len(order) == len(node_tuple):
        return TopologyResult(is_dag=True, order=tuple(order), cycle=())
    residual = {node for node in node_tuple if indegree[node] > 0}
    return TopologyResult(
        is_dag=False,
        order=tuple(order),
        cycle=_cycle_witness(node_tuple, adjacency, residual),
    )


def _normalise_bipartite_edges(
    left: tuple[Node, ...],
    right: tuple[Node, ...],
    edges: Iterable[Pair],
) -> tuple[Pair, ...]:
    """Validate available left-to-right edges and retain the declared tie order."""

    left_set = set(left)
    right_set = set(right)
    left_rank = {node: index for index, node in enumerate(left)}
    right_rank = {node: index for index, node in enumerate(right)}
    raw_edges = _as_tuple(edges, "available bipartite edges")
    normalized: list[Pair] = []
    seen: set[Pair] = set()
    for raw_edge in raw_edges:
        edge = _coerce_pair(raw_edge, "available bipartite edges")
        if edge[0] not in left_set or edge[1] not in right_set:
            raise ModelContractError(
                "available bipartite edges must run from the declared left partition "
                "to the declared right partition"
            )
        if edge in seen:
            raise ModelContractError("available bipartite edges must be unique")
        seen.add(edge)
        normalized.append(edge)
    return tuple(sorted(normalized, key=lambda edge: (left_rank[edge[0]], right_rank[edge[1]])))


def _matching_failure(reason: str) -> MatchingReport:
    """Keep an invalid learner proposal inspectable instead of raising away its clue."""

    return MatchingReport(
        is_matching=False,
        chosen_size=None,
        is_maximal=None,
        is_maximum=None,
        maximum_size=None,
        maximum_matching=(),
        reason=reason,
    )


def _exhaustive_maximum_matching(edges: tuple[Pair, ...]) -> tuple[Pair, ...]:
    """Enumerate all valid subsets for a tiny fixture; exponential by design."""

    best: tuple[Pair, ...] = ()

    def search(
        index: int,
        chosen: tuple[Pair, ...],
        used_left: frozenset[Node],
        used_right: frozenset[Node],
    ) -> None:
        nonlocal best
        if index == len(edges):
            if len(chosen) > len(best):
                best = chosen
            return

        edge = edges[index]
        if edge[0] not in used_left and edge[1] not in used_right:
            search(
                index + 1,
                chosen + (edge,),
                used_left | {edge[0]},
                used_right | {edge[1]},
            )
        search(index + 1, chosen, used_left, used_right)

    search(0, (), frozenset(), frozenset())
    return best


def analyze_bipartite_matching(
    left_nodes: Iterable[Node],
    right_nodes: Iterable[Node],
    available_edges: Iterable[Pair],
    proposed_edges: Iterable[Pair],
) -> MatchingReport:
    """Validate a proposed matching and compare it with a small exhaustive witness.

    The left and right partitions must be disjoint. `available_edges` is the
    mathematical input graph, so malformed entries are a contract error. In
    contrast, `proposed_edges` is a learner claim to inspect: unavailable or
    endpoint-reusing edges produce an explanatory invalid report.
    """

    left = _normalise_nodes(left_nodes, "left partition")
    right = _normalise_nodes(right_nodes, "right partition")
    if set(left) & set(right):
        raise ModelContractError("left and right partitions must be disjoint")
    edges = _normalise_bipartite_edges(left, right, available_edges)
    if len(edges) > MAX_MATCHING_EDGES:
        raise ModelContractError(
            f"exhaustive teaching check supports at most {MAX_MATCHING_EDGES} edges"
        )

    raw_proposed = _as_tuple(proposed_edges, "proposed matching edges")
    selected: list[Pair] = []
    seen_selected: set[Pair] = set()
    available_set = set(edges)
    used_left: set[Node] = set()
    used_right: set[Node] = set()
    for raw_edge in raw_proposed:
        edge = _coerce_pair(raw_edge, "proposed matching edges")
        if edge not in available_set:
            return _matching_failure(f"selected edge {edge!r} is not an available bipartite edge")
        if edge in seen_selected:
            return _matching_failure(f"selected edge {edge!r} is repeated")
        if edge[0] in used_left:
            return _matching_failure(f"selected edge {edge!r} reuses left endpoint {edge[0]!r}")
        if edge[1] in used_right:
            return _matching_failure(f"selected edge {edge!r} reuses right endpoint {edge[1]!r}")
        seen_selected.add(edge)
        selected.append(edge)
        used_left.add(edge[0])
        used_right.add(edge[1])

    maximum_matching = _exhaustive_maximum_matching(edges)
    is_maximal = not any(
        left_node not in used_left and right_node not in used_right
        for left_node, right_node in edges
    )
    is_maximum = len(selected) == len(maximum_matching)
    if is_maximum:
        reason = "valid matching with the same cardinality as the finite exhaustive witness"
    elif is_maximal:
        reason = "valid maximal matching, but the finite exhaustive witness has more edges"
    else:
        reason = "valid matching, but at least one available edge can still be added"
    return MatchingReport(
        is_matching=True,
        chosen_size=len(selected),
        is_maximal=is_maximal,
        is_maximum=is_maximum,
        maximum_size=len(maximum_matching),
        maximum_matching=maximum_matching,
        reason=reason,
    )


def _require_integer(value: object, label: str) -> int:
    """Reject booleans too: `True` is an `int` in Python but not an intended count."""

    if isinstance(value, bool) or not isinstance(value, int):
        raise ModelContractError(f"{label} must be an integer")
    return value


def binomial_coefficient(n: int, k: int) -> int:
    """Compute ``n choose k`` from Pascal's recurrence on a finite row.

    The model keeps the base row visible rather than treating a library call as
    an explanation of why the count has its value.
    """

    n = _require_integer(n, "n")
    k = _require_integer(k, "k")
    if n < 0 or k < 0 or k > n:
        raise ModelContractError("binomial coefficient requires 0 <= k <= n")

    row = [1]
    for upper in range(1, n + 1):
        next_row = [1]
        for index in range(1, upper):
            next_row.append(row[index - 1] + row[index])
        next_row.append(1)
        row = next_row
    return row[k]


def linear_recurrence_terms(
    initial_terms: Iterable[int],
    coefficients: Iterable[int],
    term_count: int,
) -> tuple[int, ...]:
    """Generate a finite linear-recurrence trace with its base terms explicit.

    For coefficients ``(c1, ..., cd)``, the next value is
    ``c1 * a[n-1] + ... + cd * a[n-d]``. `term_count` includes the supplied
    initial terms, so asking for fewer than the recurrence order is rejected.
    """

    raw_initial = _as_tuple(initial_terms, "initial terms")
    raw_coefficients = _as_tuple(coefficients, "coefficients")
    initial = tuple(_require_integer(value, "initial term") for value in raw_initial)
    factors = tuple(_require_integer(value, "coefficient") for value in raw_coefficients)
    if not initial or len(initial) != len(factors):
        raise ModelContractError(
            "initial terms and coefficients must have the same positive length"
        )
    term_count = _require_integer(term_count, "term_count")
    if term_count < len(initial):
        raise ModelContractError("term_count must be at least the order of the recurrence")

    terms = list(initial)
    while len(terms) < term_count:
        next_value = sum(
            factor * terms[-offset]
            for offset, factor in enumerate(factors, start=1)
        )
        terms.append(next_value)
    return tuple(terms)


def _extended_gcd_nonnegative(a: int, b: int) -> tuple[int, int, int]:
    """Return ``g, x, y`` with non-negative ``a, b`` and ``a*x + b*y == g``."""

    old_remainder, remainder = a, b
    old_x, x = 1, 0
    old_y, y = 0, 1
    while remainder:
        quotient = old_remainder // remainder
        old_remainder, remainder = remainder, old_remainder - quotient * remainder
        old_x, x = x, old_x - quotient * x
        old_y, y = y, old_y - quotient * y
    return old_remainder, old_x, old_y


def modular_inverse(value: int, modulus: int) -> int:
    """Return the canonical inverse in ``range(modulus)`` when the gcd is one.

    Bézout's identity supplies a coefficient of `value` only when
    ``gcd(value, modulus) == 1``. The function exposes that precondition instead
    of returning a plausible-looking number for a non-invertible residue.
    """

    value = _require_integer(value, "value")
    modulus = _require_integer(modulus, "modulus")
    if modulus <= 1:
        raise ModelContractError("modulus must be greater than one")
    residue = value % modulus
    divisor = gcd(residue, modulus)
    if divisor != 1:
        raise ModelContractError(
            "modular inverse exists only when value and modulus are coprime "
            f"(gcd is {divisor})"
        )
    computed_gcd, coefficient, _ = _extended_gcd_nonnegative(residue, modulus)
    if computed_gcd != 1:  # Defensive boundary: the public gcd condition is the authority.
        raise RuntimeError("extended Euclid disagreed with the declared gcd precondition")
    return coefficient % modulus
