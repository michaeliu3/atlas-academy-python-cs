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

async function expectVisibleForcedColorFocus(control: Locator) {
  await expect(control).toHaveCSS("outline-style", "solid");
  await expect(control).toHaveCSS("outline-width", "3px");
}

async function openConcurrencyObservatory(page: Page) {
  const launch = page.locator('button[aria-controls="concurrency-observatory-panel"]');
  const panel = page.locator("#concurrency-observatory-panel");
  await expect(launch).toHaveAccessibleName("Open the concurrency observatory");
  await expect(launch).toHaveAttribute("aria-controls", "concurrency-observatory-panel");
  await expect(launch).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
  await launch.focus();
  await page.keyboard.press("Enter");
  await expect(launch).toBeFocused();
  await expect(launch).toHaveAccessibleName("Hide the concurrency observatory");
  await expect(launch).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();

  const studio = page.locator("#concurrency-observatory");
  await expect(studio).toBeVisible();
  return studio;
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
    name: "Module 1 open-material reader access boundary",
    path: "/modules/01-values-state-execution",
    ready: async (page) => {
      await expect(
        page.getByRole("heading", {
          name: "The workbook is available; formal contract and release review are still pending.",
        }),
      ).toBeVisible();
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
  {
    name: "Module 25 synthesis reference preview",
    path: "/modules/25-evidence-grounded-intelligent-systems",
    ready: async (page) => {
      await expect(
        page.getByRole("heading", {
          name: "Reference access does not advance the Core.",
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

test("Module 1 renders an authored text alternative tied to its concept diagram", async ({
  page,
}) => {
  await page.goto("/modules/01-values-state-execution");
  await expectRenderedMermaidDiagram(page);
  const figure = page.locator(
    'figure[data-atlas-visual-id="m01-evaluation-binding-transition"]',
  );
  const diagram = figure.locator("svg[role='img']");
  const alternative = figure.locator(".diagram-alternative");
  await expect(alternative).toContainText(
    "An expression is evaluated in an environment, objects are found or created",
  );
  await expect(alternative).toHaveAttribute(
    "id",
    "m01-evaluation-binding-transition-alternative",
  );
  await expect(diagram).toHaveAttribute(
    "aria-describedby",
    "m01-evaluation-binding-transition-alternative",
  );
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

test("Module 19 reader loads its registered concurrency observatory", async ({ page }) => {
  await page.goto("/modules/19-concurrency-parallelism");

  const studio = await openConcurrencyObservatory(page);
  await expect(
    studio.getByRole("heading", { name: /read the weave\. defend the history\./i }),
  ).toBeVisible();
  await expect(studio.getByRole("tab", { name: "History explorer" })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .include("#concurrency-observatory")
    .analyze();
  expect(results.violations, "Axe found a violation in the direct M19 studio.").toEqual([]);
});

test("M12 direct studio keeps tabs, prediction, confidence, and reveal keyboard-operable", async ({
  page,
}) => {
  await page.goto("/modules/12-modules-apis-types-dependencies");

  const studio = page.getByRole("article", { name: "Dependency direction workbench" });
  await expect(studio).toBeVisible();

  const tabs = studio.getByRole("tablist", {
    name: "Dependency direction workbench reasoning views",
  });
  const tabControls = await tabs.getByRole("tab").evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("aria-controls")),
  );
  expect(tabControls).toHaveLength(3);
  for (const panelId of tabControls) {
    expect(panelId).not.toBeNull();
    await expect(studio.locator(`#${panelId}`)).toHaveCount(1);
  }
  const firstTab = tabs.getByRole("tab").first();
  const secondTab = tabs.getByRole("tab").nth(1);
  await firstTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(secondTab).toBeFocused();
  await expect(secondTab).toHaveAttribute("aria-selected", "true");

  const reveal = studio.getByRole("button", {
    name: "Reveal the boundary analysis",
  });
  await expect(reveal).toBeDisabled();
  const boundaryPreservingPrediction = studio.getByRole("radio", {
    name: /keep the domain and application code dependent on eventimporter/i,
  });
  await selectRadioWithKeyboard(page, boundaryPreservingPrediction);
  await selectRadioWithKeyboard(
    page,
    studio.getByRole("radio", { name: "High confidence" }),
  );
  await expect(reveal).toBeEnabled();
  await selectRadioWithKeyboard(
    page,
    studio.getByRole("radio", { name: /annotate the importer as any/i }),
  );
  await expect(reveal).toBeDisabled();
  await selectRadioWithKeyboard(page, boundaryPreservingPrediction);
  await expect(reveal).toBeDisabled();
  await selectRadioWithKeyboard(
    page,
    studio.getByRole("radio", { name: "High confidence" }),
  );
  await expect(reveal).toBeEnabled();
  await reveal.focus();
  await page.keyboard.press("Enter");
  await expect(
    studio.getByRole("heading", {
      name: "Your prediction preserves the stated boundary.",
    }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).include("article[data-mode='dependency-direction']").analyze();
  expect(results.violations, "Axe found a violation in the direct M12 studio.").toEqual([]);
});

test("M13 direct studio keeps evidence prediction gated by confidence", async ({ page }) => {
  await page.goto("/modules/13-specifications-testing-debugging-observability");

  const studio = page.getByRole("article", { name: "Specification and debugging workbench" });
  await expect(studio).toBeVisible();
  const reveal = studio.getByRole("button", {
    name: "Reveal the boundary analysis",
  });
  await expect(reveal).toBeDisabled();
  await selectRadioWithKeyboard(
    page,
    studio.getByRole("radio", {
      name: /state the terminal-signal contract, reproduce the duplicate path/i,
    }),
  );
  await expect(reveal).toBeDisabled();
  await selectRadioWithKeyboard(
    page,
    studio.getByRole("radio", { name: "Medium confidence" }),
  );
  await expect(reveal).toBeEnabled();
  await reveal.click();
  await expect(
    studio.getByRole("heading", {
      name: "Your prediction preserves the stated boundary.",
    }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).include("article[data-mode='specification-trace']").analyze();
  expect(results.violations, "Axe found a violation in the direct M13 studio.").toEqual([]);
});

test("M20 direct studio keeps tabs, prediction, confidence, reveal, and accessibility usable", async ({
  page,
}) => {
  await page.goto("/modules/20-networks-application-protocols");

  const studio = page.locator("section[aria-labelledby='network-protocol-studio-title']");
  await expect(studio).toBeVisible();

  const tabs = studio.getByRole("tablist", { name: "Network protocol studio views" });
  const firstTab = tabs.getByRole("tab").first();
  const secondTab = tabs.getByRole("tab").nth(1);
  await firstTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(secondTab).toBeFocused();
  await expect(secondTab).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(firstTab).toBeFocused();

  const reveal = studio.getByRole("button", {
    name: "Commit prediction & reveal evidence",
  });
  await expect(reveal).toBeDisabled();
  await selectRadioWithKeyboard(
    page,
    studio.getByRole("radio", {
      name: /local resolver api returned endpoint candidates the client may attempt/i,
    }),
  );
  await expect(reveal).toBeDisabled();
  await selectRadioWithKeyboard(page, studio.getByRole("radio", { name: /3 defensible/i }));
  await expect(reveal).toBeEnabled();
  await reveal.focus();
  await page.keyboard.press("Enter");
  await expect(
    studio.getByRole("heading", { name: "Candidate is the correct boundary." }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include("section[aria-labelledby='network-protocol-studio-title']")
    .analyze();
  expect(results.violations, "Axe found a violation in the direct M20 studio.").toEqual([]);
});

for (const forcedColorsStudio of [
  {
    moduleId: "M12",
    path: "/modules/12-modules-apis-types-dependencies",
    studioName: "Dependency direction workbench",
    predictionName: /keep the domain and application code dependent on eventimporter/i,
  },
  {
    moduleId: "M13",
    path: "/modules/13-specifications-testing-debugging-observability",
    studioName: "Specification and debugging workbench",
    predictionName: /state the terminal-signal contract, reproduce the duplicate path/i,
  },
] as const) {
  test(`${forcedColorsStudio.moduleId} direct studio keeps keyboard focus and selected-state boundaries visible in forced colors`, async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto(forcedColorsStudio.path);

    const studio = page.getByRole("article", { name: forcedColorsStudio.studioName });
    const tabs = studio.getByRole("tablist");
    const firstTab = tabs.getByRole("tab").first();
    const secondTab = tabs.getByRole("tab").nth(1);
    await firstTab.focus();
    await expectVisibleForcedColorFocus(firstTab);
    await page.keyboard.press("ArrowRight");
    await expect(secondTab).toBeFocused();
    await expect(secondTab).toHaveCSS("font-weight", "800");

    const prediction = studio.getByRole("radio", {
      name: forcedColorsStudio.predictionName,
    });
    await selectRadioWithKeyboard(page, prediction);
    const selectedOption = prediction.locator("xpath=..");
    await expectVisibleForcedColorFocus(selectedOption);
    await expect(selectedOption).toHaveCSS("font-weight", "800");

    const confidence = studio.getByRole("radio", { name: "High confidence" });
    await selectRadioWithKeyboard(page, confidence);
    const reveal = studio.getByRole("button", { name: "Reveal the boundary analysis" });
    await reveal.focus();
    await expectVisibleForcedColorFocus(reveal);
  });
}

test("Module 1 exposes keyboard-reachable, module-specific companion contexts without opening them on a synthesis preview", async ({
  page,
}) => {
  await page.goto("/modules/01-values-state-execution");

  const taCopy = page.getByRole("button", {
    name: "Copy Teaching Assistant context",
  });
  const studyPartnerCopy = page.getByRole("button", {
    name: "Copy Study Partner context",
  });

  await expect(taCopy).toBeVisible();
  await expect(studyPartnerCopy).toBeVisible();
  await taCopy.focus();
  await expect(taCopy).toBeFocused();
  await studyPartnerCopy.focus();
  await expect(studyPartnerCopy).toBeFocused();
  await expect(
    taCopy.locator("xpath=..").locator("p[aria-live='polite']"),
  ).toHaveCount(1);
  await expect(
    studyPartnerCopy.locator("xpath=..").locator("p[aria-live='polite']"),
  ).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: /carry a small evidence card into module 2/i }),
  ).toBeVisible();

  await page
    .getByText("Show the full Teaching Assistant context for manual copying")
    .click();
  await expect(
    page.getByLabel("Scrollable full Teaching Assistant context"),
  ).toContainText("accessible whiteboard");
  await expect(
    page.getByLabel("Scrollable full Teaching Assistant context"),
  ).toContainText("display math");

  await page.goto("/modules/25-evidence-grounded-intelligent-systems");
  await expect(
    page.getByRole("heading", {
      name: "Reference access does not advance the Core.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copy Teaching Assistant context" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Copy Study Partner context" }),
  ).toHaveCount(0);
});

test("the operating-systems studio uses roving tab keyboard navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Machine & network lab" }).click();

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

test("M18 resumes only its bounded v3 prediction evidence and reset leaves no record", async ({
  page,
}) => {
  const legacyKey = "atlas-academy.module18-os-studio.v2";
  const currentKey = "atlas-academy.module18-os-studio.v3";
  const record = {
    boundary: {
      step: 2,
      choice: "crossing",
      confidence: 4,
      revealed: true,
    },
    translation: {
      process: "B",
      virtualAddress: 0x2a3f,
      access: "write",
      pte: {
        valid: true,
        present: true,
        frame: 0x52,
        permissions: "r-x",
        fileBacked: false,
      },
      vpn: 0x2a,
      offset: 0x3f,
      outcome: "protection",
      physical: null,
      confidence: 3,
      revealed: true,
    },
    publication: {
      scenario: "abrupt",
      phase: 8,
      choice: "unknown",
      confidence: 2,
      revealed: true,
    },
  };

  await page.goto("/");
  await page.evaluate(
    ({ legacyKey, currentKey, record }) => {
      window.localStorage.setItem(
        legacyKey,
        JSON.stringify({ activeView: "shutdown", vmPredictedVpn: "2Agarbage" }),
      );
      window.localStorage.setItem(
        currentKey,
        JSON.stringify({ version: 3, record }),
      );
    },
    { legacyKey, currentKey, record },
  );
  await page.reload();
  await page.getByRole("button", { name: "Machine & network lab" }).click();
  const osStudio = page.locator(".os-studio");

  await osStudio.getByRole("tab", { name: /translate/i }).click();
  await expect(osStudio.getByLabel("VPN (hex)")).toHaveValue("2A");
  await expect(osStudio.getByLabel("Offset (hex)")).toHaveValue("3F");
  await expect(osStudio.getByText("Outcome aligned")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey, currentKey }) => ({
          legacy: window.localStorage.getItem(legacyKey),
          current: JSON.parse(window.localStorage.getItem(currentKey) ?? "null"),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: { version: 3, record } });

  await osStudio.getByRole("button", { name: "Reset saved studio" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey, currentKey }) => ({
          legacy: window.localStorage.getItem(legacyKey),
          current: window.localStorage.getItem(currentKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });
  await page.reload();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey, currentKey }) => ({
          legacy: window.localStorage.getItem(legacyKey),
          current: window.localStorage.getItem(currentKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });
});

test("M18 clears obsolete saved evidence when its final prediction context changes", async ({
  page,
}) => {
  const currentKey = "atlas-academy.module18-os-studio.v3";
  await page.goto("/");
  await page.getByRole("button", { name: "Machine & network lab" }).click();
  const osStudio = page.locator(".os-studio");

  await osStudio.getByRole("button", { name: "User mode" }).click();
  await osStudio.getByRole("button", { name: /unsure/i }).click();
  await osStudio
    .getByRole("button", { name: "Reveal boundary evidence" })
    .click();
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), currentKey))
    .not.toBeNull();

  await osStudio.getByRole("button", { name: /Runtime preparation/ }).click();
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), currentKey))
    .toBeNull();
  await page.reload();
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), currentKey))
    .toBeNull();
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

test("the diagnostic stores only v3 triads, resumes them, and reset leaves no record", async ({
  page,
}) => {
  const legacyKey = "atlas-academy:diagnostic:intermediate-advanced-v2";
  const currentKey = "atlas-academy:diagnostic:intermediate-advanced-v3";
  await page.goto("/diagnostic");

  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey, currentKey }) => ({
          legacy: window.localStorage.getItem(legacyKey),
          current: window.localStorage.getItem(currentKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });

  const answer = page
    .getByRole("group", { name: /choose the model that best predicts/i })
    .getByRole("radio")
    .first();
  const confidence = page.getByRole("radio", { name: /^low\b/i });
  await selectRadioWithKeyboard(page, answer);
  await selectRadioWithKeyboard(page, confidence);

  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey, currentKey }) => {
          const current = JSON.parse(
            window.localStorage.getItem(currentKey) ?? "null",
          );
          const record = current?.record ?? {};
          return {
            legacy: window.localStorage.getItem(legacyKey),
            envelopeKeys: Object.keys(current ?? {}).sort(),
            questionCount: Object.keys(record).length,
            firstGate: Object.values(record)[0],
            retainsAttemptMetadata: [
              "currentQuestionId",
              "completed",
              "updatedAt",
              "assessmentVersion",
            ].some((key) => Object.hasOwn(record, key)),
          };
        },
        { legacyKey, currentKey },
      ),
    )
    .toEqual({
      legacy: null,
      envelopeKeys: ["record", "version"],
      questionCount: 20,
      firstGate: { choice: "A", confidence: "low", revealed: false },
      retainsAttemptMetadata: false,
    });

  await page.reload();
  await expect(page.getByText("Welcome back.")).toBeVisible();
  await page.getByRole("button", { name: "Reset all answers" }).click();
  await page.getByRole("button", { name: "Confirm reset" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey, currentKey }) => ({
          legacy: window.localStorage.getItem(legacyKey),
          current: window.localStorage.getItem(currentKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });
  await page.reload();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey, currentKey }) => ({
          legacy: window.localStorage.getItem(legacyKey),
          current: window.localStorage.getItem(currentKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });
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
    .getByRole("link", { name: /rebuild with open module/i })
    .first();
  await repairLink.focus();
  await expect(repairLink).toBeFocused();
  await expectNoAxeViolations(page);
});

test("M19 revokes export approval when its evidence brief changes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Machine & network lab" }).click();

  const studio = await openConcurrencyObservatory(page);
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

test("M19 keeps only its six prediction gates in v3 local progress and reset leaves no default record", async ({
  page,
}) => {
  const legacyKey = "atlas-academy.module19-concurrency-studio.v2";
  const currentKey = "atlas-academy.module19-concurrency-studio.v3";
  const emptyRecord = {
    history: { choice: null, confidence: null, revealed: false },
    linearization: { choice: null, confidence: null, revealed: false },
    coordination: { choice: null, confidence: null, revealed: false },
    progress: { choice: null, confidence: null, revealed: false },
    models: { choice: null, confidence: null, revealed: false },
    evidence: { choice: null, confidence: null, revealed: false },
  };
  const revealedHistoryRecord = {
    ...emptyRecord,
    history: { choice: "lost", confidence: 1, revealed: true },
  };

  await page.goto("/");
  await page.evaluate(
    ({ key }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          version: 2,
          activeView: "models",
          answers: { history: { prediction: "lost", confidence: 4, revealed: true } },
          record: { modelChoice: { candidate: "processes" } },
          misconceptions: ["History explorer"],
        }),
      );
    },
    { key: legacyKey },
  );
  await page.getByRole("button", { name: "Machine & network lab" }).click();

  const studio = await openConcurrencyObservatory(page);
  await expect(studio.getByText("0 / 6 views revealed", { exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey: oldKey, currentKey: newKey }) => ({
          legacy: window.localStorage.getItem(oldKey),
          current: window.localStorage.getItem(newKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });

  const history = studio.locator("#concurrency-panel-history");
  await selectRadioWithKeyboard(
    page,
    history.getByRole("radio", { name: /one contribution is lost/i }),
  );
  await selectRadioWithKeyboard(page, history.getByRole("radio", { name: /guess/i }));
  await history.getByRole("button", { name: "Reveal the trace evidence" }).click();

  await expect
    .poll(() =>
      page.evaluate(
        (key) => {
          const raw = window.localStorage.getItem(key);
          return raw ? JSON.parse(raw) : null;
        },
        currentKey,
      ),
    )
    .toEqual({ version: 3, record: revealedHistoryRecord });

  await studio.getByRole("button", { name: "Reset saved studio" }).click();
  await studio.getByRole("button", { name: "Reset saved studio now" }).click();
  await expect(studio.getByText("0 / 6 views revealed", { exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey: oldKey, currentKey: newKey }) => ({
          legacy: window.localStorage.getItem(oldKey),
          current: window.localStorage.getItem(newKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });

  await page.reload();
  await page.getByRole("button", { name: "Machine & network lab" }).click();
  await openConcurrencyObservatory(page);
  await expect(studio).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey: oldKey, currentKey: newKey }) => ({
          legacy: window.localStorage.getItem(oldKey),
          current: window.localStorage.getItem(newKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });

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
    resetStorage: { legacy: null, current: null },
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
    resetStorage: { legacy: null, current: null },
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
      .toEqual(migration.resetStorage);
    await expect(page.getByText(migration.resetCoverage, { exact: true })).toBeVisible();
  });
}

test("M23 leaves no record for a fresh or blank legacy learner state", async ({ page }) => {
  const legacyKey = "atlas-academy.module23-language-lab.v1";
  const currentKey = "atlas-academy.module23-language-lab.v2";
  const emptyRecord = {
    boundary: { choice: null, confidence: null, revealed: false },
    grammar: { choice: null, confidence: null, revealed: false },
    environment: { choice: null, confidence: null, revealed: false },
    semantics: { choice: null, confidence: null, revealed: false },
    contract: { choice: null, confidence: null, revealed: false },
    bridge: { choice: null, confidence: null, revealed: false },
  };

  await page.goto("/modules/23-programming-languages-interpreters");
  await expect(page.getByRole("heading", { name: "Atlas Language Lab", exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey: oldKey, currentKey: newKey }) => ({
          legacy: window.localStorage.getItem(oldKey),
          current: window.localStorage.getItem(newKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });

  await page.evaluate(
    ({ legacyKey: oldKey, record }) => {
      window.localStorage.setItem(oldKey, JSON.stringify(record));
    },
    { legacyKey, record: emptyRecord },
  );
  await page.reload();
  await expect(page.getByRole("heading", { name: "Atlas Language Lab", exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey: oldKey, currentKey: newKey }) => ({
          legacy: window.localStorage.getItem(oldKey),
          current: window.localStorage.getItem(newKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });
});

test("M23 fails closed when a malformed v2 record coexists with meaningful v1 progress", async ({ page }) => {
  const legacyKey = "atlas-academy.module23-language-lab.v1";
  const currentKey = "atlas-academy.module23-language-lab.v2";
  const legacyRecord = {
    boundary: { choice: "syntax", confidence: 4, revealed: true },
    grammar: { choice: "multiply", confidence: 3, revealed: false },
    environment: { choice: null, confidence: null, revealed: false },
    semantics: { choice: null, confidence: null, revealed: false },
    contract: { choice: null, confidence: null, revealed: false },
    bridge: { choice: null, confidence: null, revealed: false },
  };
  const malformedCurrent = JSON.stringify({
    version: 2,
    record: { boundary: { choice: "syntax", confidence: 4, revealed: true } },
  });
  const rawLegacy = JSON.stringify(legacyRecord);

  await page.addInitScript(
    ({ legacyKey: oldKey, currentKey: newKey, legacy, current }) => {
      window.localStorage.setItem(oldKey, legacy);
      window.localStorage.setItem(newKey, current);
    },
    {
      legacyKey,
      currentKey,
      legacy: rawLegacy,
      current: malformedCurrent,
    },
  );
  await page.goto("/modules/23-programming-languages-interpreters");
  await expect(page.getByRole("heading", { name: "Atlas Language Lab", exact: true })).toBeVisible();
  await expect(page.getByText("0 / 6 views revealed", { exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey: oldKey, currentKey: newKey }) => ({
          legacy: window.localStorage.getItem(oldKey),
          current: window.localStorage.getItem(newKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });
});

test("M24 leaves no record for a fresh or blank legacy learner state", async ({ page }) => {
  const legacyKey = "atlas-academy.module24-runtime-observatory.v1";
  const currentKey = "atlas-academy.module24-runtime-observatory.v2";
  const emptyRecord = {
    contract: { choice: null, confidence: null, revealed: false },
    graph: { choice: null, confidence: null, revealed: false },
    cycle: { choice: null, confidence: null, revealed: false },
    lens: { choice: null, confidence: null, revealed: false },
    runtime: { choice: null, confidence: null, revealed: false },
    decision: { choice: null, confidence: null, revealed: false },
  };

  await page.goto("/modules/24-cpython-performance-memory");
  await expect(page.getByRole("heading", { name: "Runtime Evidence Observatory", exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey: oldKey, currentKey: newKey }) => ({
          legacy: window.localStorage.getItem(oldKey),
          current: window.localStorage.getItem(newKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });

  await page.evaluate(
    ({ legacyKey: oldKey, record }) => {
      window.localStorage.setItem(oldKey, JSON.stringify(record));
    },
    { legacyKey, record: emptyRecord },
  );
  await page.reload();
  await expect(page.getByRole("heading", { name: "Runtime Evidence Observatory", exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey: oldKey, currentKey: newKey }) => ({
          legacy: window.localStorage.getItem(oldKey),
          current: window.localStorage.getItem(newKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });

  await page.evaluate(
    ({ legacyKey: oldKey, currentKey: newKey, empty, record }) => {
      window.localStorage.setItem(
        newKey,
        JSON.stringify({ version: 2, record: empty }),
      );
      window.localStorage.setItem(oldKey, JSON.stringify(record));
    },
    {
      legacyKey,
      currentKey,
      empty: emptyRecord,
      record: {
        ...emptyRecord,
        contract: { choice: "semantic", confidence: 4, revealed: true },
      },
    },
  );
  await page.reload();
  await expect(page.getByRole("heading", { name: "Runtime Evidence Observatory", exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        ({ legacyKey: oldKey, currentKey: newKey }) => ({
          legacy: window.localStorage.getItem(oldKey),
          current: window.localStorage.getItem(newKey),
        }),
        { legacyKey, currentKey },
      ),
    )
    .toEqual({ legacy: null, current: null });
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
