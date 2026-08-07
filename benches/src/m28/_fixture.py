"""Shared fixture for the m28 bench pack.

Puts `atlas_bench` and the checked-in reference model on the path once. Every
m28 bench imports and probes `public/downloads/module28_reference.py`; none
reimplements it.

The reference computes in exact rational arithmetic (`Exact = Fraction`) and
reports floating-point estimates only where it says so. That separation is the
point of the module, so these fixtures keep exact inputs exact.
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


# --------------------------------------------------------------------------
# An ill-conditioned 2x2. The rows are nearly parallel, so the determinant is
# tiny relative to the entries and the inverse is enormous. Nothing about the
# matrix looks alarming.
# --------------------------------------------------------------------------

ILL_CONDITIONED = ((1, 1), (1, Fraction(10001, 10000)))
WELL_CONDITIONED = ((1, 0), (0, 1))

BASELINE_RHS = (2, 2)
PERTURBED_RHS = (2 + Fraction(1, 10 ** 6), 2)


# --------------------------------------------------------------------------
# A dataset whose dominant variance direction carries none of the decision.
#
# `x` spreads widely and symmetrically; `y` is a balanced 0/1 label arranged so
# it is nearly uncorrelated with x. PCA keeps the x direction and discards the
# label almost entirely.
# --------------------------------------------------------------------------

_XS = (30, -30, 20, -20, 10, -10, 25, -25)
_LABELS = (0, 1, 1, 0, 0, 1, 1, 0)

OBSERVATIONS = tuple([x, y] for x, y in zip(_XS, _LABELS))
LABELS = _LABELS


# A 3-column matrix of rank 2: column three is column one plus column two.
RANK_DEFICIENT = ((1, 2, 3), (2, 1, 3), (3, 3, 6))
