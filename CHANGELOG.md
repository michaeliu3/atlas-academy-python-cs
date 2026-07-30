# Changelog

All meaningful changes are recorded here. Version labels describe verified
course/repository milestones, not claims of learner mastery or a published
GitHub Release. A GitHub Release is claimed only after its Release page is
actually published.

## Unreleased

- No unreleased course change is recorded here yet. The dependency graph must
  not be described as security-clean while the tracked transitive-advisory
  follow-up remains open.

## v0.5.1-security (private maintenance milestone)

- Published the private GitHub Release `v0.5.1-security` and refreshed the
  owner-only Atlas Academy portal as version 18 after protected-main CI
  completed successfully.
- Updated the coupled Cloudflare Vite/Wrangler toolchain, moving the affected
  Miniflare paths to patched Undici, ws, sharp, and esbuild versions where
  applicable.
- Kept the remaining Next, Drizzle, and ESLint-related transitive dependency
  paths explicitly tracked before any broader portal access. This release does
  not claim a security-clean dependency graph.

## v0.5-languages (private course milestone)

- Published the private GitHub Release `v0.5-languages` and deployed Atlas
  Academy version 17 to the owner-only course portal after protected-main CI
  completed successfully.
- Released Module 23, Programming Languages & Bounded Evaluation: a visual
  language/interpreter studio, a deliberately bounded local reference model,
  and downloadable teaching tests. It covers lexical analysis, parsing, ASTs,
  semantic contracts, environments, closures, capabilities, and explicit
  model-versus-implementation evidence boundaries.
- Recorded direct dependency security upgrades for Next, React, React DOM,
  React Server Components, ESLint-Next, and Vite. Remaining transitive
  advisories are deliberately tracked before any broader portal access; this is
  not a claim that every advisory is resolved.
- Prepared the private GitHub project remote and its CI workflow, documented
  the AI-era learning philosophy, privacy boundary, content workflow,
  architecture, roadmap, and contribution rules, and hardened the
  generated-content CI gate to include source maps and untracked artifacts.

## v0.4-systems-trust (private portal milestone)

- Private portal release through Module 22: security, privacy, trust
  boundaries, redacted evidence, and a six-view Trust Control Room.
- Modules 17–22 cover architecture, operating systems, concurrency, networks,
  distributed systems, and security/trust with source-backed local models and
  visual studios.
