# Module 15 — Files, Serialization, Packaging, and Delivery — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, access/reuse boundaries, and
candidate-only structural evidence for the existing M15 workbook. This is an
instructor-facing audit record, not a release approval, credential, or
permission to reuse external assets.

## Candidate boundary

M15 remains `legacy-open` for learner access, `legacy-baseline` for its
contract state, and `unrecorded` for release. This record supports only a
non-promoting structural candidate. It does not establish clean-install
execution, artifact provenance, human review, CI, deployment, publication,
GPT Live behavior, Notion activity, or learner mastery.

Atlas owns its bundle format, code, fixtures, failure timelines, artifact maps,
diagrams, diagnostics, dossiers, and prompts. External material is linked and
paraphrased only. Do not copy course slides, exercises, solutions, figures,
prose, or source code merely because it is public.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **P01** | Python 3.14: [`io`](https://docs.python.org/3.14/library/io.html), [context managers](https://docs.python.org/3.14/reference/datamodel.html#context-managers), [`json`](https://docs.python.org/3.14/library/json.html), [`pickle`](https://docs.python.org/3.14/library/pickle.html), and [`tarfile` extraction filters](https://docs.python.org/3.14/library/tarfile.html#extraction-filters) | Text/bytes, enter/exit, format/security, and archive-boundary behavior. They do not prove cross-platform durability, application validation, or artifact trust. | Accessed 2026-08-02. Link and paraphrase only; recheck the [Python license](https://docs.python.org/3/license.html) before exact reuse. |
| **P02** | PyPA: [`pyproject.toml`](https://packaging.python.org/en/latest/specifications/pyproject-toml/), [core metadata](https://packaging.python.org/en/latest/specifications/core-metadata/), [wheel format](https://packaging.python.org/en/latest/specifications/binary-distribution-format/), and [sdist format](https://packaging.python.org/en/latest/specifications/source-distribution-format/) | Standardized project/build/metadata/distribution roles. They do not establish that an Atlas source tree, wheel, command, or dependency graph actually works. | Accessed 2026-08-02. Link and paraphrase only; specifications are living and tool behavior must be recorded separately. |
| **P03** | pip: [Repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/) | Version pinning, hash checking, and the limits of repeatability evidence. It does not promise availability, benign code, portable behavior, or a universal lock workflow. | Accessed 2026-08-02. Link and paraphrase only; record the exact installer/resolver version in any later lab. |
| **U01** | MIT 6.102: [course site](https://web.mit.edu/6.102/www/sp26/) and [Git/version-control tool route](https://web.mit.edu/6.102/www/sp26/tools/git-1-version-control/) | Course-level calibration for contracts, evidence, readable change, and version-control reasoning. It does not replicate institutional team delivery or assessment. | Accessed 2026-08-02. Link and paraphrase only; no course materials are imported. |
| **U02** | Stanford CS 45: [Software Tools archive](https://web.stanford.edu/class/archive/cs/cs45/cs45.1234/) | Independent toolchain-oriented calibration for version control, builds, debugging, and environment awareness. | Accessed 2026-08-02. Link and paraphrase only; course materials have their own terms and are not copied. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Sessions 1–2: bytes and resource lifetime | Value/encoding/path trace, context-manager and publication failure timeline | `P01` | A context manager or successful replacement does not prove atomic multi-file publication, crash durability, backup, or cross-platform behavior. |
| Sessions 3–4: schema, trust, and adversarial reading | Version matrix, migration proof sketch, archive allowlist, independent verifier and patch review | `P01`; Atlas-original examples | Valid JSON, a matching digest, or successful tests do not establish domain validity, trusted origin, safe deserialization, or a complete attack model. |
| Session 5: built artifact and installation | Five-column source/sdist/wheel/environment/command receipt | `P02`, `P03` | Metadata and a wheel tag are compatibility claims, not proof of file selection, entry-point behavior, dependency resolution, or every platform outcome. |
| Session 6: release and rollback | Artifact/release receipt, data/code rollback analysis, M16 handoff | `P02`, `P03`, `U01`, `U02` | A local receipt, agent account, or oral conversation is not CI, publisher authorization, deployed provenance, release approval, or mastery evidence. |

## License and reuse boundary

Python and PyPA own library/specification claims; pip owns its documented
installer model; university sources calibrate teaching scope. They do not make
Atlas equivalent to an institutional course or permit reproduction of external
assets.

For exact wording, figures, code, assignments, solutions, or screenshots,
pause and separately verify current license, attribution, academic-integrity,
and distribution terms. Public availability is not reuse approval.

## Stable learner links

Open one link only after an Atlas prediction: byte/resource mechanism (`P01`),
project/distribution metadata (`P02`), resolver/repeatability boundary (`P03`),
or course-level tooling context (`U01`/`U02`). These links are not an answer
key or permission to bypass M14 or M16.

## Visual and text-alternative review boundary

M15’s Mermaid blocks carry local ID, title, and concise text-alternative
metadata for the shared reader. This structural check does not establish
semantic rendering, keyboard behavior, screen-reader experience, cognitive
load, clean-install behavior, or learner comprehension.

## Release and review questions still open

- Recheck living docs/specifications, URLs, versions, and reuse terms before a
  later human review or release claim.
- Verify each artifact in a recorded clean environment; this ledger does not
  execute a build, install, or command.
- Test browser/accessibility and real chat-whiteboard behavior separately.
- Treat TA, Study Partner, GPT Live, and Notion activity as learner-controlled
  evidence, never as an automatic result of this addendum.
- Keep this candidate non-promoting until qualified review, a reviewed source
  commit, source-commit CI, deployment evidence, and release records exist.
