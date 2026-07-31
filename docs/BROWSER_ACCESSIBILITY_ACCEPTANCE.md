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

## Current local-runtime limitation

On the current Windows development host, Vinext 0.0.50's Node production
server indexes static-file paths with Windows separators but receives browser
asset URLs with `/` separators. A fresh `vinext start` can therefore return a
404 for an existing hashed `/assets/...` file before client hydration. This is
an upstream local-server limitation, not an axe result or a reason to remove
the Mermaid/browser assertions. The GitHub acceptance job runs on Ubuntu with
a fresh build and server; the newest successful run above is the evidence to use
for this gate. Every later candidate still needs its own fresh run. Local
static-page axe checks do **not** substitute for the Linux browser-acceptance
result.

This is a bounded automated browser check, not a claim of complete
accessibility. It does not replace manual keyboard review across every
interaction, screen-reader review, user testing, browser/device coverage, or
the required concise prose alternatives for instructional diagrams.
