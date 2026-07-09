## Objectif

Rendre les corrections de BookPerfect AI transparentes pour l'auteur, en deux volets :

1. **Voir corriger « en direct »** : pendant l'analyse, afficher au fil de l'eau les corrections trouvées chapitre par chapitre (comme si l'auteur regardait le directeur éditorial travailler).
2. **Comparer avec l'original** : un onglet/bouton affichant, côte à côte, le texte original et le texte corrigé, avec les différences mises en évidence, avant que l'auteur ne valide.

Le tout reste **non destructif** (le texte original en mémoire n'est jamais muté) et 100 % frontend — aucune modification du backend, de la logique d'analyse IA, ni du modèle de prix.

---

## Volet 1 — Analyse en direct (« live »)

Enrichir `src/components/bookperfect/AnalysisProgress.tsx` :
- Sous la liste des chapitres, ajouter un **flux en temps réel** des dernières corrections détectées (`analysis.issues`, triées par ordre d'apparition, les plus récentes en haut, limité aux ~12 dernières).
- Chaque ligne montre : le chapitre, la catégorie (badge coloré), l'extrait `original` barré → la `suggestion` en surbrillance verte, façon « diff inline » (réutilise le style déjà présent dans `IssueCard`).
- Le chapitre en cours d'analyse est mis en évidence (« ✍️ Correction en cours… »).
- Comme `onProgress` est déjà appelé après chaque chapitre dans l'orchestrateur, le flux se remplit automatiquement chapitre après chapitre, sans toucher à `analysisOrchestrator.ts`.

## Volet 2 — Onglet « Comparer avec l'original »

Nouveau composant `src/components/bookperfect/tabs/ComparaisonTab.tsx` :
- **Sélecteur de chapitre** (menu déroulant) en haut.
- Affichage **côte à côte** (2 colonnes sur desktop, empilées sur mobile) :
  - Colonne gauche : **texte original** du chapitre.
  - Colonne droite : **texte corrigé** = `correctedChapterText(chapter, analysis, false)` (corrections `applied` uniquement, sans imposer la typo pour garder la lecture claire — option « voir avec typographie FR » cochable).
- **Mise en évidence des différences** : les segments supprimés en rouge barré, les segments ajoutés en vert. Un petit utilitaire de diff mot-à-mot (`src/lib/bookperfect/textDiff.ts`) produit les segments à colorer ; pas de nouvelle dépendance, un diff LCS léger suffit.
- **Bandeau de synthèse** : « X correction(s) appliquée(s), Y en attente » pour ce chapitre, avec rappel que seules les corrections validées apparaissent à droite.
- Note explicative : « Validez ou ignorez les corrections dans les onglets Orthographe / Style / KDP ; cette vue reflète en direct vos choix. »

## Intégration dans la page

Dans `src/pages/BookPerfectPage.tsx` :
- Ajouter un onglet **« Comparer »** (icône `Columns`/`GitCompare`) dans la `TabsList`, entre « Style » et « Amazon KDP » (ou après « Rapport »).
- Câbler `ComparaisonTab` avec `manuscript` et `analysis`.

---

## Détails techniques

- `src/lib/bookperfect/textDiff.ts` (nouveau) : fonction `diffWords(original, corrected)` renvoyant un tableau de segments `{ type: 'equal' | 'removed' | 'added', text }` via un algorithme LCS simple sur les mots. Utilisé uniquement pour l'affichage.
- `correctedChapterText` (déjà existant dans `exporters.ts`) est réutilisé tel quel pour produire le texte corrigé — cohérence garantie avec l'export Word.
- Aucune modification de `analysisOrchestrator.ts`, des types, du backend ou de la tarification.
- Fichiers touchés :
  - créé : `src/lib/bookperfect/textDiff.ts`
  - créé : `src/components/bookperfect/tabs/ComparaisonTab.tsx`
  - édité : `src/components/bookperfect/AnalysisProgress.tsx` (flux live)
  - édité : `src/pages/BookPerfectPage.tsx` (nouvel onglet)