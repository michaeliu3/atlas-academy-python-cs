# M1–M5/M27 gateway evidence-hours roll-up

**Decision date:** 2026-08-02  
**Purpose:** calibrate calendar capacity for the connected gateway. This is a
planning envelope, not a learner-time study, release claim, mastery measure, or
instruction to shorten a workbook.

## Inputs and boundary

The active graph schedules M1–M5 and M27 in Days 2–9 of the 60-day route.
Those six modules contain **36 required connected sessions**. M3 is the one
gateway workbook that currently publishes core-session durations:

| Input | Sessions | Time used in this roll-up | Why it is safe to use |
| --- | ---: | ---: | --- |
| M3 — Abstraction, Interfaces, and ADTs | 6 | 595 minutes / 9 h 55 min | The six headings explicitly declare 75, 90, 100, 90, 120, and 120 minutes. The optional TA consolidation is excluded. |
| M1, M2, M4, M5, M27 | 30 | 45-minute **optimistic planning baseline** each / 1,350 minutes / 22 h 30 min | These workbooks deliberately do not publish a duration. This is not a measured minimum or a hidden time claim; it is a generous short-session planning baseline used only to test calendar plausibility. |
| Gateway session blocks | 36 | **1,945 minutes / 32 h 25 min** | This excludes the diagnostic, source reading, prediction/reveal discussion, artifacts, oral-defense conversations, retrieval, repairs, and buffers. |

The academic ordering itself remains sound: the current
[official M1–M5 learner-route recheck](m1-m5-official-source-review-2026-08-01.md)
maps the execution → recursion/induction → ADT → proof → cost bridge to MIT
6.100L, 6.042J, 6.102, 6.006, and CMU 15-122. This roll-up changes only the
time claim, not that source-calibrated sequence or any workbook scope.

## Capacity comparison

Eight calendar days at the former 20–25-hour weekly band provide only
**22 h 51 min–28 h 34 min**. Even the optimistic 32 h 25 min gateway-session
envelope exceeds that by **3 h 51 min–9 h 34 min**, before any learner evidence
or recovery. It therefore cannot honestly be described as a six-session
M1–M5/M27 schedule.

The revised 35–45-hour full-time 60-day band provides **40 h–51 h 26 min** in
the same eight-day window. It leaves a planning margin for concise diagnostics,
transfer artifacts, oral reflection, and an interruption; it is still not a
completion guarantee. The first-week calibration rule remains authoritative:
move to the 90- or 180-day route rather than omit a required reasoning step.

## Route decision

| Route | Weekly band | 60/90/180-day capacity | Honest use |
| --- | ---: | ---: | --- |
| 60-day intensive core | 35–45 hours | 300–386 hours | A full-time accelerated minimum-evidence pass. It is the only 60-day band that can credibly schedule the gateway without pretending its sessions are brief readings. |
| 90-day sustainable route | 20–25 hours | 257–321 hours | The recommended route when a full-time 60-day commitment is unavailable. |
| 180-day durable route | 10–15 hours | 257–386 hours | The route for stronger spacing, recovery, and revision without deleting difficult evidence work. |

This correction intentionally leaves `referenceReadMinutes` unchanged: those
values describe reading only and must not be repurposed as total learning-time
claims. It also leaves the frozen v1 graph unchanged; v2 is the active learner
route truth.

## Recheck trigger

Repeat the calculation only when a gateway workbook publishes or materially
changes core-session durations, or when a real learner pilot exposes a repeated
time/accessibility constraint. Do not turn ordinary study variation into a new
tracking system.
