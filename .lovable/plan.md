## Refonte de l'écran de choix du tableau de bord auteur

L'écran `viewMode === 'choice'` dans `src/pages/EbookPlannerPage.tsx` est trop sec. On l'enrichit en 3 blocs verticaux pour un rendu pro façon "KDP Rocket".

### Bloc 1 — En-tête éditorial

Bandeau dégradé teal → orange (charte KDP) avec :

- **Titre** : "Votre livre Amazon KDP mérite d'être lu."
- **Texte (réécrit, sans plagiat)** : "EbookStudio est la suite d'outils IA pensée pour les auteurs Amazon Kindle Direct Publishing. Identifiez les niches rentables, optimisez vos titres, mots-clés, descriptions et couvertures — et donnez à votre livre toutes ses chances dès la première publication."
- 3 mini-pictos : "Niches rentables · Optimisation KDP · Couvertures pro"

### Bloc 2 — Choix du mode (existant, conservé et réharmonisé)

Les deux cartes "1 — Parcours simple" et "2 — Workflow 15 agents" restent en place, avec même padding et même rayon que les blocs 1 et 3.

### Bloc 3 — Vitrine "Livres publiés avec EbookStudio"

Nouveau composant `AuthorBooksShowcase.tsx` placé sous les cartes de choix.

- **Titre** : "Des livres déjà publiés sur Amazon avec EbookStudio"
- **Sous-titre** : "6 titres signés Georges Boubet — preuve que la méthode fonctionne."

Grille responsive (2 cols mobile, 3 cols md, 6 cols lg) avec vos 6 livres :

| ASIN | Titre | Catégorie |
|---|---|---|
| B0GXB3V5DJ | Retour en Provence — Tome 1 | Saga / Romance |
| B0GG7QCFTZ | Le Loup qui Voulait Manger le Père Noël | Jeunesse 4-6 ans |
| B0GY5K8GCS | Signal Zéro — Intégrale T1 & T2 | Thriller technologique |
| B0GX2SVHY4 | Retour en Provence — Tome 2 | Saga / Romance |
| B0GQQB7V1F | Les Secrets de la Femme de Ménage — T3 | Polar |
| B0GN34WYMK | (6e titre) | À détecter |

**Couvertures Amazon** : récupérées via le pattern public `https://images-na.ssl-images-amazon.com/images/P/{ASIN}.01.LZZZZZZZ.jpg` (ou fallback `m.media-amazon.com/images/P/{ASIN}.jpg`). Pas d'appel API requis.

Chaque carte : couverture (aspect 2/3, ombre douce, hover lift), badge catégorie, titre tronqué 2 lignes, "de Georges Boubet", lien externe complet vers `https://www.amazon.fr/dp/{ASIN}/` (`target="_blank" rel="noopener"`).

CTA bas de section : bouton teal "Créer mon livre comme Georges →" qui passe en mode `trello` (workflow 15 agents).

### Détails techniques

- **Fichier modifié** : `src/pages/EbookPlannerPage.tsx` — bloc `viewMode === 'choice'` (lignes ~1297-1335)
- **Fichier créé** : `src/components/ebook/AuthorBooksShowcase.tsx` — données livres en `const` interne, props `onStartWorkflow?: () => void`
- **Charte respectée** : `bg-card`, `text-foreground`, `border-border`, gradient `#008296 → #FF9E2D`, hover `#FF9E2D`
- **Aucune dépendance ajoutée**, aucune migration, aucun appel API, aucun edge function

### À noter

Le 6e ASIN (B0GN34WYMK) — je ne l'ai pas dans vos captures. Je vais charger sa couverture depuis Amazon mais le titre/catégorie sera "Livre Georges Boubet" en attendant que vous me le précisiez. Vous pourrez l'éditer dans le composant ou me l'indiquer après.