import type { CourseModule, ModuleSessionLaunch } from "@/lib/module-catalog";
import Link from "next/link";
import {
  resolveModuleStudio,
  type ModuleStudioResolution,
} from "@/lib/module-studio-registry";
import { StudioLoader } from "./StudioLoader";

type ModuleInteractionProps = {
  courseModule: CourseModule;
  resolution?: ModuleStudioResolution;
  sessionLaunches?: ModuleSessionLaunch[];
};

type SessionRouteProps = {
  courseModule: CourseModule;
  description: string;
  eyebrow: string;
  sessionLaunches: ModuleSessionLaunch[];
  title: string;
};

function renderSessionRoute({
  courseModule,
  description,
  eyebrow,
  sessionLaunches,
  title,
}: SessionRouteProps) {
  const coreSessions = sessionLaunches.filter(({ number }) => number >= 1 && number <= 6);
  const hasSixSessionPath = coreSessions.length === 6;

  return (
    <section
      aria-labelledby={`module-interaction-${courseModule.number}`}
      className="module-interaction-route"
    >
      <p className="kicker">{eyebrow}</p>
      <h2 id={`module-interaction-${courseModule.number}`}>{title}</h2>
      <p>{description}</p>
      {hasSixSessionPath ? (
        <div className="module-session-launches">
          <p className="module-session-launches-intro">
            Start a Study Partner discussion during the session when it helps.
            Keep the Teaching Assistant&apos;s oral defense for after Session 6 and
            a concrete dossier.
          </p>
          <ol aria-label={`Six-session study path for Module ${courseModule.number}`}>
            {coreSessions.map((session) => (
              <li key={session.id}>
                <a href={`#${session.id}`}>
                  <span>Session {session.number}</span>
                  {session.title}
                </a>
                {session.launch ? <p>{session.launch}</p> : null}
                {session.output ? (
                  <p className="module-session-output">
                    <strong>Carry forward:</strong> {session.output}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
          <a className="module-session-start" href={`#${coreSessions[0].id}`}>
            Start Session 1 with the Study Partner →
          </a>
        </div>
      ) : null}
      <a className="module-oral-defense-link" href={`#oral-defense-${courseModule.number}-title`}>
        Use the Teaching Assistant&apos;s oral defense after evidence ↓
      </a>
    </section>
  );
}

export function ModuleInteraction({
  courseModule,
  resolution: suppliedResolution,
  sessionLaunches = [],
}: ModuleInteractionProps) {
  const resolution = suppliedResolution ?? resolveModuleStudio(courseModule);

  if (resolution.kind === "studio") {
    return (
      <>
        {renderSessionRoute({
          courseModule,
          sessionLaunches,
          eyebrow: "Six-session route + interactive studio",
          title: `Study the route; use the ${resolution.registration.title} as a laboratory.`,
          description:
            "Follow the workbook in order. Make a prediction before using the bounded studio to inspect one claim; the studio does not replace prerequisites, the workbook, or your own evidence.",
        })}
        <StudioLoader studioId={resolution.registration.studioId} />
      </>
    );
  }

  if (resolution.kind === "workbook-and-oral-defense") {
    return renderSessionRoute({
      courseModule,
      sessionLaunches,
      eyebrow: "Interaction route",
      title: resolution.title,
      description: resolution.description,
    });
  }

  if (resolution.kind === "preview") {
    return (
      <aside
        aria-label="Synthesis preview status"
        className="module-availability-notice"
      >
        <p className="kicker">Reference preview · not an unlocked Core step</p>
        <h2>Read this as a map, not a mastered module.</h2>
        <p>{resolution.description}</p>
        <Link href="/route">View the prerequisite-first route →</Link>
      </aside>
    );
  }

  if (resolution.kind === "unavailable") {
    return (
      <aside
        aria-label={`Module ${courseModule.number} availability`}
        className="module-availability-notice"
      >
        <p className="kicker">{resolution.state.replace("-", " ")}</p>
        <h2>This learning interaction is not published.</h2>
        <p>{resolution.description}</p>
      </aside>
    );
  }

  return (
    <aside
      aria-label={`Module ${courseModule.number} studio configuration error`}
      className="module-availability-notice"
      role="alert"
    >
      <p className="kicker">Release configuration error</p>
      <h2>Do not treat this as a published studio.</h2>
      <p>{resolution.description}</p>
    </aside>
  );
}
