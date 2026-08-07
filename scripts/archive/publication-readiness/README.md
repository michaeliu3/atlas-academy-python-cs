# Archived publication-readiness auditor

This auditor is retained only to validate the historical M31–M36
publication-readiness snapshot under `docs/archive/publication-readiness/`.
It is not an active publication gate, does not promote modules, and is not
invoked by the learner or the normal Course CI path. Its regression test lives
under `tests/archive/release/` so the historical boundary remains inspectable
without keeping the release apparatus in the active script surface.
