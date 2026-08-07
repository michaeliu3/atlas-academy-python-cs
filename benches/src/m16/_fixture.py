"""Shared fixture for the m16 bench pack.

Module 16 has no checked-in reference model, so the benches carry their own
schema. It is the workbook's own domain — study *concepts*, and *events* that
reference them — reduced to the smallest shape that still has a foreign key, a
one-to-many relationship, a domain constraint, and an ordering column.

Everything runs against stdlib ``sqlite3`` in memory. No file is written, no
server is contacted, and no bench in this pack claims anything about a database
engine other than the one it opened.
"""

from __future__ import annotations

import sqlite3
import sys
from pathlib import Path

_start = Path.cwd()
for _candidate in (_start, *list(_start.parents)[:4]):
    if (_candidate / "atlas_bench").is_dir():
        sys.path.insert(0, str(_candidate))
        break
else:  # pragma: no cover
    raise RuntimeError(f"atlas_bench not found from {_start}")


SCHEMA = """
CREATE TABLE concept (
    concept_id   TEXT PRIMARY KEY,
    title        TEXT NOT NULL
);

CREATE TABLE event (
    event_id     TEXT PRIMARY KEY,
    concept_id   TEXT NOT NULL REFERENCES concept(concept_id),
    position     INTEGER NOT NULL,
    confidence   REAL,
    CHECK (confidence IS NULL OR (confidence >= 0.0 AND confidence <= 1.0)),
    UNIQUE (concept_id, position)
);
"""

CONCEPTS = [
    ("c-invariant", "Representation invariants"),
    ("c-locality", "Memory locality"),
    ("c-orphan", "Referential integrity"),
]

# Deliberately uneven: c-invariant has three events, c-locality one, and
# c-orphan none. The empty concept is what makes inner and left joins differ.
EVENTS = [
    ("e-1", "c-invariant", 1, 0.4),
    ("e-2", "c-invariant", 2, 0.7),
    ("e-3", "c-invariant", 3, None),
    ("e-4", "c-locality", 1, 0.9),
]


def connect(*, foreign_keys: bool = False) -> sqlite3.Connection:
    """An in-memory database with the schema applied and rows loaded.

    ``foreign_keys`` defaults to **off**, which is SQLite's own default and the
    thing Session 2 asks you to predict. Passing ``True`` issues the pragma
    outside any transaction, which is the only place it takes effect.
    """

    connection = sqlite3.connect(":memory:")
    connection.isolation_level = None  # explicit transaction control
    if foreign_keys:
        connection.execute("PRAGMA foreign_keys = ON")
    connection.executescript(SCHEMA)
    connection.executemany("INSERT INTO concept VALUES (?, ?)", CONCEPTS)
    connection.executemany("INSERT INTO event VALUES (?, ?, ?, ?)", EVENTS)
    return connection


def foreign_keys_enabled(connection: sqlite3.Connection) -> bool:
    return bool(connection.execute("PRAGMA foreign_keys").fetchone()[0])


def open_shared(path, *, timeout: float = 0.2) -> sqlite3.Connection:
    """One connection onto a database file, for benches that need two of them.

    A ``:memory:`` database is private to its connection, so the transaction
    benches use a real file in a temporary directory — otherwise "what does
    another connection see?" has no meaning. The short ``timeout`` makes lock
    contention surface as an error instead of a stall.
    """

    connection = sqlite3.connect(str(path), timeout=timeout)
    connection.isolation_level = None  # explicit transaction control
    return connection


def initialise(connection: sqlite3.Connection, *, with_events: bool = False) -> None:
    connection.executescript(SCHEMA)
    connection.executemany("INSERT INTO concept VALUES (?, ?)", CONCEPTS)
    if with_events:
        connection.executemany("INSERT INTO event VALUES (?, ?, ?, ?)", EVENTS)
