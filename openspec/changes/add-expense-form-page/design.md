## Context

L'application Note de Frais dispose d'un dashboard (`ExpenseListPage`) qui affiche les dépenses existantes mais ne permet pas d'en créer. Le backend (`ExpensesController`) n'expose qu'un `GET /expenses`. Le modèle Prisma `Expense` contient déjà les champs nécessaires (`amount`, `date`, `vendor`, `status`, `screenshotUrl`, `userId`). Le frontend utilise React 19 + React Router 7 + Tailwind CSS 4 + Framer Motion. Le backend est NestJS 11 avec Prisma 7 et PostgreSQL.

## Goals / Non-Goals

**Goals:**
- Permettre à un utilisateur de créer une dépense via un formulaire avec validation
- Supporter l'upload d'image (fichier ou photo caméra) comme justificatif
- Stocker les fichiers sur le serveur et lier l'URL au champ `screenshotUrl`
- Rediriger vers le dashboard après création réussie
- Respecter le design system existant (dark theme, glassmorphism, français)

**Non-Goals:**
- OCR / extraction automatique depuis le justificatif
- Édition d'une dépense existante (hors scope)
- Compression ou redimensionnement d'image côté client
- Stockage cloud (S3, etc.) — on utilise le filesystem local pour l'instant
- Approbation / workflow de validation (fonctionnalité séparée)

## Decisions

### 1. Upload de fichiers via Multer (NestJS built-in)

**Choix** : Utiliser `@UseInterceptors(FileInterceptor)` de `@nestjs/platform-express` avec Multer.

**Raison** : Multer est déjà intégré dans NestJS platform-express (aucune dépendance supplémentaire). Il gère le parsing multipart/form-data et le stockage sur disque. Alternative considérée : `busboy` directement — plus bas niveau, pas d'intégration NestJS native.

**Détails** :
- Stockage dans `server/uploads/` avec noms de fichier UUID pour éviter les collisions
- Filtrage par type MIME : `image/jpeg`, `image/png`, `image/webp` uniquement
- Limite de taille : 5 Mo
- Le dossier `uploads/` est servi en statique via `app.useStaticAssets()`

### 2. Endpoint `POST /expenses` en multipart/form-data

**Choix** : Un seul endpoint qui reçoit les champs du formulaire + le fichier en multipart.

**Raison** : Plus simple qu'un flow en deux requêtes (upload séparé + création). Le frontend envoie un `FormData` unique. Alternative considérée : endpoint d'upload séparé retournant une URL, puis `POST /expenses` avec l'URL — plus complexe, utile seulement si on partage l'upload entre features.

**Corps de la requête** :
- `amount` (number, requis)
- `date` (ISO string, requis)
- `vendor` (string, optionnel)
- `receipt` (file, optionnel)

**Réponse** : l'objet `Expense` créé (201 Created).

### 3. Capture photo via API MediaDevices (getUserMedia)

**Choix** : Utiliser l'API `navigator.mediaDevices.getUserMedia({ video: true })` pour ouvrir un flux caméra dans un composant dédié, avec un bouton capture qui prend un snapshot via `<canvas>`.

**Raison** : Fonctionne sur mobile et desktop sans dépendance externe. L'alternative `<input type="file" capture="environment">` est plus simple mais ne permet pas de prévisualiser avant capture sur tous les navigateurs. On propose les deux : l'input natif comme fallback et la caméra live comme option principale.

### 4. Structure de la page frontend

**Choix** : Une page `CreateExpensePage` avec :
- Un formulaire principal (montant, date, fournisseur)
- Un composant `ReceiptCapture` séparé gérant upload + caméra + prévisualisation
- Navigation : `/expenses/new` (route protégée)
- Retour au dashboard via bouton ou après soumission réussie

**Raison** : Séparation claire entre la logique formulaire et la logique capture d'image. Le composant `ReceiptCapture` pourra être réutilisé si besoin.

### 5. Validation

**Choix** : Validation côté client (champs requis, format montant) + validation côté serveur (DTO NestJS avec class-validator ou validation manuelle simple).

**Raison** : Double validation pour la robustesse. Côté client, validation native HTML5 + vérification JS avant soumission. Côté serveur, vérification des types et champs requis dans le controller. On n'introduit pas `class-validator` / `class-transformer` pour l'instant — validation manuelle dans le service pour rester simple.

## Risks / Trade-offs

- **Stockage local des fichiers** → Les fichiers sont perdus si le conteneur est recréé sans volume persistant. Mitigation : documenter la nécessité d'un volume Docker pour `uploads/`. Migration vers S3 prévue ultérieurement.
- **Pas de validation MIME approfondie** → Un fichier renommé pourrait passer le filtre MIME. Mitigation : acceptable pour le MVP, vérification magic bytes envisageable plus tard.
- **Permissions caméra** → L'utilisateur peut refuser l'accès caméra. Mitigation : fallback sur l'upload fichier classique, message d'erreur clair si permission refusée.
- **Taille des images** → Pas de compression côté client, les images peuvent être volumineuses. Mitigation : limite à 5 Mo côté serveur, suffisant pour le MVP.
