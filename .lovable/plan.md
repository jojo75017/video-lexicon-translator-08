# Onglet UPSELLS visible dans la barre latérale

## Objectif
Rendre les compléments payants immédiatement visibles pour les abonnés : un lien intitulé **UPSELLS** bien en évidence dans la barre latérale, qui renvoie vers la page des encarts upsell (`/v3/upsells`).

## État actuel
- La page `/v3/upsells` existe déjà (grille des encarts personnifiés avec prénoms).
- Le lien actuel s'appelle « Compléments & options », noyé tout en bas de la barre latérale dans la section « Mon compte », avec un badge discret « Options ».

## Changements

### 1. Barre latérale (`src/components/v3public/V3Sidebar.tsx`)
- Retirer « Compléments & options » de la section « Mon compte ».
- Créer un lien mis en avant, placé dans la section « Créer mon livre » (zone chaude, visible sans dérouler) :
  - Libellé : **UPSELLS** (en capitales)
  - Icône : Sparkles ou Zap
  - Badge or « 17+ packs »
  - Accent visuel or (même style premium que l'encart ContentStudio) pour attirer l'œil.

### 2. Menu du haut (`src/data/v3HeaderMenu.ts`)
- Ajouter dans le menu « Vendre » une entrée « UPSELLS — packs & compléments » avec badge, renvoyant vers `/v3/upsells`, pour que l'entrée soit aussi accessible depuis la navigation principale.

### 3. Vérification
- Aucune nouvelle page ni route : `/v3/upsells` existe et fonctionne déjà.
- Test visuel : le lien UPSELLS apparaît dans la barre latérale et redirige correctement vers la grille des encarts.

## Détails techniques
- Fichiers modifiés : `V3Sidebar.tsx`, `v3HeaderMenu.ts` (éditions ciblées uniquement).
- Aucun changement de paiement ni de base de données.
- Les encarts de destination (cartes personnifiées Étienne, Hélène, Yanis…) restent inchangés.
