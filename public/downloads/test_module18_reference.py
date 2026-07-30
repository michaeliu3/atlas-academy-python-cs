"""Adversarial public-interface tests for the Module 18 reference."""

from __future__ import annotations

import tempfile
import unittest
import json
import os
import platform
import subprocess
import sys
from pathlib import Path

import module18_reference as reference


class Module18ReferenceTests(unittest.TestCase):
    def test_schema_and_phase_vocabulary_are_versioned_and_canonical(self) -> None:
        self.assertEqual(reference.SCHEMA, "atlas.module18.os-evidence.v1")
        self.assertEqual(
            reference.PHASES,
            (
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
            ),
        )

    def test_toy_vm_splits_a_16_bit_address_and_applies_permissions(self) -> None:
        table = {
            0x12: reference.PageTableEntry(
                frame_number=0xAB,
                readable=True,
                writable=False,
                executable=False,
            ),
            0x99: reference.PageTableEntry(
                frame_number=None,
                valid=True,
                present=False,
                readable=True,
                file_backed=True,
            ),
            0xFE: reference.PageTableEntry(
                frame_number=None,
                valid=False,
                present=False,
                readable=False,
            ),
        }
        mapped = reference.translate_virtual_address(0x1234, table, access="read")
        self.assertEqual(mapped.status, "MAPPED")
        self.assertTrue(mapped.valid_mapping)
        self.assertFalse(mapped.file_backed)
        self.assertEqual(mapped.virtual_page, 0x12)
        self.assertEqual(mapped.offset, 0x34)
        self.assertEqual(mapped.physical_address, 0xAB34)

        denied = reference.translate_virtual_address(0x1234, table, access="write")
        self.assertEqual(denied.status, "PROTECTION_FAULT")
        self.assertIsNone(denied.physical_address)

        not_present = reference.translate_virtual_address(
            0x9934,
            table,
            access="read",
        )
        self.assertEqual(not_present.status, "NOT_PRESENT")
        self.assertTrue(not_present.valid_mapping)
        self.assertTrue(not_present.file_backed)
        self.assertIsNone(not_present.physical_address)

        for address in (0xFE34, 0xDD34):
            with self.subTest(address=address):
                invalid = reference.translate_virtual_address(
                    address,
                    table,
                    access="read",
                )
                self.assertEqual(invalid.status, "INVALID_MAPPING")
                self.assertFalse(invalid.valid_mapping)
                self.assertFalse(invalid.file_backed)
                self.assertIsNone(invalid.physical_address)

    def test_toy_vm_rejects_values_outside_its_declared_model(self) -> None:
        with self.assertRaises(ValueError):
            reference.translate_virtual_address(0x1_0000, {}, access="read")
        with self.assertRaises(TypeError):
            reference.translate_virtual_address(True, {}, access="read")
        with self.assertRaises(ValueError):
            reference.PageTableEntry(frame_number=256)
        with self.assertRaises(ValueError):
            reference.PageTableEntry(
                frame_number=1,
                valid=False,
                present=True,
            )
        with self.assertRaises(ValueError):
            reference.PageTableEntry(
                frame_number=None,
                valid=False,
                present=False,
                file_backed=True,
            )
        with self.assertRaises(ValueError):
            reference.PageTableEntry(
                frame_number=None,
                valid=True,
                present=True,
            )
        with self.assertRaises(ValueError):
            reference.PageTableEntry(
                frame_number=1,
                valid=True,
                present=False,
            )
        with self.assertRaises(ValueError):
            reference.translate_virtual_address(0, {}, access="delete")

    def test_safe_path_requires_a_marked_workspace_and_rejects_escape(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            workspace = Path(directory)
            with self.assertRaises(reference.WorkspaceSafetyError):
                reference.safe_workspace_path(workspace, "result.json")

            reference.initialize_disposable_workspace(workspace)
            self.assertEqual(
                reference.safe_workspace_path(workspace, "nested/result.json"),
                workspace.resolve() / "nested" / "result.json",
            )
            for unsafe in ("../outside.json", "/absolute.json", ".", ""):
                with self.subTest(unsafe=unsafe):
                    with self.assertRaises(reference.WorkspaceSafetyError):
                        reference.safe_workspace_path(workspace, unsafe)

    def test_safe_path_is_symlink_aware_when_host_can_create_symlinks(self) -> None:
        with (
            tempfile.TemporaryDirectory() as directory,
            tempfile.TemporaryDirectory() as outside_directory,
        ):
            workspace = Path(directory)
            reference.initialize_disposable_workspace(workspace)
            link = workspace / "escape-link"
            try:
                link.symlink_to(Path(outside_directory), target_is_directory=True)
            except OSError:
                self.skipTest("host does not permit an unprivileged symlink")
            with self.assertRaises(reference.WorkspaceSafetyError):
                reference.safe_workspace_path(workspace, "escape-link/payload.json")

            outside_marker = Path(outside_directory) / "marker.txt"
            outside_marker.write_text(
                reference.WORKSPACE_MARKER_TEXT,
                encoding="utf-8",
            )
            marker = workspace / reference.WORKSPACE_MARKER
            marker.unlink()
            marker.symlink_to(outside_marker)
            with self.assertRaises(reference.WorkspaceSafetyError):
                reference._verified_workspace_root(workspace)

    def test_worker_phase_log_rejects_forged_or_illegal_transitions(self) -> None:
        invalid_sequences = (
            ("REPLACED",),
            ("STARTED", "REPLACED"),
            ("STARTED", "EXITED"),
            ("STARTED", "ENCODED", "STARTED"),
            ("STARTED", "VALIDATED"),
            ("STARTED", "ENCODED", "PY_FLUSHED"),
            ("STARTED", "ENCODED", "STAGED", "FILE_SYNC_RETURNED"),
            (
                "STARTED",
                "ENCODED",
                "STAGED",
                "VALIDATED",
                "FILE_SYNC_RETURNED",
            ),
            ("STARTED", "ENCODED", "STAGED", "CLOSED", "REPLACED"),
        )
        for index, sequence in enumerate(invalid_sequences, start=1):
            with self.subTest(sequence=sequence):
                with tempfile.TemporaryDirectory() as directory:
                    workspace = Path(directory)
                    reference.initialize_disposable_workspace(workspace)
                    run_id = f"phase-{index}"
                    log = workspace / reference._phase_log_name(run_id)
                    records = [
                        {
                            "ordinal": ordinal,
                            "phase": phase,
                            "source": "worker",
                            "detail": "forged-test-record",
                        }
                        for ordinal, phase in enumerate(sequence, start=1)
                    ]
                    log.write_bytes(
                        b"".join(
                            reference._canonical_json_bytes(record)
                            for record in records
                        )
                    )
                    with self.assertRaises(reference.WorkspaceSafetyError):
                        reference._read_worker_phases(workspace, run_id)

        valid_sequences = (
            ("STARTED",),
            ("STARTED", "ENCODED"),
            ("STARTED", "ENCODED", "STAGED"),
            ("STARTED", "ENCODED", "STAGED", "CLOSED"),
            ("STARTED", "ENCODED", "STAGED", "VALIDATED", "CLOSED"),
            (
                "STARTED",
                "ENCODED",
                "STAGED",
                "VALIDATED",
                "PY_FLUSHED",
                "CLOSED",
            ),
            (
                "STARTED",
                "ENCODED",
                "STAGED",
                "VALIDATED",
                "PY_FLUSHED",
                "FILE_SYNC_RETURNED",
                "CLOSED",
                "REPLACED",
            ),
            (
                "STARTED",
                "ENCODED",
                "STAGED",
                "VALIDATED",
                "PY_FLUSHED",
                "FILE_SYNC_RETURNED",
                "CLOSED",
                "REPLACED",
                "DIR_SYNC_RETURNED",
            ),
        )
        for index, sequence in enumerate(valid_sequences, start=1):
            with self.subTest(sequence=sequence):
                with tempfile.TemporaryDirectory() as directory:
                    workspace = Path(directory)
                    reference.initialize_disposable_workspace(workspace)
                    run_id = f"valid-phase-{index}"
                    log = workspace / reference._phase_log_name(run_id)
                    log.write_bytes(
                        b"".join(
                            reference._canonical_json_bytes(
                                {
                                    "ordinal": ordinal,
                                    "phase": phase,
                                    "source": "worker",
                                    "detail": "valid-test-record",
                                }
                            )
                            for ordinal, phase in enumerate(sequence, start=1)
                        )
                    )
                    self.assertEqual(
                        [
                            item["phase"]
                            for item in reference._read_worker_phases(
                                workspace,
                                run_id,
                            )
                        ],
                        list(sequence),
                    )

    def test_artifact_ownership_is_exact_not_name_like(self) -> None:
        self.assertEqual(
            reference.classify_artifact_name(
                ".atlas-run-7.result.tmp",
                run_id="run-7",
            ),
            "owned_stage",
        )
        for name in (
            ".atlas-run-70.result.tmp",
            ".atlas-run-7.result.tmp.bak",
            "someone-else.tmp",
            "result.json",
        ):
            with self.subTest(name=name):
                expected = "owned_target" if name == "result.json" else "foreign"
                self.assertEqual(
                    reference.classify_artifact_name(name, run_id="run-7"),
                    expected,
                )

    def test_synthetic_result_has_a_literal_independent_oracle(self) -> None:
        expected = (
            b'{"concept_count":4,"due_concepts":'
            b'["durable-publication","virtual-memory"],'
            b'"generation":2,"job_id":"atlas-review-001",'
            b'"schema":"atlas.synthetic-review-result.v1"}\n'
        )
        self.assertEqual(reference.expected_result_bytes(), expected)
        self.assertEqual(
            reference._canonical_json_bytes(reference.build_review_result()),
            expected,
        )
        validation = reference.validate_result_bytes(expected)
        self.assertTrue(validation["schema_valid"])
        self.assertTrue(validation["semantic_valid"])
        self.assertEqual(validation["version_classification"], "VALID_NEW")
        self.assertEqual(
            validation["reason"],
            "matches-independent-new-result-oracle",
        )

        changed = json.loads(expected)
        changed["due_concepts"] = ["process-lifecycle"]
        invalid = json.dumps(
            changed,
            sort_keys=True,
            separators=(",", ":"),
        ).encode("utf-8") + b"\n"
        self.assertFalse(reference.validate_result_bytes(invalid)["semantic_valid"])

        old = reference.validate_result_bytes(reference.known_old_result_bytes())
        self.assertTrue(old["schema_valid"])
        self.assertFalse(old["semantic_valid"])
        self.assertEqual(old["version_classification"], "VALID_OLD")

    def test_synthetic_job_rejects_invalid_confidence_identity_and_duplicates(
        self,
    ) -> None:
        with self.assertRaises(ValueError):
            reference.build_review_result(
                {
                    "job_id": "atlas-review-001",
                    "records": (
                        {"concept_id": "vm", "confidence_milli": 1001},
                    ),
                }
            )
        with self.assertRaises(TypeError):
            reference.build_review_result(
                {
                    "job_id": "atlas-review-001",
                    "records": (
                        {"concept_id": "vm", "confidence_milli": True},
                    ),
                }
            )
        with self.assertRaises(ValueError):
            reference.build_review_result(
                {
                    "job_id": "atlas-review-001",
                    "records": (
                        {"concept_id": "vm", "confidence_milli": 500},
                        {"concept_id": "vm", "confidence_milli": 600},
                    ),
                }
            )
        with self.assertRaises(ValueError):
            reference.build_review_result(
                {
                    "job_id": "atlas-review-001",
                    "records": (
                        {"concept_id": "../vm", "confidence_milli": 500},
                    ),
                }
            )

    def test_artifact_observation_keeps_ownership_and_validity_separate(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            workspace = Path(directory)
            reference.initialize_disposable_workspace(workspace)
            (workspace / "foreign.tmp").write_bytes(reference.expected_result_bytes())
            observation = reference.observe_artifact(
                workspace,
                "foreign.tmp",
                role="candidate",
                run_id="observe-1",
            )
            self.assertEqual(observation["ownership_classification"], "foreign")
            self.assertTrue(observation["semantic_valid"])
            self.assertEqual(observation["policy_action"], "preserve")
            self.assertEqual(observation["digest_scope"], "complete-artifact")

            oversized = workspace / "oversized.tmp"
            oversized.write_bytes(b"x" * (reference.MAX_ARTIFACT_BYTES + 1))
            bounded = reference.observe_artifact(
                workspace,
                "oversized.tmp",
                role="candidate",
                run_id="observe-1",
            )
            self.assertEqual(
                bounded["byte_length_lower_bound"],
                reference.MAX_ARTIFACT_BYTES + 1,
            )
            self.assertIsNone(bounded["byte_length"])
            self.assertIsNone(bounded["sha256"])
            self.assertEqual(bounded["digest_scope"], "none")
            self.assertEqual(
                bounded["validation_reason"],
                "exceeds-bounded-read-limit",
            )

    def test_permission_policy_does_not_translate_modes_into_windows_acls(self) -> None:
        windows = reference.permission_policy(platform_name="Windows")
        self.assertEqual(windows["requested_creation_mode"], "0o600")
        self.assertEqual(windows["enforcement_model"], "windows-acl-not-inferred")
        self.assertFalse(windows["mode_proves_least_authority"])

        posix = reference.permission_policy(platform_name="Linux")
        self.assertEqual(posix["enforcement_model"], "posix-mode-bits-subject-to-umask")
        self.assertFalse(posix["mode_proves_least_authority"])

    def test_timeouts_must_be_finite_positive_and_bounded(self) -> None:
        for invalid in (float("nan"), float("inf"), 0.0, -1.0, 61.0, True):
            with self.subTest(invalid=invalid):
                with tempfile.TemporaryDirectory() as directory:
                    workspace = Path(directory)
                    reference.initialize_disposable_workspace(workspace)
                    with self.assertRaises(ValueError):
                        reference.run_scenario(
                            workspace,
                            run_id="timeout-invalid",
                            timeout_seconds=invalid,
                        )

    def test_normal_supervised_run_records_launch_phases_exit_and_artifacts(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            workspace = Path(directory)
            reference.initialize_disposable_workspace(workspace)
            foreign = workspace / "foreign.tmp"
            foreign.write_bytes(b"do not touch")

            report = reference.run_scenario(
                workspace,
                scenario="normal",
                run_id="normal-1",
                timeout_seconds=5.0,
            )

            required = {
                "schema",
                "runtime_profile",
                "platform_capabilities",
                "application_contract",
                "run_identity",
                "process_launch",
                "phase_definitions",
                "phase_observations",
                "exit_observation",
                "artifact_observations",
                "permission_probe",
                "scenario",
                "recovery_classification",
                "claim_boundaries",
                "unknowns",
                "next_falsification_steps",
                "agent_review",
            }
            self.assertEqual(set(report), required)
            self.assertEqual(report["schema"], reference.SCHEMA)
            self.assertEqual(
                report["runtime_profile"]["python_version"],
                platform.python_version(),
            )
            self.assertEqual(report["process_launch"]["shell"], False)
            self.assertEqual(report["process_launch"]["cwd"], ".")
            self.assertTrue(report["process_launch"]["argv_exact_as_passed"])
            self.assertTrue(
                all(
                    not Path(token).is_absolute()
                    for token in report["process_launch"]["argv"]
                    if token not in {"--worker", "--workspace", "--run-id", "--scenario"}
                    and not token.startswith("normal")
                )
            )
            self.assertNotIn("{", "".join(report["process_launch"]["argv"]))
            self.assertFalse(
                report["process_launch"]["environment"]["values_recorded"]
            )
            self.assertIn(
                "denial_probe_outcome",
                report["permission_probe"],
            )
            self.assertIn(
                "M21",
                report["claim_boundaries"]["module_boundaries"],
            )
            self.assertTrue(report["exit_observation"]["waited"])
            self.assertTrue(report["exit_observation"]["reaped"])
            self.assertEqual(report["exit_observation"]["returncode"], 0)

            observed_phases = [
                item["phase"] for item in report["phase_observations"]
            ]
            expected_core = [
                "ADMITTED",
                "STARTED",
                "ENCODED",
                "STAGED",
                "VALIDATED",
                "PY_FLUSHED",
                "FILE_SYNC_RETURNED",
                "CLOSED",
                "REPLACED",
            ]
            self.assertEqual(observed_phases[: len(expected_core)], expected_core)
            self.assertEqual(observed_phases[-2:], ["EXITED", "RECOVERED"])
            self.assertEqual(
                [item["ordinal"] for item in report["phase_observations"]],
                list(range(len(report["phase_observations"]))),
            )

            target = next(
                item
                for item in report["artifact_observations"]
                if item["role"] == "target"
            )
            self.assertTrue(target["semantic_valid"])
            self.assertEqual(target["ownership_classification"], "owned_target")
            self.assertEqual(
                report["recovery_classification"]["outcome"],
                "published-valid-new",
            )
            self.assertEqual(target["version_classification"], "VALID_NEW")
            self.assertEqual(
                report["application_contract"]["initial_target"][
                    "version_classification"
                ],
                "VALID_OLD",
            )
            self.assertFalse(report["recovery_classification"]["promotion_performed"])
            self.assertTrue(foreign.exists())
            self.assertEqual(foreign.read_bytes(), b"do not touch")

            encoded = json.dumps(report, sort_keys=True, allow_nan=False)
            self.assertNotIn(str(workspace), encoded)
            self.assertNotIn("shell=True", encoded)

    def test_fault_matrix_keeps_exit_and_artifact_evidence_independent(self) -> None:
        cases = {
            "cooperative-before-stage": (
                reference.COOPERATIVE_EXIT,
                "published-valid-old",
                {"STARTED"},
                {"STAGED", "REPLACED"},
            ),
            "cooperative-after-validated": (
                reference.COOPERATIVE_EXIT,
                "published-valid-old-with-uncommitted-valid-stage",
                {"VALIDATED", "PY_FLUSHED", "CLOSED"},
                {"FILE_SYNC_RETURNED", "REPLACED"},
            ),
            "hard-after-staged": (
                reference.HARD_INJECTION_EXIT,
                "published-valid-old-with-uncommitted-invalid-stage",
                {"STAGED"},
                {"PY_FLUSHED", "REPLACED"},
            ),
            "hard-after-file-sync": (
                reference.HARD_INJECTION_EXIT,
                "published-valid-old-with-uncommitted-valid-stage",
                {"FILE_SYNC_RETURNED"},
                {"CLOSED", "REPLACED"},
            ),
            "hard-after-replace": (
                reference.HARD_INJECTION_EXIT,
                "published-valid-new",
                {"REPLACED"},
                set(),
            ),
            "sync-failure": (
                reference.WORKER_FAILURE_EXIT,
                "published-valid-old-with-uncommitted-valid-stage",
                {"PY_FLUSHED", "CLOSED"},
                {"FILE_SYNC_RETURNED", "REPLACED"},
            ),
            "replace-failure": (
                reference.WORKER_FAILURE_EXIT,
                "published-valid-old-with-uncommitted-valid-stage",
                {"FILE_SYNC_RETURNED", "CLOSED"},
                {"REPLACED"},
            ),
        }
        for index, (
            scenario,
            (expected_exit, expected_artifact, required, forbidden),
        ) in enumerate(cases.items(), start=1):
            with self.subTest(scenario=scenario):
                with tempfile.TemporaryDirectory() as directory:
                    workspace = Path(directory)
                    reference.initialize_disposable_workspace(workspace)
                    report = reference.run_scenario(
                        workspace,
                        scenario=scenario,
                        run_id=f"case-{index}",
                        timeout_seconds=5.0,
                    )
                    self.assertEqual(
                        report["exit_observation"]["returncode"],
                        expected_exit,
                    )
                    self.assertEqual(
                        report["recovery_classification"]["outcome"],
                        expected_artifact,
                    )
                    names = {
                        item["phase"] for item in report["phase_observations"]
                    }
                    self.assertTrue(required <= names)
                    self.assertTrue(forbidden.isdisjoint(names))
                    self.assertFalse(
                        report["exit_observation"]["artifact_commit_inferred"]
                    )
                    self.assertFalse(
                        report["recovery_classification"]["promotion_performed"]
                    )
                    self.assertFalse(
                        report["recovery_classification"]["deletion_performed"]
                    )

    def test_unresponsive_owned_child_is_requested_waited_terminated_and_reaped(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            workspace = Path(directory)
            reference.initialize_disposable_workspace(workspace)
            report = reference.run_scenario(
                workspace,
                scenario="unresponsive-worker",
                run_id="timeout-1",
                timeout_seconds=0.25,
                graceful_seconds=0.05,
                terminate_seconds=2.0,
            )
            exit_observation = report["exit_observation"]
            self.assertTrue(exit_observation["timeout_expired"])
            self.assertTrue(exit_observation["waited"])
            self.assertTrue(exit_observation["reaped"])
            actions = [item["action"] for item in exit_observation["shutdown_actions"]]
            self.assertEqual(actions[0], "wait")
            self.assertIn("cooperative-request-created", actions)
            self.assertIn("wait-after-cooperative-request", actions)
            self.assertIn("terminate-owned-child", actions)
            self.assertFalse(
                next(
                    item
                    for item in exit_observation["shutdown_actions"]
                    if item["action"] == "terminate-owned-child"
                )["cleanup_assumed"]
            )

    def test_recovery_preserves_foreign_and_owned_temps_without_promotion(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            workspace = Path(directory)
            reference.initialize_disposable_workspace(workspace)
            foreign = workspace / "foreign.tmp"
            foreign.write_bytes(reference.expected_result_bytes())
            owned = workspace / ".atlas-recovery-1.result.tmp"
            owned.write_bytes(reference.expected_result_bytes())
            oversized_foreign = workspace / "oversized-foreign.tmp"
            oversized_foreign.write_bytes(
                b"x" * (reference.MAX_ARTIFACT_BYTES + 1)
            )

            artifacts, recovery = reference.recover_workspace(
                workspace,
                run_id="recovery-1",
            )
            self.assertEqual(
                recovery["outcome"],
                "uncommitted-valid-stage-preserved",
            )
            self.assertTrue(recovery["target_inspected_first"])
            self.assertFalse(recovery["promotion_performed"])
            self.assertFalse(recovery["deletion_performed"])
            self.assertTrue(owned.exists())
            self.assertTrue(foreign.exists())
            self.assertTrue(oversized_foreign.exists())
            self.assertEqual(
                {
                    item["ownership_classification"]
                    for item in artifacts
                    if item["relative_name"].endswith(".tmp")
                },
                {"owned_stage", "foreign"},
            )
            oversized_observation = next(
                item
                for item in artifacts
                if item["relative_name"] == oversized_foreign.name
            )
            self.assertEqual(
                oversized_observation["byte_length_lower_bound"],
                reference.MAX_ARTIFACT_BYTES + 1,
            )
            self.assertIsNone(oversized_observation["byte_length"])
            self.assertIsNone(oversized_observation["sha256"])
            self.assertEqual(oversized_observation["digest_scope"], "none")
            self.assertEqual(
                oversized_observation["validation_reason"],
                "exceeds-bounded-read-limit",
            )

    def test_invalid_target_is_not_replaced_by_a_valid_temp_during_recovery(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            workspace = Path(directory)
            reference.initialize_disposable_workspace(workspace)
            target = workspace / "result.json"
            target.write_bytes(b"{broken")
            stage = workspace / ".atlas-recovery-2.result.tmp"
            stage.write_bytes(reference.expected_result_bytes())
            _, recovery = reference.recover_workspace(
                workspace,
                run_id="recovery-2",
            )
            self.assertEqual(recovery["outcome"], "invalid-target-preserved")
            self.assertEqual(target.read_bytes(), b"{broken")
            self.assertTrue(stage.exists())

    def test_json_cli_emits_one_parseable_evidence_packet(self) -> None:
        completed = subprocess.run(
            [
                sys.executable,
                str(Path(reference.__file__).resolve()),
                "--json",
                "--scenario",
                "normal",
                "--run-id",
                "cli-1",
            ],
            cwd=Path(reference.__file__).resolve().parent,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=False,
            timeout=10,
            check=False,
        )
        self.assertEqual(completed.returncode, 0, completed.stderr.decode())
        report = json.loads(completed.stdout)
        self.assertEqual(report["schema"], reference.SCHEMA)
        self.assertEqual(report["exit_observation"]["returncode"], 0)
        self.assertEqual(
            report["recovery_classification"]["outcome"],
            "published-valid-new",
        )

    def test_hidden_worker_mode_refuses_missing_supervisor_capability(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            workspace = Path(directory)
            reference.initialize_disposable_workspace(workspace)
            environment = dict(os.environ)
            environment.pop("ATLAS_MODULE18_OWNED_CHILD", None)
            completed = subprocess.run(
                [
                    sys.executable,
                    str(Path(reference.__file__).resolve()),
                    "--worker",
                    "--workspace",
                    str(workspace),
                    "--run-id",
                    "direct-1",
                    "--scenario",
                    "hard-after-staged",
                ],
                env=environment,
                stdin=subprocess.DEVNULL,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=False,
                timeout=5,
                check=False,
            )
            self.assertEqual(
                completed.returncode,
                reference.WORKER_CAPABILITY_EXIT,
            )
            self.assertFalse((workspace / ".atlas-direct-1.result.tmp").exists())
            self.assertFalse((workspace / "result.json").exists())


if __name__ == "__main__":
    unittest.main(verbosity=2)
