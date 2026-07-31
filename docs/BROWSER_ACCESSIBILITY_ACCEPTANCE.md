# Browser accessibility acceptance

`pnpm test:browser` builds the Atlas portal, starts that production artifact
locally, and runs focused Chromium acceptance checks. The checks use
`@axe-core/playwright` without rule exclusions or a baseline, and cover the
landing page, 60-day route, diagnostic, a Mermaid-heavy reader, and the M18,
M19, M22, and M30 learner routes. They also exercise the skip link, an
operating-systems studio keyboard tab sequence, prediction-and-confidence
gates that protect explanation reveal, the diagnostic's explicit
copy/print-review control, and M19's rule that a changed evidence brief
revokes copy approval.

Run it locally after installing Chromium:

~~~text
pnpm exec playwright install chromium
pnpm test:browser
~~~

CI installs Chromium with its system dependencies and uploads the HTML report
and failure traces when this gate fails. The report is short-lived CI evidence,
not learner data.

## Verified CI browser evidence

On 2026-07-30, [GitHub Actions run 30581687917](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30581687917)
passed the portal, Python 3.12/3.14 teaching-model, and Linux browser jobs.
The pull-request workflow received source head
[`b5896be60e0887c41c3bdd263a6e1f34b565cbd4`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b5896be60e0887c41c3bdd263a6e1f34b565cbd4)
and checked merge candidate
[`f670ec62cf7df108d920602f1a48984e69e2e3c9`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/f670ec62cf7df108d920602f1a48984e69e2e3c9).
The browser job built that candidate and passed all 16 targeted tests. This is
historical bounded automated browser-acceptance evidence; it does not make a
release or a complete accessibility claim. After this successful run, GitHub
`main` was configured to require the `Browser accessibility acceptance` check
alongside the existing strict release checks.

On 2026-07-30, [GitHub Actions run 30587015926](https://github.com/michaeliu3/atlas-academy-python-cs/actions/runs/30587015926)
then passed all four jobs for source head
[`b8b9a8870fe8a14e4b886572249f3ac0f50037f6`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/b8b9a8870fe8a14e4b886572249f3ac0f50037f6)
and merge candidate
[`85306aa6c705eb244cb697ad909003389d97a76b`](https://github.com/michaeliu3/atlas-academy-python-cs/commit/85306aa6c705eb244cb697ad909003389d97a76b).
The Linux browser job built that candidate and passed all 17 targeted tests,
including the next-question keyboard-focus regression. This is the newest
bounded browser-acceptance evidence, not a GitHub Release, a private
deployment, or a complete accessibility review. Every later candidate still
requires its own fresh run.

## Windows production-server compatibility patch

Vinext 0.0.50's upstream Node production server originally indexed static-file
cache keys with Windows `\` separators while browsers request `/assets/...`
URLs with `/`. That caused a fresh local `vinext start` to return 404 before
client hydration, so Mermaid and interactive browser checks could not run.

The reviewed, version-pinned `patches/vinext@0.0.50.patch` normalizes the
cache's relative paths to URL separators. `pnpm-workspace.yaml` binds the patch
to exactly Vinext 0.0.50 and the lockfile records its hash. The focused
`tests/vinext-static-assets.test.mjs` regression creates an asset cache and
requires the browser-style URL lookup to resolve. This is a local test-server
compatibility fix, not a security remediation, a deployment claim, or proof of
complete accessibility.

Every later candidate still needs a fresh browser run. The Linux CI job remains
the release evidence for browser acceptance; successful local static-page axe
checks do **not** substitute for it.

This is a bounded automated browser check, not a claim of complete
accessibility. It does not replace manual keyboard review across every
interaction, screen-reader review, user testing, browser/device coverage, or
the required concise prose alternatives for instructional diagrams.
