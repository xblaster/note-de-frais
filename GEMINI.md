# Note de Frais - Project Configuration

## Development Environment
- **Operating System**: Windows
- **Shell**: PowerShell (recommended) or CMD

> [!IMPORTANT]
> This project is currently running on a **Windows** system. Use PowerShell for scripts and commands to avoid compatibility issues with Bash scripts.

---

# Projet : Gestion de Notes de Frais (Expense Manager)

## Overview
Ce projet est une application moderne de gestion de notes de frais permettant aux employés de soumettre leurs dépenses par photo (avec OCR automatique) et aux managers de les valider.

## Technical Stack
- **Backend**: NestJS (TypeScript) + Prisma ORM.
- **Frontend**: React (Vite) + Tailwind CSS + Shadcn/UI.
- **Base de données**: PostgreSQL.
- **Gestionnaire de paquets**: `pnpm`.

## Core Features
1. **Authentification**: JWT avec rôles (EMPLOYEE, MANAGER, ADMIN).
2. **Gestion de Dépenses**:
   - Upload/Capture de justificatifs.
   - **OCR Intent**: Extraction automatique du montant, de la date et de l'enseigne via backend.
3. **Workflows de Validation**:
   - Regroupement des dépenses en **Rapports**.
   - Cycle de vie : `DRAFT` -> `SUBMITTED` -> `APPROVED`/`REJECTED`.

## Project Structure
```text
/
├── server/          # Backend NestJS
│   ├── prisma/      # Schéma de BD
│   └── src/         # Logique API
├── client/          # Frontend React
│   └── src/         # Composants et UI
└── docs/            # Documentation détaillée
```

## AI Instructions
Lorsque tu travailles sur ce projet :
- **Mandat Windows/PowerShell**: Sur Windows, utilise **UNIQUEMENT** PowerShell pour toutes les commandes et scripts. Priorise les scripts de `scripts/powershell/` pour les tâches courantes.
- Priorise des designs **premium** et **dynamiques** (Shadcn/UI, micro-animations).
- Utilise toujours `pnpm`.
- Assure la cohérence des types entre le schéma Prisma et le frontend.
- Pour l'OCR, propose des intégrations robustes (Tesseract.js ou services Cloud).

<!-- AGENT_CONTEXT_START -->
## Feature Context: 001-standardize-powershell-windows
- **Languages**: PowerShell 5.1 (Windows default) and PowerShell 7+ (Core)
- **Frameworks**: Node.js, pnpm, Git
- **Project Structure**: Standardized PowerShell scripts in `scripts/powershell/`
<!-- AGENT_CONTEXT_END -->
