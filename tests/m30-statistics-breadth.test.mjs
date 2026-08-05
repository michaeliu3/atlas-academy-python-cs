import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("M30 exposes the required probability, statistics, and scientific-inference spine", async () => {
  const [moduleText, sourceMap] = await Promise.all([
    readFile(new URL("../content/modules/30_probability_statistics_scientific_inference.md", import.meta.url), "utf8"),
    readFile(
      new URL("../content/source-maps/module30_probability_statistics_scientific_inference_source_map.md", import.meta.url),
      "utf8",
    ),
  ]);

  const requiredTopics = [
    [/\bMLE\b/u, "maximum likelihood"],
    [/\bMAP\b/u, "maximum a posteriori"],
    [/Bayesian/u, "Bayesian inference"],
    [/sufficien/u, "sufficiency"],
    [/exponential[- ]famil/u, "exponential families"],
    [/confidence intervals?/u, "confidence intervals"],
    [/multiple[- ]testing/u, "multiple testing"],
    [/\bGLM\b/u, "generalized linear models"],
    [/logistic/u, "logistic regression"],
    [/bootstrap/u, "bootstrap"],
    [/permutation/u, "permutation tests"],
    [/experimental design/u, "experimental design"],
    [/\bpower\b/u, "power"],
    [/\bMCAR\b/u, "MCAR"],
    [/\bMAR\b/u, "MAR"],
    [/\bMNAR\b/u, "MNAR"],
    [/misspecif/u, "misspecification"],
    [/Chernoff/u, "Chernoff"],
    [/Hoeffding/u, "Hoeffding"],
    [/Bernstein/u, "Bernstein"],
    [/multivariate[- ](?:normal|Gaussian)/iu, "multivariate Gaussian"],
    [/conditional expectation/u, "conditional expectation"],
    [/martingale/u, "martingales"],
    [/Markov chains?/u, "Markov chains"],
    [/Monte[- ]Carlo/u, "Monte Carlo"],
  ];

  for (const [pattern, label] of requiredTopics) {
    assert.match(moduleText, pattern, `M30 must visibly cover ${label}`);
  }

  for (const sourceId of Array.from({ length: 12 }, (_, index) => `S${String(index + 1).padStart(2, "0")}`)) {
    assert.match(sourceMap, new RegExp(`\\| ${sourceId} \\|`), `M30 source map must retain ${sourceId}`);
  }
  assert.match(sourceMap, /six[- ]session source routing/iu);
});
