"""Shared fixture for the m31 bench pack.

Module 31 is authoring-only, so this pack's visibility is
`private-guided-study` rather than `reader`. It has no checked-in reference
model, and it deliberately uses no numerical library: every result here is
arithmetic on plain floats, which keeps the numbers reproducible on any machine
and keeps the subject — what a solver's stopping report does and does not
establish — visible rather than buried in a library call.
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
