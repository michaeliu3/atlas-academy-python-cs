"""Shared fixture for the m32 bench pack.

Module 32 is authoring-only, so this pack's visibility is
`private-guided-study`. It has no checked-in reference model.

This is the one pack in the corpus with a third-party dependency: `numpy`, which
is on the bench dependency allowlist. That is not incidental — the session's
subject is array *metadata*, and shape, dtype, and strides are numpy's own
concepts. Reimplementing them in plain Python would be modelling the thing under
examination rather than examining it.

Nothing here touches an accelerator. The workbook itself concedes a "CPU-only
imagined queue" for the device sessions, and those are not benched.
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
