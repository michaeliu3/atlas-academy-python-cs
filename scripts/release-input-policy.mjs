import { readFile } from "node:fs/promises";
import { basename, relative, resolve } from "node:path";

export const releaseInputPolicyRelativePath = "content/course/release-input-policy.v1.json";
const allowedDownloadExtensions = new Set([".md", ".py"]);
const forbiddenPathSegments = new Set(["__pycache__", ".mypy_cache", ".pytest_cache"]);

export function repositoryPath(siteRoot, path) {
  return relative(siteRoot, path).replaceAll("\\", "/");
}

export function releaseInputPolicyPath(siteRoot) {
  return resolve(siteRoot, releaseInputPolicyRelativePath);
}

function validPolicyPath(siteRoot, candidate) {
  if (typeof candidate !== "string" || candidate.length === 0 || candidate.includes("\\")) {
    return false;
  }
  if (!candidate.startsWith("public/downloads/")) {
    return false;
  }
  if (candidate.split("/").some((segment) =>
    segment === "" ||
    segment === "." ||
    segment === ".." ||
    segment.startsWith(".") ||
    forbiddenPathSegments.has(segment),
  )) {
    return false;
  }
  const extension = candidate.slice(candidate.lastIndexOf("."));
  if (!allowedDownloadExtensions.has(extension)) {
    return false;
  }
  return repositoryPath(siteRoot, resolve(siteRoot, candidate)) === candidate;
}

function validCanonicalSourcePath(siteRoot, candidate) {
  if (typeof candidate !== "string" || candidate.length === 0 || candidate.includes("\\")) {
    return false;
  }
  if (!candidate.startsWith("content/source-maps/") || !candidate.endsWith(".md")) {
    return false;
  }
  if (candidate.split("/").some((segment) =>
    segment === "" ||
    segment === "." ||
    segment === ".." ||
    segment.startsWith(".") ||
    forbiddenPathSegments.has(segment),
  )) {
    return false;
  }
  return repositoryPath(siteRoot, resolve(siteRoot, candidate)) === candidate;
}

function sourceArtifactCopy(siteRoot, candidate) {
  if (
    !candidate ||
    typeof candidate !== "object" ||
    Array.isArray(candidate) ||
    Object.keys(candidate).length !== 2 ||
    !("canonicalPath" in candidate) ||
    !("publicPath" in candidate)
  ) {
    throw new Error("release-input policy sourceArtifactCopies entries must contain only canonicalPath and publicPath.");
  }
  if (!validCanonicalSourcePath(siteRoot, candidate.canonicalPath)) {
    throw new Error(
      `release-input policy canonical source artifact path is invalid: ${candidate.canonicalPath}.`,
    );
  }
  if (!validPolicyPath(siteRoot, candidate.publicPath) || !candidate.publicPath.endsWith(".md")) {
    throw new Error(
      `release-input policy public source artifact path is invalid: ${candidate.publicPath}.`,
    );
  }
  const expectedCanonicalPath = `content/source-maps/${basename(candidate.publicPath)}`;
  if (candidate.canonicalPath !== expectedCanonicalPath) {
    throw new Error(
      `release-input policy source artifact copies must preserve the canonical basename: ${candidate.publicPath}.`,
    );
  }
  return {
    canonicalPath: resolve(siteRoot, candidate.canonicalPath),
    publicPath: resolve(siteRoot, candidate.publicPath),
  };
}

export async function loadReleaseInputPolicy(siteRoot) {
  const path = releaseInputPolicyPath(siteRoot);
  let policy;
  try {
    policy = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read the release-input policy: ${error.message}`);
  }

  if (policy?.schemaVersion !== 1 || policy?.policyVersion !== "v1") {
    throw new Error("release-input policy must use schemaVersion 1 and policyVersion v1.");
  }
  if (!Array.isArray(policy.allowlistedDownloadPaths) || policy.allowlistedDownloadPaths.length === 0) {
    throw new Error("release-input policy must declare one or more allowlisted download paths.");
  }
  if (!Array.isArray(policy.sourceArtifactCopies)) {
    throw new Error("release-input policy must declare sourceArtifactCopies.");
  }

  const seen = new Set();
  const downloadPaths = [];
  for (const candidate of policy.allowlistedDownloadPaths) {
    if (!validPolicyPath(siteRoot, candidate)) {
      throw new Error(`release-input policy path is not an allowed public text artifact: ${candidate}.`);
    }
    if (seen.has(candidate)) {
      throw new Error(`release-input policy path is duplicated: ${candidate}.`);
    }
    seen.add(candidate);
    downloadPaths.push(resolve(siteRoot, candidate));
  }

  const copiedCanonicalPaths = new Set();
  const copiedPublicPaths = new Set();
  const sourceArtifactCopies = [];
  for (const candidate of policy.sourceArtifactCopies) {
    const copy = sourceArtifactCopy(siteRoot, candidate);
    const canonicalPath = repositoryPath(siteRoot, copy.canonicalPath);
    const publicPath = repositoryPath(siteRoot, copy.publicPath);
    if (copiedCanonicalPaths.has(canonicalPath) || copiedPublicPaths.has(publicPath)) {
      throw new Error(`release-input policy source artifact copy is duplicated: ${publicPath}.`);
    }
    if (!seen.has(publicPath)) {
      throw new Error(
        `release-input policy source artifact copy must also be an allowlisted download: ${publicPath}.`,
      );
    }
    copiedCanonicalPaths.add(canonicalPath);
    copiedPublicPaths.add(publicPath);
    sourceArtifactCopies.push(copy);
  }

  return { path, policy, downloadPaths, sourceArtifactCopies };
}
