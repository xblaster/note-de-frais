# UI Design: Expense Edition and Workflow Evolution

## Components

### Expense Card (Employee View)
- **Status Badge**: Add `REVISION_REQUESTED` variant (e.g., orange/amber).
- **Actions**:
  - Show "Edit" button if status is `DRAFT` or `REVISION_REQUESTED`.
  - Display `rejectionReason` prominently if status is `REVISION_REQUESTED`.

### Expense Card / Detail (Manager View)
- **Actions**:
  - Add "Request Revision" button next to Approve/Reject.
  - Clicking "Request Revision" opens a dialog to input the reason.

### Expense Edit Form
- Re-use the "Add Expense" form component.
- Populate with existing data.
- Update "Create" button text to "Save Changes".

## Interactions
- **Employee**: Expense List -> Edit -> Update Form -> Status stays `DRAFT` or `REVISION_REQUESTED` until Submit.
- **Manager**: Expense Detail -> Request Revision -> Dialog Input -> Status changes to `REVISION_REQUESTED`.
