# Proposal: Expense UI Polish and Deletion

## Goal
Improve the user experience by consolidating actions, removing unnecessary redirects to the login page (home), removing dummy data mocks, implementing the ability to delete expenses, and ensuring persistent login sessions.

## Capabilities
- **Expense Deletion**: Backend and frontend support for removing expenses.
- **Clean Data Flow**: Removal of dummy data and mock interceptors.
- **Persistent Session**: Correct storage and handling of login state to avoid unexpected redirects.
- **UI Consolidation**: Unified actions in the Expense List.

## Proposed Changes

### Backend
- **ExpensesService**: Remove dummy data generation. Add `remove` method.
- **ExpensesController**: Add `DELETE /expenses/:id` endpoint.

### Frontend
- **ExpenseListPage**: Add delete action to cards.
- **App**: Handle redirect from login to dashboard if already authenticated.
- **API Client**: Verify real data flow.
