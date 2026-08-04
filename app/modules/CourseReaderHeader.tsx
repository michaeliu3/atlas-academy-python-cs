import Link from "next/link";

type CourseReaderHeaderProps = {
  current?: "diagnostic" | "library" | "module" | "partners" | "route";
};

export function CourseReaderHeader({ current }: CourseReaderHeaderProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="reader-site-header">
        <Link
          aria-label="Atlas Academy home"
          className="reader-brand"
          href="/"
        >
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <span>
            <strong>Atlas Academy</strong>
            <small>Python & computer science</small>
          </span>
        </Link>
        <nav aria-label="Primary course navigation">
          <Link href="/">Interactive explorer</Link>
          <Link
            aria-current={current === "route" ? "page" : undefined}
            href="/route"
          >
            60-day route
          </Link>
          <Link
            aria-current={current === "diagnostic" ? "page" : undefined}
            href="/diagnostic"
          >
            Diagnostic
          </Link>
          <Link
            aria-current={current === "library" ? "page" : undefined}
            href="/modules"
          >
            Lecture notes
          </Link>
          <Link
            aria-current={current === "partners" ? "page" : undefined}
            href="/learning-partners"
          >
            Learning partners
          </Link>
        </nav>
      </header>
    </>
  );
}
