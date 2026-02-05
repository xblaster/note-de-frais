## 1. Backend Testing Infrastructure

- [ ] 1.1 Update `server/jest.config.js` or `package.json` for better coverage reporting and mocking.
- [ ] 1.2 Create backend test utilities for Prisma mocking.

## 2. Frontend Testing Infrastructure

- [ ] 2.1 Install `vitest`, `@testing-library/react`, `happy-dom`, and `@vitejs/plugin-react` in `client`.
- [ ] 2.2 Create `client/vitest.config.ts` and `client/src/test/setup.ts`.
- [ ] 2.3 Add `test` and `test:watch` scripts to `client/package.json`.

## 3. Core Unit Tests Implementation

- [ ] 3.1 Implement unit tests for `ExpensesService` in the backend.
- [ ] 3.2 Implement component tests for `ReceiptCapture` in the frontend.
- [ ] 3.3 Verify all tests pass with `pnpm test` in both directories.
