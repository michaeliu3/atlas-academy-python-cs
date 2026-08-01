"""A fixed CPU-only NumPy observation for the private M32 authoring pack.

This is intentionally a small code-reading artifact, not a benchmark, GPU
exercise, buffer-protocol test, or portability claim.  It pins NumPy 2.3.5 so
that the lesson can name exactly what it observed: shape, strides, contiguity,
aliasing, and one explicitly materialized broadcasting result.
"""

from __future__ import annotations

import json
import platform
from typing import Any

import numpy as np


PINNED_NUMPY_VERSION = "2.3.5"


def _require_pinned_numpy() -> None:
    """Fail rather than silently treating another NumPy version as this observation."""

    if np.__version__ != PINNED_NUMPY_VERSION:
        raise RuntimeError(
            "M32's bounded NumPy observation requires "
            f"NumPy {PINNED_NUMPY_VERSION}, found {np.__version__}. "
            "Recheck the observation and its documented scope before changing the pin."
        )


def _metadata(array: np.ndarray) -> dict[str, Any]:
    """Return only representation facts that this fixed process can inspect."""

    return {
        "shape": tuple(int(extent) for extent in array.shape),
        "dtype": str(array.dtype),
        "strides_bytes": tuple(int(stride) for stride in array.strides),
        "c_contiguous": bool(array.flags.c_contiguous),
        "f_contiguous": bool(array.flags.f_contiguous),
        "nbytes": int(array.nbytes),
    }


def observe_layout_and_broadcasting() -> dict[str, Any]:
    """Inspect one deterministic ndarray/view/copy/broadcasting configuration.

    The manually stated squared-distance oracle is deliberately independent of
    the reduction expression.  Its purpose is to keep the exercise about
    representation and semantic equality before anybody discusses speed.
    """

    _require_pinned_numpy()

    base = np.arange(12, dtype=np.float32).reshape(3, 4)
    reversed_columns = base[:, ::-1]
    contiguous_copy = np.ascontiguousarray(reversed_columns)

    points = np.array([[0.0, 1.0], [2.0, 3.0]], dtype=np.float32)
    centers = np.array([[1.0, 1.0], [0.0, 0.0], [-1.0, 2.0]], dtype=np.float32)
    differences = points[:, None, :] - centers[None, :, :]
    squared_distance = (differences * differences).sum(axis=2)
    squared_distance_oracle = np.array([[1.0, 1.0, 2.0], [5.0, 13.0, 10.0]], dtype=np.float32)

    return {
        "environment": {
            "numpy_version": np.__version__,
            "python_implementation": platform.python_implementation(),
            "python_version": platform.python_version(),
            "scope": "one CPU-only in-process NumPy ndarray observation",
        },
        "base": _metadata(base),
        "reversed_columns_view": {
            **_metadata(reversed_columns),
            "shares_memory_with_base": bool(np.shares_memory(base, reversed_columns)),
            "may_share_memory_with_base": bool(np.may_share_memory(base, reversed_columns)),
        },
        "contiguous_copy": {
            **_metadata(contiguous_copy),
            "shares_memory_with_reversed_view": bool(
                np.shares_memory(reversed_columns, contiguous_copy)
            ),
            "may_share_memory_with_reversed_view": bool(
                np.may_share_memory(reversed_columns, contiguous_copy)
            ),
        },
        "broadcasting": {
            "points_shape": tuple(int(extent) for extent in points.shape),
            "centers_shape": tuple(int(extent) for extent in centers.shape),
            "differences": _metadata(differences),
            "squared_distance_shape": tuple(int(extent) for extent in squared_distance.shape),
            "squared_distance": squared_distance.tolist(),
            "matches_declared_semantic_oracle": bool(
                np.array_equal(squared_distance, squared_distance_oracle)
            ),
        },
        "truth_boundary": (
            "This is one NumPy 2.3.5 CPU observation of explicitly named arrays. "
            "Here, shares_memory performs an exact overlap check while may_share_memory "
            "is only a conservative possibility check. It does not establish a Python "
            "buffer-protocol contract, GPU transfer, "
            "kernel fusion, peak process memory, benchmark result, portability, or "
            "the behavior of another library, version, device, or input."
        ),
    }


def main() -> int:
    print(json.dumps(observe_layout_and_broadcasting(), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
