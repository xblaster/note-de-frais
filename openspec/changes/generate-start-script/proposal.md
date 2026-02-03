# Proposal: Unified Start Script

## Description
This change introduces a `start.bat` script in the project root to automate the startup of all application components (Database, Backend, and Frontend) in development mode.

## Motivation
Starting multiple components manually (Docker, NestJS server, Vite client) is repetitive and error-prone. A single entry point improves developer experience and ensures a consistent environment.

## Impact
- **Root Directory**: Adds `start.bat`.
- **System Requirements**: Requires Docker, Node.js, and `pnpm` to be installed.
- **Workflow**: Developers will only need to run `.\start.bat` to spin up the entire stack.
