"""Shared fixture for the m19 bench pack.

Every m19 bench imports and probes `public/downloads/module19_reference.py`;
none reimplements it. The reference explores a **declared** three-step model of
one shared update — R, C, W — and the module's own text is explicit that those
are application-level transitions, not bytecodes. Every count in this pack
belongs to that model.
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
