# Spec: Clean Data Flow

## User Requirements
- Base the application on real data from the database.
- Do not show dummy/mock data.

## Technical Requirements

### Backend
- **ExpensesService**: Remove the auto-generation of dummy data in `findAll`. If no expenses are found, return an empty array.

### Frontend
- **API Client**: Remove or disable the mock interceptor that modifies requests if it's no longer necessary or if it masks real behavior.
- Ensure the "Empty State" UI in `ExpenseListPage` works correctly when the real list is empty.
