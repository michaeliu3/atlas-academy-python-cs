# Module 18 research map — operating systems

**Audit date:** 2026-07-29  
**Teaching baseline:** Python and standard-library documentation pinned to
3.14.6; CPython source pinned to commit
[`c63aec69bd59c55314c06c23f4c22c03de76fe45`](https://github.com/python/cpython/tree/c63aec69bd59c55314c06c23f4c22c03de76fe45);
portable Unix claims checked against POSIX.1-2024 / The Open Group Base
Specifications Issue 8; Windows claims checked against current Microsoft Learn
documentation. The university route uses the latest complete public sequences
found: MIT 6.1810 Fall 2025, Berkeley CS 162 Fall 2025, Stanford CS 111 Spring
2026, and OSTEP v1.10.

This file is the source, claim, sequence, and licensing audit behind Module 18.
It is not the learner workbook. The workbook's Atlas incident, diagrams, code
traces, multiple-choice concept probes, shutdown rehearsals, and publication
experiments should be original synthesis.

---

## 1. Research question and stopping rule

The module must answer one connected question:

> A Python program asks to run work, use memory, read or replace a file, and
> stop safely. What state does the operating system own, which transitions does
> it mediate, and what can the program actually promise after interruption or
> crash?

The first-principles route is:

```text
finite machine resources
→ protection and multiplexing problem
→ user/kernel boundary
→ program versus live process
→ process lifecycle and scheduling
→ per-process virtual address space
→ page translation, TLB, and faults
→ kernel-managed open objects
→ names, paths, filesystems, and permissions
→ termination request and shutdown protocol
→ atomic visibility versus durable storage
→ a supervised Atlas worker with a defensible failure contract
```

The governing invariant is:

> A useful operating-system abstraction hides mechanism while preserving a
> protection, ownership, lifecycle, or persistence contract; the abstraction
> does not erase finite resources or failure.

### Hard stopping boundaries

Module 18 may name a thread as an execution unit inside a process and may note
that Windows schedules threads. It stops before reasoning about multiple
program-level execution streams:

- **Module 19 owns** interleavings, races, locks, conditions, queues, the GIL,
  deadlock, multiprocessing as a parallel-computing choice, and speedup.
- **Module 20 owns** sockets, TCP/UDP, DNS, HTTP, network framing, partial
  network reads, and protocol retries.
- **Module 21 owns** event loops, coroutine/task cancellation, timeouts,
  backpressure, uncertain distributed completion, and retry/idempotency under
  network failure.
- **Module 24 owns** interpreter frames, bytecode dispatch, object layout,
  reference counting, cyclic GC, allocators, specialization, profiling, and
  native/vectorized optimization.

Module 18 may trace a public Python call through a small CPython wrapper to a
named operating-system interface. It must not imply that every Python call maps
to exactly one system call, or turn that trace into an interpreter-internals
unit.

---

## 2. Module 17 → Module 18 bridge

Module 17 ends with an unresolved handoff: a language/runtime operation requests
bytes, time, memory, or device work, but that observation does not reveal the
operating-system or physical work. Module 18 resolves the next layer.

| M17 observation | M18 question it opens | M18 evidence owner |
|---|---|---|
| a Python process is running | what distinguishes stored program, process image, identifier, and live kernel object? | POSIX process interfaces; Windows process/object documentation |
| `read(1)` was requested | what is the file object, open description, descriptor/handle, buffer, cache, and eventual device boundary? | POSIX `open`/`read`; Windows file handles; Python I/O |
| one elapsed-time sample changed | was the process runnable, running, blocked, or preempted, and what may scheduling explain? | declared scheduling model plus OS observation |
| a virtual address was used | how is a per-process address translated, protected, mapped, or faulted? | university VM model; Linux/Windows implementation documentation |
| a write call returned | which buffers have accepted data, what is visible by name, and what is durable after a crash? | Python buffering; POSIX cache/rename/sync; Windows flush/replace contracts |
| a native boundary exists | which public OS contract applies, and which implementation details remain unknown? | Python docs, standards, platform docs, pinned wrapper source |

The bridge should begin with one learner correction:

> “Python read a byte from disk” is usually too strong.

A Python file object can add text decoding and user-space buffering; an
underlying descriptor or handle names a kernel-managed open object; the
operating system may satisfy a request from cache; a device may transfer a
different unit or nothing during that call. The
[Python `open()` documentation](https://docs.python.org/3.14/library/functions.html#open),
the POSIX [`read()` interface](https://pubs.opengroup.org/onlinepubs/9799919799/functions/read.html),
and POSIX
[filesystem-cache model](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html)
support the layered wording. Device-specific proof still requires
device-specific evidence.

---

## 3. Coverage audit and curriculum shape

The joint ACM/IEEE-CS/AAAI
[CS2023 report](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm)
places Operating Systems alongside Architecture, Networking, Parallel and
Distributed Computing, Security, and Systems Fundamentals. The course therefore
uses OS abstractions as a bridge: architecture supplies finite machine
resources; M18 explains protection and multiplexing; later modules explain
interleaving, protocols, distribution, and implementation depth.

The current course plan names processes, threads, virtual memory, system calls,
filesystems, scheduling, isolation, and permissions. The research audit expands
only the dependencies needed to make that list coherent:

| Required idea | Why it cannot be an isolated topic | M18 treatment |
|---|---|---|
| process | resource ownership needs creation, identity, lifetime, exit status, and supervision | full lifecycle |
| system call | protection needs a controlled user/kernel transition | conceptual boundary plus a few public interfaces |
| scheduling | more runnable work exists than can run at once | state changes, goals, trade-offs, declared toy policies |
| virtual memory | processes need isolated, relocatable address spaces over finite memory | mapping, page tables, TLB, faults, permissions |
| file/filesystem | bytes need stable names and lifetime beyond one process | names, directories, open objects, paths, caches |
| permissions | shared objects require an authorization decision | credentials/tokens, object policy, least privilege |
| signals/shutdown | external events and operator requests cross process lifetime | cooperative protocol, exit/reap, bounded escalation |
| crash consistency | successful calls and visible names are weaker than durable state | flush, sync, replacement, recovery assumptions |

“Threads” appears only at the process-composition boundary. Deep thread
semantics would make this module duplicate M19 and break the dependency chain.
Likewise, file locking is only named as a possible OS facility; proving a
lock-based concurrent protocol belongs to M19.

### Completion evidence

Recognition is insufficient. A learner ready to leave M18 can:

1. reconstruct a process and file lifecycle from a trace;
2. distinguish a model, public contract, implementation fact, and observation;
3. explain a page-table walk without confusing a TLB miss with a page fault;
4. trace a path, open object, descriptor/handle, and Python file object as
   different entities;
5. review a shutdown implementation for orphaned children, lost status, unsafe
   escalation, and false cleanup promises;
6. design a same-directory replace protocol and state exactly which guarantees
   it still lacks;
7. rewrite Unix-only reasoning into a Python 3.14 Windows/POSIX portability
   contract.

---

## 4. Coherent university routes

No single source matches this Python-first, Windows-aware, code-reading-heavy
module. The correct strategy is to preserve the causal sequence shared by
several strong OS courses while using standards and Python documentation for
portable claims.

### 4.1 OSTEP: the conceptual spine

Remzi and Andrea Arpaci-Dusseau's
[Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)
(v1.10, November 2023) supplies the clearest conceptual progression:

```text
virtualization
  process → process API → controlled execution → scheduling
  → address spaces → translation → paging → TLBs/page tables

persistence
  files/directories → filesystem implementation → crash consistency

protection
  access control
```

For M18, use the process, process API, limited-direct-execution, scheduling,
address-space, translation, paging, TLB, file/directory, filesystem, crash
consistency, and access-control chapters. The official
[OSTEP homework collection](https://pages.cs.wisc.edu/~remzi/OSTEP/Homework/homework.html)
offers small scheduling, address-translation, and filesystem simulators.
Instructor material should link to those tools and use newly written traces and
questions; it should not redistribute or silently adapt them.

Deliberately skip OSTEP's concurrency chapters during M18. They become M19.
Skip distributed/network chapters until M20–21.

### 4.2 MIT 6.1810 and xv6: the mechanism-reading route

The official
[MIT 6.1810 Fall 2025 schedule](https://pdos.csail.mit.edu/6.S081/2025/schedule.html)
and [course overview](https://pdos.csail.mit.edu/6.S081/2025/overview.html)
provide a mechanism-respecting sequence:

```text
Unix utilities and descriptors
→ OS organization and isolation
→ page tables
→ system-call entry/exit
→ page faults and copy-on-write
→ context switch
→ filesystems
→ crash recovery
```

The route's value is not that xv6 is production Linux or Windows. It is that a
small, readable kernel makes ownership and state transitions visible. Use the
[xv6 RISC-V rev5 book](https://pdos.csail.mit.edu/6.828/2025/xv6/book-riscv-rev5.pdf),
the
[source booklet](https://pdos.csail.mit.edu/6.1810/2025/xv6/xv6-src-booklet-rev5.pdf),
and the [xv6-riscv repository](https://github.com/mit-pdos/xv6-riscv) for bounded
reading. The
[page-table lab](https://pdos.csail.mit.edu/6.1810/2025/labs/pgtbl.html) can
inspire questions, but the course should not publish MIT lab solutions.

An alternative stable archive is
[MIT OpenCourseWare 6.1810 Fall 2023](https://ocw.mit.edu/courses/6-1810-operating-system-engineering-fall-2023/).
Use OCW when a versioned, licensed teaching asset is preferable to a live
course page.

### 4.3 Berkeley CS 162: system goals and reliability

The
[Berkeley CS 162 catalog](https://www2.eecs.berkeley.edu/Courses/CS162/) and
official [course site](https://cs162.org/)
connect operating-system structure and protection to processes, scheduling,
virtual memory, I/O, filesystems, and reliability. This is the best cross-check
that the route is not merely a Unix API tutorial: every mechanism must answer a
resource-management or protection problem.

Use the public sequence as an audit. Link to course materials; do not copy
slides, assignments, or solutions unless an item carries an explicit reuse
license.

### 4.4 Stanford CS 111: code reading and crash reasoning

The current
[Stanford CS 111 Spring 2026 site](https://web.stanford.edu/class/cs111/)
orders processes and dispatch before scheduling, virtual memory, filesystems,
and crash recovery. It is a strong model for short code-reading exercises and
systems explanations. Its concurrency/locking/deadlock block belongs in M19,
not M18.

The page marks its materials copyright Stanford and restricts redistribution.
Treat the sequence as research evidence and link to it; create original
examples, diagrams, assessments, and solutions.

### 4.5 Synthesis decision

| Need | Primary teaching source | Contract cross-check |
|---|---|---|
| first-principles vocabulary | OSTEP | POSIX, Microsoft Learn |
| readable mechanism | MIT 6.1810/xv6 | Linux kernel docs, platform docs |
| system design goals | Berkeley CS 162 | CS2023/course outcomes |
| code-reading and failure cases | Stanford CS 111 | Python/OS contracts |
| portable Python behavior | Python 3.14.6 docs | POSIX Issue 8 and Microsoft Learn |

University sources explain; standards specify; platform documentation narrows;
experiments observe. None substitutes for the others.

---

## 5. Processes, programs, and the protected boundary

### 5.1 Program is not process

Use this minimal model:

| Entity | Meaning | Typical lifetime |
|---|---|---|
| program/artifact | stored code and data that can be loaded | independent of a particular execution |
| process image | code, data, stack-like state, mappings, and inherited execution context | current execution image |
| process | live OS-managed resource and protection container with identity and lifecycle | creation until termination, with status/object lifetime possibly extending |
| thread | execution stream within a process | named only here; concurrency reasoning is M19 |

Microsoft's
[Processes and Threads](https://learn.microsoft.com/en-us/windows/win32/procthread/processes-and-threads)
describes a Windows process as including a virtual address space, executable
code, open handles, security context, identifier, environment, priority, and at
least one thread. It also states that threads, rather than processes, are the
scheduled execution units on Windows. That is a Windows contract, not a reason
to move thread interleavings into M18.

POSIX [`fork()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/fork.html)
creates a new process, while the POSIX
[`exec` family](https://pubs.opengroup.org/onlinepubs/9799919799/functions/exec.html)
replaces the current process image. A successful `exec` does not create a
second process and does not return. That distinction should be traced before
showing `subprocess`.

### 5.2 Kernel/user boundary

The operating-system problem begins because arbitrary code cannot safely own
all machine resources. The kernel executes privileged resource-management and
protection mechanisms; a user process requests a service through a controlled
interface. MIT 6.1810's system-call entry/exit sequence and the
[Linux user-space API index](https://docs.kernel.org/userspace-api/index.html)
make that boundary concrete. Microsoft's documentation on
[native system services](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/using-nt-and-zw-versions-of-the-native-system-services-routines)
likewise distinguishes user-mode access to kernel services, but it is not an
invitation to teach undocumented/private NT calls.

The learner-facing ladder should be:

```text
application intent
→ Python public API
→ runtime/library implementation
→ public operating-system interface
→ protected kernel mechanism
→ driver/device work, if needed
```

Safe claim: “This call may cross the user/kernel boundary through the
implementation's OS interface.”

Unsafe claim: “Every `Path.read_bytes()` is exactly one syscall and one disk
read.”

### 5.3 Python process abstraction

The
[Python 3.14 `subprocess` documentation](https://docs.python.org/3.14/library/subprocess.html)
recommends `subprocess.run()` for handled cases and exposes `Popen` for advanced
creation, pipes, status, waiting, and termination. It is the portable learner
surface, not a universal statement that process creation has one mechanism:

- a POSIX build may use `posix_spawn`, `vfork`, or a fork/exec path depending on
  implementation and arguments;
- Windows creation uses the Windows process API;
- return-code and termination semantics differ by platform;
- the module is unavailable on Android, iOS, and WASI.

Do not begin with raw `os.fork()`: it is Unix-only and its behavior in a
multithreaded process carries hazards that distract from the portable lifecycle
model. Read it after `Popen` only as a POSIX mechanism contrast.

---

## 6. Process lifecycle, status, supervision, and exit

### 6.1 Transferable lifecycle model

Use one explicit state machine:

```text
not created
    │ create
    ▼
admitted / runnable ──dispatch──▶ running
       ▲                            │
       │              preempt       │ block / wait
       └────────────────────────────┤
       ▲                            ▼
       └──────── event ready ─── blocked

running ──normal return / requested exit / fatal event──▶ terminated
terminated ──status collected / object references closed──▶ reaped or released
```

“Terminated” and “fully forgotten” are not equivalent.

Under POSIX,
[`_Exit()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/_exit.html)
terminates without running `atexit` handlers or flushing standard I/O; child
status remains available until collected under the applicable wait semantics.
[`wait()`/`waitpid()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/wait.html)
collect state changes and termination status. POSIX also permits process
identifier reuse after a process lifetime, so a PID is not a permanent identity;
see the
[POSIX general concepts](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html).

On Windows, a process object becomes signaled when it terminates and its handle
can remain valid until closed. The
[process handle and identifier documentation](https://learn.microsoft.com/en-us/windows/win32/procthread/process-handles-and-identifiers)
and
[`WaitForSingleObject`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-waitforsingleobject)
show why “PID”, “process handle”, and “live process” must stay separate.

### 6.2 Exit status is protocol data

A parent should interpret status rather than equate “process ended” with
“work succeeded.” Python's `Popen.returncode` uses conventional nonnegative
exit codes and, on POSIX, negative values for termination by signal. The exact
meaning of application exit codes is the application's protocol.

The Atlas worker should therefore have a small declared status vocabulary, for
example:

| Class | Meaning | Parent action |
|---|---|---|
| success | complete artifact promoted and validated | record success |
| rejected input | work was understood but invalid | preserve diagnostic; do not retry blindly |
| temporary environmental failure | no promotion occurred | operator/policy decides retry later |
| interrupted before commit | no new committed artifact promised | inspect checkpoint/temp evidence |
| unexpected failure | contract not established | quarantine evidence and investigate |

The source audit does not prescribe numeric values. The workbook must require
the learner to recover the mapping from code or a contract.

### 6.3 Parent/child is not automatic tree ownership

Neither POSIX process termination nor ordinary Windows process termination
guarantees that all descendants are terminated. The POSIX `_Exit()` page
describes what happens to children, and Microsoft's
[Terminating a Process](https://learn.microsoft.com/en-us/windows/win32/procthread/terminating-a-process)
states that child processes are not automatically terminated with a parent.
Windows
[job objects](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects)
can group process trees under an explicit policy; they are optional enrichment,
not the portable Python default.

Therefore, a supervisor must:

1. retain the object/handle abstraction returned by `Popen`;
2. define which child or process group it owns;
3. send a cooperative stop request where appropriate;
4. wait and collect status;
5. escalate after a bounded policy;
6. report what was and was not cleaned up.

An integer PID saved in a file is not by itself safe long-term ownership proof
because identifiers can be reused.

---

## 7. Scheduling: state and policy, not concurrency algorithms

Scheduling follows from scarcity: runnable execution demands can exceed
available processors. The scheduler chooses which runnable unit receives a
processor and for how long. A process can also block because an event or I/O
completion is not ready.

The POSIX
[process-scheduling concepts](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html)
describe transitions among running, runnable, and blocked states, including
preemption and priority/policy changes. OSTEP's CPU scheduling chapters provide
declared policies that a learner can trace without claiming the host uses one
of them unchanged.

### 7.1 Metrics before algorithms

| Goal/metric | Question | Tension |
|---|---|---|
| turnaround | how long from arrival to completion? | shortest-first ideas may harm fairness |
| response time | how long before first useful service? | frequent preemption adds overhead |
| throughput | how many jobs complete per interval? | not identical to individual latency |
| fairness/starvation | can every eligible job make progress? | strict priority can starve |
| predictability | how variable is service? | average alone can hide tails |

Use FIFO, round-robin, shortest-job intuition, priority, and multi-level
feedback queues only as explicit models. Each trace must declare arrivals,
service demands, quantum, tie-breaking, preemption, and cost assumptions.

### 7.2 Claims the module may and may not make

Safe:

- running time can include periods when a process is not executing;
- a blocked process is not merely “slow on the CPU”;
- scheduler policy and workload jointly determine modeled response/turnaround;
- a context switch and scheduling decision can have nonzero cost.

Unsafe without host-specific evidence:

- a particular runnable process will execute next;
- a sleep duration guarantees the exact resumption time;
- a timing outlier proves a particular scheduler decision;
- the host implements the classroom MLFQ trace exactly;
- adding a process necessarily improves throughput.

CPU-bound versus I/O-blocked behavior may be described at the state level.
Choosing threads/processes, proving race freedom, or measuring parallel speedup
belongs to M19.

---

## 8. Virtual memory, page tables, TLBs, and faults

### 8.1 First-principles model

Virtual memory solves several connected problems:

- each process needs a usable address space independent of current physical
  placement;
- mappings need per-process isolation and permissions;
- physical memory is finite;
- sharing and lazy population can be useful;
- invalid access must be detected.

A declared teaching translation is:

```text
virtual address = virtual-page number + page offset
                          │
                          ▼
                per-address-space page table
                          │
              valid? present? permitted?
                   │                 │
                   │ yes             │ no
                   ▼                 ▼
           physical frame + offset   page fault
                   ▲
                   │
          TLB may cache translation
```

The
[Linux page-table documentation](https://docs.kernel.org/mm/page_tables.html)
describes hierarchical page tables, page-table walks, translation lookaside
buffers, permission checks, dirty state, and page faults. The
[Linux process-address documentation](https://docs.kernel.org/mm/process_addrs.html)
shows virtual-memory areas and the `mm_struct` implementation. These are useful
Linux mechanisms, not a cross-platform Python specification.

Microsoft's
[Virtual Address Space and Physical Storage](https://learn.microsoft.com/en-us/windows/win32/memory/virtual-address-space-and-physical-storage)
describes per-process virtual address spaces, pages, reservation/commit, and
physical backing. Use it to correct the false belief that the Unix/Linux
vocabulary is the only possible implementation.

### 8.2 Distinctions that must survive

| Distinction | Correct meaning |
|---|---|
| virtual address vs physical address | program-visible address in an address space vs location/backing selected through mapping |
| virtual page vs physical frame | fixed-size unit in virtual space vs physical-memory unit |
| page table vs TLB | authoritative mapping structure vs cache of recent translation information |
| TLB miss vs page fault | translation cache did not answer vs access requires OS fault handling or is invalid |
| minor/soft vs major/hard fault | fault handled without storage I/O vs fault requiring storage I/O, under the named platform/tool |
| allocated object vs resident page | language/runtime ownership vs current physical residency |
| mapped file vs durable file | address mapping exists vs data has met a persistence contract |

Microsoft's
[Working Set](https://learn.microsoft.com/en-us/windows/win32/memory/working-set)
documentation explicitly distinguishes soft faults from hard faults. The Linux
page-table documentation likewise describes expected faults for lazy allocation
or copy-on-write as well as invalid access. Therefore:

> A page fault does not imply a disk read, and a TLB miss is not a page fault.

### 8.3 Python observation boundary

The Python
[`mmap` documentation](https://docs.python.org/3.14/library/mmap.html) exposes a
cross-platform file-mapping abstraction but has platform-specific constructors
and flush behavior. It can support a code-reading exercise about mapping,
visibility, and boundaries; it is not evidence that a Python object is
contiguous, resident, or physically located at an observed integer.

The Unix-only
[`resource` module](https://docs.python.org/3.14/library/resource.html) can
report resource-usage counters including major/minor faults on supported
systems. Treat such counters as optional observations with a named platform,
interval, and tool contract. They do not reconstruct a complete page-table
history.

Never teach `id(obj)` as a physical address. CPython object/memory details are
M24, and even an implementation-related address is not physical-memory proof.

---

## 9. Files, open objects, descriptors, handles, paths, and filesystems

### 9.1 One “file” word hides several entities

The workbook should ban an unqualified “the file” during the first trace.

| Layer/entity | What it is | What it is not |
|---|---|---|
| byte content and metadata | persistent filesystem-managed state | a pathname |
| directory entry/name | a binding in a directory namespace | necessarily unique identity |
| path | instructions for resolving names from a root or current directory | a stable object reference |
| open file description/object | kernel-managed open state, often including access mode and offset | merely a small integer |
| descriptor | process-scoped integer referring to an open description on POSIX-like systems | the file content itself |
| handle | Windows process-scoped reference to an OS object with granted access | a portable Unix descriptor |
| Python file object | language-level object adding buffering, mode, encoding, decoding, and cleanup | proof of physical I/O |

POSIX
[`open()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/open.html)
connects a pathname to an open file description and returns a nonnegative file
descriptor.
[`dup()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/dup.html)
can create another descriptor for the same open description, sharing state such
as the current offset. POSIX
[`close()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/close.html)
deallocates the descriptor, while the underlying open description can outlive
one descriptor if other references remain.

The POSIX
[general system-interface model](https://pubs.opengroup.org/onlinepubs/9799919799/functions/V2_chap02.html)
also explains that multiple handles, including streams and descriptors, can
refer to one open file description and require coordination when buffering is
involved.

On Windows,
[Files and Clusters](https://learn.microsoft.com/en-us/windows/win32/fileio/files-and-clusters)
introduces file objects, handles, file pointers, and `CloseHandle`. Similar
purposes do not make a Windows handle identical to a POSIX descriptor.

Python's [`os` documentation](https://docs.python.org/3.14/library/os.html)
states that file descriptors are small integers and that standard input,
output, and error conventionally use 0, 1, and 2. On Unix, sockets and pipes
also use descriptors. Python-created descriptors are non-inheritable by default
since Python 3.4, but inheritance rules and APIs differ between Unix and
Windows.

### 9.2 Names, links, and open lifetime

The POSIX
[pathname-resolution and directory concepts](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html)
establish that:

- an absolute path begins from the root; a relative path begins from the
  process's current directory or a directory descriptor supplied to an
  interface;
- path components are resolved through directories and can encounter symbolic
  links;
- directory structure permits multiple links to a file;
- directory operations have atomic runtime namespace semantics under the
  specified rules.

POSIX
[`rename()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html)
can atomically change the visible binding while existing open references
continue to refer to the prior file object. This yields three essential
corrections:

1. a pathname is not object identity;
2. changing a name does not necessarily invalidate an already-open reference;
3. runtime atomic namespace visibility does not prove post-crash durability.

Windows also separates path resolution from open-handle lifetime, but sharing
modes and replacement constraints can make behavior visibly different. Use
[Moving and Replacing Files](https://learn.microsoft.com/en-us/windows/win32/fileio/moving-and-replacing-files)
for the Windows contract rather than projecting POSIX unlink/rename behavior
onto it.

### 9.3 `pathlib` is a portability lens, not a uniform filesystem

The
[Python 3.14 `pathlib` documentation](https://docs.python.org/3.14/library/pathlib.html)
distinguishes pure paths from concrete paths and supplies POSIX and Windows path
flavors. Case sensitivity, drive/root syntax, reserved names, links, and
replacement behavior remain platform-dependent. `Path.move()`, new in Python
3.14, may use replacement on the same filesystem but copy and delete across
filesystems; a cross-filesystem move must not be presented as one atomic
rename.

A path exercise should ask:

- relative to which base is this path interpreted?
- could a link redirect resolution?
- can another name identify the same file?
- is the object already open?
- can source and destination be on different filesystems/volumes?
- what access was granted at open time?
- which case and normalization rules apply on this platform?

The security lesson is not “never use paths.” It is “a path is a resolution
request whose base, components, policy, and race window matter.”

### 9.4 Pipes stay inside the lifecycle unit

POSIX [`pipe()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/pipe.html)
creates two descriptors connected by a byte stream, and Python `subprocess`
can connect child standard streams to pipes. M18 may use a pipe for a bounded
parent/child status transcript and explain closure/EOF. It must not grow into
general stream-protocol design, partial network transfer, or retry semantics;
those are M20.

---

## 10. Permissions, access decisions, and least privilege

### 10.1 Authorization is an operation-time decision

An access decision combines:

```text
requesting process identity and credentials/token
+ requested operation/right
+ target object and its protection metadata
+ platform resolution and policy rules
→ allow or deny
```

POSIX
[file access permissions](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html)
define permission checks in terms of effective credentials, file ownership,
mode bits, and applicable platform rules. The `open()` interface also applies
the process file-creation mask when creating a file.

Windows uses process access tokens, security descriptors, access-control
entries, and discretionary access-control lists. Microsoft's
[Access Control Components](https://learn.microsoft.com/en-us/windows/win32/secauthz/access-control-components),
[Access-Control Lists](https://learn.microsoft.com/en-us/windows/win32/secauthz/access-control-lists),
and
[Requesting Access Rights to an Object](https://learn.microsoft.com/en-us/windows/win32/secauthz/requesting-access-rights-to-an-object)
are the relevant primary sources. Do not translate a Windows DACL into a
fictional three-column Unix mode.

### 10.2 Least privilege as a design test

NIST defines
[least privilege](https://csrc.nist.gov/glossary/term/least_privilege) as
restricting users or processes to the minimum resources and authorizations
needed to perform a function.

For the Atlas worker, that means:

- request read access for inputs and write/replace access only in its output
  area;
- do not run as administrator/root to make a permission problem disappear;
- do not inherit unrelated handles/descriptors;
- do not expose a writable parent directory more broadly than necessary;
- separate a diagnostic inability to write from invalid user input;
- perform the operation and handle denial rather than using a stale permission
  precheck.

The Python [`os.access()` documentation](https://docs.python.org/3.14/library/os.html#os.access)
warns that checking access before an operation creates a time-of-check to
time-of-use security hole. Preferred Python shape:

```python
try:
    with path.open("xb") as stream:
        ...
except PermissionError:
    ...
```

That snippet demonstrates “attempt and handle,” not a complete safe-publication
protocol.

### 10.3 Python portability limits

The Python [`os` documentation](https://docs.python.org/3.14/library/os.html)
is explicit about platform variation:

- `os.chown()` and effective UID/GID concepts are Unix-specific;
- on Windows, `os.chmod()` can set only the read-only flag, while other mode
  bits are ignored;
- many low-level interfaces are availability-tagged by platform.

Therefore, a portable application-level contract should say “the worker
requires these capabilities on the destination and must surface denial”
rather than “set mode `0o640` and permissions are solved.” Exact deployment
policy belongs to the target OS and security context; broader threat modeling
belongs to M22.

---

## 11. Signals, termination, cancellation, and shutdown

### 11.1 Signal is not a portable message queue

POSIX
[`sigaction()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/sigaction.html)
defines signal disposition and delivery behavior under POSIX. The
[Python 3.14 `signal` documentation](https://docs.python.org/3.14/library/signal.html)
adds critical interpreter-level constraints:

- the low-level handler records a flag and a Python handler runs later at a
  bytecode boundary;
- long-running C code can delay Python handler execution;
- Python signal handlers execute in the main Python thread;
- only the main thread may install handlers;
- signal names and semantics differ across platforms;
- Windows supports a narrower signal set and has console-control-event
  conditions;
- uncatchable fatal termination cannot be converted into cleanup.

Therefore, do not place file publication, logging pipelines, lock acquisition,
or arbitrary cleanup inside a handler. The handler should request a state
transition through minimal, safe application state; ordinary control flow owns
the protocol.

### 11.2 Cancellation vocabulary

M18 uses “cancellation” only for an external request that a process stop or
abandon a named work unit. It is not `asyncio` task cancellation and is not a
thread-coordination primitive.

Use this protocol:

```text
cooperative stop request
→ stop accepting new work
→ finish or abandon the current named unit under policy
→ publish or preserve a recoverable checkpoint
→ close owned resources
→ exit with declared status
→ supervisor waits and records status
→ bounded escalation only if the process does not stop
```

Every arrow is fallible. A process can crash between any two arrows.

### 11.3 `terminate`, `kill`, and console events are not synonyms

Python
[`subprocess`](https://docs.python.org/3.14/library/subprocess.html) exposes a
portable-looking surface with platform-specific effects:

| Python operation | POSIX meaning | Windows meaning |
|---|---|---|
| `Popen.terminate()` | send `SIGTERM` | call `TerminateProcess()` |
| `Popen.kill()` | send `SIGKILL` | alias of `terminate()` |
| Ctrl-C / Ctrl-Break handling | signal/process-group rules | console process-group and creation-flag conditions |
| negative return code | `-N` means signal `N` terminated child | not the same convention |

Microsoft's
[Terminating a Process](https://learn.microsoft.com/en-us/windows/win32/procthread/terminating-a-process)
warns that `TerminateProcess` does not give the target an opportunity to run
ordinary cleanup code. Thus Python's identically named methods do not provide
identical cooperative semantics.

`subprocess.run(..., timeout=...)` kills and then waits after the timeout under
its documented behavior. Timeout is an orchestration policy, not proof that
every descendant stopped or that files are consistent.

### 11.4 Normal shutdown hooks are not crash recovery

The Python
[`atexit` documentation](https://docs.python.org/3.14/library/atexit.html)
limits registered functions to normal interpreter termination; they are not
called for unhandled fatal signals, fatal internal errors, or `os._exit()`.
`finally`, context managers, and
[`contextlib.ExitStack`](https://docs.python.org/3.14/library/contextlib.html)
are excellent structured cleanup mechanisms during ordinary control flow. They
do not prove that code ran after power loss, forced termination, or process
crash.

The correct statement is:

> Cleanup reduces leaked live-process resources on handled paths; crash
> consistency depends on state layout, write ordering, atomic visibility, and
> recovery assumptions.

---

## 12. Atomic visibility, durability, and crash consistency

### 12.1 Three guarantees that must never collapse

| Guarantee | Question | Typical mechanism |
|---|---|---|
| atomic visibility | can an observer see an intermediate namespace state? | same-filesystem rename/replace under its contract |
| durability | after a specified crash, is accepted state preserved? | flush language buffers, request OS/device synchronization, sync namespace metadata where supported |
| transactionality | do several related updates commit or roll back as one unit? | database/filesystem protocol with a recovery design |

Atomic replacement does not itself make new bytes durable. Durability of one
file does not make several files a transaction. A successful buffered write
does not establish either.

The POSIX Issue 8
[filesystem cache concepts](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html)
distinguish successful runtime operations from data reaching storage and warn
that after failure some operations can be transferred incompletely or out of
order absent synchronization. The corresponding
[POSIX rationale](https://pubs.opengroup.org/onlinepubs/9799919799/xrat/V4_xbd_chap01.html)
explains why atomic directory operations are not automatically durable and
describes synchronizing a file before rename and the containing directory when
durability of the new binding is required.

### 12.2 Buffer-to-name evidence ladder

For a binary Python file:

```text
Python code
  │ write(...)
  ▼
Python user-space buffer
  │ file.flush()
  ▼
operating-system cache / filesystem state
  │ os.fsync(fd) or named platform operation
  ▼
storage stack under its documented assumptions

temporary destination-directory name
  │ os.replace(temp, target)
  ▼
atomically visible target binding when the operation succeeds
  │ directory synchronization where supported/required
  ▼
stronger post-crash namespace claim under a declared platform/filesystem contract
```

The Python [`os.fsync()` documentation](https://docs.python.org/3.14/library/os.html#os.fsync)
states that a buffered Python file should first be flushed with `f.flush()`;
`os.fsync()` then calls the native synchronization operation (`fsync` on Unix,
`_commit` on Windows). POSIX
[`fsync()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/fsync.html)
is the portable Unix authority. Microsoft's
[`FlushFileBuffers`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-flushfilebuffers)
is the Windows primary source, with device and caching qualifications.

Do not reduce these layers to “flush saves the file.”

### 12.3 Safe-replacement teaching protocol

The defensible default for one Atlas artifact is:

1. create a uniquely named temporary file **in the target directory**;
2. write the complete bytes;
3. flush the Python buffer;
4. request file synchronization under the target platform's contract;
5. close the file;
6. validate any properties that must hold before publication;
7. call `os.replace(temp, target)`;
8. if the failure model requires durable namespace change, synchronize the
   containing directory where the platform/filesystem supports that operation;
9. report cleanup of any leftover temporary file separately from commit
   success.

Use the Python
[`tempfile` documentation](https://docs.python.org/3.14/library/tempfile.html)
and prefer a shape based on `mkstemp(dir=target.parent)` plus explicit close for
the cross-platform teaching reference. It avoids silently depending on
`NamedTemporaryFile` reopening/deletion details that differ on Windows.

Python
[`os.replace()`](https://docs.python.org/3.14/library/os.html#os.replace)
provides atomic replacement when it succeeds but can fail across filesystems.
Creating the temporary in the target directory makes a same-filesystem
replacement much more likely and avoids the Python 3.14 `Path.move()` fallback
that can copy then delete across filesystems.

### 12.4 Contract qualification

The protocol must still declare:

- target OS and filesystem;
- whether the threat is process exception, abrupt process kill, OS crash, or
  power/storage failure;
- what the synchronization calls promise on that stack;
- whether the directory itself can and must be synchronized;
- whether hardware lies or loses cached writes outside the OS contract;
- whether one file or multiple related files form the consistency unit;
- what recovery does with leftover temporary files.

On Windows, file sharing and open-handle conditions can cause replacement to
fail, and directory synchronization is not the same portable interface as
POSIX. Use Microsoft's
[Moving and Replacing Files](https://learn.microsoft.com/en-us/windows/win32/fileio/moving-and-replacing-files)
and `FlushFileBuffers` rather than claiming a byte-for-byte POSIX recipe.

For a production example of a larger recovery protocol, SQLite's official
[Atomic Commit](https://www.sqlite.org/atomiccommit.html) document shows how a
journal, ordered writes, cache flushing, atomic visible state change, and
recovery assumptions combine. It is an optional case study: M16 already owns
database transactions, and M18 uses it only to demonstrate why several
mechanisms are needed.

### 12.5 Failure-injection matrix

The workbook should use only disposable synthetic artifacts and should inject
failures at named boundaries:

| Stop point | New target visible? | Expected recoverable evidence | Claim to test |
|---|---:|---|---|
| before temporary create | no | old target only | no-op path |
| after partial temp write | no | old target + incomplete temp | temp isolates incomplete bytes from target name |
| after temp sync, before replace | no | old target + complete temp | complete candidate is not committed name |
| immediately after replace | yes at runtime | new target; temp name absent | namespace visibility, not universal durability |
| after required namespace sync | yes | new target under declared platform assumptions | stronger named crash contract |
| forced termination during cleanup | commit-dependent | possibly leftover temp | cleanup success is not commit success |

Tests must never simulate a power failure by claiming `kill()` is equivalent.
A forced process stop tests a process-failure path only. Real power-loss and
device guarantees require a different test environment and evidence.

---

## 13. Python 3.14 Windows/POSIX portability matrix

The main learner machine is Windows, while several university sources use Unix
or xv6. Portability must therefore be part of the core, not a footnote.

| Topic | Python 3.14 surface | POSIX model | Windows model | Teaching rule |
|---|---|---|---|---|
| create process | `subprocess.run`, `Popen` | spawn or implementation-dependent fork/exec path | `CreateProcessW`-family path | reason from `Popen` contract first |
| identity/ownership | `Popen` object, `pid` | PID plus child/wait relationship | PID plus process handle/object | retain `Popen`; do not treat PID as permanent capability |
| wait/status | `wait`, `poll`, `communicate`, `returncode` | wait/reap; signal-derived negative code in Python | wait on signaled process object; handle lifetime | termination and status collection are separate |
| cooperative stop | application-defined protocol | commonly signal/process-group based | console event/IPC/service protocol depending host | document the actual channel |
| abrupt stop | `terminate`, `kill` | SIGTERM vs SIGKILL | both use abrupt terminate semantics | same Python method name can differ |
| descriptor/handle | Python file object and selected `os` APIs | integer fd/open description | native handle; Python runtime adapts | never equate native representations |
| inheritance | `close_fds`, stdio redirection | inheritable fd rules | inheritable-handle and handle-list rules | minimum explicit inheritance |
| rename/replace | `os.replace` | same-filesystem atomic rename semantics | replace/move subject to Windows sharing and volume rules | atomic visibility only on success; test target |
| path | `pathlib` flavors | root, `/`, symlink and case rules | drive/UNC/root, reserved names, case behavior | use pure flavors for reasoning; concrete behavior is host-specific |
| permissions | exceptions plus limited `os` calls | IDs, groups, mode bits, masks, ACL extensions | access token, security descriptor, DACL/ACEs | state capability requirement, not fake uniform metadata |
| sync | `flush`, `os.fsync` | Python buffer then `fsync`; possible directory sync | Python buffer then `_commit`/platform flush behavior | declare crash model and platform |
| memory map | `mmap` | Unix constructor/descriptor rules | Windows tag/handle rules | abstraction is shared; constructors/flush details differ |
| resource counters | `resource` | available on Unix | unavailable as the same Python module | optional enrichment, never core gate |

Microsoft's
[`CreateProcessW`](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw)
is the underlying Windows creation authority for the source-reading route.
POSIX `fork` and `exec` remain conceptual contrasts. The learner should not be
required to write native C or call either API directly.

### Supported-platform statement

Every Atlas worker exercise should record:

- Python implementation and `3.14.x` patch version;
- OS name/release and filesystem/volume assumptions;
- process-creation options and inherited standard streams;
- expected shutdown channel;
- atomic-replace and durability claim;
- unavailable Unix-only observations on Windows;
- whether execution is in native Windows, WSL, a container, or another
  environment.

“It ran on my laptop” is an observation, not a portability contract.

---

## 14. Pinned CPython code-reading route

The purpose of source reading is to connect a public Python abstraction to
platform branches without wandering into interpreter implementation. All links
below use the same exact CPython commit as Module 17:
`c63aec69bd59c55314c06c23f4c22c03de76fe45`.

| Read in order | Question to answer | Stop condition |
|---|---|---|
| [`Lib/subprocess.py`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/subprocess.py) | where does `Popen` normalize arguments, establish pipes, choose a platform `_execute_child`, wait, and interpret return status? | stop after one Windows branch and one POSIX branch are sketched |
| [`Modules/_posixsubprocess.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Modules/_posixsubprocess.c) | what state must be prepared around the POSIX child creation/exec boundary? | do not audit thread/GIL correctness; park for M19/M24 |
| [`Modules/_winapi.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Modules/_winapi.c) | how does the Windows helper validate arguments and call the platform process API? | stop after the `CreateProcess` bridge and returned handles |
| [`Modules/posixmodule.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Modules/posixmodule.c) | where do `os.replace` and `os.fsync` dispatch to platform-specific operations? | trace one wrapper; do not inventory the module |
| [`Modules/signalmodule.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Modules/signalmodule.c) | what implementation structure supports the documented deferred Python handler? | the documentation remains the learner contract; no frame/eval-loop excursion |
| [`Modules/_io/fileio.c`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Modules/_io/fileio.c) | how does the raw file layer own/close a descriptor and expose native read/write boundaries? | stop before buffered/text I/O implementation depth |

### Required source-reading moves

1. Start from a public documentation claim.
2. Locate the named Python function or method.
3. mark argument validation and resource ownership;
4. identify platform branch points;
5. identify the public OS operation reached;
6. write one statement the source supports;
7. write one tempting statement it does **not** support.

Example:

> The pinned Windows branch reaches `CreateProcess`; this supports a claim
> about this CPython implementation at this commit. It does not prove that
> every Python implementation, version, or platform uses the same mechanism.

### Forbidden source-reading detours

- proving signal scheduling by reading interpreter evaluation internals;
- explaining object layout, reference counting, or garbage collection;
- analyzing GIL release or cross-thread races;
- turning C wrappers into a native-programming assignment;
- assuming a wrapper call is exactly one kernel transition;
- using current `main` branch source to explain a pinned Python 3.14.6 runtime.

Those detours either violate M19/M24 boundaries or destroy version scope.

---

## 15. Atlas incident and assessment implications

### 15.1 Driving incident

Use one connected incident rather than a chapter of detached APIs:

> Atlas launches a background indexing worker. The worker reads a validated
> bundle, builds a replacement index, and publishes it under a stable name.
> During an update, the user requests shutdown. After restart, the old or new
> index must be explainable; no partially built index may appear under the
> committed name; the parent must record the worker's outcome. The target
> environment is Python 3.14 on Windows, with a POSIX contrast.

A suspicious agent-generated patch can deliberately:

- treat the script path as the process;
- save only a PID and never wait for the `Popen` object;
- use `os.access()` before writing;
- create its temporary file in the system temporary directory;
- use `Path.move()` across a volume;
- assume `file.flush()` means power-loss durability;
- install `atexit` and claim all termination paths are safe;
- call `kill()` and assume the child tree and files are clean;
- inherit all descriptors/handles;
- confuse a return code with successful artifact promotion.

The learner's work is mostly inspection, simulation, explanation, and review.
Implementation is required only where an observation resolves a disputed claim.

### 15.2 Architecture to recover

```text
Atlas supervisor
  ├── owns Popen object and status protocol
  ├── sends bounded shutdown request
  ├── waits, escalates, records result
  └── never equates child exit with committed output

Atlas worker process
  ├── holds minimum input/output capabilities
  ├── accepts one named work unit
  ├── builds same-directory temporary artifact
  ├── flushes/synchronizes under declared policy
  ├── validates, atomically replaces, and reports
  └── treats temp cleanup as separate best effort

Filesystem namespace
  ├── stable committed target name
  ├── unique uncommitted temporary name
  └── explicit old/new/recoverable states after each stop point
```

The project is deliberately **one worker at a time**. Concurrent writers,
locking, queues, and race proofs belong to M19.

### 15.3 Evidence ladder

| Evidence level | Learner artifact | What it establishes |
|---|---|---|
| contract | source-linked guarantee matrix | what Python/POSIX/Windows promise under stated scope |
| model | process, page, path, and publication traces | consequences of declared assumptions |
| code reading | annotated suspicious patch and bounded CPython route | ownership, branch, and failure points |
| observation | disposable worker runs and failure injection | what occurred on one recorded environment |
| transfer | revised shutdown/publication contract | reasoned design for the Atlas checkpoint |

An observation cannot silently upgrade a standard. A standard cannot predict
one scheduler trace. A toy model does not describe the host unless evidence
connects it.

### 15.4 Multiple-choice diagnostic design

The user's assessment preference is fast multiple choice with deep distractors.
Each item should expose a named misconception:

| Probe | Correct discrimination | Plausible misconception distractor |
|---|---|---|
| program/process | process is a live OS-managed instance | source file and process are the same entity |
| fork/exec | fork creates; exec replaces image | exec always creates a child |
| lifecycle | exit and status collection differ | dead child needs no wait/release |
| scheduling | blocked differs from runnable | every delay means CPU execution |
| VM | TLB miss and page fault differ | every TLB miss reads storage |
| paths | name, open object, and handle differ | rename changes what every open handle sees |
| permissions | attempt operation and handle denial | `os.access()` proves later access |
| signals | Python handler is deferred and platform-limited | handler is a reliable cleanup transaction |
| replace | atomic visibility is not durability | `os.replace` alone proves power-loss safety |
| portability | same Python method can have different platform effects | `kill()` is SIGKILL everywhere |

Every answer review should require:

1. the governing invariant;
2. why the chosen answer follows;
3. the exact misconception behind each distractor;
4. one transfer variant with changed OS, crash point, or open-handle state.

Confidence should be recorded separately from correctness so a lucky answer
does not compress a dependency.

### 15.5 TA sessions

The source audit supports four short, reasoning-heavy TA studios:

1. **Process coroner:** reconstruct creation, block, termination, status, and
   handle/reap state from a mixed trace.
2. **Translation clinic:** separate TLB hit/miss, present/not-present,
   permitted/denied, soft/hard fault, and fatal access in a declared page-table
   model.
3. **Path and capability lab:** resolve POSIX/Windows-flavored paths, then track
   a rename while descriptors/handles remain open.
4. **Crash table defense:** predict the allowable old/new/temp states after
   each injected stop and name which guarantee supports each prediction.

The TA should not rescue the learner with a final answer first. Ask:

- “Which entity owns that state?”
- “Is that a runtime observation, public contract, or implementation fact?”
- “Which exact transition occurred?”
- “What changes if the process is killed one arrow earlier?”
- “Does your sentence claim visibility, durability, or a transaction?”
- “Is that statement still true on Windows?”

### 15.6 Exit project

The exit artifact is an **Atlas worker operating contract**, not a large code
submission. It includes:

- one process-lifecycle diagram;
- one resource-ownership table;
- one Windows/POSIX behavior matrix;
- one page-translation trace;
- one path/open-object trace;
- one same-directory publication state machine;
- one shutdown/escalation protocol;
- one failure-injection result table with environment provenance;
- one annotated agent-patch review;
- one five-minute oral defense.

The implementation can remain small enough to read in one sitting.

---

## 16. Source-use and licensing policy

The course should maximize stable links and original synthesis.

| Source family | Use policy |
|---|---|
| Python documentation and CPython | Python docs are under the [PSF License v2](https://docs.python.org/3.14/license.html), with code examples additionally offered under the Zero-Clause BSD license; pin version/commit, attribute, and prefer original teaching examples |
| POSIX Issue 8 | the standard is copyrighted by IEEE/The Open Group; link to exact interfaces, paraphrase narrowly, and do not copy tables or diagrams |
| Microsoft Learn | link and paraphrase under the [Microsoft documentation terms](https://learn.microsoft.com/en-us/legal/termsofuse); do not copy diagrams into the course without checking reuse terms |
| Linux kernel documentation | link and paraphrase; if reusing source text/figures, inspect the exact file's SPDX/license rather than assuming a blanket license |
| xv6 repository | the repository carries a permissive [MIT-style license](https://github.com/mit-pdos/xv6-riscv/blob/riscv/LICENSE); retain attribution/license for reused code |
| MIT OpenCourseWare | OCW materials are governed by its [terms and CC BY-NC-SA licensing](https://ocw.mit.edu/pages/privacy-and-terms-of-use/); attribute and follow noncommercial/share-alike terms for adaptations |
| live MIT 6.1810 | link to readings/labs; do not publish lab solutions or assume live-course assets inherit the OCW license |
| OSTEP | authors provide free chapter links and ask educators to link rather than mirror; link to the official site and make original figures/questions |
| Berkeley CS 162 | no broad reuse license was established in this audit; link only unless a specific asset says otherwise |
| Stanford CS 111 | the live page asserts Stanford copyright and redistribution restrictions; link only and create original exercises |
| NIST glossary | cite the definition source; use the concept in original prose |

No university assignment solution, slide deck, textbook figure, or standard
table should be copied into the learner site merely because it is publicly
viewable. Public access is not a reuse license.

### Diagram policy

All learner diagrams should be newly drawn from concepts:

- process lifecycle;
- protection boundary;
- virtual-page translation;
- descriptor/handle ownership;
- path resolution;
- buffer/sync/replace durability ladder;
- supervisor/worker shutdown.

Each diagram caption should identify whether it is:

- a portable conceptual model;
- a POSIX contract;
- a Windows contract;
- a Linux/xv6 implementation example;
- or an observed trace from the learner environment.

---

## 17. Claim ledger

### 17.1 Safe claims under named scope

- A stored program and a live process are not the same entity.
- POSIX `fork()` creates a process and `exec` replaces the current process
  image.
- A successful `exec` does not return to the replaced image.
- Python `subprocess` abstracts platform-specific process creation and
  termination behavior; it is not evidence of one universal native mechanism.
- Process termination and collection/release of status/object references are
  separate lifecycle events.
- A PID can be reused and should not be treated as permanent identity.
- Parent termination does not automatically guarantee descendant termination
  on ordinary POSIX or Windows process semantics.
- A blocked execution unit is waiting for an event and is not equivalent to a
  runnable unit awaiting a CPU.
- Scheduling objectives can conflict; a classroom policy predicts only its
  declared model.
- Each process can have a protected virtual address space mapped through
  page-table mechanisms on the studied systems.
- A TLB caches translations; a TLB miss is not automatically a page fault.
- A page fault can be handled without storage I/O.
- A virtual address and a physical address are different concepts.
- A path, directory entry, open object, descriptor/handle, and Python file
  object are different entities.
- Multiple descriptors can refer to one POSIX open file description and share
  offset state.
- Runtime rename/replace visibility and post-crash durability are different
  guarantees.
- Relative path meaning depends on its resolution base.
- Windows access tokens/DACLs and POSIX mode/credential checks must not be
  presented as one identical permission model.
- Least privilege means granting the worker only the resources and rights
  required for its function.
- An access precheck can race; attempt the operation and handle failure.
- Python signal handlers are deferred to Python execution and are
  platform-limited.
- `atexit`, `finally`, and context managers do not prove cleanup after forced
  termination, fatal crash, or power loss.
- On POSIX, Python `terminate()` and `kill()` differ; on Windows, `kill()` is an
  alias for `terminate()`.
- `file.flush()` and `os.fsync()` act at different buffering layers.
- A same-directory temporary file plus successful `os.replace()` can provide a
  strong one-file atomic-visibility pattern; durability still needs a declared
  synchronization and failure contract.
- Cross-filesystem copy/delete movement is not one atomic rename.

### 17.2 Never say without stronger evidence

- “Python calls are system calls.”
- “One Python read means one disk read.”
- “A process is a running source file.”
- “`exec` launches a child.”
- “If the child is dead, the parent has nothing left to do.”
- “Killing a parent kills its whole tree.”
- “The next runnable process is predictable from this timing trace.”
- “Sleeping for one second resumes exactly one second later.”
- “The host scheduler is MLFQ because the trace looks like it.”
- “A page fault always reads from disk.”
- “A TLB miss is a page fault.”
- “`id()` is a physical address.”
- “Resident memory equals all memory owned by Python objects.”
- “The filename is the file.”
- “A descriptor integer contains the file.”
- “Rename updates every already-open view.”
- “POSIX mode bits are Windows permissions.”
- “`os.access()` guarantees the later operation.”
- “The signal handler runs immediately and can safely perform any cleanup.”
- “`atexit` always runs.”
- “`kill()` means SIGKILL on every platform.”
- “Close or Python flush means the bytes survived power loss.”
- “Atomic replacement means durable transaction.”
- “`Path.move()` is atomic across volumes.”
- “A forced process kill faithfully simulates power failure.”
- “xv6/Linux behavior is the portable Python contract.”
- “The pinned CPython wrapper proves behavior of every Python implementation.”

### 17.3 Boundary claims

- Mentioning that a process contains one or more threads is M18; analyzing their
  interleavings, locks, races, queues, GIL behavior, or speedup is M19.
- Using a parent/child pipe for status is M18; designing network protocols,
  sockets, retries, and partial-transfer framing is M20.
- Sending a process stop request is M18; coroutine task cancellation and
  timeout composition is M21.
- Tracing a Python wrapper to a public OS call is M18; frames, bytecode
  dispatch, object layout, GC, allocator, and deep optimization are M24.
- Naming OS file locks as platform facilities is permissible background;
  designing or proving a lock protocol is M19.

---

## 18. Freshness, platform, safety, and reproducibility checklist

Before publishing or rerunning Module 18:

- [ ] confirm the Python documentation still targets 3.14.6 or update the
  declared baseline and all availability notes together;
- [ ] confirm the exact CPython commit links still match the teaching runtime;
- [ ] confirm POSIX links point to Issue 8 / `9799919799`, not an older edition;
- [ ] recheck Microsoft Learn pages for changed Windows behavior or
  deprecations;
- [ ] verify the current MIT 6.1810 schedule, xv6 book revision, and repository
  license;
- [ ] recheck OSTEP version and authors' distribution request;
- [ ] treat Berkeley and Stanford live materials as link-only unless explicit
  reuse terms change;
- [ ] run the reference worker on native Windows with Python 3.14;
- [ ] if a POSIX contrast is demonstrated, name whether it is Linux, macOS,
  WSL, or a container rather than labeling it simply “Unix”;
- [ ] record filesystem/volume type and whether temp and target are on the same
  filesystem;
- [ ] make descriptor/handle inheritance explicit and minimal;
- [ ] use only disposable synthetic files under a newly created lab directory;
- [ ] never require administrator/root privileges;
- [ ] never kill unrelated processes or identify ownership by an unverified
  PID;
- [ ] bound waits and preserve diagnostic output;
- [ ] keep real user data, repository state, and course records out of
  failure-injection paths;
- [ ] distinguish process-kill tests from OS-crash or power-loss claims;
- [ ] re-run the temporary-file cleanup test after interruption;
- [ ] preserve the M19, M20, M21, and M24 stopping rules.

### Minimum run provenance

```text
Python implementation + full version
OS name/release/build
native Windows / WSL / Linux / macOS / container
filesystem or volume facts known
source and target absolute paths
same-filesystem assertion and how checked
process creation flags and standard-stream wiring
shutdown request and escalation policy
exact injected stop point
raw exit status and observed target/temp states
guarantees claimed, guarantees explicitly not claimed
```

---

## 19. Directed learner route

The full sources are too large to assign indiscriminately. Read only what the
next investigation needs.

### Before Session 1 — why an OS and what is a process?

- OSTEP process, process-API, and limited-direct-execution chapters from the
  [official book page](https://pages.cs.wisc.edu/~remzi/OSTEP/).
- Python
  [`subprocess` overview and `run`/`Popen` sections](https://docs.python.org/3.14/library/subprocess.html).
- POSIX [`fork`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/fork.html),
  [`exec`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/exec.html),
  and
  [`wait`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/wait.html)
  summaries.

Deliverable: process-image/lifecycle trace and one Windows contrast.

### Before Session 2 — scheduling as multiplexing

- OSTEP scheduling chapters.
- POSIX scheduling-state passages in
  [general concepts](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html).

Deliverable: two declared-policy traces plus a paragraph explaining why neither
predicts the host's next choice.

### Before Session 3 — address-space translation

- OSTEP address-space, translation, paging, and TLB chapters.
- MIT xv6
  [page-table chapter/lab route](https://pdos.csail.mit.edu/6.1810/2025/labs/pgtbl.html).
- Linux
  [page-table documentation](https://docs.kernel.org/mm/page_tables.html) or the
  Windows
  [virtual-memory overview](https://learn.microsoft.com/en-us/windows/win32/memory/virtual-address-space-and-physical-storage),
  chosen to match the environment.

Deliverable: one page-table walk containing a TLB miss with no page fault and
one fault with no storage I/O.

### Before Session 4 — open objects and names

- POSIX
  [`open`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/open.html),
  [`dup`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/dup.html),
  [`close`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/close.html),
  and
  [`rename`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html).
- Python [`pathlib`](https://docs.python.org/3.14/library/pathlib.html).
- Windows
  [file-object/handle overview](https://learn.microsoft.com/en-us/windows/win32/fileio/files-and-clusters).

Deliverable: resolve a relative path, open it twice through shared/independent
state, rename it, and predict each reference's meaning under the declared OS
model.

### Before Session 5 — permissions and shutdown

- NIST
  [least privilege](https://csrc.nist.gov/glossary/term/least_privilege).
- Python
  [`signal`](https://docs.python.org/3.14/library/signal.html),
  [`atexit`](https://docs.python.org/3.14/library/atexit.html), and relevant
  [`subprocess`](https://docs.python.org/3.14/library/subprocess.html)
  termination sections.
- Windows
  [access-control components](https://learn.microsoft.com/en-us/windows/win32/secauthz/access-control-components)
  or POSIX file-permission concepts, chosen for the environment.

Deliverable: least-privilege capability table and cooperative→escalated
shutdown state machine.

### Before Session 6 — visibility and durability

- POSIX
  [filesystem-cache concepts](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html)
  and
  [rationale](https://pubs.opengroup.org/onlinepubs/9799919799/xrat/V4_xbd_chap01.html).
- Python
  [`tempfile`](https://docs.python.org/3.14/library/tempfile.html),
  [`os.replace` and `os.fsync`](https://docs.python.org/3.14/library/os.html).
- OSTEP crash-consistency chapter or MIT xv6 crash-recovery reading.

Deliverable: old/new/temp crash table with a claim source beside every row.

### Before the exit project — bounded implementation reading

- one platform branch in pinned
  [`Lib/subprocess.py`](https://github.com/python/cpython/blob/c63aec69bd59c55314c06c23f4c22c03de76fe45/Lib/subprocess.py);
- the matching `_posixsubprocess.c` or `_winapi.c` bridge;
- one `os.replace`/`os.fsync` path in pinned `posixmodule.c`.

Deliverable: three supported implementation statements, three explicitly
unsupported generalizations, and the Atlas worker operating contract.

---

## 20. Final source-audit self-explanation

Without notes, answer:

> Why do finite resources force protection and scheduling? What changes when a
> stored program becomes a process, and why do creation, image replacement,
> termination, and status collection remain separate? How can a process be
> runnable, running, or blocked without those states proving a particular host
> schedule? Translate one virtual address through a TLB and page table, then
> explain why a TLB miss, soft page fault, hard page fault, and invalid access
> are different. Follow one path through a directory name to an open
> description/object, descriptor/handle, and Python file object. How do
> credentials or an access token constrain that operation? Then defend a worker
> shutdown and same-directory replacement protocol: distinguish cooperative
> stop from forced termination, normal cleanup from crash recovery, Python
> buffer flush from OS synchronization, atomic visibility from durability, and
> one-file publication from a transaction. Which claims are portable Python,
> which are POSIX, which are Windows, which are Linux/xv6 implementation facts,
> and which are only observations? Finally, where do M19, M20, M21, and M24
> begin?

Finish:

> I can recover the OS-owned state, trace its lifecycle, name the source of each
> guarantee, and design for interruption without claiming more than the
> platform and evidence support.
