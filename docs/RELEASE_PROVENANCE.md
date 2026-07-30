# Release provenance ledger

## Status and scope

This is an append-only evidence ledger for Atlas Academy's private release
process. It separates four different facts that must not be conflated:

1. a source commit exists in the reviewable GitHub repository;
2. a named GitHub Actions run validated that source commit;
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

## Verified candidate-validation records

These are candidate validation records, not releases. Both recorded Actions
runs completed successfully for the stated commit on the review branch.

| Source commit | Evidence changed | GitHub Actions evidence | What this establishes | What it does not establish |
| --- | --- | --- | --- | --- |
| [`e524b4050b1a95958a838156e0e1133aaad27619`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/e524b4050b1a95958a838156e0e1133aaad27619) | Deterministic, allowlisted release inputs | [Run 30565380896](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30565380896) — successful | The recorded GitHub workflow validated this source commit. | A GitHub Release, a private deployment, complete module-contract verification, or absence of security risk. |
| [`71fa30137ade8b0e4dbc37ff3851b2aaf45e9a1f`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/71fa30137ade8b0e4dbc37ff3851b2aaf45e9a1f) | Markdown and Mermaid rendering sanitization | [Run 30566642793](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30566642793) — successful | The recorded GitHub workflow validated this source commit. | A GitHub Release, a private deployment, complete accessibility review, or absence of security risk. |
| [`35236b18b464dff2c13ce897b43a3392f4a1d2ea`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/35236b18b464dff2c13ce897b43a3392f4a1d2ea) | Exact allowlisting of built teaching-download output | [Run 30567401183](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30567401183) — successful | The portal gate and Python 3.12/3.14 teaching-model jobs validated this source commit. | A GitHub Release, a private deployment, complete accessibility review, or absence of security risk. |
| [`394f20396e21b2289fe4706227c41464b83ac497`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/394f20396e21b2289fe4706227c41464b83ac497) | Advanced-bridge validation, runtime dependency candidate, keyboard fixes, and the prior provenance records | [Run 30568694668](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30568694668) — successful | The portal gate and Python 3.12/3.14 teaching-model jobs validated this source snapshot. | A GitHub Release, a private deployment, a Dependabot alert closure, complete module-contract verification, or a completed accessibility review. |

## Known limits at ledger creation

- GitHub's default branch reports six dependency alerts (four high and two
  medium). They remain open risk items pending targeted remediation or explicit
  triage; this ledger does not call the project security-clean.
- M1–M30 are recorded as legacy structural baselines, not fully
  contract-verified modules. The strict course-contract gate deliberately does
  not yet pass for them.
- M31–M36 remain authoring-only. They are not published learning material.
- The portal's private ChatGPT Sites deployment has not been verified in this
  ledger, and no GitHub Release is recorded here.
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
