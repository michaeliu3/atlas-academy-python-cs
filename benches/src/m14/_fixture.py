"""Shared fixture for the m14 bench pack.

Module 14 has no checked-in reference model, so both benches carry their own
subject. Neither performs real I/O: a retry boundary and a bisect predicate are
both decisions about *structure*, and structure is checkable without a network
or a repository.
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
