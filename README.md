# Note de Frais - Expense Manager

Une application moderne et performante pour la gestion des notes de frais, permettant une capture simplifiée des justificatifs via OCR (Reconnaissance Optique de Caractères) et un workflow de validation fluide.

## 🚀 Fonctionnalités Clés

- **Authentification Sécurisée** : Connexion par rôles (EMPLOYÉ, MANAGER, ADMIN) via JWT.
- **Gestion des justificatifs** : Upload ou capture photo des reçus.
- **OCR Intelligente** : Extraction automatique du montant, de la date et de l'enseigne.
- **Workflows de Validation** : 
  - Regroupement des dépenses en rapports.
  - Cycle de vie : `DRAFT` -> `SUBMITTED` -> `APPROVED`/`REJECTED`.
- **Interface Premium** : Design moderne avec micro-animations, mode sombre et composants Shadcn/UI.

## 🛠️ Stack Technique

- **Backend** : [NestJS](https://nestjs.com/) (TypeScript) + [Prisma ORM](https://www.prisma.io/).
- **Frontend** : [React](https://react.dev/) ([Vite](https://vitejs.dev/)) + [Tailwind CSS](https://tailwindcss.com/) + Shadcn/UI.
- **Base de données** : [PostgreSQL](https://www.postgresql.org/).
- **Gestionnaire de paquets** : `pnpm`.
- **Infrastructure** : Docker (PostgreSQL).

## 📂 Structure du Projet

```text
/
├── server/          # Backend NestJS (API & Logique métier)
│   ├── prisma/      # Schéma et migrations de base de données
│   └── src/         # Code source TypeScript
├── client/          # Frontend React (Interface utilisateur)
│   ├── src/         # Composants, hooks et services
│   └── public/      # Assets statiques
├── infra/           # Configuration infrastructure (Docker, scripts)
└── docs/            # Documentation détaillée du projet
```

## 🏗️ Installation & Lancement

### Prérequis

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (pour la base de données)

### 1. Configuration de la Base de Données

Lancez l'instance PostgreSQL via Docker :

```bash
cd infra
docker-compose up -d
```

### 2. Configuration du Backend

```bash
cd server
pnpm install
# Créez un fichier .env à la racine de /server et ajoutez DATABASE_URL
pnpm prisma migrate dev
pnpm run start:dev
```

### 3. Configuration IA / OCR (Ollama)

Ce projet utilise [Ollama](https://ollama.com/) pour l'extraction de données via IA.

1. Installez Ollama depuis [ollama.com](https://ollama.com).
2. Tirez le modèle requis :
```bash
ollama pull qwen2.5vl:3b
```
3. Assurez-vous que le service Ollama tourne en arrière-plan (port 11434 par défaut).

### 4. Configuration du Frontend

```bash
cd client
pnpm install
pnpm dev
```

## 📄 Variables d'Environnement

### Backend (`server/.env`)
- `DATABASE_URL` : Chaîne de connexion PostgreSQL (ex: `postgresql://user:password@localhost:5432/db_name`)

## 📝 Licence

Ce projet est sous licence propriétaire.
