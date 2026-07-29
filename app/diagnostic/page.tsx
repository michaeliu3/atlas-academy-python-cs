import type { Metadata } from "next";
import Link from "next/link";
import { CourseReaderHeader } from "../modules/CourseReaderHeader";
import { DiagnosticExperience } from "./DiagnosticExperience";

export const metadata: Metadata = {
  title: "Module 0 Diagnostic · Atlas Academy",
  description:
    "A confidence-aware, reasoning-first diagnostic that builds a connected Python and computer science learning route.",
  alternates: {
    canonical: "/diagnostic",
  },
};

export default function DiagnosticPage() {
  return (
    <main className="diagnostic-page-shell">
      <CourseReaderHeader current="diagnostic" />
      <div id="main-content" tabIndex={-1}>
        <DiagnosticExperience />
      </div>
      <footer className="reader-page-footer diagnostic-page-footer">
        <Link href="/">Atlas Academy</Link>
        <p>Understand deeply. Design clearly. Verify relentlessly.</p>
      </footer>
    </main>
  );
}
