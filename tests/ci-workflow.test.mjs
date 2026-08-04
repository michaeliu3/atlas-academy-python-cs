import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  courseWorkflowRunsCommand,
  teachingModelRuntimeExerciseVerifierCommand,
} from "../scripts/module-contract-registry.mjs";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(testDirectory, "..");
const workflowPath = resolve(siteRoot, ".github", "workflows", "ci.yml");

async function readCourseWorkflow() {
  return (await readFile(workflowPath, "utf8")).replace(/\r\n?/gu, "\n");
}

test("Course CI pins every third-party action to a reviewed immutable commit", async () => {
  const workflow = await readCourseWorkflow();
  const actionReferences = [...workflow.matchAll(/^\s*uses:\s+([^@\s]+)@([^\s#]+)\s+#\s+v[\d.]+\s*$/gmu)];
  assert.ok(actionReferences.length > 0, "Course CI declares third-party action references");
  for (const [, action, revision] of actionReferences) {
    assert.match(action, /^[a-z0-9-]+\/[a-z0-9-]+$/u);
    assert.match(revision, /^[0-9a-f]{40}$/u, `${action} uses a full commit SHA`);
  }
  assert.doesNotMatch(workflow, /^\s*uses:\s+[^@\s]+@v\d/imu);
  assert.match(workflow, /actions\/checkout@11bd71901bbe5b1630ceea73d27597364c9af683/u);
  assert.match(workflow, /actions\/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020/u);
  assert.match(workflow, /actions\/setup-python@a26af69be951a213d495a4c3e4e4022e16d87065/u);
});

test("Course CI skips hosted jobs for draft PR updates but reruns them when review begins", async () => {
  const workflow = await readCourseWorkflow();

  assert.match(
    workflow,
    /run-name: >-\n\s*atlas-course-ci-\$\{\{ github\.event_name == 'pull_request'/mu,
    "Course CI records whether a run is a draft preflight or a full gate",
  );

  assert.match(
    workflow,
    /pull_request:\n(?:\s*#.*\n)*\s*types:\n\s*- opened\n\s*- reopened\n\s*- ready_for_review\n(?:\s*#.*\n)*\s*- converted_to_draft\n\s*- synchronize/mu,
    "the ready-for-review transition is a full CI trigger",
  );
  assert.doesNotMatch(
    workflow,
    /^\s*workflow_dispatch:\s*$/mu,
    "Course CI must not expose an expensive manual full-suite trigger",
  );
  assert.match(
    workflow,
    /portal:\n\s*name: Portal quality gate\n\s*if: >-\n\s*github\.event_name != 'pull_request' \|\|\n\s*github\.event\.pull_request\.draft == false/mu,
    "only explicit draft pull-request updates skip the hosted quality gates",
  );
});

test("Teaching-model CI proves the runtime exercise verifier before the ordinary suite", async () => {
  const workflow = await readCourseWorkflow();
  const verifierTests = 'python -m unittest discover -s scripts -p "test_verify_teaching_model_exercises.py"';
  const verifier = teachingModelRuntimeExerciseVerifierCommand;
  const suite = 'python -m unittest discover -s public/downloads -p "test_module*_reference.py"';

  assert.ok(courseWorkflowRunsCommand(workflow, verifierTests));
  assert.ok(courseWorkflowRunsCommand(workflow, verifier));
  assert.ok(courseWorkflowRunsCommand(workflow, suite));
  assert.ok(workflow.indexOf(verifierTests) < workflow.indexOf(verifier));
  assert.ok(workflow.indexOf(verifier) < workflow.indexOf(suite));
  assert.equal(courseWorkflowRunsCommand(`# run: ${verifier}`, verifier), false);
  assert.equal(
    courseWorkflowRunsCommand(
      workflow.replace(
        `      - name: Verify discovered teaching-model suites execute reference-model code\n        run: ${verifier}`,
        `      - name: Verify discovered teaching-model suites execute reference-model code\n        if: false\n        run: ${verifier}`,
      ),
      verifier,
    ),
    false,
    "a disabled verifier step is not CI evidence",
  );
  assert.equal(
    courseWorkflowRunsCommand(
      workflow.replace(
        "    runs-on: ubuntu-latest\n    needs: portal",
        "    runs-on: ubuntu-latest\n    if: false\n    needs: portal",
      ),
      verifier,
    ),
    false,
    "a disabled teaching-model job is not CI evidence",
  );
  assert.equal(
    courseWorkflowRunsCommand(
      workflow.replace(
        `      - name: Verify discovered teaching-model suites execute reference-model code\n        run: ${verifier}`,
        `      - name: Verify discovered teaching-model suites execute reference-model code\n        continue-on-error: true\n        run: ${verifier}`,
      ),
      verifier,
    ),
    false,
    "an error-tolerant verifier step is not CI evidence",
  );
  assert.equal(
    courseWorkflowRunsCommand(
      workflow.replace(
        `      - name: Verify discovered teaching-model suites execute reference-model code\n        run: ${verifier}`,
        `      - name: Verify discovered teaching-model suites execute reference-model code\n        "if": false\n        run: ${verifier}`,
      ),
      verifier,
    ),
    false,
    "a quoted disabled verifier key is not CI evidence",
  );
  assert.equal(
    courseWorkflowRunsCommand(
      workflow.replace(
        `      - name: Verify discovered teaching-model suites execute reference-model code\n        run: ${verifier}`,
        `      - name: Verify discovered teaching-model suites execute reference-model code\n        'continue-on-error' : true\n        run: ${verifier}`,
      ),
      verifier,
    ),
    false,
    "a quoted error-tolerance key with YAML whitespace is not CI evidence",
  );
  for (const [injectedStep, label] of [
    ["shell: echo {0}", "a custom verifier shell"],
    ["working-directory: .", "a verifier working-directory override"],
    ["env:\n          PATH: /tmp/atlas-fake-bin", "a verifier environment override"],
  ]) {
    assert.equal(
      courseWorkflowRunsCommand(
        workflow.replace(
          `      - name: Verify discovered teaching-model suites execute reference-model code\n        run: ${verifier}`,
          `      - name: Verify discovered teaching-model suites execute reference-model code\n        ${injectedStep}\n        run: ${verifier}`,
        ),
        verifier,
      ),
      false,
      `${label} is not CI evidence`,
    );
  }
  assert.equal(
    courseWorkflowRunsCommand(
      workflow.replace(
        "permissions:\n  contents: read",
        "defaults:\n  run:\n    shell: echo {0}\n\npermissions:\n  contents: read",
      ),
      verifier,
    ),
    false,
    "a workflow-level shell default is not CI evidence",
  );
  assert.equal(
    courseWorkflowRunsCommand(
      workflow.replace(
        "    timeout-minutes: 15\n    strategy:",
        "    timeout-minutes: 15\n    env:\n      PATH: /tmp/atlas-fake-bin\n    strategy:",
      ),
      verifier,
    ),
    false,
    "a job-level environment override is not CI evidence",
  );
  assert.equal(
    courseWorkflowRunsCommand(
      workflow.replace(
        "    timeout-minutes: 15\n    strategy:",
        "    timeout-minutes: 15\n    defaults:\n      run:\n        shell: echo {0}\n    strategy:",
      ),
      verifier,
    ),
    false,
    "a job-level shell default is not CI evidence",
  );
  assert.equal(
    courseWorkflowRunsCommand(
      workflow.replace(
        "permissions:\n  contents: read",
        "env:\n  PATH: /tmp/atlas-fake-bin\n\npermissions:\n  contents: read",
      ),
      verifier,
    ),
    false,
    "a workflow-level environment override is not CI evidence",
  );
});
