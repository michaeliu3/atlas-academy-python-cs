"""Shared fixture for the m17 bench pack.

Every m17 bench imports and probes `public/downloads/module17_reference.py`;
none reimplements it. The reference is a *declared* machine and a *declared*
cache geometry — its counts belong to the model, not to the host CPU, and the
benches are careful to say so.
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

# A working set that does not fit in the declared cache, so access order matters.
ITEM_COUNT = 64
GEOMETRY = {"item_bytes": 4, "line_bytes": 16, "cache_slots": 4}
