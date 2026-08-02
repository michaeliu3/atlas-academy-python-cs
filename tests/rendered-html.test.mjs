import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";
import { diagnosticQuestions } from "../lib/diagnostic-model.js";
import { extractTableOfContents } from "../lib/heading-ids.js";
import {
  buildTextDefenseEvidenceDraft,
  canAdvanceTextDefenseStep,
  canCopyTextDefenseEvidence,
  canRevealTextDefenseHint,
  createTextDefensePlan,
  getTextDefenseHint,
  textDefenseStepIds,
} from "../lib/oral-defense-text-flow.js";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${pathname.replaceAll("/", "-")}`,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function extractFunctionSource(source, name) {
  const marker = new RegExp(`(?:export\\s+)?function\\s+${name}\\s*\\(`);
  const match = marker.exec(source);
  assert.ok(match, `expected function ${name}`);

  const rest = source.slice(match.index + match[0].length);
  const nextFunction = /\n(?:export\s+)?function\s+[A-Za-z0-9_]+\s*\(/.exec(rest);
  return source.slice(
    match.index,
    nextFunction
      ? match.index + match[0].length + nextFunction.index
      : source.length,
  );
}

function relativeLuminance(hex) {
  const channel = (offset) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [
    relativeLuminance(foreground),
    relativeLuminance(background),
  ].sort((first, second) => second - first);
  return (lighter + 0.05) / (darker + 0.05);
}

function assertPredictionGated(componentSource, componentName) {
  const predictionGate = componentSource.indexOf("<PredictionGate");
  const revealBranch = componentSource.indexOf("!answer.revealed");
  const evidenceLock = componentSource.indexOf("<EvidenceLock");

  assert.ok(predictionGate >= 0, `${componentName} has a prediction gate`);
  assert.ok(
    revealBranch > predictionGate,
    `${componentName} branches on reveal only after the prediction gate`,
  );
  assert.ok(
    evidenceLock > revealBranch,
    `${componentName} covers answer-bearing evidence before reveal`,
  );
}

test("renders the Atlas Academy course portal", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Atlas Academy · Python &amp; Computer Science<\/title>/i);
  assert.match(html, /Learn to see the/);
  assert.match(html, /The knowledge spine/);
  assert.match(html, /Less typing\. More ownership\./);
  assert.match(html, /Data structures/);
  assert.match(html, /Durable software/);
  assert.match(html, /Course library/);
  assert.match(html, /Begin the diagnostic/);
  assert.match(html, /href="\/diagnostic"/);
  assert.match(html, /href="\/route"/);
  assert.match(html, /Interactive explorer/);
  assert.match(html, /not this explorer—carry the learning sequence/);
  assert.match(html, /Twenty multiple-choice investigations/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renders separate live-learning Teaching Assistant and Study Partner packages", async () => {
  const response = await render("/learning-partners");
  assert.equal(response.status, 200);

  const html = await response.text();
  const readable = html.replaceAll("<!-- -->", "");
  assert.match(html, /Two separate chats\. Two different jobs\./);
  assert.match(html, /Teaching Assistant/);
  assert.match(html, /Study Partner/);
  assert.match(html, /Copy Teaching Assistant startup prompt/);
  assert.match(html, /Copy Study Partner startup prompt/);
  assert.match(html, /Never give a bare pass\/fail verdict/);
  assert.match(html, /visible chat an accessible whiteboard/);
  assert.match(html, /Portable copied-chat record mode: keep local/);
  assert.match(html, /automatic-after-substantive-session/);
  assert.match(html, /at most one concise structured note per substantive session/);
  assert.match(html, /say “records on”/);
  assert.match(html, /names a module or learning topic/);
  assert.match(html, /pause records/);
  assert.match(readable, /configured private learning\s+record/i);
  assert.match(readable, /after you say “records on” in that exact designated chat/i);
  assert.match(readable, /designated Codex chats—not the portal/i);
  assert.match(readable, /authorized to\s+automatically create one concise Notion session note/i);
  assert.match(readable, /after a\s+substantive learning conversation/i);
  assert.match(readable, /successful write is recorded\s+only from direct evidence/i);
  assert.match(html, /The Teaching Assistant conducts the actual post-module oral defense/);
});

test("gives every rendered workbook checklist item a descriptive read-only name", async () => {
  const moduleSlugs = [
    "15-files-serialization-packaging-delivery",
    "16-relational-data-transactions",
    "17-computer-architecture-execution-stack",
    "18-operating-systems-resource-mediation",
  ];

  for (const slug of moduleSlugs) {
    const response = await render(`/modules/${slug}`);
    assert.equal(response.status, 200, `${slug} renders`);
    const document = new JSDOM(await response.text()).window.document;
    const checkboxes = [
      ...document.querySelectorAll(".task-list-item > input[type='checkbox']"),
    ];

    assert.ok(checkboxes.length > 0, `${slug} includes a workbook checklist`);
    for (const checkbox of checkboxes) {
      assert.match(
        checkbox.getAttribute("aria-label") ?? "",
        /^Read-only workbook checklist item: \S/u,
        `${slug} checklist control has a specific accessible name`,
      );
      assert.equal(checkbox.hasAttribute("readonly"), true);
    }
  }
});

test("keeps landing selection and legacy studio tabs keyboard-accessible", async () => {
  const [portal, arcTwo, arcThree, capstone] = await Promise.all([
    readFile(new URL("../app/CoursePortal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ArcTwoStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ArcThreeStudio.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/CapstoneDefenseStudio.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(portal, /<a className="skip-link" href="#main-content">/);
  assert.match(portal, /<main id="main-content" tabIndex=\{-1\}>/);
  assert.match(portal, /aria-pressed=\{view === "path"\}/);
  assert.match(portal, /aria-pressed=\{view === "arc4"\}/);
  assert.match(portal, /role="status"/);
  assert.match(portal, /aria-live="polite"/);

  for (const [name, studio] of [
    ["Arc II", arcTwo],
    ["Arc III", arcThree],
    ["capstone", capstone],
  ]) {
    assert.match(studio, /role="tablist"/, `${name} has a tablist`);
    assert.match(studio, /role="tab"/, `${name} has tabs`);
    assert.match(studio, /role="tabpanel"/, `${name} has a tabpanel`);
    assert.match(studio, /aria-controls=/, `${name} connects tabs to panels`);
    assert.match(studio, /aria-labelledby=/, `${name} labels each panel from its tab`);
    assert.match(studio, /hidden=\{!selected\}/, `${name} retains inactive panels for tab relationships`);
    assert.match(studio, /tabIndex=/, `${name} uses roving tab focus`);
    assert.match(studio, /"ArrowRight"/, `${name} supports ArrowRight`);
    assert.match(studio, /"ArrowLeft"/, `${name} supports ArrowLeft`);
    assert.match(studio, /"Home"/, `${name} supports Home`);
    assert.match(studio, /"End"/, `${name} supports End`);
    assert.match(studio, /event\.preventDefault\(\)/, `${name} prevents native scrolling`);
    assert.match(
      studio,
      /tabRefs\.current\[nextIndex\]\?\.focus\(\)/,
      `${name} moves focus with the active tab`,
    );
  }
});

test("keeps the interactive explorer separate from Core route access and evidence", async () => {
  const [portal, header, modulePage, navigation, route] = await Promise.all([
    readFile(new URL("../app/CoursePortal.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/modules/CourseReaderHeader.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/modules/[slug]/page.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/modules/[slug]/ModuleNavigation.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/route/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(portal, /Interactive explorer · not the Core route/);
  assert.match(portal, /separate Codex\s+learning chats—not this explorer—carry the learning sequence/u);
  assert.match(portal, /href="\/learning-partners"/u);
  assert.match(portal, />\s*Learning partners/u);
  assert.doesNotMatch(portal, /Show learning path/u);
  assert.match(header, />Interactive explorer</u);

  assert.match(modulePage, /Reference access does not advance the Core\./u);
  assert.match(modulePage, /does not mark academic prerequisites complete or advance the Core/u);
  assert.match(navigation, /These links show planned sequence; they do not infer or record\s+prerequisite completion/u);
  assert.match(navigation, /Locked\. Return to the route to review its prerequisites and release boundary\./u);
  assert.match(navigation, /Reference preview—not an unlocked Core step\./u);

  assert.match(route, /Atlas does not infer progress\s+from a click,\s+a scroll, or a studio interaction\./u);
  assert.match(route, /Teaching Assistant for a supportive oral defense/u);
  assert.match(route, /Reference preview—available for orientation, not Core progress/u);
  assert.match(route, /entry\.state\.readerAccess !== "hidden"/u);
});

test("each open module reader keeps the supportive oral-defense route", async () => {
  const [page, oralDefense, textDefense, oralGuide, companionPackage, companionGuides] = await Promise.all([
    readFile(new URL("../app/modules/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/modules/[slug]/ModuleOralDefense.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/modules/[slug]/ModuleTextOralDefense.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../lib/oral-defense-guide.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/module-companion-package-builder.mjs", import.meta.url), "utf8"),
    readFile(new URL("../content/course/module-companion-guides.v1.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<ModuleOralDefense/);
  assert.match(page, /companion=\{getModuleCompanionPackage\(courseModule\.number\)\}/);
  assert.match(oralDefense, /Oral defense: a conversation, not a verdict\./);
  assert.match(oralDefense, /voice-enabled Teaching Assistant chat/);
  assert.match(oralDefense, /ModuleTextOralDefense/);
  assert.match(oralDefense, /Copy Teaching Assistant context/);
  assert.match(oralDefense, /Copy Study Partner context/);
  assert.match(oralDefense, /Study Partner · rehearsal context/);
  assert.match(oralDefense, /separate live-capable Study Partner chat/);
  assert.match(oralDefense, /Canonical forward handoff/);
  assert.match(oralDefense, /companion: ModuleCompanionPackage/);
  assert.doesNotMatch(oralDefense, /getModuleCompanionPackage/);
  assert.doesNotMatch(oralDefense, /module-companion-guides|module-companion-package-builder/);
  assert.match(companionPackage, /formative oral defense conversation, not a grade/);
  assert.match(companionPackage, /Do not score, grade, or make a binary outcome judgment/);
  assert.match(companionPackage, /prose or ASCII fallback/);
  assert.match(companionPackage, /language-labelled fenced code/);
  assert.match(companionPackage, /recordBoundary\.designatedChatMode/);
  assert.match(companionPackage, /Canonical forward handoff/);
  assert.match(textDefense, /Equivalent text conversation/);
  assert.match(textDefense, /Work through one question at a time\./);
  assert.match(textDefense, /Prediction before reveal/);
  assert.match(textDefense, /Optional hint ladder/);
  assert.match(textDefense, /aria-disabled=\{!canRevealHint\}/);
  assert.match(textDefense, /role="status"/);
  assert.match(textDefense, /checked=\{summaryApproved\}/);
  assert.match(textDefense, /disabled=\{!summaryApproved\}/);
  assert.match(textDefense, /Copy approved evidence summary/);
  assert.match(textDefense, /does not\s+automatically store or export/);
  assert.match(textDefense, /restartFocusRequested\.current = true/);
  assert.match(
    textDefense,
    /activeStepIndex > 0 \|\| restartFocusRequested\.current/,
  );
  assert.doesNotMatch(textDefense, /localStorage|\bfetch\s*\(/);
  assert.match(oralGuide, /moduleCompanionGuides/);
  assert.match(companionGuides, /bindings, object identity, mutation, and frame-local state/);
  assert.match(companionGuides, /a release argument joining architecture, invariant/);
  assert.match(oralGuide, /formal definition and assumptions/);
  assert.match(oralGuide, /system boundary, failure mode, evidence, tradeoff/);
  assert.match(companionGuides, /linear maps, projections, rank, spectra, and conditioning/);
  assert.match(companionGuides, /shape\/dtype\/solver path/);

  const response = await render("/modules/04-logic-sets-relations-graphs-proof");
  assert.equal(response.status, 200);
  const html = await response.text();
  const readable = html.replaceAll("<!-- -->", "");
  const renderedText = new JSDOM(html).window.document.body.textContent ?? "";
  assert.match(readable, /Post-module learning conversation/);
  assert.match(readable, /Oral defense: a conversation, not a verdict\./);
  assert.match(readable, /15–20 thoughtful minutes/);
  assert.match(readable, /Equivalent text conversation/);
  assert.match(readable, /Work through one question at a time\./);
  assert.match(readable, /Question 1 of 5/);
  assert.match(readable, /Your plain-language explanation/);
  assert.match(renderedText, /Teaching Assistant · oral-defense context/);
  assert.match(renderedText, /Study Partner · rehearsal context/);
  assert.match(renderedText, /Canonical forward handoff/);
  assert.match(renderedText, /Module 5: Cost Models and Algorithm Analysis/);
  assert.match(renderedText, /automatic-after-substantive-session/);
  assert.match(readable, /A small, learner-controlled record/);
  assert.match(renderedText, /formative oral defense conversation, not a grade/i);
});

test("the M19-M24 candidate oral protocols keep their reader-visible repair anchors", async () => {
  const expectedAnchorsByWorkbook = new Map([
    [
      "19_concurrency_parallelism.md",
      [
        "supportive-oral-defense-route",
        "123-hint-ladder",
        "level-8--transfer-to-m20-m21-and-m24",
        "study-partner-rehearsal-and-ta-handoff",
        "122-ta-response-loop",
      ],
    ],
    [
      "20_networks_application_protocols.md",
      [
        "supportive-oral-defense-route",
        "session-6-oral-defense",
        "123-hint-ladder",
        "level-8--transfer-without-overclaiming",
        "122-ta-response-loop",
      ],
    ],
    [
      "21_async_distributed_systems.md",
      [
        "supportive-oral-defense-protocol",
        "invitation-and-starting-evidence",
        "hint-ladder",
        "counterexample-repair",
        "transfer-question",
        "reflection-and-learner-controlled-evidence-summary",
      ],
    ],
    [
      "22_security_privacy_trust_boundaries.md",
      [
        "conversational-oral-defense--m22",
        "hint-ladder",
        "counterexample-turn",
        "transfer-turn",
        "reflection-and-learner-controlled-evidence-summary",
      ],
    ],
    [
      "23_programming_languages_interpreters.md",
      [
        "conversational-oral-defense--m23",
        "hint-ladder",
        "counterexample-turn",
        "transfer-turn",
        "reflection-and-learner-controlled-evidence-summary",
      ],
    ],
    [
      "24_cpython_performance_memory.md",
      [
        "conversational-oral-defense--m24",
        "hint-ladder",
        "counterexample-turn",
        "transfer-turn",
        "reflection-and-learner-controlled-evidence-summary",
      ],
    ],
  ]);

  for (const [filename, expectedAnchors] of expectedAnchorsByWorkbook) {
    const markdown = await readFile(
      new URL(`../content/modules/${filename}`, import.meta.url),
      "utf8",
    );
    const anchors = new Set(extractTableOfContents(markdown).map(({ id }) => id));
    for (const expectedAnchor of expectedAnchors) {
      assert.ok(
        anchors.has(expectedAnchor),
        `${filename} keeps the reader-visible ${expectedAnchor} oral-repair anchor`,
      );
    }
  }
});

test("the built browser bundle excludes authoring-only companion content", async () => {
  const assetsDirectory = new URL("../dist/client/assets/", import.meta.url);
  const assetNames = await readdir(assetsDirectory);
  const browserSource = (
    await Promise.all(
      assetNames
        .filter((assetName) => /\.(?:js|mjs)$/u.test(assetName))
        .map((assetName) => readFile(new URL(`../dist/client/assets/${assetName}`, import.meta.url), "utf8")),
    )
  ).join("\n");

  assert.doesNotMatch(
    browserSource,
    /an objective, constraints, geometry, convergence path, and information quantity with assumptions/u,
    "M31's authoring-only guide must stay in the server-only reader path",
  );
  assert.doesNotMatch(
    browserSource,
    /reconstruct a generalization, regret, margin, or lower-bound proof idea/u,
    "M36's authoring-only guide must stay in the server-only reader path",
  );
});

test("keeps every authored scrollable code region labelled and keyboard-focusable", async () => {
  const labelledRegions = [
    ["../app/CoursePortal.tsx", "Scrollable Python state-trace example"],
    ["../app/ModuleTwoReader.tsx", "Scrollable recursive Python example"],
    ["../app/CapstoneDefenseStudio.tsx", "Scrollable small proposed patch"],
    ["../app/NetworkProtocolStudio.tsx", "Scrollable generated patch to audit"],
    ["../app/NetworkProtocolStudio.tsx", "Scrollable scoped model evidence JSON"],
    [
      "../app/learning-partners/LearningPartnerPromptCards.tsx",
      "Scrollable ${prompt.title} startup prompt",
    ],
    [
      "../app/modules/[slug]/ModuleTextOralDefense.tsx",
      "Scrollable concise oral-defense evidence draft",
    ],
    [
      "../app/modules/[slug]/ModuleMarkdown.tsx",
      "Scrollable lesson code example",
    ],
    [
      "../app/modules/[slug]/MermaidDiagram.tsx",
      "Scrollable technical Mermaid diagram source",
    ],
    [
      "../app/modules/[slug]/ModuleOralDefense.tsx",
      "Scrollable full Teaching Assistant context",
    ],
    [
      "../app/modules/[slug]/ModuleOralDefense.tsx",
      "Scrollable full Study Partner context",
    ],
    [
      "../app/diagnostic/DiagnosticExperience.tsx",
      'Scrollable ${question.codeLanguage ?? "code"} diagnostic example',
    ],
  ];

  for (const [relativePath, label] of labelledRegions) {
    const source = await readFile(
      new URL(relativePath, import.meta.url),
      "utf8",
    );
    assert.ok(
      source.includes(label),
      `${relativePath} keeps an explicit accessible name for its scrollable code`,
    );
    assert.match(
      source,
      /tabIndex=\{0\}/u,
      `${relativePath} keeps its scrollable code keyboard-focusable`,
    );
  }
});

test("keeps the local text oral-defense route adaptive, prediction-gated, and learner-controlled", () => {
  const guide = {
    centralModel: "a representation invariant",
    traceOrDerivation: "predict a short trace before seeing evidence",
    misconception: "a plausible shortcut",
    boundary: "what a finite observation does not establish",
    transfer: "a new design decision that needs the same model",
  };
  const plan = createTextDefensePlan(guide);

  assert.deepEqual(
    plan.map((step) => step.id),
    textDefenseStepIds,
    "the text route keeps the Live brief's five learning moves in order",
  );
  assert.equal(plan[1].predictionBeforeReveal, true);
  assert.equal(plan[1].requiresConfidence, true);
  assert.match(plan[1].prompt, /what would change your mind/i);
  assert.equal(
    canAdvanceTextDefenseStep(plan[1], "I predict the invariant holds.", null),
    false,
    "a prediction alone cannot unlock the trace step",
  );
  assert.equal(
    canRevealTextDefenseHint(plan[1], "", 2),
    false,
    "hints stay hidden until the learner has made a prediction and calibrated confidence",
  );
  assert.equal(
    canRevealTextDefenseHint(plan[1], "I predict a shared alias changes.", 2),
    true,
  );
  assert.match(
    getTextDefenseHint(plan[1], 0, 1),
    /smaller starting point/i,
    "low confidence receives a smaller first hint",
  );
  assert.match(
    getTextDefenseHint(plan[1], 0, 4),
    /stress-test/i,
    "higher confidence receives a boundary-checking first hint",
  );
  assert.match(plan[2].prompt, /finite observation/i);
  assert.match(plan[3].prompt, /new design decision/i);
  assert.match(plan[4].prompt, /fragile/i);
  assert.match(plan[4].prompt, /retrieval/i);

  const draft = buildTextDefenseEvidenceDraft({
    moduleNumber: 4,
    moduleTitle: "Logic",
    guide,
    answers: {
      explain: "The invariant states what remains true.",
      predict: "The trace should preserve the stated relation.",
      boundary: "One example cannot prove the universal claim.",
      transfer: "I would define the invariant before choosing an API.",
      reflect: "I need to revisit quantifiers.",
    },
    confidence: 2,
  });
  assert.match(draft, /Module 4: Logic/);
  assert.match(draft, /Fragile idea: I need to revisit quantifiers\./);
  assert.match(draft, /Retrieval prompt:/);
  assert.equal(canCopyTextDefenseEvidence(false), false);
  assert.equal(canCopyTextDefenseEvidence(true), true);
});

test("renders the truthful prerequisite-first 60-day Atlas route", async () => {
  const response = await render("/route");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const readable = html.replaceAll("<!-- -->", "");
  assert.match(readable, /60 days\./);
  assert.match(readable, /Day 1 is the placement diagnostic and learning contract\./);
  assert.match(readable, /28 \/ 2 \/ 6/);
  assert.match(readable, /open \/ preview \/ authoring/i);
  assert.match(readable, /Days 2–9/);
  assert.match(readable, /Days 56–60/);
  assert.match(readable, /Module 27/);
  assert.match(readable, /Module 28/);
  assert.match(readable, /Module 29/);
  assert.match(readable, /Module 30/);
  assert.match(readable, /Open material · review pending/);
  assert.match(readable, /Reference preview/);
  assert.match(readable, /In authoring/);
  assert.match(readable, /Read as reference—not an unlocked Core step/);
  assert.match(
    readable,
    /Atlas does not infer progress from a click, a scroll, or a studio interaction\./,
  );
  assert.match(
    readable,
    /Source map, studio, and release evidence are being completed before learner release\./,
  );
  assert.match(readable, /M30 Probability, Statistics &amp; Scientific Inference/);
  assert.match(readable, /Module 25/);
  assert.match(readable, /Module 26/);
  assert.match(
    html,
    /href="\/modules\/27-discrete-mathematics-proof-counting-structures"/,
  );
  assert.match(
    html,
    /href="\/modules\/28-linear-algebra-numerical-stability-representation"/,
  );
  assert.match(
    html,
    /href="\/modules\/29-calculus-real-analysis-continuous-change"/,
  );
  assert.match(
    html,
    /href="\/modules\/30-probability-statistics-scientific-inference"/,
  );
});

test("keeps availability status and route linkability aligned with the generated manifest", async () => {
  const [routeSource, routePage, catalogSource, manifestSource] = await Promise.all([
    readFile(new URL("../lib/atlas-core-route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/route/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../content/course/course-graph.v2.json", import.meta.url), "utf8"),
    readFile(new URL("../content/modules/manifest.json", import.meta.url), "utf8"),
  ]);
  const graph = JSON.parse(catalogSource);
  const manifest = JSON.parse(manifestSource);
  const graphByNumber = new Map(graph.modules.map((courseModule) => [courseModule.number, courseModule]));
  const manifestByNumber = new Map(
    manifest.modules.map((courseModule) => [courseModule.number, courseModule]),
  );

  assert.match(routeSource, /atlasCoreRoutePlan/);
  assert.match(routePage, /entry\.state\.readerAccess === "preview"/);
  assert.equal(graphByNumber.get(25).state.availability, "preview");
  assert.equal(graphByNumber.get(26).state.availability, "preview");
  assert.equal(graphByNumber.get(31).state.lifecycle, "authoring-only");
  assert.equal(manifestByNumber.get(25).state.availability, "preview");
  assert.equal(manifestByNumber.get(26).state.availability, "preview");
  assert.equal(manifestByNumber.get(24).nextRouteNumber, 32);
  assert.equal(manifestByNumber.get(24).nextSlug, null);
});

test("renders the accessible, confidence-aware Module 0 placement studio", async () => {
  const response = await render("/diagnostic");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Module 0 Diagnostic · Atlas Academy/);
  assert.match(html, /Module 0 · 20 reasoning probes/);
  assert.match(html, /Which pair is correct at the end\?/);
  assert.match(html, /Choose the model that best predicts the result/);
  assert.match(html, /No penalty for uncertainty/);
  assert.match(html, /Preparing optional local-only progress/);
  assert.match(html, /Answers remain in this browser/);
  assert.match(html, /type="radio"/);
  assert.match(html, /<fieldset/);
  assert.match(html, /<legend/);
  assert.match(html, /<progress/);
  assert.match(html, /aria-label="Diagnostic questions"/);
  assert.match(html, /Reset all answers/);
  assert.doesNotMatch(html, /role="radiogroup"/);
  assert.doesNotMatch(html, /window\.confirm/);
});

test("keeps diagnostic route notes readable against their purpose-specific surfaces", async () => {
  const globals = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const saffronBackground = globals.match(/--saffron-soft:\s*(#[0-9a-f]{6})/i)?.[1];
  const plumBackground = globals.match(/--plum-soft:\s*(#[0-9a-f]{6})/i)?.[1];
  const foreground = globals.match(
    /\.diagnostic-extension-boundary,\s*\.diagnostic-prerequisite-note\s*\{[^}]*color:\s*(#[0-9a-f]{6})/i,
  )?.[1];

  assert.ok(saffronBackground, "the prerequisite note surface must declare a solid color");
  assert.ok(plumBackground, "the extension note surface must declare a solid color");
  assert.ok(foreground, "diagnostic route notes must declare a readable direct ink color");
  assert.match(
    globals,
    /\.diagnostic-bridge-plan li > div > p:last-child:not\(\.diagnostic-extension-boundary\):not\(\.diagnostic-prerequisite-note\)\s*\{[^}]*color:\s*var\(--muted\)/,
  );
  assert.ok(
    contrastRatio(foreground, saffronBackground) >= 4.5,
    "diagnostic prerequisite notes need at least 4.5:1 normal-text contrast",
  );
  assert.ok(
    contrastRatio(foreground, plumBackground) >= 4.5,
    "diagnostic extension notes need at least 4.5:1 normal-text contrast",
  );
});

test("diagnostic and M19 export actions require current learner approval before copying or printing", async () => {
  const [diagnostic, studio] = await Promise.all([
    readFile(new URL("../app/diagnostic/DiagnosticExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ConcurrencyStudio.tsx", import.meta.url), "utf8"),
  ]);
  const evidence = extractFunctionSource(studio, "EvidenceAuditor");

  assert.match(diagnostic, /canExportApprovedDraft/);
  assert.match(diagnostic, /approvedLearningBrief/);
  assert.match(
    diagnostic,
    /I reviewed this learning brief and approve copying or printing it myself\./,
  );
  assert.match(diagnostic, /disabled=\{!learningBriefApproved\}/);
  assert.match(diagnostic, /Print approved brief/);
  assert.doesNotMatch(diagnostic, /onClick=\{\(\) => window\.print\(\)\}/);
  assert.match(diagnostic, /setApprovedLearningBrief\(null\)/);

  assert.match(evidence, /canExportApprovedDraft\(approvedBrief, brief\)/);
  assert.match(
    evidence,
    /I reviewed this concise, categorical brief and choose to copy it manually\./,
  );
  assert.match(evidence, /checked=\{briefApproved\}/);
  assert.match(evidence, /disabled=\{!briefApproved\}/);
  assert.match(evidence, /Copy approved instructor brief/);
  assert.match(evidence, /setApprovedBrief\(event\.target\.checked \? brief : null\)/);
});

test("the diagnostic delegates bounded browser progress to its v3 codec", async () => {
  const diagnostic = await readFile(
    new URL("../app/diagnostic/DiagnosticExperience.tsx", import.meta.url),
    "utf8",
  );

  assert.match(diagnostic, /diagnostic-progress-codec/);
  assert.match(diagnostic, /restoreDiagnosticProgress/);
  assert.match(diagnostic, /persistDiagnosticProgress/);
  assert.match(diagnostic, /clearDiagnosticProgress/);
  assert.match(diagnostic, /getBrowserProgressStorage/);
  assert.match(diagnostic, /Progress saved only in this browser/);
  assert.doesNotMatch(diagnostic, /Saved on this device/);
  assert.doesNotMatch(diagnostic, /JSON\.parse|JSON\.stringify/);
  assert.doesNotMatch(
    diagnostic,
    /window\.localStorage\.(?:getItem|setItem|removeItem)/,
  );
});

test("Module 18 OS studio preserves its canonical interactive contract", async () => {
  const studioUrl = new URL("../app/OperatingSystemsStudio.tsx", import.meta.url);
  const arcUrl = new URL("../app/ArcFourStudio.tsx", import.meta.url);
  const [studio, arc] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(arcUrl, "utf8"),
  ]);

  const exactInvariant =
    "Every worker-visible effect is accounted for both as a process-local operation and as an OS-mediated resource transition. After interruption, Atlas publishes only a complete validated result, or leaves an explicitly classified recoverable state; an exit code, successful API return, or timing observation never silently substitutes for that evidence.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(arc, /<OperatingSystemsStudio \/>/);
  assert.match(
    arc,
    /href: "\/modules\/18-operating-systems-resource-mediation"/,
  );

  for (const viewLabel of [
    "Boundary crossing",
    "Process lifecycle",
    "Virtual memory",
    "Open resources",
    "Publication cut",
    "Claim auditor",
  ]) {
    assert.ok(studio.includes(`label: "${viewLabel}"`), viewLabel);
  }
  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{osPanelId\(view\.id\)\}/);
  assert.match(studio, /aria-selected=\{activeView === view\.id\}/);
  assert.match(studio, /event\.key === "ArrowRight"/);

  for (const phase of [
    "ADMITTED",
    "STARTED",
    "ENCODED",
    "STAGED",
    "VALIDATED",
    "PY_FLUSHED",
    "FILE_SYNC_RETURNED",
    "CLOSED",
    "REPLACED",
    "DIR_SYNC_RETURNED",
    "EXITED",
    "RECOVERED",
  ]) {
    assert.ok(studio.includes(`label: "${phase}"`), phase);
  }
  assert.match(studio, /\(\[1, 2, 3, 4\] as const\)/);
  assert.equal(
    [...studio.matchAll(/useState<Confidence \| null>\(null\)/gu)].length,
    3,
  );
  assert.doesNotMatch(studio, /useState<Confidence>\([1-4]\)/);
  assert.match(studio, /prediction === null \|\| confidence === null/);

  assert.match(studio, /16-bit virtual addresses, 256-byte pages/);
  assert.match(studio, /an 8-bit\s+VPN, an 8-bit offset/);
  assert.match(studio, /const vpn = address >>> 8/);
  assert.match(studio, /const offset = address & 0xff/);
  assert.match(studio, /\(entry\.frame << 8\) \| offset/);
  assert.match(studio, /0x2a:[\s\S]*?frame: 0x91/);
  assert.match(studio, /Process \{candidate\}/);
  assert.match(studio, /aria-pressed=\{editableVmEntry\.present\}/);
  assert.match(studio, /Commit the translation before reveal/);

  assert.match(studio, /run_id/);
  assert.match(studio, /PID/);
  assert.match(studio, /COLLECTED/);
  assert.match(studio, /B renames candidate/);
  assert.match(studio, /OS page cache/);
  assert.match(studio, /POSIX-like model/);
  assert.match(studio, /Windows profile/);
  assert.match(studio, /kill if distinct/);

  assert.match(studio, /Power-loss outcome: UNKNOWN/);
  assert.match(
    studio,
    /Controlled child exit is not OS crash or power loss/,
  );
  assert.doesNotMatch(studio, /sudden\s+power\s+loss\s+immediately\s+afterward/i);
  assert.match(studio, /No durability score is assigned/);

  assert.match(studio, /module18-progress-codec/);
  assert.match(studio, /restoreModule18Progress/);
  assert.match(studio, /persistModule18Progress/);
  assert.match(studio, /clearModule18Progress/);
  assert.match(studio, /getBrowserProgressStorage/);
  assert.match(studio, /parseBoundedHexadecimal/);
  assert.doesNotMatch(studio, /JSON\.parse|JSON\.stringify/);
  assert.doesNotMatch(
    studio,
    /window\.localStorage\.(?:getItem|setItem|removeItem)/,
  );
  assert.match(studio, /useEffect\(\(\) => \{/);
  assert.match(studio, /Reset saved studio/);
  assert.match(studio, /const resetStudio = \(\) =>/);
});

test("Module 19 preserves its invariant and six-view shell", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const arcUrl = new URL("../app/ArcFourStudio.tsx", import.meta.url);
  const registryUrl = new URL("../lib/module-studio-registry.ts", import.meta.url);
  const readerUrl = new URL("../app/ConcurrencyStudioReader.tsx", import.meta.url);
  const [studio, arc, registry, reader] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(arcUrl, "utf8"),
    readFile(registryUrl, "utf8"),
    readFile(readerUrl, "utf8"),
  ]);

  const exactInvariant =
    "Every admitted Atlas partition reaches exactly one terminal classification—`COMMITTED`, `FAILED`, or `CANCELLED`. If Atlas publishes a new index, that index is the deterministic fold of all and only `COMMITTED` partial results, and publication is permitted only when every required partition is `COMMITTED`. Every worker-visible effect remains accounted for as a process-local operation, an OS-mediated resource transition, and one step in a declared concurrent history; each shared transition is justified by one named owner or synchronization protocol, every progress claim states its blocking and fairness assumptions, and neither a clean exit, a passing stress run, the GIL, nor observed speedup substitutes for safety, liveness, or model-fit evidence.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(arc, /<ConcurrencyStudioReader \/>/);
  assert.match(arc, /href: "\/modules\/19-concurrency-parallelism"/);
  assert.match(registry, /concurrency:[\s\S]*?studioId: "concurrency"/);
  assert.match(registry, /import\("@\/app\/ConcurrencyStudioReader"\)/);
  assert.match(reader, /import\("@\/app\/ConcurrencyStudio"\)/);
  assert.match(reader, /Open the concurrency observatory/);
  assert.match(reader, /aria-expanded=\{isOpen\}/);
  assert.match(reader, /concurrency-observatory-panel/);
  assert.match(reader, /hidden=\{!isOpen\}/);
  assert.match(reader, /hasLaunched \? <ConcurrencyObservatory \/> : null/);
  const scrollableTables = [
    ...studio.matchAll(/<div[\s\S]{0,240}className=\{styles\.tableScroll\}[\s\S]{0,240}>/gu),
  ];
  assert.equal(scrollableTables.length, 7);
  assert.ok(
    scrollableTables.every((match) =>
      /aria-label=["'][^"']+["'][\s\S]*role=["']region["'][\s\S]*tabIndex=\{0\}/u.test(match[0]),
    ),
  );
  assert.match(
    studio,
    /aria-label="Scrollable preterminal state progression"[\s\S]{0,160}tabIndex=\{0\}/,
  );

  for (const viewLabel of [
    "History explorer",
    "Linearization lab",
    "Coordination console",
    "Progress laboratory",
    "Python model chooser",
    "Evidence auditor",
  ]) {
    assert.ok(studio.includes(`label: "${viewLabel}"`), viewLabel);
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{panelId\(view\.id\)\}/);
  assert.match(studio, /aria-selected=\{activeView === view\.id\}/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowDown"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "ArrowUp"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-live="polite"/);
  assert.match(
    studio,
    /aria-labelledby="concurrency-studio-title"/,
    "the complete studio region needs an accessible name",
  );
  assert.match(studio, /id="concurrency-studio-title"/);
  assert.match(
    studio,
    /<progress[\s\S]*?aria-label=/,
    "coverage progress needs a programmatic label",
  );
  assert.match(studio, /aria-label="Executed Module 19 runtime profile"/);
  assert.match(studio, /prefers-reduced-motion/);
  assert.doesNotMatch(studio, /window\.confirm/);

  assert.match(studio, /Confidence/);
  assert.match(studio, /\(\[1, 2, 3, 4\] as const\)/);
  assert.match(studio, /prediction === null \|\| confidence === null/);
  assert.match(studio, /Revise after evidence/);
  assert.match(studio, /What this proves/);
  assert.match(studio, /What remains unknown/);
});

test("Module 20 preserves its invariant and six-view protocol observatory", async () => {
  const studioUrl = new URL("../app/NetworkProtocolStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/NetworkProtocolStudio.module.css", import.meta.url);
  const arcUrl = new URL("../app/ArcFourStudio.tsx", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, arc, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(arcUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  const exactInvariant =
    "Every Atlas remote publication operation has one stable operation ID and canonical request digest. The client records the name-resolution and endpoint-attempt boundary, sends only a complete declared request framing, and never infers remote receipt, parsing, decision, commit, or acknowledgement from a local send, connection close, timeout, or retry. The server admits a complete valid request, records one decision for the pair (operation ID, request digest) before returning a response, replays that decision for an identical duplicate, and rejects reuse of the operation ID with a different digest. Only a valid matching response or a subsequent declared status lookup can confirm the server's recorded decision; every ambiguous client outcome remains explicitly UNKNOWN until resolved.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(arc, /<NetworkProtocolStudio \/>/);
  assert.match(arc, /href: "\/modules\/20-networks-application-protocols"/);
  assert.match(page, /<ModuleInteraction[\s\S]*courseModule=\{courseModule\}/);

  for (const viewLabel of [
    "Name → candidate",
    "Stream → frame",
    "Evidence ladder",
    "HTTP + Atlas",
    "Unknown → retry",
    "Patch auditor",
  ]) {
    assert.ok(studio.includes(`label: "${viewLabel}"`), viewLabel);
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{panelId\(view\.id\)\}/);
  assert.match(studio, /aria-selected=\{activeView === view\.id\}/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="network-protocol-studio-title"/);
  assert.match(studio, /aria-label="Exploration coverage: revealed protocol studio views"/);
  assert.match(style, /prefers-reduced-motion/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);

  assert.match(studio, /\(\[1, 2, 3, 4\] as const\)/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each observatory view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /record\.revealed &&/);
  assert.match(studio, /getBrowserProgressStorage/);
  assert.match(studio, /restoreModule20Progress/);
  assert.match(studio, /persistModule20Progress/);
  assert.match(studio, /clearModule20Progress/);
  assert.doesNotMatch(studio, /window\.localStorage/);
  assert.match(studio, /storageReady/);
  assert.match(studio, /declared length/);
  assert.match(studio, /UNKNOWN/);
  assert.match(studio, /Idempotency-Key/);
  assert.match(studio, /scope-labelled model evidence/);
});

test("Module 21 preserves its async invariant and six-view run control room", async () => {
  const studioUrl = new URL("../app/AsyncDistributedStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/AsyncDistributedStudio.module.css", import.meta.url);
  const arcUrl = new URL("../app/ArcFourStudio.tsx", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, arc, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(arcUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  const exactInvariant =
    "Every Atlas dispatch has one stable operation ID, canonical request digest, deadline, and evidence record. Local work is admitted through a bounded, explicitly owned async pipeline; every admitted local item receives one terminal local accounting record. Cancellation is cleaned up and propagated according to the owning structured scope, but is never mislabeled as a remote rollback. Every remote retry retains the same operation identity and is classified separately from a transport write, a server/replica observation, a matching reply, and an unresolved outcome. A trace context correlates declared observations; it does not authenticate them, make them complete, or prove causality, durability, or replicated agreement. In this collector case, the dispatch additionally declares its source set, admission bound, deadline/cancellation policy, and publication-cut rule before work starts.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(arc, /<AsyncDistributedStudio \/>/);
  assert.match(arc, /href: "\/modules\/21-async-distributed-systems"/);
  assert.match(page, /<ModuleInteraction[\s\S]*courseModule=\{courseModule\}/);

  for (const viewLabel of [
    "Coroutine → task",
    "Scope → cancellation",
    "Bound → admission",
    "RPC → UNKNOWN",
    "Trace → relation",
    "Claim → evidence",
  ]) {
    assert.ok(studio.includes(`label: "${viewLabel}"`), viewLabel);
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{panelId\(view\.id\)\}/);
  assert.match(studio, /aria-selected=\{activeView === view\.id\}/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="async-run-control-studio-title"/);
  assert.match(studio, /aria-label="Exploration coverage: revealed async run control views"/);
  assert.match(style, /prefers-reduced-motion/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);

  assert.match(studio, /\(\[1, 2, 3, 4\] as const\)/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each run-control view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /!record\.revealed && <EvidenceLock \/>/);
  assert.match(studio, /getBrowserProgressStorage/);
  assert.match(studio, /restoreModule21Progress/);
  assert.match(studio, /persistModule21Progress/);
  assert.match(studio, /clearModule21Progress/);
  assert.doesNotMatch(studio, /window\.localStorage/);
  assert.match(studio, /storageReady/);
  assert.match(studio, /TaskGroup/);
  assert.match(studio, /UNKNOWN_REMOTE/);
  assert.match(studio, /max_in_flight/);
  assert.match(studio, /drain/);
  assert.match(studio, /traceparent/);
  assert.match(studio, /FULL collection cut/);
  assert.match(studio, /does not establish/);
});

test("Module 22 preserves its trust invariant, six-view control room, and latest Arc IV landing", async () => {
  const studioUrl = new URL("../app/SecurityTrustStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/SecurityTrustStudio.module.css", import.meta.url);
  const arcUrl = new URL("../app/ArcFourStudio.tsx", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, arc, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(arcUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  const exactInvariant =
    "Atlas accepts an external value only as data until the receiving boundary validates its shape, size, provenance, and permitted meaning. Every security-sensitive effect has an authenticated subject, an explicit authorization decision scoped to action, resource, tenant, and purpose, and a redacted decision record. Untrusted data never selects arbitrary code, process execution, filesystem escape, database structure, network authority, or a raw secret-bearing log field. Release artifacts have declared dependency and build provenance; incident evidence is minimised and labelled with what it does and does not prove. A safe automatic denial/defer path explains the next accessible action and escalates unresolved authority to the named owner.";
  assert.ok(studio.includes(exactInvariant));
  assert.match(arc, /<SecurityTrustStudio \/>/);
  assert.match(arc, /href: "\/modules\/22-security-privacy-trust-boundaries"/);
  assert.match(
    arc,
    /const \[activeModule, setActiveModule\] = useState\(5\)/,
    "Arc IV should open its latest open module, Module 22",
  );
  assert.match(page, /<ModuleInteraction[\s\S]*courseModule=\{courseModule\}/);

  for (const viewLabel of [
    "Claim → boundary",
    "Identity → decision",
    "Data → authority",
    "Crypto → purpose",
    "Release → provenance",
    "Incident → restraint",
  ]) {
    assert.ok(studio.includes(`label: "${viewLabel}"`), viewLabel);
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /aria-controls=\{panelId\(view\.id\)\}/);
  assert.match(studio, /aria-selected=\{activeView === view\.id\}/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="security-trust-studio-title"/);
  assert.match(studio, /aria-label="Exploration coverage: revealed security and trust views"/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /label:has\(input:focus-visible\)/);
  assert.match(style, /td::before/);
  assert.match(style, /attr\(data-label\)/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);

  assert.match(studio, /\(\[1, 2, 3, 4\] as const\)/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each trust view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /!record\.revealed && <EvidenceLock \/>/);
  assert.match(studio, /getBrowserProgressStorage/);
  assert.match(studio, /restoreModule22Progress/);
  assert.match(studio, /persistModule22Progress/);
  assert.match(studio, /clearModule22Progress/);
  assert.doesNotMatch(studio, /window\.localStorage/);
  assert.match(studio, /storageReady/);
  assert.match(studio, /trace label supports correlation/);
  assert.match(studio, /worker-99/);
  assert.match(studio, /not established → deny\/defer/);
  assert.match(studio, /status lookup itself requires a separately authorized action/);
  assert.match(studio, /live effects/);
});

test("Module 23 preserves its language-boundary invariant, six-view studio, and safe local progress shape", async () => {
  const studioUrl = new URL("../app/LanguageInterpreterStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/LanguageInterpreterStudio.module.css", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  const invariant =
    "Structure is data; authority is separate and explicit. A successful parse establishes only the declared grammar shape. Atlas checks a bounded contract, resource budget, and authorization decision before a fixed-scope capability can support one local model operation. The evaluator has no ambient Python authority.";
  assert.ok(studio.includes(invariant));
  assert.match(page, /<ModuleInteraction[\s\S]*courseModule=\{courseModule\}/);

  for (const viewLabel of [
    "Text → tree",
    "Tokens → tree",
    "Names → closure",
    "Tree → meaning",
    "Contract → capability",
    "Source → observation",
  ]) {
    assert.ok(
      studio.includes("label: \"" + viewLabel + "\""),
      viewLabel,
    );
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="language-interpreter-studio-title"/);
  assert.match(studio, /getBrowserProgressStorage/);
  assert.match(studio, /restoreModule23Progress/);
  assert.match(studio, /persistModule23Progress/);
  assert.match(studio, /clearModule23Progress/);
  assert.doesNotMatch(studio, /window\.localStorage/);
  assert.match(studio, /storageReady/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each language view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /!record\.revealed && <EvidenceLock \/>/);
  assert.match(
    studio,
    /styles\.modeTabs} aria-label="Evaluation rule examples" role="group"/,
    "the semantic examples are ordinary pressed-button controls, not incomplete tabs",
  );
  for (const [scenario, outcome] of [
    ["lexical_rejection", "LEX_ERROR"],
    ["syntax_rejection", "PARSE_ERROR"],
    ["contract_rejection", "CONTRACT_ERROR"],
    ["authorization_denial", "DENIED_AUTHORIZATION"],
    ["successful_count", "RESULT · count = 2"],
  ]) {
    assert.match(studio, new RegExp('scenario: "' + scenario + '"'));
    assert.ok(studio.includes('status: "' + outcome + '"'), outcome);
  }
  assert.match(studio, /not a local evidence packet/);
  assert.match(studio, /no ambient Python authority/);
  assert.match(studio, /never selects its host adapter/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /focus-visible/);
});

test("Module 24 preserves its runtime-evidence invariant and six-view observatory", async () => {
  const studioUrl = new URL("../app/RuntimeEvidenceObservatory.tsx", import.meta.url);
  const styleUrl = new URL("../app/RuntimeEvidenceObservatory.module.css", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  assert.ok(
    studio.includes(
      "An optimization is accepted only after semantic behavior, privacy/retention boundaries, implementation scope, and a controlled measurement are kept distinct.",
    ),
  );
  assert.match(page, /<ModuleInteraction[\s\S]*courseModule=\{courseModule\}/);

  for (const viewLabel of [
    "Contract → claim",
    "Names → graph",
    "Cycle → cleanup",
    "Metric → scope",
    "Source → runtime",
    "Patch → decision",
  ]) {
    assert.ok(studio.includes('label: "' + viewLabel + '"'), viewLabel);
  }

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="runtime-evidence-observatory-title"/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each runtime-evidence view has one confidence-aware prediction gate",
  );
  assert.match(studio, /record\.choice !== null && record\.confidence !== null/);
  assert.match(studio, /!record\.revealed && <EvidenceLock \/>/);
  assert.match(studio, /not a profiler,/);
  assert.match(studio, /not a CPython emulator,/);
  assert.match(studio, /not a license\s+to collect\s+private learner traces/);
  assert.match(studio, /AI-generated patch, a green\s+CI run, private deployment, or a lower isolated metric/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /focus-visible/);
});

test("Module 25 preserves its decision-support invariant, six-view studio, and safe local progress shape", async () => {
  const studioUrl = new URL("../app/EvidenceGroundedStudio.tsx", import.meta.url);
  const styleUrl = new URL("../app/EvidenceGroundedStudio.module.css", import.meta.url);
  const pageUrl = new URL("../app/modules/[slug]/page.tsx", import.meta.url);
  const [studio, style, page] = await Promise.all([
    readFile(studioUrl, "utf8"),
    readFile(styleUrl, "utf8"),
    readFile(pageUrl, "utf8"),
  ]);

  assert.ok(
    studio.includes(
      "A score never silently changes learner state, grants authority, proves truth, establishes causality, or turns feedback into ground truth.",
    ),
  );
  assert.match(page, /<ModuleInteraction[\s\S]*courseModule=\{courseModule\}/);

  for (const viewLabel of [
    "Purpose → boundary",
    "Event → claim",
    "Candidates → reason",
    "Score → evidence",
    "Explanation → override",
    "Proposal → review",
  ]) {
    assert.ok(studio.includes('label: "' + viewLabel + '"'), viewLabel);
  }
  assert.ok(
    studio.indexOf('id: "transaction"') < studio.indexOf('id: "repair"'),
    "the visual baseline presents its 13-point candidate before its 8-point candidate",
  );

  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /aria-labelledby="evidence-grounded-studio-title"/);
  assert.match(studio, /getBrowserProgressStorage/);
  assert.match(studio, /restoreModule25Progress/);
  assert.match(studio, /persistModule25Progress/);
  assert.match(studio, /clearModule25Progress/);
  assert.doesNotMatch(studio, /window\.localStorage/);
  assert.match(studio, /storageReady/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each decision-support view has one confidence-aware prediction gate",
  );
  assert.match(studio, /!record\.revealed && <EvidenceLock \/>/);
  assert.match(studio, /<b>0<\/b> live learner records/);
  assert.match(studio, /Never alter a plan, calendar, or record/);
  assert.match(studio, /setDecisionResponse/);
  assert.match(studio, /role="status"/);
  assert.match(studio, /changed no learner record, plan, or schedule/);
  assert.match(studio, /never sends or changes\s+personal data/);
  assert.doesNotMatch(studio, /window\.confirm/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /focus-visible/);
});

test("Module 26 renders an evidence-first capstone preview without opening its studio", async () => {
  const response = await render(
    "/modules/26-systems-capstone-open-source-stewardship",
  );
  assert.equal(response.status, 200);

  const document = new JSDOM(await response.text()).window.document;
  const article = document.querySelector("#module-reading-article");
  assert.ok(article);
  assert.match(
    article.textContent ?? "",
    /Atlas may be released only as a versioned, bounded capability/,
  );
  assert.match(article.textContent ?? "", /Release Brief/);
  assert.match(
    article.textContent ?? "",
    /The defense tests the architecture, not presentation skill/,
  );
  assert.equal(
    document.querySelector("#capstone-defense-studio-title"),
    null,
    "the preview must not mount a gated studio",
  );
  assert.equal(
    document.querySelector("[aria-label='Post-module learning conversation']"),
    null,
    "the preview must not expose a gated oral-defense flow",
  );
  assert.doesNotMatch(
    document.body.textContent ?? "",
    /Teaching Assistant · oral-defense context|Study Partner · rehearsal context/u,
    "the preview must not expose a module companion package",
  );
});

test("release architecture keeps Notion capture out of the portal runtime", async () => {
  const architectureUrl = new URL("../docs/ARCHITECTURE.md", import.meta.url);
  const privacyUrl = new URL("../docs/PRIVACY.md", import.meta.url);
  const [architecture, privacy] = await Promise.all([
    readFile(architectureUrl, "utf8"),
    readFile(privacyUrl, "utf8"),
  ]);

  assert.match(architecture, /no Notion runtime integration or automatic/);
  assert.match(architecture, /designated external Codex learning/);
  assert.match(privacy, /Notion page exports, IDs, private notes, or learner journal content/);
});

test("Module 19 withholds each view's answer-bearing evidence until prediction and confidence", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");

  const answerSurfaces = new Map([
    ["HistoryExplorer", "metricTriptych"],
    ["LinearizationLab", "criticalSection"],
    ["CoordinationConsole", "coordinationInstrument"],
    ["ProgressLaboratory", "progressBuilder"],
    ["ModelChooser", "modelRecommendation"],
    ["EvidenceAuditor", "digestGate"],
  ]);
  for (const [componentName, answerSurface] of answerSurfaces) {
    const component = extractFunctionSource(studio, componentName);
    assertPredictionGated(component, componentName);
    assert.match(
      component,
      /<table/,
      `${componentName} supplies a text/table equivalent`,
    );
    assert.ok(
      component.indexOf(`styles.${answerSurface}`) >
        component.indexOf("!answer.revealed"),
      `${componentName}'s ${answerSurface} appears only in the post-reveal branch`,
    );
  }

  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "every view has exactly one prediction gate",
  );
  assert.equal(
    [...studio.matchAll(/<EvidenceLock\b/gu)].length,
    6,
    "every view has exactly one pre-reveal evidence cover",
  );

  const history = extractFunctionSource(studio, "HistoryExplorer");
  const linearization = extractFunctionSource(studio, "LinearizationLab");
  const coordination = extractFunctionSource(studio, "CoordinationConsole");
  assert.equal(
    [...history.matchAll(/<CheckpointGate\b/gu)].length,
    2,
    "history results and the 20-schedule census each need their own prediction checkpoint",
  );
  assert.match(history, /historyEvidenceRevealed/);
  assert.match(history, /historyCensusCheckpoint/);
  assert.match(history, /Commit this history prediction/);
  assert.match(history, /Commit the census prediction/);
  assert.equal(
    [...linearization.matchAll(/<CheckpointGate\b/gu)].length,
    1,
    "linearization needs a failing-history and point checkpoint",
  );
  assert.match(linearization, /linearizationEvidenceRevealed/);
  assert.match(linearization, /failing history/i);
  assert.match(linearization, /Where can this chosen protocol linearize/i);
  assert.equal(
    [...coordination.matchAll(/<CheckpointGate\b/gu)].length,
    1,
    "wake, queue, join, and shutdown actions share an action-specific checkpoint",
  );
  assert.match(coordination, /GATED_COORDINATION_ACTIONS/);
  assert.match(coordination, /coordinationPendingAction/);
  assert.match(coordination, /outcome, governing fact, and confidence/i);
});

test("Module 19 history explorer uses the shared postings fixture and all 20 legal schedules", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");
  const history = extractFunctionSource(studio, "HistoryExplorer");
  const enumerator = extractFunctionSource(
    studio,
    "enumerateTwoWorkerSchedules",
  );
  const tracer = extractFunctionSource(studio, "traceHistory");

  assert.match(history, /term(?:\s+is|:)\s*["“]?graph/i);
  assert.match(history, /postings[\s\S]*?\(1,\)/i);
  assert.match(history, /Partition A[\s\S]*?document 2/i);
  assert.match(history, /partition B[\s\S]*?document 3/i);
  assert.match(history, /\(1, 2, 3\)/);

  assert.match(enumerator, /aCount === 3 && bCount === 3/);
  assert.match(enumerator, /aCount < 3/);
  assert.match(enumerator, /bCount < 3/);
  assert.match(studio, /const ALL_TWO_WORKER_SCHEDULES = enumerateTwoWorkerSchedules\(\)/);
  assert.match(history, /ALL_TWO_WORKER_SCHEDULES\.map/);
  assert.match(history, /All 20 legal schedules and explored-state record/);
  assert.match(history, /record\.completedHistories/);
  assert.match(history, /Next A/);
  assert.match(history, /Next B/);
  assert.match(history, /aria-label="Choose the next enabled worker"/);
  assert.match(history, /role="group"/);
  assert.match(history, /serial-equivalent/i);
  assert.match(history, /violating/i);

  assert.match(tracer, /let shared = \[1\]/);
  assert.match(tracer, /postings\.length === 1/);
  assert.match(tracer, /worker === "A" \? 2 : 3/);
  assert.match(tracer, /oracle: "\(1, 2, 3\)"/);
  assert.match(tracer, /schedule\.length === 6/);
});

test("Module 19 keeps coordination lifecycle facts and terminal classifications distinct", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");
  const coordination = extractFunctionSource(studio, "CoordinationConsole");
  const applyAction = extractFunctionSource(studio, "applyCoordinationAction");
  const evidence = extractFunctionSource(studio, "EvidenceAuditor");

  for (const action of [
    "put",
    "get",
    "wait",
    "notify",
    "task_done",
    "join",
    "stop",
  ]) {
    assert.match(coordination, new RegExp(`["\`]${action}["\`]`), action);
  }
  for (const fact of [
    "Lock owner",
    "Queue contents",
    "Unfinished",
    "In flight",
    "Terminal",
    "Reduction gate",
  ]) {
    assert.match(coordination, new RegExp(fact, "i"), fact);
  }
  assert.match(coordination, /PARTIAL_READY[\s\S]{0,120}preterminal/i);
  assert.doesNotMatch(
    coordination,
    /Partition terminal<\/span>[\s\S]{0,80}<strong>PARTIAL_READY<\/strong>/,
    "PARTIAL_READY must not be labeled terminal",
  );
  assert.match(applyAction, /const drainedCount = next\.queue\.length/);
  assert.match(
    applyAction,
    /next\.unfinished = Math\.max\(0, next\.unfinished - drainedCount\)/,
  );
  assert.doesNotMatch(
    applyAction,
    /immediate_stop[\s\S]{0,240}next\.unfinished = 0/,
    "immediate shutdown may discard queued work but must not erase claimed work accounting",
  );
  assert.match(applyAction, /claimed task\(s\) still keep join waiting/);

  for (const state of [
    "ADMITTED",
    "ENQUEUED",
    "CLAIMED",
    "PARTIAL_READY",
    "COMMIT_STARTED",
    "COMMITTED",
    "FAILED",
    "CANCELLED",
  ]) {
    assert.match(evidence, new RegExp(`["\`]${state}["\`]`), state);
  }
  assert.match(
    evidence,
    /(?:terminal|terminals)\s*=\s*\[\s*"COMMITTED",\s*"FAILED",\s*"CANCELLED"\s*\]/,
  );
  assert.match(evidence, /PARTIAL_READY[\s\S]{0,160}preterminal/i);
  assert.match(evidence, /aria-label="[^"]*terminal[^"]*state[^"]*"/i);
});

test("Module 19 model chooser requires a complete decision record and guards native/GIL claims", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");
  const model = extractFunctionSource(studio, "ModelChooser");

  for (const field of [
    "workload",
    "independence",
    "sharing",
    "transfer",
    "isolation",
    "lifetime",
    "failure",
    "cancellation",
    "build",
    "gil",
    "nativeContract",
    "candidate",
    "evidencePlan",
  ]) {
    assert.match(model, new RegExp(`\\b${field}\\b`), field);
  }
  assert.match(model, /record\.modelChoice/);
  assert.match(model, /onRecordChange/);
  assert.match(model, /role="group"/);
  assert.match(model, /aria-label=/);
  assert.match(model, /recommendation[\s\S]{0,160}withheld/i);
  assert.match(model, /gil\s*===\s*"enabled"/);
  assert.match(model, /nativeContract\s*!==\s*"releases"/);
  assert.match(model, /build\s*===\s*"free-threaded"/);
  assert.match(model, /nativeContract\s*!==\s*"compatible"/);
  assert.match(model, /semantic[\s-]equivalence/i);
  assert.match(model, /speedup/i);
  assert.match(model, /documentation-only/);
});

test("Module 19 evidence auditor uses the real fixture digest and per-axis patch decisions", async () => {
  const studioUrl = new URL("../app/ConcurrencyStudio.tsx", import.meta.url);
  const studio = await readFile(studioUrl, "utf8");
  const evidence = extractFunctionSource(studio, "EvidenceAuditor");

  assert.match(evidence, /2 \/ 2 current partitions COMMITTED/);
  assert.match(evidence, /3-document snapshot/);
  assert.match(
    evidence,
    /3e2899703a3a5f16bbf6905d6ddd9b819a2e2f69ebe9fb4750f6ebda08c4da66/,
  );
  assert.doesNotMatch(evidence, /12 \/ 12|8fd2…c041/);

  for (const variant of [
    "owner",
    "shared",
    "narrow",
    "callback",
    "empty",
    "swallowed",
    "child",
    "gil",
  ]) {
    assert.match(evidence, new RegExp(`["\`]${variant}["\`]`), variant);
  }
  for (const axis of [
    "Behavior",
    "Tests",
    "Portability",
    "Progress",
    "Model fit",
    "Documentation",
  ]) {
    assert.match(studio, new RegExp(`label: ["\`]${axis}["\`]`), axis);
  }
  assert.match(evidence, /PATCH_AXES\.map/);
  assert.match(evidence, /record\.patchDecisions\[axis\.id\]/);
  assert.match(evidence, /\["accept", "reject", "split"\] as const/);
  assert.match(evidence, /aria-label="[^"]*patch[^"]*decision/i);
  assert.match(evidence, /Copy approved instructor brief/i);
  assert.match(evidence, /What this proves/);
  assert.match(evidence, /What remains unknown/);
});

test("generated module manifest projects the canonical graph without bypassing prerequisites", async () => {
  const manifestUrl = new URL("../content/modules/manifest.json", import.meta.url);
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  const numbers = manifest.modules.map((courseModule) => courseModule.number);
  const byNumber = new Map(
    manifest.modules.map((courseModule) => [courseModule.number, courseModule]),
  );

  assert.equal(manifest.schemaVersion, 4);
  assert.equal(manifest.courseGraphSchemaVersion, 2);
  assert.equal(manifest.routePlanId, "atlas-core-60");
  assert.equal(manifest.definedModuleCount, 36);
  assert.equal(manifest.readerVisibleModuleCount, 30);
  assert.equal(manifest.legacyOpenModuleCount, 28);
  assert.equal(manifest.publishedModuleCount, 0);
  assert.equal(manifest.previewReaderModuleCount, 2);
  assert.deepEqual(numbers, Array.from({ length: 30 }, (_, index) => index + 1));
  assert.equal(manifest.arcs.length, 6);

  const module5 = byNumber.get(5);
  const module6 = byNumber.get(6);
  const module17 = byNumber.get(17);
  const module18 = byNumber.get(18);
  const module24 = byNumber.get(24);
  const module25 = byNumber.get(25);
  const module26 = byNumber.get(26);
  const module27 = byNumber.get(27);
  const module28 = byNumber.get(28);
  const module30 = byNumber.get(30);

  assert.deepEqual(module18.prerequisiteNumbers, [17]);
  assert.deepEqual(module18.prerequisiteSlugs, [module17.slug]);
  assert.equal(module18.previousRouteNumber, 31);
  assert.equal(module18.previousSlug, null);
  assert.equal(module18.nextSlug, byNumber.get(19).slug);
  assert.deepEqual(module6.prerequisiteNumbers, [5]);
  assert.equal(module6.previousSlug, module27.slug);
  assert.equal(module5.nextSlug, module27.slug);
  assert.deepEqual(module28.prerequisiteNumbers, [17, 27]);
  assert.deepEqual(module30.prerequisiteNumbers, [27, 29]);
  assert.equal(module30.nextRouteNumber, 31);
  assert.equal(module30.nextSlug, null);
  assert.equal(module24.nextRouteNumber, 32);
  assert.equal(module24.nextSlug, null);
  assert.equal(module25.state.availability, "preview");
  assert.deepEqual(module25.prerequisiteNumbers, [22, 24, 30, 31, 34, 35, 36]);
  assert.equal(module25.previousRouteNumber, 36);
  assert.equal(module25.previousSlug, null);
  assert.equal(module25.nextSlug, module26.slug);
  assert.equal(module26.state.availability, "preview");
  assert.equal(module26.previousSlug, module25.slug);
});

test("module synchronization uses checked-in inputs and normalizes line endings before hashing", async () => {
  const syncUrl = new URL("../scripts/sync-modules.mjs", import.meta.url);
  const synchronizer = await readFile(syncUrl, "utf8");

  assert.match(synchronizer, /function normalizeNewlines\(value\)/);
  assert.match(synchronizer, /value\.replace\(\/\\r\\n\?\/gu, "\\n"\)/);
  assert.match(synchronizer, /normalizeNewlines\(current\) === normalizedContent/);
  assert.match(
    synchronizer,
    /const moduleDirectory = resolve\(siteRoot, "content", "modules"\);/,
  );
  assert.match(synchronizer, /const releaseInputsPath = resolve\(/);
  assert.match(
    synchronizer,
    /const markdown = normalizeNewlines\(await readFile\(workbookPath, "utf8"\)\);/,
  );
  assert.doesNotMatch(synchronizer, /resolve\(siteRoot, "\.\.", "modules"\)/);
  assert.doesNotMatch(synchronizer, /resolve\(siteRoot, "\.\.", "research"\)/);
  assert.doesNotMatch(synchronizer, /resolve\(siteRoot, "\.\.", "work"\)/);
});

test("table-of-contents IDs account for lower-level heading collisions", () => {
  const markdown = [
    "## Start",
    "#### Repeated label",
    "## Repeated label",
    "### APIs named `__all__` and `_grow`",
    "```markdown",
    "##### Repeated label",
    "```",
    "### Finish",
  ].join("\n");

  assert.deepEqual(extractTableOfContents(markdown), [
    { id: "start", title: "Start", depth: 2 },
    { id: "repeated-label-1", title: "Repeated label", depth: 2 },
    {
      id: "apis-named-__all__-and-_grow",
      title: "APIs named __all__ and _grow",
      depth: 3,
    },
    { id: "finish", title: "Finish", depth: 3 },
  ]);
});

test("renders the arc-grouped course library", async () => {
  const response = await render("/modules");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /One course\./);
  assert.match(html, /Every connection visible\./);
  assert.match(html, /groups them by knowledge arc for reference browsing/);
  assert.match(html, /href="\/route"/);
  assert.match(html, /60-day route/);
  assert.match(html, /Computation &amp; reasoning/);
  assert.match(html, /Data &amp; algorithms/);
  assert.match(html, /Durable software/);
  assert.match(html, /Machine &amp; network/);
  assert.match(html, /Languages &amp; intelligence/);
  assert.match(html, /Values, State, and Execution/);
  assert.match(html, /Relational Data and Transactions/);
  assert.match(html, /Computer Architecture and the Execution Stack/);
  assert.match(html, /Operating Systems and Resource Mediation/);
  assert.match(html, /Concurrency and Parallelism/);
  assert.match(html, /Networks and Application Protocols/);
  assert.match(html, /Async and Distributed Systems/);
  assert.match(html, /Security, Privacy &amp; Trust Boundaries/);
  assert.match(html, /Programming Languages, Interpreters &amp; Bounded Evaluation/);
  assert.match(html, /CPython, Performance &amp; Memory Evidence/);
  assert.match(html, /Evidence-Grounded Intelligent &amp; Human-Centered Systems/);
  assert.match(html, /Systems Capstone, Open-Source Stewardship &amp; Oral Architecture Defense/);
  assert.match(html, /Mathematical foundations/);
  assert.match(html, /Discrete Mathematics, Proof, Counting &amp; Structures/);
  assert.match(html, /Linear Algebra, Numerical Stability &amp; Representation/);
  assert.match(html, /Calculus, Real Analysis &amp; Continuous Change/);
  assert.match(html, /Probability, Statistics &amp; Scientific Inference/);
  assert.match(html, /<dt>28<\/dt>/);
  assert.match(html, /gated synthesis previews/);
});

test("renders a complete generated module reading route", async () => {
  const response = await render("/modules/01-values-state-execution");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Module 1: Values, State, and Execution · Atlas Academy/);
  assert.match(html, /Complete Module 1 workbook/);
  assert.match(html, /Open legacy reader/);
  assert.match(html, /Opening, reading, or using a studio does not mark academic prerequisites complete/);
  assert.match(html, /Why this module comes first/);
  assert.match(html, /On this page/);
  assert.match(html, /Foundation placement diagnostic and learning brief/);
  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-valuemin="0"/);
  assert.match(html, /aria-valuemax="100"/);
  assert.match(html, /Text alternative:/);
  assert.match(
    html,
    /An expression is evaluated in an environment, objects are found or created/u,
  );
  assert.match(html, /m01-evaluation-binding-transition-alternative/);
  assert.match(html, /Diagram source \(technical fallback\)/);
  assert.doesNotMatch(html, /Diagram source and text fallback/);
  assert.match(html, /class="lesson-table-scroll"/);
  assert.doesNotMatch(html, /aria-label="Scrollable lesson table"/);
  assert.match(html, /Canonical workbook snapshot/);
  assert.match(html, /class="heading-anchor"/);
  assert.match(html, /aria-label="Link to this section"/);
  assert.match(html, /Workbook-led interaction/);
  assert.match(html, /This open workbook has no separate visual studio/);
  assert.match(html, /href="#oral-defense-1-title"/);
  assert.match(
    html,
    /aria-hidden="true" class="external-link-mark">↗<\/span>/,
  );
});

test("keeps authoring-only modules out of the learner reader", async () => {
  const response = await render("/modules/31-optimization-information");
  assert.equal(response.status, 404);
});

test("all generated lessons have valid internal links and math", async () => {
  const manifestUrl = new URL("../content/modules/manifest.json", import.meta.url);
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

  for (const courseModule of manifest.modules) {
    const response = await render(`/modules/${courseModule.slug}`);
    assert.equal(response.status, 200, courseModule.slug);

    const html = await response.text();
    const ids = new Set(
      [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]),
    );
    const fragments = [
      ...html.matchAll(/\shref="#([^"]+)"/gu),
    ].map((match) => match[1]);

    assert.doesNotMatch(html, /katex-error/, courseModule.slug);
    for (const fragment of fragments) {
      assert.ok(
        ids.has(fragment),
        `${courseModule.slug} links to missing #${fragment}`,
      );
    }
  }
});

test("every diagnostic learning route resolves to an open lesson section", async () => {
  const routesByPath = new Map();
  for (const question of diagnosticQuestions) {
    const route = new URL(question.route.href, "http://localhost");
    const routes = routesByPath.get(route.pathname) ?? [];
    routes.push({
      fragment: decodeURIComponent(route.hash.slice(1)),
      questionId: question.id,
    });
    routesByPath.set(route.pathname, routes);
  }

  for (const [pathname, routes] of routesByPath) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    const ids = new Set(
      [...html.matchAll(/\sid="([^"]+)"/gu)].map((match) => match[1]),
    );
    for (const route of routes) {
      assert.ok(
        ids.has(route.fragment),
        `${route.questionId} links to missing ${pathname}#${route.fragment}`,
      );
    }
  }
});

test("renders the finalized relational-transactions workbook", async () => {
  const response = await render("/modules/16-relational-data-transactions");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Module 16: Relational Data and Transactions · Atlas Academy/);
  assert.match(html, /Complete Module 16 workbook/);
  assert.match(html, /Relations, identity, functional dependencies, and normalization/);
  assert.match(html, /Runnable Atlas repository reference and adversarial checks/);
  assert.match(html, /ImportValidatedBundle/);
  assert.match(html, /SqliteEventRepository/);
  assert.match(html, /WAL, recovery, backup, and bounded durability claims/);
  assert.match(html, /Question 8 — Commit, retry, WAL, and backup/);
  assert.match(html, /class="katex-display"/);
  assert.doesNotMatch(html, /katex-error/);
});

test("renders the finalized computer-architecture workbook", async () => {
  const response = await render(
    "/modules/17-computer-architecture-execution-stack",
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 17: Computer Architecture and the Execution Stack · Atlas Academy/,
  );
  assert.match(html, /Complete Module 17 workbook/);
  assert.match(html, /Bits, width, signedness, and byte order/);
  assert.match(html, /ISA state and the load\/store contract/);
  assert.match(html, /Memory hierarchy, cache lines, and locality/);
  assert.match(html, /I\/O is a boundary, not a single transfer/);
  assert.match(html, /Runnable Atlas architecture evidence reference/);
  assert.match(html, /count_due/);
  assert.match(html, /not the host CPU cache/);
  assert.match(html, /href="\/downloads\/module17_reference\.py"/);
  assert.match(html, /Question 8 — Benchmark evidence and causal claims/);
  assert.match(html, /class="katex-display"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module17_reference.py",
    import.meta.url,
  );
  const reference = await readFile(referenceUrl, "utf8");
  assert.match(reference, /atlas\.module17\.architecture-evidence\.v2/);
  assert.match(reference, /first-timed-block-for-condition/);
  assert.doesNotMatch(reference, /tracemalloc|sys\.getsizeof/);
});

test("renders the finalized operating-systems workbook", async () => {
  const response = await render(
    "/modules/18-operating-systems-resource-mediation",
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 18: Operating Systems and Resource Mediation · Atlas Academy/,
  );
  assert.match(html, /Complete Module 18 workbook/);
  assert.match(html, /Finite resources force a mediator/);
  assert.match(html, /A program becomes a process/);
  assert.match(html, /Virtual memory: the private-address-space illusion/);
  assert.match(
    html,
    /Files are names, open resources, caches, and persistence protocols/,
  );
  assert.match(html, /Interruption and shutdown/);
  assert.match(html, /Runnable Atlas operating-systems reference/);
  assert.match(html, /Six connected teaching sessions/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Confidence-aware understanding check/);
  assert.match(html, /Cumulative project, TA protocol, and mastery evidence/);
  assert.match(html, /Explicit backward and forward connections/);
  assert.match(
    html,
    /Source ledger, licensing, claim boundaries, and freshness/,
  );
  assert.match(html, /href="\/downloads\/module18_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module18_reference\.py"/);
  assert.match(html, /class="katex-display"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module18_reference.py",
    import.meta.url,
  );
  const reference = await readFile(referenceUrl, "utf8");
  const testsUrl = new URL(
    "../public/downloads/test_module18_reference.py",
    import.meta.url,
  );
  const referenceTests = await readFile(testsUrl, "utf8");
  assert.match(reference, /atlas\.module18\.os-evidence\.v1/);
  assert.match(reference, /phase_observations/);
  assert.match(reference, /artifact_observations/);
  assert.match(reference, /runtime_profile/);
  assert.match(reference, /claim_boundaries/);
  assert.match(reference, /WORKER_PHASE_EDGES = frozenset/);
  assert.match(reference, /status = "INVALID_MAPPING"/);
  assert.match(reference, /valid_mapping=valid_mapping/);
  assert.match(reference, /file_backed=file_backed/);
  assert.match(reference, /exceeds-bounded-read-limit/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:threading|multiprocessing|socket|tracemalloc|gc)\b/,
  );
  assert.match(referenceTests, /import module18_reference as reference/);
  assert.match(referenceTests, /\("STARTED", "VALIDATED"\)/);
  assert.match(referenceTests, /"INVALID_MAPPING"/);
  assert.match(referenceTests, /oversized-foreign\.tmp/);
  assert.match(referenceTests, /Module18ReferenceTests/);
});

test("renders the M12 and M13 bounded model packages as honest learner downloads", async () => {
  const [module12Response, module13Response, module12Reference, module13Reference] = await Promise.all([
    render("/modules/12-modules-apis-types-dependencies"),
    render("/modules/13-specifications-testing-debugging-observability"),
    readFile(new URL("../public/downloads/module12_reference.py", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/module13_reference.py", import.meta.url), "utf8"),
  ]);
  assert.equal(module12Response.status, 200);
  assert.equal(module13Response.status, 200);

  const [module12Html, module13Html] = await Promise.all([
    module12Response.text(),
    module13Response.text(),
  ]);
  assert.match(module12Html, /Bounded dependency-direction model package/);
  assert.match(module12Html, /href="\/downloads\/module12_reference\.py"/);
  assert.match(module12Html, /href="\/downloads\/test_module12_reference\.py"/);
  assert.match(module12Html, /does not parse Python imports or prove runtime behavior/);
  assert.match(module13Html, /Bounded terminal-signal model package/);
  assert.match(module13Html, /href="\/downloads\/module13_reference\.py"/);
  assert.match(module13Html, /href="\/downloads\/test_module13_reference\.py"/);
  assert.match(module13Html, /does not execute an importer or prove remote completion/);

  const prohibitedRuntimeImport =
    /(?:^|\n)\s*(?:from|import)\s+(?:os|subprocess|socket|requests|urllib|http(?:\.client)?|pathlib|shutil|tempfile|asyncio|threading|multiprocessing|pickle|marshal|sqlite3|tarfile|zipfile)\b/;
  assert.match(
    "from socket import socket",
    prohibitedRuntimeImport,
    "the bounded-model import rule must recognize a prohibited runtime import",
  );
  assert.doesNotMatch(
    module12Reference,
    prohibitedRuntimeImport,
    "M12's public model must remain a finite local reasoning aid",
  );
  assert.doesNotMatch(
    module13Reference,
    prohibitedRuntimeImport,
    "M13's public model must remain a finite local reasoning aid",
  );
});

test("renders the finalized concurrency-and-parallelism workbook", async () => {
  const response = await render("/modules/19-concurrency-parallelism");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 19: Concurrency and Parallelism · Atlas Academy/,
  );
  assert.match(html, /Complete Module 19 workbook/);
  assert.match(html, /A second worker creates histories/);
  assert.match(html, /Protect one logical transition/);
  assert.match(html, /Predicates, permits, and item ownership/);
  assert.match(html, /Progress can fail/);
  assert.match(html, /Choose the Python execution model from first principles/);
  assert.match(html, /Atlas multi-worker evidence defense/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Confidence-aware understanding check/);
  assert.match(html, /TA Studio A — History and linearization coroner/);
  assert.match(html, /TA Studio B — Coordination and progress clinic/);
  assert.match(html, /TA Studio C — Execution-model and agent-patch defense/);
  assert.match(html, /href="\/downloads\/module19_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module19_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module19_reference.py",
    import.meta.url,
  );
  const reference = await readFile(referenceUrl, "utf8");
  const testsUrl = new URL(
    "../public/downloads/test_module19_reference.py",
    import.meta.url,
  );
  const referenceTests = await readFile(testsUrl, "utf8");
  assert.match(reference, /atlas\.module19-evidence\.v1/);
  assert.match(reference, /explore_two_increment_schedules/);
  assert.match(reference, /explore_locked_increment_schedules/);
  assert.match(reference, /analyze_lock_orders/);
  assert.match(reference, /run_indexer/);
  assert.match(reference, /runtime_concurrency_profile/);
  assert.match(reference, /choose_execution_model/);
  assert.match(reference, /classify_stop_action/);
  assert.match(reference, /observed_completion_order/);
  assert.match(reference, /commit_order/);
  assert.match(reference, /cancellation_causes/);
  assert.match(referenceTests, /import module19_reference as reference/);
  assert.match(referenceTests, /Module19ReferenceTests/);
});

test("renders the finalized networks-and-application-protocols workbook", async () => {
  const response = await render("/modules/20-networks-application-protocols");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 20: Networks and Application Protocols · Atlas Academy/,
  );
  assert.match(html, /Complete Module 20 workbook/);
  assert.match(html, /Protocol observatory/);
  assert.match(html, /Cross the boundary\./);
  assert.match(html, /A name is not a remote effect/);
  assert.match(html, /Transport carries bytes, not your request/);
  assert.match(html, /A response is evidence with a scope/);
  assert.match(html, /HTTP gives semantics; Atlas still owns policy/);
  assert.match(html, /Retry is an epistemic problem before it is a loop/);
  assert.match(html, /Make network knowledge auditable/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Confidence-aware understanding check/);
  assert.match(html, /TA Studio A — Framing coroner/);
  assert.match(html, /TA Studio B — Timeout incident board/);
  assert.match(html, /TA Studio C — Agent patch and evidence clinic/);
  assert.match(html, /Atlas remote-publication protocol dossier/);
  assert.match(html, /href="\/downloads\/module20_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module20_reference\.py"/);
  assert.match(html, /canonical checked-in learner source is/);
  assert.match(html, /public\/downloads\/module20_reference\.py/);
  assert.match(html, /Download-only path/);
  assert.doesNotMatch(html, /work\/module20_reference\.py/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module20_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module20_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /class FrameDecoder/);
  assert.match(reference, /class AtlasPublicationServer/);
  assert.match(reference, /class IdempotencyLedger/);
  assert.match(reference, /atlas\.module20\.evidence\/1/);
  assert.match(reference, /timeout_then_lookup/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client)\b/,
  );
  assert.match(referenceTests, /import module20_reference as reference/);
  assert.match(referenceTests, /Module20ReferenceTests/);
  assert.match(
    referenceTests,
    /test_every_two_chunk_partition_reaches_the_ledger_only_after_one_frame/,
  );
});

test("renders the finalized async-and-distributed-systems workbook", async () => {
  const response = await render("/modules/21-async-distributed-systems");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 21: Async and Distributed Systems · Atlas Academy/,
  );
  assert.match(html, /Complete Module 21 workbook/);
  assert.match(html, /Atlas Run Control Room/);
  assert.match(html, /await releases control; it does not transfer responsibility/);
  assert.match(html, /Structured lifetime gives a boundary, not magic rollback/);
  assert.match(html, /Bounded admission makes overload a policy decision/);
  assert.match(html, /Partial failure is an evidence problem before it is retry code/);
  assert.match(html, /Time is a local instrument; order is a declared relation/);
  assert.match(html, /Consistency and availability are choices with assumptions/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Atlas async collector evidence dossier/);
  assert.match(html, /Task-lifetime coroner/);
  assert.match(html, /href="\/downloads\/module21_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module21_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module21_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module21_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /class AtlasAsyncCollector/);
  assert.match(reference, /class CausalLedger/);
  assert.match(reference, /read_scripted_frame/);
  assert.match(reference, /atlas\.module21\.evidence\/1/);
  assert.match(reference, /timeout_then_reconcile/);
  assert.match(reference, /not a distributed-system proof/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client)\b/,
  );
  assert.match(referenceTests, /import module21_reference as reference/);
  assert.match(referenceTests, /Module21ReferenceTests/);
  assert.match(referenceTests, /test_taskgroup_failure_probe_states_only_the_owned_local_scope_boundary/);
});

test("renders the finalized security-privacy-and-trust-boundaries workbook", async () => {
  const response = await render("/modules/22-security-privacy-trust-boundaries");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 22: Security, Privacy &amp; Trust Boundaries · Atlas Academy/,
  );
  assert.match(html, /Complete Module 22 workbook/);
  assert.match(html, /Atlas Trust Control Room/);
  assert.match(html, /Trust-boundary atlas/);
  assert.match(html, /Identity-to-decision ladder/);
  assert.match(html, /Data-to-authority pipeline/);
  assert.match(html, /Cryptographic purpose map/);
  assert.match(html, /Release provenance and human impact/);
  assert.match(html, /Privacy-aware incident reconstruction/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Atlas Trust &amp; Release Dossier/);
  assert.match(html, /TA intake rule/);
  assert.match(html, /href="\/downloads\/module22_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module22_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module22_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module22_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /atlas\.module22\.evidence\/1/);
  assert.match(reference, /class ParsedImporterRequest/);
  assert.match(reference, /class RedactedEvidencePacket/);
  assert.match(reference, /incident_unknown/);
  assert.match(reference, /not a live security assessment/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module22_reference as model/);
  assert.match(referenceTests, /ArchivePolicySeamTests/);
  assert.match(
    referenceTests,
    /test_all_scenarios_emit_the_closed_evidence_schema/,
  );
});

test("renders the finalized programming-languages-and-bounded-evaluation workbook", async () => {
  const response = await render("/modules/23-programming-languages-interpreters");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 23: Programming Languages, Interpreters &amp; Bounded Evaluation · Atlas Academy/,
  );
  assert.match(html, /Complete Module 23 workbook/);
  assert.match(html, /Atlas Language Lab/);
  assert.match(html, /Text → tree/);
  assert.match(html, /Contract → capability/);
  assert.match(html, /Structure is data; authority is separate and explicit/);
  assert.match(html, /Eight-level problem ladder/);
  assert.match(html, /Atlas Query Language Dossier/);
  assert.match(html, /href="\/downloads\/module23_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module23_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module23_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module23_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /def lex_query/);
  assert.match(reference, /def parse_query/);
  assert.match(reference, /def validate_query/);
  assert.match(reference, /def run_scenario/);
  assert.match(reference, /def trusted_compilation_bridge/);
  assert.match(reference, /SCENARIOS/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module23_reference as model/);
  assert.match(referenceTests, /ContractAuthorityCapabilitySeamTests/);
  assert.match(
    referenceTests,
    /test_reference_model_has_no_dynamic_execution_or_external_adapter_surface/,
  );
});

test("renders the finalized CPython-performance-and-memory-evidence workbook", async () => {
  const response = await render("/modules/24-cpython-performance-memory");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 24: CPython, Performance &amp; Memory Evidence · Atlas Academy/,
  );
  assert.match(html, /Complete Module 24 workbook/);
  assert.match(html, /Runtime Evidence Observatory/);
  assert.match(html, /Contract → claim/);
  assert.match(html, /Names → graph/);
  assert.match(html, /Patch → decision/);
  assert.match(html, /A cache is data retention and authority design, not a neutral speed/);
  assert.match(html, /Problem ladder and Atlas project/);
  assert.match(html, /Runtime Evidence Dossier/);
  assert.match(html, /href="\/downloads\/module24_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module24_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const referenceUrl = new URL(
    "../public/downloads/module24_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module24_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /def reachable_nodes/);
  assert.match(reference, /def reference_count_sweep/);
  assert.match(reference, /def classify_observation/);
  assert.match(reference, /def validate_experiment/);
  assert.match(reference, /def validate_conclusion/);
  assert.match(reference, /SCENARIOS/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module24_reference as model/);
  assert.match(referenceTests, /ObjectGraphSeamTests/);
  assert.match(
    referenceTests,
    /test_unknown_scenario_does_not_accept_dynamic_input/,
  );
});

test("renders the finalized evidence-grounded-intelligent-systems workbook", async () => {
  const response = await render("/modules/25-evidence-grounded-intelligent-systems");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 25: Evidence-Grounded Intelligent &amp; Human-Centered Systems · Atlas Academy/,
  );
  assert.match(html, /Complete Module 25 workbook/);
  assert.match(html, /Reference access does not advance the Core\./);
  assert.match(html, /open for orientation and comparison, not as an unlocked Core step/);
  assert.match(html, /Reference preview · not an unlocked Core step/);
  assert.match(html, /Read this as a map, not a mastered module/);
  assert.doesNotMatch(
    new JSDOM(html).window.document.body.textContent ?? "",
    /Teaching Assistant · oral-defense context|Study Partner · rehearsal context/u,
    "the M25 preview must not expose a module companion package",
  );
  assert.match(
    html,
    /studio, project evidence, and oral-defense route remain unavailable/,
  );
  assert.doesNotMatch(html, /id="evidence-grounded-studio-title"/);
  assert.doesNotMatch(html, /Post-module learning conversation/);
  assert.match(html, /Problem ladder and Atlas project/);
  assert.match(html, /Next-Step Evidence Dossier/);
  assert.doesNotMatch(html, /katex-error/);

  const m25DiagnosticReveals = [
    ...new JSDOM(html).window.document.querySelectorAll("details.lesson-details"),
  ].filter(
    ({ firstElementChild }) =>
      firstElementChild?.textContent === "Reveal after recording your answer and confidence.",
  );
  assert.equal(m25DiagnosticReveals.length, 8);
  for (const reveal of m25DiagnosticReveals) {
    assert.equal(reveal.hasAttribute("open"), false);
    assert.match(reveal.textContent ?? "", /Answer:/u);
  }

  const referenceUrl = new URL(
    "../public/downloads/module25_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module25_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /def validate_contract/);
  assert.match(reference, /def rank_transparent_baseline/);
  assert.match(reference, /def validate_training_rows/);
  assert.match(reference, /def evaluate_held_out/);
  assert.match(reference, /def review_agent_proposal/);
  assert.match(reference, /SCENARIOS/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module25_reference as model/);
  assert.match(referenceTests, /DecisionContractSeamTests/);
  assert.match(
    referenceTests,
    /test_fixed_scenarios_cover_each_boundary_without_dynamic_input/,
  );
});

test("renders affected legacy explanations behind closed native prediction gates", async () => {
  const routes = [
    {
      pathname: "/modules/20-networks-application-protocols",
      expectedAnswerGates: 8,
      expectedPredictionGates: 3,
    },
    {
      pathname: "/modules/22-security-privacy-trust-boundaries",
      expectedAnswerGates: 10,
      expectedPredictionGates: 0,
    },
    {
      pathname: "/modules/23-programming-languages-interpreters",
      expectedAnswerGates: 8,
      expectedPredictionGates: 0,
    },
    {
      pathname: "/modules/24-cpython-performance-memory",
      expectedAnswerGates: 6,
      expectedPredictionGates: 4,
    },
    {
      pathname: "/modules/25-evidence-grounded-intelligent-systems",
      expectedAnswerGates: 8,
      expectedPredictionGates: 1,
    },
    {
      pathname: "/modules/27-discrete-mathematics-proof-counting-structures",
      expectedAnswerGates: 11,
      expectedPredictionGates: 1,
    },
    {
      pathname: "/modules/28-linear-algebra-numerical-stability-representation",
      expectedAnswerGates: 12,
      expectedPredictionGates: 1,
    },
  ];

  for (const { pathname, expectedAnswerGates, expectedPredictionGates } of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, `${pathname} must render.`);

    const document = new JSDOM(await response.text()).window.document;
    const gates = [...document.querySelectorAll("details.lesson-details")];
    const answerGates = gates.filter(
      ({ firstElementChild }) =>
        firstElementChild?.textContent === "Reveal after recording your answer and confidence.",
    );
    const predictionGates = gates.filter(
      ({ firstElementChild }) =>
        firstElementChild?.textContent === "Reveal after writing your prediction.",
    );

    assert.equal(answerGates.length, expectedAnswerGates, `${pathname} answer-gate count changed.`);
    assert.equal(
      predictionGates.length,
      expectedPredictionGates,
      `${pathname} prediction-gate count changed.`,
    );
    for (const gate of [...answerGates, ...predictionGates]) {
      assert.equal(gate.hasAttribute("open"), false, `${pathname} exposes a reveal by default.`);
    }
  }
});

test("renders the systems-capstone workbook and publishes its bounded model", async () => {
  const response = await render("/modules/26-systems-capstone-open-source-stewardship");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 26: Systems Capstone, Open-Source Stewardship &amp; Oral Architecture Defense · Atlas Academy/,
  );
  assert.match(html, /Complete Module 26 workbook/);
  assert.match(html, /Reference preview · not an unlocked Core step/);
  assert.match(html, /Read this as a map, not a mastered module/);
  assert.match(
    html,
    /studio, project evidence, and oral-defense route remain unavailable/,
  );
  assert.doesNotMatch(html, /id="capstone-defense-studio-title"/);
  assert.doesNotMatch(html, /Post-module learning conversation/);
  assert.match(html, /Atlas Release Dossier \/ Open-Source Stewardship Track/);
  assert.doesNotMatch(html, /katex-error/);

  const m26DiagnosticReveals = [
    ...new JSDOM(html).window.document.querySelectorAll("details.lesson-details"),
  ].filter(
    ({ firstElementChild }) =>
      firstElementChild?.textContent === "Reveal after recording your answer and confidence.",
  );
  assert.equal(m26DiagnosticReveals.length, 8);
  for (const reveal of m26DiagnosticReveals) {
    assert.equal(reveal.hasAttribute("open"), false);
    assert.match(reveal.textContent ?? "", /Best answer:/u);
  }

  const referenceUrl = new URL(
    "../public/downloads/module26_reference.py",
    import.meta.url,
  );
  const testsUrl = new URL(
    "../public/downloads/test_module26_reference.py",
    import.meta.url,
  );
  const [reference, referenceTests] = await Promise.all([
    readFile(referenceUrl, "utf8"),
    readFile(testsUrl, "utf8"),
  ]);
  assert.match(reference, /def validate_release_contract/);
  assert.match(reference, /def trace_dependency_closure/);
  assert.match(reference, /def replay_incident/);
  assert.match(reference, /def evaluate_claim_ledger/);
  assert.match(reference, /def review_change_request/);
  assert.match(reference, /def decide_release/);
  assert.match(reference, /ALLOWED_REQUESTED_ACTIONS = frozenset\(\)/);
  assert.match(reference, /human-impact-review/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module26_reference as model/);
  assert.match(referenceTests, /test_unknown_or_alias_external_action_is_a_hard_rejection/);
  assert.match(referenceTests, /test_stale_raw_claims_and_artifacts_cannot_support_the_candidate/);
  assert.match(referenceTests, /test_missing_raw_human_impact_record_requires_revision/);
});

test("renders the discrete mathematics proof workbook and its bounded teaching model", async () => {
  const response = await render(
    "/modules/27-discrete-mathematics-proof-counting-structures",
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 27: Discrete Mathematics, Proof, Counting &amp; Structures · Atlas Academy/,
  );
  assert.match(html, /Complete Module 27 workbook/);
  assert.match(html, /Proof &amp; Counterexample Workbench/);
  assert.match(html, /Claim scope lab/);
  assert.match(html, /Confidence-aware diagnostic/);
  assert.match(html, /Proof, Counterexample &amp; Constraint Dossier/);
  assert.match(html, /Conversational oral defense/);
  assert.match(html, /Sources, licensing, and a responsible reading route/);
  assert.match(html, /href="\/downloads\/module27_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module27_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const [studio, style, reference, referenceTests] = await Promise.all([
    readFile(new URL("../app/DiscreteMathProofStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/DiscreteMathProofStudio.module.css", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/module27_reference.py", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/test_module27_reference.py", import.meta.url), "utf8"),
  ]);
  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "ArrowDown"/);
  assert.match(studio, /event\.key === "ArrowUp"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /role="radiogroup"/);
  assert.match(studio, /role="radio"/);
  assert.match(studio, /t1 can use r1 only; t2 can use r2 only/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each mathematical view has one confidence-aware prediction gate",
  );
  assert.match(studio, /getBrowserProgressStorage/);
  assert.match(studio, /restoreModule27Progress/);
  assert.match(studio, /persistModule27Progress/);
  assert.match(studio, /clearModule27Progress/);
  assert.doesNotMatch(studio, /window\.localStorage/);
  assert.match(studio, /not a theorem prover/);
  assert.match(studio, /Proof repair bench/);
  assert.match(studio, /State and recurrence traceboard/);
  assert.match(studio, /Counting and coefficient lab/);
  assert.match(studio, /Graph and matching lab/);
  assert.match(studio, /Order defense board/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /focus-visible/);

  assert.match(reference, /MODEL_VERSION = "atlas-module27-reference\/1"/);
  assert.match(reference, /def classify_relation/);
  assert.match(reference, /def transitive_closure/);
  assert.match(reference, /def topological_order_or_cycle/);
  assert.match(reference, /def analyze_bipartite_matching/);
  assert.match(reference, /MAX_MATCHING_EDGES = 12/);
  assert.match(reference, /def binomial_coefficient/);
  assert.match(reference, /def linear_recurrence_terms/);
  assert.match(reference, /def modular_inverse/);
  assert.match(reference, /Finite teaching model only/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module27_reference as model/);
  assert.match(referenceTests, /class RelationClassificationTests/);
  assert.match(referenceTests, /class GraphReasoningTests/);
  assert.match(referenceTests, /class MatchingTests/);
  assert.match(referenceTests, /class CountingAndNumberTheoryTests/);
  assert.match(referenceTests, /test_maximal_matching_can_still_fail_to_be_maximum/);
});

test("renders the linear algebra stability workbook and its bounded teaching model", async () => {
  const response = await render(
    "/modules/28-linear-algebra-numerical-stability-representation",
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 28: Linear Algebra, Numerical Stability &amp; Representation · Atlas Academy/,
  );
  assert.match(html, /Complete Module 28 workbook/);
  assert.match(html, /Linear Algebra &amp; Stability Studio/);
  assert.match(html, /M28 working invariant/);
  assert.match(html, /Coordinate contract/);
  assert.match(html, /Confidence-aware diagnostic/);
  assert.match(html, /Representation &amp; Stability Dossier/);
  assert.match(html, /Conversational oral defense — M28/);
  assert.match(html, /replaces a traditional coding or written exam/);
  assert.match(html, /fully equivalent text conversation/);
  assert.match(html, /href="\/downloads\/module28_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module28_reference\.py"/);
  assert.doesNotMatch(html, /katex-error/);

  const [studio, style, reference, referenceTests, companionGuides] = await Promise.all([
    readFile(new URL("../app/LinearAlgebraStabilityStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/LinearAlgebraStabilityStudio.module.css", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/module28_reference.py", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/test_module28_reference.py", import.meta.url), "utf8"),
    readFile(new URL("../content/course/module-companion-guides.v1.json", import.meta.url), "utf8"),
  ]);
  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "ArrowDown"/);
  assert.match(studio, /event\.key === "ArrowUp"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /role="radiogroup"/);
  assert.match(studio, /role="radio"/);
  assert.equal(
    [...studio.matchAll(/<PredictionGate\b/gu)].length,
    6,
    "each M28 view has one confidence-aware prediction gate",
  );
  assert.match(studio, /A: R³ → R²/);
  assert.match(studio, /Aε = \[\[1, 1\], \[1, 1001\/1000\]\]/);
  assert.match(studio, /±\(1, 1\)\/√2/);
  assert.match(studio, /aria-live="polite"/);
  assert.match(studio, /getBrowserProgressStorage/);
  assert.match(studio, /restoreModule28Progress/);
  assert.match(studio, /persistModule28Progress/);
  assert.match(studio, /clearModule28Progress/);
  assert.doesNotMatch(studio, /window\.localStorage/);
  assert.match(studio, /not a theorem prover/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /forced-colors/);
  assert.match(style, /focus-visible/);

  assert.match(reference, /MODEL_VERSION = "atlas-module28-reference\/1"/);
  assert.match(reference, /def analyze_matrix/);
  assert.match(reference, /def least_squares_projection/);
  assert.match(reference, /def analyze_symmetric_psd/);
  assert.match(reference, /def symmetric_eigendecomposition_2x2/);
  assert.match(reference, /def pca_2d/);
  assert.match(reference, /def condition_report_2x2/);
  assert.match(reference, /def rhs_sensitivity_2x2/);
  assert.match(reference, /def decimal_cancellation_demo/);
  assert.match(reference, /Finite, deterministic reasoning aids/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module28_reference as model/);
  assert.match(referenceTests, /class ExactMatrixSpaceTests/);
  assert.match(referenceTests, /class ProjectionAndLeastSquaresTests/);
  assert.match(referenceTests, /class SymmetricAndSpectralTests/);
  assert.match(referenceTests, /class PCAAndNumericalBoundaryTests/);
  assert.match(companionGuides, /"moduleId": "m28"/);
  assert.match(companionGuides, /shape\/dtype\/solver path/);
});

test("renders the calculus continuous-change workbook and its bounded teaching model", async () => {
  const response = await render(
    "/modules/29-calculus-real-analysis-continuous-change",
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 29: Calculus, Real Analysis &amp; Continuous Change · Atlas Academy/,
  );
  assert.match(html, /Complete Module 29 workbook/);
  assert.match(html, /Limits, Change &amp; Convergence Studio/);
  assert.match(html, /M29 working invariant/);
  assert.match(html, /Intermediate Value Theorem/);
  assert.match(html, /Partials are probes/);
  assert.match(html, /Confidence-aware diagnostic/);
  assert.match(html, /Continuous-Change Evidence Dossier/);
  assert.match(html, /Conversational oral defense — M29/);
  assert.match(html, /replaces a traditional coding or written exam/);
  assert.match(html, /fully equivalent text conversation/);
  assert.match(html, /Hint ladder/);
  assert.match(html, /href="\/downloads\/module29_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module29_reference\.py"/);
  assert.match(
    html,
    /href="\/downloads\/module29_calculus_real_analysis_continuous_change_source_map\.md"/,
  );
  assert.match(
    html,
    /href="\/downloads\/module29_calculus_real_analysis_source_audit_addendum\.md"/,
  );
  assert.doesNotMatch(html, /katex-error/);

  const [studio, style, reference, referenceTests, companionGuides, sourceMap, sourceAudit] = await Promise.all([
    readFile(new URL("../app/CalculusContinuousChangeStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/CalculusContinuousChangeStudio.module.css", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/module29_reference.py", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/test_module29_reference.py", import.meta.url), "utf8"),
    readFile(new URL("../content/course/module-companion-guides.v1.json", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/module29_calculus_real_analysis_continuous_change_source_map.md", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/module29_calculus_real_analysis_source_audit_addendum.md", import.meta.url), "utf8"),
  ]);
  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "ArrowDown"/);
  assert.match(studio, /event\.key === "ArrowUp"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /role="radiogroup"/);
  assert.match(studio, /role="radio"/);
  assert.match(studio, /id: "limit"/);
  assert.match(studio, /id: "trajectory"/);
  assert.match(studio, /aria-live="polite"/);
  assert.match(studio, /getBrowserProgressStorage/);
  assert.match(studio, /restoreModule29Progress/);
  assert.match(studio, /persistModule29Progress/);
  assert.match(studio, /clearModule29Progress/);
  assert.doesNotMatch(studio, /window\.localStorage/);
  assert.match(studio, /not a theorem prover/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /forced-colors/);
  assert.match(style, /focus-visible/);

  assert.match(reference, /MODEL_VERSION = "atlas-module29-reference\/1"/);
  assert.match(reference, /def affine_epsilon_delta_report/);
  assert.match(reference, /def sine_taylor_report/);
  assert.match(reference, /def quadratic_surface_report/);
  assert.match(reference, /def affine_jacobian_report/);
  assert.match(reference, /def affine_change_of_variables_rectangle_report/);
  assert.match(reference, /def power_sequence_uniformity_report/);
  assert.match(reference, /def composite_trapezoid_quadratic_report/);
  assert.match(reference, /def euler_forced_quadratic_ode_report/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module29_reference as model/);
  assert.match(referenceTests, /class EpsilonDeltaTests/);
  assert.match(referenceTests, /class DifferentialAndJacobianTests/);
  assert.match(referenceTests, /class ChangeOfVariablesAndSeriesTests/);
  assert.match(referenceTests, /class PointwiseAndNumericalBoundaryTests/);
  assert.match(companionGuides, /"moduleId": "m29"/);
  assert.match(companionGuides, /shape, unit, dtype, step, tolerance, or solver trace/);
  assert.match(sourceMap, /Module 29 .*Source Map/);
  assert.match(sourceAudit, /Minimum source routing for the six connected sessions/);
});

test("renders the probability, statistics, and scientific-inference workbook and bounded model", async () => {
  const response = await render(
    "/modules/30-probability-statistics-scientific-inference",
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /Module 30: Probability, Statistics &amp; Scientific Inference · Atlas Academy/,
  );
  assert.match(html, /Complete Module 30 workbook/);
  assert.match(html, /Probability &amp; Inference Studio/);
  assert.match(html, /M30 working invariant/);
  assert.match(html, /Hoeffding/);
  assert.match(html, /Common distributions and the multivariate-Gaussian bridge/);
  assert.match(html, /bivariate_normal_affine_report/);
  assert.match(html, /unique boundary mode/);
  assert.match(html, /Uncertainty &amp; Inference Evidence Dossier/);
  assert.match(html, /Conversational oral defense — M30/);
  assert.match(html, /replaces a traditional coding or written exam/);
  assert.match(html, /fully equivalent text conversation/);
  assert.match(html, /Hint ladder/);
  assert.match(html, /href="\/downloads\/module30_reference\.py"/);
  assert.match(html, /href="\/downloads\/test_module30_reference\.py"/);
  assert.match(
    html,
    /href="\/downloads\/module30_probability_statistics_scientific_inference_source_map\.md"/,
  );
  assert.match(
    html,
    /href="\/downloads\/module30_probability_statistics_scientific_inference_source_audit_addendum\.md"/,
  );
  assert.doesNotMatch(html, /katex-error/);

  const document = new JSDOM(html).window.document;
  const emptyTableHeaders = [
    ...document.querySelectorAll(".lesson-table-scroll th"),
  ].filter((header) => !header.textContent?.trim());
  assert.deepEqual(
    emptyTableHeaders,
    [],
    "Module 30 tables must name every column and row-axis header.",
  );

  const [studio, style, reference, referenceTests, companionGuides, sourceMap, sourceAudit] = await Promise.all([
    readFile(new URL("../app/ProbabilityInferenceStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ProbabilityInferenceStudio.module.css", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/module30_reference.py", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/test_module30_reference.py", import.meta.url), "utf8"),
    readFile(new URL("../content/course/module-companion-guides.v1.json", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/module30_probability_statistics_scientific_inference_source_map.md", import.meta.url), "utf8"),
    readFile(new URL("../public/downloads/module30_probability_statistics_scientific_inference_source_audit_addendum.md", import.meta.url), "utf8"),
  ]);
  assert.match(studio, /role="tablist"/);
  assert.match(studio, /role="tab"/);
  assert.match(studio, /role="tabpanel"/);
  assert.match(studio, /event\.key === "ArrowRight"/);
  assert.match(studio, /event\.key === "ArrowLeft"/);
  assert.match(studio, /event\.key === "ArrowDown"/);
  assert.match(studio, /event\.key === "ArrowUp"/);
  assert.match(studio, /event\.key === "Home"/);
  assert.match(studio, /event\.key === "End"/);
  assert.match(studio, /role="radiogroup"/);
  assert.match(studio, /role="radio"/);
  assert.match(studio, /id: "base-rate"/);
  assert.match(studio, /id: "design"/);
  assert.match(studio, /Text equivalent:/);
  assert.match(studio, /p=3\/4[\s\S]*100%/);
  assert.match(studio, /aria-live="polite"/);
  assert.match(studio, /getBrowserProgressStorage/);
  assert.match(studio, /restoreModule30Progress/);
  assert.match(studio, /persistModule30Progress/);
  assert.match(studio, /clearModule30Progress/);
  assert.doesNotMatch(studio, /window\.localStorage/);
  assert.match(studio, /not a theorem prover/);
  assert.doesNotMatch(studio, /<svg\b/i);
  assert.doesNotMatch(studio, /dangerouslySetInnerHTML/);
  assert.match(style, /prefers-reduced-motion/);
  assert.match(style, /forced-colors/);
  assert.match(style, /focus-visible/);

  assert.match(reference, /MODEL_VERSION = "atlas-module30-reference\/2"/);
  assert.match(reference, /def finite_event_report/);
  assert.match(reference, /def joint_distribution_report/);
  assert.match(reference, /def bivariate_normal_affine_report/);
  assert.match(reference, /def binary_bayes_report/);
  assert.match(reference, /def markov_inequality_report/);
  assert.match(reference, /def finite_markov_chain_report/);
  assert.match(reference, /def beta_binomial_report/);
  assert.match(reference, /def exact_permutation_mean_difference_report/);
  assert.match(reference, /def multiple_testing_report/);
  assert.match(reference, /def missingness_boundary_report/);
  assert.doesNotMatch(
    reference,
    /(?:^|\n)\s*(?:from|import)\s+(?:socket|requests|urllib|http\.client|subprocess|pickle|marshal|sqlite3|tarfile|zipfile)\b/,
  );
  assert.match(referenceTests, /import module30_reference as model/);
  assert.match(referenceTests, /class ProbabilityModelTests/);
  assert.match(referenceTests, /class RepetitionAndStochasticProcessTests/);
  assert.match(referenceTests, /class EstimationAndUncertaintyTests/);
  assert.match(referenceTests, /class ModelingBoundaryTests/);
  assert.match(companionGuides, /"moduleId": "m30"/);
  assert.match(companionGuides, /probability models, conditional structure, inference/);
  assert.match(sourceMap, /Module 30 .*Source Map/);
  assert.match(sourceAudit, /M30 should teach one connected transformation/);
});
