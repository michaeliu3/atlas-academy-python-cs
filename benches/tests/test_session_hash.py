"""Regression tests for `atlas_bench._session_sha256`.

Two bugs live here, and both were silent — they produced wrong answers rather
than errors, which is why they need tests rather than care.

**The heading form.** Session headings appear as `## Session 1 — …` in some
modules and `## 2. Session 1 — …` in others. A regex matching only the bare form
returns None for every module in the numbered group (M19–M30), so their benches
record no session hash at all and the sync validator reports a missing heading
instead of a bug in the pattern.

**The workbook path.** This function used to glob `content/modules/` regardless
of what the teaching-pack manifest declared. For authoring-only modules that
directory holds a *regenerated mirror*, while `check-bench-workbook-sync.mjs`
reads the canonical file under `content/authoring/`. The two agreed, so nothing
failed — until the mirror went stale, at which point Python and Node hashed two
different documents and every M31–M36 bench failed CI with a mismatch that named
neither file as the cause.

The cross-language checks below are the load-bearing ones: Python writes the
digest into each bench record and Node verifies it, so agreement between the two
implementations is the actual contract. Testing either alone would have caught
neither bug.
"""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import pytest

TESTS_DIR = Path(__file__).resolve().parent
BENCHES_DIR = TESTS_DIR.parent
SITE_DIR = BENCHES_DIR.parent

sys.path.insert(0, str(BENCHES_DIR))

from atlas_bench import _declared_workbook, _session_sha256  # noqa: E402

HEX64 = re.compile(r"^[0-9a-f]{64}$")

# Chosen to span both axes that have broken: heading form (bare vs numbered) and
# workbook location (content/modules vs content/authoring).
SAMPLES = [
    ("m05", 1, "bare heading, canonical under content/modules"),
    ("m09", 3, "bare heading, canonical under content/modules"),
    ("m19", 1, "numbered heading — the form that returned None"),
    ("m24", 2, "numbered heading, canonical under content/modules"),
    ("m31", 1, "bare heading, canonical under content/authoring"),
    ("m31", 6, "bare heading, canonical under content/authoring"),
    ("m36", 4, "bare heading, canonical under content/authoring"),
]


@pytest.fixture(autouse=True)
def _run_from_site_root(monkeypatch):
    """`_session_sha256` resolves relative to the process working directory."""
    monkeypatch.chdir(SITE_DIR)


@pytest.mark.parametrize(("module_id", "session", "why"), SAMPLES)
def test_session_hash_is_present_and_well_formed(module_id, session, why):
    digest = _session_sha256(module_id, session)
    assert digest is not None, f"{module_id} session {session} hashed to None ({why})"
    assert HEX64.match(digest), f"{module_id} session {session}: {digest!r}"


def test_numbered_heading_modules_all_hash():
    """M19–M30 use the numbered form; none of them may return None."""
    missing = [
        f"m{n:02d}"
        for n in range(19, 31)
        if _session_sha256(f"m{n:02d}", 1) is None
    ]
    assert not missing, f"numbered-heading modules returned None: {missing}"


def test_declared_path_is_preferred_over_the_mirror():
    """Authoring-only modules must hash the canonical file, not the mirror.

    If this regresses, digests keep matching for exactly as long as the mirror
    stays current — so the assertion is on the resolved *path*, not the digest.
    A digest comparison here would pass while the bug was present.
    """
    for number in ("31", "32", "33", "34", "35", "36"):
        resolved = _declared_workbook(SITE_DIR, number)
        assert resolved is not None, f"m{number}: nothing declared"
        assert "authoring" in resolved.as_posix(), (
            f"m{number} resolved to {resolved.as_posix()}, expected the canonical "
            "workbook under content/authoring/"
        )


def test_session_hash_actually_reads_the_declared_file(monkeypatch):
    """Pin the call site, not just the resolver.

    The test above proves `_declared_workbook` resolves correctly; it does not
    prove `_session_sha256` calls it. Those are different failures, and the
    difference is invisible to any digest comparison against the real corpus —
    while the mirror agrees with the canonical file, reading the wrong one
    produces the right answer. This was not hypothetical: deliberately making
    `_session_sha256` ignore the declared path left the whole suite green.

    So point the resolver at a sentinel workbook that exists nowhere else. If the
    function reads anything but that file, the digest cannot match.
    """
    body = "## Session 1 — sentinel\n\nunique sentinel body\n\n## Session 2 — other\n"
    slice_text = body[: body.index("## Session 2")]
    expected = hashlib.sha256(slice_text.encode("utf8")).hexdigest()

    import atlas_bench

    # `tmp_path` is avoided deliberately: pytest's shared temp root keeps a
    # `pytest-current` symlink, and creating it raises PermissionError on Windows
    # without developer mode. This test does not need the fixture's bookkeeping.
    with tempfile.TemporaryDirectory() as directory:
        sentinel = Path(directory) / "sentinel_workbook.md"
        sentinel.write_text(body, encoding="utf8", newline="")
        monkeypatch.setattr(
            atlas_bench, "_declared_workbook", lambda root, number: sentinel
        )
        assert _session_sha256("m31", 1) == expected, (
            "_session_sha256 did not hash the declared workbook — it is reading "
            "content/modules/ regardless of what the manifest declares."
        )


def _node_digest(module_number: int, session: int) -> str | None:
    node = shutil.which("node")
    if node is None:  # pragma: no cover - environment without node
        pytest.skip("node is not on PATH; cross-language check cannot run")
    result = subprocess.run(
        [node, "scripts/bench-session-hash.mjs", str(module_number), str(session)],
        cwd=SITE_DIR,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        pytest.fail(f"bench-session-hash.mjs failed:\n{result.stderr}")
    match = re.search(rf"^session {session}\s+([0-9a-f]{{64}})$", result.stdout, re.M)
    return match.group(1) if match else None


@pytest.mark.parametrize(("module_id", "session", "why"), SAMPLES)
def test_python_and_node_agree(module_id, session, why):
    """The contract: Python writes this digest, Node verifies it."""
    node_digest = _node_digest(int(module_id[1:]), session)
    assert node_digest is not None, f"node printed no digest for {module_id} s{session}"
    assert _session_sha256(module_id, session) == node_digest, (
        f"{module_id} session {session} ({why}): Python and Node disagree. "
        "They are hashing different bytes — check the resolved workbook path and "
        "CRLF normalisation before touching the regex."
    )


def test_every_registered_bench_has_a_resolvable_session_hash():
    """No registered bench may silently record a null session hash."""
    registry = SITE_DIR / "lib" / "module-bench-registry.mjs"
    source = registry.read_text(encoding="utf8")

    # The registry is an ES module, so it is read as text rather than imported.
    pack_ids = sorted({m.group(1) for m in re.finditer(r'benchPackId:\s*"(m\d+)"', source)})

    # Without this the test passes vacuously when the pattern goes stale, which
    # is how it first "succeeded" against an empty list.
    assert len(pack_ids) >= 30, f"registry pattern looks stale — found {pack_ids}"

    failures = []
    for pack_id in pack_ids:
        if _session_sha256(pack_id, 1) is None and _session_sha256(pack_id, 2) is None:
            failures.append(pack_id)
    assert not failures, f"packs whose workbook sessions do not hash: {failures}"
