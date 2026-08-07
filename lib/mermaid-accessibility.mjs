const metadataFields = Object.freeze({
  id: "atlas-diagram-id",
  title: "atlas-diagram-title",
  alternative: "atlas-diagram-alt",
});

const metadataPattern = /^\s*%%\s*atlas-diagram-(id|title|alt)\s*:\s*(.*?)\s*$/iu;
const validVisualId = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u;
const openingFencePattern = /^\s*(`{3,}|~{3,})([^`]*)$/u;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function startMermaidFence(line, fenceLanguage) {
  const match = line.match(openingFencePattern);
  if (!match) return null;
  const language = match[2].trim().split(/\s+/u)[0]?.toLowerCase();
  return language === fenceLanguage ? { marker: match[1][0], length: match[1].length } : null;
}

function closesFence(line, opening) {
  const match = line.match(/^\s*(`{3,}|~{3,})\s*$/u);
  return Boolean(match && match[1][0] === opening.marker && match[1].length >= opening.length);
}

function metadataResult(fields) {
  return Object.keys(fields).length === 0
    ? null
    : {
      id: fields.id ?? null,
      title: fields.title ?? null,
      alternative: fields.alternative ?? null,
    };
}

/**
 * Extract Atlas-owned Mermaid metadata without handing the metadata comments
 * to Mermaid. The small convention deliberately stays inside the source fence
 * so a diagram's title/alternative travels with the visual it describes:
 *
 * %% atlas-diagram-id: m01-example
 * %% atlas-diagram-title: Short human title
 * %% atlas-diagram-alt: Concise prose explanation.
 */
export function parseMermaidAccessibilityMetadata(source) {
  const fields = {};
  const errors = [];
  const renderLines = [];

  for (const line of source.split(/\r?\n/u)) {
    const match = line.match(metadataPattern);
    if (!match) {
      renderLines.push(line);
      continue;
    }
    const fieldByCapture = { id: "id", title: "title", alt: "alternative" };
    const field = fieldByCapture[match[1].toLowerCase()];
    const value = text(match[2]);
    if (fields[field] !== undefined) {
      errors.push(`declares ${metadataFields[field]} more than once`);
      continue;
    }
    if (value === "") {
      errors.push(`declares ${metadataFields[field]} without text`);
      continue;
    }
    fields[field] = value;
  }

  return {
    metadata: metadataResult(fields),
    errors,
    renderSource: renderLines.join("\n").trim(),
  };
}

/**
 * Enumerate visual fences in a Markdown document. This is intentionally a
 * narrow Markdown scanner rather than a renderer: it supports the repository's
 * normal backtick/tilde fences and returns exact source locations for authoring
 * reports.
 *
 * `language` selects the fence to collect. It defaults to Mermaid; Atlas
 * figures use the same `%% atlas-diagram-*` metadata convention so that every
 * visual, whatever draws it, carries the same text-alternative contract.
 */
export function scanMermaidBlocks(
  markdown,
  { sourcePath = "(unknown Markdown source)", language = "mermaid" } = {},
) {
  const lines = markdown.split(/\r?\n/u);
  const blocks = [];
  let opening = null;
  let sourceLines = [];
  let startLine = 0;

  for (const [index, line] of lines.entries()) {
    if (opening === null) {
      const candidate = startMermaidFence(line, language);
      if (candidate) {
        opening = candidate;
        sourceLines = [];
        startLine = index + 1;
      }
      continue;
    }

    if (closesFence(line, opening)) {
      const source = sourceLines.join("\n");
      const parsed = parseMermaidAccessibilityMetadata(source);
      blocks.push({
        sourcePath,
        index: blocks.length + 1,
        line: startLine,
        source,
        ...parsed,
      });
      opening = null;
      sourceLines = [];
      startLine = 0;
      continue;
    }
    sourceLines.push(line);
  }

  if (opening !== null) {
    blocks.push({
      sourcePath,
      index: blocks.length + 1,
      line: startLine,
      source: sourceLines.join("\n"),
      renderSource: sourceLines.join("\n").trim(),
      metadata: null,
      errors: [`has an unclosed ${language} fence`],
    });
  }

  return blocks;
}

export function mermaidAccessibilityMetadataErrors(block) {
  const errors = [...block.errors];
  const metadata = block.metadata;
  if (!metadata?.id || !metadata.title || !metadata.alternative) {
    errors.push("requires complete title and text-alternative metadata");
    return errors;
  }
  if (!validVisualId.test(metadata.id)) {
    errors.push("must use a lower-case kebab-case visual ID");
  }
  if (metadata.title.length > 120) {
    errors.push("title must be concise (120 characters or fewer)");
  }
  if (metadata.alternative.length < 24 || metadata.alternative.length > 600) {
    errors.push("text alternative must be a concise 24–600 character explanation");
  }
  if (block.renderSource === "") {
    errors.push("must retain render source after metadata comments are removed");
  }
  return errors;
}

export function hasCompleteMermaidAccessibilityMetadata(block) {
  return mermaidAccessibilityMetadataErrors(block).length === 0;
}

/**
 * Validate an already-scanned collection of Mermaid blocks. By default it
 * returns an honest migration report; strict promotion/release callers set
 * requireComplete to turn every missing authored alternative into an error.
 */
export function validateMermaidAccessibility(blocks, { requireComplete = false } = {}) {
  const incompleteBlocks = [];
  const errors = [];
  const locationsById = new Map();

  for (const block of blocks) {
    const blockErrors = mermaidAccessibilityMetadataErrors(block);
    if (blockErrors.length > 0) {
      incompleteBlocks.push({
        sourcePath: block.sourcePath,
        index: block.index,
        line: block.line,
        errors: blockErrors,
      });
      continue;
    }
    const prior = locationsById.get(block.metadata.id);
    if (prior) {
      errors.push(
        `${block.sourcePath}:${block.line} reuses visual ID ${block.metadata.id}; first used at ${prior.sourcePath}:${prior.line}.`,
      );
      continue;
    }
    locationsById.set(block.metadata.id, block);
  }

  if (requireComplete) {
    for (const block of incompleteBlocks) {
      errors.push(
        `${block.sourcePath}:${block.line} ${block.errors.join("; ")}.`,
      );
    }
  }
  if (errors.length > 0) {
    throw new Error(`Mermaid accessibility validation failed:\n- ${errors.join("\n- ")}`);
  }
  return {
    blocks,
    incompleteBlocks,
    summary: {
      totalBlocks: blocks.length,
      completeBlocks: blocks.length - incompleteBlocks.length,
      incompleteBlocks: incompleteBlocks.length,
    },
  };
}
