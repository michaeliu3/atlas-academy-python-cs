"""Behavioral tests for the Module 22 local trust-boundary reference."""

from __future__ import annotations

import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import module22_reference as model


class TraceClaimScenarioTests(unittest.TestCase):
    def test_trace_claim_is_not_authenticated_identity(self) -> None:
        packet = model.run_scenario("trace_claim_only")

        self.assertEqual(packet["scenario"], "trace_claim_only")
        self.assertEqual(packet["input_trace_label"], "INPUT_CLAIM")
        self.assertEqual(packet["authorization_outcome"], "DENIED_AUTHENTICATION")
        self.assertEqual(packet["remote_outcome"], "UNKNOWN_REMOTE")
        self.assertEqual(
            packet["limitations"],
            "local model; not a live security assessment",
        )


class ParsingSeamTests(unittest.TestCase):
    def test_unknown_input_field_is_rejected_before_authority_is_evaluated(self) -> None:
        supplied = model.fixture_request()
        supplied["unreviewed_flag"] = "present"

        with self.assertRaises(model.InvalidImporterRequest):
            model.parse_importer_request(supplied)

    def test_oversized_input_is_rejected_before_any_authority_check(self) -> None:
        supplied = model.fixture_request()
        supplied["source_label"] = "x" * 129

        with self.assertRaises(model.InvalidImporterRequest):
            model.parse_importer_request(supplied)


class AuthoritySeamTests(unittest.TestCase):
    def test_exact_fixture_subject_and_tuple_can_reach_only_a_model_plan(self) -> None:
        parsed = model.parse_importer_request(model.fixture_request())
        authentication = model.verify_fixture_assertion(
            parsed,
            model.fixture_assertion_for(parsed),
        )
        decision = model.authorize_effect(
            parsed,
            authentication,
            model.fixture_authority_context(),
        )

        self.assertEqual(authentication.outcome, "AUTHENTICATED_MODEL")
        self.assertEqual(decision.outcome, "PERMITTED_MODEL_PLAN")
        self.assertEqual(decision.effect_scope, "FAKE_ADAPTER_PLAN_ONLY")


class ArchivePolicySeamTests(unittest.TestCase):
    def test_metadata_policy_rejects_escape_before_any_filesystem_adapter(self) -> None:
        inspection = model.inspect_archive_metadata(
            (
                model.ArchiveMember("../outside.txt", "file", 8),
            )
        )

        self.assertEqual(inspection.outcome, "REJECTED_ARCHIVE_POLICY")
        self.assertEqual(inspection.adapter_called, False)
        self.assertEqual(inspection.reason, "member path is outside declared destination")

    def test_windows_drive_unc_and_non_string_paths_reject_without_crashing(self) -> None:
        for path in ("C:/outside.txt", "\\\\server\\share\\item.txt", 17):
            with self.subTest(path=path):
                inspection = model.inspect_archive_metadata(
                    (model.ArchiveMember(path, "file", 8),)  # type: ignore[arg-type]
                )
                self.assertEqual(inspection.outcome, "REJECTED_ARCHIVE_POLICY")
                self.assertEqual(inspection.adapter_called, False)


class QueryPlanSeamTests(unittest.TestCase):
    def test_query_value_is_bound_separately_from_fixed_statement_structure(self) -> None:
        plan = model.build_parameterized_query_plan("intro-python")

        self.assertEqual(
            plan.statement,
            "SELECT record_id FROM atlas_records WHERE label = :label",
        )
        self.assertEqual(plan.parameters, {"label": "intro-python"})
        self.assertNotIn("intro-python", plan.statement)
        self.assertEqual(plan.connection_opened, False)


class TransformAdapterSeamTests(unittest.TestCase):
    def test_only_approved_enum_creates_fake_transform_plan(self) -> None:
        request = model.parse_importer_request(model.fixture_request())
        decision = model.authorize_effect(
            request,
            model.verify_fixture_assertion(request, model.fixture_assertion_for(request)),
            model.fixture_authority_context(),
        )
        plan = model.authorize_transform_adapter(
            decision,
            "normalize_text",
            "catalog",
        )

        self.assertEqual(plan.outcome, "APPROVED_FAKE_TRANSFORM_PLAN")
        self.assertEqual(plan.operation, "normalize_text")
        self.assertEqual(plan.process_started, False)


class ReleaseProvenanceSeamTests(unittest.TestCase):
    def test_missing_controls_defer_release_without_claiming_install_or_publish(self) -> None:
        review = model.review_release_manifest(
            {
                "has_local_hash": False,
                "source_distribution_reviewed": False,
                "publisher_identity_declared": False,
                "build_provenance_declared": False,
            }
        )

        self.assertEqual(review.outcome, "DEFERRED_RELEASE_REVIEW")
        self.assertEqual(
            review.missing,
            (
                "local_hash",
                "source_distribution_review",
                "publisher_identity",
                "build_provenance",
            ),
        )
        self.assertEqual(review.package_installed, False)


class EvidenceRedactionSeamTests(unittest.TestCase):
    def test_public_packet_retains_reason_and_unknown_without_raw_sensitive_fields(self) -> None:
        packet = model.redact_incident_evidence(
            {
                "scenario": "incident_unknown",
                "trace_id": "trace-fixture-17",
                "assertion": "fixture-mac-never-exported",
                "query_label": "intro-python",
                "authorization_outcome": "DENIED_AUTHENTICATION",
            }
        )

        self.assertEqual(packet["evidence_scope"], "REDACTED_LOCAL_EVIDENCE")
        self.assertEqual(packet["authorization_outcome"], "DENIED_AUTHENTICATION")
        self.assertEqual(packet["remote_outcome"], "UNKNOWN_REMOTE")
        self.assertNotIn("assertion", packet)
        self.assertNotIn("query_label", packet)
        self.assertNotIn("trace-fixture-17", repr(packet))


class TransportReviewSeamTests(unittest.TestCase):
    def test_tls_configuration_review_is_static_and_requires_peer_identity_checks(self) -> None:
        review = model.review_tls_configuration(
            {
                "verify_peer": True,
                "check_hostname": False,
                "ca_source": "declared-ca-set",
            }
        )

        self.assertEqual(review.outcome, "REJECTED_TLS_CONFIGURATION")
        self.assertEqual(review.reason, "hostname verification is required")
        self.assertEqual(review.connection_attempted, False)


class ResumeStateSeamTests(unittest.TestCase):
    def test_general_python_object_resume_state_is_rejected_before_loader(self) -> None:
        review = model.review_resume_state_format("python-object")

        self.assertEqual(review.outcome, "REJECTED_RESUME_FORMAT")
        self.assertEqual(review.loader_called, False)
        self.assertEqual(review.reason, "only primitive-json fixture state is accepted")


class IncidentReconstructionSeamTests(unittest.TestCase):
    def test_timeout_preserves_remote_unknown_and_requires_new_authorized_check(self) -> None:
        assessment = model.reconstruct_incident(True, "DENIED_AUTHENTICATION")

        self.assertEqual(
            assessment.facts,
            ("local timeout observed", "authentication denial observed"),
        )
        self.assertEqual(
            assessment.unknowns,
            ("remote importer effect after timeout",),
        )
        self.assertEqual(assessment.status_check_requires_authorization, True)


class ScenarioBoundaryTests(unittest.TestCase):
    def test_public_cli_scenarios_are_fixed_and_archive_case_remains_local_only(self) -> None:
        self.assertEqual(
            model.SCENARIOS,
            (
                "trace_claim_only",
                "authentication_tenant_mismatch",
                "retry_subject_mismatch",
                "untrusted_resume_state",
                "archive_policy_rejects",
                "parameterized_value_binding",
                "transform_denied",
                "fixture_hmac_mismatch",
                "tls_configuration_review",
                "audit_hook_boundary",
                "dependency_provenance_gap",
                "privacy_accessibility_review",
                "incident_unknown",
            ),
        )
        packet = model.run_scenario("archive_policy_rejects")

        self.assertEqual(packet["adapter_outcome"], "REJECTED_ARCHIVE_POLICY")
        self.assertEqual(packet["real_effect"], "NO_EFFECT")


class ExpandedBehaviorTests(unittest.TestCase):
    def test_digest_binds_canonical_request_meaning_without_assertion_material(self) -> None:
        first = model.parse_importer_request(model.fixture_request())
        changed = model.fixture_request()
        changed["resource"] = "guide-043"
        second = model.parse_importer_request(changed)

        self.assertTrue(model.request_digest(first).startswith("sha256:"))
        self.assertNotEqual(model.request_digest(first), model.request_digest(second))
        self.assertNotIn(b"assertion", model.canonical_request_bytes(first))

    def test_assertion_for_one_request_does_not_authenticate_changed_meaning(self) -> None:
        original = model.parse_importer_request(model.fixture_request())
        assertion = model.fixture_assertion_for(original)
        changed = model.fixture_request()
        changed["action"] = "read"
        altered = model.parse_importer_request(changed)

        self.assertEqual(
            model.verify_fixture_assertion(altered, assertion).outcome,
            "DENIED_AUTHENTICATION",
        )

    def test_exact_authenticated_subject_is_denied_for_other_tenant(self) -> None:
        supplied = model.fixture_request()
        supplied["tenant"] = "other-tenant"
        request = model.parse_importer_request(supplied)
        decision = model.authorize_effect(
            request,
            model.verify_fixture_assertion(request, model.fixture_assertion_for(request)),
            model.fixture_authority_context(),
        )

        self.assertEqual(decision.outcome, "DENIED_AUTHORIZATION")
        self.assertEqual(decision.effect_scope, "NO_EFFECT")

    def test_safe_archive_metadata_is_only_an_approved_plan(self) -> None:
        inspection = model.inspect_archive_metadata(
            (model.ArchiveMember("lesson.txt", "file", 16),)
        )

        self.assertEqual(inspection.outcome, "APPROVED_ARCHIVE_METADATA_PLAN")
        self.assertEqual(inspection.adapter_called, False)

    def test_disallowed_transform_never_starts_process(self) -> None:
        denied = model.authorize_transform_adapter(
            model.AuthorizationDecision(
                "DENIED_AUTHORIZATION",
                "fixture deny",
                "NO_EFFECT",
            ),
            "shell",
            "catalog",
        )

        self.assertEqual(denied.outcome, "DENIED_TRANSFORM_POLICY")
        self.assertEqual(denied.process_started, False)

    def test_complete_release_review_is_still_only_a_plan(self) -> None:
        review = model.review_release_manifest(
            {
                "has_local_hash": True,
                "source_distribution_reviewed": True,
                "publisher_identity_declared": True,
                "build_provenance_declared": True,
            }
        )

        self.assertEqual(review.outcome, "REVIEWED_RELEASE_PLAN")
        self.assertEqual(review.package_installed, False)

    def test_complete_tls_configuration_review_still_does_not_connect(self) -> None:
        review = model.review_tls_configuration(
            {
                "verify_peer": True,
                "check_hostname": True,
                "ca_source": "declared-ca-set",
            }
        )

        self.assertEqual(review.outcome, "REVIEWED_TLS_CONFIGURATION")
        self.assertEqual(review.connection_attempted, False)

    def test_audit_hook_is_observation_not_containment(self) -> None:
        assessment = model.assess_audit_hook_proposal()

        self.assertEqual(assessment.evidence_label, "LOCAL_OBSERVATION")
        self.assertEqual(assessment.containment_claim, "NOT_A_SANDBOX")

    def test_privacy_accessibility_review_rejects_raw_retention_and_colour_only_status(self) -> None:
        review = model.review_privacy_accessibility(
            {
                "retains_raw_secret": True,
                "uses_colour_only": True,
                "keyboard_focus_visible": False,
                "contrast_reviewed": False,
            }
        )

        self.assertEqual(review.outcome, "REJECTED_USER_IMPACT_REVIEW")
        self.assertIn("raw secret retention", review.issues)
        self.assertIn("colour-only status", review.issues)

    def test_all_public_scenarios_are_redacted_local_no_effect_packets(self) -> None:
        for scenario in model.SCENARIOS:
            with self.subTest(scenario=scenario):
                packet = model.run_scenario(scenario)
                self.assertEqual(packet["scenario"], scenario)
                self.assertEqual(packet["real_effect"], "NO_EFFECT")
                self.assertEqual(packet["limitations"], model.LIMITATION)
                self.assertNotIn("fixture-mac", repr(packet))

    def test_scenario_runner_refuses_any_name_outside_the_fixed_safety_boundary(self) -> None:
        with self.assertRaises(ValueError):
            model.run_scenario("user-supplied-target")

    def test_redaction_rejects_free_form_values_in_retained_fields(self) -> None:
        with self.assertRaises(ValueError):
            model.redact_incident_evidence(
                {
                    "scenario": "raw-secret-value",
                    "authorization_outcome": "DENIED_AUTHENTICATION",
                }
            )
        with self.assertRaises(ValueError):
            model.redact_incident_evidence(
                {
                    "scenario": "incident_unknown",
                    "authorization_outcome": "raw-token-value",
                }
            )

    def test_second_fixture_subject_can_authenticate_but_not_borrow_worker17_authority(self) -> None:
        request = model.parse_importer_request(model.fixture_request())
        authentication = model.verify_fixture_assertion(
            request,
            model.fixture_assertion_for(request, subject="worker-99"),
        )
        decision = model.authorize_effect(
            request,
            authentication,
            model.fixture_authority_context(),
        )

        self.assertEqual(authentication.outcome, "AUTHENTICATED_MODEL")
        self.assertEqual(decision.outcome, "DENIED_AUTHORIZATION")

    def test_incident_records_the_exact_local_decision_category(self) -> None:
        authentication_denial = model.reconstruct_incident(True, "DENIED_AUTHENTICATION")
        authorization_denial = model.reconstruct_incident(True, "DENIED_AUTHORIZATION")
        permitted_plan = model.reconstruct_incident(False, "PERMITTED_MODEL_PLAN")

        self.assertIn("authentication denial observed", authentication_denial.facts)
        self.assertIn("policy denial observed", authorization_denial.facts)
        self.assertIn("permitted model plan observed", permitted_plan.facts)

    def test_all_scenarios_emit_the_closed_evidence_schema(self) -> None:
        expected_fields = {
            "schema_version",
            "model_version",
            "run_id",
            "scenario",
            "request_digest",
            "parser_outcome",
            "authentication_outcome",
            "authorization_outcome",
            "adapter_outcome",
            "release_outcome",
            "input_trace_label",
            "trace_scope",
            "policy_version",
            "privacy_accessibility_outcome",
            "evidence_scope",
            "escalation_owner",
            "facts",
            "hypotheses",
            "unknowns",
            "remote_outcome",
            "real_effect",
            "limitations",
        }
        for scenario in model.SCENARIOS:
            with self.subTest(scenario=scenario):
                packet = model.run_scenario(scenario)
                self.assertEqual(set(packet), expected_fields)
                self.assertEqual(packet["schema_version"], model.EVIDENCE_SCHEMA_VERSION)
                self.assertEqual(packet["model_version"], model.MODEL_VERSION)
                self.assertTrue(packet["request_digest"].startswith("sha256:"))
                self.assertNotIn("fixture-mac", repr(packet))
                self.assertNotIn("raw-secret", repr(packet))
                self.assertNotIn("raw-token", repr(packet))

    def test_reference_excludes_real_io_and_unsafe_deserializer_imports(self) -> None:
        source = Path(model.__file__).read_text(encoding="utf-8")

        for prohibited in (
            "import socket",
            "import subprocess",
            "import pickle",
            "import marshal",
            "import sqlite3",
            "import tarfile",
            "import zipfile",
            "urllib.request",
            "http.client",
        ):
            with self.subTest(prohibited=prohibited):
                self.assertNotIn(prohibited, source)


if __name__ == "__main__":
    unittest.main()
