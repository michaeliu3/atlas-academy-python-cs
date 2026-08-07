"""Shared fixture for the m15 bench pack.

Module 15 has no checked-in reference model, so both benches carry their own
subject. Neither writes to a real filesystem or contacts anything: the boundaries
under examination — text against bytes, a declared schema version against a
migration — are decided before any I/O happens, which is what makes them
checkable here.
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
