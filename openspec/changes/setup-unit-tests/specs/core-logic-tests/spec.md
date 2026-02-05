## ADDED Requirements

### Requirement: Expense Submission Validation Tests
The unit tests SHALL verify that expense submission logic correctly handles valid and invalid data (e.g., missing amount, future date).

#### Scenario: Validating valid expense
- **WHEN** submission logic receives an expense with all required fields
- **THEN** it accepts the submission and calls the corresponding persistence layer

### Requirement: Receipt Capture UI Tests
The frontend unit tests SHALL verify that the `ReceiptCapture` component correctly handles file selection and camera triggers.

#### Scenario: Selecting a file
- **WHEN** a user selects an image file in the `ReceiptCapture` component
- **THEN** the component triggers the upload/processing callback
