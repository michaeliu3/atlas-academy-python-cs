"""Deterministic, local-only decision-support teaching model for Module 25.

The model makes the boundaries around a next-step suggestion inspectable. It
does not train a model, call an LLM or network service, read learner records,
execute tools, or mutate a schedule. All fixtures are synthetic and fixed.
"""

from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from typing import Mapping, Sequence


MODEL_VERSION = "atlas-module25-reference/1"
LIMITATION = (
    "Deterministic teaching model only; not a trained model, calibrated "
    "probability service, learner-profile store, accessibility audit, consent "
    "system, scheduler, production policy engine, or autonomous agent."
)

CONTRACT_REJECTED = "CONTRACT_REJECTED"
DATA_REJECTED = "DATA_REJECTED"
LEAKAGE_REJECTED = "LEAKAGE_REJECTED"
BASELINE_SUGGESTION = "BASELINE_SUGGESTION"
SCORE_ONLY = "SCORE_ONLY"
EVALUATION_CARD = "EVALUATION_CARD"
OVERRIDE_REQUIRED = "OVERRIDE_REQUIRED"
AGENT_PROPOSAL_REJECTED = "AGENT_PROPOSAL_REJECTED"
AGENT_PROPOSAL_REVIEW = "AGENT_PROPOSAL_REVIEW"


class ContractError(ValueError):
    """Raised when a suggestion tries to cross a declared authority boundary."""


class DataContractError(ValueError):
    """Raised when a synthetic feature/label record cannot support its claim."""


@dataclass(frozen=True)
class DecisionContract:
    """The purpose, data minimization, and human-control terms of one feature."""

    purpose: str
    allowed_fields: tuple[str, ...]
    candidate_set_version: str
    policy_version: str
    model_version: str | None
    human_override_required: bool
    automatic_mutation_allowed: bool
    retention_note: str


@dataclass(frozen=True)
class Candidate:
    """One declared action in the fixed local candidate set."""

    candidate_id: str
    label: str
    prerequisite_module: int | None
    reason_kind: str
    estimated_minutes: int


@dataclass(frozen=True)
class MinimalLearnerState:
    """Synthetic state with no identity, prose notes, raw events, or credentials."""

    completed_modules: frozenset[int]
    low_confidence_modules: frozenset[int]
    days_since_review: Mapping[int, int]


@dataclass(frozen=True)
class RankedCandidate:
    """A versioned ordinal score, explicitly not a probability or command."""

    candidate: Candidate
    score: int
    reasons: tuple[str, ...]
    policy_version: str
    candidate_set_version: str


@dataclass(frozen=True)
class Suggestion:
    """A displayable proposal whose user action is intentionally separate."""

    candidate_id: str
    display_label: str
    ordinal_score: int
    explanation: tuple[str, ...]
    candidate_set_version: str
    policy_version: str
    model_version: str | None
    limitation: str
    requires_human_action: bool


@dataclass(frozen=True)
class TrainingRow:
    """A dated synthetic example used to inspect time and label boundaries."""

    row_id: str
    feature_day: int
    outcome_day: int
    label: int
    fields: tuple[str, ...]


@dataclass(frozen=True)
class ScoredOutcome:
    """Held-out synthetic outcome. `score` has no probability meaning by default."""

    row_id: str
    score: float
    label: int
    group: str


@dataclass(frozen=True)
class EvaluationCard:
    """A bounded evaluation summary with denominators and explicit limits."""

    total: int
    positives: int
    negatives: int
    threshold: float
    selected: int
    true_positive: int
    false_positive: int
    false_negative: int
    precision: float | None
    recall: float | None
    accuracy: float
    calibration_supported: bool
    limitation: str


@dataclass(frozen=True)
class AgentProposal:
    """A proposal from an external model/agent, never a permission or tool call."""

    text: str
    citations: tuple[str, ...]
    requested_actions: tuple[str, ...]
    model_label: str | None


@dataclass(frozen=True)
class AgentReview:
    outcome: str
    reason: str
    required_next_check: str


DEFAULT_CONTRACT = DecisionContract(
    purpose="help a learner choose one optional next study action",
    allowed_fields=("completed_modules", "low_confidence_modules", "days_since_review"),
    candidate_set_version="atlas-next-actions/synthetic-v1",
    policy_version="transparent-prerequisite-review/v1",
    model_version=None,
    human_override_required=True,
    automatic_mutation_allowed=False,
    retention_note="synthetic local fixture; no learner record is retained by this model",
)

CANDIDATES: tuple[Candidate, ...] = (
    Candidate(
        candidate_id="repair-cost-model",
        label="Repair the cost-model trace before dynamic programming",
        prerequisite_module=5,
        reason_kind="prerequisite",
        estimated_minutes=35,
    ),
    Candidate(
        candidate_id="trace-transaction-invariant",
        label="Trace one transaction invariant before the architecture dossier",
        prerequisite_module=16,
        reason_kind="low-confidence",
        estimated_minutes=30,
    ),
    Candidate(
        candidate_id="retrieve-runtime-limits",
        label="Retrieve the Module 24 measurement limits",
        prerequisite_module=24,
        reason_kind="spaced-review",
        estimated_minutes=20,
    ),
)


def validate_contract(contract: DecisionContract) -> None:
    """Reject an underspecified purpose, unsafe field, or automatic authority."""

    if contract.purpose != "help a learner choose one optional next study action":
        raise ContractError("purpose must be the declared optional study-action purpose")
    if not contract.allowed_fields:
        raise ContractError("allowed fields must be named before a suggestion exists")
    allowed = set(DEFAULT_CONTRACT.allowed_fields)
    unexpected = tuple(field for field in contract.allowed_fields if field not in allowed)
    if unexpected:
        raise ContractError("unauthorized field(s): " + ", ".join(unexpected))
    if not contract.candidate_set_version or not contract.policy_version:
        raise ContractError("candidate-set and policy versions must be named")
    if not contract.human_override_required:
        raise ContractError("a study suggestion must preserve a meaningful human override")
    if contract.automatic_mutation_allowed:
        raise ContractError("a score may not mutate learner state or a schedule")
    if not contract.retention_note:
        raise ContractError("retention and minimization boundary must be visible")


def fixed_candidates(contract: DecisionContract) -> tuple[Candidate, ...]:
    """Return the declared fixture only after the contract passes review."""

    validate_contract(contract)
    return CANDIDATES


def _candidate_score(candidate: Candidate, state: MinimalLearnerState) -> tuple[int, tuple[str, ...]]:
    """Make a transparent ordinal ranking trace, not a learned prediction."""

    score = 0
    reasons: list[str] = []
    if candidate.prerequisite_module is not None and candidate.prerequisite_module not in state.completed_modules:
        score += 8
        reasons.append("a declared prerequisite is incomplete")
    if candidate.prerequisite_module in state.low_confidence_modules:
        score += 5
        reasons.append("the synthetic record marks this module low-confidence")
    if state.days_since_review.get(candidate.prerequisite_module or -1, 0) >= 10:
        score += 2
        reasons.append("the fixed review interval is due")
    if not reasons:
        reasons.append("candidate remains in the declared set but has no current priority signal")
    return score, tuple(reasons)


def rank_transparent_baseline(
    contract: DecisionContract,
    state: MinimalLearnerState,
) -> tuple[RankedCandidate, ...]:
    """Rank only the fixed candidate set with a readable, deterministic policy."""

    candidates = fixed_candidates(contract)
    ranked = []
    for candidate in candidates:
        score, reasons = _candidate_score(candidate, state)
        ranked.append(
            RankedCandidate(
                candidate=candidate,
                score=score,
                reasons=reasons,
                policy_version=contract.policy_version,
                candidate_set_version=contract.candidate_set_version,
            )
        )
    return tuple(sorted(ranked, key=lambda item: (-item.score, item.candidate.candidate_id)))


def render_suggestion(
    contract: DecisionContract,
    ranked: RankedCandidate,
) -> Suggestion:
    """Convert one ranked item into an inspectable, override-required proposal."""

    validate_contract(contract)
    if ranked.policy_version != contract.policy_version:
        raise ContractError("ranked policy version does not match the decision contract")
    if ranked.candidate_set_version != contract.candidate_set_version:
        raise ContractError("ranked candidate set does not match the decision contract")
    return Suggestion(
        candidate_id=ranked.candidate.candidate_id,
        display_label=ranked.candidate.label,
        ordinal_score=ranked.score,
        explanation=ranked.reasons,
        candidate_set_version=ranked.candidate_set_version,
        policy_version=ranked.policy_version,
        model_version=contract.model_version,
        limitation=(
            "Ordinal priority only; not a probability, diagnosis, causal claim, "
            "truth judgment, permission, schedule change, or evidence that the "
            "learner should accept it."
        ),
        requires_human_action=True,
    )


def record_user_response(suggestion: Suggestion, response: str) -> Mapping[str, str]:
    """Return a minimized record, without mutating a learner profile or plan."""

    if response not in {"accept", "dismiss", "defer"}:
        raise ContractError("response must be accept, dismiss, or defer")
    if not suggestion.requires_human_action:
        raise ContractError("suggestion cannot bypass human action")
    return {
        "candidate_id": suggestion.candidate_id,
        "response": response,
        "policy_version": suggestion.policy_version,
        "effect": "record-only; no schedule or learner state was changed",
    }


def validate_training_rows(rows: Sequence[TrainingRow], split_day: int) -> tuple[TrainingRow, ...]:
    """Reject temporal leakage and unsupported feature collection in a toy dataset."""

    if not rows:
        raise DataContractError("at least one dated row is required")
    allowed = set(DEFAULT_CONTRACT.allowed_fields)
    for row in rows:
        if row.label not in {0, 1}:
            raise DataContractError("labels must be binary in this fixed fixture")
        if row.feature_day >= row.outcome_day:
            raise DataContractError("feature day must precede its outcome day")
        if row.feature_day > split_day:
            raise DataContractError("feature is after the declared decision cutoff")
        unexpected = tuple(field for field in row.fields if field not in allowed)
        if unexpected:
            raise DataContractError("unauthorized feature(s): " + ", ".join(unexpected))
    return tuple(rows)


def temporal_split(rows: Sequence[TrainingRow], evaluation_after_day: int) -> tuple[tuple[TrainingRow, ...], tuple[TrainingRow, ...]]:
    """Split fixture rows by time; a later row cannot quietly enter training."""

    if not rows:
        raise DataContractError("cannot split an empty dataset")
    train = tuple(row for row in rows if row.outcome_day <= evaluation_after_day)
    held_out = tuple(row for row in rows if row.outcome_day > evaluation_after_day)
    if not train or not held_out:
        raise DataContractError("time split requires both train and held-out rows")
    return train, held_out


def evaluate_held_out(scores: Sequence[ScoredOutcome], threshold: float) -> EvaluationCard:
    """Compute a small transparent card; accuracy does not become usefulness."""

    if not scores:
        raise DataContractError("held-out outcomes are required for an evaluation card")
    if not 0 <= threshold <= 1:
        raise DataContractError("threshold must be between zero and one")
    for item in scores:
        if item.label not in {0, 1}:
            raise DataContractError("held-out labels must be binary")
        if not 0 <= item.score <= 1:
            raise DataContractError("fixed score range is zero through one")
        if not item.group:
            raise DataContractError("evaluation requires a named slice/group")
    total = len(scores)
    positives = sum(item.label for item in scores)
    negatives = total - positives
    selected = tuple(item for item in scores if item.score >= threshold)
    true_positive = sum(item.label for item in selected)
    false_positive = len(selected) - true_positive
    false_negative = sum(1 for item in scores if item.label == 1 and item.score < threshold)
    precision = true_positive / len(selected) if selected else None
    recall = true_positive / positives if positives else None
    accurate = sum(
        int((item.score >= threshold) == bool(item.label))
        for item in scores
    )
    return EvaluationCard(
        total=total,
        positives=positives,
        negatives=negatives,
        threshold=threshold,
        selected=len(selected),
        true_positive=true_positive,
        false_positive=false_positive,
        false_negative=false_negative,
        precision=precision,
        recall=recall,
        accuracy=accurate / total,
        calibration_supported=False,
        limitation=(
            "Synthetic held-out fixture only. Accuracy, precision, and recall "
            "do not establish causal benefit, calibration, fairness, population "
            "validity, human usefulness, or safe deployment."
        ),
    )


def review_agent_proposal(proposal: AgentProposal) -> AgentReview:
    """Treat a generated message as untrusted until its boundary is reviewed."""

    if not proposal.model_label:
        return AgentReview(
            outcome=AGENT_PROPOSAL_REJECTED,
            reason="proposal lacks a model/system label and cannot be attributed",
            required_next_check="name the proposal source, version, and fixed context",
        )
    if proposal.requested_actions:
        return AgentReview(
            outcome=AGENT_PROPOSAL_REJECTED,
            reason="proposal asks for actions; this model grants no tool or write authority",
            required_next_check="reduce it to an advisory text proposal and request human approval separately",
        )
    if not proposal.citations:
        return AgentReview(
            outcome=AGENT_PROPOSAL_REJECTED,
            reason="retrieval/provenance is absent; text alone cannot establish a fact",
            required_next_check="supply inspectable sources and independently verify the claim",
        )
    return AgentReview(
        outcome=AGENT_PROPOSAL_REVIEW,
        reason="bounded proposal may be read, but its citations and claim still require human review",
        required_next_check="compare the proposal with the declared contract, evidence, and acceptance tests",
    )


def _state(**changes: object) -> MinimalLearnerState:
    values: dict[str, object] = {
        "completed_modules": frozenset({1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24}),
        "low_confidence_modules": frozenset({16}),
        "days_since_review": {5: 2, 16: 4, 24: 14},
    }
    values.update(changes)
    return MinimalLearnerState(**values)  # type: ignore[arg-type]


def _rows() -> tuple[TrainingRow, ...]:
    return (
        TrainingRow("r1", 2, 5, 1, ("completed_modules",)),
        TrainingRow("r2", 4, 8, 0, ("low_confidence_modules",)),
        TrainingRow("r3", 7, 12, 1, ("days_since_review",)),
    )


def _scores() -> tuple[ScoredOutcome, ...]:
    return (
        ScoredOutcome("h1", 0.82, 1, "new-to-graph"),
        ScoredOutcome("h2", 0.74, 0, "new-to-graph"),
        ScoredOutcome("h3", 0.31, 1, "returning"),
        ScoredOutcome("h4", 0.12, 0, "returning"),
    )


SCENARIOS = (
    "reject_contract",
    "reject_leakage",
    "baseline_suggestion",
    "score_not_probability",
    "evaluation_card",
    "human_override",
    "reject_agent_action",
    "review_agent_proposal",
)


def run_scenario(name: str) -> Mapping[str, object]:
    """Run one fixed teaching packet; arbitrary code, data, and tools are absent."""

    if name not in SCENARIOS:
        raise ValueError("unknown fixed scenario: " + name)
    if name == "reject_contract":
        unsafe = DecisionContract(
            **{**asdict(DEFAULT_CONTRACT), "automatic_mutation_allowed": True}
        )
        try:
            validate_contract(unsafe)
        except ContractError as error:
            return {"outcome": CONTRACT_REJECTED, "reason": str(error), "limitation": LIMITATION}
    if name == "reject_leakage":
        leaking = (TrainingRow("leak", 9, 8, 1, ("completed_modules",)),)
        try:
            validate_training_rows(leaking, split_day=9)
        except DataContractError as error:
            return {"outcome": LEAKAGE_REJECTED, "reason": str(error), "limitation": LIMITATION}
    if name in {"baseline_suggestion", "score_not_probability", "human_override"}:
        ranked = rank_transparent_baseline(DEFAULT_CONTRACT, _state())
        suggestion = render_suggestion(DEFAULT_CONTRACT, ranked[0])
        if name == "baseline_suggestion":
            return {"outcome": BASELINE_SUGGESTION, "ranking": [asdict(item) for item in ranked], "limitation": LIMITATION}
        if name == "score_not_probability":
            return {"outcome": SCORE_ONLY, "suggestion": asdict(suggestion), "limitation": LIMITATION}
        return {
            "outcome": OVERRIDE_REQUIRED,
            "suggestion": asdict(suggestion),
            "response_record": dict(record_user_response(suggestion, "dismiss")),
            "limitation": LIMITATION,
        }
    if name == "evaluation_card":
        return {"outcome": EVALUATION_CARD, "card": asdict(evaluate_held_out(_scores(), 0.7)), "limitation": LIMITATION}
    if name == "reject_agent_action":
        review = review_agent_proposal(
            AgentProposal("Move the schedule now", ("fixture://brief",), ("write_schedule",), "sample-agent/v1")
        )
        return {"outcome": review.outcome, "review": asdict(review), "limitation": LIMITATION}
    review = review_agent_proposal(
        AgentProposal("Here is a bounded draft", ("fixture://brief",), (), "sample-agent/v1")
    )
    return {"outcome": review.outcome, "review": asdict(review), "limitation": LIMITATION}


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("scenario", choices=SCENARIOS)
    args = parser.parse_args(argv)
    print(json.dumps(run_scenario(args.scenario), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
