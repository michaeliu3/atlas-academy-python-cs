import { expect, test } from "@playwright/test";

test("M1 keeps a multiple-choice rationale local and hidden until answer plus confidence", async ({
  page,
}) => {
  await page.goto("/modules/01-values-state-execution");

  // This public, accessible fieldset is the learner seam: it contains one
  // A–D prediction, its confidence calibration, and the resulting rationale.
  const question = page
    .getByRole("region", {
      name: "Multiple-choice prediction: Answer and distractor rationales",
    })
    .first();
  const rationale = question.getByText("Answer: B.", { exact: true });
  const reveal = question.getByRole("button", {
    name: /reveal.*(?:answer|rationale)/i,
  });

  await expect(question).toBeVisible();
  await expect(rationale).toHaveCount(0);
  await expect(reveal).toBeDisabled();

  await question.getByRole("radio", { name: /^B\./ }).check();
  await expect(reveal).toBeDisabled();

  await question.getByRole("radio", { name: /^C2\b.*reasoned/i }).check();
  await expect(reveal).toBeEnabled();

  await reveal.click();
  await expect(rationale).toBeVisible();

  // A rationale repairs a model; it is not a grade, completion event, or
  // persistence confirmation.
  await expect(
    question.getByText(
      /\b(?:you (?:passed|failed)|score:|saved (?:your|this|answer|result)|recorded (?:your|this|answer|result))\b/i,
    ),
  ).toHaveCount(0);
});
