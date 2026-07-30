export type AtlasRouteEntry = {
  number: number;
  title: string;
  shortTitle: string;
  status: "published" | "in-authoring";
  prerequisiteNumbers: number[];
  purpose: string;
};

export type AtlasRoutePhase = {
  id: string;
  days: string;
  number: string;
  title: string;
  premise: string;
  gate: string;
  entries: AtlasRouteEntry[];
};

const published = "published" as const;
const inAuthoring = "in-authoring" as const;

export const atlasCoreRoute: AtlasRoutePhase[] = [
  {
    id: "claims",
    days: "Days 2–9",
    number: "I",
    title: "Execution, claims, and discrete structure",
    premise:
      "Before a system can be designed or optimized, we need a model of state, a way to make claims precise, and a way to prove or refute them.",
    gate:
      "Defend one invariant, repair one flawed proof, construct a smallest counterexample, and name the cost model of the check.",
    entries: [
      {
        number: 1,
        title: "Values, State, and Execution",
        shortTitle: "state",
        status: published,
        prerequisiteNumbers: [],
        purpose: "Model what exists and changes while Python runs.",
      },
      {
        number: 2,
        title: "Functions, Recursion, and Induction",
        shortTitle: "recursion",
        status: published,
        prerequisiteNumbers: [1],
        purpose: "Connect executable recursion to a correctness argument.",
      },
      {
        number: 3,
        title: "Abstraction, Interfaces, and Abstract Data Types",
        shortTitle: "abstraction",
        status: published,
        prerequisiteNumbers: [2],
        purpose: "Separate meaning from representation and preserve an invariant.",
      },
      {
        number: 4,
        title: "Logic, Sets, Relations, Graphs, and Proof",
        shortTitle: "logic",
        status: published,
        prerequisiteNumbers: [3],
        purpose: "Turn informal rules into claims that can be proved or tested.",
      },
      {
        number: 5,
        title: "Cost Models and Algorithm Analysis",
        shortTitle: "cost",
        status: published,
        prerequisiteNumbers: [4],
        purpose: "Make resource claims explicit before choosing an algorithm.",
      },
      {
        number: 27,
        title: "Discrete Mathematics, Proof, Counting & Structures",
        shortTitle: "proof depth",
        status: published,
        prerequisiteNumbers: [2, 4, 5],
        purpose:
          "Deepen induction, invariants, counting, recurrences, posets, matchings, and number-theoretic structure.",
      },
    ],
  },
  {
    id: "algorithms",
    days: "Days 10–17",
    number: "II",
    title: "Representation and algorithmic strategy",
    premise:
      "A representation decides which operations are cheap, which invariants are local, and which algorithmic strategy the structure permits.",
    gate:
      "Read an unfamiliar data-structure implementation, recover its invariant, compare two strategies, and defend the chosen cost/evidence boundary.",
    entries: [
      {
        number: 6,
        title: "Representation, Memory, Sequences, and Linked Structures",
        shortTitle: "representation",
        status: published,
        prerequisiteNumbers: [5],
        purpose: "Relate abstract sequence meaning to concrete storage and cost.",
      },
      {
        number: 7,
        title: "Stacks, Queues, Iteration, and Lazy Computation",
        shortTitle: "access",
        status: published,
        prerequisiteNumbers: [6],
        purpose: "Constrain access to make work, demand, and ownership visible.",
      },
      {
        number: 8,
        title: "Hashing, Dictionaries, Sets, and Indexing",
        shortTitle: "indexing",
        status: published,
        prerequisiteNumbers: [7],
        purpose: "Connect equality, hashing, probability, and lookup policy.",
      },
      {
        number: 9,
        title: "Trees, Heaps, Sorting, and Ordered Search",
        shortTitle: "order",
        status: published,
        prerequisiteNumbers: [8],
        purpose: "Use ordered structure to answer next, nearest, and priority questions.",
      },
      {
        number: 10,
        title: "Graph Algorithms and Network Models",
        shortTitle: "graphs",
        status: published,
        prerequisiteNumbers: [9],
        purpose: "Make reachability, dependency, and connectivity executable.",
      },
      {
        number: 11,
        title: "Algorithm Design Paradigms: Choosing a Strategy from Structure",
        shortTitle: "strategy",
        status: published,
        prerequisiteNumbers: [10],
        purpose: "Justify greedy, divide-and-conquer, dynamic, or search strategies from structure.",
      },
    ],
  },
  {
    id: "software",
    days: "Days 18–25",
    number: "III",
    title: "Durable software and shared data",
    premise:
      "A correct local algorithm becomes useful only when contracts, tests, changes, artifacts, and transactions preserve its meaning over time.",
    gate:
      "Trace a claim from interface through test and data boundary, diagnose one failed change, and defend a repair with regression evidence.",
    entries: [
      {
        number: 12,
        title: "Modules, APIs, Types, and Dependency Direction",
        shortTitle: "boundaries",
        status: published,
        prerequisiteNumbers: [11],
        purpose: "Control what components may know, call, and change.",
      },
      {
        number: 13,
        title: "Specifications, Testing, Debugging, and Observability",
        shortTitle: "evidence",
        status: published,
        prerequisiteNumbers: [12],
        purpose: "Turn ambiguity into testable claims and failures into regression knowledge.",
      },
      {
        number: 14,
        title: "Software Design and Change",
        shortTitle: "design",
        status: published,
        prerequisiteNumbers: [13],
        purpose: "Place likely change behind an intentional boundary.",
      },
      {
        number: 15,
        title: "Files, Serialization, Packaging, and Delivery",
        shortTitle: "artifacts",
        status: published,
        prerequisiteNumbers: [14],
        purpose: "Make boundary-crossing state explicit, compatible, and reviewable.",
      },
      {
        number: 16,
        title: "Relational Data and Transactions",
        shortTitle: "transactions",
        status: published,
        prerequisiteNumbers: [15],
        purpose: "Represent relationships and coordinate invariant-preserving changes.",
      },
    ],
  },
  {
    id: "mathematics",
    days: "Days 26–34",
    number: "IV",
    title: "Execution, numerical models, and evidence",
    premise:
      "Machine behavior, linear structure, continuous change, uncertainty, and optimization explain what a numerical, statistical, or ML claim can mean before a library call is trusted.",
    gate:
      "Derive a projection or likelihood step, identify a numerical/data assumption, reject an overclaim, and explain what evidence would change the conclusion.",
    entries: [
      {
        number: 17,
        title: "Computer Architecture and the Execution Stack",
        shortTitle: "machine",
        status: published,
        prerequisiteNumbers: [16],
        purpose: "Trace a Python-level request through the execution stack.",
      },
      {
        number: 28,
        title: "Linear Algebra, Numerical Stability & Representation",
        shortTitle: "linear algebra",
        status: published,
        prerequisiteNumbers: [17, 27],
        purpose: "Derive projection, low-rank structure, and PCA with conditioning in view.",
      },
      {
        number: 29,
        title: "Calculus, Real Analysis & Continuous Change",
        shortTitle: "calculus",
        status: published,
        prerequisiteNumbers: [27, 28],
        purpose: "Connect limits, local change, accumulation, and convergence to computational evidence.",
      },
      {
        number: 30,
        title: "Probability, Statistics & Scientific Inference",
        shortTitle: "inference",
        status: published,
        prerequisiteNumbers: [27, 29],
        purpose: "Separate randomness, estimation, uncertainty, and experimental evidence.",
      },
      {
        number: 31,
        title: "Optimization & Information",
        shortTitle: "optimization",
        status: inAuthoring,
        prerequisiteNumbers: [28, 29, 30],
        purpose: "Derive objective, constraint, convergence, and information trade-offs.",
      },
    ],
  },
  {
    id: "systems",
    days: "Days 35–44",
    number: "V",
    title: "Machine, network, and runtime boundaries",
    premise:
      "An application lives inside machines, processes, schedules, networks, and trust boundaries; each boundary changes what can be known or guaranteed.",
    gate:
      "Read a trace across at least two system layers, name an ownership/failure boundary, and reject one claim that the available observation cannot establish.",
    entries: [
      {
        number: 18,
        title: "Operating Systems and Resource Mediation",
        shortTitle: "operating systems",
        status: published,
        prerequisiteNumbers: [17],
        purpose: "Treat processes, files, memory, and interruption as controlled resources.",
      },
      {
        number: 19,
        title: "Concurrency and Parallelism",
        shortTitle: "concurrency",
        status: published,
        prerequisiteNumbers: [18],
        purpose: "Make concurrent histories, ownership, progress, and evidence explicit.",
      },
      {
        number: 20,
        title: "Networks and Application Protocols",
        shortTitle: "protocols",
        status: published,
        prerequisiteNumbers: [19],
        purpose: "Distinguish a local send from a remote, durable fact.",
      },
      {
        number: 21,
        title: "Async and Distributed Systems",
        shortTitle: "distribution",
        status: published,
        prerequisiteNumbers: [20],
        purpose: "Coordinate partial work without inventing global certainty.",
      },
      {
        number: 22,
        title: "Security, Privacy & Trust Boundaries",
        shortTitle: "trust",
        status: published,
        prerequisiteNumbers: [21],
        purpose: "Keep data, authority, provenance, and human impact distinct.",
      },
      {
        number: 23,
        title: "Programming Languages, Interpreters & Bounded Evaluation",
        shortTitle: "language",
        status: published,
        prerequisiteNumbers: [22],
        purpose: "Separate text, structure, evaluation, capability, and authority.",
      },
      {
        number: 24,
        title: "CPython, Performance & Memory Evidence",
        shortTitle: "runtime evidence",
        status: published,
        prerequisiteNumbers: [23],
        purpose: "Label interpreter facts, benchmark observations, and portable claims honestly.",
      },
    ],
  },
  {
    id: "intelligence",
    days: "Days 45–53",
    number: "VI",
    title: "Formal theory, classical AI, and learning",
    premise:
      "AI is not a single model call: it joins language, search, decision, representation, statistical assumptions, execution limits, and evidence.",
    gate:
      "Model a problem before selecting an algorithm or model; identify a theorem/model assumption, a data boundary, and a reason an apparent result might not transfer.",
    entries: [
      {
        number: 32,
        title: "Systems Languages, Scientific Python & Accelerators",
        shortTitle: "accelerators",
        status: inAuthoring,
        prerequisiteNumbers: [12, 17, 19, 24, 28, 31],
        purpose: "Connect lower-level execution, array layout, autodiff, GPU work, and reproducibility.",
      },
      {
        number: 33,
        title: "Formal Languages, Computability & Complexity",
        shortTitle: "limits",
        status: inAuthoring,
        prerequisiteNumbers: [5, 11, 23, 27],
        purpose: "Reason about what syntax, algorithms, and computation can or cannot decide.",
      },
      {
        number: 34,
        title: "Classical AI: Search, Constraints & Decision",
        shortTitle: "classical AI",
        status: inAuthoring,
        prerequisiteNumbers: [10, 11, 30, 31, 33],
        purpose: "Formulate state, search, constraints, uncertainty, and decisions before neural methods.",
      },
      {
        number: 35,
        title: "Machine Learning & Representation",
        shortTitle: "machine learning",
        status: inAuthoring,
        prerequisiteNumbers: [13, 22, 28, 30, 31, 32, 34],
        purpose: "Tie learning methods to data splits, representation, evaluation, uncertainty, and shift.",
      },
      {
        number: 36,
        title: "Statistical Learning Theory & Reliable Deep-Learning Systems",
        shortTitle: "learning theory",
        status: inAuthoring,
        prerequisiteNumbers: [29, 31, 32, 33, 35],
        purpose: "Read guarantees and limits alongside implementation and deployment evidence.",
      },
    ],
  },
  {
    id: "evidence",
    days: "Days 54–55",
    number: "VII",
    title: "Evidence and human control",
    premise:
      "A model or agent is useful only when its assumptions, authority, feedback, and uncertainty remain inspectable and challengeable by people.",
    gate:
      "Produce an evidence-and-human-control packet for an AI-assisted Atlas capability, including the claim, limitation, owner, and next falsifier.",
    entries: [
      {
        number: 25,
        title: "Evidence-Grounded Intelligent & Human-Centered Systems",
        shortTitle: "decision evidence",
        status: published,
        prerequisiteNumbers: [22, 24, 30, 31, 34, 35, 36],
        purpose: "Keep a score, suggestion, or agent proposal under human and evidence boundaries.",
      },
    ],
  },
  {
    id: "defense",
    days: "Days 56–60",
    number: "VIII",
    title: "Capstone release and oral architecture defense",
    premise:
      "A maintained release must connect mathematical argument, implementation evidence, tests, security, human impact, and a decision that can be revised.",
    gate:
      "Defend a versioned evidence bundle: claim, system trace, test/observation, human impact, limitation, rollback, and next reason to change the decision.",
    entries: [
      {
        number: 26,
        title: "Systems Capstone, Open-Source Stewardship & Oral Architecture Defense",
        shortTitle: "capstone defense",
        status: published,
        prerequisiteNumbers: [25],
        purpose: "Release and orally defend an evidence-backed system rather than a polished demo.",
      },
    ],
  },
];

export const atlasRouteEntries = atlasCoreRoute.flatMap((phase) => phase.entries);

export function getAtlasRouteEntry(number: number) {
  return atlasRouteEntries.find((entry) => entry.number === number);
}

export const atlasCoreRouteReleaseStatus: Record<
  AtlasRouteEntry["status"],
  number
> = atlasRouteEntries.reduce(
  (counts, entry) => {
    counts[entry.status] += 1;
    return counts;
  },
  { published: 0, "in-authoring": 0 },
);

export const atlasCoreRouteTotals = {
  days: 60,
  modules: 36,
  focusedHoursPerWeek: "20–25",
  consolidation: "3–12 months",
};
