# V4 renforcée : Studio A/B/C + Stratège de Positionnement

Objectif : la V4 (347€) apporte de vraies fonctions supplémentaires vs la V3 (197€), avec deux nouveaux moteurs IA et une expérience plus cohérente (onglets, versions A/B/C, bouton « Recommandé »).

## 1. Studio de versions A/B/C (nouvel agent V4)

Nouveau module `edition-variant-studio` (composant `EditionVariantStudio.tsx`), avec **3 onglets** :

1. **Titre & sous-titre** — l'IA propose 3 couples titre + sous-titre (A / B / C).
2. **4e de couverture** — 3 versions de la description de vente Amazon.
3. **Couverture** — 3 pistes de couverture (visuel généré).

Pour chaque onglet :
- Boutons **Version A / B / C** en cartes côte à côte.
- L'IA marque une version **« ⭐ Recommandé »** (avec une phrase de justification courte).
- Bouton **« Choisir cette version »** qui enregistre le choix dans la fiche du livre (`edition_book_config_v1`) — titre/sous-titre alimentent aussi l'onglet Export.
- Pré-remplissage à partir de la fiche du livre (titre, sujet, genre, public) déjà saisie dans le Parcours.

Moteurs :
- **Texte (titre + 4e)** : nouvelle edge function `edition-variants` (AI Gateway, `google/gemini-3-flash-preview`), sortie structurée { versions:[{label, titre?, sousTitre?, texte?, argument}], recommended:'A'|'B'|'C' }. Prompt en français, ton maison d'édition, aucune donnée fictive.
- **Couverture** : réutilise la génération d'image existante (`aiImageInvoke` / moteur `cover-studio-pro`), 3 variations, photoréalisme strict conforme aux règles projet.

## 2. Stratège de Positionnement (nouvel agent V4)

Nouveau module `book-positioning` (composant `PositioningStrategist.tsx`) — « chercher les meilleures positions du livre », **3 volets combinés dans une seule vue** :

1. **Meilleures catégories KDP** — sous-catégories Amazon les plus atteignables (rang cible + raison).
2. **7 mots-clés KDP** — les 7 mots-clés porteurs pour le référencement Amazon.
3. **Positionnement concurrentiel** — angle libre à prendre dans la niche, forces/faiblesses face aux best-sellers.

Moteur : nouvelle edge function `book-positioning` (AI Gateway). Optionnellement enrichie par les données Amazon réelles déjà disponibles (`kdp-asin-scraper` / `market-research`) quand une niche est fournie ; sinon estimation IA. Sortie structurée (catégories[], keywords[7], competitive{angle, gaps[], watchouts[]}).

## 3. Câblage dans l'atelier d'édition

Dans `src/data/editionAgents.ts`, ajouter deux agents `tier: 'v4'` :

| Agent | Département | Module |
| --- | --- | --- |
| Le Comparateur de versions (Studio A/B/C) | Studio Conception | `edition-variant-studio` |
| Le Stratège de Positionnement | Publication | `book-positioning` |

- V3 reste à **22 agents** (les nouveaux apparaissent verrouillés « Débloquer V4 »).
- V4 passe de 34 à **36 agents** (`V3_AGENT_COUNT` / `V4_AGENT_COUNT` recalculés automatiquement).
- `EditionWorkflow.tsx` : aucun changement de logique (rendu déjà filtré par tier). Le bandeau upsell V4 mentionne désormais aussi « Studio A/B/C + Stratège de Positionnement » pour rendre l'avantage V4 explicite.

## 4. Enregistrement des modules

- `src/data/roadmapV3.ts` : 2 nouvelles entrées modules (`edition-variant-studio`, `book-positioning`), pilier `edition`, accès `pack` (donc réservées V4).
- `src/components/admin/v3ModuleRegistry.tsx` : mapping `moduleId → composant` pour les 2 nouveaux modules.
- `src/data/v3Launch.ts` : libellé V4 mis à jour (36 agents) + mise en avant des nouveautés livre.

## Détails techniques
- Edge functions : CORS partagé, validation Zod des entrées, `Output`/JSON parse défensif (fallback sur `error.text`), gestion des erreurs 402/429 remontées à l'UI.
- Aucun changement de paiement ni des générateurs existants ; on ajoute uniquement de nouveaux moteurs et l'orchestration.
- Palette « Clair Ambre » et style identiques au Hub pour la cohérence visuelle.

## Résultat attendu
- **V4** visiblement supérieure : 2 agents exclusifs de plus (Studio A/B/C avec version recommandée + Stratège de Positionnement) en plus des enrichissements livre déjà en place.
- Choix de version A/B/C fluide, avec recommandation IA, réinjecté dans la fiche livre et l'export.
- Recherche des meilleures catégories, mots-clés et angle concurrentiel pour maximiser les ventes.
