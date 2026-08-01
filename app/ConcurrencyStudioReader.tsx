"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ConcurrencyObservatory = dynamic(
  () =>
    import("@/app/ConcurrencyStudio").then(({ ConcurrencyStudio }) => ({
      default: ConcurrencyStudio,
    })),
  {
    loading: () => (
      <section aria-busy="true" aria-live="polite" className="module-studio-loading">
        <p className="kicker">Concurrency observatory</p>
        <p>Loading the six-view interactive laboratory…</p>
      </section>
    ),
  },
);

/**
 * The reader deliberately defers this unusually large optional laboratory
 * until the learner chooses to enter it. The workbook and Arc IV orientation
 * remain immediately readable; the full studio stays a direct, named module
 * interaction without loading or rendering before that explicit choice.
 */
export function ConcurrencyStudioReader() {
  const [hasLaunched, setHasLaunched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      aria-labelledby="concurrency-reader-launch-title"
      className="module-interaction-route"
    >
      <p className="kicker">Interactive studio · optional, direct, and local-first</p>
      <h2 id="concurrency-reader-launch-title">Enter the concurrency observatory when you are ready to test a claim.</h2>
      <p id="concurrency-reader-launch-description">
        The workbook gives the argument first. This six-view laboratory then lets
        you predict a history, inspect bounded evidence, and revise your
        reasoning without recording a completion claim.
      </p>
      <button
        aria-controls="concurrency-observatory-panel"
        aria-describedby="concurrency-reader-launch-description"
        aria-expanded={isOpen}
        className="primary-action"
        onClick={() => {
          setHasLaunched(true);
          setIsOpen((current) => !current);
        }}
        type="button"
      >
        {isOpen
          ? "Hide the concurrency observatory"
          : "Open the concurrency observatory"}
      </button>
      <div hidden={!isOpen} id="concurrency-observatory-panel">
        {hasLaunched ? <ConcurrencyObservatory /> : null}
      </div>
    </section>
  );
}
