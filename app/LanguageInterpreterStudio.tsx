"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  hasModule23MeaningfulProgress,
  MODULE23_LEGACY_PROGRESS_STORAGE_KEY,
  MODULE23_PROGRESS_STORAGE_KEY,
  module23ProgressCodec,
  parseModule23LegacyProgress,
} from "@/lib/module23-progress-codec";
import styles from "./LanguageInterpreterStudio.module.css";

type InterpreterView =
  | "boundary"
  | "grammar"
  | "environment"
  | "semantics"
  | "contract"
  | "bridge";
type Confidence = 1 | 2 | 3 | 4;
type ViewRecord = {
  choice: string | null;
  confidence: Confidence | null;
  revealed: boolean;
};
type StudioRecord = Record<InterpreterView, ViewRecord>;

const CORE_RULE =
  "Structure is data; authority is separate and explicit. A successful parse establishes only the declared grammar shape. Atlas checks a bounded contract, resource budget, and authorization decision before a fixed-scope capability can support one local model operation. The evaluator has no ambient Python authority.";

const views: ReadonlyArray<{
  id: InterpreterView;
  number: string;
  label: string;
  question: string;
}> = [
  {
    id: "boundary",
    number: "01",
    label: "Text → tree",
    question: "What did parsing establish?",
  },
  {
    id: "grammar",
    number: "02",
    label: "Tokens → tree",
    question: "Which structure carries precedence?",
  },
  {
    id: "environment",
    number: "03",
    label: "Names → closure",
    question: "Where does a free name look?",
  },
  {
    id: "semantics",
    number: "04",
    label: "Tree → meaning",
    question: "Which rule selects the next step?",
  },
  {
    id: "contract",
    number: "05",
    label: "Contract → capability",
    question: "Which boundary rejects first?",
  },
  {
    id: "bridge",
    number: "06",
    label: "Source → observation",
    question: "What does CPython evidence support?",
  },
];

const boundaryStages = [
  {
    id: "input",
    number: "01",
    label: "bounded text",
    evidence: "[INPUT DATA]",
    establishes: "A short source representation arrived under a declared length policy.",
    doesNot: "It is not Python code, a request permission, a host name, or a capability.",
  },
  {
    id: "tokens",
    number: "02",
    label: "tokens",
    evidence: "[LEXICAL STRUCTURE]",
    establishes: "A bounded scanner recognized characters in the tiny language vocabulary.",
    doesNot: "Tokens do not establish a complete tree, schema meaning, or authority.",
  },
  {
    id: "tree",
    number: "03",
    label: "query AST",
    evidence: "[SYNTAX ONLY]",
    establishes: "The grammar recognized an arrangement of tokens and produced a tree.",
    doesNot: "A parse result does not make the request true, permitted, or runnable Python.",
  },
  {
    id: "contract",
    number: "04",
    label: "semantic contract",
    evidence: "[CONTRACT CHECKED]",
    establishes: "The fixed vocabulary, types, and local resource budget match this teaching model.",
    doesNot: "A contract is not the Module 22 authorization decision.",
  },
  {
    id: "decision",
    number: "05",
    label: "policy decision",
    evidence: "[AUTHORIZED]",
    establishes: "One named local subject/action/resource/tenant/purpose tuple was permitted.",
    doesNot: "This does not confer a blanket capability or choose an adapter from source text.",
  },
  {
    id: "capability",
    number: "06",
    label: "fixed reader",
    evidence: "[NARROW CAPABILITY]",
    establishes: "A pre-minted, fixed-scope fixture reader is available to this evaluator path.",
    doesNot: "It is not a database connection, host globals dictionary, or arbitrary callable.",
  },
  {
    id: "result",
    number: "07",
    label: "redacted result",
    evidence: "[LOCAL OBSERVATION]",
    establishes: "The deterministic course model returned a bounded labelled outcome.",
    doesNot: "It does not prove that a remote service read data or that a production boundary is secure.",
  },
] as const;

const grammarCases = [
  {
    id: "lexical",
    label: "unknown character",
    source: "1 + @ 3",
    outcome: "LEXICAL_REJECTED · span 5",
    explanation: "`@` is not in Pebble’s small token vocabulary. No AST exists yet.",
  },
  {
    id: "parse",
    label: "unfinished expression",
    source: "1 +",
    outcome: "PARSE_REJECTED · expected expression",
    explanation: "The lexer can emit tokens, but the grammar cannot complete an expression tree.",
  },
  {
    id: "allowlist",
    label: "unpermitted AST form",
    source: "Call(get_metric, score)",
    outcome: "AST_ALLOWLIST_REJECTED",
    explanation: "This is a fixed conceptual AST card, not an Atlas Query input. Arbitrary calls are intentionally absent from the Atlas evaluator.",
  },
] as const;

const closureSteps = [
  {
    id: "bind",
    label: "bind outer threshold",
    frame: "E₀",
    detail: "`threshold = 70` enters E₀, the outer lexical environment.",
  },
  {
    id: "create",
    label: "create function value",
    frame: "E₁",
    detail: "`judge` carries parameter `score`, body `score >= threshold`, and a parent pointer to E₀.",
  },
  {
    id: "shadow",
    label: "shadow at caller site",
    frame: "E₂",
    detail: "A later `threshold = 90` is visible in E₂, but it is not the lexical parent captured by `judge`.",
  },
  {
    id: "apply",
    label: "apply judge to 80",
    frame: "E₃",
    detail: "`score` resolves in E₃; free `threshold` follows the closure’s parent E₀, so the comparison is `80 >= 70`.",
  },
] as const;

const semanticModes = [
  {
    id: "eager",
    label: "call-by-value",
    title: "Evaluate a call’s parts left to right before application.",
    source: "add(2, 3)",
    trace: [
      ["[span 1–3]", "resolve `add`", "fixed Pebble value"],
      ["[span 5]", "evaluate left argument", "2"],
      ["[span 8]", "evaluate right argument", "3"],
      ["[span 1–9]", "apply function value", "5"],
    ],
    note: "The left-to-right order is a declared Pebble rule. A tree alone does not select it.",
  },
  {
    id: "conditional",
    label: "if selection",
    title: "Evaluate the test, then evaluate exactly one branch.",
    source: "if true then 7 else missing",
    trace: [
      ["[span 4–7]", "evaluate test", "true"],
      ["[span 1–28]", "select then branch", "else branch not entered"],
      ["[span 14]", "evaluate selected branch", "7"],
      ["[span 21–27]", "lookup `missing`", "not performed"],
    ],
    note: "Conditional selection is a semantic rule. The unselected branch can contain an unresolved name without producing an error in this trace.",
  },
  {
    id: "shortCircuit",
    label: "short circuit",
    title: "Evaluate the first Boolean operand, then decide whether the second is needed.",
    source: "false and missing",
    trace: [
      ["[span 1–5]", "evaluate left operand", "false"],
      ["[span 1–17]", "apply `and` rule", "stop: false already determines result"],
      ["[span 11–17]", "lookup `missing`", "not performed"],
      ["[span 1–17]", "produce value", "false"],
    ],
    note: "Short-circuiting is not eager evaluation with a faster implementation; it is a specified meaning rule for this form.",
  },
] as const;

const contractFixtures = [
  {
    id: "lex",
    label: "unknown character",
    source: 'count(where cohort = "atlas" @)',
    stage: "lexical scan",
    kind: "model",
    scenario: "lexical_rejection",
    status: "LEX_ERROR",
    reason: "The at-sign is outside the declared Atlas Query token vocabulary. The fixed local model redacts its zero-based failure span as [29, 30).",
  },
  {
    id: "syntax",
    label: "unfinished filter",
    source: 'count(where cohort = "atlas"',
    stage: "grammar",
    kind: "model",
    scenario: "syntax_rejection",
    status: "PARSE_ERROR",
    reason: "The fixed local model reaches syntax-only parsing, then reports that the closing parenthesis after the filter is missing.",
  },
  {
    id: "form",
    label: "host-style call node",
    source: "Call(open_fixture, cohort)",
    stage: "conceptual boundary",
    kind: "conceptual",
    scenario: "not a model packet",
    status: "NOT AN ATLAS QUERY INPUT",
    reason: "This fixed code-reading contrast is not a local evidence packet. Atlas Query text cannot name a host callable, adapter, or Python AST node.",
  },
  {
    id: "contract",
    label: "unknown schema field",
    source: "count(where unknown_field = 3)",
    stage: "schema + contract",
    kind: "model",
    scenario: "contract_rejection",
    status: "CONTRACT_ERROR",
    reason: "The grammar accepts the comparison shape, but the fixed local model rejects unknown_field as outside its declared schema.",
  },
  {
    id: "budget",
    label: "declared fuel exhausted",
    source: 'count(where cohort = "atlas")',
    stage: "resource budget",
    kind: "model",
    scenario: "fuel_exhausted",
    status: "FUEL_EXHAUSTED",
    reason: "The fixed local model exhausts its declared fuel before scanning a fixture. This is not a claim about a real-service CPU budget.",
  },
  {
    id: "authority",
    label: "policy tuple denied",
    source: 'count(where cohort = "atlas")',
    stage: "M22 authorization",
    kind: "model",
    scenario: "authorization_denial",
    status: "DENIED_AUTHORIZATION",
    reason: "The supplied local subject/action/resource/tenant/purpose tuple is outside the fixed policy, so no read capability is minted.",
  },
  {
    id: "result",
    label: "bounded local success",
    source: 'count(where cohort = "atlas")',
    stage: "fixed capability + evaluator",
    kind: "model",
    scenario: "successful_count",
    status: "RESULT · count = 2",
    reason: "The fixed-scope local reader supports a deterministic scalar aggregate over two in-scope synthetic Atlas records with redacted evidence.",
  },
] as const;

const bridgeCards = [
  {
    id: "source",
    label: "trusted bundled source",
    content: "def increment(value):\n    return value + 1",
    detail: "This tiny source is bundled by the course. It is not supplied by an Atlas Query learner or sent through the bounded evaluator.",
  },
  {
    id: "ast",
    label: "AST observation",
    content: "Module(FunctionDef → Return(BinOp(Name + Constant)))",
    detail: "A trusted-source `ast` view describes a Python structure. It is not a complete scoping check, an authorization decision, or a security boundary.",
  },
  {
    id: "code",
    label: "compile / code-object idea",
    content: "trusted source → compiler pipeline → code object",
    detail: "The code-object concept connects language source to a CPython implementation route. Details belong to version-labelled observation and Module 24 measurement.",
  },
  {
    id: "dis",
    label: "illustrative opcode-name card",
    content: "[illustrative opcode names — not captured `dis` output]\nRESUME · LOAD_FAST · LOAD_CONST · BINARY_OP · RETURN_VALUE",
    detail: "This fixed conceptual opcode-name list is not a captured disassembly. An actual listing is evidence only about the local Python implementation/version that produced it, not language law.",
  },
] as const;

type BoundaryStageId = (typeof boundaryStages)[number]["id"];
type GrammarCaseId = (typeof grammarCases)[number]["id"];
type SemanticModeId = (typeof semanticModes)[number]["id"];
type ContractFixtureId = (typeof contractFixtures)[number]["id"];
type BridgeCardId = (typeof bridgeCards)[number]["id"];

function emptyRecord(): StudioRecord {
  return {
    boundary: { choice: null, confidence: null, revealed: false },
    grammar: { choice: null, confidence: null, revealed: false },
    environment: { choice: null, confidence: null, revealed: false },
    semantics: { choice: null, confidence: null, revealed: false },
    contract: { choice: null, confidence: null, revealed: false },
    bridge: { choice: null, confidence: null, revealed: false },
  };
}

function tabId(view: InterpreterView) {
  return `language-interpreter-tab-${view}`;
}

function panelId(view: InterpreterView) {
  return `language-interpreter-panel-${view}`;
}

function clearStoredStudio() {
  try {
    window.localStorage.removeItem(MODULE23_PROGRESS_STORAGE_KEY);
    window.localStorage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
  } catch {
    // Local progress is optional; the learning studio stays useful without it.
  }
}

function EvidenceLock() {
  return (
    <p className={styles.evidenceLock}>
      Commit an answer and confidence before the explanation appears. The goal
      is calibration and transfer—not a surprise score.
    </p>
  );
}

type PredictionGateProps = {
  id: InterpreterView;
  prompt: string;
  choices: ReadonlyArray<{ id: string; label: string }>;
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
};

function PredictionGate({
  id,
  prompt,
  choices,
  record,
  onChange,
}: PredictionGateProps) {
  const ready = record.choice !== null && record.confidence !== null;

  return (
    <section className={styles.predictionGate} aria-label={`${id} prediction checkpoint`}>
      <div className={styles.gateHeading}>
        <span>Prediction checkpoint</span>
        <p>{prompt}</p>
      </div>
      <fieldset>
        <legend>Choose the strongest explanation</legend>
        <div className={styles.choiceGrid}>
          {choices.map((choice) => (
            <label key={choice.id}>
              <input
                checked={record.choice === choice.id}
                name={`${id}-prediction`}
                onChange={() => onChange({ choice: choice.id, revealed: false })}
                type="radio"
                value={choice.id}
              />
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>How confident are you?</legend>
        <div className={styles.confidenceScale}>
          {([1, 2, 3, 4] as const).map((confidence) => (
            <label key={confidence}>
              <input
                checked={record.confidence === confidence}
                name={`${id}-confidence`}
                onChange={() => onChange({ confidence, revealed: false })}
                type="radio"
                value={confidence}
              />
              <span>
                <strong>{confidence}</strong>
                <small>
                  {confidence === 1
                    ? "guess"
                    : confidence === 2
                      ? "partial"
                      : confidence === 3
                        ? "defensible"
                        : "teach it"}
                </small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <button
        className={styles.revealButton}
        disabled={!ready}
        onClick={() => onChange({ revealed: true })}
        type="button"
      >
        {record.revealed ? "Review the evidence" : "Commit prediction & reveal evidence"}
      </button>
      {!record.revealed && <EvidenceLock />}
    </section>
  );
}

function InvariantPlate() {
  return (
    <aside className={styles.invariantPlate}>
      <span>Module 23 working invariant</span>
      <p>{CORE_RULE}</p>
      <small>
        Every arrow is read with four questions: what representation crossed,
        what meaning is established, what authority crossed, and what resource
        promise was checked?
      </small>
    </aside>
  );
}

function BoundaryLab({
  record,
  onChange,
  stageId,
  onStageChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  stageId: BoundaryStageId;
  onStageChange: (next: BoundaryStageId) => void;
}) {
  const stage = boundaryStages.find((item) => item.id === stageId) ?? boundaryStages[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "syntax", label: "Only that the text matches the declared grammar shape; contract, authorization, and capability decisions remain." },
          { id: "permission", label: "That Atlas may now read the requested learning data." },
          { id: "execution", label: "That the text is safe Python code to compile and run." },
        ]}
        id="boundary"
        onChange={onChange}
        prompt="An Atlas Query string tokenizes and parses. What is the strongest conclusion?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>TEXT-TO-TREE BOUNDARY ATLAS</span>
            <h3>Parsing gives shape—not permission, truth, or execution.</h3>
          </div>
          <p>
            Choose one card to inspect the exact claim it earns. The trail stays
            intentionally narrow: externally supplied text never becomes Python
            source and never selects an adapter.
          </p>
          <div className={styles.boundaryRail} aria-label="Text to tree boundary traversal">
            {boundaryStages.map((item, index) => (
              <div key={item.id}>
                <button
                  aria-pressed={stageId === item.id}
                  onClick={() => onStageChange(item.id)}
                  type="button"
                >
                  <span>{item.number}</span>
                  <strong>{item.label}</strong>
                  <small>{item.evidence}</small>
                </button>
                {index < boundaryStages.length - 1 && <i aria-hidden="true">→</i>}
              </div>
            ))}
          </div>
          <div className={styles.inspectorCard}>
            <span>{stage.evidence}</span>
            <h4>{stage.label}</h4>
            <p>{stage.establishes}</p>
            <span className={styles.stopLabel}>does not establish</span>
            <p>{stage.doesNot}</p>
          </div>
          <div className={styles.textEquivalent}>
            <strong>Text equivalent</strong>
            Traverse left to right: bounded text → tokens → grammar-accepted
            tree → contract → named authorization → fixed reader → redacted
            local observation. The earlier cards remain data; none silently
            gains the authority described by a later card.
          </div>
        </section>
      )}
    </div>
  );
}

function GrammarLab({
  record,
  onChange,
  caseId,
  onCaseChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  caseId: GrammarCaseId;
  onCaseChange: (next: GrammarCaseId) => void;
}) {
  const grammarCase = grammarCases.find((item) => item.id === caseId) ?? grammarCases[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "multiply", label: "`+` is the root; its right child is `2 * 3`, so multiplication groups first." },
          { id: "add", label: "`*` is the root; its left child is `1 + 2`, so addition groups first." },
          { id: "flat", label: "The token sequence has no tree until an evaluator guesses a grouping." },
        ]}
        id="grammar"
        onChange={onChange}
        prompt="Which AST represents the fixed Pebble expression `1 + 2 * 3` under the declared precedence?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>LEXER, GRAMMAR & PRECEDENCE WORKBENCH</span>
            <h3>Characters, tokens, productions, and trees are different representations.</h3>
          </div>
          <div className={styles.grammarLayout}>
            <div className={styles.codeCard}>
              <span>fixed Pebble source</span>
              <code>1 + 2 * 3</code>
              <small>characters at source spans 1, 3, 5, 7, 9</small>
            </div>
            <div className={styles.tokenStrip} aria-label="Token sequence for 1 plus 2 times 3">
              <span>INT(1)</span><i aria-hidden="true">·</i><span>PLUS</span><i aria-hidden="true">·</i><span>INT(2)</span><i aria-hidden="true">·</i><span>STAR</span><i aria-hidden="true">·</i><span>INT(3)</span>
            </div>
            <div className={styles.productionCard}>
              <span>small grammar reading</span>
              <code>expr → sum</code>
              <code>{"sum → product (\"+\" product)*"}</code>
              <code>{"product → atom (\"*\" atom)*"}</code>
            </div>
            <div className={styles.astTree} aria-label="Abstract syntax tree: plus with 1 and multiplication of 2 and 3">
              <div className={styles.astRoot}>+</div>
              <div className={styles.astBranches}>
                <span>1</span>
                <div>
                  <strong>×</strong>
                  <p><span>2</span><span>3</span></p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.caseWorkbench}>
            <div className={styles.selectorList}>
              <span>Compare distinct failures</span>
              {grammarCases.map((item) => (
                <button
                  aria-pressed={caseId === item.id}
                  key={item.id}
                  onClick={() => onCaseChange(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className={styles.inspectorCard}>
              <span>fixed inspection card</span>
              <h4>{grammarCase.outcome}</h4>
              <code>{grammarCase.source}</code>
              <p>{grammarCase.explanation}</p>
            </div>
          </div>
          <aside className={styles.pythonObservation}>
            <span>Python-specific code-reading observation</span>
            <p>
              Python tokenization can emit <code>INDENT</code> and <code>DEDENT</code>
              for trusted Python source. That is useful implementation reading
              evidence, not a rule of Pebble or Atlas Query.
            </p>
            <code>if ready:\n    score = 1\n# NAME COLON NEWLINE INDENT NAME EQUAL NUMBER NEWLINE DEDENT</code>
          </aside>
          <div className={styles.textEquivalent}>
            <strong>Text equivalent</strong>
            The root of the tree is plus. Its left child is integer 1; its right
            child is multiplication with integers 2 and 3. The grammar, not an
            evaluator guess, supplies that grouping.
          </div>
        </section>
      )}
    </div>
  );
}

function EnvironmentLab({
  record,
  onChange,
  step,
  onStepChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  step: number;
  onStepChange: (next: number) => void;
}) {
  const current = closureSteps[step];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "captured", label: "The closure sees `threshold = 70`, the binding in its lexical parent environment." },
          { id: "caller", label: "The closure sees `threshold = 90`, the latest binding at the caller site." },
          { id: "host", label: "The closure searches a general Python globals dictionary for `threshold`." },
        ]}
        id="environment"
        onChange={onChange}
        prompt="In the fixed Pebble trace below, `judge(80)` runs after a local `threshold = 90`. Which threshold does `judge` use?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>ENVIRONMENT & CLOSURE THEATRE</span>
            <h3>A function value carries its lexical context; it does not search the caller.</h3>
          </div>
          <div className={styles.closureCode}>
            <code>{"let threshold = 70 in\n  let judge = fun score => score >= threshold in\n    let threshold = 90 in\n      judge(80)"}</code>
            <p><strong>Declared Pebble result:</strong> <code>true</code>, because the closure captures <code>threshold = 70</code>.</p>
          </div>
          <div className={styles.closureTheatre} aria-label="Lexical closure environment diagram">
            <div className={styles.environmentColumn}>
              {closureSteps.map((item, index) => (
                <button
                  aria-pressed={step === index}
                  className={step === index ? styles.currentEnvironment : undefined}
                  key={item.id}
                  onClick={() => onStepChange(index)}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <small>{item.frame}</small>
                </button>
              ))}
            </div>
            <div className={styles.frameStage}>
              <span>current step · {current.frame}</span>
              <h4>{current.label}</h4>
              <p>{current.detail}</p>
              <div className={styles.frameMap}>
                <div><strong>E₀</strong><span>threshold = 70</span></div>
                <i aria-hidden="true">↑ captured parent</i>
                <div><strong>closure</strong><span>judge(score) → score ≥ threshold</span></div>
                <i aria-hidden="true">↓ apply</i>
                <div><strong>E₃</strong><span>score = 80</span></div>
              </div>
            </div>
          </div>
          <div className={styles.stepActions}>
            <button disabled={step === 0} onClick={() => onStepChange(step - 1)} type="button">Previous frame</button>
            <button disabled={step === closureSteps.length - 1} onClick={() => onStepChange(step + 1)} type="button">Next frame</button>
          </div>
          <div className={styles.nameRuleCards}>
            <article>
              <span>Pebble lexical rule</span>
              <p>Free names follow the environment captured when the function was created.</p>
            </article>
            <article>
              <span>Python reading card</span>
              <p><code>global</code> declares module-level binding; <code>nonlocal</code> targets an enclosing function binding. Neither means “look in the caller.”</p>
            </article>
            <article>
              <span>Boundary reminder</span>
              <p>A closure models name resolution. It is not an authorization boundary or a general capability system.</p>
            </article>
          </div>
          <div className={styles.textEquivalent}>
            <strong>Text equivalent</strong>
            `judge` is created when E₀ contains `threshold = 70`. During
            `judge(80)`, parameter `score` is found in the call frame and free
            `threshold` is found by following the closure’s stored parent to E₀.
            The later `threshold = 90` is a separate shadowing binding.
          </div>
        </section>
      )}
    </div>
  );
}

function SemanticsLab({
  record,
  onChange,
  modeId,
  onModeChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  modeId: SemanticModeId;
  onModeChange: (next: SemanticModeId) => void;
}) {
  const mode = semanticModes.find((item) => item.id === modeId) ?? semanticModes[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "selected", label: "Only the selected then branch is evaluated; `missing` is not looked up in this trace." },
          { id: "both", label: "Both branches evaluate before `if` chooses a result." },
          { id: "missing", label: "`missing` is looked up first because it appears later in source order." },
        ]}
        id="semantics"
        onChange={onChange}
        prompt="Under declared Pebble semantics, what happens to `missing` in `if true then 7 else missing`?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>EVALUATION-SEMANTICS TRACE</span>
            <h3>An AST needs rules before it has a result.</h3>
          </div>
          <div className={styles.modeTabs} aria-label="Evaluation rule examples" role="group">
            {semanticModes.map((item) => (
              <button
                aria-pressed={modeId === item.id}
                key={item.id}
                onClick={() => onModeChange(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className={styles.semanticsLayout}>
            <div className={styles.semanticSource}>
              <span>fixed Pebble expression</span>
              <code>{mode.source}</code>
              <p>{mode.title}</p>
            </div>
            <ol className={styles.traceList}>
              {mode.trace.map(([span, action, outcome], index) => (
                <li key={`${span}-${action}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <code>{span}</code>
                  <strong>{action}</strong>
                  <p>{outcome}</p>
                </li>
              ))}
            </ol>
          </div>
          <aside className={styles.semanticsNote}>
            <strong>Named rule, not an accidental implementation detail</strong>
            <p>{mode.note}</p>
          </aside>
          <div className={styles.textEquivalent}>
            <strong>Text equivalent</strong>
            Choose the evaluation form above to read its ordered trace. Span
            labels identify the relevant part of the fixed expression. A row
            that says “not performed” is an explicit semantic result, not an
            omitted animation.
          </div>
        </section>
      )}
    </div>
  );
}

function ContractLab({
  record,
  onChange,
  fixtureId,
  onFixtureChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  fixtureId: ContractFixtureId;
  onFixtureChange: (next: ContractFixtureId) => void;
}) {
  const fixture = contractFixtures.find((item) => item.id === fixtureId) ?? contractFixtures[0];
  const stages = [
    ["01", "syntax", fixture.stage === "lexical scan" || fixture.stage === "grammar"],
    ["02", "outside the query language", fixture.stage === "conceptual boundary"],
    ["03", "schema + contract", fixture.stage === "schema + contract"],
    ["04", "resource budget", fixture.stage === "resource budget"],
    ["05", "M22 authorization", fixture.stage === "M22 authorization"],
    ["06", "fixed capability", fixture.stage === "fixed capability + evaluator"],
  ] as const;
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "named", label: "The first named layer that lacks evidence rejects; no later capability or adapter is reached." },
          { id: "parse", label: "Every failure is a parse error because all input begins as text." },
          { id: "adapter", label: "The evaluator may let query text choose a safer adapter after it parses." },
        ]}
        id="contract"
        onChange={onChange}
        prompt="A fixed local fixture fails its declared semantic contract. What must be true of the later authorization and capability layers?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>CONTRACT & CAPABILITY CHECKPOINT</span>
            <h3>“Validated” is not one box—and a query never selects its host adapter.</h3>
          </div>
          <div className={styles.contractLayout}>
            <div className={styles.selectorList}>
              <span>Inspect a fixed fixture</span>
              {contractFixtures.map((item) => (
                <button
                  aria-pressed={fixtureId === item.id}
                  key={item.id}
                  onClick={() => onFixtureChange(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className={styles.fixtureReadout}>
              <span>
                {fixture.kind === "model"
                  ? "fixed local model scenario: " + fixture.scenario
                  : "fixed conceptual contrast — not a model packet"}
              </span>
              <code>{fixture.source}</code>
              <strong>{fixture.status}</strong>
              <p>{fixture.reason}</p>
            </div>
          </div>
          <div className={styles.contractStack} aria-label="Layered contract and capability path">
            {stages.map(([number, label, selected]) => (
              <div className={selected ? styles.rejectedLayer : undefined} key={label}>
                <span>{number}</span>
                <strong>{label}</strong>
                <small>
                  {selected
                    ? fixture.kind === "model"
                      ? "earliest outcome: " + fixture.status
                      : "conceptual contrast; no model execution"
                    : "not reached or separately evidenced"}
                </small>
              </div>
            ))}
          </div>
          <div className={styles.capabilityCard}>
            <span>[NARROW CAPABILITY] · only shown for the final fixed-success fixture</span>
            <h4>ReadLearningMetric</h4>
            <p>
              A pre-minted, fixed-scope course-fixture reader supports one
              declared query outcome. The query text cannot name a Python
              callable, connection, path, URL, process, object attribute, or
              general host namespace.
            </p>
            <small>Local model reminder: this is not a real capability issuance, database read, or production authorization service.</small>
          </div>
          <div className={styles.textEquivalent}>
            <strong>Text equivalent</strong>
            The stack is read top to bottom. Model scenarios mark their earliest
            rejecting boundary, which prevents later layers from being reached.
            The separately labelled conceptual contrast does not execute the
            model. Only the final bounded-success scenario reaches the fixed
            reader; its result remains local teaching-model evidence.
          </div>
        </section>
      )}
    </div>
  );
}

function BridgeLab({
  record,
  onChange,
  cardId,
  onCardChange,
}: {
  record: ViewRecord;
  onChange: (next: Partial<ViewRecord>) => void;
  cardId: BridgeCardId;
  onCardChange: (next: BridgeCardId) => void;
}) {
  const card = bridgeCards.find((item) => item.id === cardId) ?? bridgeCards[0];
  return (
    <div className={styles.viewStack}>
      <PredictionGate
        choices={[
          { id: "observation", label: "A version-labelled local Python implementation observation that can motivate a later measurement question." },
          { id: "law", label: "A permanent, portable definition of Python language semantics." },
          { id: "benchmark", label: "Proof that this function is faster in every Python implementation and workload." },
        ]}
        id="bridge"
        onChange={onChange}
        prompt="What is the strongest claim version-labelled implementation evidence for one trusted bundled Python snippet can support?"
        record={record}
      />
      {record.revealed && (
        <section className={styles.revealCard} aria-live="polite">
          <div className={styles.revealHeader}>
            <span className={styles.scopeTag}>TRUSTED PYTHON IMPLEMENTATION BRIDGE</span>
            <h3>Implementation evidence is useful precisely because its scope is labelled.</h3>
          </div>
          <p className={styles.bridgeWarning}>
            <strong>Local Python implementation/version-specific observation.</strong>
            {" "}Call it CPython-specific only when a captured runtime label
            reports <code>cpython</code>. This view is a fixed code-reading
            bridge with no custom input, code runner, external Atlas text, or
            executable action.
          </p>
          <div className={styles.bridgeRail} aria-label="Trusted Python source to local implementation observation path">
            {bridgeCards.map((item, index) => (
              <div key={item.id}>
                <button
                  aria-pressed={cardId === item.id}
                  onClick={() => onCardChange(item.id)}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                </button>
                {index < bridgeCards.length - 1 && <i aria-hidden="true">→</i>}
              </div>
            ))}
          </div>
          <div className={styles.bridgeReadout}>
            <span>selected observation card</span>
            <h4>{card.label}</h4>
            <code>{card.content}</code>
            <p>{card.detail}</p>
          </div>
          <div className={styles.claimOwners}>
            <article><span>language rule</span><p>Python language reference owns language semantics.</p></article>
            <article><span>local observation</span><p>A particular local Python implementation/build can display particular implementation evidence.</p></article>
            <article><span>performance claim</span><p>A controlled, reproducible measurement owns a speed or allocation conclusion.</p></article>
          </div>
          <div className={styles.nonClaimPlate}>
            <strong>Non-claim:</strong> bytecode is not portable language law,
            a sandbox boundary, an authorization result, or a performance proof.
            Module 24 turns this bridge into careful runtime and measurement work.
          </div>
          <div className={styles.textEquivalent}>
            <strong>Text equivalent</strong>
            Follow the four fixed cards from trusted bundled source to AST
            observation, compiler/code-object concept, and a conceptual
            opcode-name card—not a captured <code>dis</code> listing. Each card
            scopes an implementation idea; none executes or authorizes a
            learner-provided query.
          </div>
        </section>
      )}
    </div>
  );
}

export function LanguageInterpreterStudio() {
  const [activeView, setActiveView] = useState<InterpreterView>("boundary");
  const [record, setRecord] = useState<StudioRecord>(emptyRecord);
  const [storageReady, setStorageReady] = useState(false);
  const [boundaryStage, setBoundaryStage] = useState<BoundaryStageId>("input");
  const [grammarCase, setGrammarCase] = useState<GrammarCaseId>("lexical");
  const [closureStep, setClosureStep] = useState(0);
  const [semanticMode, setSemanticMode] = useState<SemanticModeId>("eager");
  const [contractFixture, setContractFixture] = useState<ContractFixtureId>("lex");
  const [bridgeCard, setBridgeCard] = useState<BridgeCardId>("source");
  const [resetArmed, setResetArmed] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const progressDirtyRef = useRef(false);
  const revealedCount = views.filter((view) => record[view.id].revealed).length;
  const coverage = Math.round((revealedCount / views.length) * 100);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(MODULE23_PROGRESS_STORAGE_KEY);
        if (raw !== null) {
          const stored = module23ProgressCodec.parse(raw);
          if (stored && hasModule23MeaningfulProgress(stored)) {
            setRecord(stored as StudioRecord);
          } else if (stored) {
            window.localStorage.removeItem(MODULE23_PROGRESS_STORAGE_KEY);
            window.localStorage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
          }
        } else {
          const legacy = parseModule23LegacyProgress(
            window.localStorage.getItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY),
          );
          if (legacy && hasModule23MeaningfulProgress(legacy)) {
            const migratedRecord = legacy as StudioRecord;
            setRecord(migratedRecord);
            window.localStorage.setItem(
              MODULE23_PROGRESS_STORAGE_KEY,
              module23ProgressCodec.serialize(migratedRecord),
            );
            window.localStorage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
          } else if (legacy) {
            window.localStorage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
          }
        }
      } catch {
        // Optional local state contains only fixed choices, confidence, and
        // reveal status; a storage error never blocks the lesson.
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!storageReady || !progressDirtyRef.current) return;
    try {
      if (hasModule23MeaningfulProgress(record)) {
        window.localStorage.setItem(
          MODULE23_PROGRESS_STORAGE_KEY,
          module23ProgressCodec.serialize(record),
        );
        window.localStorage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
      } else {
        window.localStorage.removeItem(MODULE23_PROGRESS_STORAGE_KEY);
        window.localStorage.removeItem(MODULE23_LEGACY_PROGRESS_STORAGE_KEY);
      }
    } catch {
      // Progress storage is optional and never changes the instruction path.
    } finally {
      progressDirtyRef.current = false;
    }
  }, [record, storageReady]);

  const updateRecord = (view: InterpreterView, next: Partial<ViewRecord>) => {
    progressDirtyRef.current = true;
    setRecord((current) => ({
      ...current,
      [view]: { ...current[view], ...next },
    }));
  };

  const selectView = (view: InterpreterView) => {
    setActiveView(view);
    setResetArmed(false);
  };

  const handleTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % views.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + views.length) % views.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = views.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    selectView(views[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  const resetView = () => {
    updateRecord(activeView, { choice: null, confidence: null, revealed: false });
    if (activeView === "boundary") setBoundaryStage("input");
    if (activeView === "grammar") setGrammarCase("lexical");
    if (activeView === "environment") setClosureStep(0);
    if (activeView === "semantics") setSemanticMode("eager");
    if (activeView === "contract") setContractFixture("lex");
    if (activeView === "bridge") setBridgeCard("source");
  };

  const resetStudio = () => {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    clearStoredStudio();
    progressDirtyRef.current = false;
    setRecord(emptyRecord());
    setActiveView("boundary");
    setBoundaryStage("input");
    setGrammarCase("lexical");
    setClosureStep(0);
    setSemanticMode("eager");
    setContractFixture("lex");
    setBridgeCard("source");
    setResetArmed(false);
  };

  return (
    <section className={styles.studio} aria-labelledby="language-interpreter-studio-title">
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Module 23 visual studio</p>
          <h2 id="language-interpreter-studio-title">Atlas Language Lab</h2>
          <p>
            Turn one bounded query from text into a tree, explicit semantic
            decision, narrow local model result, and carefully scoped CPython
            implementation observation.
          </p>
          <div className={styles.heroFacts}>
            <span><b>6</b> connected views</span>
            <span><b>0</b> code runners</span>
            <span><b>1</b> explicit authority boundary</span>
          </div>
        </div>
        <div className={styles.languageOrb} aria-label="Atlas language pipeline diagram">
          <span className={styles.orbCore}>ATLAS<small>language lab</small></span>
          <i className={styles.orbRingOne} aria-hidden="true" />
          <i className={styles.orbRingTwo} aria-hidden="true" />
          <span className={`${styles.orbitToken} ${styles.textToken}`}>text</span>
          <span className={`${styles.orbitToken} ${styles.treeToken}`}>AST</span>
          <span className={`${styles.orbitToken} ${styles.capabilityToken}`}>fixed reader</span>
          <small className={styles.orbCaption}>structure stays data until a named, bounded meaning and authority decision</small>
        </div>
      </header>

      <InvariantPlate />

      <div className={styles.studioMeta}>
        <div>
          <span>Exploration coverage</span>
          <strong>{revealedCount} / {views.length} views revealed</strong>
          <p>Coverage records exploration only; it is not language mastery or a security score.</p>
        </div>
        <div
          aria-label="Exploration coverage: revealed language lab views"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={coverage}
          className={styles.coverageMeter}
          role="progressbar"
        >
          <span style={{ width: `${coverage}%` }} />
        </div>
        <div className={styles.resetActions}>
          <button onClick={resetView} type="button">Reset this view</button>
          <button onClick={resetStudio} type="button">
            {resetArmed ? "Confirm reset all" : "Reset saved studio"}
          </button>
        </div>
      </div>

      <div className={styles.tabs} aria-label="Atlas Language Lab views" role="tablist">
        {views.map((view, index) => (
          <button
            aria-controls={panelId(view.id)}
            aria-selected={activeView === view.id}
            id={tabId(view.id)}
            key={view.id}
            onClick={() => selectView(view.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            ref={(element) => { tabRefs.current[index] = element; }}
            role="tab"
            tabIndex={activeView === view.id ? 0 : -1}
            type="button"
          >
            <span>{view.number}</span><strong>{view.label}</strong><small>{view.question}</small>
          </button>
        ))}
      </div>

      <div aria-labelledby={tabId("boundary")} className={styles.panel} hidden={activeView !== "boundary"} id={panelId("boundary")} role="tabpanel" tabIndex={0}>
        <BoundaryLab onChange={(next) => updateRecord("boundary", next)} onStageChange={setBoundaryStage} record={record.boundary} stageId={boundaryStage} />
      </div>
      <div aria-labelledby={tabId("grammar")} className={styles.panel} hidden={activeView !== "grammar"} id={panelId("grammar")} role="tabpanel" tabIndex={0}>
        <GrammarLab caseId={grammarCase} onCaseChange={setGrammarCase} onChange={(next) => updateRecord("grammar", next)} record={record.grammar} />
      </div>
      <div aria-labelledby={tabId("environment")} className={styles.panel} hidden={activeView !== "environment"} id={panelId("environment")} role="tabpanel" tabIndex={0}>
        <EnvironmentLab onChange={(next) => updateRecord("environment", next)} onStepChange={setClosureStep} record={record.environment} step={closureStep} />
      </div>
      <div aria-labelledby={tabId("semantics")} className={styles.panel} hidden={activeView !== "semantics"} id={panelId("semantics")} role="tabpanel" tabIndex={0}>
        <SemanticsLab modeId={semanticMode} onChange={(next) => updateRecord("semantics", next)} onModeChange={setSemanticMode} record={record.semantics} />
      </div>
      <div aria-labelledby={tabId("contract")} className={styles.panel} hidden={activeView !== "contract"} id={panelId("contract")} role="tabpanel" tabIndex={0}>
        <ContractLab fixtureId={contractFixture} onChange={(next) => updateRecord("contract", next)} onFixtureChange={setContractFixture} record={record.contract} />
      </div>
      <div aria-labelledby={tabId("bridge")} className={styles.panel} hidden={activeView !== "bridge"} id={panelId("bridge")} role="tabpanel" tabIndex={0}>
        <BridgeLab cardId={bridgeCard} onCardChange={setBridgeCard} onChange={(next) => updateRecord("bridge", next)} record={record.bridge} />
      </div>

      <footer className={styles.footer}>
        <p>
          Continue in the workbook for six connected sessions, the eight-level
          problem ladder, confidence-aware diagnostic, TA parser/closure
          clinics, Study Partner routine, and the Atlas Query Language Dossier.
        </p>
        <Link href="/modules/23-programming-languages-interpreters">
          Enter Module 23 <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </section>
  );
}
