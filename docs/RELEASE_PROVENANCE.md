# Release provenance ledger

## Status and scope

This is an append-only evidence ledger for Atlas Academy's private release
process. It separates four different facts that must not be conflated:

1. a source commit exists in the reviewable GitHub repository;
2. a named GitHub Actions check is attached to a source commit and records a
   bounded workflow validation (a pull-request workflow can instead check a
   generated merge candidate);
3. a GitHub Release exists for a tag; and
4. the private hosting deployment was verified.

The entries below prove only the facts explicitly recorded in them. They do
**not** claim that a GitHub Release was published or that the private ChatGPT
Sites application was deployed. At the time this ledger was created, neither
outcome had been verified here.

## History-preservation policy

Release-bound work stays reviewable on the `github` remote through small,
additive commits and a reviewable pull request. Do not force-push shared
branches, rewrite or delete published history, or squash away evidence-bearing
commits. A hosting push is separate from GitHub source history and never
substitutes for it.

The integrated source history is mirrored on
[`codex/atlas-60-day-route-history`](https://github.com/michaeliu3/atlas-academy-python-cs/tree/codex/atlas-60-day-route-history).
It resolved to `3cf2b7c8069bfd7bfbd7df1402f52860c1a82854` at the direct
readback immediately before this batch; subsequent changes advance that ref
only through ordinary additive commits. The protected
[`agent/60-day-route`](https://github.com/michaeliu3/atlas-academy-python-cs/tree/agent/60-day-route)
branch and [pull request #21](https://github.com/michaeliu3/atlas-academy-python-cs/pull/21)
remain the earlier review record; they do not by themselves identify the integrated head.

### Verified GitHub history-protection snapshot

On 2026-07-30, GitHub branch-protection settings were checked directly for the
private repository. `main` disallows force-pushes and deletion and requires
linear history. The active review branch, `agent/60-day-route`, was then given
the same no-force-push, no-deletion, linear-history policy while retaining
ordinary fast-forward commits. It deliberately has no required-review or
required-check rule: it is a review branch, not a release branch.

This is a point-in-time configuration record, not a claim that an administrator
cannot later change a setting, that every branch is protected, or that a
private deployment has been reviewed.

### Superseding protection verification

A later direct GitHub REST check on 2026-07-30 confirmed that both `main` and
`agent/60-day-route` apply their configured protection rules to administrators.
Both disallow force-pushes and deletion and require linear history. At that
check, neither branch had a required-pull-request-review rule; `main` required
conversation resolution and the strict checks `Portal quality gate`, `Teaching
models on Python 3.12`, and `Teaching models on Python 3.14`, while the review
branch had no required-status-check or conversation-resolution rule. Browser
accessibility acceptance was not yet a required status check on `main`.

This supplements the earlier snapshot with its administrator-enforcement and
required-check details. It is current configuration evidence only, not a claim
that a future administrator cannot change policy, that an unrecorded checkout
used an exact source commit, or that a private deployment was reviewed.

### Browser-gate protection verification

After the successful Linux browser candidate in run 30581687917, a direct
GitHub REST update and readback on 2026-07-30 added `Browser accessibility
acceptance` to `main`'s strict required status checks. The retained required
checks are `Portal quality gate`, `Teaching models on Python 3.12`, and
`Teaching models on Python 3.14`; `main` also continues to apply administrator
enforcement, no-force-push, no-deletion, linear-history, and conversation-
resolution rules. This supersedes only the earlier statement that browser
acceptance was not yet a required `main` check. It is configuration evidence,
not a claim that every later candidate passed, that a private deployment is
verified, or that all accessibility work is complete.

### Latest history-protection readback

On 2026-07-30 (America/New_York), a direct GitHub REST readback confirmed
that both `main` and `agent/60-day-route` still apply their configured branch
protection to administrators, disallow force-pushes and deletion, and require
linear history. `main` requires the strict `Portal quality gate`, `Teaching
models on Python 3.12`, `Teaching models on Python 3.14`, and `Browser
accessibility acceptance` checks. The review branch has no required check or
review rule, so it can retain small ordinary fast-forward evidence commits
while pull request #21 remains reviewable.

This is a direct, point-in-time configuration readback. It does not prove that
future settings cannot change, that every branch is protected, that a pull
request is approved, or that a private deployment has been reviewed.

## Verified candidate-validation records

These are candidate validation records, not releases. The listed Actions checks
completed successfully and are attached to the stated source heads on the
review branch. Unless a row separately records the checked-out ref, it is not
deployment-style evidence that an artifact was built from the head commit
alone.

Course CI pins its third-party Actions to reviewed full commit SHAs. That makes
the workflow configuration more reproducible than mutable major tags, but it
does not independently verify a run URL, prevent every workflow-policy change,
or establish a complete software-supply-chain claim.

### Local CI-evidence policy (not a remote observation)

`content/course/release-evidence-policy.v1.json` is a versioned, hashed local
policy for the repository, Course CI workflow identity and source digest, and
the four required job names. Its pure verifier accepts only a supplied,
normalized snapshot in which the run and every named job bind to the same run
ID, attempt, and source-branch-head SHA. It deliberately rejects mutable
pull-request association fields and derives the Actions URL from the pinned
repository plus run ID.

This is a **local structural check**, not a fetched GitHub observation. In
particular, the source-workflow digest is an assertion supplied by a future
collector; the GitHub run API does not itself furnish it. A pull-request run's
source head is also not proof of the generated merge ref that a runner used.
No historical run is being retroactively certified by this policy. Before it
can support release evidence, a reviewer must explicitly run the read-only
metadata verifier for the exact successful pull-request Course CI run being
recorded. It independently fetches the run and jobs, retains the observed run
attempt, and never checks out, executes, caches, or handles artifacts from
candidate code.

For the normal no-Actions collection path, follow the
[read-only Course CI evidence-capture procedure](RELEASE_EVIDENCE_CAPTURE.md).
It specifies the same run/attempt/jobs boundary, the normalized local-verifier
schema, and the rule that a later additive provenance commit is required before
any record is claimed.

### On-demand Course CI metadata verifier

`.github/workflows/observe-course-ci-metadata.yml` is an explicitly dispatched,
read-only final-verification workflow. It does not run after every Course CI
gate, so ordinary successful pull-request checks do not pay for a duplicate
metadata runner. Its sole required input is a positive decimal Course CI
`run_id`; the value is passed as data, validated before use, and is never
interpolated into the script body.

The workflow has only `actions: read`, uses one immutable
`actions/github-script` revision, reads the selected run, then reads its exact
attempt and jobs. It requires a successful same-repository pull-request Course
CI gate with the expected source head, workflow identity, display title, and
four required jobs. It neither checks out nor executes candidate code, and does
not touch caches, artifacts, deployments, commit statuses, pull-request state,
or secrets.

On success it emits a compact **on-demand source-head-attached Course CI
metadata observation** to its log. It does not prove the generated merge ref
that Course CI executed, that the candidate workflow body matched the policy's
source digest, a GitHub Release, human review, deployment, or learner
readiness. Those missing links require separate, reviewed evidence.

| Source commit | Evidence changed | GitHub Actions evidence | What this establishes | What it does not establish |
| --- | --- | --- | --- | --- |
| [`e524b4050b1a95958a838156e0e1133aaad27619`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/e524b4050b1a95958a838156e0e1133aaad27619) | Deterministic, allowlisted release inputs | [Run 30565380896](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30565380896) — successful | The recorded GitHub workflow validated this source commit. | A GitHub Release, a private deployment, complete module-contract verification, or absence of security risk. |
| [`71fa30137ade8b0e4dbc37ff3851b2aaf45e9a1f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/71fa30137ade8b0e4dbc37ff3851b2aaf45e9a1f) | Markdown and Mermaid rendering sanitization | [Run 30566642793](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30566642793) — successful | The recorded GitHub workflow validated this source commit. | A GitHub Release, a private deployment, complete accessibility review, or absence of security risk. |
| [`35236b18b464dff2c13ce897b43a3392f4a1d2ea`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/35236b18b464dff2c13ce897b43a3392f4a1d2ea) | Exact allowlisting of built teaching-download output | [Run 30567401183](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30567401183) — successful | The portal gate and Python 3.12/3.14 teaching-model jobs validated this source commit. | A GitHub Release, a private deployment, complete accessibility review, or absence of security risk. |
| [`394f20396e21b2289fe4706227c41464b83ac497`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/394f20396e21b2289fe4706227c41464b83ac497) | Advanced-bridge validation, runtime dependency candidate, keyboard fixes, and the prior provenance records | [Run 30568694668](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30568694668) — successful | The portal gate and Python 3.12/3.14 teaching-model jobs validated this source snapshot. | A GitHub Release, a private deployment, a Dependabot alert closure, complete module-contract verification, or a completed accessibility review. |
| [`906cf5e8ddf316f13b1256fa98e376bb29bd2092`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/906cf5e8ddf316f13b1256fa98e376bb29bd2092) | M31 authoring-source audit, bounded studio loading/preview truth, learner-controlled partner prompts, and draft-only M21/M27 contract-pointer pilots | [Run 30569991215](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30569991215) — successful | The portal gate and Python 3.12/3.14 teaching-model jobs validated this source snapshot. | A GitHub Release, a private deployment, M31 publication, human module review, browser accessibility acceptance, a Dependabot alert closure, or absence of security risk. |
| [`b5896be60e0887c41c3bdd263a6e1f34b565cbd4`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b5896be60e0887c41c3bdd263a6e1f34b565cbd4) | Diagnostic-route note contrast cascade repair and two-surface regression | [Run 30581687917](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30581687917) — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | The pull-request event used source head `b5896be60e0887c41c3bdd263a6e1f34b565cbd4` and checked merge candidate [`f670ec62cf7df108d920602f1a48984e69e2e3c9`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/f670ec62cf7df108d920602f1a48984e69e2e3c9). Its browser job built that candidate and passed all 16 targeted Chromium/axe, keyboard, and prediction-gate checks. | A GitHub Release, a private deployment, a complete assistive-technology review, full course-contract verification, or an absence of security risk. Every later candidate needs its own recorded validation. |
| [`b8b9a8870fe8a14e4b886572249f3ac0f50037f6`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b8b9a8870fe8a14e4b886572249f3ac0f50037f6) | Diagnostic navigation keyboard-focus repair and confidence-label text separation | [Run 30587015926](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30587015926) — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | The pull-request event used source head `b8b9a8870fe8a14e4b886572249f3ac0f50037f6` and checked merge candidate [`85306aa6c705eb244cb697ad909003389d97a76b`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/85306aa6c705eb244cb697ad909003389d97a76b). Its browser job built that candidate and passed all 17 targeted Chromium/axe, keyboard, and prediction-gate checks, including the next-question keyboard-focus regression. | A GitHub Release, a private deployment, a complete assistive-technology review, full course-contract verification, or an absence of security risk. Every later candidate needs its own recorded validation. |
| [`282bd6aca23f9791a7b0675e1339b0796c5aec5b`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/282bd6aca23f9791a7b0675e1339b0796c5aec5b) | Immutable third-party Action revisions in Course CI | [Run 30589660835](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30589660835), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | A direct GitHub run readback recorded this pull-request source head and same-repository head. The checkout logs show every named job checked merge candidate [`d3e367960f087ecaedee7b286e5e4b8c411aa212`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/d3e367960f087ecaedee7b286e5e4b8c411aa212); all four named jobs completed successfully. | A GitHub Release, private deployment, complete supply-chain verification, complete accessibility review, full course-contract verification, or absence of security risk. Every later candidate needs its own recorded validation. |
| [`b3f77faaf91cad233756a8e33c3a5cef51cbf0a8`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b3f77faaf91cad233756a8e33c3a5cef51cbf0a8) | Pinned source-head CI candidate evidence record | [Run 30590723766](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30590723766), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded canonical repository/head repository, Course CI identity, source head, and successful required jobs. The checkout logs show every named job checked merge candidate [`e71cde3e0eb14cc640146080c3c89c0bc1b2090d`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/e71cde3e0eb14cc640146080c3c89c0bc1b2090d). | A GitHub Release, private deployment, proof that the candidate workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`02159685fa0069f0bddbc77b287e70ed57f3b4e3`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/02159685fa0069f0bddbc77b287e70ed57f3b4e3) | Read-only prospective Course-CI metadata observer | [Run 30591406448](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30591406448), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded canonical repository/head repository, Course CI identity, source head, and successful required jobs. The checkout logs show every named job checked merge candidate [`d64f688d0cadc79460b1ef8017f0741c767ac917`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/d64f688d0cadc79460b1ef8017f0741c767ac917). | A GitHub Release, private deployment, proof that the prospective `workflow_run` observer executed (it is not yet on the default branch), proof of an execution-ref/policy-body link, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`682f875cc765d8fe800d70fad71704ab9302cd51`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/682f875cc765d8fe800d70fad71704ab9302cd51) | Deterministic source-artifact delivery and stale-map correction | [Run 30592698649](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30592698649), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, source head, attempt, and successful required jobs. The checkout logs show every named job checked merge candidate [`1937d0d315f7b09076bde08facb4c34ced4ee6f9`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/1937d0d315f7b09076bde08facb4c34ced4ee6f9). | A GitHub Release, private deployment, proof that the candidate workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`6309b527f33cdce1fa684c917cc9c39a55736902`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/6309b527f33cdce1fa684c917cc9c39a55736902) | M28 structural packet and bounded M31 authoring fixture | [Run 30593670071](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30593670071), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, source head, attempt, and successful required jobs. The checkout logs show every named job checked merge candidate [`479c638ad3aab46a93e258b7fced8bc62c453c22`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/479c638ad3aab46a93e258b7fced8bc62c453c22). | A GitHub Release, private deployment, M28 human review, M31 learner publication, proof that the candidate workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`3f291c712e8a3c97b570e3312643892a2012a4bd`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/3f291c712e8a3c97b570e3312643892a2012a4bd) | M27 discrete-mathematics structural packet | [Run 30594396737](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30594396737), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, source head, attempt, and successful required jobs. The checkout logs show every named job checked merge candidate [`e2f1170b35f756fe6bebec90184bbb94264c23a5`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/e2f1170b35f756fe6bebec90184bbb94264c23a5). | A GitHub Release, private deployment, M27 human-review approval, proof that the candidate workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`f253b30fb6caffa310646674efddcb5d87902dbf`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/f253b30fb6caffa310646674efddcb5d87902dbf) | M20 non-promoting structural packet and hash-ledgered source-audit input | [Run 30598190724](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30598190724), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, `agent/60-day-route` source head, attempt, and success for all four named jobs. | A GitHub Release, private deployment, M20 human review or publication, proof that a runner used the source head rather than a generated merge candidate, proof that the workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`3ac1ee23e43dce2a74cc65ff2c644e51bb9d20ee`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/3ac1ee23e43dce2a74cc65ff2c644e51bb9d20ee) | M31 S01–S03 bounded KKT authoring fixture | [Run 30598501067](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30598501067), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, `agent/60-day-route` source head, attempt, and success for all four named jobs. | A GitHub Release, private deployment, M31 learner publication, human review, proof that a runner used the source head rather than a generated merge candidate, proof that the workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`8ac23182d2030f5628339208775113113c7ef8d8`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/8ac23182d2030f5628339208775113113c7ef8d8) | M19 non-promoting structural packet and hash-ledgered source-audit input | [Run 30599351278](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30599351278), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, same-repository `agent/60-day-route` source head, attempt, and success for all four named jobs. | A GitHub Release, private deployment, M19 human review or publication, proof that a runner used the source head rather than a generated merge candidate, proof that the workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`a8b466c561d3894c9efeedc33589808725bcb701`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/a8b466c561d3894c9efeedc33589808725bcb701) | M21 non-promoting structural packet and hash-ledgered source-audit input | [Run 30600295144](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30600295144), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, same-repository `agent/60-day-route` source head, attempt, and success for all four named jobs. | A GitHub Release, private deployment, M21 human review or publication, proof that a runner used the source head rather than a generated merge candidate, proof that the workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`0fc55ad1add5a03ba2bd9a9b6d658e2d8e8f0151`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/0fc55ad1add5a03ba2bd9a9b6d658e2d8e8f0151) | M22 non-promoting structural packet and hash-ledgered source-audit input | [Run 30601352266](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30601352266), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, same-repository `agent/60-day-route` source head, attempt, and success for all four named jobs. | A GitHub Release, private deployment, M22 human review or publication, proof that a runner used the source head rather than a generated merge candidate, proof that the workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`3be7919546e09cdf202308d403c99a3c8ed17567`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/3be7919546e09cdf202308d403c99a3c8ed17567) | M23 non-promoting structural packet and hash-ledgered source-audit input | [Run 30602705021](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30602705021), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, same-repository `agent/60-day-route` source head, attempt, and success for all four named jobs. | A GitHub Release, private deployment, M23 human review or publication, proof that a runner used the source head rather than a generated merge candidate, proof that the workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`67b9ac87e0704d1a1eedf9c3eeecde2f4ad5f75d`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/67b9ac87e0704d1a1eedf9c3eeecde2f4ad5f75d) | M24 non-promoting structural packet and hash-ledgered source-audit input | [Run 30605192980](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30605192980), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, same-repository `agent/60-day-route` source head, attempt, and success for all four named jobs. | A GitHub Release, private deployment, M24 human review or publication, proof that a runner used the source head rather than a generated merge candidate, proof that the workflow body matched the local evidence-policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`07a5fbe5199c7f2eb32805172cb6e27dc98d1d84`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/07a5fbe5199c7f2eb32805172cb6e27dc98d1d84) | Legacy session-output bindings for M19/M20/M21/M22/M23/M24/M27/M28/M29/M30 | [Run 30606925539](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30606925539), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, same-repository `agent/60-day-route` source head, attempt, and success for all four named jobs. | A GitHub Release, private deployment, human review or publication of any legacy module, proof a runner used the source head rather than a generated merge candidate, proof workflow body matched the local policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`95ee1275915e2f650b55b4c07052fcf2cf094886`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/95ee1275915e2f650b55b4c07052fcf2cf094886) | Learner-authorized live Codex workflow, Windows static-asset compatibility patch, and preceding session-output provenance record | [Run 30608930763](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30608930763), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI identity, pull-request event, same-repository `agent/60-day-route` source head, attempt, successful named jobs, and the Linux Chromium production-portal exercise. | A GitHub Release, private deployment, manual verification that the designated chats' live behavior or configured Notion notes work, human review or publication of any legacy module, proof a runner used the source head rather than a generated merge candidate, proof workflow body matched the local policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`56a51fb03477157f4be50fe267f5662553181e6e`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/56a51fb03477157f4be50fe267f5662553181e6e) | M25 preview source/route truth repair, dependency-risk provenance clarification, and preceding evidence records | [Run 30610144198](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30610144198), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI pull-request event, same-repository `agent/60-day-route` source head, successful named jobs, and the Linux Chromium production-portal exercise. | A GitHub Release, private deployment, M25 publication or human review, a Dependabot-alert closure, proof a runner used the source head rather than a generated merge candidate, proof workflow body matched the local policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`e37925c58d9cd8f438600de547db7221db010459`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/e37925c58d9cd8f438600de547db7221db010459) | M25 non-promoting structural packet plus M23–M25 local-progress hardening | [Run 30612060681](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30612060681), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI pull-request event, same-repository `agent/60-day-route` source head, successful named jobs, and the Linux Chromium production-portal exercise. | A GitHub Release, private deployment, M25 publication or human review, whole-portal storage hardening, a Dependabot-alert closure, proof a runner used the source head rather than a generated merge candidate, proof workflow body matched the local policy digest, complete accessibility review, full course-contract verification, or absence of security risk. |
| [`3fec6bfe3de72505c7825d15074e0b7eb0fcc31b`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/3fec6bfe3de72505c7825d15074e0b7eb0fcc31b) | Narrowed M19, M23, M24, and M26 local-progress persistence to allowlisted learner-evidence records | [Run 30615229454](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30615229454) — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | The recorded GitHub Course CI run validated this source commit through all four named jobs, including the browser accessibility acceptance suite. | A GitHub Release, private deployment, whole-portal storage hardening, M18 or intake migration, M26 publication or human review, a Dependabot-alert closure, a completed assistive-technology review, full course-contract verification, or absence of security risk. |
| [`1cad269b73b61a17f26cc94c906a8d54677588af`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/1cad269b73b61a17f26cc94c906a8d54677588af) | M18 OS-studio and intake migration to bounded, versioned local learner-progress evidence, including stale-context clearing | [Run 30618059589](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30618059589), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI pull-request event, same-repository `agent/60-day-route` source head, attempt, and success for all four named jobs. The Linux Chromium job exercised the M18 context-change/reload regression and intake progress path. | A GitHub Release, private deployment, whole-portal storage policy/linter, a complete intake-validation instrument, M18 human review or publication, a Dependabot-alert closure, a completed assistive-technology review, full course-contract verification, or absence of security risk. |
| [`1be926e589a8078a0d233394525b5eb5e3b45a37`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/1be926e589a8078a0d233394525b5eb5e3b45a37) | Bounded browser-progress policy, shared storage seam, and M18–M30/intake migration | [Run 30621754049](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30621754049), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI pull-request event, same-repository `agent/60-day-route` source head, attempt, and success for all four named jobs. The Linux Chromium job exercised the production portal, including the scoped browser-progress accessibility regressions. | A GitHub Release, private deployment, full browser-storage coverage beyond the declared policy surface, M1–M36 contract verification, human module review or publication, a Dependabot-alert closure, a completed assistive-technology review, or absence of security risk. |
| [`45d92c2341652839fd06067036b626a9d6a826c3`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/45d92c2341652839fd06067036b626a9d6a826c3) | Canonical v2 course graph; reader/Core/contract/release truth facets; reference-preview boundary; and learner-facing route clarity | [Run 30624582972](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30624582972), attempt 1 — successful: portal gate, Python 3.12/3.14 teaching models, and Linux Chromium/axe browser acceptance | Direct GitHub run/job readback recorded the Course CI pull-request event, same-repository `agent/60-day-route` source head, attempt, and success for all four named jobs. The Linux Chromium job exercised the production portal after the Core-open/reference-preview truth-surface changes. | A GitHub Release, private deployment, M1–M36 contract verification, human module review or publication, a Dependabot-alert closure, a completed assistive-technology review, or absence of security risk. |
| [`64d0324918fcbe87cd976bd8f35cf313e8d43d62`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/64d0324918fcbe87cd976bd8f35cf313e8d43d62) | Source-calibrated M33–M36 authoring-only reasoning, AI, ML, and learning-theory enrichments (including ancestor [`0063b6a5bfb465b8a9ceb4183a11180a9c9d6b07`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/0063b6a5bfb465b8a9ceb4183a11180a9c9d6b07)) | [Run 30705102840](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30705102840) — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the pull-request event, `agent/60-day-route` source head, PR merge candidate `809efc464ff0258e90c42f04a49a9b66a2b359b1`, and success of all four named jobs. | A GitHub Release, private deployment, M31–M36 learner publication or human review, live-chat/Notion verification, complete accessibility review, a Dependabot-alert closure, full course-contract verification, or absence of security risk. |
| [`6040b45c561ffc7dbb9b795281fa487509da0170`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/6040b45c561ffc7dbb9b795281fa487509da0170) | Exact M35/M36 dossier receipt names in the M25/M26 advanced synthesis previews, plus the focused M31 source/reuse recheck | [Run 30712878659](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30712878659) — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` Course CI event, `agent/60-day-route` source head `6040b45…`, and success of all four named jobs. | A GitHub Release, private deployment, M31 learner release or human review, live-chat/Notion verification, complete assistive-technology review, a Dependabot-alert closure, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`ea5d831e69d2bf8ae074d159b48ecde18782312f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/ea5d831e69d2bf8ae074d159b48ecde18782312f) | M1–M5 learner-facing official-source cards, source-to-artifact route, and academic-calibration recheck | [Run 30713747614](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30713747614) — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` Course CI event, same-repository `agent/60-day-route` source head, and success of all four named jobs. | A GitHub Release, private deployment, university equivalence, human module review or publication, complete assistive-technology review, a Dependabot-alert closure, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`422ce836558364c22ecfe37bba4bf98924c6a8b8`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/422ce836558364c22ecfe37bba4bf98924c6a8b8) | Bounded retry for transient isolated-Git-fixture cleanup during M31 authoring-preflight tests | [Run 30722762792](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30722762792) — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` Course CI event, source head `422ce83…`, and success of all four named jobs. The previously observed `ENOTEMPTY` cleanup failure did not recur. | A GitHub Release, private deployment, M31 publication or human review, a completed assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`3368e95eb0b904a98d84c2ac53c8b6037d882daa`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/3368e95eb0b904a98d84c2ac53c8b6037d882daa) | Source-calibrated M32/M33/M35 learning repairs from ancestor `0b6f6cb`, plus the regression that requires the verified current CMU course route | [Run 30725100623](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30725100623) — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` Course CI event, source head `3368e95…`, and success of all four named jobs. It validates the bounded authoring/source/test changes on this review branch. | A GitHub Release, private deployment, M31–M36 learner publication or human review, live-chat/Notion verification, a completed assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`a2e2468354687b0d2f36d6faafda87fcf68dfcf7`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/a2e2468354687b0d2f36d6faafda87fcf68dfcf7) | Bounded preservation of M36 monitoring-dossier evidence, including the M34 decision-model precursor in its ancestry | [Run 30735724479](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30735724479), attempt 1 — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` Course CI event, source head `a2e2468…`, and success of all four named jobs. It validates bounded authoring/source/test changes on this review branch. | A GitHub Release, private deployment, M31–M36 learner publication or human review, live-chat/Notion verification, a completed assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`549d99c6fe3a53b59c3a3662ddef4fbca2ca796f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/549d99c6fe3a53b59c3a3662ddef4fbca2ca796f) | Preview-only M25/M26 synthesis-route correction: future projects, oral defenses, handoffs, and capstone decisions cannot be mistaken for current preview work | [Run 30736350705](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30736350705), attempt 1 — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` Course CI event, source head `549d99c…`, and success of all four named jobs. It validates the bounded preview-route/content/test change on this review branch. | A GitHub Release, private deployment, M25/M26 promotion, M31–M36 learner publication or human review, live-chat/Notion verification, a completed assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`2bccea04a2236c734d4d444edfa0c7d930521ffd`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/2bccea04a2236c734d4d444edfa0c7d930521ffd) | M36 reproducibility-claim debugging probe; learner-controlled record acknowledgements and fallback; proportionate-validation guidance | [Run 30741679780](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30741679780), attempt 1 — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` Course CI event, source head `2bccea0…`, and success of all four named jobs. It validates the bounded authoring/workflow/prompt/test change on this review branch, including the production-portal Chromium exercise. | A GitHub Release, private deployment, M36 learner publication or human review, actual Live-chat/Notion behavior, complete assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`432845a8719dc4fe4f862d3f1ddff121404149fd`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/432845a8719dc4fe4f862d3f1ddff121404149fd) | Bounded M32 systems/accelerators and M35 ML-reasoning authoring refinements, with corresponding source and fixture updates | [Run 30743721855](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30743721855) — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` source head `432845a…` and success of all four named jobs. It validates the bounded authoring/source/test change on this review branch. | A GitHub Release, private deployment, M31–M36 learner publication or human review, live-chat/Notion verification, a completed assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`671dd6f6f56100d430bccef89b6097f6d599e722`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/671dd6f6f56100d430bccef89b6097f6d599e722) | Bounded M33 formal-reasoning and M34 classical-AI authoring refinements, with corresponding source and fixture updates | [Run 30744630166](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30744630166) — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` source head `671dd6f…` and success of all four named jobs. It validates the bounded authoring/source/test change on this review branch. | A GitHub Release, private deployment, M31–M36 learner publication or human review, live-chat/Notion verification, a completed assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`d3e14bde794fdb05c7bf268996e49e3319a6dd36`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/d3e14bde794fdb05c7bf268996e49e3319a6dd36) | Bounded M35/M36 ML-evidence and learning-theory boundary refinements, with corresponding source and fixture updates | [Run 30745185490](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30745185490) — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` source head `d3e14bd…` and success of all four named jobs. It validates the bounded authoring/source/test change on this review branch. | A GitHub Release, private deployment, M31–M36 learner publication or human review, live-chat/Notion verification, a completed assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`4ce9ba9d10f87a3677438ed119f4ffdbfa32965d`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/4ce9ba9d10f87a3677438ed119f4ffdbfa32965d) | Honest 60-day route-capacity calibration and M1–M5 planning-envelope evidence | [Run 30746554987](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30746554987) — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` source head `4ce9ba9…` and success of all four named jobs. It validates the bounded pacing, graph, route, and regression-test change on this review branch. | A GitHub Release, private deployment, a learner's actual pace or mastery, M1 live-chat/Notion verification, complete assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`9d40e8f2017c10137e8c1c0dd185ee1664b78621`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/9d40e8f2017c10137e8c1c0dd185ee1664b78621) | Hash-bound 24-section learner-inventory crosswalk to all 62 non-deferred Scope Matrix rows | [Run 30747189814](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30747189814) — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` source head `9d40e8f…` and success of all four named jobs. It validates the bounded graph/schema, generated-input, type, portal, teaching-model, and browser-accessibility change on this review branch. | A GitHub Release, private deployment, full atomic/bullet-level inventory coverage, learner access or mastery, M1 live-chat/Notion verification, complete assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |
| [`9e2e311446f787dc1b620dd681fb26215d967ce5`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/9e2e311446f787dc1b620dd681fb26215d967ce5) | Advanced evidence-chain clarification: systems/math bridge wording plus M31 KKT/Slater and M32 side-stream ownership/lifetime refinement | [Run 30795582906](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30795582906), attempt 1 — successful: Portal quality gate, Teaching models on Python 3.12/3.14, and Browser accessibility acceptance | Direct GitHub run/job readback recorded the `pull_request` source head `9e2e311…`, review branch `agent/60-day-route`, and success of all four named jobs. It validates the bounded authoring/source/test change on this review branch. | A GitHub Release, private deployment, M31–M36 learner publication or human review, M25/M26 promotion, live-chat/Notion verification, a completed assistive-technology review, a security-clean claim, full course-contract verification, or proof that a runner built the source head rather than a generated merge candidate. |

## Recorded non-successful candidate validation

| Source commit | Evidence changed | GitHub Actions evidence | Recorded outcome | Release consequence |
| --- | --- | --- | --- | --- |
| [`a89fcae9a32dd0f9584a1b6f579ccd1f6bb3a853`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/a89fcae9a32dd0f9584a1b6f579ccd1f6bb3a853) | Linux Chromium/axe browser-acceptance harness | [Run 30571390346](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30571390346) — browser-accessibility failed; portal and Python teaching-model jobs passed | The browser job reported real contrast and keyboard-focus failures. | This commit is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. A later exact-commit Linux run must pass before a success record is added. |
| [`2a182dea3edbda1ccb52f67851c2b9de1c11be54`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/2a182dea3edbda1ccb52f67851c2b9de1c11be54) | Legacy/ahead-of-release audits, 20-probe routing, accessibility repairs, and truthful release boundaries | [Run 30576396718](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30576396718) — portal and Python 3.12/3.14 jobs passed; browser-accessibility failed. The check is attached to this head, while the pull-request workflow checked merge candidate `65060c29ccd5da250b4ed91b570786e1388a9cdf`. | Seven browser checks failed. Confirmed causes include an unlabelled GFM workbook checklist, stale diagnostic confidence selectors, ambiguous selectors over intentional text equivalents, and a trust-studio radio hit-target interaction. The failure report is retained by GitHub as an artifact; it is remediation input, not erased history. | This head/merge candidate is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. A later successful candidate must be recorded separately; it does not rewrite this failure. |
| [`2f2bd430764c9caf6ac01ddf88b5ca4d33972aee`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/2f2bd430764c9caf6ac01ddf88b5ca4d33972aee) | Browser-accessibility remediation for checklist labels, native-radio hit targets, and scoped studio selectors | [Run 30578320310](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30578320310) — portal and Python 3.12/3.14 jobs passed; browser-accessibility failed. GitHub records this pull-request run against the stated source head. | Four browser checks failed: the M30 axe scan found a low-contrast inactive tab label and an empty table header; the completed diagnostic used a fragile native-radio pointer path; and M22/M30 post-reveal assertions kept obsolete accessible names. The failure artifact is retained as remediation input. | This source head is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. Its successor must pass and be recorded separately; it does not rewrite this failure. |
| [`92520298c0f32c5f49114edaaa0211c20f73f590`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/92520298c0f32c5f49114edaaa0211c20f73f590) | M30 contrast/table semantics, keyboard-oriented diagnostic checks, and prior-candidate provenance | [Run 30579604454](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30579604454) — portal and Python 3.12/3.14 jobs passed; browser-accessibility failed. GitHub records this pull-request run against the stated source head. | One browser check failed: the diagnostic prerequisite note rendered `#66706a` on `#f3dfc5` at 3.95:1. The browser report is retained as remediation input; it exposed a real reading-contrast defect that prior route coverage had not exercised. | This source head is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. Its successor must pass and be recorded separately; it does not rewrite this failure. |
| [`2d898ae65e62919f67a3d829e68d8c729553c4b6`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/2d898ae65e62919f67a3d829e68d8c729553c4b6) | Diagnostic prerequisite contrast token and static contrast regression | [Run 30580493280](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30580493280) — portal and Python 3.12/3.14 jobs passed; browser-accessibility failed. The pull-request workflow checked merge candidate `6f088ea` containing this source head. | One browser check failed. Axe still observed muted `#66706a` on the saffron prerequisite surface and the plum future-extension surface (3.95:1 and 3.97:1). The report showed that the token declaration did not overcome the more-specific `p:last-child` muted rule; both affected notes remain remediation input. | This source head/merge candidate is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. Its successor must pass and be recorded separately; it does not rewrite this failure. |
| [`df921b731fe165b3d5269e7837a96af6779ab903`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/df921b731fe165b3d5269e7837a96af6779ab903) | M31 lifecycle-aware authoring-only contract gate | [Run 30584962826](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30584962826) — portal quality gate and Python 3.12/3.14 teaching-model jobs passed; browser-accessibility failed. The pull-request workflow checked merge candidate [`17c37120c28cdcbaef49d5978adadc2d40c349c0`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/17c37120c28cdcbaef49d5978adadc2d40c349c0). | The browser job passed 15 targeted checks and failed the completed-diagnostic keyboard-radio assertion: after focus and Space, the selected radio remained unchecked in both logged attempts. GitHub retained `playwright-browser-accessibility-report` artifact `8776239948` as remediation evidence; the log does not by itself establish root cause. | This source head/merge candidate is **not** browser-accessibility acceptance, a release, private-deployment evidence, M31 publication, a completed accessibility review, or course-completion evidence. A later successful candidate must be recorded separately and does not rewrite this failure. |
| [`42686f676736d8154096a5e4e0696a18dafbc6cf`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/42686f676736d8154096a5e4e0696a18dafbc6cf) | M26 malformed local-progress clarification | [Run 30745618631](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30745618631) — cancelled while Browser accessibility acceptance remained in progress; Portal quality gate and Teaching models on Python 3.12/3.14 succeeded | Direct GitHub run/job readback recorded source head `42686f6…`; it did not record a completed successful browser-acceptance job. | This commit has no complete successful Course CI record. It is not browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. |

## Historical GitHub Release reconciliation

On 2026-07-30, the following GitHub Release pages and tag targets were checked
directly against the `github` remote. This reconciles GitHub facts without
rewriting the historical changelog. It establishes only that the named Release
page exists and its tag resolves to the listed source commit. The private-host
deployment statements in older changelog entries were not independently
re-verified during this reconciliation and therefore remain historical,
unverified deployment assertions in this ledger.

| GitHub Release | Resolved source commit | GitHub fact now recorded | Not established by this table |
| --- | --- | --- | --- |
| [`v0.5 — Languages and bounded evaluation`](https://github.com/michaeliu3/atlas-academy-python-cs/releases/tag/v0.5-languages) | [`f555c0830822c364ace6ef2aca92cda2f079352d`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/f555c0830822c364ace6ef2aca92cda2f079352d) | Release page published 2026-07-30; annotated tag resolves to this commit. | Private deployment, protected-main status, CI conclusion, complete course compliance, or security-clean state. |
| [`v0.5.1 — Private toolchain hardening`](https://github.com/michaeliu3/atlas-academy-python-cs/releases/tag/v0.5.1-security) | [`0105f3e0a6c73d228c2d39e62bad00358096d1c4`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/0105f3e0a6c73d228c2d39e62bad00358096d1c4) | Release page published 2026-07-30; annotated tag resolves to this commit. | Private deployment, protected-main status, CI conclusion, complete course compliance, or security-clean state. |
| [`v0.5.2-runtime-evidence — Module 24`](https://github.com/michaeliu3/atlas-academy-python-cs/releases/tag/v0.5.2-runtime-evidence) | [`091d4509e75b4f7123c369c2d29c0a334d2d3b41`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/091d4509e75b4f7123c369c2d29c0a334d2d3b41) | Release page published 2026-07-30; lightweight tag resolves to this commit. | Private deployment, protected-main status, CI conclusion, complete course compliance, or security-clean state. |
| [`v0.5.3 — Decision Evidence`](https://github.com/michaeliu3/atlas-academy-python-cs/releases/tag/v0.5.3-decision-evidence) | [`21fdba698601971ea6fac939abb43ebfb6ae94ba`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/21fdba698601971ea6fac939abb43ebfb6ae94ba) | Release page published 2026-07-30; lightweight tag resolves to this commit. | Private deployment, protected-main status, CI conclusion, complete course compliance, or security-clean state. |
| [`v0.6 — Capstone Defense`](https://github.com/michaeliu3/atlas-academy-python-cs/releases/tag/v0.6-capstone) | [`7f40fed7bf12277b6fe2ae29f6b22be30dfb7628`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/7f40fed7bf12277b6fe2ae29f6b22be30dfb7628) | Release page published 2026-07-30; lightweight tag resolves to this commit. | Private deployment, protected-main status, CI conclusion, complete course compliance, or security-clean state. |

## Audit inventory records (not releases)

These source commits add audit machinery and evidence inventories. Their open
[pull request #21](https://github.com/michaeliu3/atlas-academy-python-cs/pull/21)
is a review path, not a recorded human approval. A later Actions check attached
to descendant head `2a182de` is recorded above, but its browser job failed and
its pull-request workflow checked a generated merge candidate. That is not a
substitute for independently recorded exact-build or human-review evidence.

| Source commit | Audit scope | What the source records | What it does not establish |
| --- | --- | --- | --- |
| [`48da9f9`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/48da9f9) | M1–M30 legacy workbooks | A deterministic 16-criterion, 480-cell structural inventory bound to canonical workbooks, sessions, source maps, and an allowlisted input hash. | Human teaching/source/accessibility review, completed contracts, module publication, a deployment, or learner mastery. |
| [`1872946`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/1872946) | M31–M36 authoring-only extension | A historical graph/manifest-bound gap audit that explicitly says “Do not publish” for every advanced module and preserves the M25/M26 preview boundary. | Advanced learner content, a publishable contract, release provenance, deployment, or a date promise. |

## Known limits at ledger creation

- GitHub's default branch reports six dependency alerts (four high and two
  medium). They remain open risk items pending targeted remediation or explicit
  triage; this ledger does not call the project security-clean.
- M1–M30 are recorded as legacy structural baselines, not fully
  contract-verified modules. The strict course-contract gate deliberately does
  not yet pass for them.
- M31–M36 remain authoring-only. They are not published learning material.
- The portal's private ChatGPT Sites deployment has not been verified in this
  ledger. GitHub Release-page and tag facts are reconciled above, but no
  private deployment is inferred from them.
- Automated accessibility and performance evidence is incomplete; passing a
  source or CI check is not a claim of a completed assistive-technology or
  visual review.
- GitHub annotated the successful 45d92c2 Course CI run because several pinned
  Actions still target Node.js 20 and GitHub forced Node.js 24 at runtime.
  This is a provider migration warning to triage, not a failed check or a
  security-clean claim.

## Required evidence before recording a private release

For a deployable candidate, record the exact immutable commit SHA, reviewable
GitHub ref/PR, GitHub Actions run URL and conclusion, release-input ledger
state, known limitations, and—only after it actually occurs—the private
deployment version and verification result. If a GitHub Release is intended,
also record its existing tag and release URL. Never fill a field from an
assumption, a configured remote, or a local command alone.

## Dated dependency-risk supersession (2026-08-03)

The six-alert statement in **Known limits at ledger creation** is a historical
snapshot. For the current alert count and exact default-branch/review-branch
disposition, consult the living [dependency risk register](DEPENDENCY_RISK_REGISTER.md),
last examined 2026-08-03. This pointer does not claim a merged remediation,
alert closure, private deployment, or security-clean state.

## Recorded source-ref observation (2026-08-04)

At this direct GitHub API readback,
[`codex/atlas-60-day-route-history`](https://github.com/michaeliu3/atlas-academy-python-cs/tree/codex/atlas-60-day-route-history)
resolved to [`d5bce33582eb7f54a01d3edd9299d2f5cb0b951f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/d5bce33582eb7f54a01d3edd9299d2f5cb0b951f)
after its ordinary additive push. A GitHub Actions query for that exact SHA
returned zero workflow runs, as expected because Course CI only reacts to
`push` on `main` and no pull-request state was changed.

This records current, reviewable source provenance and the absence of an
unnecessary hosted-run cost for that history-only push. It does **not** record
a successful CI gate, human review, release, deployment, security clearance,
or learner outcome for the commit.

## Follow-up source-ref observation (2026-08-04)

A later direct GitHub API readback resolved
[`codex/atlas-60-day-route-history`](https://github.com/michaeliu3/atlas-academy-python-cs/tree/codex/atlas-60-day-route-history)
to [`0e3a51d088e36c0b02e140b9caedb12dbff50115`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/0e3a51d088e36c0b02e140b9caedb12dbff50115).
Its exact-SHA Actions query again returned zero workflow runs. This ref is
separate from open Draft PR #21, whose head remained
[`54b894fb011c341373085747c43829be362c894a`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/54b894fb011c341373085747c43829be362c894a).

An ordinary atomic fast-forward attempt to bring the current history to that
protected PR branch was rejected because the local ancestry contains the older
merge commit `df217f5b9f0211dc025169d9c48d5a2aeb890ec3`; GitHub made no ref
change. No force-push, rebase, squash, deletion, or history rewrite was
attempted. This observation records provenance and the still-pending PR path;
it does not establish a CI gate, release, deployment, security clearance, or
learner outcome.

## Active Draft cost-control observation (2026-08-04)

The preceding `54b894f` state is a dated history record. A later direct GitHub
readback found Draft PR #21 at
[`b69bfa8e3c8eded0bd7dc5e0f9b1f4718a491aab`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b69bfa8e3c8eded0bd7dc5e0f9b1f4718a491aab).
Its [Course CI run 30905783135](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30905783135)
was labelled as a Draft preflight and skipped the hosted portal, two-Python,
and browser checks before runner allocation. The source branch therefore has
the intended cost control without altering required review/full-gate checks.

This is not a successful full Course CI gate, deployment, private release,
security clearance, or proof of cancellation of an already-running superseded
run. The current linearized content batch needs its own normal review-ready
gate before any release interpretation.

## Current non-draft full-gate observation (2026-08-04)

The additive source head
[`a5bf821`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/a5bf821ed3f1b7f52f039b0706d45d34561ec41a)
on `agent/60-day-route` received the normal non-draft pull-request Course CI
run
[`30958237679`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30958237679)
with a successful conclusion. The run's generated merge candidate was
`16ffa9142ca6c840999b6cfa31eed580cabfb973`; its successful jobs were Portal
quality gate (including the bounded live source-link audit), Node apparatus
validation (416/416), Teaching models on Python 3.12, Teaching models on
Python 3.14, and Browser accessibility acceptance (63/63 Chromium/axe routes).

This records automated workflow evidence for that merge candidate and its
source head. It does not establish human module review, assistive-technology
completion, Notion or voice-platform behavior, dependency-alert closure,
private deployment, publication, certification, credit, or learner mastery.

## Current source-head revalidation (2026-08-04)

The additive source head
[`601296d`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/601296deafd3ef4c44c98a0b088c67e198a62952)
received the normal non-draft pull-request Course CI run
[`30959390181`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30959390181)
with a successful conclusion. Its jobs passed the portal quality gate, bounded
live source-link audit, Node apparatus (416/416), Python 3.12 and 3.14 teaching
models, and Chromium/axe browser acceptance (63/63 routes). This is the current
automated gate record for the source head and is not module promotion, human
review, private deployment, security clearance, publication, or learner outcome
evidence.

## Latest source-head gate (2026-08-04)

The next additive source head
[`1a0e4da`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/1a0e4dae0c525832225293e13698b11f833f1b14)
received Course CI run
[`30961057821`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30961057821)
with a successful conclusion. Portal quality, live source links, Node
apparatus (416/416), Python 3.12 and 3.14 teaching models, and Chromium/axe
browser acceptance (63/63 routes) all passed. This remains automated gate
evidence only; it is not module promotion, human review, private deployment,
security clearance, publication, or a learner outcome.

## Local additive continuation after latest hosted gate (2026-08-04)

The working branch continued with ordinary additive commits after the latest
hosted gate: `0794d0c` records the explicit M31–M36 canonical-workbook parity
allow-list, and `6845db4` corrects the compliance matrix wording so historical
gate results are not labelled as current-head verification. Neither commit
has a hosted Actions rerun, private deployment verification, release record,
or learner-outcome evidence. No history rewrite, force-push, amend, rebase, or
squash was used.

## Review branch published for external review (2026-08-04)

The additive continuation was published with an ordinary fast-forward push to
the review branch
[`codex/atlas-history-linearization`](https://github.com/michaeliu3/atlas-academy-python-cs/tree/codex/atlas-history-linearization)
at [`aeffb37`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/aeffb37005cb6e1d9a5147ea70db34541d13ae62).
The branch is 19 commits ahead of the local `github/agent/60-day-route` base,
and its exact remote ref was read back after the push. The feature-branch push
matched the workflow's `main`/pull-request trigger boundary, so no hosted Course
CI run was created for this push. This preserves the complete additive commit
history and does not establish a current-head gate, deployment, release, or
learner evidence.

## Draft stacked review PR opened (2026-08-05)

The review branch is now available as draft [PR #22](https://github.com/michaeliu3/atlas-academy-python-cs/pull/22),
stacked on the preserved `agent/60-day-route` lineage used by PR #21. This
keeps the additive history reviewable without presenting the inherited history
as a new 424-commit change set. Its initial PR head was
[`65b5510`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/65b5510f9dc5a62db3c02d041248414ba8782e5f),
with 23 commits and 68 changed files relative to that base. It remains draft;
the draft workflow was blocked before runner allocation by the repository
account billing/spending-limit state. No release, deployment, or learner
evidence is implied.

The preceding provenance checkpoint recorded PR head [`809547a`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/809547aa81a6114c1681d95f09b786bc3c2c0c96),
with 25 commits and 68 changed files relative to that base. The subsequent
documentation-only [`3dd37aa`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/3dd37aa646454218fc446724cdb208f12729257f) commit extends this record.
The later draft
attempts [`30971257663`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30971257663)
and [`30971329351`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30971329351)
were blocked by the same billing/spending-limit state before runner allocation.

## Current draft content checkpoint (2026-08-05)

The additive review branch now resolves to
[`fd63dfb`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/fd63dfb0f9d2554b7fefb3c1b0eebaa661e4f101).
Draft Course CI run
[`30975709181`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30975709181)
completed successfully: changed-file classification passed and the draft
content check passed its 91-test content suite. Portal quality, apparatus,
browser accessibility, and Python teaching-model jobs were skipped by the
intentional draft cost-control path. This is current source-head and bounded
content evidence only; it is not a full Course CI gate, release, deployment,
human review, module promotion, or learner evidence.

## Levels 1–9 delivery-audit checkpoint (2026-08-05)

The additive source tree now includes
`tests/levels-1-9-delivery-audit.test.mjs`, which passed against the canonical
course graph and audits all 63 calibrated Scope Matrix topics. The check
verifies graph-backed anchors, source modules, S1–S6 session bounds, and the
separation of reader, preview, authoring-only, and designated private-chat
delivery. This is local structural evidence only; it does not establish human
calibration, accessibility review, release, deployment, or learner mastery.

## Canonical projection-parity checkpoint (2026-08-05)

The additive source tree now includes
`tests/canonical-projection-integrity.test.mjs`. It passed with the graph and
status suites and compares the reader manifest's route, prerequisite, state,
source-map, and navigation fields against the canonical graph projection. It
also preserves the boundary that hidden M31–M36 arc data remains in the graph
but is absent from the reader manifest. This is local structural evidence, not
rendered human review, deployment, release, or learner evidence.

## Mathematical-spine checkpoint (2026-08-05)

The additive review branch now resolves to
[`d9dcc8a`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/d9dcc8aba28bc9d839bb76e31b5b23ffb8e28e96).
M31's canonical authoring workbook and hidden candidate now explicitly include
data-processing, maximum-entropy, and coding-interpretation boundaries, and the
M28–M31 spine audit passed its 94-test content suite in Draft Course CI run
[`30976990411`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30976990411).
Draft cost control intentionally skipped portal, apparatus, browser, and Python
teaching-model jobs; this checkpoint is not a full gate, release, deployment,
human review, or learner outcome.

## Legacy-contract structural checkpoint (2026-08-05)

Commit [`8065d40`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/8065d40aeb6fbf1cafedcd3f15a240f689ff2b2d)
records the checked-in M1–M30 contract audit and candidate-preflight evidence.
Its deterministic report resolves 480 structural
criteria (478 pointer-present, 2 intentional M25/M26 prerequisite-map
ambiguities, 0 missing). This is not a module promotion or verification: all 30
legacy entries remain non-verified pending module-specific human review,
source/CI/deployment provenance, and an explicit promotion decision. Draft Course
CI run [`30977716814`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30977716814)
passed the content path; the remaining expensive jobs were skipped by draft
cost control.

## Advanced source-ledger checkpoint (2026-08-05)

The authoring contract now binds the M31 claim marker `C10` and the new
`tests/advanced-source-ledger-audit.test.mjs` verifies all planned M31–M36
source/session markers, stable links, access dates, license/reuse boundaries,
and claim linkage. This is structural authoring evidence only; source-quality,
visual/accessibility, human review, release, deployment, and learner evidence
remain separate gates.

## Worker security-boundary checkpoint (2026-08-05)

Commit [`b65ee26`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b65ee26)
adds an apparatus regression to `tests/http-security-headers.test.mjs`. It
checks that the production Worker applies the shared security-header helper to
both the image-optimization response and the ordinary application response,
and that no direct application return bypasses that boundary. This is source
and local-test evidence only; it does not verify headers at the actual private
deployment, resolve open Dependabot alerts, or establish a security-clean
state.

## Release-input hash repair checkpoint (2026-08-05)

Draft Course CI run
[`30978655480`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30978655480)
correctly rejected the intermediate head because the edited
`content/course/goal-compliance.v1.json` was not yet reflected in the
allowlisted release-input hash ledger. Commit
[`76b1f14`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/76b1f14)
regenerated that ledger; local `validate-course --require-git-tracked`,
`check-generated`, and goal-matrix checks then passed. The failure is retained
as provenance and is not represented as a passing gate; a subsequent hosted
run is required to validate the repaired source head.

## Repaired-source Draft content checkpoint (2026-08-05)

After the release-input hash repair, Draft Course CI run
[`30978814516`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30978814516)
validated head [`e59db9f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/e59db9f5a6b384c8452957dc28bab2b9f8ac07bb): changed-file
classification and the full draft content path passed, including tracked
input, generated-artifact, source-link, and content-suite checks. Portal,
apparatus, browser, and teaching-model jobs were skipped by draft cost control.
This is repaired-source/content evidence, not a non-draft full gate, release,
deployment, human review, or learner evidence.

## Final-audit surface checkpoint (2026-08-05)

Commit [`1c9bd5f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/1c9bd5f904fe50f3230a5fcf7dfab3ff5b79f6b2)
adds `docs/FINAL_AUDIT.md` and the matrix-reconciliation regression
`tests/release-final-audit.test.mjs`. The audit explicitly marks the goal
**NOT COMPLETE** and lists current complete evidence, intentional deferrals,
uncertainties, and the required closure sequence. Draft Course CI run
[`30979206934`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30979206934)
passed the draft content path; expensive non-draft checks were skipped by
policy. The audit surface is now reviewable, but it is not a completion claim.

## Private-deployment header procedure checkpoint (2026-08-05)

The additive head adds docs/DEPLOYMENT_HEADER_VERIFICATION.md, a bounded
manual procedure for checking both the ordinary Worker response and the
/_vinext/image response after a private deployment reports success. The focused
tests/http-security-headers.test.mjs suite passes 4/4, including the procedure
assertions. This documents how to collect deployment evidence; it does not
record a deployment URL, imply that headers were observed remotely, resolve
dependency alerts, or establish security-clean status.

Draft Course CI run
[30979754373](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30979754373)
then passed the changed-file classifier and draft content path for this
checkpoint. Portal, apparatus, browser, and teaching-model jobs were skipped by
draft cost control. The hosted result confirms the checked-in content path; it
does not substitute for direct deployment observation or a non-draft full gate.

## Live source-link transport checkpoint (2026-08-05)

The live source audit now checks all 1,068 source-map and calibration URLs. The
bounded run recorded 1,038 HTTP 200 responses, 4 HTTP 202 responses, 4 HTTP
206 responses, 3 HTTP 401 responses, and 19 HTTP 403 responses; the latter
statuses are accepted as reachable boundary responses. The audit uses a
fail-closed system-curl fallback when the bundled Node runtime cannot establish
the host trust chain; it never turns a transport failure into a passing link.
This validates liveness and freshness evidence, not institutional alignment,
source permission, human review, or learner mastery.

## Documentation-only provenance reconciliation — 2026-08-05

The completion snapshot and final audit were reconciled on documentation-only
head [`22f7e38`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/22f7e38b86815f55eb4da4f3ee165ba9c27d77a7).
Draft Course CI run
[`30984252292`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30984252292)
passed the changed-file classifier and 95-test content path; portal,
apparatus, both Python teaching-model entries, and browser acceptance were
skipped because PR #22 remains draft. The preceding content-bearing snapshot
[`49bda34`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/49bda3468e9dbd14ec934c5e60ac0b11b30d3e39)
was already checked by Draft run
[`30983252123`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30983252123).
These are additive provenance and draft-content observations only; they do not
establish a full non-draft gate, release, deployment, human review, or learner
evidence.

## Current Draft content checkpoint (2026-08-05)

Commit [`6e0a02c`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/6e0a02ca71d77bce7043594555f99800e8a9ee2d)
was checked by Draft Course CI run
[`30982815817`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30982815817).
The classifier and 95-test content path passed; portal, Node apparatus, both
Python teaching-model entries, and browser acceptance were skipped because
PR #22 remains draft. This is current source/content evidence only, not a
non-draft full gate, release, deployment, human review, or learner outcome.

## GPT Live High policy-binding checkpoint (2026-08-05)

Additive commit [`8b856cb`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/8b856cbf94945746132afb860ea0277fe1b14c58)
bound the learner-requested GPT Live High preference into the canonical
designated-chat workflow and its fail-closed validator. Draft Course CI run
[`30987956581`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30987956581)
passed the changed-file classifier and Draft content feedback; expensive jobs
were skipped under the draft cost-control policy. This records source and
bounded Draft validation only, not live voice/rendering behavior, Notion writes,
deployment verification, human review, module promotion, or a release.

## M32 advanced-scope regression checkpoint (2026-08-05)

Additive commit [`094195f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/094195f964a84d17ae95edd27ca1f6d6aaa6dc3a)
added focused assertions for the hidden M32 workbook and generated candidate.
Draft Course CI run
[`30988818302`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30988818302)
passed the changed-file classifier and Draft content feedback; expensive jobs
were skipped under the draft cost-control policy. This records bounded source
and test evidence only, not human review, learner delivery, deployment,
publication, or release evidence.

## Designated-chat role-binding checkpoint (2026-08-05)

Additive commit [`96a4427`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/96a4427571b9da0b967803d2caf2635d6c619e4b)
recorded direct delivery and concise acknowledgements from the existing
Teaching Assistant and Study Partner chats. Draft Course CI run
[`30989313009`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30989313009)
passed the changed-file classifier and Draft content feedback; expensive jobs
were skipped under the draft cost-control policy. This records role-delivery
and bounded source evidence only, not a substantive learner session, live
rendering, Notion write, deployment, human review, publication, or release.

## Test-runner cancellation checkpoint (2026-08-05)

Additive commit [`ff839b4`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/ff839b4)
added bounded SIGINT/SIGTERM forwarding and Windows worker-tree cleanup to the
split Node test runner, with a focused lifecycle regression. Local checks also
passed the 96-test content suite and a 41-test focused apparatus selection.
Draft Course CI run
[`30990920229`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30990920229)
passed classification and Draft content feedback; expensive jobs skipped under
the draft policy. This is cancellation-safety and bounded Draft evidence only,
not a non-draft full gate, release, deployment, human review, or learner
evidence.

## Notion structure read-only checkpoint (2026-08-05)

Read-only Notion search/fetch confirmed the existing dashboard, lecture and
module notebooks, completion/evidence record, Live Codex Session Records page,
project portfolio, TA misconceptions, Study Partner journal, and problem-
solving lab surfaces. The fetched session-record page preserves the exact-chat
`records on` gate, records-off default, concise-note format, and unchecked live
acceptance checklist. No Notion page was created or edited, and this does not
prove a successful records-on write, pause/end/delete handling, voice quality,
or equation/code rendering.

## Private-deployment access-boundary checkpoint (2026-08-05)

Unauthenticated read-only requests to the configured private Sites host returned
HTTP 401 for both `/` and `/_vinext/image`, before the Worker application
response. The platform access boundary prevented header observation, so this
is only an authenticated-access limitation—not deployment, header-compliance,
or security-clean evidence.

## Learner-led designated-chat kickoff checkpoint (2026-08-05)

The existing Teaching Assistant and Study Partner chats were sent the canonical
Module 30 learner-led kickoff. Both returned a single prediction-and-confidence
prompt and await the learner; no learner answer is inferred. Records stayed off,
and no transcript, audio, or Notion write was captured. This is bounded session
reachability evidence, not a completed session, oral-defense result, rendering
verification, learner mastery, deployment, or release claim.

## Incremental Actions synchronize-classification checkpoint (2026-08-05)

The workflow classifier was tightened to use the previous PR head on
`pull_request.synchronize` when GitHub supplies `event.before`; it retains the
conservative base comparison for other event types and falls back to that range
if the field is unavailable. This is intended to remove duplicate Draft content
feedback on docs-only follow-ups without removing required checks. Hosted cost
reduction remains pending a direct docs-only synchronize observation.

## Human-requirements phase waiver (2026-08-05)

The learner authorized a build-phase waiver of all human-only requirements.
Human review, learner-led TA/Study Partner sessions and oral defense, live
whiteboard/rendering observation, and records-on Notion writes are waived for
this build and are not release evidence. Machine-verifiable contracts, tests,
privacy and safety checks, dependency/deployment disposition, additive Git
history, and a current non-draft full Course CI gate remain mandatory. The
waiver does not support claims of mastery, certification, credit, or
institutional equivalence.

## Current release-input binding checkpoint (2026-08-05)

Additive commit [`7951eba`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/7951ebaabab1b8d875b0f1bc087c1e234485b580)
refreshed the Course CI workflow digest in both the release-evidence policy and
the generated release-input ledger. Draft Course CI run
[`30993424413`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30993424413)
passed structural/release-input, generated-artifact, generated-matrix,
source-link freshness, and Draft content checks. Expensive jobs were skipped by
the draft policy; this is current Draft provenance, not a non-draft full gate,
deployment proof, or release approval.

## Latest dependency-alert refresh (2026-08-05)

An authenticated GitHub Dependabot API readback for protected `main` commit
[`33fadbd`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/33fadbd49b0e33900f21aba06ed40845c3cbd641)
returned two open alerts: high `fast-uri` (#50) and medium `postcss` (#49).
The review branch lockfile contains patched candidate versions, but the alerts
remain open until the candidate is normally merged and GitHub recalculates.
This refresh is dependency provenance only and is not a security-clean,
deployment, or release claim.
The same additive head [`b52ad41`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b52ad4195dfe21342880dfcfc613f3bab33d40c5)
passed the 96-test Draft content path in Course CI run
[`30994042442`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30994042442);
full-gate jobs were skipped under the draft policy.
The compliance-pointer head [`3e76de4`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/3e76de40980ecc6b76a8933b2fff53cd6487639f)
also passed the 96-test Draft content path in run
[`30994244025`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30994244025).
The current audit/provenance head [`8ec003b`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/8ec003bb9528e0c6be340723a4ba36c9aea5440b)
passed the same 96-test Draft content path in run
[`30994493344`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30994493344).

## Bounded local apparatus attempt (2026-08-05)

One local `scripts/run-course-tests.mjs --suite=apparatus` invocation at the
current clean head exceeded the 120-second shell limit and was terminated with
its identified worker tree. No local apparatus result is promoted to release
evidence; the hosted full-gate result below is the authoritative apparatus
evidence.

## Current non-draft full-gate checkpoint (2026-08-05)

Additive commit [`01b2c72`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/01b2c725a2fe7c0e5535a77a271c7034df14efb0)
passed the normal review-ready Course CI gate
[`30997455314`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30997455314).
Portal quality, strict TypeScript, lint, build, content tests, 421/421 Node
apparatus tests, Python 3.12 and 3.14 teaching models, and 63/63 Chromium/axe
routes all passed. The source-link liveness audit remains separately recorded
on the immediately preceding source-unchanged gate
[`30995803298`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30995803298),
which checked 1,064 URLs. This is automated provenance, not publication,
deployment, human review, or learner mastery evidence.

## Current non-draft full-gate checkpoint (2026-08-05, latest)

The additive review-ready ref [`f4ea506`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/f4ea506a06eead4e697f7aa27d4f521492cfdc9f)
passed normal non-draft Course CI run
[`31004629901`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/31004629901).
Portal quality, strict TypeScript, lint, build, content tests, 423/423 Node
apparatus tests, Python 3.12 and 3.14 teaching models, and 63/63 Chromium/axe
routes all passed. The source-link liveness audit remains separately recorded
on the preceding source-unchanged gate. This is automated provenance, not
publication, deployment, human review, or learner mastery evidence.

## Current non-draft full-gate checkpoint (2026-08-05, refreshed)

The current reviewed ref [`3592f33`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/3592f333a3c321a76e6ee6663ddbd29af9bba6c1)
passed normal non-draft Course CI run
[`30999700508`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30999700508).
Portal quality, strict TypeScript, lint, build, content tests, 421/421 Node
apparatus tests, Python 3.12 and 3.14 teaching models, and 63/63 Chromium/axe
routes all passed. The source-link liveness audit remains separately recorded
on run [`30995803298`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30995803298),
which checked 1,064 URLs. This is automated provenance, not publication,
deployment, human review, or learner mastery evidence.

## Current non-draft full-gate checkpoint (2026-08-05, latest)

The current reviewed ref [`82a130a`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/82a130a688f9ce8e04b03bf3f1b490d337c6ec16)
passed normal non-draft Course CI run
[`31008159124`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/31008159124).
Portal quality, strict TypeScript, lint, build, content tests, 423/423 Node
apparatus tests, Python 3.12 and 3.14 teaching models, and 63/63 Chromium/axe
routes all passed. The run covers the canonical start-now learning workflow,
learner-facing Learning Partners surface, and role-prompt changes. This is
automated provenance, not publication, deployment, human review, or learner
mastery evidence.

## Current non-draft full-gate checkpoint (2026-08-05, latest)

The current reviewed ref [`208d296`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/208d296d63793814906ee218876546e7736a829b)
passed normal non-draft Course CI run
[`31009811465`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/31009811465).
Portal quality, strict TypeScript, lint, build, content tests, 423/423 Node
apparatus tests, Python 3.12 and 3.14 teaching models, and 63/63 Chromium/axe
routes all passed. The run covers the pull-request head-SHA Actions correction
and its regression test. This is automated provenance, not publication,
deployment, human review, or learner mastery evidence.

## Current review-ready successor (2026-08-05)

The current PR #22 head [`b295f0f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b295f0f353c5227143311448544aa645ebf7942c)
passed every required Course CI context in run
[`31011177833`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/31011177833).
This provenance-only successor used the explicit lightweight paths for the
unchanged Node apparatus, Python 3.12/3.14, and browser suites; the portal
structural gate still executed. The last complete full execution remains
[`208d296`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/208d296d63793814906ee218876546e7736a829b)
in run
[`31009811465`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/31009811465).
This records the current source head without claiming a second full gate,
publication, deployment, human review, or learner mastery.

## Current review-ready head after provenance reconciliation (2026-08-05)

The next additive head [`9242f79`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/9242f79d53b1ec5d4b49e0ee6b113624b2435cec)
passed every required Course CI context in run
[`31012232860`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/31012232860).
The portal structural gate executed, while Node apparatus, Python 3.12/3.14,
and browser acceptance used their explicit lightweight unchanged-suite paths.
The last complete full execution remains
[`208d296`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/208d296d63793814906ee218876546e7736a829b)
in run
[`31009811465`](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/31009811465).
This is current provenance only; it does not claim publication, deployment,
human review, or learner mastery.
