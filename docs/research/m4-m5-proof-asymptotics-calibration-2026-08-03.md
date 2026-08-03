# M4–M5 proof and asymptotics calibration — 2026-08-03

## Scope and boundary

This narrow note checks two proposed, small learner-facing upgrades only. The
official MIT routes below were accessed **2026-08-03**. It changes no lesson,
course graph, availability, release state, learner record, or academic claim.
Atlas remains link/cite-only and retains original prose, examples, prompts,
code, diagrams, and diagnostics.

## M4 — arbitrary-edge direct proof

**Learning claim.** Given a route-position function and the premise
\(\forall(a,b)\in E,\;p(a)<p(b)\), the learner can choose an arbitrary edge,
instantiate the universal premise, apply the definition of a backward edge,
and derive that the edge is not backward. A short code-facing variant may then
show why a validator that rejects only \(p(a)\ge p(b)\) cannot reject under
those stated total-route assumptions.

**Source route.** MIT [6.042J's Spring 2015 syllabus](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/syllabus/)
sets rigorous definitions, conclusions, and elementary proof synthesis as
outcomes; its official [readings index](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/pages/readings/)
separately routes *Patterns of Proof*. This is the appropriate introductory
standard for exposing assumption → inference → conclusion, not merely naming
a proof style.

**Decision: adapted, small gap.** M4 already has a direct-proof label at
`content/modules/04_logic_sets_relations_graphs_proof.md:366–372`, but its
example is a definition restatement. Add one predict-then-reveal arbitrary-edge
micro-proof with the universal-instantiation step labelled. Do not expand M4
into a full discrete-mathematics proof set.

## M5 — instantiated \(\Theta\)-bound proof

**Learning claim.** Under M5's stated all-distinct, equality-comparison model,
the learner can derive the exact count \(f(n)=n(n-1)/2\) and, for \(n\ge2\),
show

\[
\frac14n^2 \le f(n) \le \frac12n^2,
\]

then identify lower/upper constants \(c_1=1/4\), \(c_2=1/2\), and
\(n_0=2\). This establishes \(f\in\Theta(n^2)\) for that model; it does not
make a wall-clock, hash-table, or universal program-performance claim.

**Source route.** MIT [6.006 Recitation 1: Asymptotic Notation](https://live.ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/c6d8f06c6f11e3342633dec85498f551_MIT6_006S20_r01.pdf)
defines \(O\), \(\Omega\), and \(\Theta\) with positive constants and a
threshold. MIT [6.046J's syllabus](https://www.ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/syllabus/)
then treats rigorous correctness proofs and asymptotic running-time analysis as
advanced outcomes while presupposing 6.006 and 6.042J.

**Decision: adapted, small gap.** M5 already gives the exact count and says it
has constant-factor upper/lower bounds (`content/modules/05_cost_models_algorithm_analysis.md:174–180`), but does not instantiate them; its formal definition appears later. Add this four-line bound as a prediction-before-reveal checkpoint. It makes M4's quantified reasoning operational before M6 without importing 6.046J-level algorithm-design scope.

## Reuse boundary

These MIT pages calibrate intellectual standards and provide learner links.
They do not authorize copying their prose, lecture notes, exercises, figures,
solutions, recordings, or assessments. Any future exact reuse requires a
separate license, attribution, and academic-integrity review.
