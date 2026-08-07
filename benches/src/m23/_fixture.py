"""Shared fixture for the m23 bench pack.

The m23 benches probe `public/downloads/module23_reference.py` — the Pebble
interpreter, the query lexer, and the capability machinery. None reimplements
it.

Bench 3 is the exception that proves the rule: the reference is **lexically
scoped by declaration**, so there is nothing in it to compare against. That
bench supplies its own dynamic-scope evaluator, clearly labelled, purely as the
contrast. Everything else it uses is the reference's.
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
