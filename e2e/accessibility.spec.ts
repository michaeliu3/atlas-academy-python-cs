import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

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

async function selectRadioWithKeyboard(page: Page, radio: Locator) {
  await radio.focus();
  await page.keyboard.press("Space");
  await expect(radio).toBeChecked();
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

  const answer = page
    .getByRole("group", { name: /choose the model that best predicts/i })
    .getByRole("radio")
    .first();
  const confidence = page.getByRole("radio", { name: /^low\b/i });

  await selectRadioWithKeyboard(page, answer);
  await expect(reveal).toBeDisabled();

  await selectRadioWithKeyboard(page, confidence);
  await expect(reveal).toBeEnabled();
  await reveal.click();

  await expect(
    page.getByText(/this is a useful model to repair|this model holds/i),
  ).toBeVisible();
});

test("the diagnostic completes next-question focus before the next keyboard answer", async ({
  page,
}) => {
  await page.goto("/diagnostic");

  const answer = page
    .getByRole("group", { name: /choose the model that best predicts/i })
    .getByRole("radio")
    .first();
  const confidence = page.getByRole("radio", { name: /^low\b/i });
  await selectRadioWithKeyboard(page, answer);
  await selectRadioWithKeyboard(page, confidence);
  const reveal = page.getByRole("button", { name: "Reveal the model" });
  await expect(reveal).toBeEnabled();
  await reveal.click();

  const feedback = page.getByText(
    /this is a useful model to repair|this model holds/i,
  );
  await expect(feedback).toBeVisible();
  await page.getByRole("button", { name: /next question/i }).click();

  await expect(page.locator(".diagnostic-question-heading h2")).toBeFocused();
  const nextAnswer = page
    .getByRole("group", { name: /choose the model that best predicts/i })
    .getByRole("radio")
    .first();
  await selectRadioWithKeyboard(page, nextAnswer);
});

test("the completed diagnostic route keeps prerequisite context and passes Axe", async ({
  page,
}) => {
  await page.goto("/diagnostic");

  for (let index = 0; index < 20; index += 1) {
    const answer = page
      .getByRole("group", { name: /choose the model that best predicts/i })
      .getByRole("radio")
      .first();
    const confidence = page.getByRole("radio", { name: /^low\b/i });

    await selectRadioWithKeyboard(page, answer);
    await selectRadioWithKeyboard(page, confidence);
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

  const exportConsentGroup = page.getByRole("group", {
    name: "Review before manual copy or print",
  });
  await expect(exportConsentGroup).toBeVisible();
  const exportConsent = exportConsentGroup.getByRole("checkbox", {
    name: /I reviewed this learning brief and approve copying or printing it myself/i,
  });
  const copyBrief = page.getByRole("button", { name: "Copy learning brief" });
  const printBrief = page.getByRole("button", { name: "Print approved brief" });
  await expect(copyBrief).toBeDisabled();
  await expect(printBrief).toBeDisabled();
  await expect(copyBrief).toHaveAttribute(
    "aria-describedby",
    "diagnostic-export-consent-note",
  );
  await expect(printBrief).toHaveAttribute(
    "aria-describedby",
    "diagnostic-export-consent-note",
  );
  await exportConsent.focus();
  await page.keyboard.press("Space");
  await expect(exportConsent).toBeChecked();
  await expect(copyBrief).toBeEnabled();
  await expect(printBrief).toBeEnabled();

  const repairLink = page
    .getByRole("link", { name: /rebuild with published module/i })
    .first();
  await repairLink.focus();
  await expect(repairLink).toBeFocused();
  await expectNoAxeViolations(page);
});

test("M19 revokes export approval when its evidence brief changes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Machine & network" }).click();

  const studio = page.locator("#concurrency-observatory");
  await expect(studio).toBeVisible();
  await studio.getByRole("tab", { name: /evidence auditor/i }).click();

  const panel = studio.locator("#concurrency-panel-evidence");
  await expect(panel).toBeVisible();
  const oracle = panel.getByRole("radio", {
    name: /all required partitions committed and candidate equals oracle/i,
  });
  await selectRadioWithKeyboard(page, oracle);
  const confidence = panel.getByRole("radio", { name: /guess/i });
  await selectRadioWithKeyboard(page, confidence);
  await panel.getByRole("button", { name: "Reveal the trace evidence" }).click();

  const brief = panel.getByRole("textbox", {
    name: "Generated agent patch review brief",
  });
  const approval = panel.getByRole("checkbox", {
    name: /I reviewed this concise, categorical brief and choose to copy it manually/i,
  });
  const copyBrief = panel.getByRole("button", {
    name: "Copy approved instructor brief",
  });
  await expect(brief).toHaveValue(/Variant: single owner/);
  await expect(approval).not.toBeChecked();
  await expect(copyBrief).toBeDisabled();
  await approval.focus();
  await page.keyboard.press("Space");
  await expect(approval).toBeChecked();
  await expect(copyBrief).toBeEnabled();

  await panel.getByRole("button", { name: "shared fold" }).click();
  await expect(brief).toHaveValue(/Variant: shared fold/);
  await expect(approval).not.toBeChecked();
  await expect(copyBrief).toBeDisabled();

  const results = await new AxeBuilder({ page })
    .include("#concurrency-panel-evidence")
    .analyze();
  expect(results.violations, "Axe found a violation in the M19 evidence panel.").toEqual([]);
});

const codecMigrationCases = [
  {
    name: "M23 language lab",
    path: "/modules/23-programming-languages-interpreters",
    heading: "Atlas Language Lab",
    legacyKey: "atlas-academy.module23-language-lab.v1",
    currentKey: "atlas-academy.module23-language-lab.v2",
    initialCoverage: "2 / 6 views revealed",
    resetCoverage: "0 / 6 views revealed",
    reset: "two-step",
    record: {
      boundary: { choice: "syntax", confidence: 4, revealed: true },
      grammar: { choice: "multiply", confidence: 3, revealed: true },
      environment: { choice: "captured", confidence: 2, revealed: false },
      semantics: { choice: "selected", confidence: 1, revealed: false },
      contract: { choice: "named", confidence: 2, revealed: false },
      bridge: { choice: "observation", confidence: 3, revealed: false },
    },
  },
  {
    name: "M24 runtime observatory",
    path: "/modules/24-cpython-performance-memory",
    heading: "Runtime Evidence Observatory",
    legacyKey: "atlas-academy.module24-runtime-observatory.v1",
    currentKey: "atlas-academy.module24-runtime-observatory.v2",
    initialCoverage: "2 / 6",
    resetCoverage: "0 / 6",
    reset: "one-step",
    record: {
      contract: { choice: "semantic", confidence: 4, revealed: true },
      graph: { choice: "audit", confidence: 3, revealed: true },
      cycle: { choice: "model", confidence: 2, revealed: false },
      lens: { choice: "traced", confidence: 1, revealed: false },
      runtime: { choice: "pinned", confidence: 2, revealed: false },
      decision: { choice: "defer", confidence: 3, revealed: false },
    },
  },
] as const;

for (const migration of codecMigrationCases) {
  test(`${migration.name} migrates valid local progress once and reset clears it`, async ({
    page,
  }) => {
    const clearedRecord = Object.fromEntries(
      Object.keys(migration.record).map((view) => [
        view,
        { choice: null, confidence: null, revealed: false },
      ]),
    );
    await page.addInitScript(
      ({ legacyKey, record }) => {
        window.localStorage.setItem(legacyKey, JSON.stringify(record));
      },
      { legacyKey: migration.legacyKey, record: migration.record },
    );
    await page.goto(migration.path);
    await expect(
      page.getByRole("heading", { name: migration.heading, exact: true }),
    ).toBeVisible();
    await expect(page.getByText(migration.initialCoverage, { exact: true })).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(
          ({ currentKey, legacyKey }) => {
            const current = window.localStorage.getItem(currentKey);
            return {
              legacy: window.localStorage.getItem(legacyKey),
              current: current ? JSON.parse(current) : null,
            };
          },
          { currentKey: migration.currentKey, legacyKey: migration.legacyKey },
        ),
      )
      .toEqual({ legacy: null, current: { version: 2, record: migration.record } });

    if (migration.reset === "two-step") {
      await page.getByRole("button", { name: "Reset saved studio" }).click();
      await page.getByRole("button", { name: "Confirm reset all" }).click();
    } else {
      await page.getByRole("button", { name: "Reset local progress" }).click();
    }

    await expect
      .poll(() =>
        page.evaluate(
          ({ currentKey, legacyKey }) => ({
            legacy: window.localStorage.getItem(legacyKey),
            current: (() => {
              const raw = window.localStorage.getItem(currentKey);
              return raw ? JSON.parse(raw) : null;
            })(),
          }),
          { currentKey: migration.currentKey, legacyKey: migration.legacyKey },
        ),
      )
      .toEqual({ legacy: null, current: { version: 2, record: clearedRecord } });
    await expect(page.getByText(migration.resetCoverage, { exact: true })).toBeVisible();
  });
}

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
  await expect(
    prediction.getByRole("button", { name: "Refresh the evidence" }),
  ).toBeVisible();
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
  await expect(
    page.getByRole("button", { name: "Explanation revealed" }),
  ).toBeVisible();
});
