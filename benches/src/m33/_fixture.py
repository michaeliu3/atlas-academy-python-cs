"""Shared fixture for the m33 bench pack.

Module 33 is authoring-only, so this pack's visibility is
`private-guided-study`. It has no checked-in reference model.

Nothing here asserts a formal result. The point of benching a formal-methods
module at all is that a *witness* can be constructed and checked mechanically:
a countermodel is not a claim, it is an object, and a bench can build one.
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
