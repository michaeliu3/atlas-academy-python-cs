# M9 ordered-search official follow-up — 2026-08-03

**Scope.** This is a narrow calibration of one proposed M9 teaching repair:
make the lower-bound binary-search invariant, progress argument, and one
half-open-interval off-by-one failure explicit. It changes no learner route,
release state, source contract, assessment, or mastery claim. The primary
sources below were accessed on **2026-08-03**. They calibrate rigor and public
API semantics; they do not prescribe an Atlas artifact or authorize reuse of
external course material.

## Official primary sources checked

| Source | What it supports for this decision |
| --- | --- |
| Python [3.14 `bisect` documentation](https://docs.python.org/3.14/library/bisect.html) | `bisect_left(a, x)` returns a position `ip` that partitions the searched slice into values `< x` on the left and values `>= x` on the right; `bisect_right` instead uses `<= x` and `> x`. This is the precise target postcondition for a lower-bound loop, including duplicate keys. The documentation also distinguishes logarithmic searching from linear list insertion. |
| MIT OCW [6.006, Lecture 3: Sorting](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/6d1ae5278d02bbecb5c4428928b24194_MIT6_006S20_lec3.pdf) | A sorted array enables binary-search lookup in `O(log n)` time. The lecture's correctness analyses use explicit base cases and inductive preservation arguments, providing an undergraduate-algorithms rigor benchmark for explaining why a loop remains correct rather than merely showing a trace. |

## Calibration decision

**Verdict: make one compact original repair in M9 §10.** After the existing
prediction, add a half-open interval loop whose invariant is:

- every index `< lo` stores a value `< x`;
- every index `>= hi` stores a value `>= x`; and
- the lower-bound **position** remains in the closed index interval `[lo, hi]`
  while the unclassified **array elements** occupy the half-open slice
  `a[lo:hi]`.

For `mid = lo + (hi - lo) // 2`, explain preservation for `a[mid] < x`
(`lo = mid + 1`) and `a[mid] >= x` (`hi = mid`), then show that each branch
strictly shortens `hi - lo`. At termination, `lo == hi` satisfies the Python
documentation's `bisect_left` partition postcondition. This proof sketch is an
original Atlas adaptation inferred from the API contract and MIT's
correctness-argument standard; it is not copied course material.

Use one short debug counterexample: with `a = [10, 20, 20, 20, 30]` and
`x = 30`, changing the second branch to `hi = mid - 1` skips index `4` and
returns `3`. Its right slice begins with `20`, so it violates the documented
`>= x` partition. Also state that changing `<` to `<=` changes the intended
contract to the `bisect_right` boundary; it is not a harmless left-bound fix.

## Explicit non-scope

Do not add a new studio, module, registry, test framework, project, or exam;
do not alter availability, prerequisites, schedule, or release evidence. Keep
the example, diagram, prose, and code original; link/paraphrase the sources
rather than copying their material.
