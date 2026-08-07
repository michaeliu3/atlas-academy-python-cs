/**
 * Workbook Markdown crosses three parsers before a learner sees it: GFM tables,
 * `remark-math` (after the reader rewrites `\(`/`\[` into `$`/`$$`), and KaTeX.
 * Each has a failure mode that is silent in the source and destructive on the
 * page:
 *
 * - an orphaned `\)` becomes a lone `$`, which pairs with the *next* `$` and
 *   swallows prose into math mode until it finds one;
 * - a raw LaTeX control sequence left inside a code span renders as literal
 *   monospace backslashes instead of mathematics;
 * - an unescaped `|` inside a table cell — including inside a code span or
 *   inline math — splits the row, so trailing columns are dropped;
 * - a delimiter row whose cell count differs from its header stops GFM from
 *   recognising the table at all, and it renders as raw pipe-laden text.
 *
 * These checks are structural. They do not judge whether the mathematics is
 * correct, only whether the reader will receive what the author wrote.
 */

const fencePattern = /^\s*(`{3,}|~{3,})/u;
const inlineCodePattern = /(?<!`)(`+)(?!`)([^\n]*?)(?<!`)\1(?!`)/gu;

/**
 * Multi-letter LaTeX control sequences that appear in this corpus's
 * mathematics. Single-letter escapes (`\w`, `\n`, `\d`, `\s`, `\b`) are
 * deliberately excluded: those belong to regexes and string literals, which are
 * legitimate code-span content. Longer non-math escapes such as a Windows path
 * segment (`\work`) simply are not in this set.
 */
const mathCommands = new Set([
  "alpha", "approx", "bar", "beta", "big", "bigcup", "bigcap", "binom", "bot",
  "cap", "cdot", "cdots", "cup", "dfrac", "delta", "Delta", "ell", "epsilon",
  "exists", "exp", "forall", "frac", "gamma", "Gamma", "ge", "geq", "hat",
  "in", "inf", "infty", "int", "lambda", "Lambda", "langle", "ldots", "le",
  "leq", "lim", "lnot", "log", "lVert", "lvert", "mapsto", "mathbb", "mathbf",
  "mathcal", "mathrm", "mathsf", "max", "mid", "min", "mu", "nabla", "ne",
  "neq", "neg", "nu", "oplus", "operatorname", "otimes", "overline", "partial",
  "perp", "phi", "Phi", "pi", "prod", "psi", "Psi", "qquad", "quad", "rangle",
  "Rightarrow", "rVert", "rvert", "sigma", "Sigma", "sim", "sqrt", "subset",
  "subseteq", "sum", "sup", "tau", "tfrac", "theta", "times", "to", "varepsilon",
  "varnothing", "Vert", "widehat", "omega", "Omega",
]);

function issue(line, kind, message) {
  return { line, kind, message };
}

/**
 * Split one line into alternating prose and inline-code segments.
 *
 * Each segment carries both `text` (the content a check cares about — for a
 * code span, what sits between the backticks) and `raw` (the exact source,
 * backticks included). Callers that inspect content use `text`; callers that
 * rewrite a line and must reproduce it byte-for-byte use `raw`.
 */
export function splitInlineCode(line) {
  const segments = [];
  let cursor = 0;
  inlineCodePattern.lastIndex = 0;
  for (const match of line.matchAll(inlineCodePattern)) {
    if (match.index > cursor) {
      const prosePart = line.slice(cursor, match.index);
      segments.push({ code: false, text: prosePart, raw: prosePart });
    }
    segments.push({ code: true, text: match[2], raw: match[0] });
    cursor = match.index + match[0].length;
  }
  if (cursor < line.length) {
    const tail = line.slice(cursor);
    segments.push({ code: false, text: tail, raw: tail });
  }
  return segments;
}

function prose(line) {
  return splitInlineCode(line)
    .filter((segment) => !segment.code)
    .map((segment) => segment.text)
    .join(" ");
}

function cellCount(row) {
  // A `\|` is an escaped literal pipe and never delimits a cell.
  return row.replaceAll("\\|", "").trim().replace(/^\||\|$/gu, "").split("|").length;
}

/**
 * Walk a document once, tracking fenced blocks, and collect every structural
 * markup issue. `sourcePath` is only used for reporting.
 */
export function scanModuleMarkup(markdown, { sourcePath = "(unknown Markdown source)" } = {}) {
  const lines = markdown.split(/\r?\n/u);
  const issues = [];

  let fence = null;
  let inlineDepth = 0;
  let inlineOpenedAt = 0;
  let displayDepth = 0;
  let displayOpenedAt = 0;
  let expectedCells = 0;
  let tableHeaderLine = 0;
  let tableIsMalformed = false;

  for (const [index, rawLine] of lines.entries()) {
    const lineNumber = index + 1;
    const fenceMatch = rawLine.match(fencePattern)?.[1];
    if (fenceMatch) {
      const marker = fenceMatch[0];
      if (fence === null) {
        fence = { marker, length: fenceMatch.length };
      } else if (fence.marker === marker && fenceMatch.length >= fence.length) {
        fence = null;
      }
      continue;
    }
    if (fence !== null) {
      continue;
    }

    const outsideCode = prose(rawLine);

    // --- math delimiters -------------------------------------------------
    for (const match of outsideCode.matchAll(/\\[[\]()]/gu)) {
      const token = match[0];
      if (token === "\\(") {
        if (inlineDepth > 0) {
          issues.push(issue(lineNumber, "math-delimiter-nesting",
            `opens inline math while the span from line ${inlineOpenedAt} is still open`));
        }
        inlineDepth += 1;
        inlineOpenedAt = lineNumber;
      } else if (token === "\\)") {
        if (inlineDepth === 0) {
          issues.push(issue(lineNumber, "math-delimiter-orphan",
            "closes inline math that was never opened; the reader turns this into a stray `$` that swallows following prose"));
        } else {
          inlineDepth -= 1;
        }
      } else if (token === "\\[") {
        if (displayDepth > 0) {
          issues.push(issue(lineNumber, "math-delimiter-nesting",
            `opens display math while the block from line ${displayOpenedAt} is still open`));
        }
        displayDepth += 1;
        displayOpenedAt = lineNumber;
      } else if (token === "\\]") {
        if (displayDepth === 0) {
          issues.push(issue(lineNumber, "math-delimiter-orphan",
            "closes display math that was never opened"));
        } else {
          displayDepth -= 1;
        }
      }
    }

    // --- raw LaTeX stranded in a code span --------------------------------
    // Skip while display math is open: a `\[ ... \]` block may legitimately
    // contain backticks in prose-like alignment text.
    if (displayDepth === 0) {
      for (const segment of splitInlineCode(rawLine)) {
        if (!segment.code) continue;
        for (const command of segment.text.matchAll(/\\([a-zA-Z]{2,})/gu)) {
          if (mathCommands.has(command[1])) {
            issues.push(issue(lineNumber, "latex-in-code-span",
              `code span contains the LaTeX command \\${command[1]}; use \\( … \\) so KaTeX renders it`));
            break;
          }
        }
      }
    }

    // --- table structure ---------------------------------------------------
    const isTableRow = rawLine.trimStart().startsWith("|");
    // A delimiter row contains nothing but pipes, colons, dashes, and spaces.
    // Testing the whole row avoids misreading a body row whose first cell
    // happens to begin with a dash.
    if (isTableRow && /^[\s|:-]*$/u.test(rawLine) && rawLine.includes("-")) {
      const delimiterCells = cellCount(rawLine);
      const headerCells = index > 0 ? cellCount(lines[index - 1]) : -1;
      // A header/delimiter mismatch means GFM produces no table at all, so
      // counting cells in the body rows would report the symptom instead of
      // the cause. Name the cause once and stop counting for this block.
      tableIsMalformed = delimiterCells !== headerCells;
      if (tableIsMalformed) {
        issues.push(issue(lineNumber, "table-delimiter-mismatch",
          `delimiter row declares ${delimiterCells} columns but its header has ${headerCells}; GFM will not render this as a table at all`));
      }
      expectedCells = delimiterCells;
      tableHeaderLine = lineNumber;
      continue;
    }
    if (!isTableRow) {
      expectedCells = 0;
      tableIsMalformed = false;
      continue;
    }
    if (expectedCells > 0) {
      const cells = cellCount(rawLine);
      if (!tableIsMalformed && cells !== expectedCells) {
        issues.push(issue(lineNumber, "table-cell-count",
          `row has ${cells} cells but the table opened at line ${tableHeaderLine} declares ${expectedCells}; check for an unescaped \`|\``));
      }
      for (const segment of splitInlineCode(rawLine)) {
        if (segment.code && /(?<!\\)\|/u.test(segment.text)) {
          issues.push(issue(lineNumber, "pipe-in-table-code-span",
            "code span in a table row contains an unescaped `|`; write `\\|` or move the notation into \\( … \\)"));
          break;
        }
      }
    }
  }

  if (inlineDepth > 0) {
    issues.push(issue(inlineOpenedAt, "math-delimiter-unclosed",
      "inline math is never closed"));
  }
  if (displayDepth > 0) {
    issues.push(issue(displayOpenedAt, "math-delimiter-unclosed",
      "display math is never closed"));
  }

  return { sourcePath, issues };
}

/**
 * Emphasis density, reported as guidance rather than enforced.
 *
 * Bold is meant to mark an imperative, a non-claim, or a warning; italic marks
 * a term at the point of definition. Where bold does both jobs it does
 * neither, and several workbooks carry one bold run every eighty words with
 * almost no italic at all. Evidence labels are excluded from the count: they
 * are authored as bold but render as their own device, so they do not compete
 * with prose emphasis.
 *
 * This is a judgement call per sentence, so it is surfaced as an advisory for
 * an editor, never as a build failure.
 */
export function scanEmphasisDensity(markdown, { sourcePath = "(unknown)" } = {}) {
  const lines = markdown.split(/\r?\n/u);
  let fence = null;

  let structural = 0;
  let evidenceLabels = 0;
  let proseBold = 0;
  let italic = 0;
  let words = 0;

  for (const rawLine of lines) {
    const fenceMatch = rawLine.match(fencePattern)?.[1];
    if (fenceMatch) {
      const marker = fenceMatch[0];
      if (fence === null) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (fence !== null) continue;

    words += rawLine.split(/\s+/u).filter(Boolean).length;
    italic += [...rawLine.matchAll(/(?<![*\w])\*([^*\n]+)\*(?!\*)/gu)].length;
    const inTableRow = rawLine.trimStart().startsWith("|");

    for (const match of rawLine.matchAll(/\*\*([^*\n]+)\*\*/gu)) {
      const text = match[1].trim();
      // Most bold in these workbooks is structure, not emphasis: an evidence
      // label, a multiple-choice option marker, a `Deliverable:` lead-in, or a
      // table row heading. Counting those as emphasis would report a module
      // as shouting when it is merely labelled, and pressure an author into
      // unbolding the very markers that make a diagnostic scannable.
      if (/^\[[A-Z][^\]]*\]$/u.test(text)) evidenceLabels += 1;
      // `A`, `A.`, `Answer: B.`, and the `B — "distractor text"` form all mark
      // a multiple-choice option rather than emphasising a word.
      else if (/^[A-Z]\.?$/u.test(text) || /^Answer[:.]/u.test(text) || /^[A-Z]\s*[—–-]\s/u.test(text)) {
        structural += 1;
      }
      else if (text.endsWith(":")) structural += 1;
      else if (inTableRow) structural += 1;
      // A short capitalised noun phrase alone on its line is a definition-list
      // heading ("Artifact produced", "TA handoff"), not stress on a word.
      else if (/^\*\*[^*\n]+\*\*$/u.test(rawLine.trim()) && text.split(/\s+/u).length <= 6) {
        structural += 1;
      }
      else proseBold += 1;
    }
  }

  return {
    sourcePath,
    words,
    proseBold,
    structuralBold: structural,
    evidenceLabels,
    italic,
    boldPerThousandWords: words === 0 ? 0 : Number(((proseBold / words) * 1000).toFixed(1)),
  };
}

/**
 * Candidates for a variable left bare where inline math was stripped.
 *
 * When `\(A\)` lost its delimiters the backslashes inside usually survived,
 * which is what `latex-in-code-span` and the delimiter balance find. A
 * single-letter variable left nothing behind: `\(A\)` became `(A)`, which is
 * shape-identical to ordinary prose — "Answer (A) is the one to record" is
 * correct, "(A) is any square matrix" is a defect, and no syntactic rule
 * separates them.
 *
 * So this reports rather than fails, and only for documents that use inline
 * math at all. Four such options survived the first Module 28 repair pass and
 * were found by reading, not by the validator; this at least puts them in
 * front of a reviewer.
 */
export function scanStrippedMathCandidates(markdown, { sourcePath = "(unknown)" } = {}) {
  const lines = markdown.split(/\r?\n/u);
  if (!/\\\(/u.test(markdown)) return { sourcePath, candidates: [] };

  const candidates = [];
  let fence = null;
  let displayDepth = 0;

  for (const [index, rawLine] of lines.entries()) {
    const fenceMatch = rawLine.match(fencePattern)?.[1];
    if (fenceMatch) {
      const marker = fenceMatch[0];
      if (fence === null) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (fence !== null) continue;
    if (rawLine.trim() === "\\[") displayDepth += 1;
    if (rawLine.trim() === "\\]") displayDepth = Math.max(0, displayDepth - 1);
    if (displayDepth > 0) continue;

    const outside = splitInlineCode(rawLine)
      .filter((segment) => !segment.code)
      .map((segment) => segment.text)
      .join(" ")
      // Drop already-delimited spans so their inner parentheses are not counted.
      .replace(/\\\([\s\S]*?\\\)/gu, " ");

    for (const bare of outside.matchAll(/(?<![\\\w])\(([A-Z])\)(?!\w)/gu)) {
      candidates.push({ line: index + 1, token: bare[1], text: rawLine.trim() });
    }
  }
  return { sourcePath, candidates };
}

export function formatMarkupIssues(reports) {
  const lines = [];
  for (const report of reports) {
    for (const { line, kind, message } of report.issues) {
      lines.push(`${report.sourcePath}:${line} [${kind}] ${message}`);
    }
  }
  return lines;
}

/**
 * Throw when any scanned document has a structural markup issue. Structural
 * breakage is a correctness fault rather than an authoring-completeness
 * question, so this is fail-closed for authoring material too.
 */
export function validateModuleMarkup(reports) {
  const failures = formatMarkupIssues(reports);
  if (failures.length > 0) {
    throw new Error(`Module markup validation failed:\n- ${failures.join("\n- ")}`);
  }
  return {
    reports,
    summary: {
      totalDocuments: reports.length,
      totalIssues: 0,
    },
  };
}
