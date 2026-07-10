# Fiche du livre + Onglet Export + Fonctions livre exclusives V4

Trois chantiers, tous côté présentation/orchestration (aucun générateur IA ni logique de paiement modifié).

## 1. Fiche du livre (en haut du Parcours)

Aujourd'hui l'onglet **Parcours** affiche directement les agents, sans endroit pour saisir les infos du livre. On ajoute un bloc **« Fiche du livre »** en tête de `EditionWorkflow.tsx`, avant la barre de progression.

- Réutilise `WorkflowBookConfigForm` (variant `plain`) : Titre*, Sous-titre, Auteur, Petite intro/sujet, Catégorie, Public cible, Nombre de chapitres.
- Repliable (ouvert si aucun titre, replié une fois rempli).
- Persistance `localStorage` sous `edition_book_config_v1`.
- Émet `edition_book_config_updated` à chaque changement (structure + export se rafraîchissent).
- Rappel visuel « Livre en cours : *Titre* — Auteur » pour éviter la confusion de projet (mauvais livre pris).

Le bloc « Structure du livre » (titres de chapitres auto-détectés) reste juste en dessous.

## 2. Onglet « Export » sous BookPerfect

Dans `src/pages/V3HubPage.tsx` :
- Étendre `HubTab` avec `'export'`.
- Ajouter l'entrée `HUB_TABS` **juste après `bookperfect`** : `{ id: 'export', label: 'Exporter le livre', icon: Download }`.
- Rendu : composant existant `V3ExportPanel` (6 formats : DOCX KDP, EPUB, PDF impression/digital, TXT, HTML), alimenté par :
  - `manuscript` : reconstitué depuis `ebook_workflow_results` (rédaction P10/P20, sinon P4/P3).
  - `title` / `subtitle` / `author` : lus depuis `edition_book_config_v1`.
- `V3ExportPanel` gère déjà l'état « manuscrit trop court » (message d'attente) et l'état « prêt ».
- Pastille ambrée sur l'onglet quand le manuscrit détecté ≥ 50 caractères (= livre prêt à exporter).

## 3. Fonctions livre exclusives V4 (347€)

La V4 n'ajoute plus seulement le Département Commercial : elle enrichit aussi **le livre lui‑même**. Ajout de nouveaux agents `tier: 'v4'` dans `src/data/editionAgents.ts`, placés dans les départements livre existants (visibles mais verrouillés « Débloquer V4 » pour les acheteurs V3) :

| Agent (rôle) | Département | Mission | Module réel |
| --- | --- | --- | --- |
| L'Illustrateur | Atelier d'Écriture | Illustrations intérieures IA insérées dans les chapitres | moteur image de `cover-studio-pro` |
| Le Traducteur | Atelier d'Écriture | Traduit le livre pour les marchés étrangers | `translation-markets` |
| L'Éditeur littéraire (premium) | Bureau de Révision | Passe éditoriale approfondie + manuscrit enrichi (chapitres plus longs) | `developmental-edit` / `editorial` |
| Le Directeur Audio | Fabrication | Version audio (audiobook) narrée + export | `audiobook-express` |
| Le Directeur de Collection | Département Commercial | Sagas, séries & tomes (déjà V4) | `p17-series` |

- V3 (197€) : reste à **22 agents** (les nouveaux V4 apparaissent verrouillés, en teaser).
- V4 (347€) : passe à **~34 agents** (22 + livre premium + commercial).
- `V3_AGENT_COUNT` / `V4_AGENT_COUNT` recalculés automatiquement (déjà dérivés du tableau).
- Le bandeau upsell V4 et le badge d'en-tête reprennent le nouveau total.

### Détails techniques
- `editionAgents.ts` : insérer les nouveaux agents avec `order` renumérotés proprement, `tier: 'v4'`, `department` = département livre concerné.
- `EditionWorkflow.tsx` : aucune logique à changer (le rendu filtre déjà par `tier` et affiche « Débloquer V4 » sur les agents verrouillés). Ajout uniquement du bloc Fiche du livre en tête + lecture `edition_book_config_v1`.
- `V3HubPage.tsx` : nouvel onglet Export + imports `V3ExportPanel` et `Download`.
- Illustrations intérieures : réutilise la génération d'image existante (strict photoréalisme, conforme aux règles projet) ; aucun contenu fictif.

## Résultat attendu

- **Parcours** : Fiche du livre → Structure → Agents (V3 = 22, avec agents V4 en teaser) → progression.
- **Exporter le livre** (sous BookPerfect) : export 6 formats reprenant le bon titre/auteur, actif dès que le manuscrit est prêt.
- **V4** : en plus du commercial, apporte illustrations intérieures, audiobook, manuscrit premium et traductions/séries.
