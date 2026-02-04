# Tasks: Expense UI Polish and Deletion

- [x] Preparation
    - [x] Create OpenSpec change artifacts (Proposal, Specs, Design, Tasks)
- [/] Backend Implementation
    - [x] Update `ExpensesService.findAll` to remove dummy data generation.
    - [x] Add `remove(id: string, userId: string)` to `ExpensesService`.
    - [x] Add `DELETE /expenses/:id` to `ExpensesController`.
- [x] Frontend Implementation: Session persistence
    - [x] Update `App.tsx` to redirect from `/` to `/dashboard` if `userId` exists.
    - [x] Update `LoginPage.tsx` to redirect if already authenticated.
    - [x] Remove mock interceptor in `api-client.ts`.
- [x] Frontend Implementation: Deletion
    - [x] Update `ExpenseCard` in `ExpenseListPage.tsx` with a delete button.
    - [x] Implement `handleDelete` logic in `ExpenseListPage.tsx`.
- [x] Verification
    - [x] Verify fresh login works.
    - [x] Verify persistence on refresh.
    - [x] Verify deletion of real data.
    - [x] Verify empty state UI.
