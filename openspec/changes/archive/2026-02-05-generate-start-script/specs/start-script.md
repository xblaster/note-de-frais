# Specification: Start Script Scenarios

## Feature: Unified Startup Script
The `start.bat` script should handle various environment states to ensure a smooth developer experience.

### Scenario: Successful Startup
- **GIVEN** Docker is installed and running
- **AND** Node.js and pnpm are installed
- **WHEN** the user runs `.\start.bat`
- **THEN** Docker containers are started in detached mode
- **AND** a new terminal window opens the NestJS backend in dev mode
- **AND** another terminal window opens the Vite frontend in dev mode

### Scenario: Missing Prerequisites
- **GIVEN** pnpm is NOT installed
- **WHEN** the user runs `.\start.bat`
- **THEN** the script displays an error message
- **AND** the script exits without attempting to start components
