# Compléter la V3 — modules KDP oubliés

On a repéré 4 fonctionnalités KDP importantes absentes de la V3. On commence par **les inscrire à la roadmap** (statut « à construire »), pour valider le périmètre avant de coder. Aucun outil n'est développé à cette étape.

## Les 4 modules ajoutés

### 📦 Publier
- **Livres à contenu faible/nul** — Générateur de carnets, journaux, planners, agendas et cahiers (lignés, pointillés, vierges) : un énorme marché KDP « low/no-content » totalement absent aujourd'hui. Préparation des intérieurs PDF aux formats KDP.

### 💰 Monétiser
- **Calculateur de redevances Print** — Coût d'impression KDP exact (nombre de pages, couleur/N&B, format broché/relié) et marge nette réelle par marché (US/UK/DE/FR), au-delà du simulateur 35%/70% existant qui ne couvre que l'ebook.

### 📣 Marketing
- **Optimiseur « Look Inside »** — Optimise les toutes premières pages (l'aperçu Amazon « Regard à l'intérieur ») pour maximiser la conversion : ordre des pages, accroche d'ouverture, ce qui doit apparaître avant le seuil de prévisualisation.
- **Avis éditoriaux (Editorial Reviews)** — Génère des citations d'avis professionnelles pour la section « Editorial Reviews » de la fiche Amazon (distincte des avis lecteurs).

## Ce qui sera modifié

`src/data/roadmapV3.ts` uniquement : ajout d'un bloc « AJOUTS V3 — compléments KDP » avec ces 4 entrées en `status: 'todo'` (« à construire »), réparties dans les piliers Publier / Monétiser / Marketing. Elles apparaîtront automatiquement dans le Hub V3 grâce au code de rendu existant.

## Détails techniques
- Aucun nouveau composant ni edge function à cette étape.
- Aucun mapping dans `v3ModuleRegistry.tsx` tant que les modules sont en `todo` (pas encore cliquables/fonctionnels).
- Mise à jour de la mémoire roadmap V3 pour refléter le nouveau total de modules.

## Étape suivante (après validation)
Une fois la liste validée, on construit chaque module en vrai outil fonctionnel (composant + edge function IA si besoin) comme les autres modules V3, un par un.
