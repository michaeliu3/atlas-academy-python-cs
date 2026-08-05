# Atlas Academy project spine

Atlas uses one connected implementation story rather than 36 unrelated
graduate-sized projects. The canonical registry is
`content/course/arc-projects.v1.json`; each module teaching pack binds one
narrow slice to that registry.

## Delivery shape

```text
36 narrow module slices
        ↓
six cumulative arc projects
        ↓
M26 evidence-gated local capstone
```

The designated Study Partner runs every slice through the same visible loop:

1. design brief, boundary, non-goals, and learner constraint;
2. learner prediction plus confidence;
3. architecture, data-flow, state, or proof sketch;
4. one visible incremental patch or derivation;
5. honest test, trace, numerical experiment, or proof check;
6. changed premise, failure injection, or counterexample;
7. code review, learner explanation, and evidence card.

The learner does not have to type every line. The learner does have to specify
intent, predict behavior, inspect the patch, interpret evidence, identify
assumptions, and explain the resulting mechanism.

## Six projects

| Project | Modules | Role in the connected system |
| --- | --- | --- |
| Stateful Atlas event ledger | M1–M5 | Establishes state, abstraction, proof, and cost reasoning. |
| Indexed retrieval and route planner | M6–M11 | Connects representations, data structures, graph routes, and strategy. |
| Durable evidence service | M12–M16 | Turns contracts into APIs, tests, observability, delivery, and transactions. |
| Failure-aware local protocol | M17–M22 | Carries execution through resources, concurrency, networks, partial failure, and trust. |
| Inspectable language-and-evidence assistant | M23–M26 | Connects language/runtime evidence to human-facing intelligent systems and capstone defense. |
| Mathematical and reliable-learning notebook | M27–M36 | Carries formal, numerical, optimization, theory, learning, and reliability claims with explicit assumptions. |

M26 remains an evidence-gated local capstone. Its required inputs are the six
arc projects; it is not a public release claim, a degree-equivalence claim, or
a substitute for later spaced practice.

## Session handoff

The Teaching Assistant owns the live first-principles lecture and post-module
oral defense. The Study Partner owns the visible implementation and review
loop. Both use the same module pack, so a code slice, derivation, failure case,
or unresolved boundary can move between chats without creating a third learner
workflow.
