# GitHub Actions cost audit — 2026-08-03

## Scope

This audit covers recent pull-request Course CI activity for Atlas PR #21 and
the current workflow configuration. It distinguishes observed GitHub runs from
configuration facts and does not turn a successful check into release or
learner-readiness evidence.

## What consumed minutes

The cost driver was repeated non-draft `pull_request` `synchronize` gates.
Each full gate intentionally starts four Ubuntu jobs:

1. `Portal quality gate`;
2. `Teaching models on Python 3.12`;
3. `Teaching models on Python 3.14`; and
4. `Browser accessibility acceptance`.

Before the Python/browser de-duplication change, [Course CI run
30795582906](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30795582906)
used 1,513 runner-seconds (25m 13s): 15m 50s portal, 6m 09s browser,
1m 24s Python 3.12, and 1m 50s Python 3.14. The run count rose from #45 on the
July 30 pull request to #280 at the current PR head; the provenance ledger
records 49 distinct run IDs. This is a volume problem, not a single unusually
expensive job.

In a sample of 20 recent PR-source commits, 18 Course CI runs were observed:
five succeeded, nine failed, and four were cancelled. The cancelled runs show
that the existing same-PR concurrency group is working, but cancellation cannot
recover minutes already spent before a newer push arrives.

## What was not the cause

- No schedule trigger exists.
- No Windows/macOS job or operating-system multiplier exists; every hosted job
  uses Ubuntu.
- The only matrix is the intentional Python 3.12/3.14 pair. Both named checks
  are required evidence and remain.
- No workflow-level retry configuration exists. A documented bounded retry was
  a local fixture-cleanup behavior; its Actions run was attempt 1.
- The `push: main` verification remains deliberately separate from the PR gate
  and is retained as post-merge verification.

## Corrections

The remote PR head already contains the main de-duplication change:

- Draft PR updates skip all hosted jobs. [Run 30827664600](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30827664600)
  is a skipped draft run, not a paid full gate.
- The Python matrix now depends on the portal gate and does only shallow
  checkout, Python setup, and Python tests. It no longer repeats Node/pnpm
  installation, module synchronization, generated-output checks, or release
  input validation. The browser job likewise avoids the portal-only structural
  work. Portal retains those checks before either downstream job starts.
- The metadata observer is now manual, release-time verification rather than a
  `workflow_run` runner after every successful PR gate. It keeps the same
  read-only source-head/attempt/job validation while removing automatic
  duplicate usage.

## Operating rule

Keep the PR in Draft during iterative authoring and use focused local checks.
Push a reviewed batch and request the full gate only at a review, weekly
milestone, or release boundary. Do not remove the portal, two Python, browser,
or post-merge checks without a separate branch-protection decision.

## Follow-up local correction (awaiting normal push)

The local workflow additionally subscribes to `converted_to_draft`. That event
creates a skipped, zero-runner workflow which shares the existing concurrency
group and can cancel an obsolete full PR gate when a review returns to Draft.
The expensive full-course `workflow_dispatch` trigger was removed: the bounded
metadata observer remains the documented manual final-verification path, while
PR gates and `push: main` retain required verification.

GitHub CLI authentication is currently unavailable on this workstation, so this
follow-up cannot claim that the local correction is live or observe its remote
cancellation behavior. Re-authenticate, inspect runs read-only, then use a
normal additive push when the reviewed batch is ready.
