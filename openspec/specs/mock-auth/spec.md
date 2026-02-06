# Spec: Mock Authentication

## Purpose
This spec defines the mock authentication system used for development and testing.

## Requirements

### Requirement: Role Selection Mock
The system SHALL provide a role selection dropdown on the login page for development environments.

#### Scenario: Select a role and login
- **WHEN** the user selects a role (e.g., ADMIN) from the dropdown
- **THEN** the system logs them in with that role and redirects them to the appropriate dashboard

### Requirement: Mock JWT Generation
The backend SHALL generate a JWT containing the selected mock role when the mock login is used.

#### Scenario: JWT contains role
- **WHEN** the mock login endpoint is called with a specific role
- **THEN** the returned JWT includes the `role` claim matching the selection
