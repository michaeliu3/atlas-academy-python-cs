# Atlas Academy Chat Launch Cards

These cards are generated from the canonical Module Teaching Pack registry. Paste the reusable role startup package from [`lib/learning-partner-prompts.ts`](../lib/learning-partner-prompts.ts) into the two designated Codex chats once, then use the module/session card below. The Teaching Assistant owns live explanation and oral defense; the Study Partner owns visible AI-paired implementation and review.

> The cards are prepared-derived instructions, not learner evidence. Ask for a prediction and confidence before a reveal, keep equations and labelled code visible with prose/ASCII fallback, label observed execution versus simulation or uncertainty, and preserve the session-scoped `records on` / `pause records` / `off-record` / `end session` boundary.

## Delivery cadence

- Recommended route: 90 days at 20–25 focused hours/week.
- Intensive first pass: 60 days at 35–45 focused hours/week.
- Durable review: 180 days with spaced retrieval.
- Each session: 40–55 minute TA lecture; two or three 60–90 minute Study Partner blocks across the module; 20–30 minute repair/oral defense; delayed retrieval.
- Extend the calendar rather than skip a proof, trace, debugging step, or transfer task.

## Cards

### M01 · Values, State, and Execution

Availability: **legacy-open** · Arc project: **Stateful Atlas event ledger** · Source map: [content/source-maps/python_curriculum_sources.md](../content/source-maps/python_curriculum_sources.md)

#### Session 1 · The mystery of the changing record

**TA — Atlas TA · M01 · Session 1 · The mystery of the changing record**

1. Opening problem: inspect a short Atlas bug where changing a current event changes a historical event.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/01_values_state_execution.md` lines 14–18 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: bindings, object identity, mutation, and frame-local state; predict an aliasing or mutation trace before seeing the result; which behavior follows from Python's data model versus a CPython implementation detail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to assignment copies an object or a function can only change its own local names; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: binding and alias map → Carry the binding and alias map into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M01 · Session 1 · The mystery of the changing record**

1. Design brief: Implement or inspect one bounded bindings, object identity, mutation, and frame-local state slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/01_values_state_execution.md` lines 14–18
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: assignment copies an object or a function can only change its own local names
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the bindings, object identity, mutation, and frame-local state mechanism and the smallest remaining uncertainty.

#### Session 2 · Evaluation, calls, and environments

**TA — Atlas TA · M01 · Session 2 · Evaluation, calls, and environments**

1. Opening problem: Start with a small bindings, object identity, mutation, and frame-local state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/01_values_state_execution.md` lines 14–18 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: bindings, object identity, mutation, and frame-local state; predict an aliasing or mutation trace before seeing the result; which behavior follows from Python's data model versus a CPython implementation detail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to assignment copies an object or a function can only change its own local names; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: environment trace and scope claim → Carry the environment trace and scope claim into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M01 · Session 2 · Evaluation, calls, and environments**

1. Design brief: Implement or inspect one bounded bindings, object identity, mutation, and frame-local state slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/01_values_state_execution.md` lines 14–18
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: assignment copies an object or a function can only change its own local names
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the bindings, object identity, mutation, and frame-local state mechanism and the smallest remaining uncertainty.

#### Session 3 · Contracts and invariants

**TA — Atlas TA · M01 · Session 3 · Contracts and invariants**

1. Opening problem: Start with a small bindings, object identity, mutation, and frame-local state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/01_values_state_execution.md` lines 14–18 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: bindings, object identity, mutation, and frame-local state; predict an aliasing or mutation trace before seeing the result; which behavior follows from Python's data model versus a CPython implementation detail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to assignment copies an object or a function can only change its own local names; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: ownership contract card → Carry the ownership contract card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M01 · Session 3 · Contracts and invariants**

1. Design brief: Implement or inspect one bounded bindings, object identity, mutation, and frame-local state slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/01_values_state_execution.md` lines 14–18
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: assignment copies an object or a function can only change its own local names
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the bindings, object identity, mutation, and frame-local state mechanism and the smallest remaining uncertainty.

#### Session 4 · Code-reading and investigation studio

**TA — Atlas TA · M01 · Session 4 · Code-reading and investigation studio**

1. Opening problem: Start with a small bindings, object identity, mutation, and frame-local state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/01_values_state_execution.md` lines 14–18 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: bindings, object identity, mutation, and frame-local state; predict an aliasing or mutation trace before seeing the result; which behavior follows from Python's data model versus a CPython implementation detail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to assignment copies an object or a function can only change its own local names; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: event-log comparison and repair memo → Carry the event-log comparison and repair memo into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M01 · Session 4 · Code-reading and investigation studio**

1. Design brief: Implement or inspect one bounded bindings, object identity, mutation, and frame-local state slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/01_values_state_execution.md` lines 14–18
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: assignment copies an object or a function can only change its own local names
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the bindings, object identity, mutation, and frame-local state mechanism and the smallest remaining uncertainty.

#### Session 5 · TA studio

**TA — Atlas TA · M01 · Session 5 · TA studio**

1. Opening problem: Start with a small bindings, object identity, mutation, and frame-local state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/01_values_state_execution.md` lines 14–18 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: bindings, object identity, mutation, and frame-local state; predict an aliasing or mutation trace before seeing the result; which behavior follows from Python's data model versus a CPython implementation detail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to assignment copies an object or a function can only change its own local names; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: TA misconception and regression card → Carry the TA misconception and regression card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M01 · Session 5 · TA studio**

1. Design brief: Implement or inspect one bounded bindings, object identity, mutation, and frame-local state slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/01_values_state_execution.md` lines 14–18
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: assignment copies an object or a function can only change its own local names
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the bindings, object identity, mutation, and frame-local state mechanism and the smallest remaining uncertainty.

#### Session 6 · Mastery check and synthesis

**TA — Atlas TA · M01 · Session 6 · Mastery check and synthesis**

1. Opening problem: Start with a small bindings, object identity, mutation, and frame-local state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/01_values_state_execution.md` lines 14–18 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: bindings, object identity, mutation, and frame-local state; predict an aliasing or mutation trace before seeing the result; which behavior follows from Python's data model versus a CPython implementation detail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to assignment copies an object or a function can only change its own local names; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: M1 state-evidence dossier → Carry the M1 state-evidence dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M01 · Session 6 · Mastery check and synthesis**

1. Design brief: Implement or inspect one bounded bindings, object identity, mutation, and frame-local state slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/01_values_state_execution.md` lines 14–18
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: assignment copies an object or a function can only change its own local names
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the bindings, object identity, mutation, and frame-local state mechanism and the smallest remaining uncertainty.

### M02 · Functions, Recursion, and Induction

Availability: **legacy-open** · Arc project: **Stateful Atlas event ledger** · Source map: [content/source-maps/python_curriculum_sources.md](../content/source-maps/python_curriculum_sources.md)

#### Session 1 · Functions as contracts, not syntax

**TA — Atlas TA · M02 · Session 1 · Functions as contracts, not syntax**

1. Opening problem: Start with a small a recursive contract joined to its base case, inductive step, and termination measure mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/02_functions_recursion_induction.md` lines 73–78 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a recursive contract joined to its base case, inductive step, and termination measure; reconstruct a recursive return trace and the corresponding induction argument; what fails when the measure does not decrease or the hypothesis is too weak; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a recursive call is justified merely because its input looks smaller; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: contract-and-frame trace → Carry the contract-and-frame trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M02 · Session 1 · Functions as contracts, not syntax**

1. Design brief: Implement or inspect one bounded a recursive contract joined to its base case, inductive step, and termination measure slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/02_functions_recursion_induction.md` lines 73–78
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a recursive call is justified merely because its input looks smaller
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a recursive contract joined to its base case, inductive step, and termination measure mechanism and the smallest remaining uncertainty.

#### Session 2 · Recursion follows the input

**TA — Atlas TA · M02 · Session 2 · Recursion follows the input**

1. Opening problem: Start with a small a recursive contract joined to its base case, inductive step, and termination measure mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/02_functions_recursion_induction.md` lines 73–78 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a recursive contract joined to its base case, inductive step, and termination measure; reconstruct a recursive return trace and the corresponding induction argument; what fails when the measure does not decrease or the hypothesis is too weak; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a recursive call is justified merely because its input looks smaller; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: recursive-decomposition card → Carry the recursive-decomposition card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M02 · Session 2 · Recursion follows the input**

1. Design brief: Implement or inspect one bounded a recursive contract joined to its base case, inductive step, and termination measure slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/02_functions_recursion_induction.md` lines 73–78
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a recursive call is justified merely because its input looks smaller
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a recursive contract joined to its base case, inductive step, and termination measure mechanism and the smallest remaining uncertainty.

#### Session 3 · Termination and induction

**TA — Atlas TA · M02 · Session 3 · Termination and induction**

1. Opening problem: Start with a small a recursive contract joined to its base case, inductive step, and termination measure mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/02_functions_recursion_induction.md` lines 73–78 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a recursive contract joined to its base case, inductive step, and termination measure; reconstruct a recursive return trace and the corresponding induction argument; what fails when the measure does not decrease or the hypothesis is too weak; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a recursive call is justified merely because its input looks smaller; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: termination-and-induction proof note → Carry the termination-and-induction proof note into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M02 · Session 3 · Termination and induction**

1. Design brief: Implement or inspect one bounded a recursive contract joined to its base case, inductive step, and termination measure slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/02_functions_recursion_induction.md` lines 73–78
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a recursive call is justified merely because its input looks smaller
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a recursive contract joined to its base case, inductive step, and termination measure mechanism and the smallest remaining uncertainty.

#### Session 4 · Call shape and resource cost

**TA — Atlas TA · M02 · Session 4 · Call shape and resource cost**

1. Opening problem: Start with a small a recursive contract joined to its base case, inductive step, and termination measure mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/02_functions_recursion_induction.md` lines 73–78 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a recursive contract joined to its base case, inductive step, and termination measure; reconstruct a recursive return trace and the corresponding induction argument; what fails when the measure does not decrease or the hypothesis is too weak; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a recursive call is justified merely because its input looks smaller; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: recurrence-and-stack-cost claim → Carry the recurrence-and-stack-cost claim into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M02 · Session 4 · Call shape and resource cost**

1. Design brief: Implement or inspect one bounded a recursive contract joined to its base case, inductive step, and termination measure slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/02_functions_recursion_induction.md` lines 73–78
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a recursive call is justified merely because its input looks smaller
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a recursive contract joined to its base case, inductive step, and termination measure mechanism and the smallest remaining uncertainty.

#### Session 5 · Code-reading and debugging studio

**TA — Atlas TA · M02 · Session 5 · Code-reading and debugging studio**

1. Opening problem: Start with a small a recursive contract joined to its base case, inductive step, and termination measure mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/02_functions_recursion_induction.md` lines 73–78 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a recursive contract joined to its base case, inductive step, and termination measure; reconstruct a recursive return trace and the corresponding induction argument; what fails when the measure does not decrease or the hypothesis is too weak; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a recursive call is justified merely because its input looks smaller; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: recursive-failure-investigation memo → Carry the recursive-failure-investigation memo into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M02 · Session 5 · Code-reading and debugging studio**

1. Design brief: Implement or inspect one bounded a recursive contract joined to its base case, inductive step, and termination measure slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/02_functions_recursion_induction.md` lines 73–78
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a recursive call is justified merely because its input looks smaller
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a recursive contract joined to its base case, inductive step, and termination measure mechanism and the smallest remaining uncertainty.

#### Session 6 · Design, delegate, review, defend

**TA — Atlas TA · M02 · Session 6 · Design, delegate, review, defend**

1. Opening problem: Start with a small a recursive contract joined to its base case, inductive step, and termination measure mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/02_functions_recursion_induction.md` lines 73–78 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a recursive contract joined to its base case, inductive step, and termination measure; reconstruct a recursive return trace and the corresponding induction argument; what fails when the measure does not decrease or the hypothesis is too weak; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a recursive call is justified merely because its input looks smaller; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: design-review-and-oral-defense dossier → Carry the design-review-and-oral-defense dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M02 · Session 6 · Design, delegate, review, defend**

1. Design brief: Implement or inspect one bounded a recursive contract joined to its base case, inductive step, and termination measure slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/02_functions_recursion_induction.md` lines 73–78
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a recursive call is justified merely because its input looks smaller
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a recursive contract joined to its base case, inductive step, and termination measure mechanism and the smallest remaining uncertainty.

### M03 · Abstraction, Interfaces, and Abstract Data Types

Availability: **legacy-open** · Arc project: **Stateful Atlas event ledger** · Source map: [content/source-maps/python_curriculum_sources.md](../content/source-maps/python_curriculum_sources.md)

#### Session 1 · Discover the boundary (75 minutes)

**TA — Atlas TA · M03 · Session 1 · Discover the boundary (75 minutes)**

1. Opening problem: the `screen.clear()` event-history failure.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an abstract data type's behavioral contract separated from its representation invariant; read one operation and explain how it preserves the invariant without exposing internals; when a representation swap is safe and when an observable behavior breaks substitution; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to public fields and incidental representation details are automatically part of an API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: boundary-observation trace → Carry the boundary-observation trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M03 · Session 1 · Discover the boundary (75 minutes)**

1. Design brief: Implement or inspect one bounded an abstract data type's behavioral contract separated from its representation invariant slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: public fields and incidental representation details are automatically part of an API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an abstract data type's behavioral contract separated from its representation invariant mechanism and the smallest remaining uncertainty.

#### Session 2 · Define the abstract value (90 minutes)

**TA — Atlas TA · M03 · Session 2 · Define the abstract value (90 minutes)**

1. Opening problem: Start with a small an abstract data type's behavioral contract separated from its representation invariant mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an abstract data type's behavioral contract separated from its representation invariant; read one operation and explain how it preserves the invariant without exposing internals; when a representation swap is safe and when an observable behavior breaks substitution; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to public fields and incidental representation details are automatically part of an API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: EventStore law card → Carry the EventStore law card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M03 · Session 2 · Define the abstract value (90 minutes)**

1. Design brief: Implement or inspect one bounded an abstract data type's behavioral contract separated from its representation invariant slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: public fields and incidental representation details are automatically part of an API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an abstract data type's behavioral contract separated from its representation invariant mechanism and the smallest remaining uncertainty.

#### Session 3 · Connect rep to meaning (100 minutes)

**TA — Atlas TA · M03 · Session 3 · Connect rep to meaning (100 minutes)**

1. Opening problem: Start with a small an abstract data type's behavioral contract separated from its representation invariant mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an abstract data type's behavioral contract separated from its representation invariant; read one operation and explain how it preserves the invariant without exposing internals; when a representation swap is safe and when an observable behavior breaks substitution; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to public fields and incidental representation details are automatically part of an API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: AF/RI correspondence table → Carry the AF/RI correspondence table into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M03 · Session 3 · Connect rep to meaning (100 minutes)**

1. Design brief: Implement or inspect one bounded an abstract data type's behavioral contract separated from its representation invariant slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: public fields and incidental representation details are automatically part of an API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an abstract data type's behavioral contract separated from its representation invariant mechanism and the smallest remaining uncertainty.

#### Session 4 · Read Python interface mechanisms (90 minutes)

**TA — Atlas TA · M03 · Session 4 · Read Python interface mechanisms (90 minutes)**

1. Opening problem: Start with a small an abstract data type's behavioral contract separated from its representation invariant mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an abstract data type's behavioral contract separated from its representation invariant; read one operation and explain how it preserves the invariant without exposing internals; when a representation swap is safe and when an observable behavior breaks substitution; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to public fields and incidental representation details are automatically part of an API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: structural-shape versus behavioral-law trace → Carry the structural-shape versus behavioral-law trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M03 · Session 4 · Read Python interface mechanisms (90 minutes)**

1. Design brief: Implement or inspect one bounded an abstract data type's behavioral contract separated from its representation invariant slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: public fields and incidental representation details are automatically part of an API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an abstract data type's behavioral contract separated from its representation invariant mechanism and the smallest remaining uncertainty.

#### Session 5 · Recover architecture and debug an invariant (120 minutes)

**TA — Atlas TA · M03 · Session 5 · Recover architecture and debug an invariant (120 minutes)**

1. Opening problem: Start with a small an abstract data type's behavioral contract separated from its representation invariant mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an abstract data type's behavioral contract separated from its representation invariant; read one operation and explain how it preserves the invariant without exposing internals; when a representation swap is safe and when an observable behavior breaks substitution; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to public fields and incidental representation details are automatically part of an API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: architecture and invariant repair note → Carry the architecture and invariant repair note into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M03 · Session 5 · Recover architecture and debug an invariant (120 minutes)**

1. Design brief: Implement or inspect one bounded an abstract data type's behavioral contract separated from its representation invariant slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: public fields and incidental representation details are automatically part of an API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an abstract data type's behavioral contract separated from its representation invariant mechanism and the smallest remaining uncertainty.

#### Session 6 · Design, delegate, and review (120 minutes)

**TA — Atlas TA · M03 · Session 6 · Design, delegate, and review (120 minutes)**

1. Opening problem: Start with a small an abstract data type's behavioral contract separated from its representation invariant mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an abstract data type's behavioral contract separated from its representation invariant; read one operation and explain how it preserves the invariant without exposing internals; when a representation swap is safe and when an observable behavior breaks substitution; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to public fields and incidental representation details are automatically part of an API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: replaceable-store dossier → Carry the replaceable-store dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M03 · Session 6 · Design, delegate, and review (120 minutes)**

1. Design brief: Implement or inspect one bounded an abstract data type's behavioral contract separated from its representation invariant slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/03_abstraction_interfaces_adts.md` lines 146–164
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: public fields and incidental representation details are automatically part of an API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an abstract data type's behavioral contract separated from its representation invariant mechanism and the smallest remaining uncertainty.

### M04 · Logic, Sets, Relations, Graphs, and Proof

Availability: **legacy-open** · Arc project: **Stateful Atlas event ledger** · Source map: [content/source-maps/python_curriculum_sources.md](../content/source-maps/python_curriculum_sources.md)

#### Session 1 · Claims that can be checked

**TA — Atlas TA · M04 · Session 1 · Claims that can be checked**

1. Opening problem: inspect three English descriptions of a “valid route” that disagree on missing concepts.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: precise domains, quantifiers, relations, and proof obligations; repair a short proof or construct a countermodel for a nearby false statement; the exact hypothesis needed for the claim and the difference between a finite trace and a proof; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to several examples, a diagram, or a true converse establishes a universal implication; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: claim-and-witness card → Carry the claim-and-witness card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M04 · Session 1 · Claims that can be checked**

1. Design brief: Implement or inspect one bounded precise domains, quantifiers, relations, and proof obligations slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: several examples, a diagram, or a true converse establishes a universal implication
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the precise domains, quantifiers, relations, and proof obligations mechanism and the smallest remaining uncertainty.

#### Session 2 · Quantifiers, sets, and relations

**TA — Atlas TA · M04 · Session 2 · Quantifiers, sets, and relations**

1. Opening problem: compare “every concept has some route” with “one route has every concept.”
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: precise domains, quantifiers, relations, and proof obligations; repair a short proof or construct a countermodel for a nearby false statement; the exact hypothesis needed for the claim and the difference between a finite trace and a proof; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to several examples, a diagram, or a true converse establishes a universal implication; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: quantified-policy and relation map → Carry the quantified-policy and relation map into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M04 · Session 2 · Quantifiers, sets, and relations**

1. Design brief: Implement or inspect one bounded precise domains, quantifiers, relations, and proof obligations slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: several examples, a diagram, or a true converse establishes a universal implication
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the precise domains, quantifiers, relations, and proof obligations mechanism and the smallest remaining uncertainty.

#### Session 3 · Give prerequisites a graph shape

**TA — Atlas TA · M04 · Session 3 · Give prerequisites a graph shape**

1. Opening problem: draw a prerequisite cycle that makes every linear route impossible.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: precise domains, quantifiers, relations, and proof obligations; repair a short proof or construct a countermodel for a nearby false statement; the exact hypothesis needed for the claim and the difference between a finite trace and a proof; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to several examples, a diagram, or a true converse establishes a universal implication; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: prerequisite-graph and cycle witness → Carry the prerequisite-graph and cycle witness into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M04 · Session 3 · Give prerequisites a graph shape**

1. Design brief: Implement or inspect one bounded precise domains, quantifiers, relations, and proof obligations slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: several examples, a diagram, or a true converse establishes a universal implication
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the precise domains, quantifiers, relations, and proof obligations mechanism and the smallest remaining uncertainty.

#### Session 4 · Proof and probability as different models

**TA — Atlas TA · M04 · Session 4 · Proof and probability as different models**

1. Opening problem: compare a proof, a test suite, a random simulation, and a counterexample.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: precise domains, quantifiers, relations, and proof obligations; repair a short proof or construct a countermodel for a nearby false statement; the exact hypothesis needed for the claim and the difference between a finite trace and a proof; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to several examples, a diagram, or a true converse establishes a universal implication; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: proof-and-probability boundary note → Carry the proof-and-probability boundary note into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M04 · Session 4 · Proof and probability as different models**

1. Design brief: Implement or inspect one bounded precise domains, quantifiers, relations, and proof obligations slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: several examples, a diagram, or a true converse establishes a universal implication
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the precise domains, quantifiers, relations, and proof obligations mechanism and the smallest remaining uncertainty.

#### Session 5 · Code-reading and architecture investigation

**TA — Atlas TA · M04 · Session 5 · Code-reading and architecture investigation**

1. Opening problem: compare three planners with identical method names and different domain policies.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: precise domains, quantifiers, relations, and proof obligations; repair a short proof or construct a countermodel for a nearby false statement; the exact hypothesis needed for the claim and the difference between a finite trace and a proof; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to several examples, a diagram, or a true converse establishes a universal implication; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: validation-model investigation memo → Carry the validation-model investigation memo into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M04 · Session 5 · Code-reading and architecture investigation**

1. Design brief: Implement or inspect one bounded precise domains, quantifiers, relations, and proof obligations slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: several examples, a diagram, or a true converse establishes a universal implication
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the precise domains, quantifiers, relations, and proof obligations mechanism and the smallest remaining uncertainty.

#### Session 6 · Design, delegate, review, defend

**TA — Atlas TA · M04 · Session 6 · Design, delegate, review, defend**

1. Opening problem: frame the bounded cycle-diagnosis agent task.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: precise domains, quantifiers, relations, and proof obligations; repair a short proof or construct a countermodel for a nearby false statement; the exact hypothesis needed for the claim and the difference between a finite trace and a proof; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to several examples, a diagram, or a true converse establishes a universal implication; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: cycle-review-and-evidence dossier → Carry the cycle-review-and-evidence dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M04 · Session 6 · Design, delegate, review, defend**

1. Design brief: Implement or inspect one bounded precise domains, quantifiers, relations, and proof obligations slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/04_logic_sets_relations_graphs_proof.md` lines 63–63
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: several examples, a diagram, or a true converse establishes a universal implication
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the precise domains, quantifiers, relations, and proof obligations mechanism and the smallest remaining uncertainty.

### M05 · Cost Models and Algorithm Analysis

Availability: **legacy-open** · Arc project: **Stateful Atlas event ledger** · Source map: [content/source-maps/python_curriculum_sources.md](../content/source-maps/python_curriculum_sources.md)

#### Session 1 · Count what the program actually does

**TA — Atlas TA · M05 · Session 1 · Count what the program actually does**

1. Opening problem: read the list-only Atlas deduplicator and predict which input grows worst.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a cost model with an asymptotic claim, constants, and an input family; derive a bound from counted operations and defend the model being counted; what a small timing observation cannot distinguish about two growth claims; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to Big-O means approximately equal, or one benchmark establishes an asymptotic result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: explicit cost-model card → Carry the explicit cost-model card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M05 · Session 1 · Count what the program actually does**

1. Design brief: Implement or inspect one bounded a cost model with an asymptotic claim, constants, and an input family slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: Big-O means approximately equal, or one benchmark establishes an asymptotic result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a cost model with an asymptotic claim, constants, and an input family mechanism and the smallest remaining uncertainty.

#### Session 2 · Bounds and cases

**TA — Atlas TA · M05 · Session 2 · Bounds and cases**

1. Opening problem: critique four underspecified performance statements from an agent.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a cost model with an asymptotic claim, constants, and an input family; derive a bound from counted operations and defend the model being counted; what a small timing observation cannot distinguish about two growth claims; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to Big-O means approximately equal, or one benchmark establishes an asymptotic result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: bound-and-case claim → Carry the bound-and-case claim into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M05 · Session 2 · Bounds and cases**

1. Design brief: Implement or inspect one bounded a cost model with an asymptotic claim, constants, and an input family slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: Big-O means approximately equal, or one benchmark establishes an asymptotic result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a cost model with an asymptotic claim, constants, and an input family mechanism and the smallest remaining uncertainty.

#### Session 3 · Call shape becomes a recurrence

**TA — Atlas TA · M05 · Session 3 · Call shape becomes a recurrence**

1. Opening problem: compare a chain traversal, merge sort, and naive Fibonacci.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a cost model with an asymptotic claim, constants, and an input family; derive a bound from counted operations and defend the model being counted; what a small timing observation cannot distinguish about two growth claims; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to Big-O means approximately equal, or one benchmark establishes an asymptotic result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: recurrence and recursion-tree trace → Carry the recurrence and recursion-tree trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M05 · Session 3 · Call shape becomes a recurrence**

1. Design brief: Implement or inspect one bounded a cost model with an asymptotic claim, constants, and an input family slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: Big-O means approximately equal, or one benchmark establishes an asymptotic result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a cost model with an asymptotic claim, constants, and an input family mechanism and the smallest remaining uncertainty.

#### Session 4 · Amortized time and complete space accounts

**TA — Atlas TA · M05 · Session 4 · Amortized time and complete space accounts**

1. Opening problem: inspect one expensive dynamic-array resize within many cheap appends.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a cost model with an asymptotic claim, constants, and an input family; derive a bound from counted operations and defend the model being counted; what a small timing observation cannot distinguish about two growth claims; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to Big-O means approximately equal, or one benchmark establishes an asymptotic result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: amortized and space account → Carry the amortized and space account into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M05 · Session 4 · Amortized time and complete space accounts**

1. Design brief: Implement or inspect one bounded a cost model with an asymptotic claim, constants, and an input family slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: Big-O means approximately equal, or one benchmark establishes an asymptotic result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a cost model with an asymptotic claim, constants, and an input family mechanism and the smallest remaining uncertainty.

#### Session 5 · Measurement as a model check

**TA — Atlas TA · M05 · Session 5 · Measurement as a model check**

1. Opening problem: inspect a benchmark that times data construction and reports one sample.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a cost model with an asymptotic claim, constants, and an input family; derive a bound from counted operations and defend the model being counted; what a small timing observation cannot distinguish about two growth claims; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to Big-O means approximately equal, or one benchmark establishes an asymptotic result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: measurement-boundary report → Carry the measurement-boundary report into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M05 · Session 5 · Measurement as a model check**

1. Design brief: Implement or inspect one bounded a cost model with an asymptotic claim, constants, and an input family slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: Big-O means approximately equal, or one benchmark establishes an asymptotic result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a cost model with an asymptotic claim, constants, and an input family mechanism and the smallest remaining uncertainty.

#### Session 6 · Architecture, delegation, and decision

**TA — Atlas TA · M05 · Session 6 · Architecture, delegation, and decision**

1. Opening problem: map a route planner whose graph lookup performs a database round trip.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a cost model with an asymptotic claim, constants, and an input family; derive a bound from counted operations and defend the model being counted; what a small timing observation cannot distinguish about two growth claims; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to Big-O means approximately equal, or one benchmark establishes an asymptotic result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: representation decision dossier → Carry the representation decision dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M05 · Session 6 · Architecture, delegation, and decision**

1. Design brief: Implement or inspect one bounded a cost model with an asymptotic claim, constants, and an input family slice for Stateful Atlas event ledger.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/05_cost_models_algorithm_analysis.md` lines 77–82
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: Big-O means approximately equal, or one benchmark establishes an asymptotic result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a cost model with an asymptotic claim, constants, and an input family mechanism and the smallest remaining uncertainty.

### M06 · Representation, Memory, Sequences, and Linked Structures

Availability: **legacy-open** · Arc project: **Indexed retrieval and route planner** · Source map: [content/source-maps/arc_ii_source_map.md](../content/source-maps/arc_ii_source_map.md)

#### Session 1 · From values to bits without losing meaning

**TA — Atlas TA · M06 · Session 1 · From values to bits without losing meaning**

1. Opening problem: interpret `01000001` three ways and explain why none is inherent in the bits.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the relationship between sequence meaning, concrete storage, locality, and operation cost; trace a sequence operation through array or linked representation and its ownership changes; which cost depends on access pattern, allocation, or implementation rather than the abstract ADT; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to linked structures are inherently faster or memory representation is invisible to the API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: object-graph and evidence-layer card → Carry the object-graph and evidence-layer card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M06 · Session 1 · From values to bits without losing meaning**

1. Design brief: Implement or inspect one bounded the relationship between sequence meaning, concrete storage, locality, and operation cost slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: linked structures are inherently faster or memory representation is invisible to the API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the relationship between sequence meaning, concrete storage, locality, and operation cost mechanism and the smallest remaining uncertainty.

#### Session 2 · Derive an array from indexed access

**TA — Atlas TA · M06 · Session 2 · Derive an array from indexed access**

1. Opening problem: ask how to locate item `i` without walking through prior items.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the relationship between sequence meaning, concrete storage, locality, and operation cost; trace a sequence operation through array or linked representation and its ownership changes; which cost depends on access pattern, allocation, or implementation rather than the abstract ADT; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to linked structures are inherently faster or memory representation is invisible to the API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: array invariant and shift-count trace → Carry the array invariant and shift-count trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M06 · Session 2 · Derive an array from indexed access**

1. Design brief: Implement or inspect one bounded the relationship between sequence meaning, concrete storage, locality, and operation cost slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: linked structures are inherently faster or memory representation is invisible to the API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the relationship between sequence meaning, concrete storage, locality, and operation cost mechanism and the smallest remaining uncertainty.

#### Session 3 · Make growth visible

**TA — Atlas TA · M06 · Session 3 · Make growth visible**

1. Opening problem: inspect a capacity-4 array immediately before its fifth append.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the relationship between sequence meaning, concrete storage, locality, and operation cost; trace a sequence operation through array or linked representation and its ownership changes; which cost depends on access pattern, allocation, or implementation rather than the abstract ADT; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to linked structures are inherently faster or memory representation is invisible to the API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: growth-and-capacity evidence card → Carry the growth-and-capacity evidence card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M06 · Session 3 · Make growth visible**

1. Design brief: Implement or inspect one bounded the relationship between sequence meaning, concrete storage, locality, and operation cost slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: linked structures are inherently faster or memory representation is invisible to the API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the relationship between sequence meaning, concrete storage, locality, and operation cost mechanism and the smallest remaining uncertainty.

#### Session 4 · Derive linked order and its invariants

**TA — Atlas TA · M06 · Session 4 · Derive linked order and its invariants**

1. Opening problem: remove the need to shift the remaining sequence when the first item leaves.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the relationship between sequence meaning, concrete storage, locality, and operation cost; trace a sequence operation through array or linked representation and its ownership changes; which cost depends on access pattern, allocation, or implementation rather than the abstract ADT; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to linked structures are inherently faster or memory representation is invisible to the API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: linked-invariant and boundary-transition trace → Carry the linked-invariant and boundary-transition trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M06 · Session 4 · Derive linked order and its invariants**

1. Design brief: Implement or inspect one bounded the relationship between sequence meaning, concrete storage, locality, and operation cost slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: linked structures are inherently faster or memory representation is invisible to the API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the relationship between sequence meaning, concrete storage, locality, and operation cost mechanism and the smallest remaining uncertainty.

#### Session 5 · Locality, memory, and architecture reading

**TA — Atlas TA · M06 · Session 5 · Locality, memory, and architecture reading**

1. Opening problem: compare two `Θ(n)` traversals and ask what the model intentionally hides.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the relationship between sequence meaning, concrete storage, locality, and operation cost; trace a sequence operation through array or linked representation and its ownership changes; which cost depends on access pattern, allocation, or implementation rather than the abstract ADT; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to linked structures are inherently faster or memory representation is invisible to the API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: memory-scope and architecture memo → Carry the memory-scope and architecture memo into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M06 · Session 5 · Locality, memory, and architecture reading**

1. Design brief: Implement or inspect one bounded the relationship between sequence meaning, concrete storage, locality, and operation cost slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: linked structures are inherently faster or memory representation is invisible to the API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the relationship between sequence meaning, concrete storage, locality, and operation cost mechanism and the smallest remaining uncertainty.

#### Session 6 · Changing constraints, delegation, and defense

**TA — Atlas TA · M06 · Session 6 · Changing constraints, delegation, and defense**

1. Opening problem: change Atlas from indexed desktop history to a high-rate rolling window.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the relationship between sequence meaning, concrete storage, locality, and operation cost; trace a sequence operation through array or linked representation and its ownership changes; which cost depends on access pattern, allocation, or implementation rather than the abstract ADT; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to linked structures are inherently faster or memory representation is invisible to the API; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: representation-decision and M7 handoff dossier → Carry the representation-decision and M7 handoff dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M06 · Session 6 · Changing constraints, delegation, and defense**

1. Design brief: Implement or inspect one bounded the relationship between sequence meaning, concrete storage, locality, and operation cost slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/06_representation_memory_sequences_linked.md` lines 76–76
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: linked structures are inherently faster or memory representation is invisible to the API
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the relationship between sequence meaning, concrete storage, locality, and operation cost mechanism and the smallest remaining uncertainty.

### M07 · Stacks, Queues, Iteration, and Lazy Computation

Availability: **legacy-open** · Arc project: **Indexed retrieval and route planner** · Source map: [content/source-maps/arc_ii_source_map.md](../content/source-maps/arc_ii_source_map.md)

#### Session 1 · Access constraints create behavior

**TA — Atlas TA · M07 · Session 1 · Access constraints create behavior**

1. Opening problem: Start with a small restricted access, deferred computation, and the difference between producing and consuming work mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: restricted access, deferred computation, and the difference between producing and consuming work; predict iterator or generator state across a short pull sequence; when laziness changes memory behavior but not a source's side effects or termination; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a lazy pipeline has already done its work or can be replayed without a new source; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: access-law trace → Carry the access-law trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M07 · Session 1 · Access constraints create behavior**

1. Design brief: Implement or inspect one bounded restricted access, deferred computation, and the difference between producing and consuming work slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a lazy pipeline has already done its work or can be replayed without a new source
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the restricted access, deferred computation, and the difference between producing and consuming work mechanism and the smallest remaining uncertainty.

#### Session 2 · The iterator protocol exposes demand

**TA — Atlas TA · M07 · Session 2 · The iterator protocol exposes demand**

1. Opening problem: Start with a small restricted access, deferred computation, and the difference between producing and consuming work mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: restricted access, deferred computation, and the difference between producing and consuming work; predict iterator or generator state across a short pull sequence; when laziness changes memory behavior but not a source's side effects or termination; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a lazy pipeline has already done its work or can be replayed without a new source; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: iterator-state trace → Carry the iterator-state trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M07 · Session 2 · The iterator protocol exposes demand**

1. Design brief: Implement or inspect one bounded restricted access, deferred computation, and the difference between producing and consuming work slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a lazy pipeline has already done its work or can be replayed without a new source
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the restricted access, deferred computation, and the difference between producing and consuming work mechanism and the smallest remaining uncertainty.

#### Session 3 · A generator is a resumable computation

**TA — Atlas TA · M07 · Session 3 · A generator is a resumable computation**

1. Opening problem: Start with a small restricted access, deferred computation, and the difference between producing and consuming work mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: restricted access, deferred computation, and the difference between producing and consuming work; predict iterator or generator state across a short pull sequence; when laziness changes memory behavior but not a source's side effects or termination; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a lazy pipeline has already done its work or can be replayed without a new source; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: generator-suspension trace → Carry the generator-suspension trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M07 · Session 3 · A generator is a resumable computation**

1. Design brief: Implement or inspect one bounded restricted access, deferred computation, and the difference between producing and consuming work slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a lazy pipeline has already done its work or can be replayed without a new source
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the restricted access, deferred computation, and the difference between producing and consuming work mechanism and the smallest remaining uncertainty.

#### Session 4 · Lazy pipelines and ownership

**TA — Atlas TA · M07 · Session 4 · Lazy pipelines and ownership**

1. Opening problem: Start with a small restricted access, deferred computation, and the difference between producing and consuming work mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: restricted access, deferred computation, and the difference between producing and consuming work; predict iterator or generator state across a short pull sequence; when laziness changes memory behavior but not a source's side effects or termination; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a lazy pipeline has already done its work or can be replayed without a new source; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: demand-and-ownership map → Carry the demand-and-ownership map into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M07 · Session 4 · Lazy pipelines and ownership**

1. Design brief: Implement or inspect one bounded restricted access, deferred computation, and the difference between producing and consuming work slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a lazy pipeline has already done its work or can be replayed without a new source
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the restricted access, deferred computation, and the difference between producing and consuming work mechanism and the smallest remaining uncertainty.

#### Session 5 · Capacity and backpressure are system contracts

**TA — Atlas TA · M07 · Session 5 · Capacity and backpressure are system contracts**

1. Opening problem: Start with a small restricted access, deferred computation, and the difference between producing and consuming work mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: restricted access, deferred computation, and the difference between producing and consuming work; predict iterator or generator state across a short pull sequence; when laziness changes memory behavior but not a source's side effects or termination; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a lazy pipeline has already done its work or can be replayed without a new source; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: capacity-scope card → Carry the capacity-scope card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M07 · Session 5 · Capacity and backpressure are system contracts**

1. Design brief: Implement or inspect one bounded restricted access, deferred computation, and the difference between producing and consuming work slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a lazy pipeline has already done its work or can be replayed without a new source
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the restricted access, deferred computation, and the difference between producing and consuming work mechanism and the smallest remaining uncertainty.

#### Session 6 · Agent-directed Atlas checkpoint

**TA — Atlas TA · M07 · Session 6 · Agent-directed Atlas checkpoint**

1. Opening problem: Start with a small restricted access, deferred computation, and the difference between producing and consuming work mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: restricted access, deferred computation, and the difference between producing and consuming work; predict iterator or generator state across a short pull sequence; when laziness changes memory behavior but not a source's side effects or termination; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a lazy pipeline has already done its work or can be replayed without a new source; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: reviewed patch evidence dossier → Carry the reviewed patch evidence dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M07 · Session 6 · Agent-directed Atlas checkpoint**

1. Design brief: Implement or inspect one bounded restricted access, deferred computation, and the difference between producing and consuming work slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/07_stacks_queues_iteration_lazy.md` lines 64–68
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a lazy pipeline has already done its work or can be replayed without a new source
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the restricted access, deferred computation, and the difference between producing and consuming work mechanism and the smallest remaining uncertainty.

### M08 · Hashing, Dictionaries, Sets, and Indexing

Availability: **legacy-open** · Arc project: **Indexed retrieval and route planner** · Source map: [content/source-maps/arc_ii_source_map.md](../content/source-maps/arc_ii_source_map.md)

#### Session 1 · Why lookup creates an index

**TA — Atlas TA · M08 · Session 1 · Why lookup creates an index**

1. Opening problem: compare repeated full-note scans with a precomputed token relation.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: equality, hashing, collision handling, and indexing under a workload; trace lookup or insertion while stating the equality and hash contract; the difference between expected lookup cost, adversarial behavior, and a correctness guarantee; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to hashes uniquely identify values or mutable keys are always safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: lookup-to-index decision card → Carry the lookup-to-index decision card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M08 · Session 1 · Why lookup creates an index**

1. Design brief: Implement or inspect one bounded equality, hashing, collision handling, and indexing under a workload slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: hashes uniquely identify values or mutable keys are always safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the equality, hashing, collision handling, and indexing under a workload mechanism and the smallest remaining uncertainty.

#### Session 2 · Hashing, collisions, and equality

**TA — Atlas TA · M08 · Session 2 · Hashing, collisions, and equality**

1. Opening problem: map six distinct keys into four table positions.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: equality, hashing, collision handling, and indexing under a workload; trace lookup or insertion while stating the equality and hash contract; the difference between expected lookup cost, adversarial behavior, and a correctness guarantee; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to hashes uniquely identify values or mutable keys are always safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: collision-and-equality trace → Carry the collision-and-equality trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M08 · Session 2 · Hashing, collisions, and equality**

1. Design brief: Implement or inspect one bounded equality, hashing, collision handling, and indexing under a workload slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: hashes uniquely identify values or mutable keys are always safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the equality, hashing, collision handling, and indexing under a workload mechanism and the smallest remaining uncertainty.

#### Session 3 · Keys are behavioral contracts

**TA — Atlas TA · M08 · Session 3 · Keys are behavioral contracts**

1. Opening problem: inspect `MutableTopic` before and after changing `slug`.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: equality, hashing, collision handling, and indexing under a workload; trace lookup or insertion while stating the equality and hash contract; the difference between expected lookup cost, adversarial behavior, and a correctness guarantee; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to hashes uniquely identify values or mutable keys are always safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: key-contract repair note → Carry the key-contract repair note into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M08 · Session 3 · Keys are behavioral contracts**

1. Design brief: Implement or inspect one bounded equality, hashing, collision handling, and indexing under a workload slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: hashes uniquely identify values or mutable keys are always safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the equality, hashing, collision handling, and indexing under a workload mechanism and the smallest remaining uncertainty.

#### Session 4 · Cost without overclaiming

**TA — Atlas TA · M08 · Session 4 · Cost without overclaiming**

1. Opening problem: inspect one balanced table and one constant-hash table.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: equality, hashing, collision handling, and indexing under a workload; trace lookup or insertion while stating the equality and hash contract; the difference between expected lookup cost, adversarial behavior, and a correctness guarantee; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to hashes uniquely identify values or mutable keys are always safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: qualified-cost card → Carry the qualified-cost card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M08 · Session 4 · Cost without overclaiming**

1. Design brief: Implement or inspect one bounded equality, hashing, collision handling, and indexing under a workload slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: hashes uniquely identify values or mutable keys are always safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the equality, hashing, collision handling, and indexing under a workload mechanism and the smallest remaining uncertainty.

#### Session 5 · From Python semantics to an Atlas inverted index

**TA — Atlas TA · M08 · Session 5 · From Python semantics to an Atlas inverted index**

1. Opening problem: invert three note-to-token relationships by hand.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: equality, hashing, collision handling, and indexing under a workload; trace lookup or insertion while stating the equality and hash contract; the difference between expected lookup cost, adversarial behavior, and a correctness guarantee; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to hashes uniquely identify values or mutable keys are always safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: index-proof and ownership sheet → Carry the index-proof and ownership sheet into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M08 · Session 5 · From Python semantics to an Atlas inverted index**

1. Design brief: Implement or inspect one bounded equality, hashing, collision handling, and indexing under a workload slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: hashes uniquely identify values or mutable keys are always safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the equality, hashing, collision handling, and indexing under a workload mechanism and the smallest remaining uncertainty.

#### Session 6 · Architecture, adversaries, and agent review

**TA — Atlas TA · M08 · Session 6 · Architecture, adversaries, and agent review**

1. Opening problem: interrupt an incremental note replacement after each line.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: equality, hashing, collision handling, and indexing under a workload; trace lookup or insertion while stating the equality and hash contract; the difference between expected lookup cost, adversarial behavior, and a correctness guarantee; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to hashes uniquely identify values or mutable keys are always safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: reviewed index evidence dossier → Carry the reviewed index evidence dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M08 · Session 6 · Architecture, adversaries, and agent review**

1. Design brief: Implement or inspect one bounded equality, hashing, collision handling, and indexing under a workload slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/08_hashing_dictionaries_sets_indexing.md` lines 132–136
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: hashes uniquely identify values or mutable keys are always safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the equality, hashing, collision handling, and indexing under a workload mechanism and the smallest remaining uncertainty.

### M09 · Trees, Heaps, Sorting, and Ordered Search

Availability: **legacy-open** · Arc project: **Indexed retrieval and route planner** · Source map: [content/source-maps/arc_ii_source_map.md](../content/source-maps/arc_ii_source_map.md)

#### Session 1 · Ordered questions force new operations

**TA — Atlas TA · M09 · Session 1 · Ordered questions force new operations**

1. Opening problem: give Atlas five queries—exact ID, earliest deadline, next key, range, and prefix—and forbid container names.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves; walk through one rotation, heap repair, or comparison sequence and state the invariant afterward; which ordering property is required and what duplicates or comparator behavior change; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: ordered-operation decision ledger → Carry the ordered-operation decision ledger into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M09 · Session 1 · Ordered questions force new operations**

1. Design brief: Implement or inspect one bounded ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves mechanism and the smallest remaining uncertainty.

#### Session 2 · Recursive shape becomes ordered search

**TA — Atlas TA · M09 · Session 2 · Recursive shape becomes ordered search**

1. Opening problem: draw one binary shape, then produce pre-, in-, and post-order traces to show shape does not determine traversal order.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves; walk through one rotation, heap repair, or comparison sequence and state the invariant afterward; which ordering property is required and what duplicates or comparator behavior change; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: BST path-and-proof trace → Carry the BST path-and-proof trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M09 · Session 2 · Recursive shape becomes ordered search**

1. Design brief: Implement or inspect one bounded ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves mechanism and the smallest remaining uncertainty.

#### Session 3 · Balance is a repairable shape constraint

**TA — Atlas TA · M09 · Session 3 · Balance is a repairable shape constraint**

1. Opening problem: insert `1,2,3,4,5` and measure path length; distinguish semantic validity from performance failure.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves; walk through one rotation, heap repair, or comparison sequence and state the invariant afterward; which ordering property is required and what duplicates or comparator behavior change; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: rotation-preservation dossier → Carry the rotation-preservation dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M09 · Session 3 · Balance is a repairable shape constraint**

1. Design brief: Implement or inspect one bounded ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves mechanism and the smallest remaining uncertainty.

#### Session 4 · A complete tree becomes a priority mechanism

**TA — Atlas TA · M09 · Session 4 · A complete tree becomes a priority mechanism**

1. Opening problem: ask for repeated minimum removal without paying to keep every pair globally sorted.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves; walk through one rotation, heap repair, or comparison sequence and state the invariant afterward; which ordering property is required and what duplicates or comparator behavior change; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: heap invariant trace → Carry the heap invariant trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M09 · Session 4 · A complete tree becomes a priority mechanism**

1. Design brief: Implement or inspect one bounded ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves mechanism and the smallest remaining uncertainty.

#### Session 5 · Sorting and prefix paths organize different evidence

**TA — Atlas TA · M09 · Session 5 · Sorting and prefix paths organize different evidence**

1. Opening problem: contrast “sort this snapshot” with “keep returning the next review” and “complete this prefix.”
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves; walk through one rotation, heap repair, or comparison sequence and state the invariant afterward; which ordering property is required and what duplicates or comparator behavior change; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: ordering-contract comparison memo → Carry the ordering-contract comparison memo into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M09 · Session 5 · Sorting and prefix paths organize different evidence**

1. Design brief: Implement or inspect one bounded ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves mechanism and the smallest remaining uncertainty.

#### Session 6 · Coordinate indexes, direct an agent, defend the system

**TA — Atlas TA · M09 · Session 6 · Coordinate indexes, direct an agent, defend the system**

1. Opening problem: reschedule one concept twice to the same priority, then cancel and re-add it.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves; walk through one rotation, heap repair, or comparison sequence and state the invariant afterward; which ordering property is required and what duplicates or comparator behavior change; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: ordered-index defense dossier → Carry the ordered-index defense dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M09 · Session 6 · Coordinate indexes, direct an agent, defend the system**

1. Design brief: Implement or inspect one bounded ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/09_trees_heaps_sorting_ordered.md` lines 357–370
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a visually tree-shaped structure is ordered or a sorted output proves a stable/complete algorithm
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the ordered invariants in trees and heaps, plus the property a sorting/search procedure preserves mechanism and the smallest remaining uncertainty.

### M10 · Graph Algorithms and Network Models

Availability: **legacy-open** · Arc project: **Indexed retrieval and route planner** · Source map: [content/source-maps/arc_ii_source_map.md](../content/source-maps/arc_ii_source_map.md)

#### Session 1 · Turn graph questions into representations

**TA — Atlas TA · M10 · Session 1 · Turn graph questions into representations**

1. Opening problem: inspect one Atlas prerequisite dataset containing an isolated vertex, a self-loop, and two parallel weighted edges.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/10_graph_algorithms_network_models.md` lines 262–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a graph model of vertices, edges, reachability, and the question an algorithm actually answers; predict a traversal or shortest-path state sequence from an edge list; which edge weights, direction, and graph assumptions make the conclusion legal; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a path found by one traversal is automatically shortest, complete, or a flow solution; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: graph-contract evidence card → Carry the graph-contract evidence card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M10 · Session 1 · Turn graph questions into representations**

1. Design brief: Implement or inspect one bounded a graph model of vertices, edges, reachability, and the question an algorithm actually answers slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/10_graph_algorithms_network_models.md` lines 262–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a path found by one traversal is automatically shortest, complete, or a flow solution
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a graph model of vertices, edges, reachability, and the question an algorithm actually answers mechanism and the smallest remaining uncertainty.

#### Session 2 · FIFO layers create shortest unweighted evidence

**TA — Atlas TA · M10 · Session 2 · FIFO layers create shortest unweighted evidence**

1. Opening problem: trace the diamond graph and predict the queue after every transition.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/10_graph_algorithms_network_models.md` lines 262–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a graph model of vertices, edges, reachability, and the question an algorithm actually answers; predict a traversal or shortest-path state sequence from an edge list; which edge weights, direction, and graph assumptions make the conclusion legal; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a path found by one traversal is automatically shortest, complete, or a flow solution; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: BFS witness-and-cost card → Carry the BFS witness-and-cost card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M10 · Session 2 · FIFO layers create shortest unweighted evidence**

1. Design brief: Implement or inspect one bounded a graph model of vertices, edges, reachability, and the question an algorithm actually answers slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/10_graph_algorithms_network_models.md` lines 262–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a path found by one traversal is automatically shortest, complete, or a flow solution
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a graph model of vertices, edges, reachability, and the question an algorithm actually answers mechanism and the smallest remaining uncertainty.

#### Session 3 · DFS finishing state exposes cycles and order

**TA — Atlas TA · M10 · Session 3 · DFS finishing state exposes cycles and order**

1. Opening problem: compare a set-only traversal with white/gray/black state on `a → c ← b`.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/10_graph_algorithms_network_models.md` lines 262–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a graph model of vertices, edges, reachability, and the question an algorithm actually answers; predict a traversal or shortest-path state sequence from an edge list; which edge weights, direction, and graph assumptions make the conclusion legal; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a path found by one traversal is automatically shortest, complete, or a flow solution; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: DFS cycle-or-order evidence card → Carry the DFS cycle-or-order evidence card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M10 · Session 3 · DFS finishing state exposes cycles and order**

1. Design brief: Implement or inspect one bounded a graph model of vertices, edges, reachability, and the question an algorithm actually answers slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/10_graph_algorithms_network_models.md` lines 262–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a path found by one traversal is automatically shortest, complete, or a flow solution
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a graph model of vertices, edges, reachability, and the question an algorithm actually answers mechanism and the smallest remaining uncertainty.

#### Session 4 · Relaxation plus graph structure selects a path method

**TA — Atlas TA · M10 · Session 4 · Relaxation plus graph structure selects a path method**

1. Opening problem: compare fewest-edge and least-weight routes on the same three vertices.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/10_graph_algorithms_network_models.md` lines 262–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a graph model of vertices, edges, reachability, and the question an algorithm actually answers; predict a traversal or shortest-path state sequence from an edge list; which edge weights, direction, and graph assumptions make the conclusion legal; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a path found by one traversal is automatically shortest, complete, or a flow solution; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: weighted-path decision card → Carry the weighted-path decision card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M10 · Session 4 · Relaxation plus graph structure selects a path method**

1. Design brief: Implement or inspect one bounded a graph model of vertices, edges, reachability, and the question an algorithm actually answers slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/10_graph_algorithms_network_models.md` lines 262–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a path found by one traversal is automatically shortest, complete, or a flow solution
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a graph model of vertices, edges, reachability, and the question an algorithm actually answers mechanism and the smallest remaining uncertainty.

#### Session 5 · Dijkstra coordinates heap currency and finalization

**TA — Atlas TA · M10 · Session 5 · Dijkstra coordinates heap currency and finalization**

1. Opening problem: trace the `10/2/3` graph that creates an old `(10, a)` heap record after `a` improves to `5`.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/10_graph_algorithms_network_models.md` lines 262–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a graph model of vertices, edges, reachability, and the question an algorithm actually answers; predict a traversal or shortest-path state sequence from an edge list; which edge weights, direction, and graph assumptions make the conclusion legal; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a path found by one traversal is automatically shortest, complete, or a flow solution; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Dijkstra review card → Carry the Dijkstra review card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M10 · Session 5 · Dijkstra coordinates heap currency and finalization**

1. Design brief: Implement or inspect one bounded a graph model of vertices, edges, reachability, and the question an algorithm actually answers slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/10_graph_algorithms_network_models.md` lines 262–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a path found by one traversal is automatically shortest, complete, or a flow solution
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a graph model of vertices, edges, reachability, and the question an algorithm actually answers mechanism and the smallest remaining uncertainty.

#### Session 6 · Connectivity, spanning forests, and Atlas defense

**TA — Atlas TA · M10 · Session 6 · Connectivity, spanning forests, and Atlas defense**

1. Opening problem: contrast a shortest-path tree with an MST on the `2/2/1` triangle.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/10_graph_algorithms_network_models.md` lines 262–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a graph model of vertices, edges, reachability, and the question an algorithm actually answers; predict a traversal or shortest-path state sequence from an edge list; which edge weights, direction, and graph assumptions make the conclusion legal; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a path found by one traversal is automatically shortest, complete, or a flow solution; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: planner-role oral-defense map → Carry the planner-role oral-defense map into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M10 · Session 6 · Connectivity, spanning forests, and Atlas defense**

1. Design brief: Implement or inspect one bounded a graph model of vertices, edges, reachability, and the question an algorithm actually answers slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/10_graph_algorithms_network_models.md` lines 262–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a path found by one traversal is automatically shortest, complete, or a flow solution
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a graph model of vertices, edges, reachability, and the question an algorithm actually answers mechanism and the smallest remaining uncertainty.

### M11 · Algorithm Design Paradigms: Choosing a Strategy from Structure

Availability: **legacy-open** · Arc project: **Indexed retrieval and route planner** · Source map: [content/source-maps/arc_ii_source_map.md](../content/source-maps/arc_ii_source_map.md)

#### Session 1 · Formulate before optimizing

**TA — Atlas TA · M11 · Session 1 · Formulate before optimizing**

1. Opening problem: Start with a small algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/11_algorithm_design_paradigms.md` lines 376–392 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state; reconstruct why greedy, divide-and-conquer, dynamic programming, or search fits one problem; the structural property or counterexample that rules a tempting strategy in or out; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strategy that works on examples is justified or dynamic programming just means caching; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: problem contract and oracle boundary → Carry the problem contract and oracle boundary into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M11 · Session 1 · Formulate before optimizing**

1. Design brief: Implement or inspect one bounded algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/11_algorithm_design_paradigms.md` lines 376–392
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strategy that works on examples is justified or dynamic programming just means caching
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mechanism and the smallest remaining uncertainty.

#### Session 2 · Decomposition and safe commitment

**TA — Atlas TA · M11 · Session 2 · Decomposition and safe commitment**

1. Opening problem: Start with a small algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/11_algorithm_design_paradigms.md` lines 376–392 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state; reconstruct why greedy, divide-and-conquer, dynamic programming, or search fits one problem; the structural property or counterexample that rules a tempting strategy in or out; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strategy that works on examples is justified or dynamic programming just means caching; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: strategy proof and counterexample card → Carry the strategy proof and counterexample card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M11 · Session 2 · Decomposition and safe commitment**

1. Design brief: Implement or inspect one bounded algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/11_algorithm_design_paradigms.md` lines 376–392
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strategy that works on examples is justified or dynamic programming just means caching
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mechanism and the smallest remaining uncertainty.

#### Session 3 · Dynamic programming as a state DAG

**TA — Atlas TA · M11 · Session 3 · Dynamic programming as a state DAG**

1. Opening problem: Start with a small algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/11_algorithm_design_paradigms.md` lines 376–392 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state; reconstruct why greedy, divide-and-conquer, dynamic programming, or search fits one problem; the structural property or counterexample that rules a tempting strategy in or out; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strategy that works on examples is justified or dynamic programming just means caching; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: state-DAG and reconstruction note → Carry the state-DAG and reconstruction note into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M11 · Session 3 · Dynamic programming as a state DAG**

1. Design brief: Implement or inspect one bounded algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/11_algorithm_design_paradigms.md` lines 376–392
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strategy that works on examples is justified or dynamic programming just means caching
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mechanism and the smallest remaining uncertainty.

#### Session 4 · Search, pruning, and state sufficiency

**TA — Atlas TA · M11 · Session 4 · Search, pruning, and state sufficiency**

1. Opening problem: Start with a small algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/11_algorithm_design_paradigms.md` lines 376–392 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state; reconstruct why greedy, divide-and-conquer, dynamic programming, or search fits one problem; the structural property or counterexample that rules a tempting strategy in or out; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strategy that works on examples is justified or dynamic programming just means caching; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: pruning and state-sufficiency proof → Carry the pruning and state-sufficiency proof into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M11 · Session 4 · Search, pruning, and state sufficiency**

1. Design brief: Implement or inspect one bounded algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/11_algorithm_design_paradigms.md` lines 376–392
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strategy that works on examples is justified or dynamic programming just means caching
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mechanism and the smallest remaining uncertainty.

#### Session 5 · Randomness, approximation, and uncertainty

**TA — Atlas TA · M11 · Session 5 · Randomness, approximation, and uncertainty**

1. Opening problem: Start with a small algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/11_algorithm_design_paradigms.md` lines 376–392 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state; reconstruct why greedy, divide-and-conquer, dynamic programming, or search fits one problem; the structural property or counterexample that rules a tempting strategy in or out; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strategy that works on examples is justified or dynamic programming just means caching; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: probability and quality-bound ledger → Carry the probability and quality-bound ledger into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M11 · Session 5 · Randomness, approximation, and uncertainty**

1. Design brief: Implement or inspect one bounded algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/11_algorithm_design_paradigms.md` lines 376–392
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strategy that works on examples is justified or dynamic programming just means caching
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mechanism and the smallest remaining uncertainty.

#### Session 6 · Agent-directed Atlas strategy defense

**TA — Atlas TA · M11 · Session 6 · Agent-directed Atlas strategy defense**

1. Opening problem: Start with a small algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/11_algorithm_design_paradigms.md` lines 376–392 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state; reconstruct why greedy, divide-and-conquer, dynamic programming, or search fits one problem; the structural property or counterexample that rules a tempting strategy in or out; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strategy that works on examples is justified or dynamic programming just means caching; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: strategy-defense dossier → Carry the strategy-defense dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M11 · Session 6 · Agent-directed Atlas strategy defense**

1. Design brief: Implement or inspect one bounded algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state slice for Indexed retrieval and route planner.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/11_algorithm_design_paradigms.md` lines 376–392
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strategy that works on examples is justified or dynamic programming just means caching
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the algorithm strategy chosen from structure, recurrence, exchange argument, or subproblem state mechanism and the smallest remaining uncertainty.

### M12 · Modules, APIs, Types, and Dependency Direction

Availability: **legacy-open** · Arc project: **Durable evidence service** · Source map: [content/source-maps/arc_iii_source_map.md](../content/source-maps/arc_iii_source_map.md)

#### Session 1 · From one script to an import graph

**TA — Atlas TA · M12 · Session 1 · From one script to an import graph**

1. Opening problem: Start with a small dependency direction, interface ownership, and what a module may know or call mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: dependency direction, interface ownership, and what a module may know or call; read an import/API path and identify the contract crossing each boundary; what change would leak through the boundary and which dependency is owned by whom; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a type annotation or package boundary alone creates a stable architecture; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: import execution and dependency trace → Carry the import execution and dependency trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M12 · Session 1 · From one script to an import graph**

1. Design brief: Implement or inspect one bounded dependency direction, interface ownership, and what a module may know or call slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a type annotation or package boundary alone creates a stable architecture
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the dependency direction, interface ownership, and what a module may know or call mechanism and the smallest remaining uncertainty.

#### Session 2 · Public APIs as promises

**TA — Atlas TA · M12 · Session 2 · Public APIs as promises**

1. Opening problem: Start with a small dependency direction, interface ownership, and what a module may know or call mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: dependency direction, interface ownership, and what a module may know or call; read an import/API path and identify the contract crossing each boundary; what change would leak through the boundary and which dependency is owned by whom; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a type annotation or package boundary alone creates a stable architecture; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: public API observation card → Carry the public API observation card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M12 · Session 2 · Public APIs as promises**

1. Design brief: Implement or inspect one bounded dependency direction, interface ownership, and what a module may know or call slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a type annotation or package boundary alone creates a stable architecture
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the dependency direction, interface ownership, and what a module may know or call mechanism and the smallest remaining uncertainty.

#### Session 3 · Type relationships: narrowing, generics, and variance

**TA — Atlas TA · M12 · Session 3 · Type relationships: narrowing, generics, and variance**

1. Opening problem: Start with a small dependency direction, interface ownership, and what a module may know or call mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: dependency direction, interface ownership, and what a module may know or call; read an import/API path and identify the contract crossing each boundary; what change would leak through the boundary and which dependency is owned by whom; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a type annotation or package boundary alone creates a stable architecture; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: type-evidence boundary note → Carry the type-evidence boundary note into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M12 · Session 3 · Type relationships: narrowing, generics, and variance**

1. Design brief: Implement or inspect one bounded dependency direction, interface ownership, and what a module may know or call slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a type annotation or package boundary alone creates a stable architecture
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the dependency direction, interface ownership, and what a module may know or call mechanism and the smallest remaining uncertainty.

#### Session 4 · Structural ports and dependency inversion

**TA — Atlas TA · M12 · Session 4 · Structural ports and dependency inversion**

1. Opening problem: Start with a small dependency direction, interface ownership, and what a module may know or call mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: dependency direction, interface ownership, and what a module may know or call; read an import/API path and identify the contract crossing each boundary; what change would leak through the boundary and which dependency is owned by whom; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a type annotation or package boundary alone creates a stable architecture; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: client-owned port map → Carry the client-owned port map into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M12 · Session 4 · Structural ports and dependency inversion**

1. Design brief: Implement or inspect one bounded dependency direction, interface ownership, and what a module may know or call slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a type annotation or package boundary alone creates a stable architecture
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the dependency direction, interface ownership, and what a module may know or call mechanism and the smallest remaining uncertainty.

#### Session 5 · Plugin discovery, trust, and compatibility

**TA — Atlas TA · M12 · Session 5 · Plugin discovery, trust, and compatibility**

1. Opening problem: Start with a small dependency direction, interface ownership, and what a module may know or call mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: dependency direction, interface ownership, and what a module may know or call; read an import/API path and identify the contract crossing each boundary; what change would leak through the boundary and which dependency is owned by whom; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a type annotation or package boundary alone creates a stable architecture; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: plugin boundary decision sheet → Carry the plugin boundary decision sheet into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M12 · Session 5 · Plugin discovery, trust, and compatibility**

1. Design brief: Implement or inspect one bounded dependency direction, interface ownership, and what a module may know or call slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a type annotation or package boundary alone creates a stable architecture
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the dependency direction, interface ownership, and what a module may know or call mechanism and the smallest remaining uncertainty.

#### Session 6 · Atlas checkpoint: read, review, defend

**TA — Atlas TA · M12 · Session 6 · Atlas checkpoint: read, review, defend**

1. Opening problem: Start with a small dependency direction, interface ownership, and what a module may know or call mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: dependency direction, interface ownership, and what a module may know or call; read an import/API path and identify the contract crossing each boundary; what change would leak through the boundary and which dependency is owned by whom; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a type annotation or package boundary alone creates a stable architecture; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: architecture review dossier → Carry the architecture review dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M12 · Session 6 · Atlas checkpoint: read, review, defend**

1. Design brief: Implement or inspect one bounded dependency direction, interface ownership, and what a module may know or call slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/12_modules_apis_types_dependencies.md` lines 92–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a type annotation or package boundary alone creates a stable architecture
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the dependency direction, interface ownership, and what a module may know or call mechanism and the smallest remaining uncertainty.

### M13 · Specifications, Testing, Debugging, and Observability

Availability: **legacy-open** · Arc project: **Durable evidence service** · Source map: [content/source-maps/arc_iii_source_map.md](../content/source-maps/arc_iii_source_map.md)

#### Session 1 · Ambiguity becomes a behavioral contract

**TA — Atlas TA · M13 · Session 1 · Ambiguity becomes a behavioral contract**

1. Opening problem: Start with a small a specification as an observable contract supported by tests, debugging, and scoped observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a specification as an observable contract supported by tests, debugging, and scoped observation; trace a failing test to the claim it does and does not establish; the missing input, invariant, environment, or regression condition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a green suite proves correctness or a debugger observation is the whole explanation; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: M13 importer contract dossier → Carry the M13 importer contract dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M13 · Session 1 · Ambiguity becomes a behavioral contract**

1. Design brief: Implement or inspect one bounded a specification as an observable contract supported by tests, debugging, and scoped observation slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a green suite proves correctness or a debugger observation is the whole explanation
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a specification as an observable contract supported by tests, debugging, and scoped observation mechanism and the smallest remaining uncertainty.

#### Session 2 · Partition claims into finite evidence

**TA — Atlas TA · M13 · Session 2 · Partition claims into finite evidence**

1. Opening problem: Start with a small a specification as an observable contract supported by tests, debugging, and scoped observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a specification as an observable contract supported by tests, debugging, and scoped observation; trace a failing test to the claim it does and does not establish; the missing input, invariant, environment, or regression condition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a green suite proves correctness or a debugger observation is the whole explanation; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: M13 claim-to-test matrix → Carry the M13 claim-to-test matrix into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M13 · Session 2 · Partition claims into finite evidence**

1. Design brief: Implement or inspect one bounded a specification as an observable contract supported by tests, debugging, and scoped observation slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a green suite proves correctness or a debugger observation is the whole explanation
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a specification as an observable contract supported by tests, debugging, and scoped observation mechanism and the smallest remaining uncertainty.

#### Session 3 · Provider substitution, fixtures, and controlled doubles

**TA — Atlas TA · M13 · Session 3 · Provider substitution, fixtures, and controlled doubles**

1. Opening problem: Start with a small a specification as an observable contract supported by tests, debugging, and scoped observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a specification as an observable contract supported by tests, debugging, and scoped observation; trace a failing test to the claim it does and does not establish; the missing input, invariant, environment, or regression condition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a green suite proves correctness or a debugger observation is the whole explanation; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: M13 provider-contract suite and double rationale → Carry the M13 provider-contract suite and double rationale into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M13 · Session 3 · Provider substitution, fixtures, and controlled doubles**

1. Design brief: Implement or inspect one bounded a specification as an observable contract supported by tests, debugging, and scoped observation slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a green suite proves correctness or a debugger observation is the whole explanation
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a specification as an observable contract supported by tests, debugging, and scoped observation mechanism and the smallest remaining uncertainty.

#### Session 4 · From traceback to causal mechanism

**TA — Atlas TA · M13 · Session 4 · From traceback to causal mechanism**

1. Opening problem: Start with a small a specification as an observable contract supported by tests, debugging, and scoped observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a specification as an observable contract supported by tests, debugging, and scoped observation; trace a failing test to the claim it does and does not establish; the missing input, invariant, environment, or regression condition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a green suite proves correctness or a debugger observation is the whole explanation; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: M13 failure dossier and regression claim → Carry the M13 failure dossier and regression claim into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M13 · Session 4 · From traceback to causal mechanism**

1. Design brief: Implement or inspect one bounded a specification as an observable contract supported by tests, debugging, and scoped observation slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a green suite proves correctness or a debugger observation is the whole explanation
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a specification as an observable contract supported by tests, debugging, and scoped observation mechanism and the smallest remaining uncertainty.

#### Session 5 · Observable without surveillance or noise

**TA — Atlas TA · M13 · Session 5 · Observable without surveillance or noise**

1. Opening problem: Start with a small a specification as an observable contract supported by tests, debugging, and scoped observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a specification as an observable contract supported by tests, debugging, and scoped observation; trace a failing test to the claim it does and does not establish; the missing input, invariant, environment, or regression condition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a green suite proves correctness or a debugger observation is the whole explanation; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: M13 safe-signal and flake-control sheet → Carry the M13 safe-signal and flake-control sheet into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M13 · Session 5 · Observable without surveillance or noise**

1. Design brief: Implement or inspect one bounded a specification as an observable contract supported by tests, debugging, and scoped observation slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a green suite proves correctness or a debugger observation is the whole explanation
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a specification as an observable contract supported by tests, debugging, and scoped observation mechanism and the smallest remaining uncertainty.

#### Session 6 · Agent-directed Atlas evidence defense

**TA — Atlas TA · M13 · Session 6 · Agent-directed Atlas evidence defense**

1. Opening problem: Start with a small a specification as an observable contract supported by tests, debugging, and scoped observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a specification as an observable contract supported by tests, debugging, and scoped observation; trace a failing test to the claim it does and does not establish; the missing input, invariant, environment, or regression condition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a green suite proves correctness or a debugger observation is the whole explanation; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: M13 evidence-defense disposition memo → Carry the M13 evidence-defense disposition memo into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M13 · Session 6 · Agent-directed Atlas evidence defense**

1. Design brief: Implement or inspect one bounded a specification as an observable contract supported by tests, debugging, and scoped observation slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/13_specifications_testing_debugging_observability.md` lines 102–104
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a green suite proves correctness or a debugger observation is the whole explanation
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a specification as an observable contract supported by tests, debugging, and scoped observation mechanism and the smallest remaining uncertainty.

### M14 · Software Design and Change

Availability: **legacy-open** · Arc project: **Durable evidence service** · Source map: [content/source-maps/arc_iii_source_map.md](../content/source-maps/arc_iii_source_map.md)

#### Session 1 · Reconstruct pressure and observable behavior

**TA — Atlas TA · M14 · Session 1 · Reconstruct pressure and observable behavior**

1. Opening problem: Start with a small design boundaries that make likely change explicit without over-abstracting the present system mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/14_software_design_and_change.md` lines 320–352 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: design boundaries that make likely change explicit without over-abstracting the present system; compare two dependency designs and explain the change each makes cheap or risky; the actual volatility and evidence that justify a new abstraction; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to more layers, patterns, or classes automatically improve maintainability; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: preservation ledger and pressure map → Carry the preservation ledger and pressure map into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M14 · Session 1 · Reconstruct pressure and observable behavior**

1. Design brief: Implement or inspect one bounded design boundaries that make likely change explicit without over-abstracting the present system slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/14_software_design_and_change.md` lines 320–352
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: more layers, patterns, or classes automatically improve maintainability
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the design boundaries that make likely change explicit without over-abstracting the present system mechanism and the smallest remaining uncertainty.

#### Session 2 · Compare decompositions by change axis

**TA — Atlas TA · M14 · Session 2 · Compare decompositions by change axis**

1. Opening problem: Start with a small design boundaries that make likely change explicit without over-abstracting the present system mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/14_software_design_and_change.md` lines 320–352 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: design boundaries that make likely change explicit without over-abstracting the present system; compare two dependency designs and explain the change each makes cheap or risky; the actual volatility and evidence that justify a new abstraction; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to more layers, patterns, or classes automatically improve maintainability; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: responsibility and decomposition decision → Carry the responsibility and decomposition decision into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M14 · Session 2 · Compare decompositions by change axis**

1. Design brief: Implement or inspect one bounded design boundaries that make likely change explicit without over-abstracting the present system slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/14_software_design_and_change.md` lines 320–352
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: more layers, patterns, or classes automatically improve maintainability
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the design boundaries that make likely change explicit without over-abstracting the present system mechanism and the smallest remaining uncertainty.

#### Session 3 · Enforce state and failure boundaries

**TA — Atlas TA · M14 · Session 3 · Enforce state and failure boundaries**

1. Opening problem: Start with a small design boundaries that make likely change explicit without over-abstracting the present system mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/14_software_design_and_change.md` lines 320–352 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: design boundaries that make likely change explicit without over-abstracting the present system; compare two dependency designs and explain the change each makes cheap or risky; the actual volatility and evidence that justify a new abstraction; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to more layers, patterns, or classes automatically improve maintainability; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: state, failure, and retry boundary → Carry the state, failure, and retry boundary into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M14 · Session 3 · Enforce state and failure boundaries**

1. Design brief: Implement or inspect one bounded design boundaries that make likely change explicit without over-abstracting the present system slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/14_software_design_and_change.md` lines 320–352
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: more layers, patterns, or classes automatically improve maintainability
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the design boundaries that make likely change explicit without over-abstracting the present system mechanism and the smallest remaining uncertainty.

#### Session 4 · Stage a compatible refactor in the Git graph

**TA — Atlas TA · M14 · Session 4 · Stage a compatible refactor in the Git graph**

1. Opening problem: Start with a small design boundaries that make likely change explicit without over-abstracting the present system mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/14_software_design_and_change.md` lines 320–352 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: design boundaries that make likely change explicit without over-abstracting the present system; compare two dependency designs and explain the change each makes cheap or risky; the actual volatility and evidence that justify a new abstraction; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to more layers, patterns, or classes automatically improve maintainability; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: staged Git change and rollback conditions → Carry the staged Git change and rollback conditions into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M14 · Session 4 · Stage a compatible refactor in the Git graph**

1. Design brief: Implement or inspect one bounded design boundaries that make likely change explicit without over-abstracting the present system slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/14_software_design_and_change.md` lines 320–352
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: more layers, patterns, or classes automatically improve maintainability
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the design boundaries that make likely change explicit without over-abstracting the present system mechanism and the smallest remaining uncertainty.

#### Session 5 · Review an agent patch and localize a regression

**TA — Atlas TA · M14 · Session 5 · Review an agent patch and localize a regression**

1. Opening problem: Start with a small design boundaries that make likely change explicit without over-abstracting the present system mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/14_software_design_and_change.md` lines 320–352 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: design boundaries that make likely change explicit without over-abstracting the present system; compare two dependency designs and explain the change each makes cheap or risky; the actual volatility and evidence that justify a new abstraction; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to more layers, patterns, or classes automatically improve maintainability; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: evidence-led review and bisect predicate → Carry the evidence-led review and bisect predicate into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M14 · Session 5 · Review an agent patch and localize a regression**

1. Design brief: Implement or inspect one bounded design boundaries that make likely change explicit without over-abstracting the present system slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/14_software_design_and_change.md` lines 320–352
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: more layers, patterns, or classes automatically improve maintainability
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the design boundaries that make likely change explicit without over-abstracting the present system mechanism and the smallest remaining uncertainty.

#### Session 6 · Atlas change defense and handoff

**TA — Atlas TA · M14 · Session 6 · Atlas change defense and handoff**

1. Opening problem: Start with a small design boundaries that make likely change explicit without over-abstracting the present system mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/14_software_design_and_change.md` lines 320–352 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: design boundaries that make likely change explicit without over-abstracting the present system; compare two dependency designs and explain the change each makes cheap or risky; the actual volatility and evidence that justify a new abstraction; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to more layers, patterns, or classes automatically improve maintainability; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: change defense and M15 durable-boundary handoff → Carry the change defense and M15 durable-boundary handoff into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M14 · Session 6 · Atlas change defense and handoff**

1. Design brief: Implement or inspect one bounded design boundaries that make likely change explicit without over-abstracting the present system slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/14_software_design_and_change.md` lines 320–352
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: more layers, patterns, or classes automatically improve maintainability
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the design boundaries that make likely change explicit without over-abstracting the present system mechanism and the smallest remaining uncertainty.

### M15 · Files, Serialization, Packaging, and Delivery

Availability: **legacy-open** · Arc project: **Durable evidence service** · Source map: [content/source-maps/arc_iii_source_map.md](../content/source-maps/arc_iii_source_map.md)

#### Session 1 · One event crosses text, byte, and path boundaries

**TA — Atlas TA · M15 · Session 1 · One event crosses text, byte, and path boundaries**

1. Opening problem: Start with a small a versioned artifact crossing a serialization, packaging, or delivery boundary mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a versioned artifact crossing a serialization, packaging, or delivery boundary; trace data from in-memory model through encoding, validation, and a consumer contract; the version, schema, environment, and rollback assumptions behind a delivery claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a successful parse proves compatibility or a package install proves reproducibility; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: representation boundary trace → Carry the representation boundary trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M15 · Session 1 · One event crosses text, byte, and path boundaries**

1. Design brief: Implement or inspect one bounded a versioned artifact crossing a serialization, packaging, or delivery boundary slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a successful parse proves compatibility or a package install proves reproducibility
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a versioned artifact crossing a serialization, packaging, or delivery boundary mechanism and the smallest remaining uncertainty.

#### Session 2 · Resource lifetime becomes a publication failure timeline

**TA — Atlas TA · M15 · Session 2 · Resource lifetime becomes a publication failure timeline**

1. Opening problem: Start with a small a versioned artifact crossing a serialization, packaging, or delivery boundary mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a versioned artifact crossing a serialization, packaging, or delivery boundary; trace data from in-memory model through encoding, validation, and a consumer contract; the version, schema, environment, and rollback assumptions behind a delivery claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a successful parse proves compatibility or a package install proves reproducibility; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: resource and publication failure timeline → Carry the resource and publication failure timeline into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M15 · Session 2 · Resource lifetime becomes a publication failure timeline**

1. Design brief: Implement or inspect one bounded a versioned artifact crossing a serialization, packaging, or delivery boundary slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a successful parse proves compatibility or a package install proves reproducibility
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a versioned artifact crossing a serialization, packaging, or delivery boundary mechanism and the smallest remaining uncertainty.

#### Session 3 · A schema version becomes a migration and trust decision

**TA — Atlas TA · M15 · Session 3 · A schema version becomes a migration and trust decision**

1. Opening problem: Start with a small a versioned artifact crossing a serialization, packaging, or delivery boundary mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a versioned artifact crossing a serialization, packaging, or delivery boundary; trace data from in-memory model through encoding, validation, and a consumer contract; the version, schema, environment, and rollback assumptions behind a delivery claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a successful parse proves compatibility or a package install proves reproducibility; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: schema migration and trust contract → Carry the schema migration and trust contract into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M15 · Session 3 · A schema version becomes a migration and trust decision**

1. Design brief: Implement or inspect one bounded a versioned artifact crossing a serialization, packaging, or delivery boundary slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a successful parse proves compatibility or a package install proves reproducibility
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a versioned artifact crossing a serialization, packaging, or delivery boundary mechanism and the smallest remaining uncertainty.

#### Session 4 · Read, attack, and defend the Atlas bundle implementation

**TA — Atlas TA · M15 · Session 4 · Read, attack, and defend the Atlas bundle implementation**

1. Opening problem: Start with a small a versioned artifact crossing a serialization, packaging, or delivery boundary mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a versioned artifact crossing a serialization, packaging, or delivery boundary; trace data from in-memory model through encoding, validation, and a consumer contract; the version, schema, environment, and rollback assumptions behind a delivery claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a successful parse proves compatibility or a package install proves reproducibility; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: attack and defense boundary review → Carry the attack and defense boundary review into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M15 · Session 4 · Read, attack, and defend the Atlas bundle implementation**

1. Design brief: Implement or inspect one bounded a versioned artifact crossing a serialization, packaging, or delivery boundary slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a successful parse proves compatibility or a package install proves reproducibility
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a versioned artifact crossing a serialization, packaging, or delivery boundary mechanism and the smallest remaining uncertainty.

#### Session 5 · The source tree becomes an inspected installed command

**TA — Atlas TA · M15 · Session 5 · The source tree becomes an inspected installed command**

1. Opening problem: Start with a small a versioned artifact crossing a serialization, packaging, or delivery boundary mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a versioned artifact crossing a serialization, packaging, or delivery boundary; trace data from in-memory model through encoding, validation, and a consumer contract; the version, schema, environment, and rollback assumptions behind a delivery claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a successful parse proves compatibility or a package install proves reproducibility; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: artifact and clean-install receipt → Carry the artifact and clean-install receipt into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M15 · Session 5 · The source tree becomes an inspected installed command**

1. Design brief: Implement or inspect one bounded a versioned artifact crossing a serialization, packaging, or delivery boundary slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a successful parse proves compatibility or a package install proves reproducibility
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a versioned artifact crossing a serialization, packaging, or delivery boundary mechanism and the smallest remaining uncertainty.

#### Session 6 · Rehearse release, rollback, and agent-patch defense

**TA — Atlas TA · M15 · Session 6 · Rehearse release, rollback, and agent-patch defense**

1. Opening problem: Start with a small a versioned artifact crossing a serialization, packaging, or delivery boundary mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a versioned artifact crossing a serialization, packaging, or delivery boundary; trace data from in-memory model through encoding, validation, and a consumer contract; the version, schema, environment, and rollback assumptions behind a delivery claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a successful parse proves compatibility or a package install proves reproducibility; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: release and rollback defense with M16 handoff → Carry the release and rollback defense with M16 handoff into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M15 · Session 6 · Rehearse release, rollback, and agent-patch defense**

1. Design brief: Implement or inspect one bounded a versioned artifact crossing a serialization, packaging, or delivery boundary slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/15_files_serialization_packaging_delivery.md` lines 115–120
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a successful parse proves compatibility or a package install proves reproducibility
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a versioned artifact crossing a serialization, packaging, or delivery boundary mechanism and the smallest remaining uncertainty.

### M16 · Relational Data and Transactions

Availability: **legacy-open** · Arc project: **Durable evidence service** · Source map: [content/source-maps/arc_iii_source_map.md](../content/source-maps/arc_iii_source_map.md)

#### Session 1 · Derive relations from repeated facts, not table-shaped habit

**TA — Atlas TA · M16 · Session 1 · Derive relations from repeated facts, not table-shaped habit**

1. Opening problem: Start with a small relational invariants, transaction boundaries, and concurrent changes to shared facts mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/16_relational_data_transactions.md` lines 848–850 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: relational invariants, transaction boundaries, and concurrent changes to shared facts; walk through a failed or retried transaction and name the invariant at each durable step; the isolation, uniqueness, idempotency, and recovery assumptions needed for the claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a database automatically prevents every race or an application retry is harmless; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: fact, FD, key, and order derivation → Carry the fact, FD, key, and order derivation into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M16 · Session 1 · Derive relations from repeated facts, not table-shaped habit**

1. Design brief: Implement or inspect one bounded relational invariants, transaction boundaries, and concurrent changes to shared facts slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/16_relational_data_transactions.md` lines 848–850
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a database automatically prevents every race or an application retry is harmless
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the relational invariants, transaction boundaries, and concurrent changes to shared facts mechanism and the smallest remaining uncertainty.

#### Session 2 · Turn legal-state claims into constraints and a narrow port

**TA — Atlas TA · M16 · Session 2 · Turn legal-state claims into constraints and a narrow port**

1. Opening problem: Start with a small relational invariants, transaction boundaries, and concurrent changes to shared facts mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/16_relational_data_transactions.md` lines 848–850 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: relational invariants, transaction boundaries, and concurrent changes to shared facts; walk through a failed or retried transaction and name the invariant at each durable step; the isolation, uniqueness, idempotency, and recovery assumptions needed for the claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a database automatically prevents every race or an application retry is harmless; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: constraint and repository contract → Carry the constraint and repository contract into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M16 · Session 2 · Turn legal-state claims into constraints and a narrow port**

1. Design brief: Implement or inspect one bounded relational invariants, transaction boundaries, and concurrent changes to shared facts slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/16_relational_data_transactions.md` lines 848–850
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a database automatically prevents every race or an application retry is harmless
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the relational invariants, transaction boundaries, and concurrent changes to shared facts mechanism and the smallest remaining uncertainty.

#### Session 3 · Specify query results before reading syntax

**TA — Atlas TA · M16 · Session 3 · Specify query results before reading syntax**

1. Opening problem: Start with a small relational invariants, transaction boundaries, and concurrent changes to shared facts mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/16_relational_data_transactions.md` lines 848–850 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: relational invariants, transaction boundaries, and concurrent changes to shared facts; walk through a failed or retried transaction and name the invariant at each durable step; the isolation, uniqueness, idempotency, and recovery assumptions needed for the claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a database automatically prevents every race or an application retry is harmless; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: result contract and query reasoning → Carry the result contract and query reasoning into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M16 · Session 3 · Specify query results before reading syntax**

1. Design brief: Implement or inspect one bounded relational invariants, transaction boundaries, and concurrent changes to shared facts slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/16_relational_data_transactions.md` lines 848–850
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a database automatically prevents every race or an application retry is harmless
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the relational invariants, transaction boundaries, and concurrent changes to shared facts mechanism and the smallest remaining uncertainty.

#### Session 4 · Treat indexes and plans as measured strategy choices

**TA — Atlas TA · M16 · Session 4 · Treat indexes and plans as measured strategy choices**

1. Opening problem: Start with a small relational invariants, transaction boundaries, and concurrent changes to shared facts mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/16_relational_data_transactions.md` lines 848–850 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: relational invariants, transaction boundaries, and concurrent changes to shared facts; walk through a failed or retried transaction and name the invariant at each durable step; the isolation, uniqueness, idempotency, and recovery assumptions needed for the claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a database automatically prevents every race or an application retry is harmless; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: plan evidence and index decision → Carry the plan evidence and index decision into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M16 · Session 4 · Treat indexes and plans as measured strategy choices**

1. Design brief: Implement or inspect one bounded relational invariants, transaction boundaries, and concurrent changes to shared facts slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/16_relational_data_transactions.md` lines 848–850
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a database automatically prevents every race or an application retry is harmless
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the relational invariants, transaction boundaries, and concurrent changes to shared facts mechanism and the smallest remaining uncertainty.

#### Session 5 · Make import one transaction, then expose competition

**TA — Atlas TA · M16 · Session 5 · Make import one transaction, then expose competition**

1. Opening problem: Start with a small relational invariants, transaction boundaries, and concurrent changes to shared facts mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/16_relational_data_transactions.md` lines 848–850 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: relational invariants, transaction boundaries, and concurrent changes to shared facts; walk through a failed or retried transaction and name the invariant at each durable step; the isolation, uniqueness, idempotency, and recovery assumptions needed for the claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a database automatically prevents every race or an application retry is harmless; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: transaction schedule and retry boundary → Carry the transaction schedule and retry boundary into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M16 · Session 5 · Make import one transaction, then expose competition**

1. Design brief: Implement or inspect one bounded relational invariants, transaction boundaries, and concurrent changes to shared facts slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/16_relational_data_transactions.md` lines 848–850
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a database automatically prevents every race or an application retry is harmless
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the relational invariants, transaction boundaries, and concurrent changes to shared facts mechanism and the smallest remaining uncertainty.

#### Session 6 · Bound recovery; prove WAL is not backup

**TA — Atlas TA · M16 · Session 6 · Bound recovery; prove WAL is not backup**

1. Opening problem: Start with a small relational invariants, transaction boundaries, and concurrent changes to shared facts mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/16_relational_data_transactions.md` lines 848–850 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: relational invariants, transaction boundaries, and concurrent changes to shared facts; walk through a failed or retried transaction and name the invariant at each durable step; the isolation, uniqueness, idempotency, and recovery assumptions needed for the claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a database automatically prevents every race or an application retry is harmless; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: recovery, restore, and claim boundary → Carry the recovery, restore, and claim boundary into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M16 · Session 6 · Bound recovery; prove WAL is not backup**

1. Design brief: Implement or inspect one bounded relational invariants, transaction boundaries, and concurrent changes to shared facts slice for Durable evidence service.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/16_relational_data_transactions.md` lines 848–850
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a database automatically prevents every race or an application retry is harmless
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the relational invariants, transaction boundaries, and concurrent changes to shared facts mechanism and the smallest remaining uncertainty.

### M17 · Computer Architecture and the Execution Stack

Availability: **legacy-open** · Arc project: **Failure-aware local protocol** · Source map: [content/source-maps/module17_architecture_execution_source_map.md](../content/source-maps/module17_architecture_execution_source_map.md)

#### Session 1 · Make bits earn their meaning

**TA — Atlas TA · M17 · Session 1 · Make bits earn their meaning**

1. Opening problem: Start with a small the execution stack from source-level intent through machine-level representation and effects mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the execution stack from source-level intent through machine-level representation and effects; trace one Python operation across frames, calls, memory, and CPU-level constraints; the difference between language semantics, a compiler/interpreter mechanism, and a hardware observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to source syntax directly determines one universal machine behavior; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: representation and semantic trace → Carry the representation and semantic trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M17 · Session 1 · Make bits earn their meaning**

1. Design brief: Implement or inspect one bounded the execution stack from source-level intent through machine-level representation and effects slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: source syntax directly determines one universal machine behavior
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the execution stack from source-level intent through machine-level representation and effects mechanism and the smallest remaining uncertainty.

#### Session 2 · Derive remembered state from current-input logic

**TA — Atlas TA · M17 · Session 2 · Derive remembered state from current-input logic**

1. Opening problem: Start with a small the execution stack from source-level intent through machine-level representation and effects mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the execution stack from source-level intent through machine-level representation and effects; trace one Python operation across frames, calls, memory, and CPU-level constraints; the difference between language semantics, a compiler/interpreter mechanism, and a hardware observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to source syntax directly determines one universal machine behavior; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: state-table and clock-boundary trace → Carry the state-table and clock-boundary trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M17 · Session 2 · Derive remembered state from current-input logic**

1. Design brief: Implement or inspect one bounded the execution stack from source-level intent through machine-level representation and effects slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: source syntax directly determines one universal machine behavior
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the execution stack from source-level intent through machine-level representation and effects mechanism and the smallest remaining uncertainty.

#### Session 3 · Read instructions as state transitions

**TA — Atlas TA · M17 · Session 3 · Read instructions as state transitions**

1. Opening problem: Start with a small the execution stack from source-level intent through machine-level representation and effects mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the execution stack from source-level intent through machine-level representation and effects; trace one Python operation across frames, calls, memory, and CPU-level constraints; the difference between language semantics, a compiler/interpreter mechanism, and a hardware observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to source syntax directly determines one universal machine behavior; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: ISA state and call-convention trace → Carry the ISA state and call-convention trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M17 · Session 3 · Read instructions as state transitions**

1. Design brief: Implement or inspect one bounded the execution stack from source-level intent through machine-level representation and effects slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: source syntax directly determines one universal machine behavior
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the execution stack from source-level intent through machine-level representation and effects mechanism and the smallest remaining uncertainty.

#### Session 4 · Explain overlap and locality without promising hardware

**TA — Atlas TA · M17 · Session 4 · Explain overlap and locality without promising hardware**

1. Opening problem: Start with a small the execution stack from source-level intent through machine-level representation and effects mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the execution stack from source-level intent through machine-level representation and effects; trace one Python operation across frames, calls, memory, and CPU-level constraints; the difference between language semantics, a compiler/interpreter mechanism, and a hardware observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to source syntax directly determines one universal machine behavior; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: overlap/locality model and causal boundary → Carry the overlap/locality model and causal boundary into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M17 · Session 4 · Explain overlap and locality without promising hardware**

1. Design brief: Implement or inspect one bounded the execution stack from source-level intent through machine-level representation and effects slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: source syntax directly determines one universal machine behavior
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the execution stack from source-level intent through machine-level representation and effects mechanism and the smallest remaining uncertainty.

#### Session 5 · Bridge Python to the machine one owned layer at a time

**TA — Atlas TA · M17 · Session 5 · Bridge Python to the machine one owned layer at a time**

1. Opening problem: Start with a small the execution stack from source-level intent through machine-level representation and effects mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the execution stack from source-level intent through machine-level representation and effects; trace one Python operation across frames, calls, memory, and CPU-level constraints; the difference between language semantics, a compiler/interpreter mechanism, and a hardware observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to source syntax directly determines one universal machine behavior; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: execution-stack ownership and observation record → Carry the execution-stack ownership and observation record into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M17 · Session 5 · Bridge Python to the machine one owned layer at a time**

1. Design brief: Implement or inspect one bounded the execution stack from source-level intent through machine-level representation and effects slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: source syntax directly determines one universal machine behavior
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the execution stack from source-level intent through machine-level representation and effects mechanism and the smallest remaining uncertainty.

#### Session 6 · Review the incident and defend a bounded claim

**TA — Atlas TA · M17 · Session 6 · Review the incident and defend a bounded claim**

1. Opening problem: Start with a small the execution stack from source-level intent through machine-level representation and effects mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the execution stack from source-level intent through machine-level representation and effects; trace one Python operation across frames, calls, memory, and CPU-level constraints; the difference between language semantics, a compiler/interpreter mechanism, and a hardware observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to source syntax directly determines one universal machine behavior; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: bounded architecture claim and M28 handoff → Carry the bounded architecture claim and M28 handoff into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M17 · Session 6 · Review the incident and defend a bounded claim**

1. Design brief: Implement or inspect one bounded the execution stack from source-level intent through machine-level representation and effects slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/17_computer_architecture_execution_stack.md` lines 494–502
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: source syntax directly determines one universal machine behavior
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the execution stack from source-level intent through machine-level representation and effects mechanism and the smallest remaining uncertainty.

### M18 · Operating Systems and Resource Mediation

Availability: **legacy-open** · Arc project: **Failure-aware local protocol** · Source map: [content/source-maps/module18_operating_systems_source_map.md](../content/source-maps/module18_operating_systems_source_map.md)

#### Session 1 · Why a mediator exists

**TA — Atlas TA · M18 · Session 1 · Why a mediator exists**

1. Opening problem: Start with a small operating-system mediation of processes, memory, files, interruption, and resource lifetime mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: operating-system mediation of processes, memory, files, interruption, and resource lifetime; read an interruption trace and identify which resource state is durable, recoverable, or unknown; the ownership, flushing, and recovery evidence needed after failure; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a process exit, API return, or file close alone proves a complete published result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: ownership and privilege-boundary trace → Carry the ownership and privilege-boundary trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M18 · Session 1 · Why a mediator exists**

1. Design brief: Implement or inspect one bounded operating-system mediation of processes, memory, files, interruption, and resource lifetime slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a process exit, API return, or file close alone proves a complete published result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the operating-system mediation of processes, memory, files, interruption, and resource lifetime mechanism and the smallest remaining uncertainty.

#### Session 2 · Program, process, lifecycle, and scheduling

**TA — Atlas TA · M18 · Session 2 · Program, process, lifecycle, and scheduling**

1. Opening problem: Start with a small operating-system mediation of processes, memory, files, interruption, and resource lifetime mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: operating-system mediation of processes, memory, files, interruption, and resource lifetime; read an interruption trace and identify which resource state is durable, recoverable, or unknown; the ownership, flushing, and recovery evidence needed after failure; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a process exit, API return, or file close alone proves a complete published result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: lifecycle and scheduling state table → Carry the lifecycle and scheduling state table into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M18 · Session 2 · Program, process, lifecycle, and scheduling**

1. Design brief: Implement or inspect one bounded operating-system mediation of processes, memory, files, interruption, and resource lifetime slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a process exit, API return, or file close alone proves a complete published result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the operating-system mediation of processes, memory, files, interruption, and resource lifetime mechanism and the smallest remaining uncertainty.

#### Session 3 · Virtual memory and fault classification

**TA — Atlas TA · M18 · Session 3 · Virtual memory and fault classification**

1. Opening problem: Start with a small operating-system mediation of processes, memory, files, interruption, and resource lifetime mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: operating-system mediation of processes, memory, files, interruption, and resource lifetime; read an interruption trace and identify which resource state is durable, recoverable, or unknown; the ownership, flushing, and recovery evidence needed after failure; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a process exit, API return, or file close alone proves a complete published result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: translation and fault-classification trace → Carry the translation and fault-classification trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M18 · Session 3 · Virtual memory and fault classification**

1. Design brief: Implement or inspect one bounded operating-system mediation of processes, memory, files, interruption, and resource lifetime slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a process exit, API return, or file close alone proves a complete published result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the operating-system mediation of processes, memory, files, interruption, and resource lifetime mechanism and the smallest remaining uncertainty.

#### Session 4 · Names, open resources, caches, and authority

**TA — Atlas TA · M18 · Session 4 · Names, open resources, caches, and authority**

1. Opening problem: Start with a small operating-system mediation of processes, memory, files, interruption, and resource lifetime mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: operating-system mediation of processes, memory, files, interruption, and resource lifetime; read an interruption trace and identify which resource state is durable, recoverable, or unknown; the ownership, flushing, and recovery evidence needed after failure; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a process exit, API return, or file close alone proves a complete published result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: name, open-resource, and authority card → Carry the name, open-resource, and authority card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M18 · Session 4 · Names, open resources, caches, and authority**

1. Design brief: Implement or inspect one bounded operating-system mediation of processes, memory, files, interruption, and resource lifetime slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a process exit, API return, or file close alone proves a complete published result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the operating-system mediation of processes, memory, files, interruption, and resource lifetime mechanism and the smallest remaining uncertainty.

#### Session 5 · Shutdown as a fallible protocol

**TA — Atlas TA · M18 · Session 5 · Shutdown as a fallible protocol**

1. Opening problem: Start with a small operating-system mediation of processes, memory, files, interruption, and resource lifetime mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: operating-system mediation of processes, memory, files, interruption, and resource lifetime; read an interruption trace and identify which resource state is durable, recoverable, or unknown; the ownership, flushing, and recovery evidence needed after failure; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a process exit, API return, or file close alone proves a complete published result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: shutdown and recovery boundary → Carry the shutdown and recovery boundary into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M18 · Session 5 · Shutdown as a fallible protocol**

1. Design brief: Implement or inspect one bounded operating-system mediation of processes, memory, files, interruption, and resource lifetime slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a process exit, API return, or file close alone proves a complete published result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the operating-system mediation of processes, memory, files, interruption, and resource lifetime mechanism and the smallest remaining uncertainty.

#### Session 6 · Publication, recovery, and evidence defense

**TA — Atlas TA · M18 · Session 6 · Publication, recovery, and evidence defense**

1. Opening problem: Start with a small operating-system mediation of processes, memory, files, interruption, and resource lifetime mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: operating-system mediation of processes, memory, files, interruption, and resource lifetime; read an interruption trace and identify which resource state is durable, recoverable, or unknown; the ownership, flushing, and recovery evidence needed after failure; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a process exit, API return, or file close alone proves a complete published result; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: bounded operating-evidence dossier and M19 handoff → Carry the bounded operating-evidence dossier and M19 handoff into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M18 · Session 6 · Publication, recovery, and evidence defense**

1. Design brief: Implement or inspect one bounded operating-system mediation of processes, memory, files, interruption, and resource lifetime slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/18_operating_systems_resource_mediation.md` lines 512–519
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a process exit, API return, or file close alone proves a complete published result
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the operating-system mediation of processes, memory, files, interruption, and resource lifetime mechanism and the smallest remaining uncertainty.

### M19 · Concurrency and Parallelism

Availability: **legacy-open** · Arc project: **Failure-aware local protocol** · Source map: [content/source-maps/module19_concurrency_parallelism_source_map.md](../content/source-maps/module19_concurrency_parallelism_source_map.md)

#### Session 1 · A second worker creates histories

**TA — Atlas TA · M19 · Session 1 · A second worker creates histories**

1. Opening problem: Start with a small concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/19_concurrency_parallelism.md` lines 369–371 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules; reconstruct a short interleaving and state the violated or preserved invariant; what scheduling, visibility, and synchronization guarantees the reasoning needs; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a passing run rules out a race or parallelism is merely faster concurrency; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M19 · Session 1 · A second worker creates histories**

1. Design brief: Implement or inspect one bounded concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/19_concurrency_parallelism.md` lines 369–371
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a passing run rules out a race or parallelism is merely faster concurrency
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mechanism and the smallest remaining uncertainty.

#### Session 2 · Protect one logical transition

**TA — Atlas TA · M19 · Session 2 · Protect one logical transition**

1. Opening problem: Start with a small concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/19_concurrency_parallelism.md` lines 369–371 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules; reconstruct a short interleaving and state the violated or preserved invariant; what scheduling, visibility, and synchronization guarantees the reasoning needs; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a passing run rules out a race or parallelism is merely faster concurrency; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M19 · Session 2 · Protect one logical transition**

1. Design brief: Implement or inspect one bounded concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/19_concurrency_parallelism.md` lines 369–371
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a passing run rules out a race or parallelism is merely faster concurrency
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mechanism and the smallest remaining uncertainty.

#### Session 3 · Predicates, permits, and item ownership

**TA — Atlas TA · M19 · Session 3 · Predicates, permits, and item ownership**

1. Opening problem: Start with a small concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/19_concurrency_parallelism.md` lines 369–371 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules; reconstruct a short interleaving and state the violated or preserved invariant; what scheduling, visibility, and synchronization guarantees the reasoning needs; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a passing run rules out a race or parallelism is merely faster concurrency; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M19 · Session 3 · Predicates, permits, and item ownership**

1. Design brief: Implement or inspect one bounded concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/19_concurrency_parallelism.md` lines 369–371
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a passing run rules out a race or parallelism is merely faster concurrency
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mechanism and the smallest remaining uncertainty.

#### Session 4 · Progress can fail

**TA — Atlas TA · M19 · Session 4 · Progress can fail**

1. Opening problem: Start with a small concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/19_concurrency_parallelism.md` lines 369–371 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules; reconstruct a short interleaving and state the violated or preserved invariant; what scheduling, visibility, and synchronization guarantees the reasoning needs; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a passing run rules out a race or parallelism is merely faster concurrency; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M19 · Session 4 · Progress can fail**

1. Design brief: Implement or inspect one bounded concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/19_concurrency_parallelism.md` lines 369–371
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a passing run rules out a race or parallelism is merely faster concurrency
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mechanism and the smallest remaining uncertainty.

#### Session 5 · Choose the Python execution model from first principles

**TA — Atlas TA · M19 · Session 5 · Choose the Python execution model from first principles**

1. Opening problem: Start with a small concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/19_concurrency_parallelism.md` lines 369–371 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules; reconstruct a short interleaving and state the violated or preserved invariant; what scheduling, visibility, and synchronization guarantees the reasoning needs; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a passing run rules out a race or parallelism is merely faster concurrency; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M19 · Session 5 · Choose the Python execution model from first principles**

1. Design brief: Implement or inspect one bounded concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/19_concurrency_parallelism.md` lines 369–371
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a passing run rules out a race or parallelism is merely faster concurrency
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mechanism and the smallest remaining uncertainty.

#### Session 6 · Atlas multi-worker evidence defense

**TA — Atlas TA · M19 · Session 6 · Atlas multi-worker evidence defense**

1. Opening problem: Start with a small concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/19_concurrency_parallelism.md` lines 369–371 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules; reconstruct a short interleaving and state the violated or preserved invariant; what scheduling, visibility, and synchronization guarantees the reasoning needs; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a passing run rules out a race or parallelism is merely faster concurrency; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M19 · Session 6 · Atlas multi-worker evidence defense**

1. Design brief: Implement or inspect one bounded concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/19_concurrency_parallelism.md` lines 369–371
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a passing run rules out a race or parallelism is merely faster concurrency
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the concurrent histories, ownership, progress guarantees, and the difference between possible and observed schedules mechanism and the smallest remaining uncertainty.

### M20 · Networks and Application Protocols

Availability: **legacy-open** · Arc project: **Failure-aware local protocol** · Source map: [content/source-maps/module20_networks_protocols_source_map.md](../content/source-maps/module20_networks_protocols_source_map.md)

#### Session 1 · A name is not a remote effect

**TA — Atlas TA · M20 · Session 1 · A name is not a remote effect**

1. Opening problem: Start with a small an application protocol as a sequence of scoped messages, states, and durability claims mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/20_networks_application_protocols.md` lines 355–369 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an application protocol as a sequence of scoped messages, states, and durability claims; trace one request, response, retry, and timeout without inventing a remote fact; the protocol version, idempotency, ordering, and failure assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a local send or HTTP success proves the receiver durably applied the intended effect; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an application protocol as a sequence of scoped messages, states, and durability claims evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M20 · Session 1 · A name is not a remote effect**

1. Design brief: Implement or inspect one bounded an application protocol as a sequence of scoped messages, states, and durability claims slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/20_networks_application_protocols.md` lines 355–369
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a local send or HTTP success proves the receiver durably applied the intended effect
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an application protocol as a sequence of scoped messages, states, and durability claims mechanism and the smallest remaining uncertainty.

#### Session 2 · Transport carries bytes, not your request

**TA — Atlas TA · M20 · Session 2 · Transport carries bytes, not your request**

1. Opening problem: Start with a small an application protocol as a sequence of scoped messages, states, and durability claims mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/20_networks_application_protocols.md` lines 355–369 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an application protocol as a sequence of scoped messages, states, and durability claims; trace one request, response, retry, and timeout without inventing a remote fact; the protocol version, idempotency, ordering, and failure assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a local send or HTTP success proves the receiver durably applied the intended effect; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an application protocol as a sequence of scoped messages, states, and durability claims evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M20 · Session 2 · Transport carries bytes, not your request**

1. Design brief: Implement or inspect one bounded an application protocol as a sequence of scoped messages, states, and durability claims slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/20_networks_application_protocols.md` lines 355–369
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a local send or HTTP success proves the receiver durably applied the intended effect
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an application protocol as a sequence of scoped messages, states, and durability claims mechanism and the smallest remaining uncertainty.

#### Session 3 · A response is evidence with a scope

**TA — Atlas TA · M20 · Session 3 · A response is evidence with a scope**

1. Opening problem: Start with a small an application protocol as a sequence of scoped messages, states, and durability claims mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/20_networks_application_protocols.md` lines 355–369 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an application protocol as a sequence of scoped messages, states, and durability claims; trace one request, response, retry, and timeout without inventing a remote fact; the protocol version, idempotency, ordering, and failure assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a local send or HTTP success proves the receiver durably applied the intended effect; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an application protocol as a sequence of scoped messages, states, and durability claims evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M20 · Session 3 · A response is evidence with a scope**

1. Design brief: Implement or inspect one bounded an application protocol as a sequence of scoped messages, states, and durability claims slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/20_networks_application_protocols.md` lines 355–369
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a local send or HTTP success proves the receiver durably applied the intended effect
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an application protocol as a sequence of scoped messages, states, and durability claims mechanism and the smallest remaining uncertainty.

#### Session 4 · HTTP gives semantics; Atlas still owns policy

**TA — Atlas TA · M20 · Session 4 · HTTP gives semantics; Atlas still owns policy**

1. Opening problem: Start with a small an application protocol as a sequence of scoped messages, states, and durability claims mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/20_networks_application_protocols.md` lines 355–369 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an application protocol as a sequence of scoped messages, states, and durability claims; trace one request, response, retry, and timeout without inventing a remote fact; the protocol version, idempotency, ordering, and failure assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a local send or HTTP success proves the receiver durably applied the intended effect; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an application protocol as a sequence of scoped messages, states, and durability claims evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M20 · Session 4 · HTTP gives semantics; Atlas still owns policy**

1. Design brief: Implement or inspect one bounded an application protocol as a sequence of scoped messages, states, and durability claims slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/20_networks_application_protocols.md` lines 355–369
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a local send or HTTP success proves the receiver durably applied the intended effect
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an application protocol as a sequence of scoped messages, states, and durability claims mechanism and the smallest remaining uncertainty.

#### Session 5 · Retry is an epistemic problem before it is a loop

**TA — Atlas TA · M20 · Session 5 · Retry is an epistemic problem before it is a loop**

1. Opening problem: Start with a small an application protocol as a sequence of scoped messages, states, and durability claims mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/20_networks_application_protocols.md` lines 355–369 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an application protocol as a sequence of scoped messages, states, and durability claims; trace one request, response, retry, and timeout without inventing a remote fact; the protocol version, idempotency, ordering, and failure assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a local send or HTTP success proves the receiver durably applied the intended effect; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an application protocol as a sequence of scoped messages, states, and durability claims evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M20 · Session 5 · Retry is an epistemic problem before it is a loop**

1. Design brief: Implement or inspect one bounded an application protocol as a sequence of scoped messages, states, and durability claims slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/20_networks_application_protocols.md` lines 355–369
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a local send or HTTP success proves the receiver durably applied the intended effect
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an application protocol as a sequence of scoped messages, states, and durability claims mechanism and the smallest remaining uncertainty.

#### Session 6 · Make network knowledge auditable

**TA — Atlas TA · M20 · Session 6 · Make network knowledge auditable**

1. Opening problem: Start with a small an application protocol as a sequence of scoped messages, states, and durability claims mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/20_networks_application_protocols.md` lines 355–369 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an application protocol as a sequence of scoped messages, states, and durability claims; trace one request, response, retry, and timeout without inventing a remote fact; the protocol version, idempotency, ordering, and failure assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a local send or HTTP success proves the receiver durably applied the intended effect; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an application protocol as a sequence of scoped messages, states, and durability claims evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M20 · Session 6 · Make network knowledge auditable**

1. Design brief: Implement or inspect one bounded an application protocol as a sequence of scoped messages, states, and durability claims slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/20_networks_application_protocols.md` lines 355–369
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a local send or HTTP success proves the receiver durably applied the intended effect
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an application protocol as a sequence of scoped messages, states, and durability claims mechanism and the smallest remaining uncertainty.

### M21 · Async and Distributed Systems

Availability: **legacy-open** · Arc project: **Failure-aware local protocol** · Source map: [content/source-maps/module21_async_distributed_source_map.md](../content/source-maps/module21_async_distributed_source_map.md)

#### Session 1 · await releases control; it does not transfer responsibility

**TA — Atlas TA · M21 · Session 1 · await releases control; it does not transfer responsibility**

1. Opening problem: Start with a small partial failure, async coordination, and recovery without pretending a distributed system has global certainty mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/21_async_distributed_systems.md` lines 51–53 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: partial failure, async coordination, and recovery without pretending a distributed system has global certainty; walk through an event attempt and separate local completion, remote observation, and durable effect; the retry, ordering, timeout, and compensation assumptions behind the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to retries guarantee delivery exactly once or an awaited call made the whole workflow atomic; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact partial failure, async coordination, and recovery without pretending a distributed system has global certainty evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M21 · Session 1 · await releases control; it does not transfer responsibility**

1. Design brief: Implement or inspect one bounded partial failure, async coordination, and recovery without pretending a distributed system has global certainty slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/21_async_distributed_systems.md` lines 51–53
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: retries guarantee delivery exactly once or an awaited call made the whole workflow atomic
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the partial failure, async coordination, and recovery without pretending a distributed system has global certainty mechanism and the smallest remaining uncertainty.

#### Session 2 · Structured lifetime gives a boundary, not magic rollback

**TA — Atlas TA · M21 · Session 2 · Structured lifetime gives a boundary, not magic rollback**

1. Opening problem: Start with a small partial failure, async coordination, and recovery without pretending a distributed system has global certainty mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/21_async_distributed_systems.md` lines 51–53 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: partial failure, async coordination, and recovery without pretending a distributed system has global certainty; walk through an event attempt and separate local completion, remote observation, and durable effect; the retry, ordering, timeout, and compensation assumptions behind the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to retries guarantee delivery exactly once or an awaited call made the whole workflow atomic; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact partial failure, async coordination, and recovery without pretending a distributed system has global certainty evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M21 · Session 2 · Structured lifetime gives a boundary, not magic rollback**

1. Design brief: Implement or inspect one bounded partial failure, async coordination, and recovery without pretending a distributed system has global certainty slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/21_async_distributed_systems.md` lines 51–53
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: retries guarantee delivery exactly once or an awaited call made the whole workflow atomic
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the partial failure, async coordination, and recovery without pretending a distributed system has global certainty mechanism and the smallest remaining uncertainty.

#### Session 3 · Bounded admission makes overload a policy decision

**TA — Atlas TA · M21 · Session 3 · Bounded admission makes overload a policy decision**

1. Opening problem: Start with a small partial failure, async coordination, and recovery without pretending a distributed system has global certainty mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/21_async_distributed_systems.md` lines 51–53 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: partial failure, async coordination, and recovery without pretending a distributed system has global certainty; walk through an event attempt and separate local completion, remote observation, and durable effect; the retry, ordering, timeout, and compensation assumptions behind the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to retries guarantee delivery exactly once or an awaited call made the whole workflow atomic; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact partial failure, async coordination, and recovery without pretending a distributed system has global certainty evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M21 · Session 3 · Bounded admission makes overload a policy decision**

1. Design brief: Implement or inspect one bounded partial failure, async coordination, and recovery without pretending a distributed system has global certainty slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/21_async_distributed_systems.md` lines 51–53
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: retries guarantee delivery exactly once or an awaited call made the whole workflow atomic
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the partial failure, async coordination, and recovery without pretending a distributed system has global certainty mechanism and the smallest remaining uncertainty.

#### Session 4 · Partial failure is an evidence problem before it is retry code

**TA — Atlas TA · M21 · Session 4 · Partial failure is an evidence problem before it is retry code**

1. Opening problem: Start with a small partial failure, async coordination, and recovery without pretending a distributed system has global certainty mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/21_async_distributed_systems.md` lines 51–53 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: partial failure, async coordination, and recovery without pretending a distributed system has global certainty; walk through an event attempt and separate local completion, remote observation, and durable effect; the retry, ordering, timeout, and compensation assumptions behind the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to retries guarantee delivery exactly once or an awaited call made the whole workflow atomic; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact partial failure, async coordination, and recovery without pretending a distributed system has global certainty evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M21 · Session 4 · Partial failure is an evidence problem before it is retry code**

1. Design brief: Implement or inspect one bounded partial failure, async coordination, and recovery without pretending a distributed system has global certainty slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/21_async_distributed_systems.md` lines 51–53
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: retries guarantee delivery exactly once or an awaited call made the whole workflow atomic
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the partial failure, async coordination, and recovery without pretending a distributed system has global certainty mechanism and the smallest remaining uncertainty.

#### Session 5 · Time is a local instrument; order is a declared relation

**TA — Atlas TA · M21 · Session 5 · Time is a local instrument; order is a declared relation**

1. Opening problem: Start with a small partial failure, async coordination, and recovery without pretending a distributed system has global certainty mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/21_async_distributed_systems.md` lines 51–53 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: partial failure, async coordination, and recovery without pretending a distributed system has global certainty; walk through an event attempt and separate local completion, remote observation, and durable effect; the retry, ordering, timeout, and compensation assumptions behind the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to retries guarantee delivery exactly once or an awaited call made the whole workflow atomic; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact partial failure, async coordination, and recovery without pretending a distributed system has global certainty evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M21 · Session 5 · Time is a local instrument; order is a declared relation**

1. Design brief: Implement or inspect one bounded partial failure, async coordination, and recovery without pretending a distributed system has global certainty slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/21_async_distributed_systems.md` lines 51–53
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: retries guarantee delivery exactly once or an awaited call made the whole workflow atomic
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the partial failure, async coordination, and recovery without pretending a distributed system has global certainty mechanism and the smallest remaining uncertainty.

#### Session 6 · Consistency and availability are choices with assumptions

**TA — Atlas TA · M21 · Session 6 · Consistency and availability are choices with assumptions**

1. Opening problem: Start with a small partial failure, async coordination, and recovery without pretending a distributed system has global certainty mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/21_async_distributed_systems.md` lines 51–53 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: partial failure, async coordination, and recovery without pretending a distributed system has global certainty; walk through an event attempt and separate local completion, remote observation, and durable effect; the retry, ordering, timeout, and compensation assumptions behind the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to retries guarantee delivery exactly once or an awaited call made the whole workflow atomic; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact partial failure, async coordination, and recovery without pretending a distributed system has global certainty evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M21 · Session 6 · Consistency and availability are choices with assumptions**

1. Design brief: Implement or inspect one bounded partial failure, async coordination, and recovery without pretending a distributed system has global certainty slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/21_async_distributed_systems.md` lines 51–53
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: retries guarantee delivery exactly once or an awaited call made the whole workflow atomic
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the partial failure, async coordination, and recovery without pretending a distributed system has global certainty mechanism and the smallest remaining uncertainty.

### M22 · Security, Privacy & Trust Boundaries

Availability: **legacy-open** · Arc project: **Failure-aware local protocol** · Source map: [content/source-maps/module22_security_trust_source_map.md](../content/source-maps/module22_security_trust_source_map.md)

#### Session 1 · Trust-boundary atlas: what can Atlas lose, and where does meaning change?

**TA — Atlas TA · M22 · Session 1 · Trust-boundary atlas: what can Atlas lose, and where does meaning change?**

1. Opening problem: Start with a small trust boundaries among data, identity, authority, provenance, privacy, and human control mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: trust boundaries among data, identity, authority, provenance, privacy, and human control; follow one sensitive action through its actor, capability, data recipient, and audit evidence; who may act, what is retained, what is reversible, and what evidence is still missing; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to authentication, encryption, or a trusted vendor automatically establishes authorization and safety; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact trust boundaries among data, identity, authority, provenance, privacy, and human control evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M22 · Session 1 · Trust-boundary atlas: what can Atlas lose, and where does meaning change?**

1. Design brief: Implement or inspect one bounded trust boundaries among data, identity, authority, provenance, privacy, and human control slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: authentication, encryption, or a trusted vendor automatically establishes authorization and safety
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the trust boundaries among data, identity, authority, provenance, privacy, and human control mechanism and the smallest remaining uncertainty.

#### Session 2 · Identity-to-decision ladder: who may cause this effect?

**TA — Atlas TA · M22 · Session 2 · Identity-to-decision ladder: who may cause this effect?**

1. Opening problem: Start with a small trust boundaries among data, identity, authority, provenance, privacy, and human control mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: trust boundaries among data, identity, authority, provenance, privacy, and human control; follow one sensitive action through its actor, capability, data recipient, and audit evidence; who may act, what is retained, what is reversible, and what evidence is still missing; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to authentication, encryption, or a trusted vendor automatically establishes authorization and safety; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact trust boundaries among data, identity, authority, provenance, privacy, and human control evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M22 · Session 2 · Identity-to-decision ladder: who may cause this effect?**

1. Design brief: Implement or inspect one bounded trust boundaries among data, identity, authority, provenance, privacy, and human control slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: authentication, encryption, or a trusted vendor automatically establishes authorization and safety
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the trust boundaries among data, identity, authority, provenance, privacy, and human control mechanism and the smallest remaining uncertainty.

#### Session 3 · Data-to-authority pipeline: why one sanitize box cannot protect every sink

**TA — Atlas TA · M22 · Session 3 · Data-to-authority pipeline: why one sanitize box cannot protect every sink**

1. Opening problem: Start with a small trust boundaries among data, identity, authority, provenance, privacy, and human control mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: trust boundaries among data, identity, authority, provenance, privacy, and human control; follow one sensitive action through its actor, capability, data recipient, and audit evidence; who may act, what is retained, what is reversible, and what evidence is still missing; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to authentication, encryption, or a trusted vendor automatically establishes authorization and safety; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact trust boundaries among data, identity, authority, provenance, privacy, and human control evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M22 · Session 3 · Data-to-authority pipeline: why one sanitize box cannot protect every sink**

1. Design brief: Implement or inspect one bounded trust boundaries among data, identity, authority, provenance, privacy, and human control slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: authentication, encryption, or a trusted vendor automatically establishes authorization and safety
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the trust boundaries among data, identity, authority, provenance, privacy, and human control mechanism and the smallest remaining uncertainty.

#### Session 4 · Cryptographic purpose map: what does this primitive actually establish?

**TA — Atlas TA · M22 · Session 4 · Cryptographic purpose map: what does this primitive actually establish?**

1. Opening problem: Start with a small trust boundaries among data, identity, authority, provenance, privacy, and human control mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: trust boundaries among data, identity, authority, provenance, privacy, and human control; follow one sensitive action through its actor, capability, data recipient, and audit evidence; who may act, what is retained, what is reversible, and what evidence is still missing; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to authentication, encryption, or a trusted vendor automatically establishes authorization and safety; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact trust boundaries among data, identity, authority, provenance, privacy, and human control evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M22 · Session 4 · Cryptographic purpose map: what does this primitive actually establish?**

1. Design brief: Implement or inspect one bounded trust boundaries among data, identity, authority, provenance, privacy, and human control slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: authentication, encryption, or a trusted vendor automatically establishes authorization and safety
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the trust boundaries among data, identity, authority, provenance, privacy, and human control mechanism and the smallest remaining uncertainty.

#### Session 5 · Release provenance and human impact: what must be true to ship responsibly?

**TA — Atlas TA · M22 · Session 5 · Release provenance and human impact: what must be true to ship responsibly?**

1. Opening problem: Start with a small trust boundaries among data, identity, authority, provenance, privacy, and human control mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: trust boundaries among data, identity, authority, provenance, privacy, and human control; follow one sensitive action through its actor, capability, data recipient, and audit evidence; who may act, what is retained, what is reversible, and what evidence is still missing; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to authentication, encryption, or a trusted vendor automatically establishes authorization and safety; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact trust boundaries among data, identity, authority, provenance, privacy, and human control evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M22 · Session 5 · Release provenance and human impact: what must be true to ship responsibly?**

1. Design brief: Implement or inspect one bounded trust boundaries among data, identity, authority, provenance, privacy, and human control slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: authentication, encryption, or a trusted vendor automatically establishes authorization and safety
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the trust boundaries among data, identity, authority, provenance, privacy, and human control mechanism and the smallest remaining uncertainty.

#### Session 6 · Privacy-aware incident reconstruction: how do we learn without overclaiming?

**TA — Atlas TA · M22 · Session 6 · Privacy-aware incident reconstruction: how do we learn without overclaiming?**

1. Opening problem: Start with a small trust boundaries among data, identity, authority, provenance, privacy, and human control mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: trust boundaries among data, identity, authority, provenance, privacy, and human control; follow one sensitive action through its actor, capability, data recipient, and audit evidence; who may act, what is retained, what is reversible, and what evidence is still missing; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to authentication, encryption, or a trusted vendor automatically establishes authorization and safety; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact trust boundaries among data, identity, authority, provenance, privacy, and human control evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M22 · Session 6 · Privacy-aware incident reconstruction: how do we learn without overclaiming?**

1. Design brief: Implement or inspect one bounded trust boundaries among data, identity, authority, provenance, privacy, and human control slice for Failure-aware local protocol.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/22_security_privacy_trust_boundaries.md` lines 139–145
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: authentication, encryption, or a trusted vendor automatically establishes authorization and safety
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the trust boundaries among data, identity, authority, provenance, privacy, and human control mechanism and the smallest remaining uncertainty.

### M23 · Programming Languages, Interpreters & Bounded Evaluation

Availability: **legacy-open** · Arc project: **Inspectable language-and-evidence assistant** · Source map: [content/source-maps/module23_languages_interpreters_source_map.md](../content/source-maps/module23_languages_interpreters_source_map.md)

#### Session 1 · Text has form, not permission

**TA — Atlas TA · M23 · Session 1 · Text has form, not permission**

1. Opening problem: Start with a small the separation of text, syntax tree, evaluation, type/capability boundary, and authority mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/23_programming_languages_interpreters.md` lines 165–167 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the separation of text, syntax tree, evaluation, type/capability boundary, and authority; parse and evaluate a small expression while naming the permitted language and environment; the language, evaluation, resource, and authority limits that must be independently enforced; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to parsing validates safety or restricting syntax automatically controls capabilities; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the separation of text, syntax tree, evaluation, type/capability boundary, and authority evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M23 · Session 1 · Text has form, not permission**

1. Design brief: Implement or inspect one bounded the separation of text, syntax tree, evaluation, type/capability boundary, and authority slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/23_programming_languages_interpreters.md` lines 165–167
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: parsing validates safety or restricting syntax automatically controls capabilities
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the separation of text, syntax tree, evaluation, type/capability boundary, and authority mechanism and the smallest remaining uncertainty.

#### Session 2 · A tree gets meaning from rules

**TA — Atlas TA · M23 · Session 2 · A tree gets meaning from rules**

1. Opening problem: Start with a small the separation of text, syntax tree, evaluation, type/capability boundary, and authority mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/23_programming_languages_interpreters.md` lines 165–167 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the separation of text, syntax tree, evaluation, type/capability boundary, and authority; parse and evaluate a small expression while naming the permitted language and environment; the language, evaluation, resource, and authority limits that must be independently enforced; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to parsing validates safety or restricting syntax automatically controls capabilities; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the separation of text, syntax tree, evaluation, type/capability boundary, and authority evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M23 · Session 2 · A tree gets meaning from rules**

1. Design brief: Implement or inspect one bounded the separation of text, syntax tree, evaluation, type/capability boundary, and authority slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/23_programming_languages_interpreters.md` lines 165–167
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: parsing validates safety or restricting syntax automatically controls capabilities
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the separation of text, syntax tree, evaluation, type/capability boundary, and authority mechanism and the smallest remaining uncertainty.

#### Session 3 · Names live in environments; functions close over them

**TA — Atlas TA · M23 · Session 3 · Names live in environments; functions close over them**

1. Opening problem: Start with a small the separation of text, syntax tree, evaluation, type/capability boundary, and authority mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/23_programming_languages_interpreters.md` lines 165–167 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the separation of text, syntax tree, evaluation, type/capability boundary, and authority; parse and evaluate a small expression while naming the permitted language and environment; the language, evaluation, resource, and authority limits that must be independently enforced; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to parsing validates safety or restricting syntax automatically controls capabilities; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the separation of text, syntax tree, evaluation, type/capability boundary, and authority evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M23 · Session 3 · Names live in environments; functions close over them**

1. Design brief: Implement or inspect one bounded the separation of text, syntax tree, evaluation, type/capability boundary, and authority slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/23_programming_languages_interpreters.md` lines 165–167
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: parsing validates safety or restricting syntax automatically controls capabilities
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the separation of text, syntax tree, evaluation, type/capability boundary, and authority mechanism and the smallest remaining uncertainty.

#### Session 4 · Contracts make invalid states visible

**TA — Atlas TA · M23 · Session 4 · Contracts make invalid states visible**

1. Opening problem: Start with a small the separation of text, syntax tree, evaluation, type/capability boundary, and authority mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/23_programming_languages_interpreters.md` lines 165–167 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the separation of text, syntax tree, evaluation, type/capability boundary, and authority; parse and evaluate a small expression while naming the permitted language and environment; the language, evaluation, resource, and authority limits that must be independently enforced; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to parsing validates safety or restricting syntax automatically controls capabilities; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the separation of text, syntax tree, evaluation, type/capability boundary, and authority evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M23 · Session 4 · Contracts make invalid states visible**

1. Design brief: Implement or inspect one bounded the separation of text, syntax tree, evaluation, type/capability boundary, and authority slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/23_programming_languages_interpreters.md` lines 165–167
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: parsing validates safety or restricting syntax automatically controls capabilities
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the separation of text, syntax tree, evaluation, type/capability boundary, and authority mechanism and the smallest remaining uncertainty.

#### Session 5 · Bounded evaluation receives authority, never finds it

**TA — Atlas TA · M23 · Session 5 · Bounded evaluation receives authority, never finds it**

1. Opening problem: Start with a small the separation of text, syntax tree, evaluation, type/capability boundary, and authority mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/23_programming_languages_interpreters.md` lines 165–167 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the separation of text, syntax tree, evaluation, type/capability boundary, and authority; parse and evaluate a small expression while naming the permitted language and environment; the language, evaluation, resource, and authority limits that must be independently enforced; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to parsing validates safety or restricting syntax automatically controls capabilities; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the separation of text, syntax tree, evaluation, type/capability boundary, and authority evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M23 · Session 5 · Bounded evaluation receives authority, never finds it**

1. Design brief: Implement or inspect one bounded the separation of text, syntax tree, evaluation, type/capability boundary, and authority slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/23_programming_languages_interpreters.md` lines 165–167
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: parsing validates safety or restricting syntax automatically controls capabilities
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the separation of text, syntax tree, evaluation, type/capability boundary, and authority mechanism and the smallest remaining uncertainty.

#### Session 6 · Implementation evidence is not semantic law

**TA — Atlas TA · M23 · Session 6 · Implementation evidence is not semantic law**

1. Opening problem: Start with a small the separation of text, syntax tree, evaluation, type/capability boundary, and authority mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/23_programming_languages_interpreters.md` lines 165–167 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the separation of text, syntax tree, evaluation, type/capability boundary, and authority; parse and evaluate a small expression while naming the permitted language and environment; the language, evaluation, resource, and authority limits that must be independently enforced; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to parsing validates safety or restricting syntax automatically controls capabilities; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the separation of text, syntax tree, evaluation, type/capability boundary, and authority evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M23 · Session 6 · Implementation evidence is not semantic law**

1. Design brief: Implement or inspect one bounded the separation of text, syntax tree, evaluation, type/capability boundary, and authority slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/23_programming_languages_interpreters.md` lines 165–167
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: parsing validates safety or restricting syntax automatically controls capabilities
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the separation of text, syntax tree, evaluation, type/capability boundary, and authority mechanism and the smallest remaining uncertainty.

### M24 · CPython, Performance & Memory Evidence

Availability: **legacy-open** · Arc project: **Inspectable language-and-evidence assistant** · Source map: [content/source-maps/module24_cpython_performance_memory_source_map.md](../content/source-maps/module24_cpython_performance_memory_source_map.md)

#### Session 1 · Evidence before optimization

**TA — Atlas TA · M24 · Session 1 · Evidence before optimization**

1. Opening problem: Start with a small the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/24_cpython_performance_memory.md` lines 135–143 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation; read a measurement and reconstruct its workload, runtime, baseline, and limitation; which version, allocator, workload, hardware, and statistical limits prevent generalization; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to one benchmark or profiler output proves a portable performance claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M24 · Session 1 · Evidence before optimization**

1. Design brief: Implement or inspect one bounded the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/24_cpython_performance_memory.md` lines 135–143
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: one benchmark or profiler output proves a portable performance claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mechanism and the smallest remaining uncertainty.

#### Session 2 · Objects, aliases, and lifetime

**TA — Atlas TA · M24 · Session 2 · Objects, aliases, and lifetime**

1. Opening problem: Start with a small the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/24_cpython_performance_memory.md` lines 135–143 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation; read a measurement and reconstruct its workload, runtime, baseline, and limitation; which version, allocator, workload, hardware, and statistical limits prevent generalization; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to one benchmark or profiler output proves a portable performance claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M24 · Session 2 · Objects, aliases, and lifetime**

1. Design brief: Implement or inspect one bounded the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/24_cpython_performance_memory.md` lines 135–143
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: one benchmark or profiler output proves a portable performance claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mechanism and the smallest remaining uncertainty.

#### Session 3 · Cycles, collection, and resource ownership

**TA — Atlas TA · M24 · Session 3 · Cycles, collection, and resource ownership**

1. Opening problem: Start with a small the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/24_cpython_performance_memory.md` lines 135–143 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation; read a measurement and reconstruct its workload, runtime, baseline, and limitation; which version, allocator, workload, hardware, and statistical limits prevent generalization; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to one benchmark or profiler output proves a portable performance claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M24 · Session 3 · Cycles, collection, and resource ownership**

1. Design brief: Implement or inspect one bounded the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/24_cpython_performance_memory.md` lines 135–143
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: one benchmark or profiler output proves a portable performance claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mechanism and the smallest remaining uncertainty.

#### Session 4 · Allocation and memory lenses

**TA — Atlas TA · M24 · Session 4 · Allocation and memory lenses**

1. Opening problem: Start with a small the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/24_cpython_performance_memory.md` lines 135–143 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation; read a measurement and reconstruct its workload, runtime, baseline, and limitation; which version, allocator, workload, hardware, and statistical limits prevent generalization; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to one benchmark or profiler output proves a portable performance claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M24 · Session 4 · Allocation and memory lenses**

1. Design brief: Implement or inspect one bounded the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/24_cpython_performance_memory.md` lines 135–143
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: one benchmark or profiler output proves a portable performance claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mechanism and the smallest remaining uncertainty.

#### Session 5 · Source, code object, frame, bytecode

**TA — Atlas TA · M24 · Session 5 · Source, code object, frame, bytecode**

1. Opening problem: Start with a small the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/24_cpython_performance_memory.md` lines 135–143 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation; read a measurement and reconstruct its workload, runtime, baseline, and limitation; which version, allocator, workload, hardware, and statistical limits prevent generalization; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to one benchmark or profiler output proves a portable performance claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M24 · Session 5 · Source, code object, frame, bytecode**

1. Design brief: Implement or inspect one bounded the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/24_cpython_performance_memory.md` lines 135–143
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: one benchmark or profiler output proves a portable performance claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mechanism and the smallest remaining uncertainty.

#### Session 6 · Experiment and AI-patch review

**TA — Atlas TA · M24 · Session 6 · Experiment and AI-patch review**

1. Opening problem: Start with a small the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/24_cpython_performance_memory.md` lines 135–143 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation; read a measurement and reconstruct its workload, runtime, baseline, and limitation; which version, allocator, workload, hardware, and statistical limits prevent generalization; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to one benchmark or profiler output proves a portable performance claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M24 · Session 6 · Experiment and AI-patch review**

1. Design brief: Implement or inspect one bounded the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/24_cpython_performance_memory.md` lines 135–143
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: one benchmark or profiler output proves a portable performance claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the the boundary between a Python guarantee, CPython mechanism, and scoped benchmark observation mechanism and the smallest remaining uncertainty.

### M25 · Evidence-Grounded Intelligent & Human-Centered Systems

Availability: **preview** · Arc project: **Inspectable language-and-evidence assistant** · Source map: [content/source-maps/module25_evidence_grounded_intelligent_systems_source_map.md](../content/source-maps/module25_evidence_grounded_intelligent_systems_source_map.md)

#### Session 1 · A score is not a useful outcome

**TA — Atlas TA · M25 · Session 1 · A score is not a useful outcome**

1. Opening problem: Start with a small an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct; trace one suggestion from input through model/evidence, display policy, and a reversible human decision; the data lineage, evaluation scope, owner, consent, and rollback evidence needed for release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a high score, agent explanation, or green evaluation creates permission to act; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M25 · Session 1 · A score is not a useful outcome**

1. Design brief: Implement or inspect one bounded an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a high score, agent explanation, or green evaluation creates permission to act
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mechanism and the smallest remaining uncertainty.

#### Session 2 · Data becomes a claim only through lineage

**TA — Atlas TA · M25 · Session 2 · Data becomes a claim only through lineage**

1. Opening problem: Start with a small an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct; trace one suggestion from input through model/evidence, display policy, and a reversible human decision; the data lineage, evaluation scope, owner, consent, and rollback evidence needed for release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a high score, agent explanation, or green evaluation creates permission to act; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M25 · Session 2 · Data becomes a claim only through lineage**

1. Design brief: Implement or inspect one bounded an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a high score, agent explanation, or green evaluation creates permission to act
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mechanism and the smallest remaining uncertainty.

#### Session 3 · Candidates, rankers, and models do different jobs

**TA — Atlas TA · M25 · Session 3 · Candidates, rankers, and models do different jobs**

1. Opening problem: Start with a small an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct; trace one suggestion from input through model/evidence, display policy, and a reversible human decision; the data lineage, evaluation scope, owner, consent, and rollback evidence needed for release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a high score, agent explanation, or green evaluation creates permission to act; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M25 · Session 3 · Candidates, rankers, and models do different jobs**

1. Design brief: Implement or inspect one bounded an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a high score, agent explanation, or green evaluation creates permission to act
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mechanism and the smallest remaining uncertainty.

#### Session 4 · Evaluation, calibration, and uncertainty

**TA — Atlas TA · M25 · Session 4 · Evaluation, calibration, and uncertainty**

1. Opening problem: Start with a small an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct; trace one suggestion from input through model/evidence, display policy, and a reversible human decision; the data lineage, evaluation scope, owner, consent, and rollback evidence needed for release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a high score, agent explanation, or green evaluation creates permission to act; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M25 · Session 4 · Evaluation, calibration, and uncertainty**

1. Design brief: Implement or inspect one bounded an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a high score, agent explanation, or green evaluation creates permission to act
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mechanism and the smallest remaining uncertainty.

#### Session 5 · Explanations, accessibility, and meaningful control

**TA — Atlas TA · M25 · Session 5 · Explanations, accessibility, and meaningful control**

1. Opening problem: Start with a small an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct; trace one suggestion from input through model/evidence, display policy, and a reversible human decision; the data lineage, evaluation scope, owner, consent, and rollback evidence needed for release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a high score, agent explanation, or green evaluation creates permission to act; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M25 · Session 5 · Explanations, accessibility, and meaningful control**

1. Design brief: Implement or inspect one bounded an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a high score, agent explanation, or green evaluation creates permission to act
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mechanism and the smallest remaining uncertainty.

#### Session 6 · AI/agent proposals are systems, not authorities

**TA — Atlas TA · M25 · Session 6 · AI/agent proposals are systems, not authorities**

1. Opening problem: Start with a small an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct; trace one suggestion from input through model/evidence, display policy, and a reversible human decision; the data lineage, evaluation scope, owner, consent, and rollback evidence needed for release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a high score, agent explanation, or green evaluation creates permission to act; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M25 · Session 6 · AI/agent proposals are systems, not authorities**

1. Design brief: Implement or inspect one bounded an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/25_evidence_grounded_intelligent_systems.md` lines 284–294
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a high score, agent explanation, or green evaluation creates permission to act
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an evidence-grounded decision that keeps model output, authority, uncertainty, and human control distinct mechanism and the smallest remaining uncertainty.

### M26 · Systems Capstone, Open-Source Stewardship & Oral Architecture Defense

Availability: **preview** · Arc project: **Inspectable language-and-evidence assistant** · Source map: [content/source-maps/module26_systems_capstone_source_map.md](../content/source-maps/module26_systems_capstone_source_map.md)

#### Session 1 · Release claims begin with a boundary

**TA — Atlas TA · M26 · Session 1 · Release claims begin with a boundary**

1. Opening problem: Start with a small a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback; defend one architecture thread while a reviewer changes a premise or removes an evidence source; the owner, recovery path, uncertainty, and changed constraint that should narrow, defer, or disable the release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a polished demo, CI pass, or agent-generated dossier is a release decision; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M26 · Session 1 · Release claims begin with a boundary**

1. Design brief: Implement or inspect one bounded a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a polished demo, CI pass, or agent-generated dossier is a release decision
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mechanism and the smallest remaining uncertainty.

#### Session 2 · Architecture is a traceable set of responsibilities

**TA — Atlas TA · M26 · Session 2 · Architecture is a traceable set of responsibilities**

1. Opening problem: Start with a small a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback; defend one architecture thread while a reviewer changes a premise or removes an evidence source; the owner, recovery path, uncertainty, and changed constraint that should narrow, defer, or disable the release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a polished demo, CI pass, or agent-generated dossier is a release decision; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M26 · Session 2 · Architecture is a traceable set of responsibilities**

1. Design brief: Implement or inspect one bounded a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a polished demo, CI pass, or agent-generated dossier is a release decision
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mechanism and the smallest remaining uncertainty.

#### Session 3 · A retry is a systems event, not a duplicate line of code

**TA — Atlas TA · M26 · Session 3 · A retry is a systems event, not a duplicate line of code**

1. Opening problem: Start with a small a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback; defend one architecture thread while a reviewer changes a premise or removes an evidence source; the owner, recovery path, uncertainty, and changed constraint that should narrow, defer, or disable the release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a polished demo, CI pass, or agent-generated dossier is a release decision; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M26 · Session 3 · A retry is a systems event, not a duplicate line of code**

1. Design brief: Implement or inspect one bounded a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a polished demo, CI pass, or agent-generated dossier is a release decision
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mechanism and the smallest remaining uncertainty.

#### Session 4 · A patch is a supply-chain and ownership proposal

**TA — Atlas TA · M26 · Session 4 · A patch is a supply-chain and ownership proposal**

1. Opening problem: Start with a small a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback; defend one architecture thread while a reviewer changes a premise or removes an evidence source; the owner, recovery path, uncertainty, and changed constraint that should narrow, defer, or disable the release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a polished demo, CI pass, or agent-generated dossier is a release decision; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M26 · Session 4 · A patch is a supply-chain and ownership proposal**

1. Design brief: Implement or inspect one bounded a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a polished demo, CI pass, or agent-generated dossier is a release decision
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mechanism and the smallest remaining uncertainty.

#### Session 5 · Operational evidence is scoped evidence

**TA — Atlas TA · M26 · Session 5 · Operational evidence is scoped evidence**

1. Opening problem: Start with a small a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback; defend one architecture thread while a reviewer changes a premise or removes an evidence source; the owner, recovery path, uncertainty, and changed constraint that should narrow, defer, or disable the release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a polished demo, CI pass, or agent-generated dossier is a release decision; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M26 · Session 5 · Operational evidence is scoped evidence**

1. Design brief: Implement or inspect one bounded a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a polished demo, CI pass, or agent-generated dossier is a release decision
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mechanism and the smallest remaining uncertainty.

#### Session 6 · The defense tests the architecture, not presentation skill

**TA — Atlas TA · M26 · Session 6 · The defense tests the architecture, not presentation skill**

1. Opening problem: Start with a small a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback; defend one architecture thread while a reviewer changes a premise or removes an evidence source; the owner, recovery path, uncertainty, and changed constraint that should narrow, defer, or disable the release; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a polished demo, CI pass, or agent-generated dossier is a release decision; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M26 · Session 6 · The defense tests the architecture, not presentation skill**

1. Design brief: Implement or inspect one bounded a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback slice for Inspectable language-and-evidence assistant.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/26_systems_capstone_open_source_stewardship.md` lines 418–422
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a polished demo, CI pass, or agent-generated dossier is a release decision
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a release argument joining architecture, invariant, test/observation, human impact, limitation, and rollback mechanism and the smallest remaining uncertainty.

### M27 · Discrete Mathematics, Proof, Counting & Structures

Availability: **legacy-open** · Arc project: **Mathematical and reliable-learning notebook** · Source map: [content/source-maps/module27_discrete_mathematics_proof_counting_structures_source_map.md](../content/source-maps/module27_discrete_mathematics_proof_counting_structures_source_map.md)

#### Session 1 · Definitions, logic, and countermodels

**TA — Atlas TA · M27 · Session 1 · Definitions, logic, and countermodels**

1. Opening problem: Start with a small definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample; reconstruct a proof or recurrence argument, then distinguish it from a finite Python trace; the missing quantifier, base case, invariant, or hypothesis that makes a claim false; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to examples prove universals or a recurrence is complete without bases and a domain; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M27 · Session 1 · Definitions, logic, and countermodels**

1. Design brief: Implement or inspect one bounded definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: examples prove universals or a recurrence is complete without bases and a domain
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mechanism and the smallest remaining uncertainty.

#### Session 2 · Proof construction, induction, invariants, and extremal choice

**TA — Atlas TA · M27 · Session 2 · Proof construction, induction, invariants, and extremal choice**

1. Opening problem: Start with a small definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample; reconstruct a proof or recurrence argument, then distinguish it from a finite Python trace; the missing quantifier, base case, invariant, or hypothesis that makes a claim false; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to examples prove universals or a recurrence is complete without bases and a domain; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M27 · Session 2 · Proof construction, induction, invariants, and extremal choice**

1. Design brief: Implement or inspect one bounded definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: examples prove universals or a recurrence is complete without bases and a domain
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mechanism and the smallest remaining uncertainty.

#### Session 3 · Counting, recurrences, generating functions, and asymptotics

**TA — Atlas TA · M27 · Session 3 · Counting, recurrences, generating functions, and asymptotics**

1. Opening problem: Start with a small definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample; reconstruct a proof or recurrence argument, then distinguish it from a finite Python trace; the missing quantifier, base case, invariant, or hypothesis that makes a claim false; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to examples prove universals or a recurrence is complete without bases and a domain; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M27 · Session 3 · Counting, recurrences, generating functions, and asymptotics**

1. Design brief: Implement or inspect one bounded definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: examples prove universals or a recurrence is complete without bases and a domain
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mechanism and the smallest remaining uncertainty.

#### Session 4 · Graphs, trees, connectivity, and matchings

**TA — Atlas TA · M27 · Session 4 · Graphs, trees, connectivity, and matchings**

1. Opening problem: Start with a small definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample; reconstruct a proof or recurrence argument, then distinguish it from a finite Python trace; the missing quantifier, base case, invariant, or hypothesis that makes a claim false; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to examples prove universals or a recurrence is complete without bases and a domain; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M27 · Session 4 · Graphs, trees, connectivity, and matchings**

1. Design brief: Implement or inspect one bounded definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: examples prove universals or a recurrence is complete without bases and a domain
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mechanism and the smallest remaining uncertainty.

#### Session 5 · Partial orders, lattices, and elementary number theory

**TA — Atlas TA · M27 · Session 5 · Partial orders, lattices, and elementary number theory**

1. Opening problem: Start with a small definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample; reconstruct a proof or recurrence argument, then distinguish it from a finite Python trace; the missing quantifier, base case, invariant, or hypothesis that makes a claim false; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to examples prove universals or a recurrence is complete without bases and a domain; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M27 · Session 5 · Partial orders, lattices, and elementary number theory**

1. Design brief: Implement or inspect one bounded definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: examples prove universals or a recurrence is complete without bases and a domain
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mechanism and the smallest remaining uncertainty.

#### Session 6 · Integrate the models: proof dossier and AI review

**TA — Atlas TA · M27 · Session 6 · Integrate the models: proof dossier and AI review**

1. Opening problem: Start with a small definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample; reconstruct a proof or recurrence argument, then distinguish it from a finite Python trace; the missing quantifier, base case, invariant, or hypothesis that makes a claim false; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to examples prove universals or a recurrence is complete without bases and a domain; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M27 · Session 6 · Integrate the models: proof dossier and AI review**

1. Design brief: Implement or inspect one bounded definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/27_discrete_mathematics_proof_counting_structures.md` lines 336–341
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: examples prove universals or a recurrence is complete without bases and a domain
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the definitions, quantifiers, induction/invariants, counting structure, and a minimal counterexample mechanism and the smallest remaining uncertainty.

### M28 · Linear Algebra, Numerical Stability & Representation

Availability: **legacy-open** · Arc project: **Mathematical and reliable-learning notebook** · Source map: [content/source-maps/module28_linear_algebra_numerical_stability_representation_source_map.md](../content/source-maps/module28_linear_algebra_numerical_stability_representation_source_map.md)

#### Session 1 · Vectors, spaces, coordinates, rank, and lost directions

**TA — Atlas TA · M28 · Session 1 · Vectors, spaces, coordinates, rank, and lost directions**

1. Opening problem: Start with a small linear maps, projections, rank, spectra, and conditioning as a model of representable information mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: linear maps, projections, rank, spectra, and conditioning as a model of representable information; derive least squares, a projection, or PCA from its assumptions, then audit one shape/dtype/solver path and finite-precision boundary; the conditioning, scale, rank, and approximation assumptions behind the numerical result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a matrix formula automatically yields a stable computation or PCA is merely an API call; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact linear maps, projections, rank, spectra, and conditioning as a model of representable information evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M28 · Session 1 · Vectors, spaces, coordinates, rank, and lost directions**

1. Design brief: Implement or inspect one bounded linear maps, projections, rank, spectra, and conditioning as a model of representable information slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a matrix formula automatically yields a stable computation or PCA is merely an API call
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the linear maps, projections, rank, spectra, and conditioning as a model of representable information mechanism and the smallest remaining uncertainty.

#### Session 2 · Inner products, orthogonality, projection, and least squares

**TA — Atlas TA · M28 · Session 2 · Inner products, orthogonality, projection, and least squares**

1. Opening problem: Start with a small linear maps, projections, rank, spectra, and conditioning as a model of representable information mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: linear maps, projections, rank, spectra, and conditioning as a model of representable information; derive least squares, a projection, or PCA from its assumptions, then audit one shape/dtype/solver path and finite-precision boundary; the conditioning, scale, rank, and approximation assumptions behind the numerical result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a matrix formula automatically yields a stable computation or PCA is merely an API call; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact linear maps, projections, rank, spectra, and conditioning as a model of representable information evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M28 · Session 2 · Inner products, orthogonality, projection, and least squares**

1. Design brief: Implement or inspect one bounded linear maps, projections, rank, spectra, and conditioning as a model of representable information slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a matrix formula automatically yields a stable computation or PCA is merely an API call
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the linear maps, projections, rank, spectra, and conditioning as a model of representable information mechanism and the smallest remaining uncertainty.

#### Session 3 · Eigenstructure, symmetric maps, PSD matrices, and the spectral theorem

**TA — Atlas TA · M28 · Session 3 · Eigenstructure, symmetric maps, PSD matrices, and the spectral theorem**

1. Opening problem: Start with a small linear maps, projections, rank, spectra, and conditioning as a model of representable information mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: linear maps, projections, rank, spectra, and conditioning as a model of representable information; derive least squares, a projection, or PCA from its assumptions, then audit one shape/dtype/solver path and finite-precision boundary; the conditioning, scale, rank, and approximation assumptions behind the numerical result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a matrix formula automatically yields a stable computation or PCA is merely an API call; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact linear maps, projections, rank, spectra, and conditioning as a model of representable information evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M28 · Session 3 · Eigenstructure, symmetric maps, PSD matrices, and the spectral theorem**

1. Design brief: Implement or inspect one bounded linear maps, projections, rank, spectra, and conditioning as a model of representable information slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a matrix formula automatically yields a stable computation or PCA is merely an API call
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the linear maps, projections, rank, spectra, and conditioning as a model of representable information mechanism and the smallest remaining uncertainty.

#### Session 4 · SVD, low-rank approximation, conditioning, and stable computation

**TA — Atlas TA · M28 · Session 4 · SVD, low-rank approximation, conditioning, and stable computation**

1. Opening problem: Start with a small linear maps, projections, rank, spectra, and conditioning as a model of representable information mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: linear maps, projections, rank, spectra, and conditioning as a model of representable information; derive least squares, a projection, or PCA from its assumptions, then audit one shape/dtype/solver path and finite-precision boundary; the conditioning, scale, rank, and approximation assumptions behind the numerical result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a matrix formula automatically yields a stable computation or PCA is merely an API call; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact linear maps, projections, rank, spectra, and conditioning as a model of representable information evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M28 · Session 4 · SVD, low-rank approximation, conditioning, and stable computation**

1. Design brief: Implement or inspect one bounded linear maps, projections, rank, spectra, and conditioning as a model of representable information slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a matrix formula automatically yields a stable computation or PCA is merely an API call
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the linear maps, projections, rank, spectra, and conditioning as a model of representable information mechanism and the smallest remaining uncertainty.

#### Session 5 · Tensors, matrix calculus, and the representation-to-computation boundary

**TA — Atlas TA · M28 · Session 5 · Tensors, matrix calculus, and the representation-to-computation boundary**

1. Opening problem: Start with a small linear maps, projections, rank, spectra, and conditioning as a model of representable information mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: linear maps, projections, rank, spectra, and conditioning as a model of representable information; derive least squares, a projection, or PCA from its assumptions, then audit one shape/dtype/solver path and finite-precision boundary; the conditioning, scale, rank, and approximation assumptions behind the numerical result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a matrix formula automatically yields a stable computation or PCA is merely an API call; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact linear maps, projections, rank, spectra, and conditioning as a model of representable information evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M28 · Session 5 · Tensors, matrix calculus, and the representation-to-computation boundary**

1. Design brief: Implement or inspect one bounded linear maps, projections, rank, spectra, and conditioning as a model of representable information slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a matrix formula automatically yields a stable computation or PCA is merely an API call
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the linear maps, projections, rank, spectra, and conditioning as a model of representable information mechanism and the smallest remaining uncertainty.

#### Session 6 · PCA from variance and low-rank approximation; representation dossier

**TA — Atlas TA · M28 · Session 6 · PCA from variance and low-rank approximation; representation dossier**

1. Opening problem: Start with a small linear maps, projections, rank, spectra, and conditioning as a model of representable information mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: linear maps, projections, rank, spectra, and conditioning as a model of representable information; derive least squares, a projection, or PCA from its assumptions, then audit one shape/dtype/solver path and finite-precision boundary; the conditioning, scale, rank, and approximation assumptions behind the numerical result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a matrix formula automatically yields a stable computation or PCA is merely an API call; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact linear maps, projections, rank, spectra, and conditioning as a model of representable information evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M28 · Session 6 · PCA from variance and low-rank approximation; representation dossier**

1. Design brief: Implement or inspect one bounded linear maps, projections, rank, spectra, and conditioning as a model of representable information slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/28_linear_algebra_numerical_stability_representation.md` lines 322–324
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a matrix formula automatically yields a stable computation or PCA is merely an API call
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the linear maps, projections, rank, spectra, and conditioning as a model of representable information mechanism and the smallest remaining uncertainty.

### M29 · Calculus, Real Analysis & Continuous Change

Availability: **legacy-open** · Arc project: **Mathematical and reliable-learning notebook** · Source map: [content/source-maps/module29_calculus_real_analysis_continuous_change_source_map.md](../content/source-maps/module29_calculus_real_analysis_continuous_change_source_map.md)

#### Session 1 · Limits, continuity, metric spaces, and compactness

**TA — Atlas TA · M29 · Session 1 · Limits, continuity, metric spaces, and compactness**

1. Opening problem: Start with a small a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition; derive a limit/Taylor/Jacobian/change-of-variables or convergence step, then audit one shape, unit, dtype, step, tolerance, or solver trace; the continuity, differentiability, region/injectivity, convergence, regularity, and finite-precision assumptions that can fail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M29 · Session 1 · Limits, continuity, metric spaces, and compactness**

1. Design brief: Implement or inspect one bounded a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mechanism and the smallest remaining uncertainty.

#### Session 2 · Derivatives, mean value, Taylor approximation, and finite differences

**TA — Atlas TA · M29 · Session 2 · Derivatives, mean value, Taylor approximation, and finite differences**

1. Opening problem: Start with a small a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition; derive a limit/Taylor/Jacobian/change-of-variables or convergence step, then audit one shape, unit, dtype, step, tolerance, or solver trace; the continuity, differentiability, region/injectivity, convergence, regularity, and finite-precision assumptions that can fail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M29 · Session 2 · Derivatives, mean value, Taylor approximation, and finite differences**

1. Design brief: Implement or inspect one bounded a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mechanism and the smallest remaining uncertainty.

#### Session 3 · Integration, the Fundamental Theorem, multiple integrals, and change of variables

**TA — Atlas TA · M29 · Session 3 · Integration, the Fundamental Theorem, multiple integrals, and change of variables**

1. Opening problem: Start with a small a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition; derive a limit/Taylor/Jacobian/change-of-variables or convergence step, then audit one shape, unit, dtype, step, tolerance, or solver trace; the continuity, differentiability, region/injectivity, convergence, regularity, and finite-precision assumptions that can fail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M29 · Session 3 · Integration, the Fundamental Theorem, multiple integrals, and change of variables**

1. Design brief: Implement or inspect one bounded a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mechanism and the smallest remaining uncertainty.

#### Session 4 · Multivariable derivatives, gradients, Jacobians, Hessians, and code contracts

**TA — Atlas TA · M29 · Session 4 · Multivariable derivatives, gradients, Jacobians, Hessians, and code contracts**

1. Opening problem: Start with a small a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition; derive a limit/Taylor/Jacobian/change-of-variables or convergence step, then audit one shape, unit, dtype, step, tolerance, or solver trace; the continuity, differentiability, region/injectivity, convergence, regularity, and finite-precision assumptions that can fail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M29 · Session 4 · Multivariable derivatives, gradients, Jacobians, Hessians, and code contracts**

1. Design brief: Implement or inspect one bounded a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mechanism and the smallest remaining uncertainty.

#### Session 5 · Sequences, series, pointwise versus uniform convergence, and legal exchanges

**TA — Atlas TA · M29 · Session 5 · Sequences, series, pointwise versus uniform convergence, and legal exchanges**

1. Opening problem: Start with a small a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition; derive a limit/Taylor/Jacobian/change-of-variables or convergence step, then audit one shape, unit, dtype, step, tolerance, or solver trace; the continuity, differentiability, region/injectivity, convergence, regularity, and finite-precision assumptions that can fail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M29 · Session 5 · Sequences, series, pointwise versus uniform convergence, and legal exchanges**

1. Design brief: Implement or inspect one bounded a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mechanism and the smallest remaining uncertainty.

#### Session 6 · Constrained extrema, ODE approximation, and the continuous-change dossier

**TA — Atlas TA · M29 · Session 6 · Constrained extrema, ODE approximation, and the continuous-change dossier**

1. Opening problem: Start with a small a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition; derive a limit/Taylor/Jacobian/change-of-variables or convergence step, then audit one shape, unit, dtype, step, tolerance, or solver trace; the continuity, differentiability, region/injectivity, convergence, regularity, and finite-precision assumptions that can fail; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M29 · Session 6 · Constrained extrema, ODE approximation, and the continuous-change dossier**

1. Design brief: Implement or inspect one bounded a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/29_calculus_real_analysis_continuous_change.md` lines 295–296
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a pointwise limit is automatically uniform, a partial derivative proves differentiability, or a finite numerical trace licenses an operation exchange
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a continuous-change claim joining domain/metric, local map or accumulation, and a named convergence or numerical-error condition mechanism and the smallest remaining uncertainty.

### M30 · Probability, Statistics & Scientific Inference

Availability: **legacy-open** · Arc project: **Mathematical and reliable-learning notebook** · Source map: [content/source-maps/module30_probability_statistics_scientific_inference_source_map.md](../content/source-maps/module30_probability_statistics_scientific_inference_source_map.md)

#### Session 1 · From a story to a probability model

**TA — Atlas TA · M30 · Session 1 · From a story to a probability model**

1. Opening problem: Start with a small probability models, conditional structure, inference, uncertainty, and sampling assumptions mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: probability models, conditional structure, inference, uncertainty, and sampling assumptions; derive a Bayes, likelihood, confidence, or concentration argument before simulating it; the sampling, independence, missingness, misspecification, and multiple-testing assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact probability models, conditional structure, inference, uncertainty, and sampling assumptions evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M30 · Session 1 · From a story to a probability model**

1. Design brief: Implement or inspect one bounded probability models, conditional structure, inference, uncertainty, and sampling assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the probability models, conditional structure, inference, uncertainty, and sampling assumptions mechanism and the smallest remaining uncertainty.

#### Session 2 · Expectation, variation, covariance, and information

**TA — Atlas TA · M30 · Session 2 · Expectation, variation, covariance, and information**

1. Opening problem: Start with a small probability models, conditional structure, inference, uncertainty, and sampling assumptions mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: probability models, conditional structure, inference, uncertainty, and sampling assumptions; derive a Bayes, likelihood, confidence, or concentration argument before simulating it; the sampling, independence, missingness, misspecification, and multiple-testing assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact probability models, conditional structure, inference, uncertainty, and sampling assumptions evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M30 · Session 2 · Expectation, variation, covariance, and information**

1. Design brief: Implement or inspect one bounded probability models, conditional structure, inference, uncertainty, and sampling assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the probability models, conditional structure, inference, uncertainty, and sampling assumptions mechanism and the smallest remaining uncertainty.

#### Session 3 · Repetition, convergence, concentration, and Monte Carlo

**TA — Atlas TA · M30 · Session 3 · Repetition, convergence, concentration, and Monte Carlo**

1. Opening problem: Start with a small probability models, conditional structure, inference, uncertainty, and sampling assumptions mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: probability models, conditional structure, inference, uncertainty, and sampling assumptions; derive a Bayes, likelihood, confidence, or concentration argument before simulating it; the sampling, independence, missingness, misspecification, and multiple-testing assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact probability models, conditional structure, inference, uncertainty, and sampling assumptions evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M30 · Session 3 · Repetition, convergence, concentration, and Monte Carlo**

1. Design brief: Implement or inspect one bounded probability models, conditional structure, inference, uncertainty, and sampling assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the probability models, conditional structure, inference, uncertainty, and sampling assumptions mechanism and the smallest remaining uncertainty.

#### Session 4 · Models, likelihood, estimation, and criticism

**TA — Atlas TA · M30 · Session 4 · Models, likelihood, estimation, and criticism**

1. Opening problem: Start with a small probability models, conditional structure, inference, uncertainty, and sampling assumptions mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: probability models, conditional structure, inference, uncertainty, and sampling assumptions; derive a Bayes, likelihood, confidence, or concentration argument before simulating it; the sampling, independence, missingness, misspecification, and multiple-testing assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact probability models, conditional structure, inference, uncertainty, and sampling assumptions evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M30 · Session 4 · Models, likelihood, estimation, and criticism**

1. Design brief: Implement or inspect one bounded probability models, conditional structure, inference, uncertainty, and sampling assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the probability models, conditional structure, inference, uncertainty, and sampling assumptions mechanism and the smallest remaining uncertainty.

#### Session 5 · Intervals, tests, multiplicity, and resampling

**TA — Atlas TA · M30 · Session 5 · Intervals, tests, multiplicity, and resampling**

1. Opening problem: Start with a small probability models, conditional structure, inference, uncertainty, and sampling assumptions mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: probability models, conditional structure, inference, uncertainty, and sampling assumptions; derive a Bayes, likelihood, confidence, or concentration argument before simulating it; the sampling, independence, missingness, misspecification, and multiple-testing assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact probability models, conditional structure, inference, uncertainty, and sampling assumptions evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M30 · Session 5 · Intervals, tests, multiplicity, and resampling**

1. Design brief: Implement or inspect one bounded probability models, conditional structure, inference, uncertainty, and sampling assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the probability models, conditional structure, inference, uncertainty, and sampling assumptions mechanism and the smallest remaining uncertainty.

#### Session 6 · Design, criticism, missingness, robustness, and dimension

**TA — Atlas TA · M30 · Session 6 · Design, criticism, missingness, robustness, and dimension**

1. Opening problem: Start with a small probability models, conditional structure, inference, uncertainty, and sampling assumptions mystery and make the current model explicit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: probability models, conditional structure, inference, uncertainty, and sampling assumptions; derive a Bayes, likelihood, confidence, or concentration argument before simulating it; the sampling, independence, missingness, misspecification, and multiple-testing assumptions; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: A compact probability models, conditional structure, inference, uncertainty, and sampling assumptions evidence card → Carry the session artifact into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M30 · Session 6 · Design, criticism, missingness, robustness, and dimension**

1. Design brief: Implement or inspect one bounded probability models, conditional structure, inference, uncertainty, and sampling assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/modules/30_probability_statistics_scientific_inference.md` lines 283–285
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a p-value, interval, posterior, or Monte Carlo output answers a stronger question than its model permits
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the probability models, conditional structure, inference, uncertainty, and sampling assumptions mechanism and the smallest remaining uncertainty.

### M31 · Optimization & Information

Availability: **authoring-only** · Arc project: **Mathematical and reliable-learning notebook** · Source map: [content/source-maps/module31_optimization_information.md](../content/source-maps/module31_optimization_information.md)

#### Session 1 · Formulate before you optimize

**TA — Atlas TA · M31 · Session 1 · Formulate before you optimize**

1. Opening problem: With the Study Partner, name the decision owner, objective, feasible set, units, and one value the model leaves outside before opening the trace.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an objective, constraints, geometry, convergence path, and information quantity with assumptions; derive a first-order/KKT or entropy/KL step and connect it to a computational consequence; the convexity, smoothness, feasibility, scale, and numerical assumptions behind a convergence claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to an optimizer's decrease proves a good solution or information metrics are interchangeable scores; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Objective Geometry Sheet → Carry the Objective Geometry Sheet into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M31 · Session 1 · Formulate before you optimize**

1. Design brief: Implement or inspect one bounded an objective, constraints, geometry, convergence path, and information quantity with assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: an optimizer's decrease proves a good solution or information metrics are interchangeable scores
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an objective, constraints, geometry, convergence path, and information quantity with assumptions mechanism and the smallest remaining uncertainty.

#### Session 2 · Local equations are not global decisions

**TA — Atlas TA · M31 · Session 2 · Local equations are not global decisions**

1. Opening problem: Predict whether the local calculation supports a global claim; then name the missing domain, curvature, or regularity premise.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an objective, constraints, geometry, convergence path, and information quantity with assumptions; derive a first-order/KKT or entropy/KL step and connect it to a computational consequence; the convexity, smoothness, feasibility, scale, and numerical assumptions behind a convergence claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to an optimizer's decrease proves a good solution or information metrics are interchangeable scores; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Stationarity and Feasibility Ledger → Carry the Stationarity and Feasibility Ledger into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M31 · Session 2 · Local equations are not global decisions**

1. Design brief: Implement or inspect one bounded an objective, constraints, geometry, convergence path, and information quantity with assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: an optimizer's decrease proves a good solution or information metrics are interchangeable scores
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an objective, constraints, geometry, convergence path, and information quantity with assumptions mechanism and the smallest remaining uncertainty.

#### Session 3 · Constraints become certificates only under conditions

**TA — Atlas TA · M31 · Session 3 · Constraints become certificates only under conditions**

1. Opening problem: Sketch the primal claim, constraint, and dual-feasibility route; say whether strict feasibility or another qualification is actually available.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an objective, constraints, geometry, convergence path, and information quantity with assumptions; derive a first-order/KKT or entropy/KL step and connect it to a computational consequence; the convexity, smoothness, feasibility, scale, and numerical assumptions behind a convergence claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to an optimizer's decrease proves a good solution or information metrics are interchangeable scores; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Constraint Claim Table → Carry the Constraint Claim Table into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M31 · Session 3 · Constraints become certificates only under conditions**

1. Design brief: Implement or inspect one bounded an objective, constraints, geometry, convergence path, and information quantity with assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: an optimizer's decrease proves a good solution or information metrics are interchangeable scores
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an objective, constraints, geometry, convergence path, and information quantity with assumptions mechanism and the smallest remaining uncertainty.

#### Session 4 · Read stopping evidence, not solver mythology

**TA — Atlas TA · M31 · Session 4 · Read stopping evidence, not solver mythology**

1. Opening problem: Before trusting a solver status, predict which residual and independent check would still be needed for the stated claim.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an objective, constraints, geometry, convergence path, and information quantity with assumptions; derive a first-order/KKT or entropy/KL step and connect it to a computational consequence; the convexity, smoothness, feasibility, scale, and numerical assumptions behind a convergence claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to an optimizer's decrease proves a good solution or information metrics are interchangeable scores; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Solver-Selection Rationale → Carry the Solver-Selection Rationale into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M31 · Session 4 · Read stopping evidence, not solver mythology**

1. Design brief: Implement or inspect one bounded an objective, constraints, geometry, convergence path, and information quantity with assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: an optimizer's decrease proves a good solution or information metrics are interchangeable scores
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an objective, constraints, geometry, convergence path, and information quantity with assumptions mechanism and the smallest remaining uncertainty.

#### Session 5 · Noise is evidence, not a nuisance to hide

**TA — Atlas TA · M31 · Session 5 · Noise is evidence, not a nuisance to hide**

1. Opening problem: Contrast two starts or samples and state which oracle, noise, or stationarity conclusion remains justified—and which does not.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an objective, constraints, geometry, convergence path, and information quantity with assumptions; derive a first-order/KKT or entropy/KL step and connect it to a computational consequence; the convexity, smoothness, feasibility, scale, and numerical assumptions behind a convergence claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to an optimizer's decrease proves a good solution or information metrics are interchangeable scores; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Stochastic Information Experiment Card → Carry the Stochastic Information Experiment Card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M31 · Session 5 · Noise is evidence, not a nuisance to hide**

1. Design brief: Implement or inspect one bounded an objective, constraints, geometry, convergence path, and information quantity with assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: an optimizer's decrease proves a good solution or information metrics are interchangeable scores
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an objective, constraints, geometry, convergence path, and information quantity with assumptions mechanism and the smallest remaining uncertainty.

#### Session 6 · Information is a declared trade-off

**TA — Atlas TA · M31 · Session 6 · Information is a declared trade-off**

1. Opening problem: Write the distribution, logarithm base, direction, and support before computing an information quantity or interpreting an ELBO.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: an objective, constraints, geometry, convergence path, and information quantity with assumptions; derive a first-order/KKT or entropy/KL step and connect it to a computational consequence; the convexity, smoothness, feasibility, scale, and numerical assumptions behind a convergence claim; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to an optimizer's decrease proves a good solution or information metrics are interchangeable scores; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Optimization and Information Evidence Dossier → Carry the Optimization and Information Evidence Dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M31 · Session 6 · Information is a declared trade-off**

1. Design brief: Implement or inspect one bounded an objective, constraints, geometry, convergence path, and information quantity with assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m31_optimization_information_workbook.v1.md` lines 181–185
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: an optimizer's decrease proves a good solution or information metrics are interchangeable scores
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the an objective, constraints, geometry, convergence path, and information quantity with assumptions mechanism and the smallest remaining uncertainty.

### M32 · Systems Languages, Scientific Python & Accelerators

Availability: **authoring-only** · Arc project: **Mathematical and reliable-learning notebook** · Source map: [content/source-maps/module32_systems_languages_scientific_python_accelerators.md](../content/source-maps/module32_systems_languages_scientific_python_accelerators.md)

#### Session 1 · Map responsibility before optimizing a boundary

**TA — Atlas TA · M32 · Session 1 · Map responsibility before optimizing a boundary**

1. Opening problem: With the Study Partner, map the public input, output, version, ownership, and error promises before following the lower-level code.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work; trace one scientific Python operation through memory layout, kernel work, precision, and reproducibility evidence; the layout, transfer, precision, synchronization, and environment assumptions behind the observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to vectorization or a GPU automatically makes code faster, correct, or reproducible; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Boundary Contract Map → Carry the Boundary Contract Map into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M32 · Session 1 · Map responsibility before optimizing a boundary**

1. Design brief: Implement or inspect one bounded cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: vectorization or a GPU automatically makes code faster, correct, or reproducible
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work mechanism and the smallest remaining uncertainty.

#### Session 2 · Trace work before timing it

**TA — Atlas TA · M32 · Session 2 · Trace work before timing it**

1. Opening problem: Sketch request → transfer → queue or stream → work → synchronization → observation, then mark the first event that makes the result readable.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work; trace one scientific Python operation through memory layout, kernel work, precision, and reproducibility evidence; the layout, transfer, precision, synchronization, and environment assumptions behind the observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to vectorization or a GPU automatically makes code faster, correct, or reproducible; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Execution-Transfer Trace → Carry the Execution-Transfer Trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M32 · Session 2 · Trace work before timing it**

1. Design brief: Implement or inspect one bounded cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: vectorization or a GPU automatically makes code faster, correct, or reproducible
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work mechanism and the smallest remaining uncertainty.

#### Session 3 · Treat array metadata as part of the algorithm

**TA — Atlas TA · M32 · Session 3 · Treat array metadata as part of the algorithm**

1. Opening problem: Predict whether the proposed handoff can be no-copy; name the shape, dtype, strides, aliasing, and semantic-oracle facts needed to check it.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work; trace one scientific Python operation through memory layout, kernel work, precision, and reproducibility evidence; the layout, transfer, precision, synchronization, and environment assumptions behind the observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to vectorization or a GPU automatically makes code faster, correct, or reproducible; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Layout-Numerics Note → Carry the Layout-Numerics Note into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M32 · Session 3 · Treat array metadata as part of the algorithm**

1. Design brief: Implement or inspect one bounded cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: vectorization or a GPU automatically makes code faster, correct, or reproducible
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work mechanism and the smallest remaining uncertainty.

#### Session 4 · Draw ownership before claiming parallelism

**TA — Atlas TA · M32 · Session 4 · Draw ownership before claiming parallelism**

1. Opening problem: Draw the producer, named dependency, last consumer, and legal-reuse point before making any overlap or throughput claim.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work; trace one scientific Python operation through memory layout, kernel work, precision, and reproducibility evidence; the layout, transfer, precision, synchronization, and environment assumptions behind the observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to vectorization or a GPU automatically makes code faster, correct, or reproducible; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Buffer-Ownership Timeline → Carry the Buffer-Ownership Timeline into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M32 · Session 4 · Draw ownership before claiming parallelism**

1. Design brief: Implement or inspect one bounded cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: vectorization or a GPU automatically makes code faster, correct, or reproducible
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work mechanism and the smallest remaining uncertainty.

#### Session 5 · Read autodiff as a program with a numerical contract

**TA — Atlas TA · M32 · Session 5 · Read autodiff as a program with a numerical contract**

1. Opening problem: Write one scalar chain rule and a finite-difference check, then identify the dtype, device, and objective assumptions they do not validate.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work; trace one scientific Python operation through memory layout, kernel work, precision, and reproducibility evidence; the layout, transfer, precision, synchronization, and environment assumptions behind the observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to vectorization or a GPU automatically makes code faster, correct, or reproducible; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Autodiff-Execution Trace → Carry the Autodiff-Execution Trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M32 · Session 5 · Read autodiff as a program with a numerical contract**

1. Design brief: Implement or inspect one bounded cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: vectorization or a GPU automatically makes code faster, correct, or reproducible
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work mechanism and the smallest remaining uncertainty.

#### Session 6 · Defend a bounded systems claim

**TA — Atlas TA · M32 · Session 6 · Defend a bounded systems claim**

1. Opening problem: Choose one sentence-sized systems claim and list its environment record, observation, limitation, and next falsifier before drafting the dossier.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work; trace one scientific Python operation through memory layout, kernel work, precision, and reproducibility evidence; the layout, transfer, precision, synchronization, and environment assumptions behind the observation; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to vectorization or a GPU automatically makes code faster, correct, or reproducible; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Scientific Python & Accelerators Dossier → Carry the Scientific Python & Accelerators Dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M32 · Session 6 · Defend a bounded systems claim**

1. Design brief: Implement or inspect one bounded cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m32_systems_languages_scientific_python_accelerators_workbook.v1.md` lines 804–808
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: vectorization or a GPU automatically makes code faster, correct, or reproducible
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the cross-layer execution from array layout and lower-level code through autodiff, accelerators, and distributed work mechanism and the smallest remaining uncertainty.

### M33 · Formal Languages, Computability & Complexity

Availability: **authoring-only** · Arc project: **Mathematical and reliable-learning notebook** · Source map: [content/source-maps/module33_formal_languages_computability_complexity.md](../content/source-maps/module33_formal_languages_computability_complexity.md)

#### Session 1 · Languages are objects; syntax is not authority

**TA — Atlas TA · M33 · Session 1 · Languages are objects; syntax is not authority**

1. Opening problem: With the Study Partner, name the alphabet, language, grammar or machine, and question; identify which parts are syntax and which are semantic claims.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable; classify a small language or reconstruct a reduction while preserving the yes/no relationship; the computational model, input encoding, reduction direction, and resource definition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to NP means impossible, a parser solves every language question, or a hard instance proves a class claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Language–Machine Separation Sheet → Carry the Language–Machine Separation Sheet into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M33 · Session 1 · Languages are objects; syntax is not authority**

1. Design brief: Implement or inspect one bounded language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: NP means impossible, a parser solves every language question, or a hard instance proves a class claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable mechanism and the smallest remaining uncertainty.

#### Session 2 · Finite state needs finite evidence

**TA — Atlas TA · M33 · Session 2 · Finite state needs finite evidence**

1. Opening problem: Before tracing a recognizer, predict what finite state can remember and name the proof obligation that would justify a universal limit.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable; classify a small language or reconstruct a reduction while preserving the yes/no relationship; the computational model, input encoding, reduction direction, and resource definition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to NP means impossible, a parser solves every language question, or a hard instance proves a class claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Formal-Claim Countermodel Ledger → Carry the Formal-Claim Countermodel Ledger into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M33 · Session 2 · Finite state needs finite evidence**

1. Design brief: Implement or inspect one bounded language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: NP means impossible, a parser solves every language question, or a hard instance proves a class claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable mechanism and the smallest remaining uncertainty.

#### Session 3 · Grammar questions and semantic limits are different questions

**TA — Atlas TA · M33 · Session 3 · Grammar questions and semantic limits are different questions**

1. Opening problem: State the input encoding, machine, acceptance or halting condition, and property before deciding whether the machine answers the intended question.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable; classify a small language or reconstruct a reduction while preserving the yes/no relationship; the computational model, input encoding, reduction direction, and resource definition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to NP means impossible, a parser solves every language question, or a hard instance proves a class claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Machine–Question–Scope Table → Carry the Machine–Question–Scope Table into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M33 · Session 3 · Grammar questions and semantic limits are different questions**

1. Design brief: Implement or inspect one bounded language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: NP means impossible, a parser solves every language question, or a hard instance proves a class claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable mechanism and the smallest remaining uncertainty.

#### Session 4 · A reduction is a directed proof, not a resemblance

**TA — Atlas TA · M33 · Session 4 · A reduction is a directed proof, not a resemblance**

1. Opening problem: Write the source and target languages, transformation direction, resource bound, and required iff statement before calling two problems reducible.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable; classify a small language or reconstruct a reduction while preserving the yes/no relationship; the computational model, input encoding, reduction direction, and resource definition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to NP means impossible, a parser solves every language question, or a hard instance proves a class claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Reduction-Proof Skeleton → Carry the Reduction-Proof Skeleton into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M33 · Session 4 · A reduction is a directed proof, not a resemblance**

1. Design brief: Implement or inspect one bounded language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: NP means impossible, a parser solves every language question, or a hard instance proves a class claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable mechanism and the smallest remaining uncertainty.

#### Session 5 · Complexity classes classify formal families, not one run

**TA — Atlas TA · M33 · Session 5 · Complexity classes classify formal families, not one run**

1. Opening problem: Name the encoded language, computation model, resource bound, and membership or hardness direction before invoking a complexity class.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable; classify a small language or reconstruct a reduction while preserving the yes/no relationship; the computational model, input encoding, reduction direction, and resource definition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to NP means impossible, a parser solves every language question, or a hard instance proves a class claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Complexity-Claim Card → Carry the Complexity-Claim Card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M33 · Session 5 · Complexity classes classify formal families, not one run**

1. Design brief: Implement or inspect one bounded language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: NP means impossible, a parser solves every language question, or a hard instance proves a class claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable mechanism and the smallest remaining uncertainty.

#### Session 6 · Defend one narrow formal claim

**TA — Atlas TA · M33 · Session 6 · Defend one narrow formal claim**

1. Opening problem: Choose one formal claim and rehearse its definitions, proof skeleton, smallest counterexample boundary, and practical non-claim with the Study Partner.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable; classify a small language or reconstruct a reduction while preserving the yes/no relationship; the computational model, input encoding, reduction direction, and resource definition; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to NP means impossible, a parser solves every language question, or a hard instance proves a class claim; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Formal Limits Claim Packet → Carry the Formal Limits Claim Packet into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M33 · Session 6 · Defend one narrow formal claim**

1. Design brief: Implement or inspect one bounded language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m33_formal_languages_computability_complexity_workbook.v1.md` lines 323–333
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: NP means impossible, a parser solves every language question, or a hard instance proves a class claim
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the language recognition, computation models, reductions, and the boundary between solvable, efficient, and approximable mechanism and the smallest remaining uncertainty.

### M34 · Classical AI: Search, Constraints & Decision

Availability: **authoring-only** · Arc project: **Mathematical and reliable-learning notebook** · Source map: [content/source-maps/module34_classical_ai_search_constraints_decision.md](../content/source-maps/module34_classical_ai_search_constraints_decision.md)

#### Session 1 · Model a state before searching it

**TA — Atlas TA · M34 · Session 1 · Model a state before searching it**

1. Opening problem: With the Study Partner, list the state variables, actions, costs, observations, and one omitted factor before choosing a search method.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions; defend an A*, CSP, planning, or decision step from the model and admissibility/independence assumptions; the state abstraction, heuristic, objective, and uncertainty assumptions that change the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: State-Space Model Card → Carry the State-Space Model Card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M34 · Session 1 · Model a state before searching it**

1. Design brief: Implement or inspect one bounded problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions mechanism and the smallest remaining uncertainty.

#### Session 2 · Search traces need their theorem conditions

**TA — Atlas TA · M34 · Session 2 · Search traces need their theorem conditions**

1. Opening problem: Trace one frontier policy, then name the cost, heuristic, duplicate-handling, and termination assumptions needed for its claim.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions; defend an A*, CSP, planning, or decision step from the model and admissibility/independence assumptions; the state abstraction, heuristic, objective, and uncertainty assumptions that change the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Search-Strategy Evidence Table → Carry the Search-Strategy Evidence Table into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M34 · Session 2 · Search traces need their theorem conditions**

1. Design brief: Implement or inspect one bounded problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions mechanism and the smallest remaining uncertainty.

#### Session 3 · Constraints and relaxations change the mathematical object

**TA — Atlas TA · M34 · Session 3 · Constraints and relaxations change the mathematical object**

1. Opening problem: Mark which candidates are feasible in the original model and which values are only relaxation bounds before reading a solver result.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions; defend an A*, CSP, planning, or decision step from the model and admissibility/independence assumptions; the state abstraction, heuristic, objective, and uncertainty assumptions that change the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Constraint–Objective–Relaxation Sheet → Carry the Constraint–Objective–Relaxation Sheet into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M34 · Session 3 · Constraints and relaxations change the mathematical object**

1. Design brief: Implement or inspect one bounded problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions mechanism and the smallest remaining uncertainty.

#### Session 4 · Planning and solver limits must be stated, not guessed

**TA — Atlas TA · M34 · Session 4 · Planning and solver limits must be stated, not guessed**

1. Opening problem: Map the symbolic state update, constraints, solver status, and one unencoded cause that the system therefore cannot know.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions; defend an A*, CSP, planning, or decision step from the model and admissibility/independence assumptions; the state abstraction, heuristic, objective, and uncertainty assumptions that change the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: CSP/Planning Limit Claim Card → Carry the CSP/Planning Limit Claim Card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M34 · Session 4 · Planning and solver limits must be stated, not guessed**

1. Design brief: Implement or inspect one bounded problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions mechanism and the smallest remaining uncertainty.

#### Session 5 · Belief, utility, and authority are different inputs

**TA — Atlas TA · M34 · Session 5 · Belief, utility, and authority are different inputs**

1. Opening problem: Write belief, utility, and decision authority in separate lines; predict how changing one can change an action without changing the others.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions; defend an A*, CSP, planning, or decision step from the model and admissibility/independence assumptions; the state abstraction, heuristic, objective, and uncertainty assumptions that change the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Decision-under-Uncertainty Card → Carry the Decision-under-Uncertainty Card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M34 · Session 5 · Belief, utility, and authority are different inputs**

1. Design brief: Implement or inspect one bounded problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions mechanism and the smallest remaining uncertainty.

#### Session 6 · Defend a classical AI design dossier

**TA — Atlas TA · M34 · Session 6 · Defend a classical AI design dossier**

1. Opening problem: Draft a one-sentence recommendation, then attach its representation, algorithm conditions, evidence, limitation, accountable owner, and next falsifier.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions; defend an A*, CSP, planning, or decision step from the model and admissibility/independence assumptions; the state abstraction, heuristic, objective, and uncertainty assumptions that change the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Classical AI Search, Constraints & Decision Packet → Carry the Classical AI Search, Constraints & Decision Packet into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M34 · Session 6 · Defend a classical AI design dossier**

1. Design brief: Implement or inspect one bounded problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m34_classical_ai_search_constraints_decision_workbook.v1.md` lines 258–264
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a search algorithm's name determines correctness or a high-scoring plan is automatically optimal/safe
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the problem formulation before method: state, actions, constraints, uncertainty, utility, and heuristic assumptions mechanism and the smallest remaining uncertainty.

### M35 · Machine Learning & Representation

Availability: **authoring-only** · Arc project: **Mathematical and reliable-learning notebook** · Source map: [content/source-maps/module35_machine_learning_representation.md](../content/source-maps/module35_machine_learning_representation.md)

#### Session 1 · Representation, inductive bias, and what a model can discard

**TA — Atlas TA · M35 · Session 1 · Representation, inductive bias, and what a model can discard**

1. Opening problem: With the Study Partner, name the target relation, representation, discarded distinction, and one decision that the representation therefore cannot support.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries; read a model/evaluation path and identify splits, baseline, objective, error pattern, and uncertainty; the leakage, shift, imbalance, label, selection, and deployment assumptions that can invalidate the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strong validation metric proves generalization, fairness, calibration, or causal usefulness; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Representation-Assumption Sheet → Carry the Representation-Assumption Sheet into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M35 · Session 1 · Representation, inductive bias, and what a model can discard**

1. Design brief: Implement or inspect one bounded learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strong validation metric proves generalization, fairness, calibration, or causal usefulness
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries mechanism and the smallest remaining uncertainty.

#### Session 2 · Formulation and classical baselines before learned models

**TA — Atlas TA · M35 · Session 2 · Formulation and classical baselines before learned models**

1. Opening problem: State the prediction target, decision owner, information available at inference, and a classical baseline before proposing a learned model.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries; read a model/evaluation path and identify splits, baseline, objective, error pattern, and uncertainty; the leakage, shift, imbalance, label, selection, and deployment assumptions that can invalidate the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strong validation metric proves generalization, fairness, calibration, or causal usefulness; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Classical–Learning Baseline Comparison → Carry the Classical–Learning Baseline Comparison into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M35 · Session 2 · Formulation and classical baselines before learned models**

1. Design brief: Implement or inspect one bounded learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strong validation metric proves generalization, fairness, calibration, or causal usefulness
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries mechanism and the smallest remaining uncertainty.

#### Session 3 · Data relations, splits, metrics, calibration, and shift

**TA — Atlas TA · M35 · Session 3 · Data relations, splits, metrics, calibration, and shift**

1. Opening problem: Name the train, test, and deployment relations, split rule, metric, and one future shift that the held-out score cannot settle.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries; read a model/evaluation path and identify splits, baseline, objective, error pattern, and uncertainty; the leakage, shift, imbalance, label, selection, and deployment assumptions that can invalidate the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strong validation metric proves generalization, fairness, calibration, or causal usefulness; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Evaluation-and-Shift Plan → Carry the Evaluation-and-Shift Plan into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M35 · Session 3 · Data relations, splits, metrics, calibration, and shift**

1. Design brief: Implement or inspect one bounded learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strong validation metric proves generalization, fairness, calibration, or causal usefulness
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries mechanism and the smallest remaining uncertainty.

#### Session 4 · Objectives, autodiff, optimization, and training systems

**TA — Atlas TA · M35 · Session 4 · Objectives, autodiff, optimization, and training systems**

1. Opening problem: Trace objective → gradient → update → system condition, then say which optimization, evaluation, or generalization question the trace leaves open.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries; read a model/evaluation path and identify splits, baseline, objective, error pattern, and uncertainty; the leakage, shift, imbalance, label, selection, and deployment assumptions that can invalidate the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strong validation metric proves generalization, fairness, calibration, or causal usefulness; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Objective–Optimization–Generalization Trace → Carry the Objective–Optimization–Generalization Trace into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M35 · Session 4 · Objectives, autodiff, optimization, and training systems**

1. Design brief: Implement or inspect one bounded learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strong validation metric proves generalization, fairness, calibration, or causal usefulness
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries mechanism and the smallest remaining uncertainty.

#### Session 5 · ML debugging, observability, and evidence that can fail usefully

**TA — Atlas TA · M35 · Session 5 · ML debugging, observability, and evidence that can fail usefully**

1. Opening problem: When an aggregate score moves, list the data, representation, metric, model, system, and serving hypotheses before changing the model.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries; read a model/evaluation path and identify splits, baseline, objective, error pattern, and uncertainty; the leakage, shift, imbalance, label, selection, and deployment assumptions that can invalidate the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strong validation metric proves generalization, fairness, calibration, or causal usefulness; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: ML Claim–Test–Observability Matrix → Carry the ML Claim–Test–Observability Matrix into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M35 · Session 5 · ML debugging, observability, and evidence that can fail usefully**

1. Design brief: Implement or inspect one bounded learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strong validation metric proves generalization, fairness, calibration, or causal usefulness
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries mechanism and the smallest remaining uncertainty.

#### Session 6 · Responsible ML representation dossier and oral defense

**TA — Atlas TA · M35 · Session 6 · Responsible ML representation dossier and oral defense**

1. Opening problem: Separate model output, decision owner, authority, evidence, and missing permission before drafting the responsible-ML dossier.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries; read a model/evaluation path and identify splits, baseline, objective, error pattern, and uncertainty; the leakage, shift, imbalance, label, selection, and deployment assumptions that can invalidate the result; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a strong validation metric proves generalization, fairness, calibration, or causal usefulness; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Data-Authority-Impact Map → Carry the Data-Authority-Impact Map into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M35 · Session 6 · Responsible ML representation dossier and oral defense**

1. Design brief: Implement or inspect one bounded learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m35_machine_learning_representation_workbook.v1.md` lines 267–274
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a strong validation metric proves generalization, fairness, calibration, or causal usefulness
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the learning as a scoped empirical-risk and representation claim with data, evaluation, and deployment boundaries mechanism and the smallest remaining uncertainty.

### M36 · Statistical Learning Theory & Reliable Deep-Learning Systems

Availability: **authoring-only** · Arc project: **Mathematical and reliable-learning notebook** · Source map: [content/source-maps/module36_statistical_learning_theory_reliable_deep_learning.md](../content/source-maps/module36_statistical_learning_theory_reliable_deep_learning.md)

#### Session 1 · Risk, representation, data, and assumption scope

**TA — Atlas TA · M36 · Session 1 · Risk, representation, data, and assumption scope**

1. Opening problem: With the Study Partner, name the population relation, hypothesis class, loss, sample path, and assumption that must hold before an empirical result can travel further.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits; reconstruct a finite-class Hoeffding-plus-union-bound proof idea, PAC quantifier order, or margin-bound scope and its non-deployment consequence; the distribution, class, sample, optimization, and implementation assumptions that prevent overclaiming; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Assumption-Scope Sheet → Carry the Assumption-Scope Sheet into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M36 · Session 1 · Risk, representation, data, and assumption scope**

1. Design brief: Implement or inspect one bounded a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits mechanism and the smallest remaining uncertainty.

#### Session 2 · Optimization, estimation, and generalization are different gaps

**TA — Atlas TA · M36 · Session 2 · Optimization, estimation, and generalization are different gaps**

1. Opening problem: Label the loss trace's question, comparator, and evidence; then name one optimization, estimation, or generalization question it does not answer.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits; reconstruct a finite-class Hoeffding-plus-union-bound proof idea, PAC quantifier order, or margin-bound scope and its non-deployment consequence; the distribution, class, sample, optimization, and implementation assumptions that prevent overclaiming; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Optimization–Generalization Gap Ledger → Carry the Optimization–Generalization Gap Ledger into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M36 · Session 2 · Optimization, estimation, and generalization are different gaps**

1. Design brief: Implement or inspect one bounded a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits mechanism and the smallest remaining uncertainty.

#### Session 3 · Capacity, learnability, computational limits, and theorem scope

**TA — Atlas TA · M36 · Session 3 · Capacity, learnability, computational limits, and theorem scope**

1. Opening problem: Before reading a theorem, write its probability statement, quantifiers, hypothesis class, sample or resource condition, and one excluded regime.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits; reconstruct a finite-class Hoeffding-plus-union-bound proof idea, PAC quantifier order, or margin-bound scope and its non-deployment consequence; the distribution, class, sample, optimization, and implementation assumptions that prevent overclaiming; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Limit-and-Nonclaim Card → Carry the Limit-and-Nonclaim Card into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M36 · Session 3 · Capacity, learnability, computational limits, and theorem scope**

1. Design brief: Implement or inspect one bounded a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits mechanism and the smallest remaining uncertainty.

#### Session 4 · Numerical, systems, and reproducibility evidence

**TA — Atlas TA · M36 · Session 4 · Numerical, systems, and reproducibility evidence**

1. Opening problem: Compare two runs by listing what was fixed, what changed, the numerical path, and the limit of any reproducibility claim.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits; reconstruct a finite-class Hoeffding-plus-union-bound proof idea, PAC quantifier order, or margin-bound scope and its non-deployment consequence; the distribution, class, sample, optimization, and implementation assumptions that prevent overclaiming; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Theory–System Reproducibility Record → Carry the Theory–System Reproducibility Record into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M36 · Session 4 · Numerical, systems, and reproducibility evidence**

1. Design brief: Implement or inspect one bounded a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits mechanism and the smallest remaining uncertainty.

#### Session 5 · Shift, robustness, monitoring, and bounded human control

**TA — Atlas TA · M36 · Session 5 · Shift, robustness, monitoring, and bounded human control**

1. Opening problem: Name the declared shift or threat set, monitoring signal, decision owner, and response boundary before calling a system robust.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits; reconstruct a finite-class Hoeffding-plus-union-bound proof idea, PAC quantifier order, or margin-bound scope and its non-deployment consequence; the distribution, class, sample, optimization, and implementation assumptions that prevent overclaiming; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Monitoring Extension to Reliable-Learning Evidence Map → Carry the Monitoring Extension to Reliable-Learning Evidence Map into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M36 · Session 5 · Shift, robustness, monitoring, and bounded human control**

1. Design brief: Implement or inspect one bounded a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits mechanism and the smallest remaining uncertainty.

#### Session 6 · Reliable learning systems dossier and bridge to synthesis

**TA — Atlas TA · M36 · Session 6 · Reliable learning systems dossier and bridge to synthesis**

1. Opening problem: Choose one bounded learning-system claim and rehearse its assumptions, evidence, non-claim, monitoring trigger, accountable owner, and next falsifier.
2. Prediction: Before the reveal, predict the next state, output, proof step, or numerical result and give a confidence from 0–100.
3. Bounded walk: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266 — Show only this small slice first; explain each meaningful line, state change, cost, proof obligation, and system boundary.
4. Whiteboard: a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits; reconstruct a finite-class Hoeffding-plus-union-bound proof idea, PAC quantifier order, or margin-bound scope and its non-deployment consequence; the distribution, class, sample, optimization, and implementation assumptions that prevent overclaiming; display math, labelled fenced code, diagram, and prose/ASCII fallback
5. State trace: before → line → after using line, bindings/objects or symbols, control flow, representation/cost, claim and boundary.
6. Changed premise: Change one input, invariant, premise, or assumption related to a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions; ask what changes and why. Pause: Pause for learner questions after the first trace and before the changed-premise reveal.
7. Artifact and handoff: Statistical Learning Theory & Reliable Deep-Learning Systems Dossier → Carry the Statistical Learning Theory & Reliable Deep-Learning Systems Dossier into the Study Partner design brief and visible implementation loop.

**Study Partner — Atlas Study Partner · M36 · Session 6 · Reliable learning systems dossier and bridge to synthesis**

1. Design brief: Implement or inspect one bounded a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits slice for Mathematical and reliable-learning notebook.
2. Before patch: State intent, system boundary, non-goals, constraints, and one safety/privacy concern.; Predict behavior and give confidence before the first patch.; Name the invariant, proof condition, or observable acceptance criterion.
3. Architecture: Draw the smallest data-flow, state, call-graph, or proof map before writing code.
4. Starter slice: `content/authoring/m36_statistical_learning_theory_reliable_deep_learning_workbook.v1.md` lines 261–266
5. Visible loop: write one visible incremental patch → explain each meaningful line and state transition → run a bounded test/trace or label it honestly as simulated/unverified → inject one failure, changed requirement, or counterexample → debug the smallest repair → review the diff against contract, tests, privacy/accessibility, and cost → ask the learner to explain the mechanism and record one non-claim
6. Failure injection: a theorem proves a deployed model will work or a benchmark score demonstrates the theorem's assumptions
7. Done/review: Generated code remains visible and reviewable; no opaque solution dump.; Observed execution is separated from prediction, simulation, assumption, and unverified claim.; One failure, counterexample, changed premise, or boundary is investigated.; The learner can explain the a conditional finite-class or PAC generalization claim, or a scoped margin-bound reading, tied to a hypothesis class, assumptions, observable evidence, and system limits mechanism and the smallest remaining uncertainty.

## Source of truth

The machine-readable registry is [`content/course/module-teaching-packs.v1.json`](../content/course/module-teaching-packs.v1.json). The route and access state remain canonical in [`content/course/course-graph.v2.json`](../content/course/course-graph.v2.json). Generated cards adapt to the learner in the live chat and never claim a run, oral defense, Notion write, or mastery record by themselves.

