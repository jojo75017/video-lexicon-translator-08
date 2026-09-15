# Réparer et alléger la V3

Objectif retenu : d'abord corriger les anomalies réelles, tarifs inclus. ContentStudio est conservé (il reste dans le menu, simplement retiré de l'accueil).

## Ce qui est cassé aujourd'hui (vérifié)

1. **Deux grilles de prix vivent en même temps.**
   - La grille officielle (Plume 27 €/mois, Édition 47 €/mois) alimente la page des forfaits.
   - Une ancienne grille (« 197 € à vie », « Pack Pro 547 € », carte cadeau 158 €, paiements 3×69 €, 3×189 €, 4×144 €) est encore utilisée par des écrans actifs : la page des options payantes, le formulaire de commande, les messages de module verrouillé, le hub, la page de paiement et plusieurs écrans d'administration.
   - Conséquence : un abonné peut lire 27 €/mois sur une page et 197 € ou 547 € sur une autre.

2. **Deux bannières « couverture » ne sont plus affichées nulle part** (une seule est utilisée sur l'accueil). Elles restent dans le projet et alourdissent la maintenance.

3. **Un commentaire dans le fichier des routes affirme que trois pages sont « archivées, sans lien entrant »** (sommaire ultime, traduction, correcteur) alors qu'elles sont bien accessibles depuis le menu. Information fausse, source de confusion.

4. **Beaucoup d'adresses en double** : une douzaine d'anciennes adresses redirigent vers les nouvelles (offres, tarifs, correcteur, avis-clients, book-trailer, reels...). Elles fonctionnent mais empilent l'historique de plusieurs renommages.

5. **Accueil V3 très chargé** : 10 grands blocs qui s'enchaînent, plus de 30 éléments importés sur une seule page.

## Ce que je propose de faire

### Étape 1 — Une seule vérité pour les prix (priorité)
- Remplacer, dans tous les écrans visibles par un abonné, les montants de l'ancienne grille par les tarifs officiels : Plume 27 €/mois (270 €/an), Édition 47 €/mois (470 €/an), et l'accès à vie 47 € tant qu'il est ouvert (jusqu'au 30/09/2026).
- Retirer des écrans abonnés les mentions « 197 € à vie », « Pack Pro 547 € », « carte cadeau 158 € » et les échéanciers associés.
- Ne pas toucher aux paiements eux-mêmes (Stripe, PayPal, échéances déjà encaissées) : uniquement les textes et montants affichés.
- Les écrans d'administration qui servent d'historique gardent leurs anciens chiffres, clairement marqués « ancienne offre ».

### Étape 2 — Nettoyage sans risque
- Supprimer les deux bannières couverture inutilisées.
- Corriger le commentaire erroné sur les pages « archivées ».
- Regrouper les anciennes adresses en une liste unique et lisible, sans casser aucun lien existant (les anciens liens continuent de fonctionner).

### Étape 3 — Alléger l'accueil V3
- Passer de 10 blocs à 6 : bandeau de lancement, présentation courte + vidéo, studio de couvertures, les moteurs d'écriture, la preuve (avis), l'appel à l'action final.
- Les blocs retirés de l'accueil ne sont pas supprimés : ils restent accessibles depuis la page « Fonctionnalités » et le menu.

### Étape 4 — Contrôle final
- Parcourir en navigateur l'accueil, les forfaits, les options payantes, le hub et un module verrouillé pour vérifier qu'aucun ancien prix ne s'affiche plus et qu'aucun lien n'est cassé.

## Ce que je ne touche pas
Base de données, sécurité, calculs KDP, moteurs de paiement, module V4 des couvertures, ContentStudio.

## Détails techniques
- Source unique de tarifs : `src/data/v3Pricing.ts`. `src/data/roadmapV3.ts` est conservé pour les écrans d'historique admin mais retiré des chemins abonnés : `V3UpsellsPage.tsx`, `V3OrderForm.tsx`, `V3ModulePaywall.tsx`, `V3UpsellPromoCard.tsx`, `V3PaiementPage.tsx`, `V3HubPage.tsx`, `CoverProPage.tsx`.
- Suppression de `V3CoverProBanner.tsx` et `V3MesCouverturesBanner.tsx` (zéro import).
- Correction du commentaire `src/App.tsx` (bloc lignes ~119-124) et regroupement des `<Navigate>` legacy du bloc `/v3` dans un tableau de paires ancien → nouveau.
- `V3HomePage.tsx` : réduction de 10 à 6 sections, imports morts supprimés.
- Vérifications : `tsgo`, suite Vitest, puis passage Playwright sur `/v3`, `/v3/forfaits`, `/v3/upsells`, `/v3/hub`.
