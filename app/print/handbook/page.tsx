import graph from "@/content/course/course-graph.v2.json";
import arcProjects from "@/content/course/arc-projects.v1.json";

export const dynamic = "force-static";

const phases = graph.routePlans[0]?.phases ?? [];

export default function PrintHandbookPage() {
  return (
    <main className="print-module-shell print-handbook-shell">
      <header className="print-module-header">
        <p className="kicker">Atlas Academy · course handbook</p>
        <h1>Python, Computer Science, Mathematical Foundations, and AI-Era Reasoning</h1>
        <p>
          A connected 36-module route for reading code, tracing systems, deriving claims,
          designing architectures, and directing AI-assisted implementation.
        </p>
        <dl className="print-module-meta">
          <div><dt>Core route</dt><dd>60-day intensive first pass</dd></div>
          <div><dt>Recommended</dt><dd>90 days · 20–25 focused hours/week</dd></div>
          <div><dt>Durable review</dt><dd>180-day extension with spaced retrieval</dd></div>
        </dl>
      </header>

      <section className="print-session-index" aria-labelledby="handbook-route-title">
        <h2 id="handbook-route-title">Canonical prerequisite route</h2>
        <p>
          M1–M5 → M27 → M6–M11 → M12–M16 → M17 → M28–M30 → M31 → M18–M24 →
          M32–M36 → M25 → M26.
        </p>
        <p>
          The graph separates academic prerequisites from reader navigation. M25/M26 remain
          preview/evidence-gated; M31–M36 remain private guided-study workbooks.
        </p>
      </section>

      <section className="print-handbook-section" aria-labelledby="handbook-principles-title">
        <h2 id="handbook-principles-title">Learning principles</h2>
        <ul>
          <li>First principles before names: representation, invariant, assumptions, mechanism, cost, and boundary.</li>
          <li>Prediction and confidence before reveal; observation is separated from theorem, model assumption, and inference.</li>
          <li>Understanding, reading, debugging, architecture, and design take priority over typing volume.</li>
          <li>AI-generated code is a visible proposal to inspect, test, review, and defend—not learner evidence by itself.</li>
          <li>No pass/fail framing: the output is a constructive evidence card and next bridge.</li>
        </ul>
      </section>

      <section className="print-handbook-section" aria-labelledby="handbook-schedule-title">
        <h2 id="handbook-schedule-title">Route phases</h2>
        <table>
          <thead><tr><th>Phase</th><th>Modules</th><th>Gate question</th><th>Days</th></tr></thead>
          <tbody>
            {phases.map((phase) => (
              <tr key={phase.id}>
                <th scope="row">{phase.number} · {phase.title}</th>
                <td>{phase.moduleNumbers.map((number) => `M${number}`).join(", ")}</td>
                <td>{phase.gate}</td>
                <td>{phase.schedule.startDay}–{phase.schedule.endDay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="print-handbook-section" aria-labelledby="handbook-projects-title">
        <h2 id="handbook-projects-title">Connected project spine</h2>
        <p>Thirty-six narrow slices feed six cumulative projects; the M26 local capstone integrates their evidence.</p>
        <div className="print-handbook-project-grid">
          {arcProjects.projects.map((project) => (
            <article key={project.id} className="print-handbook-project-card">
              <h3>{project.title}</h3>
              <p><strong>Modules:</strong> {project.moduleIds.map((moduleId) => moduleId.toUpperCase()).join(", ")}</p>
              <p>{project.premise}</p>
              <p><strong>Architecture:</strong> {project.architecture}</p>
            </article>
          ))}
        </div>
        <aside className="print-studio-companion">
          <p className="kicker">Evidence-gated local capstone</p>
          <h3>{arcProjects.capstone.title}</h3>
          <p>{arcProjects.capstone.premise}</p>
          <ul>{arcProjects.capstone.definitionOfDone.map((item) => <li key={item}>{item}</li>)}</ul>
        </aside>
      </section>

      <section className="print-handbook-section" aria-labelledby="handbook-chat-title">
        <h2 id="handbook-chat-title">The two designated Codex chats</h2>
        <div className="print-handbook-role-grid">
          <article className="print-handbook-role-card">
            <h3>Teaching Assistant</h3>
            <p>Live first-principles lecture, bounded code walk-through, line-by-line state tracing, changed-premise repair, and constructive oral defense.</p>
            <p><strong>Session rhythm:</strong> motivate → predict/confidence → show → trace → change one premise → question → handoff.</p>
          </article>
          <article className="print-handbook-role-card">
            <h3>Study Partner</h3>
            <p>AI pair-programming collaborator who writes visible incremental patches after the learner states intent, constraints, architecture, and prediction.</p>
            <p><strong>Project rhythm:</strong> design → patch → explain → test/trace honestly → inject failure → debug → review → evidence card.</p>
          </article>
        </div>
        <p className="print-handbook-boundary">
          Use display math, labelled fenced code, diagrams, and prose/ASCII fallbacks as a live whiteboard.
          Records are off by default; only the exact learner phrase “records on” in a designated chat authorizes
          one concise session note, and “end session”, “pause records”, or “off-record” closes that authority.
        </p>
      </section>

      <footer className="print-module-footer">
        <p>Canonical sources: course graph, module teaching-pack registry, and arc-project registry.</p>
        <p>Reference PDF only. The accessible HTML reader and designated Codex chats remain the primary learning surfaces.</p>
      </footer>
    </main>
  );
}
