import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const moduleSpecs = [
  {
    id: "M28",
    modulePath: "../content/modules/28_linear_algebra_numerical_stability_representation.md",
    sourcePath: "../content/source-maps/module28_linear_algebra_numerical_stability_representation_source_map.md",
    topics: [
      [/vector spaces?/iu, "vector spaces"],
      [/linear maps?/iu, "linear maps"],
      [/rank[- ]nullity/iu, "rank-nullity"],
      [/inner products?/iu, "inner products"],
      [/least squares/iu, "least squares"],
      [/eigenvalues?|eigenvectors?/iu, "eigenstructure"],
      [/spectral theorem/iu, "spectral theorem"],
      [/singular value decomposition|\bSVD\b/iu, "SVD"],
      [/low[- ]rank/iu, "low-rank approximation"],
      [/matrix calculus/iu, "matrix calculus"],
      [/tensor/iu, "tensor operations"],
      [/conditioning/iu, "conditioning"],
      [/stability/iu, "numerical stability"],
    ],
  },
  {
    id: "M29",
    modulePath: "../content/modules/29_calculus_real_analysis_continuous_change.md",
    sourcePath: "../content/source-maps/module29_calculus_real_analysis_continuous_change_source_map.md",
    topics: [
      [/single[- ]variable/iu, "single-variable calculus"],
      [/multivariable/iu, "multivariable calculus"],
      [/partial derivatives?/iu, "partial derivatives"],
      [/gradients?/iu, "gradients"],
      [/Jacobians?/iu, "Jacobians"],
      [/Hessians?/iu, "Hessians"],
      [/Taylor/iu, "Taylor expansions"],
      [/multiple integrals?/iu, "multiple integrals"],
      [/change of variables/iu, "change of variables"],
      [/constrained extrema/iu, "constrained extrema"],
      [/sequences? and series?/iu, "sequences and series"],
      [/pointwise.*uniform|uniform.*pointwise/iu, "pointwise versus uniform convergence"],
      [/metric[- ]space/iu, "metric spaces"],
      [/compactness/iu, "compactness"],
      [/interchange|exchange.*expectation|dominated convergence/iu, "operation interchange"],
    ],
  },
  {
    id: "M30",
    modulePath: "../content/modules/30_probability_statistics_scientific_inference.md",
    sourcePath: "../content/source-maps/module30_probability_statistics_scientific_inference_source_map.md",
    topics: [
      [/sample spaces?|probability model/iu, "sample spaces and probability models"],
      [/joint.*marginal.*conditional|conditional.*joint.*marginal/isu, "joint, marginal, and conditional laws"],
      [/Bayes/iu, "Bayes' rule"],
      [/independence/iu, "independence"],
      [/expectation/iu, "expectation"],
      [/variance/iu, "variance"],
      [/covariance/iu, "covariance"],
      [/law[s]? of large numbers|\bLLN\b/iu, "laws of large numbers"],
      [/central limit theorem|\bCLT\b/iu, "central limit theorem"],
      [/Chernoff/iu, "Chernoff bounds"],
      [/Hoeffding/iu, "Hoeffding bounds"],
      [/Bernstein/iu, "Bernstein bounds"],
      [/Monte[- ]Carlo/iu, "Monte Carlo"],
      [/\bMLE\b/iu, "maximum likelihood"],
      [/\bMAP\b/iu, "MAP estimation"],
      [/confidence intervals?/iu, "confidence intervals"],
      [/multiple[- ]testing/iu, "multiple testing"],
      [/logistic/iu, "logistic models"],
      [/bootstrap/iu, "bootstrap"],
      [/experimental design/iu, "experimental design"],
      [/missingness/iu, "missing data"],
      [/robust/iu, "robust statistics"],
      [/high[- ]dimensional/iu, "high-dimensional estimation"],
    ],
  },
  {
    id: "M31",
    modulePath: "../content/authoring/m31_optimization_information_workbook.v1.md",
    sourcePath: "../content/source-maps/module31_optimization_information_source_map.md",
    topics: [
      [/unconstrained/iu, "unconstrained optimization"],
      [/convex/iu, "convex optimization"],
      [/duality/iu, "duality"],
      [/KKT/iu, "KKT conditions"],
      [/Slater/iu, "Slater condition"],
      [/Newton/iu, "Newton methods"],
      [/subgradient/iu, "subgradients"],
      [/proximal/iu, "proximal methods"],
      [/coordinate/iu, "coordinate descent"],
      [/momentum/iu, "momentum"],
      [/adaptive/iu, "adaptive methods"],
      [/nonconvex/iu, "nonconvex optimization"],
      [/convergence/iu, "convergence evidence"],
      [/entropy/iu, "entropy"],
      [/conditional entropy/iu, "conditional entropy"],
      [/cross-entropy/iu, "cross-entropy"],
      [/KL/iu, "KL divergence"],
      [/mutual information/iu, "mutual information"],
      [/data-processing/iu, "data-processing inequality"],
      [/maximum-entropy/iu, "maximum-entropy principle"],
      [/coding interpretation|prefix-code/iu, "coding interpretation"],
      [/rate-distortion/iu, "rate-distortion"],
    ],
  },
];

test("M28–M31 expose the complete mathematical foundation spine", async () => {
  for (const spec of moduleSpecs) {
    const [moduleText, sourceText] = await Promise.all([
      readFile(new URL(spec.modulePath, import.meta.url), "utf8"),
      readFile(new URL(spec.sourcePath, import.meta.url), "utf8"),
    ]);

    for (const [pattern, label] of spec.topics) {
      assert.match(moduleText, pattern, `${spec.id} must visibly cover ${label}`);
    }
    assert.match(moduleText, /##\s+(?:\d+\.\s+)?Session 1[\s\S]*##\s+(?:\d+\.\s+)?Session 6/iu, `${spec.id} must retain six connected sessions`);
    assert.match(sourceText, /source|ledger|course/iu, `${spec.id} must retain a source-ledger document`);
    assert.match(sourceText, /https?:\/\//u, `${spec.id} source map must retain learner-facing links`);
  }
});
