import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const previewPackagePath = new URL(
  "../content/course/synthesis-preview-conversations.v1.json",
  import.meta.url,
);

test("M25 and M26 preview conversations allow only bounded preparation artifacts", async () => {
  const previewRegistry = JSON.parse(await readFile(previewPackagePath, "utf8"));

  assert.equal(previewRegistry.schemaVersion, 1);
  assert.equal(previewRegistry.conversationVersion, "v1");
  assert.equal(previewRegistry.kind, "atlas-synthesis-preview-conversations");
  assert.equal(
    previewRegistry.canonicalCourseGraph,
    "content/course/course-graph.v2.json",
  );
  assert.equal(
    previewRegistry.liveCodexLearningWorkflow,
    "content/course/live-codex-learning-workflow.v2.json",
  );

  assert.ok(Array.isArray(previewRegistry.packages));
  assert.equal(previewRegistry.packages.length, 2);
  const packageIds = previewRegistry.packages.map((previewPackage) => previewPackage.moduleId);
  assert.equal(new Set(packageIds).size, packageIds.length);
  assert.deepEqual([...packageIds].sort(), ["m25", "m26"]);

  const packages = new Map(
    previewRegistry.packages.map((previewPackage) => [previewPackage.moduleId, previewPackage]),
  );

  const m25 = packages.get("m25");
  assert.equal(m25.mode, "preview-only");
  assert.equal(m25.fullSessionEstimate, "45–60 minutes");
  assert.equal(m25.allowedArtifact.tag, "PREVIEW ONLY");
  assert.match(m25.allowedArtifact.boundary, /no dossier, project, handoff, unlock, or completion claim/i);
  assert.equal(m25.futureForwardContext.kind, "future-module-without-handoff");
  assert.equal(m25.futureForwardContext.moduleId, "m26");
  assert.match(m25.futureForwardContext.boundary, /not a handoff or unlock/i);
  assert.deepEqual(m25.notionEvidencePacket.fields, [
    "claim",
    "baseline and owner",
    "needed or missing advanced receipt",
    "preview decision",
    "one future-M26 question",
  ]);

  const m26 = packages.get("m26");
  assert.equal(m26.mode, "preview-only");
  assert.equal(m26.fullSessionEstimate, "60–90 minutes");
  assert.equal(m26.allowedArtifact.tag, "REHEARSAL ONLY");
  assert.match(m26.allowedArtifact.boundary, /no release decision, dossier, project, studio, or completion claim/i);
  assert.equal(m26.futureForwardContext.kind, "specialization-question-without-handoff");
  assert.equal(m26.futureForwardContext.moduleId, null);
  assert.deepEqual(m26.notionEvidencePacket.fields, [
    "claim and non-goal",
    "owner and source/test anchor",
    "architecture trace and failure boundary",
    "missing advanced receipt",
    "next falsifier or specialization question",
  ]);

  for (const previewPackage of packages.values()) {
    assert.match(previewPackage.teachingAssistantClarificationPrompt, /preview conversation—not an oral defense/i);
    assert.match(previewPackage.studyPartnerPrompt, /visible chat as a whiteboard/i);
    assert.match(previewPackage.teachingAssistantClarificationPrompt, /already-configured designated Teaching Assistant role/i);
    assert.match(previewPackage.studyPartnerPrompt, /already-configured designated Study Partner role/i);
    assert.match(previewPackage.teachingAssistantClarificationPrompt, /does not configure a chat or grant recording authority/i);
    assert.match(previewPackage.studyPartnerPrompt, /does not configure a chat or grant recording authority/i);
    assert.match(previewPackage.notionEvidencePacket.conditions, /records on/i);
    assert.match(previewPackage.notionEvidencePacket.conditions, /pause records|off-record/i);
    assert.match(previewPackage.notionEvidencePacket.conditions, /at most one concise/i);
    assert.match(previewPackage.notionEvidencePacket.conditions, /chat-level intent/i);
    assert.match(previewPackage.notionEvidencePacket.conditions, /Notion unavailable — local session note/i);
    assert.match(previewPackage.notionEvidencePacket.boundary, /portal.*notion write/i);
    assert.match(previewPackage.notionEvidencePacket.boundary, /raw voice|transcript/i);
    assert.match(previewPackage.notionEvidencePacket.boundary, /fresh or generic chat.*no recording authority/i);
  }
});

test("the preview reader has a distinct copyable conversation surface, not a restored oral defense", async () => {
  const [page, component, guidedRoute, liveWorkflowGuide] = await Promise.all([
    readFile(new URL("../app/modules/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/modules/[slug]/ModulePreviewConversation.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../docs/PRIVATE_GUIDED_LEARNING_ROUTE.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/LIVE_CODEX_LEARNING_WORKFLOW.md", import.meta.url), "utf8"),
  ]);

  assert.match(page, /getSynthesisPreviewConversation/u);
  assert.match(page, /<ModulePreviewConversation/u);
  assert.match(component, /Preview conversation—not an oral defense./u);
  assert.match(component, /Copy Teaching Assistant preparation/u);
  assert.match(component, /Copy Study Partner preparation/u);
  assert.match(component, /Copy the concise evidence packet/u);
  assert.match(component, /Set up the Teaching Assistant chat first/u);
  assert.match(component, /Set up the Study Partner chat first/u);
  assert.match(component, /href="\/learning-partners"/u);
  assert.match(component, /never grants record authority/u);
  assert.match(component, /unconfigured\s+or unavailable chat, no write occurs/u);
  assert.match(component, /navigator\.clipboard\.writeText/u);
  assert.doesNotMatch(component, /<ModuleOralDefense|<ModuleTextOralDefense/u);
  assert.doesNotMatch(component, /localStorage|\bfetch\s*\(/u);
  assert.match(guidedRoute, /synthesis-preview-conversations\.v1\.json/u);
  assert.match(guidedRoute, /Codex preview conversation/u);
  assert.doesNotMatch(guidedRoute, /Run the M25 evidence-synthesis orientation/u);
  assert.match(liveWorkflowGuide, /M25\/M26 portal exception/u);
  assert.match(liveWorkflowGuide, /\*{0,2}preview-preparation\*{0,2}.*full oral defense, studio,\s+project,\s+route unlock, or completion claim/isu);
});
