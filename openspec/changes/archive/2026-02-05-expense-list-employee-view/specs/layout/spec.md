## ADDED Requirements

### Requirement: Suppression de la Sidebar
L'application SHALL supprimer la sidebar de navigation pour la vue employé afin de maximiser l'espace pour la liste des dépenses.

#### Scenario: Vue desktop sans sidebar
- **WHEN** l'employé est sur la page `/dashboard`
- **THEN** la liste des dépenses occupe toute la largeur disponible (max-w-7xl)

### Requirement: Header simplifié
Le header SHALL être mis à jour pour inclure la barre de recherche pleine largeur, l'avatar de l'utilisateur et le bouton de déconnexion.

#### Scenario: Affichage du header
- **WHEN** l'utilisateur est sur le dashboard
- **THEN** le header affiche une barre de recherche, l'avatar et le bouton logout alignés horizontalement

### Requirement: Section "Action Required"
Le système SHALL afficher une section "Nécessite une action" en haut de la liste si des dépenses sont en statut `DRAFT` ou `REJECTED`.

#### Scenario: Présence de brouillons
- **WHEN** l'utilisateur a des dépenses en statut `DRAFT`
- **THEN** la section "Nécessite une action" s'affiche avec le nombre total de ces dépenses
