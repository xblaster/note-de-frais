## Context

Currently, the `server` has a default NestJS Jest configuration with minimal tests. The `client` has no testing framework at all. We need a unified approach to ensure quality across the full stack.

## Goals / Non-Goals

**Goals:**
- Enable fast, reliable unit testing in both frontend and backend.
- Establish patterns for mocking and dependency injection in tests.
- Integrate testing into the developer workflow.

**Non-Goals:**
- Implementing exhaustive E2E tests for every screen (focus is on unit/integration).
- Setting up a cloud CI/CD pipeline in this step.

## Decisions

### Decision 1: Vitest for Frontend
**Rationale:** Vitest is significantly faster than Jest for Vite-based projects and shares a similar API, making it easy for NestJS (Jest) developers to switch between.
**Alternatives:** Jest (harder to configure with Vite 4+), Cypress Component Testing (heavier).

### Decision 2: Prisma Mocking in Backend
**Rationale:** Use `@prisma/client` mocking or `DeepMockProxy` from `jest-mock-extended` to test services without a live database.
**Alternatives:** Test database (slower, requires setup/cleanup management).

## Risks / Trade-offs

- **[Risk]** Divergent testing frameworks (Jest vs Vitest). 
  - **Mitigation**: Vitest's API is mostly compatible with Jest, minimizing cognitive load.
- **[Risk]** Mocking too much might miss integration bugs.
  - **Mitigation**: Complement with a few key E2E/Integration tests later.
