# Archived release-tier tests

These tests validate release/provenance machinery and the historical M31–M36
publication-readiness snapshot. They are intentionally outside the normal
content and apparatus suites while the course has no real release. That keeps
ordinary lesson and draft-PR feedback focused on learner material without
discarding the checks.

Run them explicitly when preparing a real release candidate:

```powershell
pnpm test:release
```

The archive is not evidence of a release, deployment, publication, or learner
mastery. A future release review must run this suite alongside the non-draft
Course CI gate and record the exact source commit and limitations.
