import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.setTimeout(90_000);

async function expectRenderedMermaidDiagram(page: Page) {
  await expect(page.locator(".mermaid-figure svg[role='img']").first()).toBeVisible({
    timeout: 45_000,
  });
}

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const summary = results.violations
    .map(
      (violation) =>
        `${violation.id} (${violation.impact ?? "unknown"}): ${violation.help}\n${violation.nodes
          .map(
            (node) =>
              `  ${node.target.join(", ")} — ${node.failureSummary ?? "No failure summary."}`,
          )
          .join("\n")}`,
    )
    .join("\n\n");

  expect(results.violations, summary || "Axe found no violations.").toEqual([]);
}

const browserAuditRoutes: ReadonlyArray<{
  name: string;
  path: string;
  ready: (page: Page) => Promise<void>;
}> = [
  {
    name: "landing page",
    path: "/",
    ready: async (page) => {
      await expect(
        page.getByRole("heading", { name: /learn to see the whole system/i }),
      ).toBeVisible();
    },
  },
  {
    name: "60-day route",
    path: "/route",
    ready: async (page) => {
      await expect(
        page.getByRole("heading", { name: /one connected argument/i }),
      ).toBeVisible();
    },
  },
  {
    name: "placement diagnostic",
    path: "/diagnostic",
    ready: async (page) => {
      await expect(
        page.getByRole("heading", { name: /quick to answer/i }),
      ).toBeVisible();
    },
  },
  {
    name: "Mermaid-heavy Module 6 reader",
    path: "/modules/06-representation-memory-sequences-linked",
    ready: async (page) => {
      await expect(
        page.getByRole("heading", {
          name: "Representation, Memory, Sequences, and Linked Structures",
        }),
      ).toBeVisible();
      await expectRenderedMermaidDiagram(page);
    },
  },
  {
    name: "Module 18 reader",
    path: "/modules/18-operating-systems-resource-mediation",
    ready: async (page) => {
      await expect(
        page.getByRole("heading", { name: "Operating Systems and Resource Mediation" }),
      ).toBeVisible();
    },
  },
  {
    name: "Module 22 trust studio",
    path: "/modules/22-security-privacy-trust-boundaries",
    ready: async (page) => {
      await expect(
        page.getByRole("heading", {
          name: "Atlas Trust Control Room",
          exact: true,
        }),
      ).toBeVisible();
    },
  },
  {
    name: "Module 30 probability studio",
    path: "/modules/30-probability-statistics-scientific-inference",
    ready: async (page) => {
      await expect(
        page.getByRole("heading", {
          name: "Probability & Inference Studio",
          exact: true,
        }),
      ).toBeVisible();
    },
  },
];

for (const route of browserAuditRoutes) {
  test(`axe finds no detected violations on the ${route.name}`, async ({ page }) => {
    await page.goto(route.path);
    await route.ready(page);
    await expectNoAxeViolations(page);
  });
}

for (const route of [
  { name: "landing page", path: "/" },
  { name: "60-day route", path: "/route" },
] as const) {
  test(`the ${route.name} skip link moves keyboard focus to main content`, async ({
    page,
  }) => {
    await page.goto(route.path);
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });
}

test("Module 6 renders a labelled concept diagram and technical fallback", async ({
  page,
}) => {
  await page.goto("/modules/06-representation-memory-sequences-linked");
  await expectRenderedMermaidDiagram(page);
  const diagram = page.locator(".mermaid-figure svg[role='img']").first();
  await expect(diagram).toHaveAttribute("aria-label", /concept diagram/i);
  await expect(
    page.getByText("Diagram source (technical fallback)").first(),
  ).toBeVisible();
});

test("Module 18 retains its workbook and oral-defense route", async ({ page }) => {
  await page.goto("/modules/18-operating-systems-resource-mediation");

  await expect(
    page.getByRole("heading", { name: "Workbook-led interaction" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Oral defense: a conversation, not a verdict.",
    }),
  ).toBeVisible();
});

test("the operating-systems studio uses roving tab keyboard navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Machine & network" }).click();

  const tabs = page.getByRole("tablist", {
    name: "Operating-systems learning views",
  });
  const firstTab = tabs.getByRole("tab").first();
  const secondTab = tabs.getByRole("tab").nth(1);

  await expect(firstTab).toBeVisible();
  await firstTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(secondTab).toBeFocused();
  await expect(secondTab).toHaveAttribute("aria-selected", "true");
});

test("the diagnostic requires an answer and confidence before model reveal", async ({
  page,
}) => {
  await page.goto("/diagnostic");

  const reveal = page.getByRole("button", { name: "Reveal the model" });
  await expect(reveal).toBeDisabled();

  await page.getByRole("radio").first().check();
  await expect(reveal).toBeDisabled();

  await page.getByRole("radio", { name: /^low\b/i }).check();
  await expect(reveal).toBeEnabled();
  await reveal.click();

  await expect(
    page.getByText(/this is a useful model to repair|this model holds/i),
  ).toBeVisible();
});

test("the completed diagnostic route keeps prerequisite context and passes Axe", async ({
  page,
}) => {
  await page.goto("/diagnostic");

  for (let index = 0; index < 20; index += 1) {
    await page.getByRole("radio").first().check();
    await page.getByRole("radio", { name: /^low\b/i }).check();
    await page.getByRole("button", { name: "Reveal the model" }).click();

    if (index < 19) {
      await page.getByRole("button", { name: /next question/i }).click();
    }
  }

  await page.getByRole("button", { name: /build my learning route/i }).click();

  const resultsHeading = page.getByRole("heading", {
    name: /a map of what to transfer, verify, and repair/i,
  });
  await expect(resultsHeading).toBeVisible();
  await expect(resultsHeading).toBeFocused();
  await expect(
    page.getByText(/direct academic prerequisite/i).first(),
  ).toBeVisible();

  const repairLink = page
    .getByRole("link", { name: /rebuild with published module/i })
    .first();
  await repairLink.focus();
  await expect(repairLink).toBeFocused();
  await expectNoAxeViolations(page);
});

test("the Module 22 trust studio requires prediction and confidence before reveal", async ({
  page,
}) => {
  await page.goto("/modules/22-security-privacy-trust-boundaries");

  const prediction = page.getByRole("region", { name: "boundary prediction" });
  const reveal = prediction.getByRole("button", {
    name: "Commit prediction & reveal evidence",
  });
  await expect(reveal).toBeDisabled();

  const choice = prediction.getByRole("radio").first();
  await choice.focus();
  await page.keyboard.press("Space");
  await expect(choice).toBeChecked();

  const confidence = prediction.getByRole("radio", { name: /guess/i });
  await confidence.focus();
  await page.keyboard.press("Space");
  await expect(confidence).toBeChecked();
  await expect(reveal).toBeEnabled();
  await reveal.click();
  await expect(reveal).toHaveText("Refresh the evidence");
});

test("the Module 30 studio requires prediction and confidence before explanation", async ({
  page,
}) => {
  await page.goto("/modules/30-probability-statistics-scientific-inference");

  const prediction = page.getByRole("radiogroup", {
    name: "Prediction for base-rate",
  });
  const reveal = page.getByRole("button", {
    name: "Reveal explanation packet",
  });
  await expect(reveal).toBeDisabled();

  const choice = prediction.getByRole("radio").first();
  await choice.focus();
  await page.keyboard.press("Space");
  await expect(choice).toHaveAttribute("aria-checked", "true");
  await page.getByRole("group", { name: "Confidence" }).getByRole("button", {
    name: "Guess",
  }).click();
  await expect(reveal).toBeEnabled();
  await reveal.click();
  await expect(reveal).toHaveText("Explanation revealed");
});
