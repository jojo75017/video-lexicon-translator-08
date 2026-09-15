# Remettre la nouveauté « Studio BD & Jeunesse — 47 € » sur l'accueil V3

## Ce qui s'est passé

Lors de l'allègement de la page d'accueil, la bannière « Grande nouveauté V4 — Studio BD & Jeunesse »
a été retirée de l'accueil. L'outil lui-même n'a pas été supprimé : la page de vente (47 € à vie) et
le studio (personnages, planches, coloriages, couvertures, export KDP) fonctionnent toujours.
Seule la vitrine sur l'accueil a disparu.

## Ce que je vais faire

1. **Réafficher la bannière sur `/v3`**, juste sous la bannière du Studio de couverture,
   pour que la nouveauté soit visible dès l'arrivée sans défilement.
2. **L'habiller aux nouvelles couleurs éditoriales** (ivoire/encre/or) pour qu'elle s'accorde
   à la page adoucie, au lieu de l'ancien style à bordure vive.
3. **Texte mis à jour** pour parler d'atelier jeunesse complet :
   bandes dessinées, coloriages, histoires illustrées, couvertures, export KDP —
   avec le bouton « Découvrir l'offre — 47 € à vie ».
4. **Un seul bloc**, pas de doublon : la bannière compacte utilisée sur la page des compléments
   reste inchangée.

## Ce qui ne change pas

- Le prix 47 €, le paiement et le tunnel de commande : inchangés.
- L'outil et toutes ses fonctions : inchangés.
- Base de données, sécurité, calculs KDP, module couvertures V4 : inchangés.

## Détails techniques

- Fichiers : `src/pages/v3public/V3HomePage.tsx` (remise de la section) et
  `src/components/bd/BdComicNewsBanner.tsx` (jetons de couleur `--v3-*` au lieu de `primary` vif).
- Vérification : compilation TypeScript, tests, et contrôle visuel navigateur sur `/v3`.
