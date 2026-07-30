import vinext from "vinext";
import { readdir, rm } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";
import { loadReleaseInputPolicy } from "./scripts/release-input-policy.mjs";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

async function pruneUnlistedDownloadOutput(directory: string, allowedPaths: Set<string>) {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  });

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await pruneUnlistedDownloadOutput(path, allowedPaths);
      continue;
    }
    const repositoryPath = `public/downloads/${relative(directoryRoot, path).replaceAll("\\", "/")}`;
    if (!entry.isFile() || !allowedPaths.has(repositoryPath)) {
      await rm(path, { force: true });
    }
  }
}

const projectRoot = resolve(import.meta.dirname, ".");
const directoryRoot = resolve(projectRoot, "dist", "client", "downloads");

function allowlistedPublicDownloads() {
  return {
    name: "atlas-allowlisted-public-downloads",
    apply: "build" as const,
    async closeBundle() {
      const { downloadPaths } = await loadReleaseInputPolicy(projectRoot);
      const allowedPaths = new Set(
        downloadPaths.map((path) => relative(projectRoot, path).replaceAll("\\", "/")),
      );
      await pruneUnlistedDownloadOutput(directoryRoot, allowedPaths);
    },
  };
}

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      allowlistedPublicDownloads(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      }),
    ],
  };
});
