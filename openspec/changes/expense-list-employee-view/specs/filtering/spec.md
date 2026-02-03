## ADDED Requirements

### Requirement: Filter Chips par Status
Le système SHALL proposer des "filter chips" pour filtrer les dépenses par status (`ALL`, `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`).

#### Scenario: Sélection d'un filtre
- **WHEN** l'utilisateur clique sur le chip "Approuvées"
- **THEN** seules les dépenses avec le statut `APPROVED` sont affichées

### Requirement: Recherche temps réel
Le système SHALL permettre de rechercher des dépenses par fournisseur, montant ou date avec un debouncing de 300ms.

#### Scenario: Recherche par fournisseur
- **WHEN** l'utilisateur saisit "Starbucks" dans la barre de recherche
- **THEN** la liste est filtrée pour n'afficher que les dépenses dont le fournisseur contient "Starbucks"

### Requirement: Tri des dépenses
Le système SHALL proposer un dropdown de tri (Plus récent, Plus ancien, Montant +/-).

#### Scenario: Tri par montant décroissant
- **WHEN** l'utilisateur sélectionne "Montant décroissant"
- **THEN** la liste est triée avec les montants les plus élevés en premier
