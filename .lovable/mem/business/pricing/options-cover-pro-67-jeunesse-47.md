---
name: Cover Studio Pro inclus dans Édition, Studio Jeunesse 47 € en option
description: Cover Studio Pro inclus d'office dans les abonnements Édition/Maison ; 67 € à l'unité pour les autres ; Studio Jeunesse 47 € option pour tous
type: feature
---

- **Cover Studio Pro** : inclus d'office (valeur 67 €) dans les abonnements actifs **Édition** et **Maison d'Édition** (plan_type subscription). Plume et anciens accès à vie : achat à l'unité 67 € (les acheteurs existants gardent leur droit).
- **Studio Jeunesse — 47 €**, paiement unique, option pour tous les forfaits.

Mise en œuvre : vérification serveur dans `hasCoverProRight` (coverPro.ts) : admin → achat module_entitlements → abonnement Édition/Maison actif.
