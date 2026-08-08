# Onglet « Corriger mon livre » (V3)

Un nouvel onglet V3 où l'auteur importe un manuscrit terminé et le fait corriger intégralement par l'IA, chapitre par chapitre, puis le réexporte prêt pour KDP.

## Parcours auteur

```text
1. Importer        2. Choisir le mode     3. Correction        4. Relecture         5. Export
DOCX / PDF / URL   Stricte ou Polissage   barre de progression accepter / refuser   Word + PDF
texte collé                               chapitre par chapitre  par correction     livre corrigé
```

1. **Importer** — DOCX, PDF, URL d'article ou texte collé. Le manuscrit est découpé en chapitres (même moteur que l'Import Studio, aucun texte perdu).
2. **Deux modes au choix**
   - **Correction stricte** : orthographe, grammaire, accords, ponctuation, anglicismes. Zéro réécriture, zéro ajout, zéro suppression — le style de l'auteur reste identique.
   - **Correction + polissage** : la correction stricte, plus allègement des répétitions manifestes, des lourdeurs et harmonisation des temps narratifs.
3. **Correction** — traitement chapitre par chapitre, avec progression visible, reprise après échec et nouvelle tentative sur un chapitre isolé (pas de perte du travail déjà fait).
4. **Relecture** — pour chaque chapitre : texte avant / après, liste des corrections avec type et explication courte, et boutons « Tout accepter », « Accepter ce chapitre », « Refuser ». Rien n'écrase l'original tant que l'auteur n'accepte pas.
5. **Export** — Word et PDF du livre corrigé (moteur d'export existant, sommaire propre), et possibilité d'enregistrer le résultat dans « Mes livres ».

## Rapport de correction

Après passage complet : nombre total de corrections, répartition par type (orthographe, grammaire, accords, ponctuation, anglicismes, répétitions), score de qualité orthographique et liste des chapitres à revoir.

## Accès

Inclus dans les deux forfaits (Plume et Édition), sans limite de livres. L'onglet apparaît dans les onglets V3 et dans le menu « Tous les outils ».

## Détails techniques

- Nouvelle page `src/pages/v3public/V3CorrecteurPage.tsx` + route `/v3/corriger` dans `src/App.tsx` (alias `/v3/correcteur`).
- Onglet ajouté dans `V3MainTabs.tsx`, entrée dans `src/data/v3HeaderMenu.ts` et `src/data/v3ToolPlans.ts` (accès Plume + Édition).
- Import réutilise `buildManuscriptFromText`, `importFromPdf`, `importFromUrl` et le parseur `manuscriptParser` déjà en place — aucun nouveau parseur.
- Correction via l'edge function existante `strict-proofread`, étendue avec un paramètre `mode: 'strict' | 'polish'` (prompt système adapté ; le comportement actuel reste le mode strict par défaut). Appels séquentiels par chapitre côté client avec relance en cas de 429.
- Diff avant/après avec `src/lib/bookperfect/textDiff.ts`.
- Export via `docxExportEngine` + normalisation `manuscriptNormalizer` (aucun doublon de chapitre, sommaire propre).
- Aucune donnée simulée : chaque correction vient d'un appel IA réel.

## Hors périmètre

Pas de modification de BookPerfect AI (`/bookperfect`) ni de son achat séparé ; ce nouvel onglet est la version intégrée aux forfaits V3.
