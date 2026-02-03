## ADDED Requirements

### Requirement: Endpoint POST /expenses
Le serveur SHALL exposer un endpoint `POST /expenses` qui accepte des données en `multipart/form-data`. Les champs SHALL être : `amount` (number, requis), `date` (ISO string, requis), `vendor` (string, optionnel), `userId` (string, requis), `receipt` (fichier image, optionnel).

#### Scenario: Création de dépense avec justificatif
- **WHEN** le client envoie un `POST /expenses` avec amount=42.50, date="2025-01-15", vendor="Restaurant", userId="abc-123" et un fichier receipt
- **THEN** le serveur crée une entrée Expense avec status DRAFT, stocke le fichier, définit `screenshotUrl` vers le fichier uploadé et retourne l'objet Expense avec status 201

#### Scenario: Création de dépense sans justificatif
- **WHEN** le client envoie un `POST /expenses` avec amount=15.00, date="2025-01-15", userId="abc-123" et sans fichier
- **THEN** le serveur crée une entrée Expense avec status DRAFT, `screenshotUrl` à null et retourne l'objet Expense avec status 201

#### Scenario: Champs requis manquants
- **WHEN** le client envoie un `POST /expenses` sans `amount` ou sans `date` ou sans `userId`
- **THEN** le serveur retourne une erreur 400 avec un message indiquant les champs manquants

### Requirement: Stockage des fichiers uploadés
Le serveur SHALL stocker les fichiers uploadés dans le dossier `server/uploads/` avec un nom de fichier unique (UUID). Le serveur SHALL servir les fichiers uploadés en statique.

#### Scenario: Fichier stocké avec nom unique
- **WHEN** un fichier est uploadé via `POST /expenses`
- **THEN** le serveur enregistre le fichier dans `server/uploads/` avec un nom basé sur un UUID et l'extension d'origine

#### Scenario: Accès au fichier uploadé
- **WHEN** un client requête l'URL retournée dans `screenshotUrl`
- **THEN** le serveur retourne le fichier image correspondant

### Requirement: Validation du fichier uploadé
Le serveur SHALL valider que le fichier uploadé est une image (MIME types : `image/jpeg`, `image/png`, `image/webp`) et que sa taille ne dépasse pas 5 Mo.

#### Scenario: Fichier trop volumineux
- **WHEN** le client envoie un fichier de plus de 5 Mo
- **THEN** le serveur retourne une erreur 400 indiquant la limite de taille

#### Scenario: Type MIME invalide
- **WHEN** le client envoie un fichier avec un type MIME non supporté (ex: application/pdf)
- **THEN** le serveur retourne une erreur 400 indiquant les types acceptés
