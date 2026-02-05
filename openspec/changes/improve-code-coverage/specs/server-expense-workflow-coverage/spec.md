## ADDED Requirements

### Requirement: Test expense status transitions
The test suite SHALL validate all valid expense status transitions: DRAFT → SUBMITTED → APPROVED, DRAFT → SUBMITTED → REJECTED, DRAFT → SUBMITTED → REVISION_REQUESTED, and REVISION_REQUESTED → SUBMITTED.

#### Scenario: Valid DRAFT to SUBMITTED transition
- **WHEN** an expense in DRAFT status is submitted
- **THEN** the status transitions to SUBMITTED and the expense is persisted

#### Scenario: Invalid transition from SUBMITTED to DRAFT
- **WHEN** attempting to change an expense status from SUBMITTED back to DRAFT
- **THEN** the operation is rejected with an appropriate error

#### Scenario: REVISION_REQUESTED transitions to SUBMITTED
- **WHEN** an expense in REVISION_REQUESTED status is resubmitted
- **THEN** the status transitions to SUBMITTED

### Requirement: Test rejection and approval workflows
The test suite SHALL verify that rejected expenses can be edited and resubmitted, and that approved expenses cannot be modified.

#### Scenario: Rejected expense can be edited
- **WHEN** an expense has status REJECTED with a rejection reason
- **THEN** the expense can be edited and resubmitted

#### Scenario: Approved expense cannot be edited
- **WHEN** an expense has status APPROVED
- **THEN** attempting to update the expense is rejected

### Requirement: Test expense deletion constraints
The test suite SHALL ensure expenses can only be deleted when in DRAFT, REJECTED, or REVISION_REQUESTED status.

#### Scenario: Delete DRAFT expense succeeds
- **WHEN** deleting an expense in DRAFT status
- **THEN** the expense is removed from the database

#### Scenario: Delete SUBMITTED expense fails
- **WHEN** attempting to delete an expense in SUBMITTED status
- **THEN** the operation is rejected with a constraint violation error

#### Scenario: Delete APPROVED expense fails
- **WHEN** attempting to delete an expense in APPROVED status
- **THEN** the operation is rejected

### Requirement: Test edge cases in workflow validation
The test suite SHALL cover boundary conditions like missing required fields, invalid amounts, and concurrent updates.

#### Scenario: Submit expense without amount fails
- **WHEN** submitting an expense with amount null or undefined
- **THEN** the submission is rejected

#### Scenario: Submit expense with negative amount fails
- **WHEN** submitting an expense with a negative amount
- **THEN** the submission is rejected

#### Scenario: Concurrent updates resolve correctly
- **WHEN** two concurrent update requests are made to the same expense
- **THEN** only one update succeeds and the other is rejected with a conflict error
