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

The deployed portal is the primary learner interface. It contains:

- accessible, responsive HTML workbooks and visual studios;
- prediction-before-reveal investigations and confidence-aware diagnostics;
- diagrams, state traces, architecture maps, code-reading labs, and
  first-principles explanations;
- downloadable local-only Python teaching models and behavioral tests;
- cumulative Atlas projects, TA checkoffs, Study Partner routines, and
  retrieval schedules.

The course privileges reading unfamiliar code, modelling, debugging,
architectural reasoning, reviewing AI-generated changes, and evidence over
rote typing or exam drill.

## 45-day intensive first pass

The adjustable intensive route targets 20–25 focused hours a week over roughly
45 days. It is a rigorous connected first pass, not a claim of instant durable
mastery.

| Days | Focus |
|---|---|
| 1–8 | placement; Python execution, abstraction, proof, and cost |
| 9–16 | data structures, algorithms, graphs, and optimization |
| 17–25 | tests, architecture, packaging, persistence, databases, and transactions |
| 26–34 | architecture, OS, concurrency, networking, distributed systems, and trust |
| 35–40 | languages, interpreters, CPython/runtime, performance, memory, and AI-era judgment |
| 41–45 | human-centered Atlas feature, capstone review, red-team critique, and defense |

The schedule adapts to diagnostic evidence, difficult concepts, project
revision, and retrieval needs. A further 8–12 weeks of spaced retrieval and
transfer work is planned for dependable mastery.

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
pnpm lint
pnpm test
python -m unittest discover -s public/downloads -p "test_module*_reference.py"
~~~

The Node test command builds the production portal and exercises diagnostic and
rendered HTML contracts. The Python suite exercises deterministic, local-only
teaching models. No model should perform network, filesystem, process,
database, package, credential, or arbitrary-code operations.

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

The visual portal is private by default. Do not make learner records, Notion
exports, personal diagnostics, or deployment credentials public.
