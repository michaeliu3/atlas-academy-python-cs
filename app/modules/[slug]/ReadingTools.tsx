"use client";

import { useCallback, useEffect, useState } from "react";

const readerScales = [0.9, 1, 1.1, 1.2] as const;

type ReadingToolsProps = {
  articleId: string;
};

export function ReadingTools({ articleId }: ReadingToolsProps) {
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState<number>(1);

  const applyScale = useCallback(
    (nextScale: number) => {
      const article = document.getElementById(articleId);
      article?.style.setProperty("--reader-scale", String(nextScale));
      setScale(nextScale);
    },
    [articleId],
  );

  useEffect(() => {
    let animationFrame = 0;

    const measure = () => {
      animationFrame = 0;
      const article = document.getElementById(articleId);
      if (!article) {
        return;
      }
      const rect = article.getBoundingClientRect();
      const readableDistance = Math.max(article.offsetHeight - window.innerHeight, 1);
      const distanceRead = Math.min(Math.max(120 - rect.top, 0), readableDistance);
      setProgress(Math.round((distanceRead / readableDistance) * 100));
    };

    const scheduleMeasure = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    return () => {
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [articleId]);

  const scaleIndex = readerScales.findIndex((candidate) => candidate === scale);

  return (
    <div className="reading-tools">
      <div
        className="reading-progress"
        role="progressbar"
        aria-label="Lesson reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={`${progress}% of the lesson read`}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <div
        className="reading-tools-inner"
        role="toolbar"
        aria-label="Reading preferences"
      >
        <span className="reading-progress-label" aria-hidden="true">
          {progress}% read
        </span>
        <span className="reading-tool-divider" aria-hidden="true" />
        <span className="font-tool-label">Lesson text</span>
        <button
          aria-label="Decrease lesson text size"
          aria-controls={articleId}
          disabled={scaleIndex <= 0}
          onClick={() => applyScale(readerScales[Math.max(0, scaleIndex - 1)])}
          type="button"
        >
          A−
        </button>
        <button
          aria-label="Reset lesson text size"
          aria-controls={articleId}
          aria-pressed={scale === 1}
          onClick={() => applyScale(1)}
          type="button"
        >
          A
        </button>
        <button
          aria-label="Increase lesson text size"
          aria-controls={articleId}
          disabled={scaleIndex >= readerScales.length - 1}
          onClick={() =>
            applyScale(
              readerScales[Math.min(readerScales.length - 1, scaleIndex + 1)],
            )
          }
          type="button"
        >
          A+
        </button>
        <span className="reader-scale-status" aria-live="polite">
          {Math.round(scale * 100)}%
        </span>
      </div>
    </div>
  );
}
