import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const releaseEvidencePolicyRelativePath = "content/course/release-evidence-policy.v1.json";
const requiredPolicyKeys = new Set([
  "schemaVersion",
  "policyVersion",
  "kind",
  "description",
  "repository",
  "courseCi",
  "truthBoundary",
]);
const requiredCourseCiKeys = new Set([
  "workflowId",
  "workflowName",
  "workflowPath",
  "workflowSourceSha256",
  "event",
  "requiredJobNames",
]);
const requiredTruthBoundaryKeys = new Set([
  "localVerification",
  "remoteVerification",
  "deployment",
]);
const requiredEvidenceKeys = new Set([
  "schemaVersion",
  "kind",
  "sourceHeadSha",
  "run",
  "jobs",
]);
const requiredRunKeys = new Set([
  "id",
  "attempt",
  "repository",
  "headRepository",
  "sourceHeadSha",
  "workflowId",
  "workflowName",
  "workflowPath",
  "workflowSourceSha256",
  "event",
  "status",
  "conclusion",
  "htmlUrl",
]);
const requiredJobKeys = new Set([
  "id",
  "runId",
  "runAttempt",
  "sourceHeadSha",
  "name",
  "status",
  "conclusion",
]);
const fullCommitPattern = /^[0-9a-f]{40}$/u;
const sha256Pattern = /^[0-9a-f]{64}$/u;
const repositoryPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u;
const courseCiWorkflowPath = ".github/workflows/ci.yml";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireExactKeys(value, expectedKeys, label) {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object.`);
  }
  const actualKeys = Object.keys(value);
  if (actualKeys.length !== expectedKeys.size || actualKeys.some((key) => !expectedKeys.has(key))) {
    throw new Error(`${label} must use exactly the supported fields.`);
  }
}

function requireText(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function requireFullCommit(value, label) {
  if (typeof value !== "string" || !fullCommitPattern.test(value)) {
    throw new Error(`${label} must be a lowercase 40-character Git commit SHA.`);
  }
}

function canonicalTextContent(value) {
  return value.replace(/\r\n?/gu, "\n");
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeRequiredJobNames(value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("release-evidence policy must declare one or more required Course CI job names.");
  }
  const seen = new Set();
  for (const name of value) {
    requireText(name, "required Course CI job name");
    if (seen.has(name)) {
      throw new Error(`release-evidence policy has a duplicate required Course CI job name: ${name}.`);
    }
    seen.add(name);
  }
  return [...value];
}

export function releaseEvidencePolicyPath(siteRoot) {
  return resolve(siteRoot, releaseEvidencePolicyRelativePath);
}

export function validateReleaseEvidencePolicy(policy, { workflowContent } = {}) {
  requireExactKeys(policy, requiredPolicyKeys, "release-evidence policy");
  if (policy.schemaVersion !== 1 || policy.policyVersion !== "v1") {
    throw new Error("release-evidence policy must use schemaVersion 1 and policyVersion v1.");
  }
  if (policy.kind !== "atlas-course-ci-evidence-policy") {
    throw new Error("release-evidence policy kind is invalid.");
  }
  requireText(policy.description, "release-evidence policy description");
  if (typeof policy.repository !== "string" || !repositoryPattern.test(policy.repository)) {
    throw new Error("release-evidence policy repository must be an owner/repository identifier.");
  }

  requireExactKeys(policy.courseCi, requiredCourseCiKeys, "release-evidence policy courseCi");
  if (!Number.isSafeInteger(policy.courseCi.workflowId) || policy.courseCi.workflowId <= 0) {
    throw new Error("release-evidence policy Course CI workflowId must be a positive integer.");
  }
  requireText(policy.courseCi.workflowName, "release-evidence policy Course CI workflowName");
  if (policy.courseCi.workflowPath !== courseCiWorkflowPath) {
    throw new Error(`release-evidence policy Course CI workflowPath must be ${courseCiWorkflowPath}.`);
  }
  if (
    typeof policy.courseCi.workflowSourceSha256 !== "string" ||
    !sha256Pattern.test(policy.courseCi.workflowSourceSha256)
  ) {
    throw new Error("release-evidence policy Course CI workflowSourceSha256 must be a lowercase SHA-256 digest.");
  }
  if (policy.courseCi.event !== "pull_request") {
    throw new Error("release-evidence policy Course CI event must be pull_request.");
  }
  const requiredJobNames = normalizeRequiredJobNames(policy.courseCi.requiredJobNames);

  requireExactKeys(policy.truthBoundary, requiredTruthBoundaryKeys, "release-evidence policy truthBoundary");
  for (const [label, text] of Object.entries(policy.truthBoundary)) {
    requireText(text, `release-evidence policy truthBoundary.${label}`);
  }

  if (workflowContent !== undefined) {
    if (typeof workflowContent !== "string") {
      throw new Error("Course CI workflow content must be text when supplied for policy validation.");
    }
    const actualDigest = sha256(canonicalTextContent(workflowContent));
    if (actualDigest !== policy.courseCi.workflowSourceSha256) {
      throw new Error(
        `release-evidence policy Course CI workflow SHA-256 does not match ${courseCiWorkflowPath}.`,
      );
    }
  }

  return {
    policyVersion: policy.policyVersion,
    repository: policy.repository,
    workflowId: policy.courseCi.workflowId,
    workflowName: policy.courseCi.workflowName,
    workflowPath: policy.courseCi.workflowPath,
    workflowSourceSha256: policy.courseCi.workflowSourceSha256,
    event: policy.courseCi.event,
    requiredJobNames,
  };
}

export async function loadReleaseEvidencePolicy(siteRoot) {
  const path = releaseEvidencePolicyPath(siteRoot);
  let policy;
  try {
    policy = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read the release-evidence policy: ${error.message}`);
  }

  const staticPolicy = validateReleaseEvidencePolicy(policy);
  const workflowPath = resolve(siteRoot, staticPolicy.workflowPath);
  let workflowContent;
  try {
    workflowContent = await readFile(workflowPath, "utf8");
  } catch (error) {
    throw new Error(`Cannot read the Course CI workflow for release-evidence validation: ${error.message}`);
  }
  const report = validateReleaseEvidencePolicy(policy, { workflowContent });
  return { path, workflowPath, policy, report };
}

function expectedRunUrl(repository, runId) {
  return `https://github.com/${repository}/actions/runs/${runId}`;
}

function validateJob(job, { runId, runAttempt, sourceHeadSha }) {
  requireExactKeys(job, requiredJobKeys, "Course CI evidence job");
  if (!Number.isSafeInteger(job.id) || job.id <= 0) {
    throw new Error("Course CI evidence job id must be a positive integer.");
  }
  if (job.runId !== runId || job.runAttempt !== runAttempt || job.sourceHeadSha !== sourceHeadSha) {
    throw new Error("Course CI evidence job does not belong to the accepted run, attempt, and source head.");
  }
  requireFullCommit(job.sourceHeadSha, "Course CI evidence job sourceHeadSha");
  requireText(job.name, "Course CI evidence job name");
  if (job.status !== "completed" || job.conclusion !== "success") {
    throw new Error(`Course CI evidence job ${job.name} is not a completed successful job.`);
  }
}

export function verifyCourseCiEvidence({ policy, evidence, expectedSourceHeadSha }) {
  const normalizedPolicy = validateReleaseEvidencePolicy(policy);
  requireFullCommit(expectedSourceHeadSha, "expected Course CI source head SHA");
  requireExactKeys(evidence, requiredEvidenceKeys, "Course CI evidence");
  if (evidence.schemaVersion !== 1 || evidence.kind !== "atlas-course-ci-evidence") {
    throw new Error("Course CI evidence must use schemaVersion 1 and kind atlas-course-ci-evidence.");
  }
  requireFullCommit(evidence.sourceHeadSha, "Course CI evidence sourceHeadSha");
  if (evidence.sourceHeadSha !== expectedSourceHeadSha) {
    throw new Error("Course CI evidence sourceHeadSha does not match the expected source head SHA.");
  }

  const run = evidence.run;
  requireExactKeys(run, requiredRunKeys, "Course CI evidence run");
  if (!Number.isSafeInteger(run.id) || run.id <= 0) {
    throw new Error("Course CI evidence run id must be a positive integer.");
  }
  if (!Number.isSafeInteger(run.attempt) || run.attempt < 1) {
    throw new Error("Course CI evidence run attempt must be a positive integer.");
  }
  if (run.repository !== normalizedPolicy.repository || run.headRepository !== normalizedPolicy.repository) {
    throw new Error("Course CI evidence must come from the policy repository and a same-repository head.");
  }
  requireFullCommit(run.sourceHeadSha, "Course CI evidence run sourceHeadSha");
  if (run.sourceHeadSha !== expectedSourceHeadSha) {
    throw new Error("Course CI evidence run sourceHeadSha does not match the expected source head SHA.");
  }
  if (
    run.workflowId !== normalizedPolicy.workflowId ||
    run.workflowName !== normalizedPolicy.workflowName ||
    run.workflowPath !== normalizedPolicy.workflowPath ||
    run.workflowSourceSha256 !== normalizedPolicy.workflowSourceSha256 ||
    run.event !== normalizedPolicy.event
  ) {
    throw new Error("Course CI evidence run does not match the pinned Course CI policy.");
  }
  if (run.status !== "completed" || run.conclusion !== "success") {
    throw new Error("Course CI evidence run is not a completed successful run.");
  }
  if (run.htmlUrl !== expectedRunUrl(normalizedPolicy.repository, run.id)) {
    throw new Error("Course CI evidence run URL does not match its repository and run id.");
  }

  if (!Array.isArray(evidence.jobs)) {
    throw new Error("Course CI evidence jobs must be an array.");
  }
  const jobsByName = new Map();
  const jobIds = new Set();
  for (const job of evidence.jobs) {
    validateJob(job, {
      runId: run.id,
      runAttempt: run.attempt,
      sourceHeadSha: expectedSourceHeadSha,
    });
    if (jobIds.has(job.id)) {
      throw new Error(`Course CI evidence has a duplicate job id: ${job.id}.`);
    }
    jobIds.add(job.id);
    if (jobsByName.has(job.name)) {
      throw new Error(`Course CI evidence has a duplicate job name: ${job.name}.`);
    }
    jobsByName.set(job.name, job);
  }
  for (const requiredJobName of normalizedPolicy.requiredJobNames) {
    if (!jobsByName.has(requiredJobName)) {
      throw new Error(`Course CI evidence is missing required job: ${requiredJobName}.`);
    }
  }

  return {
    policyVersion: normalizedPolicy.policyVersion,
    repository: normalizedPolicy.repository,
    sourceHeadSha: expectedSourceHeadSha,
    runId: run.id,
    runAttempt: run.attempt,
    runUrl: run.htmlUrl,
    workflowSourceSha256: normalizedPolicy.workflowSourceSha256,
    requiredJobNames: normalizedPolicy.requiredJobNames,
  };
}
