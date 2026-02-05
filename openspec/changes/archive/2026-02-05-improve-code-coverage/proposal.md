## Why

Current unit test coverage is incomplete across server and client modules, leaving critical business logic (expense workflows, authentication, OCR integration) and React components (form validation, state management) vulnerable to regressions. Strengthening test coverage will catch bugs earlier in development and build confidence in the application's core features.

## What Changes

- Expand server test suite to cover edge cases in expense status workflows (DRAFT → SUBMITTED → APPROVED/REJECTED/REVISION_REQUESTED transitions)
- Add unit tests for OCR integration (`OllamaService`) with mocked Ollama responses
- Test authentication controller with various login scenarios
- Expand client test coverage for React components: form submission, validation feedback, error handling
- Add tests for API client behavior (request/response handling, error cases)
- Achieve minimum 70% coverage on critical paths (expenses, auth, forms)

## Capabilities

### New Capabilities
- `server-expense-workflow-coverage`: Comprehensive tests for expense status transitions and business logic validation
- `server-auth-coverage`: Unit tests for authentication controller and user login flows
- `server-ollama-integration-coverage`: Tests for receipt OCR analysis with mocked Ollama service
- `client-form-coverage`: Tests for ExpenseForm component (submission, validation, error states)
- `client-api-client-coverage`: Tests for API client error handling and request/response flows

### Modified Capabilities
<!-- None - this is purely a testing improvement, not a requirement change -->

## Impact

- **Code**: `server/src/expenses/`, `server/src/auth/`, `server/src/ollama/`, `client/src/components/`, `client/src/api/`
- **Testing frameworks**: Jest (server), Vitest + React Testing Library (client) — no changes to infrastructure
- **Dependencies**: No new dependencies required (jest-mock-extended already in use)
- **Build/CI**: Coverage reports will be generated but no CI changes needed
