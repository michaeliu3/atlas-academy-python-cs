import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  loadCourseGraph,
  projectReaderModules,
  resolveLearnerAccess,
  validateCourseGraph,
} from "../scripts/course-graph.mjs";

test("the canonical v2 course graph separates academic prerequisites, reader access, open legacy material, and formal publication", async () => {
  const graph = await loadCourseGraph();
  const byNumber = new Map(graph.modules.map((courseModule) => [courseModule.number, courseModule]));

  assert.equal(graph.schemaVersion, 2);
  assert.equal(graph.course.focusedHoursPerWeek, "35–45");
  assert.equal(graph.modules.length, 36);
  assert.deepEqual(graph.sequence, [
    1, 2, 3, 4, 5, 27, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    28, 29, 30, 31, 18, 19, 20, 21, 22, 23, 24, 32, 33, 34, 35, 36, 25,
    26,
  ]);

  assert.deepEqual(byNumber.get(18)?.academicPrerequisiteNumbers, [17]);
  assert.deepEqual(byNumber.get(25)?.academicPrerequisiteNumbers, [
    22, 24, 30, 31, 34, 35, 36,
  ]);
  assert.deepEqual(byNumber.get(25)?.state, {
    lifecycle: "learner-material-ready",
    readerAccess: "preview",
    availability: "preview",
    contract: { track: "legacy-v1", state: "legacy-baseline" },
    release: { state: "unrecorded", recordId: null },
  });
  assert.deepEqual(byNumber.get(31)?.state, {
    lifecycle: "authoring-only",
    readerAccess: "hidden",
    availability: "authoring-only",
    contract: { track: "advanced-v1", state: "authoring-only" },
    release: { state: "unrecorded", recordId: null },
    privateGuidedStudy: {
      status: "ready",
      delivery: "designated-codex-chats",
    },
  });
  assert.equal(byNumber.get(25)?.sequencePosition, 35);
  assert.equal(byNumber.get(31)?.sequencePosition, 22);
  assert.deepEqual(
    Object.fromEntries(
      [...byNumber.values()]
        .reduce((counts, courseModule) => {
          counts.set(
            courseModule.state.availability,
            (counts.get(courseModule.state.availability) ?? 0) + 1,
          );
          return counts;
        }, new Map())
        .entries(),
    ),
    {
      "authoring-only": 6,
      "legacy-open": 28,
      preview: 2,
    },
  );

  assert.deepEqual(resolveLearnerAccess(byNumber.get(30)), {
    mode: "legacy-route",
    readerAccess: "full",
  });
  assert.deepEqual(resolveLearnerAccess(byNumber.get(25)), {
    mode: "reference",
    readerAccess: "preview",
  });
  assert.deepEqual(resolveLearnerAccess(byNumber.get(31)), {
    mode: "unavailable",
    readerAccess: "hidden",
  });

  for (const number of [31, 32, 33, 34, 35, 36]) {
    const privateStudy = byNumber.get(number)?.state.privateGuidedStudy;
    assert.deepEqual(privateStudy, {
      status: "ready",
      delivery: "designated-codex-chats",
    });
  }
});

test("readable projections stop at unavailable route nodes instead of bypassing them", async () => {
  const graph = await loadCourseGraph();
  const modules = projectReaderModules(graph);
  const byNumber = new Map(modules.map((courseModule) => [courseModule.number, courseModule]));

  assert.deepEqual(byNumber.get(18)?.prerequisiteNumbers, [17]);
  assert.equal(byNumber.get(30)?.nextRouteNumber, 31);
  assert.equal(byNumber.get(30)?.nextSlug, null);
  assert.equal(byNumber.get(24)?.nextRouteNumber, 32);
  assert.equal(byNumber.get(24)?.nextSlug, null);
  assert.equal(byNumber.get(25)?.state.availability, "preview");
  assert.equal(byNumber.get(25)?.previousRouteNumber, 36);
});

test("the graph rejects an open route whose transitive academic prerequisite is authoring-only", async () => {
  const graph = await loadCourseGraph();
  const forgedOpenSynthesis = structuredClone(graph);
  const m25 = forgedOpenSynthesis.modules.find(({ id }) => id === "m25");
  m25.state.availability = "optional";
  m25.state.readerAccess = "full";

  assert.throws(
    () => validateCourseGraph(forgedOpenSynthesis),
    /Module 25 requires authoring-only prerequisite\(s\).*must remain preview or locked/u,
  );
});

test("the dense systems-and-mathematics route exposes conservative evidence-time bands without relabeling reading time", async () => {
  const graph = await loadCourseGraph();
  const byNumber = new Map(graph.modules.map((courseModule) => [courseModule.number, courseModule]));
  const expectedBands = new Map([
    [21, { minimumEvidence: [420, 540], deepDossier: [600, 780] }],
    [22, { minimumEvidence: [420, 540], deepDossier: [600, 780] }],
    [23, { minimumEvidence: [420, 540], deepDossier: [600, 780] }],
    [24, { minimumEvidence: [360, 480], deepDossier: [540, 720] }],
    [27, { minimumEvidence: [780, 1020], deepDossier: [1200, 1680] }],
    [28, { minimumEvidence: [840, 1080], deepDossier: [1380, 1920] }],
    [29, { minimumEvidence: [480, 600], deepDossier: [660, 840] }],
    [30, { minimumEvidence: [480, 600], deepDossier: [660, 840] }],
    [31, { minimumEvidence: [360, 480], deepDossier: [600, 840] }],
    [32, { minimumEvidence: [420, 540], deepDossier: [720, 960] }],
    [33, { minimumEvidence: [360, 480], deepDossier: [600, 840] }],
    [34, { minimumEvidence: [420, 540], deepDossier: [720, 960] }],
    [35, { minimumEvidence: [420, 540], deepDossier: [720, 960] }],
    [36, { minimumEvidence: [480, 600], deepDossier: [840, 1080] }],
  ]);

  for (const [number, band] of expectedBands) {
    const courseModule = byNumber.get(number);
    assert.deepEqual(courseModule?.focusedStudyMinutes, band, `M${number} needs its canonical evidence-time plan.`);
    assert.notEqual(
      courseModule?.referenceReadMinutes,
      band.minimumEvidence[0],
      `M${number} reference reading must remain distinct from focused-study evidence time.`,
    );
  }

  const missingPlan = structuredClone(graph);
  delete missingPlan.modules.find(({ number }) => number === 28).focusedStudyMinutes;
  assert.throws(
    () => validateCourseGraph(missingPlan),
    /Module 28 needs focusedStudyMinutes/u,
  );

  const invertedPlan = structuredClone(graph);
  invertedPlan.modules.find(({ number }) => number === 28).focusedStudyMinutes.minimumEvidence = [1080, 840];
  assert.throws(
    () => validateCourseGraph(invertedPlan),
    /must use increasing positive integer minutes/u,
  );

  const shallowDossier = structuredClone(graph);
  shallowDossier.modules.find(({ number }) => number === 28).focusedStudyMinutes.deepDossier = [900, 1200];
  assert.throws(
    () => validateCourseGraph(shallowDossier),
    /deep dossier time must include the complete minimum-evidence band/u,
  );
});

test("the graph refuses access states that would turn a preview or authoring node into a Core reader", async () => {
  const graph = await loadCourseGraph();

  const previewAsCore = structuredClone(graph);
  previewAsCore.modules.find(({ number }) => number === 25).state.readerAccess = "full";
  assert.throws(
    () => validateCourseGraph(previewAsCore),
    /preview Module 25 must use preview reader access/u,
  );

  const authoringAsReader = structuredClone(graph);
  authoringAsReader.modules.find(({ number }) => number === 31).state.readerAccess = "full";
  assert.throws(
    () => validateCourseGraph(authoringAsReader),
    /authoring-only Module 31 must be hidden from the reader/u,
  );
});

test("only the six hidden advanced modules may declare a ready private guided-study pack", async () => {
  const graph = await loadCourseGraph();

  const missingPack = structuredClone(graph);
  delete missingPack.modules.find(({ number }) => number === 31).state.privateGuidedStudy;
  assert.throws(
    () => validateCourseGraph(missingPack),
    /Module 31 must declare its private guided-study readiness/u,
  );

  const leakedPack = structuredClone(graph);
  leakedPack.modules.find(({ number }) => number === 30).state.privateGuidedStudy = {
    status: "ready",
  };
  assert.throws(
    () => validateCourseGraph(leakedPack),
    /Only M31–M36 may declare a private guided-study pack/u,
  );

  const exposedPackPath = structuredClone(graph);
  exposedPackPath.modules.find(({ number }) => number === 31).state.privateGuidedStudy.workbookPath = "content/authoring/m31_optimization_information_workbook.v1.md";
  assert.throws(
    () => validateCourseGraph(exposedPackPath),
    /Module 31 private guided study must use exactly these keys: delivery, status/u,
  );
});

test("the canonical Scope Matrix maps every calibration level without turning a planned target into access", async () => {
  const graph = await loadCourseGraph();
  const matrix = graph.scopeMatrix;
  const levels = [...new Set(matrix.topics.map(({ level }) => level))].sort((left, right) => left - right);
  const scopes = new Set(matrix.topics.map(({ scope }) => scope));
  const foundationModels = matrix.topics.find(({ id }) => id === "l8.fm.representations-transformers");
  const optimization = matrix.topics.find(({ id }) => id === "l1.optimization.formulation-convexity");
  const lowerLevelRuntime = matrix.topics.find(
    ({ id }) => id === "l2.programming-lower-level-ml-runtime",
  );

  assert.equal(matrix.schemaVersion, 4);
  assert.equal(
    matrix.benchmark.sourceDigest,
    "sha256:1d8aa72a7084cc46a351a21be3c2e1e2dbf7ede24414d3eca50e25697cf701a2",
  );
  assert.deepEqual(
    matrix.benchmark.items.map(({ id }) => id),
    [
      "l1-01-proofs-discrete-mathematics",
      "l1-02-linear-algebra",
      "l1-03-calculus-real-analysis",
      "l1-04-probability",
      "l1-05-statistics",
      "l1-06-optimization",
      "l1-07-information-theory",
      "l2-08-programming-beyond-basic-python",
      "l2-09-data-structures-algorithms",
      "l2-10-theory-of-computation",
      "l2-11-computer-systems",
      "l2-12-software-engineering",
      "l3-13-classical-artificial-intelligence",
      "l4-14-supervised-learning",
      "l4-15-unsupervised-representation-learning",
      "l4-16-generalization-model-selection",
      "l4-17-statistical-learning-theory",
      "l5-18-neural-network-fundamentals",
      "l5-19-major-architectures",
      "l5-20-modern-training-methodology",
      "l6-probabilistic-modeling-inference",
      "l7-sequential-decision-making-rl",
      "l8-foundation-models-llms-generative-ai",
      "l9-deep-specialization-nlp-language-models",
    ],
    "the full learner-supplied Levels 1–9 heading index remains present in the canonical crosswalk",
  );
  assert.equal(matrix.benchmark.atomicItemCount, 362);
  assert.equal(matrix.benchmark.atomicItems.length, 362);
  assert.equal(matrix.benchmark.sourceLists.length, 25);
  assert.deepEqual(
    [...new Set(matrix.benchmark.atomicItems.map(({ sourceLine }) => sourceLine))].length,
    362,
    "every pinned source target line is represented exactly once",
  );
  assert.ok(
    matrix.benchmark.sourceLists.some(
      ({ directive, sourceLineStart, sourceLineEnd }) =>
        directive === "also-know" && sourceLineStart === 203 && sourceLineEnd === 209,
    ),
    "the explicit Level-2 AI-research additions remain visible rather than being silently dropped",
  );
  assert.deepEqual(
    matrix.benchmark.atomicItems.find(({ sourceLine }) => sourceLine === 71)?.scopeTopicIds,
    ["l1.analysis.interchange-and-measure"],
  );
  assert.deepEqual(
    matrix.benchmark.atomicItems.find(({ sourceLine }) => sourceLine === 124)?.scopeTopicIds,
    ["l1.statistics.robust-high-dimensional"],
  );
  assert.deepEqual(
    matrix.benchmark.atomicItems.find(({ sourceLine }) => sourceLine === 228)?.scopeTopicIds,
    ["l2.dsa.graphs-and-paradigms", "l2.dsa.advanced-analysis"],
  );
  assert.deepEqual(
    matrix.benchmark.atomicItems.find(({ sourceLine }) => sourceLine === 250)?.scopeTopicIds,
    ["l2.theory.formal-foundations", "l2.theory.advanced-complexity"],
  );
  assert.deepEqual(
    matrix.benchmark.atomicItems.find(({ sourceLine }) => sourceLine === 272)?.scopeTopicIds,
    ["l2.systems-data-distributed"],
  );
  assert.equal(matrix.topics.length, 63);
  assert.deepEqual(levels, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(
    [...scopes].sort(),
    ["core-mastery", "explicitly-deferred", "post-core-specialization", "scoped-exposure"],
  );
  assert.equal(matrix.extensionTracks.length, 4);
  assert.ok(matrix.extensionTracks.every(({ status }) => status === "design-only"));
  assert.deepEqual(
    matrix.extensionTracks.map(({ id }) => id),
    [
      "math-algorithms-theory",
      "deep-learning-ml-systems",
      "probabilistic-models-rl",
      "foundation-models-nlp",
    ],
  );
  assert.ok(
    matrix.extensionTracks.every(({ prerequisiteModuleIds }) => prerequisiteModuleIds.includes("m26")),
    "each post-core design begins after the M26 evidence boundary",
  );
  assert.ok(
    matrix.extensionTracks.every(
      ({ cadence }) =>
        cadence?.firstPassDays === 90 && cadence.recommendedDays === 180 &&
        typeof cadence.rationale === "string" && cadence.rationale.trim() !== "",
    ),
    "each post-core design declares both a 90-day and 180-day cadence",
  );
  assert.deepEqual(foundationModels?.trackId, "foundation-models-nlp");
  assert.equal(optimization?.scope, "core-mastery");
  assert.ok(
    optimization?.anchors.some(({ moduleId }) => moduleId === "m31"),
    "the target remains anchored to M31 rather than silently claiming open delivery",
  );
  assert.equal(lowerLevelRuntime?.scope, "scoped-exposure");
  assert.ok(
    lowerLevelRuntime?.anchors.some(({ moduleId }) => moduleId === "m35"),
    "the distributed-data-parallel boundary stays M35-led rather than being claimed by M32",
  );
  assert.match(lowerLevelRuntime?.label ?? "", /M35-led boundary/u);
  assert.match(lowerLevelRuntime?.evidenceArtifact ?? "", /no claimed .*distributed-data-parallel mastery/u);
  assert.equal(
    graph.modules.find(({ id }) => id === "m35")?.state.readerAccess,
    "hidden",
    "the M35-led boundary must not turn M35 into an available reader route",
  );
  assert.equal(
    graph.modules.find(({ id }) => id === "m31")?.state.readerAccess,
    "hidden",
    "the matrix must not change the authoring-only reader boundary",
  );
});

test("the graph rejects Scope Matrix gaps and fabricated post-core routes", async () => {
  const graph = await loadCourseGraph();

  const missingTrack = structuredClone(graph);
  missingTrack.scopeMatrix.topics.find(({ id }) => id === "l8.fm.representations-transformers").trackId = null;
  assert.throws(
    () => validateCourseGraph(missingTrack),
    /post-core scopeMatrix topic l8\.fm\.representations-transformers needs a declared extension track/u,
  );

  const impossibleSession = structuredClone(graph);
  impossibleSession.scopeMatrix.topics.find(({ id }) => id === "l1.proofs.logic-relations").anchors[0].sessions = [7];
  assert.throws(
    () => validateCourseGraph(impossibleSession),
    /scopeMatrix topic l1\.proofs\.logic-relations anchor m04 sessions must be 1 through 6/u,
  );

  const missingInventoryCrosswalk = structuredClone(graph);
  missingInventoryCrosswalk.scopeMatrix.benchmark.atomicItems
    .find(({ sourceLine }) => sourceLine === 9)
    .scopeTopicIds = [];
  assert.throws(
    () => validateCourseGraph(missingInventoryCrosswalk),
    /scopeMatrix benchmark atomic item 9 needs mapped Scope Matrix topics/u,
  );

  const crossLevelInventoryClaim = structuredClone(graph);
  crossLevelInventoryClaim.scopeMatrix.benchmark.atomicItems
    .find(({ sourceLine }) => sourceLine === 9)
    .scopeTopicIds = ["l2.dsa.structures"];
  assert.throws(
    () => validateCourseGraph(crossLevelInventoryClaim),
    /scopeMatrix benchmark atomic item 9 must map only Level 1 Scope Matrix topics/u,
  );

  const duplicateAtomicSourceLine = structuredClone(graph);
  duplicateAtomicSourceLine.scopeMatrix.benchmark.atomicItems
    .find(({ sourceLine }) => sourceLine === 10)
    .sourceLine = 9;
  assert.throws(
    () => validateCourseGraph(duplicateAtomicSourceLine),
    /scopeMatrix benchmark atomic source line 9 is duplicated/u,
  );

  const missingCadence = structuredClone(graph);
  delete missingCadence.scopeMatrix.extensionTracks[0].cadence;
  assert.throws(
    () => validateCourseGraph(missingCadence),
    /scopeMatrix extension track must use exactly these keys/u,
  );
});

test("only a verified published module may carry a recorded canonical release state", async () => {
  const graph = await loadCourseGraph();
  for (const releaseState of ["candidate-recorded", "deployed-recorded"]) {
    const forgedRelease = structuredClone(graph);
    const m29 = forgedRelease.modules.find(({ id }) => id === "m29");
    m29.state.release = { state: releaseState, recordId: `m29-forged-${releaseState}` };
    assert.throws(
      () => validateCourseGraph(forgedRelease),
      /legacy-open Module 29 must leave release evidence unrecorded/u,
    );
  }
});

test("legacy material cannot acquire a published label without verified contract and deployment evidence", async () => {
  const graph = await loadCourseGraph();

  const forgedPublication = structuredClone(graph);
  forgedPublication.modules.find(({ id }) => id === "m30").state.availability = "published";
  assert.throws(
    () => validateCourseGraph(forgedPublication),
    /published Module 30 requires a verified contract/u,
  );

  const forgedLegacyContract = structuredClone(graph);
  forgedLegacyContract.modules.find(({ id }) => id === "m30").state.contract.state = "review-ready";
  assert.throws(
    () => validateCourseGraph(forgedLegacyContract),
    /legacy-open Module 30 must retain a legacy-v1 legacy-baseline contract/u,
  );

  const verifiedPreview = structuredClone(graph);
  const m25 = verifiedPreview.modules.find(({ id }) => id === "m25");
  m25.state.contract.state = "verified";
  m25.state.release = { state: "deployed-recorded", recordId: "m25-forged-release" };
  assert.throws(
    () => validateCourseGraph(verifiedPreview),
    /verified Module 25 must use published availability/u,
  );
});

test("the graph requires the exact M1–M36 module-number set", async () => {
  const graph = await loadCourseGraph();
  const gappedNumbering = structuredClone(graph);
  const replacement = gappedNumbering.modules.find(({ number }) => number === 36);
  replacement.number = 37;
  replacement.id = "m37";

  assert.throws(
    () => validateCourseGraph(gappedNumbering),
    /modules numbered exactly 1 through 36/u,
  );
});

test("written route handoffs preserve M24's authoring-only continuation and the M26 preview boundary", async () => {
  const [m24Workbook, m24SourceMap, m26Workbook, roadmap] = await Promise.all([
    readFile(new URL("../content/modules/24_cpython_performance_memory.md", import.meta.url), "utf8"),
    readFile(new URL("../content/source-maps/module24_cpython_performance_memory_source_map.md", import.meta.url), "utf8"),
    readFile(new URL("../content/modules/26_systems_capstone_open_source_stewardship.md", import.meta.url), "utf8"),
    readFile(new URL("../ROADMAP.md", import.meta.url), "utf8"),
  ]);

  assert.match(m24Workbook, /Canonical forward handoff: Module 32/u);
  assert.match(m24Workbook, /Module 32 is authoring-only/u);
  assert.match(m24SourceMap, /Canonical forward connection: Module 32/u);
  assert.match(m24SourceMap, /M23 → M24 → M32 \(authoring-only\) connected sequence/u);
  assert.match(m26Workbook, /## Preview boundary/u);
  assert.match(m26Workbook, /orientation preview/u);
  assert.match(roadmap, /## Prospective 60-day checkpoints after M31–M36/u);
});

test("the graph rejects a source-map path that escapes the checked-in course inputs", async () => {
  const graph = await loadCourseGraph();
  const unsafeGraph = structuredClone(graph);
  unsafeGraph.modules[0].sourceMap = "content/source-maps/../../outside.md";

  assert.throws(
    () => validateCourseGraph(unsafeGraph),
    /checked-in source-map path/u,
  );
});

test("graph-declared studios have one bounded, code-split reader mapping", async () => {
  const [graphSource, registrySource, readerSource, loaderSource] = await Promise.all([
    readFile(new URL("../content/course/course-graph.v2.json", import.meta.url), "utf8"),
    readFile(new URL("../lib/module-studio-registry.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/modules/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/modules/[slug]/StudioLoader.tsx", import.meta.url), "utf8"),
  ]);
  const graph = JSON.parse(graphSource);
  const declaredStudioIds = graph.modules
    .map((courseModule) => courseModule.studioId)
    .filter((studioId) => studioId !== null);
  const m18 = graph.modules.find((courseModule) => courseModule.id === "m18");
  const m19 = graph.modules.find((courseModule) => courseModule.id === "m19");
  assert.equal(
    m18?.studioId,
    "operating-systems",
    "M18's existing resource observatory must be declared for its direct reader route",
  );
  assert.equal(
    m19?.studioId,
    "concurrency",
    "M19's concurrency observatory must be declared for its direct reader route",
  );
  const registeredStudioIds = [
    ...registrySource.matchAll(/studioId: "([^"]+)"/gu),
  ].map((match) => match[1]);

  assert.deepEqual(registeredStudioIds, declaredStudioIds);
  assert.equal(new Set(registeredStudioIds).size, registeredStudioIds.length);
  assert.match(
    readerSource,
    /<ModuleInteraction[\s\S]*courseModule=\{courseModule\}/,
  );
  assert.match(readerSource, /moduleInteraction\.kind !== "preview"/);
  assert.doesNotMatch(readerSource, /slug === "/);
  assert.match(loaderSource, /from "next\/dynamic"/);
  assert.match(loaderSource, /dynamic\(registration\.load/);
  assert.match(registrySource, /kind: "workbook-and-oral-defense"/);
  assert.match(registrySource, /kind: "preview"/);
  assert.match(registrySource, /kind: "unavailable"/);
  assert.match(
    registrySource,
    /no learner-released workbook or interactive studio is available/,
  );
  assert.match(
    registrySource,
    /studio, project evidence, and oral-defense route remain unavailable/,
  );
});

test("M12, M13, and M18 expose their declared direct reader studios", async () => {
  const [graphSource, registrySource] = await Promise.all([
    readFile(new URL("../content/course/course-graph.v2.json", import.meta.url), "utf8"),
    readFile(new URL("../lib/module-studio-registry.ts", import.meta.url), "utf8"),
  ]);
  const graph = JSON.parse(graphSource);
  const m12 = graph.modules.find(({ id }) => id === "m12");
  const m13 = graph.modules.find(({ id }) => id === "m13");
  const m18 = graph.modules.find(({ id }) => id === "m18");

  assert.equal(m12?.studioId, "dependency-direction");
  assert.equal(m13?.studioId, "specification-trace");
  assert.equal(m18?.studioId, "operating-systems");
  assert.match(
    registrySource,
    /"dependency-direction":[\s\S]*?studioId: "dependency-direction"[\s\S]*?DependencyDirectionStudio/u,
  );
  assert.match(
    registrySource,
    /"specification-trace":[\s\S]*?studioId: "specification-trace"[\s\S]*?SpecificationTraceStudio/u,
  );
  assert.match(
    registrySource,
    /"operating-systems":[\s\S]*?studioId: "operating-systems"[\s\S]*?OperatingSystemsStudio/u,
  );
});

test("studio resolution preserves a locked state before fail-closed hidden-reader handling", async () => {
  const registrySource = await readFile(
    new URL("../lib/module-studio-registry.ts", import.meta.url),
    "utf8",
  );
  const resolverSource = registrySource.slice(
    registrySource.indexOf("export function resolveModuleStudio"),
  );
  const lockedCheck = resolverSource.indexOf(
    'courseModule.state.availability === "locked"',
  );
  const hiddenReaderCheck = resolverSource.indexOf(
    'courseModule.state.readerAccess === "hidden"',
  );

  assert.ok(lockedCheck >= 0, "locked modules have an explicit resolution");
  assert.ok(hiddenReaderCheck >= 0, "hidden readers still fail closed");
  assert.ok(
    lockedCheck < hiddenReaderCheck,
    "a locked hidden reader must not be mislabeled authoring-only",
  );
  assert.match(
    resolverSource,
    /state: "locked"[\s\S]*academic prerequisites and release evidence/u,
  );
});
