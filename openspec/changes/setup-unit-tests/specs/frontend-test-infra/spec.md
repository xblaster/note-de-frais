## ADDED Requirements

### Requirement: Frontend Testing Framework
The client application SHALL use **Vitest** as the primary test runner and **React Testing Library** for component testing.

#### Scenario: Running vitest
- **WHEN** the command `pnpm test` is executed in the `client` directory
- **THEN** Vitest starts and executes all files matching `**/*.spec.ts` or `**/*.spec.tsx`

### Requirement: Component Testing Setup
The frontend SHALL have a global test setup that provides a clean rendering environment using **Happy DOM**.

#### Scenario: Renders a component
- **WHEN** a React component is rendered using `render()` from `@testing-library/react` in a test
- **THEN** the component is correctly mounted in the virtual DOM for assertions
