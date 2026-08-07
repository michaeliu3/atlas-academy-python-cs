# Atlas Academy benches

> A **lab** lives inside a document. A **bench** is an executable file outside it.

That rule keeps three existing meanings apart. "6 visual labs" in `PROGRESS.md`
means studio views. `### Debugging lab L2b` in the M20/21/22 workbooks means a
prose device. This directory holds neither — it holds **benches**.

## What a bench is

One bench is bound to exactly one teaching session and emits exactly one
artifact: the one that session's workbook already declares under its
`### Output:` heading. `m05-s1` emits *"explicit cost-model card"* because
Session 1 of Module 5 says that is what Session 1 produces.

The bench does not choose the artifact and does not re-teach the concept. The
workbook holds the concept story; the bench is where its claims get executed.
`validate:benches` string-compares the declared artifact against the generated
`workbookOutput`, so a bench cannot quietly redefine what its session produces.

## Sparse by policy

Most packs carry **two or three** benches, not six. A bench is expensive to author
well and worthless authored badly, so a session earns one only when running code
reveals something reading cannot:

| | Earns a bench |
|---|---|
| **E1** | **Observable mechanism** — identity, aliasing, refcounts, memory, interpreter state |
| **E2** | **Measurement** — cost curves, timing, allocation, convergence, numerical error |
| **E3** | **Invariant checking** — a contract you can encode as a predicate and violate on purpose |
| **E4** | **Falsifiable prediction** — the learner is likely *wrong* and the run settles it. Highest value. |
| **E5** | **Agent-patch review** — paste generated code, run it unmodified against tests |

| | Disqualifies |
|---|---|
| **A1** | Prose, design, threat modelling, or oral defence |
| **A2** | Needs real processes, sockets, filesystems, privilege, or a device queue — a kernel would lie |
| **A3** | A synthesis or dossier consuming earlier sessions rather than producing new evidence |
| **A4** | Would only re-execute what the workbook already prints |

**Only Module 26 has no bench pack at all** — a capstone whose every session is a
statement, map, record, or bundle. Everywhere else the exclusion is per *session*,
carries a reason code, and the workbook says so out loud.

Judging by subject matter rather than by session gets this wrong. Module 20 is
"networks", but its frame decoder is a pure byte-stream state machine that opens no
socket, and feeding it one payload split three ways is among the sharpest E4s in the
course. Module 32's device queues genuinely are dishonest to model — its own workbook
concedes a "CPU-only *imagined* queue". Read the session, not the title.

Modules 5 and 9 carry six benches each. They were authored before this policy and are
kept because they are written and verified. **Six is not a target.**

## Setup

```bash
~/AppData/Local/Programs/Python/Python313/python.exe -m venv benches/.venv
```

```bash
benches/.venv/Scripts/python.exe -m pip install jupytext pytest nbmake numpy matplotlib ipykernel jupyterlab
```

The floor is **CPython 3.12** — matching the `teaching-models` CI matrix. Benches
declare `kernelspec: python3`, never a named local kernel, because a named kernel
cannot resolve on a CI runner.

## Working through a bench

```bash
benches/.venv/Scripts/jupyter-lab.exe
```

Open `src/mNN/sK_*.py` with **Open With → Notebook**. Jupytext presents the `.py`
as a notebook, so you never edit JSON and never generate a file to work. JupyterLab
4.1+ renders Mermaid natively, so benches carry the same diagrams as the workbooks.

### The rules that make it work

1. **Answer every `predict()` before running the cell below it.** `reveal()` stays
   locked until you do. The value is in the gap between what you expected and what
   happened, and there is no gap if you read the answer first.
2. **Call `resolve()` before `reveal()`** — judge against the evidence, not against
   the explanation. `matched` / `diverged` / `partial`. A diverged prediction is the
   most useful thing a bench can produce; the record keeps the gap, never a score.
3. **Record confidence honestly.** "Guessing" is legitimate. A wrong answer held
   confidently is a different misconception from one held loosely.
4. **Unimplemented exercises report as *not attempted* and never crash.** Run the
   whole bench from the start and see exactly what is outstanding.
5. **`emit()` refuses an incomplete record** — no `non_claim()`, or leftover template
   text, and it will not write. That is deliberate: an earlier export shipped an
   unfilled template as if it were an answer, and nothing noticed.

## Verifying

```bash
benches/.venv/Scripts/python.exe -m jupytext --to ipynb --output-dir build src/m*/s*.py
```

```bash
benches/.venv/Scripts/python.exe -m pytest --nbmake build --nbmake-kernel=python3 --nbmake-timeout=300 -q
```

The gate runs against benches with exercises **unsolved** — deliberately, so CI
tests the bench's machinery rather than your answers.

## Layout

```
benches/
  src/mNN/_fixture.py        shared fixture, defined once, traced six ways
  src/mNN/sK_<artifact>.py   one bench per session — tracked
  src/_template.py           start here when authoring
  atlas_bench/               helpers: predict/resolve/reveal, check, measure, claim/emit
  records/                   your bench records — gitignored
  build/                     generated .ipynb — gitignored
```

`atlas_bench` is deliberately small and readable. This is a course about
understanding mechanism, so a helper you cannot read in one sitting works against
the point. Open it whenever you want to know exactly what a bench is measuring.

## Authoring

Copy `src/_template.py`. Then:

- **Never cite a workbook path.** Declare the pack key via `bench(module=, session=)`;
  the validator resolves the path. `modules/` already went stale, and M31–M36 live in
  `content/authoring/`, not `content/modules/`.
- **Rung budget is enforced.** At most one `modify`-primary bench per pack, never
  `modify` alone — targeted implementation is 5% of the course's evidence weight.
  Every pack needs a `debug-and-defend` and a `review-and-verify` bench.
- **For the 15 modules with a checked-in reference model, import and probe it**
  rather than reimplementing. That is code-reading plus map plus review — the three
  heaviest weights — instead of the lightest one.
- Vendoring external material? Read `BENCH_ATTRIBUTION.md` first, and check the
  actual LICENSE file. Several well-known resources in this space ship without one.
