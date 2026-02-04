# API: Expense Edition and Workflow Evolution

## Endpoints

### `PATCH /expenses/:id`
Allows updating an existing expense.
- **Allowed for**: Owner (Employee).
- **Condition**: Status must be `DRAFT` or `REVISION_REQUESTED`.
- **Payload**:
  - `amount`: Number (optional)
  - `date`: ISO Date (optional)
  - `vendor`: String (optional)
  - `description`: String (optional)
  - `category`: String (optional)

### `POST /expenses/:id/request-revision`
Manager requests clarification or correction.
- **Allowed for**: Managers.
- **Payload**:
  - `reason`: String (required)
- **Effect**: Changes status to `REVISION_REQUESTED` and sets `rejectionReason`.

### `POST /expenses/:id/submit` (Existing)
Already exists, but logic should be updated to allow submission from both `DRAFT` and `REVISION_REQUESTED`.
