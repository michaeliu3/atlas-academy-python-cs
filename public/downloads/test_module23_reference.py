"""Behavioral seams for Module 23's deterministic language-model fixture."""

from __future__ import annotations

from contextlib import redirect_stderr, redirect_stdout
from io import StringIO
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
import module23_reference as model


class InputBudgetSeamTests(unittest.TestCase):
    def test_valid_text_is_accepted_before_lexing(self) -> None:
        checked = model.check_input_budget('count(where cohort = "atlas")')

        self.assertEqual(checked.outcome, "INPUT_ACCEPTED")
        self.assertEqual(checked.normalized_text, 'count(where cohort = "atlas")')
        self.assertEqual(checked.stage, "INPUT_DATA")

    def test_malformed_bytes_reject_before_lexing(self) -> None:
        checked = model.check_input_budget(b"\xff")

        self.assertEqual(checked.outcome, "INPUT_REJECTED")
        self.assertEqual(checked.reason, "input is not valid UTF-8")
        self.assertIsNone(checked.normalized_text)

    def test_character_and_byte_budgets_are_distinct_early_rejections(self) -> None:
        character_limited = model.check_input_budget(
            "x" * 9, model.InputBudget(max_characters=8, max_bytes=80, max_tokens=8)
        )
        byte_limited = model.check_input_budget(
            b"abcdefgh", model.InputBudget(max_characters=20, max_bytes=7, max_tokens=8)
        )

        self.assertEqual(character_limited.reason, "character budget exceeded")
        self.assertEqual(byte_limited.reason, "byte budget exceeded")
        self.assertIsNone(character_limited.normalized_text)
        self.assertIsNone(byte_limited.normalized_text)

    def test_non_text_representation_never_reaches_the_language_layers(self) -> None:
        checked = model.check_input_budget({"text": 'count(where cohort = "atlas")'})

        self.assertEqual(checked.outcome, "INPUT_REJECTED")
        self.assertEqual(checked.reason, "unsupported input representation")
        self.assertEqual(checked.stage, "INPUT_DATA")

    def test_empty_text_is_bounded_data_then_a_syntax_failure_not_an_authorization_event(self) -> None:
        checked = model.check_input_budget("")
        lexed = model.lex_query(checked.normalized_text)
        parsed = model.parse_query(lexed.tokens)

        self.assertEqual(checked.outcome, "INPUT_ACCEPTED")
        self.assertEqual(lexed.outcome, "TOKENS")
        self.assertEqual(parsed.outcome, "PARSE_ERROR")
        self.assertEqual(parsed.stage, "SYNTAX_ONLY")


class LexerParserSeamTests(unittest.TestCase):
    def test_original_query_lexes_then_parses_to_syntax_only_ast(self) -> None:
        text = 'mean(confidence, where cohort = "atlas" and confidence >= 3)'
        lexed = model.lex_query(text)
        parsed = model.parse_query(lexed.tokens)

        self.assertEqual(lexed.outcome, "TOKENS")
        self.assertEqual(lexed.tokens[0].text, "mean")
        self.assertEqual(parsed.outcome, "PARSED")
        self.assertEqual(parsed.stage, "SYNTAX_ONLY")
        self.assertIsInstance(parsed.ast, model.MeanQuery)

    def test_unknown_character_is_a_lexical_not_authorization_failure(self) -> None:
        lexed = model.lex_query('count(where cohort = "atlas" @)')

        self.assertEqual(lexed.outcome, "LEX_ERROR")
        self.assertEqual(lexed.reason, "unsupported character")
        self.assertEqual(lexed.span, model.Span(29, 30))

    def test_missing_closing_parenthesis_is_a_parse_failure(self) -> None:
        lexed = model.lex_query('count(where cohort = "atlas"')
        parsed = model.parse_query(lexed.tokens)

        self.assertEqual(parsed.outcome, "PARSE_ERROR")
        self.assertEqual(parsed.reason, "expected ')' after filter")

    def test_token_budget_stops_scan_before_a_tree_exists(self) -> None:
        lexed = model.lex_query(
            'count(where cohort = "atlas")',
            model.InputBudget(max_characters=100, max_bytes=200, max_tokens=3),
        )

        self.assertEqual(lexed.outcome, "LEX_ERROR")
        self.assertEqual(lexed.reason, "token budget exceeded")
        self.assertEqual(lexed.stage, "LEXICAL_STRUCTURE")

    def test_unterminated_string_has_a_lexical_span_and_no_ast(self) -> None:
        lexed = model.lex_query('count(where cohort = "atlas')

        self.assertEqual(lexed.outcome, "LEX_ERROR")
        self.assertEqual(lexed.reason, "unterminated string literal")
        self.assertEqual(lexed.span, model.Span(21, 27))
        self.assertEqual(model.parse_query(lexed.tokens).outcome, "PARSE_ERROR")

    def test_trailing_token_is_syntax_error_not_a_schema_decision(self) -> None:
        lexed = model.lex_query('count(where cohort = "atlas") mean')
        parsed = model.parse_query(lexed.tokens)

        self.assertEqual(parsed.outcome, "PARSE_ERROR")
        self.assertEqual(parsed.reason, "unexpected trailing token")
        self.assertEqual(parsed.stage, "SYNTAX_ONLY")

    def test_foreign_token_object_is_rejected_before_parser_interpretation(self) -> None:
        parsed = model.parse_query((object(),))

        self.assertEqual(parsed.outcome, "PARSE_ERROR")
        self.assertEqual(parsed.reason, "unrecognized token representation")


class ContractAuthorityCapabilitySeamTests(unittest.TestCase):
    def test_parse_success_still_needs_contract_authority_and_capability(self) -> None:
        parsed = model.parse_query(model.lex_query('count(where cohort = "atlas")').tokens)
        checked = model.validate_query(parsed.ast)
        decision = model.authorize_query(model.fixture_authorized_request(), checked.plan)
        capability = model.mint_read_capability(decision)

        self.assertEqual(checked.outcome, "PERMITTED_PLAN")
        self.assertEqual(decision.outcome, "PERMITTED_MODEL_READ")
        self.assertIsInstance(capability, model.ReadLearningMetric)
        self.assertEqual(capability.scope, "learning-metrics:atlas")

    def test_wrong_tenant_is_denied_and_mints_no_capability(self) -> None:
        parsed = model.parse_query(model.lex_query('count(where cohort = "atlas")').tokens)
        checked = model.validate_query(parsed.ast)
        denied_request = model.QueryRequest(
            subject="analyst-23",
            action="READ_LEARNING_METRIC",
            resource="atlas-learning-snapshot",
            tenant="other-tenant",
            purpose="course-quality-review",
            authenticated=True,
        )
        decision = model.authorize_query(denied_request, checked.plan)

        self.assertEqual(decision.outcome, "DENIED_AUTHORIZATION")
        self.assertIsNone(model.mint_read_capability(decision))

    def test_cross_scope_cohort_filter_is_denied_before_a_capability_is_minted(self) -> None:
        parsed = model.parse_query(model.lex_query('count(where cohort = "other")').tokens)
        checked = model.validate_query(parsed.ast)
        decision = model.authorize_query(model.fixture_authorized_request(), checked.plan)

        self.assertEqual(checked.outcome, "PERMITTED_PLAN")
        self.assertEqual(decision.outcome, "DENIED_AUTHORIZATION")
        self.assertEqual(decision.reason, "query filter is outside fixed local tenant scope")
        self.assertIsNone(model.mint_read_capability(decision))


class ContractValidationSeamTests(unittest.TestCase):
    @staticmethod
    def parsed(text: str) -> model.QueryAst:
        result = model.parse_query(model.lex_query(text).tokens)
        assert result.ast is not None
        return result.ast

    def test_unknown_field_is_contract_rejection_after_parse_success(self) -> None:
        checked = model.validate_query(self.parsed("count(where unknown_field = 3)"))

        self.assertEqual(checked.outcome, "CONTRACT_ERROR")
        self.assertEqual(checked.reason, "unknown schema field")
        self.assertEqual(checked.stage, "CONTRACT_CHECKED")

    def test_literal_type_and_operator_are_independent_contract_checks(self) -> None:
        type_error = model.validate_query(self.parsed("count(where cohort = 3)"))
        operator_error = model.validate_query(self.parsed('count(where cohort >= "atlas")'))

        self.assertEqual(type_error.reason, "literal type does not match field")
        self.assertEqual(operator_error.reason, "operator is not permitted for field")

    def test_numeric_domain_and_metric_vocabulary_are_not_grammar_facts(self) -> None:
        domain_error = model.validate_query(self.parsed("count(where confidence >= 9)"))
        metric_error = model.validate_query(
            self.parsed('mean(completed, where cohort = "atlas")')
        )

        self.assertEqual(domain_error.reason, "literal is above field domain")
        self.assertEqual(metric_error.reason, "metric is not permitted")

    def test_unknown_ast_form_and_duplicate_filter_are_rejected_before_evaluation(self) -> None:
        foreign = model.validate_query(object())
        comparison = model.Comparison("cohort", "=", "atlas", "STRING", model.Span(0, 16))
        duplicate = model.CountQuery(
            model.AtlasFilter((comparison, comparison), model.Span(0, 16)),
            model.Span(0, 16),
        )
        duplicate_result = model.validate_query(duplicate)

        self.assertEqual(foreign.reason, "unsupported AST form")
        self.assertEqual(duplicate_result.reason, "duplicate filter field")

    def test_ast_node_and_depth_budgets_have_distinct_explanations(self) -> None:
        ast = self.parsed('count(where cohort = "atlas")')
        node_limited = model.validate_query(ast, limits=model.ModelLimits(max_ast_nodes=2))
        depth_limited = model.validate_query(ast, limits=model.ModelLimits(max_ast_depth=2))

        self.assertEqual(node_limited.reason, "AST node budget exceeded")
        self.assertEqual(depth_limited.reason, "AST depth budget exceeded")

    def test_schema_version_drift_cannot_create_a_permitted_fixture_plan(self) -> None:
        drifted = model.Schema(
            version="atlas-learning-schema/other",
            fields=model.DEFAULT_SCHEMA.fields,
            metrics=model.DEFAULT_SCHEMA.metrics,
        )

        checked = model.validate_query(self.parsed('count(where cohort = "atlas")'), drifted)

        self.assertEqual(checked.outcome, "CONTRACT_ERROR")
        self.assertEqual(checked.reason, "unsupported schema version")


class EvaluationAndEvidenceSeamTests(unittest.TestCase):
    def test_narrow_capability_can_return_only_a_bounded_local_aggregate(self) -> None:
        parsed = model.parse_query(model.lex_query('count(where cohort = "atlas")').tokens)
        checked = model.validate_query(parsed.ast)
        capability = model.mint_read_capability(
            model.authorize_query(model.fixture_authorized_request(), checked.plan)
        )
        result = model.evaluate_query(checked.plan, capability)

        self.assertEqual(result.outcome, "RESULT")
        self.assertEqual(result.value, 2)
        self.assertEqual(result.record_count, 2)
        self.assertEqual(result.stage, "LOCAL_MODEL")

    def test_capability_scope_excludes_cross_cohort_fixture_when_filter_omits_cohort(self) -> None:
        parsed = model.parse_query(model.lex_query("count(where confidence >= 1)").tokens)
        checked = model.validate_query(parsed.ast)
        capability = model.mint_read_capability(
            model.authorize_query(model.fixture_authorized_request(), checked.plan)
        )
        result = model.evaluate_query(checked.plan, capability)

        self.assertEqual(checked.outcome, "PERMITTED_PLAN")
        self.assertEqual(result.outcome, "RESULT")
        self.assertEqual(result.value, 2)
        self.assertEqual(result.record_count, 2)

    def test_evidence_hides_raw_source_fixture_and_capability_details(self) -> None:
        source = 'count(where cohort = "private-course-name")'
        input_check = model.check_input_budget(source)
        lexed = model.lex_query(source)
        parsed = model.parse_query(lexed.tokens)
        checked = model.validate_query(parsed.ast)
        packet = model.redact_evidence(
            "contract_example",
            input_check=input_check,
            lexed=lexed,
            parsed=parsed,
            validated=checked,
        )

        self.assertEqual(packet["evidence_scope"], "REDACTED_LOCAL_EVIDENCE")
        self.assertEqual(packet["source_disposition"], "QUERY_TEXT_REDACTED")
        self.assertNotIn("private-course-name", repr(packet))
        self.assertNotIn("cohort", repr(packet))

    def test_hand_built_plan_cannot_bypass_the_contract_boundary(self) -> None:
        parsed = model.parse_query(model.lex_query('count(where cohort = "atlas")').tokens)
        checked = model.validate_query(parsed.ast)
        capability = model.mint_read_capability(
            model.authorize_query(model.fixture_authorized_request(), checked.plan)
        )
        forged = model.PermittedPlan(
            ast=parsed.ast,
            grammar_version=model.GRAMMAR_VERSION,
            schema_version=model.SCHEMA_VERSION,
            operation="count",
            requested_scope="learning-metrics:atlas",
            node_count=3,
            depth=3,
        )

        result = model.evaluate_query(forged, capability)

        self.assertEqual(result.outcome, "DOMAIN_ERROR")
        self.assertEqual(result.reason, "permitted plan is required")


class AuthorizationCapabilityAndEvaluationTests(unittest.TestCase):
    @staticmethod
    def permitted_plan(text: str = 'count(where cohort = "atlas")') -> model.PermittedPlan:
        parsed = model.parse_query(model.lex_query(text).tokens)
        checked = model.validate_query(parsed.ast)
        assert checked.plan is not None
        return checked.plan

    def test_unauthenticated_and_wrong_action_requests_are_distinct_denials(self) -> None:
        plan = self.permitted_plan()
        unauthenticated = model.QueryRequest(
            "analyst-23",
            "READ_LEARNING_METRIC",
            "atlas-learning-snapshot",
            "atlas",
            "course-quality-review",
            False,
        )
        wrong_action = model.QueryRequest(
            "analyst-23",
            "WRITE_LEARNING_METRIC",
            "atlas-learning-snapshot",
            "atlas",
            "course-quality-review",
            True,
        )

        self.assertEqual(
            model.authorize_query(unauthenticated, plan).outcome, "DENIED_AUTHENTICATION"
        )
        self.assertEqual(
            model.authorize_query(wrong_action, plan).outcome, "DENIED_AUTHORIZATION"
        )

    def test_authorization_does_not_accept_a_hand_built_plan(self) -> None:
        parsed = model.parse_query(model.lex_query('count(where cohort = "atlas")').tokens)
        forged = model.PermittedPlan(
            parsed.ast,
            model.GRAMMAR_VERSION,
            model.SCHEMA_VERSION,
            "count",
            "learning-metrics:atlas",
            3,
            3,
        )

        decision = model.authorize_query(model.fixture_authorized_request(), forged)

        self.assertEqual(decision.outcome, "DENIED_CONTRACT")
        self.assertIsNone(model.mint_read_capability(decision))

    def test_hand_built_permitted_decision_cannot_mint_authority(self) -> None:
        forged = model.AuthorizationDecision(
            "PERMITTED_MODEL_READ",
            "AUTHORIZED",
            "fixed local policy permits one aggregate read",
            "learning-metrics:atlas",
            model.POLICY_VERSION,
            "analyst-23",
        )

        self.assertIsNone(model.mint_read_capability(forged))

    def test_forged_capability_marker_is_denied_by_evaluator(self) -> None:
        plan = self.permitted_plan()
        forged = model.ReadLearningMetric(
            "analyst-23",
            "learning-metrics:atlas",
            "atlas",
            "course-quality-review",
            model.POLICY_VERSION,
            model.DEFAULT_SCHEMA.metrics,
        )

        result = model.evaluate_query(plan, forged)

        self.assertEqual(result.outcome, "CAPABILITY_DENIED")
        self.assertEqual(result.stage, "NARROW_CAPABILITY")

    def test_mean_uses_only_the_fixed_metric_vocabulary_and_returns_local_scalar(self) -> None:
        plan = self.permitted_plan('mean(confidence, where cohort = "atlas")')
        capability = model.mint_read_capability(
            model.authorize_query(model.fixture_authorized_request(), plan)
        )

        result = model.evaluate_query(plan, capability)

        self.assertEqual(result.outcome, "RESULT")
        self.assertEqual(result.value, 3.0)
        self.assertEqual(result.record_count, 2)
        self.assertEqual(result.result_label, "SCALAR_LOCAL_AGGREGATE")

    def test_fuel_and_result_cardinality_failures_are_distinct(self) -> None:
        plan = self.permitted_plan()
        capability = model.mint_read_capability(
            model.authorize_query(model.fixture_authorized_request(), plan)
        )
        exhausted = model.evaluate_query(plan, capability, model.ModelLimits(fuel=1))
        limited = model.evaluate_query(plan, capability, model.ModelLimits(max_result_items=1))

        self.assertEqual(exhausted.outcome, "FUEL_EXHAUSTED")
        self.assertEqual(limited.outcome, "RESULT_LIMIT_EXCEEDED")

    def test_empty_mean_is_a_domain_result_not_a_capability_or_syntax_failure(self) -> None:
        plan = self.permitted_plan("mean(confidence, where confidence >= 5)")
        capability = model.mint_read_capability(
            model.authorize_query(model.fixture_authorized_request(), plan)
        )

        result = model.evaluate_query(plan, capability)

        self.assertEqual(result.outcome, "DOMAIN_ERROR")
        self.assertEqual(result.reason, "mean has no matching fixture values")

    def test_redacted_packet_labels_denial_and_fuel_without_raw_context(self) -> None:
        denial = model.run_scenario("authorization_denial")
        scope_denial = model.run_scenario("scope_filter_denial")
        fuel = model.run_scenario("fuel_exhausted")

        self.assertEqual(denial["stage"], "AUTHORIZED")
        self.assertEqual(denial["outcome"], "DENIED_AUTHORIZATION")
        self.assertEqual(denial["capability_state"], "NOT_MINTED")
        self.assertEqual(scope_denial["outcome"], "DENIED_AUTHORIZATION")
        self.assertEqual(scope_denial["capability_state"], "NOT_MINTED")
        self.assertNotIn('cohort = "other"', repr(scope_denial))
        self.assertEqual(fuel["outcome"], "FUEL_EXHAUSTED")
        self.assertEqual(fuel["budget_label"], "FUEL_BUDGET_REJECTED")
        self.assertNotIn("other-tenant", repr(denial))
        lexical = model.run_scenario("lexical_rejection")
        self.assertEqual(lexical["grammar_version"], model.GRAMMAR_VERSION)
        self.assertIsInstance(lexical["failure_span"], tuple)
        self.assertEqual(len(lexical["failure_span"]), 2)
        self.assertTrue(all(type(offset) is int for offset in lexical["failure_span"]))


class PebbleSemanticsTests(unittest.TestCase):
    def test_closure_uses_its_creation_environment_after_outer_let_returns(self) -> None:
        outcome = model.pebble_closure_example()

        self.assertEqual(outcome.outcome, "VALUE")
        self.assertEqual(outcome.value, 12)
        self.assertIsNone(outcome.reason)

    def test_if_evaluates_only_the_selected_branch(self) -> None:
        expression = model.PebbleIf(
            model.PebbleBool(True), model.PebbleInt(1), model.PebbleName("not_selected")
        )

        outcome = model.pebble_evaluate(expression)

        self.assertEqual(outcome.outcome, "VALUE")
        self.assertEqual(outcome.value, 1)

    def test_boolean_forms_short_circuit_in_the_stated_direction(self) -> None:
        false_and_missing = model.PebbleBinary(
            "and", model.PebbleBool(False), model.PebbleName("not_selected")
        )
        true_or_missing = model.PebbleBinary(
            "or", model.PebbleBool(True), model.PebbleName("not_selected")
        )

        self.assertEqual(model.pebble_evaluate(false_and_missing).value, False)
        self.assertEqual(model.pebble_evaluate(true_or_missing).value, True)

    def test_binary_evaluation_stops_on_the_left_error_before_right_operand(self) -> None:
        expression = model.PebbleBinary(
            "+", model.PebbleName("left_missing"), model.PebbleName("right_missing")
        )

        outcome = model.pebble_evaluate(expression)

        self.assertEqual(outcome.outcome, "PEBBLE_ERROR")
        self.assertEqual(outcome.reason, "unbound Pebble name")
        self.assertEqual(outcome.consumed_fuel, 2)


class ScenarioCliAndBridgeTests(unittest.TestCase):
    def test_scenarios_are_fixed_named_fixtures_not_query_text(self) -> None:
        self.assertEqual(
            model.SCENARIOS,
            (
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
            ),
        )
        with self.assertRaises(ValueError):
            model.run_scenario('count(where cohort = "atlas")')

    def test_every_fixed_atlas_scenario_returns_a_closed_local_evidence_packet(self) -> None:
        for scenario in model.SCENARIOS:
            with self.subTest(scenario=scenario):
                packet = model.run_scenario(scenario)
                self.assertEqual(packet["scenario"], scenario)
                self.assertEqual(packet["evidence_scope"], "REDACTED_LOCAL_EVIDENCE")
                self.assertEqual(packet["real_effect"], "NO_EXTERNAL_EFFECT")
                self.assertIn("limitations", packet)
                self.assertNotIn("query", packet)
                self.assertNotIn("records", packet)

    def test_cli_accepts_only_the_fixed_scenario_vocabulary(self) -> None:
        parser = model.build_cli()
        parsed = parser.parse_args(["successful_count"])

        self.assertEqual(parsed.scenario, "successful_count")
        raw_query = 'count(where cohort = "private-course-name")'
        destination = StringIO()
        with redirect_stderr(destination):
            with self.assertRaises(SystemExit):
                model.main([raw_query])
        self.assertIn("scenario must be one of the fixed teaching fixtures", destination.getvalue())
        self.assertNotIn(raw_query, destination.getvalue())

    def test_cli_output_is_closed_evidence_for_a_fixed_name(self) -> None:
        destination = StringIO()
        with redirect_stdout(destination):
            status = model.main(["successful_count"])

        self.assertEqual(status, 0)
        output = destination.getvalue()
        self.assertIn("successful_count", output)
        self.assertNotIn('count(where cohort', output)

    def test_trusted_bridge_observes_fixed_source_without_executing_it_or_claiming_portable_semantics(self) -> None:
        bridge = model.trusted_compilation_bridge()
        packet = model.run_scenario("trusted_compilation_bridge")

        self.assertEqual(bridge["executed"], False)
        self.assertEqual(bridge["trusted_source"], "def increment(value):\n    return value + 1\n")
        self.assertEqual(
            bridge["tree_summary"],
            "Module(FunctionDef → Return(BinOp(Name + Constant)))",
        )
        self.assertIn("FunctionDef", bridge["ast_node_kinds"])
        self.assertGreater(len(bridge["instruction_names"]), 0)
        self.assertEqual(bridge["code_object_metadata"]["argcount"], 1)
        self.assertRegex(
            bridge["implementation_version"],
            r"^[a-z]+ \d+\.\d+\.\d+$",
        )
        self.assertEqual(
            bridge["observation_label"],
            "implementation/version-labelled local observation",
        )
        self.assertEqual(packet["outcome"], "STATIC_OBSERVATION")
        self.assertEqual(packet["bridge"]["trusted_source"], bridge["trusted_source"])
        self.assertIn("not portable language semantics", packet["limitations"])


class StructuralSafetyTests(unittest.TestCase):
    def test_reference_model_has_no_dynamic_execution_or_external_adapter_surface(self) -> None:
        source = Path(model.__file__).read_text(encoding="utf-8")
        forbidden = (
            ("ev", "al", "("),
            ("ex", "ec", "("),
            ("com", "pile", "("),
            ("ast.", "literal_", "eval"),
            ("sub", "process"),
            ("sock", "et"),
            ("url", "lib"),
            ("sql", "ite"),
            ("pick", "le"),
            ("mar", "shal"),
            ("open", "("),
            ("import", "lib"),
        )

        for pieces in forbidden:
            with self.subTest(forbidden="".join(pieces)):
                self.assertNotIn("".join(pieces), source)
        self.assertNotIn("query_text", source)


if __name__ == "__main__":
    unittest.main()
