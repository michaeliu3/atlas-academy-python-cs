# M31 source recheck — 2026-08-01

**Scope:** a deliberately small, official-source recheck for a possible M31
review candidate. It checks calibration and reuse boundaries only; it does not
re-review every derivation, change the workbook, or provide release evidence.
M31 remains **authoring-only**.

## Official calibration sources accessed

| Source | Narrow use for M31 | Scope boundary |
| --- | --- | --- |
| MIT OCW [6.251J syllabus](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/pages/syllabus/) and [lecture-note index](https://ocw.mit.edu/courses/6-251j-introduction-to-mathematical-programming-fall-2009/pages/lecture-notes/) | Calibrates Sessions 1–4: formulation, feasible-set geometry, duality, sensitivity, and algorithmic mathematical-programming context. | It is a graduate, full-term course with simplex, robust/large-scale/network, ellipsoid, interior-point, semidefinite, and discrete optimization. M31 is a foundation for reading and qualifying claims, not a substitute for that scope or workload. |
| Stanford [EE364a — Convex Optimization I](https://web.stanford.edu/class/ee364a/) and [lecture route](https://web.stanford.edu/class/ee364a/lectures.html) | Calibrates the convex sequence: convex sets/functions/problems, least squares/LP/QP/SDP, optimality conditions, duality, DCP, and computation under named assumptions. Its stated linear-algebra, probability, and elementary-Python prerequisites support the M28/M30 components of M31's bridge. | The course is an independent offering with weekly homework and formal assessment; Atlas does not claim the same instruction, assessment, credit, or outcomes. Its broader applications and full slides are references, not Atlas content. |
| MIT OCW [6.441 syllabus](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/syllabus/) and [lecture-note index](https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/) | Calibrates Session 6's entropy, divergence, mutual information, variational-characterization, and bounded rate-distortion vocabulary. It confirms that proof and probability prerequisites matter. | It is a graduate information-theory course spanning compression, testing, channel coding, and rate-distortion theorems. M31's information segment is intentionally a bridge, not an information-theory sequence or coding-theorem substitute. |

The recheck agrees with the existing [M31 source map](../../content/source-maps/module31_optimization_information_source_map.md), [source audit](../../content/source-maps/module31_optimization_information_source_audit.md), and [focused math audit](m31-m36-math-proof-audit.md): M31's connected progression—formulation → geometry/conditions → duality/certificates → finite algorithm evidence → stochastic limits → information/approximation limits—is appropriate as an original, bounded adaptation.

## Claim and reuse boundaries

- MIT 6.251J is the formulation/duality anchor, not evidence for a general
  nonconvex or all-purpose solver claim. Stanford EE364a is the convex-analysis
  anchor; its course page explicitly frames the broader convex catalogue and
  course prerequisites. MIT 6.441 is the information-theory anchor.
- MIT OCW's course pages link to **CC BY-NC-SA 4.0**, but a course-level link
  does not clear every included asset; 6.251J's own note index identifies at
  least one item used with separate permission. Continue with the existing
  link/cite and independently authored Atlas-material rule unless an exact
  asset has a separate review.
- The Stanford course page exposes slides and a separately copyrighted
  textbook without a blanket course-asset license. Continue to treat Stanford
  material as **link-only**: no copying slides, problems, solutions, figures,
  layouts, or distinctive worked examples.
- MIT 6.441 supports information-measure and rate-distortion calibration. The
  ELBO-specific basis remains the separately cited variational-inference source
  in M31's source map; do not attribute the ELBO identity to 6.441 merely
  because both use divergence language.

## Review result

**No concrete correction to the current M31 workbook or source map is required
from this recheck.** The existing materials already distinguish the three
course roles, name the intentional exclusions, preserve original-authoring and
reuse boundaries, and avoid equivalence claims.

For a future review candidate, retain the precise wording "calibrated against"
or "adapted from the intellectual scope of," never "covers" or "is equivalent
to" 6.251J, EE364a, or 6.441. This note supplies dated source evidence only;
it does not make M31 learner-ready, published, routed, or released.
