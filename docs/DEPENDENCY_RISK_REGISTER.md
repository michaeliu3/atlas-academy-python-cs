# Dependency risk register

## Scope and decision rule

This register records evidence for known dependency advisories without
equating a lockfile edit, a passing local command, or a GitHub Actions run with
an absence of security risk. It is a living, reviewable record for the private
Atlas Academy portal.

**Last examined:** 2026-07-30 (GitHub Dependabot alert API and the committed
lockfile dependency graph). **Owner:** Atlas repository maintainer. **Recheck
trigger:** before any private deployment, after a relevant upstream release,
and before closing or dismissing an alert. No alert is considered resolved
until the reviewed branch is pushed, CI passes, and GitHub has recalculated the
corresponding Dependabot alert.

The commands used to reproduce a path are:

```powershell
pnpm why postcss sharp brace-expansion esbuild --recursive
gh api repos/michaeliu3/atlas-academy-python-cs/dependabot/alerts/<number>
```

## Candidate remediation validated in CI; awaiting alert recalculation

The current working candidate updates `next` to 16.2.12 and uses the
workspace-scoped overrides below, which the regenerated lockfile resolves as
`postcss@8.5.18` and `sharp@0.35.2` specifically underneath Next:

```yaml
overrides:
  "next>postcss": 8.5.18
  "next>sharp": 0.35.2
```

This is deliberately narrow: it does not claim a global dependency upgrade.
Commit [`394f20396e21b2289fe4706227c41464b83ac497`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/394f20396e21b2289fe4706227c41464b83ac497)
was validated by successful [GitHub Actions run 30568694668](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30568694668).
The candidate will not be called resolved until the protected default branch
contains the reviewed change and GitHub has refreshed the corresponding alert
state.

| Alert | Scope | Candidate lockfile evidence | Required patched version | Candidate disposition |
| --- | --- | --- | --- | --- |
| [#38](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/38) — `GHSA-r28c-9q8g-f849` | runtime | `next@16.2.12 → postcss@8.5.18` | 8.5.18 | CI passed; await protected-default-branch merge and Dependabot refresh. |
| [#37](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/37) — `GHSA-6g55-p6wh-862q` | runtime | `next@16.2.12 → postcss@8.5.18` | 8.5.12 | CI passed; await protected-default-branch merge and Dependabot refresh. |
| [#14](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/14) — `GHSA-qx2v-qp2m-jg93` | runtime | `next@16.2.12 → postcss@8.5.18` | 8.5.10 | CI passed; await protected-default-branch merge and Dependabot refresh. |
| [#27](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/27) — `GHSA-f88m-g3jw-g9cj` | runtime | `next@16.2.12 → sharp@0.35.2` | 0.35.0 | CI passed; await protected-default-branch merge and Dependabot refresh. |

## Open, explicitly triaged paths

| Alert | Scope and path | Why it remains open | Current control and next action |
| --- | --- | --- | --- |
| [#40](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/40) — `GHSA-mh99-v99m-4gvg` | development: `eslint@9.39.4` / Next lint plugins → `minimatch@3.1.5` → `brace-expansion@1.1.16` | The advisory's only patched line is `brace-expansion@5.0.8`. Version 5 exports an object with `expand`, while `minimatch@3` requires a callable function; a forced substitution would break the existing lint toolchain. The current supported Next lint plugin stack accepts ESLint through major 9, not ESLint 10. | Do not feed untrusted glob patterns to development tooling. Keep the portal deployment separate from local lint tooling. Recheck compatible upstream versions of the Next/ESLint plugin chain before any alert dismissal; use an isolated compatibility test before a major ESLint/minimatch migration. |
| [#13](https://github.com/michaeliu3/atlas-academy-python-cs/security/dependabot/13) — `GHSA-67mh-4wv8-2f99` | development: `drizzle-kit@0.31.10` → `@esbuild-kit/esm-loader@2.6.5` → `@esbuild-kit/core-utils@3.3.2` → `esbuild@0.18.20` | The top-level Drizzle package also resolves patched `esbuild@0.25.12`, but its legacy loader retains the vulnerable nested copy. A blanket nested override has not been compatibility-validated and must not be represented as a fix. | Run database-generation tooling only locally with maintainer-controlled schema/configuration, not as an internet-exposed development server. Recheck the Drizzle/loader chain for an upstream removal or patched release, then add a targeted compatibility test before changing the nested resolver. |

## Limits

- "Development" describes dependency placement, not a proof that a process is
  harmless or unreachable. It narrows the release surface but does not erase
  risk.
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
