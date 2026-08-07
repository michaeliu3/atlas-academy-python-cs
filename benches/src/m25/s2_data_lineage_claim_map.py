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
# # Bench m25-s2 — data lineage claim map
#
# **Session 25.2 — Data lineage and what a row is allowed to claim.** Rungs:
# **debug and defend** (primary), review and verify.
#
# Bench `m25-s4` established that a leaked split is undetectable downstream, and
# that the only reason the leak was *visible* there is that the rows carried an
# `outcome_day`. This session is where that column comes from.
#
# A data contract is a set of claims about where each row came from and what it
# may be used for. This bench violates one claim at a time and watches which
# defect each one names — including the one that would improve the model and is
# refused anyway.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import SPLIT_DAY  # noqa: E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module25_reference import (  # noqa: E402
    DEFAULT_CONTRACT, DataContractError, TrainingRow, validate_training_rows,
)

assert sys.version_info >= (3, 12)

bench(module=25, session=2, emits="data lineage claim map",
      rungs=["debug-and-defend", "review-and-verify"])

# %% [markdown]
# ## 1. The contract, read as a set of claims

# %%
print(f"purpose        : {DEFAULT_CONTRACT.purpose}")
print(f"allowed fields : {DEFAULT_CONTRACT.allowed_fields}")
print(f"policy version : {DEFAULT_CONTRACT.policy_version}")
print(f"human override : {DEFAULT_CONTRACT.human_override_required}")
print(f"auto mutation  : {DEFAULT_CONTRACT.automatic_mutation_allowed}")
print(f"retention      : {DEFAULT_CONTRACT.retention_note}")

GOOD = TrainingRow(row_id="r-ok", feature_day=2, outcome_day=5, label=1,
                   fields=("completed_modules",))
print(f"\na conforming row: {GOOD}")

baseline = validate_training_rows((GOOD,), SPLIT_DAY)
checkpoint("the conforming row validates", len(baseline) == 1)

# %%
predict(
    "Four rows, each breaking exactly one contract claim: a non-binary label, an "
    "outcome dated before its features, a feature observed after the decision "
    "cutoff, and a feature that is accurate and predictive but undeclared. How "
    "many are rejected?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — break one claim at a time

# %%
VIOLATIONS = {
    "non-binary label": TrainingRow(
        row_id="r-label", feature_day=2, outcome_day=5, label=7,
        fields=("completed_modules",)),
    "outcome precedes features": TrainingRow(
        row_id="r-order", feature_day=5, outcome_day=2, label=1,
        fields=("completed_modules",)),
    "feature after the cutoff": TrainingRow(
        row_id="r-late", feature_day=SPLIT_DAY + 3, outcome_day=SPLIT_DAY + 5,
        label=1, fields=("completed_modules",)),
    "undeclared feature": TrainingRow(
        row_id="r-field", feature_day=2, outcome_day=5, label=1,
        fields=("completed_modules", "support_ticket_sentiment")),
}

print(f"{'violated claim':>28}  {'verdict':>9}  message")
results = {}
for label, row in VIOLATIONS.items():
    try:
        validate_training_rows((row,), SPLIT_DAY)
        results[label] = {"rejected": False, "message": "accepted"}
    except DataContractError as error:
        results[label] = {"rejected": True, "message": str(error)}
    print(f"{label:>28}  "
          f"{'rejected' if results[label]['rejected'] else 'ACCEPTED':>9}  "
          f"{results[label]['message'][:44]}")

rejected = [label for label, row in results.items() if row["rejected"]]
distinct_messages = len({row["message"] for row in results.values()})

print(f"\nrejected: {len(rejected)} of {len(VIOLATIONS)}")
print(f"distinct messages: {distinct_messages} — each violation names its own "
      f"defect")

checkpoint("every violation is rejected", len(rejected) == len(VIOLATIONS))
checkpoint("each one names a different defect",
           distinct_messages == len(VIOLATIONS),
           "a single 'invalid row' message would have made these one problem")
checkpoint("the undeclared feature is rejected on authority, not on quality",
           "unauthorized" in results["undeclared feature"]["message"],
           "nothing was measured about whether that field predicts anything")

# %%
resolve(
    "Four rows, each breaking exactly one contract claim: a non-binary label, an "
    "outcome dated before its features, a feature observed after the decision "
    "cutoff, and a feature that is accurate and predictive but undeclared. How "
    "many are rejected?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Four rows, each breaking exactly one contract claim: a non-binary label, an "
    "outcome dated before its features, a feature observed after the decision "
    "cutoff, and a feature that is accurate and predictive but undeclared. How "
    "many are rejected?",
    """
    All four, each with its own message. The fourth is the one worth arguing about.

    `support_ticket_sentiment` might be the single most predictive field available.
    Nothing in the rejection concerns its accuracy, its coverage, or its lift — the
    validator never looks. It is refused because it is **not in the contract**, and
    a contract is a statement about what this system is *permitted* to use, not
    about what would help.

    That distinction is the whole session. Every other quality check in a pipeline
    asks "is this value right?". A lineage check asks a different question: "is this
    value *ours to use, for this purpose*?" A field can be perfectly accurate and
    still be the wrong field — collected under a consent that did not cover this
    use, or from a population this decision does not apply to, or subject to a
    retention rule that expired. None of those are visible in the values.

    Look at the other three, because they form a ladder of increasing subtlety.

    A **non-binary label** is a schema error. Any validator catches it and it fails
    loudly.

    An **outcome dated before its features** is incoherent — the row claims to have
    observed a result before its inputs existed. It usually means two tables were
    joined on the wrong key, or a backfill overwrote a timestamp. Nothing about the
    values looks wrong; only the relationship between two columns does.

    A **feature observed after the cutoff** is the leak bench `m25-s4` measured, and
    here it is caught *at ingestion* rather than at evaluation. That is the correct
    place. By the time you are computing accuracy, the leak has already been
    laundered into a number, and no amount of statistical care recovers it.

    Now notice what makes all three of the temporal checks possible: `feature_day`
    and `outcome_day`. Two columns. A dataset that records only features and a label
    — which is what most datasets are, and what every tutorial format assumes — has
    **destroyed the evidence** that any of these checks need. Not hidden it,
    destroyed it. There is no downstream analysis that reconstructs when a value
    became knowable.

    So the practical claim from this bench is uncomfortable and specific: whether
    you can ever check for leakage was decided by whoever designed the table, long
    before any model existed, and usually by someone who was not thinking about
    models at all. That is why the lineage map is Session 2's artifact and the
    calibration report is Session 4's — this one is a prerequisite, and the ordering
    is not arbitrary.
    """,
)

# %% [markdown]
# ## 3. Verify — what the contract carries beyond fields

# %%
GOVERNANCE = {
    "human_override_required": DEFAULT_CONTRACT.human_override_required,
    "automatic_mutation_allowed": DEFAULT_CONTRACT.automatic_mutation_allowed,
    "model_version": DEFAULT_CONTRACT.model_version,
}
for key, value in GOVERNANCE.items():
    print(f"{key:>28}: {value}")

print(f"\npurpose: {DEFAULT_CONTRACT.purpose}")
print(f"retention: {DEFAULT_CONTRACT.retention_note}")

checkpoint("the contract requires a human in the loop",
           DEFAULT_CONTRACT.human_override_required is True)
checkpoint("and forbids automatic mutation",
           DEFAULT_CONTRACT.automatic_mutation_allowed is False,
           "the system may suggest; it may not act")
checkpoint("the purpose is a sentence, not a category",
           len(DEFAULT_CONTRACT.purpose.split()) > 5,
           "'help a learner choose one optional next study action' is checkable "
           "against a proposed use; 'analytics' is not")
checkpoint("model_version is None and that is a valid state",
           DEFAULT_CONTRACT.model_version is None,
           "the contract exists before any model does — which is the ordering "
           "this session argues for")

# %% [markdown]
# ## 4. Review and verify — which check catches which defect?

# %%
DEFECTS = {
    "a": "A label column containing the string 'unknown'.",
    "b": "A feature joined from a table updated nightly, with no timestamp.",
    "c": "A field collected under a consent that covered support, not modelling.",
    "d": "An outcome recorded before its features were observed.",
}
for key, text in DEFECTS.items():
    print(f"{key}. {text}")


def caught_by_value_validation(key: str) -> bool:
    """True when inspecting the VALUES would reveal this defect."""
    raise NotImplementedError("Separate value checks from lineage checks")


# %%
check("caught_by_value_validation", caught_by_value_validation,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(b) and (c) are the ones no value check reaches, for different reasons.")
print("(b) has no timestamp, so the evidence needed does not exist in the data.")
print("(c) is a fact about how the data was OBTAINED, which no column records.")
print("(d) is visible only in the relationship between two columns, not in either.")

# %% [markdown]
# ## 5. The lineage claim map

# %%
LINEAGE_MAP = """
Field | Source | When it becomes knowable | Permitted purpose | Retention
------+--------+--------------------------+-------------------+----------
      |        |                          |                   |
      |        |                          |                   |

The claim each contract rule encodes, one line per rule:
The rejected field, and why its predictive value was never considered:
The two columns that make a leakage check possible at all:
What a dataset without them has permanently lost, and who decided that:
The check I would add at ingestion rather than at evaluation, and why there:
"""
print(LINEAGE_MAP)

# %%
claim("DEFENDED REPAIR", LINEAGE_MAP)

claim(
    "LOCAL REFERENCE RESULT",
    f"The reference data contract declares {len(DEFAULT_CONTRACT.allowed_fields)} "
    f"permitted fields, requires human override, and forbids automatic mutation, "
    f"with model_version=None. Four rows each violating exactly one contract claim "
    f"are all rejected, with {distinct_messages} distinct messages — a non-binary "
    f"label, an outcome dated before its features, a feature observed after the "
    f"day-{SPLIT_DAY} cutoff, and an undeclared field rejected as unauthorized "
    f"without any inspection of its predictive value.",
    support={"contract": {"allowedFields": list(DEFAULT_CONTRACT.allowed_fields),
                          "purpose": DEFAULT_CONTRACT.purpose,
                          "policyVersion": DEFAULT_CONTRACT.policy_version,
                          "humanOverrideRequired":
                              DEFAULT_CONTRACT.human_override_required,
                          "automaticMutationAllowed":
                              DEFAULT_CONTRACT.automatic_mutation_allowed,
                          "modelVersion": DEFAULT_CONTRACT.model_version},
             "splitDay": SPLIT_DAY,
             "violations": results,
             "rejected": rejected},
)

non_claim(
    "This is a declared contract and four hand-written rows; no data was collected, "
    "no consent was obtained, and no model exists. It establishes what this "
    "validator refuses and that an undeclared field is refused on authority rather "
    "than on quality. It does not establish that any real dataset carries the "
    "columns these checks need — the point is largely that most do not — and it "
    "cannot verify a consent, a retention schedule, or a population boundary, all "
    "of which are facts about the world that no validator reading rows can reach."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. A predictive field was refused without its predictiveness being measured.
#    Write the rule this implies about the relationship between a data contract and
#    model performance.
# 2. Two of the four defects were invisible in the values. Name what kind of fact
#    they are, and where that fact has to be recorded instead.
# 3. Bench `m25-s4` found a leak no downstream metric could detect. State what this
#    bench adds to that finding, and why the order of the two sessions matters.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module25_reference.py` — `validate_training_rows`,
# `DEFAULT_CONTRACT`, `TrainingRow`, `DataContractError`. Not reimplemented. The
# one-violation-at-a-time rows and the value/lineage sort are this bench's own.
