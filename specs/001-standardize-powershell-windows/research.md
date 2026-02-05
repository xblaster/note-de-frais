# Research: Standardize PowerShell for Windows Commands

## Decisions

### D-001: PowerShell Version Compatibility
- **Decision**: Standardize on syntax compatible with both PowerShell 5.1 (Windows Desktop) and PowerShell 7+ (Core).
- **Rationale**: Ensures out-of-the-box functionality for all Windows users without requiring an immediate install of PS 7, while still being future-proof.
- **Alternatives considered**: Requiring PS 7 only (too restrictive for initial onboarding).

### D-002: Execution Policy Management
- **Decision**: Use `-ExecutionPolicy Bypass` for all internal tool calls. For manual user execution, provide a one-liner setup command in the README.
- **Rationale**: Prevents common "scripts are disabled" errors from blocking automated workflows.
- **Alternatives considered**: Requiring users to change their global system policy (security risk/user friction).

### D-003: Script Organization
- **Decision**: Create a top-level `scripts/powershell/` directory for project-wide automation.
- **Rationale**: Distinguishes project-specific automation from internal tool scripts in `.specify/`.
- **Alternatives considered**: Keeping all scripts in root (clutters the root directory).

### D-004: AI Agent Instruction Update
- **Decision**: Update the `.claude/agents/` and `.gemini/` configurations to include a mandatory "Environment" section that forces PowerShell usage on Windows.
- **Rationale**: Directly addresses the requirement of agent consistency.

## Unknowns Resolved

| Unknown | Finding |
|---------|---------|
| `pnpm` PS Compatibility | `pnpm` provides native `.ps1` wrappers and works perfectly with PS objects. |
| Parallel Execution | PowerShell `Start-Job` or `ThreadJob` can handle parallel start of client/server. |
| Path Lengths | Modern Windows 10+ handles long paths, but `pnpm`'s content-addressable storage minimizes this anyway. |
