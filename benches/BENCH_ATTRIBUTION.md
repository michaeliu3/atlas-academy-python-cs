# Bench Attributions

Every external source vendored into `benches/`, with license and pinned commit.

Policy: adopt at the **exercise** level, never the repo level. We take problem
framings and test cases; we write our own narrative so the vocabulary matches the
course. Sources with no license, or with a `NoDerivatives` clause, are **linked
only** and never adapted.

Read the actual LICENSE file, every time. Four of the best-known resources in
this space ship without one, which under default copyright means all rights
reserved — a permissive reputation is not a licence.

---

## Vendored

### donnemartin/interactive-coding-challenges

- **License:** Apache License 2.0, © 2015 Donne Martin
- **Source:** https://github.com/donnemartin/interactive-coding-challenges
- **Pinned:** `358f2cc60426d5c4c3d7d580910eec9a7b393fa9` (2020-08-05)

| Lab | Section | Upstream path | Taken |
|---|---|---|---|
| Lab 9 | §2 | `graphs_trees/bst_validate` | problem framing, constraint Q&A, valid/invalid test trees |
| Lab 9 | §4 | `graphs_trees/min_heap` | problem framing, sift-up/sift-down structure |
| Lab 9 | §5 | `graphs_trees/trie` | problem framing, prefix-query test cases |

Not taken: narrative, solution code, unit-test framework, Anki decks.

The one general pattern adopted from this repo is its **constraints-first
ordering** — clarifying questions answered before any code is written. That is
the same discipline as workbook §5.2 in Module 9 and it transfers well.

---

## Linked only — do not vendor

Reference these from a module's further-study section. Adapting them would be a
license violation.

| Resource | Restriction |
|---|---|
| [fastai/numerical-linear-algebra](https://github.com/fastai/numerical-linear-algebra) | No LICENSE file → all rights reserved |
| [AllenDowney/ThinkPython](https://github.com/AllenDowney/ThinkPython) | No LICENSE file |
| [AllenDowney/ThinkComplexity2](https://github.com/AllenDowney/ThinkComplexity2) | No LICENSE file |
| [QuantEcon lecture-python-programming](https://github.com/QuantEcon/lecture-python-programming.myst) | No LICENSE file |
| [data-8/textbook](https://github.com/data-8/textbook) | CC-BY-NC-**ND** — no derivatives |
| [mml-book](https://github.com/mml-book/mml-book.github.io) | Cambridge University Press © |
| jakevdp *prose* | CC-BY-NC-ND (the **code** is MIT and may be vendored) |

---

## Cleared for future phases

Verified permissive; not yet vendored.

| Resource | License | Planned for |
|---|---|---|
| [AllenDowney/ThinkStats](https://github.com/AllenDowney/ThinkStats) | MIT | Lab 30 |
| [AllenDowney/ThinkBayes2](https://github.com/AllenDowney/ThinkBayes2) | MIT | Lab 30 |
| [rougier/numpy-100](https://github.com/rougier/numpy-100) | MIT | Lab 28 |
| [norvig/pytudes](https://github.com/norvig/pytudes) | MIT | Labs 2, 11, 27 |
| [uds-se/debuggingbook](https://github.com/uds-se/debuggingbook) | MIT (code only) | Lab 13 |
| [uds-se/fuzzingbook](https://github.com/uds-se/fuzzingbook) | MIT (code only) | Lab 22 |
| [fluentpython/lispy](https://github.com/fluentpython/lispy) | MIT | Lab 23 |
| [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks) | MIT | Lab 25 |
| [jakevdp/PythonDataScienceHandbook](https://github.com/jakevdp/PythonDataScienceHandbook) | MIT (code only) | Lab 24 |

For the dual-licensed entries, **only the code is permissive**. Write the prose.

---

## Adding a source

1. Read the actual LICENSE file. A permissive reputation is not a license, and
   four of the best-known resources in this space ship without one.
2. Record license, URL, and the commit SHA you pinned.
3. Add a row above and a provenance comment at the vendored code.
4. Add an `## Attributions` cell at the end of the lab.
