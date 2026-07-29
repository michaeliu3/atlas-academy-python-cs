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
