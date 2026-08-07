# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# %% [markdown]
# # Bench m05-s5 — measurement-boundary report
#
# **Session 5.5 — Measurement as a model check.** Rungs: **debug and defend**
# (primary), trace.
#
# The session's declared output is a report recording *"the prior prediction,
# confidence, data distribution, timing boundary, repeated raw samples,
# environment, uncertainty, and one alternative explanation for a mismatch."*
# The record this bench emits carries exactly those fields.
#
# The workbook states the benchmark–analysis loop and the ratio test. It cannot
# run either. Here you go around the loop twice, and the second time it takes the
# "no" branch — the measurement disagrees with a model that looks obviously right.
#
# **Requires:** Python 3.12+, matplotlib.

# %%
import sys
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, classify_growth, emit, growth_ratios,
    measure, non_claim, predict, resolve, reveal,
)
from _fixture import DISTINCT, SIZES, dedup_hashed, dedup_scan  # noqa: E402

assert sys.version_info >= (3, 12)

bench(
    module=5,
    session=5,
    emits="measurement-boundary report",
    rungs=["debug-and-defend", "trace"],
)

# %% [markdown]
# ## 1. Loop one — does measurement match the counted model?
#
# Session 1 established an exact count. Now put a clock on the same code.
# `measure` takes best-of-5, matching `elapsed_seconds` in workbook §10, and the
# input is built outside the timed region as that section requires.

# %%
scan_times = measure(lambda n: dedup_scan(DISTINCT[n]), SIZES)
hashed_times = measure(lambda n: dedup_hashed(DISTINCT[n]), SIZES)

print(f"{'n':>7}  {'scan (ms)':>11}  {'hashed (ms)':>12}")
for n, s, h in zip(SIZES, scan_times, hashed_times):
    print(f"{n:>7}  {s * 1000:>11.3f}  {h * 1000:>12.3f}")

scan_ratios = growth_ratios(SIZES, scan_times)
hashed_ratios = growth_ratios(SIZES, hashed_times)
print(f"\nscan   ratios {[f'{r:.2f}' for r in scan_ratios]} -> {classify_growth(SIZES, scan_times)}")
print(f"hashed ratios {[f'{r:.2f}' for r in hashed_ratios]} -> {classify_growth(SIZES, hashed_times)}")

# %%
import matplotlib.pyplot as plt  # noqa: E402

fig, (ax_time, ax_ratio) = plt.subplots(1, 2, figsize=(11, 4))
ax_time.plot(SIZES, scan_times, "o-", label="dedup_scan")
ax_time.plot(SIZES, hashed_times, "s-", label="dedup_hashed")
ax_time.set(xscale="log", yscale="log", xlabel="n", ylabel="seconds (best of 5)",
            title="log-log: slope is the exponent")
ax_time.legend(); ax_time.grid(True, which="both", alpha=0.3)

ax_ratio.plot(SIZES[1:], scan_ratios, "o-", label="dedup_scan")
ax_ratio.plot(SIZES[1:], hashed_ratios, "s-", label="dedup_hashed")
for level, name in ((2.0, "linear"), (4.0, "quadratic")):
    ax_ratio.axhline(level, ls="--", alpha=0.4)
    ax_ratio.text(SIZES[-1], level, f" {name}", va="center", fontsize=8)
ax_ratio.set(xscale="log", xlabel="n", ylabel="time(n) / time(n/2)", title="ratio test")
ax_ratio.legend(); ax_ratio.grid(True, alpha=0.3)
plt.tight_layout(); plt.show()

# %% [markdown]
# ## 2. Loop two — two functions that differ by one inert line
#
# Below are two report builders. The second has one extra assignment that is
# never read. Same loop, same concatenation, same return value.
#
# By any reasonable reading, they cost the same.


# %%
def build_event_report(events: list[str]) -> str:
    """Build a report line per event."""
    report = ""
    for event in events:
        report += f"processed {event}\n"
    return report


def build_event_report_logged(events: list[str]) -> str:
    """Identical, plus one assignment whose value is never used."""
    report = ""
    for event in events:
        report += f"processed {event}\n"
        last_snapshot = report  # noqa: F841 - never read; that is the point
    return report


# %%
report_sizes = [1000, 2000, 4000, 8000, 16000]
report_data = {n: [f"evt-{i}" for i in range(n)] for n in report_sizes}

checkpoint(
    "both functions return identical output",
    build_event_report(report_data[1000]) == build_event_report_logged(report_data[1000]),
)

# %%
predict(
    "The two functions differ only by an unused assignment. Will their measured "
    "growth ratios differ?",
    answer="",
    confidence="",
)

# %%
plain_times = measure(lambda n: build_event_report(report_data[n]), report_sizes, repeats=3)
logged_times = measure(lambda n: build_event_report_logged(report_data[n]), report_sizes, repeats=3)

print(f"{'plain':>8} -> {classify_growth(report_sizes, plain_times)}")
print(f"{'':>8}    ratios {[f'{r:.2f}' for r in growth_ratios(report_sizes, plain_times)]}")
print(f"{'logged':>8} -> {classify_growth(report_sizes, logged_times)}")
print(f"{'':>8}    ratios {[f'{r:.2f}' for r in growth_ratios(report_sizes, logged_times)]}")
slowdown = logged_times[-1] / plain_times[-1]
print(f"\ncost of the unused line at n={report_sizes[-1]}: {slowdown:.1f}x slower")

# %%
resolve(
    "The two functions differ only by an unused assignment. Will their measured "
    "growth ratios differ?",
    "diverged",  # matched / diverged / partial
)

# %%
reveal(
    "The two functions differ only by an unused assignment. Will their measured "
    "growth ratios differ?",
    """
    Yes — by a growth class, not a constant.

    Python strings are immutable, so `report += ...` must in principle build a
    new string and copy everything accumulated so far: quadratic.

    CPython has an in-place optimisation that rescues the common case. When the
    target string's reference count is exactly 1, the interpreter knows nobody
    else can observe the old buffer, so it resizes in place instead of copying.
    That makes `plain` behave close to linear.

    `last_snapshot = report` raises the refcount to 2. The interpreter can no
    longer prove the old buffer is dead, the optimisation switches off, and the
    true quadratic cost appears. The line is dead code in every sense a reader
    cares about, and it changes the complexity class.

    Three things follow:

    1. **Reading was never going to find this.** Nothing in the source says
       "refcount". Only measurement exposed it.
    2. **`plain`'s ratios are ragged** — near 2 at small n, drifting upward. The
       optimisation depends on the allocator extending the buffer in place, which
       gets less likely as the string grows. An optimisation you cannot predict
       is not a cost model.
    3. **It is CPython-specific.** PyPy, or a future CPython, may do otherwise.

    The honest conclusion is not "avoid the extra line". It is: `+=` in a loop has
    no dependable cost, so do not build strings that way. `"".join(parts)` is
    linear everywhere, and its cost does not depend on what other names happen to
    point at.

    This is the loop diagram's "no" branch: the model said the two were
    identical, the measurement disagreed, and the disagreement pointed at a
    hidden layer.
    """,
)

# %% [markdown]
# ## 3. Debug and defend — repair it, and prove the repair is not fragile
#
# The acceptance criterion is not "it got faster". It is "it stopped depending on
# a refcount". So implement the repair, then add the same inert line to it and
# confirm the growth class does **not** move.


# %%
def build_event_report_linear(events: list[str]) -> str:
    """Same output, linear on every implementation."""
    raise NotImplementedError("Implement the linear version")


def build_event_report_linear_logged(events: list[str]) -> str:
    """Your implementation plus the same unused assignment."""
    raise NotImplementedError("Mirror build_event_report_linear, plus the alias")


# %%
check(
    "build_event_report_linear matches the original",
    build_event_report_linear,
    [((report_data[1000],), build_event_report(report_data[1000]))],
)

try:
    fixed = measure(lambda n: build_event_report_linear(report_data[n]), report_sizes, repeats=3)
    fixed_logged = measure(
        lambda n: build_event_report_linear_logged(report_data[n]), report_sizes, repeats=3
    )
    print(f"repaired       -> {classify_growth(report_sizes, fixed)}")
    print(f"repaired+alias -> {classify_growth(report_sizes, fixed_logged)}")
    print(f"speedup vs quadratic baseline: {logged_times[-1] / fixed[-1]:.1f}x")
    checkpoint(
        "growth class is unchanged by the aliasing line",
        classify_growth(report_sizes, fixed).split()[0]
        == classify_growth(report_sizes, fixed_logged).split()[0],
        "if this fails, the repair is still refcount-dependent",
    )
except NotImplementedError:
    print("Repair not implemented yet — skipping.")

# %% [markdown]
# ## 4. The defence
#
# A repair without a defence is a guess that happened to work.

# %%
DEFENCE = """
Which curve I designed against, and why:
What the repair changed, mechanically:
Alternative explanation for the mismatch I ruled out, and how:
"""
print(DEFENCE)

# %% [markdown]
# ## 5. The record — the measurement-boundary report
#
# The session names eight required fields. They are the record's structure, not a
# checklist to remember.

# %%
import platform  # noqa: E402

claim("DEFENDED REPAIR", DEFENCE)

claim(
    "FINITE EXPERIMENT",
    f"Two string builders differing only by an unused assignment measured "
    f"{classify_growth(report_sizes, plain_times).split(' (')[0]} and "
    f"{classify_growth(report_sizes, logged_times).split(' (')[0]}; the unused "
    f"line cost {slowdown:.1f}x at n={report_sizes[-1]}.",
    support={
        "priorPrediction": "the two functions cost the same",
        "dataDistribution": "all-distinct synthetic event ids, uniform length",
        "timingBoundary": "input built outside the timed region; best of 3",
        "rawSamples": {"plain": plain_times, "logged": logged_times},
        "sizes": report_sizes,
        "ratios": {
            "plain": growth_ratios(report_sizes, plain_times),
            "logged": growth_ratios(report_sizes, logged_times),
        },
        "environment": {
            "python": sys.version.split()[0],
            "implementation": platform.python_implementation(),
            "platform": platform.platform(),
        },
        "alternativeExplanation": (
            "Allocator luck rather than refcount: if the plain buffer simply "
            "happened to be extendable in place on this run, the gap would shrink "
            "on a machine with different memory pressure. Ruled out only weakly "
            "here — the ratio separation is stable across sizes, but a second "
            "machine would strengthen it."
        ),
    },
)

claim(
    "FINITE EXPERIMENT",
    f"dedup_scan measured {classify_growth(SIZES, scan_times)}; dedup_hashed "
    f"measured {classify_growth(SIZES, hashed_times)}.",
    support={"sizes": SIZES, "scan": scan_times, "hashed": hashed_times},
)

non_claim(
    "Ratios over four doublings cannot separate n from n log n — log n changes by "
    "a factor of about 1.1 while n doubles. dedup_hashed's classification is "
    "therefore 'linear or n log n', not 'linear'. Measurement narrowed the "
    "hypothesis; it did not select one."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. `plain`'s ratios drift upward with n. Give two explanations consistent with
#    that, and say what measurement would distinguish them.
# 2. You designed against the quadratic curve. State the general rule you now hold
#    about when a measured cost may be trusted.
# 3. Name one situation where the *measurement* rather than the model is the thing
#    that is wrong.
#
# ---
#
# ## Attributions
#
# Authored for this course. No external material vendored.
#
# The refcount-sensitivity pair was found while validating this bench: the
# textbook "quadratic string concatenation" demonstration measured *linear*
# because CPython's in-place optimisation fired, and the aliasing variant was
# built to restore the effect.
