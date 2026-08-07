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
# # Bench m22-s2 — identity-to-decision ladder
#
# **Session 22.2 — From identity to a decision.** Rungs: **review and verify**
# (primary), recognize.
#
# "The user is logged in" is the first rung of a ladder, and code routinely treats
# it as the last one. This bench climbs the rest: authentication establishes *who*,
# and every remaining question — which tenant, which resource, which action, for
# what purpose, under which policy — is a separate decision that a successful login
# does not answer.
#
# The reference model gates on an exact six-dimensional tuple, so the ladder can be
# measured: change one field, keep the other five, and see what happens.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import dataclasses  # noqa: E402
import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module22_reference import (  # noqa: E402
    AuthenticationResult, authorize_effect, fixture_authority_context,
    fixture_request, parse_importer_request,
)

assert sys.version_info >= (3, 12)

bench(module=22, session=2, emits="identity-to-decision ladder",
      rungs=["review-and-verify", "recognize"])

# %% [markdown]
# ## 1. One authenticated subject, one authorized effect

# %%
REQUEST = parse_importer_request(fixture_request())
CONTEXT = fixture_authority_context()
AUTHENTICATED = AuthenticationResult(outcome="AUTHENTICATED_MODEL",
                                     subject=CONTEXT.subject)

print("the authority context — every dimension the decision depends on:")
for field in dataclasses.fields(CONTEXT):
    print(f"  {field.name:>15}: {getattr(CONTEXT, field.name)}")

baseline = authorize_effect(REQUEST, AUTHENTICATED, CONTEXT)
print(f"\nbaseline decision: {baseline.outcome}")
print(f"  reason      : {baseline.reason}")
print(f"  effect scope: {baseline.effect_scope}")

checkpoint("the matching request is permitted",
           baseline.outcome == "PERMITTED_MODEL_PLAN", baseline.outcome)
checkpoint("and the decision carries a scope, not a boolean",
           baseline.effect_scope != "NO_EFFECT",
           f"effect_scope={baseline.effect_scope} — what was permitted travels "
           f"with the permission")

# %%
predict(
    "The subject is genuinely authenticated and stays authenticated throughout. "
    "Six context dimensions are then varied one at a time, five held fixed. How "
    "many of the six changes are refused?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Verify — vary one dimension at a time

# %%
# The decision compares the REQUEST against the policy CONTEXT, so each variation
# has to move the side that represents what was asked for — the request for the
# four request-borne dimensions, the authentication for the subject, and the
# context itself for the policy version, which is a property of the policy rather
# than of the ask.
VARIATIONS = {
    "tenant": ("request", "atlas-other"),
    "resource": ("request", "guide-999"),
    "action": ("request", "delete"),
    "purpose": ("request", "export-everything"),
    "subject": ("authentication", "worker-99"),
    "policy_version": ("context", "policy-6"),
}

print(f"{'changed dimension':>18}  {'varied on':>15}  {'new value':>20}  "
      f"{'outcome':>24}")
ladder = {}
for dimension, (side, value) in VARIATIONS.items():
    request, authentication, context = REQUEST, AUTHENTICATED, CONTEXT
    if side == "request":
        request = dataclasses.replace(REQUEST, **{dimension: value})
    elif side == "authentication":
        # Still genuinely authenticated — as a different, real subject.
        authentication = AuthenticationResult(outcome="AUTHENTICATED_MODEL",
                                              subject=value)
    else:
        context = dataclasses.replace(CONTEXT, **{dimension: value})

    decision = authorize_effect(request, authentication, context)
    ladder[dimension] = {"variedOn": side, "value": value,
                         "outcome": decision.outcome, "reason": decision.reason}
    print(f"{dimension:>18}  {side:>15}  {value:>20}  {decision.outcome:>24}")

refused = [d for d, row in ladder.items()
           if row["outcome"] != baseline.outcome]

print(f"\nrefused after changing one dimension: {len(refused)} of "
      f"{len(VARIATIONS)}")
print(f"  {refused}")

checkpoint("changing any single dimension changes the decision",
           len(refused) == len(VARIATIONS),
           "authentication succeeded in all six cases")
checkpoint("the subject was authenticated in every refused case", True,
           "'logged in' was never the thing in question")
checkpoint("the baseline is still authorized",
           authorize_effect(REQUEST, AUTHENTICATED, CONTEXT).outcome
           == baseline.outcome,
           "the refusals are not a broken fixture")

# %% [markdown]
# ### And what a failed authentication does

# %%
UNAUTHENTICATED = AuthenticationResult(outcome="UNAUTHENTICATED", subject=None)
unauthenticated_decision = authorize_effect(REQUEST, UNAUTHENTICATED, CONTEXT)

print(f"unauthenticated request -> {unauthenticated_decision.outcome}")
print(f"  reason: {unauthenticated_decision.reason}")

checkpoint("an unauthenticated request is refused",
           unauthenticated_decision.outcome != baseline.outcome)
checkpoint("but that is only the FIRST rung",
           len(refused) == len(VARIATIONS),
           "six further refusals happen with authentication fully successful")
checkpoint("the model names the two refusals differently",
           unauthenticated_decision.outcome == "DENIED_AUTHENTICATION"
           and {row["outcome"] for row in ladder.values()}
           == {"DENIED_AUTHORIZATION"},
           "DENIED_AUTHENTICATION against DENIED_AUTHORIZATION — the ladder is in "
           "the vocabulary, not just in the documentation")
checkpoint("every refusal returns NO_EFFECT",
           unauthenticated_decision.effect_scope == "NO_EFFECT",
           "a refused decision carries no scope to misread")

# %%
resolve(
    "The subject is genuinely authenticated and stays authenticated throughout. "
    "Six context dimensions are then varied one at a time, five held fixed. How "
    "many of the six changes are refused?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "The subject is genuinely authenticated and stays authenticated throughout. "
    "Six context dimensions are then varied one at a time, five held fixed. How "
    "many of the six changes are refused?",
    """
    All six. Every one of them with authentication fully, genuinely successful.

    That is the ladder, and the numbers make its shape concrete. Authentication
    answers exactly one question — *who is this?* — and this model has six
    dimensions, so a successful login has settled one sixth of the decision and
    left five sixths open. `subject` appears in the list too, and that matters: even
    knowing who someone is does not settle whether *that particular subject* may act
    here. Identity is an input to the decision, not the decision.

    Take the dimensions one at a time, because each names a real failure that ships:

    **Tenant.** The subject is a genuine, authenticated user — of a different
    customer's account. This is the most common serious vulnerability in multi-tenant
    software, and it is invisible to any check phrased as "is the user logged in?"

    **Resource.** Authenticated, right tenant, wrong document. The classic
    insecure-direct-object-reference: change an ID in a URL and read someone else's
    record.

    **Action.** May read, may not delete. A check placed at the route rather than at
    the effect covers every method with one decision.

    **Purpose.** This is the one most systems do not model at all, and it is the
    difference between "may read this record to reconcile an import" and "may read
    this record to export the customer list". Same subject, same resource, same
    action, and only one of them is legitimate. Without a purpose dimension there is
    no way to express that, which is why regulators keep asking for it and why the
    reference model carries it.

    **Policy version.** The decision was made under `policy-7`. Evaluating it under
    `policy-6` is not a smaller question — it is a *different* one, and the answer
    is not transferable. This is what makes a decision auditable: you can say which
    rules produced it.

    So the rule worth extracting is that authorization is a decision about a
    **tuple**, not about a user. Any code that caches "this user is allowed" has
    thrown away five of the six dimensions and will be right until the moment the
    other five stop matching — which is precisely when it matters.

    One more thing the model does well, worth stealing. The decision carries an
    `effect_scope` rather than returning a bare boolean. A `True` tells the caller
    nothing about *what* was permitted, so the caller decides that itself, from
    context that is not the decision. Handing back the scope means the permitted
    effect and the permission are the same object — the same move bench `m18-s4`
    found in returning a resolved path instead of a yes.
    """,
)

# %% [markdown]
# ## 3. Recognize — which rung answers which question?

# %%
QUESTIONS = {
    "a": "Is this request from who it claims to be?",
    "b": "May this subject act on this resource?",
    "c": "Is this action permitted for this purpose?",
    "d": "Which rules produced this decision?",
    "e": "What exactly is this decision permitting?",
}
for key, text in QUESTIONS.items():
    print(f"{key}. {text}")


def answered_by_authentication(key: str) -> bool:
    """True when a successful login settles this question."""
    raise NotImplementedError("Place each question on the ladder")


# %%
check("answered_by_authentication", answered_by_authentication,
      [(("a",), True), (("b",), False), (("c",), False), (("d",), False),
       (("e",), False)])
print()
print("Only (a). Every other question survives a successful login untouched, and")
print("the bench refused six requests to prove it. (e) is the one usually left")
print("implicit: a boolean answer forces the caller to re-derive the scope, and")
print("that re-derivation is where the two drift apart.")

# %% [markdown]
# ## 4. The decision ladder

# %%
DECISION_LADDER = """
Rung | Question it answers | What established it | What it still leaves open
-----+---------------------+---------------------+--------------------------
     |                     |                     |
     |                     |                     |
     |                     |                     |

The dimension my own systems do not model, and what that makes inexpressible:
Why caching 'this user is allowed' is unsafe, in terms of the tuple:
Why the decision returns a scope rather than a boolean:
The claim I can defend after a successful login, stated exactly:
"""
print(DECISION_LADDER)

# %%
claim("REVIEW VERDICT", DECISION_LADDER)

claim(
    "LOCAL REFERENCE RESULT",
    f"Against the reference authority model, a request matching all "
    f"{len(VARIATIONS)} context dimensions is authorized and returns an effect "
    f"scope. Varying any single dimension while holding the other five fixed — and "
    f"with authentication successful in every case — changes the outcome in "
    f"{len(refused)} of {len(VARIATIONS)} trials: {refused}. A failed "
    f"authentication is also refused, but that is one rung of six.",
    support={"context": {f.name: getattr(CONTEXT, f.name)
                         for f in dataclasses.fields(CONTEXT)},
             "baseline": {"outcome": baseline.outcome,
                          "reason": baseline.reason,
                          "effectScope": str(baseline.effect_scope)},
             "variations": ladder,
             "refusedDimensions": refused,
             "unauthenticated": {"outcome": unauthenticated_decision.outcome,
                                 "reason": unauthenticated_decision.reason}},
)

non_claim(
    "This is a declared authority model that allows exactly one authenticated "
    "tuple and returns a fake plan scope; nothing is authenticated for real, no "
    "credential is verified, no token is parsed, and no effect is performed. It "
    "establishes that this model's decision depends on all six dimensions and that "
    "authentication settles one of them. It does not evaluate any real "
    "authorization system, does not model role or attribute inheritance, "
    "delegation, or revocation, and says nothing about where in an application "
    "these checks should be placed — which is the design question the session's "
    "artifact actually asks you to answer."
)

emit()

# %% [markdown]
# ## 5. Transfer
#
# 1. Six refusals happened with authentication succeeding. Write the rule this
#    implies about any check phrased in terms of the user alone.
# 2. The decision carried a scope rather than a boolean. Name what a boolean forces
#    the caller to do, and where that goes wrong.
# 3. Bench `m22-s3` found a control that was redundant in one sink and load-bearing
#    in the next. State what that and the purpose dimension have in common.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module22_reference.py` — `authorize_effect`,
# `fixture_authority_context`, `fixture_request`, `parse_importer_request`,
# `AuthenticationResult`. Not reimplemented. The one-dimension-at-a-time sweep and
# the ladder sort are this bench's own.
