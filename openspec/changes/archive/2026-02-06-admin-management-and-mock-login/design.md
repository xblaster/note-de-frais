## Context

The project currently lacks an administrative interface and an easy way for developers to switch between user roles for testing. This change introduces a mock authentication system and the skeleton of an admin dashboard.

## Goals / Non-Goals

**Goals:**
- Provide a UI for developers to select a role during login.
- Implement role-based routing in the React frontend.
- Add backend guards to enforce roles based on JWT claims.
- Create an Admin Dashboard shell.

**Non-Goals:**
- Implementing a real authentication provider (e.g., Auth0, Firebase).
- Detailed user management (creating/deleting users).
- Complete administrative functionality for all system entities.

## Decisions

### Mock Login Implementation
- **Rationale**: Using a simple selectbox on the login page avoids the need for a database of users with specific roles during early development.
- **Alternatives**: Pre-seeding a database with users (more complex to manage/remember credentials).

### Frontend Role-Based Routing
- **Decision**: Use a higher-order component or a wrapper component for routes that require specific roles.
- **Rationale**: Centralizes access control logic and makes it easy to protect new routes.

### Backend Role Guards
- **Decision**: Implement a NestJS `RolesGuard` that checks the `role` claim in the JWT.
- **Rationale**: Standard NestJS pattern for RBAC.

## Risks / Trade-offs

- **[Risk]**: Mock login could accidentally be enabled in production.
- **[Mitigation]**: Wrap mock login features in an environment check (`NODE_ENV !== 'production'`).
