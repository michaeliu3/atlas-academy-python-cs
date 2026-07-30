# Content authoring workflow

## Module contract

Every module must have all of the following before release:

1. prerequisite connection and forward handoff;
2. primary/university source map with claim boundaries and licensing note;
3. six connected sessions;
4. original diagrams, traces, code-reading labs, and text equivalents;
5. accessible interactive HTML experience;
6. confidence-aware conceptual diagnostic;
7. problem ladder, Atlas project, review rubric, and retrieval schedule;
8. TA prompts and Study Partner routine;
9. deterministic local model/tests when they reveal a mechanism;
10. Notion record and progress update.

## Authoring order

1. Start from an Atlas incident or design pressure inherited from the prior
   module.
2. Establish the first-principles model before library/API names.
3. Name representations, invariants, cost assumptions, authority boundaries,
   and evidence limits.
4. Use source maps to determine what the material may claim.
5. Create a visual path with prediction before reveal and a prose equivalent.
6. Add small code-reading or trace exercises before asking for production code.
7. Add behavioral tests through public seams, not implementation-coupled
   snapshots.
8. Run full portal and local-model validation, then record known limitations.

## Source discipline

- In a standalone GitHub clone, `content/modules/`, `content/source-maps/`,
  and `public/downloads/` are the complete checked-in release source for
  published material. The adjacent authoring workspace is an optional
  synchronization convenience, not a hidden dependency for readers, CI, or
  future maintainers.
- Prefer official language/standard documentation and primary sources.
- Use university courses for sequence and pedagogy, not copied assignments or
  solutions.
- Link and paraphrase; write original diagrams, prose, fixtures, and prompts.
- Label implementation-specific observations with version/runtime scope.
- State what a source, model, or test does not prove.

## Accessibility

- Provide meaningful text for every diagram and color distinction.
- Use native controls, visible focus, semantic headings, keyboard paths, and
  readable narrow-screen layouts.
- Keep prediction/reveal interaction optional; the workbook must contain the
  equivalent facts.
- Store only whitelisted local progress state, never learner queries, records,
  identities, policies, or capability-like data.

## AI-era review loop

An AI agent can be asked to implement a bounded slice only after the human
author states the goal, non-goals, inputs, invariants, test seams, accessibility
needs, and acceptance evidence. Review the result as unfamiliar code: trace it,
challenge unsupported claims, run tests, and write the remaining uncertainty.
