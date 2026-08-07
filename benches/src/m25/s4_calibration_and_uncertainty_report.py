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
# # Bench m25-s4 — calibration and uncertainty report
#
# **Session 25.4 — Calibration and uncertainty.** Rungs: **review and verify**
# (primary), debug and defend.
#
# Two failures live in this session and they are usually confused. One is an
# evaluation that is **not entitled to its number** because the split leaked. The
# other is an evaluation whose number is genuine and **does not mean what the
# reader thinks** — accuracy is not calibration.
#
# This bench produces both from the reference model: a split that puts unknowable
# outcomes into training, and a perfect-scoring evaluation card that explicitly
# refuses to support a calibration claim.
#
# No model is trained. Whether an evaluation is entitled to its number is settled
# before any model exists, which is why this can be arithmetic.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import SPLIT_DAY  # noqa: E402  (sets up sys.path)

import random  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module25_reference import (  # noqa: E402
    ScoredOutcome, TrainingRow, evaluate_held_out, temporal_split,
    validate_training_rows,
)

assert sys.version_info >= (3, 12)

bench(module=25, session=4, emits="calibration and uncertainty report",
      rungs=["review-and-verify", "debug-and-defend"])

# %% [markdown]
# ## 1. Rows that know when they happened
#
# Each row records **two** days: when its features were observable, and when its
# outcome became known. That second column is the one most datasets do not have,
# and it is the one every leakage question turns on.

# %%
ROWS = tuple(
    TrainingRow(row_id=f"r{n}", feature_day=n % 5 + 1, outcome_day=n % 5 + 4,
                label=n % 2, fields=("completed_modules",))
    for n in range(1, 13)
)
validated = validate_training_rows(ROWS, SPLIT_DAY)

print(f"{'row':>5}  {'features known':>15}  {'outcome known':>14}  {'label':>5}")
for row in validated[:6]:
    print(f"{row.row_id:>5}  {row.feature_day:>15}  {row.outcome_day:>14}  "
          f"{row.label:>5}")
print(f"  ... {len(validated)} rows total")
print(f"\nthe model is deployed on day {SPLIT_DAY}: it may use anything known by "
      f"then, and nothing known later.")

# %%
predict(
    "A random 60/40 split and a temporal split at day 5, over the same 12 rows. "
    "How many training rows in each carry an outcome that was not yet known on "
    "day 5?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — split the same rows two ways

# %%
temporal_train, temporal_held = temporal_split(validated, SPLIT_DAY)

shuffled = list(validated)
random.Random(20260806).shuffle(shuffled)
cut = int(len(shuffled) * 0.6)
random_train, random_held = tuple(shuffled[:cut]), tuple(shuffled[cut:])


def leaked(training) -> list[str]:
    """Training rows whose outcome was not yet known at the split day."""
    return [row.row_id for row in training if row.outcome_day > SPLIT_DAY]


splits = {
    "random 60/40": {"train": random_train, "held": random_held},
    f"temporal at day {SPLIT_DAY}": {"train": temporal_train, "held": temporal_held},
}

print(f"{'split':>22}  {'train':>5}  {'held':>4}  {'leaked':>6}  "
      f"train outcome days")
for label, row in splits.items():
    leaks = leaked(row["train"])
    row["leaked"] = leaks
    print(f"{label:>22}  {len(row['train']):>5}  {len(row['held']):>4}  "
          f"{len(leaks):>6}  {sorted({r.outcome_day for r in row['train']})}")

random_leaks = splits["random 60/40"]["leaked"]
temporal_leaks = splits[f"temporal at day {SPLIT_DAY}"]["leaked"]

checkpoint("the temporal split leaks nothing", temporal_leaks == [],
           "every training outcome was known by the split day, by construction")
checkpoint("the random split does leak", len(random_leaks) > 0,
           f"{len(random_leaks)} training rows carry outcomes from after day "
           f"{SPLIT_DAY}: {random_leaks}")
checkpoint("both splits used the identical rows",
           set(r.row_id for r in random_train) | set(r.row_id for r in random_held)
           == set(r.row_id for r in temporal_train) | set(r.row_id for r in temporal_held))
checkpoint("nothing raised, and no metric would look wrong", True,
           "the leak is in the SPLIT, and no evaluation of the result can see it")

# %%
resolve(
    "A random 60/40 split and a temporal split at day 5, over the same 12 rows. "
    "How many training rows in each carry an outcome that was not yet known on "
    "day 5?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "A random 60/40 split and a temporal split at day 5, over the same 12 rows. "
    "How many training rows in each carry an outcome that was not yet known on "
    "day 5?",
    """
    The temporal split leaks nothing, by construction. The random split leaks —
    and the number does not matter as much as the fact that no metric computed
    afterwards can detect it.

    Follow what the random split actually did. It treated the rows as an
    unordered bag and drew 60% of them. Some of those rows have outcomes that
    became known on days 6, 7, and 8. The model is then trained on information
    that did not exist at the moment it is supposed to make a prediction, and
    evaluated on a held-out set drawn from the same bag — which includes rows
    whose outcomes were known *before* some of the training rows'.

    So the evaluation answers a question nobody asked: *given outcomes scattered
    across time, can the model interpolate the ones I hid?* That is a strictly
    easier question than the deployment question, which is: *given only what is
    known today, can it predict what happens tomorrow?* The metric comes out
    higher, and it is not a wrong measurement of the wrong thing — it is a correct
    measurement of the wrong thing, which is far harder to argue with.

    The critical property is that **this is undetectable downstream.** There is no
    accuracy figure, no confusion matrix, no confidence interval, and no
    cross-validation scheme that reveals it, because every one of those is computed
    *after* the split and inherits its assumption. Bootstrap it a thousand times
    and you get a tight interval around the inflated number. The only thing that
    catches this is looking at the split itself — which is why the artifact for
    this session is a report about the evidence rather than a table of scores.

    And notice what made it visible here: the rows carry `outcome_day`. Most
    datasets do not. A dataset that records only features and labels has
    **destroyed the information needed to check for leakage**, and no amount of
    care downstream reconstructs it. That is a data-lineage decision, made long
    before anyone trains anything, and it is why Session 2's lineage map is a
    prerequisite for this session rather than a nicety.

    Section 3 turns to the second failure, which is independent of this one: an
    evaluation whose numbers are entirely honest and still does not license the
    claim being made from them.
    """,
)

# %% [markdown]
# ## 3. Verify — a perfect card that refuses a calibration claim

# %%
SCORES = tuple(
    ScoredOutcome(row_id=f"r{n}", score=0.9 if n % 2 else 0.1, label=n % 2,
                  group="a")
    for n in range(1, 13)
)
card = evaluate_held_out(SCORES, 0.5)

print(f"total {card.total}, positives {card.positives}, negatives {card.negatives}")
print(f"threshold {card.threshold}, selected {card.selected}")
print(f"  true positive : {card.true_positive}")
print(f"  false positive: {card.false_positive}")
print(f"  false negative: {card.false_negative}")
print(f"\n  precision : {card.precision}")
print(f"  recall    : {card.recall}")
print(f"  accuracy  : {card.accuracy}")
print(f"\n  calibration supported: {card.calibration_supported}")
print(f"\nlimitation: {card.limitation}")

checkpoint("every headline metric is perfect",
           card.precision == card.recall == card.accuracy == 1.0)
checkpoint("and the card still refuses to support a calibration claim",
           not card.calibration_supported,
           "a perfect ranking says nothing about whether 0.9 means 90%")
checkpoint("the refusal is a field, not a footnote",
           isinstance(card.calibration_supported, bool),
           "a reader cannot skip it the way a caveat in prose gets skipped")

# %% [markdown]
# ## 4. Verify — why accuracy cannot establish calibration

# %%
def rescale(scores, factor: float):
    """Squash every score toward 0.5 — same ORDER, different magnitudes."""
    return tuple(ScoredOutcome(row_id=s.row_id,
                               score=0.5 + (s.score - 0.5) * factor,
                               label=s.label, group=s.group)
                 for s in scores)


print(f"{'scores':>28}  {'precision':>9}  {'recall':>6}  {'accuracy':>8}  "
      f"{'calibrated?':>11}")
variants = {}
for label, factor in (("as scored (0.1 / 0.9)", 1.0),
                      ("squashed (0.45 / 0.55)", 0.125),
                      ("extreme (0.001 / 0.999)", 1.2475)):
    variant = rescale(SCORES, factor)
    variant_card = evaluate_held_out(variant, 0.5)
    variants[label] = {"precision": variant_card.precision,
                       "accuracy": variant_card.accuracy,
                       "calibration": variant_card.calibration_supported,
                       "scores": sorted({round(s.score, 3) for s in variant})}
    print(f"{label:>28}  {variant_card.precision:>9}  "
          f"{variant_card.recall:>6}  {variant_card.accuracy:>8}  "
          f"{str(variant_card.calibration_supported):>11}")

identical_metrics = len({(v["precision"], v["accuracy"]) for v in variants.values()}) == 1

print(f"\nthe three score sets are wildly different: "
      f"{[v['scores'] for v in variants.values()]}")
print(f"every metric is identical across all three: {identical_metrics}")

checkpoint("changing every score leaves the metrics unchanged", identical_metrics,
           "these metrics depend only on which side of the threshold a score "
           "falls — the magnitude is discarded")
checkpoint("so no threshold metric could ever detect miscalibration",
           identical_metrics
           and not any(v["calibration"] for v in variants.values()),
           "a claim about what 0.9 MEANS needs evidence these numbers do not "
           "contain")

# %% [markdown]
# ## 5. Review and verify — audit five claims from this card

# %%
CLAIMS = {
    "a": "On this held-out fixture, the model separated the two classes perfectly.",
    "b": "Rows scored 0.9 are correct about 90% of the time.",
    "c": "Deploying this model will improve outcomes.",
    "d": "The model will perform this well next month.",
    "e": "This threshold is the right operating point.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def supported_by_the_card(key: str) -> bool:
    """True when THIS evaluation card is evidence for the claim."""
    raise NotImplementedError("Audit each claim against what the card measured")


# %%
check("supported_by_the_card", supported_by_the_card,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False),
       (("e",), False)])
print()
print("(a) is the only one, and note how narrow it is: 'on this held-out fixture'.")
print("(b) is the calibration claim the card names and refuses. (c) is causal and")
print("needs an intervention, not an observation. (e) needs the COST of each error")
print("type, which is a decision input the card never received.")

# %% [markdown]
# ## 6. The uncertainty report

# %%
UNCERTAINTY_REPORT = """
The split, with the day it is drawn on and why that day:
Training rows whose outcome was not knowable at prediction time:
Why no downstream metric could have detected that:
The column that made the check possible, and what its absence would have cost:
The headline metrics, with the scope they are true in:
The calibration claim, and the evidence it would require instead:
Each claim I am NOT making from this card, with the reason:
"""
print(UNCERTAINTY_REPORT)

# %%
claim("REVIEW VERDICT", UNCERTAINTY_REPORT)

claim(
    "LOCAL REFERENCE RESULT",
    f"Over {len(validated)} rows carrying both a feature day and an outcome day, a "
    f"temporal split at day {SPLIT_DAY} places {len(temporal_train)} rows in "
    f"training with zero outcomes from after the split day, while a random 60/40 "
    f"split over the identical rows places {len(random_leaks)} such rows in "
    f"training. Neither split raises, and no metric computed afterwards "
    f"distinguishes them. Separately, evaluate_held_out returns precision "
    f"{card.precision}, recall {card.recall}, and accuracy {card.accuracy} while "
    f"reporting calibration_supported={card.calibration_supported} — and rescaling "
    f"every score from (0.1, 0.9) to (0.45, 0.55) or (0.001, 0.999) leaves all "
    f"three metrics identical.",
    support={"splitDay": SPLIT_DAY, "rowCount": len(validated),
             "temporal": {"train": len(temporal_train),
                          "held": len(temporal_held),
                          "leaked": temporal_leaks},
             "random": {"train": len(random_train), "held": len(random_held),
                        "leaked": random_leaks},
             "card": {"precision": card.precision, "recall": card.recall,
                      "accuracy": card.accuracy,
                      "calibrationSupported": card.calibration_supported,
                      "limitation": card.limitation},
             "rescaling": variants},
)

non_claim(
    "No model was trained and no data was collected: the rows, the scores, and the "
    "days are all declared, and the reference model's own limitation string calls "
    "this a synthetic held-out fixture. This establishes that a random split can "
    "place unknowable outcomes into training, that no threshold metric detects it, "
    "and that accuracy is invariant under rescalings that destroy calibration. It "
    "measures no real model's leakage, quantifies no inflation, and establishes "
    "nothing about causal benefit, fairness across groups, distribution shift, or "
    "what threshold any deployment should use — the last of which needs the cost "
    "of each error type, a decision input no evaluation contains."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. The leak was invisible to every downstream metric. Write the rule this implies
#    about where an evaluation review has to start.
# 2. Three very different score sets produced identical metrics. Name what those
#    metrics discard, and the claim that therefore cannot rest on them.
# 3. Bench `m12-s6` audited a clean report widened into an unsupported summary.
#    State what `calibration_supported=False` and a scope string have in common as
#    design choices.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module25_reference.py` — `temporal_split`,
# `validate_training_rows`, `evaluate_held_out`, `TrainingRow`, `ScoredOutcome`.
# Not reimplemented. The row set, the random-split comparison, and the rescaling
# sweep are this bench's own.
