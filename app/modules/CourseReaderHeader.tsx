import Link from "next/link";

type CourseReaderHeaderProps = {
  current?: "library" | "module";
};

export function CourseReaderHeader({ current }: CourseReaderHeaderProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to lesson content
      </a>
      <header className="reader-site-header">
        <Link className="reader-brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <span>
            <strong>Atlas Academy</strong>
            <small>Python & computer science</small>
          </span>
        </Link>
        <nav aria-label="Primary course navigation">
          <Link href="/">Learning path</Link>
          <Link
            aria-current={current === "library" ? "page" : undefined}
            href="/modules"
          >
            Course library
          </Link>
        </nav>
      </header>
    </>
  );
}
