## Context

The Note de Frais application has recently implemented core features (expense CRUD, OCR receipt analysis via Ollama, approval workflows) but lacks comprehensive unit test coverage. Current test infrastructure exists (Jest for server, Vitest + React Testing Library for client) but coverage is incomplete, leaving critical business logic and UI components vulnerable to regressions. The codebase uses jest-mock-extended for server-side mocking and has both isolated unit tests and integration patterns.

## Goals / Non-Goals

**Goals:**
- Achieve minimum 70% code coverage on critical paths (expenses, auth, forms, API client)
- Test all expense status workflow transitions and validation rules
- Test authentication flows and session management
- Mock Ollama service to enable reliable OCR integration tests
- Test React form components (submission, validation, error handling)
- Test API client error scenarios and retry logic
- Improve developer confidence in refactoring and future changes

**Non-Goals:**
- End-to-end testing or UI automation
- Load/stress testing
- Testing third-party libraries (Axios, React Router, Tailwind, Framer Motion)
- Manager/admin approval UI testing (not yet implemented)
- Achieving 100% coverage (diminishing returns above 70-80% on critical paths)

## Decisions

### Decision 1: Test organization by capability
**What**: Organize tests into 5 capability-focused areas matching the proposal: expense workflow, auth, Ollama integration, form components, and API client.

**Why**: Capability-focused organization aligns tests with business value and makes requirements tracing easier. Each capability has clear entry/exit points and dependencies, allowing independent test development.

**Alternatives Considered**:
- File-by-file testing (less coherent narrative, harder to track coverage by feature)
- Module-level organization (would mix concerns; OCR integration spans services)

### Decision 2: Mock external services (Ollama)
**What**: Use Jest/Vitest mocks to stub Ollama HTTP calls. Avoid dependency on running Ollama instance during tests.

**Why**: Eliminates test flakiness and external service dependency. Allows testing OCR failure scenarios and edge cases (timeout, malformed responses) deterministically. Tests run faster.

**Alternatives Considered**:
- Hit real Ollama instance (slow, flaky, external dependency, breaks in CI without setup)
- Use Ollama Docker container in test suite (adds setup complexity, still external service)

### Decision 3: Use jest-mock-extended for PrismaClient mocking on server
**What**: Leverage existing jest-mock-extended infrastructure (prisma-mock.ts) to mock PrismaClient for service layer tests.

**Why**: Already in use and proven in the codebase. Avoids database dependency during tests. Enables deterministic behavior and edge case testing.

**Alternatives Considered**:
- Test against real PostgreSQL (slower, requires Docker, fragile test data setup)
- Use in-memory SQLite (incompatible with Prisma PostgreSQL adapter)

### Decision 4: Test form components with React Testing Library user-centric approach
**What**: Test ExpenseForm and ReceiptCapture components by simulating user interactions (filling fields, clicking buttons, capturing receipts) rather than testing implementation details.

**Why**: Matches how users interact with forms, more resilient to refactoring, easier to maintain as UI evolves. Catches actual functionality issues rather than implementation leaks.

**Alternatives Considered**:
- Shallow rendering + snapshot testing (brittle, catches refactors but not bugs)
- Testing component props/state directly (implementation-focused, doesn't validate user workflows)

### Decision 5: API client tests mock Axios responses
**What**: Mock Axios HTTP layer for API client tests. Test request formatting, response parsing, error handling, and retry logic without hitting backend.

**Why**: Isolates API client logic from backend implementation. Tests can verify correct request structure and header injection without backend availability.

**Alternatives Considered**:
- Integration tests against real backend (slower, requires server running, not truly unit tests)
- Mock HTTP at browser level (more complex setup, less control)

### Decision 6: Test data builders for complex test objects
**What**: Create helper functions or test factories to generate expense objects, user objects, and API responses with valid test data.

**Why**: Reduces test verbosity, ensures consistency, makes it easy to create edge cases (negative amounts, future dates, missing fields).

**Alternatives Considered**:
- Hard-code test data in each test (verbose, inconsistent, error-prone)
- Use large fixtures (hard to modify for specific edge cases)

## Risks / Trade-offs

**[Risk] Mocking too much hides real integration bugs** → **[Mitigation]** Keep integration tests for critical paths (e.g., expense creation through full service layer). Unit tests mock dependencies; integration tests validate the seams.

**[Risk] Test coverage plateau above 70% becomes expensive** → **[Mitigation]** Focus on critical paths first (workflows, auth, API). Utility functions and edge cases have lower priority. Use coverage reports to guide focus.

**[Risk] Mock Ollama responses don't match real Ollama behavior** → **[Mitigation]** Document mock response structure and reference actual Ollama API. Periodically validate against real service. Consider occasional end-to-end test with real Ollama.

**[Risk] React Testing Library tests fail on component refactors** → **[Mitigation]** Tests query by role and label (user-centric), not by class/id. If tests break on refactoring, it's likely a UX issue worth investigating.

**[Risk] Maintaining tests becomes overhead** → **[Mitigation]** Keep tests focused and narrow in scope. Remove tests that test framework behavior rather than application logic. Periodically review and simplify.

## Migration Plan

1. **Phase 1**: Add server-side unit tests for expense workflow (status transitions, validation, deletion constraints)
2. **Phase 2**: Add authentication controller tests and session management tests
3. **Phase 3**: Add OllamaService unit tests with mocked Ollama
4. **Phase 4**: Add React component tests for ExpenseForm (submission, validation, OCR integration)
5. **Phase 5**: Add API client tests (request formatting, error handling, retry logic)
6. **Final**: Consolidate test results, generate coverage reports, identify any remaining gaps

Each phase can be developed and merged independently. No breaking changes to production code. Coverage target: 70% on critical paths by end of Phase 5.

## Open Questions

- Should we maintain separate coverage thresholds per module (e.g., 80% for services, 60% for utilities)?
- Do we want to enforce coverage gates in CI (fail PR if coverage drops below 70%)?
- Should we add visual regression testing for the form components in future iterations?
