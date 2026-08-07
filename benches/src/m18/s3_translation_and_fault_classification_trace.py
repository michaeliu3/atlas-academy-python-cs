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
# # Bench m18-s3 — translation and fault-classification trace
#
# **Session 18.3 — Address translation and fault classification.** Rungs: **trace**
# (primary), recognize.
#
# Most of Module 18 cannot honestly be benched: a kernel is not available in this
# process, and pretending otherwise would model the mechanism dishonestly. This
# session is the exception, and the reference model says why in its own scope
# string — translation here is **arithmetic over a declared geometry**, not an
# observation of any host.
#
# The session's real work is the *classification*. Three of the four outcomes
# below are commonly called "a page fault", and only one of them is a bug.
#
# **Requires:** Python 3.12+. Standard library only.

# %%
from _fixture import *  # noqa: F401,F403,E402  (sets up sys.path)

import sys  # noqa: E402

from atlas_bench import (  # noqa: E402
    bench, check, checkpoint, claim, emit, non_claim, predict, resolve, reveal,
)
from module18_reference import PageTableEntry, translate_virtual_address  # noqa: E402

assert sys.version_info >= (3, 12)

bench(module=18, session=3, emits="translation and fault-classification trace",
      rungs=["trace", "recognize"])

# %% [markdown]
# ## 1. The declared geometry
#
# 16-bit virtual addresses, 256-byte pages. So the low 8 bits are the offset and
# the high 8 bits are the virtual page number — the split is a property of the
# page size, not of any hardware.

# %%
PAGE_BYTES = 256

PAGE_TABLE = {
    0: PageTableEntry(frame_number=7, writable=False),
    1: PageTableEntry(frame_number=9, writable=True),
    2: PageTableEntry(frame_number=None, valid=False, present=False),
    3: PageTableEntry(frame_number=None, present=False, file_backed=True,
                      writable=True),
}

print(f"{'vpage':>6}  {'frame':>6}  {'valid':>6}  {'present':>8}  "
      f"{'writable':>9}  {'file-backed':>12}")
for page, entry in PAGE_TABLE.items():
    print(f"{page:>6}  {str(entry.frame_number):>6}  {str(entry.valid):>6}  "
          f"{str(entry.present):>8}  {str(entry.writable):>9}  "
          f"{str(entry.file_backed):>12}")

print(f"\npage size {PAGE_BYTES} bytes -> offset is the low "
      f"{PAGE_BYTES.bit_length() - 1} bits")

# %%
predict(
    "Virtual address 0x0010 is read, then written. Both go through the same page "
    "table entry. Do both succeed?",
    answer="",  # <- fill in
    confidence="",  # sure / fairly sure / guessing
)

# %% [markdown]
# ## 2. Trace — translate a spread of addresses

# %%
PROBES = [
    (0x0010, "read"),
    (0x0010, "write"),
    (0x00FF, "read"),
    (0x0100, "read"),
    (0x0120, "write"),
    (0x0230, "read"),
    (0x0345, "read"),
    (0x0900, "read"),
]

print(f"{'virtual':>9}  {'vpage':>5}  {'offset':>6}  {'access':>6}  "
      f"{'status':>17}  {'physical':>9}")
observations = {}
for address, access in PROBES:
    observation = translate_virtual_address(address, PAGE_TABLE, access=access)
    observations[(address, access)] = observation
    print(f"{address:>#9x}  {observation.virtual_page:>5}  "
          f"{observation.offset:>6}  {access:>6}  {observation.status:>17}  "
          f"{str(observation.physical_address):>9}")

read_10 = observations[(0x0010, "read")]
write_10 = observations[(0x0010, "write")]

print(f"\nsame address, two accesses: {read_10.status} against {write_10.status}")
print(f"\nmodel scope: {read_10.scope}")

statuses = {o.status for o in observations.values()}

checkpoint("the address splits arithmetically",
           read_10.virtual_page == 0x0010 // PAGE_BYTES
           and read_10.offset == 0x0010 % PAGE_BYTES,
           "page = address // page size, offset = address % page size")
checkpoint("the offset survives translation unchanged",
           read_10.physical_address % PAGE_BYTES == read_10.offset,
           "only the page number is translated; the offset is carried through")
checkpoint("the same address succeeds on read and faults on write",
           read_10.status == "MAPPED" and write_10.status == "PROTECTION_FAULT",
           "the permission is a property of the mapping, not of the address")
checkpoint("four distinct outcomes are reachable", len(statuses) == 4,
           f"{sorted(statuses)}")

# %%
resolve(
    "Virtual address 0x0010 is read, then written. Both go through the same page "
    "table entry. Do both succeed?",
    "matched",  # matched / diverged / partial
)

# %%
reveal(
    "Virtual address 0x0010 is read, then written. Both go through the same page "
    "table entry. Do both succeed?",
    """
    The read is `MAPPED`; the write is a `PROTECTION_FAULT`. Same address, same
    entry, same frame — different access.

    That is the first thing translation is *for*, and it is easy to miss while
    thinking of a page table as an address lookup. It is not a lookup. It is a
    lookup **plus a permission decision**, and the permission is attached to the
    mapping rather than to the address. Two processes can map the same frame with
    different writability. One process can map the same frame twice at different
    virtual addresses with different permissions.

    Now the part this session actually grades: three of the four outcomes get
    called "a page fault" in casual speech, and they are not the same event.

    `NOT_PRESENT` (page 3) is the **normal** one. The mapping is valid, the program
    is entitled to the memory, and the contents simply are not in a frame right
    now — swapped out, or backed by a file and never read in. The hardware traps,
    the kernel finds a frame, loads the page, and restarts the instruction. The
    program never learns it happened. This is not an error; it is the mechanism
    that makes `mmap`, demand paging, and lazy allocation work at all.

    `INVALID_MAPPING` (pages 2 and 9) is the **bug**. There is no mapping. The
    process asked for an address it was never given. Nothing can be loaded because
    nothing was ever there. This is the segmentation fault.

    `PROTECTION_FAULT` is the third, and it is genuinely ambiguous — it may be a
    bug (writing to a string literal) or a mechanism (copy-on-write after a fork,
    where the kernel silently gives you a private copy and continues). The status
    alone does not tell you which; the *policy behind the mapping* does.

    So "page fault" names a hardware trap, not a diagnosis. A performance
    investigation that counts page faults and concludes something is wrong has
    conflated the mechanism with the failure — high fault counts are exactly what a
    healthy memory-mapped workload produces. Bench `m17-s3` made the same move at
    the instruction level: a trap tells you where execution stopped, and the
    classification is a separate question.

    One thing to be careful about, because the numbers here are seductive. Page 9
    was never in the table at all, and got the same `INVALID_MAPPING` as page 2,
    which is present in the table but marked invalid. Those are different
    *situations* — one is unmapped, one is explicitly reserved — and this model
    collapses them into one status. That is a modelling choice, not a fact about
    hardware, and it is the sort of thing the scope string exists to stop you
    forgetting.
    """,
)

# %% [markdown]
# ## 3. Trace — the offset is not translated

# %%
print(f"{'virtual':>9}  {'vpage':>5}  {'offset':>6}  {'physical':>9}  "
      f"{'phys page':>9}  {'phys offset':>11}")
same_page = {}
for address in (0x0100, 0x0110, 0x01FF):
    observation = translate_virtual_address(address, PAGE_TABLE, access="read")
    same_page[address] = observation
    print(f"{address:>#9x}  {observation.virtual_page:>5}  "
          f"{observation.offset:>6}  {observation.physical_address:>9}  "
          f"{observation.physical_address // PAGE_BYTES:>9}  "
          f"{observation.physical_address % PAGE_BYTES:>11}")

frames = {o.physical_address // PAGE_BYTES for o in same_page.values()}
offsets_preserved = all(o.physical_address % PAGE_BYTES == o.offset
                        for o in same_page.values())

print(f"\nall three land in frame {frames.pop()}, "
      f"offsets preserved: {offsets_preserved}")

checkpoint("addresses within one page map to one frame",
           len({o.physical_address // PAGE_BYTES for o in same_page.values()}) == 1)
checkpoint("and their offsets are carried through untouched", offsets_preserved,
           "contiguity inside a page is preserved; contiguity across pages is not")

# %% [markdown]
# ## 4. Recognize — which outcome is a defect?

# %%
OUTCOMES = {
    "a": "NOT_PRESENT on a valid file-backed mapping.",
    "b": "INVALID_MAPPING on an address the process never received.",
    "c": "PROTECTION_FAULT on a write to a read-only mapping.",
    "d": "A high page-fault count during a memory-mapped scan.",
}
for key, text in OUTCOMES.items():
    print(f"{key}. {text}")


def indicates_a_defect(key: str) -> bool:
    """True when this outcome means something is wrong with the program."""
    raise NotImplementedError("Separate the mechanism from the failure")


# %%
check("indicates_a_defect", indicates_a_defect,
      [(("a",), False), (("b",), True), (("c",), True), (("d",), False)])
print()
print("(c) is the arguable one. A write to a read-only mapping is a defect here,")
print("but the identical status is how copy-on-write is IMPLEMENTED — the kernel")
print("traps, makes a private copy, and the program continues. The status does not")
print("carry the answer; the policy behind the mapping does.")

# %% [markdown]
# ## 5. The translation trace

# %%
TRANSLATION_TRACE = """
The declared geometry, and how the address splits under it:
One translated address, worked by hand:
What the offset does during translation, and why:
The four statuses, each with one sentence on what it means:
Which statuses are mechanism and which are defect, with the ambiguous one named:
Why a page-fault count is not by itself evidence of a problem:
What this model collapses that real hardware distinguishes:
"""
print(TRANSLATION_TRACE)

# %%
claim("COURSE MODEL", TRANSLATION_TRACE)

claim(
    "LOCAL REFERENCE RESULT",
    f"Under a declared 16-bit, {PAGE_BYTES}-byte-page model, virtual address "
    f"0x0010 translates to physical {read_10.physical_address} on read and raises "
    f"{write_10.status} on write against the same page-table entry. Across "
    f"{len(PROBES)} probes the model produces {len(statuses)} distinct statuses "
    f"({sorted(statuses)}), and three addresses within one virtual page map into a "
    f"single frame with their offsets unchanged.",
    support={"pageBytes": PAGE_BYTES,
             "pageTable": {str(page): {"frame": entry.frame_number,
                                       "valid": entry.valid,
                                       "present": entry.present,
                                       "writable": entry.writable,
                                       "fileBacked": entry.file_backed}
                           for page, entry in PAGE_TABLE.items()},
             "probes": [{"address": address, "access": access,
                         "virtualPage": o.virtual_page, "offset": o.offset,
                         "status": o.status,
                         "physicalAddress": o.physical_address}
                        for (address, access), o in observations.items()],
             "statuses": sorted(statuses),
             "scope": read_10.scope},
)

non_claim(
    "This is arithmetic over a declared page table, and the reference model's own "
    "scope string says so: it is not a host mapping, not a Python object layout, "
    "not a TLB observation, not a residency claim, and not a fault count. It has "
    "one level of page table where real hardware has four or five, no TLB, no huge "
    "pages, no address-space randomisation, and it collapses never-mapped and "
    "explicitly-invalid into a single INVALID_MAPPING status. It establishes what "
    "the classification distinguishes, not what this machine would do."
)

emit()

# %% [markdown]
# ## 6. Transfer
#
# 1. One status was a mechanism and one was a defect, and casual speech calls both
#    "a page fault". Write the rule this implies about metrics named after traps.
# 2. The same address gave two answers. Name what the page table actually stores,
#    in a phrase that makes that unsurprising.
# 3. Bench `m17-s3` found a traceback pointing at a correct instruction. State what
#    a trap and a traceback have in common as evidence.
#
# ---
#
# ## Attributions
#
# Probes `public/downloads/module18_reference.py` — `translate_virtual_address` and
# `PageTableEntry`. Not reimplemented. The page table, the probe set, and the
# mechanism/defect sort are this bench's own.
