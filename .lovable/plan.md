## Objectif
Rendre le **347€ « net »** : montrer *tout* ce qu'il débloque réellement (68 modules premium, pas seulement 35), inclure les options à la carte, corriger les compteurs, et permettre de **tester** le Pack Pro (aperçu + paiement test).

## Constat (état actuel du code)
- 100 modules au total. Base 197€ = **32 inclus**. Premium = **68**.
- La carte tarifaire n'affiche que **5 packs (35 modules)** → **28 modules premium sont orphelins** (rattachés à aucun pack) donc invisibles, alors qu'ils sont débloqués par le 347€.
- Incohérence : les options « à la carte » (Promotion 97€, Transcription 67€) sont dites *hors 347€* dans le texte, mais `useV3Entitlement` (`hasFull`) les débloque déjà.

## Décisions validées
- **Tester le 347€** : aperçu de tous les outils débloqués **ET** test du tunnel de paiement.
- **28 orphelins** : regroupés dans un bloc **« Inclus dans le Pack Pro »**.
- **Options à la carte** : **incluses** dans le 347€ (texte ajusté).
- **Graphiques à mettre à jour** : V3AccessRecap, V3PricingTiers, compteurs page de vente.

---

## Étapes d'implémentation

### 1. `src/data/roadmapV3.ts` — source de vérité
- Ajouter un dérivé **`V3_FULL_PACK_EXTRA_IDS`** : tous les modules dont `getModuleAccess === 'pack'` qui ne figurent dans **aucun** pack (les 28 orphelins) → liste calculée automatiquement (aucune saisie manuelle, robuste aux futurs ajouts).
- **Inclure les options à la carte dans le 347€** : le Pack Pro débloque désormais *tous* les packs. Concrètement, `V3_FULL_PACK.compareAt` = 197€ + somme de **tous** les packs (essentiels + promotion + transcription) ; `saves` recalculé. On garde `alacarte` uniquement comme indication « aussi vendable seule », mais elles comptent dans le 347€.
- Ajouter des dérivés de comptage exportés : `V3_INCLUDED_COUNT` (32), `V3_PREMIUM_COUNT` (68), `V3_TOTAL_COUNT` (100) pour alimenter tous les visuels depuis une seule source.

### 2. `src/components/admin/V3PricingTiers.tsx` — carte tarifaire
- Sur la carte **Pack Pro 347€** : afficher le compteur réel **« 100 outils débloqués (32 base + 68 premium) »** au lieu du sous-total actuel.
- Ajouter un bloc dépliable **« Inclus en plus dans le Pack Pro »** listant les 28 modules `V3_FULL_PACK_EXTRA_IDS` (même rendu que les packs : titre + description + état prêt/à venir).
- Déplacer Promotion + Transcription de la section « à la carte » vers **« Packs premium inclus dans le Pack Pro »** (badge « aussi disponible seule »). Ajuster la ligne de comparaison de prix (`compareAt` / `saves`) automatiquement.

### 3. `src/components/admin/V3AccessRecap.tsx` — récapitulatif des droits
- Utiliser les compteurs dérivés : colonne gauche **« Inclus 197€ » = 32**, colonne droite **« Pack 347€ » = 68**.
- S'assurer que les 28 orphelins + options à la carte apparaissent bien dans la colonne 347€ (déjà le cas via `getModuleAccess`, mais vérifier le sous-titre/décompte affiché).

### 4. Compteurs page de vente
- `src/components/sales/AgentsShowcase.tsx` et `src/pages/V3HubPage.tsx` : remplacer les nombres codés en dur (« 22 », « 30/32 », `TOTAL_TOOLS` local) par les compteurs dérivés de `roadmapV3.ts` pour cohérence : **197€ → 32 outils**, **347€ → 100 outils**.

### 5. Tester le 347€
- **Aperçu** : ajouter dans le Hub V3 (admin uniquement) un interrupteur **« Mode démo Pack Pro »** qui force `hasFull` côté UI (via un flag local passé aux gates/registre) pour parcourir les 68 outils premium comme un acheteur 347€, sans paiement. N'affecte pas les droits réels.
- **Paiement test** : rendre le bouton **« Tester le paiement 347€ »** visible quand `isPaymentsTestMode()` est vrai (env sandbox), ouvrant `V3PackCheckout product="full"` (déjà branché sur `v3-pack-checkout`). Ajout d'un petit badge « Mode test » pour lever l'ambiguïté (« pas de voyant vert »).

## Détails techniques
- Aucune migration DB nécessaire ; `useV3Entitlement` inchangé (le mode démo est un override UI local, non persisté).
- Tous les décomptes proviennent de dérivés dans `roadmapV3.ts` → un seul endroit à maintenir.
- Vérification finale : build + lecture des 3 visuels pour confirmer les nombres.

## Hors périmètre
- Pas de refonte des edge functions de paiement (le tunnel 347€ existe déjà).
- Pas de nouveaux modules fonctionnels (les 11 du Pack Étude de Marché sont déjà livrés).
