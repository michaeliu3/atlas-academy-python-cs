import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  loadReleaseEvidencePolicy,
  validateReleaseEvidencePolicy,
  verifyCourseCiEvidence,
} from "../../../scripts/release-evidence-verifier.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "../../..");
const sourceHeadSha = "0123456789abcdef0123456789abcdef01234567";

function completeEvidence(policy) {
  return {
    schemaVersion: 1,
    kind: "atlas-course-ci-evidence",
    sourceHeadSha,
    run: {
      id: 9000000001,
      attempt: 7,
      repository: policy.repository,
      headRepository: policy.repository,
      sourceHeadSha,
      workflowId: policy.courseCi.workflowId,
      workflowName: policy.courseCi.workflowName,
      workflowPath: policy.courseCi.workflowPath,
      workflowSourceSha256: policy.courseCi.workflowSourceSha256,
      event: policy.courseCi.event,
      status: "completed",
      conclusion: "success",
      htmlUrl: `https://github.com/${policy.repository}/actions/runs/9000000001`,
    },
    jobs: policy.courseCi.requiredJobNames.map((name, index) => ({
      id: 8000000001 + index,
      runId: 9000000001,
      runAttempt: 7,
      sourceHeadSha,
      name,
      status: "completed",
      conclusion: "success",
    })),
  };
}

test("a complete same-repository Course CI snapshot is structurally bound to its policy and source head", async () => {
  const { policy } = await loadReleaseEvidencePolicy(siteRoot);
  const result = verifyCourseCiEvidence({
    policy,
    evidence: completeEvidence(policy),
    expectedSourceHeadSha: sourceHeadSha,
  });

  assert.deepEqual(result, {
    policyVersion: "v1",
    repository: "michaeliu3/atlas-academy-python-cs",
    sourceHeadSha,
    runId: 9000000001,
    runAttempt: 7,
    runUrl: "https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/9000000001",
    workflowSourceSha256: policy.courseCi.workflowSourceSha256,
    requiredJobNames: [
      "Portal quality gate",
      "Teaching models on Python 3.12",
      "Teaching models on Python 3.14",
      "Browser accessibility acceptance",
    ],
  });
});

test("the local policy and evidence verifier fail closed on altered workflow, origin, run, and job facts", async () => {
  const { policy } = await loadReleaseEvidencePolicy(siteRoot);
  const failureCases = [
    [
      "a workflow digest that does not bind the supplied workflow text",
      () => {
        const alteredPolicy = structuredClone(policy);
        alteredPolicy.courseCi.workflowSourceSha256 = "0".repeat(64);
        validateReleaseEvidencePolicy(alteredPolicy, { workflowContent: "name: different\n" });
      },
      /workflow SHA-256 does not match/u,
    ],
    [
      "a forked head repository",
      () => {
        const evidence = completeEvidence(policy);
        evidence.run.headRepository = "untrusted-fork/atlas-academy-python-cs";
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /same-repository head/u,
    ],
    [
      "a source-head mismatch",
      () => {
        const evidence = completeEvidence(policy);
        evidence.run.sourceHeadSha = "fedcba9876543210fedcba9876543210fedcba98";
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /sourceHeadSha does not match/u,
    ],
    [
      "an incomplete run",
      () => {
        const evidence = completeEvidence(policy);
        evidence.run.status = "in_progress";
        evidence.run.conclusion = null;
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /not a completed successful run/u,
    ],
    [
      "an altered workflow identity",
      () => {
        const evidence = completeEvidence(policy);
        evidence.run.workflowId += 1;
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /does not match the pinned Course CI policy/u,
    ],
    [
      "an altered workflow name",
      () => {
        const evidence = completeEvidence(policy);
        evidence.run.workflowName = "Other workflow";
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /does not match the pinned Course CI policy/u,
    ],
    [
      "an altered workflow path",
      () => {
        const evidence = completeEvidence(policy);
        evidence.run.workflowPath = ".github/workflows/other.yml";
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /does not match the pinned Course CI policy/u,
    ],
    [
      "an altered workflow source digest",
      () => {
        const evidence = completeEvidence(policy);
        evidence.run.workflowSourceSha256 = "1".repeat(64);
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /does not match the pinned Course CI policy/u,
    ],
    [
      "an altered workflow event",
      () => {
        const evidence = completeEvidence(policy);
        evidence.run.event = "push";
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /does not match the pinned Course CI policy/u,
    ],
    [
      "a failed required job",
      () => {
        const evidence = completeEvidence(policy);
        evidence.jobs[0].conclusion = "failure";
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /not a completed successful job/u,
    ],
    [
      "a missing required job",
      () => {
        const evidence = completeEvidence(policy);
        evidence.jobs.pop();
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /missing required job/u,
    ],
    [
      "a job from another run attempt",
      () => {
        const evidence = completeEvidence(policy);
        evidence.jobs[0].runAttempt += 1;
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /does not belong to the accepted run, attempt, and source head/u,
    ],
    [
      "a job from another run",
      () => {
        const evidence = completeEvidence(policy);
        evidence.jobs[0].runId += 1;
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /does not belong to the accepted run, attempt, and source head/u,
    ],
    [
      "a job from another source head",
      () => {
        const evidence = completeEvidence(policy);
        evidence.jobs[0].sourceHeadSha = "fedcba9876543210fedcba9876543210fedcba98";
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /does not belong to the accepted run, attempt, and source head/u,
    ],
    [
      "a duplicate required job",
      () => {
        const evidence = completeEvidence(policy);
        evidence.jobs.push({ ...evidence.jobs[0], id: 8000000999 });
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /duplicate job name/u,
    ],
    [
      "an unsupported mutable pull-request association field",
      () => {
        const evidence = completeEvidence(policy);
        evidence.pullRequests = [{ number: 21 }];
        verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha: sourceHeadSha });
      },
      /must use exactly the supported fields/u,
    ],
  ];

  for (const [, attempt, expectedError] of failureCases) {
    assert.throws(attempt, expectedError);
  }
});

test("the release-evidence policy rejects schema drift before it can become a ledger input", async () => {
  const { policy } = await loadReleaseEvidencePolicy(siteRoot);
  const failureCases = [
    [
      "an unknown root field",
      () => validateReleaseEvidencePolicy({ ...policy, remoteRunUrl: "https://example.invalid" }),
      /must use exactly the supported fields/u,
    ],
    [
      "an unsupported workflow path",
      () => {
        const alteredPolicy = structuredClone(policy);
        alteredPolicy.courseCi.workflowPath = ".github/workflows/untrusted.yml";
        validateReleaseEvidencePolicy(alteredPolicy);
      },
      /workflowPath must be/u,
    ],
    [
      "a duplicate required job name",
      () => {
        const alteredPolicy = structuredClone(policy);
        alteredPolicy.courseCi.requiredJobNames.push(alteredPolicy.courseCi.requiredJobNames[0]);
        validateReleaseEvidencePolicy(alteredPolicy);
      },
      /duplicate required Course CI job name/u,
    ],
  ];

  for (const [, attempt, expectedError] of failureCases) {
    assert.throws(attempt, expectedError);
  }
});
