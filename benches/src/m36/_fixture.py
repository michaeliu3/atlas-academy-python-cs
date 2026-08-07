"""Shared fixture for the m36 bench pack.

Module 36 is authoring-only, so this pack's visibility is
`private-guided-study`. It has no checked-in reference model.

Every bound here is evaluated in plain floats. A generalization bound is a
formula; instantiating it at the sample sizes a real project actually has is
arithmetic, and doing that arithmetic is the whole point — a bound quoted as a
theorem and a bound evaluated at n = 500 are very different objects.
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
