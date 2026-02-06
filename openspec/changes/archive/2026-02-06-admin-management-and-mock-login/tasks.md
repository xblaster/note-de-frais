## 1. Backend: Mock Auth & RBAC

- [x] 1.1 Update `AuthController.login` to support an optional `role` in the request body
- [x] 1.2 Implement a `Roles` decorator and a `RolesGuard` to protect routes based on JWT claims
- [x] 1.3 Add a `/auth/me` endpoint to verify the current user's session and role

## 2. Frontend: Mock Login Enhancements

- [x] 2.1 Add a "Role Selection" dropdown to the `LoginPage` component
- [x] 2.2 Update `handleLogin` to send the selected role to the backend
- [x] 2.3 Store the user's role in `localStorage` upon successful login

## 3. Frontend: Protected Routes & Admin Dashboard

- [x] 3.1 Create a `ProtectedRoute` component that checks for authentication and required roles
- [x] 3.2 Update `App.tsx` to use `ProtectedRoute` for the `/admin` route
- [x] 3.3 Create a basic `AdminDashboardPage` component
- [x] 3.4 Implement a "Global Expenses" view in the Admin Dashboard
