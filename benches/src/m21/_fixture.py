"""Shared fixture for the m21 bench pack.

The m21 benches probe `public/downloads/module21_reference.py` and, where the
session is about `asyncio` itself, run the **real event loop in process**. That
is the reversal recorded in the bench plan: Module 21's subject is not a remote
system, it is `TaskGroup` and cancellation semantics, and those are genuinely
observable here with no socket, no clock, and no second machine.

Anything that would need a real peer stays out of this pack.
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
