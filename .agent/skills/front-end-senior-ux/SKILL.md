---
name: expense-ux-expert
description: À activer pour toute modification du dossier /client, la création de composants Shadcn/UI, ou l'optimisation des flux de soumission de dépenses (OCR, formulaires).
---

# Goal
Garantir une interface de gestion de frais "Premium", intuitive et accessible, en optimisant la cohérence visuelle et l'ergonomie des workflows de validation.

# Instructions
1. **Analyse Contextuelle** : Identifier si la modification impacte le dashboard employé (soumission) ou manager (validation).
2. **Audit de Composants** : Vérifier que les nouveaux composants utilisent les primitives de Shadcn/UI et respectent les tokens Tailwind du projet.
3. **Optimisation Workflow** : 
    - Pour l'OCR : S'assurer que les états de chargement (skeletons) et les feedbacks d'erreur sont présents.
    - Pour les Rapports : Vérifier la clarté de la hiérarchie visuelle (statuts DRAFT/SUBMITTED).
4. **Validation Technique** : Exécuter `scripts/check_a11y.py` sur les fichiers modifiés.
5. **Génération d'Artefact** : Produire un rapport détaillé basé sur `resources/ux_audit_report.md`.

# Examples
- **Input** : "Ajoute un bouton pour supprimer une dépense dans la liste."
- **Action** : Propose une action destructive avec une boîte de dialogue de confirmation (AlertDialog de Shadcn), vérifie le contraste du bouton "Supprimer" et suggère une micro-animation de sortie de liste.

# Constraints
- Ne jamais utiliser de CSS pur ; utiliser exclusivement Tailwind CSS.
- Ne jamais ignorer les attributs `aria-label` sur les boutons iconographiques.
- Toujours conserver la cohérence avec le design system (Radius, Colors, Typography) défini dans `tailwind.config.js`.