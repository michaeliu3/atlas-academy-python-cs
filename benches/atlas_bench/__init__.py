"""Shared helpers for Atlas Academy benches.

A *lab* lives inside a document. A *bench* is an executable file outside it,
bound to exactly one teaching session, emitting exactly one named artifact —
the one that session's workbook already declares.

Design constraint: this course teaches mechanism, so these helpers must stay
small and readable. If you cannot understand a helper by reading it once, it is
too clever for a course about understanding what code does. Nothing here is
magic; open it whenever you want to know exactly what a bench is measuring.

Four jobs:
  predict / resolve / reveal   enforce commitment before explanation
  check / checkpoint           report on your implementations without breaking the run
  measure / growth             turn cost claims into evidence
  bench / claim / emit         write the session's declared artifact as a record
"""

from __future__ import annotations

import hashlib
import json
import platform
import re
import sys
import time
import tracemalloc
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Iterable, Sequence

__all__ = [
    # commitment
    "predict",
    "resolve",
    "reveal",
    # checking
    "check",
    "checkpoint",
    # measurement
    "measure",
    "growth_ratios",
    "classify_growth",
    "count_ops",
    "Counter",
    "peak_memory",
    "run_async",
    # record emission
    "bench",
    "claim",
    "non_claim",
    "emit",
    "classify_evidence_label",
    "EVIDENCE_CATEGORIES",
]


# --------------------------------------------------------------------------
# Commitment before explanation
# --------------------------------------------------------------------------

_PREDICTIONS: dict[str, dict[str, Any]] = {}

_RESOLUTIONS = ("matched", "diverged", "partial")


def predict(question: str, answer: str = "", confidence: str = "") -> None:
    """Record a prediction before running the cell that settles it.

    Leave `answer` empty and this prints the question and stops. Fill it in and
    it records your commitment so the reveal is allowed to fire. It never
    raises, so an unanswered bench still executes top to bottom in CI.

    `confidence` is not decoration. The production standard asks for commitment
    *and* confidence because a wrong answer held confidently is a different
    misconception from a wrong answer held loosely, and it is repaired
    differently. Use: "sure", "fairly sure", "guessing".
    """
    key = question.strip()
    if not answer.strip():
        print(f"PREDICT: {question}")
        print()
        print("  Fill in answer= (and confidence=) before running the next cell.")
        print("  Guessing is a legitimate answer. Not committing is not.")
        return

    _PREDICTIONS[key] = {
        "question": key,
        "answer": answer,
        "confidence": confidence or "unstated",
        "resolved": None,
    }
    print(f"PREDICT: {question}")
    print(f"  your answer     : {answer}")
    print(f"  your confidence : {confidence or 'unstated'}")
    print()
    print("  Recorded. Run the next cell to test it.")


def resolve(question: str, outcome: str) -> None:
    """Record whether the prediction survived contact with the run.

    Call this *after* the settling cell and *before* `reveal`, so you judge
    against the evidence rather than against the explanation.

    `outcome` is one of "matched", "diverged", "partial". None of them is a
    score. A diverged prediction is the most useful outcome a bench can produce
    — it locates a belief that needed repair — which is why the record keeps
    the gap rather than a mark.
    """
    key = question.strip()
    if key not in _PREDICTIONS:
        print("No prediction recorded for that question; nothing to resolve.")
        return
    if outcome not in _RESOLUTIONS:
        print(f"Outcome must be one of {_RESOLUTIONS}; got {outcome!r}.")
        return

    _PREDICTIONS[key]["resolved"] = outcome
    print(f"resolved: {outcome}")


def reveal(question: str, explanation: str) -> None:
    """Show the explanation, but only once the question has been answered."""
    key = question.strip()
    if key not in _PREDICTIONS:
        print("Locked. Answer the prediction above first.")
        print("Reading the explanation before committing teaches you almost nothing;")
        print("the value is in the gap between what you expected and what happened.")
        return

    record = _PREDICTIONS[key]
    if record["resolved"] is None:
        print("(unresolved — call resolve() so the record keeps the gap)")
    print(f"you said : {record['answer']}  ({record['confidence']})")
    print("-" * 68)
    print(explanation.strip())


# --------------------------------------------------------------------------
# Checking your implementations
# --------------------------------------------------------------------------


@dataclass
class _Result:
    passed: int = 0
    failed: int = 0
    skipped: int = 0
    failures: list[str] = field(default_factory=list)


def _tally(result: _Result) -> None:
    """Fold a check result into the active bench, if one is declared."""
    if _ACTIVE is None:
        return
    _ACTIVE.checks["passed"] += result.passed
    _ACTIVE.checks["failed"] += result.failed
    _ACTIVE.checks["notAttempted"] += result.skipped


def check(
    label: str,
    func: Callable[..., Any] | None,
    cases: Iterable[tuple[tuple, Any]],
) -> _Result:
    """Run `func` against (args, expected) pairs and report.

    Deliberately does not raise. An unattempted exercise reports as skipped so
    the bench still runs clean end to end -- both for you, working through it in
    order, and for CI, which executes every bench on every change.

    `cases` is an iterable of (args_tuple, expected_value).
    """
    result = _Result()
    print(f"{label}")

    if func is None:
        print("  - not attempted")
        result.skipped += 1
        _tally(result)
        return result

    for args, expected in cases:
        shown = ", ".join(repr(a) for a in args)
        try:
            actual = func(*args)
        except NotImplementedError:
            print(f"  - not attempted        f({shown})")
            result.skipped += 1
            continue
        except Exception as exc:  # noqa: BLE001 - surfacing the error is the point
            print(f"  x raised {type(exc).__name__}: {exc}   f({shown})")
            result.failed += 1
            result.failures.append(f"{shown} -> {type(exc).__name__}")
            continue

        if actual == expected:
            print(f"  + f({shown}) == {expected!r}")
            result.passed += 1
        else:
            print(f"  x f({shown}) -> {actual!r}, expected {expected!r}")
            result.failed += 1
            result.failures.append(f"{shown} -> {actual!r} != {expected!r}")

    total = result.passed + result.failed + result.skipped
    print(f"  {result.passed}/{total} passed"
          + (f", {result.skipped} not attempted" if result.skipped else ""))
    _tally(result)
    return result


def checkpoint(label: str, condition: bool, note: str = "") -> bool:
    """A single named assertion that reports rather than raises."""
    mark = "+" if condition else "x"
    print(f"  {mark} {label}" + (f"  -- {note}" if note else ""))
    result = _Result(passed=1 if condition else 0, failed=0 if condition else 1)
    _tally(result)
    return condition


# --------------------------------------------------------------------------
# Turning cost claims into evidence
# --------------------------------------------------------------------------


def measure(
    func: Callable[[int], Any],
    sizes: Sequence[int],
    repeats: int = 5,
) -> list[float]:
    """Best-of-`repeats` wall time for `func(n)` at each n, in seconds.

    Best-of rather than mean: we are trying to observe the algorithm, and noise
    on a shared machine only ever adds time. The minimum is the sample least
    contaminated by everything else your computer was doing.
    """
    timings: list[float] = []
    for n in sizes:
        best = float("inf")
        for _ in range(repeats):
            start = time.perf_counter()
            func(n)
            best = min(best, time.perf_counter() - start)
        timings.append(best)
    return timings


def growth_ratios(sizes: Sequence[int], timings: Sequence[float]) -> list[float]:
    """Ratio of successive timings. With doubling sizes this is the tell:

    ~1  constant        ~2  linear        ~2.1-2.3  n log n
    ~4  quadratic       ~8  cubic
    """
    ratios = []
    for i in range(1, len(timings)):
        previous = timings[i - 1]
        ratios.append(timings[i] / previous if previous > 0 else float("nan"))
    return ratios


def classify_growth(sizes: Sequence[int], timings: Sequence[float]) -> str:
    """Name the growth class implied by measured doubling ratios.

    A blunt instrument, and honest about it: it reads only the last few ratios,
    where asymptotic behaviour has had a chance to dominate constant factors.
    Small n tells you about your machine, not about the algorithm.

    Uses the *median* of the tail, not the mean. This is not fussiness. With the
    mean, a single scheduling hiccup on one sub-millisecond sample was enough to
    classify a linear deduplicator as quadratic -- ratios [1.76, 2.29, 1.89,
    3.52] average to 2.57 and cross the threshold, while their median is 2.29 and
    does not. A helper that reports a false growth class is worse than no helper,
    because a bench would record it as evidence.

    Best-of-N timing bounds noise from below but not from above: the minimum is
    the cleanest sample, yet one contaminated *ratio* still moves a mean. The
    median discards it.
    """
    ratios = [r for r in growth_ratios(sizes, timings) if r == r]  # drop NaN
    if len(ratios) < 2:
        return "not enough points"

    # A timing at or below the clock's resolution produces meaningless ratios.
    # Saying so is more useful than classifying noise: an earlier run reported
    # "worse than cubic" for a constant-time dict lookup on that basis.
    if min(timings) <= 0 or max(timings) < 1e-6:
        return "below timer resolution — increase the work per measurement"

    tail = sorted(ratios[-3:] if len(ratios) >= 3 else ratios)
    middle = len(tail) // 2
    typical = tail[middle] if len(tail) % 2 else (tail[middle - 1] + tail[middle]) / 2

    for upper, name in (
        (1.35, "constant"),
        (1.75, "logarithmic"),
        (2.55, "linear or n log n"),
        (5.5, "quadratic"),
        (12.0, "cubic"),
    ):
        if typical < upper:
            return f"{name} (median doubling ratio {typical:.2f})"
    return f"worse than cubic (median doubling ratio {typical:.2f})"


class Counter:
    """Count operations instead of timing them.

    Timing measures your machine. Counting measures the algorithm. When the two
    disagree, that disagreement is itself the lesson -- usually about cache
    behaviour, allocation, or a constant factor you did not model.
    """

    def __init__(self) -> None:
        self.counts: dict[str, int] = {}

    def hit(self, name: str = "op", amount: int = 1) -> None:
        self.counts[name] = self.counts.get(name, 0) + amount

    @property
    def total(self) -> int:
        return sum(self.counts.values())

    def __repr__(self) -> str:
        if not self.counts:
            return "Counter(empty)"
        parts = ", ".join(f"{k}={v}" for k, v in sorted(self.counts.items()))
        return f"Counter({parts}, total={self.total})"


def count_ops(func: Callable[[Counter], Any]) -> Counter:
    """Run `func` with a fresh Counter and return it."""
    counter = Counter()
    func(counter)
    return counter


def peak_memory(func: Callable[[], Any]) -> int:
    """Peak traced memory in bytes during `func()`.

    Counts Python allocations only -- not the interpreter, not the OS. Good for
    comparing two representations against each other, not for absolute claims.
    """
    tracemalloc.start()
    try:
        func()
        _, peak = tracemalloc.get_traced_memory()
        return peak
    finally:
        tracemalloc.stop()


def run_async(coroutine):
    """`asyncio.run`, but also correct inside a notebook kernel.

    A bench is executed twice: as a plain script during authoring, and as a
    notebook under nbmake in CI. The Jupyter kernel already owns a running event
    loop on its main thread, so `asyncio.run` raises there — a bench that used it
    directly would pass while being written and fail only in CI.

    When no loop is running this is exactly `asyncio.run`. When one is, the
    coroutine gets a fresh loop on a worker thread, which keeps it isolated from
    the kernel's rather than nesting inside it.
    """

    import asyncio
    import concurrent.futures

    try:
        asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coroutine)

    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        return pool.submit(asyncio.run, coroutine).result()


# --------------------------------------------------------------------------
# Evidence labels
#
# A Python mirror of `site/lib/evidence-label-taxonomy.mjs`. The course already
# has an epistemic vocabulary and the workbooks already use it as
# `**[FINITE EXPERIMENT]**`; a bench must not coin a second one, or the renderer
# and the record would disagree about what a claim establishes.
#
# Order matters: first match wins, narrow before broad.
# --------------------------------------------------------------------------

EVIDENCE_CATEGORIES = (
    "unknown",
    "proposal",
    "counterexample",
    "proof",
    "observation",
    "contract",
    "policy",
    "model",
)

_CLASSIFICATION_RULES: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("unknown", re.compile(r"\bUNKNOWN\b|\bUNAVAILABLE\b|\bOPEN DECISION\b|\bDEFER\b")),
    ("proposal", re.compile(r"\bAI PROPOSAL\b|\bPROPOSAL\b")),
    ("counterexample", re.compile(r"\bCOUNTEREXAMPLE\b|\bCOUNTERMODEL\b")),
    ("proof", re.compile(
        r"\bTHEOREM\b|\bPROOF\b|\bDERIVATION\b|\bMATHEMATICAL CLAIM\b|\bINFERENCE\b")),
    ("observation", re.compile(
        r"\bEXPERIMENT\b|\bOBSERVATION\b|\bMEASUREMENT\b|\bTRACE\b|\bRESULT\b"
        r"|\bEVIDENCE\b|\bTESTED\b|\bCHECK(?:ED)?\b|\bOUTPUT\b")),
    ("contract", re.compile(
        r"\bCONTRACT\b|\bSPEC(?:IFICATION)?\b|\bSTANDARD\b|\bGUARANTEE\b|\bCLAIM\b"
        r"|\bAUTHORIZED\b|\bAUTHENTICATED\b|\bVALIDATED\b|\bBOUNDARY\b"
        r"|\bCAPABILITY\b|\bPERMITTED\b")),
    ("policy", re.compile(
        r"\bPOLICY\b|\bDECISION\b|\bGOVERNANCE\b|\bAUTHORITY\b|\bNEED\b")),
)


def classify_evidence_label(label: str) -> str:
    """Sort a bracket label into one epistemic category.

    Definitions, models, hypotheses, mechanisms, and anything newly coined fall
    through to "model" — a declared construct rather than established fact.
    """
    if not isinstance(label, str):
        return "model"
    normalized = label.upper()
    for category, pattern in _CLASSIFICATION_RULES:
        if pattern.search(normalized):
            return category
    return "model"


# --------------------------------------------------------------------------
# The bench record
# --------------------------------------------------------------------------

# Two heading forms exist in the corpus and both must match:
#   "## Session 1 — …"       M05, M09, M18, M31–M36
#   "## 2. Session 1 — …"    M19–M30
# An earlier pattern required the bare form and silently found ZERO sessions in
# M19–M30 — two thirds of the modules. Every bench there would have failed to
# hash, and the error would have pointed at the workbook rather than at this line.
_SESSION_HEADING = re.compile(r"^##\s+(?:\d+\.\s+)?Session\s+([1-6])\b", re.MULTILINE)
# A session slice ends at the next level-2 heading of ANY kind, not at the next
# *session* heading. Ending at the next session would make the last session's
# slice run to end of file, so an edit to the problem ladder, the MCQ block, or
# anything else downstream would invalidate that bench -- the precise false
# positive the slice-hash exists to avoid.
_ANY_H2 = re.compile(r"^##\s", re.MULTILINE)

# A label followed by nothing but an optional parenthetical prompt:
#   "3. Equality  : (do they replace, coexist, or combine?)"
#   "Which curve I designed against, and why :"
# These are the template a learner was supposed to fill in.
#
# The label may contain anything except a colon or newline, because real labels
# carry commas and parentheses. An earlier, narrower pattern required the label
# to be letters-and-spaces only, and two templates in this very pack slipped
# past it and emitted as if they were answers -- the exact defect this guard
# exists to catch. The convention that makes the guard reliable is: a blank in a
# template ends at the colon, with no trailing scaffolding after it.
_UNANSWERED_LINE = re.compile(r"^\s*[^:\n]{1,80}:\s*(?:\(.*\))?\s*$")

_PLACEHOLDER_MARKERS = (
    "paste here",
    "todo",
    "fill in",
    "<name>",
    "your answer",
    # A bench that interpolates its own unattempted state into a claim is
    # asserting something it did not observe. One did exactly that: it reported
    # "the order invariant held after every push" with an empty trace.
    "not implemented",
)


@dataclass
class _Bench:
    bench_id: str
    module_id: str
    session_number: int
    declared_artifact: str
    rungs: tuple[str, ...]
    claims: list[dict[str, Any]] = field(default_factory=list)
    non_claim: str | None = None
    checks: dict[str, int] = field(
        default_factory=lambda: {"passed": 0, "failed": 0, "notAttempted": 0}
    )


_ACTIVE: _Bench | None = None


def bench(
    module: int,
    session: int,
    emits: str,
    rungs: Sequence[str],
) -> None:
    """Declare this file's identity. Call once, at the top.

    `emits` must name the artifact the workbook's `### Output:` heading declares
    for this session. `validate:benches` string-compares it against the
    generated `workbookOutput`, so a bench cannot quietly redefine what its
    session produces.

    `rungs[0]` is the bench's **primary rung** — the one the pack-level budget
    rules are read against:

      R1  at most one bench per pack may be `modify`-primary, and never with
          `modify` as its only rung. Targeted mechanism implementation is 5% of
          the course's evidence weight; a pack that is mostly "implement this"
          has inverted the weighting.
      R2  every pack needs at least one `debug-and-defend`-primary and one
          `review-and-verify`-primary bench. Those two carry 40% of the weight
          between them, and they are what a printed workbook cannot do.

    List the remaining rungs after the primary one, in the order the bench
    exercises them.
    """
    global _ACTIVE
    module_id = f"m{module:02d}"
    _ACTIVE = _Bench(
        bench_id=f"{module_id}-s{session}",
        module_id=module_id,
        session_number=session,
        declared_artifact=emits,
        rungs=tuple(rungs),
    )
    print(f"bench {_ACTIVE.bench_id} — emits: {emits}")
    print(f"  rungs: {', '.join(rungs)}")


def claim(label: str, statement: str, support: Any = None) -> None:
    """Record a labelled claim this bench establishes.

    `label` is a workbook-style bracket label without the brackets, e.g.
    "FINITE EXPERIMENT" or "COURSE MODEL". It is classified through the same
    rules the portal renderer uses.
    """
    if _ACTIVE is None:
        print("No active bench; call bench(...) first.")
        return
    category = classify_evidence_label(label)
    _ACTIVE.claims.append({
        "label": label,
        "category": category,
        "statement": statement.strip(),
        "support": support,
    })
    print(f"  [{label}] ({category}) {statement.strip()}")


def non_claim(statement: str) -> None:
    """Record what this bench's evidence does NOT establish.

    Mandatory. `emit()` refuses without it, because a measurement whose limits
    are unstated is exactly the overclaim the course exists to prevent:
    evidence accumulates, it does not upgrade itself.
    """
    if _ACTIVE is None:
        print("No active bench; call bench(...) first.")
        return
    _ACTIVE.non_claim = statement.strip()
    print(f"  cannot establish: {statement.strip()}")


def _looks_unanswered(text: str) -> bool:
    """Detect a template that was exported instead of an answer."""
    lowered = text.lower()
    if any(marker in lowered for marker in _PLACEHOLDER_MARKERS):
        return True
    lines = [line for line in text.splitlines() if line.strip()]
    return bool(lines) and any(_UNANSWERED_LINE.match(line) for line in lines)


def _session_sha256(module_id: str, session: int) -> str | None:
    """Hash the workbook slice for this session, so drift is detectable.

    Hashes the session slice rather than the whole workbook: an unrelated typo
    fix in a 3,000-line file must not invalidate a bench, but a changed session
    contract must.

    Newlines are normalised to "\\n" explicitly. The workbooks are CRLF, and
    Python's text mode silently converts while Node's `readFileSync` does not --
    so the two languages hash the same bytes to different digests unless one of
    them says so out loud. Python writes this digest and `check-bench-workbook-sync.mjs`
    verifies it, so a silent disagreement would fail every bench in CI for a
    reason no error message would explain.
    """
    start = Path.cwd()
    for candidate in (start, *list(start.parents)[:5]):
        modules = candidate / "content" / "modules"
        if modules.is_dir():
            number = module_id[1:]
            matches = sorted(modules.glob(f"{number}_*.md"))
            if not matches:
                return None
            text = matches[0].read_text(encoding="utf8").replace("\r\n", "\n")
            for match in _SESSION_HEADING.finditer(text):
                if int(match.group(1)) != session:
                    continue
                following = _ANY_H2.search(text, match.end())
                end = following.start() if following else len(text)
                slice_text = text[match.start():end]
                return hashlib.sha256(slice_text.encode("utf8")).hexdigest()
            return None
    return None


def emit() -> Path | None:
    """Write the bench record. Refuses an incomplete or unanswered one."""
    if _ACTIVE is None:
        print("No active bench; call bench(...) first.")
        return None

    if _ACTIVE.non_claim is None:
        print("REFUSED: no non_claim recorded.")
        print("  Every bench must state what its evidence does not establish.")
        return None

    resolved_predictions = [dict(p) for p in _PREDICTIONS.values()]

    suspect = [
        c["statement"] for c in _ACTIVE.claims if _looks_unanswered(c["statement"])
    ] + [p["answer"] for p in resolved_predictions if _looks_unanswered(p["answer"])]
    if suspect:
        print("REFUSED: the record still contains unanswered template text.")
        for item in suspect[:3]:
            print(f"  {item.splitlines()[0][:70]!r}")
        return None

    # A bench whose checks all went unattempted observed nothing, so its claims
    # rest on nothing. Text-level placeholder detection cannot catch this: the
    # prose can be perfectly well formed and still describe a run that did not
    # happen.
    attempted = _ACTIVE.checks["passed"] + _ACTIVE.checks["failed"]
    if _ACTIVE.checks["notAttempted"] and attempted == 0:
        print("REFUSED: every check went unattempted, so this record would claim")
        print("  evidence from a run that did not happen. Implement the exercises,")
        print("  or delete the claims that depend on them.")
        return None

    record = {
        "schemaVersion": 1,
        "kind": "atlas-bench-record",
        "benchId": _ACTIVE.bench_id,
        "moduleId": _ACTIVE.module_id,
        "sessionNumber": _ACTIVE.session_number,
        "declaredArtifact": _ACTIVE.declared_artifact,
        "sessionSha256": _session_sha256(_ACTIVE.module_id, _ACTIVE.session_number),
        "environment": {
            "python": sys.version.split()[0],
            "implementation": platform.python_implementation(),
            "platform": platform.platform(),
        },
        "rungs": list(_ACTIVE.rungs),
        "predictions": resolved_predictions,
        "claims": _ACTIVE.claims,
        "checks": dict(_ACTIVE.checks),
        "nonClaim": _ACTIVE.non_claim,
    }

    # Records are the learner's own evidence and stay out of git; the directory
    # is resolved relative to the benches root so it does not matter whether the
    # notebook was opened from benches/ or benches/build/.
    start = Path.cwd()
    root = next(
        (c for c in (start, *list(start.parents)[:4]) if (c / "atlas_bench").is_dir()),
        start,
    )
    output = root / "records"
    output.mkdir(exist_ok=True)
    path = output / f"{_ACTIVE.bench_id}.json"
    path.write_text(json.dumps(record, indent=2), encoding="utf8")

    print(f"wrote {path}")
    print(f"  {record['checks']['passed']} passed, "
          f"{record['checks']['failed']} failed, "
          f"{record['checks']['notAttempted']} not attempted")
    if record["sessionSha256"] is None:
        print("  (workbook session slice not found — sessionSha256 is null)")
    return path
