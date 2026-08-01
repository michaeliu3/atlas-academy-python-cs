import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { isolatedGitEnvironment } from "../../scripts/git-index-snapshot.mjs";

const execFileAsync = promisify(execFile);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const sourceSiteRoot = resolve(testDirectory, "..", "..");

async function git(root, args) {
  return execFileAsync("git", args, {
    cwd: root,
    encoding: "utf8",
    env: isolatedGitEnvironment(),
  });
}

/**
 * Materialize an independent repository from this test run's staged Atlas
 * source. Tests can then stage a deliberately malformed candidate artifact
 * without exposing a caller-controlled bypass in production validation.
 */
export async function createIndexedCourseFixture(t) {
  const root = await mkdtemp(join(tmpdir(), "atlas-candidate-preflight-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const prefix = `${root.replaceAll("\\", "/")}/`;

  await execFileAsync("git", ["checkout-index", "--all", `--prefix=${prefix}`], {
    cwd: sourceSiteRoot,
    env: isolatedGitEnvironment(),
    maxBuffer: 64 * 1024 * 1024,
  });
  await git(root, ["init", "--quiet"]);
  await git(root, ["config", "user.email", "tests@example.invalid"]);
  await git(root, ["config", "user.name", "Atlas test"]);
  await git(root, ["add", "."]);
  await git(root, ["commit", "--quiet", "-m", "fixture"]);
  return root;
}

export async function stageJsonMutation(root, repositoryPath, mutate) {
  const absolutePath = join(root, repositoryPath);
  const source = JSON.parse(await readFile(absolutePath, "utf8"));
  const changed = mutate(structuredClone(source));
  await writeFile(absolutePath, `${JSON.stringify(changed, null, 2)}\n`, "utf8");
  await git(root, ["add", repositoryPath]);
  return changed;
}
