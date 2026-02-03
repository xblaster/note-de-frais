## ADDED Requirements

### Requirement: Formulaire de création de dépense
Le système SHALL afficher un formulaire de création de dépense accessible via la route `/expenses/new`. Le formulaire SHALL contenir les champs : montant (number, requis), date (date, requis), fournisseur (texte, optionnel). Le formulaire SHALL respecter le design system existant (dark theme, glassmorphism, textes en français).

#### Scenario: Affichage du formulaire
- **WHEN** l'utilisateur navigue vers `/expenses/new`
- **THEN** le formulaire s'affiche avec les champs montant, date, fournisseur et une zone de capture de justificatif

#### Scenario: Champs requis non remplis
- **WHEN** l'utilisateur soumet le formulaire sans renseigner le montant ou la date
- **THEN** le formulaire affiche un message d'erreur de validation et ne soumet pas la requête

#### Scenario: Soumission réussie
- **WHEN** l'utilisateur remplit les champs requis et soumet le formulaire
- **THEN** le système envoie une requête `POST /expenses` avec les données, puis redirige vers `/dashboard`

### Requirement: Navigation vers le formulaire
Le bouton "Nouvelle dépense" du dashboard (`ExpenseListPage`) et de l'état vide (`EmptyState`) SHALL naviguer vers `/expenses/new`.

#### Scenario: Clic sur le bouton Nouvelle dépense du dashboard
- **WHEN** l'utilisateur clique sur le bouton "Nouvelle dépense" dans le header du dashboard
- **THEN** le système navigue vers `/expenses/new`

#### Scenario: Clic sur le bouton depuis l'état vide
- **WHEN** l'utilisateur clique sur le bouton "Nouvelle dépense" dans le composant EmptyState
- **THEN** le système navigue vers `/expenses/new`

### Requirement: Route protégée
La route `/expenses/new` SHALL être protégée par le même mécanisme que `/dashboard` (vérification de `userId` dans localStorage).

#### Scenario: Accès sans authentification
- **WHEN** un utilisateur non authentifié tente d'accéder à `/expenses/new`
- **THEN** le système redirige vers la page de login (`/`)

### Requirement: Retour au dashboard
Le formulaire SHALL proposer un bouton de retour permettant de revenir au dashboard sans soumettre.

#### Scenario: Annulation de la création
- **WHEN** l'utilisateur clique sur le bouton retour/annuler
- **THEN** le système navigue vers `/dashboard` sans créer de dépense
