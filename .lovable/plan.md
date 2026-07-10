Trois régressions à corriger dans le Hub V3 (`/hub-v3`). Tout reste en présentation, sans toucher aux moteurs ni aux prix.

## 1. Onglets clairs 197€ / 347€ dans le Parcours (`EditionWorkflow.tsx`)

Aujourd'hui les 36 agents V3 + V4 sont empilés dans une seule liste → « du vrac ». Ajouter un **sélecteur segmenté** sous le titre :

```text
[ V3 · 197€ (22 agents) ]   [ V4 · 347€ (+14 agents bonus) 🔒 ]
▓▓▓▓▓░░░  8/22 agents validés · 36%
```

- État `activeTier` (`'v3' | 'v4'`). Onglet V3 → agents `tier:'v3'` ; onglet V4 → agents `tier:'v4'` (bonus exclusifs).
- Barre de progression recalculée par onglet.
- Cadenas + bandeau upsell sur l'onglet V4 si l'abonné n'a pas la V4.

## 2. Restaurer le comptage mots / chapitres (`EditionWorkflow.tsx`)

La section « Structure du livre » ne montre plus que des titres. Reconstituer le manuscrit depuis `ebook_workflow_results` puis le découper avec `parseManuscript` + `countWords` (déjà dans `@/lib/manuscriptParser`) :

- **Bandeau synthèse** : total mots · nb chapitres · pages estimées (`estimatePages`) · temps de lecture.
- **Tableau par chapitre** : numéro, titre, **nombre de mots**, mini-barre vers une cible (~2 500 mots), style `EbookChapterWordCount`.
- Message d'invitation conservé si aucun contenu rédigé.
- Mise à jour auto via les listeners `ebook_workflow_results_updated` / `storage` déjà présents.

## 3. Restaurer la config des clés modèles + OpenRouter dans le Hub

Le bouton flottant `ApiKeysFloatingButton` n'apparaît que sur certains préfixes (`/ebook`, `/kdp`…) mais **pas sur `/hub-v3`** → dans le Hub, plus aucun moyen de saisir sa clé (Gemini `AIza…`) ni de choisir OpenRouter et son modèle (BYOK).

Correctif en deux temps :

1. **Ajouter `/hub-v3` (et `/hub`) à `VISIBLE_PREFIXES`** dans `src/components/ebook/ApiKeysFloatingButton.tsx` → le bouton « Clés API » réapparaît sur le Hub avec le sélecteur de fournisseur (Gemini / Claude / OpenAI / **OpenRouter** + choix du modèle) et l'état « configuré ».
2. **Point d'accès visible dans le Hub** : ajouter, en tête du Parcours, une petite carte/bandeau « Connectez votre clé IA » (fournisseur actif + statut valide/à configurer) qui ouvre le même panneau `EbookSettingsPanel` — pour que la configuration BYOK soit évidente sans dépendre uniquement du bouton flottant.

Le panneau réutilisé (`EbookSettingsPanel`) gère déjà Gemini + OpenRouter et la liste `OPENROUTER_MODELS` ; aucune logique IA n'est modifiée.

## Hors périmètre

- Aucun changement des agents, modules, edge functions, moteurs IA ou prix.
- Aucun autre onglet du Hub modifié.
- Pas de logique de paiement touchée.