## Why

As the "Note de Frais" application grows in complexity (OCR integration, validation workflows, etc.), it becomes critical to have a robust testing suite to ensure reliability, prevent regressions, and facilitate refactoring. Currently, the frontend lacks any testing infrastructure, and the backend only has a basic setup.

## What Changes

- **Frontend**: Installation and configuration of **Vitest**, **React Testing Library**, and **Happy DOM** to enable component and unit testing.
- **Backend**: Enhancement of the existing Jest setup to include better service mocking and database integration tests (using a test database or Prisma mocks).
- **Global**: Integration of test execution into the development workflow and CI/CD ready scripts.
- **Initial Coverage**: Implementation of unit tests for at least one core component in the frontend (e.g., `ReceiptCapture`) and one service in the backend (e.g., `ExpensesService`).

## Capabilities

### New Capabilities
- `frontend-test-infra`: Setup and configuration of Vitest, React Testing Library, and initial test examples for React components.
- `backend-test-patterns`: Standardization of testing patterns for NestJS services and controllers, including Prisma mocking strategies.
- `core-logic-tests`: Initial set of unit tests covering critical business logic in both client and server.

### Modified Capabilities
- `expense-submission`: Adding unit tests for the submission logic to ensure data integrity before send-off.

## Impact

- **Client**: New dependencies (`vitest`, `@testing-library/react`, etc.) and configuration files (`vite.config.ts` updates, `test/setup.ts`).
- **Server**: Potential updates to `jest` config and addition of test utilities for Prisma.
- **Workflow**: `pnpm test` will now be a required step for verification.
