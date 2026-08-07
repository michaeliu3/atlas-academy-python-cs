"""Shared fixture for the m30 bench pack.

Puts `atlas_bench` and the checked-in reference model on the path once. Every
m30 bench imports and probes `public/downloads/module30_reference.py`; none
reimplements it.

The reference works in exact rational arithmetic and caps observation counts at
64, so every result here is a finite exact computation rather than a simulation
whose seed would need reporting.
"""

from __future__ import annotations

import sys
from fractions import Fraction
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

MAX_OBSERVATIONS = 64


# --------------------------------------------------------------------------
# Six p-values from six comparisons. Four clear 0.05 on their own.
# --------------------------------------------------------------------------

P_VALUES = (
    Fraction(1, 100),
    Fraction(2, 100),
    Fraction(3, 100),
    Fraction(4, 100),
    Fraction(20, 100),
    Fraction(60, 100),
)
ALPHA = Fraction(5, 100)


# --------------------------------------------------------------------------
# Y = X squared, with X uniform on {-1, 0, 1}.
#
# Cov(X, Y) = E[X^3] - E[X]E[Y] = 0, because the cube of a symmetric variable
# has mean zero. Y is nonetheless a deterministic function of X — about as
# dependent as two variables can be.
#
# Rows index x values; columns index y values.
# --------------------------------------------------------------------------

_THIRD = Fraction(1, 3)
JOINT = (
    (Fraction(0), _THIRD),   # x = -1 -> y = 1
    (_THIRD, Fraction(0)),   # x =  0 -> y = 0
    (Fraction(0), _THIRD),   # x =  1 -> y = 1
)
X_VALUES = (-1, 0, 1)
Y_VALUES = (0, 1)
