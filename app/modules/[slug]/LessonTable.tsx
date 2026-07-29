"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type LessonTableProps = {
  children: ReactNode;
};

export function LessonTable({ children }: LessonTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollRegionLabel, setScrollRegionLabel] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateOverflowState = () => {
      const isScrollable = container.scrollWidth > container.clientWidth + 1;
      if (!isScrollable) {
        setScrollRegionLabel(null);
        return;
      }

      const firstHeader = container.querySelector("th")?.textContent?.trim();
      setScrollRegionLabel(
        firstHeader
          ? `Scrollable lesson table beginning with ${firstHeader}`
          : "Scrollable lesson table",
      );
    };

    updateOverflowState();
    const observer = new ResizeObserver(updateOverflowState);
    observer.observe(container);
    const table = container.querySelector("table");
    if (table) {
      observer.observe(table);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-label={scrollRegionLabel ?? undefined}
      className="lesson-table-scroll"
      ref={containerRef}
      role={scrollRegionLabel ? "region" : undefined}
      tabIndex={scrollRegionLabel ? 0 : undefined}
    >
      <table>{children}</table>
    </div>
  );
}
