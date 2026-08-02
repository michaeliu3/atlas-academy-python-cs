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

const availabilityRank: Record<CourseAvailability, number> = {
  "authoring-only": 0,
  locked: 1,
  preview: 2,
  optional: 3,
  "legacy-open": 4,
  published: 5,
};

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
  if (topic.scope === "post-core-specialization") {
    return {
      label: "Post-core design only",
      detail: "Core anchors are prerequisites or bridges, not a completed specialization.",
    };
  }
  if (topic.scope === "explicitly-deferred") {
    return {
      label: "Explicitly deferred",
      detail: "This needs a longer sequence and feedback cycle than the Atlas Core claims.",
    };
  }

  const anchorModules = topic.anchors
    .map(({ moduleId }) => modulesById.get(moduleId))
    .filter((courseModule): courseModule is NonNullable<typeof courseModule> => Boolean(courseModule));
  const leastDeliverable = anchorModules.reduce((least, courseModule) =>
    availabilityRank[courseModule.state.availability] < availabilityRank[least.state.availability]
      ? courseModule
      : least,
  );

  return {
    label: availabilityLabels[leastDeliverable.state.availability],
    detail:
      leastDeliverable.state.readerAccess === "hidden"
        ? "A required anchor is hidden while its learner-release evidence is reviewed."
        : "This labels current access, not learner completion or verified mastery.",
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
            The attached Levels 1–9 inventory calibrates this course; it is not
            a 60-day promise of universal mastery. Each row separates the
            learning target from what is currently available in Atlas.
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
          return (
            <details className={styles.scopeLevel} key={level} open={level === 1}>
              <summary>
                <span>Level {level} · {levelTitles.get(level)}</span>
                <small>{topics.length} mapped areas</small>
              </summary>
              <div className={styles.scopeTopicGrid}>
                {topics.map((topic) => {
                  const delivery = deliveryPresentation(topic);
                  const track = topic.trackId ? tracksById.get(topic.trackId) : null;
                  return (
                    <article className={styles.scopeTopic} key={topic.id}>
                      <div className={styles.scopeTopicTopline}>
                        <span className={styles.scopeTag}>{scopeLabels[topic.scope]}</span>
                        <span className={styles.deliveryTag}>{delivery.label}</span>
                      </div>
                      <h3>{topic.label}</h3>
                      <p className={styles.deliveryDetail}>{delivery.detail}</p>
                      <dl>
                        <div>
                          <dt>Target depth</dt>
                          <dd>{topic.targetCapabilities.join(" · ")}</dd>
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
