"""Module 18: bounded operating-system evidence reference.

The reference uses exactly one supervisor and one child worker, synthetic
data, and a caller-marked disposable workspace.  It records API outcomes and
artifact state separately.  It does not claim that an API return proves a
physical-device write, universal crash durability, sandboxing, exactly-once
execution, or multi-writer safety.

Supported runtime: Python 3.12+ (course documentation baseline: Python 3.14.6).
The companion ``test_module18_reference.py`` file contains the full suite.
"""

from __future__ import annotations

import argparse
from collections.abc import Mapping
from dataclasses import dataclass
import hashlib
import json
import math
import os
from pathlib import Path
import platform
import re
import stat
import subprocess
import sys
import tempfile
import time


SCHEMA = "atlas.module18.os-evidence.v1"
PHASES = (
    "ADMITTED",
    "STARTED",
    "ENCODED",
    "STAGED",
    "VALIDATED",
    "PY_FLUSHED",
    "FILE_SYNC_RETURNED",
    "CLOSED",
    "REPLACED",
    "DIR_SYNC_RETURNED",
    "EXITED",
    "RECOVERED",
)
WORKER_PHASES = PHASES[1:10]
WORKER_PHASE_EDGES = frozenset(
    {
        (None, "STARTED"),
        ("STARTED", "ENCODED"),
        ("ENCODED", "STAGED"),
        ("STAGED", "VALIDATED"),
        ("STAGED", "CLOSED"),
        ("VALIDATED", "PY_FLUSHED"),
        ("VALIDATED", "CLOSED"),
        ("PY_FLUSHED", "FILE_SYNC_RETURNED"),
        ("PY_FLUSHED", "CLOSED"),
        ("FILE_SYNC_RETURNED", "CLOSED"),
        ("CLOSED", "REPLACED"),
        ("REPLACED", "DIR_SYNC_RETURNED"),
    }
)

VIRTUAL_ADDRESS_BITS = 16
PAGE_BYTES = 256
PAGE_OFFSET_BITS = 8
MAX_BYTE_ADDRESS = (1 << VIRTUAL_ADDRESS_BITS) - 1
MAX_FRAME_NUMBER = 255
WORKSPACE_MARKER = ".atlas-module18-disposable"
WORKSPACE_MARKER_TEXT = "atlas-module18-disposable-v1\n"
RUN_ID_PATTERN = re.compile(r"[a-z0-9](?:[a-z0-9-]{0,31})\Z")
RESULT_SCHEMA = "atlas.synthetic-review-result.v1"
MAX_ARTIFACT_BYTES = 64 * 1024
CONCEPT_ID_PATTERN = re.compile(r"[a-z](?:[a-z0-9-]{0,31})\Z")
SYNTHETIC_JOB = {
    "job_id": "atlas-review-001",
    "records": (
        {"concept_id": "process-lifecycle", "confidence_milli": 820},
        {"concept_id": "durable-publication", "confidence_milli": 610},
        {"concept_id": "virtual-memory", "confidence_milli": 540},
        {"concept_id": "filesystem-identity", "confidence_milli": 760},
    ),
}
EXPECTED_RESULT = {
    "schema": RESULT_SCHEMA,
    "job_id": "atlas-review-001",
    "generation": 2,
    "concept_count": 4,
    "due_concepts": ["durable-publication", "virtual-memory"],
}
KNOWN_OLD_RESULT = {
    "schema": RESULT_SCHEMA,
    "job_id": "atlas-review-001",
    "generation": 1,
    "concept_count": 4,
    "due_concepts": [
        "durable-publication",
        "process-lifecycle",
        "virtual-memory",
    ],
}
COURSE_PYTHON_BASELINE = "3.14.6"
WORKER_FAILURE_EXIT = 74
COOPERATIVE_EXIT = 75
HARD_INJECTION_EXIT = 86
WORKER_CAPABILITY_EXIT = 64
WORKER_CAPABILITY_ENV = "ATLAS_MODULE18_OWNED_CHILD"
ALLOWED_SCENARIOS = {
    "normal",
    "cooperative-before-stage",
    "cooperative-after-validated",
    "hard-after-staged",
    "hard-after-file-sync",
    "hard-after-replace",
    "sync-failure",
    "replace-failure",
    "unresponsive-worker",
}
PHASE_DEFINITIONS = {
    "ADMITTED": "supervisor accepted the validated synthetic job",
    "STARTED": "child entry point recorded that it began",
    "ENCODED": "deterministic candidate bytes exist in worker memory",
    "STAGED": "candidate bytes were passed to the staging stream",
    "VALIDATED": "candidate bytes matched the independent semantic oracle",
    "PY_FLUSHED": "Python stream flush returned",
    "FILE_SYNC_RETURNED": "os.fsync on the staging file returned",
    "CLOSED": "the worker observed staging-handle close return",
    "REPLACED": "same-directory os.replace returned",
    "DIR_SYNC_RETURNED": "optional containing-directory fsync returned",
    "EXITED": "the supervisor waited for and observed child termination",
    "RECOVERED": "the supervisor classified current artifacts without promotion",
}


def _strict_int(name: str, value: object) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an integer")
    return value


class WorkspaceSafetyError(ValueError):
    """A path or workspace did not satisfy the disposable-lab boundary."""


def _is_link_like(path: Path) -> bool:
    """Detect symbolic links and Windows junctions when the runtime exposes them."""

    try:
        if path.is_symlink():
            return True
        junction_check = getattr(path, "is_junction", None)
        return bool(junction_check is not None and junction_check())
    except OSError as error:
        raise WorkspaceSafetyError("link status could not be inspected") from error


def _validate_run_id(run_id: str) -> str:
    if not isinstance(run_id, str) or RUN_ID_PATTERN.fullmatch(run_id) is None:
        raise ValueError(
            "run_id must be 1-32 lowercase ASCII letters, digits, or hyphens"
        )
    return run_id


def initialize_disposable_workspace(workspace: Path | str) -> Path:
    """Mark an existing empty directory as owned by this disposable lab."""

    supplied = Path(workspace)
    if not supplied.exists() or not supplied.is_dir():
        raise WorkspaceSafetyError("workspace must be an existing directory")
    if _is_link_like(supplied):
        raise WorkspaceSafetyError("workspace itself must not be a link or junction")
    if any(supplied.iterdir()):
        raise WorkspaceSafetyError("workspace must be empty before initialization")
    root = supplied.resolve(strict=True)
    marker = root / WORKSPACE_MARKER
    marker.write_text(WORKSPACE_MARKER_TEXT, encoding="utf-8", newline="\n")
    return root


def _verified_workspace_root(workspace: Path | str) -> Path:
    supplied = Path(workspace)
    if _is_link_like(supplied):
        raise WorkspaceSafetyError("workspace itself must not be a link or junction")
    try:
        root = supplied.resolve(strict=True)
    except (OSError, RuntimeError) as error:
        raise WorkspaceSafetyError("workspace cannot be resolved") from error
    if not root.is_dir():
        raise WorkspaceSafetyError("workspace must be a directory")
    marker = root / WORKSPACE_MARKER
    if _is_link_like(marker) or not marker.is_file():
        raise WorkspaceSafetyError("workspace marker is missing or link-like")
    try:
        marker_text = marker.read_text(encoding="utf-8")
    except OSError as error:
        raise WorkspaceSafetyError("workspace marker is missing") from error
    if marker_text != WORKSPACE_MARKER_TEXT:
        raise WorkspaceSafetyError("workspace marker is invalid")
    return root


def safe_workspace_path(
    workspace: Path | str,
    relative_name: str,
) -> Path:
    """Resolve a lexical relative name and reject symlink-mediated escape."""

    root = _verified_workspace_root(workspace)
    if not isinstance(relative_name, str):
        raise TypeError("relative_name must be str")
    if relative_name in {"", ".", ".."}:
        raise WorkspaceSafetyError("relative_name must name a workspace member")
    relative = Path(relative_name)
    if relative.is_absolute() or relative.drive or ".." in relative.parts:
        raise WorkspaceSafetyError("relative_name must not escape the workspace")
    cursor = root
    for part in relative.parts:
        cursor = cursor / part
        if _is_link_like(cursor):
            raise WorkspaceSafetyError(
                "workspace path must not traverse a link or junction"
            )
    try:
        resolved = (root / relative).resolve(strict=False)
    except (OSError, RuntimeError) as error:
        raise WorkspaceSafetyError("workspace member cannot be resolved") from error
    if not resolved.is_relative_to(root) or resolved == root:
        raise WorkspaceSafetyError("resolved path leaves the workspace")
    return resolved


def classify_artifact_name(name: str, *, run_id: str) -> str:
    """Classify ownership by exact names, never by a broad glob."""

    run_id = _validate_run_id(run_id)
    if name == "result.json":
        return "owned_target"
    if name == f".atlas-{run_id}.result.tmp":
        return "owned_stage"
    return "foreign"


def _canonical_json_bytes(value: object) -> bytes:
    return (
        json.dumps(
            value,
            ensure_ascii=True,
            sort_keys=True,
            separators=(",", ":"),
            allow_nan=False,
        ).encode("utf-8")
        + b"\n"
    )


def build_review_result(
    job: Mapping[str, object] = SYNTHETIC_JOB,
) -> dict[str, object]:
    """Validate and transform a synthetic review job without OS dependencies."""

    if not isinstance(job, Mapping) or set(job) != {"job_id", "records"}:
        raise ValueError("job must contain exactly job_id and records")
    job_id = job["job_id"]
    records = job["records"]
    if job_id != "atlas-review-001":
        raise ValueError("job_id does not match the fixed synthetic contract")
    if not isinstance(records, (tuple, list)):
        raise TypeError("records must be a tuple or list")

    concepts: list[tuple[str, int]] = []
    seen: set[str] = set()
    for record in records:
        if not isinstance(record, Mapping) or set(record) != {
            "concept_id",
            "confidence_milli",
        }:
            raise ValueError(
                "each record must contain concept_id and confidence_milli"
            )
        concept_id = record["concept_id"]
        confidence = record["confidence_milli"]
        if (
            not isinstance(concept_id, str)
            or CONCEPT_ID_PATTERN.fullmatch(concept_id) is None
        ):
            raise ValueError("concept_id violates the fixed identifier policy")
        if concept_id in seen:
            raise ValueError("concept_id must be unique within the job")
        seen.add(concept_id)
        confidence_value = _strict_int("confidence_milli", confidence)
        if not 0 <= confidence_value <= 1000:
            raise ValueError("confidence_milli must be in [0, 1000]")
        concepts.append((concept_id, confidence_value))

    return {
        "schema": RESULT_SCHEMA,
        "job_id": job_id,
        "generation": 2,
        "concept_count": len(concepts),
        "due_concepts": sorted(
            concept_id
            for concept_id, confidence in concepts
            if confidence < 700
        ),
    }


def expected_result_bytes() -> bytes:
    """Independent, deterministic byte oracle used before process launch."""

    return _canonical_json_bytes(EXPECTED_RESULT)


def known_old_result_bytes() -> bytes:
    """Known-valid previous target fixture, distinct from the new-result oracle."""

    return _canonical_json_bytes(KNOWN_OLD_RESULT)


def validate_result_bytes(payload: bytes) -> dict[str, object]:
    """Validate syntax/schema and exact synthetic semantics separately."""

    if not isinstance(payload, bytes):
        raise TypeError("payload must be bytes")
    if len(payload) > MAX_ARTIFACT_BYTES:
        return {
            "schema_valid": False,
            "semantic_valid": False,
            "version_classification": "INVALID",
            "reason": "artifact-too-large",
        }
    try:
        decoded = payload.decode("utf-8", errors="strict")
        parsed = json.loads(decoded)
    except (UnicodeError, json.JSONDecodeError):
        return {
            "schema_valid": False,
            "semantic_valid": False,
            "version_classification": "INVALID",
            "reason": "invalid-utf8-or-json",
        }
    schema_valid = (
        isinstance(parsed, dict)
        and parsed.get("schema") == RESULT_SCHEMA
        and set(parsed)
        == {
            "schema",
            "job_id",
            "generation",
            "concept_count",
            "due_concepts",
        }
        and isinstance(parsed.get("job_id"), str)
        and isinstance(parsed.get("generation"), int)
        and not isinstance(parsed.get("generation"), bool)
        and isinstance(parsed.get("concept_count"), int)
        and not isinstance(parsed.get("concept_count"), bool)
        and isinstance(parsed.get("due_concepts"), list)
        and all(
            isinstance(concept_id, str)
            for concept_id in parsed.get("due_concepts", [])
        )
    )
    version_classification = (
        "VALID_NEW"
        if schema_valid and parsed == EXPECTED_RESULT
        else "VALID_OLD"
        if schema_valid and parsed == KNOWN_OLD_RESULT
        else "INVALID"
    )
    semantic_valid = version_classification == "VALID_NEW"
    return {
        "schema_valid": schema_valid,
        "semantic_valid": semantic_valid,
        "version_classification": version_classification,
        "reason": (
            "matches-independent-new-result-oracle"
            if semantic_valid
            else "matches-known-valid-old-fixture"
            if version_classification == "VALID_OLD"
            else "schema-valid-but-semantic-mismatch"
            if schema_valid
            else "schema-mismatch"
        ),
    }


def observe_artifact(
    workspace: Path | str,
    relative_name: str,
    *,
    role: str,
    run_id: str,
) -> dict[str, object]:
    """Read a bounded artifact and retain validity and ownership separately."""

    path = safe_workspace_path(workspace, relative_name)
    ownership = classify_artifact_name(path.name, run_id=run_id)
    observation: dict[str, object] = {
        "role": role,
        "relative_name": relative_name.replace("\\", "/"),
        "exists": path.exists() or path.is_symlink(),
        "byte_length": None,
        "byte_length_lower_bound": None,
        "sha256": None,
        "digest_scope": "none",
        "schema_valid": False,
        "semantic_valid": False,
        "version_classification": "MISSING",
        "validation_reason": "absent",
        "ownership_classification": ownership,
        "policy_action": "preserve",
    }
    if path.is_symlink():
        observation["validation_reason"] = "symlink-not-followed"
        return observation
    if not path.exists():
        return observation
    if not path.is_file():
        observation["validation_reason"] = "not-a-regular-file"
        return observation
    try:
        with path.open("rb") as stream:
            payload = stream.read(MAX_ARTIFACT_BYTES + 1)
    except OSError as error:
        observation["validation_reason"] = f"read-error:{type(error).__name__}"
        return observation
    if len(payload) > MAX_ARTIFACT_BYTES:
        observation["byte_length_lower_bound"] = len(payload)
        observation["validation_reason"] = "exceeds-bounded-read-limit"
        return observation
    observation["byte_length"] = len(payload)
    observation["sha256"] = hashlib.sha256(payload).hexdigest()
    observation["digest_scope"] = "complete-artifact"
    validation = validate_result_bytes(payload)
    observation["schema_valid"] = validation["schema_valid"]
    observation["semantic_valid"] = validation["semantic_valid"]
    observation["version_classification"] = validation[
        "version_classification"
    ]
    observation["validation_reason"] = validation["reason"]
    return observation


def permission_policy(*, platform_name: str | None = None) -> dict[str, object]:
    """Represent requested authority without claiming universal enforcement."""

    selected = platform.system() if platform_name is None else platform_name
    windows = selected.casefold() == "windows"
    return {
        "requested_creation_mode": "0o600",
        "requested_access": "worker-write-and-supervisor-read",
        "enforcement_model": (
            "windows-acl-not-inferred"
            if windows
            else "posix-mode-bits-subject-to-umask"
        ),
        "mode_proves_least_authority": False,
        "scope": (
            "a creation request and post-creation observation only; it does not "
            "prove ACL inheritance, identity policy, sandboxing, or denial to "
            "every other principal"
        ),
    }


@dataclass(frozen=True, slots=True)
class PageTableEntry:
    """One entry in the declared, pure teaching page table."""

    frame_number: int | None
    valid: bool = True
    present: bool = True
    readable: bool = True
    writable: bool = False
    executable: bool = False
    file_backed: bool = False

    def __post_init__(self) -> None:
        if self.frame_number is not None:
            frame = _strict_int("frame_number", self.frame_number)
            if not 0 <= frame <= MAX_FRAME_NUMBER:
                raise ValueError("frame_number must be in [0, 255]")
        for name in (
            "valid",
            "present",
            "readable",
            "writable",
            "executable",
            "file_backed",
        ):
            if not isinstance(getattr(self, name), bool):
                raise TypeError(f"{name} must be bool")
        if not self.valid and self.present:
            raise ValueError("an invalid mapping cannot be present")
        if not self.valid and self.file_backed:
            raise ValueError("an invalid mapping cannot be file-backed")
        if self.present and self.frame_number is None:
            raise ValueError("a present mapping requires a frame_number")
        if not self.present and self.frame_number is not None:
            raise ValueError("a non-present mapping has no current frame_number")


@dataclass(frozen=True, slots=True)
class TranslationObservation:
    virtual_address: int
    virtual_page: int
    offset: int
    access: str
    status: str
    valid_mapping: bool
    file_backed: bool
    frame_number: int | None
    physical_address: int | None
    scope: str


def translate_virtual_address(
    virtual_address: int,
    page_table: Mapping[int, PageTableEntry],
    *,
    access: str,
) -> TranslationObservation:
    """Translate in a pure 16-bit/256-byte-page teaching model.

    This does not inspect the host page table, a Python object, residency, the
    TLB, a page fault count, or a physical address used by this process.
    """

    address = _strict_int("virtual_address", virtual_address)
    if not 0 <= address <= MAX_BYTE_ADDRESS:
        raise ValueError("virtual_address must fit the declared 16-bit space")
    if access not in {"read", "write", "execute"}:
        raise ValueError("access must be read, write, or execute")

    virtual_page = address >> PAGE_OFFSET_BITS
    offset = address & (PAGE_BYTES - 1)
    entry = page_table.get(virtual_page)
    status = "INVALID_MAPPING"
    valid_mapping = False
    file_backed = False
    frame: int | None = None
    physical: int | None = None
    if entry is not None:
        if not isinstance(entry, PageTableEntry):
            raise TypeError("page-table values must be PageTableEntry objects")
        valid_mapping = entry.valid
        file_backed = entry.file_backed
        if not entry.valid:
            status = "INVALID_MAPPING"
        elif not entry.present:
            status = "NOT_PRESENT"
        else:
            allowed = {
                "read": entry.readable,
                "write": entry.writable,
                "execute": entry.executable,
            }[access]
            if not allowed:
                status = "PROTECTION_FAULT"
            else:
                status = "MAPPED"
                frame = entry.frame_number
                assert frame is not None
                physical = frame * PAGE_BYTES + offset

    return TranslationObservation(
        virtual_address=address,
        virtual_page=virtual_page,
        offset=offset,
        access=access,
        status=status,
        valid_mapping=valid_mapping,
        file_backed=file_backed,
        frame_number=frame,
        physical_address=physical,
        scope=(
            "pure 16-bit teaching model with distinct invalid, valid-not-present, "
            "and protection states; not a host mapping, Python object layout, "
            "TLB observation, residency claim, or fault count"
        ),
    )


def runtime_profile() -> dict[str, object]:
    """Record the actual runtime without host, user, or absolute-path identity."""

    return {
        "implementation": platform.python_implementation(),
        "python_version": platform.python_version(),
        "python_compiler": platform.python_compiler(),
        "executable_name": Path(sys.executable).name,
        "platform_system": platform.system(),
        "platform_release": platform.release(),
        "machine": platform.machine(),
        "course_documentation_baseline": COURSE_PYTHON_BASELINE,
        "supported_runtime_policy": "Python 3.12 or newer",
        "runtime_meets_minimum": sys.version_info >= (3, 12),
        "identity_boundary": (
            "no username, hostname, home path, executable path, or environment "
            "value is recorded"
        ),
    }


def platform_capabilities() -> dict[str, object]:
    directory_sync_candidate = (
        os.name == "posix" and hasattr(os, "O_DIRECTORY")
    )
    return {
        "subprocess_argv_launch": "available",
        "cooperative_request": "owned workspace request file",
        "terminate_semantics": (
            "TerminateProcess through Popen.terminate; cleanup not assumed"
            if os.name == "nt"
            else "SIGTERM through Popen.terminate; cleanup not assumed"
        ),
        "kill_semantics": (
            "same TerminateProcess family through Popen.kill; cleanup not assumed"
            if os.name == "nt"
            else "SIGKILL through Popen.kill; cleanup not assumed"
        ),
        "directory_sync_candidate": directory_sync_candidate,
        "directory_sync_scope": (
            "attempted only on POSIX when O_DIRECTORY is exposed; a successful "
            "return is not a universal power-loss or storage-honesty guarantee"
        ),
        "permission_model": permission_policy(),
    }


def _phase_log_name(run_id: str) -> str:
    return f".atlas-{_validate_run_id(run_id)}.phases.jsonl"


def _stop_request_name(run_id: str) -> str:
    return f".atlas-{_validate_run_id(run_id)}.stop"


def _stage_name(run_id: str) -> str:
    return f".atlas-{_validate_run_id(run_id)}.result.tmp"


def _worker_program_name(run_id: str) -> str:
    return f".atlas-{_validate_run_id(run_id)}.worker.py"


def _copy_worker_program(workspace: Path, run_id: str) -> dict[str, object]:
    """Create the exact relative worker program named in the child argv."""

    destination = safe_workspace_path(workspace, _worker_program_name(run_id))
    if destination.exists() or destination.is_symlink():
        raise WorkspaceSafetyError("owned worker program already exists")
    source = Path(__file__).resolve(strict=True)
    payload = source.read_bytes()
    descriptor = os.open(
        destination,
        os.O_WRONLY | os.O_CREAT | os.O_EXCL,
        0o500,
    )
    try:
        with os.fdopen(descriptor, "wb", closefd=False) as stream:
            stream.write(payload)
            stream.flush()
            os.fsync(stream.fileno())
    finally:
        os.close(descriptor)
    return {
        "relative_name": destination.name,
        "byte_length": len(payload),
        "sha256": hashlib.sha256(payload).hexdigest(),
        "owner": "supervisor-created-input-program",
    }


def _ensure_known_old_target(
    workspace: Path,
    *,
    run_id: str,
) -> dict[str, object]:
    """Establish a known-valid old target before the publication attempt."""

    target = safe_workspace_path(workspace, "result.json")
    if target.exists() or target.is_symlink():
        observation = observe_artifact(
            workspace,
            "result.json",
            role="initial-target",
            run_id=run_id,
        )
        if observation["version_classification"] != "VALID_OLD":
            raise WorkspaceSafetyError(
                "existing target is not the known-valid old fixture"
            )
        return {
            "source": "preexisting-known-old-fixture",
            "version_classification": "VALID_OLD",
            "file_sync_returned": False,
            "power_loss_durability_claimed": False,
        }

    descriptor = os.open(
        target,
        os.O_WRONLY | os.O_CREAT | os.O_EXCL,
        0o600,
    )
    try:
        with os.fdopen(descriptor, "wb", closefd=False) as stream:
            stream.write(known_old_result_bytes())
            stream.flush()
            os.fsync(stream.fileno())
    finally:
        os.close(descriptor)
    return {
        "source": "supervisor-created-known-old-fixture",
        "version_classification": "VALID_OLD",
        "file_sync_returned": True,
        "power_loss_durability_claimed": False,
    }


def _append_worker_phase(
    workspace: Path,
    run_id: str,
    phase: str,
    ordinal: int,
    *,
    detail: str,
) -> None:
    if phase not in PHASES:
        raise ValueError(f"unknown phase: {phase}")
    path = safe_workspace_path(workspace, _phase_log_name(run_id))
    record = {
        "ordinal": ordinal,
        "phase": phase,
        "source": "worker",
        "detail": detail,
    }
    line = _canonical_json_bytes(record)
    flags = os.O_WRONLY | os.O_CREAT | os.O_APPEND
    descriptor = os.open(path, flags, 0o600)
    try:
        with os.fdopen(descriptor, "ab", closefd=False) as stream:
            stream.write(line)
            stream.flush()
            os.fsync(stream.fileno())
    finally:
        os.close(descriptor)


def _read_worker_phases(
    workspace: Path,
    run_id: str,
) -> list[dict[str, object]]:
    path = safe_workspace_path(workspace, _phase_log_name(run_id))
    if not path.exists():
        return []
    if path.is_symlink() or not path.is_file():
        raise WorkspaceSafetyError("phase log must be an owned regular file")
    payload = path.read_bytes()
    if len(payload) > MAX_ARTIFACT_BYTES:
        raise WorkspaceSafetyError("phase log exceeded the bounded evidence size")
    observations: list[dict[str, object]] = []
    previous_phase: str | None = None
    for raw_line in payload.splitlines():
        try:
            parsed = json.loads(raw_line.decode("utf-8", errors="strict"))
        except (UnicodeError, json.JSONDecodeError) as error:
            raise WorkspaceSafetyError("phase log is not valid JSONL") from error
        if (
            not isinstance(parsed, dict)
            or parsed.get("phase") not in WORKER_PHASES
            or parsed.get("source") != "worker"
            or parsed.get("ordinal") != len(observations) + 1
        ):
            raise WorkspaceSafetyError("phase log violated its sequence contract")
        phase = parsed["phase"]
        assert isinstance(phase, str)
        if (
            (previous_phase, phase) not in WORKER_PHASE_EDGES
            or (
                phase == "REPLACED"
                and not any(
                    item["phase"] == "FILE_SYNC_RETURNED"
                    for item in observations
                )
            )
        ):
            raise WorkspaceSafetyError("phase log contains an illegal transition")
        observations.append(parsed)
        previous_phase = phase
    return observations


def _create_stop_request(workspace: Path, run_id: str) -> dict[str, object]:
    path = safe_workspace_path(workspace, _stop_request_name(run_id))
    if path.exists() or path.is_symlink():
        return {
            "action": "cooperative-request-already-present",
            "relative_name": path.name,
        }
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        with os.fdopen(descriptor, "wb", closefd=False) as stream:
            stream.write(b"stop-at-next-declared-safe-point\n")
            stream.flush()
            os.fsync(stream.fileno())
    finally:
        os.close(descriptor)
    return {
        "action": "cooperative-request-created",
        "relative_name": path.name,
    }


def _stop_requested(workspace: Path, run_id: str) -> bool:
    path = safe_workspace_path(workspace, _stop_request_name(run_id))
    return path.exists() and path.is_file() and not path.is_symlink()


def _sync_parent_directory(workspace: Path) -> tuple[bool, str]:
    if os.name != "posix" or not hasattr(os, "O_DIRECTORY"):
        return False, "unavailable-on-recorded-platform"
    flags = os.O_RDONLY | getattr(os, "O_DIRECTORY")
    try:
        descriptor = os.open(workspace, flags)
    except OSError as error:
        return False, f"directory-open-error:{type(error).__name__}"
    try:
        os.fsync(descriptor)
    except OSError as error:
        return False, f"directory-sync-error:{type(error).__name__}"
    finally:
        os.close(descriptor)
    return True, "directory-fsync-returned"


def _worker_run(workspace: Path, run_id: str, scenario: str) -> int:
    """Execute only inside a verified disposable child workspace."""

    root = _verified_workspace_root(workspace)
    if scenario not in ALLOWED_SCENARIOS:
        raise ValueError("unsupported scenario")
    ordinal = 1

    def phase(name: str, detail: str) -> None:
        nonlocal ordinal
        _append_worker_phase(root, run_id, name, ordinal, detail=detail)
        ordinal += 1

    phase("STARTED", "child-entry-observed")
    if scenario == "unresponsive-worker":
        while True:
            time.sleep(60)

    if scenario == "cooperative-before-stage" and _stop_requested(root, run_id):
        return COOPERATIVE_EXIT

    payload = _canonical_json_bytes(build_review_result())
    phase("ENCODED", "candidate-bytes-created")
    stage = safe_workspace_path(root, _stage_name(run_id))
    target = safe_workspace_path(root, "result.json")
    if stage.exists() or stage.is_symlink():
        raise FileExistsError("owned stage already exists")

    descriptor = os.open(
        stage,
        os.O_WRONLY | os.O_CREAT | os.O_EXCL,
        0o600,
    )
    stream = os.fdopen(descriptor, "wb")
    closed_observed = False
    staged_observed = False
    try:
        stream.write(payload)
        phase("STAGED", "candidate-passed-to-buffered-stage-stream")
        staged_observed = True
        if scenario == "hard-after-staged":
            os._exit(HARD_INJECTION_EXIT)

        validation = validate_result_bytes(payload)
        if not validation["semantic_valid"]:
            raise RuntimeError("candidate failed independent semantic oracle")
        phase("VALIDATED", "candidate-matched-independent-oracle")

        stream.flush()
        phase("PY_FLUSHED", "python-stream-flush-returned")
        if scenario == "cooperative-after-validated" and _stop_requested(
            root,
            run_id,
        ):
            stream.close()
            closed_observed = True
            phase("CLOSED", "stage-handle-close-returned-without-publication")
            return COOPERATIVE_EXIT

        if scenario == "sync-failure":
            raise OSError("injected-file-sync-failure")
        os.fsync(stream.fileno())
        phase("FILE_SYNC_RETURNED", "staging-file-fsync-returned")
        if scenario == "hard-after-file-sync":
            os._exit(HARD_INJECTION_EXIT)

        stream.close()
        closed_observed = True
        phase("CLOSED", "stage-handle-close-returned")

        if scenario == "replace-failure":
            raise OSError("injected-replace-failure")
        os.replace(stage, target)
        phase("REPLACED", "same-directory-os-replace-returned")
        if scenario == "hard-after-replace":
            os._exit(HARD_INJECTION_EXIT)

        directory_synced, directory_detail = _sync_parent_directory(root)
        if directory_synced:
            phase("DIR_SYNC_RETURNED", directory_detail)
        return 0
    finally:
        if not closed_observed:
            stream.close()
            if staged_observed:
                phase("CLOSED", "stage-handle-close-returned-during-unwind")


def _worker_entry(workspace: str, run_id: str, scenario: str) -> int:
    if os.environ.get(WORKER_CAPABILITY_ENV) != "supervisor-created-v1":
        print(
            json.dumps(
                {"category": "missing-supervisor-capability"},
                sort_keys=True,
            ),
            file=sys.stderr,
        )
        return WORKER_CAPABILITY_EXIT
    try:
        return _worker_run(Path(workspace), run_id, scenario)
    except (OSError, RuntimeError, TypeError, ValueError) as error:
        summary = {
            "category": type(error).__name__,
            "message": str(error).split(":", maxsplit=1)[0],
        }
        print(
            json.dumps(summary, sort_keys=True, allow_nan=False),
            file=sys.stderr,
        )
        return WORKER_FAILURE_EXIT


def _child_environment() -> dict[str, str]:
    environment = {
        WORKER_CAPABILITY_ENV: "supervisor-created-v1",
        "PYTHONHASHSEED": "0",
        "PYTHONUTF8": "1",
    }
    for required_on_windows in ("SYSTEMROOT", "WINDIR"):
        value = os.environ.get(required_on_windows)
        if value is not None:
            environment[required_on_windows] = value
    return environment


def _bounded_stream_record(payload: bytes) -> dict[str, object]:
    bounded = payload[:MAX_ARTIFACT_BYTES]
    category = "empty"
    if bounded:
        try:
            parsed = json.loads(bounded.decode("utf-8", errors="strict"))
        except (UnicodeError, json.JSONDecodeError):
            category = "unparsed-bounded-output"
        else:
            category = (
                str(parsed.get("category", "structured-output"))
                if isinstance(parsed, dict)
                else "structured-output"
            )
    return {
        "byte_length": len(payload),
        "captured_byte_length": len(bounded),
        "sha256": hashlib.sha256(bounded).hexdigest(),
        "category": category,
        "truncated": len(payload) > len(bounded),
        "raw_content_recorded": False,
    }


def _communicate_with_shutdown(
    child: subprocess.Popen[bytes],
    workspace: Path,
    run_id: str,
    *,
    timeout_seconds: float,
    graceful_seconds: float,
    terminate_seconds: float,
) -> tuple[bytes, bytes, list[dict[str, object]], bool]:
    actions: list[dict[str, object]] = [
        {
            "action": "wait",
            "timeout_seconds": timeout_seconds,
        }
    ]
    try:
        stdout, stderr = child.communicate(timeout=timeout_seconds)
        return stdout, stderr, actions, False
    except subprocess.TimeoutExpired:
        actions.append(_create_stop_request(workspace, run_id))
        actions.append(
            {
                "action": "wait-after-cooperative-request",
                "timeout_seconds": graceful_seconds,
            }
        )
    try:
        stdout, stderr = child.communicate(timeout=graceful_seconds)
        return stdout, stderr, actions, True
    except subprocess.TimeoutExpired:
        child.terminate()
        actions.append(
            {
                "action": "terminate-owned-child",
                "cleanup_assumed": False,
            }
        )
    try:
        stdout, stderr = child.communicate(timeout=terminate_seconds)
        return stdout, stderr, actions, True
    except subprocess.TimeoutExpired:
        child.kill()
        actions.append(
            {
                "action": "kill-owned-child",
                "cleanup_assumed": False,
            }
        )
        stdout, stderr = child.communicate()
        return stdout, stderr, actions, True


def _probe_permission_request(
    workspace: Path,
    run_id: str,
) -> dict[str, object]:
    relative_name = f".atlas-{run_id}.permission-probe"
    path = safe_workspace_path(workspace, relative_name)
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        os.write(descriptor, b"x")
        observed_mode = stat.S_IMODE(os.fstat(descriptor).st_mode)
    finally:
        os.close(descriptor)
    if path.is_symlink():
        raise WorkspaceSafetyError("permission probe unexpectedly became a symlink")
    path.unlink()
    policy = permission_policy()
    return {
        **policy,
        "observed_mode": f"0o{observed_mode:03o}",
        "probe_outcome": "creation-and-stat-returned",
        "denial_probe_outcome": (
            "unavailable-without-disposable-distinct-windows-access-token"
            if os.name == "nt"
            else "not-attempted-current-effective-identity-is-not-a-distinct-principal"
        ),
        "cleanup": "exact-owned-probe-removed",
        "enforcement_conclusion": (
            "mode-bits-observed-not-complete-principal-proof"
            if os.name == "posix"
            else "mode-observation-does-not-describe-windows-acl"
        ),
    }


def _observe_foreign_entry(entry: os.DirEntry[str]) -> dict[str, object]:
    observation: dict[str, object] = {
        "role": "foreign-temp",
        "relative_name": entry.name,
        "exists": True,
        "byte_length": None,
        "byte_length_lower_bound": None,
        "sha256": None,
        "digest_scope": "none",
        "schema_valid": False,
        "semantic_valid": False,
        "version_classification": "INVALID",
        "validation_reason": "foreign-preserved-without-following",
        "ownership_classification": "foreign",
        "policy_action": "preserve",
    }
    if entry.is_symlink():
        observation["validation_reason"] = "symlink-not-followed"
        return observation
    if not entry.is_file(follow_symlinks=False):
        observation["validation_reason"] = "not-a-regular-file"
        return observation
    try:
        with open(entry.path, "rb") as stream:
            payload = stream.read(MAX_ARTIFACT_BYTES + 1)
    except OSError as error:
        observation["validation_reason"] = f"read-error:{type(error).__name__}"
        return observation
    if len(payload) > MAX_ARTIFACT_BYTES:
        observation["byte_length_lower_bound"] = len(payload)
        observation["validation_reason"] = "exceeds-bounded-read-limit"
        return observation
    observation["byte_length"] = len(payload)
    observation["sha256"] = hashlib.sha256(payload).hexdigest()
    observation["digest_scope"] = "complete-artifact"
    validation = validate_result_bytes(payload)
    observation["schema_valid"] = validation["schema_valid"]
    observation["semantic_valid"] = validation["semantic_valid"]
    observation["version_classification"] = validation[
        "version_classification"
    ]
    observation["validation_reason"] = validation["reason"]
    return observation


def recover_workspace(
    workspace: Path | str,
    *,
    run_id: str,
) -> tuple[list[dict[str, object]], dict[str, object]]:
    """Classify target first, then temps; never promote or delete an artifact."""

    root = _verified_workspace_root(workspace)
    target = observe_artifact(
        root,
        "result.json",
        role="target",
        run_id=run_id,
    )
    stage = observe_artifact(
        root,
        _stage_name(run_id),
        role="owned-stage",
        run_id=run_id,
    )
    observations = [target, stage]
    foreign_entries: list[os.DirEntry[str]] = []
    with os.scandir(root) as entries:
        for entry in entries:
            if (
                entry.name.endswith(".tmp")
                and classify_artifact_name(entry.name, run_id=run_id) == "foreign"
            ):
                foreign_entries.append(entry)
    for entry in sorted(foreign_entries, key=lambda item: item.name):
        observations.append(_observe_foreign_entry(entry))

    if target["version_classification"] == "VALID_NEW":
        outcome = "published-valid-new"
    elif target["version_classification"] == "VALID_OLD":
        outcome = (
            "published-valid-old-with-uncommitted-valid-stage"
            if stage["version_classification"] == "VALID_NEW"
            else "published-valid-old-with-uncommitted-invalid-stage"
            if stage["exists"]
            else "published-valid-old"
        )
    elif target["exists"]:
        outcome = "invalid-target-preserved"
    elif stage["version_classification"] == "VALID_NEW":
        outcome = "uncommitted-valid-stage-preserved"
    elif stage["exists"]:
        outcome = "uncommitted-invalid-stage-preserved"
    else:
        outcome = "no-published-result"
    recovery = {
        "target_inspected_first": True,
        "outcome": outcome,
        "promotion_performed": False,
        "deletion_performed": False,
        "foreign_artifacts_preserved": sum(
            item["ownership_classification"] == "foreign"
            for item in observations
        ),
        "scope": (
            "classification from current bounded bytes and exact ownership names; "
            "exit status is not used as artifact commit evidence"
        ),
    }
    return observations, recovery


def _exit_classification(returncode: int) -> str:
    if returncode == 0:
        return "clean-exit-observed"
    if returncode == COOPERATIVE_EXIT:
        return "cooperative-exit-observed"
    if returncode == HARD_INJECTION_EXIT:
        return "child-only-hard-exit-observed"
    if returncode == WORKER_FAILURE_EXIT:
        return "worker-failure-exit-observed"
    if returncode < 0:
        return "platform-termination-status-observed"
    return "nonzero-exit-observed"


def run_scenario(
    workspace: Path | str,
    *,
    scenario: str = "normal",
    run_id: str = "atlas-run-1",
    timeout_seconds: float = 5.0,
    graceful_seconds: float = 0.2,
    terminate_seconds: float = 2.0,
) -> dict[str, object]:
    """Run exactly one owned child and build a bounded evidence packet."""

    root = _verified_workspace_root(workspace)
    run_id = _validate_run_id(run_id)
    if scenario not in ALLOWED_SCENARIOS:
        raise ValueError("unsupported scenario")
    for name, value in (
        ("timeout_seconds", timeout_seconds),
        ("graceful_seconds", graceful_seconds),
        ("terminate_seconds", terminate_seconds),
    ):
        if (
            isinstance(value, bool)
            or not isinstance(value, (int, float))
            or not math.isfinite(float(value))
            or not 0 < float(value) <= 60
        ):
            raise ValueError(f"{name} must be finite and in (0, 60]")

    for owned_name in (
        _phase_log_name(run_id),
        _stage_name(run_id),
        _stop_request_name(run_id),
        _worker_program_name(run_id),
    ):
        owned_path = safe_workspace_path(root, owned_name)
        if owned_path.exists() or owned_path.is_symlink():
            raise WorkspaceSafetyError(
                f"owned run artifact already exists: {owned_name}"
            )

    candidate_preview = _canonical_json_bytes(build_review_result())
    if candidate_preview != expected_result_bytes():
        raise RuntimeError(
            "pure transformation disagrees with the independent literal oracle"
        )
    initial_target = _ensure_known_old_target(root, run_id=run_id)
    permission = _probe_permission_request(root, run_id)
    worker_program = _copy_worker_program(root, run_id)
    shutdown_setup: list[dict[str, object]] = []
    if scenario.startswith("cooperative-"):
        shutdown_setup.append(_create_stop_request(root, run_id))

    actual_argv = [
        Path(sys.executable).name,
        _worker_program_name(run_id),
        "--worker",
        "--workspace",
        ".",
        "--run-id",
        run_id,
        "--scenario",
        scenario,
    ]
    environment = _child_environment()
    child = subprocess.Popen(
        actual_argv,
        executable=sys.executable,
        cwd=root,
        env=environment,
        stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=False,
        close_fds=True,
    )
    stdout, stderr, shutdown_actions, timeout_expired = _communicate_with_shutdown(
        child,
        root,
        run_id,
        timeout_seconds=float(timeout_seconds),
        graceful_seconds=float(graceful_seconds),
        terminate_seconds=float(terminate_seconds),
    )
    shutdown_actions = shutdown_setup + shutdown_actions
    if child.returncode is None:
        raise RuntimeError("child was not reaped")

    phases: list[dict[str, object]] = [
        {
            "ordinal": 0,
            "phase": "ADMITTED",
            "source": "supervisor",
            "detail": "validated-synthetic-job-admitted",
        }
    ]
    phases.extend(_read_worker_phases(root, run_id))
    phases.append(
        {
            "ordinal": len(phases),
            "phase": "EXITED",
            "source": "supervisor",
            "detail": "popen-communicate-returned-with-returncode",
        }
    )
    artifacts, recovery = recover_workspace(root, run_id=run_id)
    phases.append(
        {
            "ordinal": len(phases),
            "phase": "RECOVERED",
            "source": "supervisor",
            "detail": "target-first-artifact-classification-completed",
        }
    )

    observed_phase_names = [item["phase"] for item in phases]
    directory_sync_observation = (
        "returned"
        if "DIR_SYNC_RETURNED" in observed_phase_names
        else "unavailable-or-not-reached"
    )
    report: dict[str, object] = {
        "schema": SCHEMA,
        "runtime_profile": runtime_profile(),
        "platform_capabilities": {
            **platform_capabilities(),
            "directory_sync_observation": directory_sync_observation,
        },
        "application_contract": {
            "job": {
                "job_id": SYNTHETIC_JOB["job_id"],
                "concept_count": len(SYNTHETIC_JOB["records"]),
                "input_digest": hashlib.sha256(
                    _canonical_json_bytes(SYNTHETIC_JOB)
                ).hexdigest(),
            },
            "initial_target": initial_target,
            "expected_result_sha256": hashlib.sha256(
                expected_result_bytes()
            ).hexdigest(),
            "semantic_oracle_checked_before_launch": True,
            "worker_count": 1,
            "network": "none",
            "publication_protocol": (
                "same-directory-stage-validate-flush-file-sync-close-replace"
            ),
            "resource_ownership": {
                "child_process_handle": "supervisor-created-and-reaped",
                "worker_program": worker_program,
                "stage_handle": "worker-created-and-close-observation-is-a-phase",
                "stop_request": "supervisor-owned-exact-path",
                "cleanup": "no artifact deletion or promotion by recovery",
            },
            "toy_virtual_memory": {
                "address_bits": VIRTUAL_ADDRESS_BITS,
                "page_bytes": PAGE_BYTES,
                "scope": "pure teaching model, not host introspection",
            },
        },
        "run_identity": {
            "run_id": run_id,
            "child_pid_observed": child.pid,
            "child_created_by_this_supervisor": True,
            "pid_is_job_identity": False,
        },
        "process_launch": {
            "argv": actual_argv,
            "argv_exact_as_passed": True,
            "argv_shape_sha256": hashlib.sha256(
                _canonical_json_bytes(actual_argv)
            ).hexdigest(),
            "executable": {
                "name": Path(sys.executable).name,
                "selected_from": "current-runtime-sys.executable",
                "absolute_path_recorded": False,
            },
            "shell": False,
            "cwd": ".",
            "environment": {
                "allowed_key_names": sorted(environment),
                "values_recorded": False,
                "inherits_unspecified_values": False,
            },
            "stdin": "DEVNULL",
            "stdout": "PIPE-bounded-after-exit",
            "stderr": "PIPE-bounded-after-exit",
            "timeout_seconds": float(timeout_seconds),
        },
        "phase_definitions": PHASE_DEFINITIONS,
        "phase_observations": phases,
        "exit_observation": {
            "returncode": child.returncode,
            "classification": _exit_classification(child.returncode),
            "waited": True,
            "reaped": child.poll() is not None,
            "timeout_expired": timeout_expired,
            "shutdown_actions": shutdown_actions,
            "stdout": _bounded_stream_record(stdout),
            "stderr": _bounded_stream_record(stderr),
            "artifact_commit_inferred": False,
        },
        "artifact_observations": artifacts,
        "permission_probe": permission,
        "scenario": {
            "name": scenario,
            "injection_is_child_only": scenario.startswith("hard-"),
            "one_supervisor_one_worker": True,
        },
        "recovery_classification": recovery,
        "claim_boundaries": {
            "direct_observations": [
                "documented subprocess API return and raw return code",
                "ordered phase records persisted by the owned child",
                "bounded bytes, digests, schema validity, and exact-name ownership",
                "creation-mode request and post-creation stat result",
            ],
            "supported_inferences": [
                "the fixed semantic result did or did not match its oracle",
                "the target and stage can be classified independently of exit",
                "forcible shutdown cannot be treated as cleanup evidence",
            ],
            "never_promote_to_claim": [
                "file sync proves universal power-loss durability",
                "replacement is a multi-file transaction or multi-writer solution",
                "a separate child is a sandbox",
                "an exit code proves whether the result committed",
                "a virtual-memory page is a Python object or cache line",
            ],
            "module_boundaries": {
                "M19": "threads, interleavings, locks, races, GIL, parallelism",
                "M20": "network protocols, sockets, framing, retries",
                "M21": (
                    "async task cancellation, backpressure, and distributed "
                    "completion uncertainty"
                ),
                "M24": "CPython object layout, GC, allocation, profiling",
            },
        },
        "unknowns": [
            "scheduler decisions and runnable latency",
            "virtual-page residency and page-fault history",
            "OS page-cache state",
            "physical-device writes, controller caches, and power-loss outcome",
            "unobserved filesystem implementation details",
        ],
        "next_falsification_steps": [
            "repeat the same scenario in a fresh disposable workspace",
            "compare exit and artifact matrices across named fault phases",
            "run platform-specific durability probes only under their own contract",
            "challenge each causal sentence with an alternative owner or mechanism",
        ],
        "agent_review": {
            "status": "reference-behavior-requires-human-claim-review",
            "changed_scope": "two Module 18 work files only",
            "prohibited_expansions": [
                "concurrency",
                "networking",
                "production data",
                "arbitrary process signaling",
                "runtime profiling",
            ],
        },
    }
    json.dumps(report, sort_keys=True, allow_nan=False)
    return report


def _render_human(report: Mapping[str, object]) -> str:
    exit_observation = report["exit_observation"]
    recovery = report["recovery_classification"]
    scenario = report["scenario"]
    assert isinstance(exit_observation, Mapping)
    assert isinstance(recovery, Mapping)
    assert isinstance(scenario, Mapping)
    return "\n".join(
        (
            "ATLAS · MODULE 18 · OS EVIDENCE",
            f"schema: {report['schema']}",
            f"scenario: {scenario['name']}",
            f"exit: {exit_observation['classification']} "
            f"(raw {exit_observation['returncode']})",
            f"artifacts: {recovery['outcome']}",
            "",
            "Boundary: exit evidence and artifact evidence are independent. "
            "Use --json for the complete bounded packet.",
        )
    )


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run the bounded Module 18 one-worker OS evidence lab."
    )
    parser.add_argument(
        "--scenario",
        choices=sorted(ALLOWED_SCENARIOS),
        default="normal",
    )
    parser.add_argument("--run-id", default="atlas-run-1")
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--worker", action="store_true", help=argparse.SUPPRESS)
    parser.add_argument("--workspace", default=None, help=argparse.SUPPRESS)
    return parser


def main(argv: list[str] | None = None) -> int:
    arguments = _parser().parse_args(argv)
    if arguments.worker:
        if arguments.workspace is None:
            raise SystemExit("worker requires its supervisor-provided workspace")
        return _worker_entry(
            arguments.workspace,
            arguments.run_id,
            arguments.scenario,
        )
    if arguments.self_test:
        import unittest

        suite = unittest.defaultTestLoader.discover(
            start_dir=Path(__file__).resolve().parent,
            pattern="test_module18_reference.py",
        )
        if suite.countTestCases() == 0:
            print(
                "No tests found. Download test_module18_reference.py beside "
                "module18_reference.py.",
                file=sys.stderr,
            )
            return 2
        result = unittest.TextTestRunner(verbosity=2).run(suite)
        return 0 if result.wasSuccessful() else 1
    with tempfile.TemporaryDirectory(prefix="atlas-module18-") as directory:
        workspace = initialize_disposable_workspace(Path(directory))
        report = run_scenario(
            workspace,
            scenario=arguments.scenario,
            run_id=arguments.run_id,
        )
        if arguments.json:
            print(json.dumps(report, indent=2, sort_keys=True, allow_nan=False))
        else:
            print(_render_human(report))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
