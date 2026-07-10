# Plan corrigé

## Objectif

Rendre le Parcours du Hub V3 compréhensible et utilisable :

- **V3 197€ = 22 agents**.
- **V4 347€ = 30 agents exclusifs**.
- Les plans doivent être distinguables avec des **badges V3/V4 sur chaque agent**.
- Le tableau **chapitres / nombre de mots** doit fonctionner même quand le texte n’est pas exactement stocké dans les anciennes étapes `P20/P10/P4/P3`.
- Il faut un endroit visible pour renseigner ou ajuster le nombre de mots prévu par chapitre.

---

## 1. Corriger la structure des plans V3/V4

### `src/data/editionAgents.ts`

- Garder les 22 agents `tier: 'v3'` pour l’offre 197€.
- Passer les agents `tier: 'v4'` de 14 à **30 agents exclusifs**.
- Les 16 agents V4 ajoutés seront rattachés à des modules déjà existants dans le registre, par exemple :
  - `aplus-generator`
  - `look-inside-optimizer`
  - `editorial-reviews`
  - `author-newsletter`
  - `bookbub-ad-builder`
  - `pinterest-pins`
  - `tiktok-hooks`
  - `book-trailer`
  - `arc-team-builder`
  - `amazon-book-database`
  - `sales-estimator-bsr`
  - `keyword-explorer-amazon`
  - `reverse-asin`
  - `niche-scorecard`
  - `back-catalog-funnel`
  - `bundles-boxsets`

- Mettre les compteurs au clair :

```ts
V3_AGENT_COUNT = 22
V4_AGENT_COUNT = 30
```

Ici, `V4_AGENT_COUNT` signifie **30 agents exclusifs dans l’onglet V4**, pas 22+30.

---

## 2. Rendre les onglets plus lisibles dans le Parcours

### `src/components/admin/EditionWorkflow.tsx`

- Corriger les libellés d’onglets :

```text
[V3 · 197€ · 22 agents]
[V4 · 347€ · 30 agents]
```

- Supprimer le libellé confus du type `+14 bonus`.
- Ajouter un **badge visible sur chaque agent** :
  - `V3 · 197€` pour les agents du plan 197€.
  - `V4 · 347€` pour les agents du plan 347€.
- Garder la progression calculée par onglet :
  - V3 : progression sur 22 agents.
  - V4 : progression sur 30 agents.
- Garder le cadenas et le bandeau d’upsell sur l’onglet V4 si la personne n’a pas accès à la V4.

---

## 3. Réparer le tableau mots / chapitres

Le code actuel ne lit que quelques anciennes clés (`P20`, `P10`, `P4`, `P3`). Si le manuscrit est stocké ailleurs dans `ebook_workflow_results`, le tableau reste vide.

### Nouvelle logique

Dans `EditionWorkflow.tsx`, remplacer la lecture trop limitée par une lecture plus robuste :

1. Lire tout `ebook_workflow_results`.
2. Parcourir toutes les entrées qui contiennent du texte exploitable :
   - `displayContent`
   - `content`
   - `result`
   - `text`
   - `manuscript`
   - objets ou tableaux contenant des chapitres.
3. Prioriser les contenus longs de rédaction/manuscrit.
4. Utiliser `parseManuscript` + `countWords` pour découper le texte et compter les mots.
5. Si aucun chapitre explicite n’est détecté, utiliser la structure de la fiche livre (`numberOfChapters`) pour afficher des lignes de chapitre à compléter plutôt qu’un bloc vide.

---

## 4. Ajouter un endroit visible pour le nombre de mots par chapitre

Dans la section **Structure du livre**, ajouter au-dessus du tableau :

```text
Objectif mots / chapitre : [ 2500 ] mots
```

- Champ numérique modifiable.
- Valeur par défaut : **2500 mots**.
- Sauvegarde en localStorage.
- Les mini-barres du tableau utilisent cette cible au lieu d’une valeur fixe codée en dur.

Dans chaque ligne de chapitre, afficher :

```text
Chapitre 1 | Titre | 1 840 mots | barre vers objectif 2 500
```

Si les mots sont absents :

```text
Chapitre 1 | Titre prévu | 0 mot | à rédiger
```

---

## 5. Améliorer l’état vide du tableau

Au lieu du simple message actuel, afficher un tableau préparé à partir de la fiche livre :

- Si `numberOfChapters = 8`, afficher 8 lignes vides :

```text
Chapitre 1 | À rédiger | 0 mot
Chapitre 2 | À rédiger | 0 mot
...
```

- Dès qu’un manuscrit est généré ou collé dans les résultats, les lignes se remplissent automatiquement.
- Les événements existants restent utilisés :
  - `ebook_workflow_results_updated`
  - `storage`

---

## 6. Mettre les libellés commerciaux en cohérence

### `src/data/v3Launch.ts`

- Remplacer :

```text
V4 — Maison d'Édition (36 agents)
```

par :

```text
V4 — Maison d'Édition (30 agents)
```

Aucun prix ne change.

---

## Hors périmètre

- Pas de changement de prix.
- Pas de nouveau moteur IA.
- Pas de modification paiement.
- Pas de changement des clés Gemini/OpenRouter déjà restaurées.
- Pas de fausses données : les agents V4 ajoutés ouvrent des modules existants.