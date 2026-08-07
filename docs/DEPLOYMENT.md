# Deployment

## Current truth

Atlas Academy is configured for a **private ChatGPT Sites** deployment. The
portal uses Vinext/Cloudflare worker/server output. The current private
deployment status has not been independently recorded in the release ledger,
so this repository makes no current-deployment claim. GitHub Pages is not a
configured deployment target, and this repository must not claim otherwise.

The project deliberately has two remotes with different responsibilities:

- `github` is configured for the private GitHub project: source review,
  GitHub Actions CI after a workflow is pushed, issues, and any future GitHub
  Releases.
- `origin` is configured for the private ChatGPT Sites hosting workflow. It is
  a deployment input, not a GitHub remote, CI system, or release registry.

There is no automatic GitHub-to-hosting deployment in the checked-in workflow.
A configured remote, a workflow file, a local tag, or a changelog heading is
not evidence that CI ran or a GitHub Release was published. Verify those
outcomes in GitHub's Actions and Releases interfaces before relying on them.

`wrangler.jsonc` and the checked-in `worker-configuration.d.ts` form a
versioned **type contract** for the Worker bindings used by the portal. They
are checked by CI with `wrangler types --check`; they are not a deployment
command or evidence that `wrangler deploy` is used for ChatGPT Sites. The
current configuration declares asset and image bindings only. The optional D1
example fails closed until a real hosting configuration deliberately declares a
D1 binding.

## Two-remote operating policy

Run all quality gates before publishing. Address each remote explicitly; do
not rely on an implicit default and do not use `git push --all`:

~~~text
git push github main
git push origin main
~~~

Pushes remain separate because their effects are separate: the first makes the
reviewable source and CI workflow available to GitHub; the second supplies the
private hosting workflow. Neither action substitutes for verifying the other.
Never send learner records, Notion exports, credentials, or hosting tokens to
either remote.

## Release gate

Before a private deployment:

1. validate the course-input contract and synchronize generated learner
   artifacts;
2. verify Worker type freshness, run strict TypeScript, lint, and the full
   production portal test;
3. run relevant Python behavioral tests;
4. inspect changed source maps, privacy boundaries, dependency risk, and known
   limitations;
5. create a small additive, reviewable commit and update the changelog;
6. push the intended branch to `github` without a force-push and verify the actual GitHub Actions
   result before treating CI as passed;
7. publish a GitHub Release only after its tag and release page exist, if a
   GitHub release milestone is intended;
8. use the configured private `origin` hosting workflow;
9. verify the private deployment status reports success.

## Why not GitHub Pages yet?

GitHub Pages publishes static sites. The current portal has worker/server
output and private learner-interface constraints. A Pages route may be added
only after all of the following are demonstrated:

- a complete static build has been produced and tested;
- no learner-private content, Notion records, or credentials can be published;
- the interactive studio and module reader still work without server behavior;
- the new deployment has its own evidence and rollback plan.

## Secrets and permissions

Never store deployment credentials, personal access tokens, service keys, or
Notion exports in the repository. A future CI deployment must use a protected
environment, minimum permissions, short-lived credentials when available, and
an explicit approval boundary.
