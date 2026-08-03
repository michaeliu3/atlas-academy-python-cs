import GithubSlugger from "github-slugger";

/**
 * Remove the title already represented by the module page's single h1.
 *
 * @param {string} markdown
 */
export function stripDocumentTitle(markdown) {
  return markdown.replace(/^#\s+.+(?:\r?\n|$)/u, "");
}

/**
 * @param {string} markdown
 */
function headingText(markdown) {
  const codeSpans = [];
  const withoutCodeMarkup = markdown.replace(/`([^`]+)`/gu, (_match, code) => {
    const placeholder = `\u0000${codeSpans.length}\u0000`;
    codeSpans.push(code);
    return placeholder;
  });

  return withoutCodeMarkup
    .replace(/!\[([^\]]*)\]\([^)]+\)/gu, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/[*_~]/gu, "")
    .replace(/<[^>]+>/gu, "")
    .replace(/\u0000(\d+)\u0000/gu, (_match, index) => codeSpans[Number(index)])
    .trim();
}

/**
 * Advance the same GitHub slugger over every h1–h6 that rehype-slug sees,
 * while retaining only the h2/h3 entries useful in the visible section index.
 *
 * @param {string} markdown
 * @returns {{ id: string; title: string; depth: 2 | 3 }[]}
 */
export function extractTableOfContents(markdown) {
  const slugger = new GithubSlugger();
  /** @type {{ id: string; title: string; depth: 2 | 3 }[]} */
  const headings = [];
  let inFence = false;

  for (const line of markdown.split(/\r?\n/u)) {
    if (/^\s*```/u.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }

    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/u);
    if (!match) {
      continue;
    }

    const depth = match[1].length;
    const title = headingText(match[2]);
    const id = slugger.slug(title);
    if ((depth === 2 || depth === 3) && title) {
      headings.push({ id, title, depth });
    }
  }

  return headings;
}

/**
 * Extract the six core session anchors and the small learner artifact already
 * authored inside each session. This deliberately reads only the workbook's
 * visible teaching sequence: it does not create progress, infer mastery, or
 * treat an optional consolidation session as part of the Core route.
 *
 * @param {string} markdown
 * @returns {{ number: number; id: string; title: string; launch: string | null; output: string | null }[]}
 */
export function extractSessionLaunches(markdown) {
  const headings = extractTableOfContents(markdown);
  const headingIds = new Map(headings.map(({ id, title }) => [title, id]));
  const lines = markdown.split(/\r?\n/u);
  const sessions = [];

  for (let index = 0; index < lines.length; index += 1) {
    const sessionMatch = lines[index].match(/^##\s+Session\s+([1-6])\s+—\s+(.+?)\s*#*\s*$/u);
    if (!sessionMatch) continue;

    const number = Number(sessionMatch[1]);
    const title = headingText(sessionMatch[2]);
    const fullTitle = `Session ${number} — ${title}`;
    const id = headingIds.get(fullTitle);
    if (!id) continue;

    let nextSessionOrSection = lines.length;
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (/^##\s+/u.test(lines[cursor])) {
        nextSessionOrSection = cursor;
        break;
      }
    }

    const sessionLines = lines.slice(index + 1, nextSessionOrSection);
    const launchLine = sessionLines.find((line) => /^\*\*Launch:\*\*\s*\S/u.test(line));
    const explicitOutputPrefixPattern = new RegExp(
      `^###\\s+Session\\s+${number}\\s+output\\s+—\\s*`,
      "u",
    );
    const genericOutputPrefixPattern = /^###\s+Output:\s*/u;
    const hasOutputTitle = (line, prefixPattern) =>
      prefixPattern.test(line) && line.replace(prefixPattern, "").trim() !== "";
    const explicitOutputLine = sessionLines.find((line) =>
      hasOutputTitle(line, explicitOutputPrefixPattern),
    );
    const genericOutputLine = sessionLines.find((line) =>
      hasOutputTitle(line, genericOutputPrefixPattern),
    );
    const outputLine = explicitOutputLine ?? genericOutputLine;
    const outputPrefixPattern = explicitOutputLine
      ? explicitOutputPrefixPattern
      : genericOutputPrefixPattern;
    const launch = launchLine
      ? launchLine.replace(/^\*\*Launch:\*\*\s*/u, "").trim()
      : null;
    const output = outputLine
      ? headingText(outputLine.replace(outputPrefixPattern, ""))
      : null;

    sessions.push({ number, id, title, launch, output });
  }

  return sessions;
}
