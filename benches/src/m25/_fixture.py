"""Shared fixture for the m25 bench pack.

The m25 benches import and probe `public/downloads/module25_reference.py`.
Nothing here trains a model: the reference's evaluation card is arithmetic over
declared scores, and the split functions are arithmetic over declared days. That
is the right instrument for the question — whether an evaluation is *entitled*
to its number is decided before any model exists.
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

SPLIT_DAY = 5
