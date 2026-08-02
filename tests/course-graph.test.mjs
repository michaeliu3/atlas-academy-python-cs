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

test("the canonical Scope Matrix maps every calibration level without turning a planned target into access", async () => {
  const graph = await loadCourseGraph();
  const matrix = graph.scopeMatrix;
  const levels = [...new Set(matrix.topics.map(({ level }) => level))].sort((left, right) => left - right);
  const scopes = new Set(matrix.topics.map(({ scope }) => scope));
  const foundationModels = matrix.topics.find(({ id }) => id === "l8.fm.representations-transformers");
  const optimization = matrix.topics.find(({ id }) => id === "l1.optimization.formulation-convexity");

  assert.equal(matrix.schemaVersion, 1);
  assert.equal(matrix.topics.length, 63);
  assert.deepEqual(levels, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(
    [...scopes].sort(),
    ["core-mastery", "explicitly-deferred", "post-core-specialization", "scoped-exposure"],
  );
  assert.equal(matrix.extensionTracks.length, 4);
  assert.ok(matrix.extensionTracks.every(({ status }) => status === "design-only"));
  assert.deepEqual(foundationModels?.trackId, "foundation-models-nlp");
  assert.equal(optimization?.scope, "core-mastery");
  assert.ok(
    optimization?.anchors.some(({ moduleId }) => moduleId === "m31"),
    "the target remains anchored to M31 rather than silently claiming open delivery",
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
  const m19 = graph.modules.find((courseModule) => courseModule.id === "m19");
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

test("M12 and M13 expose distinct direct reader studios for Arc III reasoning", async () => {
  const [graphSource, registrySource] = await Promise.all([
    readFile(new URL("../content/course/course-graph.v2.json", import.meta.url), "utf8"),
    readFile(new URL("../lib/module-studio-registry.ts", import.meta.url), "utf8"),
  ]);
  const graph = JSON.parse(graphSource);
  const m12 = graph.modules.find(({ id }) => id === "m12");
  const m13 = graph.modules.find(({ id }) => id === "m13");

  assert.equal(m12?.studioId, "dependency-direction");
  assert.equal(m13?.studioId, "specification-trace");
  assert.match(
    registrySource,
    /"dependency-direction":[\s\S]*?studioId: "dependency-direction"[\s\S]*?DependencyDirectionStudio/u,
  );
  assert.match(
    registrySource,
    /"specification-trace":[\s\S]*?studioId: "specification-trace"[\s\S]*?SpecificationTraceStudio/u,
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
