## ADDED Requirements

### Requirement: Champs additionnels Expense
Le modèle `Expense` SHALL être enrichi des champs : `description` (long text), `rejectionReason` (text), `approvedAt` (DateTime), `approvedBy` (text), `category` (text).

#### Scenario: Récurpération d'une dépense rejetée
- **WHEN** l'API renvoie une dépense `REJECTED`
- **THEN** l'objet contient un champ `rejectionReason` non nul

### Requirement: Routes de navigation contextuelles
Le système SHALL supporter la navigation vers une vue détail ou une vue édition.

#### Scenario: Clic sur une dépense approuvée
- **WHEN** l'utilisateur clique sur le bouton "Voir" d'une dépense `APPROVED`
- **THEN** le système navigue vers `/expenses/:id`
