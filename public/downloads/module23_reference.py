"""Deterministic, local-only language-boundary teaching model for Module 23.

Atlas Query text is parsed as a deliberately small data language.  The model
uses only immutable in-memory fixtures and never reaches a host adapter.
"""

from __future__ import annotations

import argparse
import ast
from dataclasses import dataclass
import dis
import sys
from typing import Sequence


MODEL_VERSION = "atlas-module23-reference/1"
GRAMMAR_VERSION = "atlas-query/1"
SCHEMA_VERSION = "atlas-learning-schema/1"
POLICY_VERSION = "atlas-policy-23/1"
EVIDENCE_SCHEMA_VERSION = "atlas.module23.evidence/1"
LIMITATION = (
    "local deterministic teaching model; not a production authorization service, "
    "sandbox, remote read, or hostile-process isolation boundary. Private seal "
    "tokens model provenance for this course; they are not unforgeable "
    "least-privilege isolation inside hostile in-process Python."
)


@dataclass(frozen=True)
class Span:
    """Half-open character span in a supplied Atlas Query string."""

    start: int
    end: int


@dataclass(frozen=True)
class InputBudget:
    """Declared boundary limits checked before any token construction."""

    max_characters: int = 180
    max_bytes: int = 360
    max_tokens: int = 48


DEFAULT_INPUT_BUDGET = InputBudget()


@dataclass(frozen=True)
class InputCheck:
    """Tagged result of the representation and size boundary."""

    outcome: str
    stage: str
    reason: str
    normalized_text: str | None
    character_count: int
    byte_count: int


@dataclass(frozen=True)
class Token:
    """A token recognized by the Atlas-specific scanner."""

    kind: str
    text: str
    span: Span


@dataclass(frozen=True)
class LexResult:
    """A lexical result; token structure does not grant authority."""

    outcome: str
    stage: str
    tokens: tuple[Token, ...]
    reason: str | None
    span: Span | None


@dataclass(frozen=True)
class Comparison:
    """One data-only filter comparison in the original Atlas grammar."""

    field: str
    operator: str
    literal: str | int
    literal_kind: str
    span: Span


@dataclass(frozen=True)
class AtlasFilter:
    """One or two comparisons joined by the grammar's fixed conjunction."""

    comparisons: tuple[Comparison, ...]
    span: Span


@dataclass(frozen=True)
class CountQuery:
    """An aggregate grammar node, not a host-language call."""

    filter: AtlasFilter
    span: Span
    grammar_version: str = GRAMMAR_VERSION


@dataclass(frozen=True)
class MeanQuery:
    """An aggregate grammar node with an allow-listed metric name."""

    metric: str
    filter: AtlasFilter
    span: Span
    grammar_version: str = GRAMMAR_VERSION


QueryAst = CountQuery | MeanQuery


@dataclass(frozen=True)
class ParseResult:
    """Syntax-only parse result with a source span for a stable explanation."""

    outcome: str
    stage: str
    ast: QueryAst | None
    reason: str | None
    span: Span | None


@dataclass(frozen=True)
class FieldSpec:
    """Static domain information for one fixed fixture field."""

    name: str
    literal_kind: str
    operators: tuple[str, ...]
    minimum: int | None = None
    maximum: int | None = None


@dataclass(frozen=True)
class Schema:
    """Versioned schema whose vocabulary is independent of parsing."""

    version: str
    fields: tuple[FieldSpec, ...]
    metrics: tuple[str, ...]


DEFAULT_SCHEMA = Schema(
    version=SCHEMA_VERSION,
    fields=(
        FieldSpec("cohort", "STRING", ("=",)),
        FieldSpec("confidence", "INT", ("=", ">=", "<="), 1, 5),
        FieldSpec("completed", "INT", ("=",), 0, 1),
    ),
    metrics=("confidence",),
)


@dataclass(frozen=True)
class ModelLimits:
    """Logical model budgets, deliberately distinct from host enforcement."""

    max_ast_nodes: int = 5
    max_ast_depth: int = 3
    fuel: int = 24
    max_result_items: int = 4


DEFAULT_LIMITS = ModelLimits()


_PLAN_SEAL = object()


@dataclass(frozen=True)
class PermittedPlan:
    """Validated, fixed-language plan that remains separate from authority."""

    ast: QueryAst
    grammar_version: str
    schema_version: str
    operation: str
    requested_scope: str
    node_count: int
    depth: int
    _seal: object | None = None


@dataclass(frozen=True)
class ValidationResult:
    """The contract result after AST shape, schema, and domain checks."""

    outcome: str
    stage: str
    plan: PermittedPlan | None
    reason: str | None
    span: Span | None


def _valid_plan(plan: PermittedPlan | object) -> bool:
    return (
        type(plan) is PermittedPlan
        and plan._seal is _PLAN_SEAL
        and plan.grammar_version == GRAMMAR_VERSION
        and plan.schema_version == DEFAULT_SCHEMA.version
        and plan.requested_scope == "learning-metrics:atlas"
        and plan.operation in {"count", "mean"}
    )


@dataclass(frozen=True)
class QueryRequest:
    """The full M22-style tuple used by the local policy fixture."""

    subject: str
    action: str
    resource: str
    tenant: str
    purpose: str
    authenticated: bool


_DECISION_SEAL = object()


@dataclass(frozen=True)
class AuthorizationDecision:
    """A deterministic local policy decision, not a real identity claim."""

    outcome: str
    stage: str
    reason: str
    scope: str | None
    policy_version: str
    subject: str | None
    _seal: object | None = None


_CAPABILITY_SEAL = object()


@dataclass(frozen=True)
class ReadLearningMetric:
    """A pre-minted, fixed-scope marker with no record or adapter reference."""

    owner_subject: str
    scope: str
    tenant: str
    purpose: str
    policy_version: str
    metric_vocabulary: tuple[str, ...]
    _seal: object | None = None


@dataclass(frozen=True)
class EvaluationResult:
    """Bounded result labels from the deterministic course fixture only."""

    outcome: str
    stage: str
    reason: str | None
    value: int | float | None
    record_count: int
    consumed_fuel: int
    result_label: str


@dataclass(frozen=True)
class LearningMetricRecord:
    """A redacted immutable teaching fixture; it is never returned publicly."""

    cohort: str
    confidence: int
    completed: int


_LEARNING_FIXTURE = (
    LearningMetricRecord("atlas", 4, 1),
    LearningMetricRecord("atlas", 2, 1),
    LearningMetricRecord("other", 5, 0),
)


def check_input_budget(
    supplied: str | bytes | object,
    budget: InputBudget = DEFAULT_INPUT_BUDGET,
) -> InputCheck:
    """Decode only the bounded representation and report a tagged outcome."""

    if type(budget) is not InputBudget:
        return InputCheck(
            "INPUT_REJECTED", "INPUT_DATA", "invalid input budget", None, 0, 0
        )
    if type(supplied) is bytes:
        byte_count = len(supplied)
        if byte_count > budget.max_bytes:
            return InputCheck(
                "INPUT_REJECTED", "INPUT_DATA", "byte budget exceeded", None, 0, byte_count
            )
        try:
            text = supplied.decode("utf-8")
        except UnicodeDecodeError:
            return InputCheck(
                "INPUT_REJECTED", "INPUT_DATA", "input is not valid UTF-8", None, 0, byte_count
            )
    elif type(supplied) is str:
        text = supplied
        if len(text) > budget.max_characters:
            return InputCheck(
                "INPUT_REJECTED", "INPUT_DATA", "character budget exceeded", None, len(text), 0
            )
        byte_count = len(text.encode("utf-8"))
        if byte_count > budget.max_bytes:
            return InputCheck(
                "INPUT_REJECTED", "INPUT_DATA", "byte budget exceeded", None, len(text), byte_count
            )
    else:
        return InputCheck(
            "INPUT_REJECTED", "INPUT_DATA", "unsupported input representation", None, 0, 0
        )

    if len(text) > budget.max_characters:
        return InputCheck(
            "INPUT_REJECTED", "INPUT_DATA", "character budget exceeded", None, len(text), byte_count
        )
    return InputCheck(
        "INPUT_ACCEPTED", "INPUT_DATA", "within declared input budget", text, len(text), byte_count
    )


def lex_query(text: str, budget: InputBudget = DEFAULT_INPUT_BUDGET) -> LexResult:
    """Scan only the original Atlas Query terminals and emit source spans."""

    if type(text) is not str:
        return LexResult("LEX_ERROR", "LEXICAL_STRUCTURE", (), "query text must be text", None)
    if type(budget) is not InputBudget:
        return LexResult("LEX_ERROR", "LEXICAL_STRUCTURE", (), "invalid lexer budget", None)
    if len(text) > budget.max_characters:
        return LexResult(
            "LEX_ERROR", "LEXICAL_STRUCTURE", (), "character budget exceeded", Span(0, len(text))
        )

    tokens: list[Token] = []
    cursor = 0
    while cursor < len(text):
        character = text[cursor]
        if character.isspace():
            cursor += 1
            continue
        if character.isalpha() or character == "_":
            end = cursor + 1
            while end < len(text) and (text[end].isalnum() or text[end] == "_"):
                end += 1
            tokens.append(Token("IDENT", text[cursor:end], Span(cursor, end)))
            cursor = end
        elif character.isdigit():
            end = cursor + 1
            while end < len(text) and text[end].isdigit():
                end += 1
            tokens.append(Token("INT", text[cursor:end], Span(cursor, end)))
            cursor = end
        elif character == '"':
            end = cursor + 1
            while end < len(text) and text[end] != '"':
                candidate = text[end]
                if not (candidate.isalnum() or candidate in "_- "):
                    return LexResult(
                        "LEX_ERROR",
                        "LEXICAL_STRUCTURE",
                        tuple(tokens),
                        "unsupported string character",
                        Span(end, end + 1),
                    )
                end += 1
            if end >= len(text):
                return LexResult(
                    "LEX_ERROR",
                    "LEXICAL_STRUCTURE",
                    tuple(tokens),
                    "unterminated string literal",
                    Span(cursor, len(text)),
                )
            tokens.append(Token("STRING", text[cursor + 1 : end], Span(cursor, end + 1)))
            cursor = end + 1
        elif character == "(":
            tokens.append(Token("LPAREN", character, Span(cursor, cursor + 1)))
            cursor += 1
        elif character == ")":
            tokens.append(Token("RPAREN", character, Span(cursor, cursor + 1)))
            cursor += 1
        elif character == ",":
            tokens.append(Token("COMMA", character, Span(cursor, cursor + 1)))
            cursor += 1
        elif character == "=":
            tokens.append(Token("CMP", character, Span(cursor, cursor + 1)))
            cursor += 1
        elif character in "><" and cursor + 1 < len(text) and text[cursor + 1] == "=":
            tokens.append(Token("CMP", text[cursor : cursor + 2], Span(cursor, cursor + 2)))
            cursor += 2
        else:
            return LexResult(
                "LEX_ERROR",
                "LEXICAL_STRUCTURE",
                tuple(tokens),
                "unsupported character",
                Span(cursor, cursor + 1),
            )

        if len(tokens) > budget.max_tokens:
            return LexResult(
                "LEX_ERROR",
                "LEXICAL_STRUCTURE",
                tuple(tokens),
                "token budget exceeded",
                tokens[-1].span,
            )
    return LexResult("TOKENS", "LEXICAL_STRUCTURE", tuple(tokens), None, None)


class _Parser:
    """A small recursive-descent parser for the published Atlas grammar."""

    def __init__(self, tokens: tuple[Token, ...]) -> None:
        self.tokens = tokens
        self.position = 0

    def current(self) -> Token | None:
        if self.position >= len(self.tokens):
            return None
        return self.tokens[self.position]

    def take(self) -> Token | None:
        token = self.current()
        if token is not None:
            self.position += 1
        return token

    def expect_kind(self, kind: str, reason: str) -> tuple[Token | None, ParseResult | None]:
        token = self.current()
        if token is None or token.kind != kind:
            return None, ParseResult(
                "PARSE_ERROR",
                "SYNTAX_ONLY",
                None,
                reason,
                None if token is None else token.span,
            )
        self.position += 1
        return token, None

    def expect_word(self, word: str, reason: str) -> tuple[Token | None, ParseResult | None]:
        token = self.current()
        if token is None or token.kind != "IDENT" or token.text != word:
            return None, ParseResult(
                "PARSE_ERROR",
                "SYNTAX_ONLY",
                None,
                reason,
                None if token is None else token.span,
            )
        self.position += 1
        return token, None

    def comparison(self) -> tuple[Comparison | None, ParseResult | None]:
        field, failure = self.expect_kind("IDENT", "expected filter field")
        if failure is not None:
            return None, failure
        operator, failure = self.expect_kind("CMP", "expected comparison operator")
        if failure is not None:
            return None, failure
        literal = self.current()
        if literal is None or literal.kind not in {"STRING", "INT"}:
            return None, ParseResult(
                "PARSE_ERROR",
                "SYNTAX_ONLY",
                None,
                "expected literal",
                None if literal is None else literal.span,
            )
        self.position += 1
        value: str | int
        if literal.kind == "INT":
            value = int(literal.text)
        else:
            value = literal.text
        return (
            Comparison(
                field.text,
                operator.text,
                value,
                literal.kind,
                Span(field.span.start, literal.span.end),
            ),
            None,
        )

    def filter(self) -> tuple[AtlasFilter | None, ParseResult | None]:
        start, failure = self.expect_word("where", "expected 'where' filter")
        if failure is not None:
            return None, failure
        first, failure = self.comparison()
        if failure is not None:
            return None, failure
        comparisons = [first]
        if self.current() is not None and self.current().kind == "IDENT" and self.current().text == "and":
            self.position += 1
            second, failure = self.comparison()
            if failure is not None:
                return None, failure
            comparisons.append(second)
        return AtlasFilter(tuple(comparisons), Span(start.span.start, comparisons[-1].span.end)), None


def parse_query(tokens: Sequence[Token] | object) -> ParseResult:
    """Parse only tokens emitted by the Atlas scanner; success is syntax only."""

    if not isinstance(tokens, Sequence) or isinstance(tokens, (str, bytes)):
        return ParseResult("PARSE_ERROR", "SYNTAX_ONLY", None, "tokens must be a token sequence", None)
    token_tuple = tuple(tokens)
    if any(type(token) is not Token for token in token_tuple):
        return ParseResult("PARSE_ERROR", "SYNTAX_ONLY", None, "unrecognized token representation", None)
    parser = _Parser(token_tuple)
    head = parser.current()
    if head is None or head.kind != "IDENT" or head.text not in {"count", "mean"}:
        return ParseResult(
            "PARSE_ERROR",
            "SYNTAX_ONLY",
            None,
            "expected aggregate 'count' or 'mean'",
            None if head is None else head.span,
        )
    parser.take()
    _, failure = parser.expect_kind("LPAREN", "expected '(' after aggregate")
    if failure is not None:
        return failure

    metric: str | None = None
    if head.text == "mean":
        metric_token, failure = parser.expect_kind("IDENT", "expected metric name")
        if failure is not None:
            return failure
        metric = metric_token.text
        _, failure = parser.expect_kind("COMMA", "expected ',' after metric")
        if failure is not None:
            return failure

    filter_node, failure = parser.filter()
    if failure is not None:
        return failure
    closing, failure = parser.expect_kind("RPAREN", "expected ')' after filter")
    if failure is not None:
        return failure
    trailing = parser.current()
    if trailing is not None:
        return ParseResult(
            "PARSE_ERROR", "SYNTAX_ONLY", None, "unexpected trailing token", trailing.span
        )
    span = Span(head.span.start, closing.span.end)
    if head.text == "count":
        ast: QueryAst = CountQuery(filter_node, span)
    else:
        ast = MeanQuery(metric, filter_node, span)
    return ParseResult("PARSED", "SYNTAX_ONLY", ast, None, None)


def _field_spec(schema: Schema, name: str) -> FieldSpec | None:
    for field in schema.fields:
        if field.name == name:
            return field
    return None


def _ast_metrics(ast: QueryAst) -> tuple[int, int]:
    return 2 + len(ast.filter.comparisons), 3


def validate_query(
    ast: QueryAst | object,
    schema: Schema = DEFAULT_SCHEMA,
    limits: ModelLimits = DEFAULT_LIMITS,
) -> ValidationResult:
    """Establish allow-listed AST shape and fixed domain contracts only."""

    if type(schema) is not Schema or type(limits) is not ModelLimits:
        return ValidationResult(
            "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "invalid validation policy", None
        )
    if schema.version != DEFAULT_SCHEMA.version:
        return ValidationResult(
            "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "unsupported schema version", None
        )
    if schema != DEFAULT_SCHEMA:
        return ValidationResult(
            "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "unsupported schema contract", None
        )
    if type(ast) not in {CountQuery, MeanQuery}:
        return ValidationResult(
            "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "unsupported AST form", None
        )
    if ast.grammar_version != GRAMMAR_VERSION:
        return ValidationResult(
            "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "unsupported grammar version", ast.span
        )
    if type(ast.filter) is not AtlasFilter:
        return ValidationResult(
            "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "unsupported filter form", ast.span
        )
    comparisons = ast.filter.comparisons
    if not 1 <= len(comparisons) <= 2 or any(type(item) is not Comparison for item in comparisons):
        return ValidationResult(
            "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "unsupported filter shape", ast.filter.span
        )
    node_count, depth = _ast_metrics(ast)
    if node_count > limits.max_ast_nodes:
        return ValidationResult(
            "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "AST node budget exceeded", ast.span
        )
    if depth > limits.max_ast_depth:
        return ValidationResult(
            "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "AST depth budget exceeded", ast.span
        )

    seen_fields: set[str] = set()
    for comparison in comparisons:
        if comparison.field in seen_fields:
            return ValidationResult(
                "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "duplicate filter field", comparison.span
            )
        seen_fields.add(comparison.field)
        field = _field_spec(schema, comparison.field)
        if field is None:
            return ValidationResult(
                "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "unknown schema field", comparison.span
            )
        if comparison.operator not in field.operators:
            return ValidationResult(
                "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "operator is not permitted for field", comparison.span
            )
        if comparison.literal_kind != field.literal_kind:
            return ValidationResult(
                "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "literal type does not match field", comparison.span
            )
        if field.literal_kind == "INT":
            if type(comparison.literal) is not int:
                return ValidationResult(
                    "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "integer literal is malformed", comparison.span
                )
            if field.minimum is not None and comparison.literal < field.minimum:
                return ValidationResult(
                    "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "literal is below field domain", comparison.span
                )
            if field.maximum is not None and comparison.literal > field.maximum:
                return ValidationResult(
                    "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "literal is above field domain", comparison.span
                )
        elif type(comparison.literal) is not str or not comparison.literal:
            return ValidationResult(
                "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "text literal is malformed", comparison.span
            )

    operation = "count"
    if type(ast) is MeanQuery:
        if ast.metric not in schema.metrics:
            return ValidationResult(
                "CONTRACT_ERROR", "CONTRACT_CHECKED", None, "metric is not permitted", ast.span
            )
        operation = "mean"
    plan = PermittedPlan(
        ast=ast,
        grammar_version=GRAMMAR_VERSION,
        schema_version=schema.version,
        operation=operation,
        requested_scope="learning-metrics:atlas",
        node_count=node_count,
        depth=depth,
        _seal=_PLAN_SEAL,
    )
    return ValidationResult("PERMITTED_PLAN", "CONTRACT_CHECKED", plan, None, None)


def fixture_authorized_request() -> QueryRequest:
    """Return the one authenticated request tuple permitted by the fixture."""

    return QueryRequest(
        subject="analyst-23",
        action="READ_LEARNING_METRIC",
        resource="atlas-learning-snapshot",
        tenant="atlas",
        purpose="course-quality-review",
        authenticated=True,
    )


def _plan_stays_within_tenant_scope(plan: PermittedPlan, tenant: str) -> bool:
    """Keep a data-language cohort filter from widening fixed capability scope."""

    return all(
        comparison.field != "cohort" or comparison.literal == tenant
        for comparison in plan.ast.filter.comparisons
    )


def authorize_query(
    request: QueryRequest | object, plan: PermittedPlan | object
) -> AuthorizationDecision:
    """Apply a fixed policy after contract checking; parsing contributes no grant."""

    if not _valid_plan(plan):
        return AuthorizationDecision(
            "DENIED_CONTRACT", "AUTHORIZED", "a permitted plan is required", None, POLICY_VERSION, None
        )
    if type(request) is not QueryRequest:
        return AuthorizationDecision(
            "DENIED_AUTHENTICATION", "AUTHORIZED", "request representation is not authenticated", None, POLICY_VERSION, None
        )
    if not request.authenticated:
        return AuthorizationDecision(
            "DENIED_AUTHENTICATION", "AUTHORIZED", "fixture authentication was not established", None, POLICY_VERSION, None
        )
    expected = fixture_authorized_request()
    if (
        request.subject != expected.subject
        or request.action != expected.action
        or request.resource != expected.resource
        or request.tenant != expected.tenant
        or request.purpose != expected.purpose
    ):
        return AuthorizationDecision(
            "DENIED_AUTHORIZATION",
            "AUTHORIZED",
            "request tuple is outside the fixed local policy",
            None,
            POLICY_VERSION,
            request.subject,
        )
    if not _plan_stays_within_tenant_scope(plan, request.tenant):
        return AuthorizationDecision(
            "DENIED_AUTHORIZATION",
            "AUTHORIZED",
            "query filter is outside fixed local tenant scope",
            None,
            POLICY_VERSION,
            request.subject,
        )
    if plan.requested_scope != "learning-metrics:atlas":
        return AuthorizationDecision(
            "DENIED_AUTHORIZATION",
            "AUTHORIZED",
            "requested scope is outside fixed local policy",
            None,
            POLICY_VERSION,
            request.subject,
        )
    return AuthorizationDecision(
        "PERMITTED_MODEL_READ",
        "AUTHORIZED",
        "fixed local policy permits one aggregate read",
        "learning-metrics:atlas",
        POLICY_VERSION,
        request.subject,
        _DECISION_SEAL,
    )


def mint_read_capability(decision: AuthorizationDecision | object) -> ReadLearningMetric | None:
    """Mint the sole narrow model marker only for the exact permitted decision."""

    if type(decision) is not AuthorizationDecision:
        return None
    if (
        decision._seal is not _DECISION_SEAL
        or decision.outcome != "PERMITTED_MODEL_READ"
        or decision.scope != "learning-metrics:atlas"
    ):
        return None
    if decision.subject is None:
        return None
    return ReadLearningMetric(
        owner_subject=decision.subject,
        scope=decision.scope,
        tenant="atlas",
        purpose="course-quality-review",
        policy_version=decision.policy_version,
        metric_vocabulary=DEFAULT_SCHEMA.metrics,
        _seal=_CAPABILITY_SEAL,
    )


def _valid_capability(capability: ReadLearningMetric | object) -> bool:
    return (
        type(capability) is ReadLearningMetric
        and capability._seal is _CAPABILITY_SEAL
        and capability.scope == "learning-metrics:atlas"
        and capability.tenant == "atlas"
        and capability.purpose == "course-quality-review"
        and capability.policy_version == POLICY_VERSION
        and capability.metric_vocabulary == DEFAULT_SCHEMA.metrics
    )


def _record_value(record: LearningMetricRecord, field: str) -> str | int | None:
    if field == "cohort":
        return record.cohort
    if field == "confidence":
        return record.confidence
    if field == "completed":
        return record.completed
    return None


def _matches(record: LearningMetricRecord, comparison: Comparison) -> bool:
    value = _record_value(record, comparison.field)
    if value is None:
        return False
    if comparison.operator == "=":
        return value == comparison.literal
    if comparison.operator == ">=":
        return type(value) is int and type(comparison.literal) is int and value >= comparison.literal
    if comparison.operator == "<=":
        return type(value) is int and type(comparison.literal) is int and value <= comparison.literal
    return False


def _result(
    outcome: str,
    reason: str | None,
    value: int | float | None,
    record_count: int,
    consumed_fuel: int,
    result_label: str,
    stage: str = "LOCAL_MODEL",
) -> EvaluationResult:
    return EvaluationResult(
        outcome, stage, reason, value, record_count, consumed_fuel, result_label
    )


def evaluate_query(
    plan: PermittedPlan | object,
    capability: ReadLearningMetric | object | None,
    limits: ModelLimits = DEFAULT_LIMITS,
) -> EvaluationResult:
    """Evaluate a permitted aggregate against fixed redacted fixtures only."""

    if not _valid_plan(plan):
        return _result("DOMAIN_ERROR", "permitted plan is required", None, 0, 0, "NO_RESULT")
    if not _valid_capability(capability):
        return _result(
            "CAPABILITY_DENIED",
            "pre-minted narrow read capability is required",
            None,
            0,
            0,
            "NO_RESULT",
            "NARROW_CAPABILITY",
        )
    if type(limits) is not ModelLimits:
        return _result("DOMAIN_ERROR", "invalid evaluation limits", None, 0, 0, "NO_RESULT")
    if plan.schema_version != DEFAULT_SCHEMA.version or plan.grammar_version != GRAMMAR_VERSION:
        return _result("DOMAIN_ERROR", "plan version is not current", None, 0, 0, "NO_RESULT")
    if plan.node_count > limits.max_ast_nodes or plan.depth > limits.max_ast_depth:
        return _result("DOMAIN_ERROR", "plan exceeds evaluator AST limits", None, 0, 0, "NO_RESULT")

    consumed = 0

    def consume() -> bool:
        nonlocal consumed
        if consumed >= limits.fuel:
            return False
        consumed += 1
        return True

    for _ in range(plan.node_count):
        if not consume():
            return _result(
                "FUEL_EXHAUSTED", "fuel exhausted before fixture scan", None, 0, consumed, "NO_RESULT"
            )

    matched: list[LearningMetricRecord] = []
    for record in _LEARNING_FIXTURE:
        if record.cohort != capability.tenant:
            continue
        all_match = True
        for comparison in plan.ast.filter.comparisons:
            if not consume():
                return _result(
                    "FUEL_EXHAUSTED", "fuel exhausted during filter", None, len(matched), consumed, "NO_RESULT"
                )
            if not _matches(record, comparison):
                all_match = False
                break
        if all_match:
            matched.append(record)
            if len(matched) > limits.max_result_items:
                return _result(
                    "RESULT_LIMIT_EXCEEDED",
                    "aggregate cardinality exceeds declared result limit",
                    None,
                    len(matched),
                    consumed,
                    "NO_RESULT",
                )

    if plan.operation == "count":
        return _result("RESULT", None, len(matched), len(matched), consumed, "SCALAR_LOCAL_AGGREGATE")
    if plan.operation == "mean" and type(plan.ast) is MeanQuery and plan.ast.metric == "confidence":
        if not matched:
            return _result("DOMAIN_ERROR", "mean has no matching fixture values", None, 0, consumed, "NO_RESULT")
        total = 0
        for record in matched:
            if not consume():
                return _result(
                    "FUEL_EXHAUSTED", "fuel exhausted during aggregate", None, len(matched), consumed, "NO_RESULT"
                )
            total += record.confidence
        return _result(
            "RESULT", None, total / len(matched), len(matched), consumed, "SCALAR_LOCAL_AGGREGATE"
        )
    return _result("DOMAIN_ERROR", "unsupported permitted operation", None, len(matched), consumed, "NO_RESULT")


# Pebble is intentionally constructed as data in this file.  It has no text
# reader and no authority-bearing operation; it exists to make lexical scope
# and deterministic evaluation observable before Atlas policy is introduced.
@dataclass(frozen=True)
class PebbleInt:
    value: int


@dataclass(frozen=True)
class PebbleBool:
    value: bool


@dataclass(frozen=True)
class PebbleName:
    name: str


@dataclass(frozen=True)
class PebbleBinary:
    operator: str
    left: object
    right: object


@dataclass(frozen=True)
class PebbleIf:
    condition: object
    then_branch: object
    else_branch: object


@dataclass(frozen=True)
class PebbleLet:
    name: str
    value: object
    body: object


@dataclass(frozen=True)
class PebbleFunction:
    parameter: str
    body: object


@dataclass(frozen=True)
class PebbleApply:
    function: object
    argument: object


@dataclass(frozen=True)
class PebbleEnvironment:
    """An immutable parent chain for Pebble's lexical bindings."""

    bindings: tuple[tuple[str, object], ...] = ()
    parent: "PebbleEnvironment | None" = None

    def extend(self, name: str, value: object) -> "PebbleEnvironment":
        return PebbleEnvironment(((name, value),), self)

    def lookup(self, name: str) -> tuple[bool, object | None]:
        current: PebbleEnvironment | None = self
        while current is not None:
            for candidate, value in current.bindings:
                if candidate == name:
                    return True, value
            current = current.parent
        return False, None


@dataclass(frozen=True)
class PebbleClosure:
    parameter: str
    body: object
    lexical_environment: PebbleEnvironment


@dataclass(frozen=True)
class PebbleOutcome:
    outcome: str
    value: int | bool | PebbleClosure | None
    reason: str | None
    consumed_fuel: int


class _PebbleStop(Exception):
    def __init__(self, outcome: str, reason: str) -> None:
        self.outcome = outcome
        self.reason = reason


def pebble_evaluate(
    expression: object,
    environment: PebbleEnvironment | None = None,
    fuel: int = 64,
) -> PebbleOutcome:
    """Use stated left-to-right, call-by-value, lexical Pebble semantics."""

    if type(fuel) is not int or fuel < 0:
        return PebbleOutcome("PEBBLE_ERROR", None, "fuel must be a non-negative integer", 0)
    root = PebbleEnvironment() if environment is None else environment
    if type(root) is not PebbleEnvironment:
        return PebbleOutcome("PEBBLE_ERROR", None, "invalid lexical environment", 0)
    consumed = 0

    def consume() -> None:
        nonlocal consumed
        if consumed >= fuel:
            raise _PebbleStop("FUEL_EXHAUSTED", "Pebble fuel exhausted")
        consumed += 1

    def integer(value: object) -> int:
        if type(value) is not int:
            raise _PebbleStop("PEBBLE_ERROR", "integer operand required")
        return value

    def boolean(value: object) -> bool:
        if type(value) is not bool:
            raise _PebbleStop("PEBBLE_ERROR", "Boolean condition required")
        return value

    def visit(node: object, lexical: PebbleEnvironment) -> int | bool | PebbleClosure:
        consume()
        if type(node) is PebbleInt:
            return node.value
        if type(node) is PebbleBool:
            return node.value
        if type(node) is PebbleName:
            found, value = lexical.lookup(node.name)
            if not found:
                raise _PebbleStop("PEBBLE_ERROR", "unbound Pebble name")
            return value  # type: ignore[return-value]
        if type(node) is PebbleLet:
            bound = visit(node.value, lexical)
            return visit(node.body, lexical.extend(node.name, bound))
        if type(node) is PebbleFunction:
            return PebbleClosure(node.parameter, node.body, lexical)
        if type(node) is PebbleApply:
            function = visit(node.function, lexical)
            argument = visit(node.argument, lexical)
            if type(function) is not PebbleClosure:
                raise _PebbleStop("PEBBLE_ERROR", "function value required")
            return visit(function.body, function.lexical_environment.extend(function.parameter, argument))
        if type(node) is PebbleIf:
            condition = boolean(visit(node.condition, lexical))
            if condition:
                return visit(node.then_branch, lexical)
            return visit(node.else_branch, lexical)
        if type(node) is PebbleBinary:
            left = visit(node.left, lexical)
            if node.operator == "and":
                if not boolean(left):
                    return False
                return boolean(visit(node.right, lexical))
            if node.operator == "or":
                if boolean(left):
                    return True
                return boolean(visit(node.right, lexical))
            right = visit(node.right, lexical)
            if node.operator == "+":
                return integer(left) + integer(right)
            if node.operator == "-":
                return integer(left) - integer(right)
            if node.operator == "*":
                return integer(left) * integer(right)
            if node.operator == "=":
                return left == right
            if node.operator == ">=":
                return integer(left) >= integer(right)
            if node.operator == "<=":
                return integer(left) <= integer(right)
            raise _PebbleStop("PEBBLE_ERROR", "unsupported Pebble operator")
        raise _PebbleStop("PEBBLE_ERROR", "unsupported Pebble expression")

    try:
        value = visit(expression, root)
    except _PebbleStop as stopped:
        return PebbleOutcome(stopped.outcome, None, stopped.reason, consumed)
    return PebbleOutcome("VALUE", value, None, consumed)


def pebble_closure_example() -> PebbleOutcome:
    """Return a fixed capture example: outer x remains 7, not caller x of 100."""

    expression = PebbleLet(
        "x",
        PebbleInt(7),
        PebbleLet(
            "add_x",
            PebbleFunction("y", PebbleBinary("+", PebbleName("x"), PebbleName("y"))),
            PebbleLet("x", PebbleInt(100), PebbleApply(PebbleName("add_x"), PebbleInt(5))),
        ),
    )
    return pebble_evaluate(expression)


_TRUSTED_BRIDGE_SOURCE = "def increment(value):\n    return value + 1\n"


def _trusted_bridge_increment(value: int) -> int:
    """Course-owned sample for inspection only; the bridge never calls it."""

    return value + 1


def trusted_compilation_bridge() -> dict[str, object]:
    """Inspect fixed course-owned source without executing learner-supplied text."""

    tree = ast.parse(_TRUSTED_BRIDGE_SOURCE, mode="exec")
    node_kinds = tuple(type(node).__name__ for node in ast.walk(tree))
    instruction_names = tuple(
        instruction.opname for instruction in dis.get_instructions(_trusted_bridge_increment)
    )
    implementation_version = (
        f"{sys.implementation.name} "
        f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    )
    return {
        "source_label": "FIXED_BUNDLED_TRUSTED_SAMPLE",
        "trusted_source": _TRUSTED_BRIDGE_SOURCE,
        "tree_summary": "Module(FunctionDef → Return(BinOp(Name + Constant)))",
        "ast_node_kinds": node_kinds,
        "code_object_idea": "the bundled function has an existing code object; no source is compiled at bridge time",
        "code_object_metadata": {
            "name": _trusted_bridge_increment.__code__.co_name,
            "argcount": _trusted_bridge_increment.__code__.co_argcount,
            "instruction_count": len(instruction_names),
        },
        "implementation_version": implementation_version,
        "instruction_names": instruction_names,
        "observation_label": "implementation/version-labelled local observation",
        "executed": False,
        "claim_boundary": "not portable language semantics, an authorization decision, or a performance result",
    }


def _pipeline_packet(
    scenario: str,
    source: str,
    request: QueryRequest | None = None,
    limits: ModelLimits = DEFAULT_LIMITS,
    mint: bool = True,
) -> dict[str, object]:
    input_check = check_input_budget(source)
    if input_check.outcome != "INPUT_ACCEPTED" or input_check.normalized_text is None:
        return redact_evidence(scenario, input_check=input_check)
    lexed = lex_query(input_check.normalized_text)
    if lexed.outcome != "TOKENS":
        return redact_evidence(scenario, input_check=input_check, lexed=lexed)
    parsed = parse_query(lexed.tokens)
    if parsed.outcome != "PARSED":
        return redact_evidence(scenario, input_check=input_check, lexed=lexed, parsed=parsed)
    validated = validate_query(parsed.ast, limits=limits)
    if validated.outcome != "PERMITTED_PLAN" or validated.plan is None:
        return redact_evidence(
            scenario, input_check=input_check, lexed=lexed, parsed=parsed, validated=validated
        )
    decision = authorize_query(
        fixture_authorized_request() if request is None else request, validated.plan
    )
    if decision.outcome != "PERMITTED_MODEL_READ":
        return redact_evidence(
            scenario,
            input_check=input_check,
            lexed=lexed,
            parsed=parsed,
            validated=validated,
            decision=decision,
        )
    capability = mint_read_capability(decision) if mint else None
    evaluated = evaluate_query(validated.plan, capability, limits)
    return redact_evidence(
        scenario,
        input_check=input_check,
        lexed=lexed,
        parsed=parsed,
        validated=validated,
        decision=decision,
        capability=capability,
        evaluated=evaluated,
    )


SCENARIOS = (
    "successful_count",
    "lexical_rejection",
    "syntax_rejection",
    "contract_rejection",
    "authorization_denial",
    "scope_filter_denial",
    "capability_absent",
    "fuel_exhausted",
    "result_limit",
    "pebble_closure",
    "trusted_compilation_bridge",
)


def redact_evidence(
    scenario: str,
    *,
    input_check: InputCheck | None = None,
    lexed: LexResult | None = None,
    parsed: ParseResult | None = None,
    validated: ValidationResult | None = None,
    decision: AuthorizationDecision | None = None,
    capability: ReadLearningMetric | None = None,
    evaluated: EvaluationResult | None = None,
) -> dict[str, object]:
    """Emit a closed evidence packet without source, fixture, or capability data."""

    stage = "INPUT_DATA"
    outcome = "NOT_EVALUATED"
    reason: str | None = None
    failure_span: tuple[int, int] | None = None
    budget_label = "NOT_EVALUATED"
    if input_check is not None:
        stage, outcome, reason = input_check.stage, input_check.outcome, input_check.reason
        budget_label = "INPUT_BUDGET_ACCEPTED" if outcome == "INPUT_ACCEPTED" else "INPUT_BUDGET_REJECTED"
    if lexed is not None:
        stage, outcome, reason = lexed.stage, lexed.outcome, lexed.reason
        if lexed.span is not None:
            failure_span = (lexed.span.start, lexed.span.end)
        if reason == "token budget exceeded":
            budget_label = "TOKEN_BUDGET_REJECTED"
    if parsed is not None:
        stage, outcome, reason = parsed.stage, parsed.outcome, parsed.reason
        if parsed.span is not None:
            failure_span = (parsed.span.start, parsed.span.end)
    if validated is not None:
        stage, outcome, reason = validated.stage, validated.outcome, validated.reason
        if validated.span is not None:
            failure_span = (validated.span.start, validated.span.end)
        if reason in {"AST node budget exceeded", "AST depth budget exceeded"}:
            budget_label = "AST_BUDGET_REJECTED"
    if decision is not None:
        stage, outcome, reason = decision.stage, decision.outcome, decision.reason
    if evaluated is not None:
        stage, outcome, reason = evaluated.stage, evaluated.outcome, evaluated.reason
        if outcome == "FUEL_EXHAUSTED":
            budget_label = "FUEL_BUDGET_REJECTED"
        elif outcome == "RESULT_LIMIT_EXCEEDED":
            budget_label = "RESULT_BUDGET_REJECTED"

    return {
        "schema_version": EVIDENCE_SCHEMA_VERSION,
        "model_version": MODEL_VERSION,
        "scenario": scenario if scenario in SCENARIOS else "UNLABELLED_LOCAL_CASE",
        "grammar_version": GRAMMAR_VERSION,
        "schema_contract_version": SCHEMA_VERSION,
        "policy_version": POLICY_VERSION,
        "stage": stage,
        "outcome": outcome,
        "reason": reason,
        "failure_span": failure_span,
        "capability_state": (
            "MINTED_NARROW_READ_CAPABILITY" if _valid_capability(capability) else "NOT_MINTED"
        ),
        "budget_label": budget_label,
        "result_label": "NO_RESULT" if evaluated is None else evaluated.result_label,
        "local_value": None if evaluated is None else evaluated.value,
        "record_count": 0 if evaluated is None else evaluated.record_count,
        "evidence_scope": "REDACTED_LOCAL_EVIDENCE",
        "source_disposition": "QUERY_TEXT_REDACTED",
        "record_disposition": "FIXTURE_RECORDS_REDACTED",
        "capability_disposition": "CAPABILITY_DETAILS_REDACTED",
        "real_effect": "NO_EXTERNAL_EFFECT",
        "unknowns": ("whether a remote analytics service would return the same result",),
        "limitations": LIMITATION,
    }


def run_scenario(scenario: str) -> dict[str, object]:
    """Run one fixed teaching fixture; no command path accepts query text."""

    if scenario not in SCENARIOS:
        raise ValueError("scenario must be one of the fixed teaching fixtures")
    if scenario == "successful_count":
        return _pipeline_packet(scenario, 'count(where cohort = "atlas")')
    if scenario == "lexical_rejection":
        return _pipeline_packet(scenario, 'count(where cohort = "atlas" @)')
    if scenario == "syntax_rejection":
        return _pipeline_packet(scenario, 'count(where cohort = "atlas"')
    if scenario == "contract_rejection":
        return _pipeline_packet(scenario, "count(where unknown_field = 3)")
    if scenario == "authorization_denial":
        denied = QueryRequest(
            "analyst-23",
            "READ_LEARNING_METRIC",
            "atlas-learning-snapshot",
            "other-tenant",
            "course-quality-review",
            True,
        )
        return _pipeline_packet(scenario, 'count(where cohort = "atlas")', denied)
    if scenario == "scope_filter_denial":
        return _pipeline_packet(scenario, 'count(where cohort = "other")')
    if scenario == "capability_absent":
        return _pipeline_packet(scenario, 'count(where cohort = "atlas")', mint=False)
    if scenario == "fuel_exhausted":
        return _pipeline_packet(
            scenario, 'count(where cohort = "atlas")', limits=ModelLimits(fuel=1)
        )
    if scenario == "result_limit":
        return _pipeline_packet(
            scenario, 'count(where cohort = "atlas")', limits=ModelLimits(max_result_items=1)
        )
    if scenario == "pebble_closure":
        closure = pebble_closure_example()
        return {
            "schema_version": EVIDENCE_SCHEMA_VERSION,
            "model_version": MODEL_VERSION,
            "scenario": scenario,
            "grammar_version": "pebble-constructed-ast/1",
            "schema_contract_version": "NOT_APPLICABLE",
            "policy_version": "NOT_APPLICABLE",
            "stage": "PEBBLE_LEXICAL_ENVIRONMENT",
            "outcome": closure.outcome,
            "reason": closure.reason,
            "failure_span": None,
            "capability_state": "NO_CAPABILITY_IN_PURE_PEBBLE",
            "budget_label": "PEBBLE_FUEL_BOUNDED",
            "result_label": "PURE_PEBBLE_VALUE",
            "local_value": closure.value,
            "record_count": 0,
            "evidence_scope": "REDACTED_LOCAL_EVIDENCE",
            "source_disposition": "NO_EXTERNAL_PEBBLE_TEXT",
            "record_disposition": "NO_ATLAS_FIXTURE_READ",
            "capability_disposition": "NOT_APPLICABLE",
            "real_effect": "NO_EXTERNAL_EFFECT",
            "unknowns": ("how another language specifies scope",),
            "limitations": "pure teaching semantics; not Python execution-model evidence",
        }
    bridge = trusted_compilation_bridge()
    return {
        "schema_version": EVIDENCE_SCHEMA_VERSION,
        "model_version": MODEL_VERSION,
        "scenario": scenario,
        "grammar_version": "NOT_APPLICABLE",
        "schema_contract_version": "NOT_APPLICABLE",
        "policy_version": "NOT_APPLICABLE",
        "stage": "TRUSTED_COMPILATION_BRIDGE",
        "outcome": "STATIC_OBSERVATION",
        "reason": "fixed bundled trusted sample only",
        "failure_span": None,
        "capability_state": "NOT_APPLICABLE",
        "budget_label": "NOT_APPLICABLE",
        "result_label": "NO_RESULT",
        "local_value": None,
        "record_count": 0,
        "evidence_scope": "REDACTED_LOCAL_EVIDENCE",
        "source_disposition": "NO_EXTERNAL_SOURCE",
        "record_disposition": "NO_ATLAS_FIXTURE_READ",
        "capability_disposition": "NOT_APPLICABLE",
        "real_effect": "NO_EXTERNAL_EFFECT",
        "unknowns": ("which bytecode a different Python implementation would use",),
        "limitations": bridge["claim_boundary"],
        "bridge": bridge,
    }


def build_cli() -> argparse.ArgumentParser:
    """Build a fixed-scenario interface with no text-input argument."""

    parser = argparse.ArgumentParser(description="Run one Module 23 local teaching fixture.")
    parser.add_argument("scenario", metavar="SCENARIO", help="fixed scenario name")
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    """Print one closed packet chosen from the fixed scenario vocabulary."""

    parser = build_cli()
    arguments = parser.parse_args(argv)
    if arguments.scenario not in SCENARIOS:
        parser.error("scenario must be one of the fixed teaching fixtures")
    print(run_scenario(arguments.scenario))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
