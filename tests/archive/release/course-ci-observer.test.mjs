import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadReleaseEvidencePolicy } from "../../../scripts/release-evidence-verifier.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "../../..");
const observerWorkflowPath = resolve(
  siteRoot,
  ".github",
  "workflows",
  "observe-course-ci-metadata.yml",
);
const observerActionSha = "ed597411d8f924073f98dfc5c65a23a2325f34cd";

async function readVerifierWorkflow() {
  return (await readFile(observerWorkflowPath, "utf8")).replace(/\r\n?/gu, "\n");
}

function verifierSafetyErrors(workflow) {
  workflow = workflow.replace(/\r\n?/gu, "\n");
  const errors = [];
  const requiredFragments = [
    "name: Verify Course CI metadata on demand",
    "on:\n  workflow_dispatch:\n    inputs:\n      run_id:",
    "required: true",
    "type: string",
    "permissions:\n  actions: read",
    "ATLAS_CI_RUN_ID: ${{ inputs.run_id }}",
    "const suppliedRunId = (process.env.ATLAS_CI_RUN_ID ?? \"\").trim();",
    "/^[1-9]\\d*$/u.test(suppliedRunId)",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}",
    "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs",
    'displayTitle: "atlas-course-ci-gate"',
    "on-demand source-head-attached Course CI metadata observation",
  ];
  for (const fragment of requiredFragments) {
    if (!workflow.includes(fragment)) {
      errors.push(`missing required verifier fragment: ${fragment}`);
    }
  }
  if (!/^permissions:\n  actions: read\n(?:\n|jobs:)/mu.test(workflow)) {
    errors.push("top-level permissions must be exactly actions: read");
  }
  if (!/^\s{4}timeout-minutes:\s*[1-3]\s*$/mu.test(workflow)) {
    errors.push("verifier job must have a timeout of three minutes or less");
  }
  const actionReferences = [...workflow.matchAll(/^[ \t]*uses:\s+([^@\s]+)@([^\s#]+)\s+#\s+v[\d.]+\s*$/gmu)];
  if (actionReferences.length !== 1) {
    errors.push("verifier must use exactly one pinned metadata-reading action");
  }
  for (const [, action, revision] of actionReferences) {
    if (action !== "actions/github-script" || revision !== observerActionSha) {
      errors.push("verifier action must be the pinned github-script metadata reader");
    }
  }

  const script = workflow.split("script: |\n", 2)[1] ?? "";
  const forbiddenPatterns = [
    [/(?:^|\n)\s*push:/u, "push trigger"],
    [/(?:^|\n)\s*pull_request(?:_target)?:/u, "pull-request trigger"],
    [/(?:^|\n)\s*workflow_run:/u, "automatic workflow-run trigger"],
    [/(?:^|\n)\s*repository_dispatch:/u, "repository-dispatch trigger"],
    [/(?:^|\n)\s*schedule:/u, "schedule trigger"],
    [/(?:^|\n)\s*workflow_call:/u, "workflow-call trigger"],
    [/permissions:\s*write-all/u, "write-all permission"],
    [/\b(?:contents|checks|statuses|pull-requests|packages|id-token|attestations):\s*(?:read|write)/u, "unneeded permission"],
    [/\bactions:\s*write/u, "write-capable actions permission"],
    [/(?:^|\n)\s*(?:-\s*)?run:\s/u, "shell command"],
    [/actions\/checkout|checkout@|git\s+(?:checkout|clone|fetch)|gh\s+pr\s+checkout/iu, "checkout or Git operation"],
    [/artifact|actions\/(?:download|upload)-artifact/iu, "artifact handling"],
    [/actions\/cache|cache:|cache-dependency-path/iu, "cache handling"],
    [/setup-(?:node|python)/iu, "runtime setup action"],
    [/\b(?:container|services|defaults):/u, "container or shell-default configuration"],
    [/uses:\s*(?:docker:|[^\s]+\/\.github\/workflows\/)/u, "dynamic container or reusable workflow"],
    [/github\.event\.workflow_run|\bpull_requests\b|\bhead_branch\b/u, "mutable predecessor-run identity"],
    [/github\.rest\.[\w.]+\.(?:create|update|delete)|\b(?:POST|PUT|PATCH|DELETE)\s+\/repos\//u, "write-capable GitHub API request"],
  ];
  for (const [pattern, label] of forbiddenPatterns) {
    if (pattern.test(workflow)) {
      errors.push(`verifier must not contain ${label}`);
    }
  }
  if (/\$\{\{\s*inputs\./u.test(script)) {
    errors.push("manual input must not be interpolated into the script body");
  }
  return errors;
}

function requireSafeVerifier(workflow) {
  assert.deepEqual(verifierSafetyErrors(workflow), []);
}

test("the Course CI metadata verifier is on-demand, read-only, and source-head-bound", async () => {
  const [workflow, releaseEvidencePolicy] = await Promise.all([
    readVerifierWorkflow(),
    loadReleaseEvidencePolicy(siteRoot),
  ]);
  requireSafeVerifier(workflow);

  const { policy } = releaseEvidencePolicy;
  assert.ok(workflow.includes(`repository: \"${policy.repository}\"`));
  assert.ok(workflow.includes(`workflowId: ${policy.courseCi.workflowId}`));
  assert.ok(workflow.includes(`workflowName: \"${policy.courseCi.workflowName}\"`));
  assert.ok(workflow.includes(`workflowPath: \"${policy.courseCi.workflowPath}\"`));
  assert.ok(workflow.includes(`event: \"${policy.courseCi.event}\"`));
  const requiredJobs = workflow.match(/requiredJobNames:\s*\[([\s\S]*?)\],\n\s*\}\);/u);
  assert.ok(requiredJobs, "verifier declares a bounded inline required-job list");
  assert.deepEqual(
    [...requiredJobs[1].matchAll(/"([^"]+)"/gu)].map(([, name]) => name),
    policy.courseCi.requiredJobNames,
  );
});

test("the on-demand verifier rejects automatic triggers, writes, and unvalidated script input", async () => {
  const workflow = await readVerifierWorkflow();
  const unsafeCases = [
    ["automatic workflow run", workflow.replace("workflow_dispatch:", "workflow_run:")],
    ["checkout", workflow.replace("steps:", "steps:\n      - uses: actions/checkout@deadbeef")],
    ["shell", workflow.replace("steps:", "steps:\n      - run: echo unsafe")],
    ["write permission", workflow.replace("actions: read", "actions: write")],
    [
      "script interpolation",
      workflow.replace(
        'const suppliedRunId = (process.env.ATLAS_CI_RUN_ID ?? \"\").trim();',
        'const suppliedRunId = \"${{ inputs.run_id }}\";',
      ),
    ],
    [
      "numeric validation removed",
      workflow.replace('/^[1-9]\\d*$/u.test(suppliedRunId)', "true"),
    ],
  ];
  for (const [label, unsafeWorkflow] of unsafeCases) {
    assert.ok(verifierSafetyErrors(unsafeWorkflow).length > 0, `${label} is rejected`);
  }
});
