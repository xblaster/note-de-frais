# Tasks: Standardize PowerShell for Windows Commands

**Input**: Design documents from `/specs/001-standardize-powershell-windows/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/start.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create `scripts/powershell/` directory at repository root
- [X] T002 [P] Create `scripts/powershell/tests/` directory for Pester tests
- [X] T003 Initialize Pester configuration in `scripts/powershell/tests/PesterConfig.ps1`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T004 Create `scripts/powershell/common.ps1` with shared utility functions (logging, error handling)
- [X] T005 [P] Create Pester test for common utilities in `scripts/powershell/tests/common.spec.ps1`
- [X] T006 Implement environment validation (Node, pnpm, Git check) in `scripts/powershell/common.ps1`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Native Windows Onboarding (Priority: P1) 🎯 MVP

**Goal**: Enable new developers to set up and start the project using only PowerShell.

**Independent Test**: Run `setup.ps1` then `start.ps1` on a clean environment.

### Tests for User Story 1

- [X] T007 [P] [US1] Create Pester test for `setup.ps1` in `scripts/powershell/tests/setup.spec.ps1`
- [X] T008 [P] [US1] Create Pester test for `start.ps1` in `scripts/powershell/tests/start.spec.ps1`

### Implementation for User Story 1

- [X] T009 [US1] Implement `scripts/powershell/setup.ps1` (dependency install, prisma migrate)
- [X] T010 [US1] Implement `scripts/powershell/start.ps1` per `contracts/start.md` (parallel client/server start)
- [X] T011 [US1] Add `RemoteSigned` execution policy check/guidance in `setup.ps1`

**Checkpoint**: User Story 1 is functional - a developer can clone and run the app.

---

## Phase 4: User Story 2 - Gemini CLI Command Execution (Priority: P2)

**Goal**: Ensure AI agents use PowerShell by default on Windows.

**Independent Test**: Trigger a file-system task via Gemini and verify PS commands are used.

### Implementation for User Story 2

- [X] T012 [US2] Update `.claude/agents/frontend-design-expert.md` with PowerShell environment instructions
- [X] T013 [P] [US2] Update `.gemini/commands/speckit.implement.toml` to include PowerShell prioritization
- [X] T014 [P] [US2] Update `GEMINI.md` "AI Instructions" section with explicit PowerShell mandate

**Checkpoint**: Agents are now configured to use native Windows commands.

---

## Phase 5: User Story 3 - Automated Task Consistency (Priority: P3)

**Goal**: Provide reliable test and build automation via PowerShell.

**Independent Test**: Run `test.ps1` and verify all project tests execute.

### Tests for User Story 3

- [X] T015 [P] [US3] Create Pester test for `test.ps1` in `scripts/powershell/tests/test.spec.ps1`
- [X] T016 [P] [US3] Create Pester test for `build.ps1` in `scripts/powershell/tests/build.spec.ps1`

### Implementation for User Story 3

- [X] T017 [US3] Implement `scripts/powershell/test.ps1` (client and server test runner)
- [X] T018 [US3] Implement `scripts/powershell/build.ps1` (client and server build sequence)
- [X] T019 [US3] Update `package.json` scripts to optionally call these `.ps1` files when on Windows

**Checkpoint**: All project lifecycle tasks are standardized on PowerShell.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T020 [P] Update root `README.md` with PowerShell quickstart commands
- [X] T021 [P] Update `CLAUDE.md` with PowerShell-first command guidelines
- [X] T022 Final validation of `quickstart.md` steps
- [X] T023 Remove/Archive any redundant legacy Bash scripts if they exist in root

---

## Dependencies & Execution Order

- **Phase 1 & 2** are strictly required before any Story.
- **US1 (P1)** is the MVP and should be completed first.
- **US2 and US3** can proceed in parallel after US1.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Setup structure and common utilities.
2. Implement `setup.ps1` and `start.ps1`.
3. Validate basic onboarding flow.

### Incremental Delivery
- Add Agent instructions (US2).
- Add Test/Build scripts (US3).
- Finalize documentation.
