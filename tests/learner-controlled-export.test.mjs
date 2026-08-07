import assert from "node:assert/strict";
import test from "node:test";
import { canExportApprovedDraft } from "../lib/learner-controlled-export.js";

test("a learner-controlled export approval is bound to the exact non-empty draft", () => {
  const draft = "Minimal learner-approved summary";

  assert.equal(canExportApprovedDraft(null, draft), false);
  assert.equal(canExportApprovedDraft("", draft), false);
  assert.equal(canExportApprovedDraft(draft, draft), true);
  assert.equal(canExportApprovedDraft(draft, `${draft}\nChanged boundary`), false);
  assert.equal(canExportApprovedDraft(draft, ""), false);
});
