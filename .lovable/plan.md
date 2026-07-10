# Compteur réel de chapitres, sous-chapitres, pages et mots

## Problème
Dans le Planificateur, le bandeau affiche seulement `📚 X chapitres`. Aucun décompte réel des sous-chapitres, ni des mots réellement rédigés, ni d'estimation de pages. On ne sait donc jamais le volume réel du livre (« on met 15 chapitres, on ne sait pas le nombre de pages »).

## Objectif
Afficher, en temps réel et calculé à partir du contenu réel (jamais un chiffre fixe) :
- Nombre de chapitres
- Nombre de sous-chapitres (somme sur tous les chapitres)
- Nombre de mots (chapitres + sous-chapitres)
- Estimation de pages (basée sur les mots réels, format livre)

À deux endroits :
1. **Bandeau en haut du projet** (en-tête violet, à côté du titre)
2. **Barre récap fixe** visible pendant qu'on structure/édite les chapitres

## Implémentation

### 1. Helper de statistiques (dans `src/pages/EbookPlannerPage.tsx`)
Ajouter un `useMemo` `bookStats` qui parcourt `chapters` :

```text
totalChapters      = chapters.length
totalSubChapters   = somme des chapter.subChapters.length
totalWords         = mots de chaque chapter.content
                     + mots de chaque subChapter.content
estimatedPages     = max(1, ceil(totalWords / 300))   // 300 mots/page (cohérent KDP 6x9)
```
Comptage de mots : `text.trim().split(/\s+/).filter(Boolean).length` (même logique que `manuscriptParser.countWords`). On peut réutiliser `countWords` importé de `@/lib/manuscriptParser` pour rester cohérent.

### 2. Bandeau en haut du projet (~ligne 1478-1483)
Remplacer le badge unique `📚 X chapitres` par une série de badges dans le même style (`rounded-full bg-white/20 px-3 py-1`) :
- `📚 X chapitres`
- `📑 Y sous-chapitres`
- `📄 ~Z pages`
- `✍️ N mots`
Le badge auteur existant est conservé.

### 3. Barre récap fixe pendant la structuration
Ajouter un petit bandeau récapitulatif **sticky** (`sticky top-0 z-20`) juste au-dessus de la liste des chapitres, affiché seulement quand `chapters.length > 0`. Style cohérent avec le thème (fond `bg-card`/`bg-muted`, accent teal `#008296`, texte `#232F3E`), 4 cellules : Chapitres · Sous-chapitres · Pages (est.) · Mots. Il se met à jour automatiquement à chaque ajout/suppression/édition puisqu'il lit `bookStats`.

## Détails techniques
- Aucune donnée fictive : tout dérive de `chapters` en mémoire.
- `estimatedPages` = `Math.max(1, Math.ceil(totalWords / 300))`. (Note : le dashboard global utilise 250 ; on unifie sur 300 mots/page, plus proche d'un livre 6×9 KDP. Pas d'autre changement au dashboard.)
- Les libellés gèrent le pluriel (`chapitre(s)`, `sous-chapitre(s)`).
- Modification limitée au front (présentation) dans `EbookPlannerPage.tsx` — pas de logique métier ni de backend.

## Fichier touché
- `src/pages/EbookPlannerPage.tsx` (ajout du `useMemo` + badges en-tête + barre récap sticky)

## Hors périmètre
- Pas de changement de prix, de workflow V3, ni du moteur de génération.
- Pas de modification des exports DOCX/PDF.
