# Tasks: Expense Draft and Submission Workflow

## Backend Implementation
- [x] Update `ExpensesService.create` to handle optional `status` <!-- id: 0 -->
- [x] Update `ExpensesService.update` to handle optional `status` (allowing transitions like DRAFT -> SUBMITTED) <!-- id: 1 -->
- [x] Update `ExpensesController` methods to pass the `status` from the request body <!-- id: 2 -->

## Frontend Implementation
- [x] Add "Enregistrer comme brouillon" and "Soumettre" buttons to `ExpenseForm` <!-- id: 3 -->
- [x] Update `ExpenseForm` to emit the selected status on submit <!-- id: 4 -->
- [x] Modify `ExpenseCreatePage` to use the new submission flow <!-- id: 5 -->
- [x] Modify `ExpenseEditPage` to use the new submission flow <!-- id: 6 -->

## Verification
- [ ] Test manual creation as Draft <!-- id: 7 -->
- [ ] Test manual creation as Submitted <!-- id: 8 -->
- [ ] Test editing a Draft and promoting it to Submitted <!-- id: 9 -->
