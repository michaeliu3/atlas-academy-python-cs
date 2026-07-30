# Browser accessibility acceptance

`pnpm test:browser` builds the Atlas portal, starts that production artifact
locally, and runs focused Chromium acceptance checks. The checks use
`@axe-core/playwright` without rule exclusions or a baseline, and cover the
landing page, 60-day route, diagnostic, a Mermaid-heavy reader, and the M18,
M22, and M30 learner routes. They also exercise the skip link, an
operating-systems studio keyboard tab sequence, and the
prediction-and-confidence gates that protect explanation reveal.

Run it locally after installing Chromium:

~~~text
pnpm exec playwright install chromium
pnpm test:browser
~~~

CI installs Chromium with its system dependencies and uploads the HTML report
and failure traces when this gate fails. The report is short-lived CI evidence,
not learner data.

## Current local-runtime limitation

On the current Windows development host, Vinext 0.0.50's Node production
server indexes static-file paths with Windows separators but receives browser
asset URLs with `/` separators. A fresh `vinext start` can therefore return a
404 for an existing hashed `/assets/...` file before client hydration. This is
an upstream local-server limitation, not an axe result or a reason to remove
the Mermaid/browser assertions. The GitHub acceptance job runs on Ubuntu with
a fresh build and server; its exact run is the evidence to use for this gate.
Until that job passes, local static-page axe checks do **not** constitute a
complete browser-acceptance result.

This is a bounded automated browser check, not a claim of complete
accessibility. It does not replace manual keyboard review across every
interaction, screen-reader review, user testing, browser/device coverage, or
the required concise prose alternatives for instructional diagrams.
