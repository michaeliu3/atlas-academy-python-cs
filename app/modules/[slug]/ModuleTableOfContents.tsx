"use client";

import { useEffect, useState } from "react";
import type { TableOfContentsItem } from "@/lib/module-catalog";

type ModuleTableOfContentsProps = {
  headings: TableOfContentsItem[];
};

function ContentsLinks({
  activeId,
  headings,
}: ModuleTableOfContentsProps & { activeId: string }) {
  return (
    <ol>
      {headings.map((heading) => (
        <li className={`toc-depth-${heading.depth}`} key={heading.id}>
          <a
            aria-current={activeId === heading.id ? "location" : undefined}
            href={`#${heading.id}`}
          >
            {heading.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function ModuleTableOfContents({
  headings,
}: ModuleTableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const observedHeadings = headings
      .map(({ id }) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.target.getBoundingClientRect().top -
              right.target.getBoundingClientRect().top,
          );
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-18% 0px -72% 0px", threshold: [0, 1] },
    );

    observedHeadings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <>
      <nav className="desktop-module-toc" aria-label="Module sections">
        <p>On this page</p>
        <ContentsLinks activeId={activeId} headings={headings} />
      </nav>
      <details className="mobile-module-toc">
        <summary>On this page · {headings.length} sections</summary>
        <nav aria-label="Module sections">
          <ContentsLinks activeId={activeId} headings={headings} />
        </nav>
      </details>
    </>
  );
}
