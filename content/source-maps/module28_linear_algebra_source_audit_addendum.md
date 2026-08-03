# Module 28 — Source-Audit Addendum

**Audit date:** 2026-07-30  
**Scope:** source ownership, claim boundaries, and reuse decisions for the
linear-algebra, numerical-stability, SVD, and PCA material planned for M28.
This is an instructor-facing audit, not learner-facing textbook copy.

## Verdict

Use an original Atlas exposition and visual/model code.  The recommended
academic spine is **MIT 18.06SC** for computational linear algebra, paired with
**Axler's fourth edition** for proof-level finite-dimensional structure, and
**MIT 18.065** for the SVD/PCA/low-rank bridge.  Use Trefethen--Bau and the
online *Fundamentals of Numerical Computation* as **link-only numerical
analysis references**.  NumPy is authoritative for the named Python API and
runtime contract, not for theorems or a cross-platform numerical guarantee.

The central source discipline for M28 is especially important: a statement
about an exact real/complex matrix, a theorem about a finite-dimensional
operator, the behavior of a floating-point algorithm, and output from a
particular NumPy/LAPACK build are four different kinds of evidence.

## Recommended source set

| Role | Owner/source and exact URL | Authoritative scope for Atlas | Reuse decision |
| --- | --- | --- | --- |
| **Computational linear-algebra spine** | Gilbert Strang / MIT OCW, [18.06SC Linear Algebra (Fall 2011)](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/) and its [SVD unit](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/positive-definite-matrices-and-applications/singular-value-decomposition/) | A connected undergraduate sequence through the four fundamental subspaces, rank, least squares/projections, eigenvalues/diagonalization, symmetric positive-definite matrices, SVD, image compression, and pseudoinverses. It is primary evidence of MIT's course design and stated presentations, not a mathematical specification. | MIT OCW identifies its own course material as **CC BY-NC-SA 4.0**. Attribute, mark changes, retain compatible terms, and check each asset for third-party notices. Prefer original Atlas diagrams, prompts, and code; do not treat the linked Strang textbook as automatically covered by OCW's license. |
| **Strang textbook boundary** | Gilbert Strang, [*Introduction to Linear Algebra* official landing page](https://math.mit.edu/~gs/linearalgebra/) | The course's suggested-reading context and terminology. The book sits on a separate site and has its own publisher/edition terms. | **Link/cite only** unless the exact edition and asset grant the needed permission. Do not copy pages, figures, exercise banks, or solution material into Atlas merely because 18.06SC links to it. |
| **Proof and abstract-structure anchor** | Sheldon Axler, [*Linear Algebra Done Right*, fourth edition](https://linear.axler.net/LADR4e.pdf) and [author page](https://linear.axler.net/) | Finite-dimensional vector spaces, subspaces, bases/dimension, linear maps, null/range/rank, inner-product spaces, spectral theorem, SVD, multilinear forms, and tensor products. The author describes it as a second-course text; use selected sections to deepen, not replace, the computational first pass. | The displayed fourth-edition PDF is **CC BY-NC 4.0**. Noncommercial adaptation requires attribution, a license link, and change indication; third-party material can be excluded by its credit line. Since Atlas may later be deployed or reused in a different context, default to links and original exposition rather than importing its prose, figures, or exercises. |
| **Numerical-stability standard** | Lloyd N. Trefethen and David Bau III, [*Numerical Linear Algebra*, 25th Anniversary Edition](https://epubs.siam.org/doi/book/10.1137/1.9781611977165) | The canonical distinction: conditioning concerns sensitivity of the *mathematical problem*; stability concerns perturbation behavior of an *algorithm*. The SIAM record explicitly organizes material around conditioning/stability, QR/least squares, and systems/eigenvalue computation. | **Link-only.** It is a SIAM publication; do not infer an open adaptation right from online metadata or excerpts. Do not reproduce its prose, diagrams, MATLAB, exercises, or solutions. |
| **Freely readable numerical companion, with a narrow license boundary** | Tobin A. Driscoll and Richard J. Braun, [*Fundamentals of Numerical Computation* online editions](https://fncbook.com/), [Python edition](https://fncbook.com/python/), and [SIAM front matter/license boundary](https://epubs.siam.org/doi/pdf/10.1137/1.9781611975086.fm?download=true) | A current online route for linear systems, overdetermined least squares, matrix analysis, Krylov methods, and numerical experiments. It supports a Python-oriented stability laboratory after the conceptual model is stated. | **Link-only for text and figures by default.** The SIAM front matter distinguishes CC BY-SA exercises from other copyrighted material; a free web edition is not blanket permission to adapt the whole work. The separate [Python package](https://pypi.org/project/fncbook/) may be MIT-licensed, but that does not license the textbook text. |
| **Python implementation contract** | NumPy Developers: [`numpy.linalg`](https://numpy.org/doc/stable/reference/routines.linalg.html), [`svd`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html), [`lstsq`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html), [`eigh`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.eigh.html), [`cond`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.cond.html), [`finfo`](https://numpy.org/doc/stable/reference/generated/numpy.finfo.html), and [`einsum`](https://numpy.org/doc/stable/reference/generated/numpy.einsum.html) | The documented behavior, parameter shapes, return values, and named implementation notes for the installed/versioned NumPy API. In particular, these links support code-reading tasks about SVD, least squares, Hermitian eigensolvers, condition-number experiments, floating-point limits, and array contraction notation. | NumPy's project license is [BSD 3-clause](https://numpy.org/doc/stable/license.html). Cite the precise docs/version and retain required notices if redistributing NumPy code. Atlas should still use original explanatory prose and fixtures; documentation is not a theorem source, and third-party examples/assets need their own review. |
| **SVD, low-rank approximation, and PCA bridge** | Gilbert Strang / MIT OCW, [18.065 *Matrix Methods in Data Analysis, Signal Processing, and Machine Learning*](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/) and [Eckart--Young/PCA lecture transcript](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/70996912a170cf9c6ebb018f03c1fc85_Y4f7K9XF04k.pdf) | An explicit university source connecting truncated SVD, best rank-\(k\) approximation under named matrix norms, centered data, covariance, and PCA. It is the main curriculum anchor for deriving both the low-rank and variance views rather than presenting PCA as an API recipe. | Treat as MIT OCW **CC BY-NC-SA 4.0** material subject to exact-asset/third-party checks. Link and make Atlas's proof, data, diagrams, and diagnostic original. The theorem must retain its matrix/norm/rank hypotheses. |
| **PCA algorithm cross-check** | Stanford CS229, Carlos Guestrin, [PCA lecture slides (2022)](https://cs229.stanford.edu/notes2022fall/pca.pdf) and [official handout index](https://cs229.stanford.edu/materials.html-full) | A second university presentation of centering, covariance/eigenvectors, reconstruction error, and SVD-based PCA. It is useful for checking that the Atlas derivation exposes both optimization views. | **Link-only.** The slides carry a copyright notice and do not state an adaptation license. Do not reproduce their figures, slides, datasets, or question wording. |

## Claim boundaries that the M28 workbook must preserve

| Topic | Safe learner-facing statement | Required condition, counterexample, or evidence label |
| --- | --- | --- |
| Vector spaces, bases, rank, and subspaces | Definitions and finite-dimensional theorems apply over the declared field and to the stated map/matrix representation. | A list of vectors that happens to be independent in one coordinate system is not a statement about an unspecified data encoding; distinguish a linear map from its matrix in a chosen pair of bases. |
| Orthogonality, projection, and least squares | Orthogonal projection minimizes Euclidean distance to a specified subspace; least-squares claims need the norm, feasible set, and rank/rank-deficiency handling stated. | Normal equations are a derivation, not automatically the numerically preferred computation. A non-unique rank-deficient problem needs a named solution convention (for example, minimum norm). |
| Eigenvalues, diagonalization, PSD, and spectral theorem | State real/complex field, finite dimension, and self-adjoint/symmetric or normal hypothesis before claiming an orthonormal eigenbasis. | A square matrix can fail to diagonalize; a symmetric-looking *computed* array needs a tolerance/model decision before it qualifies as an exact symmetric mathematical matrix. |
| SVD and low-rank approximation | Every finite real/complex matrix has an SVD. A best rank-\(k\) statement must name the norm and use the appropriate singular-value ordering/tie boundary. | A truncated SVD is a lossy representation, not evidence that discarded directions are noise, fair to discard, or causally irrelevant. |
| PCA | PCA's variance-maximization and reconstruction-error forms depend on a stated centering convention, inner product/metric, and data orientation. The SVD route is a computational realization of the centered-data problem. | Scaling units/features can change components; PCA identifies directions of variation, not causal variables, classes, or a validated downstream model. Explain the distinction between sample covariance and population claims. |
| Conditioning and stability | Conditioning is sensitivity of the posed problem; stability is behavior of a chosen finite-precision algorithm. | A small residual is not by itself a small forward error for an ill-conditioned problem. A condition number is norm-, scaling-, and representation-dependent. |
| NumPy and finite precision | A NumPy trace establishes behavior for the named library version, dtype, backend, inputs, and platform. `finfo` exposes properties of a dtype; `linalg` APIs expose their documented contract. | It is neither a proof of a theorem nor a guarantee about all BLAS/LAPACK builds, dtypes, hardware, future versions, or application data. Record dtype, shape, rcond/tolerance, and comparison norm in every numerical experiment. |
| Tensor/matrix calculus notation | Array contraction and tensor products should be defined by index/shape semantics before a shorthand such as `einsum`; finite-dimensional matrix derivatives require a declared scalar objective and perturbation convention. | Do not confuse a NumPy axis operation with an abstract tensor-product theorem, or a symbolic gradient with a stable/efficient autodiff implementation. M29/M31 deepen calculus and optimization assumptions. |

## Minimum source routing for the six sessions

| Session purpose | Default evidence source | Atlas-specific learning move |
| --- | --- | --- |
| 1 — spaces, maps, four subspaces | MIT 18.06SC + Axler | Translate an API/data transformation into a linear-map claim, then separate the chosen basis from the map. |
| 2 — inner products, projection, least squares | MIT 18.06SC + NumPy `lstsq` | Derive a projection condition, read a least-squares implementation, and explain why normal equations and a numerical solver are different claims. |
| 3 — eigensystems, symmetric/PSD, spectral theorem | Axler + MIT 18.06SC | Repair a false diagonalization argument by identifying its missing hypothesis. |
| 4 — SVD, low-rank, conditioning, stability | MIT 18.06SC + MIT 18.065 + Trefethen--Bau + FNC (link-only) + NumPy `svd`/`cond`/`finfo` | Predict what truncation removes, compare a near-dependent fixture and solver story, then state what the experiment cannot establish. |
| 5 — tensors, matrix calculus, code contract | Axler + NumPy `einsum`/`finfo` | Derive one Frobenius-gradient line and narrate axes, shapes, dtypes, and the objective in unfamiliar code. |
| 6 — PCA dual derivation and dossier | MIT 18.065 + Stanford CS229 (link-only) + NumPy `svd` | Derive PCA twice—variance and reconstruction—then test how centering/scaling alters a small dataset. |

## Authoring and release checks

1. Keep **copyrighted books link-only** unless a page-level license permits the exact adaptation. “Free to read,” a university-hosted PDF, and a software repository are not interchangeable permissions.
2. For every reused non-original asset, record owner, exact URL, edition/version,
   access date, license, attribution, modification status, and distribution decision.
   Default to no reuse of external exercise wording, figures, slides, transcripts,
   solutions, or datasets.
3. The M28 reference model should label its output **finite experiment**, expose
   dtype/shape/tolerance choices, avoid a false universal stability verdict, and
   use deliberately ill-conditioned counterexamples alongside benign cases.
4. The PCA studio must show both derivations, require centering and feature-scale
   decisions, and label the conclusion as representation/compression—not a causal,
   fairness, privacy, or downstream-accuracy guarantee.
5. In the oral defense, require the learner to distinguish: theorem hypothesis,
   algorithm choice, library contract, observed residual/error, and the decision
   they would make if those sources of evidence disagree.

## Evidence language to carry forward

- **Definition/theorem:** true only in the declared field, dimension, norm, and hypotheses.
- **Numerical-analysis claim:** true only for a stated problem, perturbation model, and algorithm.
- **Library/API contract:** true only for the named NumPy version and documented interface.
- **Finite experiment:** reports a particular dtype/backend/input run.
- **AI proposal:** a candidate derivation, proof, implementation, or diagnosis to verify independently.

This distinction is M28's bridge to M29--M36: it keeps a clean SVD identity,
a visually convincing PCA plot, or an AI-generated matrix derivation from being
mistaken for an unrestricted implementation, empirical, or scientific claim.
