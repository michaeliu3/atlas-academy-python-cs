# Contributing to Atlas Academy

Contributions must strengthen the learner’s reasoning, not add disconnected
content or opaque automation.

## Before changing a module

1. Identify the prerequisite and forward handoff.
2. State the Atlas capability, representation, invariant, cost/failure model,
   and evidence boundary affected.
3. Add or update primary/university sources and licensing notes.
4. Design prediction, explanation, transfer, and retrieval—not just a coding
   exercise.
5. Preserve accessibility and mobile readability.

## Change workflow

1. Make a small, reviewable change with a clear objective.
2. Run the structural course gate, module sync, generated-artifact check,
   lint, portal tests, and relevant Python behavioral tests.
3. Review the patch for unsupported claims, privacy leaks, hard-coded learner
   data, and source attribution.
4. Explain what the change proves and what it does not prove in the PR or
   release note.

## AI-assisted work

AI-generated code or text needs the same or stronger review as human work.
Provide the bounded task, constraints, acceptance evidence, and a human-written
explanation of the resulting design.

## History and release evidence

Use additive commits with a narrow purpose, and preserve the full reviewable
history on the private GitHub remote. Do not force-push, rewrite published
commits, delete release evidence, or use a squash merge that loses the
commit-level audit trail for release work. Record the intended Git commit, PR,
CI run, review, limitations, and deployment result in the release ledger.
