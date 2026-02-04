# Spec: Persistent Session

## User Requirements
- The user remains logged in even after refreshing the page.
- The application does not redirect to the login page if a valid session exists.

## Technical Requirements

### Client Storage
- Ensure `userId` and `userEmail` are stored in `localStorage` upon successful login.
- Verify `api-client.ts` uses the `userId` from `localStorage` consistently.

### Routing
- **App.tsx**: Update the root path `/` to redirect to `/dashboard` if `userId` is already present in `localStorage`.
- **ProtectedRoute**: Ensure it correctly reads the `userId` and doesn't prematurely redirect to `/`.

### Login Page
- Add a check in `useEffect` to redirect the user to `/dashboard` if they are already "logged in".
