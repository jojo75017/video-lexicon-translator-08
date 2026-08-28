---
name: Tarifs upsells à l'unité — 17 / 27 / 47 €
description: Paliers uniques des compléments et packs V3 achetables séparément, et règle de destination des cartes upsell
type: feature
---

Tarifs à l'unité (paiement unique, sans abonnement) :
- **17 €** : Pack Boost de Lancement.
- **27 €** : Jeux & Énigmes, Cherche & Trouve, Histoires Courtes, Transcription audio/vidéo, Promotion Éditeur, Traductions relues, Audiolivre Premium, Sélection maisons d'édition, Pack Sérénité.
- **47 €** : BookPerfect AI, Revenus & Scaling, Distribution Large, Trafic Social, Qualité Éditoriale, Étude de Marché, Documentation Studio.
- **9,99 €** : version audio d'un seul livre.

Les anciens tarifs 67/77/87/97/99/197 € sont obsolètes. Ne jamais les reproposer.

Règle : chaque carte upsell doit ouvrir **l'outil réel** (champ `to` dans `roadmapV3.ts` / `v3Pricing.ts`), jamais `/v3/forfaits`, avec `?from=upsells` qui affiche la barre « Retour aux upsells ».
