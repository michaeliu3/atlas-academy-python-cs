import type { ComponentType } from "react";

/**
 * The complete, bounded set of reader studios that are actually publishable.
 * A graph declaration outside this set is a publication configuration error,
 * never an invitation for the reader to guess from a module slug.
 */
export const moduleStudioIds = [
  "network-protocol",
  "async-distributed",
  "security-trust",
  "language-interpreter",
  "runtime-evidence",
  "evidence-grounded",
  "capstone-defense",
  "discrete-math-proof",
  "linear-algebra-stability",
  "calculus-continuous-change",
  "probability-inference",
] as const;

export type ModuleStudioId = (typeof moduleStudioIds)[number];

type StudioComponent = ComponentType<Record<string, never>>;

export type ModuleStudioRegistration = Readonly<{
  studioId: ModuleStudioId;
  title: string;
  load: () => Promise<{ default: StudioComponent }>;
}>;

export const moduleStudioRegistry = {
  "network-protocol": {
    studioId: "network-protocol",
    title: "Network protocol observatory",
    load: () =>
      import("@/app/NetworkProtocolStudio").then(({ NetworkProtocolStudio }) => ({
        default: NetworkProtocolStudio,
      })),
  },
  "async-distributed": {
    studioId: "async-distributed",
    title: "Async and distributed systems control room",
    load: () =>
      import("@/app/AsyncDistributedStudio").then(({ AsyncDistributedStudio }) => ({
        default: AsyncDistributedStudio,
      })),
  },
  "security-trust": {
    studioId: "security-trust",
    title: "Security and trust control room",
    load: () =>
      import("@/app/SecurityTrustStudio").then(({ SecurityTrustStudio }) => ({
        default: SecurityTrustStudio,
      })),
  },
  "language-interpreter": {
    studioId: "language-interpreter",
    title: "Language interpreter studio",
    load: () =>
      import("@/app/LanguageInterpreterStudio").then(({ LanguageInterpreterStudio }) => ({
        default: LanguageInterpreterStudio,
      })),
  },
  "runtime-evidence": {
    studioId: "runtime-evidence",
    title: "Runtime evidence observatory",
    load: () =>
      import("@/app/RuntimeEvidenceObservatory").then(({ RuntimeEvidenceObservatory }) => ({
        default: RuntimeEvidenceObservatory,
      })),
  },
  "evidence-grounded": {
    studioId: "evidence-grounded",
    title: "Evidence-grounded systems studio",
    load: () =>
      import("@/app/EvidenceGroundedStudio").then(({ EvidenceGroundedStudio }) => ({
        default: EvidenceGroundedStudio,
      })),
  },
  "capstone-defense": {
    studioId: "capstone-defense",
    title: "Capstone evidence and defense studio",
    load: () =>
      import("@/app/CapstoneDefenseStudio").then(({ CapstoneDefenseStudio }) => ({
        default: CapstoneDefenseStudio,
      })),
  },
  "discrete-math-proof": {
    studioId: "discrete-math-proof",
    title: "Proof and counterexample workbench",
    load: () =>
      import("@/app/DiscreteMathProofStudio").then(({ DiscreteMathProofStudio }) => ({
        default: DiscreteMathProofStudio,
      })),
  },
  "linear-algebra-stability": {
    studioId: "linear-algebra-stability",
    title: "Linear algebra and stability studio",
    load: () =>
      import("@/app/LinearAlgebraStabilityStudio").then(
        ({ LinearAlgebraStabilityStudio }) => ({
          default: LinearAlgebraStabilityStudio,
        }),
      ),
  },
  "calculus-continuous-change": {
    studioId: "calculus-continuous-change",
    title: "Limits, change, and convergence studio",
    load: () =>
      import("@/app/CalculusContinuousChangeStudio").then(
        ({ CalculusContinuousChangeStudio }) => ({
          default: CalculusContinuousChangeStudio,
        }),
      ),
  },
  "probability-inference": {
    studioId: "probability-inference",
    title: "Probability and inference studio",
    load: () =>
      import("@/app/ProbabilityInferenceStudio").then(
        ({ ProbabilityInferenceStudio }) => ({
          default: ProbabilityInferenceStudio,
        }),
      ),
  },
} as const satisfies Record<ModuleStudioId, ModuleStudioRegistration>;

export const moduleStudioRegistrations = Object.values(moduleStudioRegistry);

export function getModuleStudioRegistration(studioId: ModuleStudioId) {
  return moduleStudioRegistry[studioId];
}

function findModuleStudioRegistration(studioId: string) {
  if (!Object.hasOwn(moduleStudioRegistry, studioId)) {
    return undefined;
  }
  return moduleStudioRegistry[studioId as ModuleStudioId];
}

type ModuleStudioTarget = {
  lifecycle: string;
  availability: string;
  studioId: string | null;
};

export type ModuleStudioResolution =
  | {
      kind: "studio";
      registration: ModuleStudioRegistration;
    }
  | {
      kind: "workbook-and-oral-defense";
      title: "Workbook-led interaction";
      description: string;
    }
  | {
      kind: "preview";
      description: string;
    }
  | {
      kind: "unavailable";
      state: "authoring-only" | "locked";
      description: string;
    }
  | {
      kind: "configuration-error";
      studioId: string;
      description: string;
    };

/**
 * Resolves a graph declaration without using a slug convention. The caller can
 * render a dedicated studio, the existing workbook/oral-defense route, or an
 * honest unavailable state from this one seam.
 */
export function resolveModuleStudio(
  courseModule: ModuleStudioTarget,
): ModuleStudioResolution {
  if (
    courseModule.lifecycle !== "published" ||
    courseModule.availability === "authoring-only"
  ) {
    return {
      kind: "unavailable",
      state: "authoring-only",
      description:
        "This module is authoring-only: no workbook or interactive studio is published.",
    };
  }

  if (courseModule.availability === "locked") {
    return {
      kind: "unavailable",
      state: "locked",
      description:
        "This module is locked until its academic prerequisites and release evidence are available.",
    };
  }

  if (courseModule.availability === "preview") {
    return {
      kind: "preview",
      description:
        "This is a released orientation preview, not an unlocked Core step. Its full prerequisite chain includes later authoring modules, so the studio, project evidence, and oral-defense route remain unavailable here.",
    };
  }

  if (courseModule.studioId === null) {
    return {
      kind: "workbook-and-oral-defense",
      title: "Workbook-led interaction",
      description:
        "This published module has no separate visual studio. Use its workbook, then the supportive oral-defense conversation below, to make your reasoning visible.",
    };
  }

  const registration = findModuleStudioRegistration(courseModule.studioId);
  if (!registration) {
    return {
      kind: "configuration-error",
      studioId: courseModule.studioId,
      description:
        "The graph declares a studio that is not registered for publication. Treat this as a release configuration error, not as learning material.",
    };
  }

  return { kind: "studio", registration };
}
