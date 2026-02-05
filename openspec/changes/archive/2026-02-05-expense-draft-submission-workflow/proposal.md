# Design: Expense Draft and Submission Workflow

## Overview
Currently, new expenses are automatically saved as `DRAFT`. Users must then submit them in a separate step. The goal is to allow users to choose between saving as a draft or submitting directly when creating or editing an expense.

## Proposed Changes

### 1. Frontend: Expense Form Enhancements
- **Draft Action**: Add a "Sauvegarder en brouillon" button.
- **Submit Action**: Add a "Soumettre pour validation" button (repurposing the current submit button).
- **State Management**: The `ExpenseForm` will handle which button was clicked and pass the target status to the `onSubmit` callback.
- **Visual Feedback**: Buttons should look distinct (e.g., primary for Submit, outline/ghost for Draft).

### 2. Frontend: Page Integrations
- Update `ExpenseCreatePage.tsx` and `ExpenseEditPage.tsx` to handle the new status-aware submission.
- Ensure the API client call includes the `status` field.

### 3. Backend: API Updates
- **DTOs**: Update Create/Update logic to accept an optional `status` field.
- **Service Logic**:
  - `create`: Allow specifying `status` (default to `DRAFT`).
  - `update`: Allow specifying `status` (e.g., to submit while updating).
- **Validation**: Ensure employees can only transition to `DRAFT` or `SUBMITTED`.

## Implementation Details

### API Signature Changes
`POST /expenses` body:
```json
{
  "amount": number,
  "date": string,
  "vendor": string,
  "userId": string,
  "status": "DRAFT" | "SUBMITTED"
}
```

`PATCH /expenses/:id` body:
```json
{
  "amount": number,
  "date": string,
  "vendor": string,
  "userId": string,
  "status": "DRAFT" | "SUBMITTED"
}
```

## User Experience
When creating an expense after an OCR analysis, the user can review the data and choose to submit it immediately or keep it as a draft if they are missing information or want to finish later.
