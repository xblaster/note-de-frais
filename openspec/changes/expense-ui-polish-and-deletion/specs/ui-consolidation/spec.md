# Spec: UI Consolidation

## User Requirements
- Remove actions that redirect to the home/login page unnecessarily.
- Clean up the Expense List interface to focus on management and tracking.

## Technical Requirements

### Expense Card Actions
- Ensure the "Voir" action stays within the application (e.g., `/expenses/:id`).
- Ensure "Terminer" or "Corriger" leads to the edit page.
- Add "Supprimer" as a secondary action (e.g., in a dropdown or a separate button).

### Navigation
- Breadcrumbs or back buttons should always lead to `/dashboard` or the previous application page, never the login page unless explicitly logging out.
- The logo/brand name in the header should link to `/dashboard`.
