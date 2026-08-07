"""Shared fixture for the m34 bench pack.

Module 34 is authoring-only, so this pack's visibility is
`private-guided-study`. It has no checked-in reference model.

Every search and every constraint here is small enough to solve exhaustively,
which is what lets a bench say "this propagator is sound and incomplete" as a
counted fact rather than a remembered one.
"""

from __future__ import annotations

import sys
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")
