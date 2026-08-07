import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const addendumUrl = new URL(
  "../content/source-maps/module20_networks_protocols_source_audit_addendum.md",
  import.meta.url,
);
const workbookUrl = new URL(
  "../content/modules/20_networks_application_protocols.md",
  import.meta.url,
);
const referenceUrl = new URL(
  "../public/downloads/module20_reference.py",
  import.meta.url,
);
const referenceTestsUrl = new URL(
  "../public/downloads/test_module20_reference.py",
  import.meta.url,
);
const releaseInputPolicyUrl = new URL(
  "../content/course/release-input-policy.v1.json",
  import.meta.url,
);
const contractPacketUrl = new URL(
  "../content/course/contracts/legacy-module-contract-packets.v1.json",
  import.meta.url,
);

test("M20 preserves the historical source-path defect while naming one current canonical learner model", async () => {
  const [
    addendum,
    workbook,
    reference,
    referenceTests,
    releaseInputPolicySource,
    contractPacketSource,
  ] = await Promise.all([
    readFile(addendumUrl, "utf8"),
    readFile(workbookUrl, "utf8"),
    readFile(referenceUrl, "utf8"),
    readFile(referenceTestsUrl, "utf8"),
    readFile(releaseInputPolicyUrl, "utf8"),
    readFile(contractPacketUrl, "utf8"),
  ]);
  const releaseInputPolicy = JSON.parse(releaseInputPolicySource);
  const contractPackets = JSON.parse(contractPacketSource);
  const m20Packet = contractPackets.modules.find(
    (packet) => packet.moduleId === "m20",
  );

  assert.match(addendum, /authoring-only/u);
  assert.match(
    addendum,
    /not a release-input-policy\s+artifact or a public learner download/u,
  );
  assert.match(addendum, /does \*\*not\*\* change the[\s\S]*publication state/u);
  assert.match(addendum, /expired Internet-Draft/iu);
  assert.match(
    addendum,
    /Historical audit observation[\s\S]*work\/module20_reference\.py[\s\S]*absent/u,
  );
  assert.match(
    addendum,
    /Current source-truth repair[\s\S]*public\/downloads\/module20_reference\.py/u,
  );
  assert.match(
    workbook,
    /canonical checked-in learner source is `public\/downloads\/module20_reference\.py`/u,
  );
  assert.doesNotMatch(workbook, /work\/module20_reference\.py/u);
  assert.match(
    workbook,
    /python public\/downloads\/test_module20_reference\.py/u,
  );
  assert.match(
    workbook,
    /python public\/downloads\/module20_reference\.py/u,
  );
  assert.match(workbook, /Download-only path/u);
  assert.match(
    workbook,
    /Save both downloaded files in the same local folder/u,
  );
  assert.match(workbook, /python test_module20_reference\.py/u);
  assert.match(
    workbook,
    /python module20_reference\.py --scenario timeout_then_lookup/u,
  );
  assert.match(
    workbook,
    /python \.\\public\\downloads\\module20_reference\.py --scenario connection_error/u,
  );
  assert.match(
    workbook,
    /python \.\\public\\downloads\\module20_reference\.py --scenario timeout_then_lookup/u,
  );
  assert.match(
    workbook,
    /python \.\\public\\downloads\\module20_reference\.py --scenario matching_response/u,
  );
  assert.doesNotMatch(workbook, /& \$py/u);
  assert.match(
    reference,
    /"python public\/downloads\/module20_reference\.py "\s*\n\s*f"--scenario \{scenario\}"/u,
  );
  assert.match(
    referenceTests,
    /"python public\/downloads\/module20_reference\.py "\s*\n\s*"--scenario timeout_then_lookup"/u,
  );
  assert.match(
    referenceTests,
    /packet\["canonical_command_base"\], "repository root"/u,
  );
  assert.deepEqual(
    releaseInputPolicy.allowlistedDownloadPaths.filter((path) =>
      path.includes("module20_reference.py"),
    ),
    [
      "public/downloads/module20_reference.py",
      "public/downloads/test_module20_reference.py",
    ],
  );
  assert.ok(m20Packet);
  assert.equal(m20Packet.humanReviewState, "not-reviewed");
  assert.equal(m20Packet.publicationEffect, "none");
  assert.deepEqual(
    m20Packet.implementationArtifacts.find(
      (artifact) => artifact.id === "m20-reference-model",
    ).paths,
    [
      "public/downloads/module20_reference.py",
      "public/downloads/test_module20_reference.py",
    ],
  );
});
