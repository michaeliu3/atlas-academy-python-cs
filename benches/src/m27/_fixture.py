"""Shared fixture for the m27 bench pack.

Puts `atlas_bench` and the checked-in reference model on the path once, so each
bench states its experiment rather than its plumbing. Every m27 bench imports
and probes `public/downloads/module27_reference.py`; none reimplements it.
"""

from __future__ import annotations

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
# The canonical maximal-but-not-maximum witness, from workbook section 4.
#
# A three-edge path. Greedy that commits to the middle edge first blocks both
# endpoints and finishes with one edge, having made no mistake it could detect
# locally: no further edge can be added, so its result IS maximal.
# --------------------------------------------------------------------------

PATH_LEFT = ("x1", "x2")
PATH_RIGHT = ("y1", "y2")
PATH_EDGES = (("x1", "y1"), ("x2", "y1"), ("x2", "y2"))

GREEDY_UNLUCKY = (("x2", "y1"),)
GREEDY_LUCKY = (("x1", "y1"), ("x2", "y2"))


def greedy_matching(edges, order=None):
    """First-fit greedy: take each edge whose endpoints are both still free.

    `order` lets you exhibit that greedy's result depends on edge order, which
    is the whole reason its output is maximal rather than maximum.
    """
    chosen, used = [], set()
    for edge in order or edges:
        left, right = edge
        if left in used or right in used:
            continue
        chosen.append(edge)
        used.update(edge)
    return tuple(chosen)
