/**
 * An export approval is intentionally volatile and bound to the exact draft
 * that the learner reviewed. A changed draft requires a fresh decision.
 */
export function canExportApprovedDraft(approvedDraft, currentDraft) {
  return (
    typeof approvedDraft === "string" &&
    approvedDraft.length > 0 &&
    typeof currentDraft === "string" &&
    currentDraft.length > 0 &&
    approvedDraft === currentDraft
  );
}
