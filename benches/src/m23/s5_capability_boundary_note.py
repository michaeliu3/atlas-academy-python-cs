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
# # Bench m23-s5 — capability boundary note
#
# **Session 23.5 — Capabilities and the boundary that executes.** Rungs: **review
# and verify** (primary), trace.
#
# Bench `m23-s1` found that lexing and parsing answer different questions. This
# session extends that all the way down: the reference model runs a query through
# **five** stages, and each one refuses for its own reason, in its own vocabulary,
# with its own stage name.
#
# The result worth having is that a query which is lexically fine, syntactically
# fine, schema-valid, and fully authorized **still cannot execute**. Authorization
# produces a decision; execution requires a capability; and the step between them
# is where a great many systems quietly have nothing at all.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import dataclasses  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module23_reference import (  # noqa: E402
    authorize_query, evaluate_query, fixture_authorized_request, lex_query,
    mint_read_capability, parse_query, validate_query,
)

assert sys.version_info >= (3, 12)

bench(module=23, session=5, emits="capability boundary note",
      rungs=["review-and-verify", "trace"])

# %% [markdown]
# ## 1. One query, all the way through

# %%
QUERY = 'count(where confidence >= 3)'
REQUEST = fixture_authorized_request()

lexed = lex_query(QUERY)
parsed = parse_query(lexed.tokens)
validated = validate_query(parsed.ast)
decision = authorize_query(REQUEST, validated.plan)
capability = mint_read_capability(decision)
evaluation = evaluate_query(validated.plan, capability)

print(f"query: {QUERY!r}\n")
print(f"{'stage':>12}  {'outcome':>22}  {'stage label':>20}")
pipeline = [
    ("lex", lexed.outcome, lexed.stage),
    ("parse", parsed.outcome, parsed.stage),
    ("validate", validated.outcome, validated.stage),
    ("authorize", decision.outcome, decision.stage),
    ("evaluate", evaluation.outcome, evaluation.stage),
]
for name, outcome, stage in pipeline:
    print(f"{name:>12}  {outcome:>22}  {stage:>20}")

print(f"\ncapability minted: {capability is not None}")
print(f"  scope     : {capability.scope}")
print(f"  tenant    : {capability.tenant}")
print(f"  purpose   : {capability.purpose}")
print(f"  vocabulary: {capability.metric_vocabulary}")
print(f"\nresult: {evaluation.result_label}, "
       f"{evaluation.record_count} records, fuel {evaluation.consumed_fuel}")

checkpoint("the query reaches a result", evaluation.outcome == "RESULT")
checkpoint("every stage reports its own stage label",
           len({stage for _, _, stage in pipeline}) == len(pipeline),
           "five stages, five distinct labels — no stage speaks for another")

# %%
predict(
    "That query is lexically fine, syntactically fine, schema-valid, and the "
    "request is fully authorized — the decision says PERMITTED_MODEL_READ. Run it "
    "again, passing no capability. What happens?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — authorized, and still refused

# %%
without_capability = evaluate_query(validated.plan, None)

print(f"with capability   : {evaluation.outcome:>18}  "
      f"{evaluation.record_count} records")
print(f"without capability: {without_capability.outcome:>18}  "
      f"{without_capability.record_count} records")
print(f"\n  stage : {without_capability.stage}")
print(f"  reason: {without_capability.reason}")
print(f"  label : {without_capability.result_label}")
print(f"\nthe authorization decision is unchanged: {decision.outcome}")

checkpoint("the identical plan is refused without a capability",
           without_capability.outcome == "CAPABILITY_DENIED")
checkpoint("and the authorization decision still says permitted",
           decision.outcome == "PERMITTED_MODEL_READ",
           "the decision did not become false — it was never sufficient")
checkpoint("the refusal names its own stage",
           without_capability.stage == "NARROW_CAPABILITY")
checkpoint("no records leak on refusal",
           without_capability.record_count == 0
           and without_capability.value is None)

# %%
resolve(
    "That query is lexically fine, syntactically fine, schema-valid, and the "
    "request is fully authorized — the decision says PERMITTED_MODEL_READ. Run it "
    "again, passing no capability. What happens?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "That query is lexically fine, syntactically fine, schema-valid, and the "
    "request is fully authorized — the decision says PERMITTED_MODEL_READ. Run it "
    "again, passing no capability. What happens?",
    """
    `CAPABILITY_DENIED`, at stage `NARROW_CAPABILITY`. The plan is identical, the
    schema check still passes, and the authorization decision still reads
    `PERMITTED_MODEL_READ`. Nothing became false. The decision was never *by
    itself* sufficient to execute.

    That gap is the session's subject, and it is easy to miss because most systems
    do not have it. The common shape is: check permission, then — in the same
    function, on the strength of a `True` — perform the effect. Permission and
    effect are joined by control flow, and control flow is not evidence. Any later
    path that reaches the effect without passing the check gets the effect anyway,
    and finding those paths is a whole-codebase search that is never finished.

    A **capability** closes that by construction. `mint_read_capability` takes the
    decision and returns an object; `evaluate_query` requires the object. There is
    no argument you can pass that means "trust me, it was authorized" — the only
    way to hold a capability is to have been given one by a decision. The check is
    not something the caller is *supposed* to do before executing; holding the
    result of the check is what executing *requires*.

    Look at what the capability carries, because a bare token would not do this
    job. Owner, scope, tenant, purpose, policy version, and metric vocabulary. It
    is not "this caller may read" — it is "this subject may read these metrics, in
    this tenant, for this purpose, under this policy". That is the same tuple bench
    `m22-s2` found six dimensions of, now made into a *thing you can hold*, so it
    travels with the operation instead of being re-derived at every call site.
    Re-derivation is exactly where the drift happens.

    And notice the five stages together, because the composition is the real
    lesson. Lexical, syntactic, schema, authorization, capability — each with its
    own vocabulary and its own stage label. Passing one says nothing about the
    next, and they fail in a fixed order for a reason: a syntactically broken query
    should never reach an authorization decision, because there is nothing coherent
    to authorize. A system that flattens these into one `if valid and allowed:`
    cannot tell a user *which* thing was wrong, and cannot tell an auditor which
    stage let something through.

    Section 4 measures how wide that scope actually is, and the answer is a
    genuine design trade rather than a slogan: the same capability **does** admit a
    second, different query, because it authorizes a scope rather than a single
    plan. Minting one per call would be narrower and would also mean a mint on
    every request, which is a different system with different costs. What bounds it
    is that the scope is *named* — a vocabulary, a tenant, a purpose — so a read
    for another purpose needs another capability. "Narrow" here means narrowly
    described, not single-use.

    The `NO_RESULT` label on the refusal is a small thing worth copying too. The
    refusal has the same shape as a success — outcome, stage, reason, value, record
    count, label — so a caller cannot accidentally read a denial as an empty
    result set. Zero records because you were denied and zero records because
    nothing matched are different facts, and this model refuses to let them look
    the same.
    """,
)

# %% [markdown]
# ## 3. Verify — each stage refuses on its own terms

# %%
REFUSALS = {}

# Lexical: a character outside the alphabet.
bad_lex = lex_query('count(where confidence > 3)')
REFUSALS["lexical"] = {"outcome": bad_lex.outcome, "stage": bad_lex.stage,
                       "reason": bad_lex.reason}

# Syntactic: legal tokens, illegal order.
bad_parse = parse_query(lex_query('where count(confidence = 3)').tokens)
REFUSALS["syntactic"] = {"outcome": bad_parse.outcome, "stage": bad_parse.stage,
                         "reason": bad_parse.reason}

# Schema: parses cleanly, names a field the schema does not have.
bad_schema = validate_query(parse_query(
    lex_query('count(where salary >= 3)').tokens).ast)
REFUSALS["schema"] = {"outcome": bad_schema.outcome, "stage": bad_schema.stage,
                      "reason": bad_schema.reason}

# Authorization: a valid plan, a request with the wrong purpose.
wrong_purpose = dataclasses.replace(REQUEST, purpose="export-everything")
bad_auth = authorize_query(wrong_purpose, validated.plan)
REFUSALS["authorization"] = {"outcome": bad_auth.outcome, "stage": bad_auth.stage,
                             "reason": bad_auth.reason}

# Capability: authorized, but nothing minted.
REFUSALS["capability"] = {"outcome": without_capability.outcome,
                          "stage": without_capability.stage,
                          "reason": without_capability.reason}

print(f"{'refused at':>15}  {'outcome':>20}  {'stage':>20}")
for name, row in REFUSALS.items():
    print(f"{name:>15}  {row['outcome']:>20}  {row['stage']:>20}")
    print(f"{'':>15}  {row['reason']}")

outcomes = {row["outcome"] for row in REFUSALS.values()}
stages = {row["stage"] for row in REFUSALS.values()}

checkpoint("all five stages refuse", len(REFUSALS) == 5)
checkpoint("each refusal has its own outcome vocabulary",
           len(outcomes) == len(REFUSALS), f"{sorted(outcomes)}")
checkpoint("and its own stage label", len(stages) == len(REFUSALS),
           f"{sorted(stages)}")
checkpoint("no refusal is a bare False",
           all(row["reason"] for row in REFUSALS.values()),
           "every one names what was wrong")

# %% [markdown]
# ## 4. Verify — how far the capability reaches
#
# A capability is not a one-shot ticket for one plan. It names a *scope*, and the
# honest question is how wide that scope is.

# %%
other_plan = validate_query(parse_query(
    lex_query('count(where completed = 1)').tokens).ast).plan
reused = evaluate_query(other_plan, capability)

print(f"the minted capability, used with a DIFFERENT valid plan:")
print(f"  outcome: {reused.outcome}")
print(f"  reason : {reused.reason}")

print(f"\nwhat the capability is bound to:")
for field, value in (("owner_subject", capability.owner_subject),
                     ("scope", capability.scope),
                     ("tenant", capability.tenant),
                     ("purpose", capability.purpose),
                     ("policy_version", capability.policy_version),
                     ("metric_vocabulary", capability.metric_vocabulary)):
    print(f"  {field:>18}: {value}")

checkpoint("the capability admits a second plan within the same scope",
           reused.outcome == "RESULT",
           "it authorizes a SCOPE, not a single query — narrower would mean "
           "minting one per call")
checkpoint("but it is bound to a named scope, not to 'may read'",
           capability.scope and capability.metric_vocabulary,
           f"scope={capability.scope}, vocabulary={capability.metric_vocabulary}")
checkpoint("it carries the purpose it was minted for",
           capability.purpose == REQUEST.purpose,
           "so a read for a different purpose needs a different capability")
checkpoint("and the subject that owns it",
           capability.owner_subject == REQUEST.subject,
           "the holder is named in the thing itself")

# %% [markdown]
# ## 5. Review and verify — what does a permitted decision license?

# %%
CLAIMS = {
    "a": "This subject's request was permitted under this policy version.",
    "b": "This query may now be executed.",
    "c": "Any query from this subject may now be executed.",
    "d": "The caller holding this decision may read the result.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def licensed_by_the_decision(key: str) -> bool:
    """True when the authorization decision alone establishes this."""
    raise NotImplementedError("Separate the decision from the capability")


# %%
check("licensed_by_the_decision", licensed_by_the_decision,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False)])
print()
print("(b) is the one this bench measured directly: the decision said permitted")
print("and evaluation was refused. (d) is the subtler one — holding a decision is")
print("not holding a capability, which is exactly the distinction that stops a")
print("decision from being passed around as a permission slip.")

# %% [markdown]
# ## 6. The capability boundary note

# %%
CAPABILITY_NOTE = """
The five stages, each with the question it answers and the vocabulary it refuses in:
Why a permitted decision did not permit execution:
What the capability carries beyond 'allowed', field by field:
How holding a capability differs from having passed a check:
Why a denial and an empty result must not look alike:
The place in my own code where permission and effect are joined by control flow:
"""
print(CAPABILITY_NOTE)

# %%
claim("REVIEW VERDICT", CAPABILITY_NOTE)

claim(
    "LOCAL REFERENCE RESULT",
    f"One query runs through five stages — {[s for _, _, s in pipeline]} — each "
    f"reporting a distinct stage label, reaching {evaluation.outcome} with "
    f"{evaluation.record_count} records. The identical validated plan, with the "
    f"authorization decision still reading {decision.outcome}, is refused as "
    f"{without_capability.outcome} at stage {without_capability.stage} when no "
    f"capability is passed, returning no value and no records. Five induced "
    f"failures produce {len(outcomes)} distinct outcome values across "
    f"{len(stages)} distinct stages, each with a reason string. The minted "
    f"capability carries an owner subject, scope, tenant, purpose, policy version, "
    f"and metric vocabulary rather than a boolean.",
    support={"query": QUERY,
             "pipeline": [{"stage": n, "outcome": o, "label": s}
                          for n, o, s in pipeline],
             "capability": {"owner": capability.owner_subject,
                            "scope": capability.scope,
                            "tenant": capability.tenant,
                            "purpose": capability.purpose,
                            "policyVersion": capability.policy_version,
                            "vocabulary": list(capability.metric_vocabulary)},
             "withoutCapability": {"outcome": without_capability.outcome,
                                   "stage": without_capability.stage,
                                   "reason": without_capability.reason,
                                   "recordCount": without_capability.record_count},
             "refusals": REFUSALS},
)

non_claim(
    "This is a declared query language over a fixed local schema with a fixed "
    "policy that permits exactly one aggregate read; nothing is authenticated for "
    "real and no data store is contacted. It establishes that this model separates "
    "an authorization decision from an execution capability, and that five stages "
    "refuse independently. It does not establish that the capability is "
    "unforgeable in any adversarial sense, models no delegation, expiry, or "
    "revocation, and says nothing about how to retrofit this structure onto a "
    "system whose permission checks are already joined to its effects — which is "
    "the hard part in practice."
)

emit()

# %% [markdown]
# ## 7. Transfer
#
# 1. A permitted decision did not permit execution. Write the rule this implies
#    about returning booleans from permission checks.
# 2. Five stages refused in five vocabularies. Name what a single `if valid and
#    allowed:` costs a user, and what it costs an auditor.
# 3. Bench `m22-s2` found authorization depending on six dimensions. State what a
#    capability adds to that finding.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module23_reference.py` — `lex_query`, `parse_query`,
# `validate_query`, `authorize_query`, `mint_read_capability`, `evaluate_query`,
# `fixture_authorized_request`. Not reimplemented. The five induced failures and
# the licensing audit are this bench's own.
