import Link from "next/link";
import {
  getModuleBySlug,
  moduleHref,
  type CourseModule,
} from "@/lib/module-catalog";

type ModuleNavigationProps = {
  courseModule: CourseModule;
  position: "top" | "bottom";
};

function ModuleLink({
  direction,
  slug,
}: {
  direction: "previous" | "next";
  slug: string;
}) {
  const courseModule = getModuleBySlug(slug);
  if (!courseModule) {
    return null;
  }
  return (
    <Link
      className={`sequence-link sequence-${direction}`}
      href={moduleHref(courseModule.slug)}
      rel={direction === "previous" ? "prev" : "next"}
    >
      <span>{direction === "previous" ? "Previous" : "Next"}</span>
      <strong>
        {direction === "previous" ? "← " : ""}
        Module {courseModule.number}: {courseModule.title}
        {direction === "next" ? " →" : ""}
      </strong>
    </Link>
  );
}

export function ModuleNavigation({
  courseModule,
  position,
}: ModuleNavigationProps) {
  const prerequisite = courseModule.prerequisiteSlug
    ? getModuleBySlug(courseModule.prerequisiteSlug)
    : null;

  return (
    <nav
      className={`module-sequence-nav module-sequence-${position}`}
      aria-label={`${position === "top" ? "Lesson context" : "Continue through the course"}`}
    >
      {position === "top" ? (
        <div className="prerequisite-link">
          <span>Prerequisite</span>
          {prerequisite ? (
            <Link href={moduleHref(prerequisite.slug)}>
              Module {prerequisite.number}: {prerequisite.title}
            </Link>
          ) : (
            <Link href="/diagnostic">
              Foundation placement studio and learning brief
            </Link>
          )}
        </div>
      ) : null}
      <div className="sequence-pair">
        {courseModule.previousSlug ? (
          <ModuleLink direction="previous" slug={courseModule.previousSlug} />
        ) : (
          <Link className="sequence-link sequence-previous" href="/modules">
            <span>Previous</span>
            <strong>← Course library</strong>
          </Link>
        )}
        {courseModule.nextSlug ? (
          <ModuleLink direction="next" slug={courseModule.nextSlug} />
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
