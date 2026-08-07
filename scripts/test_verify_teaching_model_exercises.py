"""Regression tests for the runtime teaching-model exercise verifier."""

from __future__ import annotations

from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from verify_teaching_model_exercises import (
    TeachingModelExerciseError,
    verify_teaching_model_pairs,
)


class TeachingModelExerciseVerifierTests(unittest.TestCase):
    def _write_pair(self, directory: Path, test_body: str) -> None:
        (directory / "module99_reference.py").write_text(
            "def evaluate(value):\n    return value + 1\n\n\ndef parked():\n    yield 1\n",
            encoding="utf-8",
        )
        (directory / "test_module99_reference.py").write_text(test_body, encoding="utf-8")

    def test_accepts_a_discovered_test_that_executes_reference_model_code(self) -> None:
        with TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            self._write_pair(
                directory,
                """import unittest
import module99_reference as model


class ModelTests(unittest.TestCase):
    def test_calls_the_model(self):
        self.assertEqual(model.evaluate(2), 3)
""",
            )

            records = verify_teaching_model_pairs(directory)

        self.assertEqual(len(records), 1)
        self.assertEqual(records[0].model_name, "module99_reference")
        self.assertEqual(records[0].tests_run, 1)
        self.assertGreater(records[0].executed_model_frames, 0)

    def test_rejects_a_passing_assert_message_that_never_evaluates_the_model(self) -> None:
        with TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            self._write_pair(
                directory,
                """import unittest
import module99_reference as model


class ModelTests(unittest.TestCase):
    def test_message_is_lazy_when_the_assertion_passes(self):
        assert True, model.evaluate(2)
""",
            )

            with self.assertRaisesRegex(TeachingModelExerciseError, "executed no reference-model Python frame"):
                verify_teaching_model_pairs(directory)

    def test_rejects_skipped_and_shadowed_test_bodies(self) -> None:
        cases = {
            "skipped": """import unittest
import module99_reference as model


@unittest.skip("not executed")
class ModelTests(unittest.TestCase):
    def test_skipped(self):
        self.assertEqual(model.evaluate(2), 3)
""",
            "shadowed": """import unittest
import module99_reference as imported_model


class ModelTests(unittest.TestCase):
    def test_shadowed(self):
        model = type("Fake", (), {"evaluate": staticmethod(lambda value: value + 1)})
        self.assertEqual(model.evaluate(2), 3)
""",
        }
        for name, body in cases.items():
            with self.subTest(name=name), TemporaryDirectory() as temporary_directory:
                directory = Path(temporary_directory)
                self._write_pair(directory, body)
                with self.assertRaisesRegex(TeachingModelExerciseError, "executed no reference-model Python frame"):
                    verify_teaching_model_pairs(directory)

    def test_rejects_a_direct_profile_callback_spoof(self) -> None:
        with TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            self._write_pair(
                directory,
                """import sys
import unittest
import module99_reference as model


class ModelTests(unittest.TestCase):
    def test_spoofs_a_model_frame_without_entering_it(self):
        pending_model_frame = model.parked()
        profiler = sys.getprofile()
        self.assertIsNotNone(profiler)
        profiler(pending_model_frame.gi_frame, "call", None)
        with self.assertRaises(TypeError):
            profiler(
                pending_model_frame.gi_frame,
                "call",
                None,
                _current_frame=lambda _: pending_model_frame.gi_frame,
            )
        with self.assertRaises(TypeError):
            profiler(object(), "call", None, _frame_type=object)
""",
            )

            with self.assertRaisesRegex(TeachingModelExerciseError, "executed no reference-model Python frame"):
                verify_teaching_model_pairs(directory)


if __name__ == "__main__":
    unittest.main()
