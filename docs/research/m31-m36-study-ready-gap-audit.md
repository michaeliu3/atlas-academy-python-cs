# M31–M36 study-ready gap audit

**Scope:** repository evidence inspected 2026-08-01. This is a bounded
readiness audit, not a release decision. It separates permitted private,
instructor-led Codex study from portal publication or a learner-ready claim.

## What is already true

Each advanced module has a substantial six-session **authoring-only private
study pack**, an authoring delivery map, a source-research file, and a
module-specific Teaching Assistant/Study Partner companion:

- workbooks: `content/authoring/m31_optimization_information_workbook.v1.md`
  through `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md`;
- six-session maps: `content/course/contracts/authoring-delivery/m31.v1.json`
  through `m36.v1.json` (`sessions` and `forwardHandoff`);
- companion contexts: `content/course/contracts/companions/m31.v1.json`
  through `m36.v1.json`;
- source ledgers/research: `content/source-maps/module31_optimization_information_source_map.md`,
  `module31_optimization_information_source_audit.md`, and
  `module32_*` through `module36_*_source_research.md`.

The workbooks explicitly permit bounded instructor-led study in the designated
Codex chats while denying portal unlock, credit, review, release, or mastery.
That distinction is accurate; this audit found no claim that the drafts are
already published or institutionally equivalent.

## Concrete gates

| Gate | Exact evidence | Effect | Smallest next action |
| --- | --- | --- | --- |
| **Portal learner route does not exist.** | In `content/course/course-graph.v2.json`, `m31`–`m36` have `state.lifecycle: "authoring-only"`, `readerAccess: "hidden"`, `availability: "authoring-only"`, `sourceMap: null`, and `studioId: null`. `content/modules/manifest.json` has no `m31`–`m36` entry and `content/modules/` has no M31–M36 workbook. | They cannot be called portal learner-ready, used as completed portal prerequisites, or make M25/M26 available. This is an intentional publication boundary, not a defect in private guided use. | Keep the boundary. When a specific module is selected for release, create one reviewed learner candidate and only then bind its canonical source map/studio/manifest route; do not unlock all six from authoring evidence. |
| **No quality or release approval exists.** | Every M31–M36 entry in `content/course/contracts/advanced-module-contracts.v1.json` is `contractState: "authoring-only"`; its 12 learning-evidence rows are `pointer-present`, `release-provenance-ci-and-deployment-evidence` is `planned`, and all `humanReview` dimensions are `pending`. The graph release state is `unrecorded`. | The packs may support private instructor-led reading, but cannot truthfully be called reviewed, accessible, source-validated, released, or learner-ready. | Perform one human study-quality review per candidate module against its actual workbook (not just pointers), then record only the evidence actually observed. |
| **Private chat use is authored, but operational delivery has not been evidenced.** | The six workbooks name designated Codex-chat study and the companion records contain module-specific TA/SP moves. But `docs/LIVE_CODEX_LEARNING_WORKFLOW.md` says authoring-only guide content is not shipped into the reader, and `content/course/live-codex-learning-workflow.v2.json` is a generic role/whiteboard policy—not evidence that either designated live chat received or exercised an M31–M36 packet. | Do not claim that advanced chat learning, equation/code rendering, oral defense, or Notion recording has already occurred for these modules. This does **not** prevent a learner from privately starting a workbook with an explicit packet. | Run one real, learner-approved private session from one named workbook/companion in the designated chat; observe the whiteboard and record only a concise learner-controlled summary if the configured integration actually succeeds. No portal release is needed. |
| **Current source/reuse and accessible-visual checks remain future-release work.** | The source-research files label themselves research/authoring evidence and require recheck before release; the contracts leave `source-claim-correctness` and `visual-text-equivalent-quality` pending. The workbooks contain diagrams/prose alternatives and source links, but those are not a completed accessibility or source review. | Original links and explanations are suitable for private draft study, but do not prove current stable links, asset permissions, or accessible learner delivery. | At the first candidate-review milestone, recheck only the sources/assets actually used in that module and review one rendered session plus its text alternative; avoid a new cross-course metadata layer. |

## Bottom line

M31–M36 are study-capable **private drafts**, not learner-ready portal modules.
The smallest honest progression is a real designated-chat pilot for one module
and a focused candidate review for that same module. The repository should not
change its graph status, manifest, or M25/M26 gating until those independent
steps produce evidence.
