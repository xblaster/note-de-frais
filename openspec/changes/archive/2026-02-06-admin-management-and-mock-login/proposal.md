## Why

To accelerate development and testing of role-based features (Employee, Manager, Admin) without requiring a fully integrated external authentication provider or complex user management in the early stages. This also establishes the foundation for administrative oversight of the expense management system.

## What Changes

- **Mock Authentication**: Implementation of a "Developer/Mock" login mode where users can select their role (EMPLOYEE, MANAGER, ADMIN) from a dropdown to bypass standard credential entry.
- **Admin Workspace**: A new dedicated section for administrative tasks, accessible only to users with the ADMIN role.
- **Role-Based Access Control (RBAC)**: Basic client-side and server-side checks to ensure users can only access features appropriate for their selected mock role.

## Capabilities

### New Capabilities
- `mock-auth`: System to simulate user authentication and role assignment for development purposes.
- `admin-management`: Administrative dashboard for managing system-wide settings and potentially overseeing all users/expenses.

### Modified Capabilities
- `expense-workflow`: Requirements might change to ensure ADMINs can view or override certain workflow steps if necessary.

## Impact

- **Frontend**: New login page UI with role selector; new Admin route and layout; protected route logic updates.
- **Backend**: Mock auth middleware/guards to interpret the selected mock role; new admin-specific endpoints.
- **Security**: This is a development/testing feature and must be disabled or strictly guarded in production environments.
