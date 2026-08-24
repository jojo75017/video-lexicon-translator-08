# Plan — Module "Histoires Courtes & Contes Illustrés"

## Objectif
Ajouter un quatrième module générateur à la suite des modules spéciaux (après Puzzle Book, Cherche & Trouve, et les livres illustrés existants) : un générateur d'histoires courtes et de contes illustrés, verrouillé pour les utilisateurs Standard, débloquable à 27 € (one-shot) ou inclus dans le plan Pro/Édition.

## Livrables choisis (réponses validées)
- **Deux modes** : génération de textes + prompts image par défaut ; option "générer les illustrations" en un clic.
- **Cibles éditoriales** : Maternelle 3-6 ans, Jeunesse 7-12 ans, Adultes / littérature courte.
- **Exports** : PDF prêt KDP, DOCX éditable, TXT + prompts.

## Architecture retenue
Le module reprend le même pattern que `puzzle-book` et `cherche-trouve` :
- Edge Function `short-stories-generate` pour la génération IA (texte + prompts, option image).
- Hook `useShortStoriesAccess` pour le contrôle d'accès.
- Page `V3ShortStoriesPage` avec formulaire, prévisualisation, édition et exports.
- Modal `V3ShortStoriesUpsell` pour le paiement one-shot 27 €.
- Intégration dans la sidebar, le registre d'outils, les onglets "Livres spéciaux" et la roadmap V3.
- Mise à jour du webhook Stripe pour enregistrer l'entitlement.

## Découpage technique

### 1. Edge Function `short-stories-generate`
- Créer `supabase/functions/short-stories-generate/index.ts`.
- Authentification via `supabase.auth.getUser()`.
- Prompt système adapté à la tranche d'âge sélectionnée :
  - 3-6 ans : histoires du soir, vocabulaire simple, leçon de vie douce.
  - 7-12 ans : aventure, mystère, personnages attachants.
  - Adultes : nouvelles, contes philosophiques / feel-good.
- Sortie JSON structurée : `{ stories: [{ title, synopsis, content, illustrationPromptEn, illustrationPromptFr, moral }] }`.
- Mode image : si `generateImages: true`, appel Lovable AI Gateway (image generation) avec le prompt EN, retour des URLs images.
- Génération par lots (batch de 5), maximum 30 histoires.
- Respect des règles de langue : textes 100 % en français, pas de latin ni de mots inventés.

### 2. Frontend — Page principale
- Créer `src/pages/v3public/V3ShortStoriesPage.tsx`.
- Formulaire de configuration :
  - Tranche d'âge (3-6, 7-12, adultes).
  - Thème / niche.
  - Nombre d'histoires (1-30).
  - Longueur cible par histoire (mots).
  - Tonalité (rassurante, aventure, drôle, philosophique…).
  - Titre du livre et nom d'auteur (optionnels).
  - Case "Générer aussi les illustrations".
- Panneau de résultats :
  - Sommaire dynamique.
  - Cartes d'histoires éditables (titre, synopsis, contenu, morale, prompt image).
  - Aperçu de l'illustration générée (si mode image activé).
  - Boutons "Copier le prompt", "Regénérer cette histoire", "Supprimer", "Ajouter une histoire".
- Exports :
  - **PDF** : mise en page 6"×9" avec page de titre, sommaire, histoires, prompts image en fin d'ouvrage.
  - **DOCX** : document éditable avec styles de titres.
  - **TXT** : texte brut + prompts.

### 3. Contrôle d'accès
- Créer `src/hooks/useShortStoriesAccess.ts` (copie du pattern `usePuzzleBookAccess`).
- Vérification : admin, abonné Pro/Édition (`editeur`, `auteur`, `lifetime`, `vip`), ou achat one-shot du module `short-stories`.

### 4. Upsell
- Créer `src/components/v3/V3ShortStoriesUpsell.tsx`.
- Paiement 27 € via `v3-upsell-checkout` avec `packId: 'short_stories'`.
- Bouton secondaire "Passer au plan Pro — module inclus".

### 5. Routing & navigation
- Ajouter la route `/v3/livres/histoires-illustrees` dans `src/App.tsx`.
- Ajouter l'entrée dans `src/data/specialBookTabs.ts` (slug `histoires-illustrees`, label "Histoires Courtes & Contes Illustrés").
- Ajouter le mapping dans `src/pages/v3public/V3SpecialBookPage.tsx`.
- Ajouter l'outil dans `src/data/v2ToolsRegistry.ts` (id `short-stories-illustrees`, catégorie `kdp`, badge `Pro`, icône `BookOpen` ou `Star`).
- Ajouter le lien dans `src/components/v3public/V3Sidebar.tsx` (section "Créer un livre").

### 6. Tarification & webhook
- Ajouter le pack `short_stories` dans `src/data/roadmapV3.ts` (27 €, `alacarte: true`).
- Ajouter `short_stories: 'short-stories'` dans `UPSELL_PACK_MODULES` de `supabase/functions/payments-webhook/index.ts`.
- Ajouter `short_stories` dans le catalogue `PACKS` de `supabase/functions/v3-upsell-checkout/index.ts` (label "Histoires Courtes & Contes Illustrés — Accès à vie", amount 2700).

### 7. Exports PDF/DOCX
- Créer `src/lib/shortStoriesExport.ts`.
- PDF via `jsPDF` ou `pdf-lib` (reprendre le pattern existant dans `puzzleBookExport.ts`).
- DOCX via `docx-js` avec styles de titres et page US Letter / A4 selon les conventions du projet.

### 8. Tests & validation
- Vérifier la génération réelle via l'Edge Function (1 lot de 2 histoires).
- Vérifier le verrouillage pour un utilisateur Standard.
- Vérifier le déblocage après paiement (webhook + entitlement).
- Vérifier les exports PDF, DOCX, TXT.
- Vérifier l'affichage dans la sidebar et le hub d'outils.
- Vérifier que les textes générés sont en français, sans latin ni mots inventés.

## Fichiers impactés
- Créés :
  - `supabase/functions/short-stories-generate/index.ts`
  - `src/pages/v3public/V3ShortStoriesPage.tsx`
  - `src/hooks/useShortStoriesAccess.ts`
  - `src/components/v3/V3ShortStoriesUpsell.tsx`
  - `src/lib/shortStoriesExport.ts`
- Modifiés :
  - `src/App.tsx`
  - `src/data/specialBookTabs.ts`
  - `src/pages/v3public/V3SpecialBookPage.tsx`
  - `src/data/v2ToolsRegistry.ts`
  - `src/components/v3public/V3Sidebar.tsx`
  - `src/data/roadmapV3.ts`
  - `supabase/functions/payments-webhook/index.ts`
  - `supabase/functions/v3-upsell-checkout/index.ts`

## Risques & mitigations
- **Coût IA images** : le mode image est désactivé par défaut ; un tooltip indique la consommation de crédits.
- **Qualité des histoires** : prompt système renforcé avec contraintes de langue, de longueur et de structure.
- **Cohérence du ton** : ajout d'un champ "Tonalité" et d'une "Bible du livre" optionnelle pour lier les histoires entre elles.

## Prochaine étape après approbation
Implémenter les fichiers dans l'ordre ci-dessus, déployer l'Edge Function, puis tester le flux complet en conditions réelles.