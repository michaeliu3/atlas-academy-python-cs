"""Focused assertions for M32's fixed CPU-only NumPy observation."""

from __future__ import annotations

import unittest

from m32_numpy_layout_observation import PINNED_NUMPY_VERSION, observe_layout_and_broadcasting


class M32NumPyLayoutObservationTests(unittest.TestCase):
    def test_view_copy_and_broadcasting_observation(self) -> None:
        observation = observe_layout_and_broadcasting()

        self.assertEqual(observation["environment"]["numpy_version"], PINNED_NUMPY_VERSION)
        self.assertEqual(observation["environment"]["scope"], "one CPU-only in-process NumPy ndarray observation")

        self.assertEqual(observation["base"], {
            "shape": (3, 4),
            "dtype": "float32",
            "strides_bytes": (16, 4),
            "c_contiguous": True,
            "f_contiguous": False,
            "nbytes": 48,
        })
        self.assertEqual(observation["reversed_columns_view"]["shape"], (3, 4))
        self.assertEqual(observation["reversed_columns_view"]["strides_bytes"], (16, -4))
        self.assertFalse(observation["reversed_columns_view"]["c_contiguous"])
        self.assertTrue(observation["reversed_columns_view"]["shares_memory_with_base"])
        self.assertTrue(observation["reversed_columns_view"]["may_share_memory_with_base"])
        self.assertTrue(observation["contiguous_copy"]["c_contiguous"])
        self.assertFalse(observation["contiguous_copy"]["shares_memory_with_reversed_view"])
        self.assertFalse(observation["contiguous_copy"]["may_share_memory_with_reversed_view"])

        broadcasting = observation["broadcasting"]
        self.assertEqual(broadcasting["points_shape"], (2, 2))
        self.assertEqual(broadcasting["centers_shape"], (3, 2))
        self.assertEqual(broadcasting["differences"]["shape"], (2, 3, 2))
        self.assertEqual(broadcasting["differences"]["nbytes"], 48)
        self.assertEqual(broadcasting["squared_distance_shape"], (2, 3))
        self.assertEqual(broadcasting["squared_distance"], [[1.0, 1.0, 2.0], [5.0, 13.0, 10.0]])
        self.assertTrue(broadcasting["matches_declared_semantic_oracle"])
        self.assertIn("exact overlap check", observation["truth_boundary"])
        self.assertIn("does not establish", observation["truth_boundary"])


if __name__ == "__main__":
    unittest.main()
