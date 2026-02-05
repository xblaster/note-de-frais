## Why

La page liste des dépenses actuelle présente plusieurs limitations pour l'expérience employé :
- La barre de recherche est présente mais non fonctionnelle
- Le bouton "Filtrer" n'a aucune action
- Les dépenses nécessitant une action (brouillons, rejetées) ne sont pas mises en avant
- Pas de distinction visuelle claire entre les différents statuts
- Aucune action possible sur une dépense (click inerte)
- Grid/List toggle présent mais seule la vue liste est vraiment pertinente pour un employé
- Sidebar de navigation surdimensionnée pour le niveau 1 de l'application

L'employé a besoin d'une interface qui priorise **l'action** (terminer un brouillon, corriger une dépense rejetée) plutôt que la simple consultation.

## What Changes

Refonte de la page liste des dépenses avec une approche centrée sur le workflow employé :

**Navigation et Layout**
- Suppression du sidebar (over-engineered pour L1)
- Header simplifié : search bar pleine largeur + user avatar + logout
- Conservation du design glassmorphism et de l'identité visuelle

**Filtrage intelligent**
- Remplacement du bouton "Filter" générique par des **filter chips** avec compteurs
- Chips : `Toutes (X)` | `Brouillons (X)` | `En attente (X)` | `Approuvées (X)` | `Rejetées (X)`
- Comportement radio : un seul filtre actif à la fois
- Dropdown de tri séparé : plus récent, plus ancien, montant croissant/décroissant

**Section "Action Required"**
- Nouveau groupe affiché en haut si brouillons ou dépenses rejetées existent
- Affiche uniquement les dépenses nécessitant une action de l'employé
- Disparaît automatiquement si count = 0

**Search fonctionnelle**
- Recherche temps réel (debounce 300ms) sur : vendor, montant, date
- Combine avec les chip filters actifs
- Badge "X résultats" + bouton clear

**Cards différenciées par status**
- **DRAFT** : "[📝] Brouillon - À compléter" + bouton [Terminer →]
- **REJECTED** : "[❌] Rejeté - {motif}" + bouton [Corriger →]
- **SUBMITTED** : "[🕐] En attente de validation" + bouton [Voir →]
- **APPROVED** : "[✓] Approuvé le {date}" + bouton [Voir →]

**Actions clickables**
- Click sur DRAFT/REJECTED → page d'édition (pre-filled)
- Click sur SUBMITTED/APPROVED → page de détail (read-only)

**Grid view supprimée**
- Focus sur une seule vue liste optimale
- Suppression du toggle grid/list

## Capabilities

### New Capabilities
- `expense-list-filtering`: Filtrage par chips de status avec compteurs dynamiques et tri
- `expense-search`: Recherche temps réel multi-critères (vendor, montant, date)
- `expense-action-routing`: Navigation contextuelle selon status (edit vs detail)

### Modified Capabilities
- `expense-list-display`: Refonte complète du layout, suppression grid view, cards différenciées par status, section "Action Required"

## Impact

**Frontend (client/)**
- `ExpenseListPage.tsx` : refonte majeure
  - Suppression du sidebar
  - Ajout filter chips avec state management
  - Ajout search logic avec debouncing
  - Ajout section "Action Required"
  - Variants de cards par status
  - Handlers de click vers edit/detail
- Nouvelles routes potentielles :
  - `/expenses/:id` (detail view - à créer)
  - `/expenses/:id/edit` (edit view - à créer)

**Backend (server/)**
- `ExpensesController` : potentiellement ajouter query params pour filtering/search côté serveur (ou filtrage côté client avec données existantes)
- `Expense` model enrichi :
  - `rejectionReason?: string` (si REJECTED)
  - `approvedAt?: Date` (si APPROVED)
  - `approvedBy?: string` (manager name)
  - `category?: string` (future)
  - `description?: string` (pour search enrichie)

**Database**
- Migration Prisma si ajout de champs (`rejectionReason`, `approvedAt`, `approvedBy`, `description`, `category`)

**Design System**
- Conservation du glassmorphism
- Ajout de variants de chips (active/inactive, avec badge count)
- Ajout de styles pour section "Action Required" (distinct visually)

## Out of Scope (Phase 1)

- Pagination/infinite scroll (garder "Charger plus" simple)
- Advanced filters (date range picker, montant range)
- Bulk actions (sélection multiple)
- Export CSV
- Manager/Admin views (focus employé uniquement)
