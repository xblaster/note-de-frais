# Requirement: Expense Edition and Workflow Evolution

## Overview
Allow employees to edit their expenses in specific statuses and evolve the workflow to include a revision request loop.

## User Stories
- **As an Employee**, I want to edit my expense if it's in `DRAFT` or `REVISION_REQUESTED` status so that I can correct errors.
- **As a Manager**, I want to request a revision for an expense if information is missing or incorrect, instead of just rejecting it.
- **As an Employee**, I want to see why an expense needs revision.

## Workflow Evolution
The expense lifecycle will be updated:
- `DRAFT`: Initial state. Editable by employee.
- `SUBMITTED`: Awaiting approval. Not editable.
- `REVISION_REQUESTED`: Sent back by manager. Editable by employee. Can be re-submitted to `SUBMITTED`.
- `APPROVED`: Final state. Not editable.
- `REJECTED`: Final state. Not editable.

## Functional Requirements
1. **New Status**: Add `REVISION_REQUESTED` to `ExpenseStatus`.
2. **Editing**: Implement an update endpoint for expenses.
3. **Manager Action**: Add an action for managers to request revision with a comment (using `rejectionReason` field or a new one).
4. **UI**:
    - Update expense status badges.
    - Add "Edit" action for `DRAFT` and `REVISION_REQUESTED`.
    - Add "Request Revision" action for managers in the approval view.
