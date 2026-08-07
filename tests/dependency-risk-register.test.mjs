import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const riskRegisterUrl = new URL(
  "../docs/DEPENDENCY_RISK_REGISTER.md",
  import.meta.url,
);
const workspaceUrl = new URL("../pnpm-workspace.yaml", import.meta.url);
const lockfileUrl = new URL("../pnpm-lock.yaml", import.meta.url);

test("the dependency ledger records the withdrawn brace-expansion alert without a false closure claim", async () => {
  const [riskRegister, workspace, lockfile] = await Promise.all([
    readFile(riskRegisterUrl, "utf8"),
    readFile(workspaceUrl, "utf8"),
    readFile(lockfileUrl, "utf8"),
  ]);

  assert.match(riskRegister, /## Withdrawn alert record/u);
  assert.match(
    riskRegister,
    /Alert number 40 has been withdrawn` \(HTTP\s*404\)/u,
  );
  assert.doesNotMatch(riskRegister, /\| \[#40\][^\n]*await branch CI/iu);
  assert.match(
    riskRegister,
    /Withdrawal does \*\*not\*\* establish[\s\S]*security-clean state/u,
  );
  assert.match(
    workspace,
    /"minimatch@3>brace-expansion": 1\.1\.18/u,
  );
  assert.match(lockfile, /minimatch@3>brace-expansion: 1\.1\.18/u);
  assert.match(lockfile, /brace-expansion@1\.1\.18:/u);
});
