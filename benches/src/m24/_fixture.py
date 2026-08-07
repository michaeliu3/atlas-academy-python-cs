"""Shared fixture for the m24 bench pack.

Both m24 benches import and probe `public/downloads/module24_reference.py`.

Bench 2 predates this file and bootstraps inline; it is left alone rather than
edited, since its registered session hash covers the workbook rather than the
source and a needless rewrite would only risk breaking a passing bench.
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
