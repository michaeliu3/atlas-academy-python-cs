"""Shared fixture for the m35 bench pack.

Module 35 is authoring-only, so this pack's visibility is
`private-guided-study`. It has no checked-in reference model.

The models here are fitted in plain Python on generated data with a declared
signal. That is deliberate: when the true relationship is something the bench
wrote down, "the model found the signal" and "the model memorised the sample"
are distinguishable by construction rather than by judgement.
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
