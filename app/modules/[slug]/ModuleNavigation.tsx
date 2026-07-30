import Link from "next/link";
import {
  getCourseGraphModule,
  isReaderReleased,
} from "@/lib/course-catalog";
import { moduleHref, type CourseModule } from "@/lib/module-catalog";

type ModuleNavigationProps = {
  courseModule: CourseModule;
  position: "top" | "bottom";
};

function Prerequisite({ number }: { number: number }) {
  const prerequisite = getCourseGraphModule(number);
  if (!prerequisite) {
    return <span>Module {number}</span>;
  }
  if (isReaderReleased(prerequisite)) {
    return (
      <Link href={moduleHref(prerequisite.slug)}>
        Module {prerequisite.number}: {prerequisite.title}
        {prerequisite.availability === "preview" ? " (preview)" : ""}
      </Link>
    );
  }
  return (
    <span className="unavailable-course-reference">
      Module {prerequisite.number}: {prerequisite.title} · in authoring
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
  const isReleased = isReaderReleased(courseModule);
  const href = isReleased ? moduleHref(courseModule.slug) : "/route";
  const label = direction === "previous" ? "Previous in route" : "Next in route";
  const arrow = direction === "previous" ? "← " : " →";

  return (
    <Link
      className={`sequence-link sequence-${direction}`}
      href={href}
      rel={isReleased ? (direction === "previous" ? "prev" : "next") : undefined}
    >
      <span>{label}</span>
      <strong>
        {direction === "previous" ? arrow : ""}
        Module {courseModule.number}: {courseModule.title}
        {direction === "next" ? arrow : ""}
      </strong>
      {!isReleased ? (
        <small>In authoring. The active route pauses here.</small>
      ) : courseModule.availability === "preview" ? (
        <small>Preview—not an unlocked Core step.</small>
      ) : null}
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
