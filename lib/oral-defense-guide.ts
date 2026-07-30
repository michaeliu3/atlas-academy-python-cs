export type OralDefenseLens = "code" | "formal" | "systems" | "evidence";

export type OralDefenseGuide = {
  lens: OralDefenseLens;
  centralModel: string;
  traceOrDerivation: string;
  misconception: string;
  boundary: string;
  transfer: string;
};

const fallbackGuide: OralDefenseGuide = {
  lens: "evidence",
  centralModel: "the module's central representation, invariant, or decision boundary",
  traceOrDerivation: "trace one mechanism and state the assumption that makes each step legal",
  misconception: "a plausible shortcut that confuses an example, output, or polished explanation with evidence",
  boundary: "what the available model, contract, or observation does not establish",
  transfer: "a new Atlas situation where the same reasoning changes a design choice",
};

export const oralDefenseGuides: Record<number, OralDefenseGuide> = {
  1: {
    lens: "code",
    centralModel: "bindings, object identity, mutation, and frame-local state",
    traceOrDerivation: "predict an aliasing or mutation trace before seeing the result",
    misconception: "assignment copies an object or a function can only change its own local names",
    boundary: "which behavior follows from Python's data model versus a CPython implementation detail",
    transfer: "debugging a shared configuration object without adding defensive copies blindly",
  },
  2: {
    lens: "formal",
    centralModel: "a recursive contract joined to its base case, inductive step, and termination measure",
    traceOrDerivation: "reconstruct a recursive return trace and the corresponding induction argument",
    misconception: "a recursive call is justified merely because its input looks smaller",
    boundary: "what fails when the measure does not decrease or the hypothesis is too weak",
    transfer: "choosing a safe recursive traversal for a tree-shaped input",
  },
  3: {
    lens: "code",
    centralModel: "an abstract data type's behavioral contract separated from its representation invariant",
    traceOrDerivation: "read one operation and explain how it preserves the invariant without exposing internals",
    misconception: "public fields and incidental representation details are automatically part of an API",
    boundary: "when a representation swap is safe and when an observable behavior breaks substitution",
    transfer: "designing an adapter around a storage implementation that may change later",
  },
  4: {
    lens: "formal",
    centralModel: "precise domains, quantifiers, relations, and proof obligations",
    traceOrDerivation: "repair a short proof or construct a countermodel for a nearby false statement",
    misconception: "several examples, a diagram, or a true converse establishes a universal implication",
    boundary: "the exact hypothesis needed for the claim and the difference between a finite trace and a proof",
    transfer: "turning an informal program rule into a relation or invariant worth testing",
  },
  5: {
    lens: "formal",
    centralModel: "a cost model with an asymptotic claim, constants, and an input family",
    traceOrDerivation: "derive a bound from counted operations and defend the model being counted",
    misconception: "Big-O means approximately equal, or one benchmark establishes an asymptotic result",
    boundary: "what a small timing observation cannot distinguish about two growth claims",
    transfer: "choosing a data representation for a workload with stated operations and limits",
  },
  6: {
    lens: "code",
    centralModel: "the relationship between sequence meaning, concrete storage, locality, and operation cost",
    traceOrDerivation: "trace a sequence operation through array or linked representation and its ownership changes",
    misconception: "linked structures are inherently faster or memory representation is invisible to the API",
    boundary: "which cost depends on access pattern, allocation, or implementation rather than the abstract ADT",
    transfer: "diagnosing an unexpected slow path in a queue-like service",
  },
  7: {
    lens: "code",
    centralModel: "restricted access, deferred computation, and the difference between producing and consuming work",
    traceOrDerivation: "predict iterator or generator state across a short pull sequence",
    misconception: "a lazy pipeline has already done its work or can be replayed without a new source",
    boundary: "when laziness changes memory behavior but not a source's side effects or termination",
    transfer: "reviewing a streaming ETL path for accidental repeated consumption",
  },
  8: {
    lens: "code",
    centralModel: "equality, hashing, collision handling, and indexing under a workload",
    traceOrDerivation: "trace lookup or insertion while stating the equality and hash contract",
    misconception: "hashes uniquely identify values or mutable keys are always safe",
    boundary: "the difference between expected lookup cost, adversarial behavior, and a correctness guarantee",
    transfer: "designing an index for records whose identity rules may evolve",
  },
  9: {
    lens: "formal",
    centralModel: "ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves",
    traceOrDerivation: "walk through one rotation, heap repair, or comparison sequence and state the invariant afterward",
    misconception: "a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm",
    boundary: "which ordering property is required and what duplicates or comparator behavior change",
    transfer: "choosing an ordered structure for scheduling, nearest lookup, or ranked results",
  },
  10: {
    lens: "formal",
    centralModel: "a graph model of vertices, edges, reachability, and the question an algorithm actually answers",
    traceOrDerivation: "predict a traversal or shortest-path state sequence from an edge list",
    misconception: "a path found by one traversal is automatically shortest, complete, or a flow solution",
    boundary: "which edge weights, direction, and graph assumptions make the conclusion legal",
    transfer: "modeling a dependency, routing, or social-network question without confusing connection with causation",
  },
  11: {
    lens: "formal",
    centralModel: "algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state",
    traceOrDerivation: "reconstruct why greedy, divide-and-conquer, dynamic programming, or search fits one problem",
    misconception: "a strategy that works on examples is justified or dynamic programming just means caching",
    boundary: "the structural property or counterexample that rules a tempting strategy in or out",
    transfer: "critiquing an AI-generated algorithm choice before implementation begins",
  },
  12: {
    lens: "systems",
    centralModel: "dependency direction, interface ownership, and what a module may know or call",
    traceOrDerivation: "read an import/API path and identify the contract crossing each boundary",
    misconception: "a type annotation or package boundary alone creates a stable architecture",
    boundary: "what change would leak through the boundary and which dependency is owned by whom",
    transfer: "reviewing a proposed integration without letting a UI concern invert the dependency graph",
  },
  13: {
    lens: "systems",
    centralModel: "a specification as an observable contract supported by tests, debugging, and scoped observation",
    traceOrDerivation: "trace a failing test to the claim it does and does not establish",
    misconception: "a green suite proves correctness or a debugger observation is the whole explanation",
    boundary: "the missing input, invariant, environment, or regression condition",
    transfer: "turning an incident report into a minimal reproducer and a lasting test",
  },
  14: {
    lens: "systems",
    centralModel: "design boundaries that make likely change explicit without over-abstracting the present system",
    traceOrDerivation: "compare two dependency designs and explain the change each makes cheap or risky",
    misconception: "more layers, patterns, or classes automatically improve maintainability",
    boundary: "the actual volatility and evidence that justify a new abstraction",
    transfer: "reviewing an AI-produced refactor for coupling, test seams, and reversibility",
  },
  15: {
    lens: "systems",
    centralModel: "a versioned artifact crossing a serialization, packaging, or delivery boundary",
    traceOrDerivation: "trace data from in-memory model through encoding, validation, and a consumer contract",
    misconception: "a successful parse proves compatibility or a package install proves reproducibility",
    boundary: "the version, schema, environment, and rollback assumptions behind a delivery claim",
    transfer: "designing a backward-compatible change to a saved learner artifact",
  },
  16: {
    lens: "systems",
    centralModel: "relational invariants, transaction boundaries, and concurrent changes to shared facts",
    traceOrDerivation: "walk through a failed or retried transaction and name the invariant at each durable step",
    misconception: "a database automatically prevents every race or an application retry is harmless",
    boundary: "the isolation, uniqueness, idempotency, and recovery assumptions needed for the claim",
    transfer: "designing a small enrollment or progress-record update that tolerates retries",
  },
  17: {
    lens: "systems",
    centralModel: "the execution stack from source-level intent through machine-level representation and effects",
    traceOrDerivation: "trace one Python operation across frames, calls, memory, and CPU-level constraints",
    misconception: "source syntax directly determines one universal machine behavior",
    boundary: "the difference between language semantics, a compiler/interpreter mechanism, and a hardware observation",
    transfer: "explaining why a performance or memory claim needs a named runtime and workload",
  },
  18: {
    lens: "systems",
    centralModel: "operating-system mediation of processes, memory, files, interruption, and resource lifetime",
    traceOrDerivation: "read an interruption trace and identify which resource state is durable, recoverable, or unknown",
    misconception: "a process exit, API return, or file close alone proves a complete published result",
    boundary: "the ownership, flushing, and recovery evidence needed after failure",
    transfer: "designing a safe staged write that can be inspected after a crash",
  },
  19: {
    lens: "systems",
    centralModel: "concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules",
    traceOrDerivation: "reconstruct a short interleaving and state the violated or preserved invariant",
    misconception: "a passing run rules out a race or parallelism is merely faster concurrency",
    boundary: "what scheduling, visibility, and synchronization guarantees the reasoning needs",
    transfer: "reviewing a worker-pool change for lost updates or stuck progress",
  },
  20: {
    lens: "systems",
    centralModel: "an application protocol as a sequence of scoped messages, states, and durability claims",
    traceOrDerivation: "trace one request, response, retry, and timeout without inventing a remote fact",
    misconception: "a local send or HTTP success proves the receiver durably applied the intended effect",
    boundary: "the protocol version, idempotency, ordering, and failure assumptions",
    transfer: "designing a reliable client-visible status for a delayed remote operation",
  },
  21: {
    lens: "systems",
    centralModel: "partial failure, async coordination, and recovery without pretending a distributed system has global certainty",
    traceOrDerivation: "walk through an event attempt and separate local completion, remote observation, and durable effect",
    misconception: "retries guarantee delivery exactly once or an awaited call made the whole workflow atomic",
    boundary: "the retry, ordering, timeout, and compensation assumptions behind the result",
    transfer: "choosing a bounded fallback when an external dependency becomes unavailable",
  },
  22: {
    lens: "evidence",
    centralModel: "trust boundaries among data, identity, authority, provenance, privacy, and human control",
    traceOrDerivation: "follow one sensitive action through its actor, capability, data recipient, and audit evidence",
    misconception: "authentication, encryption, or a trusted vendor automatically establishes authorization and safety",
    boundary: "who may act, what is retained, what is reversible, and what evidence is still missing",
    transfer: "reviewing an agent proposal that requests a new tool or private data source",
  },
  23: {
    lens: "formal",
    centralModel: "the separation of text, syntax tree, evaluation, type/capability boundary, and authority",
    traceOrDerivation: "parse and evaluate a small expression while naming the permitted language and environment",
    misconception: "parsing validates safety or restricting syntax automatically controls capabilities",
    boundary: "the language, evaluation, resource, and authority limits that must be independently enforced",
    transfer: "designing a bounded rule language for a learner-facing automation",
  },
  24: {
    lens: "evidence",
    centralModel: "the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation",
    traceOrDerivation: "read a measurement and reconstruct its workload, runtime, baseline, and limitation",
    misconception: "one benchmark or profiler output proves a portable performance claim",
    boundary: "which version, allocator, workload, hardware, and statistical limits prevent generalization",
    transfer: "reviewing an optimization proposal before approving it for the course portal",
  },
  25: {
    lens: "evidence",
    centralModel: "an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct",
    traceOrDerivation: "trace one suggestion from input through model/evidence, display policy, and a reversible human decision",
    misconception: "a high score, agent explanation, or green evaluation creates permission to act",
    boundary: "the data lineage, evaluation scope, owner, consent, and rollback evidence needed for release",
    transfer: "writing a bounded AI-assisted feature contract with a meaningful refusal or correction path",
  },
  26: {
    lens: "evidence",
    centralModel: "a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback",
    traceOrDerivation: "defend one architecture thread while a reviewer changes a premise or removes an evidence source",
    misconception: "a polished demo, CI pass, or agent-generated dossier is a release decision",
    boundary: "the owner, recovery path, uncertainty, and changed constraint that should narrow, defer, or disable the release",
    transfer: "handing the system to a maintainer who did not build it and can still challenge its claims",
  },
  27: {
    lens: "formal",
    centralModel: "definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample",
    traceOrDerivation: "reconstruct a proof or recurrence argument, then distinguish it from a finite Python trace",
    misconception: "examples prove universals or a recurrence is complete without bases and a domain",
    boundary: "the missing quantifier, base case, invariant, or hypothesis that makes a claim false",
    transfer: "using proof structure to audit a graph, scheduling, or AI-generated correctness claim",
  },
  28: {
    lens: "formal",
    centralModel: "linear maps, projections, rank, spectra, and conditioning as a model of representable information",
    traceOrDerivation: "derive least squares, a projection, or PCA from its assumptions, then audit one shape/dtype/solver path and finite-precision boundary",
    misconception: "a matrix formula automatically yields a stable computation or PCA is merely an API call",
    boundary: "the conditioning, scale, rank, and approximation assumptions behind the numerical result",
    transfer: "critiquing a representation-reduction choice in an ML or scientific workflow",
  },
  29: {
    lens: "formal",
    centralModel: "limits, local approximation, derivatives, integrals, and conditions for exchanging operations",
    traceOrDerivation: "derive a gradient/Taylor or convergence step and name the regularity condition it uses",
    misconception: "pointwise convergence is automatically uniform or a formal derivative justifies a numerical update",
    boundary: "the continuity, differentiability, convergence, and finite-precision assumptions that can fail",
    transfer: "deciding whether an optimization or expectation manipulation is justified in a new model",
  },
  30: {
    lens: "formal",
    centralModel: "probability models, conditional structure, inference, uncertainty, and sampling assumptions",
    traceOrDerivation: "derive a Bayes, likelihood, confidence, or concentration argument before simulating it",
    misconception: "a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits",
    boundary: "the sampling, independence, missingness, misspecification, and multiple-testing assumptions",
    transfer: "designing an experiment or model evaluation with a credible uncertainty statement",
  },
  31: {
    lens: "formal",
    centralModel: "an objective, constraints, geometry, convergence path, and information quantity with assumptions",
    traceOrDerivation: "derive a first-order/KKT or entropy/KL step and connect it to a computational consequence",
    misconception: "an optimizer's decrease proves a good solution or information metrics are interchangeable scores",
    boundary: "the convexity, smoothness, feasibility, scale, and numerical assumptions behind a convergence claim",
    transfer: "choosing a loss, constraint, or stopping rule for an evidence-bearing system",
  },
  32: {
    lens: "systems",
    centralModel: "cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work",
    traceOrDerivation: "trace one scientific Python operation through memory layout, kernel work, precision, and reproducibility evidence",
    misconception: "vectorization or a GPU automatically makes code faster, correct, or reproducible",
    boundary: "the layout, transfer, precision, synchronization, and environment assumptions behind the observation",
    transfer: "reviewing an accelerator optimization without losing a numerical or testing boundary",
  },
  33: {
    lens: "formal",
    centralModel: "language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable",
    traceOrDerivation: "classify a small language or reconstruct a reduction while preserving the yes/no relationship",
    misconception: "NP means impossible, a parser solves every language question, or a hard instance proves a class claim",
    boundary: "the computational model, input encoding, reduction direction, and resource definition",
    transfer: "rejecting an unrealistic claim about an AI agent, verifier, or optimization problem",
  },
  34: {
    lens: "formal",
    centralModel: "problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions",
    traceOrDerivation: "defend an A*, CSP, planning, or decision step from the model and admissibility/independence assumptions",
    misconception: "a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe",
    boundary: "the state abstraction, heuristic, objective, and uncertainty assumptions that change the result",
    transfer: "formulating a real decision problem before selecting a solver or model",
  },
  35: {
    lens: "evidence",
    centralModel: "learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries",
    traceOrDerivation: "read a model/evaluation path and identify splits, baseline, objective, error pattern, and uncertainty",
    misconception: "a strong validation metric proves generalization, fairness, calibration, or causal usefulness",
    boundary: "the leakage, shift, imbalance, label, selection, and deployment assumptions that can invalidate the result",
    transfer: "choosing an evaluation and error-analysis plan for a new prediction or representation task",
  },
  36: {
    lens: "formal",
    centralModel: "a learning guarantee or lower bound tied to a hypothesis class, assumptions, observable evidence, and system limits",
    traceOrDerivation: "reconstruct a generalization, regret, margin, or lower-bound proof idea and its computational consequence",
    misconception: "a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions",
    boundary: "the distribution, class, sample, optimization, and implementation assumptions that prevent overclaiming",
    transfer: "deciding whether a theoretical guarantee should change a model-release or monitoring decision",
  },
};

export function getOralDefenseGuide(number: number): OralDefenseGuide {
  return oralDefenseGuides[number] ?? fallbackGuide;
}

export function lensInstruction(guide: OralDefenseGuide) {
  switch (guide.lens) {
    case "formal":
      return "Ask for the formal definition and assumptions, then a proof idea or counterexample, and finally the consequence for computation.";
    case "systems":
      return "Ask for the system boundary, failure mode, evidence, tradeoff, and human consequence—not only a mechanism description.";
    case "code":
      return "Ask for a prediction before a trace, the relevant contract or invariant, and the boundary of what the observed run can establish.";
    default:
      return "Ask which claim the evidence supports, which authority may act on it, what uncertainty remains, and how a person can challenge or reverse the decision.";
  }
}
