"""Behavioral seams for the deterministic Module 26 release-evidence model."""

from __future__ import annotations

from dataclasses import replace
import unittest

import module26_reference as model


class ReleaseContractTests(unittest.TestCase):
    def test_default_contract_is_a_valid_bounded_release_brief(self) -> None:
        self.assertIsNone(model.validate_release_contract(model.DEFAULT_CONTRACT))

    def test_contract_requires_an_explicit_non_goal(self) -> None:
        with self.assertRaisesRegex(model.ContractError, "non-goal"):
            model.validate_release_contract(replace(model.DEFAULT_CONTRACT, non_goals=()))

    def test_contract_requires_a_human_release_owner(self) -> None:
        with self.assertRaisesRegex(model.ContractError, "human release owner"):
            model.validate_release_contract(replace(model.DEFAULT_CONTRACT, owner="agent"))

    def test_agent_aliases_never_count_as_release_or_rollback_owners(self) -> None:
        for field in ("owner", "rollback_owner"):
            for alias in ("AI agent", "LLM", "automation"):
                with self.subTest(field=field, alias=alias):
                    with self.assertRaisesRegex(model.ContractError, "declared human fixture role"):
                        model.validate_release_contract(
                            replace(model.DEFAULT_CONTRACT, **{field: alias})
                        )

    def test_contract_requires_a_synthetic_data_boundary(self) -> None:
        with self.assertRaisesRegex(model.ContractError, "synthetic-data boundary"):
            model.validate_release_contract(
                replace(model.DEFAULT_CONTRACT, data_boundary="all learner data is available")
            )

    def test_contract_requires_human_and_no_automatic_authority_terms(self) -> None:
        with self.assertRaisesRegex(model.ContractError, "no-automatic-mutation"):
            model.validate_release_contract(
                replace(model.DEFAULT_CONTRACT, authority_boundary="the policy may decide")
            )

    def test_candidate_and_known_good_versions_must_differ(self) -> None:
        with self.assertRaisesRegex(model.ContractError, "distinguishable"):
            model.validate_release_contract(
                replace(
                    model.DEFAULT_CONTRACT,
                    known_good_version=model.DEFAULT_CONTRACT.source_version,
                )
            )

    def test_contract_rejects_a_broad_production_readiness_claim(self) -> None:
        with self.assertRaisesRegex(model.ContractError, "broader"):
            model.validate_release_contract(
                replace(model.DEFAULT_CONTRACT, claim="This is production-ready for everyone.")
            )


class DependencyTraceTests(unittest.TestCase):
    def test_release_gate_trace_is_dependency_first_and_cross_layer(self) -> None:
        trace = model.trace_dependency_closure("release-gate")
        self.assertEqual(trace.ordered_node_ids[-1], "release-gate")
        self.assertIn("purpose", trace.layers)
        self.assertIn("trust", trace.layers)
        self.assertIn("release", trace.layers)

    def test_unknown_root_is_rejected(self) -> None:
        with self.assertRaisesRegex(model.DependencyError, "unknown root"):
            model.trace_dependency_closure("imaginary-root")

    def test_duplicate_node_identifier_is_rejected(self) -> None:
        duplicate = replace(model.DEFAULT_SYSTEM_NODES[0], label="Duplicate purpose")
        with self.assertRaisesRegex(model.DependencyError, "unique"):
            model.trace_dependency_closure("release-gate", model.DEFAULT_SYSTEM_NODES + (duplicate,))

    def test_missing_dependency_is_rejected(self) -> None:
        broken = replace(model.DEFAULT_SYSTEM_NODES[-1], dependencies=("not-a-node",))
        nodes = model.DEFAULT_SYSTEM_NODES[:-1] + (broken,)
        with self.assertRaisesRegex(model.DependencyError, "unknown dependency"):
            model.trace_dependency_closure("release-gate", nodes)

    def test_cycle_is_rejected_instead_of_silently_traced(self) -> None:
        purpose = replace(model.DEFAULT_SYSTEM_NODES[0], dependencies=("release-gate",))
        nodes = (purpose,) + model.DEFAULT_SYSTEM_NODES[1:]
        with self.assertRaisesRegex(model.DependencyError, "cycle"):
            model.trace_dependency_closure("release-gate", nodes)

    def test_node_without_an_owner_or_contract_is_rejected(self) -> None:
        broken = replace(model.DEFAULT_SYSTEM_NODES[3], owner="")
        nodes = model.DEFAULT_SYSTEM_NODES[:3] + (broken,) + model.DEFAULT_SYSTEM_NODES[4:]
        with self.assertRaisesRegex(model.DependencyError, "owner and contract"):
            model.trace_dependency_closure("release-gate", nodes)


class IncidentReplayTests(unittest.TestCase):
    def test_retry_is_deduplicated_by_the_named_idempotency_key(self) -> None:
        replay = model.replay_incident(model.RETRY_SCENARIO)
        self.assertTrue(replay.invariant_holds)
        self.assertEqual(replay.observed_records, 1)
        self.assertEqual(replay.duplicate_suppressed, 1)
        self.assertEqual(replay.outcome, model.INVARIANT_HELD)

    def test_partial_failure_recovery_uses_the_same_key(self) -> None:
        replay = model.replay_incident(model.PARTIAL_FAILURE_SCENARIO)
        self.assertTrue(replay.invariant_holds)
        self.assertEqual(replay.expected_records, 1)
        self.assertEqual(replay.duplicate_suppressed, 1)

    def test_disabling_deduplication_exposes_the_duplicate_record_failure(self) -> None:
        replay = model.replay_incident(model.RETRY_SCENARIO, deduplicate=False)
        self.assertFalse(replay.invariant_holds)
        self.assertEqual(replay.observed_records, 2)
        self.assertEqual(replay.outcome, model.INVARIANT_BROKEN)

    def test_authority_crossing_is_recorded_but_never_executed(self) -> None:
        replay = model.replay_incident(model.UNSAFE_MUTATION_SCENARIO)
        self.assertFalse(replay.invariant_holds)
        self.assertEqual(replay.observed_records, 0)
        self.assertEqual(replay.attempted_state_mutations, 1)
        self.assertEqual(replay.steps[0].disposition, "rejected-authority-crossing")

    def test_event_without_an_idempotency_key_is_rejected(self) -> None:
        malformed = model.IncidentScenario(
            "missing-key",
            "A malformed fixture.",
            (model.IncidentEvent("event", "", "received"),),
            1,
        )
        with self.assertRaisesRegex(model.ContractError, "idempotency key"):
            model.replay_incident(malformed)


class EvidenceLedgerTests(unittest.TestCase):
    def test_default_claims_have_named_scope_matched_evidence(self) -> None:
        ledger = model.evaluate_claim_ledger(model.DEFAULT_CLAIMS, model.DEFAULT_ARTIFACTS)
        self.assertEqual(ledger.status, model.LEDGER_ACCEPTED)
        self.assertEqual(set(ledger.supported_claim_ids), {claim.claim_id for claim in model.DEFAULT_CLAIMS})
        self.assertEqual(ledger.gaps, ())

    def test_missing_artifact_keeps_the_gap_visible(self) -> None:
        claim = replace(model.DEFAULT_CLAIMS[0], artifact_ids=("missing-proof",))
        ledger = model.evaluate_claim_ledger((claim,), model.DEFAULT_ARTIFACTS)
        self.assertEqual(ledger.status, model.LEDGER_REVISE)
        self.assertIn("missing artifact", ledger.gaps[0])

    def test_scope_mismatch_is_not_hidden_by_an_unrelated_artifact(self) -> None:
        claim = replace(model.DEFAULT_CLAIMS[0], required_scope=("real-users",))
        ledger = model.evaluate_claim_ledger((claim,), model.DEFAULT_ARTIFACTS)
        self.assertEqual(ledger.status, model.LEDGER_REVISE)
        self.assertIn("evidence lacks scope", ledger.gaps[0])

    def test_artifact_from_a_different_version_cannot_support_the_claim(self) -> None:
        artifact = replace(model.DEFAULT_ARTIFACTS[0], source_version="other-version")
        artifacts = (artifact,) + model.DEFAULT_ARTIFACTS[1:]
        ledger = model.evaluate_claim_ledger(
            (model.DEFAULT_CLAIMS[0],),
            artifacts,
            candidate_source_version=model.CAPSTONE_SOURCE_VERSION,
        )
        self.assertEqual(ledger.status, model.LEDGER_REVISE)
        self.assertIn("source version", " ".join(ledger.gaps))

    def test_blank_artifact_metadata_cannot_be_accepted_as_evidence(self) -> None:
        empty = replace(
            model.DEFAULT_ARTIFACTS[0],
            kind="",
            observation="",
            limitation="",
        )
        artifacts = (empty,) + model.DEFAULT_ARTIFACTS[1:]
        ledger = model.evaluate_claim_ledger(
            (model.DEFAULT_CLAIMS[0],),
            artifacts,
            candidate_source_version=model.CAPSTONE_SOURCE_VERSION,
        )
        self.assertEqual(ledger.status, model.LEDGER_REVISE)
        self.assertIn("kind must be named", " ".join(ledger.gaps))
        self.assertIn("observation must be named", " ".join(ledger.gaps))
        self.assertIn("limitation must be named", " ".join(ledger.gaps))

    def test_claim_without_a_limitation_is_rejected(self) -> None:
        claim = replace(model.DEFAULT_CLAIMS[0], limitation="")
        with self.assertRaisesRegex(model.LedgerError, "limitation"):
            model.evaluate_claim_ledger((claim,), model.DEFAULT_ARTIFACTS)

    def test_broad_claim_is_rejected_before_evidence_is_counted(self) -> None:
        claim = replace(model.DEFAULT_CLAIMS[0], statement="This version is secure for all users.")
        with self.assertRaisesRegex(model.LedgerError, "broad claim"):
            model.evaluate_claim_ledger((claim,), model.DEFAULT_ARTIFACTS)


class ChangeReviewTests(unittest.TestCase):
    def test_agent_proposal_needs_and_receives_independent_human_review(self) -> None:
        review = model.review_change_request(model.SAFE_AGENT_PROPOSAL)
        self.assertEqual(review.outcome, model.CHANGE_APPROVED)
        self.assertIn("independent human verification of the agent proposal", review.required_checks)
        self.assertIn("neither reads", review.limitation)

    def test_unauthorized_data_field_is_a_hard_rejection(self) -> None:
        request = replace(model.SAFE_AGENT_PROPOSAL, requested_data_fields=("raw_learner_notes",))
        review = model.review_change_request(request)
        self.assertEqual(review.outcome, model.CHANGE_REJECTED)
        self.assertIn("unauthorized data", " ".join(review.reasons))

    def test_deployment_request_is_a_hard_rejection(self) -> None:
        request = replace(model.SAFE_AGENT_PROPOSAL, requested_actions=("deploy",))
        review = model.review_change_request(request)
        self.assertEqual(review.outcome, model.CHANGE_REJECTED)
        self.assertIn("external authority/action", " ".join(review.reasons))

    def test_unknown_or_alias_external_action_is_a_hard_rejection(self) -> None:
        request = replace(
            model.SAFE_AGENT_PROPOSAL,
            requested_actions=("delete_production_data",),
        )
        review = model.review_change_request(request)
        self.assertEqual(review.outcome, model.CHANGE_REJECTED)
        self.assertIn("delete_production_data", " ".join(review.reasons))

    def test_missing_human_reviewer_requires_revision(self) -> None:
        request = replace(model.SAFE_AGENT_PROPOSAL, reviewer=None)
        review = model.review_change_request(request)
        self.assertEqual(review.outcome, model.CHANGE_REVISE)
        self.assertIn("human review", " ".join(review.reasons))

    def test_missing_test_and_rollback_require_revision(self) -> None:
        request = replace(model.SAFE_AGENT_PROPOSAL, test_ids=(), rollback_version=None)
        review = model.review_change_request(request)
        self.assertEqual(review.outcome, model.CHANGE_REVISE)
        self.assertIn("rollback", " ".join(review.reasons))
        self.assertIn("test", " ".join(review.reasons))

    def test_agent_cannot_be_the_approving_reviewer(self) -> None:
        request = replace(model.SAFE_AGENT_PROPOSAL, reviewer="agent")
        review = model.review_change_request(request)
        self.assertEqual(review.outcome, model.CHANGE_REVISE)
        self.assertIn("declared human fixture role", " ".join(review.reasons))

    def test_agent_aliases_never_count_as_human_review(self) -> None:
        for alias in ("AI agent", "LLM", "automation"):
            with self.subTest(alias=alias):
                review = model.review_change_request(
                    replace(model.SAFE_AGENT_PROPOSAL, reviewer=alias)
                )
                self.assertEqual(review.outcome, model.CHANGE_REVISE)
                self.assertIn("aliases do not count", " ".join(review.reasons))

    def test_unknown_proposer_kind_never_bypasses_agent_boundary(self) -> None:
        review = model.review_change_request(
            replace(model.SAFE_AGENT_PROPOSAL, proposer_kind="LLM")
        )
        self.assertEqual(review.outcome, model.CHANGE_REVISE)
        self.assertIn("proposer kind", " ".join(review.reasons))


class ReleaseDecisionTests(unittest.TestCase):
    def test_complete_synthetic_packet_yields_only_a_recommendation_to_release(self) -> None:
        decision = model.decide_release(model.default_packet())
        self.assertEqual(decision.outcome, model.RELEASE)
        self.assertEqual(decision.evidence_gaps, ())
        self.assertIn("does not deploy", decision.limitation)

    def test_missing_raw_human_impact_record_requires_revision(self) -> None:
        packet = replace(
            model.default_packet(),
            claims=tuple(
                claim for claim in model.DEFAULT_CLAIMS if claim.claim_id != "human-impact-boundary"
            ),
            artifacts=tuple(
                artifact
                for artifact in model.DEFAULT_ARTIFACTS
                if artifact.kind != "human-impact-review"
            ),
        )
        decision = model.decide_release(packet)
        self.assertEqual(decision.outcome, model.REVISE)
        self.assertIn("human-impact", " ".join(decision.evidence_gaps))

    def test_broken_candidate_is_deferred_before_release(self) -> None:
        broken = replace(model.RETRY_SCENARIO, expected_records=2)
        packet = replace(model.default_packet(), incident_scenarios=(broken,))
        decision = model.decide_release(packet)
        self.assertEqual(decision.outcome, model.DEFER)
        self.assertIn(model.RETRY_SCENARIO.scenario_id, " ".join(decision.reasons))

    def test_broken_invariant_in_a_released_version_recommends_rollback(self) -> None:
        packet = replace(
            model.default_packet(currently_released=True),
            incident_scenarios=(model.UNSAFE_MUTATION_SCENARIO,),
        )
        decision = model.decide_release(packet)
        self.assertEqual(decision.outcome, model.ROLLBACK)
        self.assertIn("not a deployment command", decision.limitation)

    def test_ledger_gap_requires_revision(self) -> None:
        packet = replace(
            model.default_packet(),
            claims=(
                replace(model.DEFAULT_CLAIMS[0], artifact_ids=("not-recorded",)),
            )
            + model.DEFAULT_CLAIMS[1:],
        )
        decision = model.decide_release(packet)
        self.assertEqual(decision.outcome, model.REVISE)
        self.assertIn("not-recorded", " ".join(decision.evidence_gaps))

    def test_rejected_change_requires_revision(self) -> None:
        packet = replace(
            model.default_packet(),
            change_request=replace(
                model.SAFE_AGENT_PROPOSAL, requested_actions=("write_schedule",)
            ),
        )
        decision = model.decide_release(packet)
        self.assertEqual(decision.outcome, model.REVISE)
        self.assertIn(model.CHANGE_REJECTED, " ".join(decision.evidence_gaps))

    def test_source_version_mismatch_is_visible(self) -> None:
        packet = replace(model.default_packet(), source_version="wrong-version")
        decision = model.decide_release(packet)
        self.assertEqual(decision.outcome, model.REVISE)
        self.assertIn("source version", " ".join(decision.evidence_gaps))

    def test_stale_raw_claims_and_artifacts_cannot_support_the_candidate(self) -> None:
        stale_claims = tuple(
            replace(claim, source_version=model.KNOWN_GOOD_SOURCE_VERSION)
            for claim in model.DEFAULT_CLAIMS
        )
        stale_artifacts = tuple(
            replace(artifact, source_version=model.KNOWN_GOOD_SOURCE_VERSION)
            for artifact in model.DEFAULT_ARTIFACTS
        )
        packet = replace(
            model.default_packet(), claims=stale_claims, artifacts=stale_artifacts
        )
        decision = model.decide_release(packet)
        self.assertEqual(decision.outcome, model.REVISE)
        self.assertIn("does not match the candidate", " ".join(decision.evidence_gaps))

    def test_change_target_must_match_the_contract_candidate(self) -> None:
        packet = replace(
            model.default_packet(),
            change_request=replace(
                model.SAFE_AGENT_PROPOSAL,
                target_version="atlas-capstone/synthetic-v3",
            ),
        )
        decision = model.decide_release(packet)
        self.assertEqual(decision.outcome, model.REVISE)
        self.assertIn("target version", " ".join(decision.evidence_gaps))

    def test_packet_contains_raw_dossier_material_not_cached_verdicts(self) -> None:
        packet = model.default_packet()
        self.assertFalse(hasattr(packet, "ledger"))
        self.assertFalse(hasattr(packet, "change_review"))
        self.assertFalse(hasattr(packet, "human_impact_observed"))

    def test_decision_does_not_mutate_the_fixed_packet(self) -> None:
        before = model.default_packet()
        model.decide_release(before)
        after = model.default_packet()
        self.assertEqual(before, after)


if __name__ == "__main__":
    unittest.main()
