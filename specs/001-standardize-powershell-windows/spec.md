# Feature Specification: Standardize PowerShell for Windows Commands

**Feature Branch**: `001-standardize-powershell-windows`  
**Created**: 2026-02-05  
**Status**: Draft  
**Input**: User description: "I want to use powershell in priority on windows for all gemini commands"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Native Windows Onboarding (Priority: P1)

As a new developer joining the project on a Windows machine, I want to use PowerShell to set up and run the project so that I don't have to install or configure a Unix-like shell environment (like Git Bash or WSL) just for basic tasks.

**Why this priority**: Core developer experience. Eliminates friction for the primary target platform.

**Independent Test**: Can be tested by running a fresh clone and executing the setup script via PowerShell.

**Acceptance Scenarios**:

1. **Given** a clean clone on a Windows machine, **When** I run the setup script in PowerShell, **Then** all dependencies are installed and the environment is ready without shell-related errors.
2. **Given** the project is set up, **When** I run the start command in PowerShell, **Then** both client and server start successfully.

---

### User Story 2 - Gemini CLI Command Execution (Priority: P2)

As a developer using the Gemini CLI, I want the agent to use PowerShell syntax and commands by default when performing operations on my Windows system, so that commands are executed natively and accurately.

**Why this priority**: Ensures the AI assistant's actions are compatible with the local environment, reducing "hallucinated" bash commands that fail on Windows.

**Independent Test**: Ask Gemini CLI to perform a file system operation and verify it uses PowerShell constructs.

**Acceptance Scenarios**:

1. **Given** I am on Windows, **When** I ask Gemini to "list all files and find a specific string", **Then** it executes PowerShell commands (like `Get-ChildItem` or `Select-String`) instead of bash equivalents.
2. **Given** a multi-step task, **When** Gemini executes it, **Then** it uses PowerShell operators (like `;` or `|`) correctly for the Windows environment.

---

### User Story 3 - Automated Task Consistency (Priority: P3)

As a maintainer, I want all project-wide automation (testing, linting, migrations) to be defined in PowerShell scripts so that there is a single, reliable way to run these tasks on Windows.

**Why this priority**: Reduces maintenance overhead of supporting multiple shell scripts for different environments.

**Independent Test**: Execute the full test suite and linting via PowerShell scripts.

**Acceptance Scenarios**:

1. **Given** a change in the codebase, **When** I run the test script in PowerShell, **Then** all tests (client and server) are executed and results are reported correctly.

---

### Edge Cases

- **Execution Policy**: How does the system handle restricted PowerShell execution policies on fresh Windows installs? (Assumption: User will be guided to set `RemoteSigned` or use `-ExecutionPolicy Bypass`).
- **Path Lengths**: How does the standardization handle Windows long path limitations if they occur during node_modules installation?
- **Character Encoding**: Ensure scripts handle UTF-8 correctly to avoid issues with special characters in filenames or logs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All project automation scripts (setup, start, test, build) MUST be provided as `.ps1` files.
- **FR-002**: The project documentation (README, CLAUDE.md) MUST use PowerShell syntax for all command-line examples.
- **FR-003**: Gemini CLI agents MUST be instructed to prioritize PowerShell over CMD or Bash when operating on Windows.
- **FR-004**: System MUST provide a fallback or clear error message if a required PowerShell module is missing.
- **FR-005**: All shell-based task definitions (e.g., in package.json) MUST be compatible with PowerShell.

### Key Entities

- **Automation Script**: A `.ps1` file containing logic for project tasks.
- **Developer Environment**: The local Windows setup where PowerShell is the primary shell.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of core project automation commands defined in `GEMINI.md` run successfully in a standard PowerShell 7+ terminal.
- **SC-002**: Developer setup time on Windows (from clone to running app) is under 15 minutes.
- **SC-003**: Zero "Command not found" or "Syntax error" issues reported due to Bash/Sh syntax being used on Windows for automated tasks.
- **SC-004**: AI Agent success rate for file-system tasks on Windows improves as it stops attempting Bash commands.

## Assumptions

- **AS-001**: Developers are using Windows 10/11 with PowerShell 5.1 or 7+.
- **AS-002**: The primary target environment for local development is Windows.
- **AS-003**: `pnpm` is available and compatible with PowerShell.