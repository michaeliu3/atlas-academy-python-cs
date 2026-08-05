# Dependency risk register

## Scope and decision rule

This register records evidence for known dependency advisories without
equating a lockfile edit, a passing local command, or a GitHub Actions run with
an absence of security risk. It is a living, reviewable record for the private
Atlas Academy portal.

**Last examined:** 2026-08-05 (authenticated live GitHub Dependabot API, the
default and review-branch lockfile graphs, and local production/full audits).
The live API readback for protected default branch `main` at
`33fadbd49b0e33900f21aba06ed40845c3cbd641` returned **11 open alerts** (five
high, six medium). That branch still resolves `next@16.2.11 → postcss@8.4.31`
and `sharp@0.34.5`.
The review branch for draft [PR #22](https://github.com/michaeliu3/atlas-academy-python-cs/pull/22)
resolves `next@16.2.12 → postcss@8.5.24` and `sharp@0.35.2`, beyond the
alerts' first patched versions. `pnpm audit --prod --json` now exits zero on
the review-candidate lockfile. The full local audit still exits nonzero with
one high and five moderate **development-tooling** findings, triaged below.
These are candidate remediations only until a normal reviewed merge reaches
`main` and Dependabot recalculates. The API inventory below is authoritative for
the current matrix count; a clean production audit does not close alerts or
erase the separate development path. The feature-branch push on this date also
printed a GitHub summary of 12 vulnerabilities (six high, six moderate), which
does not match the authenticated 11-alert API readback; the discrepancy is
recorded rather than silently normalized and must be rechecked before release.
**Owner:** Atlas repository maintainer. **Recheck trigger:** before any private
deployment, after a relevant upstream release, and before closing or dismissing
an alert. No alert is considered resolved until the reviewed branch is pushed,
CI passes, the protected default branch contains the change, and GitHub has
recalculated the corresponding Dependabot alert.

The commands used to reproduce a path are:

```powershell
pnpm why postcss sharp brace-expansion esbuild --recursive
gh api repos/michaeliu3/atlas-academy-python-cs/dependabot/alerts/<number>
gh api "repos/michaeliu3/atlas-academy-python-cs/dependabot/alerts?state=open&per_page=100"
```

## Current live API inventory (2026-08-04)

The authenticated `state=open` readback returned the following 11 alert
records. Severity and scope are GitHub's current fields; they are not a claim
that every development path is reachable from the shipped portal.

| Alert | Severity | Package | Scope |
| --- | --- | --- | --- |
| [#46](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/46) — `GHSA-rgw5-rvv9-x895` | high | `brace-expansion` | development |
| [#45](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/45) — `GHSA-m8rv-5g2x-5cg5` | medium | `undici` | development |
| [#44](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/44) — `GHSA-v3r7-h72x-cjcm` | medium | `undici` | development |
| [#43](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/43) — `GHSA-jr45-8vmc-qm54` | medium | `undici` | development |
| [#42](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/42) — `GHSA-8xcm-r25x-g524` | medium | `undici` | development |
| [#41](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/41) — `GHSA-4cwx-7wf7-3272` | high | `undici` | development |
| [#38](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/38) — `GHSA-r28c-9q8g-f849` | high | `postcss` | runtime |
| [#37](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/37) — `GHSA-6g55-p6wh-862q` | high | `postcss` | runtime |
| [#27](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/27) — `GHSA-f88m-g3jw-g9cj` | high | `sharp` | runtime |
| [#14](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/14) — `GHSA-qx2v-qp2m-jg93` | medium | `postcss` | runtime |
| [#13](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/13) — `GHSA-67mh-4wv8-2f99` | medium | `esbuild` | development |

## Live API refresh — 2026-08-05

An authenticated readback of the protected default branch at
`33fadbd49b0e33900f21aba06ed40845c3cbd641` returned the same **11 open
alerts**: five high and six medium. The package, advisory, and scope inventory
matches the 2026-08-04 table above; no alert is called resolved by this
unchanged readback. The separate GitHub push summary still reports 12
vulnerabilities (six high, six moderate), so that presentation discrepancy
remains recorded rather than normalized. Candidate lockfile fixes remain
unmerged and must be rechecked after a normal merge to `main`.

## Patched runtime paths; Dependabot reconciliation outstanding

The current branch updates `next` to 16.2.12 and uses workspace-scoped
overrides. Its regenerated lockfile resolves `postcss@8.5.24` and
`sharp@0.35.2` specifically underneath Next; it also keeps compatible
development-only patch fixes inside their declared dependency families:

```yaml
overrides:
  "next>postcss": 8.5.24
  "next>sharp": 0.35.2
  "minimatch@3>brace-expansion": 1.1.18
  "minimatch@10>brace-expansion": 5.0.9
  "ajv>fast-uri": 3.1.5
```

These are deliberately narrow: they do not claim a global dependency upgrade
or a GitHub alert closure. `pnpm audit --prod --json` returned zero current
branch findings on 2026-08-04; the full audit retains the separate
Drizzle/esbuild and Miniflare/Undici paths documented below. No direct `postcss().process` call over
user-provided CSS, direct `sharp` call, or untrusted-image intake route was
found in the checked-in portal on that review. Those reachability observations
narrow the current portal model but do not close an advisory or establish
deployment safety. `pnpm lint` passed after the brace-expansion override.
Commit [`deaf85c4b7922e7e945a1c4415cf078a12de8fef`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/deaf85c4b7922e7e945a1c4415cf078a12de8fef)
introduced the scoped runtime-remediation candidate. Its later descendant
[`394f20396e21b2289fe4706227c41464b83ac497`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/394f20396e21b2289fe4706227c41464b83ac497)
was validated by successful [GitHub Actions run 30568694668](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30568694668).
The source-change commit and later CI source head are deliberately distinct.
The protected default branch does **not** yet have the candidate PostCSS/sharp
resolutions. The four runtime alerts will not be called resolved until the
reviewed remediation is normally merged to `main` and GitHub has refreshed or
otherwise reconciled each corresponding alert state.

| Alert | Scope | Candidate lockfile evidence | Required patched version | Candidate disposition |
| --- | --- | --- | --- | --- |
| [#38](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/38) — `GHSA-r28c-9q8g-f849` | runtime | review `next@16.2.12 → postcss@8.5.24`; default `next@16.2.11 → postcss@8.4.31` | 8.5.18 | Candidate lock path is patched; alert remains open until normal merge and Dependabot refresh on `main`. |
| [#37](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/37) — `GHSA-6g55-p6wh-862q` | runtime | review `next@16.2.12 → postcss@8.5.24`; default `next@16.2.11 → postcss@8.4.31` | 8.5.12 | Candidate lock path is patched; alert remains open until normal merge and Dependabot refresh on `main`. |
| [#14](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/14) — `GHSA-qx2v-qp2m-jg93` | runtime | review `next@16.2.12 → postcss@8.5.24`; default `next@16.2.11 → postcss@8.4.31` | 8.5.10 | Candidate lock path is patched; alert remains open until normal merge and Dependabot refresh on `main`. |
| [#27](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/27) — `GHSA-f88m-g3jw-g9cj` | runtime | review `sharp@0.35.2`; default `sharp@0.34.5` | 0.35.0 | Candidate lock path is patched; alert remains open until normal merge and Dependabot refresh on `main`. |

## Withdrawn alert record

On 2026-07-31, a direct authenticated `gh api` read of Dependabot alert
[#40](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/40)
for `GHSA-mh99-v99m-4gvg` returned `Alert number 40 has been withdrawn` (HTTP
404). The live default-branch alert list therefore contains five entries, not
six. The scoped development lockfile path is still
`eslint@9.39.4 → minimatch@3.1.5 → brace-expansion@1.1.18`, after the current
compatible override repair. Withdrawal does **not** establish why the
alert was withdrawn, a protected-branch merge, a deployment result, a GitHub
alert closure for another path, or a security-clean state.

## Open, explicitly triaged paths

| Alert | Scope and path | Why it remains open | Current control and next action |
| --- | --- | --- | --- |
| [#13](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/13) — `GHSA-67mh-4wv8-2f99` | development: `drizzle-kit@0.31.10` → `@esbuild-kit/esm-loader@2.6.5` → `@esbuild-kit/core-utils@3.3.2` → `esbuild@0.18.20` | The top-level Drizzle package also resolves patched `esbuild@0.25.12`, but its legacy loader retains the vulnerable nested copy. No repository `esbuild` serve/context API use was found; the path is limited to maintainer-local `pnpm db:generate`. A blanket nested override would violate its declared range and has not been compatibility-validated, so it must not be represented as a fix. | Run database-generation tooling only locally with maintainer-controlled schema/configuration, not as an internet-exposed development server. `pnpm db:generate` completed against the empty intentional schema with no migration output on 2026-07-31. Recheck the Drizzle/loader chain for an upstream removal or patched release, then add a targeted compatibility test before changing the nested resolver. |
| Local full-audit `GHSA-4cwx-7wf7-3272` (high) plus `GHSA-8xcm-r25x-g524`, `GHSA-m8rv-5g2x-5cg5`, `GHSA-jr45-8vmc-qm54`, and `GHSA-v3r7-h72x-cjcm` (moderate) | development: `@cloudflare/vite-plugin` / `wrangler` → `miniflare@4.20260722.1` → exact `undici@7.28.0` | The current Miniflare package pins `undici@7.28.0`; the audit requires `>=7.29.0`. An override would violate that exact upstream pin and has not been compatibility-tested. This is used by local Worker tooling, not a shipped portal runtime, but development placement is not a proof of harmlessness. | Do not run an exposed Miniflare development server on untrusted origins. Track a compatible Cloudflare/Miniflare release or validate a targeted upstream upgrade before changing the exact resolver. Recheck before any Worker-based deployment. |

## Limits

- "Development" describes dependency placement, not a proof that a process is
  harmless or unreachable. It narrows the release surface but does not erase
  risk.
- A clean production audit and a passing local lint run do not prove an absence
  of security risk, CI success, protected-branch merge, or Dependabot closure.
- `pnpm peers check` also reports unmet optional peers `@emnapi/core` and
  `@emnapi/runtime` (installed 1.10.0; `@napi-rs/wasm-runtime@1.2.0` requests
  a `^2.0.0-alpha.3` range). This is a compatibility observation, not a
  Dependabot closure or a proven exploit path; retain it when reviewing future
  lockfile changes.
- The candidate remediation does not verify a private deployment, production
  headers, or a GitHub Release.
- This repository must not be described as **security-clean** while open
  development paths remain or while candidate alert closures are awaiting GitHub
  verification.
