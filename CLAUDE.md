# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Note de Frais** — a French-language expense management application with receipt capture (OCR via Ollama), validation workflows, and reimbursement tracking. Monorepo with a React frontend and NestJS backend. All UI text is in French.

## Tech Stack

- **Frontend**: React 19, Vite 7, TypeScript, Tailwind CSS 4, React Router 7, Axios, Framer Motion
- **Backend**: NestJS 11, Prisma 7, PostgreSQL 15, Ollama (qwen3-vl:2b for receipt OCR)
- **Package Manager**: pnpm (required)
- **Database**: PostgreSQL via Docker
- **Testing**: Jest (server), Vitest + React Testing Library (client)

## Development Commands

### Prerequisites

```bash
# Start PostgreSQL container (from repo root)
docker compose up -d

# Generate Prisma client and run migrations (from server/)
cd server
pnpm exec prisma generate
pnpm exec prisma migrate dev

# Pull Ollama model for receipt OCR (optional)
ollama pull qwen3-vl:2b
```

### Server (`server/`)

```bash
pnpm run start:dev       # Dev server with hot reload (port 3000)
pnpm run build           # Compile TypeScript (nest build)
pnpm run test            # Jest unit tests
pnpm run test:watch      # Jest watch mode
pnpm run test:cov        # Coverage report
pnpm run test:e2e        # End-to-end tests
pnpm run lint            # ESLint with auto-fix
pnpm run format          # Prettier formatting
```

Run a single test file: `pnpm run test -- expenses.service.spec`

### Client (`client/`)

```bash
pnpm run dev             # Vite dev server with HMR (port 5173)
pnpm run build           # TypeScript check + Vite production build
pnpm run test            # Vitest unit tests
pnpm run test:watch      # Vitest watch mode
pnpm run lint            # ESLint
```

Run a single test file: `pnpm run test -- ReceiptCapture`

## Architecture

### Backend (NestJS Modules)

```
server/src/
├── main.ts                     # Bootstrap, CORS for localhost:5173, static /uploads/
├── app.module.ts               # Root module: PrismaModule, AuthModule, ExpensesModule
├── prisma/
│   ├── prisma.module.ts        # Global database module
│   └── prisma.service.ts       # PrismaClient with @prisma/adapter-pg + pg.Pool
├── auth/
│   └── auth.controller.ts      # POST /auth/login (mock auth, email-only, no JWT)
├── expenses/
│   ├── expenses.controller.ts  # Full CRUD + workflow endpoints (see API below)
│   └── expenses.service.ts     # Business logic with status validation
├── ollama/
│   └── ollama.service.ts       # Receipt OCR: base64 image → {vendor, amount, date}
└── test/
    └── prisma-mock.ts          # jest-mock-extended helper for mocking PrismaClient
```

### API Endpoints

```
POST   /auth/login                    # Email-only mock login
GET    /expenses?userId=              # List user expenses
POST   /expenses                      # Create expense (multipart, file field: "receipt")
PATCH  /expenses/:id                  # Update expense (JSON body)
DELETE /expenses/:id?userId=          # Delete (only DRAFT/REJECTED/REVISION_REQUESTED)
POST   /expenses/:id/submit          # Submit for approval
POST   /expenses/:id/request-revision # Request revision (manager action)
POST   /expenses/analyze             # Analyze receipt image via Ollama
```

File uploads: Multer stores to `./uploads/`, accepts jpg|jpeg|png|webp, max 5MB, UUID filenames.

### Frontend (React)

```
client/src/
├── App.tsx                     # Routes: /, /dashboard, /expenses/new, /expenses/edit/:id
├── api/api-client.ts           # Axios, auto-injects userId from localStorage
├── lib/utils.ts                # cn(), formatCurrency (EUR), formatDate (fr-FR)
├── hooks/use-debounce.ts       # Debounce hook for search
├── pages/
│   ├── LoginPage.tsx           # Email-only login
│   ├── ExpenseListPage.tsx     # Dashboard with filtering, search, sorting, action required
│   ├── CreateExpensePage.tsx   # New expense with receipt capture
│   └── ExpenseEditPage.tsx     # Edit expense, shows rejection reason
└── components/
    ├── ExpenseForm.tsx         # Reusable form with receipt capture + auto OCR analysis
    └── ReceiptCapture.tsx      # Camera capture or file upload for receipts
```

Path alias: `@/*` maps to `./src/*` (vite.config.ts and tsconfig.app.json).

Auth state: `userId` and `userEmail` in localStorage. Protected routes redirect to `/` if missing.

### Database Schema (Prisma)

- **User**: id (uuid), email (unique), password, role (EMPLOYEE/MANAGER/ADMIN)
- **Expense**: id (uuid), amount, date, vendor?, description?, category?, status, rejectionReason?, approvedAt?, approvedBy?, screenshotUrl?, userId (FK)
- **ExpenseStatus**: DRAFT → SUBMITTED → APPROVED | REJECTED | REVISION_REQUESTED

Schema: `server/prisma/schema.prisma`. Config: `server/prisma.config.ts`.

### Environment Variables

Copy `.env.example` to `.env` at repo root:
- `DATABASE_URL` — Prisma connection string (default: `postgresql://postgres:postgres@localhost:5432/antigravity_db`)
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — used by docker-compose

## Key Patterns

- **Expense status workflow**: Status transitions are enforced in `expenses.service.ts`. Deletion only allowed for DRAFT, REJECTED, or REVISION_REQUESTED. Updates and submissions only for DRAFT or REVISION_REQUESTED.
- **OCR integration**: `OllamaService.analyzeReceipt()` sends base64 images to Ollama with a manual JSON schema (not zod). Returns `{vendor, amount, date}` with null support. Model: `qwen3-vl:2b`.
- **Server testing**: Uses `jest-mock-extended` to deep-mock PrismaClient. See `server/src/test/prisma-mock.ts`.
- **Client testing**: Vitest with happy-dom environment. Setup in `client/src/test/setup.ts` (React Testing Library cleanup).

## Test Coverage

The project has **comprehensive unit test coverage** on critical paths:

### Server Tests (Jest - 42 tests)

**Test Files:**
- `expenses.service.spec.ts` — 25 tests covering:
  - All status transitions (DRAFT → SUBMITTED → APPROVED/REJECTED/REVISION_REQUESTED)
  - Invalid transition validation (e.g., SUBMITTED → DRAFT fails)
  - Deletion constraints (only DRAFT/REJECTED/REVISION_REQUESTED allowed)
  - Update constraints (only DRAFT/REVISION_REQUESTED allowed)
  - Edge cases (missing amounts, negative values, authorization checks)
- `auth.controller.spec.ts` — 8 tests covering:
  - Login flows with valid/invalid emails
  - Consistent userId generation across logins
  - Default EMPLOYEE role assignment
  - Role persistence and mock JWT generation
- `ollama.service.spec.ts` — 9 tests documenting:
  - Service interface and method signatures
  - Expected response format for OCR results
  - Error handling behavior

**Coverage:**
- Auth Controller: **100% statements, 83.33% branches**
- Expenses Service: **97.29% statements, 95.65% branches**

### Client Tests (Vitest - 31 tests)

**Test Files:**
- `ExpenseForm.spec.tsx` — 15 tests covering:
  - Form rendering and field initialization
  - Validation (required fields, amount format, date validation)
  - Form submission (DRAFT vs SUBMITTED status)
  - Receipt capture integration
  - Error display and handling
  - State persistence and form clearing
- `ReceiptCapture.spec.tsx` — 5 tests covering:
  - File upload and camera capture UI
  - Preview display and clearing
- `api-client.spec.ts` — 11 tests covering:
  - Request interceptor configuration
  - userId auto-injection for `/expenses` endpoints
  - localStorage handling

**Running Tests:**
```bash
# Server
cd server
pnpm test                    # Run all tests
pnpm test -- expenses.service.spec  # Single test file
pnpm test:cov                # With coverage report
pnpm test:watch              # Watch mode

# Client
cd client
pnpm test                    # Run all tests
pnpm test -- ExpenseForm     # Single test file
pnpm test:watch              # Watch mode
```

**Test Patterns:**
- Mock PrismaClient using `jest-mock-extended` for database isolation
- Test component behavior (not implementation) with React Testing Library
- Use real localStorage in tests (no mocking) for client-side state
- Document expected behavior when external mocking is complex (e.g., Ollama)

## Design System

Dark theme with glassmorphism. Background: `#09090b`, primary: indigo `#6366f1`. CSS classes in `index.css`: `.glass`, `.glass-card`, `.input-premium`, `.btn-premium`. Framer Motion animations throughout. Font: Outfit.

## Current Limitations

- Auth is mocked — no password verification, no real JWT, no RBAC guards
- No manager/admin approval UI
- No expense report grouping or reimbursement tracking
- Development is Windows-first (PowerShell preferred)
