# Dependency risk register

## Scope and decision rule

This register records evidence for known dependency advisories without
equating a lockfile edit, a passing local command, or a GitHub Actions run with
an absence of security risk. It is a living, reviewable record for the private
Atlas Academy portal.

**Last examined:** 2026-08-01 (GitHub Dependabot alert API recheck and the
committed lockfile dependency graph). The live API again reported five open
alerts on protected default branch `main` at `33fadbd` (three high, two
medium). The push notice still reported six (four high, two moderate), so it
is treated as stale or otherwise not yet reconciled rather than as
authoritative current state.
**Owner:** Atlas repository maintainer. **Recheck trigger:** before any private
deployment, after a relevant upstream release, and before closing or dismissing
an alert. No alert is considered resolved until the reviewed branch is pushed,
CI passes, the protected default branch contains the change, and GitHub has
recalculated the corresponding Dependabot alert.

The commands used to reproduce a path are:

```powershell
pnpm why postcss sharp brace-expansion esbuild --recursive
gh api repos/michaeliu3/atlas-academy-python-cs/dependabot/alerts/<number>
```

## Candidate remediation; awaiting protected-default-branch alert recalculation

The current branch updates `next` to 16.2.12 and uses workspace-scoped
overrides. Its regenerated lockfile resolves `postcss@8.5.18` and
`sharp@0.35.2` specifically underneath Next, and `brace-expansion@1.1.17`
only beneath `minimatch@3`:

```yaml
overrides:
  "next>postcss": 8.5.18
  "next>sharp": 0.35.2
  "minimatch@3>brace-expansion": 1.1.17
```

These are deliberately narrow: they do not claim a global dependency upgrade
or a GitHub alert closure. `pnpm audit --prod --json` returned zero current
branch findings; the full audit retained the separate Drizzle/esbuild path
documented below. `pnpm lint` passed after the brace-expansion override.
Commit [`deaf85c4b7922e7e945a1c4415cf078a12de8fef`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/deaf85c4b7922e7e945a1c4415cf078a12de8fef)
introduced the scoped runtime-remediation candidate. Its later descendant
[`394f20396e21b2289fe4706227c41464b83ac497`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/394f20396e21b2289fe4706227c41464b83ac497)
was validated by successful [GitHub Actions run 30568694668](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30568694668).
The source-change commit and later CI source head are deliberately distinct.
The four runtime candidates will not be called resolved until the protected
default branch contains the reviewed change and GitHub has refreshed each
corresponding alert state.

| Alert | Scope | Candidate lockfile evidence | Required patched version | Candidate disposition |
| --- | --- | --- | --- | --- |
| [#38](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/38) — `GHSA-r28c-9q8g-f849` | runtime | `next@16.2.12 → postcss@8.5.18` | 8.5.18 | CI passed; await protected-default-branch merge and Dependabot refresh. |
| [#37](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/37) — `GHSA-6g55-p6wh-862q` | runtime | `next@16.2.12 → postcss@8.5.18` | 8.5.12 | CI passed; await protected-default-branch merge and Dependabot refresh. |
| [#14](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/14) — `GHSA-qx2v-qp2m-jg93` | runtime | `next@16.2.12 → postcss@8.5.18` | 8.5.10 | CI passed; await protected-default-branch merge and Dependabot refresh. |
| [#27](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/27) — `GHSA-f88m-g3jw-g9cj` | runtime | `next@16.2.12 → sharp@0.35.2` | 0.35.0 | CI passed; await protected-default-branch merge and Dependabot refresh. |

## Withdrawn alert record

On 2026-07-31, a direct authenticated `gh api` read of Dependabot alert
[#40](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/40)
for `GHSA-mh99-v99m-4gvg` returned `Alert number 40 has been withdrawn` (HTTP
404). The live default-branch alert list therefore contains five entries, not
six. The scoped development lockfile path is still
`eslint@9.39.4 → minimatch@3.1.5 → brace-expansion@1.1.17`, and its local
audit/lint evidence remains useful. Withdrawal does **not** establish why the
alert was withdrawn, a protected-branch merge, a deployment result, a GitHub
alert closure for another path, or a security-clean state.

## Open, explicitly triaged paths

| Alert | Scope and path | Why it remains open | Current control and next action |
| --- | --- | --- | --- |
| [#13](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/13) — `GHSA-67mh-4wv8-2f99` | development: `drizzle-kit@0.31.10` → `@esbuild-kit/esm-loader@2.6.5` → `@esbuild-kit/core-utils@3.3.2` → `esbuild@0.18.20` | The top-level Drizzle package also resolves patched `esbuild@0.25.12`, but its legacy loader retains the vulnerable nested copy. A blanket nested override has not been compatibility-validated and must not be represented as a fix. | Run database-generation tooling only locally with maintainer-controlled schema/configuration, not as an internet-exposed development server. `pnpm db:generate` completed against the empty intentional schema with no migration output on 2026-07-31. Recheck the Drizzle/loader chain for an upstream removal or patched release, then add a targeted compatibility test before changing the nested resolver. |

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
- This repository must not be described as **security-clean** while either
  open path remains or while candidate alert closures are awaiting GitHub
  verification.
