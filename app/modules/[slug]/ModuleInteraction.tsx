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

export function ModuleInteraction({
  courseModule,
  resolution: suppliedResolution,
  sessionLaunches = [],
}: ModuleInteractionProps) {
  const resolution = suppliedResolution ?? resolveModuleStudio(courseModule);

  if (resolution.kind === "studio") {
    return <StudioLoader studioId={resolution.registration.studioId} />;
  }

  if (resolution.kind === "workbook-and-oral-defense") {
    const coreSessions = sessionLaunches.filter(({ number }) => number >= 1 && number <= 6);
    const hasSixSessionPath = coreSessions.length === 6;

    return (
      <section
        aria-labelledby={`module-interaction-${courseModule.number}`}
        className="module-interaction-route"
      >
        <p className="kicker">Interaction route</p>
        <h2 id={`module-interaction-${courseModule.number}`}>{resolution.title}</h2>
        <p>{resolution.description}</p>
        {hasSixSessionPath ? (
          <div className="module-session-launches">
            <p className="module-session-launches-intro">
              Start with a Study Partner rehearsal during the session. Keep the
              Teaching Assistant&apos;s oral defense for after Session 6 and a
              concrete dossier.
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
