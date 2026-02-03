# Design: Unified Start Script

## Context
The project consists of three main components that need to be running for development:
1. PostgreSQL Database (Docker)
2. NestJS Backend (`server/`)
3. Vite Frontend (`client/`)

Currently, these must be started manually in different terminals.

## Goals
- Automate the startup process via a single batch file.
- Check for prerequisites (Docker, Node, pnpm).
- Open separate terminal windows for the long-running processes (Backend, Frontend).

## Implementation Details
- **Prerequisite Checks**:
  - `docker --version`
  - `node --version`
  - `pnpm --version`
- **Database Startup**: Run `docker-compose up -d`.
- **Backend Startup**: Run `start "NestJS Backend" cmd /k "pnpm -C server start:dev"`.
- **Frontend Startup**: Run `start "Vite Frontend" cmd /k "pnpm -C client dev"`.

## Risks / Trade-offs
- Compatibility limited to Windows environments (Batch/PowerShell).
- May require manual intervention if Docker is not started.
