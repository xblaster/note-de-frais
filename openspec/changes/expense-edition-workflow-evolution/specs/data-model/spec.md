# Data Model: Expense Edition and Workflow Evolution

## Enum Updates

### `ExpenseStatus`
Added `REVISION_REQUESTED` to the status enum.

```prisma
enum ExpenseStatus {
  DRAFT
  SUBMITTED
  REVISION_REQUESTED // New status
  APPROVED
  REJECTED
}
```

## Model Considerations
- The `rejectionReason` field in `Expense` model will be used to store the reasoning when a manager requests a revision, similar to how it's used for rejections.
