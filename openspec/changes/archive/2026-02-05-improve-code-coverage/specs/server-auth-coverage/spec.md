## ADDED Requirements

### Requirement: Test successful login
The authentication controller SHALL accept valid email addresses and return a user session.

#### Scenario: Login with valid email
- **WHEN** a user submits a login request with a valid email address
- **THEN** the system returns a user object with userId and email, which is stored in localStorage

#### Scenario: Login returns consistent user identifier
- **WHEN** the same email logs in multiple times
- **THEN** the same userId is returned each time

### Requirement: Test login validation
The authentication controller SHALL reject invalid or missing email addresses.

#### Scenario: Login with empty email fails
- **WHEN** a user submits a login request with an empty email field
- **THEN** the system returns a 400 Bad Request error

#### Scenario: Login with invalid email format fails
- **WHEN** a user submits a login request with a malformed email (e.g., "notanemail")
- **THEN** the system returns a validation error

#### Scenario: Login without email field fails
- **WHEN** a user submits a login request without an email field
- **THEN** the system returns a 400 Bad Request error

### Requirement: Test user role assignment
The authentication system SHALL assign appropriate roles (EMPLOYEE, MANAGER, ADMIN) to users on login.

#### Scenario: New user receives EMPLOYEE role by default
- **WHEN** a user logs in for the first time with a new email
- **THEN** the user is assigned the EMPLOYEE role

#### Scenario: Existing user role persists across logins
- **WHEN** a user logs in again after previous login
- **THEN** the user retains their previously assigned role

### Requirement: Test authentication state persistence
The authentication system SHALL maintain user session in localStorage and validate on page refresh.

#### Scenario: User session persists after page reload
- **WHEN** a user logs in and the page is reloaded
- **THEN** the user remains logged in with userId and email in localStorage

#### Scenario: Protected routes redirect unauthenticated users
- **WHEN** an unauthenticated user attempts to access a protected route
- **THEN** the user is redirected to the login page
