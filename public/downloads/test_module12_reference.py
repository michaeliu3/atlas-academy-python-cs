"""Behavioral seams for Module 12's bounded architecture-reasoning model."""

from __future__ import annotations

import unittest

import module12_reference as model


class DependencyDirectionTests(unittest.TestCase):
    def test_allowed_port_dependent_graph_keeps_concrete_choice_at_root(self) -> None:
        report = model.inspect_architecture(
            components=(
                model.Component("event-policy", "domain-policy"),
                model.Component("import-events", "application-policy"),
                model.Component("event-importer", "port"),
                model.Component("csv-importer", "adapter"),
                model.Component("atlas-main", "composition-root"),
            ),
            dependencies=(
                model.Dependency("import-events", "event-policy"),
                model.Dependency("import-events", "event-importer"),
                model.Dependency("csv-importer", "event-importer"),
                model.Dependency("atlas-main", "import-events"),
                model.Dependency("atlas-main", "csv-importer"),
            ),
            selections=(model.ConcreteSelection("atlas-main", "csv-importer"),),
        )

        self.assertTrue(report.preserves_dependency_direction)
        self.assertEqual(report.violations, ())
        self.assertEqual(
            report.allowed_dependencies,
            (
                ("atlas-main", "csv-importer"),
                ("atlas-main", "import-events"),
                ("csv-importer", "event-importer"),
                ("import-events", "event-importer"),
                ("import-events", "event-policy"),
            ),
        )
        self.assertEqual(report.concrete_selections, (("atlas-main", "csv-importer"),))
        self.assertIn("does not prove", report.scope)

    def test_policy_import_of_adapter_is_a_concrete_dependency_violation(self) -> None:
        report = model.inspect_architecture(
            components=(
                model.Component("event-policy", "domain-policy"),
                model.Component("csv-importer", "adapter"),
                model.Component("atlas-main", "composition-root"),
            ),
            dependencies=(model.Dependency("event-policy", "csv-importer"),),
            selections=(model.ConcreteSelection("atlas-main", "csv-importer"),),
        )

        self.assertFalse(report.preserves_dependency_direction)
        self.assertEqual(report.allowed_dependencies, ())
        self.assertEqual(len(report.violations), 1)
        violation = report.violations[0]
        self.assertEqual(violation.kind, "forbidden-concrete-dependency")
        self.assertEqual((violation.source, violation.target), ("event-policy", "csv-importer"))

    def test_concrete_selection_outside_composition_root_is_reported_separately(self) -> None:
        report = model.inspect_architecture(
            components=(
                model.Component("import-events", "application-policy"),
                model.Component("event-importer", "port"),
                model.Component("csv-importer", "adapter"),
                model.Component("atlas-main", "composition-root"),
            ),
            dependencies=(model.Dependency("import-events", "event-importer"),),
            selections=(model.ConcreteSelection("import-events", "csv-importer"),),
        )

        self.assertFalse(report.preserves_dependency_direction)
        self.assertEqual(
            [(item.kind, item.source, item.target) for item in report.violations],
            [
                (
                    "concrete-selection-outside-composition-root",
                    "import-events",
                    "csv-importer",
                ),
            ],
        )

    def test_unknown_component_and_duplicate_component_names_are_not_silently_accepted(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "unique"):
            model.inspect_architecture(
                components=(
                    model.Component("event-importer", "port"),
                    model.Component("event-importer", "adapter"),
                ),
                dependencies=(),
                selections=(),
            )

        with self.assertRaisesRegex(model.ModelContractError, "declared component"):
            model.inspect_architecture(
                components=(model.Component("event-importer", "port"),),
                dependencies=(model.Dependency("missing", "event-importer"),),
                selections=(),
            )

    def test_declared_architecture_collections_are_explicitly_bounded(self) -> None:
        with self.assertRaisesRegex(model.ModelContractError, "components must contain at most"):
            model.inspect_architecture(
                components=(
                    model.Component(f"component-{index}", "domain-policy")
                    for index in range(model.MAX_COMPONENTS + 1)
                ),
                dependencies=(),
                selections=(),
            )

        components = tuple(
            model.Component(f"node-{index}", "domain-policy")
            for index in range(model.MAX_COMPONENTS)
        )
        dependency_pairs = (
            (f"node-{source}", f"node-{target}")
            for source in range(model.MAX_COMPONENTS)
            for target in range(model.MAX_COMPONENTS)
            if source != target
        )
        with self.assertRaisesRegex(model.ModelContractError, "dependencies must contain at most"):
            model.inspect_architecture(
                components=components,
                dependencies=(
                    model.Dependency(source, target)
                    for source, target in dependency_pairs
                ),
                selections=(),
            )

        selection_components = (
            model.Component("adapter-a", "adapter"),
            model.Component("adapter-b", "adapter"),
            *(
                model.Component(f"owner-{index}", "application-policy")
                for index in range(model.MAX_COMPONENTS - 2)
            ),
        )
        selection_pairs = (
            (owner.name, implementation.name)
            for owner in selection_components
            for implementation in selection_components[:2]
        )
        with self.assertRaisesRegex(model.ModelContractError, "selections must contain at most"):
            model.inspect_architecture(
                components=selection_components,
                dependencies=(),
                selections=(
                    model.ConcreteSelection(owner, implementation)
                    for owner, implementation in selection_pairs
                ),
            )


if __name__ == "__main__":
    unittest.main()
