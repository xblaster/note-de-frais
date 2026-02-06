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

## 📸 Aperçu

<div align="center">
  <h3>Tableau de Bord</h3>
  <img src="docs/assets/screenshots/dashboard.png" width="800px" alt="Tableau de Bord App" />
  
  <br />
  
  <div style="display: flex; gap: 10px; justify-content: center;">
    <div>
      <h4>Connexion</h4>
      <img src="docs/assets/screenshots/login.png" width="390px" alt="Page de Connexion" />
    </div>
    <div>
      <h4>Nouvelle Dépense</h4>
      <img src="docs/assets/screenshots/form.png" width="390px" alt="Formulaire de Dépense" />
    </div>
  </div>
</div>

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
│   └── src/         # Code source TypeScript + tests unitaires
├── client/          # Frontend React (Interface utilisateur)
│   ├── src/         # Composants, hooks et services + tests
│   └── public/      # Assets statiques
├── infra/           # Configuration infrastructure (Docker, scripts)
└── docs/            # Documentation détaillée du projet
```

## ✅ Qualité & Tests

Le projet bénéficie d'une **couverture de tests complète** sur les chemins critiques :

### Tests Backend (Jest)
- **42 tests unitaires** couvrant :
  - Workflows d'état des dépenses (DRAFT → SUBMITTED → APPROVED/REJECTED)
  - Authentification et gestion des rôles
  - Service OCR Ollama
  - Contraintes de validation métier

**Couverture :**
- Module Auth : **100%**
- Service Expenses : **97.29%**

```bash
cd server
pnpm test              # Exécuter tous les tests
pnpm test:cov          # Rapport de couverture
pnpm test:watch        # Mode surveillance
```

### Tests Frontend (Vitest)
- **31 tests** couvrant :
  - Composants de formulaires (ExpenseForm, ReceiptCapture)
  - Validation et soumission
  - Intégration API et intercepteurs
  - Gestion d'état et interactions utilisateur

```bash
cd client
pnpm test              # Exécuter tous les tests
pnpm test:watch        # Mode surveillance
```

**Total : 73 tests passants** garantissant la stabilité du code et la confiance dans les refactorings.

## 🏗️ Installation & Lancement

### 1. Prérequis

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (pour la base de données)

### 2. Démarrage Rapide (Windows)

Si vous êtes sur Windows, utilisez les scripts PowerShell pour automatiser l'installation et le lancement :

```powershell
# Installation et configuration automatique
./scripts/powershell/setup.ps1

# Lancement du client et du serveur en parallèle
./scripts/powershell/start.ps1

# Lancement de tous les tests unitaires
./scripts/powershell/test.ps1
```

### 3. Installation Manuelle (Autres systèmes)

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

## 🧪 Lancement des Tests Unitaires

### Tests Backend (Jest)

```bash
cd server

# Lancer tous les tests
pnpm test

# Lancer les tests avec rapport de couverture
pnpm test:cov

# Lancer les tests en mode surveillance (watch)
pnpm test:watch

# Lancer un fichier de test spécifique
pnpm test -- expenses.service.spec
pnpm test -- auth.controller.spec
pnpm test -- ollama.service.spec
```

**Résultats attendus :**
- ✅ 42 tests passants
- ✅ Couverture : Auth 100%, Expenses Service 97.29%

### Tests Frontend (Vitest)

```bash
cd client

# Lancer tous les tests
pnpm test

# Lancer les tests en mode surveillance (watch)
pnpm test:watch

# Lancer un fichier de test spécifique
pnpm test -- ExpenseForm
pnpm test -- ReceiptCapture
pnpm test -- api-client
```

**Résultats attendus :**
- ✅ 31 tests passants
- ✅ Couverture complète des composants critiques

### Lancer tous les tests du projet

```bash
# Depuis la racine du projet
cd server && pnpm test && cd ../client && pnpm test
```

**Total : 73 tests unitaires** garantissant la qualité du code.

## 📝 Licence

Ce projet est sous licence propriétaire.
