# Data Model: PowerShell Automation

## Entities

### AutomationScript
Represents a project-level automation task.
- **Name**: String (e.g., "setup", "start")
- **FilePath**: String (relative path to `.ps1`)
- **Description**: String
- **Parameters**: List of Parameter objects
- **Dependencies**: List of external tools (e.g., node, pnpm)

### AgentConfiguration
Instructions given to AI agents for environment interaction.
- **ShellPreference**: Enum (PowerShell, Bash, CMD)
- **OSMapping**: Map of OS to ShellPreference
- **CommandStyle**: Enum (Native, CrossPlatform)

## Relationships
- An **AutomationScript** may call other **AutomationScripts**.
- **AgentConfiguration** influences how **AutomationScripts** are invoked by the AI.
