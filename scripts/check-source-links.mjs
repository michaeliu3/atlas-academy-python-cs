import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
export const siteRoot = resolve(scriptDirectory, "..");

const PROVENANCE_MARKER =
  /access(?:ed| date)?|audit(?:ed| date)?|calibrat|checked|check(?:ed)?|cutoff|baseline|snapshot|recheck|research|review(?:ed| date)?|follow[- ]?through|decision|scope|updated/iu;
const ISO_DATE = /\b(20\d{2})-(\d{2})-(\d{2})\b/gu;
// Source ledgers are Markdown prose, so an em/en dash can follow a link as a
// sentence separator. It is not a valid unescaped URL character in this
// corpus; stop extraction there instead of swallowing the following prose.
const URL_PATTERN = /https?:\/\/[^\s<>"'`\u2014\u2013]+/gu;
const DEFAULT_MAX_AGE_DAYS = 180;
// Live checks cover the learner-facing calibration notes and every checked-in
// source-map ledger. Static URL/provenance checks still run across the same
// corpus on every relevant build; the bounded network pass is reserved for
// source changes in CI.
export const LIVE_ROOTS = ["docs/ACADEMIC_CALIBRATION.md", "docs/research", "content/source-maps"];

function isoDate(year, month, day) {
  const value = `${year}-${month}-${day}`;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCDate() !== Number(day)
  ) {
    return null;
  }
  return value;
}

export function normalizeToday(value = new Date().toISOString().slice(0, 10)) {
  const match = /^((?:20)\d{2})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) throw new Error(`Expected an ISO date, received ${value}.`);
  const normalized = isoDate(...match.slice(1));
  if (!normalized) throw new Error(`Invalid ISO date, received ${value}.`);
  return normalized;
}

export function extractReviewDates(markdown) {
  const lines = markdown.split(/\r?\n/u);
  const dates = new Set();
  for (let index = 0; index < lines.length; index += 1) {
    const context = lines
      .slice(Math.max(0, index - 1), Math.min(lines.length, index + 2))
      .join(" ");
    if (!PROVENANCE_MARKER.test(context)) continue;
    for (const match of context.matchAll(ISO_DATE)) {
      const date = isoDate(...match.slice(1));
      if (date) dates.add(date);
    }
  }
  return [...dates].sort();
}

function stripMarkdownPunctuation(value) {
  let normalized = value.replace(/[`*_]+$/gu, "");
  while (/[.,;:!?|]$/u.test(normalized)) normalized = normalized.slice(0, -1);
  while (normalized.endsWith(")") &&
    (normalized.match(/\)/gu)?.length ?? 0) > (normalized.match(/\(/gu)?.length ?? 0)) {
    normalized = normalized.slice(0, -1);
  }
  while (normalized.endsWith("]") &&
    (normalized.match(/\]/gu)?.length ?? 0) > (normalized.match(/\[/gu)?.length ?? 0)) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function extractUrls(markdown) {
  return [...markdown.matchAll(URL_PATTERN)]
    .map((match) => stripMarkdownPunctuation(match[0]))
    .filter(Boolean);
}

function ageInDays(date, today) {
  return Math.floor(
    (Date.parse(`${today}T00:00:00.000Z`) - Date.parse(`${date}T00:00:00.000Z`)) /
      86_400_000,
  );
}

export function validateProvenance(markdown, { today = normalizeToday(), maxAgeDays = DEFAULT_MAX_AGE_DAYS } = {}) {
  const normalizedToday = normalizeToday(today);
  const reviewDates = extractReviewDates(markdown);
  const errors = [];
  if (reviewDates.length === 0) {
    errors.push("no document-level review/access date was found");
  }
  const futureDates = reviewDates.filter((date) => date > normalizedToday);
  if (futureDates.length > 0) {
    errors.push(`future review date(s): ${futureDates.join(", ")}`);
  }
  const currentDate = reviewDates.filter((date) => date <= normalizedToday).at(-1);
  if (currentDate && ageInDays(currentDate, normalizedToday) > maxAgeDays) {
    errors.push(
      `latest review date ${currentDate} is ${ageInDays(currentDate, normalizedToday)} days old (maximum ${maxAgeDays})`,
    );
  }
  return { reviewDates, errors };
}

async function markdownFilesUnder(root, relativePath) {
  const absolutePath = join(root, relativePath);
  const entries = await readdir(absolutePath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = join(relativePath, entry.name);
    if (entry.isDirectory()) files.push(...(await markdownFilesUnder(root, child)));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(child);
  }
  return files;
}

export async function sourceCorpusFiles(root = siteRoot) {
  return [
    "content/source-maps",
    "docs/research",
  ].reduce(async (promise, directory) => {
    const files = await promise;
    return files.concat(await markdownFilesUnder(root, directory));
  }, Promise.resolve(["docs/ACADEMIC_CALIBRATION.md"]));
}

export async function auditSourceCorpus({ root = siteRoot, today = normalizeToday(), maxAgeDays = DEFAULT_MAX_AGE_DAYS } = {}) {
  const files = await sourceCorpusFiles(root);
  const errors = [];
  const urls = new Map();
  for (const relativePath of files.sort()) {
    const markdown = await readFile(join(root, relativePath), "utf8");
    const provenance = validateProvenance(markdown, { today, maxAgeDays });
    for (const error of provenance.errors) errors.push(`${relativePath}: ${error}`);
    for (const url of extractUrls(markdown)) {
      let parsed;
      try {
        parsed = new URL(url);
      } catch {
        errors.push(`${relativePath}: invalid URL ${url}`);
        continue;
      }
      if (parsed.protocol !== "https:") {
        errors.push(`${relativePath}: source URL must use HTTPS: ${url}`);
      }
      urls.set(url, (urls.get(url) ?? []).concat(relativePath));
    }
  }
  return { files, urls, errors };
}

function liveCorpusFiles(root) {
  return Promise.all(
    LIVE_ROOTS.map(async (relativePath) => {
      const absolutePath = join(root, relativePath);
      try {
        const metadata = await stat(absolutePath);
        return metadata.isDirectory() ? markdownFilesUnder(root, relativePath) : [relativePath];
      } catch {
        return [];
      }
    }),
  ).then((groups) => groups.flat());
}

function reachableStatus(status) {
  return (status >= 200 && status < 400) || [401, 403, 405, 429, 451].includes(status);
}

// University and standards sites occasionally stall a single HEAD request on
// a hosted runner even while the document is reachable. Keep the audit
// fail-closed for HTTP errors, but give transient transport aborts a bounded
// second chance before reporting a source as unavailable.
async function requestUrl(url, timeoutMs = 12_000) {
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      let response = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        headers: { "user-agent": "atlas-academy-source-audit/1" },
        signal: controller.signal,
      });
      // Some document servers incorrectly return 404 to HEAD while serving
      // the same URL to a bounded GET request (NIST's PDF endpoint is one
      // example). Retry those method-sensitive responses before classifying a
      // URL as dead.
      if ([404, 405, 501].includes(response.status)) {
        response = await fetch(url, {
          method: "GET",
          redirect: "follow",
          headers: {
            "user-agent": "atlas-academy-source-audit/1",
            range: "bytes=0-1023",
          },
          signal: controller.signal,
        });
      }
      clearTimeout(timer);
      if (reachableStatus(response.status)) {
        if (response.body) await response.body.cancel();
        return { status: response.status, finalUrl: response.url };
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      clearTimeout(timer);
      lastError = error;
    }
  }
  return { error: lastError?.message ?? "unknown request failure" };
}

export async function liveSourceLinks({ root = siteRoot, today = normalizeToday(), maxAgeDays = DEFAULT_MAX_AGE_DAYS } = {}) {
  const staticAudit = await auditSourceCorpus({ root, today, maxAgeDays });
  const liveFiles = await liveCorpusFiles(root);
  const liveUrls = new Set();
  for (const relativePath of liveFiles) {
    const markdown = await readFile(join(root, relativePath), "utf8");
    for (const url of extractUrls(markdown)) liveUrls.add(url);
  }
  const entries = [...liveUrls].sort();
  const results = [];
  let cursor = 0;
  const worker = async () => {
    while (cursor < entries.length) {
      const index = cursor;
      cursor += 1;
      results[index] = { url: entries[index], ...(await requestUrl(entries[index])) };
    }
  };
  const workers = Array.from({ length: Math.min(12, Math.max(1, entries.length)) }, () => worker());
  await Promise.all(workers);
  return { ...staticAudit, liveFiles, liveUrls: entries, liveResults: results };
}

async function main() {
  const live = process.argv.includes("--live");
  const today = normalizeToday(process.env.SOURCE_AUDIT_TODAY ?? new Date().toISOString().slice(0, 10));
  const maxAgeDays = Number(process.env.SOURCE_AUDIT_MAX_AGE_DAYS ?? DEFAULT_MAX_AGE_DAYS);
  if (!Number.isInteger(maxAgeDays) || maxAgeDays < 1) throw new Error("SOURCE_AUDIT_MAX_AGE_DAYS must be a positive integer.");
  const audit = live
    ? await liveSourceLinks({ today, maxAgeDays })
    : await auditSourceCorpus({ today, maxAgeDays });
  const errors = [...audit.errors];
  if (live) {
    for (const result of audit.liveResults) {
      if (result.error) errors.push(`${result.url}: ${result.error}`);
    }
  }
  console.log(
    `${live ? "Live source-link" : "Source-link"} audit: ${audit.files.length} documents, ${audit.urls.size} unique static URLs${live ? `, ${audit.liveUrls.length} source URLs checked` : ""}.`,
  );
  if (errors.length > 0) {
    console.error(errors.slice(0, 40).map((error) => `- ${error}`).join("\n"));
    if (errors.length > 40) console.error(`- ... ${errors.length - 40} more`);
    process.exitCode = 1;
    return;
  }
  if (live) {
    const statusCounts = audit.liveResults.reduce((counts, result) => {
      const key = result.status ?? "error";
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {});
    console.log(`Live status counts: ${JSON.stringify(statusCounts)}.`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
