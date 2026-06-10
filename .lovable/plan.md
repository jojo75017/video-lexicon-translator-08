## Objectif

Mettre en place la grille tarifaire V3 complète : **197€ = base**, **packs upsell à la carte (total = 400€)**, et un **Pack Tout Complet à 497€** qui débloque tout d'un coup. Acheter à la pièce coûte 597€ → le pack complet fait économiser 100€. Ajouter des facilités de paiement (échelonné). Ce lot prépare la donnée et l'affichage ; les produits/prix de paiement réels viendront ensuite.

## 1. Grille tarifaire (somme calée sur 597€ / 497€)

```text
BASE V3 — Publication Assistée Pro ............................ 197€ à vie
  (Création/IA écriture + Publication : tout pour écrire et publier)

UPSELLS À LA CARTE (optionnels)
  Pack Couverture Pro ........................................  67€
  Pack Marketing & Lancement ................................. 147€
  Pack Réseaux Sociaux .......................................  87€
  Pack Monétisation Pro ......................................  99€
  ----------------------------------------------------------------
  Total upsells ............................................. 400€

PRIX SI ON PREND TOUT À LA PIÈCE .......... 197 + 400 = 597€
PACK TOUT COMPLET (tout débloqué d'un coup) ............... 497€
  → économie de 100€
```

### Contenu des packs (modules déjà dans roadmapV3.ts)
- **Couverture Pro** : Cover Studio Pro (gpt-image-2, direction artistique IA, variantes, test miniature).
- **Marketing & Lancement** : Optimiseur annonces, Séquence J-7, Amazon Ads, Pricing lancement, Media Kit, Look Inside, Editorial Reviews, BookBub/FB, Page auteur Amazon.
- **Réseaux Sociaux** : Pinterest Auto-Pins, TikTok/Reels Hooks, Calendrier 30j, Visuels citations, Book Trailer IA, Kit Influenceurs.
- **Monétisation Pro** : Auto-Pricing, Royalties Dashboard, Simulateur royalties, Bundles, KDP Select Planner, Lead Magnet, Back-catalogue, KU detector, Print royalties.

(Coaching VIP, Licence étendue, Pack templates restent des offres séparées avec leurs prix actuels — non comptés dans les 400€.)

## 2. Facilités de paiement

```text
BASE 197€            → 1×197€  ou  3×69€
PACK TOUT COMPLET 497€ → 1×497€  ou  4×129€  ou  6×85€
```
(Cohérent avec la mémoire « Échelle 497€ + échelonné ». Coupure d'accès 3 j après échec de prélèvement, comme déjà prévu.)

## 3. Modélisation des données (préparation)

Dans `src/data/roadmapV3.ts` :
- Ajouter sur `V3Module` les champs optionnels `tier?: 'core' | 'upsell'` et `pack?: string`.
- Marquer chaque module : `core` (base 197€) ou `upsell` + son `pack`.
- Ajouter `V3_UPSELL_PACKS` : `id`, `title`, `desc`, `modules[]`, `price`, `installments?`.
- Ajouter `V3_FULL_PACK` : `price: 497`, `compareAt: 597`, `saves: 100`, `installments: ['1×497€','4×129€','6×85€']`.
- Garder `V3_PRICE = 197` (base) et ajouter `V3_BASE_INSTALLMENTS = ['1×197€','3×69€']`.

## 4. Affichage Hub V3 (`V3HubPage.tsx`)

- Modules `core` : affichés normalement par pilier.
- Modules `upsell` : badge doré « PREMIUM / en option ».
- Nouveau bloc « Tarifs » avec 3 niveaux de lecture :
  1. **Base 197€** (ce qui est inclus),
  2. **Packs à la carte** (4 cartes avec prix),
  3. **Pack Tout Complet 497€** mis en avant (« −100€ », badge « LE PLUS MALIN »), avec les facilités de paiement.

## 5. Hors périmètre (ce lot)
- Pas encore de produits/prix de paiement réels créés ni de logique d'accès conditionnel par pack. CTA pointent vers le tunnel existant.
- Étape suivante (à valider) : créer les produits/prix (base, 4 packs, pack complet, échéanciers) et brancher le déverrouillage par pack.

## 6. Mise à jour mémoire
- V3 : **197€ base + 4 packs upsell (total 400€) ; à la pièce = 597€ ; Pack Tout Complet = 497€ (−100€)** ; facilités base 3×69€, pack complet 4×129€ / 6×85€.

## Détails techniques
- Tout reste frontend + données statiques (`roadmapV3.ts`), champs optionnels rétrocompatibles. Aucun module existant ne casse, aucun backend modifié dans ce lot.
