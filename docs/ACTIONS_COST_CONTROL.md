# GitHub Actions cost-control record

Audit date: 2026-08-04  
Repository: `michaeliu3/atlas-academy-python-cs`  
Workflow: `.github/workflows/ci.yml`

## Evidence snapshot

`gh run list --limit 100 --json ...` showed 100 recent `pull_request` Course CI runs:

| conclusion | runs |
| --- | ---: |
| success | 47 |
| failure | 23 |
| cancelled | 21 |
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

This record is an operational audit, not a claim about billed dollars. GitHub
billing-minute exports remain account-scoped and are not inferred from wall
clock durations.
