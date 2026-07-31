import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const courseStatusProjectionRelativePath = "docs/COURSE_STATUS.md";
export const courseStatusSurfaceRelativePaths = [
  "README.md",
  "ROADMAP.md",
  "docs/ARCHITECTURE.md",
  "docs/LEARNER_ROUTE_PLANS.md",
];

export const courseStatusMarker = {
  start: "<!-- atlas-course-status:start -->",
  end: "<!-- atlas-course-status:end -->",
};

const availabilityDescriptions = {
  "legacy-open":
    "Full reader access for study; formal contract and release review are pending.",
  published:
    "Verified contract and deployed-release evidence; this is not a learner-mastery claim.",
  preview:
    "Reference-only reader access; it does not unlock route progress or synthesis evidence.",
  locked: "Not currently reader-visible.",
  optional: "Reader-visible optional material outside required route progression.",
  "authoring-only": "Hidden from the learner reader until future promotion evidence exists.",
};

function normalizeNewlines(value) {
  return value.replace(/\r\n?/gu, "\n");
}

function relativePath(siteRoot, path) {
  return resolve(siteRoot, path);
}

function formatModuleNumbers(numbers) {
  if (numbers.length === 0) {
    return "—";
  }

  const ranges = [];
  let start = numbers[0];
  let end = start;
  for (const number of numbers.slice(1)) {
    if (number === end + 1) {
      end = number;
      continue;
    }
    ranges.push(start === end ? `M${start}` : `M${start}–M${end}`);
    start = number;
    end = number;
  }
  ranges.push(start === end ? `M${start}` : `M${start}–M${end}`);
  return ranges.join(", ");
}

function countBy(items, selector) {
  return items.reduce((counts, item) => {
    const key = selector(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map());
}

export function deriveCourseStatus(graph) {
  const modulesByAvailability = new Map(
    graph.availabilityStates.map((availability) => [availability, []]),
  );
  for (const courseModule of graph.modules) {
    modulesByAvailability.get(courseModule.state.availability)?.push(courseModule);
  }
  for (const modules of modulesByAvailability.values()) {
    modules.sort((left, right) => left.number - right.number);
  }

  const contractCounts = countBy(graph.modules, ({ state }) => state.contract.state);
  const readerVisible = graph.modules.filter(({ state }) => state.readerAccess !== "hidden");
  const openForStudy = graph.modules.filter(
    ({ state }) => state.availability === "legacy-open" || state.availability === "published",
  );

  return {
    definedModules: graph.modules.length,
    readerVisible: readerVisible.length,
    openForStudy: openForStudy.length,
    contractCounts,
    availability: graph.availabilityStates.map((availability) => {
      const modules = modulesByAvailability.get(availability) ?? [];
      return {
        availability,
        count: modules.length,
        moduleNumbers: modules.map(({ number }) => number),
        readerAccess: [...new Set(modules.map(({ state }) => state.readerAccess))].join(", ") || "—",
        description: availabilityDescriptions[availability],
      };
    }),
  };
}

export function renderCourseStatusSummary(graph) {
  const status = deriveCourseStatus(graph);
  const availability = new Map(status.availability.map((entry) => [entry.availability, entry]));
  const legacyOpen = availability.get("legacy-open");
  const published = availability.get("published");
  const preview = availability.get("preview");
  const authoringOnly = availability.get("authoring-only");

  return [
    "**Canonical availability (generated from `course-graph.v2.json`):**",
    `**${status.definedModules}** defined modules; **${status.readerVisible}** reader-visible; **${status.openForStudy}** open for study.`,
    `- **${legacyOpen?.count ?? 0}** \`legacy-open\` (${formatModuleNumbers(legacyOpen?.moduleNumbers ?? [])}); full reader access, review pending.`,
    `- **${published?.count ?? 0}** \`published\` (${formatModuleNumbers(published?.moduleNumbers ?? [])}); only verified, deployed releases count here.`,
    `- **${preview?.count ?? 0}** \`preview\` (${formatModuleNumbers(preview?.moduleNumbers ?? [])}); reference-only, never route credit.`,
    `- **${authoringOnly?.count ?? 0}** \`authoring-only\` (${formatModuleNumbers(authoringOnly?.moduleNumbers ?? [])}); hidden from the learner reader.`,
    `- Contract states: **${status.contractCounts.get("legacy-baseline") ?? 0}** legacy baselines; **${status.contractCounts.get("verified") ?? 0}** verified.`,
  ].join("\n");
}

export function renderCourseStatusProjection(graph) {
  const status = deriveCourseStatus(graph);
  const rows = status.availability.map(
    ({ availability, count, moduleNumbers, readerAccess, description }) =>
      `| \`${availability}\` | ${count} | ${formatModuleNumbers(moduleNumbers)} | ${readerAccess} | ${description} |`,
  );

  return `${[
    "# Atlas Academy course status",
    "",
    "> Generated by `pnpm sync:modules` from `content/course/course-graph.v2.json`. Do not edit this projection by hand.",
    "",
    "This is an implementation-status projection, not a learner-mastery, external-CI, or deployment-success claim.",
    "",
    "## Current availability",
    "",
    "| Availability | Modules | Module numbers | Reader access | Meaning |",
    "| --- | ---: | --- | --- | --- |",
    ...rows,
    "",
    "## Aggregate truth",
    "",
    `- Defined modules: **${status.definedModules}**`,
    `- Reader-visible modules: **${status.readerVisible}**`,
    `- Open for study (\`legacy-open\` + \`published\`): **${status.openForStudy}**`,
    `- Legacy-baseline contracts: **${status.contractCounts.get("legacy-baseline") ?? 0}**`,
    `- Verified contracts: **${status.contractCounts.get("verified") ?? 0}**`,
    "",
    "`published` is reserved for a module whose canonical graph state carries both a verified contract and deployed-recorded release evidence. It never means that a learner has mastered the module.",
    "",
  ].join("\n")}`;
}

export function applyCourseStatusSummary(content, graph) {
  const normalized = normalizeNewlines(content);
  const startIndex = normalized.indexOf(courseStatusMarker.start);
  const endIndex = normalized.indexOf(courseStatusMarker.end);
  if (startIndex < 0 || endIndex < 0 || endIndex < startIndex) {
    throw new Error(
      "Course-status surface must contain one ordered atlas-course-status marker pair.",
    );
  }
  if (
    normalized.indexOf(courseStatusMarker.start, startIndex + courseStatusMarker.start.length) >= 0 ||
    normalized.indexOf(courseStatusMarker.end, endIndex + courseStatusMarker.end.length) >= 0
  ) {
    throw new Error("Course-status surface may contain only one atlas-course-status marker pair.");
  }

  return `${normalized.slice(0, startIndex + courseStatusMarker.start.length)}\n${renderCourseStatusSummary(graph)}\n${normalized.slice(endIndex)}`;
}

export function courseStatusProjectionPath(siteRoot = defaultSiteRoot) {
  return relativePath(siteRoot, courseStatusProjectionRelativePath);
}

export async function validateCourseStatusProjection(graph, { siteRoot = defaultSiteRoot } = {}) {
  const expectedProjection = normalizeNewlines(renderCourseStatusProjection(graph));
  const projectionPath = courseStatusProjectionPath(siteRoot);
  const actualProjection = normalizeNewlines(
    await readFile(projectionPath, "utf8").catch(() => ""),
  );
  if (actualProjection !== expectedProjection) {
    throw new Error(
      `${courseStatusProjectionRelativePath} must be regenerated from the canonical course graph.`,
    );
  }

  for (const surfacePath of courseStatusSurfaceRelativePaths) {
    const resolvedPath = relativePath(siteRoot, surfacePath);
    const source = await readFile(resolvedPath, "utf8").catch(() => "");
    const expected = applyCourseStatusSummary(source, graph);
    if (normalizeNewlines(source) !== normalizeNewlines(expected)) {
      throw new Error(
        `${surfacePath} must carry the generated canonical course-status summary.`,
      );
    }
  }

  return {
    projectionPath,
    surfacePaths: courseStatusSurfaceRelativePaths.map((path) => relativePath(siteRoot, path)),
  };
}
