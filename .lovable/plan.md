# Upsells : routes correctes + tarifs 17 / 27 / 47 €

## Problème constaté
- Les cartes des **packs premium** et des **options spécialistes** de `/v3/upsells` pointent toutes vers `/v3/forfaits` (destination codée en dur), sauf le pack Boost. Résultat : aucun bouton n'ouvre le bon outil.
- Le complément **Audiolivre** pointe vers `/v3/audiobook`, une route qui n'existe pas (la vraie est `/v3/outils/audiobook`) → l'abonné retombe sur une page introuvable ou l'accueil.
- Les tarifs à l'unité sont trop élevés (97 €, 99 €, 197 €).

## Ce qui change

### 1. Chaque pack a sa vraie destination
Ajout d'un champ `to` sur chaque pack (dans les données), utilisé par les cartes au lieu de `/v3/forfaits` :

| Pack / complément | Destination |
|---|---|
| Pack Revenus & Scaling | `/v3/outils/royalties` |
| Pack Distribution Large | `/v3/donnees-kdp` |
| Pack Trafic Social & Viralité | `/v3/posts` |
| Pack Qualité Éditoriale Pro | `/v3/corriger` |
| Pack Étude de Marché Pro | `/v3/outils/espion-concurrents` |
| Pack Promotion Éditeur | `/v3/acquisition` |
| Transcription Audio/Vidéo | `/v3/outils` |
| Documentation Studio AI | `/v3/hub?tab=documentation` |
| Pack Boost de Lancement | `/v3/upsell-17` |
| Jeux & Énigmes | `/v3/livres/jeux-enigmes` |
| Cherche & Trouve | `/v3/livres/cherche-trouve` |
| Histoires Courtes & Contes | `/v3/livres/histoires-illustrees` |
| BookPerfect AI | `/v3/corriger` |
| Traductions relues | `/v3/outils/traduction` |
| Audiolivre Premium / version audio | `/v3/outils/audiobook` (route corrigée) |
| Sélection maisons d'édition | `/v3/outils` |
| Pack Sérénité | `/contact-support?sujet=pack-serenite` |

### 2. Barre « Retour aux upsells »
Quand on arrive sur un outil depuis une carte upsell, une barre discrète en haut permet de revenir à `/v3/upsells` (même principe que la barre « Retour aux agents » déjà en place).

### 3. Tarifs alignés sur 3 paliers
- **17 €** : Pack Boost de Lancement.
- **27 €** : Jeux & Énigmes, Cherche & Trouve, Histoires Courtes, Transcription, Promotion Éditeur, Traductions relues, Audiolivre Premium, Sélection maisons d'édition, Pack Sérénité.
- **47 €** : BookPerfect AI, Revenus & Scaling, Distribution Large, Trafic Social, Qualité Éditoriale, Étude de Marché, Documentation Studio.
- **9,99 €** : version audio d'un seul livre (inchangé).

La grille « Tarifs à l'unité » de `/v3/upsells` et les valeurs cumulées affichées se recalculent automatiquement.

### 4. Paiements
Les prix de paiement unique sont recréés côté paiement (Stripe) aux nouveaux montants, en réutilisant les identifiants existants (`v3_pack_*_once`, `v3_addon_*_once`) pour ne rien casser. Vérification que chaque bouton « Acheter » ouvre bien le tunnel avec le bon montant.

### 5. Vérification
Test navigateur sur `/v3/upsells` : clic sur chaque carte → arrivée sur l'outil correspondant (et non l'accueil), tarifs affichés 17/27/47, tunnel d'achat opérationnel.

## Détails techniques
- `src/data/roadmapV3.ts` : ajout de `to` sur les 12 packs + nouveaux `price`.
- `src/data/v3Pricing.ts` : correction des `to` des compléments + nouveaux `price`.
- `src/pages/v3/V3UpsellsPage.tsx` : utilise `pack.to` au lieu de `/v3/forfaits`.
- `src/components/v3public/V3UpsellPromoCard.tsx` : navigation vers `to` avec paramètre de retour (`?from=upsells`).
- Nouvelle barre de retour réutilisable affichée quand `from=upsells`.
- Aucun changement de base de données ni de forfaits (Plume 27 € / Édition 47 € inchangés).
