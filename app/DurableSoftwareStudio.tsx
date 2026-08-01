"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import styles from "./DurableSoftwareStudio.module.css";

export type DurableSoftwareStudioMode =
  | "dependency-direction"
  | "specification-trace";

type Confidence = "low" | "medium" | "high";

type StudioStep = Readonly<{
  label: string;
  title: string;
  pressure: string;
  model: string;
  evidence: string;
}>;

type PredictionOption = Readonly<{
  id: string;
  text: string;
  repair: string;
}>;

type StudioSpec = Readonly<{
  eyebrow: string;
  title: string;
  lead: string;
  invariant: string;
  traceLabel: string;
  trace: string;
  steps: readonly StudioStep[];
  prompt: string;
  options: readonly PredictionOption[];
  intendedOptionId: string;
  changedPremise: string;
  transfer: string;
  whiteboard: string;
}>;

const studioSpecs: Record<DurableSoftwareStudioMode, StudioSpec> = {
  "dependency-direction": {
    eyebrow: "Module 12 · interactive architecture trace",
    title: "Dependency direction workbench",
    lead:
      "Start with the pressure of a concrete dependency, then separate the public promise, the port that expresses it, and the composition root that chooses an implementation.",
    invariant:
      "Domain and application policy never import a concrete plugin or deployment choice; the outer composition root owns that choice.",
    traceLabel: "Scrollable dependency-direction trace",
    trace: `# application/import_events.py\nfrom atlas.domain import Event\nfrom atlas.ports import EventImporter\n\n# composition root: concrete choice is made here\nfrom atlas.plugins.csv_importer import CsvImporter\n\nimporter: EventImporter = CsvImporter()\nrun_import(importer)`,
    steps: [
      {
        label: "Map",
        title: "Name the pressure before drawing layers",
        pressure:
          "Callers import CSV parsing, selection rules, and storage details directly, so one file-format change spreads through unrelated code.",
        model:
          "Separate stable domain meaning from a narrow importer port and a volatile concrete adapter.",
        evidence:
          "A dependency sketch, one stated public contract, and an import trace that names who chooses the concrete implementation.",
      },
      {
        label: "Trace",
        title: "Follow knowledge, not filenames",
        pressure:
          "A Protocol may be declared in a domain file while a concrete plugin still leaks inward through imports.",
        model:
          "Ask which module knows a concrete choice, which one only knows behavior, and where the dependency arrow points.",
        evidence:
          "A line-by-line import reading that distinguishes type shape, runtime object, registration policy, and composition.",
      },
      {
        label: "Decide",
        title: "Keep the next change reversible",
        pressure:
          "A new plugin, version rule, or deployment target can make a plausible shortcut become a graph-wide coupling defect.",
        model:
          "Move the choice outward, preserve observable behavior, and write the smallest contract regression that exposes drift.",
        evidence:
          "A bounded patch brief, a changed-premise test, and a statement of what the Protocol does not prove about trust.",
      },
    ],
    prompt:
      "A new CSV importer is needed. Which change preserves the dependency-direction invariant before any code is generated?",
    options: [
      {
        id: "domain-imports-plugin",
        text: "Import CsvImporter inside the domain policy so selection is close to the business rule.",
        repair:
          "The business rule has now learned a concrete deployment choice. Keep the domain dependent on the behavioral port instead.",
      },
      {
        id: "protocol-selects-plugin",
        text: "Put plugin discovery and selection inside the Protocol so every caller gets the same implementation.",
        repair:
          "A Protocol describes required behavior; it does not own discovery, trust, or selection policy.",
      },
      {
        id: "composition-root-selects",
        text: "Keep the domain and application code dependent on EventImporter; let the composition root select and validate CsvImporter.",
        repair:
          "This keeps concrete choice at the outer boundary while retaining a reviewable runtime-validation and selection policy.",
      },
      {
        id: "any-bypasses-boundary",
        text: "Annotate the importer as Any so the dependency direction no longer matters to the type checker.",
        repair:
          "Removing a static warning does not remove the runtime dependency or restore a missing ownership boundary.",
      },
    ],
    intendedOptionId: "composition-root-selects",
    changedPremise:
      "Changed premise: the importer comes from an untrusted third party. The port still limits what the application depends on, but acceptance now also needs a trust policy, runtime validation, and bounded execution assumptions.",
    transfer:
      "Transfer to M13: write the observable contract that a second importer must satisfy before its implementation details or generated tests count as evidence.",
    whiteboard:
      "Whiteboard move: draw `domain ← port ← adapter ← composition root`, then label one observation each layer promises and one choice it must not own. If arrows are unclear, use the ASCII chain shown here before discussing a diagram.",
  },
  "specification-trace": {
    eyebrow: "Module 13 · interactive evidence trace",
    title: "Specification and debugging workbench",
    lead:
      "Turn a vague failure report into a contract, a finite evidence plan, and a causal explanation. A green test is useful only when its claim stays visible.",
    invariant:
      "Each observed import attempt has one run identity, explicit failure semantics, and deliberately bounded signals; a traceback or coverage number never becomes the entire explanation.",
    traceLabel: "Scrollable specification and debugging trace",
    trace: `run_id = "atlas-42"\nresult = importer.read(source)\n\n# required terminal signal\nImportSignal(\n    run_id=run_id,\n    outcome="rejected",\n    reason="duplicate-event-id",\n)\n\n# a traceback may locate detection,\n# but the causal defect can precede it`,
    steps: [
      {
        label: "Specify",
        title: "Convert ambiguity into an observable promise",
        pressure:
          "Two providers have the same method names but disagree about partial rows, duplicate identities, and failure signals.",
        model:
          "State preconditions, result/failure alternatives, invariants, privacy limits, and which observations callers may rely on.",
        evidence:
          "A compact contract table that names partitions and the exact terminal outcomes instead of a test-count target.",
      },
      {
        label: "Probe",
        title: "Make finite evidence discriminate models",
        pressure:
          "A happy-path test and 100% line coverage can both miss a wrong failure boundary.",
        model:
          "Choose a minimal reproducer, a contract test, a regression, and a bounded signal trace; each one makes a narrower claim.",
        evidence:
          "A test matrix linking input partition, expected observation, missing alternative explanation, and privacy boundary.",
      },
      {
        label: "Repair",
        title: "Fix the earliest responsible boundary",
        pressure:
          "The traceback points at serialization after an earlier mutation already made the state incoherent.",
        model:
          "Maintain competing hypotheses, change one premise, and repair the first owner that can preserve the contract.",
        evidence:
          "A causal trace, one counterexample, a regression that would fail before the repair, and an explicit remaining uncertainty.",
      },
    ],
    prompt:
      "An importer rejects a duplicate event after emitting a success-looking progress update. What is the strongest next move?",
    options: [
      {
        id: "coverage-first",
        text: "Add tests until coverage reaches 100%, then treat the duplicate rejection as an edge case.",
        repair:
          "Coverage records execution, not the intended failure semantics or whether an earlier signal made a false claim.",
      },
      {
        id: "traceback-is-cause",
        text: "Patch the serializer named in the traceback because the traceback identifies the cause.",
        repair:
          "The traceback identifies where detection surfaced. Preserve the evidence and trace backward to the earliest owner of the inconsistent state.",
      },
      {
        id: "contract-and-causal-trace",
        text: "State the terminal-signal contract, reproduce the duplicate path, trace the earlier success claim, then add a regression at the responsible boundary.",
        repair:
          "This separates detection from cause and makes the repaired observation checkable without claiming universal correctness.",
      },
      {
        id: "hide-progress",
        text: "Suppress all progress signals so no signal can become misleading.",
        repair:
          "Silence removes useful observability. Keep a bounded, truthful vocabulary with explicit provisional versus terminal meaning.",
      },
    ],
    intendedOptionId: "contract-and-causal-trace",
    changedPremise:
      "Changed premise: the duplicate arrives after a remote retry. The same causal method applies, but the evidence plan must now separate local acknowledgement, remote observation, idempotency policy, and uncertain completion rather than implying one atomic action.",
    transfer:
      "Transfer to M14: decide which responsibility should own the failure policy so a future architecture change does not reintroduce the same misleading signal.",
    whiteboard:
      "Whiteboard move: write `claim → input partition → observation → competing cause → smallest discriminating test`. Define each term aloud and keep the same ASCII chain in the visible chat if rich rendering is unavailable.",
  },
};

const confidenceOptions: readonly Readonly<{ id: Confidence; label: string }> [] = [
  { id: "low", label: "Low confidence" },
  { id: "medium", label: "Medium confidence" },
  { id: "high", label: "High confidence" },
];

function panelId(baseId: string, index: number) {
  return `${baseId}-panel-${index}`;
}

function tabId(baseId: string, index: number) {
  return `${baseId}-tab-${index}`;
}

export function DurableSoftwareStudio({ mode }: Readonly<{ mode: DurableSoftwareStudioMode }>) {
  const spec = studioSpecs[mode];
  const rawId = useId();
  const baseId = `durable-${mode}-${rawId.replaceAll(":", "")}`;
  const [activeStep, setActiveStep] = useState(0);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [revealed, setRevealed] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const chosenOption = spec.options.find(({ id }) => id === prediction) ?? null;
  const preservesInvariant = chosenOption?.id === spec.intendedOptionId;
  const revealReady = prediction !== null && confidence !== null;

  function choosePrediction(optionId: string) {
    setPrediction(optionId);
    setConfidence(null);
    setRevealed(false);
  }

  function chooseConfidence(nextConfidence: Confidence) {
    setConfidence(nextConfidence);
    setRevealed(false);
  }

  function handleTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (![
      "ArrowRight",
      "ArrowLeft",
      "Home",
      "End",
    ].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % spec.steps.length
        : event.key === "ArrowLeft"
          ? (index - 1 + spec.steps.length) % spec.steps.length
          : event.key === "Home"
            ? 0
            : spec.steps.length - 1;
    setActiveStep(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <article className={styles.studio} data-mode={mode} aria-labelledby={`${baseId}-title`}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{spec.eyebrow}</p>
        <h2 id={`${baseId}-title`}>{spec.title}</h2>
        <p className={styles.lead}>{spec.lead}</p>
        <p className={styles.invariant}>
          <strong>Governing invariant:</strong> {spec.invariant}
        </p>
      </header>

      <section className={styles.model} aria-labelledby={`${baseId}-model-title`}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>First-principles model</p>
          <h3 id={`${baseId}-model-title`}>Name the boundary before selecting a fix.</h3>
        </div>
        <div className={styles.tabs} role="tablist" aria-label={`${spec.title} reasoning views`}>
          {spec.steps.map((candidate, index) => (
            <button
              aria-controls={panelId(baseId, index)}
              aria-selected={activeStep === index}
              className={activeStep === index ? styles.tabActive : styles.tab}
              id={tabId(baseId, index)}
              key={candidate.label}
              onClick={() => setActiveStep(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              tabIndex={activeStep === index ? 0 : -1}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {candidate.label}
            </button>
          ))}
        </div>
        {spec.steps.map((candidate, index) => (
          <div
            aria-labelledby={tabId(baseId, index)}
            className={styles.panel}
            hidden={activeStep !== index}
            id={panelId(baseId, index)}
            key={candidate.label}
            role="tabpanel"
            tabIndex={activeStep === index ? 0 : -1}
          >
            <h4>{candidate.title}</h4>
            <dl className={styles.modelGrid}>
              <div>
                <dt>Pressure</dt>
                <dd>{candidate.pressure}</dd>
              </div>
              <div>
                <dt>Model</dt>
                <dd>{candidate.model}</dd>
              </div>
              <div>
                <dt>Evidence</dt>
                <dd>{candidate.evidence}</dd>
              </div>
            </dl>
          </div>
        ))}
      </section>

      <section className={styles.traceSection} aria-labelledby={`${baseId}-trace-title`}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>Read the trace</p>
          <h3 id={`${baseId}-trace-title`}>A small artifact is evidence, not a verdict.</h3>
        </div>
        <pre className={styles.trace} aria-label={spec.traceLabel} role="region" tabIndex={0}>
          <code>{spec.trace}</code>
        </pre>
      </section>

      <section className={styles.prediction} aria-labelledby={`${baseId}-prediction-title`}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>Prediction before reveal</p>
          <h3 id={`${baseId}-prediction-title`}>{spec.prompt}</h3>
        </div>
        <fieldset className={styles.optionFieldset}>
          <legend>Choose one proposed change.</legend>
          <div className={styles.optionGrid}>
            {spec.options.map((option) => (
              <label
                className={prediction === option.id ? styles.optionSelected : styles.option}
                key={option.id}
              >
                <input
                  checked={prediction === option.id}
                  name={`${baseId}-prediction`}
                  onChange={() => choosePrediction(option.id)}
                  type="radio"
                  value={option.id}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className={styles.confidence}>
          <legend>How confident are you in this prediction?</legend>
          {confidenceOptions.map((option) => (
            <label key={option.id}>
              <input
                checked={confidence === option.id}
                name={`${baseId}-confidence`}
                onChange={() => chooseConfidence(option.id)}
                type="radio"
                value={option.id}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
        <button
          className={styles.reveal}
          disabled={!revealReady}
          onClick={() => setRevealed(true)}
          type="button"
        >
          Reveal the boundary analysis
        </button>
        {!revealReady && (
          <p className={styles.gateNotice} aria-live="polite">
            Choose one approach and a confidence level before reveal.
          </p>
        )}
        {revealed && chosenOption && (
          <section className={styles.analysis} aria-live="polite" aria-labelledby={`${baseId}-analysis-title`}>
            <p className={styles.kicker}>Model comparison</p>
            <h3 id={`${baseId}-analysis-title`}>
              {preservesInvariant
                ? "Your prediction preserves the stated boundary."
                : "This prediction exposes a tempting boundary collapse."}
            </h3>
            <p>{chosenOption.repair}</p>
            <p>
              <strong>Changed premise:</strong> {spec.changedPremise}
            </p>
            <p>
              <strong>Transfer:</strong> {spec.transfer}
            </p>
            <p>
              <strong>Reflection:</strong> Record the claim you now trust, the evidence that supports it, one remaining uncertainty, and the next smallest observation that would change your mind. This is learner-controlled evidence, not a score or completion decision.
            </p>
          </section>
        )}
      </section>

      <aside className={styles.whiteboard} aria-label="Accessible whiteboard route">
        <p className={styles.kicker}>Live-chat whiteboard route</p>
        <p>{spec.whiteboard}</p>
      </aside>
    </article>
  );
}
