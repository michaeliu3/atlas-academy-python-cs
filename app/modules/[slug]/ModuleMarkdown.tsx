import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { atlasMarkdownSanitizationSchema } from "@/lib/rich-content-sanitization.mjs";
import { LessonTable } from "./LessonTable";
import { MermaidDiagram } from "./MermaidDiagram";

type ModuleMarkdownProps = {
  markdown: string;
};

const languageNames: Readonly<Record<string, string>> = {
  asm: "Assembly",
  bash: "Shell",
  console: "Console",
  css: "CSS",
  html: "HTML",
  json: "JSON",
  markdown: "Markdown",
  mermaid: "Mermaid",
  py: "Python",
  python: "Python",
  riscv: "RISC-V assembly",
  sql: "SQL",
  text: "Text",
  toml: "TOML",
  ts: "TypeScript",
  typescript: "TypeScript",
  yaml: "YAML",
};

function normalizeMathDelimiters(markdown: string): string {
  let fenceMarker: "`" | "~" | null = null;

  return markdown
    .split(/\r?\n/u)
    .map((line) => {
      const fence = line.match(/^\s*(`{3,}|~{3,})/u)?.[1];
      if (fence) {
        const marker = fence[0] as "`" | "~";
        if (fenceMarker === null) {
          fenceMarker = marker;
        } else if (fenceMarker === marker) {
          fenceMarker = null;
        }
        return line;
      }

      if (fenceMarker !== null) {
        return line;
      }

      return line
        .replaceAll("\\[", () => "$$")
        .replaceAll("\\]", () => "$$")
        .replaceAll("\\(", () => "$")
        .replaceAll("\\)", () => "$");
    })
    .join("\n");
}

function textFromNode(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return textFromNode(child.props.children);
      }
      return "";
    })
    .join("");
}

type TaskCheckboxProps = {
  type?: string;
  "aria-label"?: string;
  readOnly?: boolean;
};

/**
 * GFM renders a task list as a disabled checkbox followed by task text rather
 * than a native <label>. Keep the familiar visual checklist, but give each
 * inert control the same specific name a screen-reader user needs to
 * understand it. This applies to every workbook, not only the first route
 * where Axe happened to find the issue.
 */
function labelTaskListCheckboxes(children: ReactNode): ReactNode {
  const taskText = textFromNode(children).replace(/\s+/gu, " ").trim();
  const accessibleName = taskText
    ? `Read-only workbook checklist item: ${taskText}`
    : "Read-only workbook checklist item";

  return Children.map(children, (child) => {
    if (
      isValidElement<TaskCheckboxProps>(child) &&
      child.type === "input" &&
      child.props.type === "checkbox"
    ) {
      return cloneElement(child, {
        "aria-label": accessibleName,
        readOnly: true,
      });
    }
    return child;
  });
}

const markdownComponents: Components = {
  a({
    "aria-label": ariaLabel,
    children,
    className,
    href,
    title,
  }) {
    const external = Boolean(href && /^https?:\/\//iu.test(href));
    return (
      <a
        aria-label={ariaLabel}
        className={className}
        href={href}
        rel={external ? "noreferrer" : undefined}
        target={external ? "_blank" : undefined}
        title={title}
      >
        {children}
        {external ? (
          <span aria-hidden="true" className="external-link-mark">
            ↗
          </span>
        ) : null}
      </a>
    );
  },
  blockquote({ children }) {
    return <blockquote className="lesson-callout">{children}</blockquote>;
  },
  code({ children, className }) {
    return <code className={className}>{children}</code>;
  },
  details({ children, open }) {
    return (
      <details className="lesson-details" open={open}>
        {children}
      </details>
    );
  },
  h2({ children, id }) {
    return <h2 id={id}>{children}</h2>;
  },
  h3({ children, id }) {
    const title = textFromNode(children);
    const className = /^Question\s+\d+/iu.test(title)
      ? "quiz-heading"
      : /^Session\s+\d+/iu.test(title)
        ? "session-heading"
        : undefined;
    return (
      <h3 className={className} id={id}>
        {children}
      </h3>
    );
  },
  li({ children, className }) {
    const isTaskListItem = className?.split(/\s+/u).includes("task-list-item");
    return (
      <li className={className}>
        {isTaskListItem ? labelTaskListCheckboxes(children) : children}
      </li>
    );
  },
  pre({ children }) {
    const child = Children.toArray(children)[0];
    if (!isValidElement<{ children?: ReactNode; className?: string }>(child)) {
      return (
        <pre aria-label="Scrollable lesson code example" tabIndex={0}>
          {children}
        </pre>
      );
    }

    const language =
      child.props.className?.match(/language-([\w-]+)/u)?.[1]?.toLowerCase() ??
      "text";
    const source = textFromNode(child.props.children).replace(/\n$/u, "");

    if (language === "mermaid") {
      return <MermaidDiagram source={source} />;
    }

    return (
      <figure className="lesson-code">
        <figcaption>{languageNames[language] ?? language}</figcaption>
        <pre
          aria-label={`Scrollable ${languageNames[language] ?? language} code example`}
          tabIndex={0}
        >
          <code className={child.props.className}>{child.props.children}</code>
        </pre>
      </figure>
    );
  },
  summary({ children }) {
    return <summary>{children}</summary>;
  },
  table({ children }) {
    return <LessonTable>{children}</LessonTable>;
  },
};

export function ModuleMarkdown({ markdown }: ModuleMarkdownProps) {
  const learnerMarkdown = normalizeMathDelimiters(markdown);

  return (
    <ReactMarkdown
      components={markdownComponents}
      rehypePlugins={[
        rehypeRaw,
        [rehypeSanitize, atlasMarkdownSanitizationSchema],
        rehypeKatex,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            content: { type: "text", value: "¶" },
            properties: {
              "aria-label": "Link to this section",
              className: ["heading-anchor"],
            },
          },
        ],
      ]}
      remarkPlugins={[remarkGfm, remarkMath]}
    >
      {learnerMarkdown}
    </ReactMarkdown>
  );
}
