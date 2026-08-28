# Tarifs upsells : un prix affiché pour chaque encart, achat à l'unité possible

## Ce qui se passe aujourd'hui (vérifié dans le code)

- Les prix existent bien dans les données (`v3Pricing.ts` : 97 €, 97 €, 67 €, 9,99 €, 77 €, 30 € — `roadmapV3.ts` : 99, 97, 87, 67, 97, 97, 67, 197, 17, 27, 27, 27 €).
- Mais la carte `V3UpsellPromoCard` **remplace le prix par un badge « Inclus »** dès que l'option est couverte par le forfait (ou que le compte est admin/Édition). Résultat : sur ton écran, aucun tarif n'apparaît.
- Les 12 packs premium/spécialistes n'ont **aucun identifiant de prix** : le bouton « Débloquer » renvoie vers `/v3/forfaits`, donc impossible d'acheter à l'unité.
- La page affiche encore un bandeau « Pack Pro Vendeur 547 € » avec un bouton « Passer en Studio Pro » (forfait supprimé).

## Ce qu'on met en place

1. **Prix toujours visible sur chaque encart**
   - Ligne tarif permanente : `97 €` (paiement unique).
   - Si l'option est comprise dans le forfait : `Inclus dans votre forfait · valeur 97 €` — le montant reste lisible.
   - Mention explicite « paiement unique, sans abonnement » sous le prix.

2. **Achat à l'unité pour tous les upsells**
   - Création d'un prix de paiement unique pour chacun des 12 packs qui n'en ont pas (Revenus & Scaling 99 €, Distribution 97 €, Trafic Social 87 €, Qualité Éditoriale 67 €, Étude de Marché 97 €, Promotion Éditeur 97 €, Transcription 67 €, Documentation Studio 197 €, Boost Lancement 17 €, Livres de Jeux 27 €, Cherche & Trouve 27 €, Histoires Courtes 27 €).
   - Le bouton « Débloquer à 97 € » ouvre directement le paiement intégré, plus de renvoi vers la page forfaits.
   - Pour les options déjà incluses : bouton principal « Ouvrir » + lien discret « Offrir / acheter à l'unité ».

3. **Tableau récapitulatif des tarifs en haut de `/v3/upsells`**
   - Une grille compacte : option, prix unitaire, inclus dans Plume / Édition.
   - Total « valeur cumulée des compléments » affiché pour justifier le forfait Édition.

4. **Nettoyage de l'ancienne tarification**
   - Suppression du bandeau 547 € / « Passer en Studio Pro » et des textes « ne s'achètent pas à l'unité ».
   - Bandeau de bas de page recentré sur Édition 47 €/mois (tout inclus) + rappel -20 % à vie pour les anciens clients V2.

5. **Cohérence ailleurs**
   - Le bandeau rotatif d'upsells de la page d'accueil V3 et la barre d'actions après génération d'un livre affichent aussi le prix unitaire.

## Détails techniques

- `src/components/v3public/V3UpsellPromoCard.tsx` : afficher `price` dans tous les cas, ajouter un état `included` avec prix « valeur », rendre le CTA dépendant de `priceId` désormais toujours présent.
- `src/data/roadmapV3.ts` : ajouter `priceId` à chaque pack (`v3_pack_<id>_once`).
- Création des produits/prix côté paiement (Stripe, mode test puis synchro à la publication) pour les 12 nouveaux identifiants.
- `src/pages/v3/V3UpsellsPage.tsx` : nouvelle grille tarifaire, retrait du bloc 547 €, textes mis à jour.
- Vérification : rendu des cartes en compte admin (tout inclus) et en compte sans droits, puis ouverture d'un tunnel de paiement à l'unité.
