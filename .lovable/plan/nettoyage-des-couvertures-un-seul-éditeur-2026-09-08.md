# Nettoyage des couvertures : un seul éditeur

Objectif : ne garder qu'un seul chemin de création de couverture, celui qui enregistre vraiment le travail, et supprimer la copie abandonnée qui perd le travail des abonnés.

## Ce qui reste (le vrai parcours)

- L'assistant guidé `/v3/couverture-express`
- La bibliothèque `/v3/mes-couvertures`
- L'éditeur `/v3/mes-couvertures/:id` (enregistrement, duplication, suppression, crédits)
- Le calculateur `/couverture-kdp` (dos, fonds perdus, PDF exact) — ce n'est pas un doublon
- Toute la partie payante à 67 € : `/v3/cover-pro`, `/v3/paiements`, la barre d'accès, le coffre à clés, le panneau d'illustration, l'écran d'administration, les tables et les fonctions serveur des crédits

## Ce qui disparaît

- L'ancien éditeur `/v3/cover-studio-pro` et `/v3/cover-studio-pro/edit` : aucune sauvegarde en base, promesses fausses (« sauvegarde cloud toutes les 30 s », annuler/rétablir), et il ignore ce que l'assistant lui envoie.
- Le fichier résiduel `App-Ebook-Only.tsx`, jamais utilisé.

Attention : la brique d'administration porte le même nom « cover-studio-pro » mais reste en place. Seules les deux pages publiques ci-dessus sont retirées.

## Étapes, dans cet ordre

1. Rediriger d'abord les liens, avant de supprimer quoi que ce soit :
   - Bandeau « Générer une illustration IA » → `/v3/mes-couvertures`
   - Fin de l'assistant de création : bouton « Ouvrir Cover Studio Pro » → création/ouverture du projet dans `/v3/mes-couvertures` (même comportement que l'assistant express)
   - Étape 4 de « Comment ça marche » → `/v3/mes-couvertures`
   - Entrée « Nouveautés », liste des agents, base de connaissances de l'assistant → `/v3/mes-couvertures`
2. Remplacer les deux anciennes adresses par une redirection permanente vers `/v3/mes-couvertures`, pour que les anciens liens et favoris continuent de fonctionner.
3. Supprimer les deux pages de l'ancien éditeur et les composants qui ne servent plus qu'à elles.
4. Supprimer `App-Ebook-Only.tsx`.
5. Retirer les textes qui promettent des fonctions inexistantes, et vérifier que plus aucun bouton ne mène à l'ancien éditeur.

Après chaque étape : vérification à l'écran avant de passer à la suivante.

## Détails techniques

- Liens à mettre à jour : `V3MesCouverturesBanner.tsx`, `V3CreateWizard.tsx` (ligne du lien `/v3/cover-studio-pro/edit`), `V3HowItWorksSteps.tsx`, `v3Nouveautes.ts`, `v3Agents.ts`, `assistantKnowledge.ts`.
- `App.tsx` : les deux routes deviennent `<Navigate to="/v3/mes-couvertures" replace />`, puis suppression des imports différés `CoverStudioProHubPage` et `CoverEditorPage`. `CoverProPage` (paiement) reste dans le même dossier et n'est pas touchée.
- `trialLockedPaths.ts` : retirer `/v3/cover-studio-pro`.
- Conserver : `components/cover-studio-pro/CoverProKeyVault.tsx`, `CoverProIllustrationPanel.tsx`, `v3ModuleRegistry` clé `cover-studio-pro`, `roadmapV3.ts`, `editionAgents.ts` (identifiants de modules, pas des routes).
- Suppression des composants Fabric.js utilisés uniquement par l'ancien éditeur (`CoverCanvas`, `CoverToolbar`, `TemplatesPanel`, `AiBackgroundPanel`) après vérification qu'aucune autre page ne les importe.
- Aucun changement de base de données, de sécurité, de calcul KDP ni de paiement.
