import registryData from "@/content/course/synthesis-preview-conversations.v1.json";

export type SynthesisPreviewConversation = {
  moduleId: "m25" | "m26";
  title: string;
  mode: "preview-only";
  fullSessionEstimate: "45–60 minutes" | "60–90 minutes";
  summary: string;
  allowedArtifact: {
    tag: "PREVIEW ONLY" | "REHEARSAL ONLY";
    label: string;
    instruction: string;
    boundary: string;
  };
  teachingAssistantClarificationPrompt: string;
  studyPartnerPrompt: string;
  futureForwardContext: {
    kind: "future-module-without-handoff" | "specialization-question-without-handoff";
    moduleId: "m26" | null;
    label: string;
    boundary: string;
  };
  notionEvidencePacket: {
    title: string;
    conditions: string;
    boundary: string;
    fields: string[];
  };
};

type SynthesisPreviewConversationRegistry = {
  schemaVersion: 1;
  conversationVersion: "v1";
  kind: "atlas-synthesis-preview-conversations";
  canonicalCourseGraph: "content/course/course-graph.v2.json";
  liveCodexLearningWorkflow: "content/course/live-codex-learning-workflow.v2.json";
  purpose: string;
  packages: SynthesisPreviewConversation[];
};

export const synthesisPreviewConversationRegistry =
  registryData as SynthesisPreviewConversationRegistry;

const packagesByModuleId = new Map<string, SynthesisPreviewConversation>(
  synthesisPreviewConversationRegistry.packages.map((previewPackage) => [
    previewPackage.moduleId,
    previewPackage,
  ]),
);

export function getSynthesisPreviewConversation(moduleId: string) {
  return packagesByModuleId.get(moduleId);
}
