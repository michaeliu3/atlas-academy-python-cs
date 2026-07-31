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

The current review path is [`agent/60-day-route`](https://github.com/michaeliu3/atlas-academy-python-cs/tree/agent/60-day-route), with
[pull request #21](https://github.com/michaeliu3/atlas-academy-python-cs/pull/21)
as the source-review record.

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
can support release evidence, a trusted, default-branch-controlled, read-only
observer must independently fetch the run and jobs, retain the observed run
attempt, and avoid checkout, execution, cache, or artifact use from untrusted
pull-request code.

### Prospective default-branch metadata observer

`.github/workflows/observe-course-ci-metadata.yml` is a deliberately
read-only, metadata-only observer. GitHub runs a `workflow_run` workflow only
after its file exists on the default branch, so the version on this review
branch is prospective until it is merged there. It has only `actions: read`,
uses one immutable `actions/github-script` revision, and makes attempt-specific
read requests for the Course CI run and its jobs. It neither checks out nor
executes candidate code, and does not touch caches, artifacts, deployments,
commit statuses, pull-request state, or secrets.

For a successful same-repository pull-request run, it emits a compact
**source-head-attached CI metadata observation** to its own log after binding
the run ID, run attempt, source head, workflow identity, and required jobs.
It does not prove the generated merge ref that Course CI executed, that the
candidate workflow body matched the policy's source digest, a GitHub Release,
human review, deployment, or learner readiness. Those missing links require a
separate, reviewed evidence design. This follows GitHub's guidance that a
privileged `workflow_run` must not check out untrusted pull-request code or
trust inputs from the preceding run.

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

## Recorded non-successful candidate validation

| Source commit | Evidence changed | GitHub Actions evidence | Recorded outcome | Release consequence |
| --- | --- | --- | --- | --- |
| [`a89fcae9a32dd0f9584a1b6f579ccd1f6bb3a853`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/a89fcae9a32dd0f9584a1b6f579ccd1f6bb3a853) | Linux Chromium/axe browser-acceptance harness | [Run 30571390346](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30571390346) — browser-accessibility failed; portal and Python teaching-model jobs passed | The browser job reported real contrast and keyboard-focus failures. | This commit is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. A later exact-commit Linux run must pass before a success record is added. |
| [`2a182dea3edbda1ccb52f67851c2b9de1c11be54`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/2a182dea3edbda1ccb52f67851c2b9de1c11be54) | Legacy/ahead-of-release audits, 20-probe routing, accessibility repairs, and truthful release boundaries | [Run 30576396718](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30576396718) — portal and Python 3.12/3.14 jobs passed; browser-accessibility failed. The check is attached to this head, while the pull-request workflow checked merge candidate `65060c29ccd5da250b4ed91b570786e1388a9cdf`. | Seven browser checks failed. Confirmed causes include an unlabelled GFM workbook checklist, stale diagnostic confidence selectors, ambiguous selectors over intentional text equivalents, and a trust-studio radio hit-target interaction. The failure report is retained by GitHub as an artifact; it is remediation input, not erased history. | This head/merge candidate is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. A later successful candidate must be recorded separately; it does not rewrite this failure. |
| [`2f2bd430764c9caf6ac01ddf88b5ca4d33972aee`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/2f2bd430764c9caf6ac01ddf88b5ca4d33972aee) | Browser-accessibility remediation for checklist labels, native-radio hit targets, and scoped studio selectors | [Run 30578320310](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30578320310) — portal and Python 3.12/3.14 jobs passed; browser-accessibility failed. GitHub records this pull-request run against the stated source head. | Four browser checks failed: the M30 axe scan found a low-contrast inactive tab label and an empty table header; the completed diagnostic used a fragile native-radio pointer path; and M22/M30 post-reveal assertions kept obsolete accessible names. The failure artifact is retained as remediation input. | This source head is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. Its successor must pass and be recorded separately; it does not rewrite this failure. |
| [`92520298c0f32c5f49114edaaa0211c20f73f590`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/92520298c0f32c5f49114edaaa0211c20f73f590) | M30 contrast/table semantics, keyboard-oriented diagnostic checks, and prior-candidate provenance | [Run 30579604454](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30579604454) — portal and Python 3.12/3.14 jobs passed; browser-accessibility failed. GitHub records this pull-request run against the stated source head. | One browser check failed: the diagnostic prerequisite note rendered `#66706a` on `#f3dfc5` at 3.95:1. The browser report is retained as remediation input; it exposed a real reading-contrast defect that prior route coverage had not exercised. | This source head is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. Its successor must pass and be recorded separately; it does not rewrite this failure. |
| [`2d898ae65e62919f67a3d829e68d8c729553c4b6`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/2d898ae65e62919f67a3d829e68d8c729553c4b6) | Diagnostic prerequisite contrast token and static contrast regression | [Run 30580493280](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30580493280) — portal and Python 3.12/3.14 jobs passed; browser-accessibility failed. The pull-request workflow checked merge candidate `6f088ea` containing this source head. | One browser check failed. Axe still observed muted `#66706a` on the saffron prerequisite surface and the plum future-extension surface (3.95:1 and 3.97:1). The report showed that the token declaration did not overcome the more-specific `p:last-child` muted rule; both affected notes remain remediation input. | This source head/merge candidate is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. Its successor must pass and be recorded separately; it does not rewrite this failure. |
| [`df921b731fe165b3d5269e7837a96af6779ab903`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/df921b731fe165b3d5269e7837a96af6779ab903) | M31 lifecycle-aware authoring-only contract gate | [Run 30584962826](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30584962826) — portal quality gate and Python 3.12/3.14 teaching-model jobs passed; browser-accessibility failed. The pull-request workflow checked merge candidate [`17c37120c28cdcbaef49d5978adadc2d40c349c0`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/17c37120c28cdcbaef49d5978adadc2d40c349c0). | The browser job passed 15 targeted checks and failed the completed-diagnostic keyboard-radio assertion: after focus and Space, the selected radio remained unchecked in both logged attempts. GitHub retained `playwright-browser-accessibility-report` artifact `8776239948` as remediation evidence; the log does not by itself establish root cause. | This source head/merge candidate is **not** browser-accessibility acceptance, a release, private-deployment evidence, M31 publication, a completed accessibility review, or course-completion evidence. A later successful candidate must be recorded separately and does not rewrite this failure. |

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

## Required evidence before recording a private release

For a deployable candidate, record the exact immutable commit SHA, reviewable
GitHub ref/PR, GitHub Actions run URL and conclusion, release-input ledger
state, known limitations, and—only after it actually occurs—the private
deployment version and verification result. If a GitHub Release is intended,
also record its existing tag and release URL. Never fill a field from an
assumption, a configured remote, or a local command alone.
