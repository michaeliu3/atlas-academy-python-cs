/**
 * Workbooks tag claims with a bracket label — `**[DEFINITION / MODEL]**`,
 * `**[FINITE EXPERIMENT]**`, `**[AI PROPOSAL]**` — to separate what a sentence
 * establishes from what it merely asserts. It is the course's central
 * intellectual device, but it renders as ordinary bold, so on the page it is
 * indistinguishable from emphasis.
 *
 * Authors have coined ~120 distinct labels across 293 uses, and the vocabulary
 * should stay open. So rather than enumerating labels, classify each one into a
 * small set of epistemic categories that carry the visual treatment. A new
 * label inherits a sensible category without a code change.
 *
 * Order matters: the first matching rule wins, so narrow patterns precede
 * broad ones ("UNAVAILABLE — DEFER OR NARROW CLAIM" is a gap, not a contract).
 */

export const evidenceCategories = Object.freeze([
  "unknown",
  "proposal",
  "counterexample",
  "proof",
  "observation",
  "contract",
  "policy",
  "model",
]);

const classificationRules = [
  // A declared gap. Must precede `contract`, since several gap labels end in
  // "CLAIM".
  { category: "unknown", pattern: /\bUNKNOWN\b|\bUNAVAILABLE\b|\bOPEN DECISION\b|\bDEFER\b/u },
  // Something an assistant offered that has not been checked yet.
  { category: "proposal", pattern: /\bAI PROPOSAL\b|\bPROPOSAL\b/u },
  // A refutation carries its own weight and should never look like a claim.
  { category: "counterexample", pattern: /\bCOUNTEREXAMPLE\b|\bCOUNTERMODEL\b/u },
  // Established by argument from stated hypotheses.
  { category: "proof", pattern: /\bTHEOREM\b|\bPROOF\b|\bDERIVATION\b|\bMATHEMATICAL CLAIM\b|\bINFERENCE\b/u },
  // Finite, situated evidence: it happened, under named conditions.
  {
    category: "observation",
    pattern: /\bEXPERIMENT\b|\bOBSERVATION\b|\bMEASUREMENT\b|\bTRACE\b|\bRESULT\b|\bEVIDENCE\b|\bTESTED\b|\bCHECK(?:ED)?\b|\bOUTPUT\b/u,
  },
  // Documented behaviour of something outside the course's control.
  {
    category: "contract",
    pattern: /\bCONTRACT\b|\bSPEC(?:IFICATION)?\b|\bSTANDARD\b|\bGUARANTEE\b|\bCLAIM\b|\bAUTHORIZED\b|\bAUTHENTICATED\b|\bVALIDATED\b|\bBOUNDARY\b|\bCAPABILITY\b|\bPERMITTED\b/u,
  },
  // A choice this project made, which could have been made differently.
  { category: "policy", pattern: /\bPOLICY\b|\bDECISION\b|\bGOVERNANCE\b|\bAUTHORITY\b|\bNEED\b/u },
];

/**
 * @param {unknown} label bracket contents, e.g. "DEFINITION / MODEL"
 * @returns {string} one of `evidenceCategories`
 */
export function classifyEvidenceLabel(label) {
  if (typeof label !== "string") return "model";
  const normalized = label.toUpperCase();
  for (const { category, pattern } of classificationRules) {
    if (pattern.test(normalized)) return category;
  }
  // Definitions, models, hypotheses, mechanisms, and anything newly coined:
  // treat as a declared construct rather than as established fact.
  return "model";
}

/**
 * Bracket labels are upper-case and may contain spaces, slashes, dashes, and
 * digits. Requiring at least two characters avoids catching `[A]`-style list
 * markers, and requiring an upper-case letter avoids matching link syntax.
 */
const bracketLabelPattern = /^\[([A-Z][A-Z0-9 /&,'’—–-]*[A-Z0-9])\]$/u;

/**
 * Recognise a rendered `**[LABEL]**` and return its parts, or null when the
 * bold run is ordinary emphasis.
 *
 * @param {unknown} text
 * @returns {{ label: string, category: string } | null}
 */
export function parseEvidenceLabel(text) {
  if (typeof text !== "string") return null;
  const match = text.trim().match(bracketLabelPattern);
  if (!match) return null;
  const label = match[1].trim();
  return { label, category: classifyEvidenceLabel(label) };
}

/**
 * A claim/source pointer such as `M32-C03 -> S32-03–S32-04` maps a workbook
 * claim to its entry in that module's primary-source research map.
 *
 * This is a *different device* from an evidence label: a bracket label says
 * what kind of thing a sentence establishes, while a pointer says where the
 * supporting source is recorded. They previously looked identical on the page
 * because neither was styled — a pointer rendered as ordinary inline code, so
 * it read like a variable name. Recognising it lets the reader style it as
 * navigation.
 *
 * @param {unknown} text inline code span contents
 * @returns {boolean}
 */
export function isClaimSourcePointer(text) {
  if (typeof text !== "string") return false;
  return /^M\d{2}-C\d{2}\S*(?:\s*[–-]\s*M\d{2}-C\d{2}\S*)?\s*->\s*S\d{2}-\d{2}/u.test(text.trim());
}
