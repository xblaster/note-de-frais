# Spec: Expense Deletion

## User Requirements
- The user must be able to delete an expense that was added by error.
- Only expenses in `DRAFT` or `REJECTED` status should be deletable (to prevent deleting approved/submitted ones, or as per general business rule unless specified otherwise - user said "added by error", usually applies to drafts).

## Technical Requirements

### Backend
- **Endpoint**: `DELETE /expenses/:id`
- **Validation**:
  - Ensure the expense exists.
  - Ensure the expense belongs to the requesting `userId`.
  - (Optional) Check status if needed.
- **Service**: Implement `remove(id, userId)` in `ExpensesService`.

### Frontend
- **UI**: Add a delete icon (trash can) to the `ExpenseCard`.
- **Action**: Show a confirmation dialog or handle immediate deletion with a toast notification.
- **State**: Refresh the expense list after successful deletion.
