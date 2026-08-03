import Link from "next/link";
import {
  courseCatalog,
  courseScopeMatrix,
  type CourseAvailability,
  type ScopeMatrixState,
  type ScopeMatrixTopic,
} from "@/lib/course-catalog";
import { moduleHref } from "@/lib/module-catalog";
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

const scopeLabels: Record<ScopeMatrixState, string> = {
  "core-mastery": "Core target",
  "scoped-exposure": "Scoped exposure",
  "post-core-specialization": "Post-core specialization",
  "explicitly-deferred": "Explicitly deferred",
};

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

const calibrationSourceLabels = new Map([
  [
    "https://ocw.mit.edu/courses/6-854j-advanced-algorithms-fall-2005/",
    "MIT 6.854 Advanced Algorithms",
  ],
  [
    "https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/pages/syllabus/",
    "MIT 6.045J Automata, Computability & Complexity",
  ],
  ["https://omscs.gatech.edu/cs-6515-intro-graduate-algorithms", "Georgia Tech CS 6515"],
  ["https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/", "MIT 6.7960 Deep Learning"],
  ["https://web.stanford.edu/class/cs329s/", "Stanford CS329S ML Systems Design"],
  ["https://omscs.gatech.edu/cs-7643-deep-learning", "Georgia Tech CS 7643 Deep Learning"],
  ["https://www.cs.cmu.edu/~pradeepr/708/", "CMU 10-708 Probabilistic Graphical Models"],
  ["https://rail.eecs.berkeley.edu/deeprlcourse/index.html", "UC Berkeley CS 285 Deep RL"],
  [
    "https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html",
    "UC Berkeley CS 188 MDPs",
  ],
  [
    "https://ocw.mit.edu/courses/6-s087-foundation-models-and-generative-ai-january-iap-2024/",
    "MIT 6.S087 Foundation Models & Generative AI",
  ],
  ["https://web.stanford.edu/class/cs224n/", "Stanford CS224N NLP with Deep Learning"],
]);

function sessionLabel(sessions: number[]) {
  const sorted = [...sessions].sort((left, right) => left - right);
  if (sorted.length === 1) {
    return `S${sorted[0]}`;
  }
  const consecutive = sorted.every((session, index) => index === 0 || session === sorted[index - 1] + 1);
  return consecutive
    ? `S${sorted[0]}–S${sorted[sorted.length - 1]}`
    : sorted.map((session) => `S${session}`).join(", ");
}

function moduleReference(moduleId: string) {
  const courseModule = modulesById.get(moduleId);
  if (!courseModule) {
    return <span>Unavailable source reference</span>;
  }

  const shortLabel = `M${courseModule.number}`;
  if (courseModule.state.readerAccess === "hidden") {
    return <span>{shortLabel} · authoring-only</span>;
  }

  return <Link href={moduleHref(courseModule.slug)}>{shortLabel} · {courseModule.title}</Link>;
}

function deliveryPresentation(topic: ScopeMatrixTopic) {
  const anchorModules = topic.anchors
    .map(({ moduleId }) => modulesById.get(moduleId))
    .filter((courseModule): courseModule is NonNullable<typeof courseModule> => Boolean(courseModule));
  const availabilityCounts = new Map<CourseAvailability, number>();
  for (const courseModule of anchorModules) {
    const availability = courseModule.state.availability;
    availabilityCounts.set(availability, (availabilityCounts.get(availability) ?? 0) + 1);
  }
  const deliveryStates = availabilityOrder.flatMap((availability) => {
    const count = availabilityCounts.get(availability) ?? 0;
    return count === 0 ? [] : [{ availability, count }];
  });
  const label =
    deliveryStates.length === 1
      ? availabilityLabels[deliveryStates[0].availability]
      : "Mixed anchor delivery";
  const deliverySummary = deliveryStates
    .map(
      ({ availability, count }) =>
        deliveryStates.length === 1
          ? `${count} mapped ${count === 1 ? "anchor" : "anchors"}`
          : `${count} ${count === 1 ? "anchor" : "anchors"} · ${availabilityLabels[availability]}`,
    )
    .join("; ");

  const scopeNote =
    topic.scope === "post-core-specialization"
      ? "This is a post-core study design; its Core anchors are bridges, not completed specialization."
      : topic.scope === "explicitly-deferred"
        ? "This needs a longer sequence and feedback cycle than the Atlas Core claims."
        : "This labels current access, not learner completion or verified mastery.";

  return {
    label,
    detail: deliverySummary || "No mapped anchor delivery is available.",
    scopeNote,
  };
}

function calibrationSourceName(url: string) {
  return calibrationSourceLabels.get(url) ?? new URL(url).hostname;
}

export function ScopeMatrix() {
  const topicsByLevel = new Map<number, ScopeMatrixTopic[]>();
  for (const topic of courseScopeMatrix.topics) {
    const topics = topicsByLevel.get(topic.level) ?? [];
    topics.push(topic);
    topicsByLevel.set(topic.level, topics);
  }
  const benchmarkSectionsByLevel = new Map<number, typeof courseScopeMatrix.benchmark.items>();
  for (const section of courseScopeMatrix.benchmark.items) {
    const sections = benchmarkSectionsByLevel.get(section.level) ?? [];
    sections.push(section);
    benchmarkSectionsByLevel.set(section.level, sections);
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
  const tracksById = new Map(
    courseScopeMatrix.extensionTracks.map((track) => [track.id, track]),
  );

  return (
    <section className={styles.scopeMatrix} aria-labelledby="scope-matrix-title">
      <header className={styles.scopeMatrixIntro}>
        <div>
          <p className="kicker">Levels 1–9 calibration map</p>
          <h2 id="scope-matrix-title">Scope Matrix: intended depth and current delivery</h2>
        </div>
        <div>
          <p>
            The Levels 1–9 inventory calibrates this course; it is not a
            60-day promise of universal mastery. This route keeps the learning
            map concise; the linked source crosswalk preserves all 362 targets
            and separates each target from current Atlas delivery.
          </p>
          <p className={styles.scopeBoundary}>
            <strong>A topic can be a Core target and still be authoring-only today.</strong>
            {" "}A mention, preview, or hidden draft never counts as covered,
            completed, or verified.
          </p>
        </div>
      </header>

      <div className={styles.scopeLegend} aria-label="Scope Matrix legend">
        <span><strong>Target depth</strong> says what the course asks you to be able to do.</span>
        <span><strong>Current delivery</strong> says whether the required material is open, preview-only, hidden, or intentionally deferred.</span>
        <span><strong>Evidence</strong> names the learner artifact—not a grade.</span>
      </div>

      <div className={styles.scopeLevels}>
        {Array.from({ length: 9 }, (_, index) => index + 1).map((level) => {
          const topics = topicsByLevel.get(level) ?? [];
          const benchmarkSections = benchmarkSectionsByLevel.get(level) ?? [];
          const atomicItemCount = benchmarkSections.reduce(
            (count, section) => count + (atomicItemsBySection.get(section.id)?.length ?? 0),
            0,
          );
          return (
            <details className={styles.scopeLevel} key={level} open={level === 1}>
              <summary>
                <span>Level {level} · {levelTitles.get(level)}</span>
                <small>{topics.length} mapped areas · {atomicItemCount} source targets</small>
              </summary>
              <div className={styles.scopeTopicGrid}>
                {topics.map((topic) => {
                  const delivery = deliveryPresentation(topic);
                  const track = topic.trackId ? tracksById.get(topic.trackId) : null;
                  return (
                    <article
                      className={styles.scopeTopic}
                      id={`scope-topic-${topic.id}`}
                      key={topic.id}
                    >
                      <div className={styles.scopeTopicTopline}>
                        <span className={styles.scopeTag}>{scopeLabels[topic.scope]}</span>
                      </div>
                      <h3>{topic.label}</h3>
                      <p className={styles.deliveryDetail}>{delivery.scopeNote}</p>
                      <dl>
                        <div>
                          <dt>Target depth</dt>
                          <dd>{topic.targetCapabilities.join(" · ")}</dd>
                        </div>
                        <div>
                          <dt>Current delivery</dt>
                          <dd>
                            <span className={styles.deliveryTag}>{delivery.label}</span>
                            <span>{delivery.detail}</span>
                          </dd>
                        </div>
                        <div>
                          <dt>Sessions</dt>
                          <dd>
                            {topic.anchors.map(({ moduleId, sessions }) => (
                              <span key={`${moduleId}-${sessions.join("-")}`}>
                                {moduleReference(moduleId)} · {sessionLabel(sessions)}
                              </span>
                            ))}
                          </dd>
                        </div>
                        <div>
                          <dt>Source route</dt>
                          <dd>
                            {topic.sourceModuleIds.map((moduleId) => (
                              <span key={moduleId}>{moduleReference(moduleId)}</span>
                            ))}
                          </dd>
                        </div>
                        <div>
                          <dt>Evidence</dt>
                          <dd>{topic.evidenceArtifact}</dd>
                        </div>
                        {track ? (
                          <div>
                            <dt>Next track</dt>
                            <dd><a href={`#track-${track.id}`}>{track.title}</a></dd>
                          </div>
                        ) : null}
                      </dl>
                    </article>
                  );
                })}
              </div>
              <aside className={styles.inventoryCallout}>
                <p>
                  <strong>{atomicItemCount} source targets</strong> are
                  calibrated to this level. The proof surface stays outside
                  the everyday route so it does not slow or crowd your study.
                </p>
                <Link href={`/route/inventory#scope-inventory-level-${level}`}>
                  Inspect the Level {level} source crosswalk
                </Link>
              </aside>
            </details>
          );
        })}
      </div>

      <section className={styles.extensionTracks} aria-labelledby="extension-tracks-title">
        <div>
          <p className="kicker">After the Core</p>
          <h3 id="extension-tracks-title">Post-core extension routes (design only)</h3>
          <p>
            Choose one specialization at a time after the Core. These are
            calibrated study designs, not added modules, release promises, or
            claims of university-equivalent depth.
          </p>
        </div>
        <ol>
          {courseScopeMatrix.extensionTracks.map((track) => (
            <li id={`track-${track.id}`} key={track.id}>
              <div className={styles.trackHeading}>
                <h4>{track.title}</h4>
                <span>{track.status}</span>
              </div>
              <dl>
                <div>
                  <dt>Recommended cadence</dt>
                  <dd>
                    <span><strong>{track.cadence.firstPassDays}-day route</strong> · bounded first pass</span>
                    <span><strong>{track.cadence.recommendedDays}-day route</strong> · durable extension</span>
                    <span>{track.cadence.rationale}</span>
                  </dd>
                </div>
                <div>
                  <dt>Prerequisites</dt>
                  <dd>
                    {track.prerequisiteModuleIds.map((moduleId) => (
                      <span key={moduleId}>{moduleReference(moduleId)}</span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt>Official calibration</dt>
                  <dd>
                    {track.calibrationUrls.map((url) => (
                      <a href={url} key={url} rel="noreferrer" target="_blank">
                        {calibrationSourceName(url)}
                      </a>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt>Bounded project</dt>
                  <dd>{track.project}</dd>
                </div>
                <div>
                  <dt>Oral defense</dt>
                  <dd>{track.oralDefense}</dd>
                </div>
                <div>
                  <dt>Non-claim</dt>
                  <dd>{track.nonClaim}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
