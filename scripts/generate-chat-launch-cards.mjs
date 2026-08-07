import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const packs = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/module-teaching-packs.v1.json"), "utf8"),
);
const outputPath = path.join(siteRoot, "docs/CHAT_LAUNCH_CARDS.md");

function text(value) {
  return String(value ?? "—").replaceAll("\n", " ");
}

function sourceSlice(slice) {
  if (!slice?.sourcePath) return "explicit non-execution boundary";
  const lines = Number.isInteger(slice.startLine) && Number.isInteger(slice.endLine)
    ? ` lines ${slice.startLine}–${slice.endLine}`
    : "";
  return `\`${slice.sourcePath}\`${lines}`;
}

const lines = [
  "# Atlas Academy Chat Launch Cards",
  "",
  "These cards are generated from the canonical Module Teaching Pack registry. Paste the reusable role startup package from [`lib/learning-partner-prompts.ts`](../lib/learning-partner-prompts.ts) into the two designated Codex chats once, then use the module/session card below. The Teaching Assistant owns live explanation and oral defense; the Study Partner owns visible AI-paired implementation and review.",
  "",
  "> The cards are prepared-derived instructions, not learner evidence. Ask for a prediction and confidence before a reveal, keep equations and labelled code visible with prose/ASCII fallback, label observed execution versus simulation or uncertainty, and preserve the session-scoped `records on` / `pause records` / `off-record` / `end session` boundary.",
  "",
  "## Delivery cadence",
  "",
  "- Recommended route: 90 days at 20–25 focused hours/week.",
  "- Intensive first pass: 60 days at 35–45 focused hours/week.",
  "- Durable review: 180 days with spaced retrieval.",
  "- Each session: 40–55 minute TA lecture; two or three 60–90 minute Study Partner blocks across the module; 20–30 minute repair/oral defense; delayed retrieval.",
  "- Extend the calendar rather than skip a proof, trace, debugging step, or transfer task.",
  "",
  "## Cards",
  "",
];

for (const pack of packs.modules ?? []) {
  lines.push(
    `### M${String(pack.number).padStart(2, "0")} · ${text(pack.title)}`,
    "",
    `Availability: **${text(pack.availability)}** · Arc project: **${text(pack.project?.arcProjectTitle)}** · Source map: [${text(pack.sourceMap?.path)}](../${text(pack.sourceMap?.path)})`,
    "",
  );
  for (const session of pack.sessions ?? []) {
    const ta = session.taLecture.launchCard;
    const partner = session.studyPartner.launchCard;
    lines.push(
      `#### Session ${session.number} · ${text(session.title)}`,
      "",
      `**TA — ${text(ta.copyHeading)}**`,
      "",
      `1. Opening problem: ${text(ta.openingProblem)}`,
      `2. Prediction: ${text(ta.predictionPrompt)}`,
      `3. Bounded walk: ${sourceSlice(ta.boundedWalk)} — ${text(ta.boundedWalk.instruction)}`,
      `4. Whiteboard: ${ta.whiteboard.map(text).join("; ")}`,
      `5. State trace: ${text(ta.stateTrace?.format)} using ${ta.stateTrace?.columns?.map(text).join(", ")}.` ,
      `6. Changed premise: ${text(ta.changedPremise)} Pause: ${text(ta.questionPause)}`,
      `7. Artifact and handoff: ${text(ta.learnerArtifact)} → ${text(ta.studyPartnerHandoff)}`,
      "",
      `**Study Partner — ${text(partner.copyHeading)}**`,
      "",
      `1. Design brief: ${text(partner.designBrief)}`,
      `2. Before patch: ${partner.learnerBeforePatch.map(text).join("; ")}`,
      `3. Architecture: ${text(partner.architectureSketch)}`,
      `4. Starter slice: ${sourceSlice(partner.starterSlice)}`,
      `5. Visible loop: ${partner.patchSequence.map(text).join(" → ")}`,
      `6. Failure injection: ${text(partner.failureInjection)}`,
      `7. Done/review: ${partner.acceptanceCriteria.map(text).join("; ")}`,
      "",
    );
  }
}

lines.push(
  "## Source of truth",
  "",
  "The machine-readable registry is [`content/course/module-teaching-packs.v1.json`](../content/course/module-teaching-packs.v1.json). The route and access state remain canonical in [`content/course/course-graph.v2.json`](../content/course/course-graph.v2.json). Generated cards adapt to the learner in the live chat and never claim a run, oral defense, Notion write, or mastery record by themselves.",
  "",
);

const output = `${lines.join("\n")}\n`;
const checkOnly = process.argv.includes("--check");
if (checkOnly) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
  if (current !== output) throw new Error(`Chat launch cards are stale: ${path.relative(siteRoot, outputPath)}`);
  console.log(`Chat launch cards are current: ${path.relative(siteRoot, outputPath)}`);
} else {
  fs.writeFileSync(outputPath, output, "utf8");
  console.log(`Wrote ${path.relative(siteRoot, outputPath)}`);
}
