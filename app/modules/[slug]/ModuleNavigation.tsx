import Link from "next/link";
import {
  getCourseGraphModule,
  isReaderVisible,
} from "@/lib/course-catalog";
import { moduleHref, type CourseModule } from "@/lib/module-catalog";

type ModuleNavigationProps = {
  courseModule: CourseModule;
  position: "top" | "bottom";
};

type AccessState = CourseModule["state"];

function availabilityLabel({ availability }: AccessState) {
  switch (availability) {
    case "published":
      return "Core-open";
    case "preview":
      return "Reference preview";
    case "optional":
      return "Optional reference";
    case "locked":
      return "Locked";
    case "authoring-only":
      return "In authoring";
  }
}

function routeAccessNote({ availability }: AccessState) {
  switch (availability) {
    case "published":
      return "Core-open workbook. Route order does not verify that academic prerequisites are complete.";
    case "preview":
      return "Reference preview—not an unlocked Core step.";
    case "optional":
      return "Optional reference—not a required Core step.";
    case "locked":
      return "Locked. Return to the route to review its prerequisites and release boundary.";
    case "authoring-only":
      return "In authoring. The active Core route pauses here.";
  }
}

function Prerequisite({ number }: { number: number }) {
  const prerequisite = getCourseGraphModule(number);
  if (!prerequisite) {
    return <span>Module {number}</span>;
  }
  if (isReaderVisible(prerequisite)) {
    return (
      <Link href={moduleHref(prerequisite.slug)}>
        Module {prerequisite.number}: {prerequisite.title}
        {` · ${availabilityLabel(prerequisite.state)}`}
      </Link>
    );
  }
  return (
    <span className="unavailable-course-reference">
      Module {prerequisite.number}: {prerequisite.title} · {availabilityLabel(prerequisite.state)}
    </span>
  );
}

function RouteLink({
  direction,
  number,
}: {
  direction: "previous" | "next";
  number: number;
}) {
  const courseModule = getCourseGraphModule(number);
  if (!courseModule) {
    return null;
  }
  const isReaderOpen = isReaderVisible(courseModule);
  const href = isReaderOpen ? moduleHref(courseModule.slug) : "/route";
  const label = direction === "previous" ? "Previous in route" : "Next in route";
  const arrow = direction === "previous" ? "← " : " →";

  return (
    <Link
      className={`sequence-link sequence-${direction}`}
      href={href}
      rel={isReaderOpen ? (direction === "previous" ? "prev" : "next") : undefined}
    >
      <span>{label}</span>
      <strong>
        {direction === "previous" ? arrow : ""}
        Module {courseModule.number}: {courseModule.title}
        {direction === "next" ? arrow : ""}
      </strong>
      <small>{routeAccessNote(courseModule.state)}</small>
    </Link>
  );
}

export function ModuleNavigation({
  courseModule,
  position,
}: ModuleNavigationProps) {
  return (
    <nav
      className={`module-sequence-nav module-sequence-${position}`}
      aria-label={`${position === "top" ? "Lesson context" : "Continue through the course"}`}
    >
      {position === "top" ? (
        <>
          <div className="prerequisite-link">
            <span>
              {courseModule.prerequisiteNumbers.length === 1
                ? "Academic prerequisite"
                : "Academic prerequisites"}
            </span>
            {courseModule.prerequisiteNumbers.length > 0 ? (
              <div className="prerequisite-list">
                {courseModule.prerequisiteNumbers.map((number) => (
                  <Prerequisite key={number} number={number} />
                ))}
              </div>
            ) : (
              <Link href="/diagnostic">
                Foundation placement diagnostic and learning brief
              </Link>
            )}
          </div>
          <p className="module-route-boundary">
            <strong>{availabilityLabel(courseModule.state)} reader.</strong>{" "}
            These links show planned sequence; they do not infer or record
            prerequisite completion. Keep the listed academic dependencies in
            view when choosing your next learning conversation.
          </p>
        </>
      ) : null}
      <div className="sequence-pair">
        {courseModule.previousRouteNumber ? (
          <RouteLink direction="previous" number={courseModule.previousRouteNumber} />
        ) : (
          <Link className="sequence-link sequence-previous" href="/modules">
            <span>Previous</span>
            <strong>← Course library</strong>
          </Link>
        )}
        {courseModule.nextRouteNumber ? (
          <RouteLink direction="next" number={courseModule.nextRouteNumber} />
        ) : (
          <Link className="sequence-link sequence-next" href="/modules">
            <span>Next</span>
            <strong>Return to the course library →</strong>
          </Link>
        )}
      </div>
    </nav>
  );
}
