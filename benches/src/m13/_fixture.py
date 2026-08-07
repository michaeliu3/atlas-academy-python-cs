"""Shared fixture for the m13 bench pack.

Two things live here.

The **reference model** at ``public/downloads/module13_reference.py`` is imported
and probed by bench 4; it is never reimplemented.

The **subject under test** is this module's own: a small ranking function with a
happy-path suite, plus a bounded mutation engine built on ``ast``. Mutation
testing needs something to mutate, and mutating the reference model would be
mutating the course's published artifact. So bench 2 mutates the code below,
which exists to be broken.

Coverage is measured with ``sys.settrace`` rather than the ``coverage`` package —
the bench dependency allowlist is numpy, matplotlib, and sympy only, and line
coverage of one function is a dozen lines of stdlib.
"""

from __future__ import annotations

import ast
import sys
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        _BENCHES_ROOT = _candidate
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

sys.path.insert(0, str(_BENCHES_ROOT.parent / "public" / "downloads"))


# --------------------------------------------------------------------------
# The subject under test. Deliberately small, deliberately fragile.
# --------------------------------------------------------------------------

SUBJECT = '''
THRESHOLD = 0.5


def rank_rows(rows):
    """Return (line, score) pairs for accepted rows, best score first."""
    accepted = []
    for row in rows:
        score = row["score"]
        if score > THRESHOLD and row["line"] > 0:
            accepted.append((row["line"], score))
    accepted.sort(key=lambda pair: (-pair[1], pair[0]))
    return accepted
'''


def load_subject(source: str = SUBJECT) -> dict:
    """Execute one version of the subject and hand back its namespace."""

    namespace: dict = {}
    exec(compile(source, "<subject>", "exec"), namespace)  # noqa: S102
    return namespace


# --------------------------------------------------------------------------
# A bounded mutation engine: one mutation per mutant, applied in source order.
# --------------------------------------------------------------------------

_COMPARISON_SWAPS = {
    ast.Gt: (ast.GtE, "> becomes >="),
    ast.GtE: (ast.Gt, ">= becomes >"),
    ast.Lt: (ast.LtE, "< becomes <="),
    ast.LtE: (ast.Lt, "<= becomes <"),
    ast.Eq: (ast.NotEq, "== becomes !="),
    ast.NotEq: (ast.Eq, "!= becomes =="),
}

_OPERATOR_SWAPS = {
    ast.Add: (ast.Sub, "+ becomes -"),
    ast.Sub: (ast.Add, "- becomes +"),
    ast.USub: (ast.UAdd, "negation removed"),
}

_BOOLEAN_SWAPS = {
    ast.And: (ast.Or, "and becomes or"),
    ast.Or: (ast.And, "or becomes and"),
}


class _ApplyOne(ast.NodeTransformer):
    def __init__(self, target: int) -> None:
        self.target = target
        self.seen = -1

    def _hit(self) -> bool:
        self.seen += 1
        return self.seen == self.target

    def visit_Compare(self, node):  # noqa: N802
        self.generic_visit(node)
        for index, operator in enumerate(node.ops):
            if type(operator) in _COMPARISON_SWAPS and self._hit():
                node.ops[index] = _COMPARISON_SWAPS[type(operator)][0]()
        return node

    def visit_BinOp(self, node):  # noqa: N802
        self.generic_visit(node)
        if type(node.op) in _OPERATOR_SWAPS and self._hit():
            node.op = _OPERATOR_SWAPS[type(node.op)][0]()
        return node

    def visit_UnaryOp(self, node):  # noqa: N802
        self.generic_visit(node)
        if type(node.op) in _OPERATOR_SWAPS and self._hit():
            node.op = _OPERATOR_SWAPS[type(node.op)][0]()
        return node

    def visit_BoolOp(self, node):  # noqa: N802
        self.generic_visit(node)
        if self._hit():
            node.op = _BOOLEAN_SWAPS[type(node.op)][0]()
        return node

    def visit_Constant(self, node):  # noqa: N802
        if isinstance(node.value, int) and not isinstance(node.value, bool) and self._hit():
            return ast.copy_location(ast.Constant(value=node.value + 1), node)
        return node


def _site_count(source: str) -> int:
    """How many mutation sites the transformer's own traversal finds.

    Counted with the transformer rather than a separate walk: an independent
    walk visits nodes in a different order, so its Nth site would not be the one
    the transformer mutates, and every label would be quietly wrong.
    """

    counter = _ApplyOne(-1)
    counter.visit(ast.parse(source))
    return counter.seen + 1


def mutants(source: str = SUBJECT) -> list[tuple[str, str]]:
    """Every single-mutation variant of the subject, as (description, source).

    The description is derived from the actual textual diff, so it cannot
    disagree with what was applied.
    """

    baseline = ast.unparse(ast.parse(source)).splitlines()
    produced = []
    for index in range(_site_count(source)):
        tree = _ApplyOne(index).visit(ast.parse(source))
        ast.fix_missing_locations(tree)
        mutated = ast.unparse(tree)
        changed = [(before, after)
                   for before, after in zip(baseline, mutated.splitlines())
                   if before != after]
        label = (f"{changed[0][0].strip()}   ->   {changed[0][1].strip()}"
                 if changed else "no textual change (equivalent mutant)")
        produced.append((label, mutated))
    return produced


# --------------------------------------------------------------------------
# Line coverage of the subject, without a third-party dependency.
# --------------------------------------------------------------------------

def executable_lines(source: str = SUBJECT) -> set[int]:
    """Lines inside ``rank_rows`` that a line-coverage tool would count.

    Module-level statements are excluded — they run at import, before any test —
    and so is the docstring, which CPython folds into the code object rather than
    executing. Counting either would inflate the denominator and make the
    coverage figure this bench reports look better than the tool it imitates.
    """

    tree = ast.parse(source)
    function = next(node for node in ast.walk(tree)
                    if isinstance(node, ast.FunctionDef) and node.name == "rank_rows")
    lines = set()
    for node in ast.walk(function):
        if not isinstance(node, ast.stmt) or isinstance(node, ast.FunctionDef):
            continue
        if isinstance(node, ast.Expr) and isinstance(node.value, ast.Constant) \
                and isinstance(node.value.value, str):
            continue  # the docstring
        lines.add(node.lineno)
    return lines


def covered_lines(run, source: str = SUBJECT) -> set[int]:
    """Run ``run(namespace)`` and return which subject lines executed."""

    namespace = load_subject(source)
    hit: set[int] = set()

    def local_trace(frame, event, arg):
        if event == "line":
            hit.add(frame.f_lineno)
        return local_trace

    def global_trace(frame, event, arg):
        if frame.f_code.co_filename == "<subject>":
            return local_trace
        return None

    previous = sys.gettrace()
    sys.settrace(global_trace)
    try:
        run(namespace)
    finally:
        sys.settrace(previous)
    return hit
