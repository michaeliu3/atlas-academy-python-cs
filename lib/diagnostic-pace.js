/**
 * Planning bands for the learner-controlled diagnostic handoff. These are
 * deliberately not route state, eligibility, or progress: choosing one only
 * makes a temporary planning assumption visible in an approved brief.
 * Source: docs/LEARNER_ROUTE_PLANS.md, "Calendar bands and seven-day
 * calibration rule."
 */
export const diagnosticPacePolicySource =
  "docs/LEARNER_ROUTE_PLANS.md#choose-a-pace-from-evidence-not-optimism";

export const diagnosticPaceOptions = [
  {
    id: "60-day",
    label: "60-day core",
    weeklyHours: "35–45 hours/week",
    summary:
      "A full-time minimum-evidence pass when you can protect roughly 5–6.5 focused hours most days without compressing gateway sessions.",
  },
  {
    id: "90-day",
    label: "90-day core",
    weeklyHours: "20–25 hours/week",
    summary:
      "Recommended starting point: the same connected route with more room for retrieval, repair, and project revision.",
    recommended: true,
  },
  {
    id: "180-day",
    label: "180-day durable route",
    weeklyHours: "10–15 hours/week",
    summary:
      "Deliberate study with spacing, larger dossiers, and room to prioritize retention and architecture judgment over speed.",
  },
];

/**
 * @param {string | null | undefined} paceId
 */
export function getDiagnosticPaceOption(paceId) {
  return diagnosticPaceOptions.find(({ id }) => id === paceId) ?? null;
}

/**
 * Append only an explicit, recognized pace selection. A missing or malformed
 * value leaves the approved learner brief untouched rather than inventing a
 * schedule, state transition, or completion record.
 *
 * @param {string} learningBrief
 * @param {string | null | undefined} paceId
 */
export function appendDiagnosticPaceDecision(learningBrief, paceId) {
  const pace = getDiagnosticPaceOption(paceId);
  if (!pace) {
    return learningBrief;
  }

  return [
    learningBrief,
    "",
    `Pace decision: ${pace.label} — ${pace.weeklyHours}.`,
    "Temporary learner-selected planning choice. Recalibrate after seven days; preserve proof/trace, prediction, transfer, and oral reflection.",
    "This changes the calendar only; it does not unlock modules or record completion.",
  ].join("\n");
}
