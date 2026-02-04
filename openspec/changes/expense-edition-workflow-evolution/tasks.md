# Tasks: Expense Edition and Workflow Evolution

## Database
- [ ] Add `REVISION_REQUESTED` to `ExpenseStatus` in `schema.prisma`
- [ ] Run `npx prisma migrate dev --name add_revision_requested_status`

## Backend
- [ ] Update `ExpenseStatus` enum in TypeScript if manually defined.
- [ ] Implement `update` method in `ExpensesService`.
- [ ] Implement `requestRevision` method in `ExpensesService`.
- [ ] Update `submit` logic in `ExpensesService`.
- [ ] Add controller endpoints for update and request-revision.

## Frontend
- [ ] Update frontend `ExpenseStatus` type/enum.
- [ ] Update `ExpenseStatusBadge` component for the new status.
- [ ] Refactor `ExpenseForm` into a reusable component for Create/Edit.
- [ ] Create `ExpenseEditPage`.
- [ ] Add "Edit" button to `ExpenseCard` for valid statuses.
- [ ] Add "Request Revision" button for managers.
