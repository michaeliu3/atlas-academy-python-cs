# Read-only Course CI evidence capture

Use this procedure only after a selected pull-request **Course CI** run has
finished successfully. It collects existing GitHub metadata without dispatching
a workflow, checking out candidate code, downloading artifacts, changing a
pull request, or creating a deployment. It is therefore the low-cost path for
recording a later release-review fact.

This is not release approval. A normalized record proves only that the supplied
GitHub run/job metadata is consistent with Atlas's checked-in policy. It does
not prove the runner's generated merge ref, the remote workflow body's digest,
human review, private deployment, accessibility review, or learner readiness.

## Preconditions

Stop unless all of these are true:

1. The source commit is already reachable from the reviewable GitHub source
   branch. A local-only commit is not remote provenance.
2. `gh auth status` succeeds for `michaeliu3/atlas-academy-python-cs`; use only
   read permission. Never place a token, authorization header, or learner data
   in the evidence file.
3. The chosen run is a completed, successful, same-repository
   `pull_request` **Course CI** run for the exact source-head SHA being
   recorded.
4. The local checkout still validates
   `content/course/release-evidence-policy.v1.json` against its checked-in
   `.github/workflows/ci.yml`.

Do not use the on-demand `workflow_dispatch` metadata observer for ordinary
capture. That observer remains a separately authorized final verification; the
steps below use only three read-only endpoint reads (with pagination only if a
jobs response requires it).

## Collect the immutable run facts

Set `RUN_ID` to the already-selected successful Course CI run. First read the
run to discover its current attempt and source head, then read that exact
attempt and its jobs:

~~~powershell
$repo = "michaeliu3/atlas-academy-python-cs"
$runId = 1234567890 # replace with the selected successful Course CI run id

$selected = gh api "repos/$repo/actions/runs/$runId" | ConvertFrom-Json
$attempt = gh api "repos/$repo/actions/runs/$runId/attempts/$($selected.run_attempt)" | ConvertFrom-Json
$jobs = gh api --paginate "repos/$repo/actions/runs/$runId/attempts/$($selected.run_attempt)/jobs?per_page=100" |
  ConvertFrom-Json
~~~

Before normalizing anything, inspect the returned facts. They must agree on
run ID, attempt, source head, repository, workflow identity, `pull_request`
event, and `completed` / `success` status. The required job names are taken
from the checked-in policy, not guessed from a matrix or a prior run:

- `Portal quality gate`
- `Teaching models on Python 3.12`
- `Teaching models on Python 3.14`
- `Browser accessibility acceptance`

If a run was re-run, record the attempt selected by the first read and use the
matching attempt/jobs endpoints. Do not silently mix a run's newest metadata
with jobs from a different attempt.

## Normalize only the verifier schema

Create a private, reviewable JSON file with exactly this shape. Populate the
workflow path and `workflowSourceSha256` from the current local
`release-evidence-policy.v1.json`; they bind the record to the locally reviewed
policy, not to a remote workflow-body observation.

~~~json
{
  "schemaVersion": 1,
  "kind": "atlas-course-ci-evidence",
  "sourceHeadSha": "<40-character lowercase source head SHA>",
  "run": {
    "id": 1234567890,
    "attempt": 1,
    "repository": "michaeliu3/atlas-academy-python-cs",
    "headRepository": "michaeliu3/atlas-academy-python-cs",
    "sourceHeadSha": "<same SHA>",
    "workflowId": 323581527,
    "workflowName": "Course CI",
    "workflowPath": ".github/workflows/ci.yml",
    "workflowSourceSha256": "<current local policy value>",
    "event": "pull_request",
    "status": "completed",
    "conclusion": "success",
    "htmlUrl": "https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/1234567890"
  },
  "jobs": [
    {
      "id": 1,
      "runId": 1234567890,
      "runAttempt": 1,
      "sourceHeadSha": "<same SHA>",
      "name": "Portal quality gate",
      "status": "completed",
      "conclusion": "success"
    }
  ]
}
~~~

Include every returned job as a separate normalized object and retain the four
required names above. Do not add raw API responses, tokens, commit messages,
learner records, artifact contents, or inferred claims to this schema.

## Validate locally before recording it

From the repository root, set the two variables below and run this read-only
validation. It calls the existing policy/verifier; it does not contact GitHub
or write a file.

~~~powershell
$env:ATLAS_EVIDENCE_PATH = "C:\private-evidence\course-ci-evidence.json"
$env:ATLAS_SOURCE_HEAD_SHA = "<same 40-character lowercase source head SHA>"

@'
import { readFile } from "node:fs/promises";
import {
  loadReleaseEvidencePolicy,
  verifyCourseCiEvidence,
} from "./scripts/release-evidence-verifier.mjs";

const evidence = JSON.parse(await readFile(process.env.ATLAS_EVIDENCE_PATH, "utf8"));
const { policy } = await loadReleaseEvidencePolicy(process.cwd());
const report = verifyCourseCiEvidence({
  policy,
  evidence,
  expectedSourceHeadSha: process.env.ATLAS_SOURCE_HEAD_SHA,
});
console.log(JSON.stringify(report, null, 2));
'@ | node --input-type=module -
~~~

Any mismatch is a stop condition. Re-read the selected run and attempt rather
than editing the evidence to make it pass.

## Record the result without laundering it into a release

After a reviewer confirms the normalized record and the exact source commit,
add it through a normal, additive commit with a concise row in
[`RELEASE_PROVENANCE.md`](RELEASE_PROVENANCE.md). The row must state the source
commit, run URL and attempt, required jobs, what the evidence establishes, and
what remains unproved.

Do not record it as a GitHub Release, deployment, verified module, completed
accessibility review, security clearance, or learner outcome. If authentication
or GitHub connectivity is unavailable, keep the result explicitly **unobserved**
and do not backfill a provenance claim from local checks.
