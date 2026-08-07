"""Shared fixture for the m20 bench pack.

Both m20 benches import and probe `public/downloads/module20_reference.py`.

Module 20 was initially excluded wholesale as a networking module. That verdict
judged the subject matter rather than the sessions. Two of them need no network
at all: `FrameDecoder` is a pure byte-stream state machine, and
`classify_client_observation` is a decision procedure over a client-local
observation. Both are exactly as real here as they would be over a socket.

The sessions that genuinely need a peer — DNS, HTTP semantics, publication —
are not benched.
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
