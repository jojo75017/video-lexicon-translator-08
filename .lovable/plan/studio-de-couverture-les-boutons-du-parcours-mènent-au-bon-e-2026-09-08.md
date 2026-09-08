# Studio de couverture : les boutons du parcours mènent au bon endroit

Problème constaté : depuis le parcours (les cartes « Visuels de couverture » et « Couverture & mise en page »), on n'arrive pas sur l'outil de création mais sur la page de vente à 67 €. Ce n'est pas la bonne destination.

Décision retenue : **tous les boutons couverture du parcours ouvrent l'assistant en 3 étapes** (`/v3/couverture-express`). La page à 67 € reste accessible uniquement depuis les endroits où l'on parle explicitement d'achat.

## Ce qui change

1. Carte « Visuels de couverture » du parcours → ouvre l'assistant en 3 étapes.
2. Carte « Couverture & mise en page » du parcours → ouvre l'assistant en 3 étapes.
3. Dans le parcours (liste des agents / départements), les rôles couverture — Directeur Artistique et Illustrateur — ouvrent le même assistant au lieu de l'ancien module de vente.
4. Bouton « Image / Couverture » en haut du hub → même destination.
5. Vérification de toutes les autres entrées « Studio de couverture » (menu du haut, bandeau d'accueil, bouton orange de la barre latérale, Nouveautés) : aucune ne doit tomber sur la page à 67 €.

## Ce qui ne change pas

- La carte « Découvrir l'offre 67 € » du bandeau d'accueil et la page dédiée `/v3/offre-couverture-v4` : c'est leur rôle de vendre.
- La page « Mes paiements » et le tunnel de paiement `/v3/cover-pro?checkout=1`.
- L'assistant lui-même, la bibliothèque, l'éditeur, la génération d'illustration, les crédits, les clés, la base, la sécurité et les calculs KDP : rien n'est touché.

## Détails techniques

- `src/data/v3TwoStepEngines.ts` : `route` des entrées `visuels` et `mise-en-page` → `/v3/couverture-express`.
- `src/data/editionAgents.ts` : entrées `moduleId: 'cover-studio-pro'` (ordre 10 et 20) → cibler l'assistant, avec la même mécanique d'ouverture que les autres agents dans `EditionWorkflow.tsx`.
- `src/pages/V3HubPage.tsx` : le bouton « Image / Couverture » (`openModule('cover-studio-pro')`) navigue vers `/v3/couverture-express`.
- Audit par recherche de `/v3/cover-pro` : seuls `V3CoverProBanner`, `V3CoverOfferPage`, `PaiementsCouverturesPage`, `CoverProAccessBar` et `IllustrationGeneratorPanel` (message « Débloquer ») le conservent.
- Vérification : typecheck, puis clic réel sur chaque carte couverture du parcours dans le navigateur pour confirmer l'URL d'arrivée.
