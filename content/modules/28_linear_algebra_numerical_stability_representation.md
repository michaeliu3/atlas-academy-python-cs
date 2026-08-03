# Module 28 — Linear Algebra, Numerical Stability & Representation

**Arc VI — Mathematical foundations for algorithms, systems, and AI**

> **Bridge:** M27 made domains, definitions, proof obligations, witnesses, and
> evidence boundaries explicit. M28 asks a complementary question: when a
> program stores an observation as coordinates, what structure survives a
> change of coordinates, a compression, a projection, or a finite-precision
> calculation? Linear algebra is the language for answering that question
> without mistaking an array shape, an attractive plot, or a successful model
> run for the mathematics it may only approximate.

**Primary outcome:** You can model a matrix as a linear map; reason about its
spaces, rank, null directions, geometry, spectrum, and singular values; derive
least squares and PCA from first principles; and distinguish a mathematical
result from a floating-point computation, library contract, data-model choice,
or empirical observation.

This is a rigorous first pass, not a claim that six sessions create durable
linear-algebra fluency or numerical-analysis expertise. The goal is
graduate-reader and applied-design readiness: you can read a derivation,
reconstruct its central steps, name assumptions, recognize an ill-conditioned
or mis-specified computation, and request the evidence needed before accepting
an AI-assisted implementation.

---

## How to study this module

### The working invariant

> **A matrix result is trustworthy only after the objects, coordinate
> convention, inner product, assumptions, and error model are named. A theorem
> about an exact linear map, a finite-precision algorithm, a library call, and
> a fitted data set are different kinds of evidence.**

Keep the phrase *coordinate convention* visible. A row of a NumPy array, a
column vector in a textbook, a batch dimension in a neural network, and a
feature vector can describe the same numbers with different multiplication
rules. Shape alone does not establish semantic meaning.

### Evidence labels

| Label | What it establishes | What it does not establish |
| --- | --- | --- |
| **[DEFINITION / MODEL]** | A vector space, map, norm, matrix factorization, or data convention inside a declared mathematical model. | That production data obey the model or that a chosen coordinate system is meaningful. |
| **[THEOREM / PROOF]** | A conclusion from named hypotheses over exact mathematics. | That a finite algorithm is stable, a library computes it exactly, or the hypotheses fit the data. |
| **[ALGORITHM / NUMERICS]** | A procedure with a stated arithmetic, pivoting, tolerance, and error boundary. | A theorem's exact result, causal interpretation, or robust behavior for every input. |
| **[LIBRARY CONTRACT]** | Documented behavior of a named API/version and its input assumptions. | The intended statistical model, a universal accuracy guarantee, or good conditioning. |
| **[FINITE EXPERIMENT]** | What occurred for named data, machine, dtype, tolerance, and implementation. | A universal identity, stable performance, or valid generalization. |
| **[AI PROPOSAL]** | A candidate derivation, implementation, visualization, or code review worth checking. | Authority, proof, test evidence, or a license to hide assumptions. |

### The six-step learning loop

1. **Name the objects.** What field, space, shape, coordinate convention, and
   inner product are in use?
2. **Predict the geometry.** Which directions survive, disappear, stretch,
   rotate, or become indistinguishable?
3. **Derive before calculating.** Write the optimization or map, then derive
   the equation, projection, or factorization property.
4. **Find a boundary.** Construct a rank-deficient, non-subspace,
   non-orthogonal, ill-conditioned, or uncentered counterexample.
5. **Read the computation.** Trace dimensions, dtype, tolerance, and data
   flow; inspect what a library routine promises and omits.
6. **Transfer the judgment.** Decide how the result changes a search feature,
   signal pipeline, scientific calculation, ML representation, or systems
   design.

Typing is intentionally secondary. You will inspect small arrays and one
bounded teaching model, but most work is reading derivations, drawing spaces,
repairing code or claims, comparing alternatives, and explaining a result.

---

## 1. Position in the knowledge system

### 1.1 What M28 deepens rather than repeats

| Earlier seed | M28 deepening | Why it matters later |
| --- | --- | --- |
| M1–M3 values, objects, functions, and state | A vector is an object in a space; a matrix is a representation of a linear map after bases are chosen. | Array values without a model invite axis, unit, and representation bugs. |
| M4/M27 relations, proof, and functions | A linear map has a domain, codomain, kernel, image, assumptions, and theorem boundary. | Rank-nullity, least squares, spectral reasoning, and formal ML claims need stated maps. |
| M5 asymptotics and cost models | Conditioning and stability add an *accuracy* model to a cost model. | A fast algorithm may still magnify input or rounding error. |
| M6–M11 data structures and algorithms | Coordinate systems, transformations, distance, projections, and low-rank structure explain many algorithmic representations. | Search, graph embeddings, compression, dynamic programming approximations, and similarity require a metric/representation choice. |
| M17/M24 hardware and runtime evidence | Floating-point values, layout, dtype, vectorization, and measurement change an actual computation. | Exact equalities are not a reliable floating-point test; contiguous layout and batching matter in M32. |

### 1.2 Prerequisite and forward map

~~~mermaid
%% atlas-diagram-id: m28-prerequisite-forward-map
%% atlas-diagram-title: M28 prerequisite and conceptual-forward map
%% atlas-diagram-alt: M27 and M17 supply proof and representation foundations for M28; its linear and numerical reasoning then informs M29, M30, M31, M32, M35, and M36, while M25 remains later synthesis rather than a prerequisite.
flowchart LR
    M2["M2: recursion + induction"] --> M27["M27: proof + discrete structures"]
    M4["M4: functions + relations"] --> M27
    M5["M5: cost models"] --> M27
    M27 --> M28["M28: linear maps + numerical evidence"]
    M17["M17: execution, representation + floating point"] --> M28
    M28 --> M29["M29: derivatives, Jacobians, continuous change"]
    M28 --> M30["M30: covariance, probability, inference"]
    M28 --> M31["M31: optimization + information"]
    M28 --> M32["M32: NumPy, autodiff, accelerators"]
    M28 --> M35["M35: representations, PCA, ML"]
    M28 --> M36["M36: learning-theory assumptions"]
    M28 --> M25["M25: evidence-grounded AI synthesis"]
~~~

### 1.3 Entry retrieval

Before continuing, answer in short notes.

1. What makes a function different from a relation, and why must its domain
   be named?
2. What does a proof establish that five passing examples do not?
3. Why can two arrays with shape `(n, d)` mean different things?
4. What kind of claim does an asymptotic cost model leave unresolved?

If 1–2 are fragile, bridge through M27. If 3–4 are fragile, review M1–M5
before treating this module as an API tutorial.

---

## 2. One story: the Atlas representation lab

Atlas has a small, consented, synthetic matrix of study signals. Rows represent
observations and columns represent named features such as retrieval accuracy,
time-to-first-hint, and a deliberately bounded confidence report. The team
wants to compare observations, remove a nuisance direction, compress a view,
and inspect whether a proposed representation is numerically trustworthy.

The team is **not** allowed to infer talent, causes, personality, or a hidden
learner state from these coordinates. This is a representation and
decision-support exercise, not a profiling system.

~~~text
declared rows + declared features + units + missing-data policy
    → matrix X and a chosen inner product / scale
    → linear map, projection, factorization, or approximation
    → numerical algorithm with dtype and tolerance
    → bounded evidence for an Atlas design decision
~~~

### 2.1 Representation card

Use this card before accepting an array, chart, model, or agent-generated
derivation.

~~~text
Objects and field:
Row/column convention and shapes:
Units, scale, and centering policy:
Linear map / objective / factorization:
Theorem or derivation and assumptions:
Numerical algorithm, dtype, tolerance, and condition concern:
Observed evidence:
Boundary / counterexample / non-claim:
Decision that is and is not justified:
~~~

The card prevents two common AI-era failures: a polished explanation that
silently changes `X` from rows-as-observations to columns-as-observations, and
a successful call to `svd` that is mistaken for a scientific claim about the
world.

---

## 3. Session 1 — Vectors, spaces, coordinates, rank, and lost directions

### Pressure

An agent says, “The matrix has three columns, so it stores three independent
pieces of information.” The statement sounds plausible and can be false. Two
columns may encode the same direction, one may be a combination of others, or
the chosen feature scaling may change the geometry we intended to inspect.

### First principle: a vector space is a promise about allowed combinations

**[DEFINITION / MODEL]** A vector space (V) over a field (mathbb F) is a
set of vectors with addition and scalar multiplication satisfying the vector
space axioms: closure, associativity, commutativity of addition, an additive
identity and inverse, distributive laws, scalar compatibility, and scalar
identity. In this module (mathbb F) is usually (mathbb R), but the field
is part of the definition.

Plain language: a space is a collection of allowed displacements for which
adding directions and scaling directions stays meaningful. A raw Python list
is not automatically a vector; its elements, units, operations, and equality
convention must be chosen first.

**[DEFINITION / MODEL]** A subset (W\subseteq V) is a subspace when it
contains (0) and is closed under every linear combination
(\alpha u+\beta v) with (u,v\in W), (\alpha,\beta\in\mathbb F).

**[COUNTEREXAMPLE]** The affine line

\[
L=\{(x,y)\in\mathbb R^2:x+y=1\}
\]

looks line-like but is not a subspace: it excludes (0), and adding two
points of (L) produces a point with coordinate sum (2). “Flat” is not the
same as “subspace”; an affine translation matters.

### 3.1 Definitions: span, independence, basis, and dimension

For vectors (v_1,\ldots,v_k\in V),

\[
\operatorname{span}(v_1,\ldots,v_k)
=\left\{\sum_{i=1}^{k} c_i v_i:c_i\in\mathbb F\right\}.
\]

They are linearly independent when

\[
\sum_{i=1}^{k}c_iv_i=0\quad\Rightarrow\quad c_1=\cdots=c_k=0.
\]

A **basis** is an independent spanning list. In finite dimensions every basis
has the same length, the **dimension**. This theorem is why “number of useful
directions” is not simply the number of features or the number of array
columns.

**Worked contrast.** In (\mathbb R^2), ((1,0),(0,1)) is a basis. The list
((1,0),(0,1),(1,1)) spans the same space but is dependent because

\[
(1,0)+(0,1)-(1,1)=0.
\]

The third coordinate may still be useful in an application—for redundancy,
measurement noise, a non-linear feature transform, or an audit trail—but it
does not create another independent *linear* direction.

### 3.2 Linear maps are the object; matrices are coordinate descriptions

**[DEFINITION / MODEL]** A map (T:V\to W) is linear if

\[
T(\alpha u+\beta v)=\alpha T(u)+\beta T(v).
\]

Once bases are chosen, an (m\times n) matrix (A) represents a map from
(\mathbb R^n\) to (\mathbb R^m), with (x\mapsto Ax) under the column-vector
convention. The map is basis-independent; its entries are not. A different
basis can change the matrix while representing the same underlying map.

~~~text
input-coordinate space R^n -- A --> output-coordinate space R^m
       |                                 |
  kernel directions                 column-space outputs
       |                                 |
  map to zero                     can be produced by A
~~~

**Text equivalent:** A maps an input coordinate vector to an output coordinate
vector. Directions in its kernel disappear. Outputs it can produce form its
column space. The row space records independent input constraints, after a
coordinate convention is fixed.

### 3.3 Four spaces and rank-nullity

For (A\in\mathbb R^{m\times n}):

- (\operatorname{Col}(A)\subseteq\mathbb R^m) is the column space (image);
- (\operatorname{Null}(A)=\{x\in\mathbb R^n:Ax=0\}\) is the null space
  (kernel);
- (\operatorname{Row}(A)\subseteq\mathbb R^n) is the span of row vectors;
- (\operatorname{Null}(A^\mathsf T)\subseteq\mathbb R^m) is the left null
  space.

The rank is the dimension of the column space, equivalently the row space.

**[THEOREM / PROOF] Rank-nullity.** If (T:V\to W) is linear and (V) is
finite-dimensional, then

\[
\dim V=\dim\ker T+\dim\operatorname{im}T.
\]

**Proof idea:** begin with a basis for the kernel, extend it to a basis for
(V), then show images of the extension vectors form a basis for the image.
The theorem applies to the stated finite-dimensional linear map. It does not
say a floating-point `matrix_rank` call has discovered a metaphysical number
of factors; it has applied a tolerance-based numerical criterion.

### 3.4 Row reduction is an equivalence tool, not a semantic rewrite

Elementary row operations preserve the solution set of (Ax=b). They help
identify pivots, rank, and the null space. They do **not** preserve every
geometric object: row operations can change the column space as a subset of
(\mathbb R^m). Use the original pivot columns, not the columns of the
reduced matrix, to build a basis for (\operatorname{Col}(A)).

**[COUNTEREXAMPLE]** If a code review returns pivot columns of reduced row
echelon form as literal columns of the original feature matrix, it may return
vectors in the wrong space. The correct indices come from reduction; the
column-space basis comes from the original matrix at those indices.

### Session 1 code-reading task

Read this sketch without running it.

```python
def independent_feature_columns(matrix):
    reduced, pivots = rref(matrix)
    return [reduced[row][index] for row, index in enumerate(pivots)]
```

1. What is the intended input shape?
2. Why does `reduced[row][index]` return scalar entries rather than columns?
3. Which matrix should supply the basis vectors?
4. What exact arithmetic/tolerance policy does `rref` need before this code
   can claim a numerical rank?

**Repair target:** return columns from the original matrix using pivot *column
indices*, label exact and floating-point modes separately, and make the
feature/observation convention explicit.

---

## 4. Session 2 — Inner products, orthogonality, projection, and least squares

### Pressure

“Closest” is meaningless until a distance is chosen. A model that minimizes
raw seconds, a model that minimizes standardized features, and a model that
minimizes a weighted error may select different fits. The objective is part of
the product and scientific claim.

### 4.1 Inner products create geometry

**[DEFINITION / MODEL]** An inner product on a real vector space is a map
(\langle\cdot,\cdot\rangle:V\times V\to\mathbb R) that is bilinear,
symmetric, and positive definite:

\[
\langle x,x\rangle\ge0,\qquad \langle x,x\rangle=0\iff x=0.
\]

It induces a norm (\lVert x\rVert=\sqrt{\langle x,x\rangle}) and distance
(\lVert x-y\rVert). In standard Euclidean coordinates,
(\langle x,y\rangle=x^\mathsf Ty), but that is a modeling choice. A positive
definite weight matrix (W) can define
(\langle x,y\rangle_W=x^\mathsf TWy).

**[COUNTEREXAMPLE]** The formula (x^\mathsf T\begin{bmatrix}1&0\\0&-1\end{bmatrix}x)
is symmetric and bilinear but not an inner product: ((0,1)) has negative
“squared length.” Symmetry alone is insufficient.

Two vectors are orthogonal when their inner product is zero. Orthogonality is
not coordinate-wise difference, independence, or lack of statistical
association. Those can coincide only under added assumptions.

### 4.2 Orthogonal projection makes the residual visible

Let (S\) be a subspace of a finite-dimensional inner-product space. The
orthogonal projection (p=\operatorname{proj}_S(b)) is the unique vector in
(S) such that (b-p\perp S). If the columns of (Q\in\mathbb R^{m\times r})
are orthonormal and span (S), then

\[
p=QQ^\mathsf Tb,\qquad P=QQ^\mathsf T.
\]

Check the two structural facts rather than memorizing the formula:

\[
P^\mathsf T=P,\qquad P^2=P.
\]

Symmetry tells us the operator is self-adjoint in the Euclidean inner product;
idempotence tells us applying the projection again changes nothing. A matrix
with (P^2=P) but (P\ne P^\mathsf T) is an oblique projection, not generally
the nearest Euclidean projection.

### 4.3 Least squares derives from residual orthogonality

Given (A\in\mathbb R^{m\times n}) and response (b\in\mathbb R^m), least
squares asks for

\[
\min_x f(x)=\tfrac12\lVert Ax-b\rVert_2^2.
\]

Use a directional derivative, not a slogan. Let (r=Ax-b). For a perturbation
(h),

\[
f(x+th)=\tfrac12\lVert r+tAh\rVert_2^2,
\]

so

\[
\frac{d}{dt}f(x+th)\bigg|_{t=0}=h^\mathsf TA^\mathsf Tr.
\]

At a minimizer this is zero for every (h), giving the **normal equations**:

\[
A^\mathsf T A\hat{x}=A^\mathsf Tb.
\]

The geometric reading is more valuable than the formula: the residual
(b-A\hat{x}) is orthogonal to every column of (A). Therefore (A\hat{x})
is the projection of (b) onto (\operatorname{Col}(A)).

**Boundary:** normal equations characterize a minimizer but do not promise
that (A^\mathsf TA) is invertible. If columns are dependent, minimizers may
not be unique. The fitted value (A\hat{x}) is unique, but the coefficients
need not be.

### 4.4 Why `inverse(A.T @ A) @ A.T @ b` is a review smell

For full-column-rank (A), the algebraic expression
((A^\mathsf TA)^{-1}A^\mathsf Tb) exists. It is usually a poor numerical
implementation plan:

- forming (A^\mathsf TA) can square the two-norm condition number;
- explicitly computing an inverse does more work and hides error pathways;
- rank deficiency makes the expression undefined while a least-squares problem
  can still have solutions;
- units, weights, missing-data policy, and outliers remain modeling questions.

QR or SVD-based solvers expose a better computational boundary. Their use is
not magic: inspect the routine's rank cutoff, dtype, returned residuals, and
whether data were centered/scaled as the objective requires.

### Session 2 prediction before reveal

Let

\[
A=\begin{bmatrix}1\\1\\1\end{bmatrix},\quad
b=\begin{bmatrix}0\\1\\3\end{bmatrix}.
\]

Before calculating, predict whether the least-squares residual can be zero.
Then derive the best constant (x) from residual orthogonality:

\(
\sum_i(x-b_i)=0
\).

<details>
<summary>Reveal after writing your prediction.</summary>

**Reveal:** the best constant is the mean (4/3), and the residual is not
zero because (b\notin\operatorname{Col}(A)). This does not say a constant
model is useful; it states which constant is closest under the declared
squared-error geometry.

</details>

---

## 5. Session 3 — Eigenstructure, symmetric maps, PSD matrices, and the spectral theorem

### Pressure

An engineer calls every eigenvector a “principal direction.” That confuses a
general square matrix, a symmetric covariance-like matrix, and the SVD of a
rectangular data matrix. The names overlap; the hypotheses do not.

### 5.1 Eigensystems and diagonalization

**[DEFINITION / MODEL]** For a square matrix (A\), a nonzero vector (v) is
an eigenvector with eigenvalue (\lambda) if

\[
Av=\lambda v.
\]

An (n\times n) matrix is diagonalizable if there is an invertible (S) and
diagonal (D) with (A=SDS^{-1}). Equivalently, it has a basis of
eigenvectors. Diagonalization turns repeated application into
(A^k=SD^kS^{-1}), but it is not guaranteed for every matrix.

**[COUNTEREXAMPLE]**

\[
J=\begin{bmatrix}1&1\\0&1\end{bmatrix}
\]

has one eigenvalue (1) but only one independent eigenvector. It is not
diagonalizable. A repeated eigenvalue does not by itself yield enough
eigenvectors.

### 5.2 Symmetry changes the geometry

**[THEOREM / PROOF] Spectral theorem, real finite-dimensional form.** If
(A=A^\mathsf T\), then (A\) has an orthonormal basis of real eigenvectors;
equivalently,

\[
A=Q\Lambda Q^\mathsf T
\]

for an orthogonal (Q) and real diagonal (\Lambda).

**Proof idea:** symmetric maps are self-adjoint. Their eigenvalues are real;
eigenspaces for distinct eigenvalues are orthogonal; within repeated-eigenvalue
eigenspaces choose an orthonormal basis. The result is about an exact real
symmetric matrix. A nearly symmetric floating-point array may need an explicit
symmetrization decision and an error analysis; silently averaging it changes
the data/model.

### 5.3 Positive semidefinite is a quadratic-form claim

**[DEFINITION / MODEL]** A real symmetric matrix (A) is positive
semidefinite (PSD) when

\[
x^\mathsf TAx\ge0\quad\text{for every }x.
\]

It is positive definite (PD) when the inequality is strict for nonzero (x).
For a real symmetric matrix, PSD is equivalent to every eigenvalue being
nonnegative. The symmetry condition matters in the standard definition and
equivalence.

Examples:

- (A^\mathsf TA) is PSD because
  (x^\mathsf TA^\mathsf TAx=\lVert Ax\rVert_2^2\ge0).
- A covariance matrix is theoretically PSD under its stated construction;
  finite samples and numerical procedures can still produce small negative
  eigenvalues through rounding or an invalid estimate.
- A Hessian being PSD at one point supplies local convexity information for a
  twice-differentiable function; it is not alone a global optimization proof.

### 5.4 Quadratic forms diagnose curvature and energy, not causality

The scalar (x^\mathsf TAx) is a quadratic form. With symmetric (A), the
spectral theorem writes it as a sum of eigenvalue-weighted squared coordinates
in the eigenbasis. This explains why a negative eigenvalue gives a direction
of negative curvature and why a zero eigenvalue gives a flat direction.

**Code-reading investigation:** an agent proposes:

```python
if np.all(np.linalg.eigvals(matrix) >= 0):
    return "PSD"
```

Identify at least five missing conditions or checks: square shape, declared
symmetry tolerance, complex roundoff, scale-aware numerical threshold, the
meaning of `matrix`, a symmetric-specialized routine such as `eigvalsh`, and
the distinction between a numerical diagnostic and an exact PSD proof.

---

## 6. Session 4 — SVD, low-rank approximation, conditioning, and stable computation

### Pressure

“Keep the top components” is often used as a recipe. Before choosing (k), a
reviewer must ask: top components of which centered/scaled matrix, under which
norm, for which error tradeoff, and with what sensitivity to perturbation?

### 6.1 Singular value decomposition works for every real rectangular matrix

**[THEOREM / PROOF] SVD.** Every real (m\times n) matrix (A) has a
factorization

\[
A=U\Sigma V^\mathsf T,
\]

where (U\) and (V) are orthogonal and (\Sigma) is rectangular diagonal
with nonnegative singular values
(\sigma_1\ge\sigma_2\ge\cdots\ge0). The positive singular values are the
square roots of the positive eigenvalues of (A^\mathsf TA), but computing an
SVD by explicitly forming (A^\mathsf TA) can worsen numerical behavior.

Plain language: (V^\mathsf T) expresses input coordinates in special
orthogonal directions, (\Sigma) stretches or suppresses them, and (U)
expresses output coordinates. It is a map decomposition, not an explanation of
why real-world features exist.

### 6.2 Rank-​k approximation is a theorem with a norm and a loss

Let

\[
A_k=U_{[:,1:k]}\Sigma_{1:k,1:k}V_{[:,1:k]}^\mathsf T.
\]

**[THEOREM / PROOF] Eckart–Young–Mirsky, stated boundary.** Among matrices of
rank at most (k), (A_k) minimizes both the spectral-norm and Frobenius-norm
error; in Frobenius norm,

\[
\lVert A-A_k\rVert_F^2=\sum_{i>k}\sigma_i^2.
\]

**Proof idea:** orthogonal changes of coordinates preserve these norms, so the
problem reduces to approximating a diagonal matrix; retaining the largest
diagonal entries leaves the smallest squared tail. The theorem does not say
that rank (k) is ethically, statistically, or operationally appropriate.
It says what is optimal for one algebraic loss on one matrix.

### 6.3 Condition number measures sensitivity of the problem

For an invertible square matrix in the two-norm,

\[
\kappa_2(A)=\lVert A\rVert_2\lVert A^{-1}\rVert_2
=\frac{\sigma_{\max}(A)}{\sigma_{\min}(A)}.
\]

Large (\kappa\) means some small relative input perturbations can cause much
larger relative output perturbations. A singular matrix has infinite condition
number for solving (Ax=b). Conditioning is a property of a problem plus a
chosen norm/quantity of interest, not an accusation that the programmer used a
bad algorithm.

### 6.4 Stability measures the algorithm

Separate these questions:

| Question | Name | Example |
| --- | --- | --- |
| If the exact input changes a little, can the exact answer change a lot? | conditioning | Near-collinear columns make regression coefficients sensitive. |
| Does the finite-precision procedure compute the exact answer to a nearby problem? | backward stability | A factorization may have a small backward error. |
| Is the computed answer close to the exact answer of the original problem? | forward error | It depends on both algorithmic error and conditioning. |

An algorithm may be backward stable yet yield a large forward error on an
ill-conditioned problem. Conversely, a well-conditioned problem can be ruined
by an unstable procedure. Never compress both ideas into “numerical error.”

### 6.5 The normal-equations amplification boundary

For full-column-rank (A),

\[
\kappa_2(A^\mathsf TA)=\kappa_2(A)^2.
\]

This exact identity is why M28 treats normal equations as a derivation and
residual certificate, not the default numerical path. QR/SVD may cost more but
can preserve meaningful digits where explicitly forming (A^\mathsf TA)
erases them.

### Session 4 numerical experiment

Use the bounded reference model or a documented library to compare two nearly
parallel columns such as

\[
a_1=(1,1,1)^\mathsf T,\qquad
a_2=(1,1+\varepsilon,1+2\varepsilon)^\mathsf T.
\]

For a declared (\varepsilon), dtype, and right-hand side:

1. predict the rank in exact arithmetic and the condition trend as
   (\varepsilon\to0);
2. compare residual norm with coefficient sensitivity;
3. identify a tolerance at which a numerical rank routine changes its answer;
4. record what the experiment does **not** establish about all inputs,
   production data, or the best feature policy.

---

## 7. Session 5 — Tensors, matrix calculus, and the representation-to-computation boundary

### Pressure

AI code frequently succeeds with a broadcasted operation while computing the
wrong loss, mixing batch and feature axes, or silently converting `float64` to
`float32`. A correct derivative of the wrong function is not a correct system.

### 7.1 Tensor language begins with an index contract

An order-​(r) tensor is a multilinear object or, after bases are chosen, an
array with (r) indices. In software, a tensor also carries dtype, shape,
layout/stride information, device, and sometimes gradient history. Do not
silently equate these layers.

Use a declared Atlas convention:

| Symbol | Mathematical role | Example software shape |
| --- | --- | --- |
| (x\) | one feature column vector | `(d,)` only after documenting whether it is row- or column-like |
| (X) | rows are observations, columns are features | `(n, d)` |
| (W) | features to output coordinates | `(d, p)` |
| (XW) | observation-by-output scores | `(n, p)` |
| (B\) | batch of matrices | `(batch, m, n)` |

**[COUNTEREXAMPLE]** Broadcasting a `(d,)` mean across `(n, d)` often gives a
useful column-wise centering. Broadcasting a `(n,)` vector may fail, or—after
a reshape—subtract one observation's value across features. Both code paths
can return arrays. Shape compatibility is not semantic correctness.

### 7.2 Matrix calculus by differentials, not index memorization

For

\[
L(X)=\tfrac12\lVert XW-Y\rVert_F^2,
\]

let (R=XW-Y). The differential is

\[
dL=\operatorname{tr}(R^\mathsf T\,dX\,W)
=\operatorname{tr}((RW^\mathsf T)^\mathsf T dX),
\]

so, under the Frobenius inner product,

\[
\nabla_X L=(XW-Y)W^\mathsf T.
\]

Check dimensions: `(n, p) @ (p, d)` becomes `(n, d)`, exactly the shape of
(X). This is a derivation for the stated loss and convention. A framework's
automatic differentiation can compute a gradient of whatever graph it was
given; it cannot decide whether axes, units, objective, labels, and
regularization encode the intended claim.

### 7.3 Read a pipeline before trusting its gradient

```python
def reconstruction_step(X, W, target, learning_rate):
    centered = X - X.mean(axis=1, keepdims=True)
    residual = centered @ W - target
    gradient = centered.T @ residual / len(X)
    return W - learning_rate * gradient
```

Review this in order.

1. Under rows-as-observations, is `axis=1` the intended centering? What model
   would make it correct?
2. What shapes must `W` and `target` have?
3. What loss makes `centered.T @ residual` a gradient, and where is the factor
   convention?
4. Does `len(X)` normalize by observations, outputs, both, or neither?
5. If `X` is integer, what dtype emerges? If it is `float32`, what numerical
   resolution is being accepted?
6. What data leakage, missingness, consent, or human-impact question remains
   outside this derivative?

### 7.4 Vectorization is an implementation decision with evidence boundaries

Vectorization can reduce interpreter overhead and exploit optimized kernels,
but it can allocate large intermediates, change accumulation order, alter
rounding, or create noncontiguous access patterns. M32 will explore layout,
accelerators, mixed precision, and profiling. In M28, state only the justified
claim: under named shape/dtype/hardware/library conditions, a vectorized
operation produced a measured result. It is neither a proof of numerical
equivalence nor a universal performance guarantee.

---

## 8. Session 6 — PCA from variance and low-rank approximation; representation dossier

### Pressure

PCA is often presented as a button that “finds what matters.” It can find
directions of large variance in a chosen, centered, scaled coordinate system.
Variance is not importance, causation, fairness, relevance, or a permission to
discard a low-variance group signal.

### 8.1 Start with centered data and a declared convention

Let (X\in\mathbb R^{n\times d}) have rows as observations. Let

\[
X_c=X-\mathbf 1\mu^\mathsf T,
\]

where (\mu\) is the column-mean feature vector. Centering makes the origin
the empirical mean. It does not standardize units; dividing columns by scales
creates a different geometry and potentially different principal directions.

### 8.2 Derivation one: maximize projected variance

For a unit direction (v\in\mathbb R^d), projected scores are (X_cv). Their
empirical squared magnitude is

\[
\frac{1}{n}\lVert X_cv\rVert_2^2
=v^\mathsf T\left(\frac{1}{n}X_c^\mathsf TX_c\right)v.
\]

Let (C=X_c^\mathsf TX_c/n). It is symmetric PSD. By the spectral theorem,
write (C=Q\Lambda Q^\mathsf T). Under (\lVert v\rVert_2=1), the Rayleigh
quotient is maximized by a top-eigenvalue eigenvector. The next direction is
constrained orthogonal to earlier directions.

**Assumptions visible:** finite real data matrix; rows-as-observations;
centering choice; Euclidean norm; variance as the objective; eigenvalue
ordering; potential non-uniqueness when eigenvalues tie. The derivation does
not confer semantic meaning on the component.

### 8.3 Derivation two: best rank-​k reconstruction

With (X_c=U\Sigma V^\mathsf T), the truncated SVD

\[
X_{c,k}=U_k\Sigma_kV_k^\mathsf T
\]

is the best rank-​(k) approximation in Frobenius norm. The columns of
(V_k) are the principal directions, while (U_k\Sigma_k) are scores under
the stated convention. The same singular values appear in both derivations:
the SVD connects maximum retained variance with minimum squared reconstruction
error.

~~~text
centered observation-feature matrix Xc
    → choose k orthogonal feature directions Vk
    → scores Z = Xc Vk
    → reconstruction Z Vkᵀ
    → residual Xc - Z Vkᵀ
    → inspect residual distribution, groups, units, and intended decision
~~~

**Text equivalent:** center the data, choose (k) orthogonal feature
directions, project observations into (k) scores, reconstruct them, then
inspect the residual. A small aggregate residual does not prove that every
observation or decision-relevant feature is well represented.

### 8.4 PCA counterexamples that matter

1. **Uncentered data:** the first component can point mainly toward the mean
   offset rather than variation around it.
2. **Scale dominance:** a feature measured in milliseconds can dominate a
   feature measured as a proportion solely because of units.
3. **Low variance, high consequence:** a rare accessibility failure may have
   low variance but high impact; PCA's loss does not encode that priority.
4. **Tied eigenvalues:** a principal direction is not unique within a tied
   eigenspace; a component chart can rotate without changing the subspace.
5. **Missing/not-at-random data:** centering observed entries may encode a
   collection process, not the population geometry.

### 8.5 Session 6 AI review

An agent proposes: “We retained 95% variance, so our recommendation system
preserves 95% of what matters.” Produce a review card with:

- the exact claim that singular values support;
- the missing definition of “what matters”;
- the centering, scaling, data-collection, and group-slice questions;
- a residual or held-out decision evaluation needed next;
- a smallest counterexample where 95% variance retention loses the only
  safety-critical direction;
- a safe, narrower replacement claim.

---

## 9. Linear Algebra & Stability Studio

The portal's **Linear Algebra & Stability Studio** is a six-view, local-only
interactive workbench. It should never substitute a visualization for the
derivation; each view supplies a text alternative and a prediction gate.

| View | Prediction before reveal | Model and boundary |
| --- | --- | --- |
| 1. Space & basis | Is the candidate set a subspace/basis, and why? | Affine versus linear counterexample; coordinates are declared. |
| 2. Map & rank | Which input direction is lost and which output directions survive? | Exact small RREF and rank-nullity; finite fixture is not a general proof. |
| 3. Projection | Where must the residual point? | Orthogonal projection and least-squares residual; metric must be named. |
| 4. Spectrum | Which symmetric direction stretches or flattens? | PSD/spectral evidence; numerical eigenvalue threshold is not exact proof. |
| 5. Stability | Which solve is sensitive, and why? | Condition versus algorithmic stability; dtype/tolerance shown. |
| 6. PCA | Which retained direction optimizes which loss? | Centered variance and rank-​(k) reconstruction; no semantic-importance claim. |

### Accessible visual text alternative

**Accessible text path:** every diagram has an explicit table/description;
keyboard-accessible tabs, radio-style predictions, visible focus, no
motion-dependent conclusion, and a written explanation packet appear after a
choice and confidence are recorded. Local progress contains only the selected
answer, confidence, and reveal state; it contains no learner identity, voice,
or raw oral-defense content.

---

## 10. Problem ladder — recognition through design judgment

### A. Recognize

For each statement, state the missing object or assumption.

1. “This array is a vector.”
2. “The feature columns are independent.”
3. “This projection is closest.”
4. “The matrix is PSD.”
5. “The computation is stable.”

### B. Counterexample

Construct the smallest example for each false shortcut.

1. A flat set that is not a subspace.
2. A spanning list that is not a basis.
3. An idempotent matrix that is not an orthogonal Euclidean projection.
4. A repeated-eigenvalue matrix that is not diagonalizable.
5. A high-variance direction that is not decision-important.

### C. Proof reading

Annotate each line of this proof sketch and find the first unearned step:

> “(A^\mathsf TA) is symmetric, so it is invertible. Thus the least-squares
> coefficient is unique.”

Repair it using the correct condition. Explain why symmetry does not imply
positive definiteness or invertibility.

### D. Trace

Given a (3\times2) matrix with one column twice the other, trace exact RREF,
rank, a null vector, a column-space basis from original pivot columns, and the
effect on a least-squares coefficient. Label any finite calculation as a
fixture-level observation.

### E. Derive

Derive one of the following without looking at the answer first:

- normal equations from the directional derivative of squared residual;
- (P^2=P) and (P^\mathsf T=P) for (P=QQ^\mathsf T);
- the first PCA direction from a Rayleigh quotient under a unit-norm
  constraint;
- why (A^\mathsf TA) is PSD;
- the gradient of (\tfrac12\lVert XW-Y\rVert_F^2) with respect to (W).

### F. Debug

Review an implementation that does one of the following: uses `inv` for least
squares, evaluates PSD with `eigvals` on a nonsymmetric matrix, centers over
the wrong axis, removes a feature because a small singular value “proves it is
noise,” or compares floats with exact equality. State the wrong claim before
proposing code changes.

### G. Design

Design a representation contract for a small Atlas feature matrix. Specify
row/column convention, feature units, scaling, missing-data handling,
centering, allowed transformation, numerical API/dtype/tolerance, and an
explicit non-claim.

### H. Transfer

Choose one bridge:

- M29: explain a Jacobian as a linear approximation and name where it fails;
- M30: derive covariance as a PSD geometry object under a data convention;
- M31: explain why a Hessian/normal matrix appears in a local quadratic model;
- M32: review a batched matrix multiplication for shape/layout/precision;
- M35: audit a PCA representation before a classifier is evaluated.

---

## 11. Confidence-aware diagnostic

For every question, select an answer **and** confidence (guess, somewhat,
strong, certain) before reading the explanation. The point is to locate a
repair, not assign a grade.

### Question 1 — subspace boundary

Which set is a subspace of (\mathbb R^2)?

A. \(\{(x,y):x+y=1\}\)  
B. \(\{(x,y):y=2x\}\)  
C. \(\{(x,y):x\ge0\}\)  
D. \(\{(1,0),(0,1)\}\)

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** It contains zero and is closed under all real linear
combinations. A is affine but misses zero; C fails negative-scalar closure; D
is a finite set not closed under addition/scaling.

</details>

### Question 2 — basis versus useful columns

Three feature columns span a two-dimensional subspace. What follows?

A. Each column is independent.  
B. At least one column is a linear combination of the others.  
C. The matrix has three nonzero singular values.  
D. One column is semantically useless.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** A spanning list longer than the space dimension is dependent.
C reverses the rank implication; D is an application judgment, not a linear
algebra conclusion.

</details>

### Question 3 — rank-nullity

For (A:\mathbb R^5\to\mathbb R^3) with rank (3), what is the nullity?

A. 0  
B. 2  
C. 3  
D. Cannot be known because the codomain has dimension 3.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Rank-nullity uses the domain: (5=3+\operatorname{nullity}).
A confuses full row rank with injectivity; C repeats rank; D ignores the named
domain and rank.

</details>

### Question 4 — projection

If (p\) is the Euclidean projection of (b) onto
\(\operatorname{Col}(A)\), what must hold?

A. (b-p\) is orthogonal to every column of (A).  
B. (b-p=0) always.  
C. (p\) is orthogonal to (b).  
D. Every least-squares coefficient vector is unique.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: A.** Residual orthogonality characterizes the projection. B only
holds when (b\) is in the column space; C is generally false; D fails under
rank deficiency although the fitted vector can remain unique.

</details>

### Question 5 — normal-equation boundary

Why is `inv(A.T @ A) @ A.T @ b` often a poor least-squares implementation?

A. Matrix multiplication is not defined.  
B. It can square conditioning and fails for dependent columns.  
C. Least squares never uses transpose.  
D. QR/SVD make the mathematical minimizer different.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** The algebraic expression has narrow assumptions and can worsen
numerics. A/C are false; D confuses an exact problem with alternative
algorithms for it.

</details>

### Question 6 — PSD

Which statement is sufficient to show (A^\mathsf TA) is PSD?

A. It has positive diagonal entries.  
B. It is square.  
C. (x^\mathsf TA^\mathsf TAx=\lVert Ax\rVert_2^2\ge0\) for every (x).  
D. A numerical eigensolver returned real values once.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** It proves the quadratic-form definition. Positive diagonal and
squareness are insufficient; D is finite algorithm evidence, not an exact
proof.

</details>

### Question 7 — spectral theorem scope

Which hypothesis gives an orthonormal eigenbasis in the stated real theorem?

A. (A) is any square matrix.  
B. (A=A^\mathsf T).  
C. (A) has a repeated eigenvalue.  
D. (A) is invertible.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** Real symmetry is the key hypothesis. The other properties do
not suffice; the Jordan-block counterexample has a repeated eigenvalue and is
invertible but not diagonalizable.

</details>

### Question 8 — SVD versus eigendecomposition

Which statement holds for every real rectangular matrix (A)?

A. It has an eigendecomposition.  
B. It is symmetric PSD.  
C. It has an SVD (U\Sigma V^\mathsf T).  
D. Its columns are independent.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: C.** SVD covers rectangular and rank-deficient matrices. A requires
square shape and may still fail to diagonalize; B/D add unsupported claims.

</details>

### Question 9 — conditioning versus stability

Which is the best distinction?

A. Conditioning is a property of the algorithm; stability is a property of
the input only.  
B. Conditioning describes problem sensitivity; stability describes an
algorithm's handling of finite arithmetic.  
C. They are two names for floating-point rounding.  
D. A stable algorithm always gives a small forward error.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** A backward-stable algorithm can face an ill-conditioned problem
and still produce a large forward error. A reverses the ideas; C/D erase the
critical boundary.

</details>

### Question 10 — PCA objective

For centered rows-as-observations data, the first PCA direction maximizes:

A. Causal effect of a feature.  
B. Projected empirical variance under a chosen Euclidean scaling.  
C. Accuracy of every future classifier.  
D. The number of nonzero entries.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** The Rayleigh quotient gives this bounded objective. A/C/D need
different models and evidence.

</details>

### Question 11 — PCA equivalence

What connects PCA's variance derivation to truncated SVD?

A. They use the same component names only.  
B. The top right singular vectors give the centered feature directions, and
truncation minimizes stated rank-​(k) reconstruction loss.  
C. Every low-rank approximation is causally meaningful.  
D. Centering is never needed.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: B.** It names the convention and norm. A is superficial; C/D are
false overclaims.

</details>

### Question 12 — tensor/code contract

`X` has shape `(n, d)` with rows as observations. Which expression centers
each feature column around its mean?

A. `X - X.mean(axis=0, keepdims=True)`  
B. `X - X.mean(axis=1, keepdims=True)`  
C. `X @ X.mean(axis=0)`  
D. `X - X.mean()` always means the same thing.

<details>
<summary>Reveal after recording your answer and confidence.</summary>

**Answer: A.** It yields one mean per feature and broadcasts across rows. B
centers within each observation; C has incompatible/changed meaning; D makes a
different global-centering model.

</details>

### Interpretation and misconception repair route

| Pattern | Likely fragile model | Smallest bridge |
| --- | --- | --- |
| 1–3 missed | Linear-map domain, basis, rank/nullity | Draw input/output spaces; perform exact RREF and rank-nullity on one fixture. |
| 4–5 missed | Inner product, projection, least-squares boundary | Derive residual orthogonality; compare QR/SVD explanation with normal equations. |
| 6–8 missed | Symmetry, PSD, spectrum, SVD | Build a symmetric/non-symmetric contrast and trace singular directions. |
| 9 missed | Error model | Make a three-column table: input perturbation, algorithm error, and observed forward error. |
| 10–12 missed | PCA and array semantics | Re-derive PCA twice, then audit centering/scaling/axes in an unfamiliar pipeline. |
| High confidence + wrong | Overstable intuition | State the attractive but false rule, construct the smallest counterexample, and revise it. |

---

## 12. Atlas project — Representation & Stability Dossier

### Brief

Create a small, synthetic **Atlas Representation & Stability Dossier**. It
may model a review-signal matrix, a task-feature matrix, a compressed
search/index view, or a scientific measurement table. It must be explicitly
synthetic or appropriately authorized; do not upload personal learner records
to an AI tool merely to make the project feel realistic.

### Required evidence

| Evidence | Acceptance criterion |
| --- | --- |
| Representation contract | Names rows, columns, units, scaling, missing-data policy, centering, and non-claims. |
| Linear-map analysis | States domain/codomain; finds rank, null/column-space evidence on a bounded fixture; separates exact math from numerical diagnostic. |
| Projection / least squares | Derives the objective and residual-orthogonality condition; states whether coefficients are unique and why. |
| Spectrum / SVD | Explains a symmetric/PSD claim or an SVD with hypotheses; uses singular values without treating them as semantic importance. |
| Stability review | Shows one near-dependent or tolerance-sensitive case; distinguishes conditioning, algorithm choice, dtype, and observed error. |
| PCA dual derivation | Connects variance maximization and rank-​(k) reconstruction for centered data, with a scaling/counterexample discussion. |
| Code/model review | Reviews a supplied or AI-proposed implementation for shapes, objective, tolerance, and evidence boundary before accepting it. |
| Oral explanation | Explains one derivation, one failure boundary, and one transfer; revises after a hint if needed. |

### Rubric: multi-evidence, never pass/fail

| Dimension | Fragile | Developing | First-pass evidence |
| --- | --- | --- | --- |
| Mathematical model | Names arrays only. | Names some shapes but changes conventions. | States objects, domains, inner product, and assumptions consistently. |
| Derivation | Recites formulas. | Has an argument with a missing condition. | Reconstructs the central derivation and labels theorem versus calculation. |
| Numerical judgment | Calls output exact/stable by default. | Notices one warning without linking it to a problem. | Separates conditioning, stability, tolerance, dtype, and finite observation. |
| Representation ethics | Treats variance/rank as importance. | Notes a vague caveat. | States data/scale/impact boundaries and evidence needed for a decision. |
| Transfer and review | Applies a recipe. | Finds a local code issue. | Audits a new implementation/design and proposes a bounded next test. |

---

## 13. TA session and Study Partner session

### Teaching Assistant — derivation and numerical-review clinic

The TA does not begin with a formula. Ask, in order:

1. “What is your domain, field, row/column convention, and inner product?”
2. “What is the exact claim: a definition, theorem, numerical result, library
   contract, or observation?”
3. “Show me the first line of the derivation you can defend.”
4. “What changes if rank is deficient, eigenvalues tie, the input is not
   centered, or columns nearly coincide?”
5. “Which error belongs to the problem and which belongs to the algorithm?”
6. “What would change your mind about this representation's appropriateness?”

**Hint ladder:**

1. Point to the missing object: domain, shape, norm, assumption, or error
   model.
2. Offer a two-dimensional fixture or a single residual direction.
3. Ask for a symbolic line or dimension check.
4. Show one bounded counterexample, then ask the learner to repair the claim.
5. Share a complete derivation only after the learner has stated the remaining
   gap and a next reconstruction task.

Record only a learner-approved summary: demonstrated models, fragile ideas,
misconceptions repaired, confidence, a retrieval prompt, and the smallest next
bridge. Do not store raw voice or a full oral-defense transcript.

### Study Partner — geometry and code-reading rehearsal

Run a 10-minute no-grading loop.

1. Ask the learner to describe one map as input directions becoming output
   directions.
2. Ask for a prediction before displaying an RREF, residual, or singular-value
   view.
3. Ask for the smallest counterexample to a tempting claim.
4. Read five lines of array code together, narrating shapes and objective.
5. Ask one transfer: “What could this conclusion not justify in an ML or
   product decision?”
6. End with “What would change your mind?” and choose one retrieval card.

The Study Partner never assigns mastery; it helps make an internal model
audible and inspectable before the TA/oral-defense conversation.

---

## 14. Conversational oral defense — M28

This replaces a traditional coding or written exam. Use GPT Live Chat when it
is available, with the fully equivalent text conversation available at every
stage. You may pause, rerecord/rephrase, use notes, draw a diagram, inspect a
small matrix, request a hint, or return after review.

### Invitation and agenda (15–20 minutes)

> “We are going to make one representation model visible together. First you
> will explain it plainly; then you will derive or trace one mechanism; then
> we will test a boundary; then you will transfer it to a new setting. You may
> revise or ask for a hint at any time. We are looking for useful evidence and
> a next bridge, not a pass/fail label.”

1. **Central model.** Explain why a matrix is a coordinate representation of a
   linear map and what rank/nullity say about lost directions.
2. **Derive or trace.** Choose least-squares residual orthogonality, the PSD
   identity \(x^\mathsf TA^\mathsf TAx=\lVert Ax\rVert_2^2\geq 0\) over the
   declared real inner-product setting, the PCA Rayleigh quotient, or a small
   SVD/rank trace. Then narrate one array code path's shape, dtype, solver,
   and condition boundary.
3. **Boundary.** Handle one: dependent columns, an affine non-subspace,
   nonsymmetric matrix, tied eigenvalues, ill conditioning, wrong centering,
   or “variance means importance.”
4. **Prediction before reveal.** Before seeing a small fixture, predict the
   null direction, residual direction, rank change, or retained PCA direction.
5. **Novel transfer.** Review a batched ML operation, a scientific fit, or a
   compressed Atlas index. State assumptions, error model, evidence needed,
   tradeoff, and human impact boundary.
6. **Confidence reflection.** “What would change your mind about this model or
   representation choice?”

### Misconception repair moments

If the learner says “normal equations are the solution,” ask: “Under which
rank and numerical assumptions? What is the objective, and what safer solver
would you compare?” If the learner says “PCA finds importance,” ask for a
low-variance/high-consequence counterexample. If the learner says “stable
means accurate,” ask them to distinguish a backward-stable algorithm from an
ill-conditioned problem.

### End-of-defense evidence summary

With learner approval, record only:

~~~text
Central model demonstrated:
Derivation or trace reconstructed:
Assumptions named:
Counterexample / error boundary handled:
Misconception repaired or still fragile:
Confidence calibration:
One retrieval prompt:
Smallest next bridge (M29 / M30 / M31 / M32 / M35):
~~~

No bare pass/fail verdict, raw voice recording, sensitive personal content, or
more transcript than needed for this learning record belongs in Notion.

---

## 15. Spaced review and mastery gate

### Retrieval queue

| When | Prompt |
| --- | --- |
| +1 day | State the subspace test and give an affine counterexample. |
| +3 days | Derive normal equations and explain why residual orthogonality matters. |
| +7 days | Compare eigen, SVD, and PSD claims with their exact hypotheses. |
| +14 days | Derive PCA from variance and from low-rank reconstruction; name the shared assumption. |
| +28 days | Audit a new array/ML pipeline for axes, scale, rank, conditioning, and non-claims. |

### Mathematical mastery gate

Before M29–M31, conduct the conversational oral defense through GPT Live Chat
or the fully equivalent text route. Prepare a short **representation reasoning
packet** as evidence for that conversation; it must include:

1. a precise map/space claim and a small rank/nullity derivation;
2. an objective, projection/least-squares derivation, and a residual boundary;
3. a symmetric/PSD/SVD/PCA statement with assumptions and one counterexample;
4. a conditioning-versus-stability analysis of a finite computation;
5. a code review that catches a shape, centering, inverse, tolerance, or
   evidence-boundary error; and
6. a transfer plan naming the next module that needs the model.

If evidence is fragile, slow the route and use a two-dimensional exact fixture
plus a code-reading repair. Do not move forward because the formulas feel
familiar.

---

## 16. Sources, licensing, and responsible reading route

The deployed [M28 source map](/downloads/module28_linear_algebra_numerical_stability_representation_source_map.md)
and [source-audit addendum](/downloads/module28_linear_algebra_source_audit_addendum.md)
are synchronized from the canonical course records. Together they record
source owners, exact scope, licensing/reuse boundaries, asset-level notes, and
what each resource cannot establish.

Recommended order:

1. **MIT 18.06 / 18.065 and MIT OCW:** use for a connected university-level
   linear-algebra sequence and lectures; link rather than reproduce course
   figures or problems.
2. **Sheldon Axler's open text:** use for a proof-aware route through spaces,
   maps, eigenstructure, and inner products, subject to the text's published
   license and attribution terms.
3. **Numerical linear-algebra resources:** use for condition/stability
   vocabulary; do not turn a textbook or lecture into copied portal content.
4. **NumPy documentation:** use only for documented array, linear-algebra, and
   broadcasting API behavior in the named version; it is not authority for a
   theorem or representation decision.
5. **Original Atlas examples and diagrams:** use them for all primary learner
   prompts, code review, counterexamples, visuals, and diagnostics.

### Instructor decision rule

Before calling an answer correct, ask: “Is this a theorem with hypotheses, a
derivation under a model, a numerical result with an error boundary, a library
contract, or an observation? What would the smallest counterexample look like
if we silently changed the representation?”

## Forward handoff — M28 to M29

Carry one linear map/representation argument, one conditioning or numerical
boundary, and one code-reading trace into **M29**. Continuous change makes the
same discipline explicit through limits, derivatives, approximation error, and
coordinate changes. Ask the Study Partner to change a basis, scale, or tolerance;
ask the TA to separate the theorem, numerical observation, and library claim.
