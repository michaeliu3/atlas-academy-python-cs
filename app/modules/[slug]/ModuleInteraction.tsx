import type { CourseModule } from "@/lib/module-catalog";
import Link from "next/link";
import {
  resolveModuleStudio,
  type ModuleStudioResolution,
} from "@/lib/module-studio-registry";
import { StudioLoader } from "./StudioLoader";

type ModuleInteractionProps = {
  courseModule: CourseModule;
  resolution?: ModuleStudioResolution;
};

export function ModuleInteraction({
  courseModule,
  resolution: suppliedResolution,
}: ModuleInteractionProps) {
  const resolution = suppliedResolution ?? resolveModuleStudio(courseModule);

  if (resolution.kind === "studio") {
    return <StudioLoader studioId={resolution.registration.studioId} />;
  }

  if (resolution.kind === "workbook-and-oral-defense") {
    return (
      <section
        aria-labelledby={`module-interaction-${courseModule.number}`}
        className="module-interaction-route"
      >
        <p className="kicker">Interaction route</p>
        <h2 id={`module-interaction-${courseModule.number}`}>{resolution.title}</h2>
        <p>{resolution.description}</p>
        <a href={`#oral-defense-${courseModule.number}-title`}>
          Go to this module&apos;s oral-defense conversation ↓
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
