# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Note de Frais** (Expensify) — a French-language expense management application with receipt capture, validation workflows, and reimbursement tracking. Monorepo with a React frontend and NestJS backend. Currently in early development with mock authentication and dummy data.

## Tech Stack

- **Frontend**: React 19, Vite 7, TypeScript, Tailwind CSS 4, React Router 7, Axios, Framer Motion
- **Backend**: NestJS 11, Prisma 7, PostgreSQL 15
- **Package Manager**: pnpm (required)
- **Database**: PostgreSQL via Docker

## Development Commands

### Prerequisites

```bash
# Start PostgreSQL container (from repo root)
docker compose up -d

# Generate Prisma client and run migrations (from server/)
pnpm exec prisma generate
pnpm exec prisma migrate dev
```

### Server (`server/`)

```bash
pnpm run start:dev       # Dev server with hot reload (port 3000)
pnpm run build           # Compile TypeScript (nest build)
pnpm run start:prod      # Run compiled build
pnpm run test            # Jest unit tests
pnpm run test:watch      # Jest watch mode
pnpm run test:e2e        # End-to-end tests (Supertest)
pnpm run test:cov        # Coverage report
pnpm run lint            # ESLint with auto-fix
pnpm run format          # Prettier
```

### Client (`client/`)

```bash
pnpm run dev             # Vite dev server with HMR
pnpm run build           # TypeScript check + Vite production build
pnpm run preview         # Preview production build
pnpm run lint            # ESLint
```

## Architecture

### Backend (NestJS Modules)

```
server/src/
├── main.ts                    # Bootstrap, listens on port 3000
├── app.module.ts              # Root module importing all feature modules
├── prisma/
│   ├── prisma.module.ts       # Global database module
│   └── prisma.service.ts      # PrismaClient singleton with pg adapter
├── auth/
│   ├── auth.module.ts
│   └── auth.controller.ts     # POST /auth/login (mock auth, no real JWT)
└── expenses/
    ├── expenses.module.ts
    ├── expenses.controller.ts  # GET /expenses?userId=
    └── expenses.service.ts     # Returns dummy expense data
```

NestJS dependency injection is used throughout. PrismaModule is imported globally. The Prisma service uses `@prisma/adapter-pg` with a raw `pg.Pool` for connection pooling.

### Frontend (React)

```
client/src/
├── App.tsx                    # React Router: / (login), /dashboard (protected)
├── api/api-client.ts          # Axios instance, auto-injects userId on /expenses
├── lib/utils.ts               # formatCurrency (EUR), formatDate (fr-FR), cn()
└── pages/
    ├── LoginPage.tsx           # Email-only login, stores userId in localStorage
    └── ExpenseListPage.tsx     # Dashboard with sidebar, stats, grid/list views
```

Path alias: `@/*` maps to `./src/*` (configured in both vite.config.ts and tsconfig.app.json).

Protected routes check `localStorage` for `userId`. The API client base URL is `http://localhost:3000`.

### Database Schema (Prisma)

Two models: **User** (id, email, password, role) and **Expense** (id, amount, date, vendor, status, screenshotUrl, userId).

Enums: `Role` (EMPLOYEE, MANAGER, ADMIN), `ExpenseStatus` (DRAFT, SUBMITTED, APPROVED, REJECTED).

Schema location: `server/prisma/schema.prisma`. Config: `server/prisma.config.ts`.

### Environment Variables

Copy `.env.example` to `.env` at repo root. Key variables:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — used by docker-compose
- `DATABASE_URL` — Prisma connection string (default: `postgresql://postgres:postgres@localhost:5432/antigravity_db`)

## Design System

Dark theme with glassmorphism aesthetic. Background: `#030712`, primary: indigo `#6366f1`. Custom CSS classes in `index.css`: `.glass`, `.glass-card`, `.input-premium`, `.btn-premium`. Animated background blobs via Framer Motion. All UI text is in French.

## Current State

Auth is mocked (no password verification, token is `mock-jwt-token-{userId}`). The expenses endpoint returns hardcoded dummy data. CRUD operations, file upload, OCR, RBAC guards, and approval workflows are not yet implemented.
