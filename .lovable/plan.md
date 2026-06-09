# Communauté KDP Premium — Ajout à la Roadmap V3

## Objectif
Transformer le forum existant en une **Communauté KDP Premium** façon forum officiel Amazon KDP : des **encarts par catégorie** (rubriques KDP officielles + outils du générateur), un **assistant IA de solutions** pour débloquer les abonnés, des **solutions/FAQ épinglées** par encart, et un **lien direct vers l'outil** qui résout chaque problème. Lecture publique (SEO), écriture réservée aux abonnés.

Pour cette étape, on **n'implémente pas la refonte** : on inscrit ces manques comme **nouveaux modules dans `src/data/roadmapV3.ts`** (pilier `marketing`/`ia`, statut `todo`).

## Ce qui est ajouté à `roadmapV3.ts`

Nouveau bloc commenté `// ===== AJOUTS V3 — Communauté KDP Premium — à construire =====` avec ces modules :

1. **`community-kdp-hub`** (pilier `marketing`)
   « Communauté KDP Premium — Hub de Solutions »
   Forum premium avec encarts combinés : rubriques KDP officielles (Marketing & Promotion, Page Amazon, Paiements & Ventes, Gestion du livre, Compte KDP, Mise en forme, Voix de l'auteur, Audiobooks Voix Virtuelle, Traduction Kindle) + encarts liés aux outils du générateur. Lecture publique, écriture réservée aux abonnés.

2. **`community-ai-unblock`** (pilier `ia`)
   « Assistant IA Débloquage KDP »
   Bouton « Débloquer avec l'IA » : à partir de la question/blocage de l'abonné, génère une solution KDP concrète (étapes, modèle d'email au support KDP si besoin) et propose l'outil interne adapté.

3. **`community-pinned-solutions`** (pilier `marketing`)
   « Solutions & FAQ Épinglées »
   Articles de solutions types épinglés en haut de chaque encart (problèmes KDP fréquents : compte suspendu, royalties retenues, blocage de contenu, conformité, etc.), éditables.

4. **`community-tool-deeplinks`** (pilier `marketing`)
   « Liens Directs vers l'Outil »
   Chaque encart/problème renvoie vers le module du générateur qui résout le blocage (ex. conformité → Vérificateur de Conformité Contenu, couverture refusée → Couverture KDP Exacte, etc.).

Les 4 modules sont créés avec `status: 'todo'`.

## Détails techniques
- Fichier modifié : `src/data/roadmapV3.ts` uniquement (ajout de 4 entrées `V3Module`).
- Aucun changement de schéma, de page ou de logique pour cette étape.
- Réutilisera, lors de la construction future : le forum existant (`ForumPage`, `useForum`, tables `forum_*`), `SubscriberGate` pour l'écriture abonnés, et le pattern Edge Function IA (Gemini BYOK) pour l'assistant.

## Étape suivante (hors de ce plan)
Après validation, on pourra construire la refonte : nouveaux encarts combinés, gate lecture publique/écriture abonnés, assistant IA et solutions épinglées.