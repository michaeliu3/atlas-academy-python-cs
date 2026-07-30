import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

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

  return { path, policy, downloadPaths };
}
