import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

import { openGitIndexSnapshot } from "../../../scripts/git-index-snapshot.mjs";
import { validateReleaseInputLedger } from "../../../scripts/release-input-ledger.mjs";

const execFileAsync = promisify(execFile);

function canonicalText(value) {
  return value.replace(/\r\n?/gu, "\n");
}

function sha256(value) {
  return createHash("sha256").update(canonicalText(value), "utf8").digest("hex");
}

async function git(root, args) {
  return execFileAsync("git", args, { cwd: root, encoding: "utf8" });
}

async function writeFixture(root, repositoryPath, contents) {
  const target = join(root, repositoryPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, "utf8");
}

async function commitFixture(root) {
  await git(root, ["add", "."]);
  await git(root, ["commit", "--quiet", "-m", "fixture"]);
}

async function createLedgerFixture({ ledgerHash = null, includeUnexpectedInput = false } = {}) {
  const root = await mkdtemp(join(tmpdir(), "atlas-release-input-ledger-"));
  await git(root, ["init", "--quiet"]);
  await git(root, ["config", "user.email", "tests@example.invalid"]);
  await git(root, ["config", "user.name", "Atlas test"]);
  const source = "# Exact input\n";
  const inputPath = "content/course/example.md";
  await writeFixture(root, inputPath, source);
  const inputs = [{ path: inputPath, sha256: ledgerHash ?? sha256(source) }];
  if (includeUnexpectedInput) {
    const unexpectedPath = "content/course/unexpected.md";
    const unexpectedSource = "# Unrelated input\n";
    await writeFixture(root, unexpectedPath, unexpectedSource);
    inputs.push({ path: unexpectedPath, sha256: sha256(unexpectedSource) });
  }
  await writeFixture(
    root,
    "content/course/release-inputs.v1.json",
    `${JSON.stringify({
      schemaVersion: 1,
      generatedBy: "scripts/sync-modules.mjs",
      courseGraphSchemaVersion: 2,
      contractVersion: "v3",
      inputs,
    }, null, 2)}\n`,
  );
  await commitFixture(root);
  return { root, inputPath };
}

test("a release-input ledger is clean-snapshot bound, hashed, and complete for required inputs", async (t) => {
  const { root, inputPath } = await createLedgerFixture();
  t.after(() => rm(root, { recursive: true, force: true }));

  const snapshot = await openGitIndexSnapshot(root);
  const report = await validateReleaseInputLedger({
    siteRoot: root,
    snapshot,
    requiredInputPaths: [inputPath],
  });

  assert.deepEqual(report.inputPaths, [inputPath]);
  assert.deepEqual(report.requiredInputPaths, [inputPath]);
});

test("a release-input ledger rejects a required path absent from its allowlist", async (t) => {
  const { root, inputPath } = await createLedgerFixture();
  t.after(() => rm(root, { recursive: true, force: true }));

  const snapshot = await openGitIndexSnapshot(root);
  await assert.rejects(
    () => validateReleaseInputLedger({
      siteRoot: root,
      snapshot,
      requiredInputPaths: [inputPath, "content/course/missing-from-ledger.md"],
    }),
    /required release input is absent from the release-input ledger/i,
  );
});

test("a release-input ledger rejects an allowlisted path absent from its expected closure", async (t) => {
  const { root, inputPath } = await createLedgerFixture({ includeUnexpectedInput: true });
  t.after(() => rm(root, { recursive: true, force: true }));
  const snapshot = await openGitIndexSnapshot(root);

  await assert.rejects(
    () => validateReleaseInputLedger({
      siteRoot: root,
      snapshot,
      requiredInputPaths: [inputPath],
    }),
    /ledger input is absent from the expected release-input closure/i,
  );
});

test("a release-input ledger rejects a stale snapshot or a mismatched content hash", async (t) => {
  const stale = await createLedgerFixture();
  t.after(() => rm(stale.root, { recursive: true, force: true }));
  const staleSnapshot = await openGitIndexSnapshot(stale.root);
  await writeFixture(stale.root, stale.inputPath, "# Later input\n");
  await git(stale.root, ["add", stale.inputPath]);
  await assert.rejects(
    () => validateReleaseInputLedger({
      siteRoot: stale.root,
      snapshot: staleSnapshot,
      requiredInputPaths: [stale.inputPath],
    }),
    /INDEX_SNAPSHOT_STALE/i,
  );

  const mismatched = await createLedgerFixture({ ledgerHash: "0".repeat(64) });
  t.after(() => rm(mismatched.root, { recursive: true, force: true }));
  const mismatchedSnapshot = await openGitIndexSnapshot(mismatched.root);
  await assert.rejects(
    () => validateReleaseInputLedger({
      siteRoot: mismatched.root,
      snapshot: mismatchedSnapshot,
      requiredInputPaths: [mismatched.inputPath],
    }),
    /hash must match the captured Git-index input/i,
  );
});
