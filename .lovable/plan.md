# Tarif unique 297 € + les 10 Spécialistes IA (mise en œuvre début septembre)

Deux volets : le **nouveau tarif unique**, à préparer maintenant, et les **10 spécialistes IA**, développés début septembre.

## Volet 1 — Tarif unique de lancement

Fin des paliers multiples. Une seule offre, tout inclus.

| Formule | Montant | Total |
|---|---|---|
| 1 fois | 297 € | 297 € |
| 3 fois | 109 €/mois | 327 € |
| 5 fois | 69 €/mois | 345 € |

- Affichage : **597 € barré → 297 €**, mention « prix de lancement valable jusqu'au 31 décembre 2026 ».
- Tout est inclus : parcours complet, 15 agents du pipeline, correction professionnelle, couvertures, exports KDP, traductions, livres spéciaux, et les 10 spécialistes IA dès leur sortie.
- Paiement par carte (Stripe) et PayPal, avec les 3 formules dans les deux moyens de paiement.
- Compte à rebours et rappel de la date limite sur la page de commande et les pages passerelles.

### Anciens clients (47 € / 59 € à vie)

- Ils **conservent leur accès V3 actuel**, sans surcoût et sans perte.
- Les **10 spécialistes IA et les upsells ne sont pas inclus** dans leur accès.
- Une **mise à niveau à 97 € (paiement unique)** leur ouvre les 10 spécialistes et les upsells — proposée sur une page dédiée `/v3/mise-a-niveau` et par email.

### Ce qui change dans l'application

- `src/data/v3Pricing.ts` devient une offre unique (297 €) avec ses trois échéanciers ; les anciens paliers 17/27/47/197/547 sont retirés de l'affichage.
- Page de commande `/commander` refondue : une seule offre, trois boutons de paiement, prix barré, date limite.
- Menu et pages forfaits : plus de comparatif à plusieurs colonnes, un seul bloc « Tout inclus ».
- Nouveaux produits/prix de paiement : `ebookstudio_lancement` (1×297, 3×109, 5×69) et `ebookstudio_maj_ancien_client` (97 € unique).
- Droits : les comptes à vie existants reçoivent un marqueur « legacy » ; les spécialistes et upsells vérifient ce marqueur (ou la mise à niveau 97 €) avant d'ouvrir.
- Pages de vente, emails et scripts alignés sur 297 € (aucune mention des anciens montants).

## Volet 2 — Les 10 Spécialistes IA (début septembre)

Un agent par type de livre, avec des noms propres à Ebookstudio (aucun nom repris ailleurs).

| # | Spécialiste | Domaine |
|---|---|---|
| 1 | **Camille** | Histoires pour enfants, contes illustrés |
| 2 | **Victor** | Business & marketing |
| 3 | **Noémie** | Maths, puzzles, énigmes |
| 4 | **Basile** | Cahiers d'exercices, checklists, plannings |
| 5 | **Iris** | Coloriage enfant & adulte |
| 6 | **Gaspard** | Pratique & tutoriels |
| 7 | **Prune** | Cuisine, recettes, plans de repas |
| 8 | **Aurèle** | Développement personnel, productivité |
| 9 | **Solène** | Romance & fiction |
| 10 | **Timothée** | Éducatif & scolaire |

- Écran « Mes spécialistes IA » sur `/v3/specialistes` : 10 cartes (nom, mission, 3 exemples de livres) et un bouton « Confier mon livre à … » qui ouvre le bon module avec le brief pré-réglé.
- Chaque spécialiste a **sa propre mission** : rôle éditorial, règles de forme (longueur, illustrations, ton, niveau de langue) et contrôles de sortie spécifiques (Noémie vérifie ses corrigés, Prune les quantités et temps de cuisson, Camille le vocabulaire par âge, Iris un trait imprimable, Timothée le niveau scolaire).
- Le pipeline des 15 agents reste le moteur : les spécialistes sont la porte d'entrée, pas un doublon.

### Détails techniques du volet 2

- Source unique `src/data/aiSpecialists.ts` (`id`, `name`, `domain`, `mission`, `examples[]`, `route`, `moduleId`, `promptProfile`, accès requis).
- `src/components/v3public/V3SpecialistsGrid.tsx` + `src/pages/v3public/V3SpecialistsPage.tsx`, route dans `App.tsx`, entrée dans `V3Sidebar.tsx`.
- Branchement sur les modules existants (histoires illustrées, jeux & énigmes, cherche & trouve, coloriage, cuisine, documentaire, scolaire, roman, workflow) — aucun générateur dupliqué.
- Profils de prompt ajoutés aux Edge Functions existantes via un paramètre `specialist`, sans toucher aux moteurs.

## Ordre de réalisation

1. **Maintenant** : tarif unique 297 € (données, page de commande, produits de paiement, textes, compte à rebours 31/12/2026).
2. **Maintenant** : page `/v3/mise-a-niveau` à 97 € et marquage des anciens clients.
3. **Début septembre** : les 10 spécialistes (données, écran, branchements).
4. **Début septembre** : missions et contrôles de sortie par spécialiste, puis test réel sur Camille, Noémie et Prune.
