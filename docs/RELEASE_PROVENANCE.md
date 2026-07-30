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

## Verified candidate-validation records

These are candidate validation records, not releases. The listed Actions checks
completed successfully and are attached to the stated source heads on the
review branch. Unless a row separately records the checked-out ref, it is not
deployment-style evidence that an artifact was built from the head commit
alone.

| Source commit | Evidence changed | GitHub Actions evidence | What this establishes | What it does not establish |
| --- | --- | --- | --- | --- |
| [`e524b4050b1a95958a838156e0e1133aaad27619`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/e524b4050b1a95958a838156e0e1133aaad27619) | Deterministic, allowlisted release inputs | [Run 30565380896](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30565380896) — successful | The recorded GitHub workflow validated this source commit. | A GitHub Release, a private deployment, complete module-contract verification, or absence of security risk. |
| [`71fa30137ade8b0e4dbc37ff3851b2aaf45e9a1f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/71fa30137ade8b0e4dbc37ff3851b2aaf45e9a1f) | Markdown and Mermaid rendering sanitization | [Run 30566642793](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30566642793) — successful | The recorded GitHub workflow validated this source commit. | A GitHub Release, a private deployment, complete accessibility review, or absence of security risk. |
| [`35236b18b464dff2c13ce897b43a3392f4a1d2ea`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/35236b18b464dff2c13ce897b43a3392f4a1d2ea) | Exact allowlisting of built teaching-download output | [Run 30567401183](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30567401183) — successful | The portal gate and Python 3.12/3.14 teaching-model jobs validated this source commit. | A GitHub Release, a private deployment, complete accessibility review, or absence of security risk. |
| [`394f20396e21b2289fe4706227c41464b83ac497`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/394f20396e21b2289fe4706227c41464b83ac497) | Advanced-bridge validation, runtime dependency candidate, keyboard fixes, and the prior provenance records | [Run 30568694668](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30568694668) — successful | The portal gate and Python 3.12/3.14 teaching-model jobs validated this source snapshot. | A GitHub Release, a private deployment, a Dependabot alert closure, complete module-contract verification, or a completed accessibility review. |
| [`906cf5e8ddf316f13b1256fa98e376bb29bd2092`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/906cf5e8ddf316f13b1256fa98e376bb29bd2092) | M31 authoring-source audit, bounded studio loading/preview truth, learner-controlled partner prompts, and draft-only M21/M27 contract-pointer pilots | [Run 30569991215](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30569991215) — successful | The portal gate and Python 3.12/3.14 teaching-model jobs validated this source snapshot. | A GitHub Release, a private deployment, M31 publication, human module review, browser accessibility acceptance, a Dependabot alert closure, or absence of security risk. |

## Recorded non-successful candidate validation

| Source commit | Evidence changed | GitHub Actions evidence | Recorded outcome | Release consequence |
| --- | --- | --- | --- | --- |
| [`a89fcae9a32dd0f9584a1b6f579ccd1f6bb3a853`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/a89fcae9a32dd0f9584a1b6f579ccd1f6bb3a853) | Linux Chromium/axe browser-acceptance harness | [Run 30571390346](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30571390346) — browser-accessibility failed; portal and Python teaching-model jobs passed | The browser job reported real contrast and keyboard-focus failures. | This commit is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. A later exact-commit Linux run must pass before a success record is added. |
| [`2a182dea3edbda1ccb52f67851c2b9de1c11be54`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/2a182dea3edbda1ccb52f67851c2b9de1c11be54) | Legacy/ahead-of-release audits, 20-probe routing, accessibility repairs, and truthful release boundaries | [Run 30576396718](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30576396718) — portal and Python 3.12/3.14 jobs passed; browser-accessibility failed. The check is attached to this head, while the pull-request workflow checked merge candidate `65060c29ccd5da250b4ed91b570786e1388a9cdf`. | Seven browser checks failed. Confirmed causes include an unlabelled GFM workbook checklist, stale diagnostic confidence selectors, ambiguous selectors over intentional text equivalents, and a trust-studio radio hit-target interaction. The failure report is retained by GitHub as an artifact; it is remediation input, not erased history. | This head/merge candidate is **not** browser-accessibility acceptance, a release candidate, deployment evidence, or a completed accessibility review. A later successful candidate must be recorded separately; it does not rewrite this failure. |

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
