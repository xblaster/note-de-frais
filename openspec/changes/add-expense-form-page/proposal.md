## Why

Les utilisateurs ne peuvent actuellement pas créer de dépenses — le dashboard affiche des données factices générées côté serveur. Il faut une page dédiée avec formulaire pour soumettre de nouvelles notes de frais, incluant la capture de justificatif (upload de fichier ou prise de photo directe depuis la caméra).

## What Changes

- Ajout d'une nouvelle page `/expenses/new` avec un formulaire de création de dépense
- Champs du formulaire : montant, date, fournisseur/commerçant, justificatif (image)
- Upload de fichier image (drag & drop ou sélection) et capture photo via caméra du device
- Prévisualisation de l'image avant soumission
- Endpoint backend `POST /expenses` pour créer une dépense avec upload de fichier
- Stockage des fichiers uploadés sur le serveur (dossier local `uploads/`)
- Le bouton "Nouvelle dépense" du dashboard redirige vers cette page
- La dépense est créée avec le statut `DRAFT` par défaut

## Capabilities

### New Capabilities
- `expense-creation`: Formulaire frontend de création de dépense avec validation des champs et navigation
- `receipt-capture`: Capture de justificatif par upload de fichier ou prise de photo caméra, avec prévisualisation
- `expense-api-create`: Endpoint API `POST /expenses` avec upload de fichier via multipart/form-data

### Modified Capabilities
<!-- Aucune capability existante modifiée au niveau des specs -->

## Impact

- **Frontend** : nouvelle page `CreateExpensePage`, nouvelle route `/expenses/new`, modification du bouton "Nouvelle dépense" dans `ExpenseListPage`
- **Backend** : nouveau handler `POST /expenses` dans `ExpensesController`, mise à jour de `ExpensesService` avec méthode `create()`, configuration de `@nestjs/platform-express` (Multer) pour l'upload
- **Base de données** : aucun changement de schéma (le modèle `Expense` supporte déjà tous les champs nécessaires : `amount`, `date`, `vendor`, `status`, `screenshotUrl`, `userId`)
- **Dépendances** : potentiellement `multer` / `@types/multer` côté serveur (déjà inclus dans NestJS platform-express)
- **Stockage** : création d'un dossier `uploads/` pour les justificatifs, endpoint statique pour servir les fichiers
