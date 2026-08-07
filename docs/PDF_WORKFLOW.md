# Learner PDF workflow

Markdown and structured teaching-pack data remain the canonical sources. PDFs
are derived learner editions rendered from the same HTML components used by the
portal. This keeps equations, code blocks, Mermaid SVG, captions, source links,
and the visual hierarchy together instead of maintaining a second hand-edited
document.

## Local export

Start the portal in one terminal:

```powershell
pnpm dev -- --host localhost
```

Then, in a second terminal:

```powershell
pnpm render:pdf -- --base-url=http://localhost:4173 --modules=m01
pnpm validate:pdf -- --modules=m01 --pdfinfo
```

Omit `--modules=m01` for the full 36-module export; the full export also
creates `Atlas-Academy-course-handbook.pdf`. Add `--handbook` to a scoped
module export when you want the handbook alongside it. Local development can
render M31–M36 because the server is bound to the local machine; a production
deployment must set `ATLAS_PRIVATE_PDF_EXPORT=1` explicitly for those routes.
Without that production flag, they return not-found and cannot accidentally
become portal content.

Output goes to `output/pdf/` and includes `manifest.v1.json`. Each entry binds
the PDF hash to the workbook source hash and the Git commit observed at export.
The output directory is a generated artifact, not a replacement for the
tracked Markdown source.

## Rendering contract

The export waits for fonts, KaTeX, and asynchronous Mermaid SVG rendering. It
fails on pending diagrams, KaTeX errors, or raw Mermaid code. Print CSS keeps
code, diagrams, tables, callouts, and critical disclosures together where the
browser can honor that constraint. Interactive studios receive a static
printable companion notice; the live studio remains in the portal/chat.

After export, inspect rendered pages visually. Automated checks can show that
the DOM was ready and that files exist, but they cannot by themselves prove
that a PDF page is legible. Do not claim PDF/UA compliance without a separate
tagging and assistive-technology review.

## GitHub Actions budget

Do not export all PDFs on every push. Use the one-module smoke export locally
while authoring, run changed-module checks in ordinary CI, and use a manual or
release-candidate workflow for the complete PDF batch and page-image review.
Keep the source history additive; attach large or repeated PDF binaries as a
versioned private release artifact unless repository versioning is explicitly
required.
