# GitHub Actions cost-control record

Audit date: 2026-08-04 (readback through 2026-08-05T00:00:51Z)  
Repository: `michaeliu3/atlas-academy-python-cs`  
Workflow: `.github/workflows/ci.yml`

## Evidence snapshot

`gh run list --limit 100 --json ...` showed 100 recent `pull_request` Course CI runs:

| conclusion | runs |
| --- | ---: |
| success | 51 |
| failure | 24 |
| cancelled | 16 |
| skipped | 9 |

There were no scheduled Course CI runs. The separate metadata observer is
`workflow_dispatch` only and is not an automatic trigger. The Course CI
workflow already has `concurrency.cancel-in-progress: true`; the 21 cancelled
runs therefore represent superseded work that had already consumed runner time,
not uncancelled concurrent jobs.

The successful full-gate samples show the dominant multiplier:

- Portal quality gate: about 14–18 minutes. It validates, synchronizes, builds,
  and runs the complete Node suite.
- Browser accessibility acceptance: about 5.5 minutes, including checkout,
  dependency installation, Chromium installation, and a second portal build.
- Python 3.12 and Python 3.14: two Ubuntu jobs, about 1–2 minutes each. There
  is no operating-system matrix multiplier; both entries are deliberate runtime
  compatibility checks.

The expensive pattern was repeated `pull_request.synchronize` updates while a
PR was under active iteration. Earlier non-draft updates repeatedly ran the
full portal, browser, and two-version Python fan-out; superseded runs were then
cancelled after minutes of work. Draft updates now skip those full jobs.

## Safe corrections

1. The portal build is uploaded once and the browser job downloads that exact
   build. Browser acceptance still runs as its own required job, but no longer
   rebuilds the portal on a second runner.
2. `test:content` and `test:apparatus` select focused Node suites. Draft PRs
   run only the content suite; a non-draft full gate retains the complete Node,
   Python, and browser verification.
3. The Node test runner uses
   `min(4, max(1, availableParallelism() - 1))`, avoiding four-way
   oversubscription on two-vCPU hosted runners while retaining the full test
   set.
4. The existing concurrency group remains enabled so a superseded full gate is
   cancelled. No required branch-protection job, Python version, browser check,
   or final full verification was removed.
5. The test runner now opts its workers into a fail-closed Git-index cache:
   one immutable snapshot and one blob read per worker are reused, every
   requested path still receives a clean check, and index-generation changes
   evict the cache and recapture. Packet validation also enumerates tracked
   paths once per validation instead of spawning one Git process per pointer.
6. Candidate preflight batches now reuse only derived reports keyed by the
   same immutable snapshot. The 30-profile mathematics preflight therefore
   validates the shared registry and packet cohort once while retaining every
   module-specific evidence, scope, and clean-worktree check.
7. The classifier now exposes portal/browser scopes. Non-draft PRs with only
   documentation changes still report every required branch-protection context
   through a lightweight successful job path, but skip checkout, dependency
   installation, builds, apparatus, Python suites, and Chromium. Content,
   application, test, dependency, workflow, and learner-generated-input changes
   retain the relevant full checks. The two current-truth/ledger metadata files
   still run the portal structural/generated-artifact gate but skip the
   apparatus/Python/Chromium fan-out. Main pushes still run the full post-merge
   Portal, Browser, apparatus, and Python verification, and the required job
   names remain unchanged.
8. `scripts/run-course-tests.mjs` now forwards SIGINT/SIGTERM to its spawned
   Node test runner, removes its signal handlers on exit, and uses Windows
   `taskkill /T` when cancellation must include worker processes. This prevents
   a cancelled local or hosted runner from leaving an orphaned test tree; it
   does not replace GitHub's concurrency cancellation or remove any check.

The cache changes validation setup cost only; they do not skip tests, weaken
the provenance boundary, or change the draft/non-draft job selection.

The live readback still shows all 100 listed runs as `pull_request` events on
the historical `agent/60-day-route` branch; the new
`codex/atlas-history-linearization` feature-branch pushes did not create Course
CI runs because the workflow only runs on `main` pushes and pull-request
events. The changed conclusion counts above replace the earlier snapshot
counts; they do not change the root-cause finding that repeated synchronize
events were the volume driver.

Draft PR #22 then produced Course CI run
[`30971088254`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30971088254),
which GitHub rejected before runner allocation because the repository account
reported failed recent payments or an exceeded spending limit. Its downstream
jobs were skipped. This is an external billing-state blocker, not evidence that
the workflow's draft gating failed and not billed test execution.

Local verification on 2026-08-04 measured the legacy packet cohort at roughly
1.6 seconds (previously about 9.5 seconds), a representative full course
contract test at roughly 18 seconds (previously about 54 seconds), and the
30-profile mathematics preflight at 57.9 seconds after snapshot-keyed reuse.
The full apparatus suite remains a milestone check rather than a per-edit
check; its CI job retains the explicit 20-minute bound and full test selection.

This record is an operational audit, not a claim about billed dollars. GitHub
billing-minute exports remain account-scoped and are not inferred from wall
clock durations.

## Current concurrency observation (2026-08-05)

Two rapid additive documentation checkpoints on draft PR #22 provided direct
evidence of the workflow's supersession boundary:

- Run [`30978504095`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30978504095)
  for head `71ee5ad` completed classification, dependency setup, and the
  structural/content-input steps before its Draft content job was cancelled;
  the expensive portal, browser, apparatus, and teaching-model jobs were
  skipped.
- Run [`30978565589`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30978565589)
  for the next head was cancelled at the classifier boundary. GitHub reported
  that a higher-priority waiting request for the same concurrency group existed,
  so no downstream job started.

This confirms `cancel-in-progress` is actively removing superseded work, while
also showing the remaining small setup cost of rapid `pull_request`
`synchronize` events. The observation does not justify removing the classifier
or required final checks; batching additive commits and requesting the normal
non-draft gate only at a review-ready ref remain the safe controls.

The latest additive calibration checkpoint, commit `6e0a02c`, produced Draft
run [`30982815817`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30982815817).
Its 95-test content path passed in 52 seconds; the portal, apparatus, Python,
and browser jobs were skipped because the pull request remains draft. This is
the intended low-cost draft behavior, not a full-gate or release result.

## Incremental synchronize classification (2026-08-05)

The classifier now uses the `before` SHA supplied by a pull-request
`synchronize` event when it is available. That makes the change scope represent
the newly pushed PR-head update rather than the entire stacked PR range, so a
documentation-only follow-up does not rerun Draft content feedback solely
because an earlier commit changed content. Open/reopen/ready events and main
pushes retain the conservative base-to-head comparison. If GitHub omits the
event's previous-head field, the classifier falls back to the base range; no
required check is weakened and no content change is silently ignored.

## Provenance-only classifier boundary (2026-08-05)

`content/course/goal-compliance.v1.json` and the derived
`content/course/release-inputs.v1.json` are classified as provenance-only
metadata. A change to either still executes the required portal contract,
generated-artifact, type, lint, build, and content checks, while the required
apparatus, Python, and browser contexts take their lightweight successful paths
on pull requests. This prevents a current-truth bookkeeping correction from
spending another multi-minute test fan-out. Any learner content, course graph,
source map, script, test, workflow, application, or main-branch push retains
the existing broader verification. The distinction is enforced by a focused
workflow regression test.

The first stacked successor (`51e02e5`, run `31005593039`) still exercised
Chromium because the browser branch initially retained the broad `content/*`
match; its apparatus and both Python jobs already took the lightweight path.
The browser predicate is now covered by the same allowlist regression and is
excluded for the next isolated provenance-only update. The conservative
base-range behavior remains intentional when a mixed historical range is the
only available scope.
