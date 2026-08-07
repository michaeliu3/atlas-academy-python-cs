"""Shared fixture for the m22 bench pack.

Both m22 benches import and probe `public/downloads/module22_reference.py`.

Nothing in this pack extracts an archive, opens a connection, runs a shell, or
contacts anything. That is not a limitation worked around — it is the reference
model's design: its archive inspector reports `adapter_called=False`, and its
query planner reports `connection_opened=False`. The decisions being tested are
decisions about *metadata and structure*, which is exactly where they belong.
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
