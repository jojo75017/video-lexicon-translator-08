---
name: Options à l'unité — Cover Studio Pro 67 € et Studio Jeunesse 47 €
description: Cover Studio Pro et Studio Jeunesse ne sont inclus dans aucun forfait ; options payantes à vie pour tous
type: feature
---

Ces deux modules ne sont **jamais inclus** dans un forfait (ni Plume 27 €, ni Édition 47 €, ni Maison d'Édition 97 €) :

- **Cover Studio Pro — 67 €**, paiement unique, accès à vie.
- **Studio Jeunesse — 47 €**, paiement unique, accès à vie.

Mise en œuvre : paiement à l'unité via `v3-upsell-checkout` (packs `cover_studio_pro` et `studio_jeunesse`), droit accordé par le webhook dans `module_entitlements` (modules `cover_studio_pro` et `studio-jeunesse`). Ces deux modules figurent dans `PURCHASE_ONLY_MODULES` de `useModuleAccess` : la formule Édition/Maison ne les débloque pas.

Textes des offres : la ligne « En option : Cover Studio Pro (67 €) et Studio Jeunesse (47 €) » apparaît sur Édition et Maison d'Édition.
