"""Shared fixture for the m18 bench pack.

Module 18 was initially excluded wholesale: an operating-systems module needs
real processes, real kernels, and real privilege, and a kernel that pretended to
have them would model the mechanism dishonestly.

That verdict was right about most of the module and wrong about two sessions.
Address translation is **arithmetic over a declared geometry** — the reference
model says so in its own scope string — and path-authority checking is a pure
decision over strings. Neither needs a kernel, and neither claims one.

Both benches import and probe `public/downloads/module18_reference.py`.
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
