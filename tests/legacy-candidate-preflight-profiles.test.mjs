import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  loadLegacyCandidatePreflightProfiles,
  validateLegacyCandidatePreflightProfiles,
} from "../scripts/legacy-candidate-preflight-profiles.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");

async function loadProfiles() {
  return loadLegacyCandidatePreflightProfiles(siteRoot);
}

test("the legacy candidate profile registry allowlists the complete mathematics cohort", async () => {
  const report = await validateLegacyCandidatePreflightProfiles(await loadProfiles(), { siteRoot });

  assert.deepEqual(
    [...report.candidateByModuleId.keys()],
    ["m27", "m28", "m29", "m30"],
  );
  const releaseInputPaths = report.releaseInputPaths.map((path) => path.replaceAll("\\", "/"));
  for (const moduleId of report.candidateByModuleId.keys()) {
    assert.ok(
      releaseInputPaths.some((path) => path.endsWith(`evidence/${moduleId}.v1.json`)),
      `${moduleId} evidence record is profile-derived and hash-ledgered`,
    );
    assert.ok(
      releaseInputPaths.some((path) => path.endsWith(`evidence-preflight/${moduleId}.v1.json`)),
      `${moduleId} preflight record is profile-derived and hash-ledgered`,
    );
  }
});

test("the legacy candidate profile registry rejects ambiguous or forged profile bindings", async () => {
  const profiles = await loadProfiles();

  const unknownField = structuredClone(profiles);
  unknownField.candidates[0].unreviewedEscape = true;
  await assert.rejects(
    () => validateLegacyCandidatePreflightProfiles(unknownField, { siteRoot }),
    /must use exactly these keys/i,
  );

  const duplicateModule = structuredClone(profiles);
  duplicateModule.candidates[1].moduleId = "m27";
  await assert.rejects(
    () => validateLegacyCandidatePreflightProfiles(duplicateModule, { siteRoot }),
    /moduleId must be unique/i,
  );

  const escapedSourceLedger = structuredClone(profiles);
  escapedSourceLedger.candidates[0].sourceLedgerPaths[0] = "../outside.md";
  await assert.rejects(
    () => validateLegacyCandidatePreflightProfiles(escapedSourceLedger, { siteRoot }),
    /must be a normalized repository-relative path/i,
  );

  const forgedDocumentationDigest = structuredClone(profiles);
  forgedDocumentationDigest.candidates[0].candidateDocumentation.digest = `sha256:${"0".repeat(64)}`;
  await assert.rejects(
    () => validateLegacyCandidatePreflightProfiles(forgedDocumentationDigest, { siteRoot }),
    /digest must match the checked-in candidate-boundary document/i,
  );

  const undiscoveredVisualTest = structuredClone(profiles);
  undiscoveredVisualTest.candidates[0].visualTestPath = "tests/not-a-discovered-test.mjs";
  await assert.rejects(
    () => validateLegacyCandidatePreflightProfiles(undiscoveredVisualTest, { siteRoot }),
    /must name a discovered top-level Node test/i,
  );
});
