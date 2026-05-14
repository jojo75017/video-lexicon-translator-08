# Déploiement global des options "Pédagogique" à tous les livres

Objectif : appliquer les 3 lots déjà livrés sur `EbookPedagogiqueGenerator` à **tous les autres générateurs et flux d'écriture**, pour que chaque abonné ait les mêmes possibilités partout.

## Périmètre couvert

### A. Générateurs spécialisés (réutilisent les exporters DOCX/PDF)
- `EbookScolaireGenerator.tsx`
- `EbookAgendaGenerator.tsx`
- `EbookAtlas.tsx`
- `EbookDiaryGenerator.tsx`
- `EbookDocumentaryGenerator.tsx`
- `EbookComicBookGenerator.tsx`, `EbookColoringBookGenerator.tsx`, `EbookBirdSheetGenerator.tsx`, `EbookAquariumGenerator.tsx`, `EbookBDTemplatesSelector` (livres pédagogiques visuels)

### B. Flux ebook "classique" (romans / non-fiction)
- `pages/EbookPlannerPage.tsx` (entrée principale du pipeline P1‑P15)
- `EbookExporter.tsx` (export central utilisé par le planner)
- `EbookExpertWriting.tsx` (rédaction longue)
- `EbookAiChat.tsx` (chat de réécriture)
- Hooks : `useEbookGeneration.ts`, `useSubscriptionGeneration.ts`, `useProductGeneration.ts`

## Lot 1 — Options de mise en page export (DOCX/PDF) partout

1. Le panneau `EbookSettingsPanel` (police, taille titres 14/16, corps 11/12/14, justification) devient un composant partagé déjà prêt.
2. L'intégrer dans :
   - `EbookExporter.tsx` (impacte planner + tous les générateurs qui passent par lui)
   - Chaque générateur listé en A. qui appelle directement `exportEbookToDocx/Pdf` → on lit `getEbookExportOptions()` depuis `ebookExportOptions.ts` (déjà créé) au moment de l'export, donc 1 seul ajout de panneau global suffit si on centralise.
3. Stratégie retenue : **stocker les options dans `localStorage` via `ebookExportOptions.ts`** + un seul panneau "Réglages export" accessible depuis :
   - le header du planner
   - chaque générateur spécialisé (bouton "Réglages d'export")
   Les exporters lisent les options par défaut → aucun générateur n'a besoin de les passer manuellement.
4. Appliquer le titre H6 + tableaux à colonnes fixes : déjà fait dans les exporters → automatiquement propagé partout.

## Lot 2 — OpenRouter pour les images partout

1. `generate-educational-image` accepte déjà `openrouterKey`.
2. Faire pareil pour les autres edge functions image utilisées dans les livres :
   - `generate-cover-image`
   - `generate-chapter-image`
   - `generate-illustration`
   - toute fonction `generate-*-image` détectée
3. Créer un helper front `src/services/imageGenerationService.ts` qui :
   - lit la clé OpenRouter depuis `localStorage` (déjà gérée par `EbookSettingsPanel`)
   - injecte automatiquement `openrouterKey` dans toutes les invocations Supabase d'images
4. Remplacer les appels directs `supabase.functions.invoke('generate-*-image', …)` par ce helper dans les composants concernés (cover studio, chapter image, atlas, etc.).

## Lot 3 — Choix Gemini / Claude / OpenAI pour la rédaction partout

1. `aiWritingService.ts` (déjà créé) expose `callAIWriting()`.
2. Migrer tous les appels `geminiService` → `callAIWriting()` :
   - `useEbookGeneration.ts`
   - `useSubscriptionGeneration.ts`
   - `useProductGeneration.ts`
   - `EbookExpertWriting.tsx`
   - `EbookAiChat.tsx`
   - `EbookStatisticsTools.tsx`
   - `EbookScolaireGenerator.tsx`
   - `pages/PromptsGeneratorPage.tsx`, `pages/AiChatPage.tsx`, `pages/EbookPlannerPage.tsx`
3. Côté edge functions, faire la même bascule pour les fonctions serveur de rédaction :
   - `expert-writing` → accepter `provider` + clé BYOK et router vers Gemini / Anthropic / OpenAI
   - Idem pour `chapter-writer`, `bible-generator`, `proofreader`, `developmental-editor` si utilisées
4. Le sélecteur "Moteur de rédaction" du `EbookSettingsPanel` (déjà existant) devient la source unique : sa valeur (`gemini` | `claude` | `openai`) est lue par `aiWritingService` et envoyée aux edge functions.

## Détails techniques

- **Centralisation** : un seul `EbookSettingsPanel` global accessible depuis `EspaceHeader` (icône Réglages) + raccourci dans chaque générateur. Évite la duplication.
- **Stockage clés BYOK** : `localStorage` (`gemini_api_key`, `claude_api_key`, `openai_api_key`, `openrouter_api_key`) — pas de table DB (cohérent avec la mémoire BYOK).
- **Fallbacks** : si aucune clé BYOK n'est fournie, on retombe sur Lovable AI (Gemini par défaut) pour la rédaction et sur Lovable AI pour les images. Aucun blocage.
- **Edge functions** : ajouter dans chaque fonction de rédaction un switch `provider` → URL + headers + format de payload + parser de réponse (factorisé dans un util `_shared/aiProviders.ts`).
- **Pas de refacto du Planner monolithe** (conforme à la mémoire `refactoring-monolithe-ebook-planner`) : on branche le service, on ne déplace pas la logique.

## Hors périmètre

- Pas de UI WYSIWYG live de l'export.
- Pas de clé partagée côté serveur (BYOK strict).
- Pas de migration des audiobooks (TTS reste OpenAI serveur, conforme à la mémoire).

## Ordre d'exécution suggéré

1. Centraliser le `EbookSettingsPanel` dans le header (1 fichier).
2. Brancher `callAIWriting` dans les 3 hooks (`useEbookGeneration`, `useSubscriptionGeneration`, `useProductGeneration`) → impact immédiat sur 80% du flux.
3. Créer `imageGenerationService.ts` + brancher OpenRouter dans les autres edge functions image.
4. Migrer `EbookExpertWriting`, `EbookAiChat`, `EbookScolaireGenerator`, `EbookStatisticsTools`.
5. Étendre `EbookExporter.tsx` pour qu'il honore les options globales.
6. Vérifier les générateurs spécialisés restants (Atlas, Agenda, Diary, Documentary, BD).

Je peux exécuter ce plan tel quel — confirme et je lance.
