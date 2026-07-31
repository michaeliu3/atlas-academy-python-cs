# Atlas Academy — Python & Computer Science

Atlas Academy is an interactive, evidence-led learning system for progressing
from intermediate Python to advanced software and computer-science reasoning.
It is built around one cumulative application—**Atlas**, a learning and
knowledge system—and one AI-era principle:

> Code generation is cheap. Understanding the system, specifying the work,
> reviewing the patch, testing the claim, and defending the decision remain
> human responsibilities.

The course is not a playlist of language features. It is a dependency-ordered
path through computation, representation, data structures, algorithms,
reliable software, persistence, machines, operating systems, concurrency,
networks, security, programming languages, runtimes, intelligent systems, and
a defended capstone.

## Learner experience

The deployed portal is the general learner interface for independent reading and
interactive course work. It contains:

- accessible, responsive HTML workbooks and visual studios;
- prediction-before-reveal investigations and confidence-aware diagnostics;
- diagrams, state traces, architecture maps, code-reading labs, and
  first-principles explanations;
- downloadable local-only Python teaching models and behavioral tests;
- cumulative Atlas projects, TA checkoffs, Study Partner routines,
  conversational oral defenses, and retrieval schedules.

The deployed [Learning Partners](/learning-partners) page provides separate,
copyable startup packages for a Teaching Assistant and a Study Partner. The
learner's designated, voice-enabled Codex chats are the primary guided-learning
surface: the TA repairs models and conducts supportive oral defenses; the Study
Partner runs live Socratic retrieval/rehearsal rounds. Neither role assigns a
pass/fail verdict. Atlas does not control platform voice, microphone access,
rendering, or transcript retention. In the two learner-designated chats with a
configured private record, the role handoff authorizes an automatic concise
structured note per substantive session; portable copied prompts remain local,
and a successful write is not claimed without direct evidence. The portal
itself remains local-first. Set up each role once from Learning Partners, then copy the
current Core-open module's graph-bound follow-on context from its oral-defense
panel. That packet supports a conversation but is not route progression,
contract review, or a platform capability claim. See [the live Codex learning
workflow](docs/LIVE_CODEX_LEARNING_WORKFLOW.md).

The course privileges reading unfamiliar code, modelling, debugging,
architectural reasoning, reviewing AI-generated changes, and evidence over
rote typing or exam drill.

## 60-day Atlas Core: intended route and release status

The adjustable Atlas Core targets 20–25 focused hours a week over 60 calendar
days. It is a rigorous connected first pass, not a claim of instant durable
mastery. The learner route has **36 defined modules**. Of those, **30 are
reader-visible**: **28 are Core-open** with full reader access, and **2 are
reader-visible reference previews** (M25/M26). The remaining **6 are
authoring-only** and hidden from the learner reader. The 30 learner-material-
ready modules are all `legacy-baseline` contracts; **zero modules are
contract-verified**. The checked-in [canonical v2 course graph](content/course/course-graph.v2.json)
is authoritative for route order, academic prerequisites, reader access, route
availability, contract state, release state, and generated projections.

Reader access is not learner completion. In particular, M25/M26 are reference
previews: they can be read, but earn no Core credit or synthesis/capstone
evidence. Likewise, `published` route availability does not imply a verified
contract, a recorded deployment, or universal mastery.

The table below is the **intended full canonical order**, not a claim that
every scheduled module is available today. The access-aware [60-, 90-, and
180-day learner route plans](docs/LEARNER_ROUTE_PLANS.md) explain the current
Core-open path, pace selector, bridge and catch-up rules, minimum evidence,
and the authoring/preview boundary.

The intended Core experience ends each module with a short constructive oral
defense: a designated voice-enabled Teaching Assistant chat is the preferred
platform surface when available, with an equivalent text route. The visible
chat must retain readable equations, code, and prose fallbacks. It evaluates
models, reasoning, boundaries, transfer, and reflection—not speech speed or a
scripted performance. The every-module oral-defense implementation and human
review remain part of the legacy-contract gap; preview and authoring-only
modules earn no Core credit.

| Days | Focus |
|---|---|
| 1 | Module 0 placement diagnostic and learning contract |
| 2–9 | M1–M5 plus published M27 discrete-mathematics depth |
| 10–17 | M6–M11 data structures and algorithmic strategy |
| 18–25 | M12–M16 durable software, data, and transactions |
| 26–34 | M17 plus published M28 linear algebra/stability, M29 calculus/analysis, and M30 probability/statistics/scientific inference, then M31 optimization/information (M31 in authoring) |
| 35–44 | M18–M24 operating, network, trust, language, and runtime boundaries |
| 45–53 | M32–M36 accelerators, formal limits, classical AI, ML, and learning theory (in authoring) |
| 54–55 | M25 evidence-grounded, human-centered intelligent systems (reader-visible reference preview; no Core credit until M31–M36 evidence exists) |
| 56–60 | M26 capstone orientation and oral-architecture-defense rehearsal (reader-visible reference preview; no Core credit until M25 becomes Core-open) |

The schedule adapts to diagnostic evidence, difficult concepts, project
revision, and retrieval needs. At the lower end of the weekly time budget, or
after a missed gate, the calendar expands rather than dropping proof, tracing,
or transfer work. A further 3–12 months of spaced retrieval, project revision,
and specialization turns first-pass readiness into dependable mastery. See the
in-product [60-day route](/route) for prerequisites and publication status.

## Local development

Prerequisite: Node.js 22.13 or later and pnpm 11.

~~~text
pnpm install --frozen-lockfile
pnpm dev
~~~

The module sync runs before development and builds the rendered library from
the available canonical course source. In a standalone clone, checked-in
generated module content remains the fallback.

## Quality gates

~~~text
pnpm sync:modules
pnpm validate:course:inputs
pnpm check:generated
pnpm types:worker
pnpm typecheck
pnpm lint
pnpm validate:performance-budget
pnpm test
pnpm test:browser
python -m unittest discover -s public/downloads -p "test_module*_reference.py"
~~~

The Node test command builds the production portal and exercises diagnostic and
rendered HTML contracts. The Python suite exercises deterministic, local-only
teaching models. No model should perform network, filesystem, process,
database, package, credential, or arbitrary-code operations.

`pnpm test:browser` is the focused Chromium/axe acceptance gate. Only a
successful, recorded GitHub Linux run for the exact source commit is release
evidence for it; see
[browser acceptance](docs/BROWSER_ACCESSIBILITY_ACCEPTANCE.md) for its exact
scope and the version-pinned Windows static-asset compatibility patch.

`pnpm validate:performance-budget` inspects the production build's emitted
client assets and manifest boundaries. It enforces raw-byte limits for the
client assets, browser-entry static closure, and named code-split studios; it
does not make a network-speed or real-user-performance claim. See [client
performance budget](docs/CLIENT_PERFORMANCE_BUDGET.md) for the exact measured
and unmeasured scope.

`worker-configuration.d.ts` is generated from the checked-in `wrangler.jsonc`
binding contract and must remain fresh. The type configuration is not evidence
of a hosting deployment; see Deployment for the separate release boundary.

## Deployment truth

Atlas Academy is currently deployed as a private ChatGPT Sites application.
The portal is a Vinext application with worker/server output; it is **not**
currently a GitHub Pages site. The `github` remote is configured for a private
GitHub project and GitHub Actions is the intended CI gate. The `origin` remote
is the existing private ChatGPT Sites deployment remote. They are deliberately
separate: a push to GitHub does not deploy the portal, and a portal deployment
is not evidence of a GitHub CI run or GitHub Release. GitHub Pages will be
considered only after a fully static build, learner-data review, and deployment
evidence exist.

See [Deployment](docs/DEPLOYMENT.md) for the two-remote release boundary and
[Architecture](docs/ARCHITECTURE.md) for the content/runtime flow.

## Repository guide

- `app/` — visual portal, readers, and interactive studios.
- `content/modules/` and `content/source-maps/` — checked-in,
  release-canonical learner workbooks and source maps.
- `public/downloads/` — checked-in local reference models and behavioral
  tests.
- `scripts/` — deterministic content synchronization.
- `tests/` — portal/diagnostic tests.
- `docs/` — architecture, authorship, privacy, deployment, and source policy.
- `ROADMAP.md` — remaining course and release milestones.

## Privacy, sources, and contribution

This repository intentionally excludes Notion records, learner progress,
credentials, external deployment tokens, embedded runtimes, and build output.
See [Privacy](docs/PRIVACY.md), [Source and license policy](LICENSES.md), and
[Contributing](CONTRIBUTING.md).

For learner-owned notes, use the [manual learning record kit](docs/LEARNER_RECORD_WORKFLOW.md).
It provides copy/paste templates and a consent boundary; it is not a live
Notion connection or an automatic export path.

The visual portal is private by default. Do not make learner records, Notion
exports, personal diagnostics, or deployment credentials public.
