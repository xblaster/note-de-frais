---
name: backend-architect
description: À activer pour toute modification de l'API NestJS, du schéma Prisma, de la logique métier des notes de frais ou de l'intégration des services OCR.
---

# Goal
Garantir une architecture backend scalable, sécurisée et parfaitement typée, en suivant les meilleures pratiques NestJS et en assurant l'intégrité des données de notes de frais.

# Instructions
1. **Analyse de l'Impact** : Identifier si les changements affectent le schéma Prisma, les DTOs ou les services de validation de flux.
2. **Vérification de la Cohérence** : Exécuter `scripts/check_prisma_sync.py` pour valider que les modèles de données sont alignés avec les règles métier (ex: montant positif, types de devises).
3. **Audit de Sécurité & Rôles** : Vérifier que les décorateurs de garde (`@UseGuards`, `@Roles`) sont présents pour les endpoints sensibles (validation de rapports).
4. **Optimisation OCR** : Si le changement touche à l'OCR, s'assurer que le traitement est asynchrone et que les erreurs d'extraction sont gérées avec des codes de statut clairs.
5. **Génération d'Artefact** : Produire un **Rapport d'Architecture Backend** basé sur `resources/backend_review_report.md`.

# Examples
- **Input**: "Ajoute un endpoint pour rejeter un rapport de dépense."
- **Action**: Crée le DTO de rejet, met à jour le service avec une transaction Prisma (pour l'historique), ajoute la garde `@Roles(Role.MANAGER)`, et génère le rapport d'implémentation.

# Constraints
- Ne jamais exposer d'IDs de base de données bruts sans validation de propriété (Insecure Direct Object Reference).
- Ne jamais modifier le schéma Prisma sans suggérer une commande de migration (`npx prisma migrate dev`).
- Toujours utiliser `pnpm` pour l'ajout de dépendances backend.