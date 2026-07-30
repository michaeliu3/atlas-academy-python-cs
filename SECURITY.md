# Security and privacy boundary

Atlas Academy is an educational portal, not a production identity, policy,
sandbox, analytics, or learner-record system.

- Do not commit credentials, private keys, API tokens, session data, Notion
  exports, learner diagnostics, or personal progress records.
- Use only fixed local fixtures in downloadable teaching models.
- Do not turn code-reading examples into arbitrary-code runners.
- Treat deployment credentials as short-lived and outside source control.
- Private remotes are an access boundary, not a secret store. Use the explicit
  `github` and `origin` remote roles in [Deployment](docs/DEPLOYMENT.md), and
  never use broad push commands that could send material to an unintended
  remote.
- If a credential or private learner record is exposed, revoke or rotate the
  credential first and report the incident privately; do not paste the value
  into an issue, commit, CI log, or chat.
- Report a suspected secret or privacy issue privately to the repository owner;
  do not open a public issue containing the sensitive value.

See [Privacy](docs/PRIVACY.md) for operational detail.
