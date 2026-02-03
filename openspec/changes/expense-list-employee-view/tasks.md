## 1. Backend — Data Model Enrichment

- [x] 1.1 Update `server/prisma/schema.prisma` to add `description`, `rejectionReason`, `approvedAt`, `approvedBy`, and `category` fields to `Expense` model.
- [x] 1.2 Run `npx prisma migrate dev --name add_expense_details` to update the database.
- [x] 1.3 Ensure `ExpensesService` in `server/src/expenses/expenses.service.ts` includes these fields in the returned data (Prisma should do this by default, but check for any explicit projections).

## 2. Frontend — Infrastructure & Types

- [x] 2.1 Update `Expense` interface in `client/src/pages/ExpenseListPage.tsx` to include the new fields.
- [x] 2.2 Add `useDebounce` hook or utility to `client/src/lib/utils.ts` or as a local hook.

## 3. Frontend — Layout Refactor

- [x] 3.1 Remove the `aside` sidebar from `ExpenseListPage.tsx`.
- [x] 3.2 Update the `header` to occupy full width and center the search bar.
- [x] 3.3 Remove the grid/list toggle buttons and logic (focusing on list view).
- [x] 3.4 Update the main container to `max-w-7xl mx-auto`.

## 4. Frontend — Features

- [x] 4.1 Implement `FilterChips` component/logic with counters for each status.
- [x] 4.2 Implement `SortDropdown` for date and amount.
- [x] 4.3 Implement real-time search with debouncing.
- [x] 4.4 Add the "Nécessite une action" section for `DRAFT` and `REJECTED` expenses.
- [x] 4.5 Update `ExpenseCard` with status-aware buttons ("Terminer", "Corriger", "Voir") and status-specific styling.

## 5. Frontend — Routing

- [x] 5.1 Implement `handleExpenseClick` to navigate to `/expenses/:id` (detail) or `/expenses/:id/edit` (edit) based on status.

## 6. Verification

- [x] 6.1 Run backend migrations and verify schema.
- [x] 6.2 Verify frontend search, filter, and sort interactions.
- [x] 6.3 Ensure "Action Required" section highlights priority items.
