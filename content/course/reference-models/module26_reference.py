"""Deterministic, local-only release-evidence teaching model for Module 26.

This model is a casebook for reading and defending a systems release.  It does
not read a repository, call a network service, invoke an agent, access learner
data or credentials, change a plan, merge code, build an artifact, or deploy
anything.  Its fixtures are deliberately small and synthetic.
"""

from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from typing import Sequence


MODEL_VERSION = "atlas-module26-reference/2"
KNOWN_GOOD_SOURCE_VERSION = "atlas-capstone/synthetic-v1"
CAPSTONE_SOURCE_VERSION = "atlas-capstone/synthetic-v2"
LIMITATION = (
    "Deterministic teaching model only; not a repository scanner, formal proof, "
    "security audit, privacy-compliance program, accessibility certification, "
    "incident-response system, CI service, deployment controller, or autonomous agent."
)

CONTRACT_REJECTED = "CONTRACT_REJECTED"
DEPENDENCY_REJECTED = "DEPENDENCY_REJECTED"
INVARIANT_HELD = "INVARIANT_HELD"
INVARIANT_BROKEN = "INVARIANT_BROKEN"
LEDGER_ACCEPTED = "LEDGER_ACCEPTED"
LEDGER_REVISE = "LEDGER_REVISE"
CHANGE_APPROVED = "CHANGE_APPROVED"
CHANGE_REVISE = "CHANGE_REVISE"
CHANGE_REJECTED = "CHANGE_REJECTED"
RELEASE = "RELEASE"
REVISE = "REVISE"
DEFER = "DEFER"
ROLLBACK = "ROLLBACK"

SUPPORTED_LAYERS = frozenset(
    {
        "purpose",
        "data",
        "algorithm",
        "api",
        "persistence",
        "runtime",
        "trust",
        "operations",
        "release",
    }
)
ALLOWED_DATA_FIELDS = frozenset(
    {"completed_modules", "low_confidence_modules", "days_since_review"}
)
FORBIDDEN_ACTIONS = frozenset(
    {
        "call_tool",
        "deploy",
        "merge",
        "publish",
        "read_credentials",
        "write_plan",
        "write_schedule",
        "automatic_mutation",
    }
)
ALLOWED_REQUESTED_ACTIONS = frozenset()
DECLARED_PROPOSER_KINDS = frozenset({"agent", "learner", "course maintainer"})
DECLARED_HUMAN_ROLES = frozenset({"learner", "course maintainer"})
SUPPORTED_EVIDENCE_KINDS = frozenset(
    {
        "deterministic-test",
        "accessibility-observation",
        "operations-drill",
        "human-impact-review",
    }
)
REQUIRED_EVIDENCE_KINDS = {
    "deterministic-test": "named build/test observation",
    "accessibility-observation": "scoped accessibility observation",
    "human-impact-review": "scoped human-impact review",
}
BROAD_CLAIM_PHRASES = (
    "production-ready",
    "secure",
    "private by default",
    "correct for all",
    "always works",
    "guaranteed safe",
)


class ContractError(ValueError):
    """Raised when a proposed release crosses its stated boundary."""


class DependencyError(ValueError):
    """Raised when an architecture map is incomplete, cyclic, or unowned."""


class LedgerError(ValueError):
    """Raised when a claim cannot be evaluated as a bounded evidence claim."""


@dataclass(frozen=True)
class ReleaseContract:
    """The narrow purpose and recovery terms for one candidate release."""

    release_id: str
    claim: str
    owner: str
    scope: str
    non_goals: tuple[str, ...]
    invariant: str
    source_version: str
    rollback_trigger: str
    rollback_owner: str
    known_good_version: str
    data_boundary: str
    authority_boundary: str


@dataclass(frozen=True)
class SystemNode:
    """One as-built responsibility in a deliberately compact architecture map."""

    node_id: str
    label: str
    layer: str
    owner: str
    contract: str
    dependencies: tuple[str, ...]


@dataclass(frozen=True)
class DependencyTrace:
    """A dependency-first, inspectable closure for one bounded capability."""

    root_id: str
    ordered_node_ids: tuple[str, ...]
    layers: tuple[str, ...]
    limitation: str


@dataclass(frozen=True)
class IncidentEvent:
    """A synthetic event; a requested mutation is recorded but never performed."""

    event_id: str
    idempotency_key: str
    phase: str
    requests_state_mutation: bool = False


@dataclass(frozen=True)
class IncidentScenario:
    """A fixed retry, duplicate, or partial-failure path to replay locally."""

    scenario_id: str
    description: str
    events: tuple[IncidentEvent, ...]
    expected_records: int


@dataclass(frozen=True)
class IncidentStep:
    event_id: str
    disposition: str
    note: str


@dataclass(frozen=True)
class IncidentReplay:
    scenario_id: str
    observed_records: int
    expected_records: int
    duplicate_suppressed: int
    attempted_state_mutations: int
    invariant_holds: bool
    outcome: str
    steps: tuple[IncidentStep, ...]
    limitation: str


@dataclass(frozen=True)
class EvidenceArtifact:
    """A named, versioned observation with an intentionally limited scope."""

    artifact_id: str
    kind: str
    source_version: str
    scope: tuple[str, ...]
    observation: str
    limitation: str


@dataclass(frozen=True)
class ClaimEntry:
    """One consequence-bearing release claim plus its evidence requirements."""

    claim_id: str
    statement: str
    owner: str
    artifact_ids: tuple[str, ...]
    required_scope: tuple[str, ...]
    limitation: str
    source_version: str


@dataclass(frozen=True)
class LedgerEvaluation:
    status: str
    supported_claim_ids: tuple[str, ...]
    gaps: tuple[str, ...]
    limitation: str


@dataclass(frozen=True)
class ChangeRequest:
    """An untrusted proposed change; reviewing it never applies it."""

    change_id: str
    proposer_kind: str
    reviewer: str | None
    source_version: str
    target_version: str
    summary: str
    changed_paths: tuple[str, ...]
    requested_data_fields: tuple[str, ...]
    requested_actions: tuple[str, ...]
    test_ids: tuple[str, ...]
    rollback_version: str | None
    requires_human_review: bool


@dataclass(frozen=True)
class ChangeReview:
    outcome: str
    reasons: tuple[str, ...]
    required_checks: tuple[str, ...]
    limitation: str


@dataclass(frozen=True)
class ReleasePacket:
    """Raw, versioned dossier material; deciding recomputes every derived result locally."""

    contract: ReleaseContract
    system_nodes: tuple[SystemNode, ...]
    trace_root_id: str
    incident_scenarios: tuple[IncidentScenario, ...]
    claims: tuple[ClaimEntry, ...]
    artifacts: tuple[EvidenceArtifact, ...]
    change_request: ChangeRequest
    source_version: str
    currently_released: bool


@dataclass(frozen=True)
class ReleaseDecision:
    outcome: str
    reasons: tuple[str, ...]
    evidence_gaps: tuple[str, ...]
    limitation: str


DEFAULT_CONTRACT = ReleaseContract(
    release_id="atlas-m26-capstone-synthetic-v2",
    claim=(
        "For fixed synthetic cases, the Atlas study suggestion remains an optional "
        "human-controlled proposal with a visible explanation and no schedule mutation."
    ),
    owner="course maintainer",
    scope="private owner-only learning portal; fixed synthetic capstone fixture",
    non_goals=(
        "not a production recommendation service",
        "not a learner-profile store",
        "not an autonomous deployment or approval system",
    ),
    invariant=(
        "A release claim is supported only by named, versioned, bounded evidence; "
        "no score, test, agent proposal, or green workflow silently grants authority."
    ),
    source_version=CAPSTONE_SOURCE_VERSION,
    rollback_trigger=(
        "a named invariant fails, a disallowed authority/data boundary appears, or "
        "required evidence is missing for the released version"
    ),
    rollback_owner="course maintainer",
    known_good_version=KNOWN_GOOD_SOURCE_VERSION,
    data_boundary=(
        "synthetic fixture only; no real learner history, credentials, secrets, or "
        "external model output may enter this model"
    ),
    authority_boundary=(
        "human approval is required; no automatic plan, calendar, record, merge, "
        "publish, or deployment mutation is allowed"
    ),
)

DEFAULT_SYSTEM_NODES: tuple[SystemNode, ...] = (
    SystemNode(
        node_id="purpose",
        label="Optional next-study decision purpose",
        layer="purpose",
        owner="course maintainer",
        contract="one optional reversible suggestion; no optimization proxy becomes a learner goal",
        dependencies=(),
    ),
    SystemNode(
        node_id="authorized-data",
        label="Synthetic authorized-data boundary",
        layer="data",
        owner="course maintainer",
        contract="only declared minimal synthetic fields may be read",
        dependencies=("purpose",),
    ),
    SystemNode(
        node_id="candidate-policy",
        label="Declared candidate builder and transparent policy",
        layer="algorithm",
        owner="course maintainer",
        contract="candidate set precedes a versioned ordinal ranking",
        dependencies=("authorized-data",),
    ),
    SystemNode(
        node_id="evidence-api",
        label="Suggestion and explanation representation",
        layer="api",
        owner="course maintainer",
        contract="displayed reason, version, and limitation stay attached to each proposal",
        dependencies=("candidate-policy",),
    ),
    SystemNode(
        node_id="decision-boundary",
        label="Human override and no-write boundary",
        layer="trust",
        owner="learner",
        contract="a response is separate from learner-state mutation and may be declined",
        dependencies=("evidence-api",),
    ),
    SystemNode(
        node_id="portal-runtime",
        label="Accessible private portal route",
        layer="runtime",
        owner="course maintainer",
        contract="keyboard-readable static learning view with local-only progress state",
        dependencies=("decision-boundary",),
    ),
    SystemNode(
        node_id="release-gate",
        label="Reviewed source, CI observation, and recovery plan",
        layer="release",
        owner="course maintainer",
        contract="a release decision retains source, checks, limitations, and rollback terms",
        dependencies=("portal-runtime", "authorized-data"),
    ),
)

RETRY_SCENARIO = IncidentScenario(
    scenario_id="retry-after-lost-ack",
    description="The first acknowledgement is lost and the same request is retried.",
    events=(
        IncidentEvent("proposal-recorded", "request-42", "recorded"),
        IncidentEvent("retry-after-timeout", "request-42", "retried"),
    ),
    expected_records=1,
)
PARTIAL_FAILURE_SCENARIO = IncidentScenario(
    scenario_id="partial-failure-recovery",
    description="A record is committed before a response timeout; recovery replays the request.",
    events=(
        IncidentEvent("commit-before-timeout", "request-73", "committed"),
        IncidentEvent("recovery-replay", "request-73", "recovery"),
    ),
    expected_records=1,
)
UNSAFE_MUTATION_SCENARIO = IncidentScenario(
    scenario_id="authority-crossing-request",
    description="A proposal asks to alter a study schedule; the model records the attempt only.",
    events=(
        IncidentEvent("proposed-schedule-write", "request-91", "rejected", True),
    ),
    expected_records=0,
)

DEFAULT_ARTIFACTS: tuple[EvidenceArtifact, ...] = (
    EvidenceArtifact(
        artifact_id="contract-test-matrix",
        kind="deterministic-test",
        source_version=CAPSTONE_SOURCE_VERSION,
        scope=("fixed-synthetic", "module26", "python-3.12", "python-3.14"),
        observation="Named contract and counterexample cases passed on the declared runtimes.",
        limitation="It does not establish behavior for all inputs, environments, or users.",
    ),
    EvidenceArtifact(
        artifact_id="keyboard-observation",
        kind="accessibility-observation",
        source_version=CAPSTONE_SOURCE_VERSION,
        scope=("fixed-synthetic", "module26", "keyboard", "named-browser"),
        observation="The named keyboard path reaches the decision and its override explanation.",
        limitation="It is not a WCAG certification, assistive-technology matrix, or user study.",
    ),
    EvidenceArtifact(
        artifact_id="rollback-drill",
        kind="operations-drill",
        source_version=CAPSTONE_SOURCE_VERSION,
        scope=("fixed-synthetic", "module26", "local-recovery"),
        observation="A fixed invariant failure leads to a named defer-or-rollback recommendation.",
        limitation="It is a local drill, not production incident-response evidence.",
    ),
    EvidenceArtifact(
        artifact_id="human-impact-review",
        kind="human-impact-review",
        source_version=CAPSTONE_SOURCE_VERSION,
        scope=("fixed-synthetic", "module26", "human-impact", "decision-boundary"),
        observation=(
            "A named maintainer design review traced the fixed learner task through the visible "
            "decline path and recorded the unresolved absence of a user study."
        ),
        limitation=(
            "This is a bounded design review, not an observed user outcome, usability study, "
            "fairness evaluation, or evidence of benefit."
        ),
    ),
)

DEFAULT_CLAIMS: tuple[ClaimEntry, ...] = (
    ClaimEntry(
        claim_id="contract-boundary",
        statement=(
            "For named fixed-synthetic cases, this version rejects automatic authority "
            "and preserves a human-controlled release decision."
        ),
        owner="course maintainer",
        artifact_ids=("contract-test-matrix",),
        required_scope=("fixed-synthetic", "module26"),
        limitation="The cases are selected teaching fixtures, not all possible system states.",
        source_version=CAPSTONE_SOURCE_VERSION,
    ),
    ClaimEntry(
        claim_id="override-path",
        statement=(
            "In the named keyboard observation, the fixed-synthetic proposal exposes a visible override path."
        ),
        owner="course maintainer",
        artifact_ids=("keyboard-observation",),
        required_scope=("fixed-synthetic", "module26", "keyboard"),
        limitation="This observation is narrower than general accessibility or user benefit.",
        source_version=CAPSTONE_SOURCE_VERSION,
    ),
    ClaimEntry(
        claim_id="recovery-path",
        statement=(
            "In the local fixed-synthetic drill, an invariant failure produces a deferred or rollback recommendation."
        ),
        owner="course maintainer",
        artifact_ids=("rollback-drill",),
        required_scope=("fixed-synthetic", "module26", "local-recovery"),
        limitation="The drill does not establish an operational incident-response program.",
        source_version=CAPSTONE_SOURCE_VERSION,
    ),
    ClaimEntry(
        claim_id="human-impact-boundary",
        statement=(
            "For the fixed-synthetic decision task, a named design review records a visible decline "
            "path and its unresolved human-impact uncertainty."
        ),
        owner="course maintainer",
        artifact_ids=("human-impact-review",),
        required_scope=("fixed-synthetic", "module26", "human-impact", "decision-boundary"),
        limitation=(
            "The review does not establish usability, fairness, benefit, or outcomes for real learners."
        ),
        source_version=CAPSTONE_SOURCE_VERSION,
    ),
)

SAFE_AGENT_PROPOSAL = ChangeRequest(
    change_id="agent-proposal-copy-clarification",
    proposer_kind="agent",
    reviewer="course maintainer",
    source_version=KNOWN_GOOD_SOURCE_VERSION,
    target_version=CAPSTONE_SOURCE_VERSION,
    summary="Clarify the visible non-claim beside the fixed suggestion without changing authority.",
    changed_paths=("app/CapstoneDefenseStudio.tsx", "tests/rendered-html.test.mjs"),
    requested_data_fields=(),
    requested_actions=(),
    test_ids=("rendered-module26", "module26-contract-tests"),
    rollback_version=KNOWN_GOOD_SOURCE_VERSION,
    requires_human_review=True,
)


def _require_text(value: str | None, field: str) -> None:
    if not value or not value.strip():
        raise ContractError(f"{field} must be named")


def validate_release_contract(contract: ReleaseContract) -> None:
    """Reject a release without an owner, boundary, recovery path, or non-goal."""

    for field in (
        "release_id",
        "claim",
        "owner",
        "scope",
        "invariant",
        "source_version",
        "rollback_trigger",
        "rollback_owner",
        "known_good_version",
        "data_boundary",
        "authority_boundary",
    ):
        _require_text(getattr(contract, field), field)
    if not contract.non_goals or any(not item.strip() for item in contract.non_goals):
        raise ContractError("at least one explicit non-goal is required")
    if contract.owner.strip().casefold() not in DECLARED_HUMAN_ROLES:
        raise ContractError("a human release owner must be a declared human fixture role")
    if contract.rollback_owner.strip().casefold() not in DECLARED_HUMAN_ROLES:
        raise ContractError("a human rollback owner must be a declared human fixture role")
    if contract.source_version == contract.known_good_version:
        raise ContractError("candidate and known-good versions must be distinguishable")
    if "synthetic" not in contract.data_boundary.casefold():
        raise ContractError("this teaching model requires a visible synthetic-data boundary")
    authority = contract.authority_boundary.casefold()
    if "human" not in authority or "no automatic" not in authority:
        raise ContractError("human approval and the no-automatic-mutation boundary must be explicit")
    claim = contract.claim.casefold()
    if any(phrase in claim for phrase in BROAD_CLAIM_PHRASES):
        raise ContractError("claim is broader than this bounded teaching model can support")


def trace_dependency_closure(
    root_id: str,
    nodes: Sequence[SystemNode] = DEFAULT_SYSTEM_NODES,
) -> DependencyTrace:
    """Return a checked, dependency-first trace without inspecting a real repository."""

    if not nodes:
        raise DependencyError("an architecture trace needs named nodes")
    by_id = {node.node_id: node for node in nodes}
    if len(by_id) != len(nodes):
        raise DependencyError("node identifiers must be unique")
    for node in nodes:
        if node.layer not in SUPPORTED_LAYERS:
            raise DependencyError(f"unsupported layer: {node.layer}")
        if not node.owner.strip() or not node.contract.strip():
            raise DependencyError(f"{node.node_id} needs an owner and contract")
        missing = [dependency for dependency in node.dependencies if dependency not in by_id]
        if missing:
            raise DependencyError(
                f"{node.node_id} references unknown dependency: {', '.join(missing)}"
            )
    if root_id not in by_id:
        raise DependencyError(f"unknown root: {root_id}")

    ordered: list[str] = []
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(node_id: str) -> None:
        if node_id in visited:
            return
        if node_id in visiting:
            raise DependencyError(f"cycle detected at {node_id}")
        visiting.add(node_id)
        for dependency in by_id[node_id].dependencies:
            visit(dependency)
        visiting.remove(node_id)
        visited.add(node_id)
        ordered.append(node_id)

    visit(root_id)
    return DependencyTrace(
        root_id=root_id,
        ordered_node_ids=tuple(ordered),
        layers=tuple(by_id[node_id].layer for node_id in ordered),
        limitation=(
            "A compact map traces named fixture responsibilities only; it is not a full "
            "runtime, threat, or production architecture reconstruction."
        ),
    )


def replay_incident(
    scenario: IncidentScenario,
    *,
    deduplicate: bool = True,
) -> IncidentReplay:
    """Replay a fixed scenario as an observation, never as a real state mutation."""

    if not scenario.events:
        raise ContractError("incident scenario needs at least one event")
    seen_keys: set[str] = set()
    records = 0
    suppressed = 0
    attempted_mutations = 0
    steps: list[IncidentStep] = []
    for event in scenario.events:
        if not event.event_id.strip() or not event.idempotency_key.strip():
            raise ContractError("every replayed event needs an event and idempotency key")
        if event.requests_state_mutation:
            attempted_mutations += 1
            steps.append(
                IncidentStep(
                    event.event_id,
                    "rejected-authority-crossing",
                    "The requested mutation is recorded as a violation and is never executed.",
                )
            )
            continue
        if deduplicate and event.idempotency_key in seen_keys:
            suppressed += 1
            steps.append(
                IncidentStep(
                    event.event_id,
                    "duplicate-suppressed",
                    "The fixed idempotency key already has one evidence record.",
                )
            )
            continue
        seen_keys.add(event.idempotency_key)
        records += 1
        steps.append(
            IncidentStep(
                event.event_id,
                "recorded-fixture",
                f"The {event.phase} event contributes one synthetic evidence record.",
            )
        )
    invariant_holds = records == scenario.expected_records and attempted_mutations == 0
    return IncidentReplay(
        scenario_id=scenario.scenario_id,
        observed_records=records,
        expected_records=scenario.expected_records,
        duplicate_suppressed=suppressed,
        attempted_state_mutations=attempted_mutations,
        invariant_holds=invariant_holds,
        outcome=INVARIANT_HELD if invariant_holds else INVARIANT_BROKEN,
        steps=tuple(steps),
        limitation=(
            "This replay checks fixed keys and event order only; it does not model real "
            "queues, transactions, clocks, race schedules, storage, or recovery systems."
        ),
    )


def _validate_claim_shape(claim: ClaimEntry) -> None:
    for field in ("claim_id", "statement", "owner", "limitation", "source_version"):
        value = getattr(claim, field)
        if not value or not value.strip():
            raise LedgerError(f"{field} must be named for {claim.claim_id or 'a claim'}")
    if not claim.artifact_ids:
        raise LedgerError(f"{claim.claim_id} has no named evidence artifact")
    if not claim.required_scope:
        raise LedgerError(f"{claim.claim_id} has no declared evidence scope")
    if any(phrase in claim.statement.casefold() for phrase in BROAD_CLAIM_PHRASES):
        raise LedgerError(f"{claim.claim_id} is a broad claim outside this model's scope")


def _artifact_shape_gaps(
    artifact: EvidenceArtifact,
    *,
    candidate_source_version: str | None = None,
) -> tuple[str, ...]:
    """Return visible gaps instead of treating an empty evidence card as evidence."""

    gaps: list[str] = []
    for field in ("artifact_id", "kind", "source_version", "observation", "limitation"):
        value = getattr(artifact, field)
        if not isinstance(value, str) or not value.strip():
            gaps.append(f"artifact {artifact.artifact_id or '<unnamed>'}: {field} must be named")
    if not artifact.scope or any(not isinstance(item, str) or not item.strip() for item in artifact.scope):
        gaps.append(f"artifact {artifact.artifact_id or '<unnamed>'}: scope must be named")
    if artifact.kind not in SUPPORTED_EVIDENCE_KINDS:
        gaps.append(f"artifact {artifact.artifact_id or '<unnamed>'}: unsupported evidence kind")
    if candidate_source_version and artifact.source_version != candidate_source_version:
        gaps.append(
            f"artifact {artifact.artifact_id or '<unnamed>'}: source version does not match the candidate"
        )
    return tuple(gaps)


def evaluate_claim_ledger(
    claims: Sequence[ClaimEntry],
    artifacts: Sequence[EvidenceArtifact],
    *,
    candidate_source_version: str | None = None,
) -> LedgerEvaluation:
    """Evaluate raw coverage/version/scope; invalid cards and gaps stay visible."""

    if not claims:
        raise LedgerError("a release dossier needs at least one consequential claim")
    artifact_by_id = {artifact.artifact_id: artifact for artifact in artifacts}
    if len(artifact_by_id) != len(artifacts):
        raise LedgerError("evidence artifact identifiers must be unique")
    artifact_gaps = {
        artifact.artifact_id: _artifact_shape_gaps(
            artifact, candidate_source_version=candidate_source_version
        )
        for artifact in artifacts
    }
    supported: list[str] = []
    gaps: list[str] = [gap for item_gaps in artifact_gaps.values() for gap in item_gaps]
    for claim in claims:
        _validate_claim_shape(claim)
        claim_gaps: list[str] = []
        selected: list[EvidenceArtifact] = []
        if candidate_source_version and claim.source_version != candidate_source_version:
            claim_gaps.append(f"{claim.claim_id}: source version does not match the candidate")
        for artifact_id in claim.artifact_ids:
            artifact = artifact_by_id.get(artifact_id)
            if artifact is None:
                claim_gaps.append(f"{claim.claim_id}: missing artifact {artifact_id}")
                continue
            selected.append(artifact)
            if artifact_gaps[artifact_id]:
                claim_gaps.append(f"{claim.claim_id}: {artifact_id} is not a complete evidence record")
            if artifact.source_version != claim.source_version:
                claim_gaps.append(
                    f"{claim.claim_id}: {artifact_id} has a different source version"
                )
        covered_scope = set().union(*(set(artifact.scope) for artifact in selected)) if selected else set()
        missing_scope = set(claim.required_scope) - covered_scope
        if missing_scope:
            claim_gaps.append(
                f"{claim.claim_id}: evidence lacks scope {', '.join(sorted(missing_scope))}"
            )
        if claim_gaps:
            gaps.extend(claim_gaps)
        else:
            supported.append(claim.claim_id)
    return LedgerEvaluation(
        status=LEDGER_ACCEPTED if not gaps else LEDGER_REVISE,
        supported_claim_ids=tuple(supported),
        gaps=tuple(gaps),
        limitation=(
            "A filled ledger documents selected evidence relationships; it does not prove "
            "the claim is true outside declared fixtures, versions, and observations."
        ),
    )


def _required_evidence_gaps(
    artifacts: Sequence[EvidenceArtifact],
    *,
    candidate_source_version: str,
) -> tuple[str, ...]:
    """Require raw records for build, accessibility, and human-impact boundaries."""

    gaps: list[str] = []
    for kind, label in REQUIRED_EVIDENCE_KINDS.items():
        usable = any(
            artifact.kind == kind
            and not _artifact_shape_gaps(
                artifact, candidate_source_version=candidate_source_version
            )
            for artifact in artifacts
        )
        if not usable:
            gaps.append(f"{label} is missing or incomplete")
    return tuple(gaps)


def review_change_request(request: ChangeRequest) -> ChangeReview:
    """Classify one untrusted proposal; no requested external action is permitted."""

    reasons: list[str] = []
    required_checks = ["human diff review", "named regression test", "rollback comparison"]
    proposer_kind = request.proposer_kind.strip().casefold()
    reviewer = request.reviewer.strip().casefold() if request.reviewer else ""
    if not request.change_id.strip() or not request.summary.strip():
        reasons.append("change identity and intent must be explicit")
    if proposer_kind not in DECLARED_PROPOSER_KINDS:
        reasons.append("proposer kind must be a declared fixture role")
    if not request.changed_paths:
        reasons.append("changed paths must be inspectable")
    if not request.requires_human_review or not reviewer:
        reasons.append("a named human review is required")
    elif reviewer not in DECLARED_HUMAN_ROLES:
        reasons.append("reviewer must be a declared human fixture role; agent/model/unknown aliases do not count")
    if request.source_version == request.target_version:
        reasons.append("source and target versions must be distinguishable")
    if not request.rollback_version:
        reasons.append("a known rollback version must be named")
    if not request.test_ids:
        reasons.append("a proposed change needs at least one named test or observation")
    unexpected_fields = set(request.requested_data_fields) - ALLOWED_DATA_FIELDS
    if unexpected_fields:
        reasons.append(
            "unauthorized data field(s): " + ", ".join(sorted(unexpected_fields))
        )
    external_actions = set(request.requested_actions) - ALLOWED_REQUESTED_ACTIONS
    if external_actions:
        reasons.append(
            "external authority/action request(s) are forbidden in this local model: "
            + ", ".join(sorted(external_actions))
        )
    hard_boundary = bool(unexpected_fields or external_actions)
    if hard_boundary:
        outcome = CHANGE_REJECTED
    elif reasons:
        outcome = CHANGE_REVISE
    else:
        outcome = CHANGE_APPROVED
    if proposer_kind == "agent":
        required_checks.append("independent human verification of the agent proposal")
    return ChangeReview(
        outcome=outcome,
        reasons=tuple(reasons) or ("proposal remains within the declared synthetic authority boundary",),
        required_checks=tuple(required_checks),
        limitation=(
            "This review classifies a fixed request; it neither reads a real diff nor grants "
            "approval, merge, deployment, or execution authority. Human-role labels are fixture "
            "inputs, not identity verification."
        ),
    )


def decide_release(packet: ReleasePacket) -> ReleaseDecision:
    """Recompute a bounded release recommendation from raw dossier material only."""

    validate_release_contract(packet.contract)
    gaps: list[str] = []
    reasons: list[str] = []
    if packet.source_version != packet.contract.source_version:
        gaps.append("packet source version differs from the release contract")
    if packet.change_request.target_version != packet.contract.source_version:
        gaps.append("change target version differs from the release contract candidate")
    if packet.change_request.source_version != packet.contract.known_good_version:
        gaps.append("change source version does not identify the contract's known-good version")
    if packet.change_request.rollback_version != packet.contract.known_good_version:
        gaps.append("change rollback version does not identify the contract's known-good version")

    required_layers = {"purpose", "data", "algorithm", "api", "trust", "runtime", "release"}
    try:
        trace = trace_dependency_closure(packet.trace_root_id, packet.system_nodes)
    except DependencyError as error:
        gaps.append(f"dependency trace is invalid: {error}")
    else:
        missing_layers = required_layers - set(trace.layers)
        if missing_layers:
            gaps.append("dependency trace lacks layer(s): " + ", ".join(sorted(missing_layers)))

    replays: list[IncidentReplay] = []
    if not packet.incident_scenarios:
        gaps.append("at least one named incident scenario is required")
    for scenario in packet.incident_scenarios:
        try:
            replays.append(replay_incident(scenario))
        except ContractError as error:
            gaps.append(f"incident scenario is invalid: {error}")

    try:
        ledger = evaluate_claim_ledger(
            packet.claims,
            packet.artifacts,
            candidate_source_version=packet.contract.source_version,
        )
    except LedgerError as error:
        gaps.append(f"evidence ledger is invalid: {error}")
    else:
        if ledger.status != LEDGER_ACCEPTED:
            gaps.extend(ledger.gaps)
    gaps.extend(
        _required_evidence_gaps(
            packet.artifacts, candidate_source_version=packet.contract.source_version
        )
    )

    change_review = review_change_request(packet.change_request)
    if change_review.outcome != CHANGE_APPROVED:
        gaps.append("change review is not approved: " + change_review.outcome)

    broken = [replay.scenario_id for replay in replays if not replay.invariant_holds]
    if broken:
        reasons.append("named invariant failure: " + ", ".join(broken))
        if packet.currently_released:
            return ReleaseDecision(
                outcome=ROLLBACK,
                reasons=tuple(reasons),
                evidence_gaps=tuple(gaps),
                limitation=(
                    "ROLLBACK is a recommendation to the named owner, not a deployment "
                    "command, proof of recovery, or statement about a real production system."
                ),
            )
        return ReleaseDecision(
            outcome=DEFER,
            reasons=tuple(reasons),
            evidence_gaps=tuple(gaps),
            limitation="DEFER does not repair the failure; it keeps release authority with the named owner.",
        )
    if gaps:
        return ReleaseDecision(
            outcome=REVISE,
            reasons=("the evidence bundle has unresolved gaps",),
            evidence_gaps=tuple(gaps),
            limitation="REVISE is a bounded recommendation, not proof that the proposed release would otherwise fail.",
        )
    return ReleaseDecision(
        outcome=RELEASE,
        reasons=(
            "the named synthetic contract, raw architecture, incidents, evidence records, and reviewed change are complete for their declared scope",
        ),
        evidence_gaps=(),
        limitation=(
            "RELEASE recommends that a named human may consider the bounded candidate; it "
            "does not deploy, prove correctness/security/privacy/accessibility, or generalize beyond the fixture."
        ),
    )


def default_packet(*, currently_released: bool = False) -> ReleasePacket:
    """Assemble raw synthetic dossier material without touching external state."""

    return ReleasePacket(
        contract=DEFAULT_CONTRACT,
        system_nodes=DEFAULT_SYSTEM_NODES,
        trace_root_id="release-gate",
        incident_scenarios=(RETRY_SCENARIO, PARTIAL_FAILURE_SCENARIO),
        claims=DEFAULT_CLAIMS,
        artifacts=DEFAULT_ARTIFACTS,
        change_request=SAFE_AGENT_PROPOSAL,
        source_version=CAPSTONE_SOURCE_VERSION,
        currently_released=currently_released,
    )


def _jsonable(value: object) -> str:
    return json.dumps(asdict(value), indent=2, sort_keys=True)


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Inspect fixed Module 26 capstone cases.")
    parser.add_argument(
        "case",
        choices=("packet", "retry", "partial", "unsafe", "undedupe"),
        nargs="?",
        default="packet",
    )
    args = parser.parse_args(argv)
    if args.case == "packet":
        print(_jsonable(decide_release(default_packet())))
    elif args.case == "retry":
        print(_jsonable(replay_incident(RETRY_SCENARIO)))
    elif args.case == "partial":
        print(_jsonable(replay_incident(PARTIAL_FAILURE_SCENARIO)))
    elif args.case == "unsafe":
        print(_jsonable(replay_incident(UNSAFE_MUTATION_SCENARIO)))
    else:
        print(_jsonable(replay_incident(RETRY_SCENARIO, deduplicate=False)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
