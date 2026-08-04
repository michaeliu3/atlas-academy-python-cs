"""Fail closed when a discovered teaching-model suite never runs model code.

The ordinary unittest discovery command proves a suite can run. This verifier
adds one narrower fact: while each discovered suite runs in this parent
process, at least one real Python frame defined by its paired reference model
must execute. It deliberately does not assess numerical validity, browser
behavior, source quality, or CI provenance; those remain separate evidence
questions. It is a trusted checked-in-test regression check, not a sandbox
that can establish behavior for adversarial Python code.
"""

from __future__ import annotations

from dataclasses import dataclass
import importlib
import importlib.util
import inspect
import io
from pathlib import Path
import sys
import threading
from types import CodeType, FrameType, ModuleType
import unittest


class TeachingModelExerciseError(RuntimeError):
    """A discovered test passed or skipped without executing paired model code."""


@dataclass(frozen=True)
class TeachingModelExerciseRecord:
    model_name: str
    test_name: str
    tests_run: int
    executed_model_frames: int


def _module_code_objects(module: ModuleType) -> set[CodeType]:
    """Collect Python code objects actually defined by a reference model."""

    code_objects: set[CodeType] = set()

    def add_callable(value: object) -> None:
        if inspect.isfunction(value) and value.__module__ == module.__name__:
            code_objects.add(value.__code__)

    for value in vars(module).values():
        add_callable(value)
        if inspect.isclass(value) and value.__module__ == module.__name__:
            for member in vars(value).values():
                if isinstance(member, (classmethod, staticmethod)):
                    add_callable(member.__func__)
                else:
                    add_callable(member)
    return code_objects


def _load_test_module(test_path: Path, module_name: str) -> ModuleType:
    specification = importlib.util.spec_from_file_location(module_name, test_path)
    if specification is None or specification.loader is None:
        raise TeachingModelExerciseError(f"Cannot load teaching-model test {test_path.name}.")
    module = importlib.util.module_from_spec(specification)
    sys.modules[module_name] = module
    specification.loader.exec_module(module)
    return module


def _test_result_text(result: unittest.TestResult, stream: io.StringIO) -> str:
    details = stream.getvalue().strip()
    if details:
        return details
    return f"failures={len(result.failures)}, errors={len(result.errors)}, skipped={len(result.skipped)}"


def verify_teaching_model_pair(model_path: Path, test_path: Path) -> TeachingModelExerciseRecord:
    """Run one canonical pair and require a successful runtime model-code trace."""

    model_path = model_path.resolve()
    test_path = test_path.resolve()
    if model_path.parent != test_path.parent:
        raise TeachingModelExerciseError("A teaching-model test must be paired from the same teaching-model directory.")
    expected_test_name = f"test_{model_path.stem}.py"
    if test_path.name != expected_test_name:
        raise TeachingModelExerciseError(
            f"Teaching-model test {test_path.name} must be the canonical pair for {model_path.name}."
        )

    directory = str(model_path.parent)
    model_name = model_path.stem
    test_name = test_path.stem
    isolated_test_name = f"_atlas_runtime_{test_name}"
    missing = object()
    previous_model = sys.modules.get(model_name, missing)
    previous_test = sys.modules.get(isolated_test_name, missing)
    sys.path.insert(0, directory)
    try:
        sys.modules.pop(model_name, None)
        model = importlib.import_module(model_name)
        module_file = Path(getattr(model, "__file__", "")).resolve()
        if module_file != model_path:
            raise TeachingModelExerciseError(
                f"Teaching-model import {model_name} resolved to {module_file}, not {model_path}."
            )
        model_code_objects = _module_code_objects(model)
        if not model_code_objects:
            raise TeachingModelExerciseError(
                f"Reference model {model_path.name} exposes no model-defined Python code object to observe."
            )

        test_module = _load_test_module(test_path, isolated_test_name)
        suite = unittest.defaultTestLoader.loadTestsFromModule(test_module)
        if suite.countTestCases() == 0:
            raise TeachingModelExerciseError(f"Teaching-model test {test_path.name} discovers zero unittest cases.")

        executed_model_frames = 0
        trusted_frame_type = FrameType
        trusted_current_frame = sys._getframe

        def profile(frame, event, argument):
            del argument
            nonlocal executed_model_frames
            if event != "call" or not isinstance(frame, trusted_frame_type):
                return
            try:
                is_interpreter_profile_event = trusted_current_frame(1) is frame
            except ValueError:
                is_interpreter_profile_event = False
            if is_interpreter_profile_event and frame.f_code in model_code_objects:
                executed_model_frames += 1

        previous_profile = sys.getprofile()
        previous_thread_profile = threading.getprofile()
        output = io.StringIO()
        sys.setprofile(profile)
        threading.setprofile(profile)
        try:
            result = unittest.TextTestRunner(stream=output, verbosity=0).run(suite)
        finally:
            sys.setprofile(previous_profile)
            threading.setprofile(previous_thread_profile)

        if not result.wasSuccessful():
            raise TeachingModelExerciseError(
                f"Teaching-model test {test_path.name} failed while checking runtime exercise: "
                f"{_test_result_text(result, output)}"
            )
        if executed_model_frames == 0:
            raise TeachingModelExerciseError(
                f"Teaching-model test {test_path.name} executed no reference-model Python frame from "
                f"{model_path.name}."
            )
        return TeachingModelExerciseRecord(
            model_name=model_name,
            test_name=test_name,
            tests_run=result.testsRun,
            executed_model_frames=executed_model_frames,
        )
    finally:
        sys.path.remove(directory)
        sys.modules.pop(isolated_test_name, None)
        if previous_model is missing:
            sys.modules.pop(model_name, None)
        else:
            sys.modules[model_name] = previous_model
        if previous_test is not missing:
            sys.modules[isolated_test_name] = previous_test


def verify_teaching_model_pairs(downloads_directory: Path) -> list[TeachingModelExerciseRecord]:
    """Verify every canonical test_moduleNN_reference.py pair in one directory."""

    directory = downloads_directory.resolve()
    test_paths = sorted(directory.glob("test_module*_reference.py"))
    if not test_paths:
        raise TeachingModelExerciseError("No canonical teaching-model test files were discovered.")
    records = []
    for test_path in test_paths:
        model_path = directory / f"{test_path.stem.removeprefix('test_')}.py"
        if not model_path.is_file():
            raise TeachingModelExerciseError(
                f"Teaching-model test {test_path.name} has no paired reference model {model_path.name}."
            )
        records.append(verify_teaching_model_pair(model_path, test_path))
    return records


def verify_teaching_model_roots(*directories: Path) -> list[TeachingModelExerciseRecord]:
    """Verify public and private teaching-model directories as one suite."""

    records: list[TeachingModelExerciseRecord] = []
    for directory in directories:
        records.extend(verify_teaching_model_pairs(directory))
    return records


def main() -> int:
    site_root = Path(__file__).resolve().parents[1]
    model_directories = (
        site_root / "public" / "downloads",
        site_root / "content" / "course" / "reference-models",
    )
    try:
        records = verify_teaching_model_roots(*model_directories)
    except TeachingModelExerciseError as error:
        print(f"Teaching-model runtime exercise verification failed: {error}", file=sys.stderr)
        return 1
    for record in records:
        print(
            f"{record.model_name}: {record.tests_run} unittest case(s), "
            f"{record.executed_model_frames} reference-model frame(s)."
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
