# Module 18 — Operating Systems and Resource Mediation — Source-Audit Addendum

**Audit date:** 2026-08-02  
**Scope:** source roles, claim linkage, reuse limits, and candidate-only
structural evidence for the existing M18 workbook and source map. This is an
instructor-facing audit record. It is not an operating-system certification,
platform test result, release decision, or learner-result record.

## Candidate boundary

This addendum supports only a non-promoting structural candidate. It does not
establish human review, a checked deployment, a reviewed source commit,
source-commit CI, a learner's mastery, a completed oral conversation, or a
runtime experiment on any operating system.

The Atlas workbook's incidents, diagrams, state traces, reference architecture,
diagnostics, dossiers, and prompts are original course synthesis. Publicly
reachable material is linked and paraphrased only. Do not copy lectures,
slides, figures, labs, solutions, assignments, media, prose, or source code
merely because it is available online.

## Source and reuse ledger

| ID | Owner and stable learner-facing link | Intended claim scope | Access / reuse status |
| --- | --- | --- | --- |
| **C01** | ACM/IEEE-CS/AAAI [CS2023 report](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm) and [ABET CAC 2026–2027 criteria](https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-computing-programs-2026-2027/) | Calibration for operating-systems coverage, systems boundaries, analysis, and integrating evidence. Neither source certifies Atlas, this module, or a learner. | Accessed 2026-08-02. Link and paraphrase only; do not imply accreditation, endorsement, or institutional equivalence. |
| **U01** | [OSTEP v1.10](https://pages.cs.wisc.edu/~remzi/OSTEP/) and its [official homework collection](https://pages.cs.wisc.edu/~remzi/OSTEP/Homework/homework.html) | First-principles sequence for process virtualization, scheduling, address translation, persistence, and access control. It does not make a classroom model a host-OS observation. | Accessed 2026-08-02. Link and paraphrase only; retain original Atlas traces/questions and do not redistribute or silently adapt homework. |
| **U02** | MIT [6.1810 Fall 2025](https://pdos.csail.mit.edu/6.S081/2025/schedule.html), [xv6 RISC-V book rev5](https://pdos.csail.mit.edu/6.828/2025/xv6/book-riscv-rev5.pdf), [page-table lab](https://pdos.csail.mit.edu/6.1810/2025/labs/pgtbl.html), and [OCW 6.1810 Fall 2023](https://ocw.mit.edu/courses/6-1810-operating-system-engineering-fall-2023/) | Readable bounded mechanism route for system calls, page tables, filesystems, and recovery. xv6 is a teaching model, not a portable Python or production-OS contract. | Accessed 2026-08-02. Live materials are link-only; do not publish lab solutions. Recheck OCW license and attribution terms before any asset reuse. |
| **U03** | Berkeley [CS 162](https://www2.eecs.berkeley.edu/Courses/CS162/) and Stanford [CS 111](https://web.stanford.edu/class/cs111/) | Cross-check for systems goals, protection, reliability, code reading, and crash reasoning. They do not supply permission to reuse course assets. | Accessed 2026-08-02. Link and paraphrase only; treat live-course materials as restricted unless a specific asset grants reuse. |
| **P01** | Python 3.14 [`subprocess`](https://docs.python.org/3.14/library/subprocess.html), [`os`](https://docs.python.org/3.14/library/os.html), [`io`](https://docs.python.org/3.14/library/io.html), [`mmap`](https://docs.python.org/3.14/library/mmap.html), [`pathlib`](https://docs.python.org/3.14/library/pathlib.html), [`signal`](https://docs.python.org/3.14/library/signal.html), [`atexit`](https://docs.python.org/3.14/library/atexit.html), and [`tempfile`](https://docs.python.org/3.14/library/tempfile.html) | Documented Python-level process, file, mapping, path, signal, cleanup, and temporary-file boundaries. They do not prove a physical disk operation, host scheduling cause, or universal implementation detail. | Accessed 2026-08-02. Link and paraphrase only; recheck the [Python documentation license](https://docs.python.org/3/license.html) before exact reuse. |
| **S01** | POSIX.1-2024 / Issue 8 [`fork`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/fork.html), [`exec`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/exec.html), [`wait`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/wait.html), [`open`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/open.html), [`rename`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html), and [`fsync`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/fsync.html) | Named POSIX contracts for lifecycle, descriptors, namespace transitions, and synchronization. They are not Windows guarantees and do not alone prove power-loss durability. | Accessed 2026-08-02. Link and narrowly paraphrase; do not copy standard tables, diagrams, or substantial text. |
| **W01** | Microsoft Learn [Processes and Threads](https://learn.microsoft.com/en-us/windows/win32/procthread/processes-and-threads), [process handles and identifiers](https://learn.microsoft.com/en-us/windows/win32/procthread/process-handles-and-identifiers), [virtual address space](https://learn.microsoft.com/en-us/windows/win32/memory/virtual-address-space-and-physical-storage), [files and clusters](https://learn.microsoft.com/en-us/windows/win32/fileio/files-and-clusters), and [access-control components](https://learn.microsoft.com/en-us/windows/win32/secauthz/access-control-components) | Windows process, handle, virtual-memory, file, and authorization contrasts. They do not make Windows a failed POSIX emulation or make POSIX terminology portable. | Accessed 2026-08-02. Link and paraphrase under Microsoft documentation terms; recheck terms before reusing diagrams or code. |
| **I01** | Pinned CPython [`c63aec69…`](https://github.com/python/cpython/tree/c63aec69bd59c55314c06c23f4c22c03de76fe45), [`Lib/subprocess.py`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/subprocess.py), [`Modules/_posixsubprocess.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Modules/_posixsubprocess.c), [`Modules/_winapi.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Modules/_winapi.c), and [`Modules/posixmodule.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Modules/posixmodule.c) | Version-scoped implementation-reading route for one creation or replacement bridge. It does not describe every Python implementation or prove the bundled runtime matches the pin. | Accessed 2026-08-02. Link/pin/paraphrase only; inspect repository license before any code or figure reuse. |
| **N01** | NIST [least privilege](https://csrc.nist.gov/glossary/term/least_privilege) | Design vocabulary for minimizing authority in the worker/supervisor scenario. It does not prove a particular file access will succeed. | Accessed 2026-08-02. Cite and explain in original prose; do not turn the glossary definition into a security certification. |

## Claim linkage and stopping lines

| Workbook location | Claim or learner artifact | Source route | Required stopping line |
| --- | --- | --- | --- |
| Session 1 — mediator and ownership layers | Four-responsibility map and Python-to-OS trace | `U01`, `U02`, `P01`, `S01`, `W01` | A public Python API may reach an OS interface; it does not prove one syscall, a particular kernel path, one device operation, or an observed host event. |
| Session 2 — process, lifecycle, and declared scheduling | Program/process/resource-capsule trace, exit-status table, and one-CPU toy schedule | `U01`, `P01`, `S01`, `W01` | A declared schedule predicts only its stated teaching model. Process termination, PID, handle, status collection, parent, and descendant lifetime must not be collapsed. |
| Session 3 — virtual memory and faults | Address translation, TLB/page-table distinction, and fault classifier | `U01`, `U02`, `S01`, `W01` | A TLB miss is not necessarily a page fault; a page fault does not prove storage I/O; `id()` and Python-object size are not physical-address or memory-layout evidence. |
| Session 4 — names, open resources, caches, and authority | Path/open-resource/descriptor-or-handle map and operation-time authority trace | `P01`, `S01`, `W01`, `N01` | A pathname, filesystem object, open resource, descriptor/handle, and Python file object are distinct. POSIX descriptors and Windows handles are related contrasts, not interchangeable contracts. |
| Session 5 — interruption and shutdown | Cooperative-stop → bounded-wait → recorded-escalation protocol and artifact classifier | `P01`, `S01`, `W01` | Normal cleanup, a requested termination, forced termination, and OS/power failure are different cases. Never act on an unverified PID or claim descendant cleanup without a named policy and evidence. |
| Session 6 — publication and recovery | Same-directory staging/replacement phases, crash-cut matrix, and evidence dossier | `P01`, `U01`, `U02`, `S01`, `W01` | Flush, file synchronization, namespace replacement, visibility, durability, recovery, and transactionality remain separate claims. A process-kill test is not a power-loss test. |
| M18 forward boundaries | Handoff to concurrency, networks, distribution, and runtime internals | `U01`, `U02`, `I01` | M19 owns interleavings/locks; M20 owns network protocols; M21 owns asynchronous/distributed uncertainty; M24 owns CPython runtime internals. Naming a boundary neither teaches nor verifies it. |

## License and reuse boundary

The ledger calibrates a rigorous, first-principles course sequence and supports
bounded documented claims. It does not create a credential, make Atlas
equivalent to an institutional course, or transfer external assets into the
project.

Before exact reuse of wording, a figure, an exercise, a solution, a video, or
source code, pause and separately verify the current license, attribution,
academic-integrity, and distribution terms. Public availability is not reuse
permission. In particular, do not distribute live-course or OSTEP homework
solutions, and do not treat a CPython source pin as permission to copy source
into a learner exercise.

## Visual and text-alternative review boundary

The M18 workbook contains nineteen Mermaid diagrams with local identifiers,
titles, and concise text-alternative metadata for the shared reader. That is
structural reader input only. It does not establish semantic rendering,
keyboard operation, screen-reader experience, browser compatibility, cognitive
load, live-chat equation/code rendering, whiteboard behavior, or learner
comprehension. Those require separate targeted review and evidence.

## Release, privacy, and review questions still open

- Recheck all living course, standard, platform, and source-pin links; versions;
  licenses; and reuse terms before a later human review or release claim.
- Record the executed Python implementation and full version, OS/build,
  environment, filesystem/volume facts, same-directory assertion, capability
  profile, injected stop phase, and raw outcomes before making a platform or
  durability statement.
- Use only disposable synthetic lab data, bounded waits, explicit process
  ownership, and no elevation; keep user data, repository state, and course
  records out of failure injection.
- This document does not request, cause, or evidence an automatic Notion write
  or export. Any learner note/export action remains separate and learner
  controlled.
- This document does not establish GPT Live availability, a voice setting,
  transcript retention, rendered equations/code, oral-defense completion, or
  TA/Study Partner behavior. Those are separate conversation surfaces and
  evidence records.
- Keep this candidate non-promoting until qualified review, a reviewed source
  commit, source-commit CI, deployment evidence, and release records exist.
