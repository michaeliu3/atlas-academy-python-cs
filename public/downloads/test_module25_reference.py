"""Behavioral seams for Module 25's deterministic decision-support model."""

from __future__ import annotations

from contextlib import redirect_stderr, redirect_stdout
from io import StringIO
from pathlib import Path
import json
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
import module25_reference as model


class DecisionContractSeamTests(unittest.TestCase):
    def test_default_contract_is_valid_and_minimized(self) -> None:
        model.validate_contract(model.DEFAULT_CONTRACT)

        self.assertEqual(
            model.DEFAULT_CONTRACT.allowed_fields,
            ("completed_modules", "low_confidence_modules", "days_since_review"),
        )

    def test_automatic_schedule_mutation_is_rejected(self) -> None:
        contract = model.DecisionContract(
            **{**model.DEFAULT_CONTRACT.__dict__, "automatic_mutation_allowed": True}
        )

        with self.assertRaisesRegex(model.ContractError, "may not mutate"):
            model.validate_contract(contract)

    def test_missing_human_override_is_rejected(self) -> None:
        contract = model.DecisionContract(
            **{**model.DEFAULT_CONTRACT.__dict__, "human_override_required": False}
        )

        with self.assertRaisesRegex(model.ContractError, "meaningful human override"):
            model.validate_contract(contract)

    def test_unauthorized_identity_like_field_is_rejected(self) -> None:
        contract = model.DecisionContract(
            **{
                **model.DEFAULT_CONTRACT.__dict__,
                "allowed_fields": ("completed_modules", "display_name"),
            }
        )

        with self.assertRaisesRegex(model.ContractError, "unauthorized field"):
            model.validate_contract(contract)

    def test_wrong_purpose_is_rejected_even_when_other_fields_look_valid(self) -> None:
        contract = model.DecisionContract(
            **{**model.DEFAULT_CONTRACT.__dict__, "purpose": "maximize engagement"}
        )

        with self.assertRaisesRegex(model.ContractError, "declared optional study-action purpose"):
            model.validate_contract(contract)


class TransparentRankingSeamTests(unittest.TestCase):
    def setUp(self) -> None:
        self.state = model.MinimalLearnerState(
            completed_modules=frozenset({1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24}),
            low_confidence_modules=frozenset({16}),
            days_since_review={5: 1, 16: 2, 24: 13},
        )

    def test_fixed_candidate_set_is_versioned_and_not_generated_by_text(self) -> None:
        candidates = model.fixed_candidates(model.DEFAULT_CONTRACT)

        self.assertEqual(len(candidates), 3)
        self.assertEqual(candidates[0].candidate_id, "repair-cost-model")
        self.assertEqual(model.DEFAULT_CONTRACT.candidate_set_version, "atlas-next-actions/synthetic-v1")

    def test_low_confidence_prerequisite_is_ranked_before_due_review(self) -> None:
        ranked = model.rank_transparent_baseline(model.DEFAULT_CONTRACT, self.state)

        self.assertEqual(ranked[0].candidate.candidate_id, "trace-transaction-invariant")
        self.assertGreater(ranked[0].score, ranked[-1].score)
        self.assertIn("low-confidence", ranked[0].candidate.reason_kind)

    def test_incomplete_prerequisite_has_an_explicit_trace_reason(self) -> None:
        state = model.MinimalLearnerState(
            completed_modules=frozenset({1, 2, 3, 4}),
            low_confidence_modules=frozenset(),
            days_since_review={},
        )
        ranked = model.rank_transparent_baseline(model.DEFAULT_CONTRACT, state)

        cost = next(item for item in ranked if item.candidate.candidate_id == "repair-cost-model")
        self.assertIn("a declared prerequisite is incomplete", cost.reasons)

    def test_ties_use_stable_candidate_identifier_order(self) -> None:
        state = model.MinimalLearnerState(
            completed_modules=frozenset({5, 16, 24}),
            low_confidence_modules=frozenset(),
            days_since_review={},
        )

        ranked = model.rank_transparent_baseline(model.DEFAULT_CONTRACT, state)
        self.assertEqual(
            tuple(item.candidate.candidate_id for item in ranked),
            ("repair-cost-model", "retrieve-runtime-limits", "trace-transaction-invariant"),
        )

    def test_ranked_item_carries_policy_and_candidate_set_versions(self) -> None:
        item = model.rank_transparent_baseline(model.DEFAULT_CONTRACT, self.state)[0]

        self.assertEqual(item.policy_version, model.DEFAULT_CONTRACT.policy_version)
        self.assertEqual(item.candidate_set_version, model.DEFAULT_CONTRACT.candidate_set_version)


class SuggestionAndControlSeamTests(unittest.TestCase):
    def setUp(self) -> None:
        state = model.MinimalLearnerState(
            completed_modules=frozenset({5, 16, 24}),
            low_confidence_modules=frozenset({16}),
            days_since_review={16: 11},
        )
        self.ranked = model.rank_transparent_baseline(model.DEFAULT_CONTRACT, state)[0]
        self.suggestion = model.render_suggestion(model.DEFAULT_CONTRACT, self.ranked)

    def test_suggestion_is_an_ordinal_score_not_a_probability_or_command(self) -> None:
        self.assertTrue(self.suggestion.requires_human_action)
        self.assertIn("not a probability", self.suggestion.limitation)
        self.assertIn("schedule change", self.suggestion.limitation)

    def test_explanation_is_readable_and_derived_from_the_policy(self) -> None:
        self.assertTrue(self.suggestion.explanation)
        self.assertIn("low-confidence", " ".join(self.suggestion.explanation))

    def test_version_mismatch_blocks_rendering(self) -> None:
        stale = model.RankedCandidate(
            candidate=self.ranked.candidate,
            score=self.ranked.score,
            reasons=self.ranked.reasons,
            policy_version="different-policy/v0",
            candidate_set_version=self.ranked.candidate_set_version,
        )

        with self.assertRaisesRegex(model.ContractError, "policy version"):
            model.render_suggestion(model.DEFAULT_CONTRACT, stale)

    def test_only_named_human_responses_are_recorded(self) -> None:
        response = model.record_user_response(self.suggestion, "dismiss")

        self.assertEqual(response["response"], "dismiss")
        self.assertIn("no schedule", response["effect"])
        with self.assertRaisesRegex(model.ContractError, "accept, dismiss, or defer"):
            model.record_user_response(self.suggestion, "run now")

    def test_recording_feedback_does_not_change_the_suggestion_or_state(self) -> None:
        before = self.suggestion
        model.record_user_response(self.suggestion, "accept")

        self.assertEqual(self.suggestion, before)


class DataAndEvaluationSeamTests(unittest.TestCase):
    def test_feature_after_outcome_is_temporal_leakage(self) -> None:
        rows = (model.TrainingRow("leak", 8, 8, 1, ("completed_modules",)),)

        with self.assertRaisesRegex(model.DataContractError, "precede its outcome"):
            model.validate_training_rows(rows, split_day=8)

    def test_feature_after_decision_cutoff_is_rejected(self) -> None:
        rows = (model.TrainingRow("late", 9, 11, 1, ("completed_modules",)),)

        with self.assertRaisesRegex(model.DataContractError, "after the declared decision cutoff"):
            model.validate_training_rows(rows, split_day=8)

    def test_unauthorized_raw_field_is_rejected_before_training(self) -> None:
        rows = (model.TrainingRow("raw", 2, 5, 1, ("private_notes",)),)

        with self.assertRaisesRegex(model.DataContractError, "unauthorized feature"):
            model.validate_training_rows(rows, split_day=3)

    def test_time_split_keeps_later_outcomes_held_out(self) -> None:
        rows = (
            model.TrainingRow("train", 1, 3, 0, ("completed_modules",)),
            model.TrainingRow("test", 4, 8, 1, ("days_since_review",)),
        )
        train, held_out = model.temporal_split(rows, evaluation_after_day=3)

        self.assertEqual(tuple(row.row_id for row in train), ("train",))
        self.assertEqual(tuple(row.row_id for row in held_out), ("test",))

    def test_evaluation_card_has_denominators_and_threshold_tradeoff(self) -> None:
        card = model.evaluate_held_out(
            (
                model.ScoredOutcome("a", 0.9, 1, "A"),
                model.ScoredOutcome("b", 0.8, 0, "A"),
                model.ScoredOutcome("c", 0.2, 1, "B"),
                model.ScoredOutcome("d", 0.1, 0, "B"),
            ),
            threshold=0.7,
        )

        self.assertEqual((card.total, card.positives, card.negatives), (4, 2, 2))
        self.assertEqual((card.selected, card.true_positive, card.false_positive, card.false_negative), (2, 1, 1, 1))
        self.assertEqual(card.precision, 0.5)
        self.assertEqual(card.recall, 0.5)

    def test_evaluation_card_refuses_to_call_uncalibrated_scores_probabilities(self) -> None:
        card = model.evaluate_held_out(
            (model.ScoredOutcome("only", 0.8, 1, "A"),),
            threshold=0.5,
        )

        self.assertFalse(card.calibration_supported)
        self.assertIn("calibration", card.limitation)


class AgentBoundaryAndScenarioTests(unittest.TestCase):
    def test_agent_action_request_is_rejected_without_tool_execution(self) -> None:
        review = model.review_agent_proposal(
            model.AgentProposal("write it", ("fixture://source",), ("write_schedule",), "agent/v1")
        )

        self.assertEqual(review.outcome, model.AGENT_PROPOSAL_REJECTED)
        self.assertIn("no tool", review.reason)

    def test_attributed_cited_proposal_is_still_only_reviewable(self) -> None:
        review = model.review_agent_proposal(
            model.AgentProposal("draft", ("fixture://source",), (), "agent/v1")
        )

        self.assertEqual(review.outcome, model.AGENT_PROPOSAL_REVIEW)
        self.assertIn("human review", review.reason)

    def test_fixed_scenarios_cover_each_boundary_without_dynamic_input(self) -> None:
        self.assertEqual(
            model.SCENARIOS,
            (
                "reject_contract",
                "reject_leakage",
                "baseline_suggestion",
                "score_not_probability",
                "evaluation_card",
                "human_override",
                "reject_agent_action",
                "review_agent_proposal",
            ),
        )
        with self.assertRaisesRegex(ValueError, "unknown fixed scenario"):
            model.run_scenario("browse a real learner profile")

    def test_fixed_packets_keep_their_labels_and_limits(self) -> None:
        self.assertEqual(model.run_scenario("reject_contract")["outcome"], model.CONTRACT_REJECTED)
        self.assertEqual(model.run_scenario("reject_leakage")["outcome"], model.LEAKAGE_REJECTED)
        self.assertEqual(model.run_scenario("baseline_suggestion")["outcome"], model.BASELINE_SUGGESTION)
        self.assertEqual(model.run_scenario("score_not_probability")["outcome"], model.SCORE_ONLY)
        self.assertEqual(model.run_scenario("evaluation_card")["outcome"], model.EVALUATION_CARD)
        self.assertEqual(model.run_scenario("human_override")["outcome"], model.OVERRIDE_REQUIRED)
        self.assertEqual(model.run_scenario("reject_agent_action")["outcome"], model.AGENT_PROPOSAL_REJECTED)
        self.assertEqual(model.run_scenario("review_agent_proposal")["outcome"], model.AGENT_PROPOSAL_REVIEW)

    def test_cli_serializes_only_a_fixed_packet(self) -> None:
        stdout = StringIO()
        stderr = StringIO()
        with redirect_stdout(stdout), redirect_stderr(stderr):
            exit_code = model.main(["human_override"])

        packet = json.loads(stdout.getvalue())
        self.assertEqual(exit_code, 0)
        self.assertEqual(stderr.getvalue(), "")
        self.assertEqual(packet["outcome"], model.OVERRIDE_REQUIRED)
        self.assertIn("limitation", packet)


if __name__ == "__main__":
    unittest.main()
