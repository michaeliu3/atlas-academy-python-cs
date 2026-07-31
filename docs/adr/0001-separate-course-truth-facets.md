# Separate course truth facets

**Status:** Accepted and implemented for the active course graph (2026-07-31)

Atlas must distinguish a workbook's reader access, route availability, contract
state, release state, and learner-controlled Core progression. We model
these as separate facts in the canonical course graph and its projections,
rather than allowing one overloaded `published` flag to imply delivery,
prerequisite completion, pedagogical approval, or deployment. This is a
deliberate compatibility cost: active graph consumers migrate together so
future routes can present reference reading honestly without silently
advancing the learner through an unmet academic prerequisite.

## Decision

`content/course/course-graph.v2.json` is the active canonical graph. Each
module has a nested `state` with the following independent facts:

- `lifecycle`: whether maintained learner material exists;
- `readerAccess`: `hidden`, `preview`, or `full`;
- `availability`: Core route availability, separate from page visibility;
- `contract`: the pedagogical-evidence track and maturity; and
- `release`: an auditable candidate/deployment record, not a synonym for
  availability.

The 60-day route itself remains a topology and prerequisite plan. It does not
store a learner's completion state; opening a page, scrolling, or running a
studio never creates Core evidence. `course-graph.v1.json` remains solely as a
historical fixture for the M31–M36 readiness audit, not as an active portal
input.

## Consequences

M25 and M26 can be reader-visible previews without becoming Core steps; M31–M36
can remain visible in route topology while their reader access stays hidden.
The graph currently projects 36 defined modules, 30 reader-visible modules, 28
Core-open modules, two reference previews, and six authoring-only modules. All
reader-visible modules are still legacy-contract baselines; none is
contract-verified. This decision therefore improves truthfulness without
claiming curriculum completion, release approval, or learner mastery.
