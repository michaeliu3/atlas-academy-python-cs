"""Shared fixture for the m12 bench pack.

Bench 1 needs a **real** import cycle, so it writes real modules to a temporary
directory and imports them through the real machinery. A simulated `sys.modules`
would beg the question the session asks: what actually happens when Python
imports these files.

Benches 4 and 6 import and probe `public/downloads/module12_reference.py`.
"""

from __future__ import annotations

import shutil
import sys
import tempfile
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        _BENCHES_ROOT = _candidate
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")

sys.path.insert(0, str(_BENCHES_ROOT.parent / "public" / "downloads"))


# Four arrangements of the same two responsibilities. Only the import lines
# differ; the behaviour each module provides is identical throughout.

ARRANGEMENTS: dict[str, dict[str, str]] = {
    "cycle": {
        "atlas_registry.py": (
            "from atlas_importer import load\n"
            "\n"
            "REGISTRY = []\n"
            "\n"
            "def register(name):\n"
            "    REGISTRY.append(name)\n"
            "    return load(name)\n"
        ),
        "atlas_importer.py": (
            "from atlas_registry import REGISTRY\n"
            "\n"
            "def load(name):\n"
            "    return f'loaded {name} with {len(REGISTRY)} registered'\n"
        ),
    },
    # The same cycle, changing only HOW atlas_importer names its dependency.
    "module form": {
        "atlas_registry.py": (
            "from atlas_importer import load\n"
            "\n"
            "REGISTRY = []\n"
            "\n"
            "def register(name):\n"
            "    REGISTRY.append(name)\n"
            "    return load(name)\n"
        ),
        "atlas_importer.py": (
            "import atlas_registry\n"
            "\n"
            "def load(name):\n"
            "    return f'loaded {name} with {len(atlas_registry.REGISTRY)} registered'\n"
        ),
    },
    "reordered": {
        "atlas_registry.py": (
            "REGISTRY = []\n"
            "\n"
            "from atlas_importer import load\n"
            "\n"
            "def register(name):\n"
            "    REGISTRY.append(name)\n"
            "    return load(name)\n"
        ),
        "atlas_importer.py": (
            "from atlas_registry import REGISTRY\n"
            "\n"
            "def load(name):\n"
            "    return f'loaded {name} with {len(REGISTRY)} registered'\n"
        ),
    },
    "local import": {
        "atlas_registry.py": (
            "REGISTRY = []\n"
            "\n"
            "def register(name):\n"
            "    from atlas_importer import load\n"
            "    REGISTRY.append(name)\n"
            "    return load(name)\n"
        ),
        "atlas_importer.py": (
            "def load(name):\n"
            "    from atlas_registry import REGISTRY\n"
            "    return f'loaded {name} with {len(REGISTRY)} registered'\n"
        ),
    },
    "composition root": {
        "atlas_registry.py": (
            "REGISTRY = []\n"
            "\n"
            "def register(name, load):\n"
            "    REGISTRY.append(name)\n"
            "    return load(name, len(REGISTRY))\n"
        ),
        "atlas_importer.py": (
            "def load(name, registered):\n"
            "    return f'loaded {name} with {registered} registered'\n"
        ),
        "atlas_bootstrap.py": (
            "import atlas_importer\n"
            "import atlas_registry\n"
            "\n"
            "def register(name):\n"
            "    return atlas_registry.register(name, atlas_importer.load)\n"
        ),
    },
}

# The import edges each arrangement declares at module level, for the graph
# analysis in bench 1. A local import is deliberately NOT an edge here: it is
# not a module-level edge, which is exactly the distinction under examination.
MODULE_LEVEL_EDGES: dict[str, tuple[tuple[str, str], ...]] = {
    "cycle": (("atlas_registry", "atlas_importer"), ("atlas_importer", "atlas_registry")),
    "module form": (("atlas_registry", "atlas_importer"),
                    ("atlas_importer", "atlas_registry")),
    "reordered": (("atlas_registry", "atlas_importer"), ("atlas_importer", "atlas_registry")),
    "local import": (),
    "composition root": (("atlas_bootstrap", "atlas_importer"),
                         ("atlas_bootstrap", "atlas_registry")),
}


class Arrangement:
    """Write one arrangement to a fresh directory and import it cleanly."""

    def __init__(self, name: str) -> None:
        self.name = name
        self.files = ARRANGEMENTS[name]
        self._directory: str | None = None

    def __enter__(self) -> "Arrangement":
        self._directory = tempfile.mkdtemp(prefix="m12-")
        for filename, source in self.files.items():
            (Path(self._directory) / filename).write_text(source, encoding="utf-8")
        sys.path.insert(0, self._directory)
        self._evict()
        return self

    def __exit__(self, *_) -> None:
        self._evict()
        if self._directory in sys.path:
            sys.path.remove(self._directory)
        shutil.rmtree(self._directory, ignore_errors=True)
        self._directory = None

    @staticmethod
    def _evict() -> None:
        for name in [n for n in sys.modules if n.startswith("atlas_")
                     and n not in {"atlas_bench"}]:
            del sys.modules[name]

    def import_module(self, name: str) -> tuple[str, object]:
        """Import one module; return ('ok', module) or (error class, message)."""
        self._evict()
        try:
            return "ok", __import__(name)
        except Exception as error:  # noqa: BLE001
            return type(error).__name__, str(error)


def has_cycle(edges: tuple[tuple[str, str], ...]) -> bool:
    """True when the declared module-level import edges contain a cycle."""
    graph: dict[str, set[str]] = {}
    for source, target in edges:
        graph.setdefault(source, set()).add(target)
        graph.setdefault(target, set())

    visiting: set[str] = set()
    done: set[str] = set()

    def walk(node: str) -> bool:
        if node in visiting:
            return True
        if node in done:
            return False
        visiting.add(node)
        found = any(walk(neighbour) for neighbour in graph[node])
        visiting.discard(node)
        done.add(node)
        return found

    return any(walk(node) for node in graph)
