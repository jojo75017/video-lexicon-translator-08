## Objectif

Ajouter une **6ᵉ colonne "Formats spéciaux"** dans la vue Kanban (`Tous les outils`) pour rendre visibles les outils qui existent en code mais qui n'apparaissent nulle part dans la vue actuelle.

## Constat

Aujourd'hui `TrelloBoardColumns.ts` n'a que 5 colonnes :
1. Préparer · 2. Améliorer · 3. Produire · 4. Publier · 5. Vendre

Outils existants en code mais **invisibles** dans le Kanban :
- Livre de coloriage
- Atlas
- Encyclopédie
- Documentaire
- Journal intime
- Séries / Tomes
- BD Studio
- Document Transformer
- Templates / Modèles

## Modification

**Fichier unique** : `src/components/ebook/TrelloBoardColumns.ts`

Ajouter une 6ᵉ entrée dans `TRELLO_COLUMNS` :

```text
6. Formats spéciaux  📚  (couleur: amber)
   ├── Livre de coloriage      → coloring
   ├── Atlas                    → atlas
   ├── Encyclopédie             → encyclopedia
   ├── Documentaire             → documentary
   ├── Journal intime           → diary
   ├── Séries / Tomes           → series
   ├── BD Studio                → bd-studio
   ├── Transformer un document  → doc-transform
   └── Modèles (templates)      → templates
```

Et ajouter la palette `amber` dans `COLUMN_COLORS` (même structure que les autres : bg / border / header / card / cardHover / badge / text).

## Détails techniques

- Aucun outil supprimé, aucune route modifiée — uniquement de l'affichage.
- Les `id` de cartes correspondent aux tabIds/routes déjà câblés dans le routeur du Dashboard.
- Icônes Lucide réutilisées (Palette, Map, BookOpen, Film, NotebookPen, Library, Image, FileUp, LayoutTemplate).
- Vérification rapide après ajout que chaque `id` est bien géré par le router de tabs (sinon fallback vers la route correspondante).

## Résultat attendu

La vue **Tous les outils** affichera **6 colonnes** au lieu de 5, et tous les formats spéciaux redeviennent accessibles en un clic.
