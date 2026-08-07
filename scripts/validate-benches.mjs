/**
 * Fail-closed validation of the bench layer.
 *
 * The core seam is check 3: a bench's `emitsArtifact` must string-equal the
 * generated `workbookOutput` for its session. Everything else exists to keep
 * that seam meaningful — an orphaned file, an unregistered graph declaration, or
 * a pack that is 80% "implement this" all degrade the layer even when every
 * individual artifact name still matches.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  benchDependencyAllowlist,
  benchIdFor,
  benchPackIds,
  benchPackPolicies,
  benchPackRegistry,
  benchPythonFloors,
  corpusRuleMinimumBenches,
  corpusRungCeilings,
  corpusRungFloors,
  findBenchPack,
  ladderRungs,
  noBenchReasons,
  primaryRung,
} from "../lib/module-bench-registry.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");

const graph = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/course-graph.v2.json"), "utf8"),
);
const packs = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "content/course/module-teaching-packs.v1.json"), "utf8"),
);

const errors = [];
const allPrimaries = [];
const packByModuleId = new Map((packs.modules ?? []).map((pack) => [pack.moduleId, pack]));
const rungSet = new Set(ladderRungs);
const dependencySet = new Set(benchDependencyAllowlist);

function exists(relativePath) {
  return Boolean(relativePath) && fs.existsSync(path.join(siteRoot, relativePath));
}

function isRegularFile(relativePath) {
  const absolute = path.join(siteRoot, relativePath);
  if (!fs.existsSync(absolute)) return false;
  return fs.lstatSync(absolute).isFile();
}

// --------------------------------------------------------------------------
// 1. Every graph declaration resolves to a registered pack.
// --------------------------------------------------------------------------

const declaredByModule = new Map();
for (const graphModule of graph.modules ?? []) {
  const benchPackId = graphModule.benchPackId ?? null;
  if (benchPackId === null) continue;
  declaredByModule.set(graphModule.id, benchPackId);
  if (!findBenchPack(benchPackId)) {
    errors.push(
      `${graphModule.id}: declares bench pack "${benchPackId}" which is not registered — configuration error`,
    );
  }
}

// --------------------------------------------------------------------------
// 2-7. Per-pack structural and budget rules.
// --------------------------------------------------------------------------

for (const benchPackId of benchPackIds) {
  const registration = benchPackRegistry[benchPackId];
  const moduleId = `m${String(registration.moduleNumber).padStart(2, "0")}`;
  const pack = packByModuleId.get(moduleId);

  if (!pack) {
    errors.push(`${benchPackId}: no teaching pack for module ${moduleId}`);
    continue;
  }

  const graphModule = (graph.modules ?? []).find((m) => m.id === moduleId);
  if (!graphModule) {
    errors.push(`${benchPackId}: module ${moduleId} absent from the course graph`);
  } else if ((graphModule.benchPackId ?? null) !== benchPackId) {
    errors.push(
      `${benchPackId}: registered but ${moduleId} declares benchPackId ` +
        `${JSON.stringify(graphModule.benchPackId ?? null)} — the binding must be declared in the graph`,
    );
  }

  if (!benchPythonFloors.includes(registration.pythonFloor)) {
    errors.push(`${benchPackId}: unsupported pythonFloor ${registration.pythonFloor}`);
  }

  if (graphModule?.state?.availability === "authoring-only" && registration.visibility !== "private-guided-study") {
    errors.push(
      `${benchPackId}: module is authoring-only, so visibility must be "private-guided-study"`,
    );
  }

  const seenSessions = new Set();
  const primaries = [];

  for (const session of registration.sessions ?? []) {
    const benchId = benchIdFor(benchPackId, session.sessionNumber);

    // 4. Session numbers are 1..6 and unique within a pack.
    if (!Number.isInteger(session.sessionNumber) || session.sessionNumber < 1 || session.sessionNumber > 6) {
      errors.push(`${benchId}: sessionNumber must be an integer 1..6`);
    }
    if (seenSessions.has(session.sessionNumber)) {
      errors.push(`${benchId}: duplicate sessionNumber within the pack`);
    }
    seenSessions.add(session.sessionNumber);

    // 2. The source file exists and is a real file.
    if (!isRegularFile(session.sourcePath)) {
      errors.push(`${benchId}: sourcePath ${session.sourcePath} is missing or not a regular file`);
    }

    // 3. THE SEAM. emitsArtifact must equal the workbook's declared output.
    const packSession = (pack.sessions ?? []).find((s) => s.number === session.sessionNumber);
    if (!packSession) {
      errors.push(`${benchId}: teaching pack has no session ${session.sessionNumber}`);
    } else {
      const declared = packSession.workbookOutput ?? null;
      if (declared === null) {
        if (session.artifactSource !== "pending-workbook-output") {
          errors.push(
            `${benchId}: session has no workbookOutput in the workbook. Author a ` +
              `"### Output:" heading, or declare artifactSource "pending-workbook-output" ` +
              `if this module is on the reviewed exception list.`,
          );
        }
      } else if (declared !== session.emitsArtifact) {
        errors.push(
          `${benchId}: emitsArtifact ${JSON.stringify(session.emitsArtifact)} ` +
            `does not equal workbookOutput ${JSON.stringify(declared)}`,
        );
      }
    }

    // 5. Rungs are canonical.
    for (const rung of session.rungs ?? []) {
      if (!rungSet.has(rung)) {
        errors.push(`${benchId}: unknown ladder rung ${JSON.stringify(rung)}`);
      }
    }
    if (!session.rungs?.length) {
      errors.push(`${benchId}: declares no ladder rungs`);
    }
    primaries.push({ benchId, primary: primaryRung(session), rungs: session.rungs ?? [] });

    // 7. Dependencies are allowlisted.
    for (const dependency of session.dependencies ?? []) {
      if (!dependencySet.has(dependency)) {
        errors.push(
          `${benchId}: dependency ${JSON.stringify(dependency)} is outside the allowlist ` +
            `[${benchDependencyAllowlist.join(", ")}]`,
        );
      }
    }
  }

  // 6. R1 — the implementation budget.
  const modifyPrimary = primaries.filter((entry) => entry.primary === "modify");
  if (modifyPrimary.length > 1) {
    errors.push(
      `${benchPackId}: R1 — ${modifyPrimary.length} benches are modify-primary ` +
        `(${modifyPrimary.map((e) => e.benchId).join(", ")}); at most one is allowed. ` +
        `Targeted mechanism implementation is 5% of the course's evidence weight.`,
    );
  }
  for (const entry of primaries) {
    if (entry.rungs.length === 1 && entry.rungs[0] === "modify") {
      errors.push(`${benchPackId}: R1 — ${entry.benchId} has "modify" as its only rung`);
    }
  }

  // R2' is corpus-level and checked after this loop — a 2-bench sparse pack
  // cannot carry both heavy rungs, so a per-pack rule would either be dead or
  // force padding.
  allPrimaries.push(...primaries.map((entry) => entry.primary));

  // Sparse packs must account for every session in exactly one of three states:
  // benched, deliberately excluded with a reason, or planned-but-unauthored.
  if (registration.policy === "sparse") {
    const benched = new Set((registration.sessions ?? []).map((s) => s.sessionNumber));
    const declared = new Set((registration.unbenchedSessions ?? []).map((s) => s.sessionNumber));
    const planned = new Set(registration.plannedSessions ?? []);
    for (let session = 1; session <= 6; session += 1) {
      const states = [benched.has(session), declared.has(session), planned.has(session)];
      const count = states.filter(Boolean).length;
      if (count === 0) {
        errors.push(
          `${benchPackId}: session ${session} is neither benched, excluded with a ` +
            `reason, nor planned. An absence must be a stated decision.`,
        );
      } else if (count > 1) {
        errors.push(
          `${benchPackId}: session ${session} is in more than one state ` +
            `(benched/excluded/planned); exactly one is allowed.`,
        );
      }
    }
    for (const entry of registration.unbenchedSessions ?? []) {
      if (!Object.hasOwn(noBenchReasons, entry.reason)) {
        errors.push(
          `${benchPackId}: session ${entry.sessionNumber} declares unknown ` +
            `no-bench reason ${JSON.stringify(entry.reason)}; expected one of ` +
            `${Object.keys(noBenchReasons).join(", ")}`,
        );
      }
      if (benched.has(entry.sessionNumber)) {
        errors.push(
          `${benchPackId}: session ${entry.sessionNumber} is both benched and ` +
            `declared unbenched`,
        );
      }
    }
  }

  if (registration.policy && !benchPackPolicies.includes(registration.policy)) {
    errors.push(`${benchPackId}: unknown policy ${JSON.stringify(registration.policy)}`);
  }
}

// --------------------------------------------------------------------------
// R2' — the corpus-level weight floor.
//
// Debugging is 20% of the course's assessed evidence and agent-directed review
// is another 20% (AI_NATIVE_LEARNING_MODEL.md). Those are proportions of the
// whole, not of every module, so the floor belongs here rather than per pack.
// --------------------------------------------------------------------------

const corpusRulesApply = allPrimaries.length >= corpusRuleMinimumBenches;

if (corpusRulesApply) {
  for (const [rung, floor] of Object.entries(corpusRungFloors)) {
    const share = allPrimaries.filter((primary) => primary === rung).length / allPrimaries.length;
    if (share < floor) {
      errors.push(
        `R2' — ${(share * 100).toFixed(0)}% of benches are "${rung}"-primary, ` +
          `below the ${(floor * 100).toFixed(0)}% corpus floor. That rung carries ` +
          `20% of the course's evidence weight; a corpus of traces does not.`,
      );
    }
  }
  for (const [rung, ceiling] of Object.entries(corpusRungCeilings)) {
    const share = allPrimaries.filter((primary) => primary === rung).length / allPrimaries.length;
    if (share > ceiling) {
      errors.push(
        `R2' — ${(share * 100).toFixed(0)}% of benches are "${rung}"-primary, ` +
          `above the ${(ceiling * 100).toFixed(0)}% corpus ceiling. Targeted ` +
          `implementation is 5% of the course's evidence weight; R1 caps it per ` +
          `pack but cannot hold the proportion across packs.`,
      );
    }
  }
}

// --------------------------------------------------------------------------
// 8. Orphan check: no bench sources for an unregistered module.
// --------------------------------------------------------------------------

const benchSourceRoot = path.join(siteRoot, "benches/src");
if (fs.existsSync(benchSourceRoot)) {
  const registeredPaths = new Set(
    benchPackIds.flatMap((id) =>
      (benchPackRegistry[id].sessions ?? []).map((session) => session.sourcePath),
    ),
  );
  for (const entry of fs.readdirSync(benchSourceRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^m\d{2}$/.test(entry.name)) continue;
    const packDirectory = path.join(benchSourceRoot, entry.name);
    for (const file of fs.readdirSync(packDirectory)) {
      if (!file.endsWith(".py") || file.startsWith("_")) continue;
      const relative = `benches/src/${entry.name}/${file}`;
      if (!registeredPaths.has(relative)) {
        errors.push(`${relative}: bench source exists but is not registered`);
      }
    }
  }
}

// --------------------------------------------------------------------------

const registeredSessions = benchPackIds.reduce(
  (total, id) => total + (benchPackRegistry[id].sessions ?? []).length,
  0,
);

const rungShares = Object.fromEntries(
  ladderRungs
    .map((rung) => [
      rung,
      allPrimaries.length
        ? `${((allPrimaries.filter((p) => p === rung).length / allPrimaries.length) * 100).toFixed(0)}%`
        : "0%",
    ])
    .filter(([, share]) => share !== "0%"),
);

const summary = {
  benchPacks: benchPackIds.length,
  benches: registeredSessions,
  graphDeclarations: declaredByModule.size,
  modulesWithoutBenchPack: (graph.modules ?? []).length - declaredByModule.size,
  primaryRungShares: rungShares,
  corpusRules: corpusRulesApply
    ? "enforced"
    : `deferred (${allPrimaries.length} benches; proportions are noise below ${corpusRuleMinimumBenches})`,
  errors: errors.length,
};

if (errors.length) {
  console.error(JSON.stringify({ summary, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(summary, null, 2));
}
