# Module 28 — Linear Algebra, Numerical Stability & Representation: Source Map

## Document status

- **Purpose:** source, claim, licensing, and teaching map for the M28 workbook,
  Linear Algebra & Stability Studio, diagnostics, representation dossier,
  bounded Python teaching model, oral defense, TA/Study Partner routines, and
  first mathematical mastery gate after M27.
- **Course position:** M28 follows both M17's execution/floating-point
  representation boundary and M27's formal proof boundary. It provides the
  linear-map, geometry, decomposition, and numerical-evidence vocabulary
  needed by M29–M32 and M35–M36. In the learner route it comes after M17 and
  before M18, even though its stable release ID is 28.
- **Research snapshot:** **2026-07-30**. Exact URLs, editions, licenses, and
  API behavior must be rechecked if an external asset, a library version, or a
  quotation is reused.
- **Pacing recheck:** **2026-08-03**. The current MIT 18.06SC, MIT 18.335J,
  and MIT 18.065 calibration, source links, and reuse boundary are recorded in
  the [M27–M28 core-trace pacing note](../../docs/research/m27-m28-core-trace-pacing-calibration-2026-08-03.md).
  It refines planning and progressive disclosure only; it does not make this
  module a substitute for an undergraduate or graduate course.
- **Reader-first rule:** mathematical difficulty is preserved while the path is
  made visible: formal definition → plain-language model → minimal
  counterexample/boundary → derivation or trace → computation/library
  boundary → design transfer. A visualization earns attention, never replaces
  a proof or a numerical error analysis.
- **Copyright boundary:** Atlas prose, diagrams, code-reading cases, data
  fixtures, counterexamples, diagnostics, proof repairs, project briefs, and
  studio designs are original. Link to and narrowly paraphrase external
  sources. Do not copy substantial text, figures, slides, transcripts,
  exercises, solutions, datasets, or source code unless the exact asset's
  license and downstream distribution obligations have been checked.

This is an instructor-facing evidence record, not a learner-facing substitute
for a textbook or a claim that one course page owns every theorem.

---

## Executive teaching decision

Linear algebra becomes disconnected when it is taught as a sequence of matrix
procedures: row-reduce, invert, take eigenvalues, call SVD, press a PCA button.
That approach hides the object that connects those procedures: a linear map
between declared spaces, represented by a matrix after coordinate choices, and
implemented through finite-precision algorithms whose outputs have a sharply
bounded evidential meaning.

M28 instead builds this chain:

~~~text
declared field, vector spaces, and coordinate convention
    → span, basis, dimension, linear map, kernel/image/rank
    → inner product, norm, orthogonality, projection, least-squares objective
    → symmetric/self-adjoint structure, PSD quadratic forms, spectral theorem
    → SVD, rank-k approximation, singular directions and loss boundary
    → conditioning versus algorithmic stability under finite precision
    → tensor/shape contract and matrix-calculus derivation
    → PCA as both variance maximization and low-rank reconstruction
    → representation decision with data, human-impact, and evidence boundaries
~~~

### Required M28 invariant

> **A matrix result is trustworthy only after the objects, coordinate
> convention, inner product, assumptions, and error model are named. A theorem
> about an exact linear map, a finite-precision algorithm, a library call, and
> a fitted data set are different kinds of evidence.**

This is a course-design contract. It does not claim that all real data are
linear, a low-rank factorization reveals causes, a library output is exact,
every singular direction is meaningful, or an accelerated six-session pass
produces durable numerical-analysis fluency.

### Evidence hierarchy

| Rank | Evidence type | It may support | It cannot settle alone |
| --- | --- | --- | --- |
| 1 | Stated definitions plus a checked proof/theorem under hypotheses | An exact finite-dimensional result in the declared field/norm/model. | Whether the data/model assumptions hold, code implements it, or a learner can reconstruct it. |
| 2 | Author-maintained open text and first-party university material | A coherent undergraduate sequence, notation, derivation route, and pedagogical scope. | A universal canonical sequence or an automatic right to reuse every asset. |
| 3 | Numerical-analysis source with algorithm/error statement | Conditioning/stability vocabulary and a specified algorithmic result. | Behavior of a different library, dtype, problem scale, or data model. |
| 4 | Official NumPy documentation | Named API shapes, parameters, return values, documented algorithms, and dtype facilities. | A theorem, a data/causal claim, numerical guarantees across all backends, or an appropriate representation. |
| 5 | Finite model, notebook, visualizer, or benchmark | What happened for named data, tolerance, dtype, platform, implementation, and run. | Universal mathematical result, optimality beyond the named loss, or deployment safety. |
| 6 | AI-generated derivation/code/review | A candidate to trace, refute, or verify. | Authority, accurate citation, proof, test evidence, or a permission to skip human judgment. |

---

## Coverage ledger: every required topic has a source-backed learning move

| Required area | Formal nucleus | Open / primary route | Mandatory learning move | Implementation / evidence boundary |
| --- | --- | --- | --- | --- |
| Vector spaces, subspaces, bases, dimension, independence | Field; addition/scalar operations; subspace closure; span; independence; basis; finite dimension. | S01, S02 | Construct an affine non-subspace and a dependent spanning list; explain a basis in coordinates. | A Python list/array is not automatically a vector space or a semantic feature model. |
| Linear maps; rank, null, column spaces | (T(\alpha u+\beta v)=\alpha T(u)+\beta T(v)); kernel/image; rank-nullity. | S01, S02 | Draw input/output/ker/image; RREF a small exact fixture; build column-space basis from original pivot columns. | Row operations preserve solution sets, not literal original column space; numerical rank depends on tolerance. |
| Inner products, norms, orthogonality | Bilinear/symmetric/positive definite inner product; induced norm and distance. | S01, S02 | Name the metric before “closest”; construct a symmetric bilinear form that is not positive definite. | Feature scales/units/weights change geometry and therefore a fit or PCA direction. |
| Projection and least squares | Orthogonal residual; (\min_x\|Ax-b\|_2^2); normal equation; uniqueness conditions. | S01, S05, S06 | Derive residual orthogonality using a directional derivative; audit a normal-equation/inverse implementation. | Normal equations are a derivation, not a default stable algorithm; rank deficiency needs a solution convention. |
| Eigenstructure and diagonalization | (Av=\lambda v); eigenbasis; diagonalization; repeated-eigenvalue boundary. | S01, S02 | Produce a Jordan-block counterexample; distinguish matrix claim from an eigenvalue API call. | Not every square matrix diagonalizes; finite numeric eigenvectors need residual/tolerance interpretation. |
| Symmetric/PSD matrices and spectral theorem | Symmetry/self-adjointness; quadratic form; PSD/PD; orthogonal diagonalization. | S01, S02, S06 | Prove (A^\mathsf TA\) PSD; repair a false “symmetric implies invertible” argument. | Exact symmetry vs approximate array needs an explicit tolerance/model choice. |
| SVD and low-rank approximation | (A=U\Sigma V^\mathsf T); singular values; truncation; Frobenius/spectral norms; rank-k theorem. | S01, S03, S06 | Predict lost directions; calculate small SVD fixture; name norm/loss and tie boundary. | A truncated SVD is compression under a specific loss—not noise/cause/fairness/relevance evidence. |
| Conditioning and numerical stability | Norm-dependent condition number; backward/forward error; stable algorithm vs sensitive problem. | S04, S05, S06 | Contrast near-dependent columns and a benign system; state dtype/tolerance/residual and what cannot be inferred. | Small residual does not ensure small forward error; problem conditioning is not an algorithm diagnosis. |
| Matrix calculus and tensor operations | Shape/index contract; Frobenius inner product; differential; gradient of scalar objective. | S02, S06 | Derive (\nabla_X\tfrac12\|XW-Y\|_F^2); narrate every dimension of a batched operation. | An autodiff gradient is correct only for the graph/objective supplied; shape compatibility is not semantics. |
| PCA from two derivations | Centered data convention; covariance/Gram geometry; Rayleigh quotient; truncated SVD/Eckart–Young–Mirsky. | S03, S07, S06 | Derive first component by variance and rank-k reconstruction; show centering/scale counterexamples. | Components are directions of variation/reconstruction loss, not causal variables or downstream-model validation. |

### Deliberate exclusions and handoffs

- M28 treats finite-dimensional real linear algebra with enough complex/Hermitian
  vocabulary to prevent false generalization. It does not claim a complete
  course in abstract algebra, functional analysis, measure theory, or operator
  theory.
- M29 owns multivariable calculus, limits, Jacobians/Hessians as continuous
  approximations, and analytic interchange conditions. M28 provides only the
  differential notation and shape discipline needed to read the bridge.
- M30 owns probability, sampling, covariance-as-estimate, inference, and
  uncertainty. M28 may use a centered data matrix but does not treat empirical
  covariance as a population statement.
- M31 owns constrained/convex/nonconvex optimization, convergence rates, and
  information theory. M28 derives least squares/PCA objectives and names
  numerical boundaries; it does not silently teach optimization theory.
- M32 owns array layout, autodiff engines, GPU/mixed-precision runtime,
  profiling, distributed data parallelism, and production scientific Python.
  M28 makes data shape/dtype/tolerance a conceptual contract, not a runtime
  performance course.
- M35 owns statistical/ML evaluation, distribution shift, representation
  evaluation, and model governance. M28 explicitly rejects PCA-as-importance
  or PCA-as-causal-explanation shortcuts.

---

## Source cards

The labels below distinguish a source being first-party to its own material
from it being original research authority for a theorem. Mathematical theorem
use remains contingent on the exact statement and hypotheses.

### S01 — MIT 18.06SC, *Linear Algebra* (Fall 2011)

- **Owner/status:** Massachusetts Institute of Technology OpenCourseWare;
  first-party university course publication and an undergraduate computational
  linear-algebra spine.
- **URLs:**
  - [course home](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/)
  - [course syllabus](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/syllabus/)
  - [four fundamental subspaces](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/ax-b-and-the-four-subspaces/the-four-fundamental-subspaces/)
  - [least squares and projections](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/least-squares-determinants-and-eigenvalues/projection-matrices-and-least-squares/)
  - [singular value decomposition](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/positive-definite-matrices-and-applications/singular-value-decomposition/)
  - [MIT OCW terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)
- **Evidence class:** primary for MIT's curriculum/learning sequence and its
  own explanatory artifacts; not a formal mathematical specification.
- **Supports:** a connected route through spaces, matrices, the four subspaces,
  orthogonality/projections, least squares, positive-definite structure,
  eigenvalues/diagonalization, SVD, and applications.
- **Course use:** M28's computational sequence. Link selected material as
  optional reading; make Atlas diagrams, proof repairs, data fixtures, and
  prompts original.
- **Reuse/license:** MIT OCW identifies its own course material as CC BY-NC-SA
  4.0, subject to item-specific/third-party notices. Attribute, mark changes,
  and check each asset before reuse. The linked Strang textbook is not
  automatically an OCW-licensed asset. Default: link + original paraphrase.
- **Claim boundary:** prestigious sequence is evidence of a strong standard,
  not proof of mastery in six sessions or a reason to suppress theorem
  hypotheses.

### S02 — Sheldon Axler, *Linear Algebra Done Right*, fourth edition

- **Owner/status:** author-maintained text and author page; primary to Axler's
  exposition, a proof-aware second-course-level anchor.
- **URLs:**
  - [author site](https://linear.axler.net/)
  - [fourth-edition PDF](https://linear.axler.net/LADR4e.pdf)
- **Evidence class:** primary to the author’s exposition, not original research
  authority for every standard theorem it teaches.
- **Supports:** vector spaces/subspaces/bases/dimension, linear maps,
  null/range/rank, inner-product spaces, spectral theorem, SVD, multilinear
  forms, and tensor products.
- **Course use:** strengthen proof definitions and theorem boundaries in
  Sessions 1–5. Do not make it the pacing standard for a first linear-algebra
  pass.
- **Reuse/license:** the displayed fourth-edition PDF states CC BY-NC 4.0.
  Attribution, noncommercial use, license link, and indication of changes are
  required for adaptation; third-party credit lines can impose separate limits.
  Since Atlas is intended to remain deployable under uncertain future
  distribution, default to link-only/original material rather than importing
  prose, figures, or exercises.
- **Claim boundary:** a text's proof exposition does not show a learner can
  reproduce an argument or that a numerical implementation is stable.

### S03 — MIT 18.065, *Matrix Methods in Data Analysis, Signal Processing, and Machine Learning* (Spring 2018)

- **Owner/status:** MIT OpenCourseWare; first-party university course
  publication bridging linear algebra, SVD, data analysis, and ML.
- **URLs:**
  - [course home](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/)
  - [course calendar](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/pages/calendar/)
  - [Eckart–Young/PCA lecture transcript](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/70996912a170cf9c6ebb018f03c1fc85_Y4f7K9XF04k.pdf)
  - [MIT OCW terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)
- **Evidence class:** primary for MIT's course scope/lectures; excellent
  university anchor for low-rank approximation, centered data, covariance, and
  PCA connection.
- **Supports:** SVD, singular directions, Eckart–Young-style rank-k result
  under named norms, PCA, signal/image compression, and matrix methods in data
  analysis.
- **Course use:** Sessions 4 and 6; require the learner to derive both PCA
  objectives and reject semantic-importance overclaims.
- **Reuse/license:** OCW CC BY-NC-SA framework, subject to asset-specific and
  third-party rights. Link only; make Atlas visual/derivation/question wording
  original.
- **Claim boundary:** a small reconstructed image/data set is evidence of a
  named loss on a named matrix, not a data-governance or downstream-quality
  proof.

### S04 — Trefethen and Bau, *Numerical Linear Algebra*, 25th Anniversary Edition

- **Owner/status:** SIAM publication; canonical numerical-linear-algebra
  reference, not an open teaching asset.
- **URL:** [SIAM book record](https://epubs.siam.org/doi/book/10.1137/1.9781611977165)
- **Evidence class:** respected standard/reference for the distinction between
  conditioning (problem sensitivity) and stability (algorithm perturbation),
  and for QR/least-squares/eigenvalue computation context.
- **Supports:** precise conceptual vocabulary and source-map standard; not a
  course asset to reproduce.
- **Reuse/license:** **link-only.** Do not copy prose, diagrams, MATLAB,
  exercises, solutions, or excerpts based on metadata or access to a preview.
- **Claim boundary:** a source about a named algorithm does not license an
  implementation claim about a different backend/dtype/machine.

### S05 — Driscoll and Braun, *Fundamentals of Numerical Computation*

- **Owner/status:** author/SIAM online numerical-computation companion with
  Python edition; a useful openly readable route whose asset permissions are
  not uniform.
- **URLs:**
  - [book home](https://fncbook.com/)
  - [Python edition](https://fncbook.com/python/)
  - [front matter/license boundary](https://epubs.siam.org/doi/pdf/10.1137/1.9781611975086.fm?download=true)
  - [Python package](https://pypi.org/project/fncbook/)
- **Evidence class:** source for numerical experiments/overdetermined systems
  and a Python-oriented reading path.
- **Supports:** matrix analysis, least squares, linear systems, Krylov context,
  numerical examples, and language for reproducible numerical experiments.
- **Reuse/license:** default **link-only** for text/figures. SIAM front matter
  distinguishes CC BY-SA exercises from other copyrighted material; a free web
  edition is not blanket adaptation permission. The separate package's license
  does not license textbook prose/figures.
- **Claim boundary:** a numerical demonstration is neither a theorem nor a
  hardware-independent library guarantee.

### S06 — NumPy linear algebra, dtype, broadcasting, and contraction documentation

- **Owner/status:** NumPy Developers; first-party API documentation.
- **URLs:**
  - [`numpy.linalg` overview](https://numpy.org/doc/stable/reference/routines.linalg.html)
  - [`numpy.linalg.svd`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html)
  - [`numpy.linalg.lstsq`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html)
  - [`numpy.linalg.eigh`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.eigh.html)
  - [`numpy.linalg.cond`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.cond.html)
  - [`numpy.finfo`](https://numpy.org/doc/stable/reference/generated/numpy.finfo.html)
  - [broadcasting guide](https://numpy.org/doc/stable/user/basics.broadcasting.html)
  - [`numpy.einsum`](https://numpy.org/doc/stable/reference/generated/numpy.einsum.html)
  - [NumPy license](https://numpy.org/doc/stable/license.html)
- **Evidence class:** primary/official for named API surface, argument/shape
  rules, dtype inquiries, and documented call behavior.
- **Supports:** code-reading tasks about `lstsq`, SVD, Hermitian eigensolvers,
  condition-number experiments, broadcasting, contraction notation, and
  floating-point `finfo` boundaries.
- **Reuse/license:** NumPy is BSD 3-Clause. Retain necessary notices if actual
  NumPy code is redistributed; still use original Atlas fixtures/explanations
  and check third-party examples/assets separately.
- **Claim boundary:** API docs are not authority for a theorem, causal/data
  claim, cross-platform accuracy, or an appropriate representation/scale.

### S07 — Stanford CS229 PCA slides and index

- **Owner/status:** Stanford university course publication / Carlos Guestrin
  course material; a cross-check for PCA exposition, not an adaptation source.
- **URLs:**
  - [materials index](https://cs229.stanford.edu/materials.html-full)
  - [PCA slides](https://cs229.stanford.edu/notes2022fall/pca.pdf)
- **Evidence class:** first-party university course material for its own
  presentation of centering, covariance/eigenvectors, reconstruction error,
  and SVD PCA.
- **Supports:** checking that Atlas's two PCA derivations remain connected and
  communicate the centering/reconstruction boundary.
- **Reuse/license:** **link-only.** The slides carry copyright notice without
  an adaptation license; do not reuse figures, slide layouts, examples,
  datasets, or question wording.
- **Claim boundary:** a course slide's PCA example does not validate a
  downstream ML model or a data-collection decision.

---

## Source-to-session authoring route

| M28 session | Main source set | Atlas-specific reader-first move | Essential boundary |
| --- | --- | --- | --- |
| 1 — spaces, maps, rank/nullity | S01 + S02 | Translate a feature transformation into a linear-map card; contrast a subspace and affine set; trace original pivot columns. | Matrix entries are basis-dependent; numerical rank/tolerance differs from exact rank. |
| 2 — inner product, projection, least squares | S01 + S02 + S06 | Derive residual orthogonality from a perturbation; inspect `lstsq` versus inverse/normal-equations code. | “Closest” requires a norm/scale; rank-deficient coefficients need a convention. |
| 3 — eigenstructure, symmetric/PSD, spectral theorem | S01 + S02 + S06 | Repair a diagonalization proof; test a small PSD quadratic form after naming symmetry/tolerance. | General square matrices can fail to diagonalize; a numerical eigen call is not exact proof. |
| 4 — SVD, low rank, conditioning, stability | S01 + S03 + S04 + S05 + S06 | Predict a lost direction; compare a near-dependent fixture and solver story; name norm/tail loss. | Truncation is not semantic importance; conditioning and stability are distinct. |
| 5 — tensors, calculus, code contract | S02 + S06 | Derive one Frobenius-gradient line; narrate axes/shapes/dtypes of unfamiliar code. | Autodiff and broadcasting cannot choose the intended objective/semantics. |
| 6 — PCA dual derivation and dossier | S03 + S07 + S06 | Derive principal direction via Rayleigh quotient and rank-k reconstruction; build uncentered/scale/high-impact counterexamples. | Variance/reconstruction loss is not causality, fairness, relevance, or downstream accuracy. |

### Mapping external material into original Atlas artifacts

| External resource role | Atlas artifact | Reuse decision |
| --- | --- | --- |
| MIT/Axler chapter sequence | Six-session dependency path and optional reading links | Original wording, diagrams, and exercises. |
| Theorem statement / proof route | Short original proof idea, hypothesis card, and proof-repair task | Do not copy full proofs or exposition; cite/attribute the reading source. |
| SVD/PCA lecture | Original low-rank/PCA visual with a textual alternative and counterexample panel | No source slide/figure screenshot or transcription. |
| NumPy API documentation | Original code-reading fixtures referring to named documented functions | Use API names/short signatures as needed; no copied docs/tutorial passages. |
| Numerical text example | Newly designed two-by-two/near-dependent synthetic fixture | Do not reuse an exercise/data set without exact permission. |

---

## Claim and numerical-experiment policy

### Required labels in every M28 artifact

1. **Exact theorem:** field, finite dimension, symmetry/normality/rank/norm and
   all other hypotheses must appear near the conclusion.
2. **Derivation:** the objective, variable convention, inner product, and
   perturbation/differential convention must be visible before a gradient or
   normal equation.
3. **Numerical algorithm:** name algorithm family, input representation,
   dtype/precision, pivot/rank/tolerance behavior, and relevant residual/error
   measure.
4. **Library contract:** name API, documented input/output shapes/parameters,
   and version/source; avoid upgrading this to a universal backend claim.
5. **Finite experiment:** record the exact fixture, dtype, tolerance, machine
   context when material, observed output, and non-claim.
6. **AI proposal:** inspect for changed axes, missing norm, implicit inverse,
   rank assumption, false stability claim, and data/human-impact overreach.

### Required numerical experiment record

~~~text
Question and mathematical model:
Matrix/data fixture and declared orientation:
Exact or approximate arithmetic:
dtype, library/version, solver/algorithm, tolerance/rcond:
Norm/residual/condition quantity reported:
Observed result:
What changes under a small perturbation:
What this experiment does not establish:
Decision it may and may not inform:
~~~

### M28 claims to explicitly reject

- “An array with more columns has more independent information.”
- “Row reduction gives literal original column-space vectors.”
- “Symmetric implies invertible/positive definite.”
- “Every square matrix has an orthonormal eigenbasis.”
- “A normal-equation formula is the numerically safest least-squares solver.”
- “A small residual proves the coefficient error is small.”
- “A condition number proves an algorithm is bad.”
- “Backward stable means accurate for every input.”
- “SVD/PCA discovers what matters, causes outcomes, or proves fairness.”
- “Feature variance is a human-impact priority.”
- “Broadcasting and an autodiff gradient prove a tensor pipeline is correct.”
- “One NumPy run establishes a theorem or cross-platform performance claim.”

---

## Licensing, attribution, and release checklist

1. For every non-original asset, record owner, exact URL, edition/version,
   access date, license, attribution wording, modification status, and
   distribution decision before committing it.
2. Treat “open course page,” “free PDF,” “source repository,” “CC license,”
   and “software license” as different facts. Verify at the specific asset,
   not merely the course/book landing page.
3. Keep Strang textbook pages, Trefethen–Bau, FNC text/figures, Stanford slides,
   and any non-clearly licensed external exercise/figure **link-only** unless
   exact permission/reuse conditions are verified.
4. For CC BY-NC or CC BY-NC-SA material, do not assume compatibility with every
   future Atlas distribution. Prefer original content even when attribution
   would be possible.
5. If redistributing NumPy code, retain BSD notices required by the exact code
   and review third-party attributions. Course use of an API name does not
   automatically create a derivative work.
6. The portal must not collect personal matrices, raw voice, raw oral-defense
   transcripts, credentials, or private Notion records. Synthetic local
   fixtures are default.
7. The studio must retain a text alternative for every visual, keyboard
   interaction, visible focus, reduced-motion behavior, and prediction before
   explanation.
8. The reference model must visibly label exact/finite/approximate boundaries;
   cap input sizes; avoid network, subprocess, unsafe deserialization, or
   hidden external data; and test the boundary cases it teaches.
9. Before release, run lint, portal build/tests, all reference-model tests,
   generated-content/link/math validation, and a review that M28 links only to
   published prerequisites in its learner route.
10. The oral-defense/Notion record must store an approved short evidence summary
    only—never raw voice or more transcript than needed for the learning record.

### Instructor decision rule

Before accepting an M28 conclusion, ask: **Which exact map, coordinates,
metric, theorem/algorithm/API, data convention, and error boundary make this
sentence true? What is the smallest counterexample when one is removed?**
