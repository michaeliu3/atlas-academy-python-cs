import {
  courseCatalog,
  courseScopeMatrix,
  type CourseAvailability,
  type ScopeMatrixTopic,
} from "@/lib/course-catalog";
import styles from "./route.module.css";

const modulesById = new Map(
  courseCatalog.modules.map((courseModule) => [courseModule.id, courseModule]),
);

const levelTitles = new Map([
  [1, "Mathematical foundations"],
  [2, "Core computer science"],
  [3, "Classical artificial intelligence"],
  [4, "Core machine learning"],
  [5, "Deep learning"],
  [6, "Probabilistic modeling and inference"],
  [7, "Sequential decision-making and reinforcement learning"],
  [8, "Foundation models, LLMs, and generative AI"],
  [9, "Deep specialization"],
]);

const sourceDirectiveLabels = {
  master: "Master",
  "graduate-master": "Graduate master",
  "also-know": "Also know",
  study: "Study",
} as const;

const availabilityLabels: Record<CourseAvailability, string> = {
  "legacy-open": "Open material · review pending",
  published: "Verified published",
  preview: "Reference preview",
  locked: "Locked pending prerequisites and release evidence",
  optional: "Optional reference",
  "authoring-only": "Authoring-only — no learner reader route",
};

const availabilityOrder: CourseAvailability[] = [
  "legacy-open",
  "published",
  "preview",
  "locked",
  "optional",
  "authoring-only",
];

const availabilitySummaryLabels: Record<CourseAvailability, string> = {
  "legacy-open": "open legacy",
  published: "verified published",
  preview: "reference preview",
  locked: "locked",
  optional: "optional reference",
  "authoring-only": "authoring-only",
};

function deliveryLabel(topic: ScopeMatrixTopic) {
  const availabilityCounts = new Map<CourseAvailability, number>();
  let privateGuidedReadyCount = 0;
  for (const { moduleId } of topic.anchors) {
    const courseModule = modulesById.get(moduleId);
    if (!courseModule) {
      continue;
    }
    const availability = courseModule.state.availability;
    availabilityCounts.set(availability, (availabilityCounts.get(availability) ?? 0) + 1);
    if (courseModule.state.privateGuidedStudy?.status === "ready") {
      privateGuidedReadyCount += 1;
    }
  }
  const deliveryStates = availabilityOrder.filter((availability) => availabilityCounts.has(availability));
  if (deliveryStates.length === 0) {
    return "No mapped delivery";
  }
  if (deliveryStates.length === 1) {
    if (
      deliveryStates[0] === "authoring-only" &&
      privateGuidedReadyCount === topic.anchors.length
    ) {
      return "Private guided study ready · portal reader hidden";
    }
    return availabilityLabels[deliveryStates[0]];
  }
  const detail = deliveryStates
    .map((availability) => {
      const count = availabilityCounts.get(availability) ?? 0;
      return `${count} ${availabilitySummaryLabels[availability]} ${count === 1 ? "anchor" : "anchors"}`;
    })
    .join("; ");
  const privateGuidedDetail =
    privateGuidedReadyCount > 0
      ? `; ${privateGuidedReadyCount} private guided-study ${
          privateGuidedReadyCount === 1 ? "pack" : "packs"
        } ready; the designated pack remains hidden in the portal`
      : "";
  return `Mixed anchor delivery · ${detail}${privateGuidedDetail}`;
}

export function ScopeInventory() {
  const topicsById = new Map(
    courseScopeMatrix.topics.map((topic) => [topic.id, topic]),
  );
  const sectionsByLevel = new Map<number, typeof courseScopeMatrix.benchmark.items>();
  for (const section of courseScopeMatrix.benchmark.items) {
    const sections = sectionsByLevel.get(section.level) ?? [];
    sections.push(section);
    sectionsByLevel.set(section.level, sections);
  }
  const atomicItemsBySection = new Map<
    string,
    typeof courseScopeMatrix.benchmark.atomicItems
  >();
  for (const atomicItem of courseScopeMatrix.benchmark.atomicItems) {
    const items = atomicItemsBySection.get(atomicItem.sectionId) ?? [];
    items.push(atomicItem);
    atomicItemsBySection.set(atomicItem.sectionId, items);
  }
  const sourceDirectiveByLine = new Map<number, keyof typeof sourceDirectiveLabels>();
  for (const sourceList of courseScopeMatrix.benchmark.sourceLists) {
    for (
      let sourceLine = sourceList.sourceLineStart;
      sourceLine <= sourceList.sourceLineEnd;
      sourceLine += 1
    ) {
      sourceDirectiveByLine.set(sourceLine, sourceList.directive);
    }
  }

  return (
    <section className={styles.inventoryPage} aria-labelledby="scope-inventory-title">
      <header className={styles.inventoryPageHeader}>
        <div>
          <p className="kicker">Source-calibration evidence</p>
          <h1 id="scope-inventory-title">Levels 1–9 target crosswalk</h1>
        </div>
        <div>
          <p>
            This is the audit surface behind the concise Scope Matrix. It
            preserves all 362 learner-supplied learning targets, maps each one
            to its same-level Atlas target, and shows the target’s current
            delivery label.
          </p>
          <p className={styles.scopeBoundary}>
            <strong>It proves calibration, not completion.</strong>
            {" "}A source target can map to authoring-only, a designated private
            guided-study pack, preview, or open-but-unreviewed material; none of
            those labels is learner
            mastery, formal review, or release evidence.
          </p>
          <a className={styles.inventoryBack} href="/route#scope-matrix-title">
            Return to the concise 60-day route
          </a>
        </div>
      </header>

      <div className={styles.inventoryPageLegend}>
        <span><strong>Source target</strong> preserves the supplied learning-target wording.</span>
        <span><strong>Atlas target</strong> links to the concise route card with sessions and evidence.</span>
        <span><strong>Current delivery</strong> lists reader availability and any designated private guided-study pack among that target’s mapped modules.</span>
      </div>

      <div className={styles.scopeLevels}>
        {Array.from({ length: 9 }, (_, index) => index + 1).map((level) => {
          const sections = sectionsByLevel.get(level) ?? [];
          const targetCount = sections.reduce(
            (count, section) => count + (atomicItemsBySection.get(section.id)?.length ?? 0),
            0,
          );
          return (
            <details
              className={styles.scopeLevel}
              id={`scope-inventory-level-${level}`}
              key={level}
              open={level === 1}
            >
              <summary>
                <span>Level {level} · {levelTitles.get(level)}</span>
                <small>{targetCount} source targets</small>
              </summary>
              <div className={styles.inventorySections}>
                {sections.map((section) => {
                  const atomicItems = atomicItemsBySection.get(section.id) ?? [];
                  return (
                    <details className={styles.inventorySection} key={section.id}>
                      <summary>
                        <span>{section.label}</span>
                        <small>{atomicItems.length} source targets</small>
                      </summary>
                      <ol>
                        {atomicItems.map((atomicItem) => {
                          const directive =
                            sourceDirectiveByLine.get(atomicItem.sourceLine) ?? "master";
                          return (
                            <li key={atomicItem.sourceLine}>
                              <span className={styles.inventorySource}>
                                <span className={styles.directiveTag}>
                                  {sourceDirectiveLabels[directive]}
                                </span>
                                {atomicItem.label}
                              </span>
                              <span aria-hidden="true" className={styles.inventoryArrow}>→</span>
                              <span className={styles.inventoryTargets}>
                                {atomicItem.scopeTopicIds.map((topicId) => {
                                  const target = topicsById.get(topicId);
                                  if (!target) {
                                    return null;
                                  }
                                  return (
                                    <span key={topicId}>
                                      <a href={`/route#scope-topic-${topicId}`}>
                                        {target.label}
                                      </a>
                                      <small>{deliveryLabel(target)}</small>
                                    </span>
                                  );
                                })}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    </details>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
