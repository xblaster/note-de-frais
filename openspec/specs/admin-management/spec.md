# Spec: Admin Management

## Purpose
This spec defines the administrative interface and oversight capabilities of the system.

## Requirements

### Requirement: Admin Dashboard Access
The system SHALL restrict access to the `/admin` route to users with the ADMIN role.

#### Scenario: Admin access
- **WHEN** a user with the ADMIN role navigates to `/admin`
- **THEN** the system displays the Admin Dashboard

#### Scenario: Unauthorized access
- **WHEN** a user without the ADMIN role navigates to `/admin`
- **THEN** the system redirects them to their default dashboard or shows an Access Denied message

### Requirement: Global Expense Oversight
The Admin Dashboard SHALL allow admins to view all expenses submitted by any user.

#### Scenario: View all expenses
- **WHEN** an admin views the global expenses list
- **THEN** the system displays expenses from all employees across all reports
