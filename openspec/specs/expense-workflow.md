# Spec: Expense Draft and Submission Workflow

## Requirements
- Users can save an expense as a draft (`DRAFT`) or submit it (`SUBMITTED`) at any time (creation or editing).
- The transition from draft to submitted should be seamless.

### Requirement: Admin Workflow Oversight
The system SHALL allow ADMIN users to view and potentially modify the status of any expense in the system.

#### Scenario: Admin views a submitted expense
- **WHEN** an admin views an expense in SUBMITTED status
- **THEN** they see all details and have the option to trigger actions defined for validators (APPROVE/REJECT)

## Backend Changes

### Expenses Service
- **create**: Update to accept an optional `status`. If `status === 'SUBMITTED'`, ensure validation for submission.
- **update**: Update to accept an optional `status`. Allows submitting an expense while editing.
- **Validation**: Ensure that only `DRAFT` and `SUBMITTED` statuses are allowed to be set by the user during create/update.

### Expenses Controller
- Update `create` method to extract `status` from the request body.
- Update `update` method to extract `status` from the request body.

## Frontend Changes

### `ExpenseForm` Component
- Add a new "Draft" button.
- Rename/style the "Submit" button to be more explicit ("Soumettre").
- Pass the target status to the `onSubmit` callback.

### `ExpenseCreatePage` and `ExpenseEditPage`
- Handle the status in the submission logic.
- Ensure the API calls include the `status`.

## Test Plan
- Create an expense as DRAFT.
- Create an expense as SUBMITTED.
- Edit a DRAFT expense and keep it as DRAFT.
- Edit a DRAFT expense and change it to SUBMITTED.
- Edit a REVISION_REQUESTED expense and change it to SUBMITTED.
