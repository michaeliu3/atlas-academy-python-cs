import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const graph = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/course-graph.v2.json"), "utf8"),
);
const guides = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/module-companion-guides.v1.json"), "utf8"),
);
const guideById = new Map(guides.guides.map((guide) => [guide.moduleId, guide]));

const arcDefinitions = [
  {
    id: "arc-i-project",
    title: "Stateful Atlas event ledger",
    moduleNumbers: [1, 2, 3, 4, 5],
    premise: "Make a small event ledger explainable from binding to asymptotic cost.",
    architecture: "immutable event inputs → state transition functions → invariant checks → trace dossier",
    milestones: [
      "Name values, bindings, frames, representations, and contracts before implementation.",
      "Add an abstract data type with a proof/cost note and a falsifying test.",
      "Compare two implementations and defend the smallest design choice.",
    ],
  },
  {
    id: "arc-ii-project",
    title: "Indexed retrieval and route planner",
    moduleNumbers: [6, 7, 8, 9, 10, 11],
    premise: "Turn representation and algorithm choices into an inspectable retrieval system.",
    architecture: "records → sequence/index choices → priority/frontier structures → graph routes → measured trade-off",
    milestones: [
      "Trace one representation through memory, iteration, and update operations.",
      "Add an index and route strategy with stated invariants and cost bounds.",
      "Inject an adversarial input and explain why a different strategy wins or loses.",
    ],
  },
  {
    id: "arc-iii-project",
    title: "Durable evidence service",
    moduleNumbers: [12, 13, 14, 15, 16],
    premise: "Make a small service evolvable, testable, observable, serializable, and transactional.",
    architecture: "typed boundary → domain contract → tests/telemetry → serialized artifact → transactional store",
    milestones: [
      "Separate module/API direction from domain behavior and test seams.",
      "Repair a seeded defect using an observable contract, not a blind patch.",
      "Demonstrate one safe migration or transaction rollback and state the boundary.",
    ],
  },
  {
    id: "arc-iv-project",
    title: "Failure-aware local protocol",
    moduleNumbers: [17, 18, 19, 20, 21, 22],
    premise: "Connect machine execution, resources, concurrency, protocols, partial failure, and trust.",
    architecture: "process boundary → resource ownership → concurrent actors → framed protocol → failure/authority ledger",
    milestones: [
      "Trace one request across stack, process, resource, and protocol boundaries.",
      "Add concurrency or async behavior with a history and cancellation contract.",
      "Threat-model one trust boundary and demonstrate a bounded failure recovery.",
    ],
  },
  {
    id: "arc-v-project",
    title: "Inspectable language-and-evidence assistant",
    moduleNumbers: [23, 24, 25, 26],
    premise: "Build an evidence-grounded assistant whose language, runtime, and architectural claims can be defended.",
    architecture: "bounded language input → interpreter/runtime evidence → retrieval/claim ledger → human-facing decision surface",
    milestones: [
      "Implement or inspect a bounded evaluator and distinguish language semantics from runtime facts.",
      "Profile a narrow path and attach evidence to an intelligent-system claim.",
      "Prepare the M26 capstone architecture defense and open-source stewardship plan.",
    ],
  },
  {
    id: "arc-vi-vii-project",
    title: "Mathematical and reliable-learning notebook",
    moduleNumbers: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    premise: "Carry assumptions, representations, optimization, theory, learning, and reliability through one evidence notebook.",
    architecture: "formal object → numerical/algorithmic experiment → assumption ledger → learning claim → reliability boundary",
    milestones: [
      "Derive a discrete, linear, continuous, probabilistic, and optimization claim with hypotheses.",
      "Connect systems/theory/AI fixtures to one measurable representation or decision boundary.",
      "Audit generalization, shift, reproducibility, and model-risk non-claims before synthesis.",
    ],
  },
];

const projectByModuleNumber = new Map(
  arcDefinitions.flatMap((definition) => definition.moduleNumbers.map((number) => [number, definition])),
);

const projects = arcDefinitions.map((definition) => ({
  id: definition.id,
  title: definition.title,
  moduleNumbers: definition.moduleNumbers,
  moduleIds: definition.moduleNumbers.map((number) => `m${String(number).padStart(2, "0")}`),
  level: definition.id === "arc-vi-vii-project" ? "graduate-depth-scoped" : "upper-undergraduate-to-graduate-spine",
  premise: definition.premise,
  architecture: definition.architecture,
  milestones: definition.milestones,
  deliveryLoop: [
    "design brief and learner constraint",
    "prediction plus confidence",
    "architecture/state/data-flow sketch",
    "visible incremental patch or derivation",
    "test, trace, numerical experiment, or proof check",
    "changed premise or failure injection",
    "code review, learner explanation, and evidence card",
  ],
  moduleSlices: definition.moduleNumbers.map((number) => {
    const graphModule = graph.modules.find((candidate) => candidate.number === number);
    const guide = graphModule ? guideById.get(graphModule.id) : null;
    return {
      moduleId: graphModule.id,
      number,
      title: graphModule.title,
      scope: `One bounded implementation, trace, proof, or experiment for ${guide?.centralModel ?? graphModule.purpose}.`,
      // `traceOrDerivation` is authored as an imperative verb phrase because its
      // other consumers read "Ask me to ${…}" / "explain or trace: ${…}". It
      // therefore needs a verb slot here too; dropping it into a noun slot
      // produced "A reviewed derive least squares…" for all 36 slices.
      learnerArtifact: `A reviewed artifact in which you ${guide?.traceOrDerivation ?? "trace one mechanism"}, with one assumption, one changed-premise result, and one non-claim.`,
      // The companion guide authors five fields per module; a slice that
      // carried only the central model and the trace left the misconception,
      // boundary, and transfer unused, so every slice in an arc read alike.
      misconceptionToRepair: guide?.misconception ?? null,
      boundaryToName: guide?.boundary ?? null,
      transferTarget: guide?.transfer ?? null,
      status: guide ? "derived-from-companion-guide" : "scaffold",
    };
  }),
  acceptanceCriteria: [
    "The learner states intent, constraints, and invariant before the patch or derivation.",
    "Every generated patch, trace, or numerical result is visible and labelled as observed, simulated, assumed, or unverified.",
    "At least one failure, counterexample, changed premise, or boundary is investigated.",
    "The learner reviews the final artifact and explains the mechanism plus one remaining uncertainty.",
  ],
}));

const output = {
  schemaVersion: 1,
  kind: "atlas-cumulative-arc-projects",
  canonicalCourseGraph: "content/course/course-graph.v2.json",
  deliveryModel: "36 narrow module slices → six cumulative arc projects → M26 evidence-gated local capstone",
  projects,
  capstone: {
    id: "m26-local-capstone",
    moduleId: "m26",
    status: "evidence-gated-preview",
    title: "Atlas evidence-grounded learning system",
    premise: "Integrate the arc outputs into a local-first, auditable learning system and defend its architecture, evidence boundaries, privacy controls, and stewardship decisions.",
    requiredInputs: projects.map((project) => project.id),
    definitionOfDone: [
      "A reviewable architecture and data-flow map connects the arc outputs.",
      "The learner can trace one claim from source or experiment to a bounded user-facing decision.",
      "Privacy, accessibility, safety, provenance, and failure boundaries are explicit.",
      "The learner conducts a constructive oral architecture defense and records uncertainty without a pass/fail label.",
    ],
  },
};

if (projectByModuleNumber.size !== graph.modules.length) {
  throw new Error("Arc project definitions must cover every course module exactly once.");
}

const serialized = `${JSON.stringify(output, null, 2)}\n`;
const outputPath = path.join(siteRoot, "content/course/arc-projects.v1.json");
if (process.argv.includes("--check")) {
  const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : null;
  if (existing !== serialized) {
    console.error(`Arc-project output is stale: ${path.relative(siteRoot, outputPath)}`);
    process.exitCode = 1;
  } else {
    console.log("Arc-project output is current: six projects and 36 slices.");
  }
} else {
  fs.writeFileSync(outputPath, serialized, "utf8");
  console.log("Generated six arc projects and 36 module slices.");
}
