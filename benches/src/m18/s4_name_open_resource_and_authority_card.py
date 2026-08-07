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
# # Bench m18-s4 — name, open-resource, and authority card
#
# **Session 18.4 — Names, open resources, and authority.** Rungs: **debug and
# defend** (primary), review and verify.
#
# A name is a *request* for a resource. The authority to reach that resource is a
# separate thing, decided by whoever resolves the name — and the gap between the
# two is where an entire class of vulnerability lives.
#
# This bench takes fourteen candidate names and runs two checks over each: the
# string comparison people write, and the reference model's resolver. They
# disagree, and one of the disagreements discards the workspace entirely without
# any `..` appearing in the name.
#
# No privilege is needed — this is a decision over strings and a real temporary
# directory this process owns.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import os  # noqa: E402
import shutil  # noqa: E402
import sys  # noqa: E402
import tempfile  # noqa: E402
from pathlib import Path  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module18_reference import (  # noqa: E402
    initialize_disposable_workspace, safe_workspace_path,
)

assert sys.version_info >= (3, 12)

bench(module=18, session=4, emits="name, open-resource, and authority card",
      rungs=["debug-and-defend", "review-and-verify"])

WORKSPACE = Path(tempfile.mkdtemp(prefix="m18-s4-"))
initialize_disposable_workspace(WORKSPACE)

# %% [markdown]
# ## 1. The names a caller might send

# %%
NAMES = [
    "result.json",
    "sub/ok.json",
    "../escape.json",
    "a/../../out.json",
    "..",
    ".",
    "",
    "/etc/passwd",
    "/abs.json",
    "sub/../ok.json",
    "./result.json",
    "sub//ok.json",
    "....//escape.json",
    "result.json/../../out.json",
]

print(f"workspace: {WORKSPACE}")
print(f"{len(NAMES)} candidate names, all of them things a caller can actually send")

# %%
predict(
    "A guard joins each name onto the workspace and checks that the result starts "
    "with the workspace path. Which names does that let through that it should "
    "not — and does any of them lack a `..` entirely?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Debug — the string guard against the resolver

# %%
def naive_guard(workspace: Path, name: str) -> dict:
    """Join, then check the prefix. The check people actually write."""
    joined = os.path.join(str(workspace), name)
    return {"admits": joined.startswith(str(workspace)), "joined": joined}


def resolver(workspace: Path, name: str) -> dict:
    try:
        resolved = safe_workspace_path(workspace, name)
    except Exception as error:  # noqa: BLE001
        return {"admits": False, "reason": type(error).__name__}
    return {"admits": True, "resolved": str(resolved)}


print(f"{'name':>28}  {'naive':>6}  {'resolver':>8}  where the naive join lands")
rows = {}
for name in NAMES:
    naive = naive_guard(WORKSPACE, name)
    strict = resolver(WORKSPACE, name)
    rows[name] = {"naive": naive["admits"], "resolver": strict["admits"]}
    landing = ""
    if naive["admits"] != strict["admits"]:
        landing = str(Path(naive["joined"]).resolve())
        if not str(Path(naive["joined"]).resolve()).startswith(str(WORKSPACE)):
            landing += "   <-- OUTSIDE"
    print(f"{name!r:>28}  {str(naive['admits']):>6}  "
          f"{str(strict['admits']):>8}  {landing}")

disagreements = [name for name, row in rows.items()
                 if row["naive"] != row["resolver"]]
naive_admits_escape = [
    name for name in disagreements
    if rows[name]["naive"]
    and not str(Path(os.path.join(str(WORKSPACE), name)).resolve()).startswith(
        str(WORKSPACE))
]

print(f"\nthe two guards disagree on {len(disagreements)} name(s): {disagreements}")
print(f"names the naive guard admits that resolve OUTSIDE the workspace: "
      f"{naive_admits_escape}")

checkpoint("the two guards disagree", len(disagreements) > 0)
checkpoint("the naive guard admits at least one name that escapes",
           len(naive_admits_escape) > 0,
           f"{naive_admits_escape}")
checkpoint("the resolver admits only names that stay inside",
           all(str(Path(safe_workspace_path(WORKSPACE, name)).resolve())
               .startswith(str(WORKSPACE.resolve()))
               for name, row in rows.items() if row["resolver"]))
checkpoint("and it admits the ordinary names",
           rows["result.json"]["resolver"] and rows["sub/ok.json"]["resolver"],
           "rejecting everything would be safe and useless")

# %%
resolve(
    "A guard joins each name onto the workspace and checks that the result starts "
    "with the workspace path. Which names does that let through that it should "
    "not — and does any of them lack a `..` entirely?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "A guard joins each name onto the workspace and checks that the result starts "
    "with the workspace path. Which names does that let through that it should "
    "not — and does any of them lack a `..` entirely?",
    """
    It lets through five, and one of them is `"../escape.json"` — the most obvious
    traversal there is.

    That is worth sitting with, because the prefix check *feels* like it should
    catch that one. It does not, and the reason is that `startswith` compares
    characters. `os.path.join(workspace, "../escape.json")` produces
    `<workspace>/../escape.json`, and that string does start with `<workspace>`.
    The `..` is still sitting there, unresolved, inside a string that satisfies the
    test. Nothing in the check ever asks the filesystem where that path goes.

    So the guard does not catch the obvious cases and fail on the subtle ones. It
    fails on the obvious ones too, and it fails *silently*, returning `True`.

    Then there is `"/etc/passwd"`, which is caught — by accident.
    `os.path.join(workspace, "/etc/passwd")` does not produce a path inside the
    workspace; it produces `/etc/passwd`, because join treats a leading separator
    as "this is absolute, start over" and **discards everything to its left**. The
    workspace is not escaped from, it is never applied. The prefix check then
    happens to return `False`. Rely on that and you are relying on a coincidence
    between two unrelated behaviours; on Windows the drive letter survives the
    join, and the coincidence is thinner than it looks.

    That is the actual lesson, and it is more general than paths: **the guard must
    be applied to the resolved thing, not the requested thing.** A name is a
    request. Resolution is what turns it into a resource. Any check performed
    before resolution is checking something that no longer exists by the time the
    resource is opened.

    Three concrete ways the two diverge, all of which the resolver handles and no
    string comparison can:

    A **symlink** inside the workspace pointing outward. The name contains no
    `..`, joins cleanly, passes any prefix check, and resolves somewhere else
    entirely. Only `resolve()` sees it.

    A **prefix collision**. If the workspace is `/data/run` then
    `/data/run-evil/x` starts with `/data/run` as a string and is a different
    directory. The check needs a path-component comparison, not a character one.

    **Time of check to time of use.** Even a correct check is a statement about the
    moment it ran. If the path is replaced between the check and the open, the
    check described a resource the open did not get. This is why the strongest
    version of the pattern is not "validate then open" but "open, then verify what
    you opened" — and why the reference model hands back a resolved `Path` rather
    than a yes/no, so the caller uses the thing that was checked rather than
    re-deriving it.

    Notice what the resolver rejects beyond traversal: `""`, `"."`, and `".."`
    are refused as *not naming a member*. That is a different rule from "does not
    escape" and it is worth having separately — `"."` resolves to the workspace
    itself, which is inside it and is still not a file the caller may write.
    Passing the escape test is not the same as being a legitimate request.
    """,
)

# %% [markdown]
# ## 3. Debug — a symlink the text cannot see

# %%
symlink_result = {"created": False}
outside = WORKSPACE.parent / "outside-target.txt"
outside.write_text("data the caller must not reach", encoding="utf-8")
link = WORKSPACE / "innocent.txt"

try:
    link.symlink_to(outside)
    symlink_result["created"] = True
except (OSError, NotImplementedError) as error:
    symlink_result["reason"] = type(error).__name__

if symlink_result["created"]:
    joined = os.path.join(str(WORKSPACE), "innocent.txt")
    symlink_result["naiveAdmits"] = joined.startswith(str(WORKSPACE))
    symlink_result["resolvesTo"] = str(Path(joined).resolve())
    symlink_result["escapes"] = not symlink_result["resolvesTo"].startswith(
        str(WORKSPACE.resolve()))
    try:
        safe_workspace_path(WORKSPACE, "innocent.txt")
        symlink_result["resolverAdmits"] = True
    except Exception as error:  # noqa: BLE001
        symlink_result["resolverAdmits"] = False
        symlink_result["resolverReason"] = type(error).__name__

    print(f"name              : 'innocent.txt' — no '..', no separator, no trick")
    print(f"naive guard admits: {symlink_result['naiveAdmits']}")
    print(f"actually resolves : {symlink_result['resolvesTo']}")
    print(f"escapes workspace : {symlink_result['escapes']}")
    print(f"resolver admits   : {symlink_result['resolverAdmits']} "
          f"({symlink_result.get('resolverReason', '-')})")

    checkpoint("a name with no traversal syntax still escapes",
               symlink_result["escapes"],
               "the text is innocent; the filesystem is not")
    checkpoint("the naive guard admits it", symlink_result["naiveAdmits"])
    checkpoint("the resolver refuses it", not symlink_result["resolverAdmits"])
else:
    print(f"SKIPPED — this host does not permit symlink creation "
          f"({symlink_result.get('reason')}); Windows needs developer mode or "
          f"elevation.")
    print("No checkpoint is recorded for a probe that did not run. The claim in")
    print("section 5 states the skip, and the traversal result above stands on its")
    print("own — a bench that asserted the symlink finding without running it")
    print("would be doing exactly what this course teaches you to refuse.")

# %% [markdown]
# ## 4. Review and verify — audit four authority claims

# %%
CLAIMS = {
    "a": "The name contains no '..', so it stays in the workspace.",
    "b": "The joined path starts with the workspace, so it stays in it.",
    "c": "The resolved path is inside the workspace, so opening it is safe now.",
    "d": "The resolved path was inside the workspace, so the file I opened is "
         "inside it.",
}
for key, text in CLAIMS.items():
    print(f"{key}. {text}")


def sound(key: str) -> bool:
    """True when the claim follows from its stated evidence."""
    raise NotImplementedError("Audit each claim against what was actually checked")


# %%
check("sound", sound,
      [(("a",), False), (("b",), False), (("c",), True), (("d",), False)])
print()
print("(c) and (d) differ only in tense, and that is the whole of TOCTOU. (c) is a")
print("statement about the moment of resolution and is sound. (d) claims the")
print("resource you opened is the one you checked, which requires that nothing")
print("changed in between — something the check itself cannot establish.")

# %% [markdown]
# ## 5. The authority card

# %%
AUTHORITY_CARD = """
The name, the resource it requests, and who decides whether it may be reached:
The check I would have written, and the name that defeats it:
Why the check must run on the resolved path rather than the requested name:
The name that escaped with no traversal syntax in it, and how:
The rules beyond 'does not escape' that a legitimate name must also satisfy:
What my check establishes, phrased in the tense it is actually true in:
"""
print(AUTHORITY_CARD)

# %%
claim("DEFENDED REPAIR", AUTHORITY_CARD)

claim(
    "LOCAL REFERENCE RESULT",
    f"Across {len(NAMES)} candidate names against a real temporary workspace, a "
    f"join-then-prefix-check guard and the reference resolver disagree on "
    f"{len(disagreements)} of them. os.path.join discards the workspace entirely "
    f"for an absolute name, and the resolver additionally refuses '', '.', and "
    f"'..' as not naming a workspace member — a rule distinct from non-escape. "
    + (f"A symlink named 'innocent.txt', containing no traversal syntax, is "
       f"admitted by the naive guard, resolves outside the workspace, and is "
       f"refused by the resolver."
       if symlink_result.get("created") else
       "The symlink probe was skipped: this host does not permit symlink "
       "creation without elevation."),
    support={"workspace": str(WORKSPACE),
             "names": {name: row for name, row in rows.items()},
             "disagreements": disagreements,
             "naiveAdmitsEscape": naive_admits_escape,
             "symlinkProbe": symlink_result},
)

non_claim(
    "This checks path resolution in one process against one temporary directory it "
    "owns. It establishes that a string-prefix guard and a resolving guard "
    "disagree, and on which names. It exercises no operating-system permission "
    "check, no user or group identity, no capability or token, and no privileged "
    "operation — the workspace is writable because this process created it, not "
    "because any authority was granted. It also cannot demonstrate a "
    "time-of-check-to-time-of-use failure, which needs a concurrent writer; that "
    "claim in section 4 rests on the argument, not on evidence gathered here."
)

emit()

# %%
shutil.rmtree(WORKSPACE, ignore_errors=True)
outside.unlink(missing_ok=True)

# %% [markdown]
# ## 6. Transfer
#
# 1. The guard was applied to the requested name and the resource came from the
#    resolved one. Write that as a rule covering more than filesystem paths.
# 2. Claims (c) and (d) differed only in tense. Name what has to be true for (d),
#    and say why no amount of checking supplies it.
# 3. Bench `m22-s3` separates sinks that need different encodings for the same
#    string. State what a path resolver and an output encoder have in common.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module18_reference.py` — `safe_workspace_path` and
# `initialize_disposable_workspace`. Not reimplemented. The candidate names, the
# naive guard, and the symlink probe are this bench's own.
