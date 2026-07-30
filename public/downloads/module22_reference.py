"""Local-only trust-boundary evidence model for Module 22.

This deterministic teaching model makes no network connection, reads no files,
handles no real credentials, and does not assess a live system.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
import hashlib
import hmac
import json
from typing import Mapping


MODEL_VERSION = "atlas-module22-reference/1"
EVIDENCE_SCHEMA_VERSION = "atlas.module22.evidence/1"
LIMITATION = "local model; not a live security assessment"
SUPPORTED_POLICY_VERSION = "policy-7"
_FIXTURE_MAC_KEY = b"atlas-module22-fixture-only-mac-key"
_FIXTURE_SUBJECT = "worker-17"
_FIXTURE_SUBJECTS = frozenset({"worker-17", "worker-99"})
_RUN_ID = "run-2026-07-30-security-a"
SCENARIOS = (
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
)
_AUTHENTICATION_OUTCOMES = frozenset(
    {"NOT_EVALUATED", "DENIED_AUTHENTICATION", "AUTHENTICATED_MODEL"}
)
_AUTHORIZATION_OUTCOMES = frozenset(
    {
        "NOT_EVALUATED",
        "DENIED_AUTHENTICATION",
        "DENIED_AUTHORIZATION",
        "PERMITTED_MODEL_PLAN",
    }
)
_PARSER_OUTCOMES = frozenset({"VALIDATED_FORMAT", "REJECTED_FORMAT"})
_ADAPTER_OUTCOMES = frozenset(
    {
        "NOT_EVALUATED",
        "REJECTED_RESUME_FORMAT",
        "REJECTED_ARCHIVE_POLICY",
        "PARAMETERIZED_QUERY_PLAN",
        "DENIED_TRANSFORM_POLICY",
        "REJECTED_TLS_CONFIGURATION",
        "NOT_A_SANDBOX",
        "STATUS_CHECK_REQUIRES_AUTHORIZATION",
    }
)
_RELEASE_OUTCOMES = frozenset(
    {"NOT_EVALUATED", "DEFERRED_RELEASE_REVIEW", "REVIEWED_RELEASE_PLAN"}
)
_PRIVACY_OUTCOMES = frozenset(
    {"NOT_EVALUATED", "REJECTED_USER_IMPACT_REVIEW", "REVIEWED_USER_IMPACT_PLAN"}
)


class InvalidImporterRequest(ValueError):
    """The local schema rejected untrusted request structure before authority."""


@dataclass(frozen=True)
class ParsedImporterRequest:
    """A bounded request shape; parsing alone carries no authority."""

    trace_id: str
    operation_id: str
    source_label: str
    tenant: str
    resource: str
    action: str
    purpose: str
    resume_state_format: str
    archive_profile: str
    query_label: str
    transform: str
    assertion: str | None


@dataclass(frozen=True)
class AuthenticationResult:
    """Scoped HMAC-fixture result, never a real-world identity assertion."""

    outcome: str
    subject: str | None


@dataclass(frozen=True)
class AuthorityContext:
    """The explicitly allowed tuple for this finite local policy fixture."""

    subject: str
    tenant: str
    resource: str
    action: str
    purpose: str
    policy_version: str = SUPPORTED_POLICY_VERSION


@dataclass(frozen=True)
class AuthorizationDecision:
    """A local policy result whose successful branch is still only a fake plan."""

    outcome: str
    reason: str
    effect_scope: str


@dataclass(frozen=True)
class ArchiveMember:
    """Metadata-only archive member; it is never read or extracted."""

    path: str
    kind: str
    size: int


@dataclass(frozen=True)
class ArchiveInspection:
    """Local metadata policy result, not an extraction or filesystem result."""

    outcome: str
    reason: str
    adapter_called: bool


@dataclass(frozen=True)
class QueryPlan:
    """A statement-shape teaching artifact; it never opens a database."""

    statement: str
    parameters: dict[str, str]
    connection_opened: bool


@dataclass(frozen=True)
class TransformRequest:
    """A typed request handed only to a nonexistent in-memory adapter."""

    outcome: str
    operation: str
    source_label: str
    process_started: bool


@dataclass(frozen=True)
class ReleaseManifestReview:
    """A static local release-review result; no artifact is installed or sent."""

    outcome: str
    missing: tuple[str, ...]
    package_installed: bool


@dataclass(frozen=True)
class RedactedEvidencePacket:
    """Closed-schema public evidence from the local teaching model only."""

    schema_version: str
    model_version: str
    run_id: str
    scenario: str
    request_digest: str
    parser_outcome: str
    authentication_outcome: str
    evidence_scope: str
    authorization_outcome: str
    adapter_outcome: str
    release_outcome: str
    input_trace_label: str
    trace_scope: str
    policy_version: str
    privacy_accessibility_outcome: str
    remote_outcome: str
    escalation_owner: str
    facts: tuple[str, ...]
    hypotheses: tuple[str, ...]
    unknowns: tuple[str, ...]
    real_effect: str
    limitations: str

    def as_public_dict(self) -> dict[str, object]:
        """Return only closed, redacted fields; never request or MAC material."""
        return {
            "schema_version": self.schema_version,
            "model_version": self.model_version,
            "run_id": self.run_id,
            "scenario": self.scenario,
            "request_digest": self.request_digest,
            "parser_outcome": self.parser_outcome,
            "authentication_outcome": self.authentication_outcome,
            "evidence_scope": self.evidence_scope,
            "authorization_outcome": self.authorization_outcome,
            "adapter_outcome": self.adapter_outcome,
            "release_outcome": self.release_outcome,
            "input_trace_label": self.input_trace_label,
            "trace_scope": self.trace_scope,
            "policy_version": self.policy_version,
            "privacy_accessibility_outcome": self.privacy_accessibility_outcome,
            "remote_outcome": self.remote_outcome,
            "escalation_owner": self.escalation_owner,
            "facts": self.facts,
            "hypotheses": self.hypotheses,
            "unknowns": self.unknowns,
            "real_effect": self.real_effect,
            "limitations": self.limitations,
        }


@dataclass(frozen=True)
class TLSConfigurationReview:
    """A configuration-reading result, not a TLS connection or peer result."""

    outcome: str
    reason: str
    connection_attempted: bool


@dataclass(frozen=True)
class ResumeStateReview:
    """A format decision made before any loader exists or is called."""

    outcome: str
    reason: str
    loader_called: bool


@dataclass(frozen=True)
class IncidentAssessment:
    """A fact/unknown split for a local incident reconstruction exercise."""

    facts: tuple[str, ...]
    unknowns: tuple[str, ...]
    status_check_requires_authorization: bool


@dataclass(frozen=True)
class AuditHookAssessment:
    """A claim boundary for an audit hook proposal; it is not containment."""

    evidence_label: str
    containment_claim: str


@dataclass(frozen=True)
class PrivacyAccessibilityReview:
    """A static people-impact review without collecting user data."""

    outcome: str
    issues: tuple[str, ...]


_REQUEST_FIELDS = frozenset(ParsedImporterRequest.__dataclass_fields__)


def fixture_request() -> dict[str, str | None]:
    """Return a non-sensitive fixed request fixture for local teaching tests."""
    return {
        "trace_id": "trace-fixture-17",
        "operation_id": "run-2026-07-30-security-a/import-17",
        "source_label": "catalog",
        "tenant": "atlas-learning",
        "resource": "guide-042",
        "action": "publish",
        "purpose": "reconcile-import",
        "resume_state_format": "primitive-json",
        "archive_profile": "safe-fixture",
        "query_label": "intro-python",
        "transform": "normalize_text",
        "assertion": None,
    }


def parse_importer_request(value: Mapping[str, object]) -> ParsedImporterRequest:
    """Reject unknown/ill-shaped data before any identity or policy decision."""
    if not isinstance(value, Mapping):
        raise InvalidImporterRequest("request must be a mapping")
    if set(value) != _REQUEST_FIELDS:
        raise InvalidImporterRequest("request fields are not the declared schema")
    parsed: dict[str, str | None] = {}
    for field in _REQUEST_FIELDS:
        supplied = value[field]
        if field == "assertion":
            if supplied is not None and (not isinstance(supplied, str) or not supplied):
                raise InvalidImporterRequest("assertion must be a non-empty string or null")
            parsed[field] = supplied
            continue
        if not isinstance(supplied, str) or not supplied or len(supplied) > 128:
            raise InvalidImporterRequest(f"{field} must be a bounded non-empty string")
        parsed[field] = supplied
    return ParsedImporterRequest(**parsed)  # type: ignore[arg-type]


def canonical_request_bytes(request: ParsedImporterRequest) -> bytes:
    """Encode bounded request meaning without credential material."""
    if not isinstance(request, ParsedImporterRequest):
        raise TypeError("request must be ParsedImporterRequest")
    meaning = {
        field: getattr(request, field)
        for field in sorted(_REQUEST_FIELDS - {"assertion"})
    }
    return json.dumps(
        meaning,
        ensure_ascii=True,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("ascii")


def request_digest(request: ParsedImporterRequest) -> str:
    """Return a public digest for bounded request meaning, not its authority."""
    return "sha256:" + hashlib.sha256(canonical_request_bytes(request)).hexdigest()


def fixture_assertion_for(
    request: ParsedImporterRequest,
    *,
    subject: str = _FIXTURE_SUBJECT,
) -> str:
    """Create a course-only MAC fixture; never use this as a token format."""
    message = subject.encode("ascii") + b"|" + canonical_request_bytes(request)
    return subject + ":" + hmac.new(_FIXTURE_MAC_KEY, message, hashlib.sha256).hexdigest()


def verify_fixture_assertion(
    request: ParsedImporterRequest,
    assertion: str | None,
) -> AuthenticationResult:
    """Verify one fixture MAC and return a deliberately narrow model result."""
    if not isinstance(request, ParsedImporterRequest):
        raise TypeError("request must be ParsedImporterRequest")
    if not isinstance(assertion, str) or ":" not in assertion:
        return AuthenticationResult("DENIED_AUTHENTICATION", None)
    subject, supplied_mac = assertion.split(":", 1)
    if subject not in _FIXTURE_SUBJECTS or not supplied_mac:
        return AuthenticationResult("DENIED_AUTHENTICATION", None)
    expected = fixture_assertion_for(request, subject=subject)
    if not hmac.compare_digest(assertion, expected):
        return AuthenticationResult("DENIED_AUTHENTICATION", None)
    return AuthenticationResult("AUTHENTICATED_MODEL", subject)


def fixture_authority_context() -> AuthorityContext:
    """Return the exact default-deny allow rule for the safe teaching fixture."""
    return AuthorityContext(
        subject=_FIXTURE_SUBJECT,
        tenant="atlas-learning",
        resource="guide-042",
        action="publish",
        purpose="reconcile-import",
    )


def authorize_effect(
    request: ParsedImporterRequest,
    authentication: AuthenticationResult,
    context: AuthorityContext,
) -> AuthorizationDecision:
    """Allow only one exact authenticated tuple and return a fake-plan scope."""
    if not isinstance(request, ParsedImporterRequest):
        raise TypeError("request must be ParsedImporterRequest")
    if not isinstance(authentication, AuthenticationResult):
        raise TypeError("authentication must be AuthenticationResult")
    if not isinstance(context, AuthorityContext):
        raise TypeError("context must be AuthorityContext")
    if authentication.outcome != "AUTHENTICATED_MODEL":
        return AuthorizationDecision(
            "DENIED_AUTHENTICATION",
            "fixture authentication was absent or invalid",
            "NO_EFFECT",
        )
    actual = (
        authentication.subject,
        request.tenant,
        request.resource,
        request.action,
        request.purpose,
    )
    expected = (
        context.subject,
        context.tenant,
        context.resource,
        context.action,
        context.purpose,
    )
    if actual != expected:
        return AuthorizationDecision(
            "DENIED_AUTHORIZATION",
            "authenticated subject is not permitted for this exact tuple",
            "NO_EFFECT",
        )
    if context.policy_version != SUPPORTED_POLICY_VERSION:
        return AuthorizationDecision(
            "DENIED_AUTHORIZATION",
            "unsupported policy version",
            "NO_EFFECT",
        )
    return AuthorizationDecision(
        "PERMITTED_MODEL_PLAN",
        "exact fixture tuple matched explicit policy",
        "FAKE_ADAPTER_PLAN_ONLY",
    )


def inspect_archive_metadata(members: tuple[ArchiveMember, ...]) -> ArchiveInspection:
    """Inspect fixed metadata before a nonexistent archive/filesystem adapter."""
    if not isinstance(members, tuple) or not members:
        return ArchiveInspection(
            "REJECTED_ARCHIVE_POLICY",
            "archive metadata must be a non-empty tuple",
            False,
        )
    if len(members) > 5:
        return ArchiveInspection(
            "REJECTED_ARCHIVE_POLICY",
            "member count exceeds declared fixture limit",
            False,
        )
    total_size = 0
    for member in members:
        if not isinstance(member, ArchiveMember):
            return ArchiveInspection(
                "REJECTED_ARCHIVE_POLICY",
                "member is not declared metadata",
                False,
            )
        if not isinstance(member.path, str):
            return ArchiveInspection(
                "REJECTED_ARCHIVE_POLICY",
                "member path is not declared text metadata",
                False,
            )
        normalized_path = member.path.replace("\\", "/")
        normalized_parts = normalized_path.split("/")
        drive_qualified = len(normalized_path) >= 2 and normalized_path[1] == ":"
        if (
            not member.path
            or normalized_path.startswith(("/", "//"))
            or drive_qualified
            or ".." in normalized_parts
            or "" in normalized_parts
            or member.kind != "file"
            or not isinstance(member.size, int)
            or member.size < 0
        ):
            reason = (
                "member path is outside declared destination"
                if ".." in normalized_parts
                else "member violates declared metadata policy"
            )
            return ArchiveInspection("REJECTED_ARCHIVE_POLICY", reason, False)
        total_size += member.size
        if total_size > 1024:
            return ArchiveInspection(
                "REJECTED_ARCHIVE_POLICY",
                "member size exceeds declared fixture limit",
                False,
            )
    return ArchiveInspection(
        "APPROVED_ARCHIVE_METADATA_PLAN",
        "metadata meets fixture policy; no extraction occurred",
        False,
    )


def build_parameterized_query_plan(label: str) -> QueryPlan:
    """Keep a fixed SQL shape and bind one validated fixture value separately."""
    if (
        not isinstance(label, str)
        or not label
        or len(label) > 64
        or any(character not in "abcdefghijklmnopqrstuvwxyz-" for character in label)
    ):
        raise ValueError("label is outside the declared fixture vocabulary")
    return QueryPlan(
        "SELECT record_id FROM atlas_records WHERE label = :label",
        {"label": label},
        False,
    )


def authorize_transform_adapter(
    decision: AuthorizationDecision,
    operation: str,
    source_label: str,
) -> TransformRequest:
    """Require prior tuple authority before planning one fake transform adapter."""
    if (
        not isinstance(decision, AuthorizationDecision)
        or decision.outcome != "PERMITTED_MODEL_PLAN"
        or operation != "normalize_text"
        or source_label not in {"catalog", "exercises"}
    ):
        return TransformRequest(
            "DENIED_TRANSFORM_POLICY",
            operation if isinstance(operation, str) else "invalid",
            source_label if isinstance(source_label, str) else "invalid",
            False,
        )
    return TransformRequest(
        "APPROVED_FAKE_TRANSFORM_PLAN",
        operation,
        source_label,
        False,
    )


def review_release_manifest(value: Mapping[str, object]) -> ReleaseManifestReview:
    """Review finite provenance declarations without resolving dependencies."""
    if not isinstance(value, Mapping):
        raise TypeError("release manifest must be a mapping")
    required = (
        ("has_local_hash", "local_hash"),
        ("source_distribution_reviewed", "source_distribution_review"),
        ("publisher_identity_declared", "publisher_identity"),
        ("build_provenance_declared", "build_provenance"),
    )
    if set(value) != {field for field, _ in required}:
        raise ValueError("release manifest fields are not the declared schema")
    missing = tuple(label for field, label in required if value[field] is not True)
    if missing:
        return ReleaseManifestReview("DEFERRED_RELEASE_REVIEW", missing, False)
    return ReleaseManifestReview("REVIEWED_RELEASE_PLAN", (), False)


def redact_incident_evidence(value: Mapping[str, object]) -> dict[str, object]:
    """Emit only closed safe labels and drop every supplied request-like value."""
    if not isinstance(value, Mapping):
        raise TypeError("incident evidence must be a mapping")
    scenario = value.get("scenario")
    outcome = value.get("authorization_outcome")
    if scenario not in SCENARIOS:
        raise ValueError("scenario must be one fixed public label")
    if outcome not in _AUTHORIZATION_OUTCOMES:
        raise ValueError("authorization outcome must be one fixed public label")
    request = parse_importer_request(fixture_request())
    return _build_packet(
        scenario=scenario,
        request=request,
        parser_outcome="VALIDATED_FORMAT",
        authentication_outcome=(
            "DENIED_AUTHENTICATION"
            if outcome == "DENIED_AUTHENTICATION"
            else "NOT_EVALUATED"
        ),
        authorization_outcome=outcome,
        adapter_outcome="NOT_EVALUATED",
        release_outcome="NOT_EVALUATED",
        privacy_accessibility_outcome="NOT_EVALUATED",
        facts=("redacted local decision record created",),
        hypotheses=(),
        unknowns=("remote importer effect after timeout",),
    ).as_public_dict()


def review_tls_configuration(value: Mapping[str, object]) -> TLSConfigurationReview:
    """Assess only declared static configuration fields; never open a socket."""
    if not isinstance(value, Mapping):
        raise TypeError("TLS configuration must be a mapping")
    required = {"verify_peer", "check_hostname", "ca_source"}
    if set(value) != required:
        raise ValueError("TLS configuration fields are not the declared schema")
    if value["verify_peer"] is not True:
        return TLSConfigurationReview(
            "REJECTED_TLS_CONFIGURATION",
            "peer certificate verification is required",
            False,
        )
    if value["check_hostname"] is not True:
        return TLSConfigurationReview(
            "REJECTED_TLS_CONFIGURATION",
            "hostname verification is required",
            False,
        )
    if not isinstance(value["ca_source"], str) or not value["ca_source"]:
        return TLSConfigurationReview(
            "REJECTED_TLS_CONFIGURATION",
            "declared CA source is required",
            False,
        )
    return TLSConfigurationReview(
        "REVIEWED_TLS_CONFIGURATION",
        "static policy fields are present; no connection was attempted",
        False,
    )


def review_resume_state_format(format_name: str) -> ResumeStateReview:
    """Accept only the fixed primitive fixture grammar; never deserialize."""
    if format_name != "primitive-json":
        return ResumeStateReview(
            "REJECTED_RESUME_FORMAT",
            "only primitive-json fixture state is accepted",
            False,
        )
    return ResumeStateReview(
        "APPROVED_RESUME_MANIFEST_PLAN",
        "primitive fixture state may be parsed by a later bounded grammar",
        False,
    )


def reconstruct_incident(
    local_timeout: bool,
    policy_outcome: str,
) -> IncidentAssessment:
    """Separate local observations from the unobserved remote history."""
    facts: list[str] = []
    unknowns: list[str] = []
    if local_timeout:
        facts.append("local timeout observed")
        unknowns.append("remote importer effect after timeout")
    if policy_outcome == "DENIED_AUTHENTICATION":
        facts.append("authentication denial observed")
    elif policy_outcome == "DENIED_AUTHORIZATION":
        facts.append("policy denial observed")
    elif policy_outcome == "PERMITTED_MODEL_PLAN":
        facts.append("permitted model plan observed")
    elif policy_outcome != "NOT_EVALUATED":
        raise ValueError("incident outcome is outside the declared model")
    return IncidentAssessment(tuple(facts), tuple(unknowns), True)


def assess_audit_hook_proposal() -> AuditHookAssessment:
    """State the observation boundary without registering a hook."""
    return AuditHookAssessment("LOCAL_OBSERVATION", "NOT_A_SANDBOX")


def review_privacy_accessibility(value: Mapping[str, object]) -> PrivacyAccessibilityReview:
    """Review fixed retention and presentation fields without user information."""
    if not isinstance(value, Mapping):
        raise TypeError("privacy/accessibility review must be a mapping")
    required = {
        "retains_raw_secret",
        "uses_colour_only",
        "keyboard_focus_visible",
        "contrast_reviewed",
    }
    if set(value) != required:
        raise ValueError("review fields are not the declared schema")
    issues: list[str] = []
    if value["retains_raw_secret"] is True:
        issues.append("raw secret retention")
    if value["uses_colour_only"] is True:
        issues.append("colour-only status")
    if value["keyboard_focus_visible"] is not True:
        issues.append("keyboard focus evidence absent")
    if value["contrast_reviewed"] is not True:
        issues.append("contrast evidence absent")
    if issues:
        return PrivacyAccessibilityReview("REJECTED_USER_IMPACT_REVIEW", tuple(issues))
    return PrivacyAccessibilityReview("REVIEWED_USER_IMPACT_PLAN", ())


def _build_packet(
    *,
    scenario: str,
    request: ParsedImporterRequest,
    parser_outcome: str,
    authentication_outcome: str,
    authorization_outcome: str,
    adapter_outcome: str,
    release_outcome: str,
    privacy_accessibility_outcome: str,
    facts: tuple[str, ...],
    hypotheses: tuple[str, ...],
    unknowns: tuple[str, ...],
) -> RedactedEvidencePacket:
    """Construct one closed-schema packet from fixture labels only."""
    if scenario not in SCENARIOS:
        raise ValueError("scenario is outside the fixed public vocabulary")
    if parser_outcome not in _PARSER_OUTCOMES:
        raise ValueError("parser outcome is outside the fixed public vocabulary")
    if authentication_outcome not in _AUTHENTICATION_OUTCOMES:
        raise ValueError("authentication outcome is outside the fixed public vocabulary")
    if authorization_outcome not in _AUTHORIZATION_OUTCOMES:
        raise ValueError("authorization outcome is outside the fixed public vocabulary")
    if adapter_outcome not in _ADAPTER_OUTCOMES:
        raise ValueError("adapter outcome is outside the fixed public vocabulary")
    if release_outcome not in _RELEASE_OUTCOMES:
        raise ValueError("release outcome is outside the fixed public vocabulary")
    if privacy_accessibility_outcome not in _PRIVACY_OUTCOMES:
        raise ValueError("privacy outcome is outside the fixed public vocabulary")
    return RedactedEvidencePacket(
        schema_version=EVIDENCE_SCHEMA_VERSION,
        model_version=MODEL_VERSION,
        run_id=_RUN_ID,
        scenario=scenario,
        request_digest=request_digest(request),
        parser_outcome=parser_outcome,
        authentication_outcome=authentication_outcome,
        evidence_scope="REDACTED_LOCAL_EVIDENCE",
        authorization_outcome=authorization_outcome,
        adapter_outcome=adapter_outcome,
        release_outcome=release_outcome,
        input_trace_label="INPUT_CLAIM",
        trace_scope="CORRELATION_ONLY",
        policy_version=SUPPORTED_POLICY_VERSION,
        privacy_accessibility_outcome=privacy_accessibility_outcome,
        remote_outcome="UNKNOWN_REMOTE",
        escalation_owner="atlas-security-review",
        facts=facts,
        hypotheses=hypotheses,
        unknowns=unknowns,
        real_effect="NO_EFFECT",
        limitations=LIMITATION,
    )


def run_scenario(name: str) -> dict[str, object]:
    """Return one closed-schema, redacted packet for a fixed safe scenario."""
    if name not in SCENARIOS:
        raise ValueError("unknown fixed scenario")
    supplied = fixture_request()
    parser_outcome = "VALIDATED_FORMAT"
    authentication_outcome = "NOT_EVALUATED"
    authorization_outcome = "NOT_EVALUATED"
    adapter_outcome = "NOT_EVALUATED"
    release_outcome = "NOT_EVALUATED"
    privacy_outcome = "NOT_EVALUATED"
    facts: tuple[str, ...] = ()
    hypotheses: tuple[str, ...] = ()
    unknowns: tuple[str, ...] = ("remote importer effect after timeout",)

    if name == "authentication_tenant_mismatch":
        supplied["tenant"] = "other-tenant"
    request = parse_importer_request(supplied)

    if name == "trace_claim_only":
        authentication_outcome = "DENIED_AUTHENTICATION"
        authorization_outcome = "DENIED_AUTHENTICATION"
        facts = ("trace correlation input observed",)
    elif name == "authentication_tenant_mismatch":
        authentication = verify_fixture_assertion(request, fixture_assertion_for(request))
        decision = authorize_effect(request, authentication, fixture_authority_context())
        authentication_outcome = authentication.outcome
        authorization_outcome = decision.outcome
        facts = ("fixture authentication observed", "authorization policy denied exact tuple")
    elif name == "retry_subject_mismatch":
        authentication = verify_fixture_assertion(
            request,
            fixture_assertion_for(request, subject="worker-99"),
        )
        decision = authorize_effect(request, authentication, fixture_authority_context())
        authentication_outcome = authentication.outcome
        authorization_outcome = decision.outcome
        facts = ("different authenticated fixture subject observed",)
    elif name == "untrusted_resume_state":
        adapter_outcome = review_resume_state_format("python-object").outcome
        facts = ("resume format rejected before loader",)
    elif name == "archive_policy_rejects":
        adapter_outcome = inspect_archive_metadata(
            (ArchiveMember("../outside.txt", "file", 8),)
        ).outcome
        facts = ("archive metadata rejected before adapter",)
    elif name == "parameterized_value_binding":
        build_parameterized_query_plan("intro-python")
        adapter_outcome = "PARAMETERIZED_QUERY_PLAN"
        facts = ("fixed statement shape planned with separate value",)
    elif name == "transform_denied":
        denied = AuthorizationDecision("DENIED_AUTHORIZATION", "fixture deny", "NO_EFFECT")
        adapter_outcome = authorize_transform_adapter(denied, "shell", "catalog").outcome
        authorization_outcome = denied.outcome
        facts = ("transform request denied before fake adapter",)
    elif name == "fixture_hmac_mismatch":
        authentication = verify_fixture_assertion(request, "worker-17:incorrect-fixture-mac")
        authentication_outcome = authentication.outcome
        authorization_outcome = "DENIED_AUTHENTICATION"
        facts = ("fixture MAC mismatch observed",)
    elif name == "tls_configuration_review":
        adapter_outcome = review_tls_configuration(
            {"verify_peer": True, "check_hostname": False, "ca_source": "declared-ca-set"}
        ).outcome
        facts = ("static TLS configuration reviewed without connection",)
    elif name == "audit_hook_boundary":
        adapter_outcome = assess_audit_hook_proposal().containment_claim
        facts = ("audit-hook observation boundary stated",)
    elif name == "dependency_provenance_gap":
        release_outcome = review_release_manifest(
            {
                "has_local_hash": False,
                "source_distribution_reviewed": False,
                "publisher_identity_declared": False,
                "build_provenance_declared": False,
            }
        ).outcome
        facts = ("release review deferred for missing provenance evidence",)
    elif name == "privacy_accessibility_review":
        privacy_outcome = review_privacy_accessibility(
            {
                "retains_raw_secret": True,
                "uses_colour_only": True,
                "keyboard_focus_visible": False,
                "contrast_reviewed": False,
            }
        ).outcome
        facts = ("user-impact review rejected excessive retention and inaccessible state",)
    else:
        assessment = reconstruct_incident(True, "DENIED_AUTHENTICATION")
        authentication_outcome = "DENIED_AUTHENTICATION"
        authorization_outcome = "DENIED_AUTHENTICATION"
        adapter_outcome = "STATUS_CHECK_REQUIRES_AUTHORIZATION"
        facts = assessment.facts
        hypotheses = ("remote importer may have acted before local timeout",)
        unknowns = assessment.unknowns

    return _build_packet(
        scenario=name,
        request=request,
        parser_outcome=parser_outcome,
        authentication_outcome=authentication_outcome,
        authorization_outcome=authorization_outcome,
        adapter_outcome=adapter_outcome,
        release_outcome=release_outcome,
        privacy_accessibility_outcome=privacy_outcome,
        facts=facts,
        hypotheses=hypotheses,
        unknowns=unknowns,
    ).as_public_dict()


def main(argv: list[str] | None = None) -> int:
    """Render one fixed local scenario; no input beyond its closed name set."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("scenario", choices=SCENARIOS)
    arguments = parser.parse_args(argv)
    print(json.dumps(run_scenario(arguments.scenario), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
