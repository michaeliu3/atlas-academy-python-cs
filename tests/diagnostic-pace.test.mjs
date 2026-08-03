import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  appendDiagnosticPaceDecision,
  diagnosticPacePolicySource,
  diagnosticPaceOptions,
} from "../lib/diagnostic-pace.js";

test("a diagnostic pace decision is explicit, temporary, and honest in the learner brief", () => {
  const brief = "Atlas Academy — Module 0 learning brief";

  assert.equal(
    appendDiagnosticPaceDecision(brief, null),
    brief,
    "an unselected pace must not fabricate a plan in a learning brief",
  );
  assert.equal(
    appendDiagnosticPaceDecision(brief, "unknown"),
    brief,
    "an unknown pace must fail closed instead of inventing a route",
  );

  const ninetyDay = appendDiagnosticPaceDecision(brief, "90-day");
  assert.match(ninetyDay, /Pace decision: 90-day core/u);
  assert.match(ninetyDay, /20–25 hours\/week/u);
  assert.match(ninetyDay, /Recalibrate after seven days/u);
  assert.match(ninetyDay, /does not unlock modules or record completion/u);
});

test("the completed diagnostic presents all three pace options without defaulting or persisting one", async () => {
  assert.deepEqual(
    diagnosticPaceOptions.map(({ id }) => id),
    ["60-day", "90-day", "180-day"],
  );
  assert.deepEqual(
    diagnosticPaceOptions.map(({ weeklyHours }) => weeklyHours),
    ["35–45 hours/week", "20–25 hours/week", "10–15 hours/week"],
  );
  assert.equal(
    diagnosticPacePolicySource,
    "docs/LEARNER_ROUTE_PLANS.md#choose-a-pace-from-evidence-not-optimism",
  );

  const [experience, styles, routePlans] = await Promise.all([
    readFile(
      new URL("../app/diagnostic/DiagnosticExperience.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../docs/LEARNER_ROUTE_PLANS.md", import.meta.url), "utf8"),
  ]);
  for (const { weeklyHours } of diagnosticPaceOptions) {
    assert.ok(routePlans.includes(weeklyHours), `${weeklyHours} must match the planning policy`);
  }
  assert.match(routePlans, /^## Choose a pace from evidence, not optimism$/mu);
  assert.match(routePlans, /^### Seven-day calibration rule$/mu);
  assert.match(experience, /appendDiagnosticPaceDecision\(learningBrief, selectedPaceId\)/u);
  assert.match(experience, /name="diagnostic-pace"/u);
  assert.match(experience, /temporary planning choice/u);
  assert.match(experience, /does not unlock a module or\s+create a record/u);
  assert.match(
    experience,
    /const \[selectedPaceId, setSelectedPaceId\] = useState<string \| null>\(null\)/u,
  );
  assert.match(
    experience,
    /function selectDiagnosticPace\(paceId: string\) \{[\s\S]*copyAttemptVersionRef\.current \+= 1;[\s\S]*setSelectedPaceId\(paceId\);[\s\S]*setApprovedLearningBrief\(null\);[\s\S]*setCopyState\("idle"\);/u,
  );
  assert.match(
    experience,
    /async function copyLearningBrief\(\) \{[\s\S]*const copyAttemptVersion = copyAttemptVersionRef\.current;[\s\S]*if \(copyAttemptVersion === copyAttemptVersionRef\.current\) \{[\s\S]*setCopyState\("copied"\);[\s\S]*catch \{[\s\S]*if \(copyAttemptVersion === copyAttemptVersionRef\.current\) \{[\s\S]*setCopyState\("failed"\);/u,
  );
  assert.match(experience, /setSelectedPaceId\(null\)/u);
  assert.match(experience, /persistDiagnosticProgress\(storage, attempt\)/u);
  assert.doesNotMatch(experience, /persistDiagnosticPace/u);
  assert.match(styles, /\.diagnostic-pace-option:has\(input:focus-visible\)/u);
  assert.match(styles, /\.diagnostic-pace-options/u);
});
