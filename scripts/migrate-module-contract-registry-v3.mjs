import { access, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(scriptDirectory, "..");
const targetPath = resolve(
  siteRoot,
  "content",
  "course",
  "contracts",
  "module-contract-registry.v3.json",
);

const graphPath = "content/course/course-graph.v2.json";
const manifestPath = "content/modules/manifest.json";
const legacyAuditPath = "content/course/contracts/legacy-module-contract-audit.v1.json";
const advancedContractPath = "content/course/contracts/advanced-module-contracts.v1.json";
const advancedBridgePath = "content/course/m31-m36-prerequisite-session-bridge.v1.json";

const criterionIds = [
  "prerequisite-forward-map",
  "six-connected-sessions",
  "first-principles",
  "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments",
  "code-reading-debugging-design",
  "prediction-before-reveal",
  "transfer-task",
  "source-ledger",
  "accessible-visual-text-alternative",
  "confidence-diagnostic-misconceptions",
  "retrieval-and-spaced-review",
  "project-and-evidence-rubric",
  "supportive-oral-defense",
  "ta-prompt",
  "study-partner-prompt",
  "forward-handoff",
  "interaction-reference-model-and-teaching-tests",
  "release-provenance-ci-and-deployment-evidence",
];

const humanReviewDimensions = [
  "first-principles-quality",
  "rigor-and-counterexamples",
  "source-claim-correctness",
  "visual-text-equivalent-quality",
  "assessment-explanation-quality",
  "project-evidence-quality",
  "ta-study-partner-usefulness",
  "oral-defense-quality",
];

const m31EvidenceByCriterion = {
  "prerequisite-forward-map": "prerequisite-and-forward-map",
  "six-connected-sessions": "six-connected-sessions",
  "first-principles": "first-principles-code-reading-prediction-and-transfer",
  "rigor-definitions-assumptions-derivations-proofs-counterexamples-numerical-experiments":
    "rigor-derivations-counterexamples-and-numerical-experiments",
  "code-reading-debugging-design": "first-principles-code-reading-prediction-and-transfer",
  "prediction-before-reveal": "first-principles-code-reading-prediction-and-transfer",
  "transfer-task": "first-principles-code-reading-prediction-and-transfer",
  "source-ledger": "source-ledger-claim-license-and-link-boundary",
  "accessible-visual-text-alternative": "accessible-visuals-and-concise-text-alternatives",
  "confidence-diagnostic-misconceptions": "confidence-aware-multiple-choice-diagnostic",
  "retrieval-and-spaced-review": "retrieval-and-spaced-review",
  "project-and-evidence-rubric": "dossier-rubric-and-acceptance-evidence",
  "supportive-oral-defense": "supportive-oral-defense",
  "ta-prompt": "ta-study-partner-and-forward-handoff",
  "study-partner-prompt": "ta-study-partner-and-forward-handoff",
  "forward-handoff": "ta-study-partner-and-forward-handoff",
  "interaction-reference-model-and-teaching-tests":
    "studio-reference-model-and-teaching-tests",
  "release-provenance-ci-and-deployment-evidence":
    "release-provenance-ci-and-deployment-evidence",
};

function pendingReview() {
  return Object.fromEntries(humanReviewDimensions.map((dimension) => [dimension, "pending"]));
}

async function json(relativePath) {
  return JSON.parse(await readFile(resolve(siteRoot, relativePath), "utf8"));
}

async function refuseExistingTarget() {
  const exists = await access(targetPath).then(() => true).catch(() => false);
  if (exists) {
    throw new Error(
      "Refusing to overwrite the v3 contract registry. It is a reviewed source artifact after this one-time migration.",
    );
  }
}

async function main() {
  await refuseExistingTarget();
  const [graph, audit, advancedContracts, bridge] = await Promise.all([
    json(graphPath),
    json(legacyAuditPath),
    json(advancedContractPath),
    json(advancedBridgePath),
  ]);
  const auditById = new Map(audit.modules.map((module, index) => [module.moduleId, { module, index }]));
  const m31 = advancedContracts.modules.find(({ moduleId }) => moduleId === "m31");
  const m31EvidenceById = new Map(m31.evidence.map((evidence, index) => [evidence.id, { evidence, index }]));
  const bridgeById = new Map(bridge.modules.map((module, index) => [module.moduleId, { module, index }]));

  const modules = graph.modules
    .slice()
    .sort((left, right) => left.number - right.number)
    .map((graphModule) => {
      const base = {
        moduleId: graphModule.id,
        contractState: graphModule.state.contract.state,
        humanReview: pendingReview(),
        evidenceRecord: null,
        reviewRecord: null,
        reviewReadyCommit: null,
        release: null,
      };

      if (graphModule.number <= 30) {
        const auditEntry = auditById.get(graphModule.id);
        if (!auditEntry) throw new Error(`Legacy audit is missing ${graphModule.id}.`);
        return {
          ...base,
          migration: {
            kind: "legacy-audit",
            path: legacyAuditPath,
            locator: `/modules/${auditEntry.index}`,
          },
          criteria: criterionIds.map((id) => {
            const legacyEvidence = auditEntry.module.evidence[id];
            if (!legacyEvidence) {
              return {
                id,
                status: "missing",
                source: { kind: "none", path: null, locator: null },
              };
            }
            return {
              id,
              status: legacyEvidence.status,
              source: {
                kind: "legacy-audit-criterion",
                path: legacyAuditPath,
                locator: `/modules/${auditEntry.index}/evidence/${id}`,
              },
            };
          }),
        };
      }

      if (graphModule.id === "m31") {
        return {
          ...base,
          migration: {
            kind: "advanced-authoring-adapter",
            path: advancedContractPath,
            locator: "/modules/0",
          },
          criteria: criterionIds.map((id) => {
            const advancedEvidence = m31EvidenceById.get(m31EvidenceByCriterion[id]);
            if (!advancedEvidence) throw new Error(`M31 contract is missing a v3 mapping for ${id}.`);
            return {
              id,
              status: advancedEvidence.evidence.state,
              source: {
                kind: "advanced-authoring-adapter-evidence",
                path: advancedContractPath,
                locator: `/modules/0/evidence/${advancedEvidence.index}`,
              },
            };
          }),
        };
      }

      const bridgeEntry = bridgeById.get(graphModule.id);
      if (!bridgeEntry) throw new Error(`Advanced bridge is missing ${graphModule.id}.`);
      return {
        ...base,
        migration: {
          kind: "advanced-bridge-plan",
          path: advancedBridgePath,
          locator: `/modules/${bridgeEntry.index}`,
        },
        criteria: criterionIds.map((id) => ({
          id,
          status: "planned",
          source: {
            kind: "advanced-bridge-plan",
            path: advancedBridgePath,
            locator: `/modules/${bridgeEntry.index}`,
          },
        })),
      };
    });

  const registry = {
    schemaVersion: 3,
    contractVersion: "v3",
    kind: "atlas-module-contract-registry",
    purpose:
      "One versioned, fail-closed module-contract registry that preserves legacy audit facts and advanced authoring plans without treating pointers, plans, or structural checks as human approval, learner mastery, or release evidence.",
    canonicalCourseGraph: graphPath,
    canonicalModuleManifest: manifestPath,
    truthBoundary: {
      legacyBaseline:
        "Legacy-baseline entries inherit immutable audit statuses and remain non-verified until a reviewed promotion is recorded.",
      authoringOnly:
        "Authoring-only and not-started entries may record plans but cannot create reader access, Core credit, learner evidence, or release claims.",
      reviewReady:
        "Review-ready requires resolved module-specific evidence and a digest-bound review record for every contract criterion, but remains unavailable until a later verified promotion.",
      verified:
        "Verified requires an unchanged prior review-ready evidence bundle, approved human review, source-commit-bound Course CI evidence, module-scoped release records, deployed graph evidence, and graph-compatible learner material.",
    },
    contractStates: [
      "not-started",
      "authoring-only",
      "legacy-baseline",
      "review-ready",
      "verified",
    ],
    evidenceStates: [
      "planned",
      "pointer-present",
      "ambiguous",
      "missing",
      "reviewed",
      "release-ready",
    ],
    criterionIds,
    humanReviewDimensions,
    modules,
  };

  await writeFile(targetPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
  console.log(`Migrated ${modules.length} module contracts into ${targetPath}.`);
}

await main();
