import {
  moduleCompanionGuides,
  type ModuleCompanionGuide,
  type ModuleCompanionLens,
} from "./module-companion-guides";

export type OralDefenseLens = ModuleCompanionLens;
export type OralDefenseGuide = Omit<ModuleCompanionGuide, "moduleId">;

const fallbackGuide: OralDefenseGuide = {
  lens: "evidence",
  centralModel: "the module's central representation, invariant, or decision boundary",
  traceOrDerivation: "trace one mechanism and state the assumption that makes each step legal",
  misconception: "a plausible shortcut that confuses an example, output, or polished explanation with evidence",
  boundary: "what the available model, contract, or observation does not establish",
  transfer: "a new Atlas situation where the same reasoning changes a design choice",
};

export const oralDefenseGuides: Record<number, OralDefenseGuide> = Object.fromEntries(
  moduleCompanionGuides.map(({ moduleId, ...guide }) => [
    Number(moduleId.slice(1)),
    guide,
  ]),
) as Record<number, OralDefenseGuide>;

export function getOralDefenseGuide(number: number): OralDefenseGuide {
  return oralDefenseGuides[number] ?? fallbackGuide;
}

export function lensInstruction(guide: OralDefenseGuide) {
  switch (guide.lens) {
    case "formal":
      return "Ask for the formal definition and assumptions, then a proof idea or counterexample, and finally the consequence for computation.";
    case "systems":
      return "Ask for the system boundary, failure mode, evidence, tradeoff, and human consequence—not only a mechanism description.";
    case "code":
      return "Ask for a prediction before a trace, the relevant contract or invariant, and the boundary of what the observed run can establish.";
    default:
      return "Ask which claim the evidence supports, which authority may act on it, what uncertainty remains, and how a person can challenge or reverse the decision.";
  }
}
