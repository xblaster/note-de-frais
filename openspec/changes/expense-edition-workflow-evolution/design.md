# Design: Expense Edition and Workflow Evolution

## Backend Changes

### 1. Prisma
Update `ExpenseStatus` enum to include `REVISION_REQUESTED`.

### 2. NestJS Service
- `ExpensesService.update(id, data)`: Implement with status check (only `DRAFT` or `REVISION_REQUESTED`).
- `ExpensesService.requestRevision(id, reason)`: New method to change status and set `rejectionReason`.
- Update `ExpensesService.submit(id)`: Allow submission from `REVISION_REQUESTED`.

### 3. NestJS Controller
- `PATCH /expenses/:id`: Endpoint for updating.
- `POST /expenses/:id/request-revision`: Endpoint for managers.

## Frontend Changes

### 1. Types
Update `ExpenseStatus` type/enum in frontend to match Prisma.

### 2. Components
- `ExpenseCard`: Add logic for "Edit" button and `REVISION_REQUESTED` badge.
- `ExpenseForm`: Refactor to support both Create and Edit modes.

### 3. Pages
- `ExpenseListPage`: Ensure it handles the new status correctly.
- `ExpenseEditPage`: New page or modal for editing.
