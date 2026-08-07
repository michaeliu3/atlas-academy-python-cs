"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const readerScales = [0.9, 1, 1.1, 1.2] as const;

/**
 * A text-size choice is a reading accommodation, not a per-page preference.
 * The control used to reset to 100% every time the learner opened another
 * module, so anyone who needed larger type had to set it again at each step.
 *
 * The preference is held in module scope rather than in browser storage. That
 * is deliberate: `content/course/browser-progress-surfaces.v1.json` governs
 * every localStorage key as a *learner-progress record* with an owning module,
 * a codec, and an allowlisted data class, and a reading accommodation is none
 * of those things. Module scope survives client-side navigation between
 * modules, which is the reset the learner actually experienced, without
 * putting an ungoverned key in browser storage.
 *
 * The cost is honest and bounded: the choice does not survive a full page
 * reload. Making it durable needs a policy decision about whether that
 * contract should cover interface preferences at all.
 *
 * It is read through `useSyncExternalStore` because it is exactly that — an
 * external store. A `useState` initialiser would desynchronise hydration, and
 * restoring through `setState` inside an effect causes a cascading render.
 */
let sessionReaderScale = 1;
const readerScaleListeners = new Set<() => void>();

function currentReaderScale(): number {
  return sessionReaderScale;
}

function serverReaderScale(): number {
  return 1;
}

function subscribeToReaderScale(onStoreChange: () => void) {
  readerScaleListeners.add(onStoreChange);
  return () => {
    readerScaleListeners.delete(onStoreChange);
  };
}

function writeReaderScale(nextScale: number) {
  sessionReaderScale = nextScale;
  for (const listener of readerScaleListeners) {
    listener();
  }
}

type ReadingToolsProps = {
  articleId: string;
};

export function ReadingTools({ articleId }: ReadingToolsProps) {
  const [progress, setProgress] = useState(0);
  const scale = useSyncExternalStore(subscribeToReaderScale, currentReaderScale, serverReaderScale);

  const applyScale = useCallback((nextScale: number) => {
    writeReaderScale(nextScale);
  }, []);

  // Push the current scale onto the article. This updates an external system
  // from React state, which is what an effect is for; it sets no state itself.
  useEffect(() => {
    document.getElementById(articleId)?.style.setProperty("--reader-scale", String(scale));
  }, [articleId, scale]);

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
