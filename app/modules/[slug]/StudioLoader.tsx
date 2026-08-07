"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import {
  moduleStudioRegistrations,
  type ModuleStudioId,
} from "@/lib/module-studio-registry";

const studioComponents = Object.fromEntries(
  moduleStudioRegistrations.map((registration) => [
    registration.studioId,
    dynamic(registration.load, {
      loading: () => (
        <section aria-live="polite" aria-busy="true" className="module-studio-loading">
          <p className="kicker">Interactive studio</p>
          <p>Loading {registration.title}…</p>
        </section>
      ),
    }),
  ]),
) as Record<ModuleStudioId, ComponentType>;

type StudioLoaderProps = {
  studioId: ModuleStudioId;
};

export function StudioLoader({ studioId }: StudioLoaderProps) {
  const Studio = studioComponents[studioId];
  return <Studio />;
}
