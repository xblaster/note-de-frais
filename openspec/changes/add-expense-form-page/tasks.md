## 1. Backend — Endpoint POST /expenses avec upload

- [ ] 1.1 Configurer Multer pour le stockage des fichiers dans `server/uploads/` avec noms UUID et filtrage MIME (jpeg, png, webp) + limite 5 Mo
- [ ] 1.2 Ajouter la méthode `create()` dans `ExpensesService` : créer une Expense via Prisma avec les champs amount, date, vendor, userId, screenshotUrl
- [ ] 1.3 Ajouter le handler `POST /expenses` dans `ExpensesController` avec `@UseInterceptors(FileInterceptor('receipt'))`, validation des champs requis (amount, date, userId), retour 201
- [ ] 1.4 Configurer le serving statique du dossier `uploads/` dans `main.ts` via `app.useStaticAssets()` et créer le dossier `uploads/` avec un `.gitkeep`

## 2. Frontend — Page de création de dépense

- [ ] 2.1 Créer la page `CreateExpensePage` dans `client/src/pages/` avec le formulaire (montant, date, fournisseur) respectant le design system (dark theme, glassmorphism, français)
- [ ] 2.2 Ajouter la route protégée `/expenses/new` dans `App.tsx`
- [ ] 2.3 Implémenter la validation côté client : champs montant et date requis, affichage des messages d'erreur
- [ ] 2.4 Implémenter la soumission du formulaire : envoi d'un `FormData` via `POST /expenses` avec l'API client Axios, redirection vers `/dashboard` après succès

## 3. Frontend — Composant ReceiptCapture

- [ ] 3.1 Créer le composant `ReceiptCapture` avec zone d'upload (clic + drag & drop), validation des types de fichier (jpeg, png, webp), et message d'erreur si type invalide
- [ ] 3.2 Ajouter la capture photo via `getUserMedia` : bouton "Prendre une photo", affichage du flux vidéo, snapshot via canvas, fallback si permission refusée
- [ ] 3.3 Implémenter la prévisualisation de l'image (upload ou photo) avec bouton de suppression/remplacement
- [ ] 3.4 Intégrer le composant `ReceiptCapture` dans `CreateExpensePage` et transmettre le fichier au FormData lors de la soumission

## 4. Navigation et intégration

- [ ] 4.1 Modifier le bouton "Nouvelle dépense" du header dans `ExpenseListPage` pour naviguer vers `/expenses/new`
- [ ] 4.2 Modifier le bouton "Nouvelle dépense" du composant `EmptyState` pour naviguer vers `/expenses/new`
- [ ] 4.3 Ajouter un bouton retour/annuler dans `CreateExpensePage` qui redirige vers `/dashboard`
